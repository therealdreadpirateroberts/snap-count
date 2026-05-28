import React, { useMemo, useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Animated, Platform, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useColors, Fonts, Spacing } from '@/constants/theme';

interface DraftPositionSelectorProps {
  leagueSize: number;
  userPosition: number;
  onSelectLeagueSize: (size: number) => void;
  onSelectUserPosition: (pos: number) => void;
  hidePosition?: boolean;
  hideLeagueSize?: boolean;
}

export default function DraftPositionSelector({
  leagueSize,
  userPosition,
  onSelectLeagueSize,
  onSelectUserPosition,
  hidePosition = false,
  hideLeagueSize = false,
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
    if (containerWidth > 0 && userPosition && !hidePosition) {
      const cellWidth = 46;
      const gap = 10;
      const paddingHorizontal = 8;
      const targetOffset = (userPosition - 1) * (cellWidth + gap) + paddingHorizontal - containerWidth / 2 + cellWidth / 2;
      
      const timer = setTimeout(() => {
        wheelScrollRef.current?.scrollTo({ x: Math.max(0, targetOffset), animated: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [userPosition, containerWidth, hidePosition]);

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
      {!hidePosition && (
        <>
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
            <View 
              style={activeStyles.rightFadeAffordance} 
              pointerEvents="none"
            >
              <Svg width="100%" height="100%">
                <Defs>
                  <LinearGradient id="rightFade" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor={Colors.primaryAccent} stopOpacity="0" />
                    <Stop offset="1" stopColor={Colors.primaryAccent} stopOpacity="1" />
                  </LinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#rightFade)" />
              </Svg>
            </View>
          </View>
        </>
      )}

      {/* LEAGUE SIZE CAPSULE SELECTOR */}
      {!hideLeagueSize && (
        <>
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
        </>
      )}
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
      color: Colors.obsidianBlack,
      fontWeight: 'bold',
      letterSpacing: 1.5,
      marginTop: 0,
      marginBottom: Spacing.one,
    },
    wheelHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 0,
    },
    wheelContainer: {
      paddingVertical: Spacing.two,
    },
    wheelScroll: {
      paddingHorizontal: Spacing.two,
      gap: 10,
    },
    wheelCell: {
      width: 46,
      height: 46,
      borderRadius: 23,
      borderWidth: 1.5,
      borderColor: Colors.midGray,
      backgroundColor: '#FFFFFF',
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
      color: Colors.obsidianBlack,
    },
    wheelCellTextActive: {
      color: Colors.obsidianBlack,
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
      backgroundColor: '#FFFFFF',
      borderColor: Colors.midGray,
      borderWidth: 1.5,
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
      color: Colors.obsidianBlack,
      fontWeight: 'bold',
    },
    capsuleTextActive: {
      color: Colors.obsidianBlack,
    },
    rightFadeAffordance: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      width: 32,
      zIndex: 10,
    },
  });
};

const lightStyles = createStyles(require('@/constants/theme').LightColors);
const darkStyles = createStyles(require('@/constants/theme').DarkColors);
