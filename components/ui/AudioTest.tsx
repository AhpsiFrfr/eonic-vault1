import { playSFX, SoundEffect } from '../../utils/audio';

export default function AudioTest() {
  const effects: SoundEffect[] = ['hover', 'click', 'modal_open', 'modal_close', 'level_up', 'referral_reward', 'hyperspace'];
  
  const testAllSounds = () => {
    effects.forEach((effect, index) => {
      setTimeout(() => {
        playSFX(effect);
      }, index * 1000); // Play each sound with a 1-second delay
    });
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Audio Test Panel</h2>
      <div className="flex flex-wrap gap-2">
        {effects.map((effect) => (
          <button
            key={effect}
            onClick={() => playSFX(effect)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Play {effect}
          </button>
        ))}
      </div>
      <button
        onClick={testAllSounds}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Test All Sounds
      </button>
    </div>
  );
} 