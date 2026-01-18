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
            name: fields.name,
            image_url: mappedImageUrl,
            speed: fields.speed,
          });
        }
      }
      setNfts(cars);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* NFT listesi ve diğer içerikler buraya */}
      {loading ? <div>Loading...</div> : (
        <ul>
          {nfts.map((nft) => (
            <li key={nft.id}>{nft.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
