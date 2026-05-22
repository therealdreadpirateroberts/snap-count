"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LeaderboardScreen;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const useMockMaxxingStore_1 = require("../store/useMockMaxxingStore");
const useAuthStore_1 = require("../store/useAuthStore");
const theme_1 = require("../constants/theme");
const useThemeStore_1 = require("../store/useThemeStore");
const BackgroundTexture_1 = __importDefault(require("../components/BackgroundTexture"));
const AppHeader_1 = __importDefault(require("../components/AppHeader"));
const AppTabBar_1 = __importDefault(require("../components/AppTabBar"));
const Haptics = __importStar(require("expo-haptics"));
function LeaderboardScreen() {
    const Colors = (0, theme_1.useColors)();
    const { width } = (0, react_native_1.useWindowDimensions)();
    const isMobile = width < 680;
    const router = (0, expo_router_1.useRouter)();
    const triggerHaptic = async (style = Haptics.ImpactFeedbackStyle.Light) => {
        if (react_native_1.Platform.OS !== 'web') {
            try {
                await Haptics.impactAsync(style);
            }
            catch (err) {
                console.warn('Haptics failed:', err);
            }
        }
    };
    const { liveSimStats, liveSimRunning, startLiveSimulationLoop, stopLiveSimulationLoop } = (0, useMockMaxxingStore_1.useMockMaxxingStore)();
    // Load and display the accumulated background simulation standings.
    // The local runner loop is auto-started on mount and stopped on unmount.
    (0, react_1.useEffect)(() => {
        startLiveSimulationLoop();
        return () => {
            stopLiveSimulationLoop();
        };
    }, [startLiveSimulationLoop, stopLiveSimulationLoop]);
    const formatNumber = (num) => {
        return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    // Safe division helper
    const getWinRate = (wins, losses) => {
        const total = wins + losses;
        if (total === 0)
            return 0;
        return Math.round((wins / total) * 100);
    };
    // Combine all names that should be represented on the leaderboard to allow direct stack ranking
    const registeredUsers = useAuthStore_1.useAuthStore.getState().registeredUsers;
    const registeredUserNames = Object.values(registeredUsers)
        .map(u => u.name)
        .filter(name => {
        const lower = name.toLowerCase();
        // Keep Brad's session
        if (lower.includes('brad'))
            return true;
        // Exclude the default seeded bots because they are already represented in standardBots via their first names
        const defaultBotUsernames = [
            '@andy_coach', '@mike_guru', '@jason_wizard', '@sarah_maxxer', '@david_drafter',
            '@jessica_dynasty', '@michael_pro', '@emily_legend', '@james_champ', '@ashley_elite',
            '@robert_stats', '@sophia_zerorb', '@william_premium'
        ];
        if (defaultBotUsernames.includes(lower))
            return false;
        // Exclude simulated, test, or QA telemetry accounts
        return !lower.includes('drafter') &&
            !lower.includes('simulated') &&
            !lower.includes('inspector') &&
            !lower.includes('qa') &&
            !lower.includes('test') &&
            lower !== 'coach' &&
            lower !== 'your team';
    });
    const activeUserTeamName = (0, useMockMaxxingStore_1.getUserTeamName)();
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
        if (totalB !== totalA)
            return totalB - totalA;
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
    const userRankIndex = botsSorted.findIndex(bot => bot.name === activeUserTeamName ||
        bot.name === 'Your Team' ||
        bot.name === 'QA Telemetry Inspector' ||
        bot.name === 'Coach' ||
        bot.name === '@Brad_Drafter' ||
        bot.name === 'Brad');
    const userRank = userRankIndex !== -1 ? userRankIndex + 1 : null;
    const totalCompetitors = botsSorted.length;
    const percentile = userRank ? Math.max(1, Math.round(((totalCompetitors - userRank + 1) / totalCompetitors) * 100)) : 0;
    // Simulation completeness percentage targeting the 10,000 Monte Carlo drafts limit
    const simCompletedPct = Math.min(100, Math.round((liveSimStats.totalSims / 10000) * 100));
    return (<react_native_1.View style={styles.container}>
      <BackgroundTexture_1.default />
      <react_native_safe_area_context_1.SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* HEADER BAR */}
        <AppHeader_1.default title="LEAGUE STANDINGS" subtitle="Unified Coach & Pro Agent Leaderboards" showBack={true} backAction={() => router.push('/')} backText="LANDING"/>

        <react_native_1.ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
          
          {/* MAIN STATS BOARD */}
          <react_native_1.View style={styles.controlCard}>
            <react_native_1.View style={styles.statsPanelGrid}>
              <react_native_1.View style={styles.statsMiniCard}>
                <react_native_1.Text style={styles.miniLabel}>DRAFTS RUN</react_native_1.Text>
                <react_native_1.Text style={styles.miniValue}>{formatNumber(liveSimStats.totalSims)}</react_native_1.Text>
              </react_native_1.View>

              <react_native_1.View style={styles.statsMiniCard}>
                <react_native_1.Text style={styles.miniLabel}>TOTAL ROSTERS</react_native_1.Text>
                <react_native_1.Text style={styles.miniValue}>{formatNumber(liveSimStats.totalSims * 12)}</react_native_1.Text>
              </react_native_1.View>

              <react_native_1.View style={styles.statsMiniCard}>
                <react_native_1.Text style={styles.miniLabel}>SIMULATION STATUS</react_native_1.Text>
                <react_native_1.Pressable style={styles.statusToggleBtn} onPress={() => {
            triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
            if (liveSimRunning) {
                stopLiveSimulationLoop();
            }
            else {
                startLiveSimulationLoop();
            }
        }}>
                  <react_native_1.Text style={[styles.statusToggleText, { color: liveSimRunning ? '#FFE066' : '#ef4444' }]}>
                    {liveSimRunning ? '🟢 ACTIVE (PAUSE)' : '⏸️ PAUSED (RESUME)'}
                  </react_native_1.Text>
                </react_native_1.Pressable>
              </react_native_1.View>
            </react_native_1.View>
          </react_native_1.View>

          {liveSimStats.totalSims === 0 ? (<react_native_1.View style={styles.emptyContainer}>
              <react_native_1.ActivityIndicator size="large" color={Colors.hofYellow}/>
              <react_native_1.Text style={styles.emptyText}>Simulator is initializing. Standby for Monte Carlo data...</react_native_1.Text>
            </react_native_1.View>) : (<>
              {/* HIG RANK SUMMARY HIGHLIGHT CARD */}
              {userRank !== null && (<react_native_1.View style={styles.userRankHighlightCard}>
                  <react_native_1.View style={styles.rankBadgeLarge}>
                    <react_native_1.Text style={styles.rankBadgeNumber}>#{userRank}</react_native_1.Text>
                    <react_native_1.Text style={styles.rankBadgeLabel}>RANK</react_native_1.Text>
                  </react_native_1.View>
                  <react_native_1.View style={styles.rankHighlightDetails}>
                    <react_native_1.Text style={styles.rankHighlightTitle}>COMPETITIVE STANDINGS</react_native_1.Text>
                    <react_native_1.Text style={styles.rankHighlightDesc}>
                      You rank <react_native_1.Text style={{ color: Colors.primaryAccent, fontWeight: 'bold' }}>#{userRank}</react_native_1.Text> out of <react_native_1.Text style={{ color: Colors.primaryAccent, fontWeight: 'bold' }}>{totalCompetitors}</react_native_1.Text> participants on the unified standings leaderboard.
                    </react_native_1.Text>
                    <react_native_1.View style={styles.percentileContainer}>
                      <react_native_1.View style={[styles.percentileBar, { width: `${percentile}%` }]}/>
                      <react_native_1.Text style={styles.percentileText}>Top {Math.max(1, 101 - percentile)}% of all active coaches</react_native_1.Text>
                    </react_native_1.View>
                  </react_native_1.View>
                </react_native_1.View>)}

              {/* STACKED LEADERBOARD OF BOTS AND REGISTERED USERS */}
              <react_native_1.View style={styles.dashboardCard}>
                <react_native_1.Text style={styles.cardHeaderTitle}>LEAGUE STANDINGS (STRETCH RECORD)</react_native_1.Text>
                <react_native_1.Text style={styles.cardHeaderSubtitle}>Win-Loss ratios of coaches & pro agents rotating draft slots sequentially</react_native_1.Text>
                
                <react_native_1.View style={styles.leaderboardList}>
                  {botsSorted.map((bot, index) => {
                const totalWins = Math.round(bot.wins);
                const totalLosses = Math.round(bot.losses);
                const isCurrentUser = bot.name === activeUserTeamName ||
                    bot.name === 'Your Team' ||
                    bot.name === 'QA Telemetry Inspector' ||
                    bot.name === 'Coach' ||
                    bot.name === '@Brad_Drafter' ||
                    bot.name === 'Brad';
                const isOtherUser = Object.values(registeredUsers).some(u => u.name === bot.name) && !isCurrentUser;
                return (<react_native_1.View key={bot.name} style={[styles.leaderboardRow, isCurrentUser && styles.leaderboardRowCoach]}>
                        <react_native_1.View style={styles.rankCol}>
                          <react_native_1.Text style={styles.rankText}>#{index + 1}</react_native_1.Text>
                        </react_native_1.View>

                        <react_native_1.View style={styles.nameCol}>
                          <react_native_1.Text style={styles.botNameText}>{bot.name}</react_native_1.Text>
                          {isCurrentUser ? (<react_native_1.View style={[styles.badge, styles.badgeCoach]}>
                              <react_native_1.Text style={styles.badgeTextCoach}>YOU</react_native_1.Text>
                            </react_native_1.View>) : isOtherUser ? (<react_native_1.View style={[styles.badge, styles.badgeOtherUser]}>
                              <react_native_1.Text style={styles.badgeTextOtherUser}>COACH</react_native_1.Text>
                            </react_native_1.View>) : bot.name.includes('Drafter') || bot.name.includes('Simulated') ? (<react_native_1.View style={[styles.badge, styles.badgeSimulated]}>
                              <react_native_1.Text style={styles.badgeTextSimulated}>SIMULATED</react_native_1.Text>
                            </react_native_1.View>) : (<react_native_1.View style={[styles.badge, styles.badgePro]}>
                              <react_native_1.Text style={styles.badgeTextPro}>PRO AGENT</react_native_1.Text>
                            </react_native_1.View>)}
                        </react_native_1.View>

                        <react_native_1.View style={styles.recordCol}>
                          <react_native_1.Text style={styles.recordText}>{formatNumber(totalWins)}W - {formatNumber(totalLosses)}L</react_native_1.Text>
                          <react_native_1.Text style={styles.pctText}>{bot.winRate}% WR</react_native_1.Text>
                        </react_native_1.View>
                      </react_native_1.View>);
            })}
                </react_native_1.View>
              </react_native_1.View>

              {/* DUAL COHORT GRID */}
              <react_native_1.View style={[styles.dualGrid, { flexDirection: isMobile ? 'column' : 'row' }]}>
                {/* STRATEGY CAMPS GRID */}
                <react_native_1.View style={[styles.dashboardCard, !isMobile && { flex: 1.1 }]}>
                  <react_native_1.Text style={styles.cardHeaderTitle}>STRATEGY CAMPS W/L</react_native_1.Text>
                  <react_native_1.Text style={styles.cardHeaderSubtitle}>Head-to-head performance of roster styles</react_native_1.Text>
                  
                  <react_native_1.View style={styles.campTable}>
                    {strategiesSorted.map((strategy) => (<react_native_1.View key={strategy.camp} style={styles.tableRow}>
                        <react_native_1.View style={styles.tableLabelCol}>
                          <react_native_1.Text style={styles.strategyName}>{strategy.camp}</react_native_1.Text>
                        </react_native_1.View>
                        <react_native_1.View style={styles.tableDataCol}>
                          <react_native_1.Text style={styles.tableRecord}>
                            {formatNumber(strategy.wins)} - {formatNumber(strategy.losses)}
                          </react_native_1.Text>
                          <react_native_1.Text style={styles.tablePct}>{strategy.winRate}%</react_native_1.Text>
                        </react_native_1.View>
                      </react_native_1.View>))}
                  </react_native_1.View>
                </react_native_1.View>

                {/* DRAFT SLOT ADVANTAGE */}
                <react_native_1.View style={[styles.dashboardCard, !isMobile && { flex: 0.9 }]}>
                  <react_native_1.Text style={styles.cardHeaderTitle}>DRAFT SLOT ADVANTAGE</react_native_1.Text>
                  <react_native_1.Text style={styles.cardHeaderSubtitle}>Win rates based on starting draft position</react_native_1.Text>

                  <react_native_1.View style={styles.slotGridContainer}>
                    {slotsSorted.map((slot) => (<react_native_1.View key={slot.slot} style={styles.slotRow}>
                        <react_native_1.Text style={styles.slotLabel}>Pick {slot.slot}</react_native_1.Text>
                        <react_native_1.View style={styles.slotBarContainer}>
                          <react_native_1.View style={[styles.slotBarFill, { width: `${slot.winRate}%` }]}/>
                        </react_native_1.View>
                        <react_native_1.Text style={styles.slotPct}>{slot.winRate}%</react_native_1.Text>
                      </react_native_1.View>))}
                  </react_native_1.View>
                </react_native_1.View>
              </react_native_1.View>

            </>)}

          {/* FOOTER METRICS */}
          <react_native_1.View style={styles.footer}>
            <react_native_1.Text style={styles.footerText}>SIMULATOR EXHAUSTING AT ~312 DRAFTS/SEC • CONTINUOUS GENETIC MC LOOP</react_native_1.Text>
            <react_native_1.Text style={styles.footerVersion}>MOCKMAXXING ENGINE V2.0 • 2026 NFL PROJECTIONS BOUND</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.ScrollView>
      </react_native_safe_area_context_1.SafeAreaView>
      <AppTabBar_1.default />
    </react_native_1.View>);
}
function createStyles(Colors) {
    return react_native_1.StyleSheet.create({
        container: {
            flex: 1,
        },
        safeArea: {
            flex: 1,
            alignSelf: 'center',
            width: '100%',
            maxWidth: theme_1.MaxContentWidth,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: theme_1.Spacing.three,
            paddingVertical: theme_1.Spacing.three,
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
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9,
            fontWeight: 'bold',
            color: '#ffffff',
        },
        headerTitleContainer: {
            alignItems: 'center',
        },
        headerTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 20,
            fontWeight: 'bold',
            color: '#ffffff',
            letterSpacing: -0.5,
        },
        headerSubtitle: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 9,
            color: Colors.secondaryAccent,
            marginTop: 1,
        },
        scrollArea: {
            flex: 1,
            paddingHorizontal: theme_1.Spacing.three,
        },
        scrollContent: {
            paddingTop: theme_1.Spacing.three,
            paddingBottom: 120,
            gap: theme_1.Spacing.three,
        },
        controlCard: {
            backgroundColor: Colors.glassSurface,
            borderColor: Colors.glassBorder,
            borderWidth: 1,
            borderRadius: 12,
            padding: theme_1.Spacing.three,
            gap: theme_1.Spacing.three,
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
            fontFamily: theme_1.Fonts.stats,
            fontSize: 7,
            color: Colors.secondaryAccent,
            letterSpacing: 0.5,
        },
        miniValue: {
            fontFamily: theme_1.Fonts.headings,
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
            padding: theme_1.Spacing.three,
            ...Colors.shadows,
        },
        cardHeaderTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 14,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            letterSpacing: 0.5,
        },
        cardHeaderSubtitle: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 9,
            color: Colors.secondaryAccent,
            marginTop: 2,
            marginBottom: theme_1.Spacing.three,
        },
        emptyContainer: {
            paddingVertical: 50,
            alignItems: 'center',
            gap: 12,
        },
        emptyText: {
            fontFamily: theme_1.Fonts.body,
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
            fontFamily: theme_1.Fonts.stats,
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
            fontFamily: theme_1.Fonts.body,
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
            fontFamily: theme_1.Fonts.stats,
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
            fontFamily: theme_1.Fonts.stats,
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
            fontFamily: theme_1.Fonts.stats,
            fontSize: 7.5,
            fontWeight: 'bold',
            color: Colors.status.danger,
        },
        recordCol: {
            width: 140,
            alignItems: 'flex-end',
        },
        recordText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
        },
        pctText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 7.5,
            color: Colors.secondaryAccent,
        },
        dualGrid: {
            flexDirection: react_native_1.Platform.select({ web: 'row', default: 'column' }),
            gap: theme_1.Spacing.three,
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
            fontFamily: theme_1.Fonts.body,
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
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9.5,
            color: Colors.secondaryAccent,
        },
        tablePct: {
            fontFamily: theme_1.Fonts.stats,
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
            fontFamily: theme_1.Fonts.stats,
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
            fontFamily: theme_1.Fonts.stats,
            fontSize: 7.5,
            color: Colors.primaryAccent,
            width: 25,
            textAlign: 'right',
        },
        footer: {
            alignItems: 'center',
            paddingVertical: theme_1.Spacing.four,
            gap: 2,
        },
        footerText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            color: Colors.secondaryAccent,
            opacity: 0.5,
            letterSpacing: 0.5,
        },
        footerVersion: {
            fontFamily: theme_1.Fonts.stats,
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
            fontFamily: theme_1.Fonts.headings,
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
            fontFamily: theme_1.Fonts.headings,
            fontSize: 20,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
        },
        rankBadgeLabel: {
            fontFamily: theme_1.Fonts.stats,
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
            fontFamily: theme_1.Fonts.headings,
            fontSize: 9,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            letterSpacing: 0.5,
        },
        rankHighlightDesc: {
            fontFamily: theme_1.Fonts.body,
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
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            color: Colors.secondaryAccent,
        },
        badgeOtherUser: {
            backgroundColor: 'rgba(224, 49, 34, 0.08)',
            borderWidth: 0.5,
            borderColor: 'rgba(224, 49, 34, 0.2)',
        },
        badgeTextOtherUser: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 7.5,
            fontWeight: 'bold',
            color: Colors.status.danger,
        },
    });
}
const lightStyles = createStyles(theme_1.LightColors);
const darkStyles = createStyles(theme_1.DarkColors);
const styles = new Proxy({}, {
    get(target, prop) {
        const theme = useThemeStore_1.useThemeStore.getState().theme;
        return theme === 'dark' ? darkStyles[prop] : lightStyles[prop];
    }
});
