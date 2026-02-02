# Introduction

QFC (Quantum Future Chain) is a next-generation blockchain platform designed for high performance, low costs, and quantum resistance.

## Key Features

### Proof of Contribution (PoC) Consensus

Unlike traditional Proof of Stake, QFC uses a multi-dimensional contribution scoring system:

| Dimension | Weight | Description |
|-----------|--------|-------------|
| Staking | 30% | Amount of QFC staked |
| Compute | 20% | Computational resources contributed |
| Uptime | 15% | Node availability and reliability |
| Accuracy | 15% | Validation accuracy rate |
| Network | 10% | Network quality and latency |
| Storage | 5% | Storage capacity provided |
| Reputation | 5% | Historical performance |

### Performance

- **TPS**: 500,000+ transactions per second
- **Finality**: < 0.3 seconds
- **Block Time**: 3 seconds
- **Gas Fees**: < $0.0001 per transaction

### EVM Compatibility

QFC is 100% EVM compatible, meaning:

- Deploy existing Solidity smart contracts without modifications
- Use familiar tools like Hardhat, Foundry, and Remix
- Integrate with existing Web3 libraries (ethers.js, web3.js)

## Architecture

```
┌─────────────────────────────────────────────────┐
│              Application Layer                   │
│         (DApps, Wallets, Explorers)             │
├─────────────────────────────────────────────────┤
│                  SDK Layer                       │
│      (JavaScript, Python, Rust SDKs)            │
├─────────────────────────────────────────────────┤
│                  RPC Layer                       │
│         (JSON-RPC, WebSocket, REST)             │
├─────────────────────────────────────────────────┤
│               Execution Layer                    │
│          (EVM, WASM, QVM - 100k+ TPS)           │
├─────────────────────────────────────────────────┤
│               Consensus Layer                    │
│          (Proof of Contribution)                 │
├─────────────────────────────────────────────────┤
│                Network Layer                     │
│              (libp2p, GossipSub)                │
├─────────────────────────────────────────────────┤
│               Storage Layer                      │
│          (RocksDB, Merkle Patricia Trie)        │
└─────────────────────────────────────────────────┘
```

## Use Cases

### DeFi
Build decentralized exchanges, lending protocols, and yield aggregators with high throughput and low fees.

### Gaming
Create blockchain games with instant transactions and micro-payments.

### NFTs
Mint and trade NFTs without worrying about gas costs.

### Enterprise
Deploy private or consortium networks for enterprise applications.

## Next Steps

- [Quick Start](/getting-started/quick-start) - Get up and running in 5 minutes
- [Installation](/getting-started/installation) - Install the SDK and tools
- [Core Concepts](/core-concepts/blockchain-basics) - Understand how QFC works
