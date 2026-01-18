import { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { CAR_MODELS, PACKAGE_ID, MODULE_NAME, SUI_CLOCK_OBJECT_ID, MAX_SPEED, MIN_SPEED, FUNC_MINT_CAR } from '../constants';

export default function MintCar() {
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [carName, setCarName] = useState('');
  const [speed, setSpeed] = useState(150);
  const [isMinting, setIsMinting] = useState(false);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const handleMint = async () => {
    if (!selectedModel || !carName.trim()) return;
    setIsMinting(true);

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::${FUNC_MINT_CAR}`,
        arguments: [
          tx.pure.string(carName),
          tx.pure.u64(speed),
          tx.pure.u64(selectedModel),
          tx.object(SUI_CLOCK_OBJECT_ID),
        ],
      });

      signAndExecute(
        { transaction: tx as any },
        {
          onSuccess: () => {
            setCarName('');
            setSelectedModel(null);
            setSpeed(150);
          },
          onError: (error) => console.error('Mint error:', error),
        }
      );
    } catch (error) {
      console.error('Transaction error:', error);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Mint New Car</h3>

      <div className="space-y-5">
        {/* Model Selection */}
        <div>
          <label className="block text-sm text-zinc-400 mb-3">Select Model</label>
          <div className="grid grid-cols-3 gap-2">
            {CAR_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`
                  relative rounded-lg overflow-hidden aspect-video transition-all
                  ${selectedModel === model.id
                    ? 'ring-2 ring-accent-blue'
                    : 'ring-1 ring-zinc-700 hover:ring-zinc-600'}
                `}
              >
                <img src={model.imageUrl} alt={model.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <span className="absolute bottom-1 left-1 text-[10px] text-white font-medium">
                  {model.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Car Name</label>
          <input
            type="text"
            value={carName}
            onChange={(e) => setCarName(e.target.value)}
            placeholder="Enter name..."
            className="input"
          />
        </div>

        {/* Speed Slider */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-zinc-400">Speed</span>
            <span className="text-white font-medium">{speed} km/h</span>
          </div>
          <input
            type="range"
            min={MIN_SPEED}
            max={MAX_SPEED}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-accent-blue"
          />
        </div>

        {/* Mint Button */}
        <button
          onClick={handleMint}
          disabled={!selectedModel || !carName.trim() || isMinting}
          className="btn-primary w-full"
        >
          {isMinting ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Minting...
            </>
          ) : (
            'Mint Car'
          )}
        </button>
      </div>
    </div>
  );
}
