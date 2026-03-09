# Contracts

The Python SDK provides helpers for interacting with smart contracts on QFC.

## Custom Contracts

```python
from qfc import QfcProvider, Wallet, Contract
from qfc.constants import NETWORKS

provider = QfcProvider(NETWORKS["testnet"]["rpc_url"])
wallet = Wallet(private_key, provider)

abi = [
    "function myMethod(uint256 x) view returns (uint256)",
    "function doSomething(address to, uint256 amount)",
]

# Read-only
contract = Contract("0xAddress...", abi, provider)
result = await contract.my_method(123)

# With signer for write operations
contract = Contract("0xAddress...", abi, wallet)
tx = await contract.do_something("0x...", 1000)
await tx.wait()
```

## ERC-20 Tokens

### Get Token Info

```python
from qfc.contracts import ERC20

token = ERC20("0xTokenAddress...", provider)

name = await token.name()
symbol = await token.symbol()
decimals = await token.decimals()

print(f"{name} ({symbol}) — {decimals} decimals")
```

### Read Operations

```python
# Get balance
balance = await token.balance_of("0xAddress...")

# Get allowance
allowance = await token.allowance("0xOwner...", "0xSpender...")

# Get total supply
total_supply = await token.total_supply()
```

### Write Operations

```python
# Connect with signer
token = ERC20("0xToken...", wallet)

# Transfer tokens
tx = await token.transfer("0xRecipient...", 1000)
await tx.wait()

# Approve spending
tx = await token.approve("0xSpender...", 1000)
await tx.wait()
```

## ERC-721 NFTs

```python
from qfc.contracts import ERC721

nft = ERC721("0xNFTAddress...", provider)

# Get collection info
name = await nft.name()
symbol = await nft.symbol()

# Get owner of token
owner = await nft.owner_of(1)

# Get token URI
token_uri = await nft.token_uri(1)

# Transfer (with signer)
nft = ERC721("0xNFT...", wallet)
tx = await nft.transfer_from("0xFrom...", "0xTo...", 1)
await tx.wait()
```

## ERC-1155 Multi-Token

```python
from qfc.contracts import ERC1155

multi = ERC1155("0xAddress...", provider)

# Get balance for specific token ID
balance = await multi.balance_of("0xAccount...", 1)

# Batch balances
balances = await multi.balance_of_batch(
    ["0xAccount1...", "0xAccount2..."],
    [1, 2],
)

# Transfer (with signer)
multi = ERC1155("0xAddress...", wallet)
tx = await multi.safe_transfer_from(
    "0xFrom...",
    "0xTo...",
    1,      # token ID
    100,    # amount
    b"",    # data
)
await tx.wait()
```

## Event Listening

```python
# Listen for Transfer events
async for event in token.listen("Transfer"):
    print(f"From: {event.args['from']}")
    print(f"To: {event.args['to']}")
    print(f"Amount: {event.args['value']}")
```

## Check if Address is Contract

```python
from qfc.utils import is_contract

result = await is_contract("0x...", provider)
print(f"Is contract: {result}")
```

## Next Steps

- [Wallet](/sdk/python/wallet) - Account management
- [AI Inference](/sdk/python/inference) - Submit inference tasks
- [Deploy Contract](/smart-contracts/deployment) - Deploy your own
