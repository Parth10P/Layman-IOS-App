import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArticleCard } from '../../src/components/ArticleCard';
import { BottomTabBar } from '../../src/components/BottomTabBar';
import { FeaturedCarousel } from '../../src/components/FeaturedCarousel';
import { Screen } from '../../src/components/Screen';
import { SearchBar } from '../../src/components/SearchBar';
import { fetchNews } from '../../src/lib/api';
import { useAppState } from '../../src/state/app-state';
import { colors } from '../../src/theme';

export default function HomeTab() {
  const router = useRouter();
  const { feedArticles, savedIds, setFeedArticles, toggleSaved } = useAppState();
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadNews = async () => {
      setIsLoading(true);
      setLoadError('');

      const freshArticles = await fetchNews();
      if (!active) return;

      if (freshArticles.length > 0) {
        setFeedArticles(freshArticles);
      } else if (process.env.EXPO_PUBLIC_NEWSDATA_API_KEY) {
        setFeedArticles([]);
        setLoadError('NewsData API key is invalid, expired, or has exhausted its quota. Please check your API key at newsdata.io');
      } else {
        setFeedArticles([]);
        setLoadError('NewsData API key is missing. Add EXPO_PUBLIC_NEWSDATA_API_KEY to your .env file.');
      }

      setIsLoading(false);
    };

    loadNews();

    return () => {
      active = false;
    };
  }, [setFeedArticles]);

  const filteredArticles = useMemo(() => {
    const trimmed = search.trim().toLowerCase();
    if (!trimmed) return feedArticles;
    return feedArticles.filter(
      (article) =>
        article.headline.toLowerCase().includes(trimmed) ||
        article.title.toLowerCase().includes(trimmed) ||
        article.category.toLowerCase().includes(trimmed),
    );
  }, [search]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brand}>Layman</Text>
            <Text style={styles.greeting}>Business, tech & startups made simple</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>PK</Text>
          </View>
        </View>

        <SearchBar value={search} onChangeText={setSearch} />

        {isLoading ? (
          <View style={styles.noticeBox}>
            <ActivityIndicator color={colors.primaryDark} />
            <Text style={styles.noticeText}>Loading the latest business and tech stories...</Text>
          </View>
        ) : null}

        {loadError ? (
          <View style={styles.noticeBox}>
            <Text style={styles.noticeText}>{loadError}</Text>
          </View>
        ) : null}

        {!isLoading && filteredArticles.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No live stories available</Text>
            <Text style={styles.emptyStateText}>
              Check your NewsData API key, network connection, or available quota, then reload the app.
            </Text>
          </View>
        ) : null}

        {filteredArticles.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Featured</Text>
            <FeaturedCarousel
              articles={filteredArticles}
              onPressArticle={(articleId) =>
                router.push({ pathname: '/article/[id]', params: { id: articleId, from: 'home' } })
              }
            />

            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Today's Picks</Text>
              <Text style={styles.sectionLink}>{filteredArticles.length} stories</Text>
            </View>

            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                saved={savedIds.includes(article.id)}
                onToggleSaved={() => toggleSaved(article.id)}
                onPress={() =>
                  router.push({ pathname: '/article/[id]', params: { id: article.id, from: 'home' } })
                }
              />
            ))}
          </>
        ) : null}
      </ScrollView>
      <BottomTabBar activeTab="home" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 120,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brand: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -1.1,
  },
  greeting: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontWeight: '800',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.7,
    marginBottom: 14,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionLink: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '700',
  },
  noticeBox: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  noticeText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    marginBottom: 18,
  },
  emptyStateTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyStateText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
});
