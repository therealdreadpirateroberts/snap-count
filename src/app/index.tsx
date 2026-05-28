import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, useWindowDimensions, Platform, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColors, Fonts } from '@/constants/theme';
import AppHeader from '@/components/AppHeader';
import AppTabBar from '@/components/AppTabBar';
import BackgroundTexture from '@/components/BackgroundTexture';
import FeedCard from '@/components/FeedCard';
import { useAuthStore } from '@/store/useAuthStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { ADMIN_ALLOWLIST } from '@/constants/admin';
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

  // Looping breathing animation for the action button's gold outline
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  const [tabBarVisible, setTabBarVisible] = useState(true);
  const scrollTimeoutRef = useRef<any>(null);

  const handleScroll = () => {
    setTabBarVisible(false);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setTabBarVisible(true);
    }, 300); // Elegantly reappear 300ms after scrolling stops
  };

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

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
      kicker: 'ALGO MANAGEMENT',
      title: 'BOT TRAINING & PARAMETERS',
      description: 'Run reinforcement training sessions to evolve bot strategy coefficients and inspect parameter baselines.',
      btnLabel: 'ALGO ADMIN',
      route: '/algo-admin',
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
      btnLabel: 'ACCOUNT',
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

  // Cap at 10 (Decision 7)
  const activeTileCap = 10;
  
  // Only show Algo Admin card to registered admins
  const isAdmin = user && ADMIN_ALLOWLIST.includes(user.email);
  const visibleCards = coreCards.filter(card => {
    if (card.id === 'simulation-lab') {
      return isAdmin;
    }
    return true;
  });

  const homepageTiles = visibleCards.slice(0, activeTileCap).map(card => ({
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
      <View style={[styles.sidebarCard, { backgroundColor: themedColors.primaryAccent, borderColor: themedColors.midGray }]}>
        <Text style={[styles.sidebarTitle, { color: themedColors.obsidianBlack }]}>MOCK MAXXING</Text>
        <Text style={[styles.sidebarDesc, { color: themedColors.slate }]}>Real-time evolved bot profiles, analytics, and custom cheat sheets</Text>
        <View style={[styles.sidebarDivider, { backgroundColor: themedColors.midGray }]} />
        <View style={styles.sidebarMenu}>
          <Text style={[styles.sidebarMenuItemActive, { color: themedColors.obsidianBlack }]}>OVERVIEW</Text>
          <Pressable onPress={() => router.push('/wizard/setup')}><Text style={[styles.sidebarMenuItem, { color: themedColors.slate }]}>MOCK DRAFT WIZARD</Text></Pressable>
          <Pressable onPress={() => router.push('/rankings')}><Text style={[styles.sidebarMenuItem, { color: themedColors.slate }]}>ADP CHEAT SHEETS</Text></Pressable>
          {isAdmin && (
            <Pressable onPress={() => router.push('/algo-admin')}><Text style={[styles.sidebarMenuItem, { color: themedColors.slate }]}>ALGO ADMIN</Text></Pressable>
          )}
          <Pressable onPress={() => router.push('/settings')}><Text style={[styles.sidebarMenuItem, { color: themedColors.slate }]}>ACCOUNT</Text></Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themedColors.primaryAccent }]}>
      <BackgroundTexture backgroundColor={themedColors.primaryAccent} />

      {/* Decorative Radial Stadium Lights Glows */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            <RadialGradient id="deepFieldGreenGlow" cx="15%" cy="30%" rx="45%" ry="45%" fx="15%" fy="30%">
              <Stop offset="0%" stopColor={themedColors.deepFieldGreenGlow} />
              <Stop offset="100%" stopColor="rgba(248, 250, 252, 0)" />
            </RadialGradient>
            <RadialGradient id="pylonOrangeGlow" cx="85%" cy="70%" rx="40%" ry="40%" fx="85%" fy="70%">
              <Stop offset="0%" stopColor={themedColors.pylonOrangeGlow} />
              <Stop offset="100%" stopColor="rgba(248, 250, 252, 0)" />
            </RadialGradient>
          </Defs>
          <Circle cx="15%" cy="30%" r="45%" fill="url(#deepFieldGreenGlow)" />
          <Circle cx="85%" cy="70%" r="50%" fill="url(#pylonOrangeGlow)" />
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
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                >
                  {/* AppHeader + Greeting Banner */}
                  <View style={styles.mobileHeaderGroup}>
                    <AppHeader isLanding={true} showBrandBanner={true} />
                    
                    {/* Starbucks-style personalized greeting banner */}
                    <View style={[styles.mobileGreetingBanner, { backgroundColor: themedColors.primaryAccent }]}>
                      <Text style={[styles.greetingMainText, { color: themedColors.obsidianBlack }]}>
                        {((user?.firstName || 'COACH') + ", LET'S COOK.").toUpperCase()}
                      </Text>
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

        {/* PERSISTENT MOCK NOW BUTTON */}
        <Pressable 
          style={({ pressed }) => [
            styles.persistentMockBtn, 
            { 
              backgroundColor: themedColors.pylonOrange,
              borderColor: themedColors.pylonOrange
            },
            pressed && styles.persistentMockBtnPressed
          ]} 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
            router.push('/wizard/setup');
          }}
        >
          <Animated.View style={[
            styles.persistentMockBtnPulseBorder, 
            { 
              borderColor: themedColors.pylonOrange,
              opacity: pulseAnim 
            }
          ]} />
          <Text style={styles.persistentMockBtnText}>MOCK NOW</Text>
        </Pressable>
      </SafeAreaView>

      {/* Absolute persistent mobile tab navigation */}
      {!isDesktop && <AppTabBar visible={tabBarVisible} />}
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
    color: '#0c0c0c',
  },
  headerSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: '#475569',
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
  persistentMockBtn: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 104 : 96,
    right: 16,
    width: 140,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    overflow: 'hidden',
  },
  persistentMockBtnPulseBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1.5,
    borderRadius: 24,
  },
  persistentMockBtnPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.95,
  },
  persistentMockBtnText: {
    fontFamily: Fonts.headings,
    fontSize: 14,
    color: '#F4F5F7',
    letterSpacing: 0.8,
  },
});
