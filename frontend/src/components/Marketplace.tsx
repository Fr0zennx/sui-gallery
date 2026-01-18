import { useState, useEffect } from 'react';
import { useSuiClient, useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { MIST_PER_SUI } from '@mysten/sui/utils';
import { PACKAGE_ID, MODULE_NAME, FUNC_BUY_CAR } from '../constants';

interface ListedCar {
  listingId: string;
  name: string;
  image_url: string;
  speed: number;
  price: string;
  seller: string;
}

export default function Marketplace() {
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const [listings, setListings] = useState<ListedCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<string | null>(null);

  useEffect(() => {
    if (PACKAGE_ID === '<PAKET_IDINIZ>') {
      setLoading(false);
      return;
    }
    fetchListings();
    const interval = setInterval(fetchListings, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchListings = async () => {
    try {
      const events = await suiClient.queryEvents({
        query: { MoveEventType: `${PACKAGE_ID}::${MODULE_NAME}::CarListed` },
        limit: 50,
        order: 'descending',
      });

      const processedListings = new Map<string, ListedCar>();

      for (const event of events.data) {
        const eventData = event.parsedJson as any;
        const listingId = eventData.id || eventData.listing_id;
        if (!listingId || processedListings.has(listingId)) continue;

        try {
          const listingObj = await suiClient.getObject({ id: listingId, options: { showContent: true } });
          if (listingObj.data?.content && 'fields' in listingObj.data.content) {
            const fields = listingObj.data.content.fields as any;
            const carFields = fields.car?.fields;
            if (!carFields) continue;

            const imageUrl = carFields.image_url || '';
            let mappedImageUrl = imageUrl;
            if (imageUrl.includes('QmX_RedSpeedster')) mappedImageUrl = 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop';
            else if (imageUrl.includes('QmY_MidnightDrifter')) mappedImageUrl = 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&h=600&fit=crop';
            else if (imageUrl.includes('QmZ_DesertNomad')) mappedImageUrl = 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop';

            processedListings.set(listingId, {
              listingId,
              name: carFields.name,
              image_url: mappedImageUrl,
              speed: carFields.speed,
              price: fields.price,
              seller: fields.seller,
            });
          }
        } catch { }
      }
      setListings(Array.from(processedListings.values()));
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (listing: ListedCar) => {
    if (!currentAccount) return;
    setBuyingId(listing.listingId);

    try {
      const tx = new Transaction();
      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(listing.price)]);
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNC_BUY_CAR}`,
        arguments: [tx.object(listing.listingId), coin],
      });

      signAndExecute(
        { transaction: tx as any },
        {
          onSuccess: () => fetchListings(),
          onError: (error) => console.error('Buy error:', error),
        }
      );
    } catch (error) {
      console.error('Transaction error:', error);
    } finally {
      setBuyingId(null);
    }
  };

  const formatPrice = (priceMist: string) => {
    try {
      return (Number(BigInt(priceMist)) / Number(MIST_PER_SUI)).toFixed(2);
    } catch {
      return '0';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Marketplace</h2>
        <span className="text-xs text-zinc-500">Auto-refresh: 15s</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card h-64 animate-pulse" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-zinc-400">No listings available.</p>
          <p className="text-sm text-zinc-600 mt-1">Be the first to list a car for sale.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {listings.map((car) => (
            <div key={car.listingId} className="card-hover overflow-hidden">
              <div className="relative aspect-video">
                <img src={car.image_url} alt={car.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 badge bg-black/70 backdrop-blur-sm text-white">
                  {formatPrice(car.price)} SUI
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-white">{car.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {car.speed} km/h
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600 truncate max-w-[120px]">
                    {car.seller.slice(0, 6)}...{car.seller.slice(-4)}
                  </span>
                  <button
                    onClick={() => handleBuy(car)}
                    disabled={buyingId === car.listingId || currentAccount?.address === car.seller}
                    className={`
                      btn text-sm px-4 py-2
                      ${currentAccount?.address === car.seller
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        : 'bg-accent-blue text-white hover:bg-blue-500'}
                    `}
                  >
                    {buyingId === car.listingId ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : currentAccount?.address === car.seller ? (
                      'Yours'
                    ) : (
                      'Buy'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
