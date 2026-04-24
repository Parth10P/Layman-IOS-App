import { useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../theme';

const KNOB_SIZE = 52;
const TRACK_PADDING = 6;

export function WelcomeHero({ onStart }: { onStart: () => void }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const dragStart = useRef(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  const maxDrag = Math.max(trackWidth - KNOB_SIZE - TRACK_PADDING * 2, 0);

  const finishSwipe = () => {
    if (isCompleting) return;
    setIsCompleting(true);
    Animated.timing(translateX, {
      toValue: maxDrag,
      duration: 140,
      useNativeDriver: true,
    }).start(() => {
      onStart();
      translateX.setValue(0);
      setIsCompleting(false);
    });
  };

  const resetSwipe = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 6,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isCompleting,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        !isCompleting && Math.abs(gestureState.dx) > 4,
      onPanResponderGrant: () => {
        dragStart.current = maxDrag > 0 ? ((translateX as unknown) as { __getValue?: () => number }).__getValue?.() ?? 0 : 0;
      },
      onPanResponderMove: (_, gestureState) => {
        if (isCompleting) return;
        const nextValue = Math.max(0, Math.min(maxDrag, dragStart.current + gestureState.dx));
        translateX.setValue(nextValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        const movedFarEnough = gestureState.dx > maxDrag * 0.55;
        const releasedNearEnd = dragStart.current + gestureState.dx > maxDrag * 0.72;
        if (movedFarEnough || releasedNearEnd) {
          finishSwipe();
          return;
        }
        resetSwipe();
      },
      onPanResponderTerminate: resetSwipe,
    }),
  ).current;

  const handleTrackLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={styles.screenRoot}>
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <View style={styles.topWordmarkRow}>
        <Text style={styles.wordmark}>Layman</Text>
        <View style={styles.wordmarkLine} />
      </View>

      <View style={styles.heroCopyWrap}>
        <Text style={styles.heroText}>
          Business,{'\n'}
          tech & startups
        </Text>
        <Text style={styles.heroAccent}>made simple</Text>
      </View>

      <View style={styles.footerArea}>
        <View style={styles.swipeTrack} onLayout={handleTrackLayout}>
          <Pressable style={styles.tapTarget} onPress={finishSwipe}>
            <Text style={styles.swipeLabel}>Swipe to get started</Text>
          </Pressable>
          <Animated.View
            style={[styles.swipeKnob, { transform: [{ translateX }] }]}
            {...panResponder.panHandlers}
          >
            <Text style={styles.swipeArrow}>{'>>'}</Text>
          </Animated.View>
        </View>
        <Text style={styles.helperText}>Slide right to continue into the app</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: '#FBF5EF',
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 42,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  glowOne: {
    position: 'absolute',
    top: 92,
    left: -10,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#F6D8BF',
    opacity: 0.8,
  },
  glowTwo: {
    position: 'absolute',
    bottom: 150,
    right: -22,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#F7E4C9',
    opacity: 0.88,
  },
  topWordmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  wordmark: {
    color: '#2A241F',
    fontSize: 31,
    fontWeight: '700',
    letterSpacing: -1.2,
  },
  wordmarkLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D9C2B4',
    marginLeft: 14,
    marginTop: 4,
  },
  heroCopyWrap: {
    alignItems: 'center',
    marginTop: -22,
  },
  heroText: {
    textAlign: 'center',
    color: '#201A16',
    fontSize: 47,
    lineHeight: 50,
    fontWeight: '800',
    letterSpacing: -1.6,
  },
  heroAccent: {
    color: colors.primary,
    fontSize: 45,
    lineHeight: 48,
    fontWeight: '800',
    letterSpacing: -1.6,
  },
  footerArea: {
    gap: 14,
  },
  swipeTrack: {
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    padding: TRACK_PADDING,
  },
  tapTarget: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: KNOB_SIZE + 8,
    paddingRight: 28,
  },
  swipeKnob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: '#FFF4EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeArrow: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 2,
  },
  swipeLabel: {
    color: '#FFF7F0',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  helperText: {
    color: colors.muted,
    fontSize: 14,
    textAlign: 'center',
  },
});
