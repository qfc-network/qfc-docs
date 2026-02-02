# JSON-RPC API

QFC supports the standard Ethereum JSON-RPC API plus QFC-specific methods.

## Endpoints

| Network | HTTP | WebSocket |
|---------|------|-----------|
| Testnet | `https://rpc.testnet.qfc.network` | `wss://ws.testnet.qfc.network` |
| Mainnet | `https://rpc.qfc.network` | `wss://ws.qfc.network` |

## Request Format

```json
{
  "jsonrpc": "2.0",
  "method": "eth_blockNumber",
  "params": [],
  "id": 1
}
```

## Response Format

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "0x1234"
}
```

## Standard Ethereum Methods

### eth_chainId

Returns the chain ID.

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
```

Response:
```json
{"jsonrpc":"2.0","id":1,"result":"0x2328"}
```

### eth_blockNumber

Returns the current block number.

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

### eth_getBalance

Returns the balance of an address.

**Parameters:**
- `address` - Address to check
- `block` - Block number or "latest", "pending", "earliest"

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"eth_getBalance",
    "params":["0x742d35Cc6634C0532925a3b844Bc9e7595f...", "latest"],
    "id":1
  }'
```

### eth_getTransactionCount

Returns the nonce for an address.

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"eth_getTransactionCount",
    "params":["0x...", "latest"],
    "id":1
  }'
```

### eth_getBlockByNumber

Returns block by number.

**Parameters:**
- `blockNumber` - Block number in hex or "latest"
- `fullTransactions` - If true, returns full transaction objects

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"eth_getBlockByNumber",
    "params":["latest", false],
    "id":1
  }'
```

### eth_getBlockByHash

Returns block by hash.

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"eth_getBlockByHash",
    "params":["0xhash...", true],
    "id":1
  }'
```

### eth_getTransactionByHash

Returns transaction by hash.

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"eth_getTransactionByHash",
    "params":["0xhash..."],
    "id":1
  }'
```

### eth_getTransactionReceipt

Returns transaction receipt.

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"eth_getTransactionReceipt",
    "params":["0xhash..."],
    "id":1
  }'
```

### eth_sendRawTransaction

Submits a signed transaction.

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"eth_sendRawTransaction",
    "params":["0xsigned_tx_data..."],
    "id":1
  }'
```

### eth_call

Executes a call without creating a transaction.

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"eth_call",
    "params":[{
      "to": "0xcontract...",
      "data": "0xcalldata..."
    }, "latest"],
    "id":1
  }'
```

### eth_estimateGas

Estimates gas for a transaction.

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"eth_estimateGas",
    "params":[{
      "from": "0x...",
      "to": "0x...",
      "value": "0xde0b6b3a7640000"
    }],
    "id":1
  }'
```

### eth_gasPrice

Returns current gas price.

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":1}'
```

### eth_getLogs

Returns logs matching a filter.

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"eth_getLogs",
    "params":[{
      "fromBlock": "0x1",
      "toBlock": "latest",
      "address": "0xcontract...",
      "topics": ["0xtopic..."]
    }],
    "id":1
  }'
```

### eth_getCode

Returns contract bytecode.

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"eth_getCode",
    "params":["0xcontract...", "latest"],
    "id":1
  }'
```

## QFC-Specific Methods

See [QFC Methods](/api-reference/qfc-methods) for QFC-specific RPC methods.

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| -32700 | Parse error | Invalid JSON |
| -32600 | Invalid Request | Invalid request object |
| -32601 | Method not found | Method does not exist |
| -32602 | Invalid params | Invalid method parameters |
| -32603 | Internal error | Internal JSON-RPC error |
| -32000 | Server error | Generic server error |
| -32001 | Resource not found | Block/tx not found |
| -32002 | Resource unavailable | Resource temporarily unavailable |
| -32003 | Transaction rejected | Transaction was rejected |
| -32004 | Method not supported | Method not supported |

## Rate Limits

| Endpoint | Rate Limit |
|----------|------------|
| Public RPC | 100 requests/second |
| WebSocket | 50 subscriptions/connection |

## Batch Requests

Send multiple requests in a single HTTP call:

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '[
    {"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1},
    {"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":2}
  ]'
```

Response:
```json
[
  {"jsonrpc":"2.0","id":1,"result":"0x1234"},
  {"jsonrpc":"2.0","id":2,"result":"0x2328"}
]
```

## Next Steps

- [QFC Methods](/api-reference/qfc-methods) - QFC-specific RPC methods
- [WebSocket](/api-reference/websocket) - Real-time subscriptions
- [JavaScript SDK](/sdk/javascript/overview) - Use the SDK instead of raw RPC
