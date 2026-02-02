# QFC-Specific RPC Methods

QFC extends the standard Ethereum RPC with additional methods for validators, staking, and network information.

## Validator Methods

### qfc_getValidators

Returns list of active validators.

**Parameters:** None

**Returns:**
- `Array<Validator>` - List of validator summaries

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"qfc_getValidators","params":[],"id":1}'
```

Response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "address": "0x...",
      "totalStake": "0x...",
      "contributionScore": 0.85,
      "commission": 10,
      "status": "active",
      "uptime": 99.5,
      "moniker": "validator-1"
    }
  ]
}
```

### qfc_getValidator

Returns detailed validator information.

**Parameters:**
- `address` - Validator address

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"qfc_getValidator",
    "params":["0xvalidator..."],
    "id":1
  }'
```

Response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "address": "0x...",
    "operatorAddress": "0x...",
    "totalStake": "0x...",
    "selfStake": "0x...",
    "delegatedStake": "0x...",
    "delegatorCount": 42,
    "contributionScore": 0.85,
    "scoreBreakdown": {
      "staking": 0.3,
      "compute": 0.2,
      "uptime": 0.15,
      "accuracy": 0.15,
      "network": 0.05
    },
    "commission": 10,
    "status": "active",
    "uptime": 99.5,
    "blocksProduced": "0x1000",
    "blocksMissed": "0x5",
    "totalRewards": "0x...",
    "registeredAt": "0x...",
    "lastActiveAt": "0x...",
    "moniker": "validator-1"
  }
}
```

### qfc_getValidatorSet

Returns validator set for an epoch.

**Parameters:**
- `epochNumber` (optional) - Epoch number (default: current)

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"qfc_getValidatorSet",
    "params":["0xa"],
    "id":1
  }'
```

## Staking Methods

### qfc_getStakeInfo

Returns staking information for an address.

**Parameters:**
- `address` - Staker address

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"qfc_getStakeInfo",
    "params":["0xstaker..."],
    "id":1
  }'
```

Response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "stakedAmount": "0x...",
    "unstakingAmount": "0x...",
    "unstakingCompletesAt": "0x...",
    "pendingRewards": "0x..."
  }
}
```

### qfc_getDelegation

Returns delegation information.

**Parameters:**
- `delegator` - Delegator address
- `validator` - Validator address

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"qfc_getDelegation",
    "params":["0xdelegator...", "0xvalidator..."],
    "id":1
  }'
```

## Network Methods

### qfc_getContributionScore

Returns contribution score for an address.

**Parameters:**
- `address` - Address to check

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"qfc_getContributionScore",
    "params":["0x..."],
    "id":1
  }'
```

Response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": 0.85
}
```

### qfc_getEpoch

Returns current epoch information.

**Parameters:** None

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"qfc_getEpoch","params":[],"id":1}'
```

Response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "number": "0x64",
    "startTime": "0x...",
    "durationMs": "0x...",
    "slot": 50
  }
}
```

### qfc_getNetworkStats

Returns network statistics.

**Parameters:** None

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"qfc_getNetworkStats","params":[],"id":1}'
```

Response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "latestBlock": "0x1234",
    "latestTimestamp": "0x...",
    "avgBlockTimeMs": 3000,
    "tps": 1250.5,
    "activeAddresses": 50000,
    "totalValidators": 100,
    "activeValidators": 95,
    "totalStaked": "0x..."
  }
}
```

### qfc_getNodeInfo

Returns node information.

**Parameters:** None

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"qfc_getNodeInfo","params":[],"id":1}'
```

Response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "version": "1.0.0",
    "chainId": 9000,
    "peerCount": 25,
    "isValidator": false,
    "syncing": false,
    "startingBlock": null,
    "currentBlock": null,
    "highestBlock": null
  }
}
```

### qfc_getPendingTransactions

Returns pending transactions in the mempool.

**Parameters:** None

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"qfc_getPendingTransactions","params":[],"id":1}'
```

Response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": ["0xhash1...", "0xhash2...", "0xhash3..."]
}
```

## Using with SDK

All these methods are available through the SDK:

```typescript
import { QfcProvider, NETWORKS } from '@qfc/sdk';

const provider = new QfcProvider(NETWORKS.testnet.rpcUrl);

// Get validators
const validators = await provider.getValidators();

// Get epoch info
const epoch = await provider.getEpoch();

// Get network stats
const stats = await provider.getNetworkStats();

// Get contribution score
const score = await provider.getContributionScore('0x...');
```

## Next Steps

- [WebSocket](/api-reference/websocket) - Real-time subscriptions
- [JavaScript SDK](/sdk/javascript/provider) - SDK provider documentation
