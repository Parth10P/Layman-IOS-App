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
          <Image
            source={{ uri: article.imageUrl }}
            style={styles.thumbImage}
            resizeMode="cover"
          />
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
      <Pressable style={[styles.savePill, saved && styles.savePillActive]} onPress={onToggleSaved}>
        <Text style={[styles.savePillText, saved && styles.savePillTextActive]}>
          {saved ? 'Saved' : 'Save'}
        </Text>
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
  savePill: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 14,
    backgroundColor: colors.chip,
  },
  savePillActive: {
    backgroundColor: colors.primaryDark,
  },
  savePillText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '800',
  },
  savePillTextActive: {
    color: colors.white,
  },
});
