import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors, Fonts, Spacing, LightColors, DarkColors } from '@/constants/theme';
import { Player } from '@/store/mockData';

import { useThemeStore } from '@/store/useThemeStore';

interface RosterSummaryCardProps {
  teamName: string;
  isUser: boolean;
  rosterPicks: Array<{
    pickNumber: number;
    round: number;
    player: Player;
  }>;
  currentSlots?: {
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
}

export default function RosterSummaryCard({
  teamName,
  isUser,
  rosterPicks,
  currentSlots = {
    QB: 1,
    RB: 2,
    WR: 2,
    TE: 1,
    FLEX: 1,
    K: 1,
    DST: 1,
    BENCH: 6,
    IR: 1
  },
}: RosterSummaryCardProps) {
  const Colors = useColors();
  const isDark = useThemeStore((state) => state.theme) === 'dark';
  const activeStyles = isDark ? darkStyles : lightStyles;

  // 1. Generate empty roster slot structure
  const slots: Array<{ slotName: string; position: string }> = [];
  for (let i = 0; i < (currentSlots.QB || 0); i++) slots.push({ slotName: `QB${(currentSlots.QB || 0) > 1 ? ' ' + (i + 1) : ''}`, position: 'QB' });
  for (let i = 0; i < (currentSlots.RB || 0); i++) slots.push({ slotName: `RB${i + 1}`, position: 'RB' });
  for (let i = 0; i < (currentSlots.WR || 0); i++) slots.push({ slotName: `WR${i + 1}`, position: 'WR' });
  for (let i = 0; i < (currentSlots.TE || 0); i++) slots.push({ slotName: `TE${(currentSlots.TE || 0) > 1 ? ' ' + (i + 1) : ''}`, position: 'TE' });
  for (let i = 0; i < (currentSlots.FLEX || 0); i++) slots.push({ slotName: `FLEX${(currentSlots.FLEX || 0) > 1 ? ' ' + (i + 1) : ''}`, position: 'FLEX' });
  for (let i = 0; i < (currentSlots.K || 0); i++) slots.push({ slotName: `K`, position: 'K' });
  for (let i = 0; i < (currentSlots.DST || 0); i++) slots.push({ slotName: `DST`, position: 'DST' });
  for (let i = 0; i < (currentSlots.BENCH || 0); i++) slots.push({ slotName: `BNCH${i + 1}`, position: 'BENCH' });

  // 2. Map actual picks chronologically to empty slots
  const filledSlots = slots.map(s => ({ ...s, player: undefined as Player | undefined }));
  const sortedPicks = [...rosterPicks].sort((a, b) => a.pickNumber - b.pickNumber);

  for (const pick of sortedPicks) {
    const player = pick.player;
    if (!player) continue;

    // A. Match primary position
    let slotIndex = filledSlots.findIndex(s => s.position === player.position && !s.player);

    // B. Match FLEX (RB/WR/TE)
    if (slotIndex === -1 && ['RB', 'WR', 'TE'].includes(player.position)) {
      slotIndex = filledSlots.findIndex(s => s.position === 'FLEX' && !s.player);
    }

    // C. Match BENCH
    if (slotIndex === -1) {
      slotIndex = filledSlots.findIndex(s => s.position === 'BENCH' && !s.player);
    }

    // Assign player to designated slot
    if (slotIndex !== -1) {
      filledSlots[slotIndex].player = player;
    }
  }

  return (
    <View style={[activeStyles.rosterCard, isUser && activeStyles.rosterCardUser]}>
      {/* Top 1px inner leather highlight */}
      <View style={activeStyles.innerHighlight} />
      
      <Text style={[activeStyles.rosterCardTitle, isUser && activeStyles.rosterCardTitleUser]}>
        {isUser ? "YOUR TEAM TROPHY CASE" : teamName.toUpperCase()}
      </Text>

      <View style={activeStyles.rosterCardGrid}>
        {filledSlots.map((slot, index) => {
          if (slot.player) {
            // Filled slot panel
            return (
              <View key={`${slot.slotName}-${index}`} style={activeStyles.filledSlotPanel}>
                <View style={activeStyles.filledHeader}>
                  <Text style={activeStyles.positionLabel}>{slot.slotName}</Text>
                  <Text style={activeStyles.playerMetaText}>
                    {slot.player.team} · BYE {slot.player.bye}
                  </Text>
                </View>
                <Text style={activeStyles.playerNameText} numberOfLines={1}>
                  {slot.player.name.toUpperCase()}
                </Text>
              </View>
            );
          } else {
            // Empty dashed outline slot
            return (
              <View key={`${slot.slotName}-${index}`} style={activeStyles.emptySlotPanel}>
                <Text style={activeStyles.emptySlotLabel}>{slot.slotName}</Text>
                <Text style={activeStyles.emptySlotSub}>TO BE FILLED</Text>
              </View>
            );
          }
        })}
      </View>
    </View>
  );
}

function createStyles(Colors: typeof LightColors) {
  return StyleSheet.create({
    rosterCard: {
      backgroundColor: Colors.deepGraphite, // Deep Graphite content surface backing
      borderRadius: 8, // subtle, not pillowy
      padding: 12, // cramped trays read as toolbars, rosters need high density
      borderWidth: 1.5,
      borderColor: Colors.pigskinBrown, // Pigskin Brown accent flourish border
      position: 'relative',
      overflow: 'hidden',
    },
    rosterCardUser: {
      borderColor: Colors.hofYellow, // Highlight User team with gold borders
    },
    innerHighlight: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 1.5,
      backgroundColor: 'rgba(255, 255, 255, 0.12)', // "leather catching light" effect
    },
    rosterCardTitle: {
      fontFamily: Fonts.headings,
      fontSize: 13,
      color: Colors.primaryAccent, // Chalk White title
      fontWeight: '900',
      letterSpacing: 1,
      marginBottom: Spacing.two,
      paddingHorizontal: 2,
    },
    rosterCardTitleUser: {
      color: Colors.primaryAccent, // Chalk White for user
    },
    rosterCardGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 8,
    },
    filledSlotPanel: {
      backgroundColor: 'rgba(0, 0, 0, 0.25)', // Deep leather panel container shading
      borderRadius: 6,
      padding: 8,
      width: '48.5%',
      minHeight: 48,
      borderWidth: 1,
      borderColor: 'rgba(244, 245, 247, 0.05)',
      justifyContent: 'center',
    },
    filledHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 3,
    },
    positionLabel: {
      fontFamily: Fonts.stats,
      fontSize: 9,
      fontWeight: 'bold',
      color: 'rgba(244, 245, 247, 0.7)', // Chalk White position label
    },
    playerMetaText: {
      fontFamily: Fonts.body,
      fontSize: 8,
      fontWeight: '600',
      color: 'rgba(244, 245, 247, 0.6)', // Chalk White at 60% opacity
    },
    playerNameText: {
      fontFamily: Fonts.headings,
      fontSize: 12,
      fontWeight: 'bold',
      color: '#F4F5F7', // Chalk White player name
      letterSpacing: 0.5,
    },
    emptySlotPanel: {
      backgroundColor: 'transparent',
      borderRadius: 6,
      borderWidth: 1,
      borderColor: 'rgba(244, 245, 247, 0.35)', // Chalk White dashed outline
      borderStyle: 'dashed',
      padding: 8,
      width: '48.5%',
      minHeight: 48,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptySlotLabel: {
      fontFamily: Fonts.stats,
      fontSize: 10,
      fontWeight: 'bold',
      color: 'rgba(244, 245, 247, 0.65)',
    },
    emptySlotSub: {
      fontFamily: Fonts.body,
      fontSize: 7,
      fontWeight: 'bold',
      color: 'rgba(244, 245, 247, 0.4)',
      letterSpacing: 0.5,
      marginTop: 2,
    },
  });
}

const lightStyles = createStyles(LightColors);
const darkStyles = createStyles(DarkColors as any);
