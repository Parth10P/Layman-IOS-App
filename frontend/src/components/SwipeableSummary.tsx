import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { colors } from '../theme';

const { width } = Dimensions.get('window');

interface SwipeableSummaryProps {
  cards: string[];
}

export const SwipeableSummary: React.FC<SwipeableSummaryProps> = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setCurrentIndex(Math.round(index));
  };

  if (!cards || cards.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Simplifying article...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {cards.map((card, index) => (
          <View key={index} style={styles.cardContainer}>
            <View style={styles.card}>
              <Text style={styles.cardText}>{card}</Text>
            </View>
          </View>
        ))}
      </Animated.ScrollView>
      
      <View style={styles.pagination}>
        {cards.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.dot, 
              currentIndex === index ? styles.activeDot : null
            ]} 
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
  },
  cardContainer: {
    width: width,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FDFBF7', // Cream color from mockup
    borderRadius: 16,
    padding: 24,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  cardText: {
    fontSize: 18,
    lineHeight: 28,
    color: colors.darkText,
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    color: colors.mutedText,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
