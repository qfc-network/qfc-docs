# Utilities

The SDK provides various utility functions for common operations.

## Unit Conversion

### parseQfc / formatQfc

Convert between QFC and wei:

```typescript
import { parseQfc, formatQfc } from '@qfc/sdk';

// Parse QFC string to wei (bigint)
const wei = parseQfc('1.5');
console.log(wei); // 1500000000000000000n

// Format wei to QFC string
const qfc = formatQfc(wei);
console.log(qfc); // "1.5000"

// With custom decimals
const formatted = formatQfc(wei, 2);
console.log(formatted); // "1.50"
```

### parseGwei / formatGwei

Convert between gwei and wei:

```typescript
import { parseGwei, formatGwei } from '@qfc/sdk';

const wei = parseGwei('10');
console.log(wei); // 10000000000n

const gwei = formatGwei(wei);
console.log(gwei); // "10.0"
```

### formatQfcWithCommas

Format with thousand separators:

```typescript
import { formatQfcWithCommas } from '@qfc/sdk';

const formatted = formatQfcWithCommas(parseQfc('1234567.89'));
console.log(formatted); // "1,234,567.8900"
```

## Validation

### isValidAddress

Check if a string is a valid Ethereum address:

```typescript
import { isValidAddress } from '@qfc/sdk';

isValidAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f...');  // true
isValidAddress('0xinvalid');                                  // false
isValidAddress('not-an-address');                             // false
```

### isValidPrivateKey

Check if a string is a valid private key:

```typescript
import { isValidPrivateKey } from '@qfc/sdk';

isValidPrivateKey('0x...');  // true/false
```

### isValidMnemonic

Check if a mnemonic phrase is valid:

```typescript
import { isValidMnemonic } from '@qfc/sdk';

isValidMnemonic('word1 word2 ... word12');  // true/false
```

### isValidTxHash

Check if a string is a valid transaction hash:

```typescript
import { isValidTxHash } from '@qfc/sdk';

isValidTxHash('0x...');  // true/false
```

## Formatting

### shortenAddress

Shorten an address for display:

```typescript
import { shortenAddress } from '@qfc/sdk';

shortenAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f12345');
// "0x742d...2345"

// Custom lengths
shortenAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f12345', 6, 6);
// "0x742d35...f12345"
```

### shortenHash

Shorten a transaction hash:

```typescript
import { shortenHash } from '@qfc/sdk';

shortenHash('0xabcdef1234567890...');
// "0xabcd...7890"
```

### formatTimestamp

Format a Unix timestamp:

```typescript
import { formatTimestamp } from '@qfc/sdk';

formatTimestamp(1704067200n);
// "2024-01-01 00:00:00"
```

### formatRelativeTime

Format as relative time:

```typescript
import { formatRelativeTime } from '@qfc/sdk';

formatRelativeTime(Date.now() - 60000);
// "1 minute ago"

formatRelativeTime(Date.now() - 3600000);
// "1 hour ago"
```

## Encoding

### encodeFunctionData

Encode function call data:

```typescript
import { encodeFunctionData } from '@qfc/sdk';

const data = encodeFunctionData(
  'function transfer(address to, uint256 amount)',
  ['0xRecipient...', 1000n]
);
```

### decodeFunctionResult

Decode function return data:

```typescript
import { decodeFunctionResult } from '@qfc/sdk';

const result = decodeFunctionResult(
  'function balanceOf(address) view returns (uint256)',
  '0x...'
);
```

### keccak256

Compute keccak256 hash:

```typescript
import { keccak256 } from '@qfc/sdk';

const hash = keccak256('0x1234');
const hashFromString = keccak256(new TextEncoder().encode('hello'));
```

### getFunctionSelector

Get function selector (first 4 bytes of keccak256):

```typescript
import { getFunctionSelector } from '@qfc/sdk';

const selector = getFunctionSelector('transfer(address,uint256)');
// "0xa9059cbb"
```

### getEventTopic

Get event topic:

```typescript
import { getEventTopic } from '@qfc/sdk';

const topic = getEventTopic('Transfer(address,address,uint256)');
// "0xddf252ad..."
```

### abiEncode / abiDecode

ABI encode and decode:

```typescript
import { abiEncode, abiDecode } from '@qfc/sdk';

const encoded = abiEncode(['address', 'uint256'], ['0x...', 1000n]);
const decoded = abiDecode(['address', 'uint256'], encoded);
```

### Bytes Conversion

```typescript
import { hexToBytes, bytesToHex, toUtf8Bytes, toUtf8String } from '@qfc/sdk';

// Hex <-> Bytes
const bytes = hexToBytes('0x1234');
const hex = bytesToHex(new Uint8Array([0x12, 0x34]));

// UTF-8
const utf8Hex = toUtf8Bytes('hello');
const str = toUtf8String('0x68656c6c6f');
```

## Constants

### NETWORKS

Network configurations:

```typescript
import { NETWORKS, getNetwork, getNetworkByChainId } from '@qfc/sdk';

console.log(NETWORKS.testnet.rpcUrl);
console.log(NETWORKS.testnet.chainId);

const network = getNetwork('testnet');
const network2 = getNetworkByChainId(9000);
```

### Staking Constants

```typescript
import { MIN_STAKE, MIN_DELEGATION, UNSTAKE_DELAY, GAS_LIMITS } from '@qfc/sdk';

console.log('Min stake:', formatQfc(MIN_STAKE));      // 10000 QFC
console.log('Min delegation:', formatQfc(MIN_DELEGATION)); // 100 QFC
console.log('Unstake delay:', UNSTAKE_DELAY);        // 7 days in seconds
```

### Contract Addresses

```typescript
import { CONTRACTS } from '@qfc/sdk';

console.log('Staking (testnet):', CONTRACTS.STAKING_TESTNET);
console.log('Staking (mainnet):', CONTRACTS.STAKING_MAINNET);
console.log('Multicall3:', CONTRACTS.MULTICALL3);
```

## Next Steps

- [Provider](/sdk/javascript/provider) - RPC methods
- [Wallet](/sdk/javascript/wallet) - Transaction signing
- [API Reference](/api-reference/json-rpc) - Full API docs
