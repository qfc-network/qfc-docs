# Bridge RPC Methods

QFC provides RPC methods for querying the cross-chain bridge between Ethereum and QFC.

## Bridge Status

### qfc_getBridgeStatus

Returns the current status of the bridge.

**Parameters:** None

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"qfc_getBridgeStatus","params":[],"id":1}'
```

Response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "active": true,
    "validatorCount": 21,
    "threshold": 14,
    "ethereumBlock": "0x12a05f2",
    "qfcBlock": "0x3e8",
    "totalDeposits": "0x56bc75e2d63100000",
    "totalWithdrawals": "0x1bc16d674ec80000",
    "supportedTokens": [
      {
        "symbol": "ETH",
        "ethereumAddress": "0x0000000000000000000000000000000000000000",
        "qfcAddress": "0xWrappedETH...",
        "minDeposit": "0x2386f26fc10000",
        "minWithdrawal": "0x2386f26fc10000"
      },
      {
        "symbol": "USDC",
        "ethereumAddress": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        "qfcAddress": "0xWrappedUSDC...",
        "minDeposit": "0x989680",
        "minWithdrawal": "0x989680"
      }
    ]
  }
}
```

## Deposit Methods

### qfc_getBridgeDeposit

Returns details of a specific deposit.

**Parameters:**
- `depositId` - The deposit identifier (hex string)

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"qfc_getBridgeDeposit",
    "params":["0xabc123..."],
    "id":1
  }'
```

Response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "depositId": "0xabc123...",
    "status": "Completed",
    "from": "0xEthereumSender...",
    "to": "0xQfcRecipient...",
    "token": "ETH",
    "amount": "0xde0b6b3a7640000",
    "ethereumTxHash": "0xethTx...",
    "qfcTxHash": "0xqfcTx...",
    "ethereumBlock": "0x12a05f0",
    "qfcBlock": "0x3e6",
    "confirmations": 64,
    "requiredConfirmations": 64,
    "signatures": 15,
    "requiredSignatures": 14,
    "createdAt": "0x65f5e100",
    "completedAt": "0x65f5e200"
  }
}
```

### qfc_listBridgeDeposits

Returns a list of deposits matching the given filter.

**Parameters:**
- `filter` (optional) - Filter object:
  - `address` - Filter by sender or recipient address
  - `status` - Filter by status: `"Pending"`, `"Confirmed"`, `"Completed"`
  - `token` - Filter by token symbol
  - `fromBlock` - Start block (hex)
  - `toBlock` - End block (hex)
  - `limit` - Max results (default: 20)
  - `offset` - Pagination offset (default: 0)

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"qfc_listBridgeDeposits",
    "params":[{
      "address": "0xRecipient...",
      "status": "Completed",
      "limit": 10
    }],
    "id":1
  }'
```

Response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "deposits": [
      {
        "depositId": "0xabc123...",
        "status": "Completed",
        "from": "0xEthereumSender...",
        "to": "0xQfcRecipient...",
        "token": "ETH",
        "amount": "0xde0b6b3a7640000",
        "ethereumTxHash": "0xethTx...",
        "createdAt": "0x65f5e100",
        "completedAt": "0x65f5e200"
      }
    ],
    "total": 1
  }
}
```

## Withdrawal Methods

### qfc_getBridgeWithdrawal

Returns details of a specific withdrawal.

**Parameters:**
- `withdrawalId` - The withdrawal identifier (hex string)

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"qfc_getBridgeWithdrawal",
    "params":["0xdef456..."],
    "id":1
  }'
```

Response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "withdrawalId": "0xdef456...",
    "status": "Completed",
    "from": "0xQfcSender...",
    "to": "0xEthereumRecipient...",
    "token": "ETH",
    "amount": "0xde0b6b3a7640000",
    "qfcTxHash": "0xqfcTx...",
    "ethereumTxHash": "0xethTx...",
    "qfcBlock": "0x3e8",
    "ethereumBlock": "0x12a05f5",
    "signatures": 16,
    "requiredSignatures": 14,
    "createdAt": "0x65f5e300",
    "completedAt": "0x65f5e500"
  }
}
```

### qfc_listBridgeWithdrawals

Returns a list of withdrawals matching the given filter.

**Parameters:**
- `filter` (optional) - Filter object:
  - `address` - Filter by sender or recipient address
  - `status` - Filter by status: `"Pending"`, `"Confirmed"`, `"Completed"`
  - `token` - Filter by token symbol
  - `fromBlock` - Start block (hex)
  - `toBlock` - End block (hex)
  - `limit` - Max results (default: 20)
  - `offset` - Pagination offset (default: 0)

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"qfc_listBridgeWithdrawals",
    "params":[{
      "address": "0xSender...",
      "limit": 10
    }],
    "id":1
  }'
```

Response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "withdrawals": [
      {
        "withdrawalId": "0xdef456...",
        "status": "Completed",
        "from": "0xQfcSender...",
        "to": "0xEthereumRecipient...",
        "token": "ETH",
        "amount": "0xde0b6b3a7640000",
        "qfcTxHash": "0xqfcTx...",
        "createdAt": "0x65f5e300",
        "completedAt": "0x65f5e500"
      }
    ],
    "total": 1
  }
}
```

## Deposit Lifecycle

Deposits follow a three-stage lifecycle:

1. **Pending** - The deposit transaction has been submitted on Ethereum but has not yet received enough block confirmations. The bridge monitors the Ethereum chain for the required number of confirmations (currently 64 blocks, ~13 minutes).

2. **Confirmed** - The deposit has received sufficient Ethereum block confirmations. Bridge validators now verify the deposit and produce threshold signatures. At least 14 of 21 validators must sign to authorize minting on QFC.

3. **Completed** - The required threshold of validator signatures has been collected and the corresponding wrapped tokens have been minted on QFC. The tokens are now available in the recipient's QFC address.

:::tip
You can subscribe to deposit status changes in real time using the [WebSocket API](/api-reference/websocket) with the `bridge_deposit` subscription topic.
:::

## Using with SDK

All bridge methods are available through the SDK:

```typescript
import { QfcProvider, NETWORKS } from '@qfc/sdk';

const provider = new QfcProvider(NETWORKS.testnet.rpcUrl);

// Get bridge status
const status = await provider.getBridgeStatus();

// Get a specific deposit
const deposit = await provider.getBridgeDeposit('0xabc123...');

// List deposits for an address
const deposits = await provider.listBridgeDeposits({
  address: '0xRecipient...',
  status: 'Completed',
  limit: 10
});

// Get a specific withdrawal
const withdrawal = await provider.getBridgeWithdrawal('0xdef456...');

// List withdrawals for an address
const withdrawals = await provider.listBridgeWithdrawals({
  address: '0xSender...',
  limit: 10
});
```

## Next Steps

- [Bridge Tutorial](/tutorials/bridge-assets) - Step-by-step guide to bridging assets
- [Bridge Architecture](/core-concepts/bridge) - How the bridge works
- [WebSocket](/api-reference/websocket) - Real-time bridge event subscriptions
