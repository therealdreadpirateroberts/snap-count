import React from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useColors, Fonts, Spacing } from '@/constants/theme';

interface RosterConstructionPanelProps {
  currentSlots: {
    QB: number;
    RB: number;
    WR: number;
    TE: number;
    FLEX: number;
    K: number;
    DST: number;
    BENCH: number;
    IR: number;
  };
  activeRosterCount: number;
  irRosterCount: number;
  onAdjustSlot: (key: 'QB' | 'RB' | 'WR' | 'TE' | 'FLEX' | 'K' | 'DST' | 'BENCH' | 'IR', delta: number) => void;
}

export default function RosterConstructionPanel({
  currentSlots,
  activeRosterCount,
  irRosterCount,
  onAdjustSlot,
}: RosterConstructionPanelProps) {
  const Colors = useColors();

  const getPositionColor = (key: string) => {
    if (key === 'QB') return { bg: Colors.positions.QB, text: '#000000', border: Colors.positions.QB };
    if (key === 'RB') return { bg: Colors.positions.RB, text: '#000000', border: Colors.positions.RB };
    if (key === 'WR') return { bg: Colors.positions.WR, text: '#000000', border: Colors.positions.WR };
    if (key === 'TE') return { bg: Colors.positions.TE, text: '#000000', border: Colors.positions.TE };
    if (key === 'K') return { bg: Colors.positions.K, text: '#000000', border: Colors.positions.K };
    if (key === 'DST') return { bg: Colors.positions.DST, text: '#000000', border: Colors.positions.DST };
    if (key === 'FLEX') return { bg: '#4F5D75', text: '#FFFFFF', border: '#4F5D75' };
    if (key === 'BENCH') return { bg: '#2D3142', text: '#FFFFFF', border: '#2D3142' };
    if (key === 'IR') return { bg: '#1C1E26', text: '#FFFFFF', border: '#1C1E26' };
    return { bg: Colors.surfaceLifted, text: Colors.primaryAccent, border: Colors.coltsNavyLight };
  };

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
    <View style={activeStyles.rosterPanel}>
      <Text style={activeStyles.rosterPanelTitle}>ADJUST ROSTER CONFIGURATION</Text>
      
      <View style={activeStyles.rosterListContainer}>
        {[
          { key: 'QB', label: 'Quarterback', short: 'QB' },
          { key: 'RB', label: 'Running Back', short: 'RB' },
          { key: 'WR', label: 'Wide Receiver', short: 'WR' },
          { key: 'TE', label: 'Tight End', short: 'TE' },
          { key: 'FLEX', label: 'Flex (W/R/T)', short: 'FLEX' },
          { key: 'K', label: 'Kicker', short: 'K' },
          { key: 'DST', label: 'Defense (DST)', short: 'DEF' },
          { key: 'BENCH', label: 'Bench Slots', short: 'BN' },
          { key: 'IR', label: 'Injured Reserve (IR)', short: 'IR' },
        ].map((item) => {
          const posKey = item.key as 'QB' | 'RB' | 'WR' | 'TE' | 'FLEX' | 'K' | 'DST' | 'BENCH' | 'IR';
          const count = currentSlots[posKey];
          
          const minLimits: Record<string, number> = { QB: 1, RB: 1, WR: 1, TE: 1, FLEX: 0, K: 0, DST: 0, BENCH: 1, IR: 0 };
          const maxLimits: Record<string, number> = { QB: 3, RB: 5, WR: 5, TE: 3, FLEX: 3, K: 2, DST: 2, BENCH: 12, IR: 4 };
          
          const isMin = count <= minLimits[item.key];
          const isMax = count >= maxLimits[item.key];
          
          const posColor = getPositionColor(item.key);

          return (
            <View key={item.key} style={activeStyles.rosterRow}>
              <View style={activeStyles.rosterRowLeft}>
                <View style={[activeStyles.rosterRowBadge, { backgroundColor: posColor.bg, borderColor: posColor.border }]}>
                  <Text style={[activeStyles.rosterRowBadgeText, { color: posColor.text }]}>{item.short}</Text>
                </View>
                <View style={activeStyles.rosterRowLabels}>
                  <Text style={activeStyles.rosterRowLabelMain}>{item.label}</Text>
                </View>
              </View>
              
              <View style={activeStyles.rosterRowRight}>
                <Pressable
                  style={({ pressed }) => [
                    activeStyles.rosterAdjustBtn,
                    isMin && activeStyles.rosterAdjustBtnDisabled,
                    pressed && !isMin && activeStyles.btnPressed
                  ]}
                  onPress={() => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                    onAdjustSlot(posKey, -1);
                  }}
                  disabled={isMin}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                    <Path d="M5 12H19" stroke={isMin ? 'rgba(255,255,255,0.2)' : '#ffffff'} strokeWidth={2.5} strokeLinecap="round" />
                  </Svg>
                </Pressable>
                
                <View style={activeStyles.rosterValueContainer}>
                  <Text style={activeStyles.rosterValueText}>{count}</Text>
                </View>
                
                <Pressable
                  style={({ pressed }) => [
                    activeStyles.rosterAdjustBtn,
                    isMax && activeStyles.rosterAdjustBtnDisabled,
                    pressed && !isMax && activeStyles.btnPressed
                  ]}
                  onPress={() => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                    onAdjustSlot(posKey, 1);
                  }}
                  disabled={isMax}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                    <Path d="M12 5V19M5 12H19" stroke={isMax ? 'rgba(255,255,255,0.2)' : '#ffffff'} strokeWidth={2.5} strokeLinecap="round" />
                  </Svg>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>
      
      <Text style={activeStyles.rosterPanelFooter}>
        * Dynamically updates draft length. Currently: {activeRosterCount} draft rounds ({activeRosterCount} rounds active, {irRosterCount} IR slot{irRosterCount !== 1 ? 's' : ''} inactive).
      </Text>
    </View>
  );
}

const createStyles = (Colors: typeof import('@/constants/theme').LightColors) => {
  return StyleSheet.create({
    rosterPanel: {
      backgroundColor: Colors.surfaceLifted,
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.three,
      gap: 10,
      borderRadius: 12,
    },
    rosterPanelTitle: {
      fontFamily: Fonts.stats,
      fontSize: 9,
      color: Colors.secondaryAccent,
      fontWeight: '800',
      letterSpacing: 1,
      marginBottom: 4,
    },
    rosterListContainer: {
      gap: 8,
      marginVertical: 4,
    },
    rosterRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 4,
      paddingHorizontal: 12,
      backgroundColor: Colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors.coltsNavyLight,
      minHeight: 44,
    },
    rosterRowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    rosterRowBadge: {
      width: 48,
      height: 30,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
    },
    rosterRowBadgeText: {
      fontFamily: Fonts.headings,
      fontSize: 10.5,
      fontWeight: 'bold',
    },
    rosterRowLabels: {
      gap: 2,
      flex: 1,
    },
    rosterRowLabelMain: {
      fontFamily: Fonts.headings,
      fontSize: 13.5,
      fontWeight: '700',
      color: Colors.primaryAccent,
    },
    rosterRowRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    rosterAdjustBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: Colors.coltsNavy,
      borderWidth: 1,
      borderColor: Colors.coltsNavy,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rosterAdjustBtnDisabled: {
      opacity: 0.25,
    },
    rosterValueContainer: {
      width: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rosterValueText: {
      fontFamily: Fonts.headings,
      fontSize: 16,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
    },
    rosterPanelFooter: {
      fontFamily: Fonts.body,
      fontSize: 10.5,
      color: Colors.secondaryAccent,
      fontStyle: 'italic',
      marginTop: 4,
    },
    btnPressed: {
      opacity: 0.6,
    },
  });
};

const lightStyles = createStyles(require('@/constants/theme').LightColors);
const darkStyles = createStyles(require('@/constants/theme').DarkColors);
