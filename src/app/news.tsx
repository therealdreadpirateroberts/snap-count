import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Image, Platform, useWindowDimensions, LayoutAnimation, UIManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { usePlayerStore } from '@/store/usePlayerStore';
import { ESPN_ID_MAPPING, getTeamLogoUrl } from '@/store/mockData';
import { Colors, Fonts, Spacing, MaxContentWidth, useColors } from '@/constants/theme';
import { useThemeStore } from '@/store/useThemeStore';
import BackgroundTexture from '@/components/BackgroundTexture';
import AppHeader from '@/components/AppHeader';
import AppTabBar from '@/components/AppTabBar';
import * as Haptics from 'expo-haptics';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Local illustrations map matching index.tsx
const localImages = {
  qb: require('../../assets/images/studio_qb.png'),
  rb: require('../../assets/images/studio_rb.png'),
  wr: require('../../assets/images/studio_wr.png'),
  te: require('../../assets/images/studio_te.png'),
  default: require('../../assets/images/studio_wr.png'),
};

const getLocalImageForPosition = (position: string) => {
  const pos = (position || '').toLowerCase();
  if (pos === 'qb') return localImages.qb;
  if (pos === 'rb') return localImages.rb;
  if (pos === 'wr') return localImages.wr;
  if (pos === 'te') return localImages.te;
  return localImages.default;
};

const getPlayerHeadshotUrlForNews = (name: string, position: string) => {
  if (position === 'DST') {
    return getTeamLogoUrl(name);
  }
  const nameKey = name.toLowerCase().replace(/[^a-z]/g, '');
  const espnId = ESPN_ID_MAPPING[nameKey] ?? null;
  if (espnId) {
    return `https://a.espncdn.com/i/headshots/nfl/players/full/${espnId}.png`;
  }
  return `https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/default.png&w=350&h=254`;
};

function NewsContent() {
  const router = useRouter();
  const news = usePlayerStore((state) => state.news);
  const players = usePlayerStore((state) => state.players);
  const Colors = useColors();
  
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 1024;
  
  const [expandedStoryId, setExpandedStoryId] = React.useState<string | null>(null);

  const triggerHaptic = async (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(style);
      } catch (err) {
        console.warn('Haptics failed:', err);
      }
    }
  };

  const getPlayerTeam = (name: string) => {
    const player = players.find((p) => p.name.toLowerCase() === name.toLowerCase());
    return player ? player.team : 'NFL';
  };

  // Sort chronologically: newest (highest timestamp) first
  const sortedNews = React.useMemo(() => {
    return [...news].sort((a, b) => b.timestamp - a.timestamp);
  }, [news]);

  const toggleExpand = (id: string) => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedStoryId(expandedStoryId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <BackgroundTexture />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        
        {/* Header Block - Subtitle prop completely removed to clean up second row */}
        <AppHeader
          title="NEWS FEED"
          showBack={true}
          backText="BACK"
        />

        {/* News List */}
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {sortedNews.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No news items currently loaded.</Text>
            </View>
          ) : (
            <View style={styles.tileGrid}>
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
                
                return (
                  <Pressable
                    key={story.id}
                    style={({ pressed }) => [
                      styles.tileCard,
                      isDesktop && styles.tileCardDesktop,
                      pressed && { opacity: 0.96, transform: [{ scale: 0.98 }] }
                    ]}
                    onPress={() => toggleExpand(story.id)}
                  >
                    {/* Aspect Ratio Graphic Banner */}
                    <View style={styles.tileImageContainer}>
                      <Image 
                        source={imageSource} 
                        style={styles.newsTileImage} 
                        resizeMode="cover"
                      />
                      <View style={styles.tileImageOverlay} />
                      
                      {/* Trend Indicator Overlay Badge (Apple HIG tactile & high-contrast) */}
                      <View style={[styles.newsTrendBadge, { borderColor: Colors.hofYellow }]}>
                        <Text style={[styles.newsTrendBadgeText, { color: trendColor }]}>
                          {trendIcon} {playerName.toUpperCase()} ({playerPosition})
                        </Text>
                      </View>
                    </View>

                    {/* Content Details */}
                    <View style={styles.tileContent}>
                      <View style={styles.newsMetaRow}>
                        <View style={[styles.newsTagBadge, { backgroundColor: story.tagColor }]}>
                          <Text style={styles.newsTagText}>{story.tag}</Text>
                        </View>
                        <Text style={styles.newsTimeText}>{story.timeAgo} • {playerTeam}</Text>
                      </View>

                      <Text style={[styles.tileTitle, isExpanded ? { fontSize: 20 } : null]} numberOfLines={isExpanded ? 0 : 2} ellipsizeMode="tail">
                        {story.headline.toUpperCase()}
                      </Text>

                      {!isExpanded ? (
                        <>
                          <Text style={styles.newsTakeTextKicker}>FANTASY IMPACT REACTION:</Text>
                          <Text style={styles.newsTakeText} numberOfLines={3} ellipsizeMode="tail">
                            {story.take}
                          </Text>
                          
                          <Pressable
                            style={({ pressed }) => [
                              styles.tileButton,
                              pressed && { opacity: 0.9 }
                            ]}
                            onPress={() => toggleExpand(story.id)}
                          >
                            <Text style={styles.tileButtonText}>EXPAND REACTION</Text>
                          </Pressable>
                        </>
                      ) : (
                        <>
                          {/* Expanded detailed elements */}
                          <View style={styles.expandedSection}>
                            <Text style={styles.newsSectionKicker}>STORY SUMMARY</Text>
                            <Text style={styles.newsSummaryText}>{story.summary}</Text>
                          </View>

                          <View style={styles.expandedSection}>
                            <Text style={styles.newsSectionKicker}>AFFECTED ROSTER TARGETS</Text>
                            <View style={styles.playersWrapper}>
                              {story.playersAffected.map((player, idx) => {
                                const trendUp = player.trend === 'up';
                                const headshotUrl = getPlayerHeadshotUrlForNews(player.name, player.position);
                                
                                return (
                                  <View key={idx} style={[
                                    styles.playerChip,
                                    trendUp ? styles.trendUpChip : styles.trendDownChip
                                  ]}>
                                    <Image source={{ uri: headshotUrl }} style={styles.playerChipHeadshot} />
                                    <Text style={[
                                      styles.playerChipText,
                                      trendUp ? styles.trendUpText : styles.trendDownText
                                    ]}>
                                      {player.name} ({player.position}) {trendUp ? '▲' : '▼'}
                                    </Text>
                                  </View>
                                );
                              })}
                            </View>
                          </View>

                          <View style={styles.expandedSection}>
                            <Text style={styles.newsTakeTextKicker}>FULL FANTASY IMPACT REACTION:</Text>
                            <Text style={styles.newsTakeText}>{story.take}</Text>
                          </View>
                          
                          <Pressable
                            style={({ pressed }) => [
                              styles.tileButton,
                              pressed && { opacity: 0.9 }
                            ]}
                            onPress={() => toggleExpand(story.id)}
                          >
                            <Text style={styles.tileButtonText}>COLLAPSE REACTION</Text>
                          </Pressable>
                        </>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      <AppTabBar />
    </View>
  );
}

export default function NewsScreen() {
  return (
    <ErrorBoundary>
      <NewsContent />
    </ErrorBoundary>
  );
}

function createStyles(Colors: typeof import('@/constants/theme').LightColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    safeArea: {
      flex: 1,
      alignSelf: 'center',
      width: '100%',
      maxWidth: MaxContentWidth,
    },
    listContent: {
      paddingHorizontal: Spacing.three,
      paddingTop: Spacing.three,
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
      ...StyleSheet.absoluteFillObject,
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
      fontFamily: Fonts.stats,
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
      fontFamily: Fonts.headings,
      fontWeight: 'bold',
      color: '#000000', // Mandatory solid black overlay
    },
    newsTimeText: {
      fontSize: 10,
      fontFamily: Fonts.stats,
      color: Colors.secondaryAccent,
    },
    tileTitle: {
      fontFamily: Fonts.headings,
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
      lineHeight: 22,
    },
    newsTakeTextKicker: {
      fontSize: 10,
      fontFamily: Fonts.headings,
      color: Colors.hofYellow, // Vibrant Yellow CTA
      marginTop: 4,
      marginBottom: 2,
    },
    newsTakeText: {
      fontSize: 12,
      fontFamily: Fonts.body,
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
      fontFamily: Fonts.headings,
      fontSize: 11,
      fontWeight: 'bold',
      color: '#000000',
      letterSpacing: 0.5,
    },
    newsSectionKicker: {
      fontSize: 10,
      fontFamily: Fonts.headings,
      color: Colors.secondaryAccent,
      opacity: 0.8,
      marginTop: 4,
      marginBottom: 4,
      textTransform: 'uppercase',
    },
    newsSummaryText: {
      fontSize: 13,
      fontFamily: Fonts.body,
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
      gap: Spacing.two,
      marginTop: Spacing.one,
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
      fontFamily: Fonts.stats,
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
      padding: Spacing.five,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 200,
    },
    emptyText: {
      fontFamily: Fonts.body,
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
    const theme = useThemeStore.getState().theme;
    return theme === 'dark' ? darkStyles[prop as keyof typeof darkStyles] : lightStyles[prop as keyof typeof lightStyles];
  }
}) as ReturnType<typeof createStyles>;
