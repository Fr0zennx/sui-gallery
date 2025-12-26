import { useState, useEffect } from 'react';
import { useSuiClient, useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID, MODULE_NAME } from '../constants';

interface ListedCar {
  listingId: string;
  carId: string;
  name: string;
  image_url: string;
  speed: number;
  price: number;
  seller: string;
}

export default function Marketplace() {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const [listings, setListings] = useState<ListedCar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
    // Her 10 saniyede bir yenile
    const interval = setInterval(fetchListings, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      // CarListed event'larını query et
      const events = await suiClient.queryEvents({
        query: {
          MoveEventType: `${PACKAGE_ID}::${MODULE_NAME}::CarListed`,
        },
        limit: 50,
        order: 'descending',
      });

      const cars: ListedCar[] = [];
      const processedListings = new Set<string>();

      for (const event of events.data) {
        const eventData = event.parsedJson as any;
        const listingId = eventData.listing_id;

        // Aynı listing'i iki kere eklemeyelim
        if (processedListings.has(listingId)) continue;

        try {
          // Listing objesini getir
          const listingObj = await suiClient.getObject({
            id: listingId,
            options: { showContent: true },
          });

          if (listingObj.data?.content && 'fields' in listingObj.data.content) {
            const fields = listingObj.data.content.fields as any;
            const carFields = fields.car?.fields || {};
            const imageUrl = carFields.image_url || '';
            
            // IPFS URL'lerini Unsplash ile değiştir
            let mappedImageUrl = imageUrl;
            if (imageUrl.includes('QmX_RedSpeedster')) {
              mappedImageUrl = 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop';
            } else if (imageUrl.includes('QmY_MidnightDrifter')) {
              mappedImageUrl = 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&h=600&fit=crop';
            } else if (imageUrl.includes('QmZ_DesertNomad')) {
              mappedImageUrl = 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop';
            }

            cars.push({
              listingId,
              carId: carFields.id?.id || '',
              name: carFields.name || 'Unknown Car',
              image_url: mappedImageUrl,
              speed: parseInt(carFields.speed || '0'),
              price: parseInt(fields.price || '0'),
              seller: fields.seller || '',
            });

            processedListings.add(listingId);
          }
        } catch (err) {
          // Listing artık mevcut değil (satılmış olabilir)
          continue;
        }
      }

      setListings(cars);
    } catch (error) {
      console.error('Marketplace getirme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (listing: ListedCar) => {
    if (!currentAccount?.address) {
      alert('Please connect your wallet!');
      return;
    }

    if (listing.seller === currentAccount.address) {
      alert('You cannot buy your own NFT!');
      return;
    }

    try {
      const tx = new Transaction();

      // SUI coin'i böl (split)
      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(listing.price)]);

      // buy_car fonksiyonunu çağır
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::buy_car`,
        arguments: [
          tx.object(listing.listingId),
          coin,
        ],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            alert('🎉 Car successfully purchased!');
            fetchListings();
          },
          onError: (error) => {
            console.error('Purchase error:', error);
            alert('❌ Purchase failed: ' + error.message);
          },
        }
      );
    } catch (error) {
      console.error('Transaction error:', error);
      alert('❌ Transaction error: ' + (error as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin text-6xl mb-4">⚙️</div>
        <p className="text-gray-400">Loading marketplace...</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">🛒</div>
        <p className="text-gray-400 text-lg">No cars for sale right now.</p>
        <p className="text-gray-500 text-sm mt-2">Be the first to list!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => {
        const priceInSUI = (listing.price / 1_000_000_000).toFixed(2);
        const isOwnListing = listing.seller === currentAccount?.address;

        return (
          <div key={listing.listingId} className="card relative">
            {isOwnListing && (
              <div className="absolute top-4 right-4 bg-racing-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                YOUR LISTING
              </div>
            )}

            <div className="aspect-video bg-gray-800 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
              <img
                src={listing.image_url}
                alt={listing.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="text-6xl" style={{ display: 'none' }}>🏎️</div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{listing.name}</h3>
            
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Speed:</span>
                <span className="text-racing-accent font-bold">{listing.speed} km/h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Seller:</span>
                <span className="text-gray-300 font-mono text-xs">
                  {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400">Price:</span>
                <span className="text-2xl font-bold text-racing-gold">
                  {priceInSUI} SUI
                </span>
              </div>
              
              <button
                onClick={() => handleBuy(listing)}
                disabled={isOwnListing}
                className="btn-primary w-full"
              >
                {isOwnListing ? '🔒 Your Listing' : '🛒 Buy Now'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
