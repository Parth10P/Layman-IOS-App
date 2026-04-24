# CLAUDE.md

This file defines project-specific rules for any future AI session working in this repository.

## Mission

Build and finish `Layman`, a mobile news app that explains business, tech, and startup news in plain language while matching the assignment mockups closely.

## Ground Truth Rules

1. Trust the codebase over historical chat context.
2. Distinguish clearly between:
   - what is implemented now
   - what the assignment requires
   - what is planned but not yet built
3. Do not claim Supabase, backend, persistence, deployment, or production readiness unless the code exists in this repo.
4. Before changing architecture, read:
   - `PROJECT_CONTEXT.md`
   - `CURRENT_TASK.md`
   - `ARCHITECTURE.md`
   - `BUGS_AND_FIXES.md`
   - `HANDOVER.md`

## Current Stack Rules

### Frontend

- Platform: Expo + React Native + TypeScript
- Navigation: Expo Router
- State: custom React context in `frontend/src/state/app-state.tsx`
- Styling: inline `StyleSheet` objects, shared color tokens in `frontend/src/theme.ts`
- Entry: `frontend/index.ts`
- Build config: `frontend/babel.config.js`, `frontend/app.json`, `frontend/tsconfig.json`

### Backend

- There is no implemented backend service in this repo.
- `backend/package.json` is a placeholder only.
- Do not document or code against a server API unless you add it explicitly.

### Database / Auth

- Assignment expects Supabase auth and saved article persistence.
- Current repo does not contain a working Supabase client, migrations, or database schema.
- `.env.example` advertises Supabase and API keys, but the live app does not currently use Supabase in active routes.

## Architecture Rules

1. Keep routing in `frontend/app/**`.
2. Keep reusable UI in `frontend/src/components/**`.
3. Keep lightweight domain data/types in `frontend/src/data/**` and `frontend/src/types.ts`.
4. Keep app-wide session/UI state in `frontend/src/state/**`.
5. Avoid reintroducing monolithic `App.tsx` app composition.
6. Prefer replacing dead code over layering duplicate implementations.

## Code Standards

1. Use TypeScript strictly.
2. Keep components focused and route files thin.
3. Prefer explicit names over clever abstractions.
4. Document only non-obvious decisions.
5. Do not add libraries unless they solve a concrete current need.
6. If adding persistence or API integration, wire it into the actual app flow, not into unused files.

## UI / UX Rules

1. The assignment is design-sensitive. Match mockups closely.
2. Do not confuse presentation-board mockups with in-app UI.
3. Welcome screen must be full-screen, not a phone inside a phone.
4. Swipe affordances should be functionally swipeable, not just visually suggested.
5. Preserve the warm peach/orange visual language already established.

## Product / Assignment Rules

The assignment brief in `iOS Developer Assignment - Layman.docx` expects:

- Welcome screen
- Auth screen
- Home feed
- Article detail
- Ask Layman chat
- Saved screen
- Profile screen
- Plain-language summaries
- Pixel-conscious UI fidelity

Any future AI should evaluate work against that list first.

## Security Rules

1. Never hardcode API keys.
2. Never commit secrets into docs or code.
3. Treat `.env.example` as template only.
4. If Supabase is added, use env-driven configuration and avoid embedding credentials in source.

## Production-Readiness Rules

Before calling this project "complete", verify:

1. Real auth is implemented.
2. Real article fetching is wired into the live home flow.
3. Real AI summary/chat calls are wired into the live article/chat flow.
4. Saved articles persist across launches and sessions.
5. Empty/loading/error states are handled on every major screen.
6. README and handover docs are updated after major changes.

## Anti-Drift Rules

These files indicate architectural drift right now:

- `frontend/src/lib/api.ts`
- `frontend/src/store/useStore.ts`

They describe an older intended architecture but are not the active source of truth for the current routed app. Future sessions should either:

1. integrate them properly into the running app, or
2. remove/replace them after migration is complete.

Do not leave parallel architectures in place longer than necessary.
