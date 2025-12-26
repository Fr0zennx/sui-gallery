import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSuiClient, useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit'
import { TransactionBlock } from '@mysten/sui/transactions'

interface MyGarageProps {
  packageId: string
  userAddress: string
}

interface CarNFT {
  objectId: string
  name: string
  speed: string
  imageUrl: string
}

export default function MyGarage({ packageId, userAddress }: MyGarageProps) {
  const client = useSuiClient()
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock()
  const [listingPrices, setListingPrices] = useState<{ [key: string]: string }>({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { data: nfts, isLoading } = useQuery({
    queryKey: ['myNFTs', userAddress],
    queryFn: async () => {
      try {
        const objects = await client.getOwnedObjects({
          owner: userAddress,
          filter: {
            StructType: `${packageId}::nft_shop::CarNFT`,
          },
        })

        const nftDetails = await Promise.all(
          objects.data.map(async (obj) => {
            const details = await client.getObject({
              id: obj.objectId,
              options: { showContent: true },
            })
            const content = details.data?.content as any
            return {
              objectId: obj.objectId,
              name: content?.fields?.name || 'Unknown',
              speed: content?.fields?.speed || '0',
              imageUrl: content?.fields?.image_url || '',
            }
          })
        )

        return nftDetails
      } catch (err) {
        console.error('Failed to fetch NFTs:', err)
        return []
      }
    },
  })

  const handleListForSale = (nftId: string) => {
    const price = listingPrices[nftId]
    if (!price || isNaN(Number(price))) {
      setError('Please enter a valid price')
      return
    }

    const tx = new TransactionBlock()

    tx.moveCall({
      target: `${packageId}::nft_shop::list_for_sale`,
      arguments: [
        tx.object(nftId),
        tx.pure(BigInt(price)),
      ],
    })

    signAndExecute(
      { transactionBlock: tx },
      {
        onSuccess: () => {
          setSuccess('NFT listed for sale!')
          setListingPrices({ ...listingPrices, [nftId]: '' })
          setTimeout(() => setSuccess(''), 5000)
        },
        onError: (err) => {
          setError(`Failed to list: ${err.message}`)
        },
      }
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin text-4xl mb-4">⚙️</div>
        <p className="text-gray-400">Loading your garage...</p>
      </div>
    )
  }

  if (!nfts || nfts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏚️</div>
        <p className="text-gray-400">Your garage is empty</p>
        <p className="text-gray-500 text-sm mt-2">Mint your first Car NFT to get started</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">
        My <span className="neon-orange">Garage</span>
      </h3>

      {error && (
        <div className="bg-red-900 border border-red-700 rounded-lg p-4 text-red-200 mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900 border border-green-700 rounded-lg p-4 text-green-200 mb-6">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nfts.map((nft) => (
          <div
            key={nft.objectId}
            className="car-card bg-gray-900 rounded-lg border border-gray-700 overflow-hidden p-6"
          >
            <div className="w-full h-40 bg-gradient-to-b from-gray-800 to-black rounded-lg mb-4 flex items-center justify-center">
              <div className="text-5xl">🏎️</div>
            </div>

            <h4 className="text-lg font-bold mb-2">{nft.name}</h4>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Speed:</span>
                <span className="neon-orange font-semibold">{nft.speed} km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">ID:</span>
                <span className="text-gray-300 text-xs">{nft.objectId.slice(0, 8)}...</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-400">List Price (SUI)</label>
              <input
                type="number"
                min="0"
                placeholder="Enter price"
                value={listingPrices[nft.objectId] || ''}
                onChange={(e) =>
                  setListingPrices({
                    ...listingPrices,
                    [nft.objectId]: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-black border border-gray-600 rounded-lg focus:border-neon-orange focus:outline-none text-white text-sm"
              />
              <button
                onClick={() => handleListForSale(nft.objectId)}
                className="w-full py-2 px-3 bg-neon-orange hover:bg-orange-600 text-black font-semibold rounded-lg transition-colors text-sm neon-glow-hover"
              >
                Sell on Market
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
