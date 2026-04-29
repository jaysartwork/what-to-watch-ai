// app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { SearchLog } from '@/types'

interface Stats {
  totalSearches:  number
  todaySearches:  number
  weekSearches:   number
  totalSessions:  number
  recentSearches: SearchLog[]
  topCategories:  [string, number][]
  error?:         string
}

export default function AdminPage() {
  const [stats, setStats]       = useState<Stats | null>(null)
  const [loading, setLoading]   = useState(true)
  const [clearing, setClearing] = useState(false)
  const [confirm, setConfirm]   = useState<'searches' | 'all' | null>(null)

  // Get key from URL
  const key = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('key') ?? ''
    : ''

  async function fetchStats() {
  setLoading(true)
  try {
    const res = await fetch(`/api/admin/stats?key=${key}`)
    const data = await res.json()
    setStats(data)
  } catch (err) {
    console.error('[admin] fetch error:', err)
    setStats({ 
      totalSearches: 0, todaySearches: 0,
      weekSearches: 0, totalSessions: 0,
      recentSearches: [], topCategories: [],
      error: 'Failed to load stats'
    })
  } finally {
    setLoading(false)
  }
}

  async function clearData(target: 'searches' | 'all') {
    setClearing(true)
    await fetch('/api/admin/clear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: key, target }),
    })
    setConfirm(null)
    await fetchStats()
    setClearing(false)
  }

  useEffect(() => { fetchStats() }, [])

  if (loading) return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-zinc-700 border-t-amber-500 rounded-full animate-spin" />
    </main>
  )

  if (!stats) return null

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-zinc-500 mb-1">What to Watch AI</p>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-zinc-400 text-sm mt-1">Real-time usage data from your Supabase database.</p>
          </div>

          {/* Clear buttons */}
          <div className="flex flex-col gap-2 items-end">
            {confirm === null ? (
              <>
                <button
                  onClick={() => setConfirm('searches')}
                  className="text-[12px] px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:border-red-700 hover:text-red-400 transition-colors"
                >
                  🗑 Clear searches
                </button>
                <button
                  onClick={() => setConfirm('all')}
                  className="text-[12px] px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:border-red-700 hover:text-red-400 transition-colors"
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
                    className="text-[12px] px-3 py-1 rounded-lg border border-zinc-700 text-zinc-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => clearData(confirm)}
                    disabled={clearing}
                    className="text-[12px] px-3 py-1 rounded-lg bg-red-700 hover:bg-red-600 text-white disabled:opacity-50"
                  >
                    {clearing ? 'Clearing...' : 'Yes, delete'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DB Error Banner */}
        {stats.error && (
          <div className="mb-8 bg-red-950/50 border border-red-800 rounded-2xl px-5 py-4">
            <p className="text-red-400 text-sm font-medium mb-1">⚠ Database connection error</p>
            <p className="text-red-500 text-xs font-mono">{stats.error}</p>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total searches',  value: stats.totalSearches  },
            { label: 'Searches today',  value: stats.todaySearches  },
            { label: 'This week',       value: stats.weekSearches   },
            { label: 'Unique sessions', value: stats.totalSessions  },
          ].map(({ label, value }) => (
            <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <p className="text-zinc-500 text-[12px] uppercase tracking-wide mb-1">{label}</p>
              <p className="text-3xl font-bold text-amber-400 tabular-nums">{value}</p>
            </div>
          ))}
        </div>

        {/* Top Categories */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
          <h2 className="font-semibold text-[15px] mb-4">Most searched moods / categories</h2>
          <div className="flex flex-col gap-2">
            {stats.topCategories.length === 0 ? (
              <p className="text-zinc-500 text-sm">No data yet.</p>
            ) : stats.topCategories.map(([cat, count]) => {
              const max = stats.topCategories[0][1]
              const pct = Math.round((count / max) * 100)
              return (
                <div key={cat} className="flex items-center gap-3">
                  <span className="w-20 text-[13px] capitalize text-zinc-300">{cat}</span>
                  <div className="flex-1 bg-zinc-800 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[13px] text-zinc-400 tabular-nums w-8 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Searches */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="font-semibold text-[15px] mb-4">Recent searches</h2>
          {stats.recentSearches.length === 0 ? (
            <p className="text-zinc-500 text-sm">No searches yet — share your app!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-zinc-500 text-left border-b border-zinc-800">
                    <th className="pb-2 font-medium pr-4">Time</th>
                    <th className="pb-2 font-medium pr-4">Mood input</th>
                    <th className="pb-2 font-medium pr-4">Categories</th>
                    <th className="pb-2 font-medium pr-4">Results</th>
                    <th className="pb-2 font-medium">Session</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentSearches.map((s) => (
                    <tr key={s.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                      <td className="py-2.5 pr-4 text-zinc-500 whitespace-nowrap">
                        {new Date(s.created_at).toLocaleString('en-PH', {
                          month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                      <td className="py-2.5 pr-4 text-zinc-300 max-w-[200px] truncate">{s.mood_input}</td>
                      <td className="py-2.5 pr-4">
                        <div className="flex gap-1 flex-wrap">
                          {(s.categories_detected ?? []).map((c) => (
                            <span key={c} className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 rounded text-[11px] capitalize">{c}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 pr-4 text-zinc-400">{s.results_count}</td>
                      <td className="py-2.5">
                        <Link
                          href={`/admin/session/${s.session_id}?key=${key}`}
                          className="text-zinc-500 font-mono text-[11px] hover:text-amber-400 transition-colors underline underline-offset-2"
                        >
                          {s.session_id?.slice(0, 8)}…
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-center text-zinc-600 text-[11px] mt-8">
          What to Watch AI · Admin · Data from Supabase
        </p>
      </div>
    </main>
  )
}