'use client'

import type { Movie } from '@/types'

interface Props {
  movie: Movie
  rank: number
}

export default function RecommendationCard({ movie, rank }: Props) {
  const scoreColor =
    movie.score >= 9.0
      ? 'text-emerald-500'
      : movie.score >= 8.0
      ? 'text-amber-500'
      : 'text-orange-400'

  return (
    <div className="flex gap-4 items-start bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">
      {/* Rank */}
      <span className="text-2xl font-medium text-zinc-300 dark:text-zinc-700 min-w-[28px] pt-0.5 text-center select-none">
        {rank}
      </span>

      {/* Body */}
      <div className="flex-1 min-w-0">
        {/* Title + Score */}
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3 className="font-semibold text-zinc-900 dark:text-white text-[15px] leading-snug">
            {movie.title}
          </h3>
          <span className={`text-[15px] font-semibold whitespace-nowrap tabular-nums ${scoreColor}`}>
            {movie.score}/10
          </span>
        </div>

        {/* Description */}
        <p className="text-zinc-500 dark:text-zinc-400 text-[13px] leading-relaxed mb-3">
          {movie.desc}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 font-medium tracking-wide uppercase">
            {movie.category}
          </span>
          {movie.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Reason */}
        <p className="text-[12px] text-zinc-400 dark:text-zinc-500 italic">
          {movie.reason}
        </p>
      </div>
    </div>
  )
}
