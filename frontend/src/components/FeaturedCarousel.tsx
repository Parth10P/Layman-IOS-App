import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
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
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : null}
          <View style={styles.shade} />
          <View style={styles.content}>
            <Text style={styles.headline}>
              {item.headline}
            </Text>
          </View>
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
    height: 260,
    borderRadius: 28,
    marginRight: 16,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  shade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    padding: 22,
    paddingBottom: 24,
  },
  kicker: {
    color: '#FFF4EB',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  headline: {
    color: '#FFFDFC',
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: -0.7,
  },
  summary: {
    color: '#FFF5EE',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
    maxWidth: '88%',
  },
});
