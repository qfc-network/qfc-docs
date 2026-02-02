# Provider

The `QfcProvider` extends ethers.js `JsonRpcProvider` with QFC-specific methods.

## Basic Usage

```typescript
import { QfcProvider, NETWORKS } from '@qfc/sdk';

// From network config
const provider = new QfcProvider(NETWORKS.testnet.rpcUrl);

// From URL string
const provider2 = new QfcProvider('https://rpc.testnet.qfc.network');

// With explicit chain ID
const provider3 = new QfcProvider('https://rpc.testnet.qfc.network', 9000);
```

## Standard Ethereum Methods

All standard ethers.js provider methods are available:

```typescript
// Get block number
const blockNumber = await provider.getBlockNumber();

// Get balance
const balance = await provider.getBalance('0x...');

// Get transaction
const tx = await provider.getTransaction('0xhash...');

// Get transaction receipt
const receipt = await provider.getTransactionReceipt('0xhash...');

// Get block
const block = await provider.getBlock('latest');
const blockWithTxs = await provider.getBlock('latest', true);

// Get code (for contracts)
const code = await provider.getCode('0xcontract...');

// Get nonce
const nonce = await provider.getTransactionCount('0x...');

// Estimate gas
const gasEstimate = await provider.estimateGas({
  to: '0x...',
  value: parseQfc('1')
});

// Get fee data
const feeData = await provider.getFeeData();
console.log('Gas price:', feeData.gasPrice);
```

## QFC-Specific Methods

### getValidators

Get list of active validators:

```typescript
const validators = await provider.getValidators();

for (const v of validators) {
  console.log('Address:', v.address);
  console.log('Stake:', formatQfc(v.totalStake));
  console.log('Score:', v.contributionScore);
  console.log('Uptime:', v.uptime + '%');
}
```

### getValidator

Get detailed validator information:

```typescript
const validator = await provider.getValidator('0xvalidator...');

if (validator) {
  console.log('Address:', validator.address);
  console.log('Self Stake:', formatQfc(validator.selfStake));
  console.log('Delegated:', formatQfc(validator.delegatedStake));
  console.log('Commission:', validator.commission + '%');
  console.log('Status:', validator.status);
  console.log('Blocks Produced:', validator.blocksProduced);
}
```

### getContributionScore

Get contribution score for an address:

```typescript
const score = await provider.getContributionScore('0xvalidator...');
console.log('Contribution Score:', score); // 0-1
```

### getEpoch

Get current epoch information:

```typescript
const epoch = await provider.getEpoch();

console.log('Epoch Number:', epoch.number);
console.log('Start Time:', new Date(Number(epoch.startTime) * 1000));
console.log('Duration:', epoch.durationMs + 'ms');
console.log('Current Slot:', epoch.slot);
```

### getNetworkStats

Get network statistics:

```typescript
const stats = await provider.getNetworkStats();

console.log('Latest Block:', stats.latestBlock);
console.log('Avg Block Time:', stats.avgBlockTimeMs + 'ms');
console.log('TPS:', stats.tps);
console.log('Active Addresses:', stats.activeAddresses);
console.log('Total Validators:', stats.totalValidators);
console.log('Active Validators:', stats.activeValidators);
console.log('Total Staked:', formatQfc(stats.totalStaked));
```

### getValidatorSet

Get validator set for a specific epoch:

```typescript
// Current epoch
const currentSet = await provider.getValidatorSet();

// Specific epoch
const epoch10Set = await provider.getValidatorSet(10n);

console.log('Epoch:', epoch10Set.epoch);
console.log('Validators:', epoch10Set.validators.length);
console.log('Total Stake:', formatQfc(epoch10Set.totalStake));
```

### getNodeInfo

Get node information:

```typescript
const nodeInfo = await provider.getNodeInfo();

console.log('Version:', nodeInfo.version);
console.log('Chain ID:', nodeInfo.chainId);
console.log('Peer Count:', nodeInfo.peerCount);
console.log('Is Validator:', nodeInfo.isValidator);
console.log('Syncing:', nodeInfo.syncStatus.syncing);
```

### getPendingTransactions

Get pending transactions in the mempool:

```typescript
const pendingTxs = await provider.getPendingTransactions();
console.log('Pending transactions:', pendingTxs.length);
```

## Enhanced Methods

### getBlockWithTransactions

Get a block with full transaction objects:

```typescript
const block = await provider.getBlockWithTransactions('latest');

console.log('Block:', block.number);
console.log('Producer:', block.producer);
console.log('Transactions:', block.transactions.length);

for (const tx of block.transactions) {
  console.log('  ', tx.hash, tx.from, '->', tx.to);
}
```

### waitForTransactionWithTimeout

Wait for transaction with custom timeout:

```typescript
const receipt = await provider.waitForTransactionWithTimeout(
  '0xhash...',
  1,      // confirmations
  60000   // timeout in ms
);
```

## WebSocket Provider

For real-time subscriptions, use `QfcWebSocketProvider`:

```typescript
import { QfcWebSocketProvider, NETWORKS } from '@qfc/sdk';

const wsProvider = new QfcWebSocketProvider(NETWORKS.testnet.wsUrl);

// Subscribe to new blocks
const blockSub = await wsProvider.subscribeNewHeads((block) => {
  console.log('New block:', block.number);
});

// Subscribe to pending transactions
const txSub = await wsProvider.subscribePendingTransactions((hash) => {
  console.log('Pending tx:', hash);
});

// Subscribe to logs
const logSub = await wsProvider.subscribeLogs(
  { address: '0xcontract...' },
  (log) => console.log('Event:', log)
);

// Unsubscribe
await blockSub.unsubscribe();

// Unsubscribe all
await wsProvider.unsubscribeAll();

// Clean up
await wsProvider.destroy();
```

## Factory Function

Create a provider using the factory function:

```typescript
import { createProvider, NETWORKS } from '@qfc/sdk';

// From URL
const provider = createProvider('https://rpc.testnet.qfc.network');

// From network config
const provider2 = createProvider(NETWORKS.testnet);

// From network name
const provider3 = createProvider('testnet');
```

## Next Steps

- [Wallet](/sdk/javascript/wallet) - Transaction signing
- [Staking](/sdk/javascript/staking) - Staking queries
- [API Reference](/api-reference/json-rpc) - Full RPC documentation
