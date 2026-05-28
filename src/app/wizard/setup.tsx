import React, { useMemo, useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Animated, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDraftStore } from '@/store/useDraftStore';
import { useRankingsStore } from '@/store/useRankingsStore';
import { useSimulationStore } from '@/store/useSimulationStore';
import { Colors, Fonts, Spacing, MaxContentWidth, useColors, LightColors, DarkColors } from '@/constants/theme';
import { useThemeStore } from '@/store/useThemeStore';
import { useAuthStore } from '@/store/useAuthStore';
import BackgroundTexture from '@/components/BackgroundTexture';
import AppHeader from '@/components/AppHeader';
import AppTabBar from '@/components/AppTabBar';
import DraftPositionSelector from '@/components/DraftPositionSelector';
import LeagueRulesSelector from '@/components/LeagueRulesSelector';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import * as Haptics from 'expo-haptics';

const STRATEGIES = [
  {
    name: 'Late QB/TE Focus',
    desc: 'Target late-round value QBs & TEs'
  },
  {
    name: 'Hero RB',
    desc: 'Secure one elite cornerstone RB early'
  },
  {
    name: 'Zero RB',
    desc: 'Punt early RBs for elite receivers'
  },
  {
    name: 'Balanced',
    desc: 'Adapt and draft best value available'
  },
  {
    name: 'Robust RB',
    desc: 'Stockpile dominant early-round RBs'
  },
  {
    name: 'Elite QB/TE Premium',
    desc: 'Invest early in premium QBs & TEs'
  }
] as const;

function DraftSetupScreen() {
  const Colors = useColors();
  const router = useRouter();
  const { user } = useAuthStore();
  
  const triggerHaptic = async (style = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(style);
      } catch (err) {}
    }
  };

  // Zustand Store hooks
  const setup = useDraftStore((state) => state.setup);
  const updateSetup = useDraftStore((state) => state.updateSetup);
  const startDraft = useDraftStore((state) => state.startDraft);
  const triggerInstantDraft = useDraftStore((state) => state.triggerInstantDraft);
  const myRanks = useRankingsStore((state) => state.myRanks);
  const myRanksName = useRankingsStore((state) => state.myRanksName);



  // Dynamic Roster Slots Helpers
  const currentSlots = setup.rosterSlots || {
    QB: 1,
    RB: 2,
    WR: 2,
    TE: 1,
    FLEX: 1,
    K: 1,
    DST: 1,
    BENCH: 6,
    IR: 1
  };

  const activeRosterCount = 
    currentSlots.QB + 
    currentSlots.RB + 
    currentSlots.WR + 
    currentSlots.TE + 
    currentSlots.FLEX + 
    currentSlots.K + 
    currentSlots.DST + 
    currentSlots.BENCH;

  const irRosterCount = currentSlots.IR;

  const handleAdjustSlot = (key: keyof typeof currentSlots, delta: number) => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
    
    // Bounds checking
    const minLimits: Record<string, number> = { QB: 1, RB: 1, WR: 1, TE: 1, FLEX: 0, K: 0, DST: 0, BENCH: 1, IR: 0 };
    const maxLimits: Record<string, number> = { QB: 3, RB: 5, WR: 5, TE: 3, FLEX: 3, K: 2, DST: 2, BENCH: 12, IR: 4 };
    
    const currentVal = currentSlots[key];
    const newVal = Math.max(minLimits[key], Math.min(maxLimits[key], currentVal + delta));
    
    if (newVal === currentVal) return;
    
    const newSlots = {
      ...currentSlots,
      [key]: newVal
    };
    
    // Recalculate draft rounds: QB + RB + WR + TE + FLEX + K + DST + BENCH
    const newRounds = 
      newSlots.QB + 
      newSlots.RB + 
      newSlots.WR + 
      newSlots.TE + 
      newSlots.FLEX + 
      newSlots.K + 
      newSlots.DST + 
      newSlots.BENCH;
      
    // Update the Zustand store!
    updateSetup({
      rosterSlots: newSlots,
      rounds: newRounds,
      flexCount: newSlots.FLEX as 1 | 2 // Keep flexCount aligned in setup
    });
  };

  // Local UI configuration states
  const [scoring, setScoring] = useState<'Standard' | 'PPR' | 'Half-PPR' | 'Dynasty'>(setup.leagueFormat);
  const [pickClock, setPickClock] = useState<number>(setup.pickClock !== undefined ? setup.pickClock : 0);
  const [userStrategy, setUserStrategy] = useState<'Late QB/TE Focus' | 'Hero RB' | 'Zero RB' | 'Balanced' | 'Robust RB' | 'Elite QB/TE Premium'>(
    (user?.preferences?.draftStrategy || setup.userStrategy || 'Late QB/TE Focus') as any
  );
  const [rankingsBase, setRankingsBase] = useState<'ECR Consensus' | 'Andy' | 'Mike' | 'Jason' | 'My Ranks'>(setup.rankingsBase);
  const [passingTdPoints, setPassingTdPoints] = useState<4 | 6>(setup.passingTdPoints || 6);
  const [tePremium, setTePremium] = useState<boolean>(setup.tePremium || false);
  const [flexCount, setFlexCount] = useState<1 | 2>((setup.flexCount === 2 ? 2 : 1));
  const [year, setYear] = useState<number>(setup.year || 2026);
  const [expandedField, setExpandedField] = useState<'scoring' | 'timer' | 'difficulty' | 'rankingsBase' | 'customRules' | 'roster' | 'strategy' | 'year' | null>(null);

  const mainScrollRef = useRef<ScrollView>(null);

  // Looping breathing animation for the action button's gold outline
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

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

  // Set default draft type to Snake on mount
  useEffect(() => {
    updateSetup({ 
      draftType: 'Snake'
    });
  }, []);



  // Adjusters
  const selectLeagueSize = (size: number) => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    updateSetup({ leagueSize: size });
    // Reset pick position if it exceeds the new league size
    if (setup.userPosition > size) {
      updateSetup({ userPosition: size });
      useAuthStore.getState().updatePreferences({ draftPos: size });
    }
  };

  const selectUserPosition = (pos: number) => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
    updateSetup({ userPosition: pos });
    useAuthStore.getState().updatePreferences({ draftPos: pos });
  };

  const toggleExpanded = (field: 'scoring' | 'timer' | 'difficulty' | 'rankingsBase' | 'customRules' | 'roster' | 'strategy' | 'year') => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
    setExpandedField((prev) => (prev === field ? null : field));
  };

  const handleLaunch = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
    updateSetup({ 
      leagueFormat: scoring,
      rankingsBase: rankingsBase,
      userStrategy: userStrategy,
      passingTdPoints: passingTdPoints,
      tePremium: tePremium,
      flexCount: flexCount,
      pickClock: pickClock,
      year: year
    });
    useAuthStore.getState().updatePreferences({
      scoring: scoring,
      draftStrategy: userStrategy
    });
    startDraft();
    router.replace('/wizard/active');
  };

  const handleAutoLaunch = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    updateSetup({ 
      leagueFormat: scoring,
      rankingsBase: rankingsBase,
      userStrategy: userStrategy,
      passingTdPoints: passingTdPoints,
      tePremium: tePremium,
      flexCount: flexCount,
      pickClock: pickClock,
      year: year
    });
    useAuthStore.getState().updatePreferences({
      scoring: scoring,
      draftStrategy: userStrategy
    });
    triggerInstantDraft();
    router.replace('/wizard/summary');
  };

  // Dynamic win rate fallback baseline constants (PPR standalone ranks 1 to 6)
  const DEFAULT_WIN_RATES = useMemo(() => ({
    'Hero RB': 51,
    'Balanced': 48,
    'Elite QB/TE Premium': 46,
    'Late QB/TE Focus': 45,
    'Robust RB': 44,
    'Zero RB': 42,
  } as Record<string, number>), []);

  // Static curated order chosen by product owner (Decision 5 Option D). No underlying popularity or usage data drives this order.
  const STRATEGIES_STATIC_ORDER = ['Zero RB', 'Hero RB', 'Balanced', 'Late QB/TE Focus', 'Robust RB', 'Elite QB/TE Premium'];

  const displayStrategies = useMemo(() => {
    return STRATEGIES_STATIC_ORDER.map((name) => {
      const original = STRATEGIES.find((s) => s.name === name)!;
      return {
        ...original,
        winRate: undefined,
      };
    });
  }, [STRATEGIES]);

  return (
    <View style={styles.container}>
      <BackgroundTexture backgroundColor={Colors.primaryAccent} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        
        <AppHeader
          title=""
          showBack={true}
          backText="BACK"
          backAction={() => {
            router.replace('/');
          }}
        />

        <ScrollView 
          ref={mainScrollRef}
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={true}
          bounces={true}
        >
          <View style={styles.formCard}>
            <DraftPositionSelector
              hideLeagueSize={true}
              leagueSize={setup.leagueSize}
              userPosition={setup.userPosition}
              onSelectLeagueSize={selectLeagueSize}
              onSelectUserPosition={selectUserPosition}
            />
          </View>

          <View style={styles.formCard}>
            <DraftPositionSelector
              hidePosition={true}
              leagueSize={setup.leagueSize}
              userPosition={setup.userPosition}
              onSelectLeagueSize={selectLeagueSize}
              onSelectUserPosition={selectUserPosition}
            />
          </View>

          <Text style={styles.sectionHeader}>ADDITIONAL OPTIONS</Text>

          <LeagueRulesSelector
            scoring={scoring}
            setScoring={setScoring}
            rankingsBase={rankingsBase}
            setRankingsBase={setRankingsBase}
            pickClock={pickClock}
            setPickClock={setPickClock}
            userStrategy={userStrategy}
            setUserStrategy={setUserStrategy}
            passingTdPoints={passingTdPoints}
            setPassingTdPoints={setPassingTdPoints}
            tePremium={tePremium}
            setTePremium={setTePremium}
            flexCount={flexCount}
            setFlexCount={setFlexCount}
            expandedField={expandedField}
            toggleExpanded={toggleExpanded}
            displayStrategies={displayStrategies}
            myRanks={myRanks}
            myRanksName={myRanksName}
            currentSlots={currentSlots}
            activeRosterCount={activeRosterCount}
            irRosterCount={irRosterCount}
            onAdjustSlot={handleAdjustSlot}
            year={year}
            setYear={(val) => {
              setYear(val);
              updateSetup({ year: val });
            }}
          />

          <Pressable 
            style={({ pressed }) => [styles.autoDraftBtn, pressed && styles.autoDraftBtnPressed]} 
            onPress={handleAutoLaunch}
          >
            <Text style={styles.autoDraftBtnText}>AUTO DRAFT</Text>
          </Pressable>

        </ScrollView>

        {/* PERSISTENT MOCK NOW BUTTON */}
        <Pressable 
          style={({ pressed }) => [styles.persistentMockBtn, pressed && styles.persistentMockBtnPressed]} 
          onPress={handleLaunch}
        >
          <Animated.View style={[styles.persistentMockBtnPulseBorder, { opacity: pulseAnim }]} />
          <Text style={styles.persistentMockBtnText}>MOCK NOW</Text>
        </Pressable>

      </SafeAreaView>
      <AppTabBar />
    </View>
  );
}

export default function SafeDraftSetupScreen() {
  return (
    <ErrorBoundary>
      <DraftSetupScreen />
    </ErrorBoundary>
  );
}

function createStyles(Colors: typeof LightColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.primaryAccent,
    },
    formCard: {
      backgroundColor: Colors.primaryAccent,
      borderColor: Colors.midGray,
      borderWidth: 1.5,
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
      padding: Spacing.three,
    },
    sectionHeader: {
      fontFamily: Fonts.stats,
      fontSize: 9.5,
      color: Colors.obsidianBlack,
      fontWeight: 'bold',
      letterSpacing: 1.5,
      marginTop: Spacing.two,
      marginBottom: Spacing.one,
    },
    safeArea: {
      flex: 1,
      alignSelf: 'center',
      width: '100%',
      maxWidth: MaxContentWidth,
    },
    scrollContent: {
      paddingHorizontal: Spacing.three,
      paddingTop: Spacing.one,
      paddingBottom: 0,
      gap: Spacing.two,
    },
    persistentMockBtn: {
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? 104 : 96,
      right: Spacing.three,
      backgroundColor: Colors.pylonOrange,
      width: 140,
      height: 48,
      borderRadius: 24,
      borderWidth: 1.5,
      borderColor: Colors.pylonOrange,
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
      borderColor: Colors.pylonOrange,
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
      color: Colors.primaryAccent,
      letterSpacing: 0.8,
    },
    autoDraftBtn: {
      backgroundColor: 'transparent',
      borderColor: Colors.midGray,
      borderWidth: 1.5,
      borderRadius: 24,
      width: 140,
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'flex-start',
      marginTop: Spacing.two,
      marginBottom: Platform.OS === 'ios' ? 104 : 96,
    },
    autoDraftBtnPressed: {
      transform: [{ scale: 0.96 }],
      opacity: 0.95,
    },
    autoDraftBtnText: {
      fontFamily: Fonts.headings,
      fontSize: 14,
      color: Colors.obsidianBlack,
      letterSpacing: 0.8,
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
