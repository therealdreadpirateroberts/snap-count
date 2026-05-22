import React from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useColors, Fonts, Spacing } from '@/constants/theme';
import InteractiveSlider from '@/components/InteractiveSlider';

interface LeagueRulesSelectorProps {
  scoring: 'Standard' | 'PPR' | 'Half-PPR' | 'Dynasty';
  setScoring: (val: 'Standard' | 'PPR' | 'Half-PPR' | 'Dynasty') => void;
  rankingsBase: 'ECR Consensus' | 'Andy' | 'Mike' | 'Jason' | 'My Ranks';
  setRankingsBase: (val: 'ECR Consensus' | 'Andy' | 'Mike' | 'Jason' | 'My Ranks') => void;
  pickClock: number;
  setPickClock: (val: number) => void;
  userStrategy: string;
  setUserStrategy: (val: any) => void;
  passingTdPoints: 4 | 6;
  setPassingTdPoints: (val: 4 | 6) => void;
  tePremium: boolean;
  setTePremium: (val: boolean) => void;
  flexCount: 1 | 2;
  setFlexCount: (val: 1 | 2) => void;
  expandedField: string | null;
  toggleExpanded: (field: 'scoring' | 'timer' | 'difficulty' | 'rankingsBase' | 'customRules' | 'roster' | 'strategy') => void;
  displayStrategies: any[];
  myRanks: any[] | null;
  myRanksName: string | null;
}

export default function LeagueRulesSelector({
  scoring,
  setScoring,
  rankingsBase,
  setRankingsBase,
  pickClock,
  setPickClock,
  userStrategy,
  setUserStrategy,
  passingTdPoints,
  setPassingTdPoints,
  tePremium,
  setTePremium,
  flexCount,
  setFlexCount,
  expandedField,
  toggleExpanded,
  displayStrategies,
  myRanks,
  myRanksName,
}: LeagueRulesSelectorProps) {
  const Colors = useColors();

  const triggerHaptic = async (style = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(style);
      } catch (err) {}
    }
  };

  const isDark = (Colors.primaryAccent as string) === '#FFFFFF';
  const activeStyles = isDark ? darkStyles : lightStyles;

  return (
    <View style={activeStyles.formCard}>
      {/* Draft Strategy */}
      <View>
        <Pressable style={activeStyles.formRow} onPress={() => toggleExpanded('strategy')}>
          <View style={activeStyles.rowLeft}>
            <Text style={activeStyles.formLabel}>Draft Strategy</Text>
          </View>
          <View style={activeStyles.rowRight}>
            <Text style={activeStyles.formValue}>{userStrategy}</Text>
            <Svg 
              width={14} 
              height={14} 
              viewBox="0 0 24 24" 
              fill="none"
              style={{ transform: [{ rotate: expandedField === 'strategy' ? '90deg' : '0deg' }] }}
            >
              <Path d="M9 5L16 12L9 19" stroke="#94a3b8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
        </Pressable>

        {expandedField === 'strategy' && (
          <View style={activeStyles.strategyDropdownPanel}>
            {displayStrategies.map((opt) => {
              const active = userStrategy === opt.name;
              return (
                <Pressable
                  key={opt.name}
                  style={[
                    activeStyles.strategyCard,
                    active && activeStyles.strategyCardActive
                  ]}
                  onPress={() => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                    setUserStrategy(opt.name);
                  }}
                >
                  <View style={activeStyles.strategyCardTextContainer}>
                    <Text style={[
                      activeStyles.strategyCardTitle,
                      active && activeStyles.strategyCardTitleActive
                    ]}>
                      {opt.name.toUpperCase()}
                    </Text>
                    <Text style={activeStyles.strategyCardDesc}>
                      {opt.desc}
                    </Text>
                  </View>
                  
                  <View style={activeStyles.strategyIndicator}>
                    {active ? (
                      <View style={{
                        width: 18,
                        height: 18,
                        borderRadius: 9,
                        borderWidth: 2,
                        borderColor: Colors.primaryAccent,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <View style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: Colors.primaryAccent
                        }} />
                      </View>
                    ) : (
                      <View style={{
                        width: 18,
                        height: 18,
                        borderRadius: 9,
                        borderWidth: 2,
                        borderColor: Colors.secondaryAccent,
                      }} />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>

      <View style={activeStyles.formDivider} />

      {/* Scoring */}
      <View>
        <Pressable style={activeStyles.formRow} onPress={() => toggleExpanded('scoring')}>
          <View style={activeStyles.rowLeft}>
            <Text style={activeStyles.formLabel}>Scoring Format</Text>
          </View>
          <View style={activeStyles.rowRight}>
            <Text style={activeStyles.formValue}>{scoring}</Text>
            <Svg 
              width={14} 
              height={14} 
              viewBox="0 0 24 24" 
              fill="none"
              style={{ transform: [{ rotate: expandedField === 'scoring' ? '90deg' : '0deg' }] }}
            >
              <Path d="M9 5L16 12L9 19" stroke="#94a3b8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
        </Pressable>

        {expandedField === 'scoring' && (
          <View style={activeStyles.dropdownPanel}>
            {(['Standard', 'PPR', 'Half-PPR', 'Dynasty'] as const).map((opt) => {
              const active = scoring === opt;
              return (
                <Pressable
                  key={opt}
                  style={[activeStyles.dropdownChip, active && activeStyles.dropdownChipActive]}
                  onPress={() => setScoring(opt)}
                >
                  <Text style={[activeStyles.dropdownChipText, active && activeStyles.dropdownChipTextActive]}>
                    {opt}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>

      <View style={activeStyles.formDivider} />

      {/* Rankings Base */}
      <View>
        <Pressable style={activeStyles.formRow} onPress={() => toggleExpanded('rankingsBase')}>
          <View style={activeStyles.rowLeft}>
            <Text style={activeStyles.formLabel}>Rankings Source</Text>
          </View>
          <View style={activeStyles.rowRight}>
            <Text style={activeStyles.formValue}>
              {rankingsBase === 'ECR Consensus' 
                ? 'ECR Consensus' 
                : rankingsBase === 'My Ranks' 
                  ? (myRanksName || 'Custom Board') 
                  : `${rankingsBase}'s Ranks`}
            </Text>
            <Svg 
              width={14} 
              height={14} 
              viewBox="0 0 24 24" 
              fill="none"
              style={{ transform: [{ rotate: expandedField === 'rankingsBase' ? '90deg' : '0deg' }] }}
            >
              <Path d="M9 5L16 12L9 19" stroke="#94a3b8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
        </Pressable>

        {expandedField === 'rankingsBase' && (
          <View style={activeStyles.dropdownPanel}>
            {(myRanks && myRanks.length > 0 
              ? (['ECR Consensus', 'Andy', 'Mike', 'Jason', 'My Ranks'] as const)
              : (['ECR Consensus', 'Andy', 'Mike', 'Jason'] as const)
            ).map((opt) => {
              const active = rankingsBase === opt;
              return (
                <Pressable
                  key={opt}
                  style={[activeStyles.dropdownChip, active && activeStyles.dropdownChipActive]}
                  onPress={() => setRankingsBase(opt)}
                >
                  <Text style={[activeStyles.dropdownChipText, active && activeStyles.dropdownChipTextActive]}>
                    {opt === 'ECR Consensus' 
                      ? 'ECR' 
                      : opt === 'My Ranks' 
                        ? (myRanksName || 'Custom') 
                        : opt}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>

      <View style={activeStyles.formDivider} />

      {/* Pick Clock */}
      <View>
        <Pressable style={activeStyles.formRow} onPress={() => toggleExpanded('timer')}>
          <View style={activeStyles.rowLeft}>
            <Text style={activeStyles.formLabel}>Draft Timer</Text>
          </View>
          <View style={activeStyles.rowRight}>
            <Text style={activeStyles.formValue}>{pickClock}s</Text>
            <Svg 
              width={14} 
              height={14} 
              viewBox="0 0 24 24" 
              fill="none"
              style={{ transform: [{ rotate: expandedField === 'timer' ? '90deg' : '0deg' }] }}
            >
              <Path d="M9 5L16 12L9 19" stroke="#94a3b8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
        </Pressable>

        {expandedField === 'timer' && (
          <View style={[activeStyles.strategyDropdownPanel, { paddingHorizontal: 20 }]}>
            <InteractiveSlider
              value={pickClock}
              onChange={setPickClock}
              min={10}
              max={120}
            />
          </View>
        )}
      </View>

      <View style={activeStyles.formDivider} />

      {/* Custom Rules */}
      <View>
        <Pressable style={activeStyles.formRow} onPress={() => toggleExpanded('customRules')}>
          <View style={activeStyles.rowLeft}>
            <Text style={activeStyles.formLabel}>Custom League Rules</Text>
          </View>
          <View style={activeStyles.rowRight}>
            <Svg 
              width={14} 
              height={14} 
              viewBox="0 0 24 24" 
              fill="none"
              style={{ transform: [{ rotate: expandedField === 'customRules' ? '90deg' : '0deg' }] }}
            >
              <Path d="M9 5L16 12L9 19" stroke="#94a3b8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
        </Pressable>

        {expandedField === 'customRules' && (
          <View style={activeStyles.customRulesPanel}>
            {/* Segment 1: Passing TD */}
            <View style={activeStyles.customRuleRow}>
              <Text style={activeStyles.customRuleLabel}>Passing TD Value</Text>
              <View style={activeStyles.segmentContainer}>
                {([4, 6] as const).map((pts) => {
                  const active = passingTdPoints === pts;
                  return (
                    <Pressable
                      key={pts}
                      style={[activeStyles.segmentButton, active && activeStyles.segmentButtonActive]}
                      onPress={() => setPassingTdPoints(pts)}
                    >
                      <Text style={[activeStyles.segmentButtonText, active && activeStyles.segmentButtonTextActive]}>
                        {pts} PTS
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Segment 2: TE Premium */}
            <View style={activeStyles.customRuleRow}>
              <Text style={activeStyles.customRuleLabel}>TE Premium Scoring</Text>
              <View style={activeStyles.segmentContainer}>
                {([false, true] as const).map((val) => {
                  const active = tePremium === val;
                  return (
                    <Pressable
                      key={val ? 'true' : 'false'}
                      style={[activeStyles.segmentButton, active && activeStyles.segmentButtonActive]}
                      onPress={() => setTePremium(val)}
                    >
                      <Text style={[activeStyles.segmentButtonText, active && activeStyles.segmentButtonTextActive]}>
                        {val ? '+0.5 PPR' : 'Disabled'}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Segment 3: FLEX Slots */}
            <View style={activeStyles.customRuleRow}>
              <Text style={activeStyles.customRuleLabel}>FLEX Roster Slots</Text>
              <View style={activeStyles.segmentContainer}>
                {([1, 2] as const).map((num) => {
                  const active = flexCount === num;
                  return (
                    <Pressable
                      key={num}
                      style={[activeStyles.segmentButton, active && activeStyles.segmentButtonActive]}
                      onPress={() => setFlexCount(num)}
                    >
                      <Text style={[activeStyles.segmentButtonText, active && activeStyles.segmentButtonTextActive]}>
                        {num} FLEX
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const createStyles = (Colors: typeof import('@/constants/theme').LightColors) => {
  return StyleSheet.create({
    formCard: {
      backgroundColor: Colors.surface,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 16,
      overflow: 'hidden',
      ...Colors.shadows,
    },
    formRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Spacing.three,
      height: 48,
    },
    rowLeft: {
      flex: 1,
    },
    formLabel: {
      fontFamily: Fonts.body,
      fontSize: 13,
      color: Colors.primaryAccent,
      fontWeight: '500',
    },
    rowRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.two,
    },
    formValue: {
      fontFamily: Fonts.body,
      fontSize: 13,
      color: Colors.primaryAccent,
      fontWeight: 'bold',
    },
    formDivider: {
      height: 1,
      backgroundColor: Colors.coltsNavyLight,
      marginHorizontal: Spacing.three,
    },
    dropdownPanel: {
      flexDirection: 'row',
      backgroundColor: Colors.surfaceLifted,
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.two,
      gap: 8,
      justifyContent: 'space-around',
    },
    dropdownChip: {
      flex: 1,
      backgroundColor: Colors.surface,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 22,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dropdownChipActive: {
      borderColor: Colors.hofYellow,
      backgroundColor: Colors.hofYellow,
    },
    dropdownChipText: {
      fontFamily: Fonts.body,
      fontSize: 11,
      color: Colors.secondaryAccent,
      fontWeight: '600',
    },
    dropdownChipTextActive: {
      color: '#000000',
    },
    strategyDropdownPanel: {
      backgroundColor: Colors.surfaceLifted,
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.three,
      gap: 10,
    },
    strategyCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: Colors.surface,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 14,
      minHeight: 48,
    },
    strategyCardActive: {
      borderColor: Colors.hofYellow,
      backgroundColor: 'rgba(239, 131, 84, 0.04)',
    },
    strategyCardTextContainer: {
      flex: 1,
      paddingRight: 10,
    },
    strategyCardTitle: {
      fontFamily: Fonts.headings,
      fontSize: 12,
      color: Colors.primaryAccent,
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },
    strategyCardTitleActive: {
      color: Colors.hofYellow,
    },
    strategyCardDesc: {
      fontFamily: Fonts.body,
      fontSize: 10.5,
      color: Colors.secondaryAccent,
      marginTop: 2,
    },
    strategyIndicator: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 24,
      height: 24,
    },
    customRulesPanel: {
      backgroundColor: Colors.surfaceLifted,
      paddingHorizontal: Spacing.three,
      paddingVertical: Spacing.three,
      gap: 12,
    },
    customRuleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    customRuleLabel: {
      fontFamily: Fonts.body,
      fontSize: 12,
      color: Colors.primaryAccent,
      fontWeight: 'bold',
    },
    segmentContainer: {
      flexDirection: 'row',
      backgroundColor: Colors.surface,
      borderColor: Colors.coltsNavyLight,
      borderWidth: 1,
      borderRadius: 8,
      padding: 3,
      gap: 4,
    },
    segmentButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      minWidth: 76,
      minHeight: 36,
      justifyContent: 'center',
      alignItems: 'center',
    },
    segmentButtonActive: {
      backgroundColor: Colors.hofYellow,
    },
    segmentButtonText: {
      fontFamily: Fonts.body,
      fontSize: 10.5,
      color: Colors.secondaryAccent,
      fontWeight: 'bold',
    },
    segmentButtonTextActive: {
      color: '#000000',
      fontWeight: '900',
    },
  });
};

const lightStyles = createStyles(require('@/constants/theme').LightColors);
const darkStyles = createStyles(require('@/constants/theme').DarkColors);
