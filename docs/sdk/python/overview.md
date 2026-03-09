# Python SDK Overview

The `qfc-sdk` package provides a Python SDK for interacting with the QFC blockchain, with built-in support for AI inference tasks.

## Features

- **QfcProvider** - JSON-RPC provider with QFC-specific methods
- **Wallet** - Account management, signing, and transactions
- **InferenceClient** - Submit and manage AI inference tasks
- **Contract** - Smart contract interaction helpers
- **Type Hints** - Full type annotations for IDE support
- **Async/Await** - Built on `asyncio` for non-blocking I/O

## Installation

```bash
pip install qfc-sdk
```

## Quick Example

```python
from qfc import QfcProvider, Wallet, InferenceClient
from qfc.utils import parse_qfc, format_qfc
from qfc.constants import NETWORKS

# Connect to testnet
provider = QfcProvider(NETWORKS["testnet"]["rpc_url"])

# Create wallet
wallet = Wallet(private_key, provider)

# Check balance
balance = await provider.get_balance(wallet.address)
print(f"Balance: {format_qfc(balance)} QFC")

# Send transaction
tx = await wallet.send_transaction(
    to="0x...",
    value=parse_qfc("10")
)

# Submit AI inference task
inference = InferenceClient(provider, wallet)
result = await inference.submit(
    model="qfc-vision-v1",
    input_data={"image": "ipfs://Qm..."},
)
print(f"Result: {result.output}")
```

## Module Structure

```
qfc-sdk
├── QfcProvider          # JSON-RPC provider
├── Wallet               # Account & signing
├── InferenceClient      # AI inference tasks
├── Contract             # Contract interactions
├── utils
│   ├── parse_qfc / format_qfc   # Unit conversion
│   ├── is_valid_address          # Validation
│   └── keccak256                 # Hashing
├── constants
│   ├── NETWORKS         # Network configs
│   └── CONTRACTS        # Known addresses
└── types                # Type definitions
```

## Network Constants

```python
from qfc.constants import NETWORKS

testnet = NETWORKS["testnet"]
print(testnet["rpc_url"])      # https://rpc.testnet.qfc.network
print(testnet["chain_id"])     # 9000
print(testnet["explorer_url"]) # https://explorer.testnet.qfc.network
```

## Error Handling

```python
from qfc.exceptions import QfcError, InsufficientFundsError

try:
    tx = await wallet.send_transaction(to="0x...", value=parse_qfc("1000"))
except InsufficientFundsError:
    print("Not enough QFC to send")
except QfcError as e:
    print(f"Error {e.code}: {e.message}")
```

## Requirements

- Python 3.9+
- `asyncio` compatible event loop

## Next Steps

- [Wallet](/sdk/python/wallet) - Account management and transactions
- [AI Inference](/sdk/python/inference) - Submit inference tasks
- [Contracts](/sdk/python/contracts) - Contract interactions
