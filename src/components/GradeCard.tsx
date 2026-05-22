import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors, Fonts, Spacing, useColors, LightColors, DarkColors } from '@/constants/theme';
import { useThemeStore } from '@/store/useThemeStore';

export interface GradeCardProps {
  grade: string;
  projectedWins: number;
  projectedLosses: number;
  playoffChance: number;
}

export default function GradeCard({ grade, projectedWins, projectedLosses, playoffChance }: GradeCardProps) {
  const Colors = useColors();
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark';
  const isHOF = grade === 'A+';
  const activeStyles = isDark ? darkStyles : lightStyles;

  return (
    <View style={[activeStyles.gradeCard, isHOF && activeStyles.hofGradeCard]}>
      <View style={activeStyles.gradeBoxRow}>
        <View style={activeStyles.gradeCircle}>
          <Text style={[activeStyles.gradeLetterText, isHOF && activeStyles.hofText]}>{grade}</Text>
        </View>
        <View style={activeStyles.gradeHeaderMeta}>
          <Text style={activeStyles.gradeHeaderKicker}>{isHOF ? '🏆 HALL OF FAME RATING' : 'DRAFT GRADE'}</Text>
          <Text style={activeStyles.gradeHeaderRecord}>{Math.round(projectedWins)} - {Math.round(projectedLosses)} Projected</Text>
          <Text style={activeStyles.gradeHeaderPlayoff}>{Math.round(playoffChance)}% Playoff Probability</Text>
        </View>
      </View>
      <Text style={activeStyles.gradeHeaderSummaryText}>
        {grade === 'A+' && 'Masterful. You captured immense draft value across almost every single round.'}
        {grade === 'A' && 'Outstanding. You navigated positional scarcity perfectly and built deep lineups.'}
        {grade.startsWith('B') && 'Strong draft. Solid roster balance with very minor ADP slips.'}
        {grade === 'C' && 'Average draft. Reached on several positions; depth could be highly vulnerable.'}
        {grade === 'D' && 'Tough draft board. We recommend monitoring active news to adjust starters.'}
      </Text>
    </View>
  );
}

function createStyles(Colors: typeof LightColors) {
  const isDark = (Colors.primaryAccent as string) === '#FFFFFF';
  return StyleSheet.create({
    gradeCard: {
      backgroundColor: Colors.surface,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 12,
      padding: Spacing.three,
      marginHorizontal: Spacing.four,
      ...Colors.shadows,
    },
    hofGradeCard: {
      borderColor: Colors.hofYellow,
      borderWidth: 2,
      backgroundColor: Colors.surface,
      shadowColor: Colors.hofYellow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
    gradeBoxRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.three,
    },
    gradeCircle: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: Colors.surfaceLifted,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    gradeLetterText: {
      fontFamily: Fonts.headings,
      fontSize: 32,
      fontWeight: '900',
      color: Colors.primaryAccent,
    },
    hofText: {
      color: isDark ? Colors.hofYellow : Colors.primaryAccent,
      fontWeight: 'bold',
    },
    gradeHeaderMeta: {
      flex: 1,
      gap: 2,
    },
    gradeHeaderKicker: {
      fontFamily: Fonts.stats,
      fontSize: 8,
      color: Colors.secondaryAccent,
      letterSpacing: 1.5,
      fontWeight: 'bold',
    },
    gradeHeaderRecord: {
      fontFamily: Fonts.body,
      fontSize: 14,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
    },
    gradeHeaderPlayoff: {
      fontFamily: Fonts.body,
      fontSize: 11,
      color: '#22c55e',
    },
    gradeHeaderSummaryText: {
      fontFamily: Fonts.body,
      fontSize: 12,
      color: Colors.secondaryAccent,
      marginTop: Spacing.two,
      lineHeight: 16,
    },
  });
}

const lightStyles = createStyles(LightColors);
const darkStyles = createStyles(DarkColors as any);
