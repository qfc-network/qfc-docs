# Cross-Chain Bridge

The QFC bridge enables secure asset transfers between Ethereum and QFC. This page explains the bridge architecture, security model, and how it works.

## Architecture

The QFC bridge uses a **lock-and-mint / burn-and-release** model:

### Ethereum → QFC (Deposit)

1. User sends tokens to the bridge contract on Ethereum
2. Tokens are **locked** in the bridge contract
3. Bridge validators observe the deposit and produce threshold signatures
4. **Wrapped tokens** are minted on QFC and sent to the recipient

### QFC → Ethereum (Withdrawal)

1. User burns wrapped tokens on QFC via the bridge contract
2. Bridge validators observe the burn and produce threshold signatures
3. User submits the signed withdrawal proof to Ethereum
4. Original tokens are **released** from the bridge contract to the recipient

```
Ethereum                          QFC
┌─────────────────┐         ┌─────────────────┐
│  Bridge Contract │         │  Bridge Contract │
│                 │         │                 │
│  lock(token) ───┼────→────┼──→ mint(wToken) │
│                 │  validators  │              │
│  release(token)←┼────←────┼──← burn(wToken) │
└─────────────────┘         └─────────────────┘
```

## Validator Set

The bridge is secured by a dedicated set of bridge validators, selected from the QFC validator set based on contribution score and stake.

### Composition

- **21 bridge validators** are selected each epoch
- Validators must meet minimum stake and uptime requirements
- Selection is weighted by contribution score (see [PoC Consensus](/core-concepts/poc-consensus))

### Threshold Signatures

The bridge uses a **t-of-n threshold signature scheme** (currently 14-of-21):

- Each bridge validator holds a share of the bridge signing key
- At least 14 validators must sign to authorize a mint or release
- No single validator (or minority coalition) can forge a valid signature
- Key shares are refreshed each epoch via distributed key generation (DKG)

```typescript
// Threshold parameters
const VALIDATOR_COUNT = 21;
const THRESHOLD = 14;  // ⌈2/3 × 21⌉

// A deposit is authorized when:
// signatures.length >= THRESHOLD
```

## Security Model

### Trust Assumptions

The bridge is secure as long as fewer than 1/3 of bridge validators are compromised. Specifically:

- **Liveness**: At least 14 of 21 validators must be online to process bridge operations
- **Safety**: An attacker would need to compromise at least 14 validators to forge a fraudulent mint or release
- **Economic security**: Bridge validators have significant QFC stake at risk, which is slashed for misbehavior

### Slashing Conditions

Bridge validators are slashed for:

| Offense | Penalty |
|---------|---------|
| Signing an invalid deposit/withdrawal | 100% stake slash + permanent ban |
| Double-signing (conflicting operations) | 50% stake slash |
| Extended downtime (>1 hour) | 1% stake slash per hour |
| Failing to participate in DKG | 5% stake slash |

### Additional Safeguards

- **Rate limiting**: Maximum bridge throughput is capped per epoch to limit damage from a potential exploit
- **Withdrawal delay**: Large withdrawals (>1000 ETH equivalent) have a 24-hour delay, allowing validators to halt the bridge if fraud is detected
- **Emergency pause**: Bridge can be paused by a 2/3 validator vote if anomalous activity is detected
- **Ethereum finality**: Deposits require 64 Ethereum block confirmations (~13 minutes) to prevent reorg-based attacks

## Confirmation Requirements

### Deposits (Ethereum → QFC)

| Stage | Requirement | Estimated Time |
|-------|-------------|----------------|
| Ethereum confirmations | 64 blocks | ~13 minutes |
| Validator signatures | 14 of 21 | ~1 minute |
| QFC minting | 1 QFC block | ~3 seconds |
| **Total** | | **~15 minutes** |

### Withdrawals (QFC → Ethereum)

| Stage | Requirement | Estimated Time |
|-------|-------------|----------------|
| QFC finality | Sub-second | < 1 second |
| Validator signatures | 14 of 21 | ~1 minute |
| Ethereum submission | User submits proof | User-dependent |
| Ethereum confirmations | 1 block | ~12 seconds |
| **Total** | | **~2 minutes + user action** |

:::warning
Large withdrawals exceeding 1000 ETH equivalent are subject to an additional 24-hour security delay.
:::

## Supported Assets

| Asset | Type | Ethereum Address | QFC Wrapped Address |
|-------|------|-----------------|-------------------|
| ETH | Native | — | `0xWrappedETH...` |
| USDC | ERC-20 | `0xA0b8699...` | `0xWrappedUSDC...` |
| USDT | ERC-20 | `0xdAC17F9...` | `0xWrappedUSDT...` |
| WBTC | ERC-20 | `0x2260FA...` | `0xWrappedWBTC...` |

New assets can be added through QFC governance proposals.

## Next Steps

- [Bridge API Reference](/api-reference/bridge) - RPC methods for querying bridge state
- [Bridge Tutorial](/tutorials/bridge-assets) - Step-by-step bridging guide
- [PoC Consensus](/core-concepts/poc-consensus) - How bridge validators are selected
