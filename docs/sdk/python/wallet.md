# Wallet

The `Wallet` class handles account management, transaction signing, and QFC transfers.

## Creating a Wallet

### From Private Key

```python
from qfc import QfcProvider, Wallet
from qfc.constants import NETWORKS

provider = QfcProvider(NETWORKS["testnet"]["rpc_url"])
wallet = Wallet(private_key, provider)

print(f"Address: {wallet.address}")
```

### From Mnemonic

```python
wallet = Wallet.from_mnemonic(
    "word1 word2 word3 ... word12",
    provider
)
```

### Create Random Wallet

```python
wallet, mnemonic = Wallet.create_random(provider)

print(f"Address: {wallet.address}")
print(f"Mnemonic: {mnemonic}")
# ⚠️ Store mnemonic securely!
```

## Check Balance

```python
from qfc.utils import format_qfc

balance = await wallet.get_balance()
print(f"Balance: {format_qfc(balance)} QFC")
```

## Send QFC

```python
from qfc.utils import parse_qfc

tx = await wallet.send_transaction(
    to="0xRecipient...",
    value=parse_qfc("10"),  # 10 QFC
)

print(f"Tx Hash: {tx.hash}")

# Wait for confirmation
receipt = await tx.wait()
print(f"Confirmed in block: {receipt.block_number}")
print(f"Gas used: {receipt.gas_used}")
```

## Sign Message

```python
message = "Hello, QFC!"
signature = wallet.sign_message(message)
print(f"Signature: {signature}")
```

## Sign Typed Data (EIP-712)

```python
domain = {
    "name": "MyApp",
    "version": "1",
    "chain_id": 9000,
    "verifying_contract": "0x..."
}

types = {
    "Order": [
        {"name": "maker", "type": "address"},
        {"name": "amount", "type": "uint256"},
    ]
}

value = {
    "maker": wallet.address,
    "amount": parse_qfc("100"),
}

signature = wallet.sign_typed_data(domain, types, value)
```

## Transaction Overrides

All transaction methods accept optional keyword arguments:

```python
tx = await wallet.send_transaction(
    to="0x...",
    value=parse_qfc("10"),
    gas_limit=21000,
    max_fee_per_gas=50_000_000_000,  # 50 gwei
    max_priority_fee_per_gas=2_000_000_000,  # 2 gwei
    nonce=42,
)
```

## Security Best Practices

1. **Never expose private keys** in source code — use environment variables
2. **Store mnemonics securely** — encrypted storage or hardware wallet
3. **Validate addresses** before sending transactions
4. **Start with testnet** before mainnet

```python
from qfc.utils import is_valid_address

recipient = "0x..."
if not is_valid_address(recipient):
    raise ValueError("Invalid address")
```

## Next Steps

- [AI Inference](/sdk/python/inference) - Submit inference tasks
- [Contracts](/sdk/python/contracts) - Contract interactions
- [Overview](/sdk/python/overview) - SDK features and installation
