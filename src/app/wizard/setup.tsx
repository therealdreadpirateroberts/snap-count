import React, { useMemo } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSnapStore } from '@/store/useSnapStore';
import { Colors, Fonts, Spacing, MaxContentWidth } from '@/constants/theme';
import BackgroundTexture from '@/components/BackgroundTexture';
import Svg, { Path } from 'react-native-svg';

export default function DraftSetupScreen() {
  const router = useRouter();
  const setup = useSnapStore((state) => state.setup);
  const updateSetup = useSnapStore((state) => state.updateSetup);
  const startDraft = useSnapStore((state) => state.startDraft);

  // Dynamic preview math for first 4 picks
  const firstFourPicks = useMemo(() => {
    const { leagueSize, userPosition, draftType } = setup;
    const picks = [];
    
    // Round 1
    picks.push(userPosition);
    
    // Round 2
    if (draftType === 'Snake') {
      picks.push(2 * leagueSize - userPosition + 1);
    } else {
      picks.push(leagueSize + userPosition);
    }
    
    // Round 3
    picks.push(2 * leagueSize + userPosition);
    
    // Round 4
    if (draftType === 'Snake') {
      picks.push(4 * leagueSize - userPosition + 1);
    } else {
      picks.push(3 * leagueSize + userPosition);
    }
    
    return picks;
  }, [setup]);

  const handleLaunch = () => {
    startDraft();
    router.replace('/wizard/active');
  };

  return (
    <View style={styles.container}>
      <BackgroundTexture />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        
        {/* Header Block */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M15 19L8 12L15 5" stroke="#F8FAFC" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.backButtonText}>BACK</Text>
          </Pressable>
          
          <Text style={styles.title}>DRAFT CONFIGURATION</Text>
          <Text style={styles.subtitle}>SET UP YOUR SIMULATION ARENA</Text>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* League Size */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>LEAGUE SIZE</Text>
            <View style={styles.optionRow}>
              {[8, 10, 12, 14].map((size) => (
                <Pressable
                  key={size}
                  style={[styles.optionButton, setup.leagueSize === size && styles.activeOptionButton]}
                  onPress={() => updateSetup({ leagueSize: size })}
                >
                  <Text style={[styles.optionText, setup.leagueSize === size && styles.activeOptionText]}>
                    {size} TEAMS
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* User Picking Position Dynamic Grid */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>YOUR PICK POSITION</Text>
            <View style={styles.gridContainer}>
              {Array.from({ length: setup.leagueSize }, (_, i) => i + 1).map((pos) => {
                const isActive = setup.userPosition === pos;
                return (
                  <Pressable
                    key={pos}
                    style={[styles.gridCell, isActive && styles.activeGridCell]}
                    onPress={() => updateSetup({ userPosition: pos })}
                  >
                    <Text style={[styles.gridCellText, isActive && styles.activeGridCellText]}>
                      #{pos}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Draft Style: Snake or Linear */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>DRAFT SYSTEM</Text>
            <View style={styles.optionRow}>
              {['Snake', 'Linear'].map((type) => (
                <Pressable
                  key={type}
                  style={[styles.optionButton, setup.draftType === type && styles.activeOptionButton]}
                  onPress={() => updateSetup({ draftType: type as 'Snake' | 'Linear' })}
                >
                  <Text style={[styles.optionText, setup.draftType === type && styles.activeOptionText]}>
                    {type.toUpperCase()} DRAFT
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Rounds */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>DRAFT LENGTH</Text>
            <View style={styles.optionRow}>
              {[12, 14, 16].map((r) => (
                <Pressable
                  key={r}
                  style={[styles.optionButton, setup.rounds === r && styles.activeOptionButton]}
                  onPress={() => updateSetup({ rounds: r })}
                >
                  <Text style={[styles.optionText, setup.rounds === r && styles.activeOptionText]}>
                    {r} ROUNDS
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Opponent Style */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>OPPONENT STYLE (AI DIFFICULTY)</Text>
            <View style={styles.verticalOptionCol}>
              {(['Standard ADP', 'Expert Consensus', 'Beat the Sharks', 'Casual League'] as const).map((styleName) => (
                <Pressable
                  key={styleName}
                  style={[styles.verticalOptionButton, setup.opponentStyle === styleName && styles.activeOptionButton]}
                  onPress={() => updateSetup({ opponentStyle: styleName })}
                >
                  <Text style={[styles.verticalOptionText, setup.opponentStyle === styleName && styles.activeOptionText]}>
                    {styleName.toUpperCase()}
                  </Text>
                  <Text style={[styles.verticalOptionDesc, setup.opponentStyle === styleName && styles.activeOptionDesc]}>
                    {styleName === 'Standard ADP' && 'Drafts directly around consensus ranking stats.'}
                    {styleName === 'Expert Consensus' && 'Weighted towards high-value upside, picks are highly efficient.'}
                    {styleName === 'Beat the Sharks' && 'Ruthless value drafting; snatches sleeper picks early.'}
                    {styleName === 'Casual League' && 'More draft noise; reaches on QBs early, lets sleepers slide.'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Mathematical Draft Pick Preview */}
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>YOUR FIRST 4 PICKS PREVIEW</Text>
            <Text style={styles.previewPicks}>
              {firstFourPicks.map((pick) => `#${pick}`).join('  ·  ')}
            </Text>
          </View>

          {/* LAUNCH CTA */}
          <Pressable style={styles.launchButton} onPress={handleLaunch}>
            <Text style={styles.launchButtonText}>LAUNCH MOCK DRAFT</Text>
          </Pressable>

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
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    gap: Spacing.one,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.two,
    minHeight: 44,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontFamily: Fonts.stats,
    fontSize: 12,
    color: Colors.primaryAccent,
    letterSpacing: 1,
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
    color: Colors.positions.TE, // Orange highlight
    letterSpacing: 2,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.five,
    gap: Spacing.four,
  },
  section: {
    gap: Spacing.two,
  },
  sectionLabel: {
    fontFamily: Fonts.stats,
    fontSize: 10,
    color: Colors.secondaryAccent,
    opacity: 0.7,
    letterSpacing: 1.5,
  },
  optionRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  optionButton: {
    backgroundColor: Colors.surface,
    borderColor: '#1a4480',
    borderWidth: 1,
    borderRadius: Spacing.one,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    flex: 1,
    minWidth: 100,
    minHeight: 44, // HIG standard touch target
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeOptionButton: {
    backgroundColor: Colors.primaryAccent,
    borderColor: Colors.primaryAccent,
  },
  optionText: {
    fontFamily: Fonts.stats,
    fontSize: 11,
    color: Colors.secondaryAccent,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  activeOptionText: {
    color: Colors.background,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  gridCell: {
    backgroundColor: Colors.surface,
    borderColor: '#1a4480',
    borderWidth: 1,
    borderRadius: Spacing.one,
    width: 44,
    height: 44, // perfect 44x44 HIG target
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeGridCell: {
    backgroundColor: Colors.primaryAccent,
    borderColor: Colors.primaryAccent,
  },
  gridCellText: {
    fontFamily: Fonts.stats,
    fontSize: 12,
    color: Colors.secondaryAccent,
    fontWeight: 'bold',
  },
  activeGridCellText: {
    color: Colors.background,
  },
  verticalOptionCol: {
    gap: Spacing.two,
  },
  verticalOptionButton: {
    backgroundColor: Colors.surface,
    borderColor: '#1a4480',
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.three,
    minHeight: 64,
    justifyContent: 'center',
    gap: 2,
  },
  verticalOptionText: {
    fontFamily: Fonts.headings,
    fontSize: 16,
    color: Colors.primaryAccent,
  },
  verticalOptionDesc: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.secondaryAccent,
    opacity: 0.65,
    lineHeight: 15,
  },
  activeOptionDesc: {
    color: Colors.background,
    opacity: 0.8,
  },
  previewContainer: {
    backgroundColor: '#0a1530',
    borderColor: '#1a4480',
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.two,
    gap: Spacing.one,
  },
  previewLabel: {
    fontFamily: Fonts.stats,
    fontSize: 9,
    color: Colors.positions.RB, // green
    letterSpacing: 2,
  },
  previewPicks: {
    fontFamily: Fonts.stats,
    fontSize: 18,
    color: Colors.primaryAccent,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  launchButton: {
    backgroundColor: Colors.primaryAccent,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    minHeight: 52, // premium size CTA
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  launchButtonText: {
    fontFamily: Fonts.headings,
    fontSize: 16,
    color: Colors.background,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
