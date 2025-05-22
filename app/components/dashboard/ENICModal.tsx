'use client'

import { useState } from 'react'
import { playSFX } from '../../../utils/audio'

export default function ENICModal() {
  const [open, setOpen] = useState(false)

  const openModal = () => {
    playSFX('chime')
    setOpen(true)
  }

  const closeModal = () => {
    playSFX('modal_close')
    setOpen(false)
  }

  return (
    <>
      {/* ENIC Orb */}
      <div
        onClick={openModal}
        className="fixed top-6 right-6 z-50 cursor-pointer w-10 h-10 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_20px_#5b1cff80] border-2 border-indigo-300"
      />

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex justify-end">
          <div className="w-full max-w-md bg-zinc-900 p-6 text-white flex flex-col gap-4 shadow-2xl border-l border-indigo-600">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">ENIC.0 Assistant</h2>
              <button onClick={closeModal} className="text-indigo-400 hover:text-white">✖</button>
            </div>
            <textarea placeholder="Ask ENIC.0 something…" className="bg-zinc-800 p-3 rounded-lg border border-zinc-600 text-sm resize-none h-24" />
            <button className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md self-end">Send</button>
          </div>
        </div>
      )}
    </>
  )
} 