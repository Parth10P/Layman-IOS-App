import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useEffect, useState } from 'react';
import { AskLaymanSheet } from '../../src/components/AskLaymanSheet';
import { Screen } from '../../src/components/Screen';
import { SwipeableSummary } from '../../src/components/SwipeableSummary';
import { useSavedArticles } from '../../src/hooks/useSavedArticles';
import { transformArticleForLayman } from '../../src/lib/api';
import { useAppState } from '../../src/state/app-state';
import { colors } from '../../src/theme';
import type { TabKey } from '../../src/types';

export default function ArticleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; from?: string }>();
  const { feedArticles } = useAppState();
  const { savedArticles, loading: isLoadingSavedArticles, toggleSave, isSaved } = useSavedArticles();
  const article =
    feedArticles.find((entry) => entry.id === params.id) ||
    savedArticles.find((entry) => entry.id === params.id) ||
    null;
  const from = (params.from as TabKey | undefined) ?? 'home';
  const [aiCards, setAiCards] = useState<string[]>([]);
  const [isLoadingSummary, setIsLoadingSummary] = useState(Boolean(article));
  const [summaryError, setSummaryError] = useState('');
  const [isAskLaymanOpen, setIsAskLaymanOpen] = useState(false);

  useEffect(() => {
    if (!article) {
      setAiCards([]);
      setIsLoadingSummary(false);
      return;
    }

    const loadSummary = async () => {
      setIsLoadingSummary(true);
      setSummaryError('');
      const cards = await transformArticleForLayman(article);
      setAiCards(cards);
      setIsLoadingSummary(false);
    };

    loadSummary();
  }, [article?.id]);

  const handleOpenSource = async () => {
    if (!article?.sourceUrl) {
      Alert.alert('Link unavailable', 'This article does not have a source URL.');
      return;
    }
    try {
      await WebBrowser.openBrowserAsync(article.sourceUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
        toolbarColor: '#FF6B35',
      });
    } catch (error) {
      Alert.alert('Unable to open link', 'The original article link could not be opened.');
    }
  };

  const handleShare = async () => {
    if (!article) return;

    const shareParts = [article.headline];
    if (article.sourceUrl) {
      shareParts.push(article.sourceUrl);
    }

    try {
      await Share.share({
        message: shareParts.join('\n\n'),
      });
    } catch (error) {
      console.warn('Unable to share article', error);
    }
  };

  const handleToggleSaved = async () => {
    if (!article) return;

    const articleToSave = {
      ...article,
      cards: aiCards.length ? aiCards : article.cards,
    };

    const { error } = await toggleSave(articleToSave);
    if (error) {
      Alert.alert('Unable to save article', error.message || 'Please try again.');
    }
  };

  if (!article && isLoadingSavedArticles) {
    return (
      <Screen>
        <View style={styles.missingState}>
          <ActivityIndicator color={colors.primaryDark} />
          <Text style={styles.loadingText}>Loading article details...</Text>
        </View>
      </Screen>
    );
  }

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
          <Pressable
            style={styles.iconButton}
            onPress={() => router.replace(from === 'home' ? '/(tabs)' : `/(tabs)/${from}`)}
          >
            <Ionicons name="chevron-back" size={18} color={colors.muted} />
          </Pressable>
          <View style={styles.actionRow}>
            <Pressable
              style={styles.iconButton}
              onPress={handleOpenSource}
              accessibilityLabel="Open original article"
            >
              <Ionicons name="link-outline" size={18} color={colors.muted} />
            </Pressable>
            <Pressable
              style={styles.iconButton}
              onPress={handleToggleSaved}
              accessibilityLabel={isSaved(article.id) ? 'Remove saved article' : 'Save article'}
            >
              <Ionicons
                name={isSaved(article.id) ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={isSaved(article.id) ? colors.primaryDark : colors.muted}
              />
            </Pressable>
            <Pressable
              style={styles.iconButton}
              onPress={handleShare}
              accessibilityLabel="Share article"
            >
              <Ionicons name="share-outline" size={18} color={colors.muted} />
            </Pressable>
          </View>
        </View>

        <Text style={styles.headline} numberOfLines={2}>
          {article.headline}
        </Text>

        <View style={[styles.heroImage, { backgroundColor: article.accent }]}>
          {article.imageUrl ? (
            <Image
              source={{ uri: article.imageUrl }}
              style={styles.heroPhoto}
              resizeMode="cover"
            />
          ) : null}
        </View>

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
          onPress={() => setIsAskLaymanOpen(true)}
        >
          <Text style={styles.bottomCtaText}>Ask Layman</Text>
        </Pressable>
      </View>

      <AskLaymanSheet
        article={{ ...article, cards: aiCards.length ? aiCards : article.cards }}
        visible={isAskLaymanOpen}
        onClose={() => setIsAskLaymanOpen(false)}
      />
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
  headline: {
    color: colors.text,
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginBottom: 18,
  },
  heroImage: {
    height: 230,
    borderRadius: 28,
    marginBottom: 22,
    overflow: 'hidden',
  },
  heroPhoto: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
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
