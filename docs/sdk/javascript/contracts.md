# Contract Helpers

The SDK provides helper functions for common token standards and contract interactions.

## ERC-20 Tokens

### Get Token Info

```typescript
import { getERC20 } from '@qfc/sdk';

const token = await getERC20('0xTokenAddress...', provider);

console.log('Name:', token.name);
console.log('Symbol:', token.symbol);
console.log('Decimals:', token.decimals);
console.log('Address:', token.address);
```

### Read Operations

```typescript
// Get balance
const balance = await token.balanceOf('0xAddress...');

// Get allowance
const allowance = await token.allowance('0xOwner...', '0xSpender...');

// Get total supply
const totalSupply = await token.totalSupply();
```

### Write Operations

```typescript
// Connect with signer for write operations
const tokenWithSigner = await getERC20('0xToken...', wallet);

// Transfer tokens
const tx = await tokenWithSigner.transfer('0xRecipient...', 1000n);
await tx.wait();

// Approve spending
const approveTx = await tokenWithSigner.approve('0xSpender...', 1000n);
await approveTx.wait();

// Transfer from (requires approval)
const transferFromTx = await tokenWithSigner.transferFrom(
  '0xFrom...',
  '0xTo...',
  500n
);
```

## ERC-721 NFTs

```typescript
import { getERC721 } from '@qfc/sdk';

const nft = await getERC721('0xNFTAddress...', provider);

// Get collection info
console.log('Name:', nft.name);
console.log('Symbol:', nft.symbol);

// Get balance
const balance = await nft.balanceOf('0xAddress...');

// Get owner of token
const owner = await nft.ownerOf(1n);

// Get token URI
const tokenURI = await nft.tokenURI(1n);

// Transfer NFT (with signer)
const nftWithSigner = await getERC721('0xNFT...', wallet);
await nftWithSigner.transferFrom('0xFrom...', '0xTo...', 1n);
```

## ERC-1155 Multi-Token

```typescript
import { getERC1155 } from '@qfc/sdk';

const multiToken = getERC1155('0xAddress...', provider);

// Get balance for specific token ID
const balance = await multiToken.balanceOf('0xAccount...', 1n);

// Get batch balances
const balances = await multiToken.balanceOfBatch(
  ['0xAccount1...', '0xAccount2...'],
  [1n, 2n]
);

// Get token URI
const uri = await multiToken.uri(1n);

// Transfer (with signer)
const multiWithSigner = getERC1155('0xAddress...', wallet);
await multiWithSigner.safeTransferFrom(
  '0xFrom...',
  '0xTo...',
  1n,      // token ID
  100n,    // amount
  '0x'     // data
);
```

## Multicall3

Batch multiple contract calls into a single RPC request:

```typescript
import { getMulticall3, getERC20 } from '@qfc/sdk';

const multicall = getMulticall3(provider);

// Aggregate multiple calls
const token = await getERC20('0xToken...', provider);
const iface = token.contract.interface;

const calls = [
  {
    target: token.address,
    allowFailure: false,
    callData: iface.encodeFunctionData('balanceOf', ['0xAddr1...'])
  },
  {
    target: token.address,
    allowFailure: false,
    callData: iface.encodeFunctionData('balanceOf', ['0xAddr2...'])
  }
];

const results = await multicall.aggregate3(calls);

// Decode results
for (const result of results) {
  if (result.success) {
    const [balance] = iface.decodeFunctionResult('balanceOf', result.returnData);
    console.log('Balance:', balance);
  }
}
```

### Utility Methods

```typescript
// Get ETH balance
const balance = await multicall.getEthBalance('0x...');

// Get block number
const blockNumber = await multicall.getBlockNumber();

// Get timestamp
const timestamp = await multicall.getCurrentBlockTimestamp();
```

## Custom Contracts

```typescript
import { createContract } from '@qfc/sdk';

const abi = [
  'function myMethod(uint256 x) view returns (uint256)',
  'function doSomething(address to, uint256 amount)'
];

const contract = createContract('0xAddress...', abi, provider);

// Read
const result = await contract.myMethod(123n);

// Write (with signer)
const contractWithSigner = createContract('0xAddress...', abi, wallet);
const tx = await contractWithSigner.doSomething('0x...', 1000n);
await tx.wait();
```

## Check if Address is Contract

```typescript
import { isContract } from '@qfc/sdk';

const isContractAddress = await isContract('0x...', provider);
console.log('Is contract:', isContractAddress);
```

## Next Steps

- [Staking](/sdk/javascript/staking) - Staking operations
- [Utilities](/sdk/javascript/utilities) - Helper functions
- [Deploy Contract](/smart-contracts/deployment) - Deploy your own
