import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../src/components/Screen';
import { SwipeableSummary } from '../../src/components/SwipeableSummary';
import { articles } from '../../src/data/articles';
import { useAppState } from '../../src/state/app-state';
import { colors } from '../../src/theme';
import type { TabKey } from '../../src/types';

export default function ArticleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; from?: string }>();
  const article = articles.find((entry) => entry.id === params.id) ?? articles[0];
  const from = (params.from as TabKey | undefined) ?? 'home';
  const { savedIds, toggleSaved } = useAppState();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.topBar}>
          <Pressable style={styles.iconButton} onPress={() => router.replace(from === 'home' ? '/(tabs)' : `/(tabs)/${from}`)}>
            <Text style={styles.iconButtonText}>{'<'}</Text>
          </Pressable>
          <View style={styles.actionRow}>
            <Pressable style={styles.iconButton}>
              <Text style={styles.iconButtonText}>L</Text>
            </Pressable>
            <Pressable style={styles.iconButton} onPress={() => toggleSaved(article.id)}>
              <Text style={styles.iconButtonText}>{savedIds.includes(article.id) ? 'B' : '+'}</Text>
            </Pressable>
            <Pressable style={styles.iconButton}>
              <Text style={styles.iconButtonText}>S</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.headline} numberOfLines={2}>
          {article.headline}
        </Text>

        <View style={[styles.heroImage, { backgroundColor: article.accent }]}>
          <Text style={styles.heroLabel}>{article.imageLabel}</Text>
        </View>

        <Text style={styles.sectionTitle}>Story in simple cards</Text>
        <SwipeableSummary cards={article.cards} />
      </ScrollView>

      <View style={styles.bottomCtaWrap}>
        <Pressable
          style={styles.bottomCta}
          onPress={() =>
            router.push({ pathname: '/chat/[articleId]', params: { articleId: article.id, from } })
          }
        >
          <Text style={styles.bottomCtaText}>Ask Layman</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 120,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '800',
  },
  headline: {
    color: colors.text,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 18,
  },
  heroImage: {
    height: 230,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  heroLabel: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  bottomCtaWrap: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 24,
  },
  bottomCta: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    paddingVertical: 18,
    alignItems: 'center',
  },
  bottomCtaText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '800',
  },
});
