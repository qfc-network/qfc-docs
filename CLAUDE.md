# QFC Documentation Site

基于 VitePress 的 QFC 区块链开发者文档站点。

## 目录结构

```
qfc-docs/
├── docs/
│   ├── .vitepress/
│   │   └── config.ts           # VitePress 配置
│   ├── index.md                # 首页
│   ├── getting-started/        # 入门指南
│   │   ├── introduction.md
│   │   ├── quick-start.md
│   │   └── installation.md
│   ├── core-concepts/          # 核心概念
│   │   ├── blockchain-basics.md
│   │   ├── poc-consensus.md
│   │   ├── accounts-and-keys.md
│   │   ├── transactions.md
│   │   └── gas-and-fees.md
│   ├── sdk/                    # SDK 文档
│   │   ├── javascript/
│   │   │   ├── overview.md
│   │   │   ├── provider.md
│   │   │   ├── wallet.md
│   │   │   ├── contracts.md
│   │   │   ├── staking.md
│   │   │   └── utilities.md
│   │   └── python/
│   ├── api-reference/          # API 参考
│   │   ├── json-rpc.md
│   │   ├── websocket.md
│   │   └── qfc-methods.md
│   ├── smart-contracts/        # 智能合约
│   │   ├── solidity-guide.md
│   │   ├── deployment.md
│   │   ├── verification.md
│   │   └── best-practices.md
│   ├── validators/             # 验证者
│   │   ├── requirements.md
│   │   ├── setup-guide.md
│   │   ├── staking.md
│   │   └── monitoring.md
│   └── tutorials/              # 教程
│       ├── build-dapp.md
│       ├── create-token.md
│       ├── integrate-wallet.md
│       └── deploy-nft.md
└── package.json
```

## 常用命令

```bash
# 安装依赖
npm install

# 开发模式 (热重载)
npm run dev

# 构建静态站点
npm run build

# 预览构建结果
npm run preview
```

## 技术栈

- **框架**: VitePress 1.0
- **前端**: Vue 3
- **语言**: TypeScript/Markdown

## 添加新页面

1. 在对应目录创建 `.md` 文件
2. 在 `docs/.vitepress/config.ts` 的 `sidebar` 中添加链接
3. 运行 `npm run dev` 预览

## 文档规范

- 使用 Markdown 编写
- 代码块指定语言 (```typescript, ```bash 等)
- 使用 :::tip, :::warning, :::danger 提示框
- 保持文档简洁，提供代码示例

## 部署

构建后的静态文件在 `docs/.vitepress/dist/`，可部署到:
- Vercel
- Netlify
- GitHub Pages
- 任何静态托管服务

## 相关仓库

- `qfc-sdk-js` - JavaScript SDK (文档来源)
- `qfc-core` - 核心区块链 (API 参考来源)
- `qfc-wallet` - 钱包集成参考
