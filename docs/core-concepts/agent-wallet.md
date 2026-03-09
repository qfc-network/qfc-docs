# AI Agent Wallets

AI Agent wallets allow autonomous AI agents to hold funds, sign transactions, and interact with the QFC blockchain under a controlled permission model.

## What Are Agent Wallets?

An Agent wallet is a standard QFC account registered in the **AgentRegistry** contract. Registration ties the wallet to an owner (a human or multisig), defines spending limits, and enables session keys so the agent can operate without exposing the owner's private key.

## The AgentRegistry Contract

The `AgentRegistry` is deployed at:

| Network | Address |
|---------|---------|
| Testnet | `0x7791dfa4d489f3d524708cbc0caa8689b76322b3` |

The registry tracks every registered agent, its owner, permissions, and session key metadata.

### Key Functions

| Function | Description |
|----------|-------------|
| `registerAgent(address agent, bytes32 name, uint256 dailyLimit)` | Register an agent wallet |
| `revokeAgent(address agent)` | Revoke an agent's registration |
| `setDailyLimit(address agent, uint256 limit)` | Update spending limit |
| `issueSessionKey(address agent, address key, uint256 expiry)` | Issue a session key |
| `revokeSessionKey(address agent, address key)` | Revoke a session key |
| `getAgentInfo(address agent)` | Query agent metadata |
| `isActiveSession(address agent, address key)` | Check if a session key is valid |

## Permission Model

Agent wallets operate under a tiered permission system:

### Owner Permissions
The owner address (set at registration) has full control:
- Register and revoke the agent
- Set and update daily spending limits
- Issue and revoke session keys
- Withdraw funds from the agent wallet

### Agent Permissions
The agent address itself can:
- Send transactions up to the daily spending limit
- Call whitelisted contracts
- Submit AI inference tasks

### Session Key Permissions
Session keys are temporary keys with limited scope:
- Bound to a specific agent
- Have an expiry timestamp
- Inherit the agent's contract whitelist
- Spend within the agent's daily limit

## Session Keys

Session keys solve a critical problem: an AI agent running in the cloud needs to sign transactions, but you don't want to give it your main private key.

```
Owner (cold wallet)
  └── registers Agent
        └── Agent has session key A (expires in 24h)
        └── Agent has session key B (expires in 7d)
```

Each session key is a standard ECDSA key pair. The agent uses it to sign transactions, and the AgentRegistry validates that the key is active and the transaction is within limits.

### Session Key Lifecycle

1. **Issue** — Owner calls `issueSessionKey` with an expiry
2. **Active** — Agent signs transactions using the session key
3. **Expire** — Key becomes invalid after the expiry timestamp
4. **Revoke** — Owner can revoke a key early if compromised

## Daily Spending Limits

Every agent has a configurable daily spending limit (in wei). The registry tracks cumulative spending per UTC day and rejects transactions that would exceed the limit.

```
Daily limit: 100 QFC
├── TX 1: 30 QFC  ✅ (total: 30)
├── TX 2: 50 QFC  ✅ (total: 80)
├── TX 3: 25 QFC  ❌ (would exceed: 105)
└── [Next UTC day — counter resets]
```

## Events

The AgentRegistry emits events for monitoring:

| Event | Emitted When |
|-------|-------------|
| `AgentRegistered(address indexed agent, address indexed owner, bytes32 name)` | Agent is registered |
| `AgentRevoked(address indexed agent)` | Agent is revoked |
| `SessionKeyIssued(address indexed agent, address indexed key, uint256 expiry)` | Session key issued |
| `SessionKeyRevoked(address indexed agent, address indexed key)` | Session key revoked |
| `DailyLimitUpdated(address indexed agent, uint256 newLimit)` | Spending limit changed |

## Next Steps

- [Register an Agent](/tutorials/register-agent) - Step-by-step tutorial
- [Accounts & Keys](/core-concepts/accounts-and-keys) - How QFC accounts work
- [Python SDK](/sdk/python/overview) - Interact programmatically
