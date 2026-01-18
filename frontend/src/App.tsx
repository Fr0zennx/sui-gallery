import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import MintCar from './components/MintCar';
import Marketplace from './components/Marketplace';
import MyNFTs from './components/MyNFTs';
import EventFeed from './components/EventFeed';
import Dashboard from './components/Dashboard';

function App() {
  const currentAccount = useCurrentAccount();

  return (
    <div className="min-h-screen bg-surface-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-zinc-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-white">Sui Garage</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="badge bg-zinc-800 text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Testnet
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8">
        {!currentAccount ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center mb-8">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17h8M8 17v-4m8 4v-4m-8 4H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3M8 13V9m8 4V9" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Car NFT Marketplace
            </h1>
            <p className="text-zinc-400 max-w-md mb-8">
              Mint, collect, and trade unique car NFTs on Sui Network.
            </p>
            <ConnectButton />
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <Dashboard />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Marketplace />
              </div>
              <div className="space-y-6">
                <MintCar />
                <MyNFTs />
              </div>
            </div>

            <EventFeed />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;