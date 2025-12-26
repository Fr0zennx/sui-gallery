interface CarModel {
  id: number
  name: string
  speed: string
  imageUrl: string
}

interface VisualSelectorProps {
  models: CarModel[]
  selectedModel: number | null
  onSelectModel: (id: number) => void
}

export default function VisualSelector({
  models,
  selectedModel,
  onSelectModel,
}: VisualSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {models.map((model) => (
        <div
          key={model.id}
          className={`car-card p-6 bg-gray-900 rounded-lg border-2 transition-all cursor-pointer ${
            selectedModel === model.id
              ? 'border-neon-orange neon-glow'
              : 'border-gray-700 hover:border-neon-orange'
          }`}
        >
          {/* Placeholder for car image */}
          <div className="w-full h-48 bg-gradient-to-b from-gray-800 to-black rounded-lg mb-4 flex items-center justify-center overflow-hidden">
            <div className="text-6xl">🏎️</div>
          </div>

          <h3 className="text-xl font-bold mb-2">{model.name}</h3>
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400">Speed:</span>
            <span className="neon-orange font-bold">{model.speed} km/h</span>
          </div>

          <button
            onClick={() => onSelectModel(model.id)}
            className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
              selectedModel === model.id
                ? 'bg-neon-orange text-black neon-glow'
                : 'bg-gray-800 text-white hover:bg-gray-700 border border-neon-orange'
            }`}
          >
            {selectedModel === model.id ? '✓ Selected' : 'Select This Model'}
          </button>
        </div>
      ))}
    </div>
  )
}
