import { create } from 'zustand';

interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string | null;
  source_url: string;
  source_name: string;
  pubDate: string;
}

interface AppState {
  savedArticles: Article[];
  setSavedArticles: (articles: Article[]) => void;
  addSavedArticle: (article: Article) => void;
  removeSavedArticle: (articleId: string) => void;
}

export const useStore = create<AppState>((set) => ({
  savedArticles: [],
  setSavedArticles: (articles) => set({ savedArticles: articles }),
  addSavedArticle: (article) => set((state) => ({ savedArticles: [...state.savedArticles, article] })),
  removeSavedArticle: (articleId) => set((state) => ({ 
    savedArticles: state.savedArticles.filter(a => a.id !== articleId) 
  })),
}));
