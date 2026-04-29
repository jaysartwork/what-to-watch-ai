// app/admin/session/[sessionId]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase'
import type { SearchLog, SessionLog } from '@/types'

async function getSessionData(sessionId: string) {
  try {
    const db = createServerClient()

    const [{ data: session }, { data: searches }] = await Promise.all([
      db.from('sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single(),
      db.from('searches')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false }),
    ])

    return {
      session: session as SessionLog | null,
      searches: (searches ?? []) as SearchLog[],
    }
  } catch (err) {
    console.error('[admin/session] error:', err)
    return { session: null, searches: [] }
  }
}

export default async function SessionPage({
  params,
  searchParams,
}: {
  params: { sessionId: string }
  searchParams: { key?: string }
}) {
  // Route protection
  const secret = process.env.ADMIN_SECRET
  if (!secret || searchParams.key !== secret) notFound()

  const { session, searches } = await getSessionData(params.sessionId)

  const adminUrl = `/admin?key=${searchParams.key}`

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto">

        {/* Back button */}
        <Link
          href={adminUrl}
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm mb-8 transition-colors"
        >
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-10">
          <p className="text-[11px] uppercase tracking-widest text-zinc-500 mb-1">Session Detail</p>
          <h1 className="text-3xl font-bold mb-1">User Session</h1>
          <p className="text-zinc-500 font-mono text-sm">{params.sessionId}</p>
        </div>

        {/* Session Stats */}
        {session && (
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              {
                label: 'Total searches',
                value: session.search_count,
              },
              {
                label: 'First seen',
                value: new Date(session.created_at).toLocaleString('en-PH', {
                  month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                }),
              },
              {
                label: 'Last seen',
                value: new Date(session.last_seen).toLocaleString('en-PH', {
                  month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                }),
              },
            ].map(({ label, value }) => (
              <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <p className="text-zinc-500 text-[12px] uppercase tracking-wide mb-1">{label}</p>
                <p className="text-xl font-bold text-amber-400">{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Search History */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="font-semibold text-[15px] mb-4">
            Full search history
            <span className="ml-2 text-zinc-500 font-normal text-sm">({searches.length} searches)</span>
          </h2>

          {searches.length === 0 ? (
            <p className="text-zinc-500 text-sm">No searches found for this session.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {searches.map((s, i) => (
                <div
                  key={s.id}
                  className="border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors"
                >
                  {/* Time + number */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-zinc-500">
                      #{searches.length - i} ·{' '}
                      {new Date(s.created_at).toLocaleString('en-PH', {
                        month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                    <span className="text-[12px] text-zinc-400">
                      {s.results_count} result{s.results_count !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Full mood input */}
                  <p className="text-white text-[15px] font-medium mb-3">
                    "{s.mood_input}"
                  </p>

                  {/* Categories */}
                  <div className="flex gap-1.5 flex-wrap mb-2">
                    {(s.categories_detected ?? []).map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded text-[11px] capitalize border border-amber-500/20"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  {/* Time filter */}
                  <p className="text-[12px] text-zinc-600">
                    Time limit: {s.time_filter === 999 ? 'No limit' : `${s.time_filter} min`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-center text-zinc-600 text-[11px] mt-8">
          What to Watch AI · Admin · Session Detail
        </p>
      </div>
    </main>
  )
}