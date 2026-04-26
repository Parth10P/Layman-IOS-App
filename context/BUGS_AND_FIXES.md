# BUGS_AND_FIXES.md

## Purpose

Tracks real bugs, fixes already applied, and current risks in the active implementation.

## Fixes Already Applied

### 1. Wrong Expo Router dynamic route filenames

Fix:

- replaced old route names with:
  - `frontend/app/article/[id].tsx`
  - `frontend/app/chat/[articleId].tsx`

Impact:

- removed route-name mismatch issues

### 2. Welcome screen rendered a fake phone inside the real phone

Fix:

- rebuilt the welcome screen as a real full-screen mobile screen

Impact:

- onboarding now matches in-app UX expectations

### 3. Welcome CTA became truly swipeable

Fix:

- implemented a draggable swipe interaction
- successful swipe routes to auth

Impact:

- interaction matches the assignment intent

### 4. Featured carousel and article cards now show images

Fix:

- added `Image` rendering for featured cards and list cards
- improved text readability with image overlays

Impact:

- article lists now visually match the design more closely

### 5. Home feed now uses live NewsData articles

Fix:

- wired `fetchNews()` into the active Home screen
- added load/error states

Impact:

- app now displays real stories instead of mock-only feed data

### 6. Feed headlines now use Groq-generated conversational rewrites

Fix:

- added `frontend/src/lib/headlines.ts`
- feed cards now use `displayHeadline`

Impact:

- headlines better match assignment tone and length constraints

### 7. Article screen now uses image hero and generated layman summary cards

Fix:

- article hero image renders when available
- summary cards are generated through `transformArticleForLayman()`

Impact:

- article detail now behaves like a true layman explainer surface

### 8. Ask Layman moved from separate route to blurred modal sheet

Fix:

- added `AskLaymanSheet.tsx`
- article CTA opens bottom sheet with blurred backdrop

Impact:

- interaction matches the assignment requirement more closely

### 9. Saved screen search added

Fix:

- added top-right search toggle and filtering on Saved tab

Impact:

- saved stories are easier to browse

### 10. Saved article open flow fixed

Problem:

- saved items could appear in the Saved list but fail on open with `Article not available`

Fix:

- article detail now looks in both live feed and saved Supabase records
- `useSavedArticles.ts` normalizes article payloads before save and after fetch
- article screen waits for saved-article loading before deciding an article is missing

Impact:

- saved stories can reopen reliably from the Saved tab

### 11. Groq JSON parsing hardened

Problem:

- valid-but-messy Groq output could trigger `Invalid response from Groq`

Fix:

- added safer JSON extraction and flexible array parsing

Impact:

- article summary generation is more resilient

### 12. Groq quota/rate-limit fallback added

Problem:

- Groq `429` responses threw hard errors and polluted logs

Fix:

- quota exhaustion now falls back gracefully:
  - summary cards use local layman fallbacks
  - question suggestions use defaults
  - chat returns a clean temporary quota message

Impact:

- app remains usable during Groq quota windows

## Known Open Issues

### 1. Legacy TypeScript errors remain

File:

- `frontend/src/store/useStore.ts`

Risk:

- `npx tsc --noEmit` remains red for unrelated legacy code

### 2. NewsData content quality varies a lot

Current behavior:

- some articles have strong summaries/content
- some are too thin for high-quality Ask Layman responses

Risk:

- AI answers can still feel generic on poor source material

### 3. Groq quota is a product dependency risk

Current behavior:

- app degrades gracefully, but premium AI output disappears when quota is exhausted

Risk:

- users may get inconsistent quality across the day unless quota or model strategy improves

### 4. Chat history is not persisted

Current behavior:

- Ask Layman conversation lives only for the current sheet/session

Risk:

- closing the sheet loses the conversation

### 5. Backend folder is still a placeholder

Current behavior:

- all live backend behavior is client-to-Supabase and client-to-third-party APIs

Risk:

- no server-side orchestration, caching, quota management, or observability layer

## High-Risk Areas For Future Changes

1. article payload shape used by both feed and saved records
2. Groq prompt/output contracts for headlines, summaries, and chat
3. navigation params between Home, Saved, and article detail
4. any attempt to reintroduce a second active state system beside the current one

## Recommended Fix Order

1. remove or repair `frontend/src/store/useStore.ts`
2. strengthen article-context enrichment for saved records and chat
3. improve Ask Layman quality on thin source articles
4. add tests around saved-article persistence and article reopening
