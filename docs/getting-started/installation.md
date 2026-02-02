# Installation

This guide covers installing the QFC SDK and related tools.

## JavaScript/TypeScript SDK

### Requirements

- Node.js 18.0 or higher
- npm, yarn, pnpm, or bun

### Install via Package Manager

::: code-group

```bash [npm]
npm install @qfc/sdk
```

```bash [yarn]
yarn add @qfc/sdk
```

```bash [pnpm]
pnpm add @qfc/sdk
```

```bash [bun]
bun add @qfc/sdk
```

:::

### TypeScript Configuration

The SDK includes TypeScript definitions. No additional configuration is required.

```json
// tsconfig.json (recommended settings)
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true
  }
}
```

### Verify Installation

```typescript
import { QfcProvider, NETWORKS } from '@qfc/sdk';

const provider = new QfcProvider(NETWORKS.testnet.rpcUrl);
const blockNumber = await provider.getBlockNumber();
console.log('Connected! Block number:', blockNumber);
```

## Browser Extension Wallet

### Chrome/Brave/Edge

1. Visit the [Chrome Web Store](https://chrome.google.com/webstore)
2. Search for "QFC Wallet"
3. Click "Add to Chrome"

### Firefox

1. Visit [Firefox Add-ons](https://addons.mozilla.org)
2. Search for "QFC Wallet"
3. Click "Add to Firefox"

## CLI Tools

### Install qfc-cli

```bash
npm install -g qfc-cli
```

### Verify Installation

```bash
qfc --version
qfc chain-info
```

## Development Tools

### Hardhat

```bash
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers
```

Configure `hardhat.config.js`:

```javascript
module.exports = {
  solidity: "0.8.20",
  networks: {
    qfc_testnet: {
      url: "https://rpc.testnet.qfc.network",
      chainId: 9000,
      accounts: [process.env.PRIVATE_KEY]
    },
    qfc_mainnet: {
      url: "https://rpc.qfc.network",
      chainId: 9001,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

### Foundry

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Configure for QFC
forge create --rpc-url https://rpc.testnet.qfc.network \
  --private-key $PRIVATE_KEY \
  src/MyContract.sol:MyContract
```

## Network Configuration

### Testnet

| Parameter | Value |
|-----------|-------|
| Network Name | QFC Testnet |
| RPC URL | `https://rpc.testnet.qfc.network` |
| Chain ID | 9000 |
| Currency Symbol | QFC |
| Block Explorer | `https://explorer.testnet.qfc.network` |

### Mainnet

| Parameter | Value |
|-----------|-------|
| Network Name | QFC Mainnet |
| RPC URL | `https://rpc.qfc.network` |
| Chain ID | 9001 |
| Currency Symbol | QFC |
| Block Explorer | `https://explorer.qfc.network` |

### Add to MetaMask

1. Open MetaMask
2. Click network selector → "Add Network"
3. Enter the network details above
4. Click "Save"

Or use the SDK:

```typescript
import { NETWORKS } from '@qfc/sdk';

// Request network addition
await window.ethereum.request({
  method: 'wallet_addEthereumChain',
  params: [{
    chainId: NETWORKS.testnet.chainIdHex,
    chainName: NETWORKS.testnet.name,
    rpcUrls: [NETWORKS.testnet.rpcUrl],
    nativeCurrency: {
      name: 'QFC',
      symbol: 'QFC',
      decimals: 18
    },
    blockExplorerUrls: [NETWORKS.testnet.explorerUrl]
  }]
});
```

## Troubleshooting

### Connection Issues

If you can't connect to the RPC:

1. Check your internet connection
2. Verify the RPC URL is correct
3. Try using a different RPC endpoint
4. Check if there's a firewall blocking the connection

### Transaction Failures

If transactions fail:

1. Ensure you have enough QFC for gas
2. Check the nonce is correct
3. Increase gas limit if needed
4. Verify contract addresses are correct

### SDK Import Errors

If you get import errors:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- [Quick Start](/getting-started/quick-start) - Your first transaction
- [SDK Overview](/sdk/javascript/overview) - Explore the SDK
- [API Reference](/api-reference/json-rpc) - Full API documentation
