import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useColors, Fonts, Spacing, LightColors, DarkColors } from '@/constants/theme';
import { Player } from '@/store/mockData';
import Svg, { Path } from 'react-native-svg';

import { useThemeStore } from '@/store/useThemeStore';

interface PlayerRowItemProps {
  player: Player;
  isStarred?: boolean;
  isUserTurn?: boolean;
  showStar?: boolean;
  showDraft?: boolean;
  showRosterIndex?: boolean;
  rosterIndex?: number;
  showRank?: boolean;
  onToggleStar?: () => void;
  onDraft?: () => void;
}

export default function PlayerRowItem({
  player,
  isStarred = false,
  isUserTurn = false,
  showStar = false,
  showDraft = false,
  showRosterIndex = false,
  rosterIndex,
  showRank = false,
  onToggleStar,
  onDraft,
}: PlayerRowItemProps) {
  const Colors = useColors();
  const isDark = useThemeStore((state) => state.theme) === 'dark';
  const activeStyles = isDark ? darkStyles : lightStyles;

  return (
    <View style={[
      activeStyles.rankingsRowItem,
      { borderLeftColor: Colors.positions[player.position as keyof typeof Colors.positions] || Colors.chromeSilver }
    ]}>
      {showRosterIndex && rosterIndex !== undefined && (
        <View style={activeStyles.rosterCardIndex}>
          <Text style={activeStyles.rosterCardIndexText}>{rosterIndex}</Text>
        </View>
      )}
      {showRank && (
        <Text style={activeStyles.rankingsRowRank}>{player.rank}</Text>
      )}
      <View style={[
        activeStyles.posBadge,
        {
          backgroundColor: Colors.positions[player.position as keyof typeof Colors.positions] || Colors.chromeSilver,
          borderColor: Colors.positions[player.position as keyof typeof Colors.positions] || Colors.chromeSilver
        }
      ]}>
        <Text style={activeStyles.posBadgeText}>
          {player.position === 'DST' ? player.position : player.posRank}
        </Text>
      </View>
      <View style={activeStyles.rankingsRowInfo}>
        <Text style={activeStyles.rankingsRowName} numberOfLines={1}>{player.name}</Text>
        <Text style={activeStyles.rankingsRowMeta}>{player.team} · Bye {player.bye}</Text>
      </View>
      {showStar && onToggleStar && (
        <Pressable style={activeStyles.starBtnSmall} onPress={onToggleStar}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill={isStarred ? Colors.hofYellow : "none"}>
            <Path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2L9.19 8.62L2 9.24L7.46 13.97L5.82 21L12 17.27Z" stroke={isStarred ? Colors.hofYellow : Colors.chromeSilver} strokeWidth={2} />
          </Svg>
        </Pressable>
      )}
      {showDraft && onDraft && (
        <Pressable 
          style={[activeStyles.draftBtnSmall, !isUserTurn && activeStyles.draftBtnDisabled]} 
          disabled={!isUserTurn}
          onPress={onDraft}
        >
          <Text style={[activeStyles.draftBtnTextSmall, !isUserTurn && activeStyles.draftBtnTextDisabled]}>Draft</Text>
        </Pressable>
      )}
    </View>
  );
}

function createStyles(Colors: typeof LightColors) {
  return StyleSheet.create({
    rankingsRowItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.primaryAccent,
      borderColor: Colors.chromeSilver,
      borderWidth: 1,
      borderLeftWidth: 4,
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: Spacing.two,
      gap: 8,
      height: 52,
    },
    rankingsRowRank: {
      fontFamily: Fonts.stats,
      fontSize: 12,
      color: Colors.secondaryAccent,
      width: 22,
      textAlign: 'center',
      fontWeight: 'bold',
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
    rankingsRowInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    rankingsRowName: {
      fontFamily: Fonts.body,
      fontSize: 13,
      fontWeight: 'bold',
      color: Colors.obsidianBlack,
    },
    rankingsRowMeta: {
      fontFamily: Fonts.body,
      fontSize: 10,
      color: Colors.secondaryAccent,
    },
    starBtnSmall: {
      width: 28,
      height: 28,
      justifyContent: 'center',
      alignItems: 'center',
    },
    draftBtnSmall: {
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
    draftBtnTextSmall: {
      fontFamily: Fonts.headings,
      fontSize: 11,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
    },
    draftBtnTextDisabled: {
      color: Colors.secondaryAccent,
    },
    rosterCardIndex: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: Colors.obsidianBlack,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors.chromeSilver,
    },
    rosterCardIndexText: {
      fontFamily: Fonts.stats,
      fontSize: 10,
      color: '#94a3b8',
      fontWeight: 'bold',
    },
  });
}

const lightStyles = createStyles(LightColors);
const darkStyles = createStyles(DarkColors as any);
