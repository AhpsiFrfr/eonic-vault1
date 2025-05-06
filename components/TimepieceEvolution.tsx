import Image from 'next/image';
import { useVaultData } from '../hooks/useVaultData';

export const TimepieceEvolution: React.FC = () => {
  const {
    evolutionStages,
    evolutionStats,
    isLoadingEvolution,
    evolutionError
  } = useVaultData();

  if (isLoadingEvolution) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (evolutionError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p>Error loading evolution data: {evolutionError.message}</p>
      </div>
    );
  }

  const progressPercentage = (evolutionStats.currentPoints / evolutionStats.nextUnlockPoints) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Timepiece Evolution</h2>
        <p className="text-gray-500">Evolve your timepiece by earning points</p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{evolutionStats.currentPoints} points</span>
          <span>{evolutionStats.nextUnlockPoints} points needed</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Evolution Stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {evolutionStages.map((stage, index) => (
          <div
            key={index}
            className={`relative rounded-lg overflow-hidden ${
              index <= evolutionStats.currentStage
                ? 'bg-white'
                : 'bg-gray-100 opacity-60'
            }`}
          >
            <div className="relative h-48">
              <Image
                src={stage.image}
                alt={stage.name}
                layout="fill"
                objectFit="cover"
                className={index > evolutionStats.currentStage ? 'filter grayscale' : ''}
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{stage.name}</h3>
              <p className="text-sm text-gray-500">{stage.description}</p>
              <div className="mt-2 text-sm">
                {index <= evolutionStats.currentStage ? (
                  <span className="text-green-500">Unlocked</span>
                ) : (
                  <span className="text-gray-500">
                    {stage.requiredPoints} points required
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Evolve Timepiece
        </button>
      </div>
    </div>
  );
}; 