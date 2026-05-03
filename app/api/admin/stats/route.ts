// app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import type { SearchLog } from '@/types'

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')

  if (key !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
        .select('id, mood_input, categories_detected, results_count, created_at, time_filter, name, user_agent')
        .order('created_at', { ascending: false })
        .limit(20),
      db.from('searches').select('categories_detected'),
    ])

    const catCount: Record<string, number> = {}
    for (const row of categoryRows ?? []) {
      for (const cat of row.categories_detected ?? []) {
        catCount[cat] = (catCount[cat] ?? 0) + 1
      }
    }
    const topCategories = Object.entries(catCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)

    return NextResponse.json({
      totalSearches:  totalSearches  ?? 0,
      todaySearches:  todaySearches  ?? 0,
      weekSearches:   weekSearches   ?? 0,
      totalSessions:  totalSessions  ?? 0,
      recentSearches: (recentSearches ?? []) as SearchLog[],
      topCategories,
    })
  } catch (err) {
    console.error('[admin/stats]', err)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}