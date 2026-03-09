# AI Inference

The `InferenceClient` class provides methods for submitting and managing AI inference tasks on the QFC network.

## Setup

```python
from qfc import QfcProvider, Wallet, InferenceClient
from qfc.constants import NETWORKS

provider = QfcProvider(NETWORKS["testnet"]["rpc_url"])
wallet = Wallet(private_key, provider)
inference = InferenceClient(provider, wallet)
```

## Submit an Inference Task

```python
from qfc.utils import parse_qfc

result = await inference.submit(
    model="qfc-vision-v1",
    input_data={"image": "ipfs://Qm..."},
    max_fee=parse_qfc("0.5"),  # max fee willing to pay
)

print(f"Task ID: {result.task_id}")
print(f"Output: {result.output}")
print(f"Fee charged: {result.fee}")
```

## Available Models

```python
models = await inference.list_models()

for model in models:
    print(f"{model.name} — {model.description}")
    print(f"  Fee per request: {model.fee_per_request}")
    print(f"  Compute mode: {model.compute_mode}")
```

## Async Task Submission

For long-running tasks, submit asynchronously and poll for results:

```python
# Submit without waiting
task_id = await inference.submit_async(
    model="qfc-llm-70b",
    input_data={"prompt": "Explain quantum computing"},
    max_fee=parse_qfc("1.0"),
)

print(f"Submitted: {task_id}")

# Check status
status = await inference.get_task_status(task_id)
print(f"Status: {status.state}")  # pending, running, completed, failed

# Wait for result
result = await inference.wait_for_result(task_id, timeout=120)
print(f"Output: {result.output}")
```

## Batch Submissions

Submit multiple tasks at once:

```python
tasks = [
    {"model": "qfc-vision-v1", "input_data": {"image": f"ipfs://Qm{i}..."}}
    for i in range(10)
]

results = await inference.submit_batch(
    tasks=tasks,
    max_fee_per_task=parse_qfc("0.5"),
)

for r in results:
    print(f"Task {r.task_id}: {r.output}")
```

## Streaming Results

For models that support streaming:

```python
async for chunk in inference.stream(
    model="qfc-llm-70b",
    input_data={"prompt": "Write a story about a blockchain"},
    max_fee=parse_qfc("1.0"),
):
    print(chunk.text, end="", flush=True)
```

## Task History

```python
# Get recent tasks for your wallet
tasks = await inference.get_task_history(limit=20)

for task in tasks:
    print(f"{task.task_id} | {task.model} | {task.state} | {task.fee}")
```

## Error Handling

```python
from qfc.exceptions import (
    InferenceError,
    ModelNotFoundError,
    InsufficientFeeError,
    TaskTimeoutError,
)

try:
    result = await inference.submit(
        model="qfc-vision-v1",
        input_data={"image": "ipfs://Qm..."},
        max_fee=parse_qfc("0.5"),
    )
except ModelNotFoundError:
    print("Model does not exist")
except InsufficientFeeError as e:
    print(f"Fee too low — minimum: {e.required_fee}")
except TaskTimeoutError:
    print("Task timed out")
except InferenceError as e:
    print(f"Inference error: {e.message}")
```

## Compute Modes

QFC supports different compute modes for inference:

| Mode | Description | Latency |
|------|-------------|---------|
| `instant` | On-chain compute nodes | <1s |
| `standard` | Distributed compute pool | 5-30s |
| `batch` | Queued batch processing | Minutes |

```python
result = await inference.submit(
    model="qfc-vision-v1",
    input_data={"image": "ipfs://Qm..."},
    compute_mode="instant",
    max_fee=parse_qfc("1.0"),
)
```

## Next Steps

- [Contracts](/sdk/python/contracts) - Interact with smart contracts
- [AI Inference Concepts](/core-concepts/ai-inference) - How inference works on QFC
- [Inference API Reference](/api-reference/inference) - Low-level RPC methods
