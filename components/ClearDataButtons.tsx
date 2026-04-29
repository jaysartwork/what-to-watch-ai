'use client'

import { useState } from 'react'

interface Props {
  adminKey: string
}

export default function ClearDataButtons({ adminKey }: Props) {
  const [clearing, setClearing] = useState(false)
  const [confirm, setConfirm]   = useState<'searches' | 'all' | null>(null)

  async function clearData(target: 'searches' | 'all') {
    setClearing(true)
    try {
      await fetch('/api/admin/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: adminKey, target }),
      })
      window.location.reload()
    } catch (err) {
      console.error('[clear]', err)
    } finally {
      setClearing(false)
      setConfirm(null)
    }
  }

  return (
    <div className="flex flex-col gap-2 items-end">
      {confirm === null ? (
        <>
          <button
            onClick={() => setConfirm('searches')}
            className="text-[12px] px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:border-red-700 hover:text-red-400 transition-colors cursor-pointer"
          >
            🗑 Clear searches
          </button>
          <button
            onClick={() => setConfirm('all')}
            className="text-[12px] px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:border-red-700 hover:text-red-400 transition-colors cursor-pointer"
          >
            🗑 Clear all data
          </button>
        </>
      ) : (
        <div className="bg-red-950/50 border border-red-800 rounded-xl p-3 text-right">
          <p className="text-red-400 text-[12px] mb-2">
            {confirm === 'all' ? 'Delete ALL searches + sessions?' : 'Delete all searches?'}
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setConfirm(null)}
              className="text-[12px] px-3 py-1 rounded-lg border border-zinc-700 text-zinc-400 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => clearData(confirm)}
              disabled={clearing}
              className="text-[12px] px-3 py-1 rounded-lg bg-red-700 hover:bg-red-600 text-white disabled:opacity-50 cursor-pointer"
            >
              {clearing ? 'Clearing...' : 'Yes, delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}