import type { Category, Movie, RecommendResponse, StreamingProvider } from '@/types'

// ── TMDB Genre IDs ────────────────────────────────────────────
const GENRE_MAP: Record<Category, number[]> = {
  romantic:  [10749],
  thriller:  [53, 9648],
  funny:     [35],
  action:    [28, 12],
  horror:    [27],
  drama:     [18],
  scifi:     [878, 14],
  animation: [16],
}

// ── Keyword fallback ──────────────────────────────────────────
export const KEYWORD_MAP: Record<Category, string[]> = {
  romantic: [
    'romantic','romance','love','sweet','cute','heartwarming',
    'relationship','couple','date','wedding','cheesy','soft','cozy','mushy',
    // Tagalog
    'kilig','mahal','pag-ibig','sinta','ligaw','kasal','sweet na','inlove',
    'may gusto','may feelings','torpe','mahangin','hugot'
  ],
  thriller: [
    'thriller','mystery','suspense','twist','dark','crime','investigation',
    'murder','detective','plot','intense','edge','seat','mind',
    // Tagalog
    'nakakatakot na hindi horror','suspenseful','gulat','liko-liko',
    'hindi mahulaan','nakaka-engganyo','nakaka-curious','mind-blowing'
  ],
  funny: [
    'funny','comedy','laugh','light','humor','fun','entertaining',
    'silly','witty','hilarious','breezy','easy','chill','relax',
    // Tagalog
    'nakakatawa','tawa','aliw','masaya','magaan','pampagana',
    'pang-araw-araw','walang drama','chill lang'
  ],
  action: [
    'action','adventure','fight','exciting','intense','hero','epic',
    'explosive','adrenaline','battle','war','fast',
    // Tagalog
    'aksyon','laban','giyera','pagtakas','exciting na','paboom',
    'superhero','panlaban','nakaka-excite'
  ],
  horror: [
    'horror','scary','terrifying','dark','creepy','nightmare','ghost',
    'haunting','fear','disturbing','tense','eerie',
    // Tagalog
    'nakakatakot','multo','kababalaghan','nakakakilig sa takot',
    'hindi makatulog','nakaka-antok ng takot','suspense horror',
    'nakakaistorbo','nakakapanindig-balahibo'
  ],
  drama: [
    'drama','serious','emotional','cry','moving','meaningful','deep',
    'real','touching','sad','beautiful','heavy',
    // Tagalog
    'nakakaiyak','malungkot','malalim','nakaka-touch','hugot',
    'parang totoo','kwento ng buhay','nakaka-relate','sad na',
    'something that makes me cry','gusto ko umiyak','umiiyak',
    'nakakaawa','masakit sa puso'
  ],
  scifi: [
    'sci-fi','scifi','science','space','future','technology','robot',
    'ai','alien','mind-bending','complex','intelligent','futuristic',
    // Tagalog
    'hinaharap','teknolohiya','kalawakan','robot na','parang future',
    'mind-blowing','nakakalito sa magandang paraan','ending na hindi mahulaan',
    'gusto ko ng mind-blowing ending','nakakalito','twist ending'
  ],
  animation: [
    'anime','animation','cartoon','animated','family','ghibli',
    'kids','colorful','visual','vibrant',
    // Tagalog
    'anime na','kartun','animated na','pampamilya','pangbata',
    'maganda ang drawing','gawa sa japan','studio ghibli'
  ],
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
        model: 'llama-3.3-70b-versatile',
        temperature: 0,
        max_tokens: 50,
        messages: [
          {
            role: 'system',
            content: `You are a movie recommendation classifier. Given a user's mood or request, return ONLY a JSON array of matching categories from this list: romantic, thriller, funny, action, horror, drama, scifi, animation. Return 1-3 categories maximum. Return ONLY the JSON array, nothing else. Example: ["romantic","funny"]`,
          },
          { role: 'user', content: mood },
        ],
      }),
    })

    const data = await res.json()
    const raw  = data.choices?.[0]?.message?.content?.trim() ?? '[]'
    const text = raw.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(text) as Category[]
    const valid: Category[] = ['romantic','thriller','funny','action','horror','drama','scifi','animation']
    return parsed.filter((c) => valid.includes(c))
  } catch (err) {
    console.error('[detectCategoriesWithAI] Groq error, falling back:', err)
    return detectCategoriesFallback(mood)
  }
}

// ── TMDB: Fetch streaming providers for a movie ───────────────
async function fetchStreamingProviders(tmdbId: number, token: string): Promise<StreamingProvider[]> {
  try {
    // PH = Philippines, fallback to US if PH not available
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}/watch/providers`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
    const data = await res.json()

    // Try PH first, fallback to US
    const regionData = data.results?.PH ?? data.results?.US ?? null
    if (!regionData?.flatrate) return []

    // Only show top 4 streaming platforms
    return regionData.flatrate.slice(0, 4).map((p: any): StreamingProvider => ({
      name: p.provider_name,
      logoUrl: `https://image.tmdb.org/t/p/original${p.logo_path}`,
    }))
  } catch {
    return []
  }
}

// ── TMDB fetch ────────────────────────────────────────────────
async function fetchFromTMDB(categories: Category[], timeLimit: number): Promise<Movie[]> {
  const token = process.env.TMDB_API_TOKEN
  if (!token) throw new Error('No TMDB token')

  const genreIds = [...new Set(categories.flatMap((c) => GENRE_MAP[c]))]
  const genreParam = genreIds.join(',')
  const page = Math.floor(Math.random() * 5) + 1

  const url = new URL('https://api.themoviedb.org/3/discover/movie')
  url.searchParams.set('with_genres', genreParam)
  url.searchParams.set('sort_by', 'popularity.desc')
  url.searchParams.set('vote_count.gte', '100')
  url.searchParams.set('page', String(page))
  url.searchParams.set('language', 'en-US')

  const res = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  const data = await res.json()
  const results = data.results ?? []
  const shuffled = results.sort(() => Math.random() - 0.5).slice(0, 8)

  // Fetch streaming providers for all movies in parallel
  const movies = await Promise.all(
    shuffled.map(async (m: any): Promise<Movie> => {
      const streamingOn = m.id
        ? await fetchStreamingProviders(m.id, token)
        : []

      return {
        title:      m.title,
        score:      Math.round(m.vote_average * 10) / 10,
        desc:       m.overview || 'No description available.',
        duration:   m.runtime ?? 120,
        tags:       [],
        reason:     `Highly rated ${categories[0]} pick with ${m.vote_count?.toLocaleString()} votes.`,
        category:   categories[0],
        posterUrl:  m.poster_path
          ? `https://image.tmdb.org/t/p/w300${m.poster_path}`
          : undefined,
        year:       m.release_date ? parseInt(m.release_date.slice(0, 4)) : undefined,
        tmdbId:     m.id,
        streamingOn,  // ← BAGO
      }
    })
  )

  return movies
}

// ── Main recommendation function ──────────────────────────────
export async function getRecommendations(mood: string, timeLimit: number): Promise<RecommendResponse> {
  const detectedCategories = await detectCategoriesWithAI(mood)

  if (detectedCategories.length === 0) {
    return { results: [], detectedCategories: [], totalMatches: 0 }
  }

  try {
    const results = await fetchFromTMDB(detectedCategories, timeLimit)
    return {
      results: results.slice(0, 4),
      detectedCategories,
      totalMatches: results.length,
    }
  } catch (err) {
    console.error('[getRecommendations] TMDB failed:', err)
    return { results: [], detectedCategories, totalMatches: 0 }
  }
}