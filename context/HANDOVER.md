# HANDOVER.md

## If A New AI Session Starts

Read these files in this order:

1. `context/CURRENT_TASK.md`
2. `context/PROJECT_CONTEXT.md`
3. `context/ARCHITECTURE.md`
4. `context/BUGS_AND_FIXES.md`
5. `context/CLAUDE.md`
6. `README.md`

Then inspect these code files first:

1. `frontend/app/(tabs)/index.tsx`
2. `frontend/app/(tabs)/saved.tsx`
3. `frontend/app/article/[id].tsx`
4. `frontend/src/hooks/useSavedArticles.ts`
5. `frontend/src/lib/api.ts`
6. `frontend/src/lib/headlines.ts`
7. `frontend/src/components/AskLaymanSheet.tsx`
8. `frontend/src/state/app-state.tsx`

## Current Reality In One Minute

- Main project path: `/Users/patel_parthk/Desktop/Layman-IOS-App`
- The active app is in `frontend/`
- The live app uses:
  - Supabase for auth and saved articles
  - NewsData for feed content
  - Groq for headline rewrites, layman cards, suggestions, and chat
- Groq quota exhaustion is now handled gracefully with fallbacks
- The biggest remaining code-health issue is `frontend/src/store/useStore.ts`

## Where To Resume

Always resume from the main project folder:

- `/Users/patel_parthk/Desktop/Layman-IOS-App`

Do not switch back to the old Codex worktree unless explicitly asked.

## Recommended First Action In The Next Session

Confirm whether the user wants:

1. more UI fidelity work, or
2. deeper reliability/data-quality work

Both are active needs right now.

## Safe Commands To Re-Validate The Current Frontend

Run from `frontend/`:

```bash
npx tsc --noEmit
npx expo start -c
```

Optional:

```bash
npx expo export --platform web
```

## What Not To Assume

Do not assume:

- Groq output will always be available
- all NewsData articles include enough text for good chat answers
- legacy TypeScript failures are part of the current live path
- there is any real backend service outside Supabase + client-side API calls

## Key Technical Debt To Watch

1. `frontend/src/store/useStore.ts` is legacy and still breaks TypeScript
2. saved article payload shape must stay compatible with article detail and chat
3. AI fallback behavior should stay user-friendly when Groq quota is exhausted
