import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StatusBar, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const HORIZONTAL_PADDING = 28;
const TRACK_HEIGHT = 68;
const THUMB_SIZE = 56;
const TRACK_INSET = 6;

interface WelcomeHeroProps {
  onStart: () => void;
}

export function WelcomeHero({ onStart }: WelcomeHeroProps) {
  const { width, height } = useWindowDimensions();
  const trackWidth = Math.min(width - HORIZONTAL_PADDING * 2, 420);
  const maxDrag = trackWidth - THUMB_SIZE - TRACK_INSET * 2;

  const dragX = useSharedValue(0);
  const isCompleting = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .activeOffsetX([8, 999])
    .failOffsetY([-18, 18])
    .maxPointers(1)
    .onUpdate((event) => {
      if (isCompleting.value) {
        return;
      }

      const nextX = Math.max(0, Math.min(maxDrag, event.translationX));
      dragX.value = nextX;
    })
    .onEnd((event) => {
      if (isCompleting.value) {
        return;
      }

      const shouldComplete =
        event.translationX >= maxDrag * 0.8 ||
        (event.translationX >= maxDrag * 0.58 && event.velocityX > 900);

      if (shouldComplete) {
        isCompleting.value = true;
        dragX.value = withSpring(
          maxDrag,
          {
            damping: 20,
            stiffness: 220,
            mass: 0.9,
            overshootClamping: true,
          },
          (finished) => {
            if (finished) {
              runOnJS(onStart)();
            }
          }
        );
        return;
      }

      dragX.value = withSpring(0, {
        damping: 18,
        stiffness: 240,
        mass: 0.85,
      });
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: dragX.value }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: THUMB_SIZE + TRACK_INSET + dragX.value,
    opacity: interpolate(dragX.value, [0, maxDrag], [0.3, 0.5]),
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(dragX.value, [0, maxDrag * 0.7, maxDrag], [1, 0.92, 0.25]),
    transform: [
      {
        translateX: interpolate(dragX.value, [0, maxDrag], [0, -8], Extrapolation.CLAMP),
      },
    ],
  }));

  const headingTopSpacer = Math.max(44, height * 0.1);

  return (
    <LinearGradient
      colors={['#FFE8D0', '#FFBF86', '#FF6B35']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.root}
    >
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

          <View style={styles.canvas}>
            <View style={styles.headerRow}>
              <Text style={styles.brand}>Layman</Text>
            </View>

            <View style={[styles.heroBlock, { paddingTop: headingTopSpacer }]}>
              <Text style={styles.heroText}>Business,{"\n"}tech & startups</Text>
              <Text style={styles.heroAccent}>made simple</Text>
            </View>

            <View style={styles.footer}>
              <GestureDetector gesture={panGesture}>
                <View style={[styles.ctaTrack, { width: trackWidth }]}>
                  <Animated.View style={[styles.ctaFill, fillStyle]} />
                  <Animated.View style={[styles.ctaLabelWrap, labelStyle]}>
                    <Text style={styles.ctaLabel}>Swipe to get started</Text>
                  </Animated.View>
                  <Animated.View style={[styles.thumb, thumbStyle]}>
                    <View style={styles.thumbIconRow}>
                      <Ionicons name="chevron-forward" size={16} color="#FF6B35" />
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color="#FF6B35"
                        style={styles.thumbSecondIcon}
                      />
                    </View>
                  </Animated.View>
                </View>
              </GestureDetector>
            </View>
          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  canvas: {
    flex: 1,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 18,
    paddingBottom: 32,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brand: {
    color: '#FFFFFF',
    fontSize: 50,
    lineHeight: 60,
    fontWeight: '800',
    letterSpacing: -1.5,
    textAlign: 'center',
    width: '100%',
    marginLeft: 0,
  },
  heroBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 78,
  },
  heroText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 42,
    lineHeight: 44,
    fontWeight: '700',
    letterSpacing: -1.5,
  },
  heroAccent: {
    color: '#FFF0CC',
    textAlign: 'center',
    fontSize: 42,
    lineHeight: 44,
    fontWeight: '800',
    letterSpacing: -1.5,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 6,
  },
  ctaTrack: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: 'rgba(133, 78, 37, 0.14)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 6,
  },
  ctaFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  ctaLabelWrap: {
    position: 'absolute',
    left: THUMB_SIZE + 18,
    right: 28,
    justifyContent: 'center',
    height: '100%',
  },
  ctaLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  thumb: {
    position: 'absolute',
    left: TRACK_INSET,
    top: TRACK_INSET,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(170, 100, 42, 0.12)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  thumbIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  thumbSecondIcon: {
    marginLeft: -7,
  },
});
