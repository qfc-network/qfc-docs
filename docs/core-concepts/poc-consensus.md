# Proof of Contribution (PoC) Consensus

QFC uses a novel consensus mechanism called Proof of Contribution (PoC) that rewards validators based on their multi-dimensional contributions to the network.

## Overview

Unlike traditional Proof of Stake (PoS) which primarily considers staked tokens, PoC evaluates validators across seven dimensions:

| Dimension | Weight | Description |
|-----------|--------|-------------|
| **Staking** | 30% | Amount of QFC tokens staked |
| **Compute** | 20% | Computational resources provided |
| **Uptime** | 15% | Node availability and reliability |
| **Accuracy** | 15% | Validation accuracy and correctness |
| **Network** | 10% | Network quality and latency |
| **Storage** | 5% | Storage capacity contributed |
| **Reputation** | 5% | Historical performance and behavior |

## Contribution Score

Each validator's contribution score is calculated as:

```
Score = Σ (dimension_weight × dimension_score)
```

Where each dimension score is normalized between 0 and 1.

### Example Calculation

```
Validator A:
- Staking:    0.8 × 0.30 = 0.240
- Compute:    0.9 × 0.20 = 0.180
- Uptime:     0.95 × 0.15 = 0.143
- Accuracy:   0.98 × 0.15 = 0.147
- Network:    0.85 × 0.10 = 0.085
- Storage:    0.7 × 0.05 = 0.035
- Reputation: 0.9 × 0.05 = 0.045
─────────────────────────────────
Total Score: 0.875
```

## Block Producer Selection

Block producers are selected using a Verifiable Random Function (VRF) weighted by contribution scores:

1. **VRF Generation**: Each validator generates a VRF proof using the previous block hash
2. **Weighted Selection**: Selection probability is proportional to contribution score
3. **Verification**: Other nodes verify the VRF proof

```
P(selected) = contribution_score / total_contribution_scores
```

## Epoch System

QFC operates in epochs:

- **Epoch Duration**: 100 blocks (~5 minutes)
- **Validator Set Update**: At epoch boundaries
- **Score Recalculation**: Every epoch

At the end of each epoch:
1. Contribution scores are recalculated
2. Validator set is updated (joining/leaving)
3. Rewards are distributed

## Finality

QFC uses a two-phase commit for fast finality:

### Phase 1: Proposal
- Block producer creates and broadcasts block
- Validators receive and validate the block

### Phase 2: Voting
- Validators vote on the block (>2/3 required)
- Block is finalized when supermajority is reached

**Finality time**: < 0.3 seconds (single block confirmation)

## Slashing

Validators can be slashed for malicious behavior:

| Violation | Penalty |
|-----------|---------|
| Double signing | 5% stake |
| Prolonged downtime (>24h) | 1% stake |
| Invalid block proposal | 2% stake |
| Censorship (proven) | 10% stake |

Slashed tokens are burned (removed from circulation).

## Rewards

Block rewards are distributed based on contribution:

```
validator_reward = block_reward × (validator_score / total_scores)
```

Additionally:
- **Delegator Rewards**: Distributed proportionally to delegated amount
- **Commission**: Validators take a commission (0-100%) from delegator rewards

## Dynamic Weight Adjustment

In certain network conditions, dimension weights can be adjusted:

### High Congestion
When transaction volume is high:
- Compute weight increases
- Network weight increases
- Staking weight decreases slightly

### Attack Detection
When potential attacks are detected:
- Accuracy weight increases
- Reputation weight increases
- Quick response to malicious actors

## Becoming a Validator

Requirements:
- Minimum stake: 10,000 QFC
- Reliable hardware (see [Requirements](/validators/requirements))
- 99%+ uptime commitment

```typescript
// Register as validator
await wallet.registerValidator(
  10,                    // 10% commission
  'my-validator',        // moniker
  parseQfc('10000')      // stake
);
```

## Delegating

Anyone can delegate to validators:

```typescript
// Delegate to validator
await wallet.delegate(
  '0xValidatorAddress',
  parseQfc('1000')       // minimum 100 QFC
);

// Check rewards
const delegation = await wallet.getDelegation('0xValidator');
console.log('Pending rewards:', formatQfc(delegation.pendingRewards));

// Claim rewards
await wallet.claimRewards();
```

## Comparison with Other Consensus

| Feature | PoC (QFC) | PoS (Ethereum) | DPoS (EOS) |
|---------|-----------|----------------|------------|
| Selection Criteria | Multi-dimensional | Stake only | Elected delegates |
| Validator Count | Unlimited | ~500k | 21 |
| Finality | < 0.3s | ~15 min | ~0.5s |
| Energy Efficient | Yes | Yes | Yes |
| Decentralization | High | High | Medium |

## Security Properties

1. **Sybil Resistance**: Staking requirement prevents cheap identity creation
2. **Nothing-at-Stake**: Slashing makes attacking expensive
3. **Long-Range Attacks**: Checkpoint system prevents history rewriting
4. **Censorship Resistance**: Multi-dimensional scoring prevents monopoly

## Next Steps

- [Become a Validator](/validators/setup-guide)
- [Staking Guide](/validators/staking)
- [Blockchain Basics](/core-concepts/blockchain-basics)
