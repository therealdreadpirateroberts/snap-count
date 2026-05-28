import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, PanResponder, Animated, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Fonts, useColors, LightColors, DarkColors } from '@/constants/theme';
import { useThemeStore } from '@/store/useThemeStore';

// Mock Spacing constants for safety if theme.ts doesn't export them
const Spacing = {
  one: 4,
};

interface InteractiveSliderProps {
  value: number; // 10 to 120
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}

export default function InteractiveSlider({
  value,
  onChange,
  min = 10,
  max = 120,
}: InteractiveSliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Spring/Animated variables for Apple HIG fluid animations
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Track ref to trigger light haptics on value step changes
  const prevValueRef = useRef(value);

  const calculateValue = (locationX: number) => {
    if (trackWidth <= 0) return value;
    // Keep within bounds of track padding (handle is 22px wide, so offset margin is 11px)
    const percentage = Math.max(0, Math.min(1, locationX / trackWidth));
    const rawVal = min + percentage * (max - min);
    // Round to nearest 5s for professional gridiron select ticks
    const stepVal = Math.round(rawVal / 5) * 5;
    return Math.max(min, Math.min(max, stepVal));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        setIsDragging(true);
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1.15,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();

        const newVal = calculateValue(evt.nativeEvent.locationX);
        onChange(newVal);
        if (newVal !== prevValueRef.current) {
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          }
          prevValueRef.current = newVal;
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        const newVal = calculateValue(evt.nativeEvent.locationX);
        onChange(newVal);
        if (newVal !== prevValueRef.current) {
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          }
          prevValueRef.current = newVal;
        }
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
      },
    })
  ).current;

  // Percentage for filled track and handle position
  const percentage = (value - min) / (max - min);
  const fillWidth = `${percentage * 100}%`;
  
  // Calculate cross-platform absolute layout offsets instead of css calc()
  const handleLeft = trackWidth > 0 ? percentage * (trackWidth - 22) : 0;
  const labelLeft = trackWidth > 0 ? percentage * (trackWidth - 44) : 0;

  return (
    <View style={styles.container}>
      <View 
        style={styles.sliderHarness}
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
        {...panResponder.panHandlers}
      >
        {/* Inactive Track */}
        <View style={styles.inactiveTrack} />

        {/* Filled Track (Penalty Yellow) */}
        <View style={[styles.filledTrack, { width: fillWidth as any }]} />

        {/* Handle Container */}
        <Animated.View
          style={[
            styles.handle,
            {
              left: handleLeft,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Subtle center indicator inside handle */}
          <View style={styles.handleCore} />
          
          {/* Soft yellow glow animated overlay */}
          <Animated.View style={[styles.glowOverlay, { opacity: glowAnim }]} />
        </Animated.View>

        {/* Dynamic value label floating pill on drag */}
        {isDragging && trackWidth > 0 && (
          <View
            style={[
              styles.floatingLabel,
              {
                left: labelLeft,
              },
            ]}
          >
            <Text style={styles.floatingLabelText}>{value}s</Text>
          </View>
        )}
      </View>
      
      {/* Current selection summary label */}
      <View style={styles.labelRow}>
        <Text style={styles.minMaxText}>{min}s</Text>
        <Text style={styles.currentValueText}>Active pick clock: {value} seconds</Text>
        <Text style={styles.minMaxText}>{max}s</Text>
      </View>
    </View>
  );
}

function createStyles(Colors: typeof LightColors) {
  return StyleSheet.create({
    container: {
      width: '100%',
      paddingVertical: Spacing.one,
    },
    sliderHarness: {
      height: 36,
      width: '100%',
      justifyContent: 'center',
      position: 'relative',
      ...Platform.select({
        web: { cursor: 'pointer' },
        default: {},
      }),
    },
    inactiveTrack: {
      height: 6,
      borderRadius: 3,
      backgroundColor: Colors.midGray,
      opacity: 0.3,
      width: '100%',
      position: 'absolute',
    },
    filledTrack: {
      height: 6,
      borderRadius: 3,
      backgroundColor: Colors.hofYellow,
      position: 'absolute',
    },
    handle: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: Colors.primaryAccent,
      borderWidth: 1.5,
      borderColor: Colors.midGray,
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.5,
      elevation: 3,
    },
    handleCore: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: Colors.midGray,
    },
    glowOverlay: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 11,
      borderWidth: 3,
      borderColor: 'rgba(255, 205, 0, 0.4)', // soft yellow glow on drag
      backgroundColor: 'transparent',
    },
    floatingLabel: {
      position: 'absolute',
      top: -26,
      backgroundColor: Colors.primaryAccent,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: Colors.midGray,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 2,
      elevation: 2,
      minWidth: 44,
    },
    floatingLabelText: {
      fontFamily: Fonts.stats,
      fontSize: 10,
      fontWeight: 'bold',
      color: Colors.obsidianBlack,
    },
    labelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
      paddingHorizontal: 4,
    },
    minMaxText: {
      fontFamily: Fonts.stats,
      fontSize: 10,
      color: Colors.slate,
      fontWeight: '600',
    },
    currentValueText: {
      fontFamily: Fonts.body,
      fontSize: 11,
      color: Colors.obsidianBlack,
      fontWeight: 'bold',
    },
  });
}

const lightStyles = createStyles(LightColors);
const darkStyles = createStyles(DarkColors as any);
const styles = new Proxy({}, {
  get(target, prop) {
    const theme = useThemeStore.getState().theme;
    return theme === 'dark' ? darkStyles[prop as keyof typeof darkStyles] : lightStyles[prop as keyof typeof lightStyles];
  }
}) as ReturnType<typeof createStyles>;
