import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArticleCard } from '../../src/components/ArticleCard';
import { BottomTabBar } from '../../src/components/BottomTabBar';
import { Screen } from '../../src/components/Screen';
import { useAppState } from '../../src/state/app-state';
import { colors } from '../../src/theme';

export default function SavedTab() {
  const router = useRouter();
  const { feedArticles, savedIds, toggleSaved } = useAppState();
  const savedArticles = feedArticles.filter((article) => savedIds.includes(article.id));

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
                onToggleSaved={() => toggleSaved(article.id)}
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
