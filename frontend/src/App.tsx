import { ConnectButton } from '@mysten/dapp-kit';
import { useState } from 'react';
import 'tailwindcss/tailwind.css';
import MintCar from './components/MintCar';
import Marketplace from './components/Marketplace';
import MyNFTs from './components/MyNFTs';

const networks = [
  { name: 'Testnet', value: 'testnet' },
  { name: 'Mainnet', value: 'mainnet' },
];

function App() {
  const [network, setNetwork] = useState('testnet');

  return (
    <div className="min-h-screen bg-dark-gradient">
      {/* Header */}
      <header className="w-full px-4 py-6 flex items-center justify-between bg-dark-gray border-b border-neon">
        <h1 className="text-2xl font-bold text-neon tracking-wide">
          Sui Garage & Marketplace
        </h1>
        <div className="flex items-center gap-4">
          <select
            value={network}
            onChange={e => setNetwork(e.target.value)}
            className="bg-dark-gray border border-neon text-neon px-3 py-1 rounded focus:outline-none"
          >
            {networks.map(n => (
              <option key={n.value} value={n.value}>
                {n.name}
              </option>
            ))}
          </select>
          <ConnectButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!currentAccount ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="text-8xl mb-6">🏁</div>
            <h2 className="text-4xl font-bold mb-4 bg-racing-gradient bg-clip-text text-transparent">
              Ready to Race?
            </h2>
            <p className="text-gray-400 mb-8 max-w-md">
              Mint unique car NFTs, list them on the marketplace, or buy from others.
              Connect your wallet to get started!
            </p>
            <ConnectButton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <section className="md:col-span-2">
              <Marketplace />
            </section>
            <aside className="space-y-8">
              <MintCar />
              <MyNFTs />
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;