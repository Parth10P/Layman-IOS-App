import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Article } from '../types';

type AppStateValue = {
  feedArticles: Article[];
  setFeedArticles: (articles: Article[]) => void;
  fullName: string;
  setFullName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
};

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [feedArticles, setFeedArticles] = useState<Article[]>([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('');

  const value = useMemo<AppStateValue>(
    () => ({
      feedArticles,
      setFeedArticles,
      fullName,
      setFullName,
      email,
      setEmail,
      password,
      setPassword,
    }),
    [email, feedArticles, fullName, password],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used inside AppStateProvider');
  }
  return context;
}
