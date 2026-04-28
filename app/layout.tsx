import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'What to Watch AI',
  description: 'Tell us your mood. Find your perfect watch in seconds.',
  openGraph: {
    title: 'What to Watch AI',
    description: 'Mood-based movie & series recommendations.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
