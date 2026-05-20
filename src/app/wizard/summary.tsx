import React, { useMemo } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSnapStore } from '@/store/useSnapStore';
import { getTeamLogoUrl } from '@/store/mockData';
import { Colors, Fonts, Spacing, MaxContentWidth } from '@/constants/theme';
import BackgroundTexture from '@/components/BackgroundTexture';
import Svg, { Path } from 'react-native-svg';

export default function DraftSummaryScreen() {
  const router = useRouter();
  
  const setup = useSnapStore((state) => state.setup);
  const resetDraft = useSnapStore((state) => state.resetDraft);
  const getDraftGrade = useSnapStore((state) => state.getDraftGrade);
  const getUserRoster = useSnapStore((state) => state.getUserRoster);

  const roster = useMemo(() => {
    return getUserRoster();
  }, [getUserRoster]);

  const { grade, valueScore } = useMemo(() => {
    return getDraftGrade();
  }, [getDraftGrade]);

  const isHOF = grade === 'A+';

  const handleRestart = () => {
    resetDraft();
    router.replace('/wizard/setup');
  };

  const handleHome = () => {
    resetDraft();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <BackgroundTexture />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>DRAFT ANALYSIS</Text>
            <Text style={styles.subtitle}>YOUR SIMULATED TEAM SCORECARD</Text>
          </View>

          {/* GRADE DISPLAY CARD */}
          <View style={[
            styles.gradeCard, 
            isHOF && styles.hofGradeCard
          ]}>
            {/* Background Watermark */}
            <View style={styles.watermarkContainer}>
              <Svg width={180} height={180} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M18 2H6C4.9 2 4 2.9 4 4V7C4 8.66 5.34 10 7 10H8.09C8.61 12.3 10.3 14.12 12.5 14.75V19H9C8.45 19 8 19.45 8 20V21C8 21.55 8.45 22 9 22H15C15.55 22 16 21.55 16 21V20C16 19.45 15.55 19 15 19H11.5V14.75C13.7 14.12 15.39 12.3 15.91 10H17C18.66 10 20 8.66 20 7V4C20 2.9 19.1 2 18 2ZM6 8V4H7V8C7 8.55 6.55 9 6 9C5.45 9 5 8.55 5 8V8ZM19 7C19 7.55 18.55 8 18 8H17V4H18V7C18 7.55 18.55 8 19 8Z"
                  fill={isHOF ? Colors.hofYellow : Colors.primaryAccent}
                  opacity={isHOF ? 0.08 : 0.04}
                />
              </Svg>
            </View>

            <Text style={[styles.gradeKicker, isHOF && styles.hofText]}>
              {isHOF ? '🏆 HALL OF FAME RATING' : 'DRAFT GRADE'}
            </Text>

            <Text style={[styles.gradeLetter, isHOF && styles.hofText]}>
              {grade}
            </Text>

            {/* Scorecard stats */}
            <View style={styles.scoreRow}>
              <View style={styles.scoreCell}>
                <Text style={styles.scoreLabel}>VALUE VS ADP</Text>
                <Text style={[styles.scoreVal, valueScore >= 0 ? styles.positiveScore : styles.negativeScore]}>
                  {valueScore >= 0 ? `+${valueScore}` : valueScore} picks
                </Text>
              </View>

              <View style={styles.dividerCol} />

              <View style={styles.scoreCell}>
                <Text style={styles.scoreLabel}>PLAYERS DRAFTED</Text>
                <Text style={styles.scoreVal}>{roster.length}</Text>
              </View>
            </View>

            <Text style={styles.gradeFeedback}>
              {isHOF && 'Masterful execution. You captured immense draft value across almost every single round.'}
              {grade === 'A' && 'Outstanding draft. You navigated positional scarcity perfectly and built highly efficient depth.'}
              {grade === 'B+' && 'Strong performance. Solid roster composition with minimal reaches.'}
              {grade === 'B' && 'Good draft. A balanced team structure, though you reached slightly on a few selections.'}
              {grade === 'C' && 'Average draft. Reached on several skill positions; depth could be vulnerable.'}
              {grade === 'D' && 'Tough draft board. We recommend monitoring active news to repair roster deficits.'}
            </Text>
          </View>

          {/* STARTER ROSTER DETAILS */}
          <View style={styles.rosterSection}>
            <Text style={styles.sectionTitle}>YOUR FINAL ROSTER</Text>
            
            <View style={styles.rosterList}>
              {roster.map((player, idx) => {
                const posColor = Colors.positions[player.position];
                
                return (
                  <View key={player.rank} style={styles.playerRow}>
                    <View style={styles.slotTag}>
                      <Text style={styles.slotTagText}>SLOT {idx + 1}</Text>
                    </View>
                    
                    <Image 
                      source={{ uri: getTeamLogoUrl(player.team) }} 
                      style={styles.teamLogo} 
                    />
                    
                    <View style={styles.playerDetails}>
                      <Text style={styles.playerName}>{player.name}</Text>
                      <Text style={styles.playerMeta}>
                        <Text style={[styles.posLabel, { color: posColor }]}>{player.position}</Text> · {player.team} · BYE {player.bye}
                      </Text>
                    </View>

                    <View style={styles.pickDetails}>
                      <Text style={styles.pickLabel}>PICK</Text>
                      <Text style={styles.pickVal}>#{idx * 12 + setup.userPosition}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* ACTIONS */}
          <View style={styles.actionContainer}>
            <Pressable style={styles.primaryBtn} onPress={handleRestart}>
              <Text style={styles.primaryBtnText}>START NEW MOCK DRAFT</Text>
            </Pressable>

            <Pressable style={styles.secondaryBtn} onPress={handleHome}>
              <Text style={styles.secondaryBtnText}>BACK TO LOBBY</Text>
            </Pressable>
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
    gap: Spacing.five,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  title: {
    fontFamily: Fonts.headings,
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primaryAccent,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: Fonts.stats,
    fontSize: 10,
    color: Colors.positions.WR, // Blue kicker highlight
    letterSpacing: 2,
  },
  gradeCard: {
    backgroundColor: Colors.surface,
    borderColor: '#1a4480',
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.four,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    gap: Spacing.three,
  },
  hofGradeCard: {
    borderColor: Colors.hofYellow,
    backgroundColor: '#1c1502', // Subtle dark yellow/gold glow overlay
    shadowColor: Colors.hofYellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  watermarkContainer: {
    position: 'absolute',
    right: -10,
    bottom: -15,
  },
  gradeKicker: {
    fontFamily: Fonts.stats,
    fontSize: 10,
    color: Colors.secondaryAccent,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  hofText: {
    color: Colors.hofYellow,
  },
  gradeLetter: {
    fontFamily: Fonts.headings,
    fontSize: 100,
    fontWeight: '900',
    color: Colors.primaryAccent,
    lineHeight: 110,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: Spacing.one,
  },
  scoreCell: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  scoreLabel: {
    fontFamily: Fonts.stats,
    fontSize: 8,
    color: Colors.secondaryAccent,
    opacity: 0.5,
    letterSpacing: 1,
  },
  scoreVal: {
    fontFamily: Fonts.stats,
    fontSize: 16,
    color: Colors.primaryAccent,
    fontWeight: 'bold',
  },
  positiveScore: {
    color: Colors.status.success,
  },
  negativeScore: {
    color: Colors.status.danger,
  },
  dividerCol: {
    width: 1,
    height: 32,
    backgroundColor: '#1a4480',
    opacity: 0.3,
  },
  gradeFeedback: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.secondaryAccent,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: Spacing.two,
    opacity: 0.8,
  },
  rosterSection: {
    gap: Spacing.three,
  },
  sectionTitle: {
    fontFamily: Fonts.stats,
    fontSize: 12,
    color: Colors.secondaryAccent,
    opacity: 0.6,
    letterSpacing: 1.5,
  },
  rosterList: {
    gap: Spacing.two,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: '#0f1d3d',
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.three,
    minHeight: 56,
  },
  slotTag: {
    backgroundColor: '#0a1530',
    borderColor: '#1a4480',
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    width: 64,
    alignItems: 'center',
  },
  slotTagText: {
    fontFamily: Fonts.stats,
    fontSize: 8,
    color: Colors.secondaryAccent,
    fontWeight: 'bold',
  },
  teamLogo: {
    width: 36,
    height: 36,
  },
  playerDetails: {
    flex: 1,
    gap: 2,
  },
  playerName: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.primaryAccent,
    fontWeight: '600',
  },
  playerMeta: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.secondaryAccent,
    opacity: 0.6,
  },
  posLabel: {
    fontWeight: 'bold',
  },
  pickDetails: {
    alignItems: 'center',
  },
  pickLabel: {
    fontFamily: Fonts.stats,
    fontSize: 7,
    color: Colors.secondaryAccent,
    opacity: 0.4,
  },
  pickVal: {
    fontFamily: Fonts.stats,
    fontSize: 11,
    color: Colors.primaryAccent,
  },
  actionContainer: {
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  primaryBtn: {
    backgroundColor: Colors.primaryAccent,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    fontFamily: Fonts.headings,
    fontSize: 15,
    color: Colors.background,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    borderColor: '#1a4480',
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontFamily: Fonts.headings,
    fontSize: 15,
    color: Colors.primaryAccent,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
