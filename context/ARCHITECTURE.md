# ARCHITECTURE.md

## Executive Summary

The active architecture is a client-driven Expo Router app with third-party service integrations:

- Supabase for auth and saved-article persistence
- NewsData.io for live article feed data
- Groq for text transformation and article chat

There is no custom backend service, no Docker layer, and no deployment pipeline in this repository.

## What Is Actually Implemented

### Navigation

- File-based Expo Router under `frontend/app/**`
- Hidden native tab UI with custom bottom tab bar

Why:

- keeps 7-screen ownership explicit
- aligns well with Expo assignment development

### State Management

- active UI/feed state in `frontend/src/state/app-state.tsx`
- auth in `frontend/src/hooks/useAuth.ts`
- saved articles in `frontend/src/hooks/useSavedArticles.ts`

Why:

- lightweight enough for a mobile assignment app
- lets persistent concerns sit close to their integrations

Tradeoff:

- state logic is spread across context + hooks instead of one consolidated data layer

### Auth and Persistence

- Supabase client in `frontend/src/lib/supabase.ts`
- auth/session in `useAuth`
- saved articles persisted in `saved_articles`
- each saved row stores:
  - `article_id`
  - `article_data`

Why:

- fastest way to get user-scoped persistence without building a server

Important detail:

- saved article payloads must stay normalized enough for article detail, summaries, and chat
- `useSavedArticles.ts` now explicitly normalizes this data on read/write

### Feed Data

- `fetchNews()` in `frontend/src/lib/api.ts` pulls live NewsData stories
- feed items are normalized into the shared `Article` type

Why:

- matches the assignment requirement for live business/tech content

Tradeoff:

- NewsData can return uneven article richness

### Headline Rewrite Layer

- `frontend/src/lib/headlines.ts`
- raw API titles are rewritten by Groq into short conversational display headlines
- UI uses `displayHeadline` for feed cards

Why:

- raw headlines are often too long or too formal for the assignment mockups

Tradeoff:

- depends on LLM quota and output quality

### Article Summary Layer

- `transformArticleForLayman()` in `frontend/src/lib/api.ts`
- generates 3 layman cards per article
- strict formatting prompt plus fallback generation

Why:

- assignment specifically expects short swipeable summary cards

Tradeoff:

- heavy dependence on source article quality and Groq quota

### Chat Layer

- Ask Layman modal sheet in `frontend/src/components/AskLaymanSheet.tsx`
- `generateChatSuggestions()` creates article-aware starter questions
- `askLayman()` answers using built article context:
  - rewritten headline
  - original title
  - category
  - source
  - summary
  - content
  - layman cards
  - published date
  - link

Why:

- gives the user a focused article-specific assistant instead of a generic chatbot

Tradeoff:

- answers degrade when NewsData content is thin

## Failure-Handling Decisions

### Groq Rate Limits

Decision:

- fall back gracefully on `429`/quota exhaustion instead of surfacing hard errors

Behavior:

- summary cards use local fallback cards
- suggestions use default suggestions
- chat returns a clean temporary quota message

Why:

- better mobile UX than broken cards or crashing flows

### Saved Article Lookup

Decision:

- article detail must read from both:
  - current feed articles
  - saved Supabase articles

Why:

- a saved article may no longer be present in the latest live feed

## Architecture Drift

### Legacy File

- `frontend/src/store/useStore.ts`

Current status:

- not part of the active app
- still breaks TypeScript

Rule:

- do not build new features on top of this file

## DevOps / Infrastructure Reality

### Present

- local Expo development flow
- env-driven third-party integrations

### Absent

- Docker
- docker-compose
- reverse proxy
- caching service
- custom backend
- CI/CD pipeline
- deployment configuration

## Recommended Near-Term Direction

1. keep Expo Router + component structure
2. keep Supabase for auth and saved persistence
3. improve content enrichment before save and before chat
4. remove or repair legacy Zustand file
5. add test coverage around saved article reopening and AI fallback behavior
