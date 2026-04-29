// app/admin/page.tsx — Server Component
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase'
import type { SearchLog } from '@/types'
import ClearDataButtons from '@/components/ClearDataButtons'

async function getStats() {
  const empty = {
    totalSearches: 0, todaySearches: 0,
    weekSearches: 0,  totalSessions: 0,
    recentSearches: [] as SearchLog[], topCategories: [] as [string, number][],
  }
  try {
    const db = createServerClient()
    const now        = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const weekStart  = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const [
      { count: totalSearches  },
      { count: todaySearches  },
      { count: weekSearches   },
      { count: totalSessions  },
      { data:  recentSearches },
      { data:  categoryRows   },
    ] = await Promise.all([
      db.from('searches').select('*', { count: 'exact', head: true }),
      db.from('searches').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
      db.from('searches').select('*', { count: 'exact', head: true }).gte('created_at', weekStart),
      db.from('sessions').select('*', { count: 'exact', head: true }),
      db.from('searches')
        .select('id, mood_input, categories_detected, results_count, created_at, session_id')
        .order('created_at', { ascending: false }).limit(20),
      db.from('searches').select('categories_detected'),
    ])

    const catCount: Record<string, number> = {}
    for (const row of categoryRows ?? []) {
      for (const cat of row.categories_detected ?? []) {
        catCount[cat] = (catCount[cat] ?? 0) + 1
      }
    }
    const topCategories = Object.entries(catCount).sort(([, a], [, b]) => b - a).slice(0, 6)

    return {
      totalSearches: totalSearches ?? 0,
      todaySearches: todaySearches ?? 0,
      weekSearches:  weekSearches  ?? 0,
      totalSessions: totalSessions ?? 0,
      recentSearches: (recentSearches ?? []) as SearchLog[],
      topCategories,
    }
  } catch (err) {
    console.error('[admin]', err)
    return empty
  }
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { key?: string }
}) {
  const secret = process.env.ADMIN_SECRET
  if (!secret || searchParams.key !== secret) notFound()

  const stats = await getStats()
  const key   = searchParams.key

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
          <ClearDataButtons adminKey={key} />
        </div>

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