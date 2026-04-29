// app/api/admin/clear/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  // Verify admin secret
  const { secret, target } = await req.json()

  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = createServerClient()

  try {
    if (target === 'searches') {
      await db.from('searches').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    } else if (target === 'all') {
      await db.from('searches').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await db.from('sessions').delete().neq('session_id', '')
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[admin/clear]', err)
    return NextResponse.json({ error: 'Failed to clear data' }, { status: 500 })
  }
}