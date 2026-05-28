import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, ScrollView, Platform, Dimensions, Animated, PanResponder } from 'react-native';
import { Player } from '@/store/mockData';
import { PlayerHeadshot } from './PlayerHeadshot';
import { Fonts, useColors, Spacing } from '@/constants/theme';
import { usePlayerStore } from '@/store/usePlayerStore';
import Svg, { Path, Rect, Defs, Stop, LinearGradient, Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { ProceduralTradingCard, resolvePlayerCard } from './ProceduralTradingCard';
import { PlayerCardData } from '@/types/tradingCard';
import { useDraftStore } from '@/store/useDraftStore';
import { generateGameStats } from '@/store/statsEngine';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const triggerHaptic = async (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
  if (Platform.OS !== 'web') {
    try {
      await Haptics.impactAsync(style);
    } catch (err) {}
  }
};

const getPsaGrade = (rank: number) => {
  if (rank <= 5) return { num: '10', desc: 'GEM MT' };
  if (rank <= 15) return { num: '9', desc: 'MINT' };
  if (rank <= 30) return { num: '8', desc: 'NM-MT' };
  if (rank <= 50) return { num: '7', desc: 'NM' };
  if (rank <= 80) return { num: '6', desc: 'EX-MT' };
  if (rank <= 110) return { num: '5', desc: 'EX' };
  return { num: '4', desc: 'VG-EX' };
};

const getPlayerStatsForHeader = (position: string, projectedPoints: number) => {
  const pts = projectedPoints || 0;
  const ppg = (pts / 17).toFixed(1);
  let yards = 0;
  let touchdowns = 0;

  if (position === 'QB') {
    yards = Math.round(pts * 12.5);
    touchdowns = Math.round(pts * 0.085);
  } else if (position === 'RB') {
    yards = Math.round(pts * 4.2 + 200);
    touchdowns = Math.round(pts * 0.038);
  } else if (position === 'WR') {
    yards = Math.round(pts * 4.5 + 100);
    touchdowns = Math.round(pts * 0.032);
  } else if (position === 'TE') {
    yards = Math.round(pts * 4.8);
    touchdowns = Math.round(pts * 0.042);
  } else {
    yards = Math.round(pts);
    touchdowns = 0;
  }

  return {
    ppg: `${ppg}`,
    yards: yards.toLocaleString(),
    tds: `${touchdowns}`
  };
};

const teamColors: Record<string, string[]> = {
  SF: ['#AA0000', '#B3995D'],
  LV: ['#000000', '#A6AEB5'],
  KC: ['#E31837', '#FFB81C'],
  DAL: ['#869397', '#002244'],
  LAR: ['#003594', '#FFA300'],
  DET: ['#0076B6', '#B0B7BC'],
  NYJ: ['#125740', '#FFFFFF'],
  ATL: ['#A71930', '#000000'],
  BUF: ['#00338D', '#C60C30'],
  GB: ['#203731', '#FFB612'],
  ARI: ['#97233F', '#000000'],
  BAL: ['#241773', '#9E7C3B'],
  CAR: ['#0085CA', '#101820'],
  CHI: ['#0B162A', '#C83803'],
  CIN: ['#FB4F14', '#000000'],
  CLE: ['#311D00', '#FF3C00'],
  DEN: ['#FB4F14', '#002244'],
  HOU: ['#03202F', '#A71930'],
  IND: ['#002C5F', '#A2AAAD'],
  JAX: ['#006778', '#D7A22A'],
  LAC: ['#0080C6', '#FFC20E'],
  MIA: ['#008E97', '#FC4C02'],
  MIN: ['#4F2683', '#FFC62F'],
  NE: ['#002244', '#C60C30'],
  NO: ['#D3BC8D', '#101820'],
  NYG: ['#0B2265', '#A71930'],
  PHI: ['#004C54', '#A5ACAF'],
  PIT: ['#FFB612', '#101820'],
  SEA: ['#002244', '#69BE28'],
  TB: ['#D50A0A', '#34302B'],
  TEN: ['#4B92DB', '#C60C30'],
  WAS: ['#5A1414', '#FFB612'],
};

const fullTeamNames: Record<string, string> = {
  SF: 'NINERS',
  LV: 'RAIDERS',
  KC: 'CHIEFS',
  DAL: 'COWBOYS',
  LAR: 'RAMS',
  DET: 'LIONS',
  NYJ: 'JETS',
  ATL: 'FALCONS',
  BUF: 'BILLS',
  GB: 'PACKERS',
  ARI: 'CARDS',
  BAL: 'RAVENS',
  CAR: 'PANTHERS',
  CHI: 'BEARS',
  CIN: 'BENGALS',
  CLE: 'BROWNS',
  DEN: 'BRONCOS',
  HOU: 'TEXANS',
  IND: 'COLTS',
  JAX: 'JAGS',
  LAC: 'BOLTS',
  MIA: 'DOLPHINS',
  MIN: 'VIKINGS',
  NE: 'PATS',
  NO: 'SAINTS',
  NYG: 'GIANTS',
  PHI: 'EAGLES',
  PIT: 'STEELERS',
  SEA: 'HAWKS',
  TB: 'BUCS',
  TEN: 'TITANS',
  WAS: 'COMMANDS',
};

const getCardTemplate = (name: string) => {
  const templates = ['chrome', 'rpa', 'kaboom', 'downtown'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash += name.charCodeAt(i);
  }
  return templates[hash % templates.length];
};

interface PlayerCardModalProps {
  player: Player | null;
  nextPlayer?: Player | null;
  prevPlayer?: Player | null;
  onClose: () => void;
  onNextPlayer?: () => void;
  onPrevPlayer?: () => void;
}

export const PlayerCardModal: React.FC<PlayerCardModalProps> = ({ 
  player, 
  nextPlayer, 
  prevPlayer, 
  onClose, 
  onNextPlayer, 
  onPrevPlayer 
}) => {
  const Colors = useColors();
  const year = useDraftStore((state) => state.setup.year) || 2026;
  const [flipped, setFlipped] = useState(false);
  const [dragDirection, setDragDirection] = useState<'none' | 'left' | 'right'>('none');
  const flipAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get('window');

  // Reset card flip state back to front when player changes
  useEffect(() => {
    setFlipped(false);
    flipAnim.setValue(0);
    translateX.setValue(0);
    setDragDirection('none');
  }, [player]);

  // Refs to avoid stale closures in PanResponder callbacks
  const flippedRef = useRef(flipped);
  const onNextPlayerRef = useRef(onNextPlayer);
  const onPrevPlayerRef = useRef(onPrevPlayer);

  useEffect(() => {
    flippedRef.current = flipped;
  }, [flipped]);

  useEffect(() => {
    onNextPlayerRef.current = onNextPlayer;
  }, [onNextPlayer]);

  useEffect(() => {
    onPrevPlayerRef.current = onPrevPlayer;
  }, [onPrevPlayer]);

  // Set up PanResponder for horizontal swipe gesture navigation
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy } = gestureState;
        if (!flippedRef.current) {
          // Front side: no vertical scrolling conflict, capture any primary horizontal drag
          return Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 0.75;
        } else {
          // Back side: has ScrollView, capture only if horizontal movement is dominant
          return Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.1;
        }
      },
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderGrant: () => {},
      onPanResponderMove: (_, gestureState) => {
        translateX.setValue(gestureState.dx);
        if (gestureState.dx < -5) {
          setDragDirection('left');
        } else if (gestureState.dx > 5) {
          setDragDirection('right');
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx, vx } = gestureState;
        const SWIPE_THRESHOLD = 60;
        const VELOCITY_THRESHOLD = 0.3;

        if ((dx > SWIPE_THRESHOLD || (dx > 15 && vx > VELOCITY_THRESHOLD)) && onPrevPlayerRef.current) {
          Animated.timing(translateX, {
            toValue: width,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onPrevPlayerRef.current?.();
            translateX.setValue(0);
            setDragDirection('none');
          });
        } else if ((dx < -SWIPE_THRESHOLD || (dx < -15 && vx < -VELOCITY_THRESHOLD)) && onNextPlayerRef.current) {
          Animated.timing(translateX, {
            toValue: -width,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onNextPlayerRef.current?.();
            translateX.setValue(0);
            setDragDirection('none');
          });
        } else {
          Animated.timing(translateX, {
            toValue: 0,
            duration: 220,
            useNativeDriver: true,
          }).start(() => {
            setDragDirection('none');
          });
        }
      },
    })
  ).current;

  // 1. Find dynamic news headline & impact reaction
  const newsStory = useMemo(() => {
    if (!player) return null;
    const stories = usePlayerStore.getState().news || [];
    const playerCleanName = player.name.toLowerCase().trim();
    return stories.find((story) => {
      if (story.headline.toLowerCase().includes(playerCleanName) || (story.take && story.take.toLowerCase().includes(playerCleanName))) {
        return true;
      }
      if (story.playersAffected && story.playersAffected.some(p => p.name.toLowerCase().trim() === playerCleanName)) {
        return true;
      }
      return false;
    });
  }, [player]);

  const gameStats = useMemo(() => {
    if (!player) return [];
    return generateGameStats(player.name, player.position, year, player.projectedPoints || 100);
  }, [player, year]);

  // 2. High-fidelity season projections
  const seasonProjections = useMemo(() => {
    if (!player) return [];
    const pts = player.projectedPoints || 0;
    const ppg = (pts / 17).toFixed(1);
    
    if (player.position === 'QB') {
      const yds = Math.round(pts * 12.5);
      const tds = Math.round(pts * 0.085);
      const ints = Math.round(pts * 0.025);
      return [
        { label: 'PPG PROJ', value: `${ppg} PTS` },
        { label: 'PASS YDS', value: `${yds.toLocaleString()}` },
        { label: 'PASS TD', value: `${tds}` },
        { label: 'INT PROJ', value: `${ints}` },
      ];
    }
    if (player.position === 'RB') {
      const yds = Math.round(pts * 4.2 + 200);
      const tds = Math.round(pts * 0.038);
      const rec = Math.round(pts * 0.16);
      return [
        { label: 'PPG PROJ', value: `${ppg} PTS` },
        { label: 'RUSH YDS', value: `${yds.toLocaleString()}` },
        { label: 'RUSH TD', value: `${tds}` },
        { label: 'RECEPTIONS', value: `${rec}` },
      ];
    }
    if (player.position === 'WR') {
      const yds = Math.round(pts * 4.5 + 100);
      const tds = Math.round(pts * 0.032);
      const rec = Math.round(pts * 0.42);
      return [
        { label: 'PPG PROJ', value: `${ppg} PTS` },
        { label: 'REC YDS', value: `${yds.toLocaleString()}` },
        { label: 'REC TD', value: `${tds}` },
        { label: 'RECEPTIONS', value: `${rec}` },
      ];
    }
    if (player.position === 'TE') {
      const yds = Math.round(pts * 4.8);
      const tds = Math.round(pts * 0.042);
      const rec = Math.round(pts * 0.38);
      return [
        { label: 'PPG PROJ', value: `${ppg} PTS` },
        { label: 'REC YDS', value: `${yds.toLocaleString()}` },
        { label: 'REC TD', value: `${tds}` },
        { label: 'RECEPTIONS', value: `${rec}` },
      ];
    }
    return [
      { label: 'PPG PROJ', value: `${ppg} PTS` },
      { label: 'SEASON PTS', value: `${Math.round(pts)} PTS` },
      { label: 'BYE WEEK', value: `${player.bye}` },
    ];
  }, [player]);

  if (!player) return null;

  const rotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const handleCardFlip = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    const toValue = flipped ? 0 : 1;
    
    Animated.spring(flipAnim, {
      toValue,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      setFlipped(!flipped);
    }, 120);
  };

  const handleClose = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };
  const renderFrontCardContent = (p: Player) => {
    const { style, variant } = resolvePlayerCard(String(p.rank || p.name));
    const psaGrade = getPsaGrade(p.rank);
    const headerStats = getPlayerStatsForHeader(p.position, p.projectedPoints);

    // Map standard Player object to PlayerCardData shape for procedural engine
    const cardData: PlayerCardData = {
      id: String(p.rank || p.name),
      name: p.name,
      position: p.position as any,
      team: p.team,
      teamColors: teamColors[p.team] || ['#64748b', '#475569', '#FFCD00'],
      stats: seasonProjections.reduce((acc, stat) => {
        acc[stat.label] = stat.value;
        return acc;
      }, {} as Record<string, string | number>),
      imageUrl: p.espnId ? `https://a.espncdn.com/i/headshots/nfl/players/full/${p.espnId}.png` : undefined,
      is_rookie: p.is_rookie,
    };

    return (
      <View style={styles.frontWrapper}>
        {/* PSA Grade Slab Header - Layout v2 */}
        <View style={styles.psaLabelContainer}>
          <View style={styles.psaTwoColumnLayout}>
            {/* LEFT COLUMN */}
            <View style={styles.psaLeftColumn}>
              {/* Band 1 - Year tag */}
              <Text style={styles.psaYearTag} numberOfLines={1}>
                {`${year} ${style.name.toUpperCase()} ${variant.name.toUpperCase()}`}
              </Text>
              {/* Band 2 - Player name */}
              <Text style={styles.psaPlayerName} numberOfLines={1}>
                {p.name.toUpperCase()}
              </Text>
              {/* Band 3 - Player meta row */}
              <Text style={styles.psaMetaRow} numberOfLines={1}>
                {`${p.team} · ${p.posRank} · BYE ${p.bye}`}
              </Text>
              {/* Band 4 - Stat row */}
              <View style={styles.psaStatRow}>
                <View style={styles.psaStatCell}>
                  <Text style={styles.psaStatLabel}>PPG</Text>
                  <Text style={styles.psaStatValue}>{headerStats.ppg}</Text>
                </View>
                <View style={styles.psaStatCell}>
                  <Text style={styles.psaStatLabel}>YARDS</Text>
                  <Text style={styles.psaStatValue}>{headerStats.yards}</Text>
                </View>
                <View style={styles.psaStatCell}>
                  <Text style={styles.psaStatLabel}>TDS</Text>
                  <Text style={styles.psaStatValue}>{headerStats.tds}</Text>
                </View>
              </View>
            </View>

            {/* RIGHT COLUMN VERTICAL STACK */}
            <View style={styles.psaRightColumn}>
              {/* Stack Item 1 - ECR Score */}
              <View style={styles.psaEcrBox}>
                <Text style={styles.psaRightLabel}>ECR</Text>
                <Text style={styles.psaRightValue}>{p.rank}</Text>
              </View>
              {/* Stack Item 2 - ADP Score (Yellow Highlight) */}
              <View style={styles.psaAdpBox}>
                <Text style={styles.psaAdpLabel}>ADP</Text>
                <Text style={styles.psaAdpValue}>{p.adp}</Text>
              </View>
              {/* Stack Item 3 - PSA Grade */}
              <View style={styles.psaGradeBox}>
                <Text style={styles.psaGradeLabel}>{psaGrade.desc}</Text>
                <Text style={styles.psaGradeValue}>{psaGrade.num}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Unified Procedural Trading Card */}
        <ProceduralTradingCard player={cardData} width={279} />
      </View>
    );
  };

  const renderBackCardContent = () => {
    const psaGrade = getPsaGrade(player.rank);
    return (
      <View style={[styles.backCardContainer, { transform: [{ rotateY: '180deg' }] }]}>
        
        {/* Slab Header Backing */}
        <View style={styles.expandedPsaHeader}>
          <View style={styles.expandedPsaHeaderContent}>
            <View style={styles.expandedPsaHeaderLeft}>
              <Text style={styles.expandedPsaHeaderKicker}>{`${year} MOCK MAXXING CHROME`}</Text>
              <Text style={styles.expandedPsaHeaderTitle}>CERTIFIED PLAYER REPORT</Text>
              <Text style={styles.expandedPsaHeaderMeta}>
                ECR: #{player.rank} · BYE {player.bye} · {player.team}
              </Text>
            </View>
            <View style={styles.expandedPsaHeaderRight}>
              <Text style={styles.expandedPsaHeaderGradeDesc}>{psaGrade.desc}</Text>
              <Text style={styles.expandedPsaHeaderGradeNum}>{psaGrade.num}</Text>
            </View>
          </View>
          <View style={styles.expandedPsaBarcodeRow}>
            <Text style={styles.expandedPsaBarcode}>||||| | |||| | ||||| | ||| ||</Text>
            <Text style={styles.expandedPsaSerial}>#MX-{player.rank}-{player.name.slice(0, 2).toUpperCase()}</Text>
          </View>
        </View>

        {/* Scrollable details backing */}
        <ScrollView style={styles.expandedScrollArea} showsVerticalScrollIndicator={false}>
          
          {/* Season Projections Grid */}
          <View style={styles.expandedSection}>
            <Text style={styles.expandedSectionTitle}>SEASON PROJECTIONS</Text>
            <View style={styles.projGridBack}>
              {seasonProjections.map((stat, sIdx) => (
                <View key={sIdx} style={styles.projCellBack}>
                  <Text style={styles.projCellValBack}>{stat.value}</Text>
                  <Text style={styles.projCellLabelBack}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Expert outlook report */}
          <View style={styles.expandedSection}>
            <Text style={styles.expandedSectionTitle}>EXPERT IMPACT TELEMETRY</Text>
            {newsStory ? (
              <View style={styles.backInsightsCard}>
                <Text style={styles.backInsightsHeader}>{newsStory.headline.toUpperCase()}</Text>
                <Text style={styles.backInsightsText}>{newsStory.take}</Text>
              </View>
            ) : (
              <View style={styles.backInsightsCard}>
                <Text style={styles.backInsightsHeader}>ELITE POSITION STRATEGY FLOOR</Text>
                <Text style={styles.backInsightsText}>
                  {player.name} profiles as a high-efficiency {player.position} anchor targeting elite positional outcomes. Consensus ECR consensus models project a highly consistent season floor with heavy target volume in early offensive packages.
                </Text>
              </View>
            )}
          </View>

          {/* Game-by-Game Statistics */}
          <View style={styles.expandedSection}>
            <Text style={styles.expandedSectionTitle}>{year} WEEKLY BOX SCORES</Text>
            <View style={styles.statsTableContainer}>
              {/* Header */}
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeaderCell, { width: 35 }]}>WK</Text>
                <Text style={[styles.tableHeaderCell, { width: 50 }]}>OPP</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'right' }]}>PTS</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'right' }]}>
                  {player.position === 'K' ? 'FG' : player.position === 'DST' ? 'SCK' : 'YDS'}
                </Text>
                <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'right' }]}>
                  {player.position === 'K' ? 'XP' : player.position === 'DST' ? 'INT' : 'TD'}
                </Text>
                {['RB', 'WR', 'TE', 'QB', 'DST'].includes(player.position) && (
                  <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'right' }]}>
                    {player.position === 'QB' ? 'INT' : player.position === 'DST' ? 'TD' : 'REC'}
                  </Text>
                )}
              </View>

              {/* Rows */}
              {gameStats.map((game, gIdx) => {
                const isBye = game.opponent === 'BYE';
                return (
                  <View key={gIdx} style={[styles.tableBodyRow, isBye && styles.tableBodyRowBye, gIdx % 2 === 1 && { backgroundColor: 'rgba(12, 12, 12, 0.02)' }]}>
                    <Text style={[styles.tableBodyCell, styles.monoCell, { width: 35 }]}>{game.week}</Text>
                    <Text style={[styles.tableBodyCell, { width: 50, fontWeight: 'bold' }]}>{game.opponent}</Text>
                    <Text style={[styles.tableBodyCell, styles.monoCell, { flex: 1, textAlign: 'right', color: isBye ? '#94a3b8' : '#0c0c0c' }]}>
                      {isBye ? '-' : game.points.toFixed(1)}
                    </Text>
                    <Text style={[styles.tableBodyCell, styles.monoCell, { flex: 1, textAlign: 'right', color: isBye ? '#94a3b8' : '#0c0c0c' }]}>
                      {isBye ? '-' : game.yards}
                    </Text>
                    <Text style={[styles.tableBodyCell, styles.monoCell, { flex: 1, textAlign: 'right', color: isBye ? '#94a3b8' : '#0c0c0c' }]}>
                      {isBye ? '-' : game.touchdowns}
                    </Text>
                    {['RB', 'WR', 'TE', 'QB', 'DST'].includes(player.position) && (
                      <Text style={[styles.tableBodyCell, styles.monoCell, { flex: 1, textAlign: 'right', color: isBye ? '#94a3b8' : '#0c0c0c' }]}>
                        {isBye ? '-' : player.position === 'QB' ? (game.points >= 18 && game.week % 4 === 0 ? 1 : 0) : player.position === 'DST' ? game.receptions : game.receptions}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Strategic Action locked CTA */}
          <Pressable 
            style={({ pressed }) => [
              styles.actionBtnBack, 
              pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
            ]} 
            onPress={handleClose}
          >
            <Text style={styles.actionBtnTextBack}>DRAFT STRATEGY TARGET LOCKED</Text>
          </Pressable>

        </ScrollView>

        <View style={styles.flipPromptContainer}>
          <Text style={styles.flipPromptText}>TAP TO FLIP BACK</Text>
        </View>
      </View>
    );
  };

  const bottomPlayer = dragDirection === 'left' ? nextPlayer : dragDirection === 'right' ? prevPlayer : (nextPlayer || prevPlayer);

  const rotate = translateX.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ['-12deg', '0deg', '12deg'],
  });

  const bottomScale = translateX.interpolate({
    inputRange: [-width, 0, width],
    outputRange: [1, 0.92, 1],
    extrapolate: 'clamp',
  });

  const bottomOpacity = translateX.interpolate({
    inputRange: [-width, 0, width],
    outputRange: [1, 0.35, 1],
    extrapolate: 'clamp',
  });

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalCard} {...panResponder.panHandlers}>
        {/* Close button target */}
        <Pressable style={styles.closeBtn} onPress={handleClose}>
          <Text style={styles.closeBtnText}>✕</Text>
        </Pressable>

        {/* Centered Showcase Area */}
        <View style={styles.showcaseWrapper}>
          
          {/* Bottom Stack Card (Incoming Behind) */}
          {bottomPlayer && (
            <Animated.View style={[
              styles.cardContainer,
              styles.bottomCardStack,
              {
                transform: [{ scale: bottomScale }],
                opacity: bottomOpacity,
              }
            ]}>
              {renderFrontCardContent(bottomPlayer)}
            </Animated.View>
          )}

          {/* Top Card (Active Front) */}
          <Animated.View style={[
            styles.cardContainer,
            { transform: [{ translateX }, { rotate }] }
          ]}>
            <Pressable 
              onPress={handleCardFlip}
              style={styles.cardPressableArea}
            >
              <Animated.View style={[
                { flex: 1 },
                { transform: [{ rotateY }] }
              ]}>
                {flipped ? renderBackCardContent() : renderFrontCardContent(player)}
              </Animated.View>
            </Pressable>
          </Animated.View>

          <Text style={styles.tapPrompt}>TAP CARD TO FLIP</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalCard: {
    flex: 1,
    backgroundColor: '#F4F5F7', // Chalk White Canvas matching ranks base
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    right: 20,
    top: Platform.OS === 'ios' ? 20 : 12, // Sit higher up for easy access
    width: 44, // Larger tap target
    height: 44, // Larger tap target
    borderRadius: 22,
    backgroundColor: 'rgba(12, 12, 12, 0.08)', // Dark overlay contrast on white background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  closeBtnText: {
    color: '#0c0c0c', // Obsidian Black contrast text
    fontSize: 18, // Much larger and clearer X icon
    fontWeight: 'bold',
    fontFamily: Fonts.stats,
  },
  showcaseWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  showcaseTitle: {
    fontFamily: Fonts.headings,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FF5722', // Pylon Orange kicker
    letterSpacing: 2,
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  cardContainer: {
    width: 310,
    height: 550,
    backgroundColor: '#F8FAFC', // Frosted clear acrylic slab fill pop with opaque backing to prevent bleed-through
    borderRadius: 24,
    borderWidth: 9.5, // Thicker acrylic slab rim
    borderColor: 'rgba(100, 116, 139, 0.28)', // Slate-tinted frosted clear bezel for light contrast
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16, // Softer shadow on light background
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  bottomCardStack: {
    position: 'absolute',
    zIndex: -1,
  },
  cardPressableArea: {
    flex: 1,
  },
  tapPrompt: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: '#64748b', // Slate / Mid-Gray text
    letterSpacing: 1,
    marginTop: 20,
    fontWeight: 'bold',
  },

  // FRONT CARD WRAPPER
  frontWrapper: {
    flex: 1,
    padding: 6,
  },

  // PSA grading label style v2
  psaLabelContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 3.5,
    borderColor: '#D9261C', // Branded PSA Red
    borderRadius: 8,
    padding: 6,
    marginBottom: 6,
  },
  psaTwoColumnLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  psaLeftColumn: {
    flex: 1.1,
    justifyContent: 'space-between',
    paddingRight: 6,
  },
  psaRightColumn: {
    width: 76,
    gap: 3.5,
    alignItems: 'stretch',
  },
  psaYearTag: {
    fontFamily: Fonts.stats,
    fontSize: 7.5,
    fontWeight: 'bold',
    color: '#64748b',
    letterSpacing: 0.3,
  },
  psaPlayerName: {
    fontFamily: Fonts.headings,
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0c0c0c',
    marginVertical: 1,
  },
  psaMetaRow: {
    fontFamily: Fonts.stats,
    fontSize: 8,
    fontWeight: 'bold',
    color: '#475569',
  },
  psaStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderColor: '#cbd5e1',
    paddingTop: 2,
    marginTop: 3,
  },
  psaStatCell: {
    alignItems: 'center',
    flex: 1,
  },
  psaStatLabel: {
    fontFamily: Fonts.body,
    fontSize: 6.5,
    color: '#64748b',
    fontWeight: 'bold',
  },
  psaStatValue: {
    fontFamily: Fonts.stats,
    fontSize: 9,
    fontWeight: '900',
    color: '#0c0c0c',
  },
  // Right Column Stack Styles
  psaEcrBox: {
    borderWidth: 0.5,
    borderColor: '#cbd5e1',
    borderRadius: 3.5,
    paddingVertical: 1.5,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  psaRightLabel: {
    fontFamily: Fonts.body,
    fontSize: 6.5,
    color: '#64748b',
    fontWeight: 'bold',
  },
  psaRightValue: {
    fontFamily: Fonts.stats,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0c0c0c',
  },
  psaAdpBox: {
    borderWidth: 1.2,
    borderColor: '#0c0c0c',
    borderRadius: 3.5,
    paddingVertical: 2,
    alignItems: 'center',
    backgroundColor: '#FFCD00', // Highlight Yellow!
  },
  psaAdpLabel: {
    fontFamily: Fonts.body,
    fontSize: 7,
    color: '#0c0c0c',
    fontWeight: '900',
  },
  psaAdpValue: {
    fontFamily: Fonts.stats,
    fontSize: 12,
    fontWeight: '900',
    color: '#0c0c0c',
  },
  psaGradeBox: {
    borderWidth: 0.5,
    borderColor: '#cbd5e1',
    borderRadius: 3.5,
    paddingVertical: 1.5,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  psaGradeLabel: {
    fontFamily: Fonts.body,
    fontSize: 6,
    color: '#D9261C', // Red description text
    fontWeight: '900',
  },
  psaGradeValue: {
    fontFamily: Fonts.headings,
    fontSize: 10,
    fontWeight: '900',
    color: '#D9261C',
  },

  // Metallic Chrome card container
  chromeCardContainer: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1E293B',
  },
  chromeLightBeam: {
    position: 'absolute',
    top: -150,
    left: -75,
    width: 220,
    height: 600,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    transform: [{ rotate: '25deg' }],
  },
  verticalTeamContainer: {
    position: 'absolute',
    left: 6,
    top: 20,
    bottom: 20,
    justifyContent: 'center',
    zIndex: 5,
  },
  verticalTeamText: {
    fontFamily: Fonts.headings,
    fontSize: 19,
    fontWeight: '900',
    opacity: 0.25,
    textAlign: 'center',
    lineHeight: 21,
  },
  rookieBadgeContainer: {
    position: 'absolute',
    top: 6,
    left: 6,
    zIndex: 10,
  },
  rookieBadgeTextWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rookieBadgeText: {
    fontFamily: Fonts.headings,
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#0c0c0c',
  },
  toppsChromeLogoContainer: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 10,
    alignItems: 'flex-end',
  },
  toppsChromeLogoText: {
    fontFamily: 'Inter',
    fontSize: 8.5,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  toppsChromeSubText: {
    fontFamily: Fonts.headings,
    fontSize: 8,
    fontWeight: '900',
    color: '#FFCD00',
    letterSpacing: 0.2,
  },
  chromePlayerFrame: {
    width: '74%',
    height: '64%',
    alignSelf: 'center',
    marginTop: 20,
    borderWidth: 1.5,
    borderRadius: 80, // arched frame
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chromePlayerImage: {
    width: '100%',
    height: '100%',
  },
  autographContainer: {
    position: 'absolute',
    bottom: 34,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 12,
  },
  autographText: {
    fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : Platform.OS === 'web' ? 'Caveat' : 'cursive',
    fontSize: Platform.OS === 'ios' ? 28 : 22,
    fontWeight: 'bold',
    color: '#ffffff',
    transform: [{ rotate: '-6deg' }],
    opacity: 0.85,
  },
  autographSubText: {
    fontFamily: Fonts.body,
    fontSize: 6,
    color: 'rgba(255, 255, 255, 0.35)',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  foilStampContainer: {
    position: 'absolute',
    bottom: 34,
    right: 12,
    zIndex: 10,
  },
  foilStampText: {
    fontFamily: Fonts.stats,
    fontSize: 8,
    color: '#FFD700',
    fontWeight: 'bold',
    opacity: 0.8,
  },
  chromePlayerBottomBar: {
    position: 'absolute',
    bottom: 6,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 15,
    borderTopWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingTop: 4,
  },
  chromeBottomLeftNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chromeTeamMonogram: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chromeTeamMonogramText: {
    fontFamily: Fonts.headings,
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  chromeNameTextWrapper: {
    justifyContent: 'center',
  },
  chromePlayerFirstName: {
    fontFamily: Fonts.body,
    fontSize: 8,
    color: '#cbd5e1',
    fontWeight: 'bold',
  },
  chromePlayerLastName: {
    fontFamily: Fonts.headings,
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: -2,
  },
  chromePosBox: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
    backgroundColor: '#FFCD00',
  },
  chromePosText: {
    fontFamily: Fonts.stats,
    fontSize: 8.5,
    fontWeight: '900',
    color: '#000000',
  },

  // BACK CARD BACKING
  backCardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Clean white certified card back
    padding: 10,
    borderRadius: 14,
    overflow: 'hidden',
  },
  expandedPsaHeader: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(12, 12, 12, 0.08)', // Soft dark divider
    paddingBottom: 6,
    marginBottom: 8,
  },
  expandedPsaHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expandedPsaHeaderLeft: {
    flex: 1,
  },
  expandedPsaHeaderRight: {
    alignItems: 'flex-end',
  },
  expandedPsaHeaderKicker: {
    fontFamily: Fonts.stats,
    fontSize: 7.5,
    color: '#FF5722', // Pylon Orange kicker
  },
  expandedPsaHeaderTitle: {
    fontFamily: Fonts.headings,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0c0c0c', // Obsidian Black title
  },
  expandedPsaHeaderMeta: {
    fontFamily: Fonts.stats,
    fontSize: 7.5,
    color: '#475569', // Slate meta text
  },
  expandedPsaHeaderGradeDesc: {
    fontFamily: Fonts.headings,
    fontSize: 8.5,
    color: '#64748b',
    fontWeight: 'bold',
  },
  expandedPsaHeaderGradeNum: {
    fontFamily: Fonts.headings,
    fontSize: 16,
    fontWeight: '900',
    color: '#FFCD00',
  },
  expandedPsaBarcodeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  expandedPsaBarcode: {
    fontFamily: Fonts.stats,
    fontSize: 7.5,
    color: '#0c0c0c', // Obsidian Black barcode lines
  },
  expandedPsaSerial: {
    fontFamily: Fonts.stats,
    fontSize: 7.5,
    color: '#64748b',
  },

  expandedScrollArea: {
    flex: 1,
  },
  expandedSection: {
    marginBottom: 12,
  },
  expandedSectionTitle: {
    fontFamily: Fonts.headings,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FF5722',
    letterSpacing: 1,
    marginBottom: 6,
  },
  projGridBack: {
    flexDirection: 'row',
    gap: 6,
  },
  projCellBack: {
    flex: 1,
    backgroundColor: 'rgba(12, 12, 12, 0.03)', // Frosted dark cells
    borderColor: 'rgba(12, 12, 12, 0.07)', // Soft hairline borders
    borderWidth: 1,
    borderRadius: 6,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projCellValBack: {
    fontFamily: Fonts.stats,
    fontSize: 10.5,
    fontWeight: '900',
    color: '#0c0c0c', // Obsidian Black values
  },
  projCellLabelBack: {
    fontFamily: Fonts.stats,
    fontSize: 6,
    color: 'rgba(12, 12, 12, 0.45)', // Softer label text
    textAlign: 'center',
    marginTop: 1,
  },

  backInsightsCard: {
    backgroundColor: 'rgba(12, 12, 12, 0.02)', // Soft gray inner card
    borderColor: 'rgba(12, 12, 12, 0.05)',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  backInsightsHeader: {
    fontFamily: Fonts.headings,
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#0c0c0c', // Obsidian Black header
    marginBottom: 4,
  },
  backInsightsText: {
    fontFamily: Fonts.body,
    fontSize: 9.5,
    lineHeight: 14,
    color: '#475569', // Slate text
  },

  actionBtnBack: {
    backgroundColor: '#FF5722', // Pylon Orange action
    borderRadius: 8,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  actionBtnTextBack: {
    fontFamily: Fonts.headings,
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  flipPromptContainer: {
    borderTopWidth: 0.5,
    borderColor: 'rgba(12, 12, 12, 0.08)', // Soft dark divider
    paddingTop: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipPromptText: {
    fontFamily: Fonts.body,
    fontSize: 9,
    color: '#64748b',
    fontWeight: 'bold',
  },

  // RPA TEMPLATE STYLES
  rpaSerialContainer: {
    position: 'absolute',
    top: 8,
    right: 10,
    zIndex: 10,
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  rpaSerialText: {
    fontFamily: Fonts.stats,
    fontSize: 8.5,
    color: '#B45309',
    fontWeight: 'bold',
  },
  rpaHeaderBrand: {
    position: 'absolute',
    top: 8,
    alignSelf: 'center',
    zIndex: 10,
  },
  rpaBrandName: {
    fontFamily: Fonts.headings,
    fontSize: 9,
    color: '#64748b',
    letterSpacing: 2,
    fontWeight: '900',
  },
  rpaPlayerFrame: {
    width: 135,
    height: 160,
    position: 'absolute',
    right: 12,
    top: 65,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  rpaPlayerImage: {
    width: '100%',
    height: '100%',
  },
  jerseyPatchWindow: {
    width: 90,
    height: 90,
    position: 'absolute',
    left: 20,
    top: 85,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    overflow: 'hidden',
    backgroundColor: '#1E293B',
    // Shadow depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rpaAutographContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 12,
  },
  rpaAutographText: {
    fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : Platform.OS === 'web' ? 'Caveat' : 'cursive',
    fontSize: 25,
    fontWeight: 'bold',
    color: '#1D4ED8',
    transform: [{ rotate: '-4deg' }],
  },

  // KABOOM TEMPLATE STYLES
  kaboomTextContainer: {
    position: 'absolute',
    top: 8,
    alignSelf: 'center',
    zIndex: 10,
  },
  kaboomTextMain: {
    fontFamily: Fonts.headings,
    fontSize: 34,
    fontWeight: '900',
    color: '#FFCD00',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    letterSpacing: 0.5,
    transform: [{ rotate: '-6deg' }],
  },
  kaboomPlayerFrame: {
    width: 200,
    height: 200,
    position: 'absolute',
    alignSelf: 'center',
    top: 75,
    borderRadius: 100,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  kaboomPlayerImage: {
    width: '100%',
    height: '100%',
  },
  kaboomSignatureContainer: {
    position: 'absolute',
    bottom: 42,
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 12,
  },
  kaboomPlayerNameText: {
    fontFamily: Fonts.headings,
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  kaboomInsertLabel: {
    fontFamily: Fonts.body,
    fontSize: 7,
    color: '#FFCD00',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  // DOWNTOWN TEMPLATE STYLES
  downtownPlayerFrame: {
    width: 170,
    height: 180,
    position: 'absolute',
    alignSelf: 'center',
    top: 80,
    overflow: 'hidden',
    zIndex: 5,
  },
  downtownPlayerImage: {
    width: '100%',
    height: '100%',
  },
  downtownTitleContainer: {
    position: 'absolute',
    bottom: 45,
    alignSelf: 'center',
    zIndex: 12,
  },
  downtownTitleText: {
    fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : Platform.OS === 'web' ? 'Caveat' : 'cursive',
    fontSize: 32,
    color: '#047857',
    fontWeight: 'bold',
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statsTableContainer: {
    borderWidth: 1.5,
    borderColor: '#64748b',
    borderRadius: 12,
    backgroundColor: '#F4F5F7',
    overflow: 'hidden',
    marginTop: 12,
    marginBottom: 20,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#E8EAED',
    borderBottomWidth: 1.5,
    borderColor: '#64748b',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableHeaderCell: {
    fontFamily: Fonts.headings,
    fontSize: 11,
    color: '#475569',
    letterSpacing: 0.5,
  },
  tableBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(12, 12, 12, 0.05)',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tableBodyRowBye: {
    backgroundColor: 'rgba(12, 12, 12, 0.04)',
  },
  tableBodyCell: {
    fontSize: 12,
    color: '#0c0c0c',
  },
  monoCell: {
    fontFamily: Fonts.stats || 'monospace',
  },
});
