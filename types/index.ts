export type Category =
  | 'romantic'
  | 'thriller'
  | 'funny'
  | 'action'
  | 'horror'
  | 'drama'
  | 'scifi'
  | 'animation'

export interface Movie {
  title: string
  score: number
  desc: string
  duration: number // in minutes
  tags: string[]
  reason: string
  category: Category
}

export interface RecommendRequest {
  mood: string
  timeLimit: number // in minutes — 999 = no limit
  sessionId: string
}

export interface RecommendResponse {
  results: Movie[]
  detectedCategories: Category[]
  totalMatches: number
}

// Supabase DB row types
export interface SearchLog {
  id: string
  created_at: string
  mood_input: string
  categories_detected: Category[]
  time_filter: number
  results_count: number
  session_id: string
  user_agent: string | null
}

export interface SessionLog {
  session_id: string
  created_at: string
  last_seen: string
  search_count: number
}
