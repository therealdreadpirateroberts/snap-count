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
exports.default = ExecutiveDashboardScreen;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const react_native_svg_1 = __importStar(require("react-native-svg"));
const theme_1 = require("@/constants/theme");
const useThemeStore_1 = require("@/store/useThemeStore");
const useMockMaxxingStore_1 = require("@/store/useMockMaxxingStore");
const BackgroundTexture_1 = __importDefault(require("@/components/BackgroundTexture"));
const AppHeader_1 = __importDefault(require("@/components/AppHeader"));
const AppTabBar_1 = __importDefault(require("@/components/AppTabBar"));
const Haptics = __importStar(require("expo-haptics"));
function ExecutiveDashboardScreen() {
    const Colors = (0, theme_1.useColors)();
    const router = (0, expo_router_1.useRouter)();
    const theme = (0, useThemeStore_1.useThemeStore)((state) => state.theme);
    // Zustand State Subscription
    const { featuredSlot1Key, homepageTileCap, setHomepageTileCap, showNewsOnHomepage, setShowNewsOnHomepage, liveSimRunning, startLiveSimulationLoop, stopLiveSimulationLoop, clearSimulatedCohorts, resetLiveSimulationStats } = (0, useMockMaxxingStore_1.useMockMaxxingStore)();
    // Modal Visibility States
    const [capperModalVisible, setCapperModalVisible] = (0, react_1.useState)(false);
    const [telemetryModalVisible, setTelemetryModalVisible] = (0, react_1.useState)(false);
    const [advisorModalVisible, setAdvisorModalVisible] = (0, react_1.useState)(false);
    // Animation values for scale press hooks
    const scaleRef = (0, react_1.useRef)({}).current;
    // Real-time speed & telemetry mock parameters for executive display
    const [draftsPerSec, setDraftsPerSec] = (0, react_1.useState)(4820.5);
    const [systemStability, setSystemStability] = (0, react_1.useState)(99.98);
    const [activeThreads, setActiveThreads] = (0, react_1.useState)(128);
    const getScale = (id) => {
        if (!scaleRef[id]) {
            scaleRef[id] = new react_native_1.Animated.Value(1);
        }
        return scaleRef[id];
    };
    const handlePressIn = (id) => {
        react_native_1.Animated.spring(getScale(id), {
            toValue: 0.97,
            useNativeDriver: true,
            tension: 180,
            friction: 8,
        }).start();
    };
    const handlePressOut = (id) => {
        react_native_1.Animated.spring(getScale(id), {
            toValue: 1,
            useNativeDriver: true,
            tension: 180,
            friction: 8,
        }).start();
    };
    const triggerHaptic = async (style = Haptics.ImpactFeedbackStyle.Light) => {
        if (react_native_1.Platform.OS !== 'web') {
            try {
                await Haptics.impactAsync(style);
            }
            catch (err) { }
        }
    };
    // Flashing telemetry loop
    (0, react_1.useEffect)(() => {
        let interval = null;
        if (liveSimRunning) {
            interval = setInterval(() => {
                setDraftsPerSec(prev => +(prev + (Math.random() - 0.5) * 80).toFixed(1));
                setSystemStability(prev => +(99.95 + Math.random() * 0.04).toFixed(3));
                setActiveThreads(prev => Math.floor(120 + Math.random() * 16));
            }, 1000);
        }
        else {
            interval = setInterval(() => {
                setDraftsPerSec(prev => +(prev * 0.98).toFixed(1));
                setSystemStability(99.99);
                setActiveThreads(0);
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [liveSimRunning]);
    // Advisor advice updates dynamically depending on the configurations chosen
    const getAdvisorInsights = () => {
        const insights = [];
        if (homepageTileCap < 8) {
            insights.push("⚠️ DENSE FOCUS: Cap is set extremely low. Users will only see core functions; secondary tools are hidden.");
        }
        else if (homepageTileCap > 10) {
            insights.push("💡 LEAGUE COVERAGE: High homepage tile count. Ensure top priority items are pinned to prevent scanner decay.");
        }
        else {
            insights.push("🎯 OPTIMAL VISIBILITY: Standard 10-tile boundary limits are fully enforced. HIG scanner density is balanced.");
        }
        if (featuredSlot1Key === 'mock-draft') {
            insights.push("👑 DRAFT DOMINANCE: 'Mock Draft Suite' pinned to Slot 1A. Drive immediate conversion of standard bot setup runs.");
        }
        else if (featuredSlot1Key === 'top250') {
            insights.push("👑 EXPERT SCENARIOS: 'Top 250 Consensus Matrix' promoted. ADP variance scanner is prioritized on first load.");
        }
        else {
            insights.push(`👑 BRAND ALIGNMENT: '${featuredSlot1Key.toUpperCase()}' promoted to Slot 1A. Observe conversion metric telemetry closely.`);
        }
        if (!showNewsOnHomepage) {
            insights.push("✅ NEWS COMPRESSION: NFL Stories are completely excluded. 100% focused on core drafting software engines.");
        }
        else {
            insights.push("💡 HYBRID VIEWPORT: Stories and telemetry integrated on landing grid. News telemetry is syncing in the background.");
        }
        if (liveSimRunning) {
            insights.push("🚀 LIVE CONCURRENCY: Monte Carlo swarm evolution loop active. Concurrency threads and evolution matrices are peaking.");
        }
        else {
            insights.push("💤 TELEMETRY SLEEP: Sweepers are idle. Awaiting evolution command loops from the command console.");
        }
        return insights;
    };
    const capsList = [5, 8, 10, 12];
    const styles = createStyles(Colors, theme);
    // SVG Graphics for Tiles (to look exact same as homepage)
    const renderDashboardCardGraphic = (type) => {
        switch (type) {
            case 'promo':
                return (<react_native_svg_1.default width="100%" height="160" viewBox="0 0 320 160" preserveAspectRatio="none">
            <react_native_svg_1.Defs>
              <react_native_svg_1.LinearGradient id="promoGrad" x1="0" y1="0" x2="1" y2="1">
                <react_native_svg_1.Stop offset="0%" stopColor="#1E293B"/>
                <react_native_svg_1.Stop offset="100%" stopColor="#0c0c0c"/>
              </react_native_svg_1.LinearGradient>
            </react_native_svg_1.Defs>
            <react_native_svg_1.Rect width="320" height="160" fill="url(#promoGrad)"/>
            
            {/* Outline Slot Mockups */}
            <react_native_svg_1.Rect x="40" y="45" width="60" height="70" rx="6" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"/>
            <react_native_svg_1.Rect x="130" y="45" width="60" height="70" rx="6" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"/>
            <react_native_svg_1.Rect x="220" y="45" width="60" height="70" rx="6" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"/>

            {/* Pinned Crown inside slot 1 */}
            <react_native_svg_1.G transform="translate(70, 75) scale(1.1)">
              <react_native_svg_1.Circle cx="0" cy="0" r="22" fill="none" stroke={Colors.hofYellow} strokeWidth="1.5" strokeDasharray="5,3"/>
              {/* Crown */}
              <react_native_svg_1.Path d="M-8 8 L8 8 L10 -4 L4 2 L0 -8 L-4 2 L-10 -4 Z" fill={Colors.hofYellow}/>
            </react_native_svg_1.G>

            {/* Barcode details for tech aesthetic */}
            <react_native_svg_1.Rect x="140" y="85" width="40" height="4" fill="rgba(255, 255, 255, 0.2)"/>
            <react_native_svg_1.Rect x="140" y="93" width="25" height="4" fill="rgba(255, 255, 255, 0.15)"/>
            <react_native_svg_1.Rect x="230" y="85" width="40" height="4" fill="rgba(255, 255, 255, 0.2)"/>
            <react_native_svg_1.Rect x="230" y="93" width="30" height="4" fill="rgba(255, 255, 255, 0.15)"/>
          </react_native_svg_1.default>);
            case 'capper':
                return (<react_native_svg_1.default width="100%" height="160" viewBox="0 0 320 160" preserveAspectRatio="none">
            <react_native_svg_1.Defs>
              <react_native_svg_1.LinearGradient id="capperGrad" x1="0" y1="0" x2="1" y2="1">
                <react_native_svg_1.Stop offset="0%" stopColor="#0c0c0c"/>
                <react_native_svg_1.Stop offset="100%" stopColor="#1e293b"/>
              </react_native_svg_1.LinearGradient>
            </react_native_svg_1.Defs>
            <react_native_svg_1.Rect width="320" height="160" fill="url(#capperGrad)"/>

            {/* Switcher & Grid mockups */}
            <react_native_svg_1.Rect x="50" y="40" width="220" height="80" rx="8" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
            
            {/* Grid Cap blocks */}
            <react_native_svg_1.Rect x="70" y="60" width="32" height="32" rx="16" fill={Colors.hofYellow}/>
            <react_native_svg_1.Text x="86" y="80" fill="#000000" fontSize="12" fontWeight="bold" textAnchor="middle">10</react_native_svg_1.Text>

            <react_native_svg_1.Circle cx="130" cy="76" r="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <react_native_svg_1.Text x="130" y="80" fill="rgba(255,255,255,0.5)" fontSize="10" fontWeight="bold" textAnchor="middle">12</react_native_svg_1.Text>

            {/* Toggle switch track */}
            <react_native_svg_1.Rect x="180" y="64" width="60" height="24" rx="12" fill={Colors.coltsNavy}/>
            <react_native_svg_1.Circle cx="228" cy="76" r="10" fill="#FFFFFF"/>
          </react_native_svg_1.default>);
            case 'telemetry':
                return (<react_native_svg_1.default width="100%" height="160" viewBox="0 0 320 160" preserveAspectRatio="none">
            <react_native_svg_1.Defs>
              <react_native_svg_1.LinearGradient id="telGrad" x1="0" y1="0" x2="1" y2="1">
                <react_native_svg_1.Stop offset="0%" stopColor="#0F172A"/>
                <react_native_svg_1.Stop offset="100%" stopColor="#1E293B"/>
              </react_native_svg_1.LinearGradient>
            </react_native_svg_1.Defs>
            <react_native_svg_1.Rect width="320" height="160" fill="url(#telGrad)"/>
            
            {/* Speed dial */}
            <react_native_svg_1.G transform="translate(160, 80) scale(1.1)">
              <react_native_svg_1.Circle cx="0" cy="0" r="30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6"/>
              <react_native_svg_1.Circle cx="0" cy="0" r="30" fill="none" stroke={Colors.hofYellow} strokeWidth="6" strokeDasharray="188.4" strokeDashoffset={188.4 * 0.3} strokeLinecap="round" transform="rotate(-90)"/>
              <react_native_svg_1.Text x="0" y="5" fill="#ffffff" fontSize="11" fontFamily="JetBrainsMono-Bold" textAnchor="middle">PEAK</react_native_svg_1.Text>
            </react_native_svg_1.G>

            {/* Simulated bar chart columns in corner */}
            <react_native_svg_1.Rect x="40" y="100" width="10" height="30" fill="rgba(255,113,113,0.3)" rx="2"/>
            <react_native_svg_1.Rect x="60" y="80" width="10" height="50" fill="rgba(74,222,128,0.5)" rx="2"/>
            <react_native_svg_1.Rect x="80" y="90" width="10" height="40" fill="rgba(96,165,250,0.4)" rx="2"/>

            <react_native_svg_1.Rect x="230" y="100" width="10" height="30" fill="rgba(251,146,60,0.3)" rx="2"/>
            <react_native_svg_1.Rect x="250" y="70" width="10" height="60" fill={Colors.hofYellow} rx="2"/>
            <react_native_svg_1.Rect x="270" y="95" width="10" height="35" fill="rgba(192,132,252,0.4)" rx="2"/>
          </react_native_svg_1.default>);
            case 'advisor':
                return (<react_native_svg_1.default width="100%" height="160" viewBox="0 0 320 160" preserveAspectRatio="none">
            <react_native_svg_1.Defs>
              <react_native_svg_1.LinearGradient id="advGrad" x1="0" y1="0" x2="1" y2="1">
                <react_native_svg_1.Stop offset="0%" stopColor="#1E293B"/>
                <react_native_svg_1.Stop offset="100%" stopColor="#0c0c0c"/>
              </react_native_svg_1.LinearGradient>
            </react_native_svg_1.Defs>
            <react_native_svg_1.Rect width="320" height="160" fill="url(#advGrad)"/>

            {/* Neural Brain node lines */}
            <react_native_svg_1.G stroke="rgba(190, 169, 142, 0.2)" strokeWidth="1">
              <react_native_svg_1.Line x1="160" y1="80" x2="110" y2="50"/>
              <react_native_svg_1.Line x1="160" y1="80" x2="210" y2="50"/>
              <react_native_svg_1.Line x1="160" y1="80" x2="110" y2="110"/>
              <react_native_svg_1.Line x1="160" y1="80" x2="210" y2="110"/>
              
              <react_native_svg_1.Line x1="110" y1="50" x2="60" y2="80"/>
              <react_native_svg_1.Line x1="110" y1="110" x2="60" y2="80"/>
              <react_native_svg_1.Line x1="210" y1="50" x2="260" y2="80"/>
              <react_native_svg_1.Line x1="210" y1="110" x2="260" y2="80"/>
            </react_native_svg_1.G>

            {/* Glow nodes */}
            <react_native_svg_1.Circle cx="160" cy="80" r="10" fill="#bea98e"/>
            <react_native_svg_1.Circle cx="160" cy="80" r="15" fill="none" stroke="#bea98e" strokeWidth="1" strokeDasharray="3 3"/>
            
            <react_native_svg_1.Circle cx="110" cy="50" r="6" fill="#4a4a4a"/>
            <react_native_svg_1.Circle cx="210" cy="50" r="6" fill="#4a4a4a"/>
            <react_native_svg_1.Circle cx="110" cy="110" r="6" fill="#4a4a4a"/>
            <react_native_svg_1.Circle cx="210" cy="110" r="6" fill="#4a4a4a"/>

            <react_native_svg_1.Circle cx="60" cy="80" r="8" fill="#22C55E"/>
            <react_native_svg_1.Circle cx="260" cy="80" r="8" fill={Colors.hofYellow}/>
          </react_native_svg_1.default>);
        }
    };
    return (<react_native_1.View style={styles.container}>
      <BackgroundTexture_1.default />
      <react_native_safe_area_context_1.SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        
        {/* Universal sub-page header */}
        <AppHeader_1.default title="EXECUTIVE DASHBOARD" subtitle="CEO Control Console" showBack={true} backText="PROFILE"/>

        <react_native_1.ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <react_native_1.Text style={styles.sectionHeader}>CEO SYSTEM TOOLS</react_native_1.Text>
          
          <react_native_1.View style={styles.tileGrid}>
            
            {/* TILE 1: PRIME 1A TILE PROMOTION */}
            <react_native_1.Pressable style={({ pressed }) => [
            styles.tileCard,
            pressed && { opacity: 0.96, transform: [{ scale: 0.98 }] }
        ]} onPress={() => {
            triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/qa-simulation');
        }}>
              <react_native_1.View style={styles.tileImageContainer}>
                {renderDashboardCardGraphic('promo')}
              </react_native_1.View>
              <react_native_1.View style={styles.tileContent}>
                <react_native_1.Text style={styles.tileKicker}>Prioritization</react_native_1.Text>
                <react_native_1.Text style={styles.tileTitle}>Slot 1A Tile Promotion</react_native_1.Text>
                <react_native_1.Text style={styles.tileDescription} numberOfLines={3} ellipsizeMode="tail">
                  Configure and prioritize which premium analytical tool is pinned to the index 0 position (Prime 1A) on the homepage. Instantly shifts the grid hierarchy.
                </react_native_1.Text>
                <react_native_1.Pressable style={({ pressed }) => [styles.tileButton, pressed && { opacity: 0.9 }]} onPress={() => {
            triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/qa-simulation');
        }}>
                  <react_native_1.Text style={styles.tileButtonText}>LAUNCH PROMOTION PANEL</react_native_1.Text>
                </react_native_1.Pressable>
              </react_native_1.View>
            </react_native_1.Pressable>

            {/* TILE 2: HOMEPAGE FEED CONFIGURATOR */}
            <react_native_1.Pressable style={({ pressed }) => [
            styles.tileCard,
            pressed && { opacity: 0.96, transform: [{ scale: 0.98 }] }
        ]} onPress={() => {
            triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
            setCapperModalVisible(true);
        }}>
              <react_native_1.View style={styles.tileImageContainer}>
                {renderDashboardCardGraphic('capper')}
              </react_native_1.View>
              <react_native_1.View style={styles.tileContent}>
                <react_native_1.Text style={styles.tileKicker}>Feed Customization</react_native_1.Text>
                <react_native_1.Text style={styles.tileTitle}>Grid Tile Limits & News</react_native_1.Text>
                <react_native_1.Text style={styles.tileDescription} numberOfLines={3} ellipsizeMode="tail">
                  Manage homepage clutter by setting strict total tile limits (5, 8, 10, or 12) and toggle global injury tickers or NFL news crawlers ON or OFF.
                </react_native_1.Text>
                <react_native_1.Pressable style={({ pressed }) => [styles.tileButton, pressed && { opacity: 0.9 }]} onPress={() => {
            triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
            setCapperModalVisible(true);
        }}>
                  <react_native_1.Text style={styles.tileButtonText}>OPEN GRID CONFIGURATOR</react_native_1.Text>
                </react_native_1.Pressable>
              </react_native_1.View>
            </react_native_1.Pressable>

            {/* TILE 3: SIMULATION SWEEPS & TELEMETRY */}
            <react_native_1.Pressable style={({ pressed }) => [
            styles.tileCard,
            pressed && { opacity: 0.96, transform: [{ scale: 0.98 }] }
        ]} onPress={() => {
            triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
            setTelemetryModalVisible(true);
        }}>
              <react_native_1.View style={styles.tileImageContainer}>
                {renderDashboardCardGraphic('telemetry')}
              </react_native_1.View>
              <react_native_1.View style={styles.tileContent}>
                <react_native_1.Text style={styles.tileKicker}>Monte Carlo Lab</react_native_1.Text>
                <react_native_1.Text style={styles.tileTitle}>Throughput & Strategy Telemetry</react_native_1.Text>
                <react_native_1.Text style={styles.tileDescription} numberOfLines={3} ellipsizeMode="tail">
                  Operate dynamic CPU Monte Carlo sweepers. Graph simulated strategy win indices, inspect evolved bot army standings, and flush system run data.
                </react_native_1.Text>
                <react_native_1.Pressable style={({ pressed }) => [styles.tileButton, pressed && { opacity: 0.9 }]} onPress={() => {
            triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
            setTelemetryModalVisible(true);
        }}>
                  <react_native_1.Text style={styles.tileButtonText}>LAUNCH TELEMETRY MODULE</react_native_1.Text>
                </react_native_1.Pressable>
              </react_native_1.View>
            </react_native_1.Pressable>

            {/* TILE 4: AI ENGINE ADVISOR */}
            <react_native_1.Pressable style={({ pressed }) => [
            styles.tileCard,
            pressed && { opacity: 0.96, transform: [{ scale: 0.98 }] }
        ]} onPress={() => {
            triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
            setAdvisorModalVisible(true);
        }}>
              <react_native_1.View style={styles.tileImageContainer}>
                {renderDashboardCardGraphic('advisor')}
              </react_native_1.View>
              <react_native_1.View style={styles.tileContent}>
                <react_native_1.Text style={styles.tileKicker}>Heuristic Diagnostics</react_native_1.Text>
                <react_native_1.Text style={styles.tileTitle}>AI Engine Advisor Console</react_native_1.Text>
                <react_native_1.Text style={styles.tileDescription} numberOfLines={3} ellipsizeMode="tail">
                  Access dynamic strategy advice, concurrency performance warnings, and real-time analytical findings generated by our diagnostic engine core.
                </react_native_1.Text>
                <react_native_1.Pressable style={({ pressed }) => [styles.tileButton, pressed && { opacity: 0.9 }]} onPress={() => {
            triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
            setAdvisorModalVisible(true);
        }}>
                  <react_native_1.Text style={styles.tileButtonText}>OPEN ADVISOR CONSOLE</react_native_1.Text>
                </react_native_1.Pressable>
              </react_native_1.View>
            </react_native_1.Pressable>

          </react_native_1.View>
        </react_native_1.ScrollView>
      </react_native_safe_area_context_1.SafeAreaView>
      <AppTabBar_1.default />

      {/* ========================================================== */}
      {/*             MODAL OVERLAYS (EXECUTIVE WORKSPACES)          */}
      {/* ========================================================== */}

      {/* 1. HOMEPAGE FEED CONFIGURATOR MODAL */}
      <react_native_1.Modal visible={capperModalVisible} animationType="slide" transparent={true} onRequestClose={() => setCapperModalVisible(false)}>
        <react_native_1.View style={styles.modalBackdrop}>
          <react_native_1.View style={styles.modalSheetContainer}>
            <react_native_1.View style={styles.modalHeaderRow}>
              <react_native_1.Text style={styles.modalSheetTitle}>⚙️ HOMEPAGE GRID CONFIGURATOR</react_native_1.Text>
              <react_native_1.Pressable onPress={() => {
            triggerHaptic();
            setCapperModalVisible(false);
        }} style={styles.modalCloseIconBtn}>
                <react_native_1.Text style={styles.modalCloseText}>✕</react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.View>

            <react_native_1.ScrollView contentContainerStyle={styles.modalScrollContent}>
              <react_native_1.Text style={styles.modalSectionDesc}>
                Fine-tune homepage constraints. Cap visual clutter and enable/disable injury crawlers.
              </react_native_1.Text>

              {/* Tile Limits setting */}
              <react_native_1.View style={styles.configSettingRow}>
                <react_native_1.View style={styles.settingDetails}>
                  <react_native_1.Text style={styles.settingLabel}>HOMEPAGE TILES CAP</react_native_1.Text>
                  <react_native_1.Text style={styles.settingSubLabel}>Cap final homepage feature tiles</react_native_1.Text>
                </react_native_1.View>
                <react_native_1.View style={styles.capperChipsRow}>
                  {capsList.map((num) => {
            const active = homepageTileCap === num;
            const animScale = getScale('cap_' + num);
            return (<react_native_1.Animated.View key={num} style={{ transform: [{ scale: animScale }] }}>
                        <react_native_1.Pressable onPressIn={() => handlePressIn('cap_' + num)} onPressOut={() => handlePressOut('cap_' + num)} onPress={() => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                    setHomepageTileCap(num);
                }} style={[styles.capperChip, active && styles.capperChipActive]}>
                          <react_native_1.Text style={[styles.capperChipText, active && styles.capperChipTextActive]}>
                            {num}
                          </react_native_1.Text>
                        </react_native_1.Pressable>
                      </react_native_1.Animated.View>);
        })}
                </react_native_1.View>
              </react_native_1.View>

              <react_native_1.View style={styles.horizontalDivider}/>

              {/* News crawler toggle */}
              <react_native_1.View style={styles.configSettingRow}>
                <react_native_1.View style={styles.settingDetails}>
                  <react_native_1.Text style={styles.settingLabel}>NEWS STORIES ON HOMEPAGE</react_native_1.Text>
                  <react_native_1.Text style={styles.settingSubLabel}>Toggle global injury tickers or crawler blocks</react_native_1.Text>
                </react_native_1.View>
                <react_native_1.Switch value={showNewsOnHomepage} onValueChange={(val) => {
            triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
            setShowNewsOnHomepage(val);
        }} trackColor={{ false: '#4a4a4a', true: Colors.coltsNavy }} thumbColor="#FFFFFF"/>
              </react_native_1.View>

              <react_native_1.Pressable onPress={() => {
            triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
            setCapperModalVisible(false);
        }} style={styles.modalCtaBtn}>
                <react_native_1.Text style={styles.modalCtaBtnText}>APPLY CONFIGURATION</react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.ScrollView>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.Modal>

      {/* 2. SIMULATION SWEEPS & TELEMETRY MODAL */}
      <react_native_1.Modal visible={telemetryModalVisible} animationType="slide" transparent={true} onRequestClose={() => setTelemetryModalVisible(false)}>
        <react_native_1.View style={styles.modalBackdrop}>
          <react_native_1.View style={styles.modalSheetContainer}>
            <react_native_1.View style={styles.modalHeaderRow}>
              <react_native_1.Text style={styles.modalSheetTitle}>📊 TELEMETRY & SIMULATOR CONSOLE</react_native_1.Text>
              <react_native_1.Pressable onPress={() => {
            triggerHaptic();
            setTelemetryModalVisible(false);
        }} style={styles.modalCloseIconBtn}>
                <react_native_1.Text style={styles.modalCloseText}>✕</react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.View>

            <react_native_1.ScrollView contentContainerStyle={styles.modalScrollContent} showsVerticalScrollIndicator={false}>
              
              {/* Speed / Stability Gauges */}
              <react_native_1.View style={styles.metricsGridRow}>
                <react_native_1.View style={styles.metricsCard}>
                  <react_native_1.Text style={styles.metricsCardTitle}>THROUGHPUT SPEED</react_native_1.Text>
                  <react_native_1.View style={styles.dialContainer}>
                    <react_native_svg_1.default width={90} height={90} viewBox="0 0 100 100">
                      <react_native_svg_1.Defs>
                        <react_native_svg_1.LinearGradient id="gaugeGrad" x1="0" y1="1" x2="1" y2="0">
                          <react_native_svg_1.Stop offset="0%" stopColor="#4158D0"/>
                          <react_native_svg_1.Stop offset="100%" stopColor="#FFCD00"/>
                        </react_native_svg_1.LinearGradient>
                      </react_native_svg_1.Defs>
                      <react_native_svg_1.Circle cx="50" cy="50" r="40" fill="none" stroke="#0c0c0c" strokeWidth="8"/>
                      <react_native_svg_1.Circle cx="50" cy="50" r="40" fill="none" stroke="url(#gaugeGrad)" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (liveSimRunning ? 0.76 : 0.05))} strokeLinecap="round" transform="rotate(-90 50 50)"/>
                    </react_native_svg_1.default>
                    <react_native_1.View style={styles.dialOverlay}>
                      <react_native_1.Text style={styles.dialMainVal}>{liveSimRunning ? 'PEAK' : 'IDLE'}</react_native_1.Text>
                      <react_native_1.Text style={styles.dialSubLabel}>THREADS</react_native_1.Text>
                    </react_native_1.View>
                  </react_native_1.View>
                  <react_native_1.Text style={styles.monoStatText}>
                    {draftsPerSec.toLocaleString()} <react_native_1.Text style={styles.monoStatUnit}>picks/s</react_native_1.Text>
                  </react_native_1.Text>
                </react_native_1.View>

                <react_native_1.View style={styles.metricsCard}>
                  <react_native_1.Text style={styles.metricsCardTitle}>SYSTEM HEALTH</react_native_1.Text>
                  <react_native_1.View style={styles.dialContainer}>
                    <react_native_svg_1.default width={90} height={90} viewBox="0 0 100 100">
                      <react_native_svg_1.Circle cx="50" cy="50" r="40" fill="none" stroke="#0c0c0c" strokeWidth="8"/>
                      <react_native_svg_1.Circle cx="50" cy="50" r="40" fill="none" stroke={Colors.hofYellow} strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 0.999)} strokeLinecap="round" transform="rotate(-90 50 50)"/>
                    </react_native_svg_1.default>
                    <react_native_1.View style={styles.dialOverlay}>
                      <react_native_1.Text style={[styles.dialMainVal, { color: Colors.hofYellow }]}>{systemStability}%</react_native_1.Text>
                      <react_native_1.Text style={styles.dialSubLabel}>STABLE</react_native_1.Text>
                    </react_native_1.View>
                  </react_native_1.View>
                  <react_native_1.Text style={styles.monoStatText}>
                    {activeThreads} <react_native_1.Text style={styles.monoStatUnit}>concurrency</react_native_1.Text>
                  </react_native_1.Text>
                </react_native_1.View>
              </react_native_1.View>

              {/* Strategy Performance Bar Chart */}
              <react_native_1.View style={styles.chartPanel}>
                <react_native_1.Text style={styles.chartPanelTitle}>COHORT PERFORMANCE INDEX</react_native_1.Text>
                <react_native_1.View style={styles.chartContainer}>
                  <react_native_svg_1.default width="100%" height={110} viewBox="0 0 200 110">
                    <react_native_svg_1.Line x1="10" y1="10" x2="10" y2="90" stroke="#4a4a4a" strokeWidth="1"/>
                    <react_native_svg_1.Line x1="10" y1="90" x2="190" y2="90" stroke="#4a4a4a" strokeWidth="1"/>
                    
                    {/* Zero RB */}
                    <react_native_svg_1.Rect x="25" y={90 - (80 * 0.42)} width="14" height={80 * 0.42} fill="#ff7171" rx="2"/>
                    {/* Hero RB */}
                    <react_native_svg_1.Rect x="52" y={90 - (80 * 0.51)} width="14" height={80 * 0.51} fill="#4ade80" rx="2"/>
                    {/* Balanced */}
                    <react_native_svg_1.Rect x="79" y={90 - (80 * 0.48)} width="14" height={80 * 0.48} fill="#60a5fa" rx="2"/>
                    {/* Late QB/TE */}
                    <react_native_svg_1.Rect x="106" y={90 - (80 * 0.45)} width="14" height={80 * 0.45} fill="#fb923c" rx="2"/>
                    {/* Robust RB */}
                    <react_native_svg_1.Rect x="133" y={90 - (80 * 0.44)} width="14" height={80 * 0.44} fill="#c084fc" rx="2"/>
                    {/* Elite QB/TE */}
                    <react_native_svg_1.Rect x="160" y={90 - (80 * 0.46)} width="14" height={80 * 0.46} fill={Colors.hofYellow} rx="2"/>
                  </react_native_svg_1.default>
                </react_native_1.View>
                <react_native_1.View style={styles.chartLabelsRow}>
                  <react_native_1.Text style={styles.chartMiniLabel}>Z-RB</react_native_1.Text>
                  <react_native_1.Text style={styles.chartMiniLabel}>H-RB</react_native_1.Text>
                  <react_native_1.Text style={styles.chartMiniLabel}>BAL</react_native_1.Text>
                  <react_native_1.Text style={styles.chartMiniLabel}>L-QB</react_native_1.Text>
                  <react_native_1.Text style={styles.chartMiniLabel}>R-RB</react_native_1.Text>
                  <react_native_1.Text style={styles.chartMiniLabel}>E-QB</react_native_1.Text>
                </react_native_1.View>
              </react_native_1.View>

              {/* Standing bot army grid */}
              <react_native_1.View style={styles.standingsPanel}>
                <react_native_1.Text style={styles.chartPanelTitle}>EVOLVED BOT ARMY WIN SUMMARY</react_native_1.Text>
                <react_native_1.View style={styles.standingsGrid}>
                  <react_native_1.View style={styles.standingHeaderRow}>
                    <react_native_1.Text style={styles.standingHeaderLabel}>BOT NAME</react_native_1.Text>
                    <react_native_1.Text style={styles.standingHeaderLabel}>CAMP</react_native_1.Text>
                    <react_native_1.Text style={styles.standingHeaderLabel}>INDEX</react_native_1.Text>
                  </react_native_1.View>
                  {[
            { name: 'ANDY', strategy: 'Zero RB', rate: '59.2%' },
            { name: 'JASON', strategy: 'Hero RB', rate: '56.3%' },
            { name: 'MIKE', strategy: 'Balanced', rate: '53.3%' },
            { name: 'SARAH', strategy: 'Robust RB', rate: '50.8%' },
        ].map((bot, idx) => (<react_native_1.View key={bot.name} style={styles.standingDataRow}>
                      <react_native_1.Text style={styles.standingName}>#{idx + 1} {bot.name}</react_native_1.Text>
                      <react_native_1.Text style={styles.standingCamp}>{bot.strategy}</react_native_1.Text>
                      <react_native_1.Text style={styles.standingRate}>{bot.rate}</react_native_1.Text>
                    </react_native_1.View>))}
                </react_native_1.View>
              </react_native_1.View>

              {/* Loop Operations Controls */}
              <react_native_1.View style={styles.operationsCard}>
                <react_native_1.Text style={styles.operationsTitle}>MONTE CARLO CRAWLER CORE</react_native_1.Text>
                <react_native_1.View style={styles.operationsBtnRow}>
                  <react_native_1.Pressable onPress={() => {
            triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
            if (liveSimRunning) {
                stopLiveSimulationLoop();
            }
            else {
                startLiveSimulationLoop();
            }
        }} style={[styles.opBtn, liveSimRunning ? styles.opBtnActive : styles.opBtnDefault]}>
                    <react_native_1.Text style={[styles.opBtnText, liveSimRunning ? styles.opBtnTextActive : styles.opBtnTextDefault]}>
                      {liveSimRunning ? 'PAUSE LOOP' : 'RUN SWEEP'}
                    </react_native_1.Text>
                  </react_native_1.Pressable>

                  <react_native_1.Pressable onPress={() => {
            triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
            clearSimulatedCohorts();
            resetLiveSimulationStats();
        }} style={styles.opBtnWipe}>
                    <react_native_1.Text style={styles.opBtnTextWipe}>WIPE RUNS</react_native_1.Text>
                  </react_native_1.Pressable>
                </react_native_1.View>
              </react_native_1.View>
            </react_native_1.ScrollView>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.Modal>

      {/* 3. AI ADVISOR MODAL */}
      <react_native_1.Modal visible={advisorModalVisible} animationType="slide" transparent={true} onRequestClose={() => setAdvisorModalVisible(false)}>
        <react_native_1.View style={styles.modalBackdrop}>
          <react_native_1.View style={styles.modalSheetContainer}>
            <react_native_1.View style={styles.modalHeaderRow}>
              <react_native_1.Text style={styles.modalSheetTitle}>🧠 AI ENGINE STRATEGIC ADVISOR</react_native_1.Text>
              <react_native_1.Pressable onPress={() => {
            triggerHaptic();
            setAdvisorModalVisible(false);
        }} style={styles.modalCloseIconBtn}>
                <react_native_1.Text style={styles.modalCloseText}>✕</react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.View>

            <react_native_1.ScrollView contentContainerStyle={styles.modalScrollContent}>
              <react_native_1.View style={styles.advisorHeader}>
                <react_native_1.Text style={styles.advisorHeaderKicker}>DIAGNOSTICS & SYSTEM HEURISTICS</react_native_1.Text>
                <react_native_1.View style={styles.flashingDotWrapper}>
                  <react_native_1.View style={[styles.flashingDot, liveSimRunning ? { backgroundColor: '#22C55E' } : { backgroundColor: '#EF4444' }]}/>
                </react_native_1.View>
              </react_native_1.View>

              <react_native_1.View style={styles.horizontalDivider}/>

              <react_native_1.View style={styles.adviceBulletsList}>
                {getAdvisorInsights().map((insight, index) => (<react_native_1.View key={index} style={styles.adviceBulletRow}>
                    <react_native_1.Text style={styles.bulletSymbol}>⚡</react_native_1.Text>
                    <react_native_1.Text style={styles.adviceBulletText}>{insight}</react_native_1.Text>
                  </react_native_1.View>))}
              </react_native_1.View>

              <react_native_1.Pressable onPress={() => {
            triggerHaptic();
            setAdvisorModalVisible(false);
        }} style={styles.modalCtaBtn}>
                <react_native_1.Text style={styles.modalCtaBtnText}>DISMISS CONSOLE</react_native_1.Text>
              </react_native_1.Pressable>
            </react_native_1.ScrollView>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.Modal>

    </react_native_1.View>);
}
function createStyles(Colors, theme) {
    const isDark = theme === 'dark';
    return react_native_1.StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colors.background,
        },
        safeArea: {
            flex: 1,
        },
        scrollView: {
            flex: 1,
        },
        scrollContent: {
            paddingHorizontal: theme_1.Spacing.four,
            paddingBottom: theme_1.Spacing.six,
            maxWidth: theme_1.MaxContentWidth,
            alignSelf: 'center',
            width: '100%',
        },
        sectionHeader: {
            fontFamily: 'Oswald',
            fontSize: 14,
            fontWeight: 'bold',
            color: Colors.secondaryAccent,
            letterSpacing: 1.2,
            marginTop: theme_1.Spacing.four,
            marginBottom: theme_1.Spacing.three,
        },
        // Homogeneous Tiles Grid
        tileGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            width: '100%',
            gap: 16,
        },
        tileCard: {
            backgroundColor: Colors.surface,
            borderRadius: 16,
            borderWidth: 1.5,
            borderColor: Colors.coltsNavyLight,
            overflow: 'hidden',
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
            width: '100%',
            marginBottom: 8,
        },
        tileImageContainer: {
            height: 160,
            width: '100%',
            backgroundColor: Colors.surfaceLifted,
            overflow: 'hidden',
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: Colors.coltsNavyLight,
        },
        tileContent: {
            padding: 16,
        },
        tileKicker: {
            fontFamily: theme_1.Fonts.headings,
            color: Colors.doordashRed,
            fontSize: 11,
            letterSpacing: 1.2,
            marginBottom: 4,
            textTransform: 'uppercase',
        },
        tileTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 18,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            marginBottom: 8,
            lineHeight: 22,
        },
        tileDescription: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 13,
            lineHeight: 18,
            color: Colors.secondaryAccent,
            opacity: 0.9,
            marginBottom: 16,
        },
        tileButton: {
            backgroundColor: Colors.coltsNavy,
            borderRadius: 8,
            height: 38,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
        },
        tileButtonText: {
            fontFamily: theme_1.Fonts.headings,
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: 'bold',
            letterSpacing: 0.5,
        },
        // Modal Sheet layouts
        modalBackdrop: {
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
        },
        modalSheetContainer: {
            backgroundColor: Colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
            padding: theme_1.Spacing.four,
            maxHeight: '90%',
        },
        modalHeaderRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme_1.Spacing.three,
            borderBottomWidth: 1,
            borderBottomColor: Colors.coltsNavyLight,
            paddingBottom: 10,
        },
        modalSheetTitle: {
            fontFamily: 'Oswald',
            fontSize: 15,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            letterSpacing: 0.5,
        },
        modalCloseIconBtn: {
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: Colors.surfaceLifted,
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalCloseText: {
            fontSize: 12,
            fontWeight: 'bold',
            color: Colors.secondaryAccent,
        },
        modalScrollContent: {
            paddingBottom: theme_1.Spacing.six,
        },
        modalSectionDesc: {
            fontFamily: 'Inter',
            fontSize: 12,
            color: Colors.secondaryAccent,
            marginBottom: theme_1.Spacing.four,
            lineHeight: 16,
        },
        modalCtaBtn: {
            backgroundColor: Colors.hofYellow,
            borderRadius: 8,
            height: 42,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: theme_1.Spacing.five,
        },
        modalCtaBtnText: {
            fontFamily: 'Oswald',
            color: '#000000',
            fontSize: 13,
            fontWeight: 'bold',
            letterSpacing: 0.8,
        },
        // GRID & CONFIGURATOR
        configSettingRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: theme_1.Spacing.three,
        },
        settingDetails: {
            flex: 1,
            marginRight: theme_1.Spacing.three,
        },
        settingLabel: {
            fontFamily: 'Oswald',
            fontSize: 13,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            letterSpacing: 0.5,
        },
        settingSubLabel: {
            fontFamily: 'Inter',
            fontSize: 10,
            color: Colors.secondaryAccent,
            marginTop: 2,
        },
        capperChipsRow: {
            flexDirection: 'row',
            gap: 6,
        },
        capperChip: {
            width: 32,
            height: 32,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
        },
        capperChipActive: {
            backgroundColor: Colors.hofYellow,
            borderColor: Colors.hofYellow,
        },
        capperChipText: {
            fontFamily: 'JetBrainsMono-Bold',
            fontSize: 12,
            color: Colors.secondaryAccent,
        },
        capperChipTextActive: {
            color: '#000000',
        },
        horizontalDivider: {
            height: 1,
            backgroundColor: Colors.coltsNavyLight,
            marginVertical: theme_1.Spacing.two,
        },
        // TELEMETRY
        metricsGridRow: {
            flexDirection: 'row',
            gap: theme_1.Spacing.three,
            marginBottom: theme_1.Spacing.three,
        },
        metricsCard: {
            flex: 1,
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 12,
            padding: theme_1.Spacing.three,
            alignItems: 'center',
        },
        metricsCardTitle: {
            fontFamily: 'Oswald',
            fontSize: 10,
            fontWeight: 'bold',
            color: Colors.secondaryAccent,
            letterSpacing: 0.8,
            marginBottom: theme_1.Spacing.two,
        },
        dialContainer: {
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
            width: 90,
            height: 90,
            marginBottom: theme_1.Spacing.two,
        },
        dialOverlay: {
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
        },
        dialMainVal: {
            fontFamily: 'JetBrainsMono-Bold',
            fontSize: 14,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
        },
        dialSubLabel: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 7,
            color: Colors.secondaryAccent,
            letterSpacing: 0.5,
        },
        monoStatText: {
            fontFamily: 'JetBrainsMono-Bold',
            fontSize: 13,
            color: Colors.primaryAccent,
            fontVariant: ['tabular-nums'],
        },
        monoStatUnit: {
            fontSize: 9,
            color: Colors.secondaryAccent,
            fontFamily: 'Inter',
        },
        chartPanel: {
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 12,
            padding: theme_1.Spacing.three,
            marginBottom: theme_1.Spacing.three,
        },
        chartPanelTitle: {
            fontFamily: 'Oswald',
            fontSize: 11,
            fontWeight: 'bold',
            color: Colors.secondaryAccent,
            letterSpacing: 0.5,
            marginBottom: theme_1.Spacing.two,
        },
        chartContainer: {
            height: 110,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: theme_1.Spacing.one,
        },
        chartLabelsRow: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 4,
            paddingLeft: 10,
        },
        chartMiniLabel: {
            fontFamily: 'JetBrainsMono',
            fontSize: 8,
            color: Colors.secondaryAccent,
        },
        standingsPanel: {
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 12,
            padding: theme_1.Spacing.three,
            marginBottom: theme_1.Spacing.three,
        },
        standingsGrid: {
            flex: 1,
        },
        standingHeaderRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderBottomColor: Colors.coltsNavyLight,
            paddingBottom: 4,
            marginBottom: 4,
        },
        standingHeaderLabel: {
            fontFamily: 'Oswald',
            fontSize: 9,
            color: Colors.secondaryAccent,
            letterSpacing: 0.5,
        },
        standingDataRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 4,
        },
        standingName: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 10,
            color: Colors.primaryAccent,
            flex: 2,
        },
        standingCamp: {
            fontFamily: 'Inter',
            fontSize: 9,
            color: Colors.secondaryAccent,
            flex: 2,
            textAlign: 'center',
        },
        standingRate: {
            fontFamily: 'JetBrainsMono-Bold',
            fontSize: 10,
            color: Colors.hofYellow,
            flex: 1,
            textAlign: 'right',
            fontVariant: ['tabular-nums'],
        },
        operationsCard: {
            backgroundColor: Colors.surface,
            borderColor: Colors.coltsNavyLight,
            borderWidth: 1,
            borderRadius: 12,
            padding: theme_1.Spacing.three,
            marginTop: theme_1.Spacing.two,
        },
        operationsTitle: {
            fontFamily: 'Oswald',
            fontSize: 12,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            letterSpacing: 0.8,
            marginBottom: theme_1.Spacing.two,
        },
        operationsBtnRow: {
            flexDirection: 'row',
            gap: theme_1.Spacing.two,
        },
        opBtn: {
            flex: 2,
            height: 38,
            borderRadius: 6,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
        },
        opBtnDefault: {
            backgroundColor: Colors.surfaceLifted,
            borderColor: Colors.coltsNavyLight,
        },
        opBtnActive: {
            backgroundColor: '#22C55E',
            borderColor: '#22C55E',
        },
        opBtnText: {
            fontFamily: 'Oswald',
            fontSize: 11,
            fontWeight: 'bold',
            letterSpacing: 0.5,
        },
        opBtnTextDefault: {
            color: Colors.primaryAccent,
        },
        opBtnTextActive: {
            color: '#000000',
        },
        opBtnWipe: {
            flex: 1,
            height: 38,
            borderRadius: 6,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: '#EF4444',
            borderWidth: 1,
        },
        opBtnTextWipe: {
            fontFamily: 'Oswald',
            fontSize: 11,
            fontWeight: 'bold',
            color: '#EF4444',
            letterSpacing: 0.5,
        },
        // AI ADVISOR
        advisorHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        advisorHeaderKicker: {
            fontFamily: 'Oswald',
            fontSize: 12,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            letterSpacing: 0.8,
        },
        flashingDotWrapper: {
            width: 14,
            height: 14,
            borderRadius: 7,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
        },
        flashingDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
        },
        adviceBulletsList: {
            gap: 10,
            marginTop: theme_1.Spacing.two,
        },
        adviceBulletRow: {
            flexDirection: 'row',
            gap: 8,
            alignItems: 'flex-start',
        },
        bulletSymbol: {
            color: Colors.hofYellow,
            fontSize: 10,
            marginTop: 2,
        },
        adviceBulletText: {
            fontFamily: 'Inter',
            fontSize: 12,
            color: Colors.primaryAccent,
            lineHeight: 16,
            flex: 1,
        },
    });
}
