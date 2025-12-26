import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import MintCar from './components/MintCar';
import Marketplace from './components/Marketplace';
import MyNFTs from './components/MyNFTs';

function App() {
  const currentAccount = useCurrentAccount();

  return (
    <div className="min-h-screen bg-dark-gradient">
      {/* Header */}
      <header className="border-b border-gray-800 bg-racing-darker/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🏎️</span>
            <div>
              <h1 className="text-2xl font-bold bg-racing-gradient bg-clip-text text-transparent">
                Car NFT Marketplace
              </h1>
              <p className="text-sm text-gray-400">Powered by Sui Blockchain</p>
            </div>
          </div>
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
          <div className="space-y-12">
            {/* Mint Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">⚡</span>
                <h2 className="text-3xl font-bold text-white">Mint New Car</h2>
              </div>
              <MintCar />
            </section>

            {/* My NFTs Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🔑</span>
                <h2 className="text-3xl font-bold text-white">My NFTs</h2>
              </div>
              <MyNFTs />
            </section>

            {/* Marketplace Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🛒</span>
                <h2 className="text-3xl font-bold text-white">Marketplace</h2>
              </div>
              <Marketplace />
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16 py-6 text-center text-gray-500">
        <p>Built with ❤️ on Sui Network</p>
      </footer>
    </div>
  );
}

export default App;
