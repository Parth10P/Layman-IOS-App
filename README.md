# Layman

Layman is a React Native Expo news app for business, tech, and startup stories explained in simple language. It is designed around a warm editorial mobile UI, short conversational headlines, swipeable article summaries, and an article-aware AI assistant.

## What's Built

- ✅ Full Expo Router screen flow (7 screens)
- ✅ Supabase email/password auth with real session persistence
- ✅ Live NewsData.io feed (business, tech, startups)
- ✅ Groq-powered headline rewriting (conversational 7-9 word headlines)
- ✅ 3 swipeable AI-generated layman summary cards per article (28-35 words each)
- ✅ Ask Layman AI chatbot (Groq, article-context aware, 1-2 sentence answers)
- ✅ 3 auto-generated chat suggestion chips per article
- ✅ Saved articles persisted in Supabase with Row Level Security
- ✅ Search on Home and Saved screens
- ✅ Custom swipeable bottom tab navigation (Home, Saved, Profile)
- ✅ Real swipe gesture on Welcome screen (react-native-reanimated)
- ✅ Featured article carousel with image overlay + gradient readability treatment
- ✅ Groq quota fallback handling (graceful degradation, no crashes)
- ✅ In-app article link viewer (expo-web-browser, never leaves app)
- ✅ Vector icons throughout (Ionicons via @expo/vector-icons)

## Project Structure

```text
frontend/
  app/                    Expo Router screens
  src/components/         Reusable UI components
  src/hooks/              Auth and saved-article hooks
  src/lib/                NewsData, Groq, Supabase helpers
  src/state/              App-level context state
  src/theme.ts            Shared design tokens
  src/types.ts            Shared app types

context/
  *.md                    AI continuity and handoff docs

backend/
  package.json            Placeholder only
```

## Tech Stack

### Mobile App

- Expo SDK 54
- React Native 0.81
- TypeScript
- Expo Router
- React Native Gesture Handler
- React Native Reanimated
- Expo Blur
- Expo Linear Gradient
- Expo WebBrowser
- Ionicons via `@expo/vector-icons`

### Services

- Supabase
- NewsData.io
- Groq

## Setup

### Requirements

- Node.js
- npm
- Expo-compatible iOS Simulator / Android Emulator / Expo Go

### Install

```bash
cd frontend
npm install
```

### Environment Variables

Create `frontend/.env` with:

```bash
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_NEWSDATA_API_KEY=
EXPO_PUBLIC_GROQ_API_KEY=
EXPO_PUBLIC_GROQ_MODEL=llama-3.3-70b-versatile
```

### Run

```bash
cd frontend
npx expo start -c
```

Optional:

```bash
npm run ios
npm run android
npm run web
```

### Type Check

```bash
cd frontend
npx tsc --noEmit
```

## AI Workflow

Layman was developed with Claude Code as the primary implementation agent for:

- screen-by-screen UI refinement against the mockups
- Expo Router screen structure
- NewsData feed integration
- Groq prompt orchestration for headlines, summaries, and chat
- Supabase auth and saved-article persistence wiring
- continuity documentation in the `context/` folder

The app uses Groq in three main places:

1. Headline rewrite layer
   Raw article titles are converted into short conversational feed headlines.

2. Summary card layer
   Each article gets 3 layman-style swipe cards, each constrained to short readable mobile copy.

3. Ask Layman chat
   The assistant answers questions using article-specific context: title, summary, content, cards, source, and link.

If Groq quota is exhausted, the app falls back gracefully:

- summary cards use local layman fallbacks
- suggestion chips use default questions
- chat returns a clean quota message instead of crashing

## Notes For Evaluators

- Article links open in an in-app browser sheet, not an external browser.
- Saved articles are persisted in Supabase and can be reopened from the Saved tab.
- The current backend folder is intentionally a placeholder; active runtime behavior lives in the Expo client + Supabase + third-party APIs.

## Supabase Schema

Run this SQL in a fresh Supabase project:

```sql
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.saved_articles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  article_id text not null,
  article_data jsonb not null,
  saved_at timestamptz not null default now(),
  unique (user_id, article_id)
);

alter table public.profiles enable row level security;
alter table public.saved_articles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

drop policy if exists "Users can view own saved articles" on public.saved_articles;
create policy "Users can view own saved articles"
on public.saved_articles
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own saved articles" on public.saved_articles;
create policy "Users can insert own saved articles"
on public.saved_articles
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own saved articles" on public.saved_articles;
create policy "Users can update own saved articles"
on public.saved_articles
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own saved articles" on public.saved_articles;
create policy "Users can delete own saved articles"
on public.saved_articles
for delete
using (auth.uid() = user_id);
```
