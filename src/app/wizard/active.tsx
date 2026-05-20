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
  Easing
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSnapStore, getTeamIndexForPick, getTeamNameForIndex } from '@/store/useSnapStore';
import { getTeamLogoUrl, Player } from '@/store/mockData';
import { Colors, Fonts, Spacing, MaxContentWidth } from '@/constants/theme';
import BackgroundTexture from '@/components/BackgroundTexture';
import Svg, { Path, Circle } from 'react-native-svg';

const SCREEN_HEIGHT = Dimensions.get('window').height;

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
  const getUserRoster = useSnapStore((state) => state.getUserRoster);
  const resetDraft = useSnapStore((state) => state.resetDraft);

  // Local UI State
  const [activeTab, setActiveTab] = useState<'suggestions' | 'all' | 'roster'>('suggestions');
  const [searchQuery, setSearchQuery] = useState('');
  const [sheetMode, setSheetMode] = useState<'collapsed' | 'mid' | 'full'>('collapsed');

  // Animated values
  const sheetHeightAnim = useRef(new Animated.Value(180)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // FlatList reference for auto-scrolling draft board
  const draftBoardRef = useRef<FlatList>(null);

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

  // Suggested players
  const suggestedPlayers = useMemo(() => {
    return getSuggestedPicks();
  }, [players, currentPick]);

  // Available players for All Players search
  const availablePlayersFiltered = useMemo(() => {
    return players
      .filter(p => !p.draftedBy)
      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                   p.team.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [players, searchQuery]);

  // Total draft rounds list for background grid
  const totalPicksCount = setup.rounds * setup.leagueSize;
  const draftBoardPicks = useMemo(() => {
    const picksList = [];
    for (let p = 1; p <= totalPicksCount; p++) {
      const teamIdx = getTeamIndexForPick(p, setup.leagueSize, setup.draftType);
      const teamName = getTeamNameForIndex(teamIdx, setup.userPosition);
      const historyEntry = draftHistory.find(h => h.pickNumber === p);
      
      picksList.push({
        pickNumber: p,
        round: Math.ceil(p / setup.leagueSize),
        teamIndex: teamIdx,
        teamName,
        player: historyEntry ? historyEntry.player : null,
      });
    }
    return picksList;
  }, [draftHistory, setup, totalPicksCount]);

  // 1. CPU Simulation Trigger
  useEffect(() => {
    if (draftStatus === 'drafting' && !isUserTurn) {
      simulateCpuTurn(() => {
        // Auto open sheet to mid when it becomes user's turn
        setSheetMode('mid');
      });
    }
  }, [currentPick, isUserTurn, draftStatus]);

  // 2. Summary Redirection Trigger
  useEffect(() => {
    if (draftStatus === 'summary') {
      router.replace('/wizard/summary');
    }
  }, [draftStatus]);

  // 3. Pulse animation for active dot
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.4,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // 4. Auto scroll draft board to keep current pick centered
  useEffect(() => {
    if (draftBoardRef.current && currentPick > 1) {
      setTimeout(() => {
        draftBoardRef.current?.scrollToIndex({
          index: Math.max(0, currentPick - 2),
          animated: true,
        });
      }, 100);
    }
  }, [currentPick]);

  // 5. Bottom sheet height animations
  useEffect(() => {
    let targetHeight = 180;
    if (sheetMode === 'collapsed') {
      targetHeight = isUserTurn ? 320 : 180;
    } else if (sheetMode === 'mid') {
      targetHeight = SCREEN_HEIGHT * 0.55;
    } else {
      targetHeight = SCREEN_HEIGHT * 0.90;
    }

    Animated.spring(sheetHeightAnim, {
      toValue: targetHeight,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();
  }, [sheetMode, isUserTurn]);

  // Cycle sheet modes
  const handleHandleTap = () => {
    if (sheetMode === 'collapsed') {
      setSheetMode('mid');
    } else if (sheetMode === 'mid') {
      setSheetMode('full');
    } else {
      setSheetMode('collapsed');
    }
  };

  // Draft player action
  const handleDraft = (player: Player) => {
    draftPlayer(player.rank, activeTeamIdx, 'Your Team');
    setSearchQuery('');
    setSheetMode('collapsed');
  };

  // Safe exit
  const handleExit = () => {
    resetDraft();
    router.replace('/');
  };

  // Render horizontal dots for pick timeline (3 past -> active -> 3 future)
  const renderDotTimeline = () => {
    const dots = [];
    const startPick = Math.max(1, currentPick - 3);
    const endPick = Math.min(totalPicksCount, startPick + 6);
    
    // Adjust start if close to end
    let adjustedStart = startPick;
    if (endPick - startPick < 6 && totalPicksCount > 7) {
      adjustedStart = Math.max(1, endPick - 6);
    }

    for (let p = adjustedStart; p <= Math.min(totalPicksCount, adjustedStart + 6); p++) {
      const isPast = p < currentPick;
      const isActive = p === currentPick;
      const isUserPick = getTeamIndexForPick(p, setup.leagueSize, setup.draftType) === setup.userPosition - 1;
      
      dots.push(
        <View key={p} style={styles.dotContainer}>
          {isActive ? (
            <Animated.View style={[
              styles.timelineDot,
              styles.timelineActiveDot,
              {
                transform: [{ scale: pulseAnim }],
              }
            ]}>
              {isUserPick && <View style={styles.userDotCenter} />}
            </Animated.View>
          ) : (
            <View style={[
              styles.timelineDot,
              isPast && styles.timelinePastDot,
              isUserPick && styles.timelineUserDot,
            ]}>
              {isUserPick && <View style={isPast ? styles.userDotCenterPast : styles.userDotCenterUpcoming} />}
            </View>
          )}
          <Text style={[styles.dotLabel, isActive && styles.dotLabelActive]}>P{p}</Text>
        </View>
      );
    }

    return (
      <View style={styles.timelineWrapper}>
        <View style={styles.timelineProgressLine} />
        <View style={styles.dotsRow}>{dots}</View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <BackgroundTexture />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        
        {/* TOP STATUS CONTROL BAR */}
        <View style={styles.topBar}>
          <Pressable style={styles.exitBtn} onPress={handleExit}>
            <Text style={styles.exitBtnText}>QUIT DRAFT</Text>
          </Pressable>
          <View style={styles.activePickDetails}>
            <Text style={styles.activePickLabel}>ROUND {Math.ceil(currentPick / setup.leagueSize)} · PICK {currentPick}</Text>
          </View>
          <View style={styles.difficultyTag}>
            <Text style={styles.difficultyText}>{setup.opponentStyle.toUpperCase()}</Text>
          </View>
        </View>

        {/* BACKGROUND PERSISTENT DRAFT GRID BOARD */}
        <View style={styles.boardContainer}>
          <FlatList
            ref={draftBoardRef}
            data={draftBoardPicks}
            keyExtractor={(item) => item.pickNumber.toString()}
            contentContainerStyle={styles.boardListContent}
            showsVerticalScrollIndicator={false}
            getItemLayout={(data, index) => (
              { length: 64, offset: 64 * index, index }
            )}
            renderItem={({ item }) => {
              const isCurrent = item.pickNumber === currentPick;
              const hasDrafted = item.player !== null;
              const isUser = item.teamIndex === setup.userPosition - 1;
              const posColor = hasDrafted ? Colors.positions[item.player!.position] : '#4b5563';

              return (
                <View style={[
                  styles.boardRow,
                  isCurrent && styles.boardCurrentRow,
                  isUser && styles.boardUserRow,
                ]}>
                  {/* Pick indicator */}
                  <View style={styles.boardPickCol}>
                    <Text style={[styles.boardPickNum, isCurrent && styles.boardCurrentText]}>
                      {item.pickNumber.toString().padStart(3, '0')}
                    </Text>
                    <Text style={styles.boardRoundLabel}>R{item.round}</Text>
                  </View>

                  {/* Team details */}
                  <View style={styles.boardTeamCol}>
                    <Text 
                      style={[styles.boardTeamName, isUser && styles.boardUserTeamName, isCurrent && styles.boardCurrentText]}
                      numberOfLines={1}
                    >
                      {item.teamName}
                    </Text>
                  </View>

                  {/* Drafted Player */}
                  <View style={styles.boardPlayerCol}>
                    {hasDrafted ? (
                      <View style={styles.draftedPlayerCard}>
                        {/* Position Pill */}
                        <View style={[styles.boardPosBadge, { borderColor: posColor }]}>
                          <Text style={[styles.boardPosBadgeText, { color: posColor }]}>{item.player!.position}</Text>
                        </View>
                        <Text style={styles.draftedPlayerName} numberOfLines={1}>
                          {item.player!.name}
                        </Text>
                        <Text style={styles.draftedPlayerMeta}>{item.player!.team}</Text>
                      </View>
                    ) : (
                      <Text style={styles.boardEmptySlot}>
                        {isCurrent ? (cpuIsThinking ? 'SELECTING...' : 'ON THE CLOCK') : 'ON DECK'}
                      </Text>
                    )}
                  </View>
                </View>
              );
            }}
          />
        </View>

        {/* BOTTOM SHEET CONTAINER (Animated height) */}
        <Animated.View style={[
          styles.bottomSheet,
          { 
            height: sheetHeightAnim, 
            paddingBottom: insets.bottom + Spacing.two 
          }
        ]}>
          
          {/* Drag handle */}
          <Pressable style={styles.dragHandleContainer} onPress={handleHandleTap}>
            <View style={styles.dragHandle} />
          </Pressable>

          {/* STATUS HEADLINE */}
          <View style={styles.sheetHeader}>
            <View style={styles.headlineRow}>
              <Text style={[styles.sheetHeadline, isUserTurn && styles.sheetHeadlineUser]}>
                {isUserTurn ? "You're on the clock" : `${thinkingCpuName || 'CPU'} is picking`}
              </Text>
              
              <View style={[
                styles.turnPill, 
                isUserTurn ? styles.userTurnPill : styles.cpuTurnPill
              ]}>
                <Text style={[
                  styles.turnPillText, 
                  isUserTurn ? styles.userTurnPillText : styles.cpuTurnPillText
                ]}>
                  {isUserTurn ? 'YOUR PICK' : 'WAITING'}
                </Text>
              </View>
            </View>
            
            <Text style={styles.sheetSubtitle}>
              Pick {currentPick} of {totalPicksCount} · Round {Math.ceil(currentPick / setup.leagueSize)}
            </Text>
          </View>

          {/* 7-DOT TIMELINE PICK TRACKER */}
          {renderDotTimeline()}

          {/* HERO SUGGESTED PICK (Only on User Turn) */}
          {isUserTurn && suggestedPlayers.length > 0 && sheetMode !== 'full' && (
            <View style={styles.heroCard}>
              <Image
                source={{ uri: getTeamLogoUrl(suggestedPlayers[0].team) }}
                style={styles.heroLogo}
                resizeMode="contain"
              />
              <View style={styles.heroInfo}>
                <View style={styles.heroHeaderRow}>
                  <Text style={styles.heroName} numberOfLines={1}>{suggestedPlayers[0].name}</Text>
                  <View style={[styles.heroBadge, { borderColor: Colors.positions[suggestedPlayers[0].position] }]}>
                    <Text style={[styles.heroBadgeText, { color: Colors.positions[suggestedPlayers[0].position] }]}>
                      {suggestedPlayers[0].posRank}
                    </Text>
                  </View>
                </View>
                <Text style={styles.heroMeta}>{suggestedPlayers[0].team} · BYE {suggestedPlayers[0].bye}</Text>
                
                {/* AI Advice Tag */}
                <View style={styles.advicePill}>
                  <Text style={styles.adviceText}>AI ADVICE: {suggestedPlayers[0].recommendationReason}</Text>
                </View>
              </View>
              
              <Pressable style={styles.heroDraftBtn} onPress={() => handleDraft(suggestedPlayers[0])}>
                <Text style={styles.heroDraftBtnText}>DRAFT</Text>
              </Pressable>
            </View>
          )}

          {/* TAB BAR (MID & FULLHEIGHT) */}
          {sheetMode !== 'collapsed' && (
            <View style={styles.sheetTabs}>
              {[
                { id: 'suggestions', label: `SUGGESTIONS (${suggestedPlayers.length})` },
                { id: 'all', label: 'ALL PLAYERS' },
                { id: 'roster', label: `MY TEAM (${userRoster.length})` }
              ].map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <Pressable
                    key={tab.id}
                    style={[styles.tabButton, active && styles.activeTabButton]}
                    onPress={() => setActiveTab(tab.id as any)}
                  >
                    <Text style={[styles.tabButtonText, active && styles.activeTabButtonText]}>
                      {tab.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          {/* SCROLLABLE SHEET CONTENT */}
          {sheetMode !== 'collapsed' && (
            <View style={styles.sheetContent}>
              
              {/* SUGGESTIONS TAB */}
              {activeTab === 'suggestions' && (
                <ScrollView contentContainerStyle={styles.suggestionsScroll}>
                  {suggestedPlayers.map((player) => {
                    const posColor = Colors.positions[player.position];
                    
                    return (
                      <View key={player.rank} style={styles.playerItemCard}>
                        <Image source={{ uri: getTeamLogoUrl(player.team) }} style={styles.itemLogo} />
                        <View style={styles.itemDetails}>
                          <Text style={styles.itemName}>{player.name}</Text>
                          <Text style={styles.itemMeta}>
                            <Text style={{ color: posColor, fontWeight: 'bold' }}>{player.posRank}</Text> · {player.team} · BYE {player.bye}
                          </Text>
                        </View>
                        <Pressable 
                          style={({ pressed }) => [styles.draftCircleBtn, pressed && styles.draftCircleBtnPressed, !isUserTurn && styles.disabledDraftBtn]} 
                          onPress={() => isUserTurn && handleDraft(player)}
                          disabled={!isUserTurn}
                        >
                          <Text style={styles.draftPlusText}>+</Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </ScrollView>
              )}

              {/* ALL PLAYERS TAB */}
              {activeTab === 'all' && (
                <View style={{ flex: 1 }}>
                  {/* Search Bar in sheet */}
                  <TextInput
                    style={styles.sheetSearchInput}
                    placeholder="Search player or team..."
                    placeholderTextColor="#E2E8F0"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <FlatList
                    data={availablePlayersFiltered}
                    keyExtractor={(item) => item.rank.toString()}
                    contentContainerStyle={styles.allPlayersList}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                      const posColor = Colors.positions[item.position];
                      
                      return (
                        <View style={styles.playerItemCard}>
                          <Text style={styles.itemRank}>#{item.rank}</Text>
                          <Image source={{ uri: getTeamLogoUrl(item.team) }} style={styles.itemLogo} />
                          <View style={styles.itemDetails}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemMeta}>
                              <Text style={{ color: posColor, fontWeight: 'bold' }}>{item.posRank}</Text> · {item.team} · BYE {item.bye} · ADP {item.adp}
                            </Text>
                          </View>
                          <Pressable 
                            style={({ pressed }) => [styles.draftCircleBtn, pressed && styles.draftCircleBtnPressed, !isUserTurn && styles.disabledDraftBtn]} 
                            onPress={() => isUserTurn && handleDraft(item)}
                            disabled={!isUserTurn}
                          >
                            <Text style={styles.draftPlusText}>+</Text>
                          </Pressable>
                        </View>
                      );
                    }}
                  />
                </View>
              )}

              {/* MY ROSTER TAB */}
              {activeTab === 'roster' && (
                <ScrollView contentContainerStyle={styles.rosterScroll}>
                  {userRoster.length === 0 ? (
                    <Text style={styles.emptyRosterText}>No players drafted yet. Starters will fill up here.</Text>
                  ) : (
                    userRoster.map((player, idx) => {
                      const posColor = Colors.positions[player.position];
                      return (
                        <View key={player.rank} style={styles.rosterRow}>
                          <View style={styles.rosterSlotTag}>
                            <Text style={styles.rosterSlotTagText}>SLOT {idx + 1}</Text>
                          </View>
                          <Image source={{ uri: getTeamLogoUrl(player.team) }} style={styles.itemLogo} />
                          <View style={styles.itemDetails}>
                            <Text style={styles.itemName}>{player.name}</Text>
                            <Text style={styles.itemMeta}>
                              <Text style={{ color: posColor, fontWeight: 'bold' }}>{player.position}</Text> · {player.team} · Bye {player.bye}
                            </Text>
                          </View>
                        </View>
                      );
                    })
                  )}
                </ScrollView>
              )}

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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    backgroundColor: '#0a1530',
    borderBottomWidth: 1,
    borderBottomColor: '#1a4480',
    minHeight: 44,
  },
  exitBtn: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    minHeight: 32,
    justifyContent: 'center',
  },
  exitBtnText: {
    fontFamily: Fonts.stats,
    fontSize: 10,
    color: Colors.status.danger,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  activePickDetails: {
    justifyContent: 'center',
  },
  activePickLabel: {
    fontFamily: Fonts.stats,
    fontSize: 12,
    color: Colors.primaryAccent,
    fontWeight: 'bold',
  },
  difficultyTag: {
    backgroundColor: '#0f1d3d',
    borderColor: '#1a4480',
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.one,
  },
  difficultyText: {
    fontFamily: Fonts.stats,
    fontSize: 8,
    color: Colors.secondaryAccent,
    fontWeight: 'bold',
  },
  boardContainer: {
    flex: 1,
    marginBottom: 180, // push list up above sheet collapsed zone
  },
  boardListContent: {
    paddingBottom: Spacing.four,
  },
  boardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: '#0a1530',
  },
  boardCurrentRow: {
    backgroundColor: '#0f1d3d',
  },
  boardUserRow: {
    backgroundColor: '#071633',
  },
  boardPickCol: {
    width: 60,
    gap: 2,
  },
  boardPickNum: {
    fontFamily: Fonts.stats,
    fontSize: 12,
    color: Colors.secondaryAccent,
  },
  boardCurrentText: {
    color: Colors.primaryAccent,
    fontWeight: 'bold',
  },
  boardRoundLabel: {
    fontFamily: Fonts.stats,
    fontSize: 8,
    color: Colors.positions.DST,
    opacity: 0.6,
  },
  boardTeamCol: {
    width: 110,
    paddingRight: Spacing.two,
  },
  boardTeamName: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.secondaryAccent,
  },
  boardUserTeamName: {
    color: Colors.positions.RB,
    fontWeight: 'bold',
  },
  boardPlayerCol: {
    flex: 1,
    justifyContent: 'center',
  },
  draftedPlayerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  boardPosBadge: {
    borderWidth: 1,
    borderRadius: Spacing.one,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  boardPosBadgeText: {
    fontFamily: Fonts.stats,
    fontSize: 8,
    fontWeight: 'bold',
  },
  draftedPlayerName: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.primaryAccent,
    fontWeight: '600',
    flexShrink: 1,
  },
  draftedPlayerMeta: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Colors.secondaryAccent,
    opacity: 0.5,
  },
  boardEmptySlot: {
    fontFamily: Fonts.stats,
    fontSize: 9,
    color: Colors.secondaryAccent,
    opacity: 0.35,
    letterSpacing: 1,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0a1530',
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    borderTopWidth: 2,
    borderTopColor: '#1a4480',
    zIndex: 100,
    paddingHorizontal: Spacing.four,
  },
  dragHandleContainer: {
    width: '100%',
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.secondaryAccent,
    opacity: 0.3,
  },
  sheetHeader: {
    gap: 2,
    marginBottom: Spacing.two,
  },
  headlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sheetHeadline: {
    fontFamily: Fonts.headings,
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.secondaryAccent,
  },
  sheetHeadlineUser: {
    color: Colors.primaryAccent,
  },
  turnPill: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: 50,
  },
  userTurnPill: {
    backgroundColor: Colors.status.success,
  },
  cpuTurnPill: {
    backgroundColor: '#0f1d3d',
    borderColor: '#1a4480',
    borderWidth: 1,
  },
  turnPillText: {
    fontFamily: Fonts.stats,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  userTurnPillText: {
    color: Colors.background,
  },
  cpuTurnPillText: {
    color: Colors.secondaryAccent,
  },
  sheetSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.secondaryAccent,
    opacity: 0.6,
  },
  timelineWrapper: {
    position: 'relative',
    height: 40,
    justifyContent: 'center',
    marginVertical: Spacing.one,
  },
  timelineProgressLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#1a4480',
    opacity: 0.4,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  dotContainer: {
    alignItems: 'center',
    gap: 4,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1a4480',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelinePastDot: {
    backgroundColor: Colors.positions.DST,
    opacity: 0.7,
  },
  timelineActiveDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primaryAccent,
    borderWidth: 2,
    borderColor: '#0a1530',
  },
  timelineUserDot: {
    borderColor: Colors.positions.RB,
    borderWidth: 1,
  },
  userDotCenter: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.positions.RB,
  },
  userDotCenterPast: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.positions.RB,
  },
  userDotCenterUpcoming: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1a4480',
  },
  dotLabel: {
    fontFamily: Fonts.stats,
    fontSize: 8,
    color: Colors.secondaryAccent,
    opacity: 0.4,
  },
  dotLabelActive: {
    color: Colors.primaryAccent,
    fontWeight: 'bold',
    opacity: 1,
  },
  heroCard: {
    backgroundColor: Colors.surfaceLifted,
    borderColor: '#1a4480',
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.two,
    gap: Spacing.three,
    minHeight: 88,
  },
  heroLogo: {
    width: 44,
    height: 44,
  },
  heroInfo: {
    flex: 1,
    gap: 2,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  heroName: {
    fontFamily: Fonts.body,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
    flexShrink: 1,
  },
  heroBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  heroBadgeText: {
    fontFamily: Fonts.stats,
    fontSize: 8,
    fontWeight: 'bold',
  },
  heroMeta: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.secondaryAccent,
    opacity: 0.6,
  },
  advicePill: {
    marginTop: 2,
  },
  adviceText: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Colors.positions.WR,
    fontWeight: '500',
  },
  heroDraftBtn: {
    backgroundColor: Colors.primaryAccent,
    width: 64,
    height: 52, // 52px button on right!
    borderRadius: Spacing.one,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroDraftBtnText: {
    fontFamily: Fonts.headings,
    fontSize: 14,
    color: Colors.background,
    fontWeight: 'bold',
  },
  sheetTabs: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: '#0f1d3d',
    paddingBottom: Spacing.one,
  },
  tabButton: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: 50,
    backgroundColor: 'transparent',
    minHeight: 36,
    justifyContent: 'center',
  },
  activeTabButton: {
    backgroundColor: '#0f1d3d',
    borderColor: '#1a4480',
    borderWidth: 1,
  },
  tabButtonText: {
    fontFamily: Fonts.stats,
    fontSize: 10,
    color: Colors.secondaryAccent,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  activeTabButtonText: {
    color: Colors.primaryAccent,
  },
  sheetContent: {
    flex: 1,
    marginTop: Spacing.two,
  },
  suggestionsScroll: {
    gap: Spacing.two,
    paddingBottom: Spacing.three,
  },
  playerItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLifted,
    borderColor: '#0f1d3d',
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.two,
    gap: Spacing.three,
    minHeight: 56,
  },
  itemRank: {
    fontFamily: Fonts.stats,
    fontSize: 12,
    color: Colors.secondaryAccent,
    width: 32,
    textAlign: 'center',
  },
  itemLogo: {
    width: 36,
    height: 36,
  },
  itemDetails: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.primaryAccent,
    fontWeight: '600',
  },
  itemMeta: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.secondaryAccent,
    opacity: 0.65,
  },
  draftCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0f1d3d',
    borderColor: '#1a4480',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  draftCircleBtnPressed: {
    backgroundColor: Colors.primaryAccent,
  },
  draftPlusText: {
    fontSize: 18,
    color: Colors.primaryAccent,
    fontWeight: 'bold',
  },
  disabledDraftBtn: {
    opacity: 0.3,
  },
  sheetSearchInput: {
    backgroundColor: Colors.surfaceLifted,
    borderColor: '#1a4480',
    borderWidth: 1,
    borderRadius: Spacing.one,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.primaryAccent,
    minHeight: 40,
    marginBottom: Spacing.two,
  },
  allPlayersList: {
    gap: Spacing.two,
    paddingBottom: Spacing.four,
  },
  rosterScroll: {
    gap: Spacing.two,
    paddingBottom: Spacing.four,
  },
  emptyRosterText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.secondaryAccent,
    textAlign: 'center',
    paddingVertical: Spacing.four,
    opacity: 0.6,
  },
  rosterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLifted,
    borderRadius: Spacing.two,
    padding: Spacing.two,
    gap: Spacing.three,
    minHeight: 56,
  },
  rosterSlotTag: {
    backgroundColor: '#0a1530',
    borderColor: '#1a4480',
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    width: 72,
    alignItems: 'center',
  },
  rosterSlotTagText: {
    fontFamily: Fonts.stats,
    fontSize: 8,
    color: Colors.secondaryAccent,
    fontWeight: 'bold',
  },
});
