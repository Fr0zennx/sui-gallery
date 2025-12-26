import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { MIST_PER_SUI } from '@mysten/sui/utils'

interface MarketplaceProps {
  packageId: string
  userAddress: string
}

interface Listing {
  objectId: string
  nftName: string
  nftSpeed: string
  price: string
  seller: string
}

export default function Marketplace({ packageId, userAddress }: MarketplaceProps) {
  const client = useSuiClient()
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { data: listings, isLoading, refetch } = useQuery({
    queryKey: ['listings', packageId],
    queryFn: async () => {
      try {
        const objects = await client.getDynamicFields({
          parentId: packageId,
        })

        const listingObjects = await Promise.all(
          objects.data.map(async (field: any) => {
            const listingData = await client.getObject({
              id: field.objectId,
              options: { showContent: true },
            })

            const content = listingData.data?.content as any
            if (content?.type?.includes('Listing')) {
              const nft = content.fields?.nft?.fields
              return {
                objectId: field.objectId,
                nftName: nft?.name || 'Unknown',
                nftSpeed: nft?.speed || '0',
                price: content.fields?.price || '0',
                seller: content.fields?.owner || '',
              }
            }
            return null
          })
        )

        return listingObjects.filter((l) => l !== null)
      } catch (err) {
        console.error('Failed to fetch listings:', err)
        return []
      }
    },
  })

  const handlePurchase = (listing: Listing) => {
    try {
      const tx = new Transaction()

      // Split coins for payment
      const [coins] = tx.splitCoins(tx.gas, [tx.pure(BigInt(listing.price))])

      tx.moveCall({
        target: `${packageId}::nft_shop::purchase`,
        arguments: [tx.object(listing.objectId), coins],
        typeArguments: ['0x2::sui::SUI'],
      })

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            setSuccess(`Successfully purchased ${listing.nftName}!`)
            refetch()
            setTimeout(() => setSuccess(''), 5000)
          },
          onError: (err) => {
            setError(`Purchase failed: ${err.message}`)
          },
        }
      )
    } catch (err: any) {
      setError(`Error: ${err.message}`)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin text-4xl mb-4">⚙️</div>
        <p className="text-gray-400">Loading marketplace...</p>
      </div>
    )
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📭</div>
        <p className="text-gray-400">No cars for sale yet</p>
        <p className="text-gray-500 text-sm mt-2">Check back later or list your own NFT</p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">
        Available <span className="neon-orange">Listings</span>
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
        {listings.map((listing) => (
          <div
            key={listing.objectId}
            className="car-card bg-gray-900 rounded-lg border border-gray-700 overflow-hidden p-6 hover:border-neon-orange transition-all"
          >
            <div className="w-full h-40 bg-gradient-to-b from-gray-800 to-black rounded-lg mb-4 flex items-center justify-center">
              <div className="text-5xl">🏎️</div>
            </div>

            <h4 className="text-lg font-bold mb-2">{listing.nftName}</h4>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Speed:</span>
                <span className="neon-orange font-semibold">{listing.nftSpeed} km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Seller:</span>
                <span className="text-gray-300 text-xs">{listing.seller.slice(0, 8)}...</span>
              </div>
              <div className="border-t border-gray-700 pt-2 flex justify-between">
                <span className="text-gray-400">Price:</span>
                <span className="text-lg font-bold neon-orange">
                  {(BigInt(listing.price) / BigInt(MIST_PER_SUI)).toString()} SUI
                </span>
              </div>
            </div>

            <button
              onClick={() => handlePurchase(listing)}
              disabled={isPending || listing.seller === userAddress}
              className="w-full py-3 px-4 bg-neon-orange hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-colors neon-glow-hover"
            >
              {listing.seller === userAddress ? 'Your Listing' : isPending ? 'Processing...' : 'Buy Now'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
