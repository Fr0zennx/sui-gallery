import { useState, useEffect } from 'react';
import { useCurrentAccount, useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { MIST_PER_SUI } from '@mysten/sui/utils';
import { PACKAGE_ID, MODULE_NAME, FUNC_LIST_CAR } from '../constants';

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
  const [loading, setLoading] = useState(false);
  const [selectedNft, setSelectedNft] = useState<CarNFT | null>(null);
  const [price, setPrice] = useState('');
  const [isListing, setIsListing] = useState(false);

  useEffect(() => {
    if (currentAccount?.address && PACKAGE_ID !== '<PAKET_IDINIZ>') {
      fetchMyNFTs();
    }
  }, [currentAccount]);

  const fetchMyNFTs = async () => {
    if (!currentAccount?.address) return;
    setLoading(true);
    try {
      const objects = await suiClient.getOwnedObjects({
        owner: currentAccount.address,
        filter: { StructType: `${PACKAGE_ID}::${MODULE_NAME}::Car` },
        options: { showContent: true, showType: true },
      });

      const cars: CarNFT[] = [];
      for (const obj of objects.data) {
        if (obj.data?.content && 'fields' in obj.data.content) {
          const fields = obj.data.content.fields as any;
          const imageUrl = fields.image_url || '';
          let mappedImageUrl = imageUrl;
          if (imageUrl.includes('QmX_RedSpeedster')) mappedImageUrl = 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop';
          else if (imageUrl.includes('QmY_MidnightDrifter')) mappedImageUrl = 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&h=600&fit=crop';
          else if (imageUrl.includes('QmZ_DesertNomad')) mappedImageUrl = 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop';

          cars.push({ id: obj.data.objectId, name: fields.name, image_url: mappedImageUrl, speed: fields.speed });
        }
      }
      setNfts(cars);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleListCar = async () => {
    if (!selectedNft || !price) return;
    setIsListing(true);
    try {
      const tx = new Transaction();
      const priceInMist = BigInt(parseFloat(price) * Number(MIST_PER_SUI));
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNC_LIST_CAR}`,
        arguments: [tx.object(selectedNft.id), tx.pure.u64(priceInMist)],
      });

      signAndExecute(
        { transaction: tx as any },
        {
          onSuccess: () => {
            setSelectedNft(null);
            setPrice('');
            fetchMyNFTs();
          },
          onError: (error) => console.error('List error:', error),
        }
      );
    } catch (error) {
      console.error('Transaction error:', error);
    } finally {
      setIsListing(false);
    }
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Your Garage</h3>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="h-16 bg-zinc-800 rounded-lg animate-pulse" />)}
        </div>
      ) : nfts.length === 0 ? (
        <div className="text-center py-8 text-zinc-500 text-sm">
          No cars in your garage yet.
        </div>
      ) : (
        <div className="space-y-3">
          {nfts.map((nft) => (
            <div key={nft.id} className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
              <img src={nft.image_url} alt={nft.name} className="w-14 h-10 rounded object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{nft.name}</p>
                <p className="text-xs text-zinc-500">{nft.speed} km/h</p>
              </div>
              <button onClick={() => setSelectedNft(nft)} className="btn-ghost text-xs px-2 py-1">
                Sell
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Sell Modal */}
      {selectedNft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass rounded-xl p-6 max-w-sm w-full animate-slide-up">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-lg font-semibold text-white">Sell {selectedNft.name}</h4>
              <button onClick={() => setSelectedNft(null)} className="text-zinc-500 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-zinc-400 mb-2">Price (SUI)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.0"
                className="input"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setSelectedNft(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleListCar} disabled={!price || isListing} className="btn-primary flex-1">
                {isListing ? 'Listing...' : 'List for Sale'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
