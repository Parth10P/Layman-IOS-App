# HANDOVER.md

## If A New AI Session Starts

Read these files in this order:

1. `CURRENT_TASK.md`
2. `PROJECT_CONTEXT.md`
3. `ARCHITECTURE.md`
4. `BUGS_AND_FIXES.md`
5. `CLAUDE.md`
6. `README.md`

Then inspect these code files first:

1. `frontend/app/_layout.tsx`
2. `frontend/app/index.tsx`
3. `frontend/app/auth.tsx`
4. `frontend/app/(tabs)/index.tsx`
5. `frontend/app/article/[id].tsx`
6. `frontend/app/chat/[articleId].tsx`
7. `frontend/src/state/app-state.tsx`
8. `frontend/src/lib/api.ts`

## Current Reality In One Minute

- Main project path: `/Users/patel_parthk/Desktop/Layman-IOS-App`
- The app is an Expo Router React Native frontend prototype
- The backend folder is not implemented
- The UI shell exists for the full assignment flow
- Real auth, persistence, and live article/AI integration are still missing

## Where To Resume

Resume from the main project folder, not the old worktree.

Primary folder:

- `/Users/patel_parthk/Desktop/Layman-IOS-App/frontend`

Ignore the historical worktree unless explicitly asked to revisit it.

## Recommended First Action In The Next Session

Confirm which product path the user wants:

1. finish the real data/auth implementation, or
2. continue pixel-level UI refinement first

Both are valid, but mixing them without priority causes drift.

## Safe Commands To Re-Validate The Current Frontend

Run from `frontend/`:

```bash
npm install
npx tsc --noEmit
npx expo start -c
```

Optional bundle check:

```bash
npx expo export --platform web
```

## What Not To Assume

Do not assume:

- Supabase is already wired
- saved articles are persisted
- chat uses real Groq/OpenAI calls in production flow
- backend code exists
- deployment or DevOps setup exists

## Key Technical Debt To Watch

1. dead/legacy files beside the active routed app
2. prototype data/state still powering real screens
3. assignment requirements exceeding current implementation depth
