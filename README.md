# 🎬 What to Watch AI — MVP Setup Guide

A mood-based streaming recommendation SaaS. Built with Next.js, Tailwind CSS, and Supabase.

---

## 📁 Project Structure

```
what-to-watch-ai/
├── app/
│   ├── page.tsx              ← Main app (user-facing)
│   ├── layout.tsx            ← Root HTML layout
│   ├── globals.css           ← Tailwind entry
│   ├── admin/
│   │   └── page.tsx          ← 📊 Analytics dashboard (you only)
│   └── api/
│       └── recommend/
│           └── route.ts      ← API: mood → recommendations + DB log
├── components/
│   └── RecommendationCard.tsx
├── data/
│   └── catalog.ts            ← All 40 mock movies
├── lib/
│   ├── recommend.ts          ← Keyword matching logic
│   └── supabase.ts           ← DB clients
├── supabase/
│   └── migration.sql         ← Run once in Supabase SQL Editor
├── types/
│   └── index.ts
└── .env.local.example        ← Copy this → .env.local
```

---

## 🚀 Setup in 5 steps

### Step 1 — Clone & install

```bash
# Download the project, then:
cd what-to-watch-ai
npm install
```

### Step 2 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New project
2. Choose a name like `what-to-watch-ai`
3. Wait ~2 minutes for it to provision

### Step 3 — Run the database migration

1. In Supabase: go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Paste the full contents of `supabase/migration.sql`
4. Click **Run** → you should see "Success"

This creates two tables:
- `searches` — every search logged with mood, category, session
- `sessions` — unique visitors with search count

### Step 4 — Set your environment variables

```bash
cp .env.local.example .env.local
```

Then open `.env.local` and fill in the three values from:
**Supabase Dashboard → Settings → API**

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

⚠️ **Never commit `.env.local` to Git.** It contains secret keys.

### Step 5 — Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📊 How to know if people are using your SaaS

### Option A — Your admin dashboard (simplest)

Go to: `http://localhost:3000/admin`

Or after deploy: `https://your-app.vercel.app/admin`

You'll see:
- Total searches
- Searches today / this week
- Most popular moods
- Every search with timestamp and session ID

### Option B — Supabase Table Editor (raw data)

1. Go to [supabase.com](https://supabase.com) → Your project
2. Click **Table Editor** in the sidebar
3. Click on the `searches` table
4. You'll see every row in real time

### Option C — Supabase built-in analytics

1. Go to **Reports** in the left sidebar
2. Supabase shows query counts, API calls, and active users automatically

---

## 🌐 Deploy to Vercel (free)

```bash
npm install -g vercel
vercel
```

When prompted, say yes to all defaults.

Then add your environment variables:
1. Go to [vercel.com](https://vercel.com) → Your project → Settings → Environment Variables
2. Add the same three variables from your `.env.local`

Your live URL will be `https://your-app-name.vercel.app`

---

## 🔒 Protect the /admin route (before going public)

The `/admin` page has no password by default. Before sharing your URL, do one of:

**Quick option** — Add a secret path check in `app/admin/page.tsx`:
```tsx
// At the top of the component, check an env secret:
if (searchParams.key !== process.env.ADMIN_SECRET) {
  return <div>Not authorized</div>
}
// Then access it as: /admin?key=your-secret
```

**Proper option** — Add Supabase Auth with an admin role (Phase 2).

---

## 📈 What to watch for (validation signals)

| Signal | Where to check | What it means |
|--------|---------------|----------------|
| `total searches` > 0 | Admin dashboard | Someone tried it |
| Same session_id returns | `searches` table | User came back |
| `categories_detected` trends | Top moods chart | What genre demand is highest |
| `results_count = 0` searches | SQL Editor | Mood input that wasn't matched |

---

## 🗺️ Phase 2 ideas (after validation)

- [ ] Real AI using Claude API for smarter mood understanding
- [ ] User accounts (Supabase Auth)
- [ ] Save favourites
- [ ] Netflix deep link integration
- [ ] Premium tier with more filters
