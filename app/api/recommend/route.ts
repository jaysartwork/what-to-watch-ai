import { NextRequest, NextResponse } from 'next/server'
import { getRecommendations } from '@/lib/recommend'
import { createServerClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { mood, timeLimit, name } = body as {
      mood: string
      timeLimit: number
      name: string              // ← dati: sessionId: string
    }

    if (!mood || typeof mood !== 'string') {
      return NextResponse.json({ error: 'mood is required' }, { status: 400 })
    }

    // 1. Get recommendations (pure logic — no DB)
    const response = await getRecommendations(mood, timeLimit ?? 999)

    // 2. Log to Supabase for analytics
    const db = createServerClient()
    const userAgent = req.headers.get('user-agent') ?? null

    // Upsert session via RPC — correctly increments search_count on conflict
    await db.rpc('upsert_session', { p_name: name })    // ← dati: p_session_id: sessionId

    // Insert search log
    await db.from('searches').insert({
      mood_input:          mood.slice(0, 300),
      categories_detected: response.detectedCategories,
      time_filter:         timeLimit,
      results_count:       response.results.length,
      name:                name,                        // ← dati: session_id: sessionId
      user_agent:          userAgent,
    })

    return NextResponse.json(response)
  } catch (err) {
    console.error('[/api/recommend]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}