'use client'

import { useEffect } from 'react'
import { useAudioVolume } from './AudioVolumeContext'
import { playSFX } from '../../../utils/audio'

interface VaultSFXProps {
  levelUp?: boolean
  rewardPing?: boolean
  playWhoosh?: boolean
  playClose?: boolean
  playChime?: boolean
}

export default function VaultSFX({
  levelUp,
  rewardPing,
  playWhoosh,
  playClose,
  playChime
}: VaultSFXProps) {
  const { muted } = useAudioVolume()

  useEffect(() => {
    if (muted) return

    const handleHover = (e: Event) => {
      const target = e.target as HTMLElement;
      // Walk up the DOM tree to find widget or pylon class
      let currentElement = target;
      while (currentElement && !(currentElement.classList?.contains('widget') || currentElement.classList?.contains('pylon'))) {
        currentElement = currentElement.parentElement as HTMLElement;
      }
      
      if (currentElement?.classList?.contains('widget') || currentElement?.classList?.contains('pylon')) {
        console.log('🔊 [VaultSFX] Playing hover sound for:', currentElement.className);
        playSFX('hover');
      }
    }

    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      // Walk up the DOM tree to find widget or pylon class
      let currentElement = target;
      while (currentElement && !(currentElement.classList?.contains('widget') || currentElement.classList?.contains('pylon'))) {
        currentElement = currentElement.parentElement as HTMLElement;
      }
      
      if (currentElement?.classList?.contains('widget') || currentElement?.classList?.contains('pylon')) {
        console.log('🔊 [VaultSFX] Playing click sound for:', currentElement.className);
        playSFX('click');
      }
    }

    // Use capture phase to ensure we get events before they're stopped
    document.addEventListener('mouseover', handleHover, true);
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('mouseover', handleHover, true);
      document.removeEventListener('click', handleClick, true);
    }
  }, [muted])

  useEffect(() => {
    if (muted) return
    if (levelUp) {
      console.log('🔊 [VaultSFX] Playing level up sound');
      playSFX('level_up');
    }
    if (rewardPing) {
      console.log('🔊 [VaultSFX] Playing reward sound');
      playSFX('reward');
    }
    if (playWhoosh) {
      console.log('🔊 [VaultSFX] Playing whoosh sound');
      playSFX('whoosh');
    }
    if (playClose) {
      console.log('🔊 [VaultSFX] Playing close sound');
      playSFX('modal_close');
    }
    if (playChime) {
      console.log('🔊 [VaultSFX] Playing chime sound');
      playSFX('chime');
    }
  }, [levelUp, rewardPing, playWhoosh, playClose, playChime, muted])

  return null
} 