# JavaScript SDK Overview

The `@qfc/sdk` package provides a complete TypeScript SDK for interacting with the QFC blockchain.

## Features

- **QfcProvider** - JSON-RPC provider with QFC-specific methods
- **QfcWallet** - Wallet with staking operations
- **StakingClient** - High-level staking API
- **Contract Helpers** - ERC-20, ERC-721, ERC-1155 utilities
- **Type Safety** - Full TypeScript support with strict types
- **ethers.js v6** - Built on top of ethers.js for compatibility

## Installation

```bash
npm install @qfc/sdk
```

## Quick Example

```typescript
import {
  QfcProvider,
  QfcWallet,
  StakingClient,
  parseQfc,
  formatQfc,
  NETWORKS
} from '@qfc/sdk';

// Connect to testnet
const provider = new QfcProvider(NETWORKS.testnet.rpcUrl);

// Create wallet
const wallet = new QfcWallet(privateKey, provider);

// Check balance
const balance = await provider.getBalance(wallet.address);
console.log('Balance:', formatQfc(balance), 'QFC');

// Send transaction
const tx = await wallet.sendTransaction({
  to: '0x...',
  value: parseQfc('10')
});

// Stake tokens
await wallet.stake(parseQfc('1000'));

// Get validators
const validators = await provider.getValidators();
```

## Module Structure

```
@qfc/sdk
├── Provider
│   ├── QfcProvider        # JSON-RPC provider
│   └── QfcWebSocketProvider # WebSocket subscriptions
├── Wallet
│   └── QfcWallet          # Wallet with staking
├── Staking
│   └── StakingClient      # Staking queries
├── Contract
│   ├── getERC20           # ERC-20 helper
│   ├── getERC721          # ERC-721 helper
│   ├── getERC1155         # ERC-1155 helper
│   └── getMulticall3      # Batch calls
├── Utils
│   ├── parseQfc / formatQfc   # Unit conversion
│   ├── isValidAddress         # Validation
│   └── shortenAddress         # Formatting
├── Constants
│   ├── NETWORKS           # Network configs
│   ├── CONTRACTS          # Known addresses
│   └── GAS_LIMITS         # Gas presets
└── Types
    └── (TypeScript definitions)
```

## Network Constants

```typescript
import { NETWORKS, getNetwork } from '@qfc/sdk';

// Access network configs
console.log(NETWORKS.testnet.rpcUrl);    // https://rpc.testnet.qfc.network
console.log(NETWORKS.testnet.chainId);   // 9000
console.log(NETWORKS.testnet.explorerUrl); // https://explorer.testnet.qfc.network

// Get by name
const network = getNetwork('testnet');
```

## Error Handling

```typescript
import { QfcError, SDK_ERRORS } from '@qfc/sdk';

try {
  await wallet.stake(parseQfc('100'));
} catch (error) {
  if (error instanceof QfcError) {
    console.log('Error code:', error.code);
    console.log('Message:', error.message);

    if (error.code === SDK_ERRORS.STAKE_TOO_LOW) {
      console.log('Stake amount is below minimum');
    }
  }
}
```

## TypeScript Support

The SDK is written in TypeScript and exports all types:

```typescript
import type {
  Block,
  Transaction,
  TransactionReceipt,
  Validator,
  ValidatorSummary,
  StakeInfo,
  Delegation,
  NetworkConfig,
  EpochInfo,
} from '@qfc/sdk';
```

## Compatibility

The SDK is built on [ethers.js v6](https://docs.ethers.org/v6/) and extends its classes:

- `QfcProvider` extends `ethers.JsonRpcProvider`
- `QfcWallet` extends `ethers.Wallet`
- `QfcWebSocketProvider` extends `ethers.WebSocketProvider`

This means you can use all ethers.js methods plus QFC-specific ones.

## Next Steps

- [Provider](/sdk/javascript/provider) - RPC methods and network info
- [Wallet](/sdk/javascript/wallet) - Transaction signing and staking
- [Contracts](/sdk/javascript/contracts) - Contract interactions
- [Utilities](/sdk/javascript/utilities) - Helper functions
