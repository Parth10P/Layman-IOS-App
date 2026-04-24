# Layman

Layman is a React Native news app assignment built with Expo. The product goal is to present business, tech, and startup news in plain language with a warm, polished mobile UI.

This repository currently contains a working frontend prototype with the full routed screen flow and shared UI system, but it is not yet a complete production implementation of the assignment requirements.

## Current Status

Implemented today:

- Expo Router app structure
- Welcome, Auth, Home, Article, Chat, Saved, and Profile screens
- Custom bottom tab navigation
- Full-screen swipeable welcome CTA
- Shared UI components and theme tokens
- Mock article dataset for UI development
- In-memory saved/article/chat state

Not implemented yet:

- real Supabase auth
- persistent session handling
- persistent saved articles
- live NewsData feed in the home screen
- live AI summary generation in article detail
- live AI-backed Ask Layman chat
- backend service
- tests
- CI/CD or deployment setup

## Repository Structure

```text
frontend/
  app/                  Expo Router screens
  src/components/       Reusable UI pieces
  src/data/             Mock article data
  src/state/            Active app-wide React context
  src/theme.ts          Color/design tokens
  src/lib/api.ts        Unwired API integration helpers
  src/store/useStore.ts Legacy Zustand store, not active

backend/
  package.json          Placeholder only
```

## Tech Stack

### Frontend

- Expo SDK 54
- React Native
- TypeScript
- Expo Router
- React Native Gesture Handler
- React Native Reanimated

### Intended Integrations

- Supabase
- NewsData.io
- Groq

These integrations are referenced by the assignment and environment template, but they are not fully wired into the active app flow yet.

## Setup

### Requirements

- Node.js
- npm

### Install

```bash
cd frontend
npm install
```

### Run

```bash
npx expo start -c
```

Useful alternatives:

```bash
npm run ios
npm run android
npm run web
```

## Environment Variables

Create a `.env` file in `frontend/` based on `.env.example`.

Expected variables:

```bash
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_NEWSDATA_API_KEY=
EXPO_PUBLIC_GROQ_API_KEY=
```

Important:

- The current routed app does not yet fully consume these values.
- `frontend/src/lib/api.ts` is the main existing integration reference.

## Validation

From `frontend/`:

```bash
npx tsc --noEmit
npx expo export --platform web
```

## Documentation For Future AI Sessions

Read these root files before continuing development:

- `CLAUDE.md`
- `PROJECT_CONTEXT.md`
- `CURRENT_TASK.md`
- `ARCHITECTURE.md`
- `BUGS_AND_FIXES.md`
- `HANDOVER.md`

## Assignment Note

The repository includes the original assignment brief:

- `iOS Developer Assignment - Layman.docx`

The implementation should be evaluated against that brief, especially for:

- screen completeness
- UI fidelity
- plain-language news presentation
- auth and saved article behavior
- AI-assisted article/chat behavior
