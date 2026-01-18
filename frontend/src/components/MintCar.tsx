import { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { CAR_MODELS, PACKAGE_ID, MODULE_NAME, SUI_CLOCK_OBJECT_ID, MAX_SPEED, MIN_SPEED } from '../constants';

export default function MintCar() {
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [carName, setCarName] = useState('');
  const [speed, setSpeed] = useState(75);
  const [isMinting, setIsMinting] = useState(false);

  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();

  const handleMint = async () => {
    if (!selectedModel || !carName.trim()) {
      alert('Please select a model and enter a name!');
      return;
    }

    setIsMinting(true);

    try {
      const tx = new Transaction();

      // mint_car fonksiyonu: name, speed, image_id, clock, ctx
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::mint_car`,
        arguments: [
          tx.pure.string(carName),
          tx.pure.u64(speed),
          tx.pure.u64(selectedModel),
          tx.object(SUI_CLOCK_OBJECT_ID), // Clock objesi
        ],
      });

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: async (result) => {
            console.log('Mint successful!', result);
            alert('🎉 Your car was successfully created!');
            
            // Clear form
            setCarName('');
            setSelectedModel(null);
            setSpeed(75);
          },
          onError: (error) => {
            console.error('Mint error:', error);
            alert('❌ Mint failed: ' + error.message);
          },
        }
      );
    } catch (error) {
      console.error('Transaction creation error:', error);
      alert('❌ Transaction error: ' + (error as Error).message);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div>
      <button onClick={handleMint} disabled={isMinting}>Mint Car</button>
    </div>
  );
}
