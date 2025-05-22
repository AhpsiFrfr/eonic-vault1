'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const AudioVolumeContext = createContext<{
  volume: number
  setVolume: (v: number) => void
  muted: boolean
  setMuted: (m: boolean) => void
}>({
  volume: 0.3,
  setVolume: () => {},
  muted: false,
  setMuted: () => {},
})

export function AudioVolumeProvider({ children }: { children: ReactNode }) {
  const [volume, setVolume] = useState(0.3)
  const [muted, setMuted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedMuted = localStorage.getItem('eonic-muted')
    const savedVol = localStorage.getItem('eonic-volume')
    console.log('🔊 Loading audio settings from localStorage:', { savedMuted, savedVol })
    if (savedMuted) setMuted(savedMuted === 'true')
    if (savedVol) setVolume(parseFloat(savedVol))
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    console.log('🔊 Saving audio settings to localStorage:', { volume, muted })
    localStorage.setItem('eonic-muted', muted.toString())
    localStorage.setItem('eonic-volume', volume.toString())
  }, [muted, volume])

  return (
    <AudioVolumeContext.Provider value={{ volume, setVolume, muted, setMuted }}>
      {children}
    </AudioVolumeContext.Provider>
  )
}

export function useAudioVolume() {
  const context = useContext(AudioVolumeContext)
  if (context === undefined) {
    throw new Error('useAudioVolume must be used within an AudioVolumeProvider')
  }
  return context
} 