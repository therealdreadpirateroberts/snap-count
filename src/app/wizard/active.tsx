import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Pressable, 
  FlatList, 
  ScrollView, 
  Image, 
  Animated, 
  Dimensions,
  TextInput,
  Easing,
  PanResponder
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSnapStore, getTeamIndexForPick, getTeamNameForIndex } from '@/store/useSnapStore';
import { getTeamLogoUrl, Player } from '@/store/mockData';
import { Colors, Fonts, Spacing, MaxContentWidth } from '@/constants/theme';
import BackgroundTexture from '@/components/BackgroundTexture';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

// Map top player names to ESPN player IDs for premium headshots
const getPlayerHeadshotUrl = (name: string, position: string, team?: string) => {
  const cleanName = name.toLowerCase().replace(/['.-]/g, '').replace(/\s+/g, '').trim();
  
  if (position === 'DST' && team) {
    return getTeamLogoUrl(team);
  }

  const mapping: { [key: string]: string } = {
    // QBs
    'patrickmahomes': '3139477',
    'joshallen': '3918298',
    'lamarjackson': '3916387',
    'jalenhurts': '4040715',
    'cjstroud': '4432577',
    'joeburrow': '3915290',
    'anthonyrichardson': '4432573',
    'dakprescott': '2578570',
    'jordanlove': '4038941',
    'brockpurdy': '4361741',
    'kylermurray': '3917315',
    'calebwilliams': '4431611',
    'jaredgoff': '3122627',
    'tuatagovailoa': '4241479',
    'trevorlawrence': '4372247',
    'kirkcousins': '14880',
    'jaydendaniels': '4431612',
    'justinherbert': '4426303',

    // RBs
    'christianmccaffrey': '3117251',
    'breecehall': '4426361',
    'bijanrobinson': '4430807',
    'saquonbarkley': '3929630',
    'jonathantaylor': '4242335',
    'jahmyrgibbs': '4430737',
    'derrickhenry': '3043078',
    'kyrenwilliams': '4428800',
    'devonachane': '4430802',
    'travisetiennejr': '4239994',
    'isiahpacheco': '4361517',
    'jamescook': '4361420',
    'joshjacobs': '4047648',
    'alvinkamara': '3054850',
    'rachaadwhite': '4428340',
    'joemixon': '3116385',
    'kennethwalkeriii': '4426338',
    'davidmontgomery': '4035661',
    'jamesconner': '3045138',
    'dandreswift': '4259545',
    'zamirwhite': '4360310',
    'raheemmostert': '17458',
    'najeeharris': '4241457',
    'jaylenwarren': '4363066',
    'tonypollard': '3911229',
    'javontewilliams': '4426336',
    'brianrobinsonjr': '4241400',
    'jonathonbrooks': '4431527',
    'tychandler': '4241398',
    'devinsingletary': '4040774',
    'chubahubbard': '4241389',
    'gusedwards': '3046714',
    'zachcharbonnet': '4426348',
    'jeromeford': '4360216',
    'treybenson': '4431501',
    'ezekielelliott': '3051392',
    'blakecorum': '4426354',
    'ricodowdle': '4046554',

    // WRs
    'ceedeelamb': '4426377',
    'tyreekhill': '15818',
    'justinjefferson': '4262921',
    'jamarrchase': '4362629',
    'amonrastbrown': '4361370',
    'ajbrown': '4047646',
    'garrettwilson': '4426384',
    'pukanacua': '4403332',
    'marvinharrisonjr': '4432571',
    'davanteadams': '16800',
    'chrisolave': '4426390',
    'drakelondon': '4426387',
    'brandonaiyuk': '4241372',
    'mikeevans': '16737',
    'nicocollins': '4426372',
    'deebosamuelsr': '4047650',
    'deebosamuel': '4047650',
    'maliknabers': '4432242',
    'jaylenwaddle': '4361379',
    'dkmetcalf': '4047654',
    'djmoore': '3915416',
    'devontasmith': '4372074',
    'stefondiggs': '2976212',
    'cooperkupp': '2977599',
    'zayflowers': '4361738',
    'teehiggins': '4239993',
    'amaricooper': '2976499',
    'georgepickens': '4431615',
    'tankdell': '4372023',
    'terrymclaurin': '3121422',
    'christiankirk': '3895856',
    'chrisgodwin': '3116157',
    'keenanallen': '15804',
    'jaydenreed': '4361405',
    'calvinridley': '3925347',
    'rasheerice': '4428807',
    'romeodunze': '4432535',
    'diontaejohnson': '3915377',
    'hollywoodbrown': '4040726',
    'courtlandsutton': '3121424',
    'jaxonsmithnjigba': '4430869',
    'laddmcconkey': '4432738',
    'brianthomasjr': '4432179',
    'keoncoleman': '4432585',
    'xavierworthy': '4431614',
    'curtissamuel': '3116155',
    'tylerlockett': '2578384',
    'jakobimeyers': '4038965',
    'romeodoubs': '4361376',

    // TEs
    'samlaporta': '4430856',
    'traviskelce': '15847',
    'treymcbride': '4430752',
    'markandrews': '3116162',
    'daltonkincaid': '4372087',
    'georgekittle': '3041344',
    'kylepitts': '4361369',
    'evanengram': '3116154',
    'jakeferguson': '4242493',
    'davidnjoku': '3123075',
    'brockbowers': '4432569',
    'dallasgoedert': '3121545',
    'patfreiermuth': '4361551',
    'taysomhill': '2974858',
    'colekmet': '4242540',
    'hunterhenry': '3045136',

    // Kickers
    'brandonaubrey': '4682498',
    'harrisonbutker': '3054840',
    'justintucker': '15683',
    'kaimifairbairn': '2971383',
    'jakeelliott': '3051390',
    'younghoekoo': '2985659',
    'jasonsanders': '3917300',
    'evanmcpherson': '4240030',
  };

  const id = mapping[cleanName];
  if (id) {
    return `https://a.espncdn.com/i/headshots/nfl/players/full/${id}.png`;
  }
  return `https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/default.png&w=350&h=254`;
};

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

// Calculate pick number inside cell grid
const getPickNumberForCell = (round: number, teamIdx: number, leagueSize: number, draftType: 'Snake' | 'Linear') => {
  if (draftType === 'Snake' && round % 2 === 0) {
    return (round - 1) * leagueSize + (leagueSize - 1 - teamIdx) + 1;
  }
  return (round - 1) * leagueSize + teamIdx + 1;
};

export default function ActiveDraftScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Store state
  const setup = useSnapStore((state) => state.setup);
  const players = useSnapStore((state) => state.players);
  const draftStatus = useSnapStore((state) => state.draftStatus);
  const currentPick = useSnapStore((state) => state.currentPick);
  const draftHistory = useSnapStore((state) => state.draftHistory);
  const cpuIsThinking = useSnapStore((state) => state.cpuIsThinking);
  const thinkingCpuName = useSnapStore((state) => state.thinkingCpuName);
  
  // Store actions
  const draftPlayer = useSnapStore((state) => state.draftPlayer);
  const simulateCpuTurn = useSnapStore((state) => state.simulateCpuTurn);
  const getSuggestedPicks = useSnapStore((state) => state.getSuggestedPicks);
  const resetDraft = useSnapStore((state) => state.resetDraft);

  // Local UI State
  const [boardViewMode, setBoardViewMode] = useState<'round' | 'roster'>('round');
  const [activeTab, setActiveTab] = useState<'suggested' | 'rankings' | 'queue' | 'roster'>('suggested');
  const [searchQuery, setSearchQuery] = useState('');
  const [posFilter, setPosFilter] = useState<'ALL' | 'QB' | 'RB' | 'WR' | 'TE' | 'DST' | 'K'>('ALL');
  const [sheetMode, setSheetMode] = useState<'collapsed' | 'full'>('collapsed');
  const [starredIds, setStarredIds] = useState<number[]>([]);
  const [isZoomedOut, setIsZoomedOut] = useState(false);

  // Animated values
  const sheetHeightAnim = useRef(new Animated.Value(200)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // ScrollView references for horizontal auto-scrolling
  const horizontalBoardScroll = useRef<ScrollView>(null);

  // Determine active turn math
  const activeTeamIdx = useMemo(() => {
    return getTeamIndexForPick(currentPick, setup.leagueSize, setup.draftType);
  }, [currentPick, setup]);

  const isUserTurn = useMemo(() => {
    return activeTeamIdx === setup.userPosition - 1;
  }, [activeTeamIdx, setup]);

  // Roster categories for user's team
  const userRoster = useMemo(() => {
    return players.filter(p => p.draftedBy === 'Your Team');
  }, [players]);

  // Dynamic starter counts
  const starterCounts = useMemo(() => {
    const qbs = userRoster.filter(p => p.position === 'QB').length;
    const rbs = userRoster.filter(p => p.position === 'RB').length;
    const wrs = userRoster.filter(p => p.position === 'WR').length;
    const tes = userRoster.filter(p => p.position === 'TE').length;
    const dst = userRoster.filter(p => p.position === 'DST').length;
    const ks = userRoster.filter(p => p.position === 'K').length;
    
    // FLX is any extra RB/WR/TE beyond core starters
    const extraRbs = Math.max(0, rbs - 2);
    const extraWrs = Math.max(0, wrs - 3);
    const extraTes = Math.max(0, tes - 1);
    const flx = Math.min(1, extraRbs + extraWrs + extraTes);

    return {
      ALL: userRoster.length,
      QB: qbs,
      RB: rbs,
      WR: wrs,
      TE: tes,
      FLX: flx,
      DST: dst,
      K: ks
    };
  }, [userRoster]);

  // Suggested players
  const suggestedPlayers = useMemo(() => {
    // Get all available players that fit basic roster needs
    const userRoster = players.filter(p => p.draftedBy === 'Your Team');
    const qbCount = userRoster.filter(p => p.position === 'QB').length;
    const teCount = userRoster.filter(p => p.position === 'TE').length;
    const kCount = userRoster.filter(p => p.position === 'K').length;
    const dstCount = userRoster.filter(p => p.position === 'DST').length;

    const available = players.filter(p => !p.draftedBy);
    
    const candidates = available.filter(player => {
      if (player.position === 'QB' && qbCount >= 2) return false;
      if (player.position === 'TE' && teCount >= 2) return false;
      if (player.position === 'K' && kCount >= 1) return false;
      if (player.position === 'DST' && dstCount >= 1) return false;
      
      const currentRound = Math.ceil(currentPick / setup.leagueSize);
      if ((player.position === 'K' || player.position === 'DST') && currentRound < (setup.rounds - 2)) {
        return false;
      }
      return true;
    });

    // Apply the position filter (if not 'ALL')
    const filteredCandidates = posFilter === 'ALL' 
      ? candidates 
      : candidates.filter(p => p.position === posFilter);

    // Apply search query filter if present
    const searchedCandidates = searchQuery.trim() !== ''
      ? filteredCandidates.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                       p.team.toLowerCase().includes(searchQuery.toLowerCase()))
      : filteredCandidates;

    // Return the top 6 suggestions of this position
    return searchedCandidates.slice(0, 6);
  }, [players, currentPick, posFilter, searchQuery, setup]);

  // Filtered available list for Rankings tab
  const filteredRankings = useMemo(() => {
    return players
      .filter(p => !p.draftedBy)
      .filter(p => posFilter === 'ALL' || p.position === posFilter)
      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                   p.team.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [players, posFilter, searchQuery]);

  // Toggle favorite / queue
  const toggleStar = (rank: number) => {
    if (starredIds.includes(rank)) {
      setStarredIds(starredIds.filter(id => id !== rank));
    } else {
      setStarredIds([...starredIds, rank]);
    }
  };

  const queuedPlayers = useMemo(() => {
    return players
      .filter(p => !p.draftedBy)
      .filter(p => starredIds.includes(p.rank))
      .filter(p => posFilter === 'ALL' || p.position === posFilter)
      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                   p.team.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [players, starredIds, posFilter, searchQuery]);

  const filteredUserRoster = useMemo(() => {
    return userRoster
      .filter(p => posFilter === 'ALL' || p.position === posFilter)
      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                   p.team.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [userRoster, posFilter, searchQuery]);

  // Dynamic cell dimensions depending on zoom level
  const cellWidth = useMemo(() => {
    if (isZoomedOut) {
      return Math.max(45, (SCREEN_WIDTH - 24) / setup.leagueSize);
    }
    return 125;
  }, [isZoomedOut, setup.leagueSize]);

  const cellHeight = isZoomedOut ? 48 : 72;

  // Bottom Sheet Swipe Dragging (PanResponder) Setup
  const lastSheetHeight = useRef(200);
  const gestureStartHeight = useRef(200);

  useEffect(() => {
    const listener = sheetHeightAnim.addListener(({ value }) => {
      lastSheetHeight.current = value;
    });
    return () => {
      sheetHeightAnim.removeListener(listener);
    };
  }, [sheetHeightAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        sheetHeightAnim.stopAnimation();
        gestureStartHeight.current = lastSheetHeight.current;
      },
      onPanResponderMove: (_, gestureState) => {
        const newHeight = gestureStartHeight.current - gestureState.dy;
        const minHeight = isUserTurn ? 300 : 160;
        const maxHeight = SCREEN_HEIGHT * 0.95;
        if (newHeight >= minHeight && newHeight <= maxHeight) {
          sheetHeightAnim.setValue(newHeight);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const currentHeight = gestureStartHeight.current - gestureState.dy;
        const collapsedHeight = isUserTurn ? 340 : 180;
        const fullHeight = SCREEN_HEIGHT * 0.92;

        let targetHeight = collapsedHeight;
        let targetMode: 'collapsed' | 'full' = 'collapsed';

        // Direct snap behavior: swipe up goes to full height, swipe down goes to collapsed height.
        // For static releases, compare distance to the midpoint.
        if (gestureState.vy < -0.3) {
          targetHeight = fullHeight;
          targetMode = 'full';
        } else if (gestureState.vy > 0.3) {
          targetHeight = collapsedHeight;
          targetMode = 'collapsed';
        } else {
          const midpoint = (collapsedHeight + fullHeight) / 2;
          if (currentHeight > midpoint) {
            targetHeight = fullHeight;
            targetMode = 'full';
          } else {
            targetHeight = collapsedHeight;
            targetMode = 'collapsed';
          }
        }

        setSheetMode(targetMode);

        Animated.spring(sheetHeightAnim, {
          toValue: targetHeight,
          useNativeDriver: false,
          friction: 8,
          tension: 40,
        }).start();
      }
    })
  ).current;

  // 1. CPU Simulation Trigger
  useEffect(() => {
    if (draftStatus === 'drafting' && !isUserTurn) {
      simulateCpuTurn(() => {
        // When CPU turn ends and user is back on the clock, open the sheet fully to draft
        setSheetMode('full');
      });
    }
  }, [currentPick, isUserTurn, draftStatus]);

  // 2. Summary Redirection Trigger
  useEffect(() => {
    if (draftStatus === 'summary') {
      router.replace('/wizard/summary');
    }
  }, [draftStatus]);

  // 2.5 Auto-expand to full sheet when it is the user's pick
  useEffect(() => {
    if (draftStatus === 'drafting' && isUserTurn) {
      setSheetMode('full');
    }
  }, [isUserTurn, draftStatus]);

  // 3. Pulse animation for active pick indicators
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // 4. Auto scroll horizontal board to keep active pick column visible
  useEffect(() => {
    if (horizontalBoardScroll.current && !isZoomedOut) {
      const colWidth = 125;
      const targetOffset = activeTeamIdx * colWidth - 80;
      setTimeout(() => {
        horizontalBoardScroll.current?.scrollTo({
          x: Math.max(0, targetOffset),
          animated: true,
        });
      }, 100);
    } else if (horizontalBoardScroll.current && isZoomedOut) {
      setTimeout(() => {
        horizontalBoardScroll.current?.scrollTo({
          x: 0,
          animated: true,
        });
      }, 100);
    }
  }, [currentPick, activeTeamIdx, isZoomedOut]);

  // 5. Bottom sheet height animations
  useEffect(() => {
    let targetHeight = 180;
    if (sheetMode === 'collapsed') {
      targetHeight = isUserTurn ? 340 : 180;
    } else {
      targetHeight = SCREEN_HEIGHT * 0.92;
    }

    if (Math.abs(lastSheetHeight.current - targetHeight) > 10) {
      Animated.spring(sheetHeightAnim, {
        toValue: targetHeight,
        useNativeDriver: false,
        friction: 8,
        tension: 40,
      }).start();
    }
  }, [sheetMode, isUserTurn]);

  const handleHandleTap = () => {
    if (sheetMode === 'collapsed') {
      setSheetMode('full');
    } else {
      setSheetMode('collapsed');
    }
  };

  const handleDraft = (player: Player) => {
    draftPlayer(player.rank, activeTeamIdx, 'Your Team');
    setStarredIds(starredIds.filter(id => id !== player.rank));
    setSearchQuery('');
    setSheetMode('collapsed');
  };

  const handleExit = () => {
    resetDraft();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <BackgroundTexture />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        
        {/* TOP STATUS BAR */}
        <View style={styles.topBar}>
          <Pressable style={styles.exitBtn} onPress={handleExit}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path d="M15 19L8 12L15 5" stroke="#f87171" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.exitBtnText}>EXIT</Text>
          </Pressable>
          <View style={styles.headerDetails}>
            <Text style={styles.headerTitle}>Round {Math.ceil(currentPick / setup.leagueSize)} of {setup.rounds}</Text>
            <Text style={styles.headerSub}>Pick {currentPick} ({(currentPick % setup.leagueSize) || setup.leagueSize} overall)</Text>
          </View>
          <View style={styles.topRightControls}>
            {boardViewMode === 'round' && (
              <Pressable 
                style={[styles.zoomToggleBtn, isZoomedOut && styles.zoomToggleBtnActive]} 
                onPress={() => setIsZoomedOut(!isZoomedOut)}
              >
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Circle cx={11} cy={11} r={6} stroke={isZoomedOut ? Colors.hofYellow : '#94a3b8'} strokeWidth={2} />
                  <Path d="M20 20L16 16" stroke={isZoomedOut ? Colors.hofYellow : '#94a3b8'} strokeWidth={2} strokeLinecap="round" />
                  {isZoomedOut ? (
                    <Path d="M9 11H13M11 9V13" stroke={Colors.hofYellow} strokeWidth={2} strokeLinecap="round" />
                  ) : (
                    <Path d="M9 11H13" stroke="#94a3b8" strokeWidth={2} strokeLinecap="round" />
                  )}
                </Svg>
              </Pressable>
            )}
            <View style={styles.modeToggle}>
              <Pressable 
                style={[styles.modeBtn, boardViewMode === 'round' && styles.modeBtnActive]} 
                onPress={() => setBoardViewMode('round')}
              >
                <Text style={[styles.modeBtnText, boardViewMode === 'round' && styles.modeBtnTextActive]}>By Round</Text>
              </Pressable>
              <Pressable 
                style={[styles.modeBtn, boardViewMode === 'roster' && styles.modeBtnActive]} 
                onPress={() => setBoardViewMode('roster')}
              >
                <Text style={[styles.modeBtnText, boardViewMode === 'roster' && styles.modeBtnTextActive]}>By Roster</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* MAIN BOARD SECTION */}
        <Animated.View style={[styles.boardContainer, { marginBottom: sheetHeightAnim }]}>
          
          {boardViewMode === 'round' ? (
            /* BY ROUND: HORIZONTAL SCROLLABLE GRID MATRIX */
            <ScrollView ref={horizontalBoardScroll} horizontal showsHorizontalScrollIndicator={false} bounces={false}>
              <View style={styles.grid}>
                
                {/* Columns Header (Teams) */}
                <View style={styles.gridHeaderRow}>
                  {Array.from({ length: setup.leagueSize }).map((_, teamIdx) => {
                    const name = getTeamNameForIndex(teamIdx, setup.userPosition);
                    const isUser = teamIdx === setup.userPosition - 1;
                    return (
                      <View 
                        key={teamIdx} 
                        style={[
                          styles.gridHeaderCell, 
                          isUser && styles.gridHeaderCellUser, 
                          { width: cellWidth }
                        ]}
                      >
                        <Text style={[
                          isZoomedOut ? styles.gridHeaderCellLabelCompact : styles.gridHeaderCellLabel, 
                          isUser && styles.gridHeaderCellLabelUser
                        ]} numberOfLines={1}>
                          {isUser ? (isZoomedOut ? "YOU" : "YOUR TEAM") : (isZoomedOut ? name.substring(0, 3).toUpperCase() : name.toUpperCase())}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                {/* Rows Grid (Rounds) */}
                <ScrollView contentContainerStyle={styles.gridRowsScroll} showsVerticalScrollIndicator={false}>
                  {Array.from({ length: setup.rounds }).map((_, roundIdx) => {
                    const round = roundIdx + 1;
                    return (
                      <View key={round} style={styles.gridRow}>
                        {Array.from({ length: setup.leagueSize }).map((_, teamIdx) => {
                          const pickNum = getPickNumberForCell(round, teamIdx, setup.leagueSize, setup.draftType);
                          const isCurrent = pickNum === currentPick;
                          const historyEntry = draftHistory.find(h => h.pickNumber === pickNum);
                          const player = historyEntry ? historyEntry.player : null;
                          const isUser = teamIdx === setup.userPosition - 1;

                          return (
                            <View 
                              key={teamIdx} 
                              style={[
                                styles.gridCell,
                                isCurrent && styles.gridCellCurrent,
                                isUser && styles.gridCellUser,
                                { width: cellWidth, height: cellHeight },
                                player && isZoomedOut && { backgroundColor: Colors.positions[player.position] }
                              ]}
                            >
                              {player ? (
                                isZoomedOut ? (
                                  /* COMPACT ZOOMED OUT VIEW */
                                  <View style={[
                                    styles.gridPlayerBlockCompact, 
                                    { borderLeftWidth: 0 }
                                  ]}>
                                    <Text style={[styles.gridPlayerNameCompact, { color: '#09090b' }]} numberOfLines={1}>
                                      {player.name.split(' ').pop()}
                                    </Text>
                                    <Text style={[styles.gridPlayerSubCompact, { color: 'rgba(9, 9, 11, 0.75)' }]} numberOfLines={1}>
                                      {player.position}·{player.team}
                                    </Text>
                                  </View>
                                ) : (
                                  /* STANDARD DRAFTED VIEW */
                                  <View style={[styles.gridPlayerBlock, { borderLeftColor: Colors.positions[player.position] }]}>
                                    <Image source={{ uri: getPlayerHeadshotUrl(player.name, player.position, player.team) }} style={styles.gridHeadshot} />
                                    <View style={styles.gridPlayerDetails}>
                                      <Text style={styles.gridPlayerName} numberOfLines={1}>
                                        {getDisplayName(player.name)}
                                      </Text>
                                      <Text style={styles.gridPlayerSub}>{player.position} · {player.team}</Text>
                                    </View>
                                    <Text style={styles.gridCellPickIndicator}>{round}.{String(teamIdx + 1).padStart(2, '0')}</Text>
                                  </View>
                                )
                              ) : (
                                <View style={styles.gridEmptyBlock}>
                                  {isCurrent ? (
                                    isZoomedOut ? (
                                      /* COMPACT ON-CLOCK VIEW */
                                      <Animated.View style={[
                                        styles.onClockPulseCompact,
                                        isUser ? styles.onClockPulseUserCompact : styles.onClockPulseCpuCompact,
                                        { transform: [{ scale: pulseAnim }] }
                                      ]}>
                                        <Text style={styles.onClockTextCompact}>{isUser ? "YOU" : "CPU"}</Text>
                                      </Animated.View>
                                    ) : (
                                      /* STANDARD ON-CLOCK VIEW */
                                      <Animated.View style={[
                                        styles.onClockPulse, 
                                        isUser ? styles.onClockPulseUser : styles.onClockPulseCpu,
                                        { transform: [{ scale: pulseAnim }] }
                                      ]}>
                                        <Text style={[styles.onClockText, isUser && { color: Colors.hofYellow }]}>{isUser ? "YOUR PICK!" : "PICKING..."}</Text>
                                        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" style={styles.clockIcon}>
                                          <Circle cx={12} cy={12} r={9} stroke={isUser ? Colors.hofYellow : "#60a5fa"} strokeWidth={2.5} />
                                          <Path d="M12 7V12L15 14" stroke={isUser ? Colors.hofYellow : "#60a5fa"} strokeWidth={2.5} />
                                        </Svg>
                                      </Animated.View>
                                    )
                                  ) : (
                                    <Text style={isZoomedOut ? styles.gridEmptyPickTextCompact : styles.gridEmptyPickText}>
                                      {round}.{String(teamIdx + 1).padStart(2, '0')}
                                    </Text>
                                  )}
                                </View>
                              )}
                            </View>
                          );
                        })}
                      </View>
                    );
                  })}
                </ScrollView>

              </View>
            </ScrollView>
          ) : (
            /* BY ROSTER: VERTICAL ROSTER SUMMARY LIST */
            <ScrollView contentContainerStyle={styles.rostersList} showsVerticalScrollIndicator={false}>
              {Array.from({ length: setup.leagueSize }).map((_, teamIdx) => {
                const name = getTeamNameForIndex(teamIdx, setup.userPosition);
                const isUser = teamIdx === setup.userPosition - 1;
                const rosterPicks = draftHistory.filter(h => h.teamIndex === teamIdx);

                return (
                  <View key={teamIdx} style={[styles.rosterCard, isUser && styles.rosterCardUser]}>
                    <Text style={[styles.rosterCardTitle, isUser && styles.rosterCardTitleUser]}>
                      {isUser ? "YOUR TEAM" : name.toUpperCase()}
                    </Text>
                    <View style={styles.rosterCardGrid}>
                      {rosterPicks.map((pick) => (
                        <View key={pick.pickNumber} style={styles.rosterCardPick}>
                          <Text style={[styles.rosterPickNum, { color: Colors.positions[pick.player.position] }]}>
                            {pick.round} · {pick.player.position}
                          </Text>
                          <Text style={styles.rosterPickName} numberOfLines={1}>{pick.player.name}</Text>
                        </View>
                      ))}
                      {rosterPicks.length === 0 && (
                        <Text style={styles.rosterCardEmpty}>No picks yet.</Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}

        </Animated.View>

        {/* BOTTOM SHEET WIDGET (Sleeper style) */}
        <Animated.View style={[
          styles.sheet,
          { 
            height: sheetHeightAnim, 
            paddingBottom: insets.bottom + Spacing.two 
          }
        ]}>
          
          {/* Drag Handle Area */}
          <View {...panResponder.panHandlers} style={styles.dragHandleContainer}>
            <Pressable onPress={handleHandleTap} style={styles.dragHandleHitbox}>
              <View style={styles.dragHandle} />
            </Pressable>
          </View>

          {/* ON THE CLOCK HEADER */}
          <View {...panResponder.panHandlers} style={styles.sheetHeader}>
            <View style={styles.clockRow}>
              {isUserTurn ? (
                <View style={styles.userClockWrapper}>
                  <Text style={styles.userClockText}>Your Pick</Text>
                  <Animated.View style={[styles.userPulseDot, { transform: [{ scale: pulseAnim }] }]} />
                </View>
              ) : (
                <View style={styles.cpuClockWrapper}>
                  <Text style={styles.cpuClockText}>{thinkingCpuName || 'CPU'} is picking</Text>
                  <Animated.View style={[styles.cpuPulseDot, { transform: [{ scale: pulseAnim }] }]} />
                </View>
              )}
              <Text style={styles.sheetOverallPick}>Pick {currentPick} (Round {Math.ceil(currentPick / setup.leagueSize)})</Text>
            </View>
          </View>

          {/* COLLAPSED SUGGESTIONS CONTAINER (SHOW TOP 5 PICKS) */}
          {sheetMode === 'collapsed' && isUserTurn && suggestedPlayers.length > 0 && (
            <View style={styles.collapsedSuggestionsContainer}>
              {suggestedPlayers.slice(0, 5).map((player, idx) => {
                const isStarred = starredIds.includes(player.rank);
                const expertPercent = idx === 0 ? '86%' : idx === 1 ? '14%' : '0%';
                return (
                  <View key={player.rank} style={styles.suggestedItem}>
                    <Image source={{ uri: getPlayerHeadshotUrl(player.name, player.position, player.team) }} style={styles.suggestedHeadshot} />
                    <View style={styles.suggestedInfo}>
                      <View style={styles.suggestedHeaderRow}>
                        <Text style={styles.suggestedName} numberOfLines={1}>{player.name}</Text>
                        <View style={[styles.posBadge, { borderColor: Colors.positions[player.position] }]}>
                          <Text style={[styles.posBadgeText, { color: Colors.positions[player.position] }]}>{player.posRank}</Text>
                        </View>
                      </View>
                      <Text style={styles.suggestedSub}>{player.team} · Bye {player.bye} · ECR {player.rank}</Text>
                    </View>
                    
                    <View style={styles.suggestedActions}>
                      <View style={styles.expertCol}>
                        <Text style={styles.expertVal}>{expertPercent}</Text>
                        <Text style={styles.expertLbl}>Experts</Text>
                      </View>
                      <Pressable style={styles.starBtn} onPress={() => toggleStar(player.rank)}>
                        <Svg width={16} height={16} viewBox="0 0 24 24" fill={isStarred ? "#fbbf24" : "none"}>
                          <Path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2L9.19 8.62L2 9.24L7.46 13.97L5.82 21L12 17.27Z" stroke={isStarred ? "#fbbf24" : "#94a3b8"} strokeWidth={2} />
                        </Svg>
                      </Pressable>
                      <Pressable 
                        style={[styles.draftBtn, !isUserTurn && styles.draftBtnDisabled]} 
                        disabled={!isUserTurn}
                        onPress={() => handleDraft(player)}
                      >
                        <Text style={styles.draftBtnText}>Draft</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* EXPANDED VIEW: TABS & CONTENT */}
          {sheetMode !== 'collapsed' && (
            <View style={styles.expandedWrapper}>
              
              {/* TAB ROW */}
              <View style={styles.tabsRow}>
                {[
                  { id: 'suggested', label: 'Suggested' },
                  { id: 'rankings', label: 'Rankings' },
                  { id: 'queue', label: `Queue (${queuedPlayers.length})` },
                  { id: 'roster', label: `My Team` }
                ].map((t) => {
                  const active = activeTab === t.id;
                  return (
                    <Pressable key={t.id} style={[styles.tabBtn, active && styles.tabBtnActive]} onPress={() => setActiveTab(t.id as any)}>
                      <Text style={[styles.tabBtnText, active && styles.tabBtnTextActive]}>{t.label}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* PERSISTENT SEARCH & POSITION FILTER BLOCK */}
              <View style={styles.searchBlock}>
                <TextInput
                  style={styles.sheetSearchInput}
                  placeholder={`Search ${activeTab === 'suggested' ? 'suggestions' : activeTab === 'queue' ? 'queue' : activeTab === 'roster' ? 'roster' : 'players'}...`}
                  placeholderTextColor="#64748b"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCorrect={false}
                  autoCapitalize="none"
                />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.posChipsScroll}>
                  {(['ALL', 'QB', 'RB', 'WR', 'TE', 'K', 'DST'] as const).map((filter) => {
                    const active = posFilter === filter;
                    return (
                      <Pressable 
                        key={filter} 
                        style={[styles.posChip, active && styles.posChipActive]} 
                        onPress={() => setPosFilter(filter)}
                      >
                        <Text style={[styles.posChipText, active && styles.posChipTextActive]}>{filter}</Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              {/* TAB CONTENTS */}
              <View style={styles.sheetListContent}>
                
                {/* SUGGESTED TAB */}
                {activeTab === 'suggested' && (
                  <ScrollView contentContainerStyle={styles.expandedListScroll} showsVerticalScrollIndicator={false}>
                    {suggestedPlayers.map((player, idx) => {
                      const isStarred = starredIds.includes(player.rank);
                      const expertPercent = idx === 0 ? '86%' : idx === 1 ? '14%' : '0%';
                      return (
                        <View key={player.rank} style={styles.suggestedItem}>
                          <Image source={{ uri: getPlayerHeadshotUrl(player.name, player.position, player.team) }} style={styles.suggestedHeadshot} />
                          <View style={styles.suggestedInfo}>
                            <View style={styles.suggestedHeaderRow}>
                              <Text style={styles.suggestedName} numberOfLines={1}>{player.name}</Text>
                              <View style={[styles.posBadge, { borderColor: Colors.positions[player.position] }]}>
                                <Text style={[styles.posBadgeText, { color: Colors.positions[player.position] }]}>{player.posRank}</Text>
                              </View>
                            </View>
                            <Text style={styles.suggestedSub}>{player.team} · Bye {player.bye} · ECR {player.rank}</Text>
                          </View>
                          
                          <View style={styles.suggestedActions}>
                            <View style={styles.expertCol}>
                              <Text style={styles.expertVal}>{expertPercent}</Text>
                              <Text style={styles.expertLbl}>Experts</Text>
                            </View>
                            <Pressable style={styles.starBtn} onPress={() => toggleStar(player.rank)}>
                              <Svg width={16} height={16} viewBox="0 0 24 24" fill={isStarred ? "#fbbf24" : "none"}>
                                <Path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2L9.19 8.62L2 9.24L7.46 13.97L5.82 21L12 17.27Z" stroke={isStarred ? "#fbbf24" : "#94a3b8"} strokeWidth={2} />
                              </Svg>
                            </Pressable>
                            <Pressable 
                              style={[styles.draftBtn, !isUserTurn && styles.draftBtnDisabled]} 
                              disabled={!isUserTurn}
                              onPress={() => handleDraft(player)}
                            >
                              <Text style={styles.draftBtnText}>Draft</Text>
                            </Pressable>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                )}

                {/* RANKINGS TAB (WITH TIERS) */}
                {activeTab === 'rankings' && (
                  <ScrollView contentContainerStyle={styles.expandedListScroll} showsVerticalScrollIndicator={false}>
                    {filteredRankings.map((player) => {
                      const isStarred = starredIds.includes(player.rank);
                      
                      // Inject Tier Headings based on Rank
                      const showTierHeader = player.rank === 1 || player.rank === 6 || player.rank === 16 || player.rank === 31 || player.rank === 51;
                      let tierLabel = '';
                      let tierColor = '#ef4444'; // Red
                      if (player.rank === 1) { tierLabel = 'TIER 1'; tierColor = '#ef4444'; }
                      else if (player.rank === 6) { tierLabel = 'TIER 2'; tierColor = '#fbbf24'; }
                      else if (player.rank === 16) { tierLabel = 'TIER 3'; tierColor = '#fb923c'; }
                      else if (player.rank === 31) { tierLabel = 'TIER 4'; tierColor = '#60a5fa'; }
                      else if (player.rank === 51) { tierLabel = 'TIER 5'; tierColor = '#4ade80'; }

                      return (
                        <View key={player.rank}>
                          {showTierHeader && (
                            <View style={[styles.tierHeader, { borderBottomColor: tierColor }]}>
                              <Text style={[styles.tierHeaderText, { color: tierColor }]}>{tierLabel}</Text>
                            </View>
                          )}
                          <View style={styles.rankingsRowItem}>
                            <Text style={styles.rankingsRowRank}>{player.rank}</Text>
                            <Image source={{ uri: getPlayerHeadshotUrl(player.name, player.position, player.team) }} style={styles.rankingsRowHeadshot} />
                            <View style={styles.rankingsRowInfo}>
                              <Text style={styles.rankingsRowName} numberOfLines={1}>{player.name}</Text>
                              <Text style={styles.rankingsRowMeta}>
                                <Text style={{ color: Colors.positions[player.position], fontWeight: 'bold' }}>{player.posRank}</Text> · {player.team} · Bye {player.bye}
                              </Text>
                            </View>
                            <Pressable style={styles.starBtnSmall} onPress={() => toggleStar(player.rank)}>
                              <Svg width={16} height={16} viewBox="0 0 24 24" fill={isStarred ? "#fbbf24" : "none"}>
                                <Path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2L9.19 8.62L2 9.24L7.46 13.97L5.82 21L12 17.27Z" stroke={isStarred ? "#fbbf24" : "#94a3b8"} strokeWidth={2} />
                              </Svg>
                            </Pressable>
                            <Pressable 
                              style={[styles.draftBtnSmall, !isUserTurn && styles.draftBtnDisabled]} 
                              disabled={!isUserTurn}
                              onPress={() => handleDraft(player)}
                            >
                              <Text style={styles.draftBtnTextSmall}>Draft</Text>
                            </Pressable>
                          </View>
                        </View>
                      );
                    })}
                    {filteredRankings.length === 0 && (
                      <Text style={styles.emptySearch}>No matching players available.</Text>
                    )}
                  </ScrollView>
                )}

                {/* QUEUE TAB */}
                {activeTab === 'queue' && (
                  <ScrollView contentContainerStyle={styles.expandedListScroll} showsVerticalScrollIndicator={false}>
                    {queuedPlayers.map((player) => (
                      <View key={player.rank} style={styles.rankingsRowItem}>
                        <Text style={styles.rankingsRowRank}>{player.rank}</Text>
                        <Image source={{ uri: getPlayerHeadshotUrl(player.name, player.position, player.team) }} style={styles.rankingsRowHeadshot} />
                        <View style={styles.rankingsRowInfo}>
                          <Text style={styles.rankingsRowName} numberOfLines={1}>{player.name}</Text>
                          <Text style={styles.rankingsRowMeta}>
                            <Text style={{ color: Colors.positions[player.position], fontWeight: 'bold' }}>{player.posRank}</Text> · {player.team}
                          </Text>
                        </View>
                        <Pressable style={styles.starBtnSmall} onPress={() => toggleStar(player.rank)}>
                          <Svg width={16} height={16} viewBox="0 0 24 24" fill="#fbbf24">
                            <Path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.62L12 2L9.19 8.62L2 9.24L7.46 13.97L5.82 21L12 17.27Z" stroke="#fbbf24" strokeWidth={2} />
                          </Svg>
                        </Pressable>
                        <Pressable 
                          style={[styles.draftBtnSmall, !isUserTurn && styles.draftBtnDisabled]} 
                          disabled={!isUserTurn}
                          onPress={() => handleDraft(player)}
                        >
                          <Text style={styles.draftBtnTextSmall}>Draft</Text>
                        </Pressable>
                      </View>
                    ))}
                    {queuedPlayers.length === 0 && (
                      <Text style={styles.emptySearch}>
                        {players.filter(p => !p.draftedBy && starredIds.includes(p.rank)).length === 0 
                          ? "Queue is empty. Tap the star icon on players to queue them." 
                          : "No matching players in queue."}
                      </Text>
                    )}
                  </ScrollView>
                )}

                {/* MY TEAM ROSTER TAB */}
                {activeTab === 'roster' && (
                  <ScrollView contentContainerStyle={styles.expandedListScroll} showsVerticalScrollIndicator={false}>
                    {filteredUserRoster.map((player, idx) => (
                      <View key={player.rank} style={styles.rankingsRowItem}>
                        <View style={styles.rosterCardIndex}>
                          <Text style={styles.rosterCardIndexText}>{idx + 1}</Text>
                        </View>
                        <Image source={{ uri: getPlayerHeadshotUrl(player.name, player.position, player.team) }} style={styles.rankingsRowHeadshot} />
                        <View style={styles.rankingsRowInfo}>
                          <Text style={styles.rankingsRowName} numberOfLines={1}>{player.name}</Text>
                          <Text style={styles.rankingsRowMeta}>
                            <Text style={{ color: Colors.positions[player.position], fontWeight: 'bold' }}>{player.position}</Text> · {player.team} · Bye {player.bye}
                          </Text>
                        </View>
                      </View>
                    ))}
                    {filteredUserRoster.length === 0 && (
                      <Text style={styles.emptySearch}>
                        {userRoster.length === 0 ? "No drafted players. Starters will fill up here." : "No matching players in roster."}
                      </Text>
                    )}
                  </ScrollView>
                )}

              </View>

            </View>
          )}

        </Animated.View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.coltsNavyLight,
    minHeight: 52,
  },
  exitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.35)',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    gap: 4,
  },
  exitBtnText: {
    fontFamily: Fonts.stats,
    fontSize: 10,
    color: '#f87171',
    fontWeight: '800',
    letterSpacing: 1,
  },
  headerDetails: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontFamily: Fonts.headings,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSub: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 6,
    padding: 2,
    borderWidth: 1,
    borderColor: Colors.coltsNavyLight,
  },
  modeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  modeBtnActive: {
    backgroundColor: Colors.surfaceLifted,
    borderColor: Colors.hofYellow,
    borderWidth: 1,
  },
  modeBtnText: {
    fontFamily: Fonts.stats,
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
  },
  modeBtnTextActive: {
    color: Colors.hofYellow,
  },
  boardContainer: {
    flex: 1,
  },
  grid: {
    flex: 1,
  },
  gridHeaderRow: {
    flexDirection: 'row',
    height: 38,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLifted,
    backgroundColor: Colors.surface,
  },
  gridHeaderCell: {
    width: 125,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: Colors.surfaceLifted,
    paddingHorizontal: 4,
  },
  gridHeaderCellUser: {
    backgroundColor: Colors.surfaceLifted,
  },
  gridHeaderCellLabel: {
    fontFamily: Fonts.stats,
    fontSize: 9,
    color: '#64748b',
    fontWeight: '800',
  },
  gridHeaderCellLabelUser: {
    color: '#34d399',
  },
  gridRowsScroll: {
    paddingBottom: 200,
  },
  gridRow: {
    flexDirection: 'row',
  },
  gridCell: {
    width: 125,
    height: 72,
    borderRightWidth: 1,
    borderRightColor: Colors.surfaceLifted,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLifted,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  gridCellCurrent: {
    backgroundColor: Colors.surface,
  },
  gridCellUser: {
    backgroundColor: Colors.surfaceLifted,
  },
  gridPlayerBlock: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderLeftWidth: 3,
    position: 'relative',
  },
  gridHeadshot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 4,
  },
  gridPlayerDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  gridPlayerName: {
    fontFamily: Fonts.body,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  gridPlayerSub: {
    fontFamily: Fonts.body,
    fontSize: 9,
    color: '#64748b',
  },
  gridCellPickIndicator: {
    position: 'absolute',
    right: 4,
    bottom: 2,
    fontFamily: Fonts.stats,
    fontSize: 8,
    color: '#64748b',
    opacity: 0.5,
  },
  gridEmptyBlock: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onClockPulse: {
    width: '90%',
    height: '85%',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
  },
  onClockPulseUser: {
    backgroundColor: Colors.surfaceLifted,
    borderWidth: 1.5,
    borderColor: Colors.hofYellow,
  },
  onClockPulseCpu: {
    backgroundColor: Colors.surfaceLifted,
    borderWidth: 1,
    borderColor: Colors.coltsNavyLight,
  },
  onClockText: {
    fontFamily: Fonts.stats,
    fontSize: 8,
    fontWeight: '900',
    color: Colors.background,
  },
  clockIcon: {
    opacity: 0.9,
  },
  gridEmptyPickText: {
    fontFamily: Fonts.stats,
    fontSize: 11,
    color: '#64748b',
    opacity: 0.3,
  },
  rostersList: {
    padding: Spacing.three,
    paddingBottom: 240,
    gap: Spacing.three,
  },
  rosterCard: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.coltsNavyLight,
  },
  rosterCardUser: {
    borderColor: '#34d399',
  },
  rosterCardTitle: {
    fontFamily: Fonts.stats,
    fontSize: 11,
    color: '#64748b',
    fontWeight: '800',
    marginBottom: Spacing.two,
  },
  rosterCardTitleUser: {
    color: '#34d399',
  },
  rosterCardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  rosterCardPick: {
    backgroundColor: Colors.background,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    width: '48%',
  },
  rosterPickNum: {
    fontFamily: Fonts.stats,
    fontSize: 9,
    fontWeight: 'bold',
  },
  rosterPickName: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: '#ffffff',
    marginTop: 2,
  },
  rosterCardEmpty: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderTopWidth: 2,
    borderTopColor: Colors.coltsNavyLight,
    zIndex: 100,
    paddingHorizontal: Spacing.three,
  },
  dragHandleContainer: {
    width: '100%',
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#64748b',
    opacity: 0.35,
  },
  sheetHeader: {
    marginBottom: Spacing.one,
  },
  clockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userClockWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userClockText: {
    fontFamily: Fonts.headings,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  cpuClockWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cpuClockText: {
    fontFamily: Fonts.headings,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#94a3b8',
  },
  cpuPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#60a5fa',
  },
  sheetOverallPick: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  starterBar: {
    marginVertical: Spacing.two,
  },
  starterBarScroll: {
    gap: 8,
    paddingRight: 16,
  },
  starterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.background,
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 32,
    borderWidth: 1,
    borderColor: Colors.coltsNavyLight,
  },
  starterPillActive: {
    borderColor: Colors.hofYellow,
    backgroundColor: Colors.surface,
  },
  starterPillLabel: {
    fontFamily: Fonts.stats,
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '700',
  },
  starterPillCount: {
    fontFamily: Fonts.stats,
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '800',
  },
  dragHandleHitbox: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  zoomToggleBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: Colors.surface,
    borderColor: Colors.coltsNavyLight,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomToggleBtnActive: {
    borderColor: Colors.hofYellow,
    backgroundColor: Colors.surfaceLifted,
  },
  gridHeaderCellLabelCompact: {
    fontFamily: Fonts.stats,
    fontSize: 9,
    color: '#64748b',
    fontWeight: '800',
    textAlign: 'center',
  },
  gridPlayerBlockCompact: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderLeftWidth: 2,
  },
  gridPlayerNameCompact: {
    fontFamily: Fonts.body,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  gridPlayerSubCompact: {
    fontFamily: Fonts.body,
    fontSize: 7,
    color: '#64748b',
  },
  onClockPulseCompact: {
    width: '90%',
    height: '85%',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onClockPulseUserCompact: {
    backgroundColor: Colors.surfaceLifted,
    borderWidth: 1,
    borderColor: Colors.hofYellow,
  },
  onClockPulseCpuCompact: {
    backgroundColor: Colors.surfaceLifted,
    borderWidth: 1,
    borderColor: Colors.coltsNavyLight,
  },
  onClockTextCompact: {
    fontFamily: Fonts.stats,
    fontSize: 7,
    fontWeight: '900',
    color: Colors.hofYellow,
  },
  gridEmptyPickTextCompact: {
    fontFamily: Fonts.stats,
    fontSize: 8,
    color: '#64748b',
    opacity: 0.3,
  },
  collapsedSuggestionsContainer: {
    gap: 6,
    marginTop: Spacing.two,
    paddingBottom: 10,
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
  expandedWrapper: {
    flex: 1,
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceLifted,
    paddingBottom: Spacing.one,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabBtnActive: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.hofYellow,
  },
  tabBtnText: {
    fontFamily: Fonts.headings,
    fontSize: 15,
    color: '#64748b',
    fontWeight: 'bold',
  },
  tabBtnTextActive: {
    color: '#ffffff',
  },
  searchBlock: {
    paddingVertical: Spacing.two,
    gap: 8,
  },
  sheetSearchInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.coltsNavyLight,
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    height: 38,
    fontFamily: Fonts.body,
    fontSize: 13,
    color: '#ffffff',
  },
  posChipsScroll: {
    gap: 6,
  },
  posChip: {
    paddingHorizontal: 12,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.coltsNavyLight,
  },
  posChipActive: {
    backgroundColor: Colors.surfaceLifted,
    borderColor: Colors.hofYellow,
    borderWidth: 1,
  },
  posChipText: {
    fontFamily: Fonts.stats,
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
  },
  posChipTextActive: {
    color: Colors.hofYellow,
  },
  sheetListContent: {
    flex: 1,
  },
  expandedListScroll: {
    paddingBottom: 80,
    gap: 12,
    paddingTop: Spacing.two,
  },
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
    color: '#ffffff',
  },
  suggestedSub: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: '#94a3b8',
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
    color: '#64748b',
  },
  starBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  draftBtn: {
    backgroundColor: Colors.surfaceLifted,
    borderColor: Colors.hofYellow,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  draftBtnDisabled: {
    backgroundColor: Colors.background,
    opacity: 0.3,
  },
  draftBtnText: {
    fontFamily: Fonts.headings,
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.hofYellow,
  },
  tierHeader: {
    borderBottomWidth: 1.5,
    paddingBottom: 4,
    marginTop: Spacing.two,
    marginBottom: Spacing.one,
  },
  tierHeaderText: {
    fontFamily: Fonts.stats,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
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
    height: 52,
  },
  rankingsRowRank: {
    fontFamily: Fonts.stats,
    fontSize: 12,
    color: '#94a3b8',
    width: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  rankingsRowHeadshot: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  rankingsRowInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  rankingsRowName: {
    fontFamily: Fonts.body,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  rankingsRowMeta: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: '#64748b',
  },
  starBtnSmall: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  draftBtnSmall: {
    backgroundColor: Colors.surfaceLifted,
    borderColor: Colors.hofYellow,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  draftBtnTextSmall: {
    fontFamily: Fonts.headings,
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.hofYellow,
  },
  rosterCardIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.coltsNavyLight,
  },
  rosterCardIndexText: {
    fontFamily: Fonts.stats,
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: 'bold',
  },
  emptySearch: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    paddingVertical: Spacing.five,
  },
});
