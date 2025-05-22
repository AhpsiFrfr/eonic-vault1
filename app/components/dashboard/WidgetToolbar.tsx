'use client'

import { useState, useEffect } from 'react'

const allWidgets = [
  'Token Summary',
  'KPI Monitor',
  'Vault Reputation',
  'Timepiece Evolution',
  'Announcements',
  'Audio Controls',
  'Audio Settings',
]

export default function WidgetToolbar({
  active,
  onToggle,
}: {
  active: string[]
  onToggle: (widget: string) => void
}) {
  return (
    <div className="w-full max-w-6xl flex flex-wrap items-center justify-between bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-6 text-white gap-3">
      <h2 className="text-md font-semibold text-zinc-300">🧩 Enable/Disable Widgets</h2>

      <div className="flex flex-wrap gap-2">
        {allWidgets.map((widget) => (
          <button
            key={widget}
            onClick={() => onToggle(widget)}
            className={`px-3 py-1 rounded-md border text-sm transition-all ${
              active.includes(widget)
                ? 'bg-indigo-600 border-indigo-400 text-white'
                : 'bg-zinc-800 border-zinc-600 text-zinc-400'
            }`}
          >
            {widget}
          </button>
        ))}
      </div>
    </div>
  )
} 