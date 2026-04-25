import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Article } from '../types';

export function useSavedArticles() {
  const { user } = useAuth();
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSavedArticles = useCallback(async () => {
    if (!user) {
      setSavedArticles([]);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('saved_articles')
      .select('article_data')
      .eq('user_id', user.id)
      .order('saved_at', { ascending: false });

    setLoading(false);

    if (data && !error) {
      setSavedArticles(data.map(item => item.article_data as Article));
    }
  }, [user]);

  useEffect(() => {
    fetchSavedArticles();
  }, [fetchSavedArticles]);

  const toggleSave = useCallback(async (article: Article) => {
    if (!user) return { error: new Error('No user logged in') };

    const isSaved = savedArticles.some(a => a.id === article.id);

    if (isSaved) {
      // Remove from saved
      const { error } = await supabase
        .from('saved_articles')
        .delete()
        .eq('user_id', user.id)
        .eq('article_id', article.id);

      if (!error) {
        setSavedArticles(prev => prev.filter(a => a.id !== article.id));
      }

      return { error };
    } else {
      // Add to saved
      const { error } = await supabase
        .from('saved_articles')
        .upsert({
          user_id: user.id,
          article_id: article.id,
          article_data: article,
        });

      if (!error) {
        setSavedArticles(prev => [...prev, article]);
      }

      return { error };
    }
  }, [user, savedArticles]);

  const isSaved = useCallback((articleId: string) => {
    return savedArticles.some(a => a.id === articleId);
  }, [savedArticles]);

  return {
    savedArticles,
    loading,
    toggleSave,
    isSaved,
    refreshSavedArticles: fetchSavedArticles,
  };
}
