import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import type { Article } from '../types';

export function ArticleCard({
  article,
  saved,
  onPress,
  onToggleSaved,
}: {
  article: Article;
  saved: boolean;
  onPress: () => void;
  onToggleSaved: () => void;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={[styles.thumb, { backgroundColor: article.accent }]}>
        {article.imageUrl ? (
          <Image source={{ uri: article.imageUrl }} style={styles.thumbImage} resizeMode="cover" />
        ) : (
          <Text style={styles.thumbLabel}>{article.imageLabel}</Text>
        )}
      </View>
      <View style={styles.copy}>
        <Text style={styles.category}>{article.category}</Text>
        <Text style={styles.headline} numberOfLines={2}>
          {article.displayHeadline || article.headline}
        </Text>
        <Text style={styles.meta}>{article.source}</Text>
      </View>
      <Pressable
        style={[styles.bookmarkButton, saved && styles.bookmarkButtonActive]}
        onPress={onToggleSaved}
        accessibilityLabel={saved ? 'Remove bookmark' : 'Bookmark article'}
      >
        <Ionicons
          name={saved ? 'bookmark' : 'bookmark-outline'}
          size={18}
          color={saved ? '#FFFFFF' : colors.primaryDark}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  thumb: {
    width: 76,
    height: 76,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbLabel: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  copy: {
    flex: 1,
    paddingHorizontal: 12,
  },
  category: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  headline: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '800',
  },
  meta: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 8,
  },
  bookmarkButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.chip,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  bookmarkButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
