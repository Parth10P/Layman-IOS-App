import { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArticleCard } from '../../src/components/ArticleCard';
import { BottomTabBar } from '../../src/components/BottomTabBar';
import { Screen } from '../../src/components/Screen';
import { SearchBar } from '../../src/components/SearchBar';
import { useSavedArticles } from '../../src/hooks/useSavedArticles';
import { colors } from '../../src/theme';

export default function SavedTab() {
  const router = useRouter();
  const { savedArticles, toggleSave, loading } = useSavedArticles();
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const filteredSavedArticles = useMemo(() => {
    const trimmed = search.trim().toLowerCase();
    if (!trimmed) return savedArticles;

    return savedArticles.filter(
      (article) =>
        article.headline.toLowerCase().includes(trimmed) ||
        article.title.toLowerCase().includes(trimmed) ||
        article.category.toLowerCase().includes(trimmed) ||
        article.source.toLowerCase().includes(trimmed),
    );
  }, [savedArticles, search]);

  if (loading) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading saved articles...</Text>
        </View>
        <BottomTabBar activeTab="saved" />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.root}>
        <View style={styles.headerRow}>
          <Text style={styles.brand}>Saved</Text>
          <Pressable
            style={[styles.searchButton, searchOpen && styles.searchButtonActive]}
            onPress={() => setSearchOpen((current) => !current)}
          >
            <Ionicons
              name={searchOpen ? 'close' : 'search-outline'}
              size={20}
              color={searchOpen ? colors.primaryDark : colors.muted}
            />
          </Pressable>
        </View>

        {searchOpen || search.trim() ? (
          <View style={styles.searchWrap}>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Search saved stories"
              autoFocus={searchOpen}
            />
          </View>
        ) : null}

        <ScrollView contentContainerStyle={styles.list}>
          {filteredSavedArticles.length ? (
            filteredSavedArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                saved
                onToggleSaved={() => toggleSave(article)}
                onPress={() =>
                  router.push({ pathname: '/article/[id]', params: { id: article.id, from: 'saved' } })
                }
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>
                {savedArticles.length ? 'No matching saved articles' : 'No saved articles yet'}
              </Text>
              <Text style={styles.emptyText}>
                {savedArticles.length
                  ? 'Try a different search term to find one of your saved stories.'
                  : 'Tap Save on any article to keep it here.'}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
      <BottomTabBar activeTab="saved" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.muted,
    marginTop: 16,
    fontSize: 14,
  },
  root: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 120,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  brand: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  searchButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surfaceStrong,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchButtonActive: {
    backgroundColor: colors.chip,
  },
  searchWrap: {
    marginBottom: 18,
  },
  list: {
    paddingBottom: 12,
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    marginTop: 18,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
  },
});
