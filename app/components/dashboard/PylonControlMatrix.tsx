'use client'

import { useEffect, useState } from 'react'
import { playSFX } from '../../../utils/audio'

const ALL_PYLONS = [
  'Token',
  'XP Tracker',
  'Vault Reputation',
  'Timepiece Evolution',
  'Announcements',
  'Audio Control',
  'Audio Settings',
]

export default function PylonControlMatrix({
  active,
  onToggle,
}: {
  active: string[]
  onToggle: (name: string) => void
}) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="pylon bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-white w-full max-w-sm space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">Pylon Control Matrix</h2>
        <button
          className="text-sm text-indigo-400 hover:text-indigo-200 transition"
          onClick={() => {
            setExpanded(!expanded)
            playSFX('click')
          }}
        >
          {expanded ? '▼' : '▶'}
        </button>
      </div>

      {expanded && (
        <div className="space-y-2">
          {ALL_PYLONS.map((pylon) => {
            const isActive = active.includes(pylon)
            return (
              <div
                key={pylon}
                className="flex justify-between items-center bg-zinc-800 px-3 py-2 rounded-lg"
              >
                <span className="text-sm">{pylon}</span>
                <button
                  onClick={() => {
                    onToggle(pylon)
                    playSFX('click')
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-semibold ${
                    isActive
                      ? 'bg-green-500 text-black'
                      : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                  }`}
                >
                  {isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
} 