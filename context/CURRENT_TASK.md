# CURRENT_TASK.md

## Active Focus

Establish a durable AI project context system and stabilize the codebase for continued development from the main project folder.

## What Was Just Done

- Merged the refactored Expo Router app from a worktree into the main project folder
- Corrected route file names to Expo Router dynamic-route conventions:
  - `app/article/[id].tsx`
  - `app/chat/[articleId].tsx`
- Reworked the welcome screen so it is a real full-screen UX, not a nested phone mockup
- Made the welcome CTA swipeable
- Removed the `SwipeableSummary` dependency on Reanimated to avoid route-load crashes
- Added root-level continuity docs requested in the current session

## Immediate Next Engineering Work

1. Decide whether to keep the current mock-data prototype path or resume the original Supabase/API integration path.
2. If continuing product work, the highest-value next milestone is:
   - wire real NewsData fetching into the Home screen
   - wire real AI summary generation into Article Detail
   - wire real Ask Layman calls into Chat
3. After that:
   - implement Supabase auth
   - persist saved articles
   - remove dead/duplicate architecture files

## Current Blockers

1. No working Supabase integration in the live app flow
2. No persisted storage for session or saved data
3. API integration exists only in an unused file
4. Backend folder is effectively empty
5. No automated tests

## Decision Needed Soon

Choose one architecture direction:

### Option A: Finish the current lightweight prototype architecture

- Keep React context state
- Integrate API calls directly into current routed screens
- Add Supabase only where needed

### Option B: Migrate to a fuller data layer

- Reintroduce/store a coherent state architecture
- Rewire API and persistence intentionally
- Remove the current mock-only flow after replacement

Do not continue with both paths in parallel.

## Current Validation State

Recent checks completed during this session:

- `npx tsc --noEmit`
- `npx expo export --platform web`

These confirm the frontend bundles, but they do not prove real auth/API functionality.
