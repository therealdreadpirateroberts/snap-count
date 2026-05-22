import React from 'react';
import { StyleSheet, View, Text, ScrollView, useWindowDimensions, Platform, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColors, Fonts } from '@/constants/theme';
import AppHeader from '@/components/AppHeader';
import AppTabBar from '@/components/AppTabBar';
import BackgroundTexture from '@/components/BackgroundTexture';
import FeedCard from '@/components/FeedCard';
import { useAuthStore } from '@/store/useAuthStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import OnboardingScreen from '@/components/OnboardingScreen';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

function LandingScreen() {
  const themedColors = useColors();
  const router = useRouter();
  const { user } = useAuthStore();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 1024;

  const {
    featuredSlot1Key,
    homepageTileCap
  } = usePlayerStore();

  if (!user) {
    return <OnboardingScreen />;
  }

  // Core Cards representing the 10 actionable features or tools
  const coreCards = [
    {
      id: 'mock-draft',
      kicker: 'CORE APPLICATION',
      title: 'ELITE MOCK DRAFT SUITE',
      description: 'Draft in real-time against our evolved neural bot swarm. Calibrate league size, rosters, and test draft strategy camps with dynamic ADP arbitrage telemetry.',
      btnLabel: 'MOCK NOW',
      route: '/wizard/setup',
      graphicType: 'mock' as const
    },
    {
      id: 'cheat-sheets',
      kicker: 'CUSTOM BOARD BUILDER',
      title: 'CONSENSUS ADP CHEAT SHEETS',
      description: 'Construct your ultimate board. Layer ECR projections, flag sleepers, adjust positional scarcity values, and lock key rankings before entering the draft war room.',
      btnLabel: 'CREATE SHEET',
      route: '/rankings',
      graphicType: 'sheets' as const
    },
    {
      id: 'leaderboard-stats',
      kicker: 'COACH GRADES & ANOMALIES',
      title: 'HISTORICAL DRAFT LEADERBOARDS',
      description: 'Review your past drafts. Track your GPA value scores over time, study your highest-value draft selections, and analyze positional arbitrage variance graphs.',
      btnLabel: 'VIEW STATS',
      route: '/leaderboard',
      graphicType: 'leaderboard' as const
    },
    {
      id: 'trade-center',
      kicker: 'DRAFT TRADE SUITE',
      title: 'INTERACTIVE SIMULATED TRADE ADVISOR',
      description: 'Evaluate draft trades with our AI trade telemetry engine. Assess roster impacts, value anomalies, and optimize trade equity on the fly.',
      btnLabel: 'MANAGE ALERTS',
      route: '/settings',
      graphicType: 'news' as const
    },
    {
      id: 'scarcity-wizard',
      kicker: 'BOARD BUILDER WIZARD',
      title: 'POSITIONAL SCARCITY SCANNERS',
      description: 'Calibrate custom scarcity multipliers. Lock down team needs, secure roster anchors, and leverage player tiers dynamically.',
      btnLabel: 'VIEW CHEAT SHEETS',
      route: '/rankings',
      graphicType: 'sheets' as const
    },
    {
      id: 'simulation-lab',
      kicker: 'EXECUTIVE SYSTEM HARNESS',
      title: 'MONTE CARLO SIMULATIONS LAB',
      description: 'Run high-frequency simulations to optimize bot strategies. Access live telemetry dashboards and bot crawl logs instantly.',
      btnLabel: 'SIMULATION HARNESS',
      route: '/qa-simulation',
      graphicType: 'swarm' as const
    },
    {
      id: 'roster-recap',
      kicker: 'POST-DRAFT GRADE TELEMETRY',
      title: 'ROSTER RECAP EVALUATOR',
      description: 'Instantly analyze completed drafts. Review your projected wins, playoff chances, value anomaly percentages, and overall GPA grades.',
      btnLabel: 'VIEW RECAPPED RUNS',
      route: '/recap',
      graphicType: 'leaderboard' as const
    },
    {
      id: 'top250',
      kicker: 'EXPERT ADP DENSITY',
      title: 'TOP 250 CONSENSUS MATRIX',
      description: 'Scan the consolidated Top 250 consensus matrix. Layer expert rankings base values, compare positional trends, and isolate sleeper targets.',
      btnLabel: 'SCAN THE MATRIX',
      route: '/rankings',
      graphicType: 'sheets' as const
    },
    {
      id: 'user-settings',
      kicker: 'COACH & NOTIFICATION CONFIG',
      title: 'USER PREFERENCES & CONTROL CENTER',
      description: 'Configure system options, theme switches, and inbox notifications. Manage permissions, user sessions, and reset data safely.',
      btnLabel: 'ACCOUNT SETTINGS',
      route: '/settings',
      graphicType: 'news' as const
    },
    {
      id: 'expert-ecr',
      kicker: 'LIVE EXPERT SCENARIOS',
      title: 'EXPERT CONSENSUS RANKINGS',
      description: 'Compare ECR consensus ranks against Andy, Mike, and Jason. Leverage dynamic positional scarcity indices and draft filters.',
      btnLabel: 'ECR DASHBOARD',
      route: '/rankings',
      graphicType: 'sheets' as const
    }
  ];

  // Dynamic re-ordering based on featuredSlot1Key
  const sortedCoreCards = [...coreCards];
  const promotedIndex = sortedCoreCards.findIndex(card => card.id === featuredSlot1Key);
  if (promotedIndex > 0) {
    const [promotedCard] = sortedCoreCards.splice(promotedIndex, 1);
    sortedCoreCards.unshift(promotedCard);
  }

  // Cap at dynamically configured tile cap (default 10)
  const activeTileCap = homepageTileCap !== undefined ? homepageTileCap : 10;
  const homepageTiles = sortedCoreCards.slice(0, activeTileCap).map(card => ({
    type: 'core' as const,
    data: card
  }));

  const handleTilePress = (route: string) => {
    router.push(route as any);
  };

  const renderCardFeed = () => {
    return (
      <View style={styles.feedContainer}>
        <View style={styles.tileGrid}>
          {homepageTiles.map((tile) => (
            <FeedCard 
              key={tile.data.id} 
              tile={tile} 
              isDesktop={isDesktop} 
              onPress={handleTilePress} 
            />
          ))}
        </View>
      </View>
    );
  };

  const renderSidebar = () => {
    return (
      <View style={[styles.sidebarCard, { backgroundColor: themedColors.surface, borderColor: themedColors.coltsNavyLight }]}>
        <Text style={[styles.sidebarTitle, { color: themedColors.primaryAccent }]}>MOCK MAXXING</Text>
        <Text style={[styles.sidebarDesc, { color: themedColors.secondaryAccent }]}>Real-time evolved bot profiles, analytics, and custom cheat sheets</Text>
        <View style={[styles.sidebarDivider, { backgroundColor: themedColors.coltsNavyLight }]} />
        <View style={styles.sidebarMenu}>
          <Text style={[styles.sidebarMenuItemActive, { color: themedColors.primaryAccent }]}>🏠 OVERVIEW</Text>
          <Pressable onPress={() => router.push('/wizard/setup')}><Text style={[styles.sidebarMenuItem, { color: themedColors.secondaryAccent }]}>🏈 MOCK DRAFT WIZARD</Text></Pressable>
          <Pressable onPress={() => router.push('/rankings')}><Text style={[styles.sidebarMenuItem, { color: themedColors.secondaryAccent }]}>📋 ADP CHEAT SHEETS</Text></Pressable>
          <Pressable onPress={() => router.push('/leaderboard')}><Text style={[styles.sidebarMenuItem, { color: themedColors.secondaryAccent }]}>🏆 DRAFT LEADERBOARD</Text></Pressable>
          <Pressable onPress={() => router.push('/qa-simulation')}><Text style={[styles.sidebarMenuItem, { color: themedColors.secondaryAccent }]}>🧪 SIMULATION HARNESS</Text></Pressable>
          <Pressable onPress={() => router.push('/settings')}><Text style={[styles.sidebarMenuItem, { color: themedColors.secondaryAccent }]}>⚙️ ACCOUNT CONFIG</Text></Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themedColors.background }]}>
      <BackgroundTexture />

      {/* Decorative Radial Stadium Lights Glows */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            <RadialGradient id="coltsBlueGlow" cx="15%" cy="30%" rx="45%" ry="45%" fx="15%" fy="30%">
              <Stop offset="0%" stopColor={themedColors.coltsBlueGlow} />
              <Stop offset="100%" stopColor="rgba(248, 250, 252, 0)" />
            </RadialGradient>
            <RadialGradient id="doordashRedGlow" cx="85%" cy="70%" rx="40%" ry="40%" fx="85%" fy="70%">
              <Stop offset="0%" stopColor={themedColors.doordashRedGlow} />
              <Stop offset="100%" stopColor="rgba(248, 250, 252, 0)" />
            </RadialGradient>
          </Defs>
          <Circle cx="15%" cy="30%" r="45%" fill="url(#coltsBlueGlow)" />
          <Circle cx="85%" cy="70%" r="50%" fill="url(#doordashRedGlow)" />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Horizontal responsive desktop split layout wrapper */}
        <View style={styles.mainSplitWrapper}>
          {/* Render left column navigation sidebar on large screens */}
          {isDesktop && renderSidebar()}

          {/* Right main workspace layout */}
          <View style={styles.rightWorkspace}>
            {isDesktop ? (
              <>
                {/* Header Area */}
                <View style={styles.workspaceHeader}>
                  <View style={styles.headerTitleArea}>
                    <Text style={styles.headerTitle}>COACH OVERVIEW DASHBOARD</Text>
                    <Text style={styles.headerSubtitle}>Real-time evolved bot profiles, analytics, and custom cheat sheets</Text>
                  </View>
                  <View style={styles.headerRightActions}>
                    <View style={styles.syncBadge}>
                      <View style={styles.syncDot} />
                      <Text style={styles.syncText}>SYNC ACTIVE</Text>
                    </View>
                  </View>
                </View>

                {/* Scrollable Workspace content viewports */}
                <ScrollView
                  style={styles.scrollArea}
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                >


                  {/* Starbucks-Style Uniform Card Feed */}
                  {renderCardFeed()}
                </ScrollView>
              </>
            ) : (
              // Mobile layout with premium scroll layout!
              <View style={{ flex: 1 }}>
                <ScrollView
                  style={styles.scrollArea}
                  contentContainerStyle={styles.scrollContentMobile}
                  showsVerticalScrollIndicator={false}
                >
                  {/* AppHeader + Greeting Banner */}
                  <View style={styles.mobileHeaderGroup}>
                    <AppHeader isLanding={true} />
                    
                    {/* Starbucks-style personalized greeting banner */}
                    <View style={styles.mobileGreetingBanner}>
                      <Text style={[styles.greetingMainText, { color: themedColors.primaryAccent }]}>
                        {((user?.firstName || 'COACH') + ", LET'S COOK.").toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {/* DRAFT NOW Floating CTA */}
                  <View style={styles.mobileCTAContainer}>
                    <Pressable
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
                        router.push('/wizard/setup');
                      }}
                      style={({ pressed }) => [
                        styles.draftNowBtn,
                        {
                          backgroundColor: themedColors.pylonOrange,
                          transform: [{ scale: pressed ? 0.95 : 1 }],
                        }
                      ]}
                    >
                      <Text style={styles.draftNowText}>DRAFT NOW</Text>
                    </Pressable>
                  </View>

                  {/* Pigskin Brown Leather Tray Content Panel */}
                  <View style={styles.leatherTray}>
                    <View style={styles.trayGrid}>
                      <Pressable
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                          router.push('/rankings');
                        }}
                        style={({ pressed }) => [
                          styles.trayBtn,
                          {
                            borderColor: themedColors.secondaryAccent,
                            transform: [{ scale: pressed ? 0.97 : 1 }]
                          }
                        ]}
                      >
                        <Text style={[styles.trayBtnText, { color: themedColors.secondaryAccent }]}>CHEAT SHEETS</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                          router.push('/leaderboard');
                        }}
                        style={({ pressed }) => [
                          styles.trayBtn,
                          {
                            borderColor: themedColors.secondaryAccent,
                            transform: [{ scale: pressed ? 0.97 : 1 }]
                          }
                        ]}
                      >
                        <Text style={[styles.trayBtnText, { color: themedColors.secondaryAccent }]}>LEADERBOARD</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                          router.push('/news');
                        }}
                        style={({ pressed }) => [
                          styles.trayBtn,
                          {
                            borderColor: themedColors.secondaryAccent,
                            transform: [{ scale: pressed ? 0.97 : 1 }]
                          }
                        ]}
                      >
                        <Text style={[styles.trayBtnText, { color: themedColors.secondaryAccent }]}>NEWS</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                          router.push('/settings');
                        }}
                        style={({ pressed }) => [
                          styles.trayBtn,
                          {
                            borderColor: themedColors.secondaryAccent,
                            transform: [{ scale: pressed ? 0.97 : 1 }]
                          }
                        ]}
                      >
                        <Text style={[styles.trayBtnText, { color: themedColors.secondaryAccent }]}>SETTINGS</Text>
                      </Pressable>
                    </View>
                  </View>

                  {/* Starbucks-Style Uniform Card Feed */}
                  <View style={{ paddingHorizontal: 16 }}>
                    {renderCardFeed()}
                  </View>
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>

      {/* Absolute persistent mobile tab navigation */}
      {!isDesktop && <AppTabBar />}
    </View>
  );
}

export default function SafeLandingScreen() {
  return (
    <ErrorBoundary>
      <LandingScreen />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  mainSplitWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarCard: {
    width: 260,
    borderRightWidth: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  sidebarTitle: {
    fontFamily: Fonts.headings,
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sidebarDesc: {
    fontFamily: Fonts.body,
    fontSize: 10,
    lineHeight: 14,
    marginBottom: 20,
  },
  sidebarDivider: {
    height: 1,
    marginBottom: 20,
  },
  sidebarMenu: {
    gap: 16,
  },
  sidebarMenuItemActive: {
    fontFamily: Fonts.headings,
    fontSize: 14,
    fontWeight: 'bold',
  },
  sidebarMenuItem: {
    fontFamily: Fonts.headings,
    fontSize: 14,
    fontWeight: '600',
  },
  rightWorkspace: {
    flex: 1,
  },
  workspaceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerTitleArea: {
    gap: 4,
  },
  headerTitle: {
    fontFamily: Fonts.headings,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: '#94a3b8',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  syncText: {
    fontFamily: Fonts.stats,
    fontSize: 8,
    fontWeight: 'bold',
    color: '#22C55E',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  scrollContentMobile: {
    paddingBottom: 80,
  },
  mobileHeaderGroup: {
    width: '100%',
    marginBottom: 16,
  },
  mobileGreetingBanner: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  greetingMainText: {
    fontFamily: Fonts.headings,
    fontSize: 26,
    letterSpacing: 0.5,
  },
  feedContainer: {
    width: '100%',
  },
  tileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  mobileCTAContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  draftNowBtn: {
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  draftNowText: {
    fontFamily: Fonts.headings,
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1,
  },
  leatherTray: {
    backgroundColor: '#6B3615',
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  trayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  trayBtn: {
    width: '47%',
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  trayBtnText: {
    fontFamily: Fonts.headings,
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
