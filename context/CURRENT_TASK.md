# CURRENT_TASK.md

## Active Focus

Stabilize the live NewsData + Groq + Supabase implementation while continuing pixel-level UI refinement against the Layman assignment mockups.

## What Was Just Completed

### Saved article detail fix

- Saved articles can now be opened from the Saved tab without incorrectly landing on `Article not available`
- `useSavedArticles.ts` now normalizes stored payloads before save and after read
- article detail lookup now supports both live feed articles and saved Supabase records
- loading state now waits for saved-article fetch completion before declaring the article missing

### Groq response hardening

- `transformArticleForLayman()` now safely parses imperfect Groq JSON responses
- unexpected Groq summary payloads fall back to local layman cards instead of throwing
- chat suggestion parsing is also more tolerant

### Groq quota fallback

- `429` and quota-limit responses now degrade gracefully
- summary cards use local fallbacks
- suggestions use default fallbacks
- Ask Layman chat shows a clean quota message instead of crashing or logging a hard error path into the UI

### Feed and article UX already in place

- conversational rewritten headlines for Home
- bottom image gradient for Featured carousel readability
- article hero images render correctly
- Ask Layman runs as a blurred modal sheet instead of routing away
- saved screen includes search

## Immediate Next Work

1. Verify that all saved articles persist with enough fields for article detail, chat, and summary generation.
2. Improve Ask Layman answer quality when NewsData provides only thin content.
3. Decide whether to add article payload enrichment before save:
   - preserve generated layman cards
   - preserve rewritten display headline
   - preserve richer text context for chat
4. Clean up or remove `frontend/src/store/useStore.ts` so TypeScript is no longer red on unrelated legacy code.

## Current Blockers

1. Groq daily quota is limited and may temporarily disable premium AI output.
2. Some NewsData articles have weak or incomplete content, which limits chat quality.
3. TypeScript still fails because of the inactive legacy file `frontend/src/store/useStore.ts`.

## Current Validation State

Validated recently:

- saved article normalization path updated
- article detail lookup updated for saved records
- Groq summary/chat fallback logic updated

`npx tsc --noEmit` still fails only because of `frontend/src/store/useStore.ts`, not because of the current live flow.

## Recommended Next Session Start

Open these files first:

1. `frontend/src/hooks/useSavedArticles.ts`
2. `frontend/app/article/[id].tsx`
3. `frontend/src/lib/api.ts`
4. `frontend/src/lib/headlines.ts`
5. `frontend/src/components/AskLaymanSheet.tsx`
