# AI Inference

QFC v2.0 introduces **Proof of Contribution (PoC)** compute mode, where validators can contribute AI inference workloads instead of (or in addition to) traditional PoW hashing. Miners run approved ML models locally and submit inference proofs to earn contribution scores.

## Compute Modes

Each validator operates in one of three modes:

| Mode | Description |
|------|-------------|
| **pow** | Traditional Blake3 proof-of-work hashing |
| **inference** | AI model inference tasks |
| **none** | No compute contribution (block production only) |

Validators can switch modes via the `--compute-mode` flag:

```bash
# PoW mining (default)
qfc-node --validator <KEY> --mine --compute-mode pow

# AI inference
qfc-node --validator <KEY> --mine --compute-mode inference

# Auto-detect: use inference if a supported model can be loaded, otherwise fall back to PoW
qfc-node --validator <KEY> --mine --compute-mode auto
```

## Approved Models

Models must be approved by on-chain governance before inference proofs are accepted. The following models are approved in v2.0:

### qfc-embed-small

| Property | Value |
|----------|-------|
| HuggingFace Model | [sentence-transformers/all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) |
| Task | Text embedding (sentence similarity, semantic search) |
| Architecture | BERT (6 layers, 384 hidden dim) |
| Output | 384-dimensional float32 vector |
| Size | ~80 MB |
| Min Memory | 512 MB |
| GPU Tier | Cold (CPU-only nodes) |

### qfc-embed-medium

| Property | Value |
|----------|-------|
| HuggingFace Model | [sentence-transformers/all-MiniLM-L12-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L12-v2) |
| Task | Text embedding (higher quality than small) |
| Architecture | BERT (12 layers, 384 hidden dim) |
| Output | 384-dimensional float32 vector |
| Size | ~120 MB |
| Min Memory | 512 MB |
| GPU Tier | Cold (CPU-only nodes) |

### qfc-classify-small

| Property | Value |
|----------|-------|
| HuggingFace Model | [google-bert/bert-base-uncased](https://huggingface.co/google-bert/bert-base-uncased) |
| Task | Text classification |
| Architecture | BERT (12 layers, 768 hidden dim) |
| Output | 768-dimensional float32 vector |
| Size | ~440 MB |
| Min Memory | 2048 MB |
| GPU Tier | Warm (GPU recommended) |

## GPU Tiers

Nodes are classified into tiers based on available hardware:

| Tier | Hardware | Models Available |
|------|----------|-----------------|
| **Cold** | CPU only | qfc-embed-small, qfc-embed-medium |
| **Warm** | Entry GPU (4-8 GB VRAM) | All Cold models + qfc-classify-small |
| **Hot** | High-end GPU (16+ GB VRAM) | All models |

## How Inference Mining Works

1. **Model Download** — On startup, the miner downloads approved model weights from HuggingFace Hub and caches them locally in `~/.cache/qfc-models/`.

2. **Task Assignment** — Each epoch, the AI coordinator assigns inference tasks to registered miners based on their GPU tier and loaded models.

3. **Inference Execution** — The miner runs the model locally (CPU or GPU via [candle](https://github.com/huggingface/candle)) and produces an inference proof containing the input hash, output hash, and execution time.

4. **Proof Submission** — Proofs are submitted via the `qfc_submitInferenceProof` RPC method and broadcast to the network via P2P.

5. **Spot-Check Verification** — 5% of proofs are randomly re-executed by the receiving node. If the result doesn't match, the validator is penalized (5% stake slash + 6-hour jail).

6. **Score Update** — Valid inference proofs update the validator's `inferenceScore` in the PoC contribution calculation, which weights 20% of the total score.

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `QFC_COMPUTE_MODE` | `pow` | Compute mode: `pow`, `inference`, or `auto` |
| `QFC_INFERENCE_BACKEND` | `auto` | Backend: `cpu`, `metal`, `cuda`, or `auto` |
| `QFC_MODEL_DIR` | `/models` | Directory for cached model weights |

### Docker Example

```yaml
# docker-compose.yml
services:
  qfc-inference-miner:
    image: ghcr.io/qfc-network/qfc-core:latest
    environment:
      QFC_COMPUTE_MODE: inference
      QFC_INFERENCE_BACKEND: auto
      QFC_MODEL_DIR: /models
    volumes:
      - model-cache:/models
```

## RPC Methods

### qfc_submitInferenceProof

Submit an inference proof for scoring.

```bash
curl -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "qfc_submitInferenceProof",
    "params": [{
      "validator": "0x...",
      "model_id": "qfc-embed-small@v1.0",
      "input_hash": "0x...",
      "output_hash": "0x...",
      "execution_time_ms": 106,
      "flops": 1000000000,
      "signature": "0x..."
    }],
    "id": 1
  }'
```

### qfc_getValidators

Returns validator list including compute mode and inference scores.

```json
{
  "address": "0x8d1dd4...",
  "computeMode": "pow",
  "providesCompute": true,
  "hashrate": "5629542",
  "inferenceScore": "0",
  "tasksCompleted": "0"
}
```
