import type { Category, Movie, RecommendResponse } from '@/types'
import { CATALOG } from '@/data/catalog'

// Maps natural-language keywords → category
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

export function detectCategories(mood: string): Category[] {
  const lower = mood.toLowerCase()
  const found: Category[] = []

  for (const [cat, keys] of Object.entries(KEYWORD_MAP) as [Category, string[]][]) {
    if (keys.some((k) => lower.includes(k))) found.push(cat)
  }

  return found
}

export function getRecommendations(mood: string, timeLimit: number): RecommendResponse {
  const detectedCategories = detectCategories(mood)

  if (detectedCategories.length === 0) {
    return { results: [], detectedCategories: [], totalMatches: 0 }
  }

  // Collect matching movies (deduped)
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

  const maxDur = timeLimit === 999 ? Infinity : timeLimit + 30 // 30-min buffer

  let filtered = pool.filter((m) => m.duration <= maxDur)
  // If nothing fits the time window, fall back to unfiltered
  if (filtered.length === 0) filtered = pool

  // Sort by score descending, return top 4
  const results = [...filtered].sort((a, b) => b.score - a.score).slice(0, 4)

  return { results, detectedCategories, totalMatches: pool.length }
}
