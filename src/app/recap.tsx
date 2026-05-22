import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Platform, Image, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColors, Fonts, Spacing, MaxContentWidth } from '@/constants/theme';
import { useThemeStore } from '@/store/useThemeStore';
import BackgroundTexture from '@/components/BackgroundTexture';
import AppHeader from '@/components/AppHeader';
import AppTabBar from '@/components/AppTabBar';
import * as Haptics from 'expo-haptics';
import Svg, { Path, Circle, G, Rect } from 'react-native-svg';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface DraftRecap {
  id: string;
  grade: string;
  efficiency: string;
  projectedRecord: string;
  topPick: { name: string; position: string; team: string; image: string; pick: string };
  pointsPerGame: string;
  byeWeekStrength: string;
  syncId: string;
}

function RecapContent() {
  const router = useRouter();
  const Colors = useColors();
  const { theme } = useThemeStore();
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // High-fidelity Mock Draft History Recaps in chronological order
  const draftRecaps: DraftRecap[] = [
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
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(style);
      } catch (err) {}
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const layoutWidth = event.nativeEvent.layoutMeasurement.width || 340;
    const index = Math.round(contentOffset / layoutWidth);
    if (index !== activeCardIndex && index >= 0 && index < draftRecaps.length) {
      setActiveCardIndex(index);
      triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Renders a simulated barcode matching Starbucks scan aesthetics
  const renderSimulatedBarcode = (syncId: string) => {
    // Generate barcode line heights/widths representation
    const bars = [3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 3, 2, 1, 4, 2];
    return (
      <View style={styles.barcodeOuter}>
        <View style={styles.barcodeContainer}>
          {bars.map((weight, index) => (
            <View 
              key={index} 
              style={[
                styles.barcodeLine, 
                { width: weight * 1.5, marginRight: 2 }
              ]} 
            />
          ))}
        </View>
        <Text style={styles.barcodeText}>{syncId}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <BackgroundTexture />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        
        {/* Header Block with dynamic layout and triggers */}
        <AppHeader 
          title="DRAFT RECAPS" 
          subtitle="MockMaxxing Visual Analytics"
        />

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.tabContent}>
            
            {/* Horizontal Snapping Swiper for Draft Badges */}
            <ScrollView 
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              style={styles.swiperScrollView}
              contentContainerStyle={styles.swiperContent}
              snapToInterval={280 + 24} // card width + margin
              decelerationRate="fast"
              snapToAlignment="center"
            >
              {draftRecaps.map((recap, index) => (
                <View key={recap.id} style={styles.cardContainer}>
                  
                  {/* Top half: Player EPSN headshot with gold stamp outline (Pillar 2 / Stamp Pattern) */}
                  <View style={styles.cardTopHalf}>
                    <View style={styles.goldLaurelContainer}>
                      <Svg width={80} height={80} viewBox="0 0 100 100" style={styles.svgLaurel}>
                        <Circle 
                          cx="50" 
                          cy="50" 
                          r="44" 
                          stroke={Colors.hofYellow} 
                          strokeWidth="2" 
                          strokeDasharray="6,4" 
                          fill="none" 
                        />
                        <Circle 
                          cx="50" 
                          cy="50" 
                          r="38" 
                          stroke={Colors.hofYellow} 
                          strokeWidth="1" 
                          fill="none" 
                        />
                        {/* Svg Leaf Stamp patterns for Starbucks look */}
                        <Path 
                          d="M 50 12 C 45 22, 40 28, 48 34" 
                          stroke={Colors.hofYellow} 
                          strokeWidth="1.5" 
                          fill="none" 
                        />
                        <Path 
                          d="M 50 12 C 55 22, 60 28, 52 34" 
                          stroke={Colors.hofYellow} 
                          strokeWidth="1.5" 
                          fill="none" 
                        />
                        <Circle cx="48" cy="22" r="2.5" fill={Colors.hofYellow} />
                        <Circle cx="52" cy="22" r="2.5" fill={Colors.hofYellow} />
                        {/* Stars */}
                        <Path d="M 28 42 L 30 45 L 34 45 L 31 47 L 32 50 L 28 48 L 24 50 L 25 47 L 22 45 L 26 45 Z" fill={Colors.hofYellow} />
                        <Path d="M 72 42 L 74 45 L 78 45 L 75 47 L 76 50 L 72 48 L 68 50 L 69 47 L 66 45 L 70 45 Z" fill={Colors.hofYellow} />
                      </Svg>
                      
                      <Image 
                        source={{ uri: recap.topPick.image }} 
                        style={styles.playerImage} 
                      />
                    </View>

                    {/* Header Title inside card */}
                    <Text style={styles.cardHeaderTitle}>Elite Draft Recap</Text>
                    <Text style={styles.cardHeaderSub}>Top Pick: {recap.topPick.name} ({recap.topPick.pick})</Text>
                  </View>

                  {/* Bottom half: Oswald Score, Gold badge and Barcode (Pillar 3 / Barcode depth) */}
                  <View style={styles.cardBottomHalf}>
                    <Text style={styles.scoreText}>{recap.grade}</Text>
                    
                    <View style={styles.goldPill}>
                      <Text style={styles.goldPillText}>Draft Efficiency: {recap.efficiency}</Text>
                    </View>

                    {/* Barcode details */}
                    {renderSimulatedBarcode(recap.syncId)}

                    {/* Tabular numeric stats section in JetBrains Mono */}
                    <View style={styles.recapStatsContainer}>
                      <View style={styles.statBox}>
                        <Text style={styles.statVal}>{recap.projectedRecord}</Text>
                        <Text style={styles.statLbl}>Proj. Record</Text>
                      </View>
                      <View style={styles.statDivider} />
                      <View style={styles.statBox}>
                        <Text style={styles.statVal}>{recap.pointsPerGame}</Text>
                        <Text style={styles.statLbl}>Proj. PPG</Text>
                      </View>
                      <View style={styles.statDivider} />
                      <View style={styles.statBox}>
                        <Text style={styles.statVal}>{recap.byeWeekStrength}</Text>
                        <Text style={styles.statLbl}>Bye Week</Text>
                      </View>
                    </View>

                    {/* Tactile Micro-Action Buttons at bottom of card */}
                    <View style={styles.cardActionRow}>
                      <Pressable 
                        style={({ pressed }) => [
                          styles.cardActionBtn,
                          pressed && styles.cardActionBtnPressed
                        ]}
                        onPress={() => triggerHaptic()}
                      >
                        <Text style={styles.cardActionBtnText}>Review Roster</Text>
                      </Pressable>

                      <Pressable 
                        style={({ pressed }) => [
                          styles.cardActionBtn,
                          pressed && styles.cardActionBtnPressed
                        ]}
                        onPress={() => {
                          triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                          router.push('/wizard/setup');
                        }}
                      >
                        <Text style={styles.cardActionBtnText}>Mock Again</Text>
                      </Pressable>
                    </View>

                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Swiper Page dots index indicator */}
            <View style={styles.indicatorContainer}>
              {draftRecaps.map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.indicatorDot, 
                    activeCardIndex === index ? styles.indicatorDotActive : styles.indicatorDotInactive
                  ]} 
                />
              ))}
            </View>

            {/* Just for you section (Pillar 3 / Starbucks design feed) */}
            <View style={styles.justForYouSection}>
              <Text style={styles.justForYouHeading}>Just for you</Text>
              <Text style={styles.justForYouSubtitle}>Analytical coaching tips and telemetry recommendations.</Text>

              <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalFeedContainer}
              >
                <View style={styles.feedCard}>
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500&auto=format&fit=crop&q=60' }} 
                    style={styles.feedCardImage} 
                  />
                  <View style={styles.feedCardContent}>
                    <Text style={styles.feedCardKicker}>COACHING TELEMETRY</Text>
                    <Text style={styles.feedCardTitle}>Dynamic Waiver Strategy</Text>
                    <Text style={styles.feedCardDesc}>Target high-efficiency handcuffs to secure roster depth.</Text>
                  </View>
                </View>

                <View style={styles.feedCard}>
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1540747737956-378724044453?w=500&auto=format&fit=crop&q=60' }} 
                    style={styles.feedCardImage} 
                  />
                  <View style={styles.feedCardContent}>
                    <Text style={styles.feedCardKicker}>GENETIC ENGINE</Text>
                    <Text style={styles.feedCardTitle}>Genetic Simulator Mocking</Text>
                    <Text style={styles.feedCardDesc}>How our algorithms execute mock standard draft configurations.</Text>
                  </View>
                </View>

                <View style={styles.feedCard}>
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&auto=format&fit=crop&q=60' }} 
                    style={styles.feedCardImage} 
                  />
                  <View style={styles.feedCardContent}>
                    <Text style={styles.feedCardKicker}>DRAFT STRESS</Text>
                    <Text style={styles.feedCardTitle}>Draft Clock Limits</Text>
                    <Text style={styles.feedCardDesc}>Simulate time pressure to mock real-world draft pressure.</Text>
                  </View>
                </View>
              </ScrollView>
            </View>

          </View>
        </ScrollView>
        {/* Global tab navigation bar pinned to page bottom */}
        <AppTabBar />

      </SafeAreaView>
    </View>
  );
}

export default function RecapScreen() {
  return (
    <ErrorBoundary>
      <RecapContent />
    </ErrorBoundary>
  );
}

function createStyles(Colors: typeof import('@/constants/theme').LightColors, isDark: boolean) {
  return StyleSheet.create({
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
      paddingBottom: 96, // Safe space for floating tab bar inset
    },
    tabContent: {
      flex: 1,
    },
    swiperScrollView: {
      height: 390,
    },
    swiperContent: {
      paddingHorizontal: 24,
      alignItems: 'center',
      gap: 24,
    },
    cardContainer: {
      width: 280,
      height: 360,
      backgroundColor: Colors.surface,
      borderRadius: 20,
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
      flex: 1,
      backgroundColor: Colors.coltsNavy,
      alignItems: 'center',
      justifyContent: 'center',
      padding: Spacing.two,
      position: 'relative',
    },
    goldLaurelContainer: {
      position: 'relative',
      width: 80,
      height: 80,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.one,
    },
    svgLaurel: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    playerImage: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      borderColor: Colors.hofYellow,
    },
    cardHeaderTitle: {
      fontFamily: Fonts.headings,
      fontSize: 15,
      fontWeight: 'bold',
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },
    cardHeaderSub: {
      fontFamily: Fonts.body,
      fontSize: 10,
      color: Colors.hofYellow,
      marginTop: Spacing.half,
    },
    cardBottomHalf: {
      flex: 1.1,
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: Spacing.two,
    },
    scoreText: {
      fontFamily: Fonts.headings,
      fontSize: 28,
      fontWeight: '900',
      color: Colors.primaryAccent,
      letterSpacing: 1,
    },
    goldPill: {
      borderWidth: 1,
      borderColor: Colors.hofYellow,
      borderRadius: 10,
      paddingHorizontal: Spacing.one,
      paddingVertical: Spacing.half,
      backgroundColor: isDark ? 'rgba(255, 205, 0, 0.08)' : '#FFFDF0',
    },
    goldPillText: {
      fontFamily: Fonts.stats,
      fontSize: 9,
      fontWeight: '700',
      color: isDark ? Colors.hofYellow : '#8A6D00',
    },
    barcodeOuter: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: Spacing.half,
    },
    barcodeContainer: {
      flexDirection: 'row',
      height: 16,
      alignItems: 'center',
    },
    barcodeLine: {
      height: 16,
      backgroundColor: Colors.primaryAccent,
    },
    barcodeText: {
      fontFamily: Fonts.stats,
      fontSize: 8,
      color: Colors.secondaryAccent,
      marginTop: Spacing.half,
      letterSpacing: 1,
    },
    recapStatsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      width: '100%',
      paddingVertical: Spacing.half,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: Colors.coltsNavyLight,
    },
    statBox: {
      alignItems: 'center',
      flex: 1,
    },
    statVal: {
      fontFamily: Fonts.stats,
      fontSize: 11,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
    },
    statLbl: {
      fontFamily: Fonts.body,
      fontSize: 8,
      color: Colors.secondaryAccent,
      marginTop: Spacing.half,
    },
    statDivider: {
      height: 16,
      width: 1,
      backgroundColor: Colors.coltsNavyLight,
    },
    cardActionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      gap: 8,
      marginTop: Spacing.half,
    },
    cardActionBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.surfaceLifted,
      borderWidth: 1,
      borderColor: Colors.coltsNavyLight,
      paddingVertical: 6,
      borderRadius: 12,
      gap: 4,
    },
    cardActionBtnPressed: {
      opacity: 0.65,
    },
    cardActionBtnText: {
      fontFamily: Fonts.body,
      fontSize: 10,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
    },
    indicatorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginVertical: Spacing.two,
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
      paddingHorizontal: Spacing.four,
      marginTop: Spacing.two,
    },
    justForYouHeading: {
      fontFamily: Fonts.headings,
      fontSize: 22,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
      letterSpacing: 0.5,
    },
    justForYouSubtitle: {
      fontFamily: Fonts.body,
      fontSize: 13,
      color: Colors.secondaryAccent,
      marginTop: Spacing.one,
      marginBottom: Spacing.three,
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
      padding: Spacing.three,
    },
    feedCardKicker: {
      fontFamily: Fonts.stats,
      fontSize: 8,
      fontWeight: 'bold',
      color: Colors.coltsNavy,
      letterSpacing: 1.5,
    },
    feedCardTitle: {
      fontFamily: Fonts.body,
      fontSize: 14,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
      marginTop: Spacing.one,
    },
    feedCardDesc: {
      fontFamily: Fonts.body,
      fontSize: 11,
      color: Colors.secondaryAccent,
      marginTop: Spacing.one,
      },
  });
}

// Precompile lightStyles and darkStyles at module evaluation time
const lightStyles = createStyles(require('@/constants/theme').LightColors, false);
const darkStyles = createStyles(require('@/constants/theme').DarkColors as any, true);

// Create the dynamic Proxy styles dispatcher
const styles = new Proxy({}, {
  get(target, prop) {
    const theme = useThemeStore.getState().theme;
    return theme === 'dark' ? darkStyles[prop as keyof typeof darkStyles] : lightStyles[prop as keyof typeof lightStyles];
  }
}) as ReturnType<typeof createStyles>;
