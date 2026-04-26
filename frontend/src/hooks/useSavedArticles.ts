import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Article } from '../types';

const normalizeSavedArticle = (article: Partial<Article> | null | undefined): Article | null => {
  if (!article) return null;

  const headline =
    article.headline?.trim() ||
    article.displayHeadline?.trim() ||
    article.title?.trim() ||
    'Latest business and tech update';
  const source = article.source?.trim() || article.subtitle?.trim() || 'NewsData';

  return {
    id:
      article.id?.trim() ||
      article.sourceUrl?.trim() ||
      `${source}-${headline}`.replace(/\s+/g, '-').toLowerCase(),
    category: article.category?.trim() || 'General',
    title: article.title?.trim() || headline,
    subtitle: article.subtitle?.trim() || source,
    headline,
    displayHeadline: article.displayHeadline?.trim() || undefined,
    summary: article.summary?.trim() || article.content?.trim() || headline,
    imageLabel: article.imageLabel?.trim() || source,
    accent: article.accent || '#E48A48',
    cards: Array.isArray(article.cards) && article.cards.length ? article.cards : [headline, headline, headline],
    suggestions:
      Array.isArray(article.suggestions) && article.suggestions.length
        ? article.suggestions
        : ['What happened here?', 'Why does this matter?', 'Explain it simply.'],
    source,
    content: article.content?.trim() || article.summary?.trim() || headline,
    imageUrl: article.imageUrl ?? null,
    sourceUrl: article.sourceUrl?.trim() || '',
    publishedAt: article.publishedAt,
  };
};

export function useSavedArticles() {
  const { user, loading: authLoading } = useAuth();
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedArticles = useCallback(async () => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setSavedArticles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('saved_articles')
      .select('article_data')
      .eq('user_id', user.id)
      .order('saved_at', { ascending: false });

    if (data && !error) {
      setSavedArticles(
        data
          .map(item => normalizeSavedArticle(item.article_data as Partial<Article>))
          .filter((item): item is Article => Boolean(item)),
      );
    } else {
      setSavedArticles([]);
    }

    setLoading(false);
  }, [authLoading, user]);

  useEffect(() => {
    if (authLoading) return;
    fetchSavedArticles();
  }, [authLoading, fetchSavedArticles]);

  const toggleSave = useCallback(async (article: Article) => {
    if (!user) return { error: new Error('No user logged in') };

    const normalizedArticle = normalizeSavedArticle(article);
    if (!normalizedArticle) {
      return { error: new Error('Article data is invalid') };
    }

    const isSaved = savedArticles.some(a => a.id === normalizedArticle.id);

    if (isSaved) {
      // Remove from saved
      const { error } = await supabase
        .from('saved_articles')
        .delete()
        .eq('user_id', user.id)
        .eq('article_id', normalizedArticle.id);

      if (!error) {
        setSavedArticles(prev => prev.filter(a => a.id !== normalizedArticle.id));
      }

      return { error };
    } else {
      // Add to saved
      const { error } = await supabase
        .from('saved_articles')
        .upsert({
          user_id: user.id,
          article_id: normalizedArticle.id,
          article_data: normalizedArticle,
        });

      if (!error) {
        setSavedArticles(prev => {
          const withoutDuplicate = prev.filter(a => a.id !== normalizedArticle.id);
          return [normalizedArticle, ...withoutDuplicate];
        });
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
