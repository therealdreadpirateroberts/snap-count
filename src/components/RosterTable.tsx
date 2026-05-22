import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import { Colors, Fonts, Spacing, useColors, LightColors, DarkColors } from '@/constants/theme';
import { useThemeStore } from '@/store/useThemeStore';
import { getTeamLogoUrl } from '@/store/mockData';

// Helper to format player names cleanly to First Initial + Last Name
const getDisplayName = (name: string) => {
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

// Map players to direct ESPN player IDs for premium headshots
const getPlayerHeadshotUrl = (espnId: number | null, position: string, team?: string) => {
  if (position === 'DST' && team) {
    return getTeamLogoUrl(team);
  }
  if (espnId) {
    return `https://a.espncdn.com/i/headshots/nfl/players/full/${espnId}.png`;
  }
  return `https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/default.png&w=350&h=254`;
};

// Format number with commas
const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Generate highly realistic season projections based on position and projected points
const getPlayerProjections = (player: any) => {
  const pts = player.projectedPoints || 0;
  const ppg = Math.round(pts / 17);
  if (player.position === 'QB') {
    const yds = Math.round(pts * 12.5);
    const tds = Math.round(pts * 0.085);
    return `${formatNumber(yds)} Yds · ${tds} TD · ${ppg} PPG`;
  }
  if (player.position === 'RB') {
    const yds = Math.round(pts * 4.2 + 200);
    const tds = Math.round(pts * 0.038);
    return `${formatNumber(yds)} Yds · ${tds} TD · ${ppg} PPG`;
  }
  if (player.position === 'WR') {
    const yds = Math.round(pts * 4.5 + 100);
    const tds = Math.round(pts * 0.032);
    return `${formatNumber(yds)} Yds · ${tds} TD · ${ppg} PPG`;
  }
  if (player.position === 'TE') {
    const yds = Math.round(pts * 4.8);
    const tds = Math.round(pts * 0.042);
    return `${formatNumber(yds)} Yds · ${tds} TD · ${ppg} PPG`;
  }
  if (player.position === 'K') {
    const fg = Math.round(pts * 0.22);
    const xp = Math.round(pts * 0.26);
    return `${fg} FG · ${xp} XP · ${ppg} PPG`;
  }
  if (player.position === 'DST' || player.position === 'DEF') {
    const sck = Math.round(pts * 0.35);
    const ints = Math.round(pts * 0.12);
    return `${sck} Sck · ${ints} Int · ${ppg} PPG`;
  }
  return `${pts} Pts · ${ppg} PPG`;
};

const getSlotBgColor = (label: string) => {
  if (label === 'W/R/T') return '#334155';
  if (label === 'DEF') return '#64748b'; // colors.positions.DST equivalent standard
  if (label === 'BN') return '#27272a';
  if (label === 'IR') return '#18181b';
  
  // Custom mapping for positions
  const posMap: Record<string, string> = {
    QB: '#ef4444',
    RB: '#22c55e',
    WR: '#3b82f6',
    TE: '#f97316',
    K: '#a855f7',
    DEF: '#64748b',
    DST: '#64748b',
  };
  return posMap[label] || '#475569';
};

const getSlotTextColor = (label: string) => {
  if (label === 'BN' || label === 'IR' || label === 'W/R/T') return '#e2e8f0';
  return '#000000';
};

export interface RosterTableProps {
  roster: any[];
  setup: {
    flexCount?: number;
    userStrategy?: string;
  };
  draftHistory: any[];
  userTeamName: string;
}

export default function RosterTable({ roster, setup, draftHistory, userTeamName }: RosterTableProps) {
  const Colors = useColors();
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark';
  const activeStyles = isDark ? darkStyles : lightStyles;

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Helper to extract exact draft pick number for active draft
  const getUserPickNumber = (playerName: string) => {
    const pickObj = draftHistory.find(h => h.player.name === playerName);
    return pickObj ? pickObj.pickNumber : '-';
  };

  // Group active roster into slots mirroring active.tsx layout
  const rosterSlots = useMemo(() => {
    const slots: {
      id: string;
      label: string;
      allowedPositions: string[];
      player: any | null;
    }[] = [
      { id: 'QB', label: 'QB', allowedPositions: ['QB'], player: null },
      { id: 'WR1', label: 'WR', allowedPositions: ['WR'], player: null },
      { id: 'WR2', label: 'WR', allowedPositions: ['WR'], player: null },
      { id: 'RB1', label: 'RB', allowedPositions: ['RB'], player: null },
      { id: 'RB2', label: 'RB', allowedPositions: ['RB'], player: null },
      { id: 'TE', label: 'TE', allowedPositions: ['TE'], player: null },
    ];

    const maxFlex = setup.flexCount ?? 1;
    for (let f = 1; f <= maxFlex; f++) {
      slots.push({ id: `FLEX${f}`, label: 'W/R/T', allowedPositions: ['WR', 'RB', 'TE'], player: null });
    }

    slots.push(
      { id: 'K', label: 'K', allowedPositions: ['K'], player: null },
      { id: 'DEF', label: 'DEF', allowedPositions: ['DST'], player: null },
      { id: 'BN1', label: 'BN', allowedPositions: ['QB', 'WR', 'RB', 'TE', 'K', 'DST'], player: null },
      { id: 'BN2', label: 'BN', allowedPositions: ['QB', 'WR', 'RB', 'TE', 'K', 'DST'], player: null },
      { id: 'BN3', label: 'BN', allowedPositions: ['QB', 'WR', 'RB', 'TE', 'K', 'DST'], player: null },
      { id: 'BN4', label: 'BN', allowedPositions: ['QB', 'WR', 'RB', 'TE', 'K', 'DST'], player: null },
      { id: 'BN5', label: 'BN', allowedPositions: ['QB', 'WR', 'RB', 'TE', 'K', 'DST'], player: null },
      { id: 'BN6', label: 'BN', allowedPositions: ['QB', 'WR', 'RB', 'TE', 'K', 'DST'], player: null }
    );

    const pool = [...roster];
    // Pass 1: Starters (QB, WR1/2, RB1/2, TE, K, DEF)
    for (let i = 0; i < pool.length; i++) {
      const p = pool[i];
      let assigned = false;
      if (p.position === 'QB') {
        const slot = slots.find(s => s.id === 'QB' && !s.player);
        if (slot) { slot.player = p; assigned = true; }
      } else if (p.position === 'WR') {
        const slot = slots.find(s => (s.id === 'WR1' || s.id === 'WR2') && !s.player);
        if (slot) { slot.player = p; assigned = true; }
      } else if (p.position === 'RB') {
        const slot = slots.find(s => (s.id === 'RB1' || s.id === 'RB2') && !s.player);
        if (slot) { slot.player = p; assigned = true; }
      } else if (p.position === 'TE') {
        const slot = slots.find(s => s.id === 'TE' && !s.player);
        if (slot) { slot.player = p; assigned = true; }
      } else if (p.position === 'K') {
        const slot = slots.find(s => s.id === 'K' && !s.player);
        if (slot) { slot.player = p; assigned = true; }
      } else if (p.position === 'DST' || p.position === 'DEF') {
        const slot = slots.find(s => s.id === 'DEF' && !s.player);
        if (slot) { slot.player = p; assigned = true; }
      }

      if (assigned) {
        pool.splice(i, 1);
        i--;
      }
    }

    // Pass 2: FLEX slots (W/R/T)
    for (let i = 0; i < pool.length; i++) {
      const p = pool[i];
      if (p.position === 'WR' || p.position === 'RB' || p.position === 'TE') {
        const slot = slots.find(s => s.id.startsWith('FLEX') && !s.player);
        if (slot) {
          slot.player = p;
          pool.splice(i, 1);
          i--;
        }
      }
    }

    // Pass 3: Bench (BN1-BN6)
    for (let i = 0; i < pool.length; i++) {
      const p = pool[i];
      const slot = slots.find(s => s.id.startsWith('BN') && !s.player);
      if (slot) {
        slot.player = p;
        pool.splice(i, 1);
        i--;
      }
    }

    return slots;
  }, [roster, setup.flexCount]);

  const starters = useMemo(() => rosterSlots.filter(s => !s.id.startsWith('BN')), [rosterSlots]);
  const bench = useMemo(() => rosterSlots.filter(s => s.id.startsWith('BN')), [rosterSlots]);

  // Positional bye conflicts
  const positionByeCounts = useMemo(() => {
    const counts: { [pos: string]: { [bye: number]: number } } = {};
    roster.forEach(player => {
      const pos = player.position;
      const bye = player.bye;
      if (!counts[pos]) counts[pos] = {};
      counts[pos][bye] = (counts[pos][bye] || 0) + 1;
    });
    return counts;
  }, [roster]);

  // ADVANCED METRICS CALCULATIONS
  const getPositionGrade = (pos: string) => {
    const totalPts = roster.filter(p => p.position === pos).reduce((sum, p) => sum + p.projectedPoints, 0);
    if (pos === 'QB') {
      if (totalPts > 320) return 'A+';
      if (totalPts > 295) return 'A';
      if (totalPts > 270) return 'B+';
      if (totalPts > 245) return 'B';
      return 'C';
    }
    if (pos === 'RB') {
      if (totalPts > 470) return 'A+';
      if (totalPts > 390) return 'A';
      if (totalPts > 310) return 'B+';
      if (totalPts > 240) return 'B';
      return 'C';
    }
    if (pos === 'WR') {
      if (totalPts > 500) return 'A+';
      if (totalPts > 410) return 'A';
      if (totalPts > 330) return 'B+';
      if (totalPts > 250) return 'B';
      return 'C';
    }
    if (pos === 'TE') {
      if (totalPts > 175) return 'A+';
      if (totalPts > 145) return 'A';
      if (totalPts > 115) return 'B+';
      if (totalPts > 90) return 'B';
      return 'C';
    }
    return 'B';
  };

  const getPositionPPG = (pos: string) => {
    const totalPts = roster.filter(p => p.position === pos).reduce((sum, p) => sum + p.projectedPoints, 0);
    return Math.round(totalPts / 17);
  };

  const byeConflictCount = useMemo(() => {
    let conflicts = 0;
    Object.keys(positionByeCounts).forEach(pos => {
      Object.keys(positionByeCounts[pos]).forEach(bye => {
        if (positionByeCounts[pos][Number(bye)] >= 2) {
          conflicts++;
        }
      });
    });
    return conflicts;
  }, [positionByeCounts]);

  const getByeScore = () => {
    if (byeConflictCount === 0) return 100;
    if (byeConflictCount === 1) return 85;
    if (byeConflictCount === 2) return 65;
    return 45;
  };

  const getStarterBenchRatio = () => {
    const starterPts = starters.reduce((sum, s) => sum + (s.player ? s.player.projectedPoints : 0), 0);
    const benchPts = bench.reduce((sum, b) => sum + (b.player ? b.player.projectedPoints : 0), 0);
    return benchPts > 0 ? `${Math.round(starterPts / benchPts)}x` : 'N/A';
  };

  return (
    <View style={activeStyles.rosterSection}>
      {/* STARTERS GRID */}
      <View style={activeStyles.columnHeaderRow}>
        <View style={[activeStyles.rankingsRowLeftSection, { width: 76, justifyContent: 'center' }]}>
          <Text style={activeStyles.columnHeaderText}>SLOT/BYE</Text>
        </View>
        <View style={{ width: 32 }} />
        <View style={activeStyles.rankingsRowInfo}>
          <Text style={activeStyles.columnHeaderText}>STARTER SLOTS</Text>
        </View>
      </View>

      <View style={activeStyles.gridContainer}>
        {starters.map((slot) => (
          <View key={slot.id} style={activeStyles.rankingsRowItem}>
            <View style={activeStyles.rankingsRowLeftSection}>
              <View style={[
                activeStyles.posRankBadge, 
                { backgroundColor: getSlotBgColor(slot.label) }
              ]}>
                <Text style={[
                  activeStyles.posRankBadgeText, 
                  { color: getSlotTextColor(slot.label) }
                ]}>
                  {slot.label}
                </Text>
              </View>
              {slot.player && (
                <View style={[
                  activeStyles.posRankBadge, 
                  { 
                    backgroundColor: '#ffffff',
                  }
                ]}>
                  <Text style={[
                    activeStyles.posRankBadgeText, 
                    { color: '#000000', fontWeight: 'bold' }
                  ]}>
                    {slot.player.bye}
                  </Text>
                </View>
              )}
            </View>
            {slot.player ? (
              <>
                <Image
                  source={{ uri: getPlayerHeadshotUrl(slot.player.espnId, slot.player.position, slot.player.team) }}
                  style={activeStyles.rankingsRowHeadshot}
                />
                <View style={activeStyles.rankingsRowInfo}>
                  <Text style={activeStyles.rankingsRowName} numberOfLines={1}>
                    {getDisplayName(slot.player.name)}
                  </Text>
                  <Text style={activeStyles.rankingsRowMeta}>
                    {slot.player.team} · {getPlayerProjections(slot.player)}
                  </Text>
                </View>
                <View style={activeStyles.pickDetails}>
                  <Text style={activeStyles.pickLabel}>PICK</Text>
                  <Text style={activeStyles.pickVal}>#{getUserPickNumber(slot.player.name)}</Text>
                </View>
              </>
            ) : (
              <View style={activeStyles.emptySlotContainer}>
                <Text style={activeStyles.emptySlotText}>Empty Starting Slot</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* BENCH GRID */}
      <View style={[activeStyles.columnHeaderRow, { marginTop: Spacing.four }]}>
        <View style={[activeStyles.rankingsRowLeftSection, { width: 76, justifyContent: 'center' }]}>
          <Text style={activeStyles.columnHeaderText}>SLOT/BYE</Text>
        </View>
        <View style={{ width: 32 }} />
        <View style={activeStyles.rankingsRowInfo}>
          <Text style={activeStyles.columnHeaderText}>BENCH SLOTS</Text>
        </View>
      </View>

      <View style={activeStyles.gridContainer}>
        {bench.map((slot) => (
          <View key={slot.id} style={activeStyles.rankingsRowItem}>
            <View style={activeStyles.rankingsRowLeftSection}>
              <View style={[
                activeStyles.posRankBadge, 
                { backgroundColor: getSlotBgColor(slot.label) }
              ]}>
                <Text style={[
                  activeStyles.posRankBadgeText, 
                  { color: getSlotTextColor(slot.label) }
                ]}>
                  {slot.label}
                </Text>
              </View>
              {slot.player && (
                <View style={[
                  activeStyles.posRankBadge, 
                  { 
                    backgroundColor: '#ffffff',
                  }
                ]}>
                  <Text style={[
                    activeStyles.posRankBadgeText, 
                    { color: '#000000', fontWeight: 'bold' }
                  ]}>
                    {slot.player.bye}
                  </Text>
                </View>
              )}
            </View>
            {slot.player ? (
              <>
                <Image
                  source={{ uri: getPlayerHeadshotUrl(slot.player.espnId, slot.player.position, slot.player.team) }}
                  style={activeStyles.rankingsRowHeadshot}
                />
                <View style={activeStyles.rankingsRowInfo}>
                  <Text style={activeStyles.rankingsRowName} numberOfLines={1}>
                    {getDisplayName(slot.player.name)}
                  </Text>
                  <Text style={activeStyles.rankingsRowMeta}>
                    {slot.player.team} · {getPlayerProjections(slot.player)}
                  </Text>
                </View>
                <View style={activeStyles.pickDetails}>
                  <Text style={activeStyles.pickLabel}>PICK</Text>
                  <Text style={activeStyles.pickVal}>#{getUserPickNumber(slot.player.name)}</Text>
                </View>
              </>
            ) : (
              <View style={activeStyles.emptySlotContainer}>
                <Text style={activeStyles.emptySlotText}>Empty Bench Slot</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* ADVANCED METRICS SUB-VIEW OPTIONS */}
      <Pressable 
        style={[activeStyles.advancedToggleBtn, showAdvanced && activeStyles.advancedToggleBtnActive]}
        onPress={() => setShowAdvanced(!showAdvanced)}
      >
        <Text style={activeStyles.advancedToggleBtnText}>
          {showAdvanced ? '🔽 HIDE ADVANCED ROSTER METRICS' : '➕ ANALYZE ADVANCED ROSTER METRICS'}
        </Text>
      </Pressable>

      {showAdvanced && (
        <View style={activeStyles.advancedMetricsCard}>
          <Text style={activeStyles.advancedTitle}>ROSTER STRENGTH REPORT</Text>
          
          <View style={activeStyles.advancedRow}>
            <View style={activeStyles.advancedCell}>
              <Text style={[activeStyles.posBadge, { backgroundColor: Colors.positions.QB }]}>QB</Text>
              <Text style={activeStyles.advancedGradeText}>{getPositionGrade('QB')}</Text>
              <Text style={activeStyles.advancedSubtext}>{getPositionPPG('QB')} PPG Avg</Text>
            </View>
            <View style={activeStyles.advancedCell}>
              <Text style={[activeStyles.posBadge, { backgroundColor: Colors.positions.RB }]}>RB</Text>
              <Text style={activeStyles.advancedGradeText}>{getPositionGrade('RB')}</Text>
              <Text style={activeStyles.advancedSubtext}>{getPositionPPG('RB')} PPG Avg</Text>
            </View>
            <View style={activeStyles.advancedCell}>
              <Text style={[activeStyles.posBadge, { backgroundColor: Colors.positions.WR }]}>WR</Text>
              <Text style={activeStyles.advancedGradeText}>{getPositionGrade('WR')}</Text>
              <Text style={activeStyles.advancedSubtext}>{getPositionPPG('WR')} PPG Avg</Text>
            </View>
            <View style={activeStyles.advancedCell}>
              <Text style={[activeStyles.posBadge, { backgroundColor: Colors.positions.TE }]}>TE</Text>
              <Text style={activeStyles.advancedGradeText}>{getPositionGrade('TE')}</Text>
              <Text style={activeStyles.advancedSubtext}>{getPositionPPG('TE')} PPG Avg</Text>
            </View>
          </View>

          <View style={activeStyles.metricStatsRow}>
            <View style={activeStyles.metricStatsCard}>
              <Text style={activeStyles.metricStatsLabel}>BYE COVERAGE SCORE</Text>
              <Text style={activeStyles.metricStatsValue}>{getByeScore()}%</Text>
              <Text style={activeStyles.metricStatsFeedback}>
                {byeConflictCount === 0 ? 'Perfect bye distribution.' : `${byeConflictCount} overlap conflict(s) found.`}
              </Text>
            </View>

            <View style={activeStyles.metricStatsCard}>
              <Text style={activeStyles.metricStatsLabel}>STARTER/BENCH VALUE</Text>
              <Text style={activeStyles.metricStatsValue}>{getStarterBenchRatio()}</Text>
              <Text style={activeStyles.metricStatsFeedback}>Capital starter concentration</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

function createStyles(Colors: typeof LightColors) {
  const isDark = (Colors.primaryAccent as string) === '#FFFFFF';
  return StyleSheet.create({
    rosterSection: {
      gap: Spacing.two,
    },
    columnHeaderRow: {
      flexDirection: 'row',
      paddingHorizontal: Spacing.two,
      paddingBottom: 4,
    },
    columnHeaderText: {
      fontFamily: Fonts.stats,
      fontSize: 9,
      fontWeight: '800',
      color: Colors.secondaryAccent,
      letterSpacing: 1.5,
    },
    gridContainer: {
      gap: 6,
    },
    rankingsRowItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.surface,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: Spacing.two,
      gap: 8,
      height: 58,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    rankingsRowLeftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    posRankBadge: {
      width: 36,
      height: 20,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    posRankBadgeText: {
      fontFamily: Fonts.stats,
      fontSize: 8.5,
      color: '#000000',
      fontWeight: '900',
    },
    rankingsRowHeadshot: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: Colors.surfaceLifted,
    },
    rankingsRowInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    rankingsRowName: {
      fontFamily: Fonts.body,
      fontSize: 13,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
    },
    rankingsRowMeta: {
      fontFamily: Fonts.body,
      fontSize: 10,
      color: Colors.secondaryAccent,
    },
    pickDetails: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingRight: 4,
    },
    pickLabel: {
      fontFamily: Fonts.stats,
      fontSize: 6.5,
      color: Colors.secondaryAccent,
      letterSpacing: 0.5,
    },
    pickVal: {
      fontFamily: Fonts.stats,
      fontSize: 10.5,
      color: Colors.primaryAccent,
      fontWeight: 'bold',
    },
    emptySlotContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    emptySlotText: {
      fontFamily: Fonts.body,
      fontSize: 11,
      color: Colors.secondaryAccent,
      fontStyle: 'italic',
    },
    advancedToggleBtn: {
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 8,
      backgroundColor: Colors.surface,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: Spacing.three,
    },
    advancedToggleBtnActive: {
      borderColor: Colors.coltsNavyLight,
      backgroundColor: Colors.surfaceLifted,
    },
    advancedToggleBtnText: {
      fontFamily: Fonts.headings,
      fontSize: 12,
      color: Colors.primaryAccent,
      letterSpacing: 0.5,
    },
    advancedMetricsCard: {
      backgroundColor: Colors.surface,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 12,
      padding: Spacing.three,
      marginTop: Spacing.two,
      gap: Spacing.three,
      ...Colors.shadows,
    },
    advancedTitle: {
      fontFamily: Fonts.headings,
      fontSize: 14,
      color: Colors.primaryAccent,
      letterSpacing: 0.5,
    },
    advancedRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 4,
    },
    advancedCell: {
      flex: 1,
      backgroundColor: Colors.surfaceLifted,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 0.5,
      borderRadius: 8,
      padding: 8,
      alignItems: 'center',
      gap: 4,
    },
    posBadge: {
      fontFamily: Fonts.stats,
      fontSize: 8,
      fontWeight: 'bold',
      color: '#000000',
      paddingVertical: 2,
      paddingHorizontal: 6,
      borderRadius: 4,
    },
    advancedGradeText: {
      fontFamily: Fonts.headings,
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
    },
    advancedSubtext: {
      fontFamily: Fonts.stats,
      fontSize: 7.5,
      color: Colors.secondaryAccent,
    },
    metricStatsRow: {
      flexDirection: 'row',
      gap: Spacing.two,
    },
    metricStatsCard: {
      flex: 1,
      backgroundColor: Colors.surfaceLifted,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 0.5,
      borderRadius: 8,
      padding: 10,
      gap: 2,
    },
    metricStatsLabel: {
      fontFamily: Fonts.stats,
      fontSize: 7.5,
      color: Colors.secondaryAccent,
      letterSpacing: 0.5,
    },
    metricStatsValue: {
      fontFamily: Fonts.stats,
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
    },
    metricStatsFeedback: {
      fontFamily: Fonts.body,
      fontSize: 9.5,
      color: Colors.secondaryAccent,
    },
  });
}

const lightStyles = createStyles(LightColors);
const darkStyles = createStyles(DarkColors as any);
