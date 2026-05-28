import React from 'react';
import { StyleSheet, View, Text, Pressable, Animated, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Player } from '@/store/mockData';
import { Colors } from '@/constants/theme';
import { PlayerHeadshot } from '@/components/PlayerHeadshot';

// Helper to format player names cleanly to First Initial + Last Name
export const getDisplayName = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1) {
    const suffixes = ['jr', 'sr', 'ii', 'iii', 'iv', 'v', 'jr.', 'sr.'];
    const lastPart = parts[parts.length - 1].toLowerCase();
    if (suffixes.includes(lastPart) && parts.length > 2) {
      return `${parts[0][0]}. ${parts[parts.length - 2]} ${parts[parts.length - 1]}`;
    }
    return `${parts[0][0]}. ${parts.slice(1).join(' ')}`;
  }
  return name;
};

export interface PlayerRowProps {
  item: Player;
  isCurrentlyDragged: boolean;
  isDrafted: boolean;
  isSuggestion: boolean;
  showTierHeader: boolean;
  tierLabel: string;
  tierColor: string;
  boardType: string;
  panHandlers: any;
  dragY: Animated.Value;
  onAddPlayer: (player: Player) => void;
  onPlayerPress?: (player: Player) => void;
  Colors: any;
  styles: any;
}

export const PlayerRow = React.memo(({
  item,
  isCurrentlyDragged,
  isDrafted,
  isSuggestion,
  showTierHeader,
  tierLabel,
  tierColor,
  boardType,
  panHandlers,
  dragY,
  onAddPlayer,
  onPlayerPress,
  Colors: themeColors,
  styles
}: PlayerRowProps) => {
  const ppg = Math.round((item.projectedPoints || 0) / 17);

  const rowContent = (
    <Pressable 
      style={[
        styles.rankingsRowItem, 
        isDrafted && styles.rankingsRowItemDrafted,
        isSuggestion && styles.rankingsRowItemSuggestion,
        isCurrentlyDragged && styles.rankingsRowItemDragging
      ]}
      onPress={() => onPlayerPress?.(item)}
    >
      <View style={styles.rankingsRowLeftSection}>
        <View style={styles.normalRankSquare}>
          <Text style={styles.normalRankText}>{isSuggestion ? '—' : item.rank}</Text>
        </View>
        <View style={[styles.posRankBadge, { backgroundColor: themeColors.positions[item.position as keyof typeof themeColors.positions] || '#a1a1aa' }]}>
          <Text style={styles.posRankBadgeText}>{item.posRank}</Text>
        </View>
      </View>
      <PlayerHeadshot 
        name={item.name}
        position={item.position}
        team={item.team}
        espnId={item.espnId}
        style={styles.rankingsRowHeadshot} 
      />
      <View style={styles.rankingsRowInfo}>
        <Text style={[styles.rankingsRowName, isDrafted && styles.playerNameDrafted]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.rankingsRowMeta}>
          {item.team} · Bye {item.bye} · {ppg} PPG {isSuggestion && '· Suggested'}
          {isDrafted && ` · (${item.draftedBy})`}
        </Text>
      </View>
      {isSuggestion ? (
        <Pressable 
          style={styles.addBtn}
          onPress={() => onAddPlayer(item)}
        >
          <Text style={styles.addBtnText}>+ ADD</Text>
        </Pressable>
      ) : boardType === 'custom' ? (
        <View style={styles.reorderContainer}>
          <View 
            style={styles.dragHandleSquare} 
            {...panHandlers}
          >
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" pointerEvents="none">
              <Path d="M4 6H20M4 12H20M4 18H20" stroke="#a1a1aa" strokeWidth={2.5} strokeLinecap="round" />
            </Svg>
          </View>
        </View>
      ) : null}
    </Pressable>
  );

  return (
    <View>
      {showTierHeader && (
        <View style={[styles.tierHeader, { borderBottomColor: tierColor }]}>
          <Text style={[styles.tierHeaderText, { color: tierColor }]}>{tierLabel}</Text>
        </View>
      )}
      <Animated.View 
        style={
          isCurrentlyDragged 
            ? { transform: [{ translateY: dragY }], zIndex: 1000 } 
            : undefined
        }
      >
        {rowContent}
      </Animated.View>
    </View>
  );
});

PlayerRow.displayName = 'PlayerRow';

export default PlayerRow;
