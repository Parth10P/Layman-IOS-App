import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { Screen } from '../../src/components/Screen';
import { SwipeableSummary } from '../../src/components/SwipeableSummary';
import { transformArticleForLayman } from '../../src/lib/api';
import { useAppState } from '../../src/state/app-state';
import { colors } from '../../src/theme';
import type { TabKey } from '../../src/types';

export default function ArticleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; from?: string }>();
  const { feedArticles, savedIds, toggleSaved } = useAppState();
  const article = feedArticles.find((entry) => entry.id === params.id) ?? null;
  const from = (params.from as TabKey | undefined) ?? 'home';
  const [aiCards, setAiCards] = useState<string[]>(article?.cards || []);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState('');

  useEffect(() => {
    if (!article) return;

    const loadSummary = async () => {
      setIsLoadingSummary(true);
      setSummaryError('');
      const cards = await transformArticleForLayman(article);
      setAiCards(cards);
      setIsLoadingSummary(false);
    };

    loadSummary();
  }, [article?.id]);

  if (!article) {
    return (
      <Screen>
        <View style={styles.missingState}>
          <Text style={styles.missingTitle}>Article not available</Text>
          <Text style={styles.missingText}>
            This article is not in the live feed right now. Go back to Home and reload the latest stories.
          </Text>
          <Pressable
            style={styles.bottomCta}
            onPress={() => router.replace(from === 'home' ? '/(tabs)' : `/(tabs)/${from}`)}
          >
            <Text style={styles.bottomCtaText}>Back to feed</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

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
          {article.publishedAt ? (
            <Text style={styles.heroMeta}>{new Date(article.publishedAt).toDateString()}</Text>
          ) : null}
        </View>

        <Text style={styles.sectionTitle}>Story in simple cards</Text>
        {isLoadingSummary ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primaryDark} />
            <Text style={styles.loadingText}>Generating plain-language summary...</Text>
          </View>
        ) : summaryError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{summaryError}</Text>
          </View>
        ) : (
          <SwipeableSummary cards={aiCards} />
        )}
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
  missingState: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  missingTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
  },
  missingText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
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
  heroMeta: {
    color: 'rgba(255, 249, 244, 0.82)',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },
  loadingBox: {
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
  loadingText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  errorBox: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
  },
  errorText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
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
