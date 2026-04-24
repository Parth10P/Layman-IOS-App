# ARCHITECTURE.md

## Executive Summary

The implemented architecture is currently a frontend-first Expo Router application with local in-memory state and mock article data. The repository still contains signs of a planned richer architecture involving Supabase, NewsData.io, and Groq, but those integrations are not yet wired into the active app flow.

## What Is Actually Implemented

### Navigation

- File-based routing with Expo Router
- Root stack in `frontend/app/_layout.tsx`
- Hidden native tab bar with a custom bottom tab component

Why this was chosen:

- Matches React Native/Expo idioms
- Keeps route ownership explicit in the filesystem
- Makes the 7-screen assignment structure easy to reason about

### State Management

- Active app state uses React context in `frontend/src/state/app-state.tsx`
- State currently includes:
  - mock auth form values
  - in-memory saved article IDs
  - in-memory chat history

Why this was chosen:

- Low complexity for a fast UI-first prototype
- No external store required for current mock interactions
- Keeps initial implementation simple while routing/UI is being stabilized

Tradeoff:

- This does not persist across app relaunches
- It will become limiting once real auth and network data are added

### Data Source

- Active screens use static article data from `frontend/src/data/articles.ts`

Why this was chosen:

- Enables fast screen building before live APIs are ready
- Supports design iteration independent of backend readiness

Tradeoff:

- The app does not yet reflect real news content
- Summary/chat flows do not exercise production data

### UI Composition

- Route screens are relatively thin
- Shared visual elements live in `frontend/src/components`
- Color tokens live in `frontend/src/theme.ts`

Why this was chosen:

- Reduces duplication
- Supports consistent assignment-themed styling
- Makes later UI adjustments easier

## What The Repository Suggests Was Planned

### Supabase

Evidence:

- `.env.example` includes Supabase variables
- assignment brief explicitly calls for Supabase auth and persistence
- older README references Supabase setup

Current reality:

- no active Supabase client used by the routed app
- no migrations or config are committed
- no session persistence exists

### NewsData.io + Groq

Evidence:

- `frontend/src/lib/api.ts` includes fetch/transform/chat helpers
- `.env.example` includes corresponding API keys

Current reality:

- this file is not connected to the current routed screens
- the app currently uses mock article data and local heuristic chat responses

### Zustand

Evidence:

- `frontend/src/store/useStore.ts`

Current reality:

- the active app does not use this store
- React context replaced it in the current implementation path

## Why There Is Architecture Drift

The project appears to have moved through at least two phases:

1. planned integration-heavy implementation
2. fast UI/routing prototype implementation

The repo now contains artifacts of both, which creates drift:

- current app flow: context + mock data
- legacy helpers: Zustand + API integration module

This should be resolved by converging on one active architecture.

## DevOps / Infrastructure Reality

### Present

- npm-based frontend workflow
- Expo local development flow

### Absent

- Docker
- docker-compose
- reverse proxy
- caching layer
- CI/CD pipeline
- deployment configuration
- infrastructure-as-code

Any documentation that implies these exist would be inaccurate.

## Recommended Near-Term Architecture Direction

### Preferred

Keep the current Expo Router structure and route ownership, but evolve the data layer incrementally:

1. keep `app/**` and component structure as-is
2. replace static article usage with a real repository/service layer
3. replace mock auth with real Supabase auth
4. replace in-memory saved state with persisted storage
5. delete or migrate legacy duplicate files once live features are wired

This preserves the strongest part of the current codebase: the routed UI shell.

## Architecture Decisions Future AI Should Preserve

1. Expo Router remains the routing backbone.
2. Route filenames must follow dynamic bracket notation.
3. Shared presentational logic should stay in `src/components`.
4. Assignment-facing screens should remain visually consistent with the warm Layman theme.
5. Do not reintroduce a monolithic single-file app structure.
