# PROJECT_CONTEXT.md

## Project Summary

`Layman` is an Expo Router React Native app for business, tech, and startup news rewritten in simpler language. The app now uses live NewsData articles, Groq-based headline/summary/chat generation, and Supabase-backed authentication plus saved-article persistence.

The project is no longer a pure mock-data prototype, but it is still not production-complete. The backend folder remains a placeholder, there is no CI/CD or Docker, and a few legacy files still exist beside the active implementation path.

## Repository Shape

### Root

- `frontend/`: active mobile app
- `backend/`: placeholder only
- `context/`: AI continuity and handoff documentation
- `iOS Developer Assignment - Layman.docx`: product/design brief
- `README.md`: project setup and overview

### Frontend

- Framework: Expo SDK 54 + React Native 0.81 + TypeScript
- Navigation: Expo Router
- Auth/data backend: Supabase
- News source: NewsData.io
- LLM: Groq
- Styling: React Native `StyleSheet` + shared theme tokens

## Intended Product Scope

The assignment expects:

1. Welcome screen
2. Auth screen
3. Articles/Home screen
4. Article detail/content screen
5. Ask Layman AI chat
6. Saved articles screen
7. Profile screen

It also expects:

- close design fidelity to the provided mockups
- conversational, rewritten headlines
- 3 swipeable layman summary cards per article
- article-specific AI chat
- saved article persistence

## Actual Current State

### Implemented

- Expo Router app structure for the full assignment flow
- Full-screen welcome screen with swipe-to-continue
- Auth screen UI connected to Supabase auth hooks
- Home screen with live NewsData feed
- Groq-generated short conversational display headlines for feed cards
- Featured carousel with image overlay treatment
- Article detail screen with:
  - live article lookup
  - image hero
  - save/share/link actions
  - Groq-generated layman summary cards
- Ask Layman bottom-sheet modal with blurred background
- Saved articles persisted in Supabase and searchable in-app
- Profile screen shell
- Shared component/theme structure

### Partially Implemented

- Groq features are live, but they depend on quota and fall back locally when rate-limited
- Saved article persistence works, but saved payload normalization was recently added and should be watched during further schema changes
- Chat is article-aware, but answer quality still depends on how much text NewsData returns for a given story

### Not Implemented

- backend service code
- Docker / container setup
- CI/CD
- deployment manifests
- automated tests
- persisted chat history
- article caching / offline behavior

## Technical Stack

### Frontend Runtime

- `expo`
- `expo-router`
- `expo-blur`
- `@expo/vector-icons`
- `react`
- `react-native`
- `react-native-gesture-handler`
- `react-native-reanimated`
- `react-native-safe-area-context`
- `react-native-screens`
- `typescript`

### Data / Services

- Supabase auth + saved article storage
- NewsData.io article feed
- Groq for:
  - rewritten feed headlines
  - layman summary cards
  - chat suggestions
  - Ask Layman responses

## Environment Variables In Use

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_NEWSDATA_API_KEY`
- `EXPO_PUBLIC_GROQ_API_KEY`
- `EXPO_PUBLIC_GROQ_MODEL` optional

## Active Runtime Path

Treat these as the main app path:

- `frontend/app/**`
- `frontend/src/components/**`
- `frontend/src/hooks/useAuth.ts`
- `frontend/src/hooks/useSavedArticles.ts`
- `frontend/src/lib/api.ts`
- `frontend/src/lib/headlines.ts`
- `frontend/src/lib/supabase.ts`
- `frontend/src/state/app-state.tsx`
- `frontend/src/types.ts`

## Legacy / Drifted Path

- `frontend/src/store/useStore.ts`

This file is not the active state path and still causes TypeScript errors.

## Delivery Status

Best description today:

`working UI + live data + partial persistence integration, with remaining polish, resilience, and cleanup work`

## Major Risks

1. Groq quota exhaustion causes AI features to fall back. This is now handled gracefully, but output quality will drop during quota windows.
2. NewsData sometimes returns thin article text, which weakens Ask Layman answers.
3. `frontend/src/store/useStore.ts` still fails TypeScript and can confuse future contributors.
4. Saved article behavior depends on normalized stored payloads staying compatible with article screen requirements.

## What A New AI Should Assume

- The app is real enough to test end-to-end for feed, article, saved, and AI flows.
- It is not finished infrastructure-wise.
- The live implementation uses Supabase, NewsData, and Groq in the current routed app.
- Legacy drift still exists and should be reduced, not expanded.
