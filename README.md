# QFC Docs

Developer documentation site for QFC Network, built with VitePress.

**Live site**: https://docs.qfc.network

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build static site
npm run build

# Preview build
npm run preview
```

## Structure

```
docs/
├── getting-started/     # Introduction, quick start, installation
├── core-concepts/       # Blockchain basics, PoC, accounts, gas
├── sdk/
│   ├── javascript/      # JS SDK guides
│   └── python/          # Python SDK guides
├── api-reference/       # JSON-RPC, WebSocket, QFC methods
├── smart-contracts/     # Solidity guide, deployment, verification
├── validators/          # Requirements, setup, staking, monitoring
├── tutorials/           # Build DApp, create token, deploy NFT
└── .vitepress/
    └── config.mts       # VitePress configuration
```

## Deployment

Automatically deployed to GitHub Pages on push to `main` via GitHub Actions.

## License

MIT
