# Inference Miner Guide

Earn QFC rewards by providing AI compute power to the network. Inference miners run approved ML models and submit cryptographic proofs of execution.

::: tip No Validator Required
You don't need to be a validator or stake QFC to mine. Any machine with a wallet and internet connection can participate.
:::

## Quick Start

```bash
curl -sLO https://raw.githubusercontent.com/qfc-network/testnet/main/scripts/start-miner.sh
chmod +x start-miner.sh
./start-miner.sh
```

This script auto-detects your hardware, builds the miner, generates a wallet, and starts mining.

## Manual Setup

### 1. Build the Miner

Choose the build command for your platform:

::: code-group

```bash [Intel Mac (CPU)]
git clone https://github.com/qfc-network/qfc-core.git
cd qfc-core
cargo build --release --features candle --bin qfc-miner
```

```bash [Apple Silicon (Metal GPU)]
git clone https://github.com/qfc-network/qfc-core.git
cd qfc-core
cargo build --release --features metal,candle --bin qfc-miner
```

```bash [Linux + NVIDIA (CUDA)]
git clone https://github.com/qfc-network/qfc-core.git
cd qfc-core
cargo build --release --features cuda,candle --bin qfc-miner
```

```bash [Linux (CPU only)]
git clone https://github.com/qfc-network/qfc-core.git
cd qfc-core
cargo build --release --features candle --bin qfc-miner
```

:::

### 2. Generate a Wallet

```bash
./target/release/qfc-miner --generate-wallet
```

Output:
```
Wallet Address: a1b2c3d4e5f6...
Private Key:    9f8e7d6c5b4a...
```

::: danger Keep Your Private Key Safe
Back up your private key immediately. If lost, your rewards are unrecoverable.
:::

### 3. Get Testnet Tokens

Visit the [Faucet](https://faucet.testnet.qfc.network) or use RPC:

```bash
curl -s https://rpc.testnet.qfc.network -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"qfc_requestFaucet","params":["0x<YOUR_ADDRESS>"],"id":1}'
```

### 4. Start Mining

```bash
./target/release/qfc-miner \
  --wallet <YOUR_ADDRESS> \
  --private-key <YOUR_PRIVATE_KEY> \
  --validator-rpc https://rpc.testnet.qfc.network \
  --backend cpu
```

## Docker

```bash
docker run \
  -e QFC_MINER_WALLET=<YOUR_ADDRESS> \
  -e QFC_MINER_PRIVATE_KEY=<YOUR_PRIVATE_KEY> \
  -e QFC_MINER_RPC_URL=https://rpc.testnet.qfc.network \
  -e QFC_MINER_BACKEND=cpu \
  -v miner-models:/models \
  ghcr.io/qfc-network/qfc-miner:main
```

## Configuration

### CLI Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--wallet` | — | Miner wallet address (required) |
| `--private-key` | — | Ed25519 private key (required) |
| `--validator-rpc` | `http://127.0.0.1:8545` | Validator RPC endpoint |
| `--backend` | `auto` | `cpu`, `metal`, `cuda`, or `auto` |
| `--model-dir` | `./models` | Model cache directory |
| `--max-memory` | `0` (auto) | Max memory usage in MB |
| `--hot-models` | — | Models to keep loaded (comma-separated) |
| `--generate-wallet` | — | Generate new wallet and exit |
| `--verbose` | `false` | Enable debug logging |

### Environment Variables

All flags can be set via environment variables with `QFC_MINER_` prefix:

```bash
export QFC_MINER_RPC_URL=https://rpc.testnet.qfc.network
export QFC_MINER_WALLET=a1b2c3d4...
export QFC_MINER_PRIVATE_KEY=9f8e7d6c...
export QFC_MINER_BACKEND=cpu
export QFC_MINER_MODEL_DIR=/path/to/models
export QFC_MINER_MAX_MEMORY=8000
```

## GPU Tiers

Your hardware determines which tasks you can run:

| Tier | Memory | Examples | Available Models |
|------|--------|----------|------------------|
| **Hot** | 32 GB+ | M2 Ultra, M3 Max, A100 | All models including large LLMs |
| **Warm** | 16–31 GB | M1/M2/M3 Pro, RTX 3080+ | Medium models + embeddings |
| **Cold** | < 16 GB | Intel Mac, M1/M2 base, CPU-only | Small models + embeddings |

::: info Intel MacBook Pro
Intel Macs run as **Cold** tier with CPU backend. You can run embedding models (BERT-based, ~80–120 MB). Typical inference time: 100–300ms per task.
:::

## How Mining Works

```
┌─────────┐     ┌──────────────┐     ┌──────────────┐     ┌─────────┐
│ 1. Fetch │────▶│ 2. Load Model│────▶│ 3. Run       │────▶│ 4. Submit│
│    Task  │     │    (cached)  │     │    Inference  │     │    Proof │
└─────────┘     └──────────────┘     └──────────────┘     └─────────┘
                                                               │
                                                               ▼
                                                     ┌─────────────────┐
                                                     │ 5. Spot-Check   │
                                                     │    (5% chance)  │
                                                     └────────┬────────┘
                                                              │
                                              ┌───────────────┴───────────────┐
                                              ▼                               ▼
                                        ┌──────────┐                   ┌──────────┐
                                        │  Pass ✓  │                   │  Fail ✗  │
                                        │  +Reward │                   │  -5% Stake│
                                        └──────────┘                   │  +6h Ban  │
                                                                       └──────────┘
```

1. **Fetch Task** — Every ~10s, the miner polls the network for available inference tasks matching its GPU tier
2. **Load Model** — Downloads the required model from HuggingFace on first use (~80–440 MB), cached locally
3. **Run Inference** — Executes the model on the input data using CPU or GPU (via [candle](https://github.com/huggingface/candle))
4. **Submit Proof** — Signs and submits a proof containing: input hash, output hash, execution time, FLOPS
5. **Spot-Check** — 5% of proofs are randomly re-executed by validators. Honest miners always pass

## Rewards

Inference miners earn from two sources:

- **Block Rewards** — 15% of each block reward is distributed to miners who submitted proofs, proportional to FLOPS contributed
- **Public Task Fees** — Users can submit paid inference tasks; miners earn 70% of the task fee

Reward multipliers scale with network conditions:
- Higher stake ratio → higher block reward multiplier (0.5x–1.5x)
- More active miners → larger inference miner pool share

## Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 cores | 4+ cores |
| RAM | 4 GB | 8+ GB |
| Disk | 5 GB free | 20 GB SSD |
| Network | 5 Mbps | 10+ Mbps |
| GPU | None (CPU works) | Apple Silicon / NVIDIA |

## Monitoring

### Check Status

```bash
./scripts/start-miner.sh --status
```

### RPC Queries

```bash
# Check balance
curl -s https://rpc.testnet.qfc.network -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x<ADDR>","latest"],"id":1}'

# Check inference stats
curl -s https://rpc.testnet.qfc.network -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"qfc_getInferenceStats","params":[],"id":1}'
```

## Troubleshooting

**Model download fails?**
- Check internet connectivity
- Set `--model-dir` to a path with enough disk space
- Models are cached in `~/.cache/huggingface/` by default

**Low rewards?**
- Ensure your node has consistent uptime
- Intel CPU miners earn less than GPU miners (lower FLOPS)
- Check that your wallet has been funded

**Connection refused?**
- Verify `--validator-rpc` URL is correct
- Test: `curl https://rpc.testnet.qfc.network -X POST -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'`

**High memory usage?**
- Use `--max-memory` to cap memory
- Unload models with `--hot-models` (only keep needed ones loaded)
