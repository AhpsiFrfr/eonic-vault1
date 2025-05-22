'use client'

export default function ENICAssistant() {
  const level = 12 // Replace with live XP later

  const orbColor = level >= 20 ? 'bg-yellow-400 border-yellow-200 shadow-yellow-400/50'
                  : level >= 10 ? 'bg-indigo-500 border-indigo-300 shadow-indigo-400/50'
                  : 'bg-zinc-500 border-zinc-300 shadow-zinc-400/50'

  return (
    <div className={`fixed top-6 right-6 z-40 w-10 h-10 rounded-full animate-pulse border-2 ${orbColor}`} />
  )
} 