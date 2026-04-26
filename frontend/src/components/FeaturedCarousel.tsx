import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewToken,
} from 'react-native';
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
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<Article> | null>(null);
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken<Article>[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <View>
      <FlatList
        ref={flatListRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={articles}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        pagingEnabled={false}
        snapToInterval={width - 72}
        snapToAlignment="start"
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
              <Text style={styles.headline}>{item.headline}</Text>
            </View>
          </Pressable>
        )}
      />

      <View style={styles.dotsRow}>
        {articles.map((_, index) => (
          <View key={index} style={[styles.dot, index === activeIndex && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 8,
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
  headline: {
    color: '#FFFDFC',
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: -0.7,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    marginBottom: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
});
