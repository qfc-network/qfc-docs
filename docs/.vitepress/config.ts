import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'QFC Blockchain',
  description: 'Developer Documentation for QFC Blockchain',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#4fc3f7' }],
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Home', link: 'https://qfc.network' },
      { text: 'Guide', link: '/getting-started/introduction' },
      { text: 'SDK', link: '/sdk/javascript/overview' },
      { text: 'API', link: '/api-reference/json-rpc' },
      { text: 'Tutorials', link: '/tutorials/build-dapp' },
      {
        text: 'Resources',
        items: [
          { text: 'Explorer', link: 'https://explorer.testnet.qfc.network' },
          { text: 'Faucet', link: 'https://faucet.testnet.qfc.network' },
          { text: 'GitHub', link: 'https://github.com/qfc-network' },
        ]
      }
    ],

    sidebar: {
      '/getting-started/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/getting-started/introduction' },
            { text: 'Quick Start', link: '/getting-started/quick-start' },
            { text: 'Installation', link: '/getting-started/installation' },
          ]
        }
      ],
      '/core-concepts/': [
        {
          text: 'Core Concepts',
          items: [
            { text: 'Blockchain Basics', link: '/core-concepts/blockchain-basics' },
            { text: 'PoC Consensus', link: '/core-concepts/poc-consensus' },
            { text: 'AI Inference', link: '/core-concepts/ai-inference' },
            { text: 'Accounts & Keys', link: '/core-concepts/accounts-and-keys' },
            { text: 'Transactions', link: '/core-concepts/transactions' },
            { text: 'Gas & Fees', link: '/core-concepts/gas-and-fees' },
          ]
        }
      ],
      '/sdk/': [
        {
          text: 'JavaScript SDK',
          items: [
            { text: 'Overview', link: '/sdk/javascript/overview' },
            { text: 'Provider', link: '/sdk/javascript/provider' },
            { text: 'Wallet', link: '/sdk/javascript/wallet' },
            { text: 'Contracts', link: '/sdk/javascript/contracts' },
            { text: 'Staking', link: '/sdk/javascript/staking' },
            { text: 'Utilities', link: '/sdk/javascript/utilities' },
          ]
        },
        {
          text: 'Python SDK',
          items: [
            { text: 'Overview', link: '/sdk/python/overview' },
          ]
        }
      ],
      '/api-reference/': [
        {
          text: 'API Reference',
          items: [
            { text: 'JSON-RPC', link: '/api-reference/json-rpc' },
            { text: 'WebSocket', link: '/api-reference/websocket' },
            { text: 'QFC Methods', link: '/api-reference/qfc-methods' },
          ]
        }
      ],
      '/smart-contracts/': [
        {
          text: 'Smart Contracts',
          items: [
            { text: 'Solidity Guide', link: '/smart-contracts/solidity-guide' },
            { text: 'Deployment', link: '/smart-contracts/deployment' },
            { text: 'Verification', link: '/smart-contracts/verification' },
            { text: 'Best Practices', link: '/smart-contracts/best-practices' },
          ]
        }
      ],
      '/validators/': [
        {
          text: 'Validators',
          items: [
            { text: 'Requirements', link: '/validators/requirements' },
            { text: 'Setup Guide', link: '/validators/setup-guide' },
            { text: 'Staking', link: '/validators/staking' },
            { text: 'Monitoring', link: '/validators/monitoring' },
          ]
        }
      ],
      '/tutorials/': [
        {
          text: 'Tutorials',
          items: [
            { text: 'Build a DApp', link: '/tutorials/build-dapp' },
            { text: 'Create a Token', link: '/tutorials/create-token' },
            { text: 'Integrate Wallet', link: '/tutorials/integrate-wallet' },
            { text: 'Deploy NFT', link: '/tutorials/deploy-nft' },
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/qfc-network' },
      { icon: 'twitter', link: 'https://twitter.com/qfc_network' },
      { icon: 'discord', link: 'https://discord.gg/qfc' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-2026 QFC Network'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/qfc-network/qfc-docs/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    }
  },

  ignoreDeadLinks: true,

  markdown: {
    lineNumbers: true
  },

  lastUpdated: true,
})
