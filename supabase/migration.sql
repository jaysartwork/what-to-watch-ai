-- ══════════════════════════════════════════════════
-- What to Watch AI — Supabase Migration (v2)
-- Run this once in: Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════

-- 1. SEARCHES TABLE
--    Logs every search a user performs
create table if not exists public.searches (
  id                  uuid          default gen_random_uuid() primary key,
  created_at          timestamptz   default now() not null,
  mood_input          text          not null,
  categories_detected text[]        default '{}',
  time_filter         integer       not null,
  results_count       integer       not null default 0,
  session_id          text          not null,
  user_agent          text
);

create index if not exists searches_created_at_idx on public.searches(created_at desc);
create index if not exists searches_session_id_idx on public.searches(session_id);

-- 2. SESSIONS TABLE
--    Tracks unique visitors — one row per browser session
create table if not exists public.sessions (
  session_id    text          primary key,
  created_at    timestamptz   default now() not null,
  last_seen     timestamptz   default now() not null,
  search_count  integer       default 1 not null
);

-- 3. UPSERT SESSION FUNCTION (replaces buggy trigger approach)
--    Called from /api/recommend via db.rpc('upsert_session', ...)
--    On first visit: inserts a new session row
--    On return visit: increments search_count and updates last_seen
create or replace function upsert_session(p_session_id text)
returns void language plpgsql as $$
begin
  insert into public.sessions (session_id, last_seen, search_count)
  values (p_session_id, now(), 1)
  on conflict (session_id)
  do update set
    search_count = sessions.search_count + 1,
    last_seen    = now();
end;
$$;

-- 4. ROW LEVEL SECURITY
--    Writes allowed from server only (service-role key bypasses RLS).
--    The anon key cannot read or write these tables directly.
alter table public.searches enable row level security;
alter table public.sessions enable row level security;

-- ══════════════════════════════════════════════════
-- Done! Your database is ready.
-- ══════════════════════════════════════════════════