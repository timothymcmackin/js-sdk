import type { IProvider, TransactionResponse } from '@rarimo/provider'
import type { BridgeChain, ChainTypes, HexString, Raw } from '@rarimo/shared'
import type { Amount, Computed, Ref } from '@rarimo/shared'

import type { DestinationTransaction, InternalToken } from '@/types'
import type { Token } from '@/types'

export type Bridger = Raw<{
  provider: Ref<IProvider>
  chains: Computed<BridgeChain[]>
  chainType: ChainTypes
  isInitialized: Ref<boolean>

  init(): Promise<void>

  /**
   * Get the chains that are supported for the bridging
   *
   * @returns A list of supported chains and information about them
   */
  loadSupportedChains(): Promise<BridgeChain[]>

  /**
   * Get the destination chain transaction hash as the result of the bridging
   *
   * @returns Destination transaction hash and transaction status
   */
  getDestinationTx(
    sourceChain: BridgeChain,
    sourceTxHash: string,
  ): Promise<DestinationTransaction>

  /**
   * Checks if the allowance is less than the provided amount or doesn't exist
   *
   * @returns true if the allowance is less than the provided amount or doesn't exist
   */
  isApproveRequired(
    token: Token,
    operator: HexString,
    amount?: Amount,
  ): Promise<boolean>

  /**
   * Sets allowance for the provided operator address to spend the token
   *
   * @returns A Transaction Response or undefined if input token is native
   */
  approve(
    token: Token,
    operator: HexString,
  ): Promise<TransactionResponse | undefined>

  /**
   * Sets allowance for the provided operator address to spend the token if
   * allowance amount is less than provided one
   *
   * @returns A Transaction Response or undefined if input token is native or allowance is enough
   */
  approveIfNeeded(
    token: Token,
    operator: HexString,
    amount?: Amount,
  ): Promise<TransactionResponse | undefined>

  /**
   * @returns Rarimo backend token mapping for the provided token symbol
   */
  getInternalTokenMapping(
    targetTokenSymbol: string,
  ): Promise<InternalToken | undefined>
}>

export type BridgerCreateFn = (p: IProvider) => Bridger
