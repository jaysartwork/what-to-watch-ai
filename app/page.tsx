'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Movie, Category } from '@/types'
import RecommendationCard from '@/components/RecommendationCard'
import { KEYWORD_MAP } from '@/lib/recommend'

const GENRE_CHIPS: { label: string; key: Category }[] = [
  { label: 'Romantic',  key: 'romantic'  },
  { label: 'Thriller',  key: 'thriller'  },
  { label: 'Comedy',    key: 'funny'     },
  { label: 'Action',    key: 'action'    },
  { label: 'Horror',    key: 'horror'    },
  { label: 'Drama',     key: 'drama'     },
  { label: 'Sci-Fi',    key: 'scifi'     },
  { label: 'Animation', key: 'animation' },
]

const TIME_OPTIONS = [
  { label: '30 min',  value: 30  },
  { label: '1 hour',  value: 60  },
  { label: '2 hours', value: 120 },
  { label: 'No limit',value: 999 },
]

// Generate or retrieve a persistent user ID from localStorage
function getUserId(): string {
  const KEY = 'wtw_uid'
  try {
    const existing = localStorage.getItem(KEY)
    if (existing) return existing
    const newId = 'user_' + Math.random().toString(36).slice(2, 8)
    localStorage.setItem(KEY, newId)
    return newId
  } catch {
    // localStorage blocked (e.g. private browsing with strict settings)
    return 'user_' + Math.random().toString(36).slice(2, 8)
  }
}

type Status = 'idle' | 'loading' | 'done' | 'error' | 'no-match'

export default function HomePage() {
  const [userId, setUserId]       = useState<string>('')
  const [mood, setMood]           = useState('')
  const [timeLimit, setTimeLimit] = useState(120)
  const [activeChips, setActiveChips] = useState<Set<Category>>(new Set())
  const [status, setStatus]       = useState<Status>('idle')
  const [results, setResults]     = useState<Movie[]>([])
  const [meta, setMeta]           = useState({ total: 0, cats: [] as Category[] })

  // Runs only on client after mount — avoids SSR mismatch
  useEffect(() => {
    setUserId(getUserId())
  }, [])

  const updateMoodFromChips = (chips: Set<Category>) => {
    const labels = GENRE_CHIPS.filter((c) => chips.has(c.key)).map((c) => c.label)
    if (labels.length > 0) setMood(labels.join(', '))
  }

  useEffect(() => {
    const lower = mood.toLowerCase()
    const newActive = new Set<Category>()
    for (const [cat, keys] of Object.entries(KEYWORD_MAP) as [Category, string[]][]) {
      if (keys.some((k) => lower.includes(k))) newActive.add(cat)
    }
    setActiveChips(newActive)
  }, [mood])

  const toggleChip = (key: Category) => {
    setActiveChips((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      updateMoodFromChips(next)
      return next
    })
  }

  const handleSubmit = useCallback(async () => {
    if (!mood.trim()) return
    setStatus('loading')
    setResults([])

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood,
          timeLimit,
          name: userId || 'Anonymous',  // ← persistent ID from localStorage
        }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error)
      if (!data.results || data.results.length === 0) {
        setStatus('no-match')
        return
      }
      setResults(data.results)
      setMeta({ total: data.totalMatches, cats: data.detectedCategories })
      setStatus('done')
    } catch (err) {
      console.error('[handleSubmit error]', err)
      setStatus('error')
    }
  }, [mood, timeLimit, userId])

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white">
      <div className="max-w-xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 mb-2">
            AI-Powered · Powered by Groq
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            What to <span className="text-amber-500">Watch</span>
          </h1>
          <p className="text-zinc-500 text-[15px]">
            Tell us your mood. We'll cut through the scroll.
          </p>
        </div>

        {/* Mood Input */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 mb-3">
          <label className="block text-[11px] uppercase tracking-[0.12em] text-zinc-400 mb-2">
            How are you feeling right now?
          </label>
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="e.g. something light and funny, a thriller with twists…"
            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-[14px] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            maxLength={200}
          />
          {/* Genre chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {GENRE_CHIPS.map(({ label, key }) => (
              <button
                key={key}
                onClick={() => toggleChip(key)}
                className={`px-3 py-1 rounded-full text-[12px] border transition-all select-none ${
                  activeChips.has(key)
                    ? 'bg-amber-500 border-amber-500 text-zinc-900 font-medium'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-amber-400 hover:text-amber-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Time Filter */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 mb-5">
          <label className="block text-[11px] uppercase tracking-[0.12em] text-zinc-400 mb-2">
            How much time do you have?
          </label>
          <div className="grid grid-cols-4 gap-2">
            {TIME_OPTIONS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setTimeLimit(value)}
                className={`py-2 rounded-xl text-[13px] border transition-all select-none ${
                  timeLimit === value
                    ? 'bg-amber-500 border-amber-500 text-zinc-900 font-medium'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-amber-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleSubmit}
          disabled={status === 'loading' || !mood.trim()}
          className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed text-zinc-900 font-semibold rounded-xl text-[15px] transition-all mb-8"
        >
          {status === 'loading' ? 'Finding your watch…' : 'Find My Watch →'}
        </button>

        {/* Results */}
        {status === 'loading' && (
          <div className="text-center py-8">
            <div className="inline-block w-6 h-6 border-2 border-zinc-200 border-t-amber-500 rounded-full animate-spin mb-3" />
            <p className="text-zinc-400 text-sm">Scanning our catalog…</p>
          </div>
        )}

        {status === 'no-match' && (
          <div className="text-center py-8 text-zinc-500">
            <p className="mb-1 font-medium">No category matched.</p>
            <p className="text-sm">Try words like <em>romantic</em>, <em>thriller</em>, <em>funny</em>, or <em>scary</em>.</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center py-8 text-red-500 text-sm">
            Something went wrong. Please try again.
          </div>
        )}

        {status === 'done' && results.length > 0 && (
          <div>
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="font-semibold text-[16px]">Top picks for you</h2>
              <span className="text-[12px] text-zinc-400">
                {results.length} of {meta.total} matches · {meta.cats.join(', ')}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {results.map((movie, i) => (
                <RecommendationCard key={movie.title} movie={movie} rank={i + 1} />
              ))}
            </div>
            <p className="text-center text-[11px] text-zinc-400 mt-6">
              Results powered by GROQ · Phase 1 MVP
            </p>
          </div>
        )}
      </div>
    </main>
  )
}