# Layman

Layman is a React Native Expo app for reading business, tech, and startup news in simpler language. The app takes live news articles, rewrites the feed headlines into a more conversational style, generates short swipeable summary cards, and lets the user ask follow-up questions through an article-aware AI chat flow.

## App Screenshots

These screenshots show the main product flow at a glance.

### Welcome Screen

![Welcome Screen](/assets/readme/welcome.png)

### Home Screen

![Home Screen](/assets/readme/home.png)

### Article Detail Screen

![Article Detail Screen](/assets/readme/article.png)

### Ask Layman Chat

![Ask Layman Chat](/assets/readme/layman%20AI.png)
>>>>>>> Stashed changes

## Project Structure

```text
Layman-IOS-App/
├── frontend/
│   ├── app/                          # Expo Router routing layer
│   │   ├── _layout.tsx               # Root stack layout
│   │   ├── index.tsx                 # Welcome screen
│   │   ├── auth.tsx                  # Login/Signup screen
│   │   ├── article/
│   │   │   └── [id].tsx              # Article detail screen
│   │   └── (tabs)/                   # Tab navigation group
│   │       ├── _layout.tsx           # Tab bar layout
│   │       ├── index.tsx             # Home screen (feed)
│   │       ├── saved.tsx             # Saved articles screen
│   │       └── profile.tsx           # Profile screen
│   │
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   │   ├── ArticleCard.tsx       # Story cards for feed/saved
│   │   │   ├── AskLaymanSheet.tsx    # AI chat modal
│   │   │   ├── BottomTabBar.tsx      # Custom bottom navigation
│   │   │   ├── FeaturedCarousel.tsx  # Top horizontal featured stories
│   │   │   ├── Screen.tsx            # Screen wrapper component
│   │   │   ├── SearchBar.tsx         # Search input (Home/Saved)
│   │   │   ├── SwipeableSummary.tsx  # 3-card swipeable summary
│   │   │   └── WelcomeHero.tsx       # Welcome screen + swipe CTA
│   │   │
│   │   ├── hooks/                    # Stateful logic & Supabase connections
│   │   │   ├── useAuth.ts            # Supabase auth session state
│   │   │   ├── useProfile.ts         # User profile data fetching
│   │   │   └── useSavedArticles.ts   # Saved articles CRUD operations
│   │   │
│   │   ├── lib/                      # External integrations & utilities
│   │   │   ├── api.ts                # NewsData API, Groq transformations
│   │   │   ├── headlines.ts          # Headline rewriting logic
│   │   │   └── supabase.ts           # Supabase client configuration
│   │   │
│   │   ├── state/                    # Shared app state
│   │   │   └── app-state.tsx         # Feed articles, auth form values
│   │   │
│   │   ├── theme.ts                  # Shared color palette
│   │   └── types.ts                  # TypeScript type definitions
│   │
│   ├── app.json                      # Expo configuration
│   ├── babel.config.js               # Babel configuration
│   ├── index.ts                      # App entry point
│   ├── package.json                  # Dependencies
│   └── tsconfig.json                 # TypeScript configuration
│
├── context/                          # Project documentation

```

## What Each Main Folder Does

### `frontend/app`

This is the routing layer. Expo Router uses this folder to define the screens.

- `index.tsx` is the welcome screen
- `auth.tsx` is login and signup
- `article/[id].tsx` is the article detail screen
- `(tabs)/index.tsx` is the Home screen
- `(tabs)/saved.tsx` is the Saved screen
- `(tabs)/profile.tsx` is the Profile screen

### `frontend/src/components`

This contains reusable UI blocks.

- `WelcomeHero.tsx` handles the welcome UI and swipe CTA
- `FeaturedCarousel.tsx` shows the top horizontal featured stories
- `ArticleCard.tsx` shows story cards in the feed and saved list
- `SwipeableSummary.tsx` shows the 3 summary cards in the article screen
- `AskLaymanSheet.tsx` is the AI chat modal
- `BottomTabBar.tsx` is the custom bottom navigation
- `SearchBar.tsx` is reused on Home and Saved

### `frontend/src/hooks`

This contains stateful logic connected to services.

- `useAuth.ts` manages Supabase auth session state
- `useProfile.ts` fetches and updates user profile data
- `useSavedArticles.ts` reads and writes saved articles in Supabase

### `frontend/src/lib`

This contains external integrations and processing logic.

- `supabase.ts` configures the Supabase client
- `api.ts` handles:
  - fetching live articles from NewsData
  - generating layman summary cards
  - generating Ask Layman suggestions
  - answering Ask Layman questions
- `headlines.ts` rewrites raw article titles into shorter conversational feed headlines

### `frontend/src/state`

- `app-state.tsx` stores lightweight shared app state such as:
  - current feed articles
  - auth form values used in the UI

### `frontend/theme.ts`

This contains the shared color palette used across the app.

### `frontend/types.ts`

This defines shared TypeScript types like `Article` and `Message`.

## End-to-End Application Flow

This is the full user flow from opening the app to reading and saving stories.

### 1. App Launch

Entry path:

- `frontend/index.ts`
- `frontend/app/_layout.tsx`

Flow:

1. Expo starts the app through `expo-router/entry`
2. `app/_layout.tsx` mounts the root stack
3. `AppStateProvider` is attached at the top level
4. Expo Router decides which screen to show first
5. The user lands on the Welcome screen at `app/index.tsx`

### 2. Welcome to Auth

Files involved:

- `frontend/app/index.tsx`
- `frontend/src/components/WelcomeHero.tsx`
- `frontend/app/auth.tsx`

Flow:

1. The welcome screen renders `WelcomeHero`
2. The user completes the swipe gesture
3. The app routes to `/auth`
4. The user either signs up or signs in

### 3. Auth to Main App

Files involved:

- `frontend/app/auth.tsx`
- `frontend/src/hooks/useAuth.ts`
- `frontend/src/lib/supabase.ts`
- `frontend/app/(tabs)/_layout.tsx`

Flow:

1. The auth screen collects:
   - full name for signup
   - email
   - password
2. It calls `signUp()` or `signIn()` from `useAuth.ts`
3. `useAuth.ts` sends the request to Supabase Auth
4. Supabase returns the authenticated session
5. After success, the app routes into the tab layout
6. The default tab is the Home screen

### 4. Home Screen Flow

Files involved:

- `frontend/app/(tabs)/index.tsx`
- `frontend/src/lib/api.ts`
- `frontend/src/lib/headlines.ts`
- `frontend/src/components/FeaturedCarousel.tsx`
- `frontend/src/components/ArticleCard.tsx`

Flow:

1. The Home screen mounts
2. It calls `fetchNews()` from `api.ts`
3. `fetchNews()` requests live articles from NewsData
4. The NewsData response is normalized into the app’s `Article` type
5. The Home screen then calls `rewriteFeedHeadlines()`
6. `rewriteFeedHeadlines()` sends article context to Groq
7. Groq returns a shorter `displayHeadline` for each story
8. The processed articles are stored in `feedArticles`
9. The Home screen renders:
   - the top `FeaturedCarousel`
   - the vertical `ArticleCard` list under Today’s Picks

### 5. Opening an Article

Files involved:

- `frontend/app/(tabs)/index.tsx`
- `frontend/app/(tabs)/saved.tsx`
- `frontend/app/article/[id].tsx`

Flow:

1. The user taps a story from Home or Saved
2. The app routes to `article/[id].tsx`
3. The article screen reads the article id from the route
4. It looks for the article in:
   - current feed articles
   - saved Supabase articles
5. If the article is found, the detail screen is rendered

### 6. Article Detail Processing

Files involved:

- `frontend/app/article/[id].tsx`
- `frontend/src/lib/api.ts`
- `frontend/src/components/SwipeableSummary.tsx`

Flow:

1. The article screen already has the article object
2. It calls `transformArticleForLayman(article)`
3. `transformArticleForLayman()` sends article title and content to Groq
4. Groq returns 3 short summary cards
5. These 3 cards are rendered inside `SwipeableSummary`
6. The user can swipe through them horizontally

### 7. Ask Layman Flow

Files involved:

- `frontend/app/article/[id].tsx`
- `frontend/src/components/AskLaymanSheet.tsx`
- `frontend/src/lib/api.ts`

Flow:

1. The user taps `Ask Layman` on the article screen
2. The app opens `AskLaymanSheet` as a modal bottom sheet
3. The sheet first loads 3 question suggestions for that article
4. The user can:
   - tap a suggested question
   - or type a custom question
5. The question is sent to `askLayman(article, question, history)`
6. Groq returns a short article-aware answer
7. The chat updates inside the same sheet

### 8. Saving a Story

Files involved:

- `frontend/src/hooks/useSavedArticles.ts`
- `frontend/app/article/[id].tsx`
- `frontend/app/(tabs)/index.tsx`
- `frontend/app/(tabs)/saved.tsx`
- `frontend/app/(tabs)/profile.tsx`

Flow:

1. The user taps a bookmark icon from Home or Article Detail
2. `toggleSave()` from `useSavedArticles.ts` runs
3. The article is normalized before storing
4. The app writes it into Supabase `saved_articles`
5. The Saved tab later reads that same data back from Supabase
6. The Profile tab also reads the saved count from the same source

### 9. Reading Saved Stories Later

Flow:

1. The user opens the Saved tab
2. Saved stories are fetched from Supabase
3. The list is rendered with `ArticleCard`
4. If the user opens one of those stories later, the detail screen can still render it even if it is no longer in the current live feed

### 10. Profile and Sign Out

Files involved:

- `frontend/app/(tabs)/profile.tsx`
- `frontend/src/hooks/useProfile.ts`
- `frontend/src/hooks/useAuth.ts`

Flow:

1. Profile screen loads user profile info from Supabase
2. It shows:
   - user name
   - email
   - saved story count
3. If the user taps `Sign out`, `signOut()` is called
4. The app clears the session and routes back to `/auth`

## Request and Processing Flow

This section explains the request path for each important system in the app.

### 1. Authentication Request Flow

Files involved:

- `frontend/app/auth.tsx`
- `frontend/src/hooks/useAuth.ts`
- `frontend/src/lib/supabase.ts`

Flow:

1. User enters name, email, and password in `auth.tsx`
2. The screen calls `signUp()` or `signIn()` from `useAuth.ts`
3. `useAuth.ts` sends the request to Supabase Auth
4. Supabase returns the session
5. The app stores that session and the user is routed into the main app

### 2. Home Feed Request Flow

Files involved:

- `frontend/app/(tabs)/index.tsx`
- `frontend/src/lib/api.ts`
- `frontend/src/lib/headlines.ts`
- `frontend/src/state/app-state.tsx`

Flow:

1. Home screen mounts
2. `index.tsx` calls `fetchNews()` from `api.ts`
3. `fetchNews()` sends a request to NewsData.io
4. NewsData returns raw articles
5. `fetchNews()` normalizes each raw article into the app’s `Article` shape
6. Home screen then calls `rewriteFeedHeadlines()` from `headlines.ts`
7. `rewriteFeedHeadlines()` sends selected article data to Groq
8. Groq returns shorter `displayHeadline` values
9. The rewritten articles are stored in `feedArticles` through `app-state.tsx`
10. The Home screen renders:
   - `FeaturedCarousel`
   - list cards in `ArticleCard`

### 3. Headline Shortening Flow

Files involved:

- `frontend/src/lib/headlines.ts`

Purpose:

NewsData titles are often too long, too formal, or not visually suitable for the feed design. So the app creates a second feed-facing headline called `displayHeadline`.

Flow:

1. The app receives the raw title from NewsData
2. It sends the following context to Groq:
   - article id
   - original title
   - current headline
   - summary
   - content preview
   - source
   - link
3. Groq is prompted to rewrite the headline into:
   - conversational language
   - around 7 to 9 words
   - around 48 to 52 characters when possible
4. The result is saved in `displayHeadline`
5. Feed components use:
   - `article.displayHeadline || article.headline`

Fallback behavior:

If Groq is unavailable, the app builds a shorter fallback headline locally.

### 4. Article Detail Request Flow

Files involved:

- `frontend/app/article/[id].tsx`
- `frontend/src/lib/api.ts`
- `frontend/src/hooks/useSavedArticles.ts`

Flow:

1. User taps a story from Home or Saved
2. The app routes to `article/[id].tsx`
3. The screen looks up the article from:
   - current live feed articles
   - saved Supabase articles
4. Once the article is found, the screen calls `transformArticleForLayman()`
5. `transformArticleForLayman()` sends article title and content to Groq
6. Groq returns 3 short summary cards
7. The screen shows:
   - 2-line headline
   - hero image
   - 3 swipeable summary cards
   - save, share, and original-link actions

Fallback behavior:

If Groq fails or quota is exhausted, local summary cards are generated instead.

### 5. Ask Layman Chat Flow

Files involved:

- `frontend/src/components/AskLaymanSheet.tsx`
- `frontend/src/lib/api.ts`

There are two parts in the AI chat flow:

### A. Suggestion generation

Function:

- `generateChatSuggestions(article)`

Flow:

1. When the Ask Layman sheet opens, it sends article context to Groq
2. The article context includes:
   - display headline
   - original title
   - category
   - source
   - summary
   - content
   - layman cards
   - publish date
   - source link
3. Groq returns 3 short article-specific question suggestions
4. These are shown as orange clickable chips in the chat sheet

Fallback behavior:

If Groq is unavailable or rate-limited, the app shows default suggestions.

### B. Answer generation

Function:

- `askLayman(article, question, history)`

Flow:

1. User taps a suggestion or types a question
2. `AskLaymanSheet.tsx` sends:
   - the selected article
   - the user question
   - chat history
   to `askLayman()`
3. `askLayman()` builds a detailed article context from the article data
4. That context is sent to Groq with rules:
   - answer in 1 to 2 short sentences
   - use simple everyday language
   - stay grounded in article context
5. Groq returns the answer
6. The chat sheet appends:
   - user message
   - assistant answer

Fallback behavior:

If Groq quota is exhausted, the app returns a safe message instead of crashing.

### 6. Saved Articles Flow

Files involved:

- `frontend/src/hooks/useSavedArticles.ts`
- `frontend/app/(tabs)/saved.tsx`
- `frontend/app/(tabs)/profile.tsx`
- `frontend/app/article/[id].tsx`

Flow:

1. User taps bookmark on a feed card or article detail screen
2. `toggleSave()` in `useSavedArticles.ts` is called
3. The article is normalized before save
4. The article is upserted into Supabase `saved_articles`
5. The Saved screen fetches saved rows and renders them as `ArticleCard`s
6. The Profile screen reads the same saved data count
7. When a saved story is opened later, the article detail screen can still load it even if it is no longer in the live feed

### 7. Original Article Link Flow

Files involved:

- `frontend/app/article/[id].tsx`

Flow:

1. User taps the link icon on article detail
2. The app checks `article.sourceUrl`
3. It opens the article using `expo-web-browser`
4. The article opens in an in-app browser sheet instead of leaving the app

## Important Design and UX Decisions

1. The feed uses shorter rewritten headlines to match the mockup and improve readability.
2. The article screen keeps the original article context but presents it as short cards.
3. The Ask Layman chat is a modal sheet, not a full route, because it matches the design better.
4. Saved articles are persisted as full article payloads so they can reopen correctly later.

## Environment Variables

Create `frontend/.env`:

```bash
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_NEWSDATA_API_KEY=
EXPO_PUBLIC_GROQ_API_KEY=
EXPO_PUBLIC_GROQ_MODEL=llama-3.3-70b-versatile
```

## Run the Project

```bash
cd frontend
npm install
npx start
```

## Type Check

```bash
cd frontend
npx tsc --noEmit
```

## Flow Summary

If I explain the full application flow in one straight line, it is:

1. User opens app
2. Welcome screen shows swipe entry
3. User signs up or signs in with Supabase
4. Home screen fetches articles from NewsData
5. Groq rewrites feed headlines into shorter conversational ones
6. User opens an article
7. Groq generates 3 layman summary cards for that article
8. User can save the article into Supabase
9. User can open Ask Layman, which sends article context to Groq for suggestions and answers
10. User can revisit saved stories later from the Saved tab
