'use client'

import { useEffect, useState } from 'react'

export default function ENICOrb() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), 4500)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4">
      {visible && (
        <div className="bg-indigo-800 text-white text-sm px-4 py-2 rounded-lg shadow-lg border border-indigo-500 animate-fade-in">
          Welcome back, Commander Bussy.
        </div>
      )}
      <div className="w-14 h-14 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_20px_#5b1cff80] border-2 border-indigo-300" />
    </div>
  )
} 