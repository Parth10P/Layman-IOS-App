import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

const { width } = Dimensions.get('window');

export function SwipeableSummary({ cards }: { cards: string[] }) {
  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
      >
        {cards.map((card, index) => (
          <View key={`${index}-${card.slice(0, 12)}`} style={styles.cardWrap}>
            <View style={styles.card}>
              <Text style={styles.count}>
                {index + 1} / {cards.length}
              </Text>
              <Text style={styles.text} numberOfLines={6}>
                {card}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {cards.map((_, index) => (
          <View key={index} style={[styles.dot, index === 0 && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrap: {
    width: width - 48,
    paddingRight: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    minHeight: 172,
  },
  count: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
  },
  text: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 26,
    fontWeight: '600',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
});
