# Quick Start

Get started with QFC in 5 minutes.

## Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or pnpm

## 1. Install the SDK

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

## 2. Connect to the Network

```typescript
import { QfcProvider, NETWORKS } from '@qfc/sdk';

// Connect to testnet
const provider = new QfcProvider(NETWORKS.testnet.rpcUrl);

// Get network info
const blockNumber = await provider.getBlockNumber();
console.log('Current block:', blockNumber);

// Get validators
const validators = await provider.getValidators();
console.log('Active validators:', validators.length);
```

## 3. Query Balances

```typescript
import { formatQfc } from '@qfc/sdk';

const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f...';
const balance = await provider.getBalance(address);

console.log('Balance:', formatQfc(balance), 'QFC');
```

## 4. Create a Wallet

```typescript
import { QfcWallet, parseQfc } from '@qfc/sdk';

// From private key
const wallet = new QfcWallet(privateKey, provider);

// Or create a new wallet
const { wallet: newWallet, mnemonic } = QfcWallet.createRandomWithMnemonic(provider);
console.log('Save this mnemonic:', mnemonic);

// Check balance
const balance = await wallet.getBalance();
```

## 5. Send a Transaction

```typescript
// Send QFC
const tx = await wallet.sendTransaction({
  to: '0xRecipientAddress...',
  value: parseQfc('10'), // 10 QFC
});

console.log('Transaction hash:', tx.hash);

// Wait for confirmation
const receipt = await tx.wait();
console.log('Confirmed in block:', receipt.blockNumber);
```

## 6. Interact with Smart Contracts

```typescript
import { getERC20 } from '@qfc/sdk';

// Get token contract
const token = await getERC20('0xTokenAddress...', provider);

console.log('Token:', token.name, token.symbol);

// Check balance
const balance = await token.balanceOf(wallet.address);
console.log('Token balance:', balance);

// Transfer (with signer)
const tokenWithSigner = await getERC20('0xTokenAddress...', wallet);
const tx = await tokenWithSigner.transfer('0xRecipient...', 1000n);
```

## 7. Stake QFC

```typescript
// Stake tokens
const stakeTx = await wallet.stake(parseQfc('1000'));
await stakeTx.wait();

// Check stake info
const stakeInfo = await wallet.getStakeInfo();
console.log('Staked:', formatQfc(stakeInfo.stakedAmount), 'QFC');
console.log('Pending rewards:', formatQfc(stakeInfo.pendingRewards), 'QFC');

// Claim rewards
const claimTx = await wallet.claimRewards();
await claimTx.wait();
```

## Get Testnet Tokens

Visit the [Testnet Faucet](https://faucet.testnet.qfc.network) to get free testnet QFC tokens.

## Next Steps

- [Installation](/getting-started/installation) - Detailed installation guide
- [JavaScript SDK](/sdk/javascript/overview) - Full SDK documentation
- [Deploy a Contract](/smart-contracts/deployment) - Deploy your first smart contract
- [Build a DApp](/tutorials/build-dapp) - Step-by-step tutorial
