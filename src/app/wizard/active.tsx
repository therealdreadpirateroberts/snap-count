import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Pressable, 
  FlatList, 
  ScrollView, 
  Animated, 
  Dimensions,
  Easing,
  Platform
} from 'react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDraftStore } from '@/store/useDraftStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useAuthStore } from '@/store/useAuthStore';
import { getTeamIndexForPick, getTeamNameForIndex, getUserTeamName } from '@/store/_helpers';
import { useThemeStore } from '@/store/useThemeStore';
import { getTeamLogoUrl, Player } from '@/store/mockData';
import { Colors, Fonts, Spacing, useColors, LightColors, DarkColors } from '@/constants/theme';
import BackgroundTexture from '@/components/BackgroundTexture';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Svg, { Path, Circle } from 'react-native-svg';
import { PlayerHeadshot } from '@/components/PlayerHeadshot';
import SuggestedPlayerRow from '@/components/SuggestedPlayerRow';
import PlayerRowItem from '@/components/PlayerRowItem';
import RosterSummaryCard from '@/components/RosterSummaryCard';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

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

function ActiveDraftScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  useColors(); // subscribe to theme changes to trigger re-renders
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark';
  
  // Store state
  const setup = useDraftStore((state) => state.setup);
  const players = usePlayerStore((state) => state.players);
  const draftStatus = useDraftStore((state) => state.draftStatus);
  const currentPick = useDraftStore((state) => state.currentPick);
  const draftHistory = useDraftStore((state) => state.draftHistory);
  const cpuIsThinking = useDraftStore((state) => state.cpuIsThinking);
  const thinkingCpuName = useDraftStore((state) => state.thinkingCpuName);
  
  // Store actions
  const draftPlayer = useDraftStore((state) => state.draftPlayer);
  const simulateCpuTurn = useDraftStore((state) => state.simulateCpuTurn);
  const resetDraft = useDraftStore((state) => state.resetDraft);

  // Local UI State
  const [boardViewMode, setBoardViewMode] = useState<'round' | 'roster'>('round');
  const [activeTab, setActiveTab] = useState<'suggested' | 'rankings' | 'queue' | 'roster'>('suggested');
  const [searchQuery, setSearchQuery] = useState('');
  const [posFilter, setPosFilter] = useState<'ALL' | 'QB' | 'RB' | 'WR' | 'TE' | 'DST' | 'K'>('ALL');
  const [sheetMode, setSheetMode] = useState<'collapsed' | 'full'>('collapsed');
  const [starredIds, setStarredIds] = useState<number[]>([]);
  const [isZoomedOut, setIsZoomedOut] = useState(false);

  // Timer and urgent glow states
  const [timeLeft, setTimeLeft] = useState(setup.pickClock || 60);
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Determine active turn math
  const activeTeamIdx = useMemo(() => {
    return getTeamIndexForPick(currentPick, setup.leagueSize, setup.draftType);
  }, [currentPick, setup]);

  const isUserTurn = useMemo(() => {
    return activeTeamIdx === setup.userPosition - 1;
  }, [activeTeamIdx, setup]);

  const userName = useAuthStore((state) => state.user?.name) || 'Your Team';

  // Roster categories for user's team
  const userRoster = useMemo(() => {
    return players.filter(p => p.draftedBy === userName);
  }, [players, userName]);

  // Suggested players
  const suggestedPlayers = useMemo(() => {
    // Get all available players that fit basic roster needs
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

    // Return all suggestions matching filters to allow doom scrolling
    return searchedCandidates;
  }, [players, currentPick, posFilter, searchQuery, setup, userRoster]);

  useEffect(() => {
    // Reset timer when pick changes
    setTimeLeft(setup.pickClock || 60);
  }, [currentPick, setup.pickClock]);

  useEffect(() => {
    if (draftStatus !== 'drafting') return;
    
    // Only count down on user's turn
    if (!isUserTurn) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto draft top player if time runs out
          if (suggestedPlayers.length > 0) {
            draftPlayer(suggestedPlayers[0].rank, activeTeamIdx, userName);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPick, isUserTurn, draftStatus, suggestedPlayers, draftPlayer, activeTeamIdx, userName]);

  useEffect(() => {
    if (isUserTurn && timeLeft < 5 && draftStatus === 'drafting') {
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.8,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.1,
            duration: 500,
            useNativeDriver: false,
          }),
        ])
      );
      glow.start();
      return () => {
        glow.stop();
        glowAnim.setValue(0);
      };
    } else {
      glowAnim.setValue(0);
    }
  }, [isUserTurn, timeLeft, draftStatus]);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [88 + insets.bottom, SCREEN_HEIGHT * 0.92], [insets.bottom]);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // ScrollView references for horizontal auto-scrolling
  const horizontalBoardScroll = useRef<ScrollView>(null);

  // Variables moved to the top of components to resolve temporal dead zone issues

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

  // 1. CPU Simulation Trigger
  useEffect(() => {
    if (draftStatus === 'drafting' && !isUserTurn) {
      simulateCpuTurn(() => {
        // When CPU turn ends and user is back on the clock, open the sheet fully to draft with timeout safety
        setTimeout(() => {
          bottomSheetRef.current?.expand();
        }, 50);
      });
    }
  }, [currentPick, isUserTurn, draftStatus]);

  // 2. Summary Redirection Trigger
  useEffect(() => {
    if (draftStatus === 'summary') {
      router.replace('/wizard/summary');
    }
  }, [draftStatus]);

  // 2.3 Setup Redirection Trigger (Safety net to prevent user getting stuck on blank board during reload/resets)
  useEffect(() => {
    if (draftStatus === 'setup') {
      router.replace('/wizard/setup');
    }
  }, [draftStatus]);

  // 2.5 Auto-expand to full sheet when it is the user's pick
  useEffect(() => {
    if (draftStatus === 'drafting' && isUserTurn) {
      setTimeout(() => {
        bottomSheetRef.current?.expand();
      }, 50);
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
  }, [pulseAnim]);

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

  const handleSheetChange = (index: number) => {
    if (index <= 0) {
      setSheetMode('collapsed');
    } else {
      setSheetMode('full');
    }
  };

  const handleHandleTap = () => {
    if (sheetMode === 'collapsed') {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.collapse();
    }
  };

  if (draftStatus === 'setup') {
    return null;
  }

  const handleDraft = (player: Player) => {
    draftPlayer(player.rank, activeTeamIdx, userName);
    setStarredIds(starredIds.filter(id => id !== player.rank));
    setSearchQuery('');
    bottomSheetRef.current?.collapse();
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
        <View style={[styles.boardContainer, { marginBottom: 88 + insets.bottom }]}>
          
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
                                player && isZoomedOut && { backgroundColor: Colors.positions[player.position as keyof typeof Colors.positions] || Colors.surface }
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
                                  <View style={[styles.gridPlayerBlock, { borderLeftColor: Colors.positions[player.position as keyof typeof Colors.positions] || Colors.coltsNavyLight }]}>
                                    <PlayerHeadshot name={player.name} position={player.position} team={player.team} style={styles.gridHeadshot} />
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
                                        <Text style={[styles.onClockTextCompact, isUser && { color: isDark ? Colors.hofYellow : '#000000' }]}>{isUser ? "YOU" : "CPU"}</Text>
                                      </Animated.View>
                                    ) : (
                                      /* STANDARD ON-CLOCK VIEW */
                                      <Animated.View style={[
                                        styles.onClockPulse, 
                                        isUser ? styles.onClockPulseUser : styles.onClockPulseCpu,
                                        { transform: [{ scale: pulseAnim }] }
                                      ]}>
                                        <Text style={[styles.onClockText, isUser && { color: isDark ? Colors.hofYellow : '#000000' }]}>{isUser ? "YOUR PICK!" : "PICKING..."}</Text>
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
                  <RosterSummaryCard 
                    key={teamIdx}
                    teamName={name}
                    isUser={isUser}
                    rosterPicks={rosterPicks}
                    currentSlots={setup.rosterSlots || undefined}
                  />
                );
              })}
            </ScrollView>
          )}

        </View>

        {/* BOTTOM SHEET WIDGET (Sleeper style) */}
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          onChange={handleSheetChange}
          backgroundStyle={{
            backgroundColor: Colors.surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderTopWidth: 1.5,
            borderTopColor: Colors.coltsNavyLight,
          }}
          handleIndicatorStyle={{
            backgroundColor: '#64748b',
            opacity: 0.35,
            width: 36,
            height: 4,
          }}
        >
          <BottomSheetView style={[styles.bottomSheetViewContent, { paddingBottom: insets.bottom + Spacing.two }]}>
            
            {/* ON THE CLOCK HEADER BANNER */}
            <Pressable onPress={handleHandleTap} style={styles.sheetHeaderBanner}>
              {/* Subtle orange glow pulse overlay */}
              <Animated.View 
                style={[
                  StyleSheet.absoluteFillObject, 
                  { 
                    backgroundColor: 'rgba(255, 87, 34, 0.25)', 
                    opacity: glowAnim,
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                  }
                ]} 
                pointerEvents="none" 
              />
              <View style={styles.clockRow}>
                <View style={styles.userClockWrapper}>
                  {/* Left side: pulsing Penalty-Yellow dot */}
                  <Animated.View 
                    style={[
                      styles.yellowPulseDot, 
                      { transform: [{ scale: pulseAnim }] }
                    ]} 
                  />
                  <Text style={styles.userClockText}>
                    {isUserTurn ? "YOU'RE ON THE CLOCK" : `${(thinkingCpuName || 'CPU').toUpperCase()} IS PICKING`}
                  </Text>
                </View>
                
                <View style={styles.timerRightContainer}>
                  {isUserTurn && (
                    <Text 
                      style={[
                        styles.timerText, 
                        { color: timeLeft < 15 ? '#FF5722' : '#FFC107' }
                      ]}
                    >
                      {timeLeft}s
                    </Text>
                  )}
                  <Text style={styles.sheetOverallPick}>
                    Pick {currentPick} (Round {Math.ceil(currentPick / setup.leagueSize)})
                  </Text>
                </View>
              </View>
            </Pressable>

            {/* EXPANDED VIEW: TABS & CONTENT */}
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
                  <BottomSheetTextInput
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
                    <BottomSheetScrollView contentContainerStyle={styles.expandedListScroll} showsVerticalScrollIndicator={false}>
                      {suggestedPlayers.length === 0 ? (
                        <View style={styles.emptyContainer}>
                          <Text style={styles.emptyTitle}>NO SUGGESTED PLAYERS ⚡</Text>
                          <Text style={styles.emptySubtitle}>
                            All players matching your current filters have been drafted or position caps have been reached.
                          </Text>
                          <Pressable 
                            style={styles.clearFilterBtn}
                            onPress={() => {
                              setPosFilter('ALL');
                              setSearchQuery('');
                            }}
                          >
                            <Text style={styles.clearFilterBtnText}>RESET FILTERS ⚡</Text>
                          </Pressable>
                        </View>
                      ) : (
                        suggestedPlayers.map((player, idx) => {
                          const isStarred = starredIds.includes(player.rank);
                          const expertPercent = idx === 0 ? '86%' : idx === 1 ? '14%' : '0%';
                          return (
                            <SuggestedPlayerRow 
                              key={player.rank}
                              player={player}
                              isStarred={isStarred}
                              isUserTurn={isUserTurn}
                              expertPercent={expertPercent}
                              onToggleStar={() => toggleStar(player.rank)}
                              onDraft={() => handleDraft(player)}
                            />
                          );
                        })
                      )}
                    </BottomSheetScrollView>
                  )}

                  {/* RANKINGS TAB (WITH TIERS) */}
                  {activeTab === 'rankings' && (
                    <BottomSheetScrollView contentContainerStyle={styles.expandedListScroll} showsVerticalScrollIndicator={false}>
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
                            <PlayerRowItem 
                              player={player}
                              isStarred={isStarred}
                              isUserTurn={isUserTurn}
                              showStar={true}
                              showDraft={true}
                              showRank={true}
                              onToggleStar={() => toggleStar(player.rank)}
                              onDraft={() => handleDraft(player)}
                            />
                          </View>
                        );
                      })}
                      {filteredRankings.length === 0 && (
                        <Text style={styles.emptySearch}>No matching players available.</Text>
                      )}
                    </BottomSheetScrollView>
                  )}

                  {/* QUEUE TAB */}
                  {activeTab === 'queue' && (
                    <BottomSheetScrollView contentContainerStyle={styles.expandedListScroll} showsVerticalScrollIndicator={false}>
                      {queuedPlayers.map((player) => (
                        <PlayerRowItem 
                          key={player.rank}
                          player={player}
                          isStarred={true}
                          isUserTurn={isUserTurn}
                          showStar={true}
                          showDraft={true}
                          showRank={true}
                          onToggleStar={() => toggleStar(player.rank)}
                          onDraft={() => handleDraft(player)}
                        />
                      ))}
                      {queuedPlayers.length === 0 && (
                        <Text style={styles.emptySearch}>
                          {players.filter(p => !p.draftedBy && starredIds.includes(p.rank)).length === 0 
                            ? "Queue is empty. Tap the star icon on players to queue them." 
                            : "No matching players in queue."}
                        </Text>
                      )}
                    </BottomSheetScrollView>
                  )}

                  {/* MY TEAM ROSTER TAB */}
                  {activeTab === 'roster' && (
                    <BottomSheetScrollView contentContainerStyle={styles.expandedListScroll} showsVerticalScrollIndicator={false}>
                      {filteredUserRoster.map((player, idx) => (
                        <PlayerRowItem 
                          key={player.rank}
                          player={player}
                          showRosterIndex={true}
                          rosterIndex={idx + 1}
                        />
                      ))}
                      {filteredUserRoster.length === 0 && (
                        <Text style={styles.emptySearch}>
                          {userRoster.length === 0 ? "No drafted players. Starters will fill up here." : "No matching players in roster."}
                        </Text>
                      )}
                    </BottomSheetScrollView>
                  )}

                </View>

              </View>

          </BottomSheetView>
        </BottomSheet>

      </SafeAreaView>
    </View>
  );
}

function createStyles(Colors: typeof LightColors) {
  return StyleSheet.create({
    bottomSheetViewContent: {
      flex: 1,
      ...(Platform.OS === 'web' ? {
        minHeight: SCREEN_HEIGHT * 0.85,
        maxHeight: SCREEN_HEIGHT * 0.9,
      } : {}),
    },
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
      color: Colors.primaryAccent,
    },
    headerSub: {
      fontFamily: Fonts.body,
      fontSize: 11,
      color: Colors.secondaryAccent,
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
      color: Colors.secondaryAccent,
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
      color: Colors.secondaryAccent,
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
      color: Colors.primaryAccent,
    },
    gridPlayerSub: {
      fontFamily: Fonts.body,
      fontSize: 9,
      color: Colors.secondaryAccent,
    },
    gridCellPickIndicator: {
      position: 'absolute',
      right: 4,
      bottom: 2,
      fontFamily: Fonts.stats,
      fontSize: 8,
      color: Colors.secondaryAccent,
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
      color: Colors.primaryAccent,
    },
    clockIcon: {
      opacity: 0.9,
    },
    gridEmptyPickText: {
      fontFamily: Fonts.stats,
      fontSize: 11,
      color: Colors.secondaryAccent,
      opacity: 0.3,
    },
    rostersList: {
      padding: Spacing.three,
      paddingBottom: 240,
      gap: Spacing.three,
    },
    sheetHeaderBanner: {
      backgroundColor: '#275916', // Deep Field Green +8% luminance
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderBottomWidth: 1,
      borderBottomColor: '#F4F5F7', // Chalk White bottom edge
      paddingVertical: 14,
      paddingHorizontal: 16,
      overflow: 'hidden',
    },
    clockRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    userClockWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    userClockText: {
      fontFamily: Fonts.headings,
      fontSize: 15,
      fontWeight: 'bold',
      color: '#F4F5F7', // Chalk White text
      letterSpacing: 0.5,
    },
    yellowPulseDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#FFC107', // pulsing Penalty-Yellow dot
    },
    timerRightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    timerText: {
      fontFamily: Fonts.stats,
      fontSize: 18,
      fontWeight: 'bold',
    },
    sheetOverallPick: {
      fontFamily: Fonts.body,
      fontSize: 12,
      color: '#9EA7B0', // Chrome Silver pick count
      fontWeight: '600',
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
      color: Colors.secondaryAccent,
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
      color: Colors.primaryAccent,
    },
    gridPlayerSubCompact: {
      fontFamily: Fonts.body,
      fontSize: 7,
      color: Colors.secondaryAccent,
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
      color: Colors.primaryAccent,
    },
    gridEmptyPickTextCompact: {
      fontFamily: Fonts.stats,
      fontSize: 8,
      color: Colors.secondaryAccent,
      opacity: 0.3,
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
      paddingHorizontal: Spacing.three,
      ...(Platform.OS === 'web' ? {
        minHeight: SCREEN_HEIGHT * 0.7,
        maxHeight: SCREEN_HEIGHT * 0.8,
      } : {}),
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
      color: Colors.secondaryAccent,
      fontWeight: 'bold',
    },
    tabBtnTextActive: {
      color: Colors.primaryAccent,
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
      color: Colors.primaryAccent,
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
      color: Colors.secondaryAccent,
      fontWeight: '700',
    },
    posChipTextActive: {
      color: Colors.hofYellow,
    },
    sheetListContent: {
      flex: 1,
      ...(Platform.OS === 'web' ? {
        minHeight: SCREEN_HEIGHT * 0.5,
        maxHeight: SCREEN_HEIGHT * 0.6,
      } : {}),
    },
    expandedListScroll: {
      paddingBottom: 80,
      gap: 12,
      paddingTop: Spacing.two,
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
    emptySearch: {
      fontFamily: Fonts.body,
      fontSize: 13,
      color: Colors.secondaryAccent,
      textAlign: 'center',
      paddingVertical: Spacing.five,
    },
    emptyContainer: {
      paddingHorizontal: Spacing.four,
      paddingVertical: Spacing.six,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.surface,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 12,
      marginTop: Spacing.three,
      marginHorizontal: Spacing.three,
    },
    emptyTitle: {
      fontFamily: Fonts.headings,
      fontSize: 16,
      fontWeight: 'bold',
      color: '#bea98e', // Champagne Bronze highlight
      marginBottom: Spacing.two,
      textAlign: 'center',
      letterSpacing: 1,
    },
    emptySubtitle: {
      fontFamily: Fonts.body,
      fontSize: 12,
      color: Colors.secondaryAccent,
      textAlign: 'center',
      marginBottom: Spacing.four,
      lineHeight: 18,
    },
    clearFilterBtn: {
      backgroundColor: '#bea98e', // Champagne Bronze primary CTA background
      paddingHorizontal: Spacing.four,
      paddingVertical: Spacing.two,
      borderRadius: 20,
      borderWidth: 1.5,
      borderColor: '#bea98e',
    },
    clearFilterBtnText: {
      fontFamily: Fonts.headings,
      fontSize: 12,
      color: '#000000', // Mandatory solid black overlay text for AAA WCAG compliance
      fontWeight: '800',
      textAlign: 'center',
      letterSpacing: 0.8,
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
  });
}

const lightStyles = createStyles(LightColors);
const darkStyles = createStyles(DarkColors as any);
const styles = new Proxy({}, {
  get(target, prop) {
    const theme = useThemeStore.getState().theme;
    return theme === 'dark' ? darkStyles[prop as keyof typeof darkStyles] : lightStyles[prop as keyof typeof lightStyles];
  }
}) as ReturnType<typeof createStyles>;

export default function SafeActiveDraftScreen() {
  const router = useRouter();
  const resetDraft = useDraftStore((state) => state.resetDraft);
  const handleReset = () => {
    resetDraft();
    router.replace('/wizard/setup');
  };

  return (
    <ErrorBoundary onReset={handleReset}>
      <ActiveDraftScreen />
    </ErrorBoundary>
  );
}
