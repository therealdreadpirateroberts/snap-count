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
exports.default = DraftSetupScreen;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const useMockMaxxingStore_1 = require("@/store/useMockMaxxingStore");
const useRankingsSync_1 = require("@/components/useRankingsSync");
const theme_1 = require("@/constants/theme");
const useThemeStore_1 = require("@/store/useThemeStore");
const useAuthStore_1 = require("@/store/useAuthStore");
const BackgroundTexture_1 = __importDefault(require("@/components/BackgroundTexture"));
const AppHeader_1 = __importDefault(require("@/components/AppHeader"));
const AppTabBar_1 = __importDefault(require("@/components/AppTabBar"));
const Haptics = __importStar(require("expo-haptics"));
const react_native_svg_1 = __importStar(require("react-native-svg"));
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
];
function DraftSetupScreen() {
    const Colors = (0, theme_1.useColors)();
    const router = (0, expo_router_1.useRouter)();
    const getPositionColor = (key) => {
        if (key === 'QB')
            return { bg: Colors.positions.QB, text: '#000000', border: Colors.positions.QB };
        if (key === 'RB')
            return { bg: Colors.positions.RB, text: '#000000', border: Colors.positions.RB };
        if (key === 'WR')
            return { bg: Colors.positions.WR, text: '#000000', border: Colors.positions.WR };
        if (key === 'TE')
            return { bg: Colors.positions.TE, text: '#000000', border: Colors.positions.TE };
        if (key === 'K')
            return { bg: Colors.positions.K, text: '#000000', border: Colors.positions.K };
        if (key === 'DST')
            return { bg: Colors.positions.DST, text: '#000000', border: Colors.positions.DST };
        if (key === 'FLEX')
            return { bg: '#4F5D75', text: '#FFFFFF', border: '#4F5D75' };
        if (key === 'BENCH')
            return { bg: '#2D3142', text: '#FFFFFF', border: '#2D3142' };
        if (key === 'IR')
            return { bg: '#1C1E26', text: '#FFFFFF', border: '#1C1E26' };
        return { bg: Colors.surfaceLifted, text: Colors.primaryAccent, border: Colors.coltsNavyLight };
    };
    const { user } = (0, useAuthStore_1.useAuthStore)();
    const triggerHaptic = async (style = Haptics.ImpactFeedbackStyle.Light) => {
        if (react_native_1.Platform.OS !== 'web') {
            try {
                await Haptics.impactAsync(style);
            }
            catch (err) { }
        }
    };
    // ECR Rankings Sync Hook
    const { syncStatus, timeAgo, forceSync } = (0, useRankingsSync_1.useRankingsSync)();
    // Spinning refresh icon animation
    const spinAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    (0, react_1.useEffect)(() => {
        if (syncStatus === 'syncing') {
            react_native_1.Animated.loop(react_native_1.Animated.timing(spinAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            })).start();
        }
        else {
            spinAnim.setValue(0);
        }
    }, [syncStatus, spinAnim]);
    const spin = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });
    // Zustand Store hooks
    const setup = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.setup);
    const updateSetup = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.updateSetup);
    const startDraft = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.startDraft);
    const triggerInstantDraft = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.triggerInstantDraft);
    const myRanks = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.myRanks);
    const myRanksName = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.myRanksName);
    // Live Simulation and Telemetry hooks
    const liveSimStats = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.liveSimStats);
    const startLiveSimulationLoop = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.startLiveSimulationLoop);
    const stopLiveSimulationLoop = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.stopLiveSimulationLoop);
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
    const activeRosterCount = currentSlots.QB +
        currentSlots.RB +
        currentSlots.WR +
        currentSlots.TE +
        currentSlots.FLEX +
        currentSlots.K +
        currentSlots.DST +
        currentSlots.BENCH;
    const irRosterCount = currentSlots.IR;
    const handleAdjustSlot = (key, delta) => {
        triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
        // Bounds checking
        const minLimits = { QB: 1, RB: 1, WR: 1, TE: 1, FLEX: 0, K: 0, DST: 0, BENCH: 1, IR: 0 };
        const maxLimits = { QB: 3, RB: 5, WR: 5, TE: 3, FLEX: 3, K: 2, DST: 2, BENCH: 12, IR: 4 };
        const currentVal = currentSlots[key];
        const newVal = Math.max(minLimits[key], Math.min(maxLimits[key], currentVal + delta));
        if (newVal === currentVal)
            return;
        const newSlots = {
            ...currentSlots,
            [key]: newVal
        };
        // Recalculate draft rounds: QB + RB + WR + TE + FLEX + K + DST + BENCH
        const newRounds = newSlots.QB +
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
            flexCount: newSlots.FLEX // Keep flexCount aligned in setup
        });
    };
    // Local UI configuration states
    const [scoring, setScoring] = (0, react_1.useState)(setup.leagueFormat);
    const [pickClock, setPickClock] = (0, react_1.useState)('No Clock');
    const [userStrategy, setUserStrategy] = (0, react_1.useState)((user?.preferences?.draftStrategy || setup.userStrategy || 'Late QB/TE Focus'));
    const [rankingsBase, setRankingsBase] = (0, react_1.useState)(setup.rankingsBase);
    const [passingTdPoints, setPassingTdPoints] = (0, react_1.useState)(setup.passingTdPoints || 6);
    const [tePremium, setTePremium] = (0, react_1.useState)(setup.tePremium || false);
    const [flexCount, setFlexCount] = (0, react_1.useState)((setup.flexCount === 2 ? 2 : 1));
    const [expandedField, setExpandedField] = (0, react_1.useState)(null);
    // Dynamic sync when user preferences load asynchronously on boot
    (0, react_1.useEffect)(() => {
        if (user?.preferences?.draftStrategy) {
            setUserStrategy(user.preferences.draftStrategy);
        }
    }, [user?.preferences?.draftStrategy]);
    // Wheel Scroll ref and horizontal width
    const wheelScrollRef = (0, react_1.useRef)(null);
    const mainScrollRef = (0, react_1.useRef)(null);
    const [containerWidth, setContainerWidth] = (0, react_1.useState)(0);
    // Looping breathing animation for the action button's gold outline
    const pulseAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(0.4)).current;
    // Auto-scroll expanded panels into focus for premium UX alignment
    (0, react_1.useEffect)(() => {
        if (expandedField) {
            setTimeout(() => {
                let scrollY = 0;
                if (expandedField === 'strategy')
                    scrollY = 160;
                else if (expandedField === 'scoring')
                    scrollY = 200;
                else if (expandedField === 'rankingsBase')
                    scrollY = 240;
                else if (expandedField === 'difficulty')
                    scrollY = 280;
                else if (expandedField === 'customRules')
                    scrollY = 320;
                else if (expandedField === 'roster')
                    scrollY = 480;
                if (scrollY > 0) {
                    mainScrollRef.current?.scrollTo({ y: scrollY, animated: true });
                }
            }, 150);
        }
    }, [expandedField]);
    (0, react_1.useEffect)(() => {
        const pulse = react_native_1.Animated.loop(react_native_1.Animated.sequence([
            react_native_1.Animated.timing(pulseAnim, {
                toValue: 1.0,
                duration: 1200,
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(pulseAnim, {
                toValue: 0.4,
                duration: 1200,
                useNativeDriver: true,
            }),
        ]));
        pulse.start();
        return () => pulse.stop();
    }, [pulseAnim]);
    // Set default draft type to Snake on mount
    (0, react_1.useEffect)(() => {
        updateSetup({
            draftType: 'Snake'
        });
    }, []);
    // Background simulation telemetry loops for real-time strategy re-ranking
    (0, react_1.useEffect)(() => {
        startLiveSimulationLoop();
        return () => {
            stopLiveSimulationLoop();
        };
    }, [startLiveSimulationLoop, stopLiveSimulationLoop]);
    // Auto-scroll to center active cell
    (0, react_1.useEffect)(() => {
        if (containerWidth > 0 && setup.userPosition) {
            const cellWidth = 46;
            const gap = 10;
            const paddingHorizontal = 8;
            const targetOffset = (setup.userPosition - 1) * (cellWidth + gap) + paddingHorizontal - containerWidth / 2 + cellWidth / 2;
            const timer = setTimeout(() => {
                wheelScrollRef.current?.scrollTo({ x: Math.max(0, targetOffset), animated: true });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [setup.userPosition, containerWidth]);
    // Ordinal helper (e.g. 1st, 2nd)
    const getOrdinal = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
    // Adjusters
    const selectLeagueSize = (size) => {
        triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
        updateSetup({ leagueSize: size });
        // Reset pick position if it exceeds the new league size
        if (setup.userPosition > size) {
            updateSetup({ userPosition: size });
            useAuthStore_1.useAuthStore.getState().updatePreferences({ draftPos: size });
        }
    };
    const selectUserPosition = (pos) => {
        triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
        updateSetup({ userPosition: pos });
        useAuthStore_1.useAuthStore.getState().updatePreferences({ draftPos: pos });
    };
    const toggleExpanded = (field) => {
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
            flexCount: flexCount
        });
        useAuthStore_1.useAuthStore.getState().updatePreferences({
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
            flexCount: flexCount
        });
        useAuthStore_1.useAuthStore.getState().updatePreferences({
            scoring: scoring,
            draftStrategy: userStrategy
        });
        triggerInstantDraft();
        router.replace('/wizard/summary');
    };
    // Dynamic win rate fallback baseline constants (PPR standalone ranks 1 to 6)
    const DEFAULT_WIN_RATES = (0, react_1.useMemo)(() => ({
        'Hero RB': 51,
        'Balanced': 48,
        'Elite QB/TE Premium': 46,
        'Late QB/TE Focus': 45,
        'Robust RB': 44,
        'Zero RB': 42,
    }), []);
    // State to freeze the card positions when the strategy section is expanded (preventing layout jumping/swapping under active scroll gestures)
    const [strategyOrder, setStrategyOrder] = (0, react_1.useState)(() => {
        const initialStats = useMockMaxxingStore_1.useMockMaxxingStore.getState().liveSimStats;
        return [...STRATEGIES]
            .map((strat) => {
            const record = initialStats?.strategyRecords?.[strat.name];
            let winRate = DEFAULT_WIN_RATES[strat.name] || 40;
            if (record && (record.wins > 0 || record.losses > 0)) {
                const total = record.wins + record.losses;
                winRate = Math.round((record.wins / total) * 100);
            }
            return { name: strat.name, winRate };
        })
            .sort((a, b) => b.winRate - a.winRate)
            .map(s => s.name);
    });
    // Dynamically update the sorting order ONLY when the section is collapsed to prevent visual item shifting
    (0, react_1.useEffect)(() => {
        if (expandedField !== 'strategy') {
            const sortedNames = [...STRATEGIES]
                .map((strat) => {
                const record = liveSimStats?.strategyRecords?.[strat.name];
                let winRate = DEFAULT_WIN_RATES[strat.name] || 40;
                if (record && (record.wins > 0 || record.losses > 0)) {
                    const total = record.wins + record.losses;
                    winRate = Math.round((record.wins / total) * 100);
                }
                return { name: strat.name, winRate };
            })
                .sort((a, b) => b.winRate - a.winRate)
                .map(s => s.name);
            const hasChanged = sortedNames.some((val, idx) => strategyOrder[idx] !== val);
            if (hasChanged) {
                setStrategyOrder(sortedNames);
            }
        }
    }, [liveSimStats, expandedField, strategyOrder, DEFAULT_WIN_RATES]);
    // Construct display strategies using the stable order while keeping individual performance win rates live
    const displayStrategies = (0, react_1.useMemo)(() => {
        return strategyOrder.map((name) => {
            const original = STRATEGIES.find((s) => s.name === name);
            const record = liveSimStats?.strategyRecords?.[name];
            let winRate = DEFAULT_WIN_RATES[name] || 40;
            if (record && (record.wins > 0 || record.losses > 0)) {
                const total = record.wins + record.losses;
                winRate = Math.round((record.wins / total) * 100);
            }
            return {
                ...original,
                winRate,
            };
        });
    }, [strategyOrder, liveSimStats, DEFAULT_WIN_RATES]);
    // Generate numbers 1 to leagueSize for the visual pick wheel
    const pickWheelOptions = (0, react_1.useMemo)(() => {
        const options = [];
        for (let i = 1; i <= setup.leagueSize; i++) {
            options.push(i);
        }
        return options;
    }, [setup.leagueSize]);
    return (<react_native_1.View style={styles.container}>
      <BackgroundTexture_1.default />
      <react_native_safe_area_context_1.SafeAreaView style={styles.safeArea} edges={['top']}>
        
        <AppHeader_1.default title="" showBack={true} backText="EXIT" backAction={() => {
            router.replace('/');
        }}/>

        <react_native_1.ScrollView ref={mainScrollRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true} bounces={true}>
          {/* DRAFT POSITION SCROLL WHEEL */}
          <react_native_1.View style={styles.wheelHeaderRow}>
            <react_native_1.Text style={styles.sectionHeader}>YOUR DRAFT POSITION</react_native_1.Text>
          </react_native_1.View>

          <react_native_1.View style={styles.wheelContainer}>
            <react_native_1.ScrollView ref={wheelScrollRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.wheelScroll} keyboardShouldPersistTaps="always" onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
              {pickWheelOptions.map((num) => {
            const active = setup.userPosition === num;
            return (<react_native_1.TouchableOpacity key={num} style={[styles.wheelCell, active && styles.wheelCellActive]} onPress={() => selectUserPosition(num)} activeOpacity={0.7}>
                    {active && (<react_native_1.Animated.View style={[
                        styles.activeCellPulseBorder,
                        { opacity: pulseAnim }
                    ]} pointerEvents="none"/>)}
                    <react_native_1.Text style={[styles.wheelCellText, active && styles.wheelCellTextActive]} pointerEvents="none">
                      {num}
                    </react_native_1.Text>
                  </react_native_1.TouchableOpacity>);
        })}
            </react_native_1.ScrollView>
          </react_native_1.View>

          {/* LEAGUE SIZE CAPSULE SELECTOR */}
          <react_native_1.Text style={styles.sectionHeader}>LEAGUE SIZE (TEAMS)</react_native_1.Text>
          <react_native_1.View style={styles.capsuleRow}>
            {[8, 10, 12, 14, 16].map((size) => {
            const active = setup.leagueSize === size;
            return (<react_native_1.Pressable key={size} style={[styles.capsuleChip, active && styles.capsuleChipActive]} onPress={() => selectLeagueSize(size)}>
                  <react_native_1.Text style={[styles.capsuleText, active && styles.capsuleTextActive]}>
                    {size}
                  </react_native_1.Text>
                </react_native_1.Pressable>);
        })}
          </react_native_1.View>

          {/* QUICK DIALS FORM */}
          <react_native_1.Text style={styles.sectionHeader}>LEAGUE RULES & DIFFICULTY</react_native_1.Text>
          <react_native_1.View style={styles.formCard}>

            {/* Draft Strategy */}
            <react_native_1.View>
              <react_native_1.Pressable style={styles.formRow} onPress={() => toggleExpanded('strategy')}>
                <react_native_1.View style={styles.rowLeft}>
                  <react_native_1.Text style={styles.formLabel}>Draft Strategy</react_native_1.Text>
                </react_native_1.View>
                <react_native_1.View style={styles.rowRight}>
                  <react_native_1.Text style={styles.formValue}>{userStrategy}</react_native_1.Text>
                  <react_native_svg_1.default width={14} height={14} viewBox="0 0 24 24" fill="none" style={{ transform: [{ rotate: expandedField === 'strategy' ? '90deg' : '0deg' }] }}>
                    <react_native_svg_1.Path d="M9 5L16 12L9 19" stroke="#94a3b8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
                  </react_native_svg_1.default>
                </react_native_1.View>
              </react_native_1.Pressable>

              {expandedField === 'strategy' && (<react_native_1.View style={styles.strategyDropdownPanel}>
                  {displayStrategies.map((opt) => {
                const active = userStrategy === opt.name;
                return (<react_native_1.Pressable key={opt.name} style={[
                        styles.strategyCard,
                        active && styles.strategyCardActive
                    ]} onPress={() => {
                        triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                        setUserStrategy(opt.name);
                    }}>
                        <react_native_1.View style={styles.strategyCardTextContainer}>
                          <react_native_1.Text style={[
                        styles.strategyCardTitle,
                        active && styles.strategyCardTitleActive
                    ]}>
                            {opt.name.toUpperCase()}
                          </react_native_1.Text>
                          <react_native_1.Text style={styles.strategyCardDesc}>
                            {opt.desc}
                          </react_native_1.Text>
                        </react_native_1.View>
                        
                        <react_native_1.View style={styles.strategyIndicator}>
                          {active ? (<react_native_1.View style={{
                            width: 18,
                            height: 18,
                            borderRadius: 9,
                            borderWidth: 2,
                            borderColor: Colors.coltsNavy,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                              <react_native_1.View style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: Colors.coltsNavy
                        }}/>
                            </react_native_1.View>) : (<react_native_1.View style={{
                            width: 18,
                            height: 18,
                            borderRadius: 9,
                            borderWidth: 2,
                            borderColor: Colors.secondaryAccent,
                        }}/>)}
                        </react_native_1.View>
                      </react_native_1.Pressable>);
            })}
                </react_native_1.View>)}
            </react_native_1.View>

            <react_native_1.View style={styles.formDivider}/>

            {/* Scoring */}
            <react_native_1.View>
              <react_native_1.Pressable style={styles.formRow} onPress={() => toggleExpanded('scoring')}>
                <react_native_1.View style={styles.rowLeft}>
                  <react_native_1.Text style={styles.formLabel}>Scoring Format</react_native_1.Text>
                </react_native_1.View>
                <react_native_1.View style={styles.rowRight}>
                  <react_native_1.Text style={styles.formValue}>{scoring}</react_native_1.Text>
                  <react_native_svg_1.default width={14} height={14} viewBox="0 0 24 24" fill="none" style={{ transform: [{ rotate: expandedField === 'scoring' ? '90deg' : '0deg' }] }}>
                    <react_native_svg_1.Path d="M9 5L16 12L9 19" stroke="#94a3b8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
                  </react_native_svg_1.default>
                </react_native_1.View>
              </react_native_1.Pressable>

              {expandedField === 'scoring' && (<react_native_1.View style={styles.dropdownPanel}>
                  {['Standard', 'PPR', 'Half-PPR', 'Dynasty'].map((opt) => {
                const active = scoring === opt;
                return (<react_native_1.Pressable key={opt} style={[styles.dropdownChip, active && styles.dropdownChipActive]} onPress={() => setScoring(opt)}>
                        <react_native_1.Text style={[styles.dropdownChipText, active && styles.dropdownChipTextActive]}>
                          {opt}
                        </react_native_1.Text>
                      </react_native_1.Pressable>);
            })}
                </react_native_1.View>)}
            </react_native_1.View>

            <react_native_1.View style={styles.formDivider}/>

            {/* Rankings Base */}
            <react_native_1.View>
              <react_native_1.Pressable style={styles.formRow} onPress={() => toggleExpanded('rankingsBase')}>
                <react_native_1.View style={styles.rowLeft}>
                  <react_native_1.Text style={styles.formLabel}>Rankings Source</react_native_1.Text>
                </react_native_1.View>
                <react_native_1.View style={styles.rowRight}>
                  <react_native_1.Text style={styles.formValue}>
                    {rankingsBase === 'ECR Consensus'
            ? 'ECR Consensus'
            : rankingsBase === 'My Ranks'
                ? (myRanksName || 'Custom Board')
                : `${rankingsBase}'s Ranks`}
                  </react_native_1.Text>
                  <react_native_svg_1.default width={14} height={14} viewBox="0 0 24 24" fill="none" style={{ transform: [{ rotate: expandedField === 'rankingsBase' ? '90deg' : '0deg' }] }}>
                    <react_native_svg_1.Path d="M9 5L16 12L9 19" stroke="#94a3b8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
                  </react_native_svg_1.default>
                </react_native_1.View>
              </react_native_1.Pressable>

              {expandedField === 'rankingsBase' && (<react_native_1.View style={styles.dropdownPanel}>
                  {(myRanks && myRanks.length > 0
                ? ['ECR Consensus', 'Andy', 'Mike', 'Jason', 'My Ranks']
                : ['ECR Consensus', 'Andy', 'Mike', 'Jason']).map((opt) => {
                const active = rankingsBase === opt;
                return (<react_native_1.Pressable key={opt} style={[styles.dropdownChip, active && styles.dropdownChipActive]} onPress={() => setRankingsBase(opt)}>
                        <react_native_1.Text style={[styles.dropdownChipText, active && styles.dropdownChipTextActive]}>
                          {opt === 'ECR Consensus'
                        ? 'ECR'
                        : opt === 'My Ranks'
                            ? (myRanksName || 'Custom')
                            : opt}
                        </react_native_1.Text>
                      </react_native_1.Pressable>);
            })}
                </react_native_1.View>)}
            </react_native_1.View>

            <react_native_1.View style={styles.formDivider}/>

            {/* Pick Clock */}
            <react_native_1.View>
              <react_native_1.Pressable style={styles.formRow} onPress={() => toggleExpanded('timer')}>
                <react_native_1.View style={styles.rowLeft}>
                  <react_native_1.Text style={styles.formLabel}>Draft Timer</react_native_1.Text>
                </react_native_1.View>
                <react_native_1.View style={styles.rowRight}>
                  <react_native_1.Text style={styles.formValue}>{pickClock}</react_native_1.Text>
                  <react_native_svg_1.default width={14} height={14} viewBox="0 0 24 24" fill="none" style={{ transform: [{ rotate: expandedField === 'timer' ? '90deg' : '0deg' }] }}>
                    <react_native_svg_1.Path d="M9 5L16 12L9 19" stroke="#94a3b8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
                  </react_native_svg_1.default>
                </react_native_1.View>
              </react_native_1.Pressable>

              {expandedField === 'timer' && (<react_native_1.View style={styles.dropdownPanel}>
                  {['No Clock', '30s', '60s', '90s'].map((opt) => {
                const active = pickClock === opt;
                return (<react_native_1.Pressable key={opt} style={[styles.dropdownChip, active && styles.dropdownChipActive]} onPress={() => setPickClock(opt)}>
                        <react_native_1.Text style={[styles.dropdownChipText, active && styles.dropdownChipTextActive]}>
                          {opt}
                        </react_native_1.Text>
                      </react_native_1.Pressable>);
            })}
                </react_native_1.View>)}
            </react_native_1.View>

            <react_native_1.View style={styles.formDivider}/>

            {/* Custom Rules */}
            <react_native_1.View>
              <react_native_1.Pressable style={styles.formRow} onPress={() => toggleExpanded('customRules')}>
                <react_native_1.View style={styles.rowLeft}>
                  <react_native_1.Text style={styles.formLabel}>Custom League Rules</react_native_1.Text>
                </react_native_1.View>
                <react_native_1.View style={styles.rowRight}>
                  <react_native_svg_1.default width={14} height={14} viewBox="0 0 24 24" fill="none" style={{ transform: [{ rotate: expandedField === 'customRules' ? '90deg' : '0deg' }] }}>
                    <react_native_svg_1.Path d="M9 5L16 12L9 19" stroke="#94a3b8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
                  </react_native_svg_1.default>
                </react_native_1.View>
              </react_native_1.Pressable>

              {expandedField === 'customRules' && (<react_native_1.View style={styles.customRulesPanel}>
                  {/* Segment 1: Passing TD */}
                  <react_native_1.View style={styles.customRuleRow}>
                    <react_native_1.Text style={styles.customRuleLabel}>Passing TD Value</react_native_1.Text>
                    <react_native_1.View style={styles.segmentContainer}>
                      {[4, 6].map((pts) => {
                const active = passingTdPoints === pts;
                return (<react_native_1.Pressable key={pts} style={[styles.segmentButton, active && styles.segmentButtonActive]} onPress={() => setPassingTdPoints(pts)}>
                            <react_native_1.Text style={[styles.segmentButtonText, active && styles.segmentButtonTextActive]}>
                              {pts} PTS
                            </react_native_1.Text>
                          </react_native_1.Pressable>);
            })}
                    </react_native_1.View>
                  </react_native_1.View>

                  {/* Segment 2: TE Premium */}
                  <react_native_1.View style={styles.customRuleRow}>
                    <react_native_1.Text style={styles.customRuleLabel}>TE Premium Scoring</react_native_1.Text>
                    <react_native_1.View style={styles.segmentContainer}>
                      {[false, true].map((val) => {
                const active = tePremium === val;
                return (<react_native_1.Pressable key={val ? 'true' : 'false'} style={[styles.segmentButton, active && styles.segmentButtonActive]} onPress={() => setTePremium(val)}>
                            <react_native_1.Text style={[styles.segmentButtonText, active && styles.segmentButtonTextActive]}>
                              {val ? '+0.5 PPR' : 'Disabled'}
                            </react_native_1.Text>
                          </react_native_1.Pressable>);
            })}
                    </react_native_1.View>
                  </react_native_1.View>

                  {/* Segment 3: FLEX Slots */}
                  <react_native_1.View style={styles.customRuleRow}>
                    <react_native_1.Text style={styles.customRuleLabel}>FLEX Roster Slots</react_native_1.Text>
                    <react_native_1.View style={styles.segmentContainer}>
                      {[1, 2].map((num) => {
                const active = flexCount === num;
                return (<react_native_1.Pressable key={num} style={[styles.segmentButton, active && styles.segmentButtonActive]} onPress={() => setFlexCount(num)}>
                            <react_native_1.Text style={[styles.segmentButtonText, active && styles.segmentButtonTextActive]}>
                              {num} FLEX
                            </react_native_1.Text>
                          </react_native_1.Pressable>);
            })}
                    </react_native_1.View>
                  </react_native_1.View>
                </react_native_1.View>)}
            </react_native_1.View>

            <react_native_1.View style={styles.formDivider}/>

            {/* Roster Construction */}
            <react_native_1.View>
              <react_native_1.Pressable style={styles.formRow} onPress={() => toggleExpanded('roster')}>
                <react_native_1.View style={styles.rowLeft}>
                  <react_native_1.Text style={styles.formLabel}>Roster Construction</react_native_1.Text>
                </react_native_1.View>
                <react_native_1.View style={styles.rowRight}>
                  <react_native_svg_1.default width={14} height={14} viewBox="0 0 24 24" fill="none" style={{ transform: [{ rotate: expandedField === 'roster' ? '90deg' : '0deg' }] }}>
                    <react_native_svg_1.Path d="M9 5L16 12L9 19" stroke="#94a3b8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
                  </react_native_svg_1.default>
                </react_native_1.View>
              </react_native_1.Pressable>

              {expandedField === 'roster' && (<react_native_1.View style={styles.rosterPanel}>
                  <react_native_1.Text style={styles.rosterPanelTitle}>ADJUST ROSTER CONFIGURATION</react_native_1.Text>
                  
                  <react_native_1.View style={styles.rosterListContainer}>
                    {[
                { key: 'QB', label: 'Quarterback', short: 'QB' },
                { key: 'RB', label: 'Running Back', short: 'RB' },
                { key: 'WR', label: 'Wide Receiver', short: 'WR' },
                { key: 'TE', label: 'Tight End', short: 'TE' },
                { key: 'FLEX', label: 'Flex (W/R/T)', short: 'FLEX' },
                { key: 'K', label: 'Kicker', short: 'K' },
                { key: 'DST', label: 'Defense (DST)', short: 'DEF' },
                { key: 'BENCH', label: 'Bench Slots', short: 'BN' },
                { key: 'IR', label: 'Injured Reserve (IR)', short: 'IR' },
            ].map((item) => {
                const posKey = item.key;
                const count = currentSlots[posKey];
                const minLimits = { QB: 1, RB: 1, WR: 1, TE: 1, FLEX: 0, K: 0, DST: 0, BENCH: 1, IR: 0 };
                const maxLimits = { QB: 3, RB: 5, WR: 5, TE: 3, FLEX: 3, K: 2, DST: 2, BENCH: 12, IR: 4 };
                const isMin = count <= minLimits[item.key];
                const isMax = count >= maxLimits[item.key];
                return (<react_native_1.View key={item.key} style={styles.rosterRow}>
                          <react_native_1.View style={styles.rosterRowLeft}>
                            {(() => {
                        const posColor = getPositionColor(item.key);
                        return (<react_native_1.View style={[styles.rosterRowBadge, { backgroundColor: posColor.bg, borderColor: posColor.border }]}>
                                  <react_native_1.Text style={[styles.rosterRowBadgeText, { color: posColor.text }]}>{item.short}</react_native_1.Text>
                                </react_native_1.View>);
                    })()}
                          </react_native_1.View>
                          
                          <react_native_1.View style={styles.rosterRowRight}>
                            {/* Minus Button */}
                            <react_native_1.Pressable style={({ pressed }) => [
                        styles.rosterAdjustBtn,
                        isMin && styles.rosterAdjustBtnDisabled,
                        pressed && !isMin && styles.btnPressed
                    ]} onPress={() => handleAdjustSlot(posKey, -1)} disabled={isMin} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                              <react_native_svg_1.default width={14} height={14} viewBox="0 0 24 24" fill="none">
                                <react_native_svg_1.Path d="M5 12H19" stroke={isMin ? 'rgba(255,255,255,0.2)' : '#ffffff'} strokeWidth={2.5} strokeLinecap="round"/>
                              </react_native_svg_1.default>
                            </react_native_1.Pressable>
                            
                            {/* Value Display */}
                            <react_native_1.View style={styles.rosterValueContainer}>
                              <react_native_1.Text style={styles.rosterValueText}>{count}</react_native_1.Text>
                            </react_native_1.View>
                            
                            {/* Plus Button */}
                            <react_native_1.Pressable style={({ pressed }) => [
                        styles.rosterAdjustBtn,
                        isMax && styles.rosterAdjustBtnDisabled,
                        pressed && !isMax && styles.btnPressed
                    ]} onPress={() => handleAdjustSlot(posKey, 1)} disabled={isMax} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                              <react_native_svg_1.default width={14} height={14} viewBox="0 0 24 24" fill="none">
                                <react_native_svg_1.Path d="M12 5V19M5 12H19" stroke={isMax ? 'rgba(255,255,255,0.2)' : '#ffffff'} strokeWidth={2.5} strokeLinecap="round"/>
                              </react_native_svg_1.default>
                            </react_native_1.Pressable>
                          </react_native_1.View>
                        </react_native_1.View>);
            })}
                  </react_native_1.View>
                  
                  <react_native_1.Text style={styles.rosterPanelFooter}>
                    * Dynamically updates draft length. Currently: {activeRosterCount} draft rounds ({activeRosterCount} rounds active, {irRosterCount} IR slot{irRosterCount !== 1 ? 's' : ''} inactive).
                  </react_native_1.Text>
                </react_native_1.View>)}
            </react_native_1.View>

          </react_native_1.View>

          <react_native_1.Pressable style={({ pressed }) => [styles.autoDraftBtn, pressed && styles.autoDraftBtnPressed]} onPress={handleAutoLaunch}>
            <react_native_1.Text style={styles.autoDraftBtnText}>AUTO DRAFT</react_native_1.Text>
          </react_native_1.Pressable>

        </react_native_1.ScrollView>

        {/* PERSISTENT MOCK NOW BUTTON */}
        <react_native_1.Pressable style={({ pressed }) => [styles.persistentMockBtn, pressed && styles.persistentMockBtnPressed]} onPress={handleLaunch}>
          <react_native_1.Animated.View style={[styles.persistentMockBtnPulseBorder, { opacity: pulseAnim }]}/>
          <react_native_1.Text style={styles.persistentMockBtnText}>MOCK NOW</react_native_1.Text>
        </react_native_1.Pressable>

      </react_native_safe_area_context_1.SafeAreaView>
      <AppTabBar_1.default />
    </react_native_1.View>);
}
function createStyles(Colors) {
    const isDark = Colors.background === '#0c0c0c';
    const greenText = isDark ? '#22c55e' : '#166534';
    const greenBgGlow = isDark ? 'rgba(34, 197, 94, 0.08)' : 'rgba(22, 101, 52, 0.06)';
    const greenBorder = isDark ? 'rgba(34, 197, 94, 0.25)' : 'rgba(22, 101, 52, 0.2)';
    return react_native_1.StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colors.background,
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
            paddingVertical: theme_1.Spacing.two,
            minHeight: 52,
        },
        backBtn: {
            width: 44,
            height: 44,
            justifyContent: 'center',
            alignItems: 'flex-start',
        },
        headerTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 18,
            fontWeight: 'bold',
            color: '#ffffff',
            letterSpacing: 1,
        },
        scrollContent: {
            paddingHorizontal: theme_1.Spacing.three,
            paddingTop: theme_1.Spacing.one,
            paddingBottom: react_native_1.Platform.OS === 'ios' ? 190 : 170,
            gap: theme_1.Spacing.two,
        },
        sectionHeader: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9.5,
            color: Colors.secondaryAccent,
            fontWeight: 'bold',
            letterSpacing: 1.5,
            marginTop: theme_1.Spacing.two,
            marginBottom: theme_1.Spacing.one,
        },
        strategyGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            rowGap: 10,
            marginBottom: theme_1.Spacing.one,
        },
        strategyTile: {
            width: '32%',
            height: 96,
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 8,
            paddingVertical: 10,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
        },
        strategyTileActive: {
            backgroundColor: Colors.hofYellow,
            borderColor: Colors.hofYellow,
            borderWidth: 1.5,
        },
        strategyTileText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 10,
            fontWeight: 'bold',
            textAlign: 'center',
            letterSpacing: 0.2,
        },
        strategyTileTextActive: {
            color: '#000000',
        },
        strategyTileTextInactive: {
            color: Colors.secondaryAccent,
        },
        strategyTileDesc: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 8.5,
            textAlign: 'center',
            marginTop: 6,
            lineHeight: 11.5,
        },
        strategyTileDescActive: {
            color: '#000000',
            fontWeight: '500',
        },
        strategyTileDescInactive: {
            color: Colors.secondaryAccent,
            opacity: 0.8,
        },
        capsuleRow: {
            flexDirection: 'row',
            gap: 6,
        },
        capsuleChip: {
            flex: 1,
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 22,
            height: 44,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
        },
        capsuleChipActive: {
            backgroundColor: Colors.hofYellow,
            borderColor: Colors.hofYellow,
            borderWidth: 1.5,
        },
        capsuleText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 12,
            color: Colors.secondaryAccent,
            fontWeight: 'bold',
        },
        capsuleTextActive: {
            color: '#000000',
        },
        wheelHeaderRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: theme_1.Spacing.two,
        },
        badge: {
            backgroundColor: Colors.coltsNavy,
            borderColor: Colors.coltsNavy,
            borderWidth: 1.2,
            borderRadius: 6,
            paddingHorizontal: 8,
            paddingVertical: 3,
        },
        badgeText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9,
            color: Colors.hofYellow,
            fontWeight: '900',
        },
        wheelContainer: {
            backgroundColor: Colors.surfaceLifted,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 16,
            paddingVertical: theme_1.Spacing.two,
            shadowColor: Colors.shadows.shadowColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 6,
            elevation: 2,
        },
        wheelScroll: {
            paddingHorizontal: theme_1.Spacing.two,
            gap: 10,
        },
        wheelCell: {
            width: 46,
            height: 46,
            borderRadius: 23,
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
            backgroundColor: Colors.surface,
            justifyContent: 'center',
            alignItems: 'center',
        },
        wheelCellActive: {
            backgroundColor: Colors.hofYellow,
            borderColor: Colors.hofYellow,
            borderWidth: 1.5,
        },
        wheelCellText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 14,
            fontWeight: 'bold',
            color: Colors.secondaryAccent,
        },
        wheelCellTextActive: {
            color: '#000000',
        },
        activeCellPulseBorder: {
            ...react_native_1.StyleSheet.absoluteFillObject,
            borderColor: Colors.hofYellow,
            borderWidth: 2,
            borderRadius: 23,
        },
        formCard: {
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 16,
            overflow: 'hidden',
            shadowColor: Colors.shadows.shadowColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 6,
            elevation: 2,
        },
        formRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: theme_1.Spacing.three,
            height: 48,
        },
        rowLeft: {
            flex: 1,
        },
        formLabel: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 13,
            color: Colors.primaryAccent,
            fontWeight: '500',
        },
        rowRight: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme_1.Spacing.two,
        },
        formValue: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 13,
            color: Colors.coltsNavy,
            fontWeight: 'bold',
        },
        formDivider: {
            height: 1,
            backgroundColor: Colors.coltsNavyLight,
            marginHorizontal: theme_1.Spacing.three,
        },
        dropdownPanel: {
            flexDirection: 'row',
            backgroundColor: Colors.surfaceLifted,
            paddingHorizontal: theme_1.Spacing.three,
            paddingVertical: theme_1.Spacing.two,
            gap: 8,
            justifyContent: 'space-around',
        },
        dropdownChip: {
            flex: 1,
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 22,
            height: 44,
            justifyContent: 'center',
            alignItems: 'center',
        },
        dropdownChipActive: {
            borderColor: Colors.hofYellow,
            backgroundColor: Colors.hofYellow,
        },
        dropdownChipText: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 11,
            color: Colors.secondaryAccent,
            fontWeight: '600',
        },
        dropdownChipTextActive: {
            color: '#000000',
        },
        persistentMockBtn: {
            position: 'absolute',
            bottom: react_native_1.Platform.OS === 'ios' ? 104 : 96,
            right: theme_1.Spacing.three,
            backgroundColor: Colors.hofYellow,
            paddingHorizontal: 20,
            paddingVertical: 14,
            borderRadius: 30,
            borderWidth: 1.5,
            borderColor: Colors.hofYellow,
            minHeight: 48,
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
            ...react_native_1.StyleSheet.absoluteFillObject,
            borderColor: Colors.hofYellow,
            borderWidth: 1.5,
            borderRadius: 30,
        },
        persistentMockBtnPressed: {
            transform: [{ scale: 0.96 }],
            opacity: 0.95,
        },
        persistentMockBtnText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 14,
            color: '#040b1f',
            letterSpacing: 0.8,
        },
        autoDraftBtn: {
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavy,
            borderWidth: 1.5,
            borderRadius: 14,
            height: 52,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: theme_1.Spacing.two,
            marginBottom: theme_1.Spacing.four,
        },
        autoDraftBtnPressed: {
            transform: [{ scale: 0.98 }],
            backgroundColor: Colors.surfaceLifted,
        },
        autoDraftBtnText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 15,
            color: Colors.coltsNavy,
            fontWeight: '900',
            letterSpacing: 0.5,
        },
        infoBanner: {
            flexDirection: 'row',
            backgroundColor: 'rgba(255, 205, 0, 0.08)',
            borderColor: 'rgba(255, 205, 0, 0.35)',
            borderWidth: 1,
            borderRadius: 12,
            padding: theme_1.Spacing.two,
            alignItems: 'flex-start',
            gap: 10,
            marginTop: theme_1.Spacing.one,
        },
        infoBannerIcon: {
            marginTop: 2,
        },
        infoBannerText: {
            flex: 1,
            fontFamily: theme_1.Fonts.body,
            fontSize: 11,
            color: Colors.secondaryAccent,
            lineHeight: 15,
        },
        syncCircleBtn: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.12)',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
        },
        syncIndicatorLight: {
            position: 'absolute',
            top: -1,
            right: -1,
            width: 9,
            height: 9,
            borderRadius: 4.5,
            borderWidth: 1.5,
            borderColor: Colors.coltsNavy,
        },
        syncLightBlue: {
            backgroundColor: '#3b82f6',
        },
        syncLightGreen: {
            backgroundColor: '#22c55e',
        },
        syncLightGrey: {
            backgroundColor: '#64748b',
        },
        strategyDropdownPanel: {
            backgroundColor: Colors.surfaceLifted,
            paddingHorizontal: theme_1.Spacing.three,
            paddingVertical: theme_1.Spacing.three,
            gap: 10,
        },
        strategyCard: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 14,
            minHeight: 48,
        },
        strategyCardActive: {
            borderColor: Colors.coltsNavy,
            backgroundColor: 'rgba(224, 49, 34, 0.04)',
        },
        strategyCardTextContainer: {
            flex: 1,
            paddingRight: 10,
        },
        strategyCardTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 12,
            color: Colors.primaryAccent,
            fontWeight: 'bold',
            letterSpacing: 0.5,
        },
        strategyCardTitleActive: {
            color: Colors.coltsNavy,
        },
        strategyCardDesc: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 10.5,
            color: Colors.secondaryAccent,
            marginTop: 2,
        },
        strategyIndicator: {
            justifyContent: 'center',
            alignItems: 'center',
            width: 24,
            height: 24,
        },
        customRulesPanel: {
            backgroundColor: Colors.surfaceLifted,
            paddingHorizontal: theme_1.Spacing.three,
            paddingVertical: theme_1.Spacing.three,
            gap: 12,
        },
        customRuleRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        customRuleLabel: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 12,
            color: Colors.primaryAccent,
            fontWeight: 'bold',
        },
        segmentContainer: {
            flexDirection: 'row',
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 8,
            padding: 3,
            gap: 4,
        },
        segmentButton: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
            minWidth: 76,
            minHeight: 36,
            justifyContent: 'center',
            alignItems: 'center',
        },
        segmentButtonActive: {
            backgroundColor: Colors.hofYellow,
        },
        segmentButtonText: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 10.5,
            color: Colors.secondaryAccent,
            fontWeight: 'bold',
        },
        segmentButtonTextActive: {
            color: '#000000',
            fontWeight: '900',
        },
        rosterPanel: {
            backgroundColor: Colors.surfaceLifted,
            paddingHorizontal: theme_1.Spacing.three,
            paddingVertical: theme_1.Spacing.three,
            gap: 10,
        },
        rosterPanelTitle: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9,
            color: Colors.secondaryAccent,
            fontWeight: '800',
            letterSpacing: 1,
            marginBottom: 4,
        },
        rosterListContainer: {
            gap: 8,
            marginVertical: 4,
        },
        rosterRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 4,
            paddingHorizontal: 12,
            backgroundColor: Colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
            minHeight: 44,
        },
        rosterRowLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            flex: 1,
        },
        rosterRowBadge: {
            width: 48,
            height: 30,
            borderRadius: 6,
            backgroundColor: Colors.surfaceLifted,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
        },
        rosterRowBadgeText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 10.5,
            fontWeight: 'bold',
            color: Colors.coltsNavy,
        },
        rosterRowLabels: {
            gap: 2,
            flex: 1,
        },
        rosterRowLabelMain: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 13.5,
            fontWeight: '700',
            color: Colors.primaryAccent,
        },
        rosterRowLabelSub: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 10.5,
            color: Colors.secondaryAccent,
        },
        rosterRowRight: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        rosterAdjustBtn: {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: Colors.coltsNavy,
            borderWidth: 1,
            borderColor: Colors.coltsNavy,
            justifyContent: 'center',
            alignItems: 'center',
        },
        rosterAdjustBtnDisabled: {
            opacity: 0.25,
        },
        rosterValueContainer: {
            width: 24,
            alignItems: 'center',
            justifyContent: 'center',
        },
        rosterValueText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 16,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
        },
        rosterPanelFooter: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 10.5,
            color: Colors.secondaryAccent,
            fontStyle: 'italic',
            marginTop: 4,
        },
        btnPressed: {
            opacity: 0.6,
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
