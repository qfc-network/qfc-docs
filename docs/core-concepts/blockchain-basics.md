# Blockchain Basics

This page covers the fundamental concepts of the QFC blockchain.

## What is QFC?

QFC (Quantum Future Chain) is a high-performance, EVM-compatible blockchain that uses Proof of Contribution (PoC) consensus.

## Key Components

### Blocks

Blocks are containers that hold transactions and link together to form the blockchain.

```typescript
interface Block {
  number: bigint;           // Block height
  hash: string;             // Block hash
  parentHash: string;       // Previous block hash
  timestamp: bigint;        // Unix timestamp
  producer: string;         // Validator who produced this block
  gasLimit: bigint;         // Maximum gas for this block
  gasUsed: bigint;          // Actual gas used
  transactionCount: number; // Number of transactions
}
```

**Block Time**: 3 seconds (average)

### Transactions

Transactions are signed messages that transfer value or interact with smart contracts.

```typescript
interface Transaction {
  hash: string;             // Transaction hash
  from: string;             // Sender address
  to: string | null;        // Recipient (null for contract creation)
  value: bigint;            // Amount transferred (in wei)
  gasLimit: bigint;         // Maximum gas
  gasPrice: bigint;         // Gas price (in wei)
  nonce: number;            // Transaction sequence number
  data: string;             // Input data (for contracts)
}
```

### Accounts

QFC supports two types of accounts:

1. **Externally Owned Accounts (EOA)**
   - Controlled by private keys
   - Can send transactions
   - Has balance and nonce

2. **Contract Accounts**
   - Controlled by code
   - Can hold tokens and execute logic
   - Created by deploying a smart contract

### State

The blockchain state is a mapping of addresses to account states:

```
State = {
  address1 => { balance, nonce, code, storage },
  address2 => { balance, nonce, code, storage },
  ...
}
```

State is stored in a Merkle Patricia Trie for efficient verification.

## How Transactions Work

1. **Creation**: User creates and signs a transaction
2. **Broadcasting**: Transaction is sent to a node
3. **Mempool**: Transaction waits in the mempool
4. **Inclusion**: Validator includes transaction in a block
5. **Execution**: Transaction is executed, state is updated
6. **Finality**: Block is finalized (< 0.3 seconds)

```typescript
// Example: Send a transaction
const tx = await wallet.sendTransaction({
  to: '0xRecipient...',
  value: parseQfc('10')
});

// Wait for confirmation
const receipt = await tx.wait();
console.log('Confirmed in block:', receipt.blockNumber);
```

## Gas and Fees

Gas is a unit measuring computational effort:

- **Gas Limit**: Maximum gas you're willing to use
- **Gas Price**: Price per unit of gas (in wei)
- **Transaction Fee**: gasUsed × gasPrice

```typescript
// Estimate gas for a transaction
const gasEstimate = await provider.estimateGas({
  to: '0x...',
  value: parseQfc('1')
});

// Get current gas price
const gasPrice = await provider.getGasPrice();

// Calculate fee
const fee = gasEstimate * gasPrice;
console.log('Estimated fee:', formatQfc(fee), 'QFC');
```

QFC fees are typically < $0.0001 per transaction.

## Units

QFC uses 18 decimal places (same as Ethereum):

| Unit | Wei | QFC |
|------|-----|-----|
| Wei | 1 | 0.000000000000000001 |
| Gwei | 10^9 | 0.000000001 |
| QFC | 10^18 | 1 |

```typescript
import { parseQfc, formatQfc, parseGwei } from '@qfc/sdk';

// Convert QFC to wei
const wei = parseQfc('1.5');     // 1500000000000000000n

// Convert wei to QFC
const qfc = formatQfc(wei);       // "1.5000"

// Parse gwei
const gwei = parseGwei('10');    // 10000000000n
```

## Network Identifiers

| Network | Chain ID | Currency |
|---------|----------|----------|
| Testnet | 9000 | QFC |
| Mainnet | 9001 | QFC |

## Merkle Trees

QFC uses Merkle Patricia Tries for:

- **State Trie**: Current account states
- **Transaction Trie**: Transactions in a block
- **Receipt Trie**: Transaction receipts

This enables:
- Efficient state verification
- Light client support
- Proof of inclusion/exclusion

## Consensus

See [PoC Consensus](/core-concepts/poc-consensus) for details on how blocks are produced and finalized.

## Smart Contracts

QFC is EVM-compatible, supporting:
- Solidity smart contracts
- All EVM opcodes
- Standard token interfaces (ERC-20, ERC-721, etc.)

See [Smart Contracts](/smart-contracts/solidity-guide) for more information.

## Next Steps

- [Accounts & Keys](/core-concepts/accounts-and-keys)
- [Transactions](/core-concepts/transactions)
- [Gas & Fees](/core-concepts/gas-and-fees)
