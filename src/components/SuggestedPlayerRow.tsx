import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useColors, Fonts, Spacing, LightColors, DarkColors } from '@/constants/theme';
import { Player } from '@/store/mockData';
import Svg, { Path } from 'react-native-svg';

import { useThemeStore } from '@/store/useThemeStore';

interface SuggestedPlayerRowProps {
  player: Player;
  isStarred: boolean;
  isUserTurn: boolean;
  expertPercent: string;
  onToggleStar: () => void;
  onDraft: () => void;
}

export default function SuggestedPlayerRow({
  player,
  isStarred,
  isUserTurn,
  expertPercent,
  onToggleStar,
  onDraft,
}: SuggestedPlayerRowProps) {
  const Colors = useColors();
  const isDark = useThemeStore((state) => state.theme) === 'dark';
  const activeStyles = isDark ? darkStyles : lightStyles;

  return (
    <View style={[
      activeStyles.suggestedItem,
      { borderLeftColor: Colors.positions[player.position as keyof typeof Colors.positions] || Colors.chromeSilver }
    ]}>
      <Text style={activeStyles.suggestedRank}>{player.rank}</Text>
      <View style={[
        activeStyles.posBadge,
        {
          backgroundColor: Colors.positions[player.position as keyof typeof Colors.positions] || Colors.chromeSilver,
          borderColor: Colors.positions[player.position as keyof typeof Colors.positions] || Colors.chromeSilver
        }
      ]}>
        <Text style={activeStyles.posBadgeText}>{player.posRank}</Text>
      </View>
      <View style={activeStyles.suggestedInfo}>
        <Text style={activeStyles.suggestedName} numberOfLines={1}>{player.name}</Text>
        <Text style={activeStyles.suggestedSub}>{player.team} · Bye {player.bye}</Text>
      </View>
      
      <View style={activeStyles.suggestedActions}>
        <View style={activeStyles.expertCol}>
          <Text style={activeStyles.expertVal}>{expertPercent}</Text>
          <Text style={activeStyles.expertLbl}>Experts</Text>
        </View>
        <Pressable style={activeStyles.starBtn} onPress={onToggleStar}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill={isStarred ? Colors.hofYellow : "none"}>
            <Path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2L9.19 8.62L2 9.24L7.46 13.97L5.82 21L12 17.27Z" stroke={isStarred ? Colors.hofYellow : Colors.chromeSilver} strokeWidth={2} />
          </Svg>
        </Pressable>
        <Pressable 
          style={[activeStyles.draftBtn, !isUserTurn && activeStyles.draftBtnDisabled]} 
          disabled={!isUserTurn}
          onPress={onDraft}
        >
          <Text style={[activeStyles.draftBtnText, !isUserTurn && activeStyles.draftBtnTextDisabled]}>Draft</Text>
        </Pressable>
      </View>
    </View>
  );
}

function createStyles(Colors: typeof LightColors) {
  return StyleSheet.create({
    suggestedItem: {
      backgroundColor: Colors.primaryAccent,
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: Spacing.two,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderWidth: 1,
      borderLeftWidth: 4,
      borderColor: Colors.chromeSilver,
      height: 52,
    },
    suggestedRank: {
      fontFamily: Fonts.stats,
      fontSize: 12,
      color: Colors.secondaryAccent,
      width: 22,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    suggestedInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    suggestedName: {
      fontFamily: Fonts.body,
      fontSize: 13,
      fontWeight: 'bold',
      color: Colors.obsidianBlack,
    },
    posBadge: {
      width: 34,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      borderWidth: 1,
    },
    posBadgeText: {
      fontFamily: Fonts.body,
      fontSize: 9,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
    },
    suggestedSub: {
      fontFamily: Fonts.body,
      fontSize: 10,
      color: Colors.secondaryAccent,
    },
    suggestedActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    expertCol: {
      alignItems: 'center',
      marginRight: 2,
    },
    expertVal: {
      fontFamily: Fonts.stats,
      fontSize: 11,
      color: Colors.obsidianBlack,
      fontWeight: 'bold',
    },
    expertLbl: {
      fontFamily: Fonts.body,
      fontSize: 8,
      color: Colors.secondaryAccent,
    },
    starBtn: {
      width: 28,
      height: 28,
      justifyContent: 'center',
      alignItems: 'center',
    },
    draftBtn: {
      backgroundColor: Colors.pylonOrange,
      borderColor: Colors.pylonOrange,
      borderWidth: 1,
      borderRadius: 6,
      paddingHorizontal: 10,
      height: 28,
      justifyContent: 'center',
      alignItems: 'center',
    },
    draftBtnDisabled: {
      backgroundColor: Colors.liftedCharcoal,
      borderColor: Colors.liftedCharcoal,
      opacity: 0.4,
    },
    draftBtnText: {
      fontFamily: Fonts.headings,
      fontSize: 11,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
    },
    draftBtnTextDisabled: {
      color: Colors.secondaryAccent,
    },
  });
}

const lightStyles = createStyles(LightColors);
const darkStyles = createStyles(DarkColors as any);
