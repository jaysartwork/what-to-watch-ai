'use client'

import type { Movie } from '@/types'

interface Props {
  movie: Movie
  rank: number
}

export default function RecommendationCard({ movie, rank }: Props) {
  const scoreColor =
    movie.score >= 8.0 ? 'text-emerald-500' :
    movie.score >= 6.5 ? 'text-amber-500'   : 'text-orange-400'

  return (
    <div className="flex gap-4 items-start bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">

      {/* Poster */}
      <div className="flex-shrink-0 w-16 rounded-lg overflow-hidden bg-zinc-800 flex items-center justify-center" style={{ minHeight: '96px' }}>
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            width={64}
            height={96}
            className="w-16 h-24 object-cover"
          />
        ) : (
          <span className="text-2xl font-bold text-zinc-600">{rank}</span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">

        {/* Rank + Title + Score */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            {movie.posterUrl && (
              <span className="text-zinc-500 text-sm font-medium">#{rank}</span>
            )}
            <h3 className="font-semibold text-zinc-900 dark:text-white text-[15px] leading-snug">
              {movie.title}
              {movie.year && (
                <span className="ml-1.5 text-zinc-400 font-normal text-[13px]">({movie.year})</span>
              )}
            </h3>
          </div>
          <span className={`text-[15px] font-semibold whitespace-nowrap tabular-nums ${scoreColor}`}>
            {movie.score}/10
          </span>
        </div>

        {/* Description */}
        <p className="text-zinc-500 dark:text-zinc-400 text-[13px] leading-relaxed mb-2 line-clamp-2">
          {movie.desc}
        </p>

        {/* Category + Tags */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 font-medium tracking-wide uppercase">
            {movie.category}
          </span>
          {movie.tags.map((tag) => (
            <span key={tag} className="text-[11px] px-2.5 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-400">
              {tag}
            </span>
          ))}
        </div>

        {/* ── STREAMING PROVIDERS (BAGO) ── */}
        {movie.streamingOn && movie.streamingOn.length > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500">Available on</span>
            <div className="flex items-center gap-1.5">
              {movie.streamingOn.map((provider) => (
                <img
                  key={provider.name}
                  src={provider.logoUrl}
                  alt={provider.name}
                  title={provider.name}
                  width={20}
                  height={20}
                  className="w-5 h-5 rounded-md object-cover"
                />
              ))}
            </div>
          </div>
        )}

        {/* No streaming info fallback */}
        {(!movie.streamingOn || movie.streamingOn.length === 0) && (
          <div className="mb-2">
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500 italic">
              Streaming info unavailable
            </span>
          </div>
        )}

        {/* Reason */}
        <p className="text-[12px] text-zinc-400 dark:text-zinc-500 italic">{movie.reason}</p>
      </div>
    </div>
  )
}