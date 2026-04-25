import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArticleCard } from '../../src/components/ArticleCard';
import { BottomTabBar } from '../../src/components/BottomTabBar';
import { Screen } from '../../src/components/Screen';
import { useSavedArticles } from '../../src/hooks/useSavedArticles';
import { colors } from '../../src/theme';

export default function SavedTab() {
  const router = useRouter();
  const { savedArticles, toggleSave, loading } = useSavedArticles();

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
        <Text style={styles.brand}>Saved</Text>
        <Text style={styles.greeting}>Everything you bookmarked lives here.</Text>

        <ScrollView contentContainerStyle={styles.list}>
          {savedArticles.length ? (
            savedArticles.map((article) => (
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
              <Text style={styles.emptyTitle}>No saved articles yet</Text>
              <Text style={styles.emptyText}>Tap Save on any article to keep it here.</Text>
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
    marginBottom: 24,
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
