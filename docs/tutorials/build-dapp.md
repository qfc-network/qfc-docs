# Build a DApp

This tutorial walks you through building a simple decentralized application on QFC.

## What We'll Build

A simple "Tip Jar" DApp where users can send tips to a recipient.

## Prerequisites

- Node.js 18+
- Basic knowledge of React and TypeScript
- Some testnet QFC (get from [faucet](https://faucet.testnet.qfc.network))

## Step 1: Create the Project

```bash
# Create a new Vite project
npm create vite@latest qfc-tip-jar -- --template react-ts
cd qfc-tip-jar

# Install dependencies
npm install @qfc/sdk ethers
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Step 2: Configure Tailwind

Edit `tailwind.config.js`:

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
```

Add to `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Step 3: Create the Wallet Context

Create `src/contexts/WalletContext.tsx`:

```tsx
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { QfcProvider, QfcWallet, NETWORKS, formatQfc } from '@qfc/sdk';
import { BrowserProvider } from 'ethers';

interface WalletContextType {
  address: string | null;
  balance: string;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  provider: QfcProvider | null;
  signer: QfcWallet | null;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');
  const [provider, setProvider] = useState<QfcProvider | null>(null);
  const [signer, setSigner] = useState<QfcWallet | null>(null);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      alert('Please install a Web3 wallet');
      return;
    }

    try {
      // Request accounts
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Switch to QFC network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: NETWORKS.testnet.chainIdHex }]
        });
      } catch (switchError: any) {
        // Add network if not exists
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: NETWORKS.testnet.chainIdHex,
              chainName: NETWORKS.testnet.name,
              rpcUrls: [NETWORKS.testnet.rpcUrl],
              nativeCurrency: { name: 'QFC', symbol: 'QFC', decimals: 18 },
              blockExplorerUrls: [NETWORKS.testnet.explorerUrl]
            }]
          });
        }
      }

      // Create provider and signer
      const browserProvider = new BrowserProvider(window.ethereum);
      const ethSigner = await browserProvider.getSigner();

      const qfcProvider = new QfcProvider(NETWORKS.testnet.rpcUrl);
      const qfcWallet = new QfcWallet(
        await ethSigner.signMessage('QFC Auth'),
        qfcProvider
      );

      setAddress(accounts[0]);
      setProvider(qfcProvider);
      setSigner(qfcWallet);

      // Get balance
      const bal = await qfcProvider.getBalance(accounts[0]);
      setBalance(formatQfc(bal));
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setBalance('0');
    setProvider(null);
    setSigner(null);
  }, []);

  return (
    <WalletContext.Provider value={{
      address,
      balance,
      isConnected: !!address,
      connect,
      disconnect,
      provider,
      signer
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within WalletProvider');
  return context;
}
```

## Step 4: Create the UI Components

Create `src/components/ConnectButton.tsx`:

```tsx
import { useWallet } from '../contexts/WalletContext';
import { shortenAddress } from '@qfc/sdk';

export function ConnectButton() {
  const { isConnected, address, balance, connect, disconnect } = useWallet();

  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">{balance} QFC</span>
        <button
          onClick={disconnect}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          {shortenAddress(address!)}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
    >
      Connect Wallet
    </button>
  );
}
```

Create `src/components/TipJar.tsx`:

```tsx
import { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { parseQfc, isValidAddress } from '@qfc/sdk';

const RECIPIENT = '0x742d35Cc6634C0532925a3b844Bc9e7595f...'; // Replace with actual

export function TipJar() {
  const { isConnected, signer } = useWallet();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');

  const sendTip = async () => {
    if (!signer || !amount) return;

    try {
      setLoading(true);
      const tx = await signer.sendTransaction({
        to: RECIPIENT,
        value: parseQfc(amount)
      });

      setTxHash(tx.hash);
      await tx.wait();
      setAmount('');
    } catch (error) {
      console.error('Failed to send tip:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center p-8 bg-gray-100 rounded-lg">
        <p>Connect your wallet to send tips</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Send a Tip</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount in QFC"
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <button
          onClick={sendTip}
          disabled={loading || !amount}
          className="px-6 py-2 bg-green-500 text-white rounded-lg
                     hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Tip'}
        </button>
      </div>

      {txHash && (
        <p className="text-sm text-gray-600">
          Transaction: <a
            href={`https://explorer.testnet.qfc.network/tx/${txHash}`}
            target="_blank"
            className="text-blue-500 hover:underline"
          >
            {txHash.slice(0, 10)}...
          </a>
        </p>
      )}
    </div>
  );
}
```

## Step 5: Put It Together

Edit `src/App.tsx`:

```tsx
import { WalletProvider } from './contexts/WalletContext';
import { ConnectButton } from './components/ConnectButton';
import { TipJar } from './components/TipJar';

function App() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="p-4 bg-white shadow-sm flex justify-between items-center">
          <h1 className="text-xl font-bold">QFC Tip Jar</h1>
          <ConnectButton />
        </header>

        <main className="max-w-md mx-auto mt-10 p-4">
          <TipJar />
        </main>
      </div>
    </WalletProvider>
  );
}

export default App;
```

## Step 6: Add Type Declarations

Create `src/vite-env.d.ts`:

```typescript
/// <reference types="vite/client" />

interface Window {
  ethereum?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
  };
}
```

## Step 7: Run the DApp

```bash
npm run dev
```

Visit `http://localhost:5173` and test your DApp!

## Next Steps

- Add transaction history
- Implement a smart contract for the tip jar
- Add multi-token support
- Deploy to production

## Resources

- [Full source code](https://github.com/qfc-network/qfc-tip-jar-example)
- [JavaScript SDK](/sdk/javascript/overview)
- [Smart Contracts](/smart-contracts/deployment)
