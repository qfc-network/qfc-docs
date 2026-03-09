# Register an AI Agent

This tutorial walks you through registering an AI agent on QFC, funding it, issuing session keys, and monitoring its spending.

## Prerequisites

- Python 3.9+ with `qfc-sdk` installed (`pip install qfc-sdk`)
- A funded QFC testnet account (get tokens from the [faucet](https://faucet.testnet.qfc.network))
- Basic familiarity with async Python

## Step 1: Set Up Provider and Owner Wallet

```python
import asyncio
from qfc import QfcProvider, Wallet, Contract
from qfc.utils import parse_qfc, format_qfc
from qfc.constants import NETWORKS

provider = QfcProvider(NETWORKS["testnet"]["rpc_url"])

# This is the owner wallet — keep this key secure
owner = Wallet("0xYOUR_OWNER_PRIVATE_KEY", provider)
print(f"Owner: {owner.address}")
```

## Step 2: Generate an Agent Wallet

Create a new key pair for your agent. The agent will use this key (or session keys) to sign transactions.

```python
agent_wallet, mnemonic = Wallet.create_random(provider)
print(f"Agent address: {agent_wallet.address}")
print(f"Mnemonic (back up securely): {mnemonic}")
```

## Step 3: Register the Agent

Call `registerAgent` on the AgentRegistry contract:

```python
AGENT_REGISTRY = "0x7791dfa4d489f3d524708cbc0caa8689b76322b3"

registry_abi = [
    "function registerAgent(address agent, bytes32 name, uint256 dailyLimit)",
    "function issueSessionKey(address agent, address key, uint256 expiry)",
    "function revokeSessionKey(address agent, address key)",
    "function getAgentInfo(address agent) view returns (address owner, bytes32 name, uint256 dailyLimit, uint256 spentToday, bool active)",
    "function isActiveSession(address agent, address key) view returns (bool)",
]

registry = Contract(AGENT_REGISTRY, registry_abi, owner)

# Register with a 50 QFC daily limit
tx = await registry.register_agent(
    agent_wallet.address,
    b"my-trading-bot".ljust(32, b"\x00"),  # bytes32 name
    parse_qfc("50"),  # daily limit
)
receipt = await tx.wait()
print(f"Agent registered in block {receipt.block_number}")
```

## Step 4: Fund the Agent

Send QFC to the agent wallet so it can pay for gas and transactions:

```python
tx = await owner.send_transaction(
    to=agent_wallet.address,
    value=parse_qfc("100"),  # 100 QFC
)
await tx.wait()

balance = await provider.get_balance(agent_wallet.address)
print(f"Agent balance: {format_qfc(balance)} QFC")
```

## Step 5: Issue a Session Key

Generate a temporary key for the agent to use. This avoids exposing the agent's main private key in your application runtime.

```python
import time

# Generate a session key pair
session_wallet, _ = Wallet.create_random(provider)

# Issue session key with 24-hour expiry
expiry = int(time.time()) + 86400  # 24 hours from now

tx = await registry.issue_session_key(
    agent_wallet.address,
    session_wallet.address,
    expiry,
)
await tx.wait()
print(f"Session key issued: {session_wallet.address}")
print(f"Expires: {time.ctime(expiry)}")
```

:::tip
Store the session key's private key in your agent's secure runtime environment (e.g., environment variable or secrets manager). Rotate session keys regularly.
:::

## Step 6: Use the Session Key

Your AI agent can now sign transactions using the session key:

```python
# In your agent's runtime — load the session key
agent_session = Wallet("0xSESSION_PRIVATE_KEY", provider)

# Send a transaction as the agent
tx = await agent_session.send_transaction(
    to="0xSomeContract...",
    value=parse_qfc("5"),
)
await tx.wait()
print(f"Transaction sent: {tx.hash}")
```

## Step 7: Monitor Spending

Query the registry to check your agent's daily spending:

```python
# Use a read-only contract instance
registry_reader = Contract(AGENT_REGISTRY, registry_abi, provider)

info = await registry_reader.get_agent_info(agent_wallet.address)
owner_addr, name, daily_limit, spent_today, active = info

print(f"Agent: {agent_wallet.address}")
print(f"Active: {active}")
print(f"Daily limit: {format_qfc(daily_limit)} QFC")
print(f"Spent today: {format_qfc(spent_today)} QFC")
print(f"Remaining: {format_qfc(daily_limit - spent_today)} QFC")
```

## Step 8: Revoke a Session Key (If Needed)

If a session key is compromised, revoke it immediately:

```python
tx = await registry.revoke_session_key(
    agent_wallet.address,
    session_wallet.address,
)
await tx.wait()
print("Session key revoked")

# Verify
is_active = await registry_reader.is_active_session(
    agent_wallet.address,
    session_wallet.address,
)
print(f"Session active: {is_active}")  # False
```

## Full Example

Here's the complete script:

```python
import asyncio
import time
from qfc import QfcProvider, Wallet, Contract
from qfc.utils import parse_qfc, format_qfc
from qfc.constants import NETWORKS

AGENT_REGISTRY = "0x7791dfa4d489f3d524708cbc0caa8689b76322b3"

REGISTRY_ABI = [
    "function registerAgent(address agent, bytes32 name, uint256 dailyLimit)",
    "function issueSessionKey(address agent, address key, uint256 expiry)",
    "function getAgentInfo(address agent) view returns (address owner, bytes32 name, uint256 dailyLimit, uint256 spentToday, bool active)",
]

async def main():
    provider = QfcProvider(NETWORKS["testnet"]["rpc_url"])
    owner = Wallet("0xYOUR_PRIVATE_KEY", provider)

    # 1. Create agent wallet
    agent_wallet, mnemonic = Wallet.create_random(provider)
    print(f"Agent: {agent_wallet.address}")

    # 2. Register agent
    registry = Contract(AGENT_REGISTRY, REGISTRY_ABI, owner)
    tx = await registry.register_agent(
        agent_wallet.address,
        b"my-agent".ljust(32, b"\x00"),
        parse_qfc("50"),
    )
    await tx.wait()

    # 3. Fund agent
    tx = await owner.send_transaction(
        to=agent_wallet.address,
        value=parse_qfc("100"),
    )
    await tx.wait()

    # 4. Issue session key
    session_wallet, _ = Wallet.create_random(provider)
    expiry = int(time.time()) + 86400
    tx = await registry.issue_session_key(
        agent_wallet.address,
        session_wallet.address,
        expiry,
    )
    await tx.wait()

    print(f"Session key: {session_wallet.address}")
    print("Agent is ready!")

asyncio.run(main())
```

## Next Steps

- [Agent Wallet Concepts](/core-concepts/agent-wallet) - Permission model and session keys
- [AI Inference](/sdk/python/inference) - Submit inference tasks from your agent
- [Python SDK Overview](/sdk/python/overview) - Full SDK reference
