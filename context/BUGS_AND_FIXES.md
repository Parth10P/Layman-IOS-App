# BUGS_AND_FIXES.md

## Purpose

This file tracks real issues discovered in the repository, fixes already applied, and risks that remain open.

## Fixes Already Applied

### 5. Featured carousel images not visible

Problem:
- `FeaturedCarousel` component was not rendering article images
- Cards showed only text on colored backgrounds

Fix applied:
- Added `Image` component to render `item.imageUrl` as card background
- Added dark overlay (`shade`) for text readability over images
- Increased card height from 220 to 260 for better content visibility

Impact:
- Featured carousel now displays article images from NewsData API

### 6. Article card thumbnails showing text instead of images

Problem:
- `ArticleCard` component displayed text label in thumbnail box instead of article images

Fix applied:
- Added `Image` component to render `article.imageUrl` in thumb container
- Falls back to text label when no image available

Impact:
- "Today's Picks" list now shows article images in square thumbnails

### 7. App-wide icons using text letters instead of vector icons

Problem:
- Bottom tab bar icons were text letters ("H", "S", "P")
- Profile and home page avatars showed text initials ("PK")

Fix applied:
- Installed `@expo/vector-icons` package
- Updated `BottomTabBar.tsx` to use Ionicons:
  - Home: `home` icon
  - Saved: `bookmark` icon
  - Profile: `person` icon
- Updated `profile.tsx` avatar to use `person` icon (40px)
- Updated `index.tsx` header avatar to use `person` icon (24px)

Impact:
- Consistent vector icons throughout the app
- Icons scale perfectly on all screen sizes

### 1. Wrong Expo Router dynamic route filenames

Problem:

- main project previously used:
  - `frontend/app/article/id.tsx`
  - `frontend/app/chat/articleId.tsx`
- Expo Router expects bracket syntax for dynamic routes

Fix applied:

- replaced with:
  - `frontend/app/article/[id].tsx`
  - `frontend/app/chat/[articleId].tsx`

Impact:

- removed route-name mismatch warnings
- aligned router structure with actual navigation calls

### 2. Welcome screen rendered a phone inside the phone

Problem:

- welcome UI was initially implemented as a mock presentation frame inside the real device screen

Fix applied:

- replaced with a true full-screen welcome layout in `frontend/src/components/WelcomeHero.tsx`

Impact:

- matches actual in-app UX expectations instead of a portfolio-slide representation

### 3. Swipe CTA was not truly swipe-driven

Problem:

- the welcome CTA visually suggested a swipe but behaved like a button

Fix applied:

- implemented a draggable swipe control using `PanResponder` and `Animated`

Impact:

- user interaction now matches assignment intent more closely

### 4. `SwipeableSummary` route load issue

Problem:

- `SwipeableSummary.tsx` imported Reanimated in a way that contributed to route-load/runtime trouble during development

Fix applied:

- simplified the component to a plain horizontal `ScrollView`

Impact:

- reduced boot/runtime fragility
- article route now loads more predictably

## Known Open Issues

### 1. Auth screen is visual only

Current behavior:

- auth fields update local state
- entering the app does not authenticate against any backend

Risk:

- assignment expects real auth and session persistence

### 2. Saved state is in memory only

Current behavior:

- saved article IDs live in React context only

Risk:

- all saved state disappears on reload/app restart
- assignment expects persistent saved articles

### 3. Home feed is still mock data

Current behavior:

- home screen uses `src/data/articles.ts`

Risk:

- product looks functional but does not consume real news data

### 4. Chat is not using the real AI integration path

Current behavior:

- chat responses come from local heuristic logic in `app-state.tsx`

Risk:

- assignment expects AI-backed layman explanations

### 5. Legacy architecture drift remains

Files involved:

- `frontend/src/lib/api.ts`
- `frontend/src/store/useStore.ts`

Risk:

- future contributors may edit dead paths and think features are wired when they are not

### 6. README previously overstated implementation status

Current behavior:

- historical documentation referenced a backend/Supabase structure not present in the actual repo

Risk:

- future AI or developers may assume functionality that does not exist

## High-Risk Areas For Future Changes

1. Navigation parameters between tabs, article detail, and chat
2. Any future migration from mock data to real APIs
3. Reintroducing Reanimated-based gesture code without validating Babel/runtime setup
4. Mixing Zustand and React context instead of choosing one active state model

## Recommended Fix Order

1. Wire real data into Home, Article, and Chat
2. Implement real Supabase auth
3. Persist saved articles
4. Remove or migrate dead architecture files
5. Add tests and stronger error states
