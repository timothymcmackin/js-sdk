import {
  BridgeChain,
  Config,
  EstimatedPrice,
  INFTCheckoutOperation,
  OperationCreateParams,
  Target,
  TxBundle,
} from '../../types'
import {
  ChainId,
  ChainTypes,
  errors as providerErrors,
  IProvider,
  TransactionResponse,
} from '@rarimo/provider'
import {
  Estimator,
  getPaymentTokens,
  getSwapAmount,
  loadTokens,
} from './helpers'
import {
  BUNDLE_SALT_BYTES,
  CHAINS,
  ERC20_ABI,
  NATIVE_TOKEN_WRAP_SLIPPAGE_MULTIPLIER,
  SWAP_CONTRACT_ABIS,
} from '../../const'
import { errors } from '../../errors'

import { Contract, utils } from 'ethers'
import { BN } from '@distributedlab/utils'
import { OperationEventBus } from '../event-bus'
import { PaymentToken, Price, Token } from '../../entities'

// We always use liquidity pool and not control those token contracts
// In case when `isWrapped: false`, bridge contract won't try to burn tokens
const IS_TOKEN_WRAPPED = false

/**
 * An operation on an EVM chain.
 *
 * @example
 * ```js
 * const provider = await createProvider(MetamaskProvider)
 * const op = createCheckoutOperation(EVMOperation, provider)
 * ```
 */
export class EVMOperation
  extends OperationEventBus
  implements INFTCheckoutOperation
{
  readonly #provider: IProvider
  readonly #config: Config

  #isInitialized = false

  #chainFrom: BridgeChain
  #target?: Target

  #chains: BridgeChain[]
  #tokens: Token[] = []

  constructor(config: Config, provider: IProvider) {
    super()
    this.#config = config
    this.#provider = provider
  }

  public get chainFrom(): BridgeChain {
    return this.#chainFrom
  }

  public get provider(): IProvider {
    return this.#provider
  }

  public get isInitialized(): boolean {
    return this.#isInitialized
  }

  public get target() {
    return this.#target
  }

  async init({ chainIdFrom, target }: OperationCreateParams): Promise<void> {
    /**
     * Initialize the operation with the source chain and transaction parameters
     * @param param0 Information about the source chain and the target transaction of the operation
     */
    if (!this.#chains.length) {
      await this.supportedChains()
    }

    const from = this.#getChainByID(chainIdFrom)
    const to = this.#getChainByID(target.chainId)

    if (!from || !to) {
      throw new errors.OperationInvalidChainPairError()
    }

    this.#chainFrom = from
    this.#target = target

    if (this.#provider.chainType !== ChainTypes.EVM) {
      throw new errors.OperationInvalidProviderChainTypeError()
    }

    this.#isInitialized = true

    this.emitInitiated({
      isInitiated: this.#isInitialized,
      chainFrom: this.#chainFrom,
      target: this.#target,
    })
  }

  /**
   * Get the chains that are supported for the operation type
   *
   * @returns A list of supported chains and information about them
   */
  public async supportedChains(): Promise<BridgeChain[]> {
    // TODO: add backend integration
    this.#chains = CHAINS[ChainTypes.EVM]!

    return this.#chains
  }

  public async supportedTokens(): Promise<Token[]> {
    if (!this.isInitialized) throw new errors.OperatorNotInitializedError()

    return this.#tokens
  }

  /**
   * Load the wallet's balance of payment tokens on the specified chain.
   *
   * @param chain A chain from {@link supportedChains}
   * @returns An array of tokens and the wallet's balance of each token
   */
  public async loadPaymentTokens(chain: BridgeChain): Promise<PaymentToken[]> {
    if (!this.isInitialized) throw new errors.OperatorNotInitializedError()

    if (!this.#provider.isConnected) {
      await this.#provider.connect()
    }

    if (this.#provider.chainId != chain.id) {
      await this.#switchChain()
    }

    return getPaymentTokens(
      this.#chainFrom!,
      this.#provider,
      await this.#loadTokens(),
    )
  }

  /**
   * Get the estimated purchase price in the payment token, including the cost to swap the tokens to the tokens that the seller accepts payment in
   *
   * @param from The token to use for the transaction
   * @returns Information about the costs involved in the transaction, including the gas price
   */
  public async estimatePrice(from: PaymentToken) {
    if (!this.isInitialized) throw new errors.OperatorNotInitializedError()

    return new Estimator(
      this.#provider,
      this.#tokens,
      from,
      this.#target!,
    ).estimate()
  }

  /**
   * Send a transaction to Rarimo for processing
   *
   * @param e The estimated price of the transaction, from {@link estimatePrice}
   * @param bundle The transaction bundle
   * @returns The hash of the transaction
   */
  public async checkout(
    e: EstimatedPrice,
    bundle: TxBundle,
  ): Promise<TransactionResponse> {
    const chain = e.from.chain
    await this.#sendApproveTxIfNeeded(String(chain.contractAddress), e)

    if (!chain.contractAddress) {
      throw new errors.OperationChainNotSupportedError()
    }

    return this.#provider.signAndSendTx({
      from: this.#provider.address,
      to: chain.contractAddress,
      data: this.#encodeTxData(e, bundle),
      ...(e.from.isNative
        ? {
            value: this.#getNativeAmountIn(e.price),
          }
        : {}),
    })
  }

  #getNativeAmountIn(price: Price) {
    return new BN(
      new BN(price.toString())
        .mul(NATIVE_TOKEN_WRAP_SLIPPAGE_MULTIPLIER)
        .round(price.decimals),
    )
      .toFraction(price.decimals)
      .toString()
  }

  #getFunctionFragment(from: Token, to: Token) {
    const isV2 = !from.isUniswapV3
    const isFromNative = from.isNative
    const isToNative = to.isNative

    if (isFromNative && isToNative) {
      throw new errors.OperationInvalidTokenPairError()
    }

    if (isFromNative && isV2) {
      return 'swapExactNativeInputMultiHopThenBridge'
    }

    if (isFromNative) {
      return 'swapExactInputMultiHopThenBridge'
    }

    if (isToNative && isV2) {
      return 'swapNativeExactOutputMultiHopThenBridge'
    }

    return 'swapExactOutputMultiHopThenBridge'
  }

  #getAmounts(from: Token, to: Token, e: EstimatedPrice) {
    const isV2 = !from.isUniswapV3
    const isFromNative = from.isNative
    const isToNative = to.isNative
    const amountOutMinimum = getSwapAmount(this.#target!.price)
    const amountIn = this.#getNativeAmountIn(e.price)

    if (isFromNative && isV2) {
      return [amountOutMinimum]
    }

    if (isFromNative) {
      return [amountIn, amountOutMinimum]
    }

    if (isToNative && isV2) {
      return [amountOutMinimum, amountIn]
    }

    return [amountOutMinimum, e.price.value]
  }

  #encodeTxData(e: EstimatedPrice, bundle: TxBundle): string {
    const chain = e.from.chain
    const functionFragment = this.#getFunctionFragment(e.from, e.to)
    const receiverAddress = this.#provider.address
    const amounts = this.#getAmounts(e.from, e.to, e)

    const network = this.#chains.find(
      i => Number(i.id) === Number(this.#target?.chainId),
    )

    const bundleTuple = [
      bundle.salt || utils.hexlify(utils.randomBytes(BUNDLE_SALT_BYTES)),
      bundle.bundle,
    ]

    return new utils.Interface(
      SWAP_CONTRACT_ABIS[chain.contactVersion],
    ).encodeFunctionData(functionFragment, [
      ...amounts,
      e.path,
      receiverAddress,
      network?.name ?? '',
      IS_TOKEN_WRAPPED,
      bundleTuple,
    ])
  }

  async #sendApproveTxIfNeeded(routerAddress: string, e: EstimatedPrice) {
    if (e.from.isNative) return

    const contract = new Contract(
      e.from.address,
      ERC20_ABI,
      this.#provider?.getWeb3Provider?.(),
    )

    const allowanceRaw = await contract.allowance(
      this.#provider.address,
      routerAddress,
    )

    if (!e.price.value) {
      throw new errors.OperationEstimatedPriceNotExistError()
    }

    const allowance = new BN(allowanceRaw.toString()).fromFraction(
      e.from.decimals,
    )

    const estimationPrice = new BN(e.price.value).fromFraction(e.from.decimals)

    if (estimationPrice.compare(allowance) == -1) {
      return
    }

    const data = new utils.Interface(ERC20_ABI).encodeFunctionData('approve', [
      routerAddress,
      BN.MAX_UINT256.toString(),
    ])

    return this.#provider.signAndSendTx({
      from: this.#provider.address,
      to: e.from.address,
      data,
    })
  }

  #getChainByID(id: ChainId) {
    return this.#chains.find(chain => chain.id === id)
  }

  async #loadTokens() {
    if (!this.isInitialized) return []

    this.#tokens = await loadTokens(this.#config, this.#chainFrom)

    return this.#tokens
  }

  async #switchChain() {
    if (!this.isInitialized) throw new errors.OperatorNotInitializedError()

    try {
      await this.#provider.switchChain(this.#chainFrom!.id)
    } catch (e) {
      if (!(e instanceof providerErrors.ProviderChainNotFoundError)) {
        throw e
      }
      await this.#provider.addChain!(this.#chainFrom!)
      await this.#switchChain()
    }
  }
}
