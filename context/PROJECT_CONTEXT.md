# PROJECT_CONTEXT.md

## Project Summary

`Layman` is a mobile news-reader assignment app focused on business, tech, and startup stories explained in simple language. The repository currently contains a working Expo Router frontend prototype and a placeholder backend package. The codebase is partially aligned with the assignment brief but is not feature-complete.

## Repository Shape

### Root

- `frontend/`: active product code
- `backend/`: placeholder package only
- `iOS Developer Assignment - Layman.docx`: primary product brief
- `README.md`: project overview and setup

### Frontend

- Framework: Expo SDK 54 + React Native 0.81 + TypeScript
- Navigation: Expo Router
- Build entry: `expo-router/entry`
- State: React context, not Zustand in the active app flow
- Styling: React Native `StyleSheet` + shared color tokens

### Backend

- No real service code
- No Docker
- No CI/CD configuration
- No deployment manifests
- No committed database schema or migrations

## Intended Product Scope From Assignment

The assignment brief calls for:

1. Welcome screen with swipe entry
2. Auth screen using Supabase
3. Home/news feed
4. Article detail screen
5. AI chat screen
6. Saved articles screen
7. Profile screen

It also expects:

- close UI fidelity to the provided design
- plain-language article transformation
- article/chat AI assistance
- saved article persistence
- production-style polish

## Actual Current State

### Implemented

- Expo Router app structure
- Seven route surfaces matching the assignment flow
- Full-screen welcome screen with swipe-to-continue interaction
- Auth UI shell
- Home feed UI using local mock article data
- Article detail UI using local mock data
- Chat UI with local heuristic responses
- Saved and Profile tabs
- Shared UI components and theme tokens
- Router + Babel + TypeScript setup working in the main project folder

### Partially Implemented

- API integration code exists in `frontend/src/lib/api.ts`, but it is not wired into the active screens
- Saved article behavior exists in memory only
- Chat exists, but responses are local fallback logic from context state rather than real LLM integration

### Not Implemented

- Supabase authentication
- persisted login/session state
- saved articles database storage
- loading/error states for networked data
- real article fetch flow in live home screen
- real AI summary generation in live article screen
- real AI chat flow in live chat screen
- backend service
- tests
- deployment pipeline
- Docker / containers
- CI/CD

## Technical Stack

### Frontend

- `expo`
- `expo-router`
- `expo-status-bar`
- `react`
- `react-native`
- `react-native-gesture-handler`
- `react-native-reanimated`
- `react-native-safe-area-context`
- `react-native-screens`
- `react-dom`
- `react-native-web`
- `typescript`

### Environment Variables Advertised

From `frontend/.env.example`:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_NEWSDATA_API_KEY`
- `EXPO_PUBLIC_GROQ_API_KEY`

Only NewsData and Groq are referenced in code today, and even those are only in an unused integration file.

## Current Architecture Reality

### Active Runtime Path

- `frontend/app/**` routes
- `frontend/src/components/**`
- `frontend/src/state/app-state.tsx`
- `frontend/src/data/articles.ts`
- `frontend/src/theme.ts`

### Legacy / Drifted Path

- `frontend/src/lib/api.ts`
- `frontend/src/store/useStore.ts`

These files represent earlier or alternate implementation ideas that have not been integrated into the active routed app.

## Delivery Status

This repo is currently best described as:

`UI-first prototype with assignment-aligned routing, but without real backend/auth/data persistence integration`

## Major Risks

1. README and prior documentation overstated implementation status.
2. Assignment requires Supabase-backed auth and persistence, but repo does not currently implement them.
3. Active screens depend on mock data, which can mask missing integration work.
4. There are parallel state/data approaches in the repo, which can confuse future contributors.

## What A New AI Should Assume

Assume the app is mid-build, not finished. The correct mental model is:

- UI shell mostly exists
- real data/auth/persistence still need to be implemented
- documentation must separate actual implementation from assignment intent
