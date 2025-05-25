export type SoundEffect = 
  | 'hover' 
  | 'click' 
  | 'modal_open' 
  | 'modal_close' 
  | 'level_up'
  | 'referral_reward'
  | 'hyperspace'
  | 'whoosh'
  | 'chime'
  | 'reward';

// Debug flag - set to true to enable verbose logging
const DEBUG = true;

function debugLog(...args: any[]) {
  if (DEBUG) {
    console.log('🔊 [Audio Debug]:', ...args);
  }
}

export const playSFX = (type: SoundEffect) => {
  // Check if sound is muted
  const isMuted = localStorage.getItem('eonic-muted') === 'true';
  debugLog('playSFX called:', { type, isMuted });
  
  if (isMuted) {
    debugLog('Audio muted, skipping playback');
    return;
  }

  const soundMap: Record<SoundEffect, string> = {
    hover: '/sfx/hover.mp3',
    click: '/Audio/sfx-click.mp3',
    modal_open: '/sfx/modal_open.mp3',
    modal_close: '/sfx/modal_close.mp3',
    level_up: '/sfx/level_up.mp3',
    referral_reward: '/sfx/referral_reward.mp3',
    hyperspace: '/sfx/hyperspace.mp3',
    whoosh: '/sfx/whoosh.mp3',
    chime: '/sfx/chime.mp3',
    reward: '/sfx/reward.mp3'
  };

  const src = soundMap[type];
  if (src) {
    debugLog('Creating audio instance for:', { src });
    const audio = new Audio(src);
    
    // Get volume from localStorage (default to 0.3 if not set)
    const storedVolume = localStorage.getItem('eonic-volume');
    audio.volume = storedVolume ? parseFloat(storedVolume) : 0.3;
    debugLog('Audio settings:', { volume: audio.volume, storedVolume });

    // Add event listeners for debugging
    audio.addEventListener('canplaythrough', () => {
      debugLog('Audio loaded and ready:', { src });
    });

    audio.addEventListener('play', () => {
      debugLog('Audio playback started:', { src });
    });

    audio.addEventListener('error', (e) => {
      console.error('🔊 Audio error:', e, { src, error: (e.target as HTMLAudioElement).error });
    });

    // Use a promise to handle audio play attempts
    audio.play()
      .then(() => {
        debugLog('Audio playback successful:', { src });
      })
      .catch(err => {
        console.warn('🔊 Audio play failed:', err, { src });
        debugLog('Will try to play on next user interaction');
        
        // Try to play on first user interaction
        const attemptPlay = () => {
          audio.play()
            .then(() => {
              debugLog('Audio playback started after user interaction:', { src });
              document.removeEventListener('click', attemptPlay);
              document.removeEventListener('keydown', attemptPlay);
            })
            .catch(e => console.error('🔊 Still could not play audio:', e));
        };
        
        document.addEventListener('click', attemptPlay, { once: true });
        document.addEventListener('keydown', attemptPlay, { once: true });
      });
  }
} 