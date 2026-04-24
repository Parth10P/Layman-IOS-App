import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '../../src/theme';
import { SwipeableSummary } from '../../src/components/SwipeableSummary';
import { useStore } from '../../src/store/useStore';
import { transformArticleForLayman, fetchNews, Article } from '../../src/lib/api';

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [summaryCards, setSummaryCards] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { savedArticles, addSavedArticle, removeSavedArticle } = useStore();

  const isSaved = savedArticles.some(a => a.id === id);

  useEffect(() => {
    // In a real app we might pass the article via state or fetch by ID
    // For now, fetch all and find
    fetchNews().then(async (articles) => {
      const found = articles.find(a => a.id === id) || articles[0];
      if (found) {
        setArticle(found);
        const cards = await transformArticleForLayman(found);
        setSummaryCards(cards);
      }
      setLoading(false);
    });
  }, [id]);

  const toggleSave = () => {
    if (article) {
      if (isSaved) {
        removeSavedArticle(article.id);
      } else {
        addSavedArticle(article);
      }
    }
  };

  if (loading || !article) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Text style={styles.iconText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconText}>🔗</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleSave} style={styles.iconButton}>
            <Text style={styles.iconText}>{isSaved ? '★' : '☆'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.headline} numberOfLines={2}>{article.title}</Text>
      
      <Image source={{ uri: article.image_url || 'https://via.placeholder.com/400x300' }} style={styles.heroImage} />

      <View style={styles.contentArea}>
        <SwipeableSummary cards={summaryCards} />
      </View>

      <TouchableOpacity 
        style={styles.askButton} 
        onPress={() => router.push(`/chat/${article.id}`)}
      >
        <Text style={styles.askButtonText}>Ask Layman</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 15,
  },
  iconButton: {
    padding: 5,
  },
  iconText: {
    fontSize: 24,
    color: colors.darkText,
  },
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.darkText,
    paddingHorizontal: 20,
    marginVertical: 10,
    lineHeight: 32,
  },
  heroImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  contentArea: {
    flex: 1,
    marginTop: -20,
  },
  askButton: {
    backgroundColor: colors.primary,
    margin: 20,
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  askButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
