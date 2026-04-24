import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArticleCard } from '../../src/components/ArticleCard';
import { BottomTabBar } from '../../src/components/BottomTabBar';
import { FeaturedCarousel } from '../../src/components/FeaturedCarousel';
import { Screen } from '../../src/components/Screen';
import { SearchBar } from '../../src/components/SearchBar';
import { articles } from '../../src/data/articles';
import { useAppState } from '../../src/state/app-state';
import { colors } from '../../src/theme';

export default function HomeTab() {
  const router = useRouter();
  const { savedIds, toggleSaved } = useAppState();
  const [search, setSearch] = useState('');

  const filteredArticles = useMemo(() => {
    const trimmed = search.trim().toLowerCase();
    if (!trimmed) return articles;
    return articles.filter(
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
});
