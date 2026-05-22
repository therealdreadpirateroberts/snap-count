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

interface PickInfo {
  name: string;
  position: string;
  team: string;
  image: string;
  pick: string;
  round: number;
}

interface DraftRecap {
  id: string;
  grade: string;
  efficiency: string;
  projectedRecord: string;
  topPicks: PickInfo[];
  pointsPerGame: string;
  byeWeekStrength: string;
  syncId: string;
}

function RecapContent() {
  const router = useRouter();
  const Colors = useColors();
  const { theme } = useThemeStore();
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // High-fidelity Mock Draft History Recaps with top three picks
  const draftRecaps: DraftRecap[] = [
    {
      id: '1',
      grade: 'A+',
      efficiency: '98.6%',
      projectedRecord: '13-1',
      topPicks: [
        {
          name: 'Christian McCaffrey',
          position: 'RB',
          team: 'SF',
          image: 'https://a.espncdn.com/i/headshots/nfl/players/full/3117251.png',
          pick: '1.01',
          round: 1,
        },
        {
          name: 'Davante Adams',
          position: 'WR',
          team: 'LV',
          image: 'https://a.espncdn.com/i/headshots/nfl/players/full/16800.png',
          pick: '2.12',
          round: 2,
        },
        {
          name: 'Travis Kelce',
          position: 'TE',
          team: 'KC',
          image: 'https://a.espncdn.com/i/headshots/nfl/players/full/15847.png',
          pick: '3.01',
          round: 3,
        }
      ],
      pointsPerGame: '128.4 PPG',
      byeWeekStrength: 'Rank: #1',
      syncId: 'MX-986-CM31',
    },
    {
      id: '2',
      grade: 'A-',
      efficiency: '94.2%',
      projectedRecord: '11-3',
      topPicks: [
        {
          name: 'CeeDee Lamb',
          position: 'WR',
          team: 'DAL',
          image: 'https://a.espncdn.com/i/headshots/nfl/players/full/4426385.png',
          pick: '1.04',
          round: 1,
        },
        {
          name: 'Kyren Williams',
          position: 'RB',
          team: 'LAR',
          image: 'https://a.espncdn.com/i/headshots/nfl/players/full/4430737.png',
          pick: '2.09',
          round: 2,
        },
        {
          name: 'Sam LaPorta',
          position: 'TE',
          team: 'DET',
          image: 'https://a.espncdn.com/i/headshots/nfl/players/full/4430027.png',
          pick: '3.04',
          round: 3,
        }
      ],
      pointsPerGame: '119.8 PPG',
      byeWeekStrength: 'Rank: #3',
      syncId: 'MX-942-CL44',
    },
    {
      id: '3',
      grade: 'A',
      efficiency: '96.1%',
      projectedRecord: '12-2',
      topPicks: [
        {
          name: 'Breece Hall',
          position: 'RB',
          team: 'NYJ',
          image: 'https://a.espncdn.com/i/headshots/nfl/players/full/4427366.png',
          pick: '1.06',
          round: 1,
        },
        {
          name: 'Drake London',
          position: 'WR',
          team: 'ATL',
          image: 'https://a.espncdn.com/i/headshots/nfl/players/full/4431508.png',
          pick: '2.07',
          round: 2,
        },
        {
          name: 'Josh Allen',
          position: 'QB',
          team: 'BUF',
          image: 'https://a.espncdn.com/i/headshots/nfl/players/full/3918298.png',
          pick: '3.06',
          round: 3,
        }
      ],
      pointsPerGame: '122.5 PPG',
      byeWeekStrength: 'Rank: #2',
      syncId: 'MX-961-BH44',
    },
    {
      id: '4',
      grade: 'B+',
      efficiency: '89.8%',
      projectedRecord: '10-4',
      topPicks: [
        {
          name: 'Amon-Ra St. Brown',
          position: 'WR',
          team: 'DET',
          image: 'https://a.espncdn.com/i/headshots/nfl/players/full/4361370.png',
          pick: '1.05',
          round: 1,
        },
        {
          name: 'Patrick Mahomes',
          position: 'QB',
          team: 'KC',
          image: 'https://a.espncdn.com/i/headshots/nfl/players/full/3139477.png',
          pick: '2.08',
          round: 2,
        },
        {
          name: 'Josh Jacobs',
          position: 'RB',
          team: 'GB',
          image: 'https://a.espncdn.com/i/headshots/nfl/players/full/4047365.png',
          pick: '3.05',
          round: 3,
        }
      ],
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
                  
                  {/* Top half: Top 3 Picks in 1970s Baseball Card style */}
                  <View style={styles.cardTopHalf}>
                    {/* Grade in top right corner in white text */}
                    <View style={styles.gradeContainer}>
                      <Text style={styles.gradeText}>{recap.grade}</Text>
                    </View>

                    <View style={styles.baseballContainer}>
                      {recap.topPicks.map((pick, pIdx) => {
                        const nameParts = pick.name.split(' ');
                        const firstName = nameParts[0] || '';
                        const lastName = nameParts.slice(1).join(' ') || '';

                        return (
                          <View key={pIdx} style={styles.baseballCard}>
                            <View style={styles.baseballCardImageContainer}>
                              <Image 
                                source={{ uri: pick.image }} 
                                style={styles.baseballCardImage} 
                              />
                            </View>
                            <View style={styles.baseballCardTextContainer}>
                              <Text style={styles.baseballCardFirstName} numberOfLines={1}>
                                {firstName.toUpperCase()}
                              </Text>
                              <Text style={styles.baseballCardLastName} numberOfLines={1}>
                                {lastName.toUpperCase()}
                              </Text>
                              <Text style={styles.baseballCardTeamPos} numberOfLines={1}>
                                {`${pick.team} • ${pick.position}`}
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>

                  {/* Bottom half: Gold badge & Stats (no barcode) */}
                  <View style={styles.cardBottomHalf}>
                    <View style={styles.goldPill}>
                      <Text style={styles.goldPillText}>Draft Efficiency: {recap.efficiency}</Text>
                    </View>

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
      flex: 1.25,
      backgroundColor: Colors.coltsNavy,
      paddingTop: 34,
      paddingHorizontal: 8,
      paddingBottom: 10,
      position: 'relative',
      justifyContent: 'center',
    },
    gradeContainer: {
      position: 'absolute',
      top: 10,
      right: 12,
      zIndex: 10,
    },
    gradeText: {
      fontFamily: Fonts.headings,
      fontSize: 20,
      fontWeight: '900',
      color: '#FFFFFF',
      textShadowColor: 'rgba(0, 0, 0, 0.4)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    baseballContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      gap: 6,
    },
    baseballCard: {
      flex: 1,
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.08)',
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: '#FFFFFF',
      overflow: 'hidden',
      height: 140,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 2,
    },
    baseballCardImageContainer: {
      width: '100%',
      height: 72,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.12)',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    baseballCardImage: {
      width: '90%',
      height: '90%',
      resizeMode: 'contain',
    },
    baseballCardTextContainer: {
      paddingVertical: Spacing.one,
      paddingHorizontal: 2,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    baseballCardFirstName: {
      fontFamily: Fonts.headings,
      fontSize: 8,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
      letterSpacing: 0.3,
    },
    baseballCardLastName: {
      fontFamily: Fonts.headings,
      fontSize: 9.5,
      fontWeight: '900',
      color: '#bea98e', // Champagne Bronze
      textAlign: 'center',
      letterSpacing: 0.3,
      marginTop: 1,
    },
    baseballCardTeamPos: {
      fontFamily: Fonts.body,
      fontSize: 7.5,
      color: 'rgba(255, 255, 255, 0.65)',
      textAlign: 'center',
      marginTop: 2,
      fontWeight: '600',
      letterSpacing: 0.2,
    },
    cardBottomHalf: {
      flex: 1.0,
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: Spacing.two,
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
