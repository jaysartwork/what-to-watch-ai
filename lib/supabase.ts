import { createClient } from '@supabase/supabase-js'

// --------------------
// CLIENT (Browser-safe)
// --------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase public env vars")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// --------------------
// SERVER ONLY CLIENT
// --------------------
export function createServerClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!serviceRoleKey) {
    throw new Error("Missing Supabase service role key")
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false
    }
  })
}