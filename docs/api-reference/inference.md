# AI Inference RPC API

QFC v2.0+ provides RPC methods for submitting and querying public AI inference tasks on-chain. These methods allow any account to request inference from the validator network's approved models.

For background on compute modes and approved models, see [AI Inference](/core-concepts/ai-inference).

## Endpoints

| Network | HTTP | WebSocket |
|---------|------|-----------|
| Testnet | `https://rpc.testnet.qfc.network` | `wss://ws.testnet.qfc.network` |
| Mainnet | `https://rpc.qfc.network` | `wss://ws.qfc.network` |

## Methods

### qfc_getSupportedModels

Returns the list of models currently approved by on-chain governance.

**Parameters:** None

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"qfc_getSupportedModels","params":[],"id":1}'
```

Response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": [
    {
      "modelId": "qfc-embed-small@v1.0",
      "task": "text-embedding",
      "architecture": "BERT-6L-384H",
      "outputDim": 384,
      "maxInputTokens": 512,
      "baseFeeQfc": "0.0001",
      "gpuTier": "cold"
    },
    {
      "modelId": "qfc-embed-medium@v1.0",
      "task": "text-embedding",
      "architecture": "BERT-12L-384H",
      "outputDim": 384,
      "maxInputTokens": 512,
      "baseFeeQfc": "0.00015",
      "gpuTier": "cold"
    },
    {
      "modelId": "qfc-classify-small@v1.0",
      "task": "text-classification",
      "architecture": "BERT-12L-768H",
      "outputDim": 768,
      "maxInputTokens": 512,
      "baseFeeQfc": "0.0005",
      "gpuTier": "warm"
    }
  ]
}
```

---

### qfc_estimateInferenceFee

Estimates the fee for an inference task based on model, input size, and current network load.

**Parameters:**
- `modelId` — Model identifier (e.g. `"qfc-embed-small@v1.0"`)
- `inputSizeBytes` — Size of the input data in bytes

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"qfc_estimateInferenceFee",
    "params":[{
      "modelId": "qfc-embed-small@v1.0",
      "inputSizeBytes": 256
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
    "estimatedFeeWei": "0x5af3107a4000",
    "estimatedFeeQfc": "0.0001",
    "baseFeeWei": "0x4e28e2290000",
    "loadMultiplier": 1.15,
    "validUntilBlock": "0x1a3f"
  }
}
```

---

### qfc_submitPublicTask

Submits a public inference task to the network. The fee is deducted from the submitter's balance. A validator in `inference` compute mode picks up the task and returns the result on-chain.

**Parameters (object):**

| Field | Type | Description |
|-------|------|-------------|
| `modelId` | `string` | Approved model identifier |
| `taskType` | `string` | Task type: `"text-embedding"`, `"text-classification"` |
| `inputData` | `string` | Base64-encoded input payload |
| `maxFee` | `string` | Maximum fee in wei (hex) the submitter is willing to pay |
| `submitter` | `string` | Address of the submitter |
| `signature` | `string` | EIP-712 signature authorizing the task submission |

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"qfc_submitPublicTask",
    "params":[{
      "modelId": "qfc-embed-small@v1.0",
      "taskType": "text-embedding",
      "inputData": "SGVsbG8gd29ybGQ=",
      "maxFee": "0x5af3107a4000",
      "submitter": "0x742d35Cc6634C0532925a3b844Bc9e7595f2aD12",
      "signature": "0x1b2a3c4d..."
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
    "taskId": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    "status": "pending",
    "submittedAt": "0x65f2a1b0",
    "estimatedCompletionMs": 5000
  }
}
```

::: tip
The `inputData` field must be **base64-encoded**. For text embedding tasks, encode the raw UTF-8 text directly. For classification, encode a JSON object with the fields expected by the model.
:::

::: warning
If `maxFee` is lower than the current estimated fee, the task will be rejected with error code `-32010`.
:::

---

### qfc_getPublicTaskStatus

Returns the current status and result of a previously submitted task.

**Parameters:**
- `taskId` — Task identifier returned by `qfc_submitPublicTask`

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"qfc_getPublicTaskStatus",
    "params":["0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"],
    "id":1
  }'
```

Response (pending):
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "taskId": "0xabcdef12...",
    "status": "pending",
    "submitter": "0x742d35Cc...",
    "modelId": "qfc-embed-small@v1.0",
    "submittedAt": "0x65f2a1b0",
    "assignedValidator": null,
    "result": null
  }
}
```

Response (completed):
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "taskId": "0xabcdef12...",
    "status": "completed",
    "submitter": "0x742d35Cc...",
    "modelId": "qfc-embed-small@v1.0",
    "submittedAt": "0x65f2a1b0",
    "completedAt": "0x65f2a1b5",
    "assignedValidator": "0x8d1dd4a2...",
    "result": {
      "outputData": "BASE64_ENCODED_FLOAT32_VECTOR...",
      "outputHash": "0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
      "executionTimeMs": 85,
      "feeChargedWei": "0x4e28e2290000"
    }
  }
}
```

Response (failed):
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "taskId": "0xabcdef12...",
    "status": "failed",
    "error": "no_available_validators",
    "feeRefunded": true
  }
}
```

**Possible status values:**

| Status | Description |
|--------|-------------|
| `pending` | Task queued, not yet assigned |
| `assigned` | Assigned to a validator, inference in progress |
| `completed` | Result available in `result.outputData` |
| `failed` | Task failed; fee is refunded |
| `expired` | No validator picked up the task within the timeout (60 s) |

---

### qfc_listPublicTasks

::: tip New in v2.2
This method was added in QFC v2.2.
:::

Returns a paginated list of public tasks filtered by submitter address.

**Parameters (object):**

| Field | Type | Description |
|-------|------|-------------|
| `submitter` | `string` | Filter by submitter address |
| `status` | `string` | (optional) Filter by status |
| `limit` | `number` | (optional) Max results, default 20, max 100 |
| `offset` | `number` | (optional) Pagination offset, default 0 |

```bash
curl -X POST https://rpc.testnet.qfc.network \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"qfc_listPublicTasks",
    "params":[{
      "submitter": "0x742d35Cc6634C0532925a3b844Bc9e7595f2aD12",
      "status": "completed",
      "limit": 5,
      "offset": 0
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
    "tasks": [
      {
        "taskId": "0xabcdef12...",
        "modelId": "qfc-embed-small@v1.0",
        "taskType": "text-embedding",
        "status": "completed",
        "submittedAt": "0x65f2a1b0",
        "completedAt": "0x65f2a1b5",
        "feeChargedWei": "0x4e28e2290000"
      }
    ],
    "total": 42,
    "limit": 5,
    "offset": 0
  }
}
```

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| -32010 | Fee too low | `maxFee` is below the current estimated fee |
| -32011 | Model not found | `modelId` does not match an approved model |
| -32012 | Input too large | `inputData` exceeds the model's `maxInputTokens` |
| -32013 | Task not found | `taskId` does not exist |
| -32014 | Invalid signature | EIP-712 signature verification failed |
| -32015 | Insufficient balance | Submitter balance cannot cover the fee |

## Next Steps

- [AI Inference Concepts](/core-concepts/ai-inference) — Compute modes, approved models, and GPU tiers
- [Submit an Inference Task Tutorial](/tutorials/submit-inference-task) — End-to-end JavaScript walkthrough
- [QFC Methods](/api-reference/qfc-methods) — Other QFC-specific RPC methods
