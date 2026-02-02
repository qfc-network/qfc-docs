# Wallet

The `QfcWallet` extends ethers.js `Wallet` with QFC staking operations.

## Creating a Wallet

### From Private Key

```typescript
import { QfcWallet, QfcProvider, NETWORKS } from '@qfc/sdk';

const provider = new QfcProvider(NETWORKS.testnet.rpcUrl);
const wallet = new QfcWallet(privateKey, provider);

console.log('Address:', wallet.address);
```

### From Mnemonic

```typescript
const wallet = QfcWallet.fromMnemonic(
  'word1 word2 word3 ... word12',
  provider
);
```

### Create Random Wallet

```typescript
const { wallet, mnemonic } = QfcWallet.createRandomWithMnemonic(provider);

console.log('Address:', wallet.address);
console.log('Mnemonic:', mnemonic);
// ⚠️ Store mnemonic securely!
```

### Using Factory Function

```typescript
import { createWallet } from '@qfc/sdk';

// Random wallet
const { wallet, mnemonic } = createWallet('random', provider);

// From mnemonic
const wallet2 = createWallet('word1 word2 ...', provider);

// From private key
const wallet3 = createWallet('0xprivatekey...', provider);
```

## Standard Operations

### Check Balance

```typescript
const balance = await wallet.getBalance();
console.log('Balance:', formatQfc(balance));
```

### Send Transaction

```typescript
import { parseQfc } from '@qfc/sdk';

const tx = await wallet.sendTransaction({
  to: '0xRecipient...',
  value: parseQfc('10'), // 10 QFC
});

console.log('Tx Hash:', tx.hash);

// Wait for confirmation
const receipt = await tx.wait();
console.log('Confirmed in block:', receipt.blockNumber);
console.log('Gas used:', receipt.gasUsed);
```

### Sign Message

```typescript
const message = 'Hello, QFC!';
const signature = await wallet.signMessage(message);
console.log('Signature:', signature);
```

### Sign Typed Data (EIP-712)

```typescript
const domain = {
  name: 'MyApp',
  version: '1',
  chainId: 9000,
  verifyingContract: '0x...'
};

const types = {
  Order: [
    { name: 'maker', type: 'address' },
    { name: 'amount', type: 'uint256' }
  ]
};

const value = {
  maker: wallet.address,
  amount: parseQfc('100')
};

const signature = await wallet.signTypedData(domain, types, value);
```

## Staking Operations

### Stake QFC

```typescript
import { parseQfc, MIN_STAKE } from '@qfc/sdk';

// Minimum stake is 10,000 QFC
const amount = parseQfc('10000');

const tx = await wallet.stake(amount);
await tx.wait();

console.log('Staked successfully!');
```

### Unstake QFC

```typescript
// Start unstaking (7-day waiting period)
const tx = await wallet.unstake(parseQfc('5000'));
await tx.wait();

// Check when unstaking completes
const info = await wallet.getStakeInfo();
if (info.unstakingCompletesAt > 0n) {
  const date = new Date(Number(info.unstakingCompletesAt) * 1000);
  console.log('Unstaking completes at:', date);
}
```

### Claim Rewards

```typescript
// Check pending rewards
const info = await wallet.getStakeInfo();
console.log('Pending rewards:', formatQfc(info.pendingRewards));

// Claim
const tx = await wallet.claimRewards();
await tx.wait();
```

### Get Stake Info

```typescript
const info = await wallet.getStakeInfo();

console.log('Staked:', formatQfc(info.stakedAmount));
console.log('Unstaking:', formatQfc(info.unstakingAmount));
console.log('Pending Rewards:', formatQfc(info.pendingRewards));
```

## Delegation

### Delegate to Validator

```typescript
import { MIN_DELEGATION } from '@qfc/sdk';

// Minimum delegation is 100 QFC
const tx = await wallet.delegate(
  '0xValidatorAddress...',
  parseQfc('1000')
);
await tx.wait();
```

### Undelegate from Validator

```typescript
const tx = await wallet.undelegate(
  '0xValidatorAddress...',
  parseQfc('500')
);
await tx.wait();
```

### Get Delegation Info

```typescript
const delegation = await wallet.getDelegation('0xValidatorAddress...');

console.log('Delegated:', formatQfc(delegation.amount));
console.log('Pending Rewards:', formatQfc(delegation.pendingRewards));
```

## Validator Operations

### Register as Validator

```typescript
const tx = await wallet.registerValidator(
  10,                    // 10% commission
  'MyValidator',         // moniker
  parseQfc('10000')      // initial stake
);
await tx.wait();
```

### Update Validator Settings

```typescript
const tx = await wallet.updateValidator(
  5,                     // new 5% commission
  'NewMoniker'           // new moniker
);
await tx.wait();
```

### Exit as Validator

```typescript
const tx = await wallet.exitValidator();
await tx.wait();
```

## Connecting to Different Providers

```typescript
// Create wallet without provider
const wallet = new QfcWallet(privateKey);

// Connect to provider later
const connectedWallet = wallet.connect(provider);

// Connect to different network
const mainnetWallet = wallet.connect(mainnetProvider);
```

## Transaction Overrides

All transaction methods accept optional overrides:

```typescript
const tx = await wallet.stake(parseQfc('1000'), {
  gasLimit: 200000n,
  maxFeePerGas: parseGwei('50'),
  maxPriorityFeePerGas: parseGwei('2'),
  nonce: 42
});
```

## Security Best Practices

1. **Never expose private keys** in client-side code
2. **Store mnemonics securely** - encrypted storage or hardware wallet
3. **Validate addresses** before sending transactions
4. **Start with testnet** before mainnet

```typescript
import { isValidAddress } from '@qfc/sdk';

const recipient = '0x...';
if (!isValidAddress(recipient)) {
  throw new Error('Invalid address');
}
```

## Next Steps

- [Staking](/sdk/javascript/staking) - High-level staking API
- [Contracts](/sdk/javascript/contracts) - Contract interactions
- [Validators](/validators/staking) - Become a validator
