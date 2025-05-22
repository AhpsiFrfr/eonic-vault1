'use client'

import { useEffect } from 'react'
import { useAudioVolume } from './AudioVolumeContext'

export default function VaultAudio() {
  const { volume, muted } = useAudioVolume()

  useEffect(() => {
    if (muted) return
    const ambient = new Audio('/sfx/vault-ambient.mp3')
    ambient.loop = true
    ambient.volume = volume * 0.2 // Keep ambient volume lower than SFX
    ambient.play().catch(() => {}) // ignore autoplay block
  }, [volume, muted])

  return null
} 