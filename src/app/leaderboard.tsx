import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Platform, ActivityIndicator, useWindowDimensions, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSimulationStore } from '../store/useSimulationStore';
import { getUserTeamName } from '../store/_helpers';
import { useAuthStore } from '../store/useAuthStore';
import { Colors, Fonts, Spacing, MaxContentWidth, useColors, LightColors, DarkColors } from '../constants/theme';
import { useThemeStore } from '../store/useThemeStore';
import BackgroundTexture from '../components/BackgroundTexture';
import AppHeader from '../components/AppHeader';
import AppTabBar from '../components/AppTabBar';
import * as Haptics from 'expo-haptics';
import { ErrorBoundary } from '../components/ErrorBoundary';

function LeaderboardContent() {
  const Colors = useColors();
  const { width } = useWindowDimensions();
  const isMobile = width < 680;
  const router = useRouter();

  const triggerHaptic = async (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(style);
      } catch (err) {
        console.warn('Haptics failed:', err);
      }
    }
  };

  const {
    liveSimStats,
    liveSimRunning,
    startLiveSimulationLoop,
    stopLiveSimulationLoop
  } = useSimulationStore();

  // Load and display the accumulated background simulation standings.
  // The local runner loop is auto-started on mount and stopped on unmount.
  useEffect(() => {
    startLiveSimulationLoop();
    return () => {
      stopLiveSimulationLoop();
    };
  }, [startLiveSimulationLoop, stopLiveSimulationLoop]);

  const formatNumber = (num: number) => {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Safe division helper
  const getWinRate = (wins: number, losses: number) => {
    const total = wins + losses;
    if (total === 0) return 0;
    return Math.round((wins / total) * 100);
  };

  // Combine all names that should be represented on the leaderboard to allow direct stack ranking
  const registeredUsers = useAuthStore.getState().registeredUsers;
  const registeredUserNames = Object.values(registeredUsers)
    .map(u => u.name)
    .filter(name => {
      const lower = name.toLowerCase();
      // Keep Brad's session
      if (lower.includes('brad')) return true;
      
      // Exclude the default seeded bots because they are already represented in standardBots via their first names
      const defaultBotUsernames = [
        '@andy_coach', '@mike_guru', '@jason_wizard', '@sarah_maxxer', '@david_drafter',
        '@jessica_dynasty', '@michael_pro', '@emily_legend', '@james_champ', '@ashley_elite',
        '@robert_stats', '@sophia_zerorb', '@william_premium'
      ];
      if (defaultBotUsernames.includes(lower)) return false;

      // Exclude simulated, test, or QA telemetry accounts
      return !lower.includes('drafter') && 
             !lower.includes('simulated') && 
             !lower.includes('inspector') && 
             !lower.includes('qa') &&
             !lower.includes('test') &&
             lower !== 'coach' &&
             lower !== 'your team';
    });
  const activeUserTeamName = getUserTeamName();
  
  const standardBots = [
    'Andy', 'Mike', 'Jason', 'Sarah', 'David', 'Jessica', 'Michael', 
    'Emily', 'James', 'Ashley', 'Robert', 'Sophia', 'William'
  ];
  
  const allStandingsNames = Array.from(new Set([
    activeUserTeamName,
    ...registeredUserNames,
    ...standardBots
  ]));

  // Convert stats maps to sorted arrays representing all competitors
  const botsSorted = allStandingsNames
    .map(name => {
      const record = liveSimStats.botRecords[name] || { wins: 0, losses: 0 };
      return {
        name,
        wins: record.wins,
        losses: record.losses,
        winRate: getWinRate(record.wins, record.losses)
      };
    })
    .sort((a, b) => {
      if (b.winRate !== a.winRate) {
        return b.winRate - a.winRate;
      }
      // Tie-breaker: total drafts simulated, then alphabetical
      const totalA = a.wins + a.losses;
      const totalB = b.wins + b.losses;
      if (totalB !== totalA) return totalB - totalA;
      return a.name.localeCompare(b.name);
    });

  const strategiesSorted = Object.entries(liveSimStats.strategyRecords)
    .map(([camp, record]) => ({
      camp,
      wins: record.wins,
      losses: record.losses,
      winRate: getWinRate(record.wins, record.losses)
    }))
    .sort((a, b) => b.winRate - a.winRate);

  const slotsSorted = Object.entries(liveSimStats.slotRecords)
    .map(([slot, record]) => ({
      slot: parseInt(slot, 10),
      wins: record.wins,
      losses: record.losses,
      winRate: getWinRate(record.wins, record.losses)
    }))
    .sort((a, b) => a.slot - b.slot); // Keep in draft order 1-12

  // Calculate the user's competitive rank and percentile bracket among all active users
  const userRankIndex = botsSorted.findIndex(bot => 
    bot.name === activeUserTeamName || 
    bot.name === 'Your Team' || 
    bot.name === 'QA Telemetry Inspector' || 
    bot.name === 'Coach' || 
    bot.name === '@Brad_Drafter' || 
    bot.name === 'Brad'
  );
  const userRank = userRankIndex !== -1 ? userRankIndex + 1 : null;
  const totalCompetitors = botsSorted.length;
  const percentile = userRank ? Math.max(1, Math.round(((totalCompetitors - userRank + 1) / totalCompetitors) * 100)) : 0;

  // Simulation completeness percentage targeting the 10,000 Monte Carlo drafts limit
  const simCompletedPct = Math.min(100, Math.round((liveSimStats.totalSims / 10000) * 100));

  return (
    <View style={styles.container}>
      <BackgroundTexture />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* HEADER BAR */}
        <AppHeader
          title="LEAGUE STANDINGS"
          subtitle="Unified Coach & Pro Agent Leaderboards"
          showBack={true}
          backAction={() => router.push('/')}
          backText="LANDING"
        />

        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
          
          {/* MAIN STATS BOARD */}
          <View style={styles.controlCard}>
            <View style={styles.statsPanelGrid}>
              <View style={styles.statsMiniCard}>
                <Text style={styles.miniLabel}>DRAFTS RUN</Text>
                <Text style={styles.miniValue}>{formatNumber(liveSimStats.totalSims)}</Text>
              </View>

              <View style={styles.statsMiniCard}>
                <Text style={styles.miniLabel}>TOTAL ROSTERS</Text>
                <Text style={styles.miniValue}>{formatNumber(liveSimStats.totalSims * 12)}</Text>
              </View>

              <View style={styles.statsMiniCard}>
                <Text style={styles.miniLabel}>SIMULATION STATUS</Text>
                <Pressable
                  style={styles.statusToggleBtn}
                  onPress={() => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                    if (liveSimRunning) {
                      stopLiveSimulationLoop();
                    } else {
                      startLiveSimulationLoop();
                    }
                  }}
                >
                  <Text style={[styles.statusToggleText, { color: liveSimRunning ? '#FFE066' : '#ef4444' }]}>
                    {liveSimRunning ? '🟢 ACTIVE (PAUSE)' : '⏸️ PAUSED (RESUME)'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {liveSimStats.totalSims === 0 ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color={Colors.hofYellow} />
              <Text style={styles.emptyText}>Simulator is initializing. Standby for Monte Carlo data...</Text>
            </View>
          ) : (
            <>
              {/* HIG RANK SUMMARY HIGHLIGHT CARD */}
              {userRank !== null && (
                <View style={styles.userRankHighlightCard}>
                  <View style={styles.rankBadgeLarge}>
                    <Text style={styles.rankBadgeNumber}>#{userRank}</Text>
                    <Text style={styles.rankBadgeLabel}>RANK</Text>
                  </View>
                  <View style={styles.rankHighlightDetails}>
                    <Text style={styles.rankHighlightTitle}>COMPETITIVE STANDINGS</Text>
                    <Text style={styles.rankHighlightDesc}>
                      You rank <Text style={{ color: Colors.primaryAccent, fontWeight: 'bold' }}>#{userRank}</Text> out of <Text style={{ color: Colors.primaryAccent, fontWeight: 'bold' }}>{totalCompetitors}</Text> participants on the unified standings leaderboard.
                    </Text>
                    <View style={styles.percentileContainer}>
                      <View style={[styles.percentileBar, { width: `${percentile}%` }]} />
                      <Text style={styles.percentileText}>Top {Math.max(1, 101 - percentile)}% of all active coaches</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* STACKED LEADERBOARD OF BOTS AND REGISTERED USERS */}
              <View style={styles.dashboardCard}>
                <Text style={styles.cardHeaderTitle}>LEAGUE STANDINGS (STRETCH RECORD)</Text>
                <Text style={styles.cardHeaderSubtitle}>Win-Loss ratios of coaches & pro agents rotating draft slots sequentially</Text>
                
                <View style={styles.leaderboardList}>
                  {botsSorted.map((bot, index) => {
                    const totalWins = Math.round(bot.wins);
                    const totalLosses = Math.round(bot.losses);
                    
                    const isCurrentUser = 
                      bot.name === activeUserTeamName || 
                      bot.name === 'Your Team' || 
                      bot.name === 'QA Telemetry Inspector' || 
                      bot.name === 'Coach' || 
                      bot.name === '@Brad_Drafter' || 
                      bot.name === 'Brad';
                    const isOtherUser = Object.values(registeredUsers).some(u => u.name === bot.name) && !isCurrentUser;
                    
                    return (
                      <View key={bot.name} style={[styles.leaderboardRow, isCurrentUser && styles.leaderboardRowCoach]}>
                        <View style={styles.rankCol}>
                          <Text style={styles.rankText}>#{index + 1}</Text>
                        </View>

                        <View style={styles.nameCol}>
                          <Text style={styles.botNameText}>{bot.name}</Text>
                          {isCurrentUser ? (
                            <View style={[styles.badge, styles.badgeCoach]}>
                              <Text style={styles.badgeTextCoach}>YOU</Text>
                            </View>
                          ) : isOtherUser ? (
                            <View style={[styles.badge, styles.badgeOtherUser]}>
                              <Text style={styles.badgeTextOtherUser}>COACH</Text>
                            </View>
                          ) : bot.name.includes('Drafter') || bot.name.includes('Simulated') ? (
                            <View style={[styles.badge, styles.badgeSimulated]}>
                              <Text style={styles.badgeTextSimulated}>SIMULATED</Text>
                            </View>
                          ) : (
                            <View style={[styles.badge, styles.badgePro]}>
                              <Text style={styles.badgeTextPro}>PRO AGENT</Text>
                            </View>
                          )}
                        </View>

                        <View style={styles.recordCol}>
                          <Text style={styles.recordText}>{formatNumber(totalWins)}W - {formatNumber(totalLosses)}L</Text>
                          <Text style={styles.pctText}>{bot.winRate}% WR</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* DUAL COHORT GRID */}
              <View style={[styles.dualGrid, { flexDirection: isMobile ? 'column' : 'row' }]}>
                {/* STRATEGY CAMPS GRID */}
                <View style={[styles.dashboardCard, !isMobile && { flex: 1.1 }]}>
                  <Text style={styles.cardHeaderTitle}>STRATEGY CAMPS W/L</Text>
                  <Text style={styles.cardHeaderSubtitle}>Head-to-head performance of roster styles</Text>
                  
                  <View style={styles.campTable}>
                    {strategiesSorted.map((strategy) => (
                      <View key={strategy.camp} style={styles.tableRow}>
                        <View style={styles.tableLabelCol}>
                          <Text style={styles.strategyName}>{strategy.camp}</Text>
                        </View>
                        <View style={styles.tableDataCol}>
                          <Text style={styles.tableRecord}>
                            {formatNumber(strategy.wins)} - {formatNumber(strategy.losses)}
                          </Text>
                          <Text style={styles.tablePct}>{strategy.winRate}%</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>

                {/* DRAFT SLOT ADVANTAGE */}
                <View style={[styles.dashboardCard, !isMobile && { flex: 0.9 }]}>
                  <Text style={styles.cardHeaderTitle}>DRAFT SLOT ADVANTAGE</Text>
                  <Text style={styles.cardHeaderSubtitle}>Win rates based on starting draft position</Text>

                  <View style={styles.slotGridContainer}>
                    {slotsSorted.map((slot) => (
                      <View key={slot.slot} style={styles.slotRow}>
                        <Text style={styles.slotLabel}>Pick {slot.slot}</Text>
                        <View style={styles.slotBarContainer}>
                          <View style={[styles.slotBarFill, { width: `${slot.winRate}%` }]} />
                        </View>
                        <Text style={styles.slotPct}>{slot.winRate}%</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

            </>
          )}

          {/* FOOTER METRICS */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>SIMULATOR EXHAUSTING AT ~312 DRAFTS/SEC • CONTINUOUS GENETIC MC LOOP</Text>
            <Text style={styles.footerVersion}>MOCKMAXXING ENGINE V2.0 • 2026 NFL PROJECTIONS BOUND</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
      <AppTabBar />
    </View>
  );
}

export default function LeaderboardScreen() {
  return (
    <ErrorBoundary>
      <LeaderboardContent />
    </ErrorBoundary>
  );
}

function createStyles(Colors: typeof LightColors) {
  return StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: '#09090b',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  backButtonText: {
    fontFamily: Fonts.stats,
    fontSize: 9,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.headings,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 9,
    color: Colors.secondaryAccent,
    marginTop: 1,
  },

  scrollArea: {
    flex: 1,
    paddingHorizontal: Spacing.three,
  },
  scrollContent: {
    paddingTop: Spacing.three,
    paddingBottom: 120,
    gap: Spacing.three,
  },
  controlCard: {
    backgroundColor: Colors.glassSurface,
    borderColor: Colors.glassBorder,
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.three,
    gap: Spacing.three,
    ...Colors.shadows,
  },

  statsPanelGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statsMiniCard: {
    flex: 1,
    backgroundColor: Colors.glassSurfaceLight,
    borderColor: Colors.glassBorder,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 3,
    ...Colors.shadows,
  },
  miniLabel: {
    fontFamily: Fonts.stats,
    fontSize: 7,
    color: Colors.secondaryAccent,
    letterSpacing: 0.5,
  },
  miniValue: {
    fontFamily: Fonts.headings,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
  },
  healthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dashboardCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.coltsNavyLight,
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.three,
    ...Colors.shadows,
  },
  cardHeaderTitle: {
    fontFamily: Fonts.headings,
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
    letterSpacing: 0.5,
  },
  cardHeaderSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 9,
    color: Colors.secondaryAccent,
    marginTop: 2,
    marginBottom: Spacing.three,
  },
  emptyContainer: {
    paddingVertical: 50,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.secondaryAccent,
    textAlign: 'center',
  },
  leaderboardList: {
    gap: 8,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderColor: Colors.glassBorder,
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 48,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  leaderboardRowCoach: {
    borderColor: Colors.glassBorderGold,
    backgroundColor: 'rgba(255, 205, 0, 0.08)', // Light yellow wash
  },
  rankCol: {
    width: 25,
  },
  rankText: {
    fontFamily: Fonts.stats,
    fontSize: 9,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
  },
  nameCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  botNameText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeCoach: {
    backgroundColor: Colors.hofYellow,
  },
  badgeTextCoach: {
    fontFamily: Fonts.stats,
    fontSize: 7.5,
    fontWeight: 'bold',
    color: '#000000', // Solid black text (12.6:1 contrast)
  },
  badgeSimulated: {
    backgroundColor: 'rgba(71, 85, 105, 0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(71, 85, 105, 0.2)',
  },
  badgeTextSimulated: {
    fontFamily: Fonts.stats,
    fontSize: 7.5,
    fontWeight: 'bold',
    color: Colors.secondaryAccent,
  },
  badgePro: {
    backgroundColor: 'rgba(224, 49, 34, 0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(224, 49, 34, 0.2)',
  },
  badgeTextPro: {
    fontFamily: Fonts.stats,
    fontSize: 7.5,
    fontWeight: 'bold',
    color: Colors.status.danger,
  },
  recordCol: {
    width: 140,
    alignItems: 'flex-end',
  },
  recordText: {
    fontFamily: Fonts.stats,
    fontSize: 9,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
  },
  pctText: {
    fontFamily: Fonts.stats,
    fontSize: 7.5,
    color: Colors.secondaryAccent,
  },
  dualGrid: {
    flexDirection: Platform.select({ web: 'row', default: 'column' }) as any,
    gap: Spacing.three,
  },
  campTable: {
    gap: 8,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  tableLabelCol: {
    flex: 1.2,
  },
  strategyName: {
    fontFamily: Fonts.body,
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
  },
  tableDataCol: {
    flex: 0.8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableRecord: {
    fontFamily: Fonts.stats,
    fontSize: 9.5,
    color: Colors.secondaryAccent,
  },
  tablePct: {
    fontFamily: Fonts.stats,
    fontSize: 9.5,
    fontWeight: 'bold',
    color: Colors.status.success,
  },
  slotGridContainer: {
    gap: 5,
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  slotLabel: {
    fontFamily: Fonts.stats,
    fontSize: 7.5,
    color: Colors.secondaryAccent,
    width: 40,
  },
  slotBarContainer: {
    flex: 1,
    height: 5,
    backgroundColor: Colors.surfaceLifted,
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  slotBarFill: {
    height: '100%',
    backgroundColor: Colors.hofYellow,
  },
  slotPct: {
    fontFamily: Fonts.stats,
    fontSize: 7.5,
    color: Colors.primaryAccent,
    width: 25,
    textAlign: 'right',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.four,
    gap: 2,
  },
  footerText: {
    fontFamily: Fonts.stats,
    fontSize: 8,
    color: Colors.secondaryAccent,
    opacity: 0.5,
    letterSpacing: 0.5,
  },
  footerVersion: {
    fontFamily: Fonts.stats,
    fontSize: 8,
    color: Colors.secondaryAccent,
    opacity: 0.4,
  },
  statusToggleBtn: {
    backgroundColor: 'rgba(224, 49, 34, 0.05)',
    borderColor: 'rgba(224, 49, 34, 0.15)',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  statusToggleText: {
    fontFamily: Fonts.headings,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  userRankHighlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.hofYellow,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    gap: 16,
    ...Colors.shadows,
  },
  rankBadgeLarge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255, 205, 0, 0.1)',
    borderColor: Colors.hofYellow,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeNumber: {
    fontFamily: Fonts.headings,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
  },
  rankBadgeLabel: {
    fontFamily: Fonts.stats,
    fontSize: 7,
    color: Colors.secondaryAccent,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginTop: -2,
  },
  rankHighlightDetails: {
    flex: 1,
    gap: 4,
  },
  rankHighlightTitle: {
    fontFamily: Fonts.headings,
    fontSize: 9,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
    letterSpacing: 0.5,
  },
  rankHighlightDesc: {
    fontFamily: Fonts.body,
    fontSize: 11.5,
    color: Colors.secondaryAccent,
    lineHeight: 16,
  },
  percentileContainer: {
    marginTop: 6,
    gap: 4,
  },
  percentileBar: {
    height: 3,
    backgroundColor: Colors.hofYellow,
    borderRadius: 1.5,
  },
  percentileText: {
    fontFamily: Fonts.stats,
    fontSize: 8,
    color: Colors.secondaryAccent,
  },
  badgeOtherUser: {
    backgroundColor: 'rgba(224, 49, 34, 0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(224, 49, 34, 0.2)',
  },
  badgeTextOtherUser: {
    fontFamily: Fonts.stats,
    fontSize: 7.5,
    fontWeight: 'bold',
    color: Colors.status.danger,
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
