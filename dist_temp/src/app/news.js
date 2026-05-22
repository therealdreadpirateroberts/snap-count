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
exports.default = NewsScreen;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const expo_router_1 = require("expo-router");
const useMockMaxxingStore_1 = require("@/store/useMockMaxxingStore");
const mockData_1 = require("@/store/mockData");
const theme_1 = require("@/constants/theme");
const useThemeStore_1 = require("@/store/useThemeStore");
const BackgroundTexture_1 = __importDefault(require("@/components/BackgroundTexture"));
const AppHeader_1 = __importDefault(require("@/components/AppHeader"));
const AppTabBar_1 = __importDefault(require("@/components/AppTabBar"));
const Haptics = __importStar(require("expo-haptics"));
// Enable LayoutAnimation on Android
if (react_native_1.Platform.OS === 'android' && react_native_1.UIManager.setLayoutAnimationEnabledExperimental) {
    react_native_1.UIManager.setLayoutAnimationEnabledExperimental(true);
}
// Local illustrations map matching index.tsx
const localImages = {
    qb: require('../../assets/images/studio_qb.png'),
    rb: require('../../assets/images/studio_rb.png'),
    wr: require('../../assets/images/studio_wr.png'),
    te: require('../../assets/images/studio_te.png'),
    default: require('../../assets/images/studio_wr.png'),
};
const getLocalImageForPosition = (position) => {
    const pos = (position || '').toLowerCase();
    if (pos === 'qb')
        return localImages.qb;
    if (pos === 'rb')
        return localImages.rb;
    if (pos === 'wr')
        return localImages.wr;
    if (pos === 'te')
        return localImages.te;
    return localImages.default;
};
const getPlayerHeadshotUrlForNews = (name, position) => {
    if (position === 'DST') {
        return (0, mockData_1.getTeamLogoUrl)(name);
    }
    const nameKey = name.toLowerCase().replace(/[^a-z]/g, '');
    const espnId = mockData_1.ESPN_ID_MAPPING[nameKey] ?? null;
    if (espnId) {
        return `https://a.espncdn.com/i/headshots/nfl/players/full/${espnId}.png`;
    }
    return `https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/default.png&w=350&h=254`;
};
function NewsScreen() {
    const router = (0, expo_router_1.useRouter)();
    const news = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.news);
    const players = (0, useMockMaxxingStore_1.useMockMaxxingStore)((state) => state.players);
    const Colors = (0, theme_1.useColors)();
    const { width } = (0, react_native_1.useWindowDimensions)();
    const isDesktop = react_native_1.Platform.OS === 'web' && width >= 1024;
    const [expandedStoryId, setExpandedStoryId] = react_1.default.useState(null);
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
    const getPlayerTeam = (name) => {
        const player = players.find((p) => p.name.toLowerCase() === name.toLowerCase());
        return player ? player.team : 'NFL';
    };
    // Sort chronologically: newest (highest timestamp) first
    const sortedNews = react_1.default.useMemo(() => {
        return [...news].sort((a, b) => b.timestamp - a.timestamp);
    }, [news]);
    const toggleExpand = (id) => {
        triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
        react_native_1.LayoutAnimation.configureNext(react_native_1.LayoutAnimation.Presets.easeInEaseOut);
        setExpandedStoryId(expandedStoryId === id ? null : id);
    };
    return (<react_native_1.View style={styles.container}>
      <BackgroundTexture_1.default />
      <react_native_safe_area_context_1.SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        
        {/* Header Block - Subtitle prop completely removed to clean up second row */}
        <AppHeader_1.default title="NEWS FEED" showBack={true} backText="BACK"/>

        {/* News List */}
        <react_native_1.ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {sortedNews.length === 0 ? (<react_native_1.View style={styles.emptyContainer}>
              <react_native_1.Text style={styles.emptyText}>No news items currently loaded.</react_native_1.Text>
            </react_native_1.View>) : (<react_native_1.View style={styles.tileGrid}>
              {sortedNews.map((story) => {
                const isExpanded = expandedStoryId === story.id;
                const firstPlayer = story.playersAffected && story.playersAffected.length > 0 ? story.playersAffected[0] : null;
                const playerName = firstPlayer ? firstPlayer.name : 'GENERIC';
                const playerPosition = firstPlayer ? firstPlayer.position : 'WR';
                const playerTrend = firstPlayer ? firstPlayer.trend : 'up';
                const playerTeam = firstPlayer ? getPlayerTeam(firstPlayer.name) : 'NFL';
                const imageSource = getLocalImageForPosition(playerPosition);
                const trendColor = playerTrend === 'up' ? '#22C55E' : '#EF4444';
                const trendIcon = playerTrend === 'up' ? '▲' : '▼';
                return (<react_native_1.Pressable key={story.id} style={({ pressed }) => [
                        styles.tileCard,
                        isDesktop && styles.tileCardDesktop,
                        pressed && { opacity: 0.96, transform: [{ scale: 0.98 }] }
                    ]} onPress={() => toggleExpand(story.id)}>
                    {/* Aspect Ratio Graphic Banner */}
                    <react_native_1.View style={styles.tileImageContainer}>
                      <react_native_1.Image source={imageSource} style={styles.newsTileImage} resizeMode="cover"/>
                      <react_native_1.View style={styles.tileImageOverlay}/>
                      
                      {/* Trend Indicator Overlay Badge (Apple HIG tactile & high-contrast) */}
                      <react_native_1.View style={[styles.newsTrendBadge, { borderColor: Colors.hofYellow }]}>
                        <react_native_1.Text style={[styles.newsTrendBadgeText, { color: trendColor }]}>
                          {trendIcon} {playerName.toUpperCase()} ({playerPosition})
                        </react_native_1.Text>
                      </react_native_1.View>
                    </react_native_1.View>

                    {/* Content Details */}
                    <react_native_1.View style={styles.tileContent}>
                      <react_native_1.View style={styles.newsMetaRow}>
                        <react_native_1.View style={[styles.newsTagBadge, { backgroundColor: story.tagColor }]}>
                          <react_native_1.Text style={styles.newsTagText}>{story.tag}</react_native_1.Text>
                        </react_native_1.View>
                        <react_native_1.Text style={styles.newsTimeText}>{story.timeAgo} • {playerTeam}</react_native_1.Text>
                      </react_native_1.View>

                      <react_native_1.Text style={[styles.tileTitle, isExpanded ? { fontSize: 20 } : null]} numberOfLines={isExpanded ? 0 : 2} ellipsizeMode="tail">
                        {story.headline.toUpperCase()}
                      </react_native_1.Text>

                      {!isExpanded ? (<>
                          <react_native_1.Text style={styles.newsTakeTextKicker}>FANTASY IMPACT REACTION:</react_native_1.Text>
                          <react_native_1.Text style={styles.newsTakeText} numberOfLines={3} ellipsizeMode="tail">
                            {story.take}
                          </react_native_1.Text>
                          
                          <react_native_1.Pressable style={({ pressed }) => [
                            styles.tileButton,
                            pressed && { opacity: 0.9 }
                        ]} onPress={() => toggleExpand(story.id)}>
                            <react_native_1.Text style={styles.tileButtonText}>EXPAND REACTION</react_native_1.Text>
                          </react_native_1.Pressable>
                        </>) : (<>
                          {/* Expanded detailed elements */}
                          <react_native_1.View style={styles.expandedSection}>
                            <react_native_1.Text style={styles.newsSectionKicker}>STORY SUMMARY</react_native_1.Text>
                            <react_native_1.Text style={styles.newsSummaryText}>{story.summary}</react_native_1.Text>
                          </react_native_1.View>

                          <react_native_1.View style={styles.expandedSection}>
                            <react_native_1.Text style={styles.newsSectionKicker}>AFFECTED ROSTER TARGETS</react_native_1.Text>
                            <react_native_1.View style={styles.playersWrapper}>
                              {story.playersAffected.map((player, idx) => {
                            const trendUp = player.trend === 'up';
                            const headshotUrl = getPlayerHeadshotUrlForNews(player.name, player.position);
                            return (<react_native_1.View key={idx} style={[
                                    styles.playerChip,
                                    trendUp ? styles.trendUpChip : styles.trendDownChip
                                ]}>
                                    <react_native_1.Image source={{ uri: headshotUrl }} style={styles.playerChipHeadshot}/>
                                    <react_native_1.Text style={[
                                    styles.playerChipText,
                                    trendUp ? styles.trendUpText : styles.trendDownText
                                ]}>
                                      {player.name} ({player.position}) {trendUp ? '▲' : '▼'}
                                    </react_native_1.Text>
                                  </react_native_1.View>);
                        })}
                            </react_native_1.View>
                          </react_native_1.View>

                          <react_native_1.View style={styles.expandedSection}>
                            <react_native_1.Text style={styles.newsTakeTextKicker}>FULL FANTASY IMPACT REACTION:</react_native_1.Text>
                            <react_native_1.Text style={styles.newsTakeText}>{story.take}</react_native_1.Text>
                          </react_native_1.View>
                          
                          <react_native_1.Pressable style={({ pressed }) => [
                            styles.tileButton,
                            pressed && { opacity: 0.9 }
                        ]} onPress={() => toggleExpand(story.id)}>
                            <react_native_1.Text style={styles.tileButtonText}>COLLAPSE REACTION</react_native_1.Text>
                          </react_native_1.Pressable>
                        </>)}
                    </react_native_1.View>
                  </react_native_1.Pressable>);
            })}
            </react_native_1.View>)}
        </react_native_1.ScrollView>
      </react_native_safe_area_context_1.SafeAreaView>
      <AppTabBar_1.default />
    </react_native_1.View>);
}
function createStyles(Colors) {
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
        listContent: {
            paddingHorizontal: theme_1.Spacing.three,
            paddingTop: theme_1.Spacing.three,
            paddingBottom: 120,
            flexGrow: 1,
        },
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
        tileCardDesktop: {
            width: '48.5%', // 2 columns with spacing on desktop
            marginBottom: 0,
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
        newsTileImage: {
            width: '100%',
            height: 160,
        },
        tileImageOverlay: {
            ...react_native_1.StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0, 0, 0, 0.15)',
        },
        newsTrendBadge: {
            position: 'absolute',
            bottom: 8,
            left: 8,
            backgroundColor: '#0c0c0c',
            borderWidth: 1,
            borderRadius: 6,
            paddingVertical: 4,
            paddingHorizontal: 8,
        },
        newsTrendBadgeText: {
            fontSize: 10,
            fontFamily: theme_1.Fonts.stats,
            fontWeight: 'bold',
        },
        tileContent: {
            padding: 16,
            gap: 12,
        },
        newsMetaRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4,
        },
        newsTagBadge: {
            paddingVertical: 2,
            paddingHorizontal: 6,
            borderRadius: 4,
            marginRight: 8,
        },
        newsTagText: {
            fontSize: 9,
            fontFamily: theme_1.Fonts.headings,
            fontWeight: 'bold',
            color: '#000000', // Mandatory solid black overlay
        },
        newsTimeText: {
            fontSize: 10,
            fontFamily: theme_1.Fonts.stats,
            color: Colors.secondaryAccent,
        },
        tileTitle: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 18,
            fontWeight: 'bold',
            color: Colors.primaryAccent,
            lineHeight: 22,
        },
        newsTakeTextKicker: {
            fontSize: 10,
            fontFamily: theme_1.Fonts.headings,
            color: Colors.hofYellow, // Vibrant Yellow CTA
            marginTop: 4,
            marginBottom: 2,
        },
        newsTakeText: {
            fontSize: 12,
            fontFamily: theme_1.Fonts.body,
            color: Colors.primaryAccent,
            lineHeight: 16,
        },
        tileButton: {
            height: 40,
            borderRadius: 20,
            backgroundColor: Colors.hofYellow,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: Colors.hofYellow,
            paddingHorizontal: 20,
            alignSelf: 'flex-start',
            marginTop: 8,
        },
        tileButtonText: {
            fontFamily: theme_1.Fonts.headings,
            fontSize: 11,
            fontWeight: 'bold',
            color: '#000000',
            letterSpacing: 0.5,
        },
        newsSectionKicker: {
            fontSize: 10,
            fontFamily: theme_1.Fonts.headings,
            color: Colors.secondaryAccent,
            opacity: 0.8,
            marginTop: 4,
            marginBottom: 4,
            textTransform: 'uppercase',
        },
        newsSummaryText: {
            fontSize: 13,
            fontFamily: theme_1.Fonts.body,
            color: Colors.primaryAccent,
            lineHeight: 18,
        },
        expandedSection: {
            gap: 4,
            borderTopWidth: 1,
            borderTopColor: Colors.coltsNavyLight,
            paddingTop: 12,
            marginTop: 4,
        },
        playersWrapper: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: theme_1.Spacing.two,
            marginTop: theme_1.Spacing.one,
        },
        playerChip: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 4,
            paddingHorizontal: 10,
            borderRadius: 16,
            borderWidth: 1,
            gap: 6,
        },
        playerChipHeadshot: {
            width: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: 'rgba(0,0,0,0.2)',
        },
        trendUpChip: {
            backgroundColor: 'rgba(34, 197, 94, 0.08)',
            borderColor: 'rgba(34, 197, 94, 0.3)',
        },
        trendDownChip: {
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
        },
        playerChipText: {
            fontFamily: theme_1.Fonts.stats,
            fontSize: 9,
            fontWeight: 'bold',
        },
        trendUpText: {
            color: Colors.status.success,
        },
        trendDownText: {
            color: Colors.status.danger,
        },
        emptyContainer: {
            flex: 1,
            padding: theme_1.Spacing.five,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 200,
        },
        emptyText: {
            fontFamily: theme_1.Fonts.body,
            fontSize: 14,
            color: Colors.secondaryAccent,
            opacity: 0.6,
        },
    });
}
// Precompile lightStyles and darkStyles at module evaluation time
const lightStyles = createStyles(require('@/constants/theme').LightColors);
const darkStyles = createStyles(require('@/constants/theme').DarkColors);
// Create the dynamic Proxy styles dispatcher
const styles = new Proxy({}, {
    get(target, prop) {
        const theme = useThemeStore_1.useThemeStore.getState().theme;
        return theme === 'dark' ? darkStyles[prop] : lightStyles[prop];
    }
});
