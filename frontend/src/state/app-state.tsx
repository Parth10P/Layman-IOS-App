import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { articles } from '../data/articles';
import type { Message } from '../types';

type AppStateValue = {
  fullName: string;
  setFullName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  savedIds: string[];
  toggleSaved: (articleId: string) => void;
  chats: Record<string, Message[]>;
  sendMessage: (articleId: string, text: string) => void;
};

const starterMessages = (articleId: string): Message[] => {
  const article = articles.find((entry) => entry.id === articleId) ?? articles[0];
  return [
    {
      id: `assistant-${article.id}-1`,
      role: 'assistant',
      text: `Hi, I'm Layman. Ask me anything about "${article.headline}".`,
    },
  ];
};

const articleResponse = (articleId: string, question: string) => {
  const article = articles.find((entry) => entry.id === articleId) ?? articles[0];
  const lower = question.toLowerCase();

  if (lower.includes('risk')) {
    return 'The biggest risks are mistakes, privacy issues, and people trusting the tool too much without checking the output.';
  }

  if (lower.includes('customer') || lower.includes('user')) {
    return 'For users, the value is usually speed and clarity. The best version feels simpler and faster, not more technical.';
  }

  if (lower.includes('why')) {
    return `Because the story is really about efficiency and demand. ${article.summary}`;
  }

  return `${article.cards[0]} ${article.cards[1]}`;
};

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [fullName, setFullName] = useState('Parth Kumar');
  const [email, setEmail] = useState('parth@example.com');
  const [password, setPassword] = useState('12345678');
  const [savedIds, setSavedIds] = useState<string[]>(['2']);
  const [chats, setChats] = useState<Record<string, Message[]>>(() =>
    Object.fromEntries(articles.map((article) => [article.id, starterMessages(article.id)])),
  );

  const value = useMemo<AppStateValue>(
    () => ({
      fullName,
      setFullName,
      email,
      setEmail,
      password,
      setPassword,
      savedIds,
      toggleSaved: (articleId: string) => {
        setSavedIds((current) =>
          current.includes(articleId) ? current.filter((id) => id !== articleId) : [...current, articleId],
        );
      },
      chats,
      sendMessage: (articleId: string, text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        const userMessage: Message = {
          id: `${articleId}-${Date.now()}-user`,
          role: 'user',
          text: trimmed,
        };

        const assistantMessage: Message = {
          id: `${articleId}-${Date.now()}-assistant`,
          role: 'assistant',
          text: articleResponse(articleId, trimmed),
        };

        setChats((current) => ({
          ...current,
          [articleId]: [...(current[articleId] ?? starterMessages(articleId)), userMessage, assistantMessage],
        }));
      },
    }),
    [chats, email, fullName, password, savedIds],
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
