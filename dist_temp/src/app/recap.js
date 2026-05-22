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
exports.default = RecapScreen;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const theme_1 = require("@/constants/theme");
const useThemeStore_1 = require("@/store/useThemeStore");
const BackgroundTexture_1 = __importDefault(require("@/components/BackgroundTexture"));
const AppHeader_1 = __importDefault(require("@/components/AppHeader"));
const AppTabBar_1 = __importDefault(require("@/components/AppTabBar"));
const Haptics = __importStar(require("expo-haptics"));
const react_native_svg_1 = __importStar(require("react-native-svg"));
function RecapScreen() {
    const router = (0, expo_router_1.useRouter)();
    const Colors = (0, theme_1.useColors)();
    const { theme } = (0, useThemeStore_1.useThemeStore)();
    const [activeTab, setActiveTab] = (0, react_1.useState)('recaps');
    const [activeCardIndex, setActiveCardIndex] = (0, react_1.useState)(0);
    // High-fidelity Mock Draft History Recaps in chronological order
    const draftRecaps = [
        {
            id: '1',
            grade: 'A+',
            efficiency: '98.6%',
            projectedRecord: '13-1',
            topPick: {
                name: 'Christian McCaffrey',
                position: 'RB',
                team: 'SF',
                image: 'https://a.espncdn.com/i/headshots/nfl/players/full/3117251.png',
                pick: '1.01',
            },
            pointsPerGame: '128.4 PPG',
            byeWeekStrength: 'Rank: #1',
            syncId: 'MX-986-CM31',
        },
        {
            id: '2',
            grade: 'A-',
            efficiency: '94.2%',
            projectedRecord: '11-3',
            topPick: {
                name: 'CeeDee Lamb',
                position: 'WR',
                team: 'DAL',
                image: 'https://a.espncdn.com/i/headshots/nfl/players/full/4426385.png',
                pick: '1.04',
            },
            pointsPerGame: '119.8 PPG',
            byeWeekStrength: 'Rank: #3',
            syncId: 'MX-942-CL44',
        },
        {
            id: '3',
            grade: 'A',
            efficiency: '96.1%',
            projectedRecord: '12-2',
            topPick: {
                name: 'Breece Hall',
                position: 'RB',
                team: 'NYJ',
                image: 'https://a.espncdn.com/i/headshots/nfl/players/full/4427366.png',
                pick: '1.06',
            },
            pointsPerGame: '122.5 PPG',
            byeWeekStrength: 'Rank: #2',
            syncId: 'MX-961-BH44',
        },
        {
            id: '4',
            grade: 'B+',
            efficiency: '89.8%',
            projectedRecord: '10-4',
            topPick: {
                name: 'Patrick Mahomes',
                position: 'QB',
                team: 'KC',
                image: 'https://a.espncdn.com/i/headshots/nfl/players/full/3139477.png',
                pick: '2.08',
            },
            pointsPerGame: '112.4 PPG',
            byeWeekStrength: 'Rank: #5',
            syncId: 'MX-898-PM31',
        }
    ];
    const triggerHaptic = async (style = Haptics.ImpactFeedbackStyle.Light) => {
        if (react_native_1.Platform.OS !== 'web') {
            try {
                await Haptics.impactAsync(style);
            }
            catch (err) { }
        }
    };
    const handleTabChange = (tab) => {
        triggerHaptic();
        setActiveTab(tab);
    };
    const handleScroll = (event) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const layoutWidth = event.nativeEvent.layoutMeasurement.width || 340;
        const index = Math.round(contentOffset / layoutWidth);
        if (index !== activeCardIndex && index >= 0 && index < draftRecaps.length) {
            setActiveCardIndex(index);
            triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
        }
    };
    // Renders a simulated barcode matching Starbucks scan aesthetics
    const renderSimulatedBarcode = (syncId) => {
        // Generate barcode line heights/widths representation
        const bars = [3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 3, 2, 1, 4, 2];
        return (<react_native_1.View style={styles.barcodeOuter}>
        <react_native_1.View style={styles.barcodeContainer}>
          {bars.map((weight, index) => (<react_native_1.View key={index} style={[
                    styles.barcodeLine,
                    { width: weight * 1.5, marginRight: 2 }
                ]}/>))}
        </react_native_1.View>
        <react_native_1.Text style={styles.barcodeText}>{syncId}</react_native_1.Text>
      </react_native_1.View>);
    };
    return (<react_native_1.View style={styles.container}>
      <BackgroundTexture_1.default />
      <react_native_safe_area_context_1.SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        
        {/* Header Block with dynamic layout and triggers */}
        <AppHeader_1.default title="DRAFT RECAPS" subtitle="MockMaxxing Visual Analytics"/>

        {/* 34pt Large Page Title (Starbucks Template) */}
        <react_native_1.View style={styles.largeTitleContainer}>
          <react_native_1.Text style={styles.largeTitleText}>History</react_native_1.Text>
        </react_native_1.View>

        {/* Starbucks-Style Segmented Controller Switcher */}
        <react_native_1.View style={styles.toggleOuter}>
          <react_native_1.View style={styles.toggleContainer}>
            <react_native_1.Pressable style={[
            styles.toggleSegment,
            activeTab === 'recaps' && styles.toggleSegmentActive
        ]} onPress={() => handleTabChange('recaps')}>
              <react_native_1.Text style={[
            styles.toggleText,
            activeTab === 'recaps' ? styles.toggleTextActive : styles.toggleTextInactive
        ]}>
                Draft Recaps
              </react_native_1.Text>
            </react_native_1.Pressable>

            <react_native_1.Pressable style={[
            styles.toggleSegment,
            activeTab === 'awards' && styles.toggleSegmentActive
        ]} onPress={() => handleTabChange('awards')}>
              <react_native_1.Text style={[
            styles.toggleText,
            activeTab === 'awards' ? styles.toggleTextActive : styles.toggleTextInactive
        ]}>
                Global Awards
              </react_native_1.Text>
            </react_native_1.Pressable>
          </react_native_1.View>
        </react_native_1.View>

        <react_native_1.ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {activeTab === 'recaps' ? (<react_native_1.View style={styles.tabContent}>
              
              {/* Horizontal Snapping Swiper for Draft Badges */}
              <react_native_1.ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={handleScroll} scrollEventThrottle={16} style={styles.swiperScrollView} contentContainerStyle={styles.swiperContent} snapToInterval={336 + 24} // card width + margin
         decelerationRate="fast" snapToAlignment="center">
                {draftRecaps.map((recap, index) => (<react_native_1.View key={recap.id} style={styles.cardContainer}>
                    
                    {/* Top half: Player EPSN headshot with gold stamp outline (Pillar 2 / Stamp Pattern) */}
                    <react_native_1.View style={styles.cardTopHalf}>
                      <react_native_1.View style={styles.goldLaurelContainer}>
                        <react_native_svg_1.default width={110} height={110} viewBox="0 0 100 100" style={styles.svgLaurel}>
                          <react_native_svg_1.Circle cx="50" cy="50" r="44" stroke={Colors.hofYellow} strokeWidth="2" strokeDasharray="6,4" fill="none"/>
                          <react_native_svg_1.Circle cx="50" cy="50" r="38" stroke={Colors.hofYellow} strokeWidth="1" fill="none"/>
                          {/* Svg Leaf Stamp patterns for Starbucks look */}
                          <react_native_svg_1.Path d="M 50 12 C 45 22, 40 28, 48 34" stroke={Colors.hofYellow} strokeWidth="1.5" fill="none"/>
                          <react_native_svg_1.Path d="M 50 12 C 55 22, 60 28, 52 34" stroke={Colors.hofYellow} strokeWidth="1.5" fill="none"/>
                          <react_native_svg_1.Circle cx="48" cy="22" r="2.5" fill={Colors.hofYellow}/>
                          <react_native_svg_1.Circle cx="52" cy="22" r="2.5" fill={Colors.hofYellow}/>
                          {/* Stars */}
                          <react_native_svg_1.Path d="M 28 42 L 30 45 L 34 45 L 31 47 L 32 50 L 28 48 L 24 50 L 25 47 L 22 45 L 26 45 Z" fill={Colors.hofYellow}/>
                          <react_native_svg_1.Path d="M 72 42 L 74 45 L 78 45 L 75 47 L 76 50 L 72 48 L 68 50 L 69 47 L 66 45 L 70 45 Z" fill={Colors.hofYellow}/>
                        </react_native_svg_1.default>
                        
                        <react_native_1.Image source={{ uri: recap.topPick.image }} style={styles.playerImage}/>
                      </react_native_1.View>

                      {/* Header Title inside card */}
                      <react_native_1.Text style={styles.cardHeaderTitle}>Elite Draft Recap</react_native_1.Text>
                      <react_native_1.Text style={styles.cardHeaderSub}>Top Pick: {recap.topPick.name} ({recap.topPick.pick})</react_native_1.Text>
                    </react_native_1.View>

                    {/* Bottom half: Oswald Score, Gold badge and Barcode (Pillar 3 / Barcode depth) */}
                    <react_native_1.View style={styles.cardBottomHalf}>
                      <react_native_1.Text style={styles.scoreText}>{recap.grade}</react_native_1.Text>
                      
                      <react_native_1.View style={styles.goldPill}>
                        <react_native_1.Text style={styles.goldPillText}>Draft Efficiency: {recap.efficiency}</react_native_1.Text>
                      </react_native_1.View>

                      {/* Barcode details */}
                      {renderSimulatedBarcode(recap.syncId)}

                      {/* Tabular numeric stats section in JetBrains Mono */}
                      <react_native_1.View style={styles.recapStatsContainer}>
                        <react_native_1.View style={styles.statBox}>
                          <react_native_1.Text style={styles.statVal}>{recap.projectedRecord}</react_native_1.Text>
                          <react_native_1.Text style={styles.statLbl}>Proj. Record</react_native_1.Text>
                        </react_native_1.View>
                        <react_native_1.View style={styles.statDivider}/>
                        <react_native_1.View style={styles.statBox}>
                          <react_native_1.Text style={styles.statVal}>{recap.pointsPerGame}</react_native_1.Text>
                          <react_native_1.Text style={styles.statLbl}>Proj. PPG</react_native_1.Text>
                        </react_native_1.View>
                        <react_native_1.View style={styles.statDivider}/>
                        <react_native_1.View style={styles.statBox}>
                          <react_native_1.Text style={styles.statVal}>{recap.byeWeekStrength}</react_native_1.Text>
                          <react_native_1.Text style={styles.statLbl}>Bye Week</react_native_1.Text>
                        </react_native_1.View>
                      </react_native_1.View>

                      {/* Tactile Micro-Action Buttons at bottom of card */}
                      <react_native_1.View style={styles.cardActionRow}>
                        <react_native_1.Pressable style={({ pressed }) => [
                    styles.cardActionBtn,
                    pressed && styles.cardActionBtnPressed
                ]} onPress={() => triggerHaptic()}>
                          <react_native_1.Text style={styles.cardActionBtnText}>Review Roster</react_native_1.Text>
                        </react_native_1.Pressable>

                        <react_native_1.Pressable style={({ pressed }) => [
                    styles.cardActionBtn,
                    pressed && styles.cardActionBtnPressed
                ]} onPress={() => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                    router.push('/wizard/setup');
                }}>
                          <react_native_1.Text style={styles.cardActionBtnText}>Mock Again</react_native_1.Text>
                        </react_native_1.Pressable>
                      </react_native_1.View>

                    </react_native_1.View>
                  </react_native_1.View>))}
              </react_native_1.ScrollView>

              {/* Swiper Page dots index indicator */}
              <react_native_1.View style={styles.indicatorContainer}>
                {draftRecaps.map((_, index) => (<react_native_1.View key={index} style={[
                    styles.indicatorDot,
                    activeCardIndex === index ? styles.indicatorDotActive : styles.indicatorDotInactive
                ]}/>))}
              </react_native_1.View>

              {/* Just for you section (Pillar 3 / Starbucks design feed) */}
              <react_native_1.View style={styles.justForYouSection}>
                <react_native_1.Text style={styles.justForYouHeading}>Just for you</react_native_1.Text>
                <react_native_1.Text style={styles.justForYouSubtitle}>Analytical coaching tips and telemetry recommendations.</react_native_1.Text>

                <react_native_1.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalFeedContainer}>
                  <react_native_1.View style={styles.feedCard}>
                    <react_native_1.Image source={{ uri: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop&q=60' }} style={styles.feedCardImage}/>
                    <react_native_1.View style={styles.feedCardContent}>
                      <react_native_1.Text style={styles.feedCardKicker}>COACHING TELEMETRY</react_native_1.Text>
                      <react_native_1.Text style={styles.feedCardTitle}>Dynamic Waiver Strategy</react_native_1.Text>
                      <react_native_1.Text style={styles.feedCardDesc}>Target high-efficiency handcuffs to secure roster depth.</react_native_1.Text>
                    </react_native_1.View>
                  </react_native_1.View>

                  <react_native_1.View style={styles.feedCard}>
                    <react_native_1.Image source={{ uri: 'https://images.unsplash.com/photo-1540747737956-378724044453?w=500&auto=format&fit=crop&q=60' }} style={styles.feedCardImage}/>
                    <react_native_1.View style={styles.feedCardContent}>
                      <react_native_1.Text style={styles.feedCardKicker}>GENETIC ENGINE</react_native_1.Text>
                      <react_native_1.Text style={styles.feedCardTitle}>Genetic Simulator Mocking</react_native_1.Text>
                      <react_native_1.Text style={styles.feedCardDesc}>How our algorithms execute mock standard draft configurations.</react_native_1.Text>
                    </react_native_1.View>
                  </react_native_1.View>

                  <react_native_1.View style={styles.feedCard}>
                    <react_native_1.Image source={{ uri: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&auto=format&fit=crop&q=60' }} style={styles.feedCardImage}/>
                    <react_native_1.View style={styles.feedCardContent}>
                      <react_native_1.Text style={styles.feedCardKicker}>DRAFT STRESS</react_native_1.Text>
                      <react_native_1.Text style={styles.feedCardTitle}>Draft Clock Limits</react_native_1.Text>
                      <react_native_1.Text style={styles.feedCardDesc}>Simulate time pressure to mock real-world draft pressure.</react_native_1.Text>
                    </react_native_1.View>
                  </react_native_1.View>
                </react_native_1.ScrollView>
              </react_native_1.View>

            </react_native_1.View>) : (
        // Global Awards screen (Pillar 2 / Stamp Pattern)
        <react_native_1.View style={styles.awardsContent}>
              <react_native_1.View style={styles.awardBannerCard}>
                <react_native_1.View style={styles.awardCircleIcon}>
                  <react_native_svg_1.default width={40} height={40} viewBox="0 0 24 24" fill="none">
                    <react_native_svg_1.Path d="M12 2L2 22h20L12 2zm0 3.99L19.53 19H4.47L12 5.99z" fill={Colors.hofYellow}/>
                    <react_native_svg_1.Path d="M11 10h2v4h-2zm0 5h2v2h-2z" fill={Colors.hofYellow}/>
                  </react_native_svg_1.default>
                </react_native_1.View>
                <react_native_1.Text style={styles.awardBannerTitle}>Trophy Cabinet</react_native_1.Text>
                <react_native_1.Text style={styles.awardBannerDesc}>Earn unique awards for draft excellence and roster value optimization.</react_native_1.Text>
              </react_native_1.View>

              <react_native_1.View style={styles.awardsGrid}>
                <react_native_1.View style={styles.awardGridItem}>
                  <react_native_1.View style={styles.stampBadge}>
                    <react_native_svg_1.default width={60} height={60} viewBox="0 0 24 24" fill="none">
                      <react_native_svg_1.Circle cx="12" cy="12" r="10" stroke={Colors.hofYellow} strokeWidth="1.5"/>
                      <react_native_svg_1.Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill={Colors.hofYellow}/>
                    </react_native_svg_1.default>
                  </react_native_1.View>
                  <react_native_1.Text style={styles.awardItemTitle}>Gridiron God</react_native_1.Text>
                  <react_native_1.Text style={styles.awardItemDesc}>Draft a roster with an A+ draft recap efficiency.</react_native_1.Text>
                </react_native_1.View>

                <react_native_1.View style={styles.awardGridItem}>
                  <react_native_1.View style={styles.stampBadge}>
                    <react_native_svg_1.default width={60} height={60} viewBox="0 0 24 24" fill="none">
                      <react_native_svg_1.Circle cx="12" cy="12" r="10" stroke={Colors.coltsNavy} strokeWidth="1.5"/>
                      <react_native_svg_1.Path d="M12 8v8M8 12h8" stroke={Colors.coltsNavy} strokeWidth="2" strokeLinecap="round"/>
                    </react_native_svg_1.default>
                  </react_native_1.View>
                  <react_native_1.Text style={styles.awardItemTitle}>Draft Maestro</react_native_1.Text>
                  <react_native_1.Text style={styles.awardItemDesc}>Complete 10 full mock draft simulation wizard runs.</react_native_1.Text>
                </react_native_1.View>

                <react_native_1.View style={styles.awardGridItem}>
                  <react_native_1.View style={[styles.stampBadge, { opacity: 0.35 }]}>
                    <react_native_svg_1.default width={60} height={60} viewBox="0 0 24 24" fill="none">
                      <react_native_svg_1.Circle cx="12" cy="12" r="10" stroke="#71717a" strokeWidth="1.5"/>
                      <react_native_svg_1.Path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="#71717a"/>
                    </react_native_svg_1.default>
                  </react_native_1.View>
                  <react_native_1.Text style={styles.awardItemTitle}>Dynamic Sync</react_native_1.Text>
                  <react_native_1.Text style={styles.awardItemDesc}>Synchronize local drafts with league rosters.</react_native_1.Text>
                </react_native_1.View>
              </react_native_1.View>
            </react_native_1.View>)}
        </react_native_1.ScrollView>

        {/* Global tab navigation bar pinned to page bottom */}
        <AppTabBar_1.default />

      </react_native_safe_area_context_1.SafeAreaView>
    </react_native_1.View>);
}
function createStyles(Colors, isDark) {
    return react_native_1.StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colors.background,
        },
        safeArea: {
            flex: 1,
        },
        largeTitleContainer: {
            paddingHorizontal: theme_1.Spacing.four,
            paddingTop: theme_1.Spacing.two,
            paddingBottom: theme_1.Spacing.two,
        },
        largeTitleText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 34,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            letterSpacing: -0.5,
        },
        toggleOuter: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: theme_1.Spacing.four,
            marginBottom: theme_1.Spacing.three,
        },
        toggleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.surfaceLifted,
            padding: theme_1.Spacing.one,
            borderRadius: 24,
            width: '100%',
            maxWidth: 400,
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
        },
        toggleSegment: {
            flex: 1,
            paddingVertical: theme_1.Spacing.two,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
        },
        toggleSegmentActive: {
            backgroundColor: Colors.coltsNavy,
        },
        toggleText: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 14,
            fontWeight: '600',
        },
        toggleTextActive: {
            color: '#FFFFFF',
        },
        toggleTextInactive: {
            color: Colors.secondaryAccent,
        },
        scrollView: {
            flex: 1,
        },
        scrollContent: {
            paddingBottom: 96, // Safe space for floating tab bar inset
        },
        tabContent: {
            flex: 1,
        },
        swiperScrollView: {
            height: 480,
        },
        swiperContent: {
            paddingHorizontal: 24,
            alignItems: 'center',
            gap: 24,
        },
        cardContainer: {
            width: 326,
            height: 440,
            backgroundColor: Colors.surface,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
            shadowColor: Colors.shadows.shadowColor,
            shadowOffset: Colors.shadows.shadowOffset,
            shadowOpacity: Colors.shadows.shadowOpacity,
            shadowRadius: Colors.shadows.shadowRadius,
            elevation: Colors.shadows.elevation,
            overflow: 'hidden',
        },
        cardTopHalf: {
            flex: 1.1,
            backgroundColor: Colors.coltsNavy,
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme_1.Spacing.three,
            position: 'relative',
        },
        goldLaurelContainer: {
            position: 'relative',
            width: 110,
            height: 110,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: theme_1.Spacing.two,
        },
        svgLaurel: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        },
        playerImage: {
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            borderColor: Colors.hofYellow,
        },
        cardHeaderTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 18,
            fontWeight: 'bold',
            color: '#FFFFFF',
            letterSpacing: 0.5,
        },
        cardHeaderSub: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 12,
            color: Colors.hofYellow,
            marginTop: theme_1.Spacing.half,
        },
        cardBottomHalf: {
            flex: 1.3,
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: theme_1.Spacing.three,
        },
        scoreText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 38,
            fontWeight: '900',
            color: Colors.primaryAccent,
            letterSpacing: 1,
        },
        goldPill: {
            borderWidth: 1,
            borderColor: Colors.hofYellow,
            borderRadius: 12,
            paddingHorizontal: theme_1.Spacing.two,
            paddingVertical: theme_1.Spacing.half,
            backgroundColor: isDark ? 'rgba(255, 205, 0, 0.08)' : '#FFFDF0',
        },
        goldPillText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 10,
            fontWeight: '700',
            color: isDark ? Colors.hofYellow : '#8A6D00',
        },
        barcodeOuter: {
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: theme_1.Spacing.one,
        },
        barcodeContainer: {
            flexDirection: 'row',
            height: 24,
            alignItems: 'center',
        },
        barcodeLine: {
            height: 24,
            backgroundColor: Colors.primaryAccent,
        },
        barcodeText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9,
            color: Colors.secondaryAccent,
            marginTop: theme_1.Spacing.one,
            letterSpacing: 1,
        },
        recapStatsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '100%',
            paddingVertical: theme_1.Spacing.one,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: Colors.coltsNavyLight,
        },
        statBox: {
            alignItems: 'center',
            flex: 1,
        },
        statVal: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 13,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
        },
        statLbl: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 9,
            color: Colors.secondaryAccent,
            marginTop: theme_1.Spacing.half,
        },
        statDivider: {
            height: 20,
            width: 1,
            backgroundColor: Colors.coltsNavyLight,
        },
        cardActionRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: 12,
            marginTop: theme_1.Spacing.one,
        },
        cardActionBtn: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.surfaceLifted,
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
            paddingVertical: theme_1.Spacing.two,
            borderRadius: 16,
            gap: 6,
        },
        cardActionBtnPressed: {
            opacity: 0.65,
        },
        cardActionBtnText: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 11,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
        },
        indicatorContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginVertical: theme_1.Spacing.three,
        },
        indicatorDot: {
            height: 8,
            borderRadius: 4,
        },
        indicatorDotActive: {
            width: 16,
            backgroundColor: Colors.coltsNavy,
        },
        indicatorDotInactive: {
            width: 8,
            backgroundColor: Colors.coltsNavyLight,
        },
        justForYouSection: {
            paddingHorizontal: theme_1.Spacing.four,
            marginTop: theme_1.Spacing.two,
        },
        justForYouHeading: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 22,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            letterSpacing: 0.5,
        },
        justForYouSubtitle: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 13,
            color: Colors.secondaryAccent,
            marginTop: theme_1.Spacing.one,
            marginBottom: theme_1.Spacing.three,
        },
        horizontalFeedContainer: {
            gap: 16,
            paddingRight: 24,
        },
        feedCard: {
            width: 260,
            backgroundColor: Colors.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
            overflow: 'hidden',
            shadowColor: Colors.shadows.shadowColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 6,
            elevation: 3,
        },
        feedCardImage: {
            width: '100%',
            height: 120,
            backgroundColor: Colors.coltsNavyLight,
        },
        feedCardContent: {
            padding: theme_1.Spacing.three,
        },
        feedCardKicker: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 8,
            fontWeight: 'bold',
            color: Colors.coltsNavy,
            letterSpacing: 1.5,
        },
        feedCardTitle: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 14,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            marginTop: theme_1.Spacing.one,
        },
        feedCardDesc: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 11,
            color: Colors.secondaryAccent,
            marginTop: theme_1.Spacing.one,
            lineHeight: 15,
        },
        awardsContent: {
            paddingHorizontal: theme_1.Spacing.four,
            paddingBottom: 24,
        },
        awardBannerCard: {
            backgroundColor: Colors.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
            padding: theme_1.Spacing.four,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: theme_1.Spacing.four,
            shadowColor: Colors.shadows.shadowColor,
            shadowOffset: Colors.shadows.shadowOffset,
            shadowOpacity: Colors.shadows.shadowOpacity,
            shadowRadius: Colors.shadows.shadowRadius,
            elevation: Colors.shadows.elevation,
        },
        awardCircleIcon: {
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: isDark ? 'rgba(255, 205, 0, 0.08)' : '#FFFDF0',
            borderWidth: 1.5,
            borderColor: Colors.hofYellow,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: theme_1.Spacing.three,
        },
        awardBannerTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 20,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            letterSpacing: 0.5,
        },
        awardBannerDesc: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 12,
            color: Colors.secondaryAccent,
            textAlign: 'center',
            marginTop: theme_1.Spacing.one,
            lineHeight: 16,
            maxWidth: 320,
        },
        awardsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 16,
        },
        awardGridItem: {
            width: '47%',
            backgroundColor: Colors.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
            padding: theme_1.Spacing.three,
            alignItems: 'center',
            shadowColor: Colors.shadows.shadowColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 4,
            elevation: 2,
            marginBottom: theme_1.Spacing.one,
        },
        stampBadge: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: Colors.surfaceLifted,
            borderWidth: 1,
            borderColor: Colors.coltsNavyLight,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: theme_1.Spacing.two,
        },
        awardItemTitle: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 13,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            textAlign: 'center',
        },
        awardItemDesc: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 10,
            color: Colors.secondaryAccent,
            textAlign: 'center',
            marginTop: theme_1.Spacing.half,
            lineHeight: 13,
        },
    });
}
// Precompile lightStyles and darkStyles at module evaluation time
const lightStyles = createStyles(require('@/constants/theme').LightColors, false);
const darkStyles = createStyles(require('@/constants/theme').DarkColors, true);
// Create the dynamic Proxy styles dispatcher
const styles = new Proxy({}, {
    get(target, prop) {
        const theme = useThemeStore_1.useThemeStore.getState().theme;
        return theme === 'dark' ? darkStyles[prop] : lightStyles[prop];
    }
});
