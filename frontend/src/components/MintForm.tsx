import { useState } from 'react'
import { useSignAndExecuteTransactionBlock, useCurrentAccount } from '@mysten/dapp-kit'
import { TransactionBlock } from '@mysten/sui/transactions'

interface CarModel {
  id: number
  name: string
  speed: string
  imageUrl: string
}

interface MintFormProps {
  selectedModel: number | null
  carModels: CarModel[]
  packageId: string
  onMintSuccess: () => void
}

export default function MintForm({
  selectedModel,
  carModels,
  packageId,
  onMintSuccess,
}: MintFormProps) {
  const account = useCurrentAccount()
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransactionBlock()
  const [carName, setCarName] = useState('')
  const [speed, setSpeed] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!selectedModel) {
      setError('Please select a car model')
      return
    }

    if (!carName.trim()) {
      setError('Please enter a car name')
      return
    }

    const speedNum = parseInt(speed)
    if (isNaN(speedNum) || speedNum < 1 || speedNum > 100) {
      setError('Speed must be between 1 and 100')
      return
    }

    try {
      const tx = new TransactionBlock()
      const nameBytes = new TextEncoder().encode(carName)

      tx.moveCall({
        target: `${packageId}::nft_shop::mint_car_nft`,
        arguments: [
          tx.pure(Array.from(nameBytes)),
          tx.pure(speedNum),
          tx.pure(selectedModel),
        ],
      })

      signAndExecute(
        { transactionBlock: tx },
        {
          onSuccess: (result) => {
            setSuccess(`NFT minted successfully! Digest: ${result.digest.slice(0, 10)}...`)
            setCarName('')
            setSpeed('')
            onMintSuccess()
            setTimeout(() => setSuccess(''), 5000)
          },
          onError: (error) => {
            setError(`Mint failed: ${error.message}`)
          },
        }
      )
    } catch (err: any) {
      setError(`Error: ${err.message}`)
    }
  }

  const selectedCarModel = carModels.find((m) => m.id === selectedModel)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-8">
        <h3 className="text-2xl font-bold mb-6">
          Mint Your <span className="neon-orange">Car NFT</span>
        </h3>

        {selectedCarModel && (
          <div className="bg-black rounded-lg p-4 mb-6 border border-neon-orange">
            <p className="text-gray-400 text-sm mb-2">Selected Model</p>
            <div className="flex items-center gap-4">
              <div className="text-4xl">🏎️</div>
              <div>
                <p className="font-bold text-lg">{selectedCarModel.name}</p>
                <p className="text-neon-orange">Model ID: {selectedCarModel.id}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleMint} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Car Name</label>
            <input
              type="text"
              value={carName}
              onChange={(e) => setCarName(e.target.value)}
              placeholder="e.g., My Speedster Pro"
              className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:border-neon-orange focus:outline-none text-white placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Speed (1-100 km/h)
            </label>
            <input
              type="number"
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              min="1"
              max="100"
              placeholder="e.g., 85"
              className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg focus:border-neon-orange focus:outline-none text-white placeholder-gray-500"
            />
            <p className="text-gray-500 text-xs mt-1">
              Speed determines your car's performance level
            </p>
          </div>

          {error && (
            <div className="bg-red-900 border border-red-700 rounded-lg p-4 text-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-900 border border-green-700 rounded-lg p-4 text-green-200">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={!selectedModel || isPending}
            className="w-full py-3 bg-neon-orange hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-colors neon-glow-hover"
          >
            {isPending ? 'Minting...' : selectedModel ? 'Mint NFT' : 'Select a Model First'}
          </button>
        </form>
      </div>
    </div>
  )
}
