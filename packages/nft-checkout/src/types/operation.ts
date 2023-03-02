import {
  Chain,
  ChainId,
  IProvider,
  TransactionResponse,
} from '@rarimo/provider'
import { OperationSubscriber } from './operation-event-bus'
import { Address, BridgeChain, HexString, TokenSymbol } from './common'
import { Config } from './config'
import { EstimatedPrice } from './token'
import { Price, Token, PaymentToken } from '../entities'

export type Target = {
  chainId: ChainId
  address: Address
  recipient: Address
  price: Price
  swapTargetTokenSymbol: TokenSymbol // WETH, USDT, etc
  slippage?: number // 0.5, 1, 5, 10 etc
}

export type TxBundle = {
  bundle: HexString
  salt?: HexString
}

export interface INFTCheckoutOperationConstructor {
  new (config: Config, provider: IProvider): INFTCheckoutOperation
}

export type OperationCreateParams = { chainIdFrom: ChainId; target: Target }

export interface INFTCheckoutOperation extends OperationSubscriber {
  chainFrom: Chain | undefined
  provider: IProvider
  isInitialized: boolean

  init(args: OperationCreateParams): Promise<void>

  supportedChains(): Promise<BridgeChain[]>
  supportedTokens(): Promise<Token[]>

  loadPaymentTokens(chain: BridgeChain): Promise<PaymentToken[]>
  estimatePrice(token: PaymentToken): Promise<EstimatedPrice>
  checkout(e: EstimatedPrice, bundle: TxBundle): Promise<TransactionResponse>
}
