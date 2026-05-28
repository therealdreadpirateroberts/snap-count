import React from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useColors, Fonts, Spacing } from '@/constants/theme';

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
  toggleExpanded: (field: 'scoring' | 'timer' | 'difficulty' | 'rankingsBase' | 'customRules' | 'roster' | 'strategy' | 'year') => void;
  year: number;
  setYear: (val: number) => void;
  displayStrategies: any[];
  myRanks: any[] | null;
  myRanksName: string | null;
  currentSlots: {
    QB: number;
    RB: number;
    WR: number;
    TE: number;
    FLEX: number;
    K: number;
    DST: number;
    BENCH: number;
    IR: number;
  };
  activeRosterCount: number;
  irRosterCount: number;
  onAdjustSlot: (key: 'QB' | 'RB' | 'WR' | 'TE' | 'FLEX' | 'K' | 'DST' | 'BENCH' | 'IR', delta: number) => void;
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
  currentSlots,
  activeRosterCount,
  irRosterCount,
  onAdjustSlot,
  year,
  setYear,
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
                    if (userStrategy === opt.name) {
                      setUserStrategy('Balanced');
                    } else {
                      setUserStrategy(opt.name);
                    }
                  }}
                >
                  <View style={activeStyles.strategyCardTextContainer}>
                    <Text style={[
                      activeStyles.strategyCardTitle,
                      active && activeStyles.strategyCardTitleActive
                    ]}>
                      {opt.name}
                    </Text>
                  </View>
                  
                  {/* Easy Toggle On/Off Indicator */}
                  <View style={{
                    width: 36,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: active ? Colors.hofYellow : '#E2E8F0',
                    padding: 2,
                    justifyContent: 'center',
                    alignItems: active ? 'flex-end' : 'flex-start',
                  }}>
                    <View style={{
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: '#FFFFFF',
                      shadowColor: '#000000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.2,
                      shadowRadius: 1,
                      elevation: 2,
                    }} />
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
          <View style={activeStyles.strategyDropdownPanel}>
            {(['Standard', 'PPR', 'Half-PPR', 'Dynasty'] as const).map((opt) => {
              const active = scoring === opt;
              return (
                <Pressable
                  key={opt}
                  style={[
                    activeStyles.strategyCard,
                    active && activeStyles.strategyCardActive
                  ]}
                  onPress={() => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                    setScoring(opt);
                  }}
                >
                  <View style={activeStyles.strategyCardTextContainer}>
                    <Text style={[
                      activeStyles.strategyCardTitle,
                      active && activeStyles.strategyCardTitleActive
                    ]}>
                      {opt}
                    </Text>
                  </View>
                  
                  {/* Easy Toggle On/Off Indicator */}
                  <View style={{
                    width: 36,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: active ? Colors.hofYellow : '#E2E8F0',
                    padding: 2,
                    justifyContent: 'center',
                    alignItems: active ? 'flex-end' : 'flex-start',
                  }}>
                    <View style={{
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: '#FFFFFF',
                      shadowColor: '#000000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.2,
                      shadowRadius: 1,
                      elevation: 2,
                    }} />
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>

      <View style={activeStyles.formDivider} />

      {/* Roster Configuration */}
      <View>
        <Pressable style={activeStyles.formRow} onPress={() => toggleExpanded('roster')}>
          <View style={activeStyles.rowLeft}>
            <Text style={activeStyles.formLabel}>Roster Configuration</Text>
          </View>
          <View style={activeStyles.rowRight}>
            <Text style={activeStyles.formValue}>{activeRosterCount} Slots</Text>
            <Svg 
              width={14} 
              height={14} 
              viewBox="0 0 24 24" 
              fill="none"
              style={{ transform: [{ rotate: expandedField === 'roster' ? '90deg' : '0deg' }] }}
            >
              <Path d="M9 5L16 12L9 19" stroke="#94a3b8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
        </Pressable>

        {expandedField === 'roster' && (
          <View style={activeStyles.strategyDropdownPanel}>
            {[
              { key: 'QB', label: 'Quarterback', short: 'QB' },
              { key: 'RB', label: 'Running Back', short: 'RB' },
              { key: 'WR', label: 'Wide Receiver', short: 'WR' },
              { key: 'TE', label: 'Tight End', short: 'TE' },
              { key: 'FLEX', label: 'Flex (W/R/T)', short: 'FLEX' },
              { key: 'K', label: 'Kicker', short: 'K' },
              { key: 'DST', label: 'Defense (DST)', short: 'DEF' },
              { key: 'BENCH', label: 'Bench Slots', short: 'BN' },
              { key: 'IR', label: 'Injured Reserve (IR)', short: 'IR' },
            ].map((item) => {
              const posKey = item.key as 'QB' | 'RB' | 'WR' | 'TE' | 'FLEX' | 'K' | 'DST' | 'BENCH' | 'IR';
              const count = currentSlots[posKey];
              
              const minLimits: Record<string, number> = { QB: 1, RB: 1, WR: 1, TE: 1, FLEX: 0, K: 0, DST: 0, BENCH: 1, IR: 0 };
              const maxLimits: Record<string, number> = { QB: 3, RB: 5, WR: 5, TE: 3, FLEX: 3, K: 2, DST: 2, BENCH: 12, IR: 4 };
              
              const isMin = count <= minLimits[item.key];
              const isMax = count >= maxLimits[item.key];
              
              return (
                <View key={item.key} style={activeStyles.rosterRow}>
                  <View style={activeStyles.rosterRowLeft}>
                    <Text style={activeStyles.rosterRowLabelMain}>
                      {item.label} ({item.short})
                    </Text>
                  </View>
                  
                  <View style={activeStyles.rosterRowRight}>
                    <Pressable
                      style={({ pressed }) => [
                        activeStyles.rosterAdjustBtn,
                        isMin && activeStyles.rosterAdjustBtnDisabled,
                        pressed && !isMin && activeStyles.btnPressed
                      ]}
                      onPress={() => {
                        triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                        onAdjustSlot(posKey, -1);
                      }}
                      disabled={isMin}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    >
                      <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                        <Path d="M5 12H19" stroke={isMin ? 'rgba(12, 12, 12, 0.2)' : '#0c0c0c'} strokeWidth={2.5} strokeLinecap="round" />
                      </Svg>
                    </Pressable>
                    
                    <View style={activeStyles.rosterValueContainer}>
                      <Text style={activeStyles.rosterValueText}>{count}</Text>
                    </View>
                    
                    <Pressable
                      style={({ pressed }) => [
                        activeStyles.rosterAdjustBtn,
                        isMax && activeStyles.rosterAdjustBtnDisabled,
                        pressed && !isMax && activeStyles.btnPressed
                      ]}
                      onPress={() => {
                        triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                        onAdjustSlot(posKey, 1);
                      }}
                      disabled={isMax}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    >
                      <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                        <Path d="M12 5V19M5 12H19" stroke={isMax ? 'rgba(12, 12, 12, 0.2)' : '#0c0c0c'} strokeWidth={2.5} strokeLinecap="round" />
                      </Svg>
                    </Pressable>
                  </View>
                </View>
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
          <View style={activeStyles.strategyDropdownPanel}>
            {(myRanks && myRanks.length > 0 
              ? (['ECR Consensus', 'Andy', 'Mike', 'Jason', 'My Ranks'] as const)
              : (['ECR Consensus', 'Andy', 'Mike', 'Jason'] as const)
            ).map((opt) => {
              const active = rankingsBase === opt;
              const displayLabel = opt === 'ECR Consensus' 
                ? 'ECR Consensus' 
                : opt === 'My Ranks' 
                  ? (myRanksName || 'Custom Board') 
                  : `${opt}'s Rankings`;
              return (
                <Pressable
                  key={opt}
                  style={[
                    activeStyles.strategyCard,
                    active && activeStyles.strategyCardActive
                  ]}
                  onPress={() => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                    setRankingsBase(opt);
                  }}
                >
                  <View style={activeStyles.strategyCardTextContainer}>
                    <Text style={[
                      activeStyles.strategyCardTitle,
                      active && activeStyles.strategyCardTitleActive
                    ]}>
                      {displayLabel}
                    </Text>
                  </View>
                  
                  {/* Easy Toggle On/Off Indicator */}
                  <View style={{
                    width: 36,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: active ? Colors.hofYellow : '#E2E8F0',
                    padding: 2,
                    justifyContent: 'center',
                    alignItems: active ? 'flex-end' : 'flex-start',
                  }}>
                    <View style={{
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: '#FFFFFF',
                      shadowColor: '#000000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.2,
                      shadowRadius: 1,
                      elevation: 2,
                    }} />
                  </View>
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
            <Text style={activeStyles.formValue}>
              {pickClock === 0 ? 'No Timer' : pickClock === 120 ? '2 Minutes' : `${pickClock} Seconds`}
            </Text>
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
          <View style={activeStyles.strategyDropdownPanel}>
            {([0, 30, 60, 120] as const).map((secs) => {
              const active = pickClock === secs;
              const label = secs === 0 ? 'No Timer' : secs === 120 ? '2 Minutes' : `${secs} Seconds`;
              return (
                <Pressable
                  key={secs}
                  style={[
                    activeStyles.strategyCard,
                    active && activeStyles.strategyCardActive
                  ]}
                  onPress={() => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                    setPickClock(secs);
                  }}
                >
                  <View style={activeStyles.strategyCardTextContainer}>
                    <Text style={[
                      activeStyles.strategyCardTitle,
                      active && activeStyles.strategyCardTitleActive
                    ]}>
                      {label}
                    </Text>
                  </View>
                  
                  {/* Easy Toggle On/Off Indicator */}
                  <View style={{
                    width: 36,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: active ? Colors.hofYellow : '#E2E8F0',
                    padding: 2,
                    justifyContent: 'center',
                    alignItems: active ? 'flex-end' : 'flex-start',
                  }}>
                    <View style={{
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: '#FFFFFF',
                      shadowColor: '#000000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.2,
                      shadowRadius: 1,
                      elevation: 2,
                    }} />
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>

      <View style={activeStyles.formDivider} />

      {/* Draft Year */}
      <View>
        <Pressable style={activeStyles.formRow} onPress={() => toggleExpanded('year')}>
          <View style={activeStyles.rowLeft}>
            <Text style={activeStyles.formLabel}>Draft Year</Text>
          </View>
          <View style={activeStyles.rowRight}>
            <Text style={activeStyles.formValue}>{year === 2026 ? '2026 (Current)' : year}</Text>
            <Svg 
              width={14} 
              height={14} 
              viewBox="0 0 24 24" 
              fill="none"
              style={{ transform: [{ rotate: expandedField === 'year' ? '90deg' : '0deg' }] }}
            >
              <Path d="M9 5L16 12L9 19" stroke="#94a3b8" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
        </Pressable>

        {expandedField === 'year' && (
          <View style={activeStyles.strategyDropdownPanel}>
            {([2026, 2025, 2024, 2023] as const).map((opt) => {
              const active = year === opt;
              const displayLabel = opt === 2026 ? '2026 (Current)' : String(opt);
              return (
                <Pressable
                  key={opt}
                  style={[
                    activeStyles.strategyCard,
                    active && activeStyles.strategyCardActive
                  ]}
                  onPress={() => {
                    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                    setYear(opt);
                  }}
                >
                  <View style={activeStyles.strategyCardTextContainer}>
                    <Text style={[
                      activeStyles.strategyCardTitle,
                      active && activeStyles.strategyCardTitleActive
                    ]}>
                      {displayLabel}
                    </Text>
                  </View>
                  
                  {/* Easy Toggle On/Off Indicator */}
                  <View style={{
                    width: 36,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: active ? Colors.hofYellow : '#E2E8F0',
                    padding: 2,
                    justifyContent: 'center',
                    alignItems: active ? 'flex-end' : 'flex-start',
                  }}>
                    <View style={{
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: '#FFFFFF',
                      shadowColor: '#000000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.2,
                      shadowRadius: 1,
                      elevation: 2,
                    }} />
                  </View>
                </Pressable>
              );
            })}
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
          <View style={activeStyles.strategyDropdownPanel}>
            {/* Rule 1: 6-Point Passing TDs */}
            <Pressable
              style={activeStyles.strategyCard}
              onPress={() => {
                triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                setPassingTdPoints(passingTdPoints === 6 ? 4 : 6);
              }}
            >
              <View style={activeStyles.strategyCardTextContainer}>
                <Text style={activeStyles.strategyCardTitle}>
                  6-Point Passing TDs
                </Text>
              </View>
              <View style={{
                width: 36,
                height: 20,
                borderRadius: 10,
                backgroundColor: passingTdPoints === 6 ? Colors.hofYellow : '#E2E8F0',
                padding: 2,
                justifyContent: 'center',
                alignItems: passingTdPoints === 6 ? 'flex-end' : 'flex-start',
              }}>
                <View style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: '#FFFFFF',
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1,
                  elevation: 2,
                }} />
              </View>
            </Pressable>

            {/* Rule 2: TE Premium (+0.5 PPR) */}
            <Pressable
              style={activeStyles.strategyCard}
              onPress={() => {
                triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                setTePremium(!tePremium);
              }}
            >
              <View style={activeStyles.strategyCardTextContainer}>
                <Text style={activeStyles.strategyCardTitle}>
                  TE Premium (+0.5 PPR)
                </Text>
              </View>
              <View style={{
                width: 36,
                height: 20,
                borderRadius: 10,
                backgroundColor: tePremium ? Colors.hofYellow : '#E2E8F0',
                padding: 2,
                justifyContent: 'center',
                alignItems: tePremium ? 'flex-end' : 'flex-start',
              }}>
                <View style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: '#FFFFFF',
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1,
                  elevation: 2,
                }} />
              </View>
            </Pressable>

            {/* Rule 3: Double FLEX Slots */}
            <Pressable
              style={activeStyles.strategyCard}
              onPress={() => {
                triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
                setFlexCount(flexCount === 2 ? 1 : 2);
              }}
            >
              <View style={activeStyles.strategyCardTextContainer}>
                <Text style={activeStyles.strategyCardTitle}>
                  Double FLEX Slots
                </Text>
              </View>
              <View style={{
                width: 36,
                height: 20,
                borderRadius: 10,
                backgroundColor: flexCount === 2 ? Colors.hofYellow : '#E2E8F0',
                padding: 2,
                justifyContent: 'center',
                alignItems: flexCount === 2 ? 'flex-end' : 'flex-start',
              }}>
                <View style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: '#FFFFFF',
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1,
                  elevation: 2,
                }} />
              </View>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const createStyles = (Colors: typeof import('@/constants/theme').LightColors) => {
  return StyleSheet.create({
    formCard: {
      backgroundColor: Colors.primaryAccent,
      borderColor: Colors.midGray,
      borderWidth: 1.5,
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
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
      color: Colors.obsidianBlack,
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
      color: Colors.obsidianBlack,
      fontWeight: 'bold',
    },
    formDivider: {
      height: 0,
    },
    strategyDropdownPanel: {
      backgroundColor: '#FFFFFF',
      paddingHorizontal: Spacing.three,
      paddingVertical: 6,
      gap: 2,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
    },
    strategyCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#FFFFFF',
      paddingVertical: 6,
      paddingHorizontal: 8,
    },
    strategyCardActive: {
      backgroundColor: '#FFFFFF',
    },
    strategyCardTextContainer: {
      flex: 1,
      paddingRight: 10,
    },
    strategyCardTitle: {
      fontFamily: Fonts.body,
      fontSize: 13,
      color: Colors.obsidianBlack,
      fontWeight: '500',
    },
    strategyCardTitleActive: {
      color: Colors.obsidianBlack,
    },
    rosterRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 6,
      paddingHorizontal: 8,
      backgroundColor: '#FFFFFF',
    },
    rosterRowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    rosterRowLabelMain: {
      fontFamily: Fonts.body,
      fontSize: 13,
      fontWeight: '500',
      color: Colors.obsidianBlack,
    },
    rosterRowRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    rosterAdjustBtn: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#F1F5F9',
      justifyContent: 'center',
      alignItems: 'center',
    },
    rosterAdjustBtnDisabled: {
      opacity: 0.25,
    },
    rosterValueContainer: {
      width: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rosterValueText: {
      fontFamily: Fonts.body,
      fontSize: 13,
      fontWeight: '500',
      color: Colors.obsidianBlack,
    },
    rosterPanelFooter: {
      fontFamily: Fonts.body,
      fontSize: 11,
      color: 'rgba(12, 12, 12, 0.5)',
      fontStyle: 'italic',
      marginTop: 4,
      paddingHorizontal: 8,
    },
    btnPressed: {
      opacity: 0.6,
    },
  });
};

const lightStyles = createStyles(require('@/constants/theme').LightColors);
const darkStyles = createStyles(require('@/constants/theme').DarkColors);
