import { useState, useEffect } from 'react';
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID, MODULE_NAME } from '../constants';

interface CarNFT {
  id: string;
  name: string;
  image_url: string;
  speed: number;
}

export default function MyNFTs() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const [nfts, setNfts] = useState<CarNFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [listingPrices, setListingPrices] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (currentAccount?.address) {
      fetchMyNFTs();
    }
  }, [currentAccount]);

  const fetchMyNFTs = async () => {
    if (!currentAccount?.address) return;

    setLoading(true);
    try {
      const objects = await suiClient.getOwnedObjects({
        owner: currentAccount.address,
        filter: {
          StructType: `${PACKAGE_ID}::${MODULE_NAME}::Car`,
        },
        options: {
          showContent: true,
          showType: true,
        },
      });

      const cars: CarNFT[] = [];
      for (const obj of objects.data) {
        if (obj.data?.content && 'fields' in obj.data.content) {
          const fields = obj.data.content.fields as any;
          const imageUrl = fields.image_url || '';
          
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
            id: obj.data.objectId,
            name: fields.name || 'Unknown Car',
            image_url: mappedImageUrl,
            speed: fields.speed || 0,
          });
        }
      }

      setNfts(cars);
    } catch (error) {
      console.error('NFT getirme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleList = async (carId: string) => {
    const priceStr = listingPrices[carId];
    if (!priceStr || parseFloat(priceStr) <= 0) {
      alert('Please enter a valid price!');
      return;
    }

    const priceInMist = Math.floor(parseFloat(priceStr) * 1_000_000_000); // SUI to MIST

    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::list_car`,
        arguments: [
          tx.object(carId),
          tx.pure.u64(priceInMist),
        ],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => {
            alert('✅ Car listed on marketplace!');
            fetchMyNFTs();
          },
          onError: (error) => {
            console.error('Listing error:', error);
            alert('❌ Listing failed: ' + error.message);
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
        <p className="text-gray-400">Loading NFTs...</p>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">🚗</div>
        <p className="text-gray-400 text-lg">You don't have any cars yet.</p>
        <p className="text-gray-500 text-sm mt-2">Mint a new car from above!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {nfts.map((car) => (
        <div key={car.id} className="card">
          <div className="aspect-video bg-gray-800 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
            <img
              src={car.image_url}
              alt={car.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="text-6xl" style={{ display: 'none' }}>🏎️</div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">{car.name}</h3>
          
          <div className="flex items-center justify-between mb-4 text-sm">
            <span className="text-gray-400">Speed:</span>
            <span className="text-racing-accent font-bold">{car.speed} km/h</span>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <label className="block text-sm text-gray-400 mb-2">
              Listing Price (SUI)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.1"
                min="0.1"
                placeholder="0.5"
                value={listingPrices[car.id] || ''}
                onChange={(e) =>
                  setListingPrices({ ...listingPrices, [car.id]: e.target.value })
                }
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-racing-accent focus:outline-none"
              />
              <button
                onClick={() => handleList(car.id)}
                className="btn-secondary whitespace-nowrap"
              >
                List 📋
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
