import { ChainTypes } from '@rarimo/provider'
import { BridgeChain } from '@/types'
import { ChainNames } from '@/enums'

const EVM_CHAIN_IDS = {
  [ChainNames.Ethereum]: 1,
  [ChainNames.Polygon]: 137,
  [ChainNames.Fuji]: 43113,
  [ChainNames.Avalanche]: 43114,
  [ChainNames.Goerli]: 5,
  [ChainNames.Mumbai]: 80001,
}

const EVM_CHAINS: BridgeChain[] = [
  {
    id: EVM_CHAIN_IDS[ChainNames.Ethereum],
    name: ChainNames.Ethereum,
    rpcUrl: 'https://mainnet.infura.io/v3/',
    symbol: 'ETH',
    type: ChainTypes.EVM,
    icon: 'https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_ethereum.jpg&w=32&q=75',
    contractAddress: '0x7ce68BDE528A2623198aF3756B073FAb376b9fe2',
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.Polygon],
    name: ChainNames.Polygon,
    rpcUrl: 'https://polygon-mainnet.infura.io/v3/',
    symbol: 'MATIC',
    type: ChainTypes.EVM,
    icon: 'https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_polygon.jpg&w=32&q=75',
    contractAddress: '0x7ce68BDE528A2623198aF3756B073FAb376b9fe21',
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.Avalanche],
    name: ChainNames.Avalanche,
    rpcUrl: 'https://avalanche-mainnet.infura.io/v3/',
    symbol: 'AVAX',
    type: ChainTypes.EVM,
    icon: 'https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_avalanche.jpg&w=64&q=75',
    contractAddress: '0x7ce68BDE528A2623198aF3756B073FAb376b9fe21',
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.Goerli],
    name: 'Görli',
    rpcUrl: 'https://goerli.infura.io/v3/',
    symbol: 'ETH',
    type: ChainTypes.EVM,
    icon: 'https://chainlist.org/_next/image?url=%2Funknown-logo.png&w=64&q=75',
    contractAddress: '0x7ce68BDE528A2623198aF3756B073FAb376b9fe21s',
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.Fuji],
    name: ChainNames.Fuji,
    rpcUrl: 'https://avalanche-fuji.infura.io/v3/',
    symbol: 'AVAX',
    type: ChainTypes.EVM,
    icon: 'https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_avalanche.jpg&w=64&q=75',
    contractAddress: '0x7ce68BDE528A2623198aF3756B073FAb376b9fe21',
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.Mumbai],
    name: ChainNames.Mumbai,
    rpcUrl: 'https://polygon-mumbai.infura.io/v3/',
    symbol: 'MATIC',
    type: ChainTypes.EVM,
    icon: 'https://chainlist.org/_next/image?url=%2Funknown-logo.png&w=64&q=75',
    contractAddress: '0x7ce68BDE528A2623198aF3756B073FAb376b9fe21',
  },
]

export const CHAINS: Readonly<{ [key in ChainTypes]?: BridgeChain[] }> = {
  [ChainTypes.EVM]: EVM_CHAINS,
}

export const CHAIN_IDS = {
  [ChainTypes.EVM]: EVM_CHAIN_IDS,
}
