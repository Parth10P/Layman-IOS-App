export type TabKey = 'home' | 'saved' | 'profile';

export type Article = {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  headline: string;
  summary: string;
  imageLabel: string;
  accent: string;
  cards: string[];
  suggestions: string[];
  source: string;
};

export type Message = {
  id: string;
  role: 'assistant' | 'user';
  text: string;
};
