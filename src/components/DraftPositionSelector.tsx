import React, { useMemo, useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Animated, Platform, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useColors, Fonts, Spacing } from '@/constants/theme';

interface DraftPositionSelectorProps {
  leagueSize: number;
  userPosition: number;
  onSelectLeagueSize: (size: number) => void;
  onSelectUserPosition: (pos: number) => void;
}

export default function DraftPositionSelector({
  leagueSize,
  userPosition,
  onSelectLeagueSize,
  onSelectUserPosition,
}: DraftPositionSelectorProps) {
  const Colors = useColors();
  
  // Wheel Scroll ref and horizontal width
  const wheelScrollRef = useRef<ScrollView>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Breathing animation for the active cell
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  // Generate numbers 1 to leagueSize for the visual pick wheel
  const pickWheelOptions = useMemo(() => {
    const options = [];
    for (let i = 1; i <= leagueSize; i++) {
      options.push(i);
    }
    return options;
  }, [leagueSize]);

  // Auto-scroll to center active cell
  useEffect(() => {
    if (containerWidth > 0 && userPosition) {
      const cellWidth = 46;
      const gap = 10;
      const paddingHorizontal = 8;
      const targetOffset = (userPosition - 1) * (cellWidth + gap) + paddingHorizontal - containerWidth / 2 + cellWidth / 2;
      
      const timer = setTimeout(() => {
        wheelScrollRef.current?.scrollTo({ x: Math.max(0, targetOffset), animated: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [userPosition, containerWidth]);

  const triggerHaptic = async (style = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(style);
      } catch (err) {}
    }
  };

  const isDark = (Colors.primaryAccent as string) === '#FFFFFF';
  const activeStyles = isDark ? darkStyles : lightStyles;

  return (
    <View style={activeStyles.container}>
      {/* DRAFT POSITION SCROLL WHEEL */}
      <View style={activeStyles.wheelHeaderRow}>
        <Text style={activeStyles.sectionHeader}>YOUR DRAFT POSITION</Text>
      </View>

      <View style={activeStyles.wheelContainer}>
        <ScrollView
          ref={wheelScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={activeStyles.wheelScroll}
          keyboardShouldPersistTaps="always"
          onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        >
          {pickWheelOptions.map((num) => {
            const active = userPosition === num;
            return (
              <TouchableOpacity
                key={num}
                style={[activeStyles.wheelCell, active && activeStyles.wheelCellActive]}
                onPress={() => {
                  triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                  onSelectUserPosition(num);
                }}
                activeOpacity={0.7}
              >
                {active && (
                  <Animated.View 
                    style={[
                      activeStyles.activeCellPulseBorder, 
                      { opacity: pulseAnim }
                    ]} 
                    pointerEvents="none"
                  />
                )}
                <Text 
                  style={[activeStyles.wheelCellText, active && activeStyles.wheelCellTextActive]}
                  pointerEvents="none"
                >
                  {num}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* LEAGUE SIZE CAPSULE SELECTOR */}
      <Text style={activeStyles.sectionHeader}>LEAGUE SIZE (TEAMS)</Text>
      <View style={activeStyles.capsuleRow}>
        {([8, 10, 12, 14, 16] as const).map((size) => {
          const active = leagueSize === size;
          return (
            <Pressable
              key={size}
              style={[activeStyles.capsuleChip, active && activeStyles.capsuleChipActive]}
              onPress={() => {
                triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                onSelectLeagueSize(size);
              }}
            >
              <Text style={[activeStyles.capsuleText, active && activeStyles.capsuleTextActive]}>
                {size}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const createStyles = (Colors: typeof import('@/constants/theme').LightColors) => {
  return StyleSheet.create({
    container: {
      gap: Spacing.two,
    },
    sectionHeader: {
      fontFamily: Fonts.stats,
      fontSize: 9.5,
      color: Colors.secondaryAccent,
      fontWeight: 'bold',
      letterSpacing: 1.5,
      marginTop: Spacing.two,
      marginBottom: Spacing.one,
    },
    wheelHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: Spacing.two,
    },
    wheelContainer: {
      backgroundColor: Colors.surfaceLifted,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 16,
      paddingVertical: Spacing.two,
      ...Colors.shadows,
    },
    wheelScroll: {
      paddingHorizontal: Spacing.two,
      gap: 10,
    },
    wheelCell: {
      width: 46,
      height: 46,
      borderRadius: 23,
      borderWidth: 1,
      borderColor: Colors.coltsNavyLight,
      backgroundColor: Colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    wheelCellActive: {
      backgroundColor: Colors.hofYellow,
      borderColor: Colors.hofYellow,
      borderWidth: 1.5,
    },
    wheelCellText: {
      fontFamily: Fonts.headings,
      fontSize: 14,
      fontWeight: 'bold',
      color: Colors.secondaryAccent,
    },
    wheelCellTextActive: {
      color: '#000000',
    },
    activeCellPulseBorder: {
      ...StyleSheet.absoluteFillObject,
      borderColor: Colors.hofYellow,
      borderWidth: 2,
      borderRadius: 23,
    },
    capsuleRow: {
      flexDirection: 'row',
      gap: 6,
    },
    capsuleChip: {
      flex: 1,
      backgroundColor: Colors.surface,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 22,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      ...Colors.shadows,
    },
    capsuleChipActive: {
      backgroundColor: Colors.hofYellow,
      borderColor: Colors.hofYellow,
      borderWidth: 1.5,
    },
    capsuleText: {
      fontFamily: Fonts.headings,
      fontSize: 12,
      color: Colors.secondaryAccent,
      fontWeight: 'bold',
    },
    capsuleTextActive: {
      color: '#000000',
    },
  });
};

const lightStyles = createStyles(require('@/constants/theme').LightColors);
const darkStyles = createStyles(require('@/constants/theme').DarkColors);
