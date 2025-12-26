import { useState, useEffect } from 'react'
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit'
import { useQuery } from '@tanstack/react-query'
import ConnectWallet from './components/ConnectWallet'
import VisualSelector from './components/VisualSelector'
import MintForm from './components/MintForm'
import MyGarage from './components/MyGarage'
import Marketplace from './components/Marketplace'

// Replace with your actual package ID after publishing
const PACKAGE_ID = '0xaddd769b70261c5ca82b96af99268722fc084551adae4b6f7aad408b782eaa0c';

interface CarModel {
  id: number
  name: string
  speed: string
  imageUrl: string
}

const carModels: CarModel[] = [
  {
    id: 1,
    name: 'Red Speedster',
    speed: '95',
    imageUrl: 'https://gold-rare-gecko-531.mypinata.cloud/ipfs/QmX_RedSpeedster',
  },
  {
    id: 2,
    name: 'Midnight Drifter',
    speed: '85',
    imageUrl: 'https://gold-rare-gecko-531.mypinata.cloud/ipfs/QmY_MidnightDrifter',
  },
  {
    id: 3,
    name: 'Desert Nomad',
    speed: '75',
    imageUrl: 'https://gold-rare-gecko-531.mypinata.cloud/ipfs/QmZ_DesertNomad',
  },
]

function App() {
  const account = useCurrentAccount()
  const client = useSuiClient()
  const [selectedModel, setSelectedModel] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'mint' | 'garage' | 'marketplace'>('mint')

  if (!account) {
    return <ConnectWallet />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-neon-orange bg-black/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold neon-orange">🏎️</div>
            <h1 className="text-3xl font-bold">
              Car NFT <span className="neon-orange">Marketplace</span>
            </h1>
          </div>
          <div className="text-sm text-gray-400">
            {account.address.slice(0, 8)}...{account.address.slice(-4)}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Visual Selector */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            Choose Your <span className="neon-orange">Model</span>
          </h2>
          <VisualSelector
            models={carModels}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
          />
        </section>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('mint')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'mint'
                ? 'neon-orange border-b-2 border-neon-orange'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Mint NFT
          </button>
          <button
            onClick={() => setActiveTab('garage')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'garage'
                ? 'neon-orange border-b-2 border-neon-orange'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            My Garage
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'marketplace'
                ? 'neon-orange border-b-2 border-neon-orange'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Marketplace
          </button>
        </div>

        {/* Tab Content */}
        <div className="animate-fadeIn">
          {activeTab === 'mint' && (
            <MintForm
              selectedModel={selectedModel}
              carModels={carModels}
              packageId={PACKAGE_ID}
              onMintSuccess={() => {
                setSelectedModel(null)
              }}
            />
          )}

          {activeTab === 'garage' && (
            <MyGarage packageId={PACKAGE_ID} userAddress={account.address} />
          )}

          {activeTab === 'marketplace' && (
            <Marketplace packageId={PACKAGE_ID} userAddress={account.address} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 mt-16 py-8 text-center text-gray-500">
        <p>Car NFT Marketplace on Sui Blockchain • Powered by dApp Kit</p>
      </footer>
    </div>
  )
}

export default App
