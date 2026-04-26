# CLAUDE.md

This file defines project-specific rules for future AI sessions in this repository.

## Mission

Build `Layman` into a polished mobile news app that:

- matches the assignment mockups closely
- rewrites dense stories in plain language
- supports article-specific AI chat
- persists saved articles correctly

## Ground Truth Rules

1. Trust the current codebase over older chat history.
2. Prefer the files under `context/` as the current documentation source of truth.
3. Distinguish clearly between:
   - implemented now
   - degraded fallback behavior
   - planned but not built
4. Do not describe the app as production-ready.

## Current Stack Rules

### Frontend

- Platform: Expo + React Native + TypeScript
- Navigation: Expo Router
- Theme: shared tokens in `frontend/src/theme.ts`
- Entry: `frontend/index.ts`

### Data Integrations

- Supabase: auth + saved article persistence
- NewsData: live feed
- Groq: headline rewrites, layman cards, suggestions, Ask Layman replies

### Backend

- there is no real backend service in this repo
- `backend/` is still placeholder-only

## Architecture Rules

1. Keep route ownership in `frontend/app/**`.
2. Keep reusable UI in `frontend/src/components/**`.
3. Keep integration logic in `frontend/src/lib/**`.
4. Keep auth/persistence logic in dedicated hooks when that is already the pattern.
5. Do not reintroduce monolithic `App.tsx` architecture.
6. Do not expand the legacy Zustand path in `frontend/src/store/useStore.ts`.

## Code Standards

1. Keep route files thin where possible.
2. Normalize article payloads any time persistence shape changes.
3. If a screen depends on saved articles, handle the loading state before declaring content missing.
4. Any LLM integration must have graceful fallback behavior.
5. Avoid logging noisy handled errors as if they were fatal product failures.

## UI / UX Rules

1. This assignment is design-sensitive. Match mockups closely.
2. Do not confuse presentation-board mockups with actual in-app screens.
3. Keep the warm cream/orange Layman visual language.
4. Swipe affordances must actually swipe.
5. If an interaction is meant to be modal in the mockup, prefer modal behavior over routing away.

## AI / LLM Rules

1. Groq can rate-limit. Design for fallback.
2. Do not assume model output will be perfect JSON even when requested.
3. Preserve user experience during quota exhaustion:
   - summaries should still render
   - suggestions should still render
   - chat should still respond gracefully
4. Prefer article-grounded prompts over generic assistant behavior.

## Saved Data Rules

1. Saved articles must store enough data for:
   - article detail
   - image hero
   - layman summary regeneration or reuse
   - Ask Layman context
2. Opening a saved article must not depend only on the current live feed.
3. Normalize saved payloads on both write and read.

## Security Rules

1. Never hardcode API keys.
2. Never commit secrets into docs or source.
3. Keep all third-party credentials env-driven.

## Production-Readiness Rules

Before calling the app complete, verify:

1. saved articles persist and reopen correctly
2. Groq fallback behavior is graceful
3. NewsData empty/error states are handled
4. chat answers are sufficiently article-aware
5. legacy TypeScript drift is removed
6. context docs are updated after major behavioral changes
