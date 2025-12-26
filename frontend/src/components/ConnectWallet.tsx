import { useWallet } from '@mysten/dapp-kit'

export default function ConnectWallet() {
  const { connect, wallets } = useWallet()

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-8">🏎️</div>
        <h1 className="text-4xl font-bold mb-4">
          Car NFT <span className="neon-orange">Marketplace</span>
        </h1>
        <p className="text-gray-400 mb-8 max-w-md">
          Connect your wallet to start minting and trading unique car NFTs on Sui
        </p>

        <div className="space-y-4">
          {wallets.length > 0 ? (
            wallets.map((wallet) => (
              <button
                key={wallet.name}
                onClick={() => connect(wallet.name)}
                className="w-full px-8 py-3 bg-neon-orange hover:bg-orange-600 text-black font-bold rounded-lg transition-colors neon-glow-hover"
              >
                Connect {wallet.name}
              </button>
            ))
          ) : (
            <p className="text-gray-500">
              No wallets detected. Please install a Sui wallet.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
