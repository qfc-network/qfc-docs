# Bridge Assets Between Ethereum and QFC

This tutorial walks you through bridging assets between Ethereum and QFC using the JavaScript SDK.

## Prerequisites

- Node.js 18+
- An Ethereum wallet with ETH (for gas fees)
- Some testnet ETH on Sepolia (get from a [Sepolia faucet](https://sepoliafaucet.com))
- `@qfc/sdk` installed

## Setup

```bash
npm install @qfc/sdk ethers
```

```typescript
import { QfcProvider, QfcBridge, NETWORKS } from '@qfc/sdk';
import { ethers } from 'ethers';

// QFC provider
const qfcProvider = new QfcProvider(NETWORKS.testnet.rpcUrl);

// Ethereum provider (Sepolia testnet)
const ethProvider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');

// Your wallet (use environment variables in production)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, ethProvider);

// Bridge client
const bridge = new QfcBridge({
  qfcProvider,
  ethProvider,
  signer: wallet
});
```

## Step 1: Check Bridge Status

Before bridging, verify the bridge is active and check supported tokens:

```typescript
const status = await qfcProvider.getBridgeStatus();

console.log('Bridge active:', status.active);
console.log('Supported tokens:', status.supportedTokens.map(t => t.symbol));
console.log('Validator set:', status.validatorCount, 'validators');
console.log('Signature threshold:', status.threshold);
```

## Step 2: Deposit ETH from Ethereum to QFC

Depositing locks your ETH on Ethereum and mints wrapped ETH (wETH) on QFC.

```typescript
async function depositETH(amount: string, recipientOnQfc: string) {
  // 1. Approve and send deposit to the bridge contract on Ethereum
  const tx = await bridge.deposit({
    token: 'ETH',
    amount: ethers.parseEther(amount),
    recipient: recipientOnQfc
  });

  console.log('Deposit submitted:', tx.hash);
  console.log('Waiting for Ethereum confirmation...');

  // 2. Wait for the Ethereum transaction to be mined
  const receipt = await tx.wait();
  console.log('Ethereum tx confirmed in block:', receipt.blockNumber);

  // 3. Get the deposit ID from the event logs
  const depositId = bridge.parseDepositId(receipt);
  console.log('Deposit ID:', depositId);

  return depositId;
}

const depositId = await depositETH('0.5', '0xYourQfcAddress...');
```

## Step 3: Track Deposit Status

Monitor your deposit as it progresses through the lifecycle:

```typescript
async function waitForDeposit(depositId: string) {
  console.log('Tracking deposit:', depositId);

  while (true) {
    const deposit = await qfcProvider.getBridgeDeposit(depositId);

    console.log(`Status: ${deposit.status}`);
    console.log(`Confirmations: ${deposit.confirmations}/${deposit.requiredConfirmations}`);
    console.log(`Signatures: ${deposit.signatures}/${deposit.requiredSignatures}`);

    if (deposit.status === 'Completed') {
      console.log('Deposit completed! QFC tx:', deposit.qfcTxHash);
      return deposit;
    }

    if (deposit.status === 'Pending') {
      console.log('Waiting for Ethereum block confirmations...');
    } else if (deposit.status === 'Confirmed') {
      console.log('Waiting for validator signatures...');
    }

    // Poll every 30 seconds
    await new Promise(resolve => setTimeout(resolve, 30_000));
  }
}

await waitForDeposit(depositId);
```

:::tip
For production applications, use the [WebSocket API](/api-reference/websocket) instead of polling to receive real-time deposit status updates.
:::

## Step 4: Withdraw from QFC to Ethereum

Withdrawing burns your wrapped tokens on QFC and releases the original tokens on Ethereum.

```typescript
async function withdrawETH(amount: string, recipientOnEthereum: string) {
  // 1. Burn wrapped ETH on QFC
  const tx = await bridge.withdraw({
    token: 'ETH',
    amount: ethers.parseEther(amount),
    recipient: recipientOnEthereum
  });

  console.log('Withdrawal submitted:', tx.hash);

  // 2. Wait for QFC confirmation
  const receipt = await tx.wait();
  const withdrawalId = bridge.parseWithdrawalId(receipt);
  console.log('Withdrawal ID:', withdrawalId);

  // 3. Wait for validator signatures
  console.log('Waiting for validator signatures...');
  const withdrawal = await bridge.waitForWithdrawal(withdrawalId);

  // 4. Claim on Ethereum (submit the signed withdrawal proof)
  console.log('Claiming on Ethereum...');
  const claimTx = await bridge.claimWithdrawal(withdrawalId);
  await claimTx.wait();

  console.log('Withdrawal complete! Ethereum tx:', claimTx.hash);
  return claimTx.hash;
}

await withdrawETH('0.25', '0xYourEthereumAddress...');
```

## Step 5: Bridge ERC-20 Tokens

Bridging ERC-20 tokens (e.g., USDC) requires an approval step:

```typescript
async function depositERC20(
  tokenSymbol: string,
  amount: bigint,
  recipientOnQfc: string
) {
  // 1. Get token contract address from bridge status
  const status = await qfcProvider.getBridgeStatus();
  const token = status.supportedTokens.find(t => t.symbol === tokenSymbol);
  if (!token) throw new Error(`Token ${tokenSymbol} not supported`);

  // 2. Approve the bridge contract to spend your tokens
  const approveTx = await bridge.approveToken(token.ethereumAddress, amount);
  await approveTx.wait();
  console.log('Token approved');

  // 3. Submit the deposit
  const tx = await bridge.deposit({
    token: tokenSymbol,
    amount,
    recipient: recipientOnQfc
  });

  console.log('ERC-20 deposit submitted:', tx.hash);
  const receipt = await tx.wait();
  return bridge.parseDepositId(receipt);
}

// Deposit 100 USDC (6 decimals)
const depositId = await depositERC20('USDC', 100_000_000n, '0xYourQfcAddress...');
```

## Step 6: List Your Bridge History

```typescript
// List all your deposits
const deposits = await qfcProvider.listBridgeDeposits({
  address: '0xYourAddress...',
  limit: 20
});

console.log(`Found ${deposits.total} deposits:`);
for (const d of deposits.deposits) {
  console.log(`  ${d.token} ${d.amount} - ${d.status}`);
}

// List all your withdrawals
const withdrawals = await qfcProvider.listBridgeWithdrawals({
  address: '0xYourAddress...',
  limit: 20
});

console.log(`Found ${withdrawals.total} withdrawals:`);
for (const w of withdrawals.withdrawals) {
  console.log(`  ${w.token} ${w.amount} - ${w.status}`);
}
```

## Confirmation Times

| Direction | Estimated Time | Details |
|-----------|---------------|---------|
| Ethereum → QFC | ~15 minutes | 64 Ethereum block confirmations + validator signatures |
| QFC → Ethereum | ~20 minutes | QFC finality + validator signatures + Ethereum tx |

:::warning
Bridge transfers are not instant. Always check the deposit or withdrawal status before assuming funds are available. Never send more than you intend to bridge.
:::

## Next Steps

- [Bridge API Reference](/api-reference/bridge) - Full RPC method documentation
- [Bridge Architecture](/core-concepts/bridge) - How the bridge works under the hood
- [JavaScript SDK](/sdk/javascript/overview) - Full SDK documentation
