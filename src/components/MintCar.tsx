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
    <div className="space-y-6">
      {/* Model Seçici */}
      <div>
        <label className="block text-lg font-semibold text-white mb-4">
          Select Car Model
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CAR_MODELS.map((model) => (
            <div
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              className={`car-card ${
                selectedModel === model.id ? 'car-card-selected' : ''
              }`}
            >
              <div className="aspect-video bg-gray-800 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                <img
                  src={model.imageUrl}
                  alt={model.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="text-6xl" style={{ display: 'none' }}>🏎️</div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{model.name}</h3>
              <p className="text-gray-400 text-sm mb-3">{model.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Default Speed:</span>
                <span className="text-racing-accent font-bold">{model.defaultSpeed} km/h</span>
              </div>
              {selectedModel === model.id && (
                <div className="mt-3 text-center text-racing-accent font-semibold">
                  ✓ Selected
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Araba Detayları */}
      {selectedModel && (
        <div className="card animate-fade-in">
          <h3 className="text-xl font-bold text-white mb-4">Car Details</h3>
          
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Car Name
            </label>
            <input
              type="text"
              value={carName}
              onChange={(e) => setCarName(e.target.value)}
              placeholder="e.g: Lightning McQueen"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-racing-accent focus:outline-none"
              maxLength={50}
            />
          </div>

          {/* Speed Setting */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Speed: <span className="text-racing-accent font-bold">{speed} km/h</span>
            </label>
            <input
              type="range"
              min={MIN_SPEED}
              max={MAX_SPEED}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-racing-accent"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{MIN_SPEED}</span>
              <span>{MAX_SPEED}</span>
            </div>
          </div>

          {/* Mint Button */}
          <button
            onClick={handleMint}
            disabled={isMinting || !carName.trim()}
            className="btn-primary w-full"
          >
            {isMinting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⚙️</span>
                Minting...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>🎨</span>
                Mint Car
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
