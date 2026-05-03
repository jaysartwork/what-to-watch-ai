-- ══════════════════════════════════════════════════
-- What to Watch AI — Supabase Migration (v3)
-- Run this once in: Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════

-- 0. CLEANUP (drop old tables & function)
drop function if exists upsert_session(text);
drop table if exists public.searches cascade;
drop table if exists public.sessions cascade;

-- 1. SEARCHES TABLE
--    Logs every search a user performs
create table if not exists public.searches (
  id                  uuid          default gen_random_uuid() primary key,
  created_at          timestamptz   default now() not null,
  mood_input          text          not null,
  categories_detected text[]        default '{}',
  time_filter         integer       not null,
  results_count       integer       not null default 0,
  name                text          not null default 'Anonymous',  -- ← dati: session_id
  user_agent          text
);

create index if not exists searches_created_at_idx on public.searches(created_at desc);
create index if not exists searches_name_idx       on public.searches(name);            -- ← dati: searches_session_id_idx

-- 2. SESSIONS TABLE
--    Tracks unique visitors — one row per name
create table if not exists public.sessions (
  name          text          primary key,              -- ← dati: session_id
  created_at    timestamptz   default now() not null,
  last_seen     timestamptz   default now() not null,
  search_count  integer       default 1 not null
);

-- 3. UPSERT SESSION FUNCTION
--    On first visit: inserts a new row
--    On return visit: increments search_count and updates last_seen
create or replace function upsert_session(p_name text)  -- ← dati: p_session_id
returns void language plpgsql as $$
begin
  insert into public.sessions (name, last_seen, search_count)
  values (p_name, now(), 1)
  on conflict (name)
  do update set
    search_count = sessions.search_count + 1,
    last_seen    = now();
end;
$$;

-- 4. ROW LEVEL SECURITY
alter table public.searches enable row level security;
alter table public.sessions enable row level security;

-- ══════════════════════════════════════════════════
-- Done! Your database is ready.
-- ══════════════════════════════════════════════════