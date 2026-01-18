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
            cars.push({
              listingId,
              carId: fields.car_id,
              name: fields.name,
              image_url: fields.image_url,
              speed: fields.speed,
              price: fields.price,
              seller: fields.seller,
            });
            processedListings.add(listingId);
          }
        } catch (error) {
          // Hatalı objeleri atla
          continue;
        }
      }
      setListings(cars);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Marketplace içeriği buraya */}
      {loading ? <div>Loading...</div> : (
        <ul>
          {listings.map((car) => (
            <li key={car.listingId}>{car.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
