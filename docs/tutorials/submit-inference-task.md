# Submit an Inference Task

This tutorial walks you through submitting an AI inference task to the QFC network using JavaScript.

## What We'll Do

1. Connect to the QFC testnet
2. Query available models
3. Estimate the inference fee
4. Submit a text embedding task
5. Poll for the result
6. Decode the base64 output

## Prerequisites

- Node.js 18+
- Some testnet QFC (get from [faucet](https://faucet.testnet.qfc.network))
- A wallet private key for signing

## Step 1: Set Up the Project

```bash
mkdir qfc-inference-demo && cd qfc-inference-demo
npm init -y
npm install @qfc/sdk ethers
```

Create `inference.mjs`:

```javascript
import { QfcProvider, QfcWallet, NETWORKS } from '@qfc/sdk';
```

## Step 2: Connect to Testnet

```javascript
const provider = new QfcProvider(NETWORKS.testnet.rpcUrl);

// Verify connection
const blockNumber = await provider.getBlockNumber();
console.log('Connected to QFC testnet, block:', blockNumber);
```

## Step 3: Check Available Models

```javascript
const models = await provider.send('qfc_getSupportedModels', []);
console.log('Supported models:');
for (const m of models) {
  console.log(`  ${m.modelId} — ${m.task} (base fee: ${m.baseFeeQfc} QFC)`);
}
```

Example output:

```
Supported models:
  qfc-embed-small@v1.0 — text-embedding (base fee: 0.0001 QFC)
  qfc-embed-medium@v1.0 — text-embedding (base fee: 0.00015 QFC)
  qfc-classify-small@v1.0 — text-classification (base fee: 0.0005 QFC)
```

## Step 4: Estimate the Fee

```javascript
const MODEL_ID = 'qfc-embed-small@v1.0';
const inputText = 'Hello, QFC blockchain!';
const inputBytes = new TextEncoder().encode(inputText);

const estimate = await provider.send('qfc_estimateInferenceFee', [{
  modelId: MODEL_ID,
  inputSizeBytes: inputBytes.length
}]);

console.log('Estimated fee:', estimate.estimatedFeeQfc, 'QFC');
console.log('Load multiplier:', estimate.loadMultiplier);
```

## Step 5: Submit the Task

```javascript
// Load wallet (use environment variable in production!)
const wallet = new QfcWallet(process.env.QFC_PRIVATE_KEY, provider);
const address = await wallet.getAddress();

// Base64-encode the input
const inputData = Buffer.from(inputText).toString('base64');

// Sign the task with EIP-712
const domain = {
  name: 'QFC Inference',
  version: '1',
  chainId: NETWORKS.testnet.chainId
};
const types = {
  InferenceTask: [
    { name: 'modelId', type: 'string' },
    { name: 'taskType', type: 'string' },
    { name: 'inputData', type: 'string' },
    { name: 'maxFee', type: 'uint256' },
    { name: 'submitter', type: 'address' }
  ]
};
const taskData = {
  modelId: MODEL_ID,
  taskType: 'text-embedding',
  inputData,
  maxFee: BigInt(estimate.estimatedFeeWei),
  submitter: address
};
const signature = await wallet.signTypedData(domain, types, taskData);

// Submit
const submission = await provider.send('qfc_submitPublicTask', [{
  modelId: MODEL_ID,
  taskType: 'text-embedding',
  inputData,
  maxFee: estimate.estimatedFeeWei,
  submitter: address,
  signature
}]);

console.log('Task submitted:', submission.taskId);
console.log('Estimated completion:', submission.estimatedCompletionMs, 'ms');
```

## Step 6: Poll for the Result

```javascript
async function waitForResult(taskId, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const status = await provider.send('qfc_getPublicTaskStatus', [taskId]);

    if (status.status === 'completed') {
      return status;
    }
    if (status.status === 'failed' || status.status === 'expired') {
      throw new Error(`Task ${status.status}: ${status.error || 'unknown'}`);
    }

    console.log(`Status: ${status.status} — waiting...`);
    await new Promise(r => setTimeout(r, 2000));
  }
  throw new Error('Timeout waiting for task result');
}

const result = await waitForResult(submission.taskId);
console.log('Task completed!');
console.log('Execution time:', result.result.executionTimeMs, 'ms');
```

## Step 7: Decode the Result

The `outputData` field is a base64-encoded array of `float32` values (the embedding vector).

```javascript
function decodeEmbedding(base64String) {
  const buffer = Buffer.from(base64String, 'base64');
  const floats = new Float32Array(
    buffer.buffer,
    buffer.byteOffset,
    buffer.byteLength / 4
  );
  return Array.from(floats);
}

const embedding = decodeEmbedding(result.result.outputData);
console.log('Embedding dimensions:', embedding.length);
console.log('First 5 values:', embedding.slice(0, 5));
```

Example output:

```
Embedding dimensions: 384
First 5 values: [ 0.0234, -0.1567, 0.0891, 0.2045, -0.0312 ]
```

## Full Script

Here is the complete `inference.mjs`:

```javascript
import { QfcProvider, QfcWallet, NETWORKS } from '@qfc/sdk';

const MODEL_ID = 'qfc-embed-small@v1.0';
const inputText = 'Hello, QFC blockchain!';

// Connect
const provider = new QfcProvider(NETWORKS.testnet.rpcUrl);
console.log('Block:', await provider.getBlockNumber());

// Check models
const models = await provider.send('qfc_getSupportedModels', []);
console.log('Models:', models.map(m => m.modelId));

// Estimate fee
const inputBytes = new TextEncoder().encode(inputText);
const estimate = await provider.send('qfc_estimateInferenceFee', [{
  modelId: MODEL_ID,
  inputSizeBytes: inputBytes.length
}]);
console.log('Fee:', estimate.estimatedFeeQfc, 'QFC');

// Submit task
const wallet = new QfcWallet(process.env.QFC_PRIVATE_KEY, provider);
const address = await wallet.getAddress();
const inputData = Buffer.from(inputText).toString('base64');

const signature = await wallet.signTypedData(
  { name: 'QFC Inference', version: '1', chainId: NETWORKS.testnet.chainId },
  {
    InferenceTask: [
      { name: 'modelId', type: 'string' },
      { name: 'taskType', type: 'string' },
      { name: 'inputData', type: 'string' },
      { name: 'maxFee', type: 'uint256' },
      { name: 'submitter', type: 'address' }
    ]
  },
  {
    modelId: MODEL_ID,
    taskType: 'text-embedding',
    inputData,
    maxFee: BigInt(estimate.estimatedFeeWei),
    submitter: address
  }
);

const submission = await provider.send('qfc_submitPublicTask', [{
  modelId: MODEL_ID,
  taskType: 'text-embedding',
  inputData,
  maxFee: estimate.estimatedFeeWei,
  submitter: address,
  signature
}]);
console.log('Task:', submission.taskId);

// Poll
const start = Date.now();
let task;
while (Date.now() - start < 30000) {
  task = await provider.send('qfc_getPublicTaskStatus', [submission.taskId]);
  if (task.status === 'completed') break;
  if (task.status === 'failed' || task.status === 'expired') {
    throw new Error(`Task ${task.status}`);
  }
  await new Promise(r => setTimeout(r, 2000));
}

// Decode embedding
const buf = Buffer.from(task.result.outputData, 'base64');
const embedding = Array.from(new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4));
console.log('Dimensions:', embedding.length);
console.log('Preview:', embedding.slice(0, 5));
```

Run it:

```bash
QFC_PRIVATE_KEY=0xYOUR_KEY node inference.mjs
```

## Next Steps

- [AI Inference API Reference](/api-reference/inference) — Full method documentation and error codes
- [AI Inference Concepts](/core-concepts/ai-inference) — Compute modes, models, and GPU tiers
- [JavaScript SDK](/sdk/javascript/overview) — SDK reference
