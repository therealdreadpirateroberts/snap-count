import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useColors, Fonts, Spacing, LightColors, DarkColors } from '@/constants/theme';
import { Player } from '@/store/mockData';
import { PlayerHeadshot } from '@/components/PlayerHeadshot';
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
    <View style={activeStyles.suggestedItem}>
      <PlayerHeadshot name={player.name} position={player.position} team={player.team} style={activeStyles.suggestedHeadshot} />
      <View style={activeStyles.suggestedInfo}>
        <View style={activeStyles.suggestedHeaderRow}>
          <Text style={activeStyles.suggestedName} numberOfLines={1}>{player.name}</Text>
          <View style={[activeStyles.posBadge, { borderColor: Colors.positions[player.position as keyof typeof Colors.positions] || Colors.coltsNavyLight }]}>
            <Text style={[activeStyles.posBadgeText, { color: Colors.positions[player.position as keyof typeof Colors.positions] || Colors.primaryAccent }]}>{player.posRank}</Text>
          </View>
        </View>
        <Text style={activeStyles.suggestedSub}>{player.team} · Bye {player.bye} · ECR {player.rank}</Text>
      </View>
      
      <View style={activeStyles.suggestedActions}>
        <View style={activeStyles.expertCol}>
          <Text style={activeStyles.expertVal}>{expertPercent}</Text>
          <Text style={activeStyles.expertLbl}>Experts</Text>
        </View>
        <Pressable style={activeStyles.starBtn} onPress={onToggleStar}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill={isStarred ? "#fbbf24" : "none"}>
            <Path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2L9.19 8.62L2 9.24L7.46 13.97L5.82 21L12 17.27Z" stroke={isStarred ? "#fbbf24" : "#94a3b8"} strokeWidth={2} />
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
      backgroundColor: Colors.surface,
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: Spacing.two,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderWidth: 1,
      borderColor: Colors.coltsNavyLight,
      height: 52,
    },
    suggestedHeadshot: {
      width: 34,
      height: 34,
      borderRadius: 17,
    },
    suggestedInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    suggestedHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    suggestedName: {
      fontFamily: Fonts.body,
      fontSize: 13,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
    },
    posBadge: {
      borderWidth: 1,
      borderRadius: 4,
      paddingHorizontal: 4,
      paddingVertical: 1,
    },
    posBadgeText: {
      fontFamily: Fonts.stats,
      fontSize: 8,
      fontWeight: '900',
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
      color: '#34d399',
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
      backgroundColor: Colors.hofYellow,
      borderColor: Colors.hofYellow,
      borderWidth: 1,
      borderRadius: 6,
      paddingHorizontal: 10,
      height: 28,
      justifyContent: 'center',
      alignItems: 'center',
    },
    draftBtnDisabled: {
      backgroundColor: Colors.surfaceLifted,
      borderColor: Colors.surfaceLifted,
      opacity: 0.4,
    },
    draftBtnText: {
      fontFamily: Fonts.headings,
      fontSize: 11,
      fontWeight: 'bold',
      color: '#000000',
    },
    draftBtnTextDisabled: {
      color: Colors.secondaryAccent,
    },
  });
}

const lightStyles = createStyles(LightColors);
const darkStyles = createStyles(DarkColors as any);
