```frontend/
├── app/                        # Expo Router Pages (The 7 Screens)
│   ├── _layout.tsx             # Root layout & global providers
│   ├── index.tsx               # 1. Welcome Screen
│   ├── auth.tsx                # 2. Auth Screen
│   ├── (tabs)/                 # Bottom Tab Navigation (Protected)
│   │   ├── _layout.tsx         # Tabs layout & Auth Guard
│   │   ├── index.tsx           # 3. Articles Screen (Home)
│   │   ├── saved.tsx           # 6. Saved Screen
│   │   └── profile.tsx         # 7. Profile Screen
│   ├── article/                
│   │   └── [id].tsx            # 4. Content Screen (Article Detail)
│   └── chat/                   
│       └── [articleId].tsx     # 5. Ask Layman Screen (AI Chat)
│
├── src/                        # Core Application Code
│   ├── components/             # Reusable UI Components
│   │   ├── ArticleCard.tsx     # Used in Home & Saved screens
│   │   ├── SwipeableSummary.tsx# The 3 summary cards (28-35 words each)
│   │   └── ChatBubble.tsx      # UI for the chatbot messages
│   ├── lib/                    # Integrations and Utilities
│   │   ├── supabase.ts         # Supabase client & AsyncStorage setup
│   │   └── api.ts              # Handlers for NewsData.io & Groq API
│   ├── theme.ts                # Warm peach/orange design tokens
│   └── store/                  # State Management (Zustand)
│       └── useStore.ts         # User session & local cache
│
├── assets/                     # Images, icons, and custom fonts
├── .env.example                # Template for your API keys
├── app.json                    # Expo configuration
└── package.json                # Dependencies
```




backend/
├── supabase/
│   ├── config.toml             # Local Supabase project configuration
│   ├── seed.sql                # Dummy data for testing (optional)
│   └── migrations/             # SQL database migrations
│       └── 20260424_create_saved_articles.sql  # Schema & RLS policies
│
└── package.json                # NPM scripts (e.g., "npm run supabase:start")
