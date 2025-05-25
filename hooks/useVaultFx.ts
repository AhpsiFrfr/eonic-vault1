import { useState, useEffect } from 'react';
import { useAudioVolume } from '@/app/components/dashboard/AudioVolumeContext';

export function useVaultFx() {
  const { muted, setMuted } = useAudioVolume();
  
  // Vault FX enabled when audio is not muted
  const vaultFxEnabled = !muted;
  
  const toggleVaultFx = (enabled: boolean) => {
    setMuted(!enabled);
  };
  
  return {
    vaultFxEnabled,
    toggleVaultFx
  };
} 