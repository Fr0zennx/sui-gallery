import { useConnectWallet } from '@mysten/dapp-kit'

export default function ConnectWallet() {
  const { mutate: connect, isPending } = useConnectWallet()

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
          <button
            onClick={() => connect()}
            disabled={isPending}
            className="w-full px-8 py-3 bg-neon-orange hover:bg-orange-600 disabled:bg-gray-600 text-black font-bold rounded-lg transition-colors neon-glow-hover"
          >
            {isPending ? 'Connecting...' : 'Connect Wallet'}
          </button>
          <p className="text-gray-500 text-sm">
            Supported wallets: Sui Wallet, Ethos, Martian
          </p>
        </div>
      </div>
    </div>
  )
}
