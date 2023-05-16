import { ChainNames, ChainTypes, EVMDexType } from '@/enums'
import type { BridgeChain, ChainIdMap } from '@/types'

export const EVM_CHAIN_IDS: ChainIdMap = {
  [ChainNames.Ethereum]: 1,
  [ChainNames.Polygon]: 137,
  [ChainNames.Fuji]: 43113,
  [ChainNames.Avalanche]: 43114,
  [ChainNames.Goerli]: 5,
  [ChainNames.Sepolia]: 11155111,
  [ChainNames.Mumbai]: 80001,
  [ChainNames.BinanceSmartChain]: 56,
  [ChainNames.Chapel]: 97,
}

const nativeToken = {
  decimals: 18,
}

export const EVM_CHAINS: BridgeChain[] = [
  {
    id: EVM_CHAIN_IDS[ChainNames.Ethereum]!,
    name: ChainNames.Ethereum,
    rpcUrl: 'https://mainnet.infura.io/v3/',
    token: {
      symbol: 'ETH',
      name: 'Ethereum',
      ...nativeToken,
    },
    explorerUrl: 'https://etherscan.io',
    type: ChainTypes.EVM,
    icon: 'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/eth-logo.png',
    contractAddress: '',
    dexType: EVMDexType.UniswapV3,
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.Goerli]!,
    name: ChainNames.Goerli,
    rpcUrl: 'https://goerli.infura.io/v3/',
    token: {
      symbol: 'ETH',
      name: 'Goerli Ethereum',
      ...nativeToken,
    },
    explorerUrl: 'https://goerli.etherscan.io',
    type: ChainTypes.EVM,
    icon: 'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/eth-logo.png',
    contractAddress: '0x10841D7fF0AfF0e40203FC4D0778DD9946D8a91c',
    dexType: EVMDexType.UniswapV3,
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.Sepolia]!,
    name: ChainNames.Sepolia,
    rpcUrl: 'https://sepolia.infura.io/v3/',
    token: {
      symbol: 'ETH',
      name: 'Sepolia Ethereum',
      ...nativeToken,
    },
    explorerUrl: 'https://sepolia.etherscan.io',
    type: ChainTypes.EVM,
    icon: 'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/eth-logo.png',
    contractAddress: '',
    dexType: EVMDexType.UniswapV3,
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.Polygon]!,
    name: ChainNames.Polygon,
    rpcUrl: 'https://polygon-rpc.com/',
    token: {
      symbol: 'MATIC',
      name: 'Polygon Matic',
      ...nativeToken,
    },
    explorerUrl: 'https://polygonscan.com',
    type: ChainTypes.EVM,
    icon: 'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/matic-logo.png',
    contractAddress: '',
    dexType: EVMDexType.QuickSwap,
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.Mumbai]!,
    name: ChainNames.Mumbai,
    rpcUrl: 'https://rpc-mumbai.maticvigil.com/',
    token: {
      symbol: 'MATIC',
      name: 'Polygon Mumbai Matic',
      ...nativeToken,
    },
    explorerUrl: 'https://mumbai.polygonscan.com',
    type: ChainTypes.EVM,
    contractAddress: '',
    icon: 'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/matic-logo.png',
    dexType: EVMDexType.QuickSwap,
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.Avalanche]!,
    name: ChainNames.Avalanche,
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    token: {
      symbol: 'AVAX',
      name: 'Avalanche',
      ...nativeToken,
    },
    explorerUrl: 'https://snowtrace.io',
    type: ChainTypes.EVM,
    contractAddress: '',
    icon: 'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/avax-logo.png',
    dexType: EVMDexType.TraderJoe,
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.Fuji]!,
    name: ChainNames.Fuji,
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    token: {
      symbol: 'AVAX',
      name: 'Fuji Avalanche',
      ...nativeToken,
    },
    explorerUrl: 'https://testnet.snowtrace.io',
    type: ChainTypes.EVM,
    icon: 'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/avax-logo.png',
    contractAddress: '0xFE634aBe3950534B24bBA247aE04ABD9cBCAD90D',
    dexType: EVMDexType.TraderJoe,
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.BinanceSmartChain]!,
    name: ChainNames.BinanceSmartChain,
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    token: {
      symbol: 'BNB',
      name: 'Binance Coin',
      ...nativeToken,
    },
    explorerUrl: 'https://bscscan.com',
    type: ChainTypes.EVM,
    icon: 'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/bnb-logo.png',
    contractAddress: '',
    dexType: EVMDexType.PancakeSwap,
  },
  {
    id: EVM_CHAIN_IDS[ChainNames.Chapel]!,
    name: ChainNames.Chapel,
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    token: {
      symbol: 'tBNB',
      name: 'Binance Testnet Coin',
      ...nativeToken,
    },
    explorerUrl: 'https://testnet.bscscan.com',
    type: ChainTypes.EVM,
    icon: 'https://raw.githubusercontent.com/rarimo/js-sdk/main/assets/logos/bnb-logo.png',
    contractAddress: '0xd6c576B4f6Ab3d70b49FA2a1F73711943f3a14f2',
    dexType: EVMDexType.PancakeSwap,
  },
]
