import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Fonts, Spacing, MaxContentWidth } from '@/constants/theme';
import BackgroundTexture from '@/components/BackgroundTexture';
import Svg, { Path } from 'react-native-svg';

export default function LandingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <BackgroundTexture />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.kickerPill}>
              <Text style={styles.kickerText}>FANTASY · 2026 · LIVE</Text>
            </View>
            
            <Text style={styles.wordmark}>
              SNAP<Text style={styles.dot}>·</Text>COUNT
            </Text>
            
            <Text style={styles.tagline}>
              Sharper rankings. Smarter mocks. Faster reads on the news that actually moves your roster.
            </Text>
          </View>

          {/* Cards Section */}
          <View style={styles.cardContainer}>
            
            {/* HERO CARD: Draft Wizard */}
            <Pressable 
              style={({ pressed }) => [styles.heroCard, pressed && styles.cardPressed]}
              onPress={() => router.push('/wizard/setup')}
            >
              {/* Background Trophy Watermark */}
              <View style={styles.trophyWatermark}>
                <Svg width={120} height={120} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M18 2H6C4.9 2 4 2.9 4 4V7C4 8.66 5.34 10 7 10H8.09C8.61 12.3 10.3 14.12 12.5 14.75V19H9C8.45 19 8 19.45 8 20V21C8 21.55 8.45 22 9 22H15C15.55 22 16 21.55 16 21V20C16 19.45 15.55 19 15 19H11.5V14.75C13.7 14.12 15.39 12.3 15.91 10H17C18.66 10 20 8.66 20 7V4C20 2.9 19.1 2 18 2ZM6 8V4H7V8C7 8.55 6.55 9 6 9C5.45 9 5 8.55 5 8V8ZM19 7C19 7.55 18.55 8 18 8H17V4H18V7C18 7.55 18.55 8 19 8Z"
                    fill="#F8FAFC"
                    opacity={0.06}
                  />
                </Svg>
              </View>

              <View style={styles.heroTextContainer}>
                <Text style={styles.heroKicker}>DRAFT SIMULATOR</Text>
                <Text style={styles.heroTitle}>AI DRAFT WIZARD</Text>
                <Text style={styles.heroSubtitle}>
                  Mock draft against smart AI opponents with pick suggestions and live grade analysis.
                </Text>
              </View>

              <View style={styles.heroButton}>
                <Text style={styles.heroButtonText}>START MOCK DRAFT</Text>
              </View>
            </Pressable>

            {/* SECONDARY ROW CARDS */}
            <View style={styles.row}>
              
              {/* Rankings Card */}
              <Pressable 
                style={({ pressed }) => [styles.secondaryCard, pressed && styles.cardPressed]}
                onPress={() => router.push('/rankings')}
              >
                <Text style={styles.secondaryCardKicker}>TOP 150</Text>
                <Text style={styles.secondaryCardTitle}>CONSENSUS RANKINGS</Text>
                <Text style={styles.secondaryCardBody}>
                  Half-PPR cheat sheet. Filter by position, search active ADP, and view round dividers.
                </Text>
                <Text style={styles.arrowLink}>VIEW RANKINGS →</Text>
              </Pressable>

              {/* News & Notes Card */}
              <Pressable 
                style={({ pressed }) => [styles.secondaryCard, pressed && styles.cardPressed]}
                onPress={() => router.push('/news')}
              >
                <Text style={styles.secondaryCardKicker}>FANTASY INSIGHT</Text>
                <Text style={styles.secondaryCardTitle}>NEWS & TAKES</Text>
                <Text style={styles.secondaryCardBody}>
                  Reaction-based takes to the NFL news cycle. Actionable fantasy up/down movers.
                </Text>
                <Text style={styles.arrowLink}>READ ARTICLES →</Text>
              </Pressable>

            </View>

          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>DATA SOURCES: ESPN CDN & EXPERT ADP CONSENSUS</Text>
            <Text style={styles.footerVersion}>SNAP·COUNT v2.0 · PILOT BUILD</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    flexGrow: 1,
    justifyContent: 'space-between',
    gap: Spacing.five,
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.three,
    gap: Spacing.three,
  },
  kickerPill: {
    backgroundColor: '#0a1530',
    borderColor: '#1a4480',
    borderWidth: 1,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: 50,
  },
  kickerText: {
    fontFamily: Fonts.stats,
    fontSize: 10,
    color: '#E2E8F0',
    letterSpacing: 2,
  },
  wordmark: {
    fontFamily: Fonts.headings,
    fontSize: 52,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
    letterSpacing: -1,
  },
  dot: {
    color: Colors.primaryAccent,
  },
  tagline: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.secondaryAccent,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.three,
  },
  cardContainer: {
    gap: Spacing.four,
  },
  heroCard: {
    backgroundColor: Colors.surface,
    borderColor: '#1a4480',
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.four,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 180,
    justifyContent: 'space-between',
    gap: Spacing.four,
  },
  trophyWatermark: {
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  heroTextContainer: {
    gap: Spacing.one,
  },
  heroKicker: {
    fontFamily: Fonts.stats,
    fontSize: 10,
    color: Colors.positions.RB, // Green accent for draft kicker
    letterSpacing: 1.5,
  },
  heroTitle: {
    fontFamily: Fonts.headings,
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.secondaryAccent,
    lineHeight: 20,
    maxWidth: '85%',
  },
  heroButton: {
    backgroundColor: Colors.primaryAccent,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.four,
    minHeight: 44, // HIG standard minimum
  },
  heroButtonText: {
    fontFamily: Fonts.headings,
    fontSize: 14,
    color: Colors.background,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.four,
    flexWrap: 'wrap',
  },
  secondaryCard: {
    backgroundColor: Colors.surface,
    borderColor: '#1a4480',
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    flex: 1,
    minWidth: 260,
    justifyContent: 'space-between',
    minHeight: 180,
    gap: Spacing.two,
  },
  secondaryCardKicker: {
    fontFamily: Fonts.stats,
    fontSize: 9,
    color: Colors.positions.WR,
    letterSpacing: 1.5,
  },
  secondaryCardTitle: {
    fontFamily: Fonts.headings,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
  },
  secondaryCardBody: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.secondaryAccent,
    lineHeight: 18,
  },
  arrowLink: {
    fontFamily: Fonts.stats,
    fontSize: 11,
    color: Colors.primaryAccent,
    marginTop: Spacing.two,
  },
  cardPressed: {
    borderColor: Colors.primaryAccent,
    opacity: 0.95,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.four,
    gap: Spacing.one,
  },
  footerText: {
    fontFamily: Fonts.stats,
    fontSize: 9,
    color: Colors.secondaryAccent,
    opacity: 0.5,
    letterSpacing: 0.5,
  },
  footerVersion: {
    fontFamily: Fonts.stats,
    fontSize: 9,
    color: Colors.secondaryAccent,
    opacity: 0.3,
  },
});
