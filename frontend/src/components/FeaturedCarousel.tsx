import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import type { Article } from '../types';

const { width } = Dimensions.get('window');

export function FeaturedCarousel({
  articles,
  onPressArticle,
}: {
  articles: Article[];
  onPressArticle: (articleId: string) => void;
}) {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={articles}
      keyExtractor={(item) => item.id}
      snapToInterval={width - 72}
      decelerationRate="fast"
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Pressable style={[styles.card, { backgroundColor: item.accent }]} onPress={() => onPressArticle(item.id)}>
          <View style={styles.shade} />
          <Text style={styles.kicker}>{item.subtitle}</Text>
          <Text style={styles.headline} numberOfLines={2}>
            {item.headline}
          </Text>
          <Text style={styles.summary} numberOfLines={3}>
            {item.summary}
          </Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 26,
  },
  card: {
    width: width - 72,
    height: 220,
    borderRadius: 28,
    marginRight: 16,
    padding: 22,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  shade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(35, 19, 8, 0.18)',
  },
  kicker: {
    color: '#FFF4EB',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  headline: {
    color: '#FFFDFC',
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  summary: {
    color: '#FFF5EE',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
    maxWidth: '88%',
  },
});
