import type { Category, Movie, RecommendResponse } from '@/types'
import { CATALOG } from '@/data/catalog'

// ── Keyword fallback (used if Groq fails) ────────────────────
export const KEYWORD_MAP: Record<Category, string[]> = {
  romantic:  ['romantic','romance','love','sweet','cute','heartwarming','relationship','couple','date','wedding','cheesy','soft','cozy','mushy'],
  thriller:  ['thriller','mystery','suspense','twist','dark','crime','investigation','murder','detective','plot','intense','edge','seat','mind'],
  funny:     ['funny','comedy','laugh','light','humor','fun','entertaining','silly','witty','hilarious','breezy','easy','chill','relax'],
  action:    ['action','adventure','fight','exciting','intense','hero','epic','explosive','adrenaline','battle','war','fast'],
  horror:    ['horror','scary','terrifying','dark','creepy','nightmare','ghost','haunting','fear','disturbing','tense','eerie'],
  drama:     ['drama','serious','emotional','cry','moving','meaningful','deep','real','touching','sad','beautiful','heavy'],
  scifi:     ['sci-fi','scifi','science','space','future','technology','robot','ai','alien','mind-bending','complex','intelligent','futuristic'],
  animation: ['anime','animation','cartoon','animated','family','ghibli','kids','colorful','visual','vibrant'],
}

export function detectCategoriesFallback(mood: string): Category[] {
  const lower = mood.toLowerCase()
  const found: Category[] = []
  for (const [cat, keys] of Object.entries(KEYWORD_MAP) as [Category, string[]][]) {
    if (keys.some((k) => lower.includes(k))) found.push(cat)
  }
  return found
}

// ── Groq AI mood detection ────────────────────────────────────
export async function detectCategoriesWithAI(mood: string): Promise<Category[]> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return detectCategoriesFallback(mood)

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        temperature: 0,
        max_tokens: 50,
        messages: [
          {
            role: 'system',
            content: `You are a movie recommendation classifier. Given a user's mood or request, return ONLY a JSON array of matching categories from this list: romantic, thriller, funny, action, horror, drama, scifi, animation. Return 1-3 categories maximum. Return ONLY the JSON array, nothing else. Example: ["romantic","funny"]`,
          },
          {
            role: 'user',
            content: mood,
          },
        ],
      }),
    })

    const data = await res.json()
    const text = data.choices?.[0]?.message?.content?.trim() ?? '[]'
    const parsed = JSON.parse(text) as Category[]

    // Validate — only return known categories
    const valid: Category[] = ['romantic','thriller','funny','action','horror','drama','scifi','animation']
    return parsed.filter((c) => valid.includes(c))
  } catch (err) {
    console.error('[detectCategoriesWithAI] Groq error, falling back:', err)
    return detectCategoriesFallback(mood)
  }
}

// ── Main recommendation function ──────────────────────────────
export async function getRecommendations(mood: string, timeLimit: number): Promise<RecommendResponse> {
  const detectedCategories = await detectCategoriesWithAI(mood)

  if (detectedCategories.length === 0) {
    return { results: [], detectedCategories: [], totalMatches: 0 }
  }

  const seen = new Set<string>()
  const pool: Movie[] = []

  for (const cat of detectedCategories) {
    for (const movie of CATALOG) {
      if (movie.category === cat && !seen.has(movie.title)) {
        seen.add(movie.title)
        pool.push(movie)
      }
    }
  }

  const maxDur = timeLimit === 999 ? Infinity : timeLimit + 30
  let filtered = pool.filter((m) => m.duration <= maxDur)
  if (filtered.length === 0) filtered = pool

  const results = [...filtered].sort((a, b) => b.score - a.score).slice(0, 4)

  return { results, detectedCategories, totalMatches: pool.length }
}