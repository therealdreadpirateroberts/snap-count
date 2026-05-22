import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, Image, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDraftStore } from '@/store/useDraftStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useSimulationStore } from '@/store/useSimulationStore';
import { getTeamNameForIndex, getUserTeamName } from '@/store/_helpers';
import { getTeamLogoUrl } from '@/store/mockData';
import { Fonts, useColors } from '@/constants/theme';
import { useThemeStore } from '@/store/useThemeStore';
import BackgroundTexture from '@/components/BackgroundTexture';
import AppHeader from '@/components/AppHeader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import GradeCard from '@/components/GradeCard';
import RosterTable from '@/components/RosterTable';
import AILearningChart from '@/components/AILearningChart';
import StandingsTable from '@/components/StandingsTable';
import * as Haptics from 'expo-haptics';
import { summaryStyles as activeStyles } from './summary.styles';

// Helper to format player names cleanly to First Initial + Last Name
const getDisplayName = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1) {
    const suffixes = ['jr', 'sr', 'ii', 'iii', 'iv', 'v', 'jr.', 'sr.'];
    const lastPart = parts[parts.length - 1].toLowerCase();
    if (suffixes.includes(lastPart) && parts.length > 2) {
      return `${parts[0][0]}. ${parts[parts.length - 2]} ${parts[parts.length - 1]}`;
    }
    return `${parts[0][0]}. ${parts.slice(1).join(' ')}`;
  }
  return name;
};

// Map players to direct ESPN player IDs for premium headshots
const getPlayerHeadshotUrl = (espnId: number | null, position: string, team?: string) => {
  if (position === 'DST' && team) {
    return getTeamLogoUrl(team);
  }
  if (espnId) {
    return `https://a.espncdn.com/i/headshots/nfl/players/full/${espnId}.png`;
  }
  return `https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/default.png&w=350&h=254`;
};

const getGradeLetterFromPoints = (pts: number): string => {
  if (pts >= 11.5) return 'A+';
  if (pts >= 10.5) return 'A';
  if (pts >= 9.5) return 'A-';
  if (pts >= 8.5) return 'B+';
  if (pts >= 7.5) return 'B';
  if (pts >= 6.5) return 'B-';
  if (pts >= 5.5) return 'C+';
  if (pts >= 4.5) return 'C';
  if (pts >= 3.5) return 'C-';
  if (pts >= 2.5) return 'D+';
  if (pts >= 1.5) return 'D';
  return 'F';
};

const getGradePoints = (grade: string): number => {
  switch (grade) {
    case 'A+': return 12;
    case 'A': return 11;
    case 'A-': return 10;
    case 'B+': return 9;
    case 'B': return 8;
    case 'B-': return 7;
    case 'C+': return 6;
    case 'C': return 5;
    case 'C-': return 4;
    case 'D+': return 3;
    case 'D': return 2;
    default: return 0;
  }
};

function DraftSummaryScreen() {
  const Colors = useColors();
  const router = useRouter();
  
  const triggerHaptic = async (style = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(style);
      } catch (err) {
        console.warn('Haptics failed:', err);
      }
    }
  };

  const setup = useDraftStore((state) => state.setup);
  const resetDraft = useDraftStore((state) => state.resetDraft);
  const getDraftGrade = useDraftStore((state) => state.getDraftGrade);
  const getUserRoster = useDraftStore((state) => state.getUserRoster);
  const draftHistory = useDraftStore((state) => state.draftHistory);
  const historicalDrafts = useHistoryStore((state) => state.historicalDrafts || []);
  const botTrainingSims = useHistoryStore((state) => state.botTrainingSims || 0);
  
  const populateHistory = useHistoryStore((state) => state.populateHistory);
  const clearHistory = useHistoryStore((state) => state.clearHistory);

  const [activeTab, setActiveTab] = useState<'roster' | 'coach' | 'performance' | 'leaderboard' | 'board'>('roster');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);


  const runSimulationBatches = useCallback((totalCount: number) => {
    setIsSimulating(true);
    setSimProgress(0);
    let currentCount = 0;
    const batchSize = 250;
    const runBatch = () => {
      if (currentCount >= totalCount) {
        setIsSimulating(false);
        setSimProgress(100);
        return;
      }
      populateHistory(batchSize);
      currentCount += batchSize;
      setSimProgress(Math.min(100, Math.round((currentCount / totalCount) * 100)));
      setTimeout(runBatch, 16);
    };
    setTimeout(runBatch, 50);
  }, [populateHistory]);

  // Trigger auto prepopulate of 5,000 simulations if history is empty
  useEffect(() => {
    if (historicalDrafts.length === 0 && !isSimulating) {
      runSimulationBatches(5000);
    }
  }, [historicalDrafts.length, isSimulating, runSimulationBatches]);

  const roster = useMemo(() => {
    return getUserRoster();
  }, [getUserRoster]);

  const { grade, valueScore, playoffChance, projectedWins, projectedLosses } = useMemo(() => {
    return getDraftGrade();
  }, [getDraftGrade]);

  const handleRestart = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    resetDraft();
    router.replace('/wizard/setup');
  };

  const handleHome = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    resetDraft();
    router.replace('/');
  };

  // Helper to extract exact draft pick number for active draft
  const getUserPickNumber = (playerName: string) => {
    const pickObj = draftHistory.find(h => h.player.name === playerName);
    return pickObj ? pickObj.pickNumber : '-';
  };

  // Starters & bench count approximations for Expected Performance metrics
  const benchPlayers = useMemo(() => {
    const starterCount = 8 + (setup.flexCount ?? 1);
    return roster.slice(starterCount);
  }, [roster, setup.flexCount]);

  // Positional bye conflicts
  const positionByeCounts = useMemo(() => {
    const counts: { [pos: string]: { [bye: number]: number } } = {};
    roster.forEach(player => {
      const pos = player.position;
      const bye = player.bye;
      if (!counts[pos]) counts[pos] = {};
      counts[pos][bye] = (counts[pos][bye] || 0) + 1;
    });
    return counts;
  }, [roster]);

  const byeConflictCount = useMemo(() => {
    let conflicts = 0;
    Object.keys(positionByeCounts).forEach(pos => {
      Object.keys(positionByeCounts[pos]).forEach(bye => {
        if (positionByeCounts[pos][Number(bye)] >= 2) {
          conflicts++;
        }
      });
    });
    return conflicts;
  }, [positionByeCounts]);

  const getByeScore = () => {
    if (byeConflictCount === 0) return 100;
    if (byeConflictCount === 1) return 85;
    if (byeConflictCount === 2) return 65;
    return 45;
  };

  // DRAFT COACH STRATEGY INSIGHTS & ALTERATIONS
  const coachStrategyAnalysis = useMemo(() => {
    const selectedStrat = setup.userStrategy || 'Balanced';
    const firstFivePicks = draftHistory.filter(h => h.teamName === getUserTeamName() || h.teamName === 'Your Team').slice(0, 5);
    const firstFiveRBs = firstFivePicks.filter(p => p.player.position === 'RB');
    const qbPickedEarly = firstFivePicks.find(p => p.player.position === 'QB');
    const tePickedEarly = firstFivePicks.find(p => p.player.position === 'TE');

    let feedback = '';
    let success = false;
    let suggestions: string[] = [];

    if (selectedStrat === 'Zero RB') {
      const rbCount = firstFiveRBs.length;
      if (rbCount > 0) {
        success = false;
        feedback = `You declared a "Zero RB" draft strategy but drafted ${rbCount} RB(s) in your first 5 picks. This violates the Zero RB mandate.`;
        suggestions = [
          "Avoid any running backs in rounds 1 through 5, even if they slip past ADP.",
          "Target three high-ceiling starting WRs and an elite TE in the initial 4 rounds.",
          "Stack late-round RBs (Round 6+) who have high injury-contingent upside."
        ];
      } else {
        success = true;
        feedback = `Masterful Zero RB execution! You passed on early running backs entirely and drafted 0 RBs in the first 5 rounds. Secure WR volume.`;
        suggestions = [
          "Continue exploiting this strategy in high-volume passing environments.",
          "Keep an eye on premium backups during pre-season to grab handcuffs.",
          "Maintain a waiver-wire bias towards high-value backup running backs."
        ];
      }
    } else if (selectedStrat === 'Hero RB') {
      const rbCount = firstFiveRBs.length;
      const earlyRB = firstFivePicks.slice(0, 2).filter(p => p.player.position === 'RB').length;
      if (earlyRB === 1 && rbCount === 1) {
        success = true;
        feedback = `Perfect Hero RB execution! You drafted exactly one elite anchor RB in your first 2 picks, and zero RBs in rounds 3-5.`;
        suggestions = [
          "Look to fill your RB2 slot with a robust committee in rounds 7-10.",
          "Use your strong WR capital to dominate Flex slots and bye week coverages."
        ];
      } else if (earlyRB === 0) {
        success = false;
        feedback = `Hero RB strategy requires securing a single elite anchor RB in Round 1 or Round 2. Since you did not draft an RB early, your roster misses the foundation.`;
        suggestions = [
          "Lock in one Tier 1/2 running back inside the first 2 rounds.",
          "Strictly avoid drafting any additional RBs until Round 6 or 7.",
          "Hoard elite pass catchers once your anchor RB is secured."
        ];
      } else {
        success = false;
        feedback = `You selected Hero RB but hoarded ${rbCount} early running backs. Drafting multiple RBs in the first 5 rounds dilutes your ability to build WR depth.`;
        suggestions = [
          "Draft only ONE running back in your first 5 picks.",
          "Trust your single anchor RB to carry the load, and focus heavily on receivers.",
          "Add positional depth RBs much later (Rounds 8+)."
        ];
      }
    } else if (selectedStrat === 'Late QB/TE Focus') {
      if (qbPickedEarly || tePickedEarly) {
        success = false;
        const earlyPos = qbPickedEarly && tePickedEarly ? 'QB and TE' : qbPickedEarly ? 'QB' : 'TE';
        const earlyRound = qbPickedEarly ? qbPickedEarly.round : tePickedEarly?.round;
        feedback = `You declared a "Late QB/TE" strategy but reached for a ${earlyPos} in Round ${earlyRound}. Waiting on single-starter positions is crucial.`;
        suggestions = [
          "Strictly ignore quarterbacks and tight ends during the first 8 rounds.",
          "Value premium WR/RB depth over minor positional tier jumps at QB/TE.",
          "Target high-upside late-round dual-threat QBs in Round 9+."
        ];
      } else {
        success = true;
        feedback = `Disciplined execution of Late QB/TE! You avoided early single-starter selections, hoarding prime running backs and wide receivers instead.`;
        suggestions = [
          "Exploit late-round rushing QBs and athletic developmental tight ends.",
          "Stream matchups at QB/TE weekly to optimize positional efficiency."
        ];
      }
    } else {
      success = true;
      feedback = `Excellent Balanced draft! You navigated value boards efficiently, spreading capital across RBs and WRs. Roster is highly secure.`;
      suggestions = [
        "Let ECR and ADP value drops dictate your picks rather than forcing roster slots.",
        "Optimize starting grids based on weekly matchups rather than positional loyalty."
      ];
    }

    return { success, feedback, suggestions, selectedStrat };
  }, [setup.userStrategy, draftHistory, roster]);

  // EXPECTED PERFORMANCE GAME-BY-GAME & QUARTER-BY-QUARTER
  const performanceTelemetry = useMemo(() => {
    const avgScore = 100 + (valueScore * 0.8) + (grade === 'A+' ? 15 : grade === 'A' ? 10 : grade.startsWith('B') ? 5 : 0);
    const weeklyProjections = Array.from({ length: 14 }, (_, idx) => {
      const week = idx + 1;
      const seed = week * 17 + projectedWins;
      const randNoise = ((seed % 19) - 9) * 1.5;
      const median = Math.round(avgScore + randNoise);
      const floor = Math.round(median - 15 - (seed % 5));
      const ceiling = Math.round(median + 18 + (seed % 7));

      const oppAvg = 105 + ((seed % 13) - 6);
      const isWin = median > oppAvg;
      
      const botNames = ['Andy', 'Mike', 'Jason', 'Sarah', 'David', 'Jessica', 'Michael', 'Emily', 'James', 'Ashley', 'Robert'];
      const opponentName = botNames[(idx + setup.userPosition) % botNames.length];

      return {
        week,
        floor,
        median,
        ceiling,
        opponent: opponentName,
        isWin,
        oppScore: Math.round(oppAvg)
      };
    });

    const ptsScored = Number((avgScore * 14).toFixed(0));
    const ptsAllowed = Number((105 * 14 - valueScore * 5).toFixed(0));

    return {
      avgScore,
      weeklyProjections,
      ptsScored,
      ptsAllowed
    };
  }, [valueScore, grade, projectedWins, setup.userPosition]);

  // HISTORICAL STANDINGS LEADERBOARD REAL-TIME AGGREGATION
  const leaderboardData = useMemo(() => {
    const acc: { [name: string]: any } = {};
    const botNames = ['Andy', 'Mike', 'Jason', 'Sarah', 'David', 'Jessica', 'Michael', 'Emily', 'James', 'Ashley', 'Robert'];
    const userTeamName = getUserTeamName();
    
    acc[userTeamName] = {
      name: userTeamName,
      isHuman: true,
      strategyCamp: setup.userStrategy || 'Balanced',
      expertPreference: setup.rankingsBase || 'ECR Consensus',
      totalWins: 0,
      totalLosses: 0,
      playoffChanceSum: 0,
      playoffCount: 0,
      gradePointsSum: 0,
      draftCount: 0
    };

    botNames.forEach(name => {
      const profile = useSimulationStore.getState().botProfiles[name] || { strategyCamp: 'Balanced', expertPreference: 'ECR Consensus' };
      acc[name] = {
        name,
        isHuman: false,
        strategyCamp: profile.strategyCamp,
        expertPreference: profile.expertPreference,
        totalWins: 0,
        totalLosses: 0,
        playoffChanceSum: 0,
        playoffCount: 0,
        gradePointsSum: 0,
        draftCount: 0
      };
    });

    historicalDrafts.forEach(draft => {
      draft.teams.forEach(team => {
        const teamName = team.teamName;
        const key = (teamName === userTeamName || teamName === 'Your Team') ? userTeamName : teamName;
        
        if (!acc[key]) {
          acc[key] = {
            name: key,
            isHuman: key === userTeamName,
            strategyCamp: team.strategyCamp,
            expertPreference: team.expertPreference,
            totalWins: 0,
            totalLosses: 0,
            playoffChanceSum: 0,
            playoffCount: 0,
            gradePointsSum: 0,
            draftCount: 0
          };
        }

        acc[key].totalWins += team.wins;
        acc[key].totalLosses += team.losses;
        acc[key].playoffChanceSum += team.playoffChance;
        if (team.playoffChance >= 50) acc[key].playoffCount++;
        acc[key].gradePointsSum += getGradePoints(team.grade);
        acc[key].draftCount++;
      });
    });

    const rows = Object.values(acc).map(item => {
      const totalGames = item.totalWins + item.totalLosses;
      const winRate = totalGames > 0 ? (item.totalWins / totalGames) : 0;
      const avgPlayoff = item.draftCount > 0 ? (item.playoffChanceSum / item.draftCount) : 0;
      const avgGradePoints = item.draftCount > 0 ? (item.gradePointsSum / item.draftCount) : 8.0;
      const avgGrade = getGradeLetterFromPoints(avgGradePoints);

      return {
        ...item,
        winRate,
        avgPlayoff: Math.round(avgPlayoff),
        avgGrade
      };
    });

    return rows.sort((a, b) => b.winRate - a.winRate || b.avgPlayoff - a.avgPlayoff);
  }, [historicalDrafts, setup.userStrategy, setup.rankingsBase]);

  const handlePopulateSims = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
    runSimulationBatches(5000);
  };

  const handleClearHistory = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    }
    clearHistory();
  };



  return (
    <View style={activeStyles.container}>
      <BackgroundTexture />
      <SafeAreaView style={activeStyles.safeArea} edges={['top', 'bottom']}>
        
        <AppHeader
          title="DRAFT SCORECARD"
          subtitle="HIGH-FIDELITY ANALYTICS SUITE"
        />

        <GradeCard 
          grade={grade}
          projectedWins={projectedWins}
          projectedLosses={projectedLosses}
          playoffChance={playoffChance}
        />

        <View style={activeStyles.tabSwitcher}>
          {['roster', 'coach', 'performance', 'leaderboard', 'board'].map((tab) => (
            <Pressable 
              key={tab}
              style={[activeStyles.tabButton, activeTab === tab && activeStyles.tabButtonActive]}
              onPress={() => { setActiveTab(tab as any); triggerHaptic(Haptics.ImpactFeedbackStyle.Light); }}
            >
              <Text style={[activeStyles.tabButtonText, activeTab === tab && activeStyles.tabButtonTextActive]}>
                {tab.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>

        {isSimulating && (
          <View style={activeStyles.simulatingOverlay}>
            <ActivityIndicator size="large" color={Colors.hofYellow} />
            <Text style={activeStyles.simulatingText}>Training AI Bots... {simProgress}%</Text>
            <View style={activeStyles.overlayProgressBarBg}>
              <View style={[activeStyles.overlayProgressBarFill, { width: `${simProgress}%` }]} />
            </View>
            <Text style={{ fontFamily: Fonts.body, fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
              Simulating 5,000 leagues to optimize strategy weights
            </Text>
          </View>
        )}

        <ScrollView 
          contentContainerStyle={activeStyles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'roster' && (
            <RosterTable 
              roster={roster}
              setup={setup}
              draftHistory={draftHistory}
              userTeamName={getUserTeamName()}
            />
          )}

          {activeTab === 'coach' && (
            <View style={activeStyles.coachContainer}>
              <View style={activeStyles.coachBubble}>
                <Text style={activeStyles.coachTitle}>STRATEGY COACH FEEDBACK</Text>
                <Text style={[activeStyles.coachStatus, coachStrategyAnalysis.success ? activeStyles.coachSuccess : activeStyles.coachWarning]}>
                  {coachStrategyAnalysis.success ? '🏆 MASTERFUL EXECUTION' : '⚠️ STRATEGIC DEVIATION'}
                </Text>
                <Text style={activeStyles.coachFeedback}>{coachStrategyAnalysis.feedback}</Text>

                <Text style={activeStyles.coachSubHeader}>SUGGESTED STRATEGY ALTERATIONS:</Text>
                {coachStrategyAnalysis.suggestions.map((sug, i) => (
                  <Text key={i} style={activeStyles.coachSuggestionItem}>
                    • {sug}
                  </Text>
                ))}
              </View>

              <Text style={activeStyles.coachSectionTitle}>ROUND-BY-ROUND DRAFT VALUE</Text>
              <View style={activeStyles.valueList}>
                {draftHistory.filter(h => h.teamName === getUserTeamName() || h.teamName === 'Your Team').map((pick) => {
                  const val = pick.player.adp - pick.pickNumber;
                  const isSteal = val > 0;
                  const isReach = val < 0;

                  return (
                    <View key={pick.pickNumber} style={activeStyles.valueRow}>
                      <View style={activeStyles.valueRoundBadge}>
                        <Text style={activeStyles.valueRoundText}>RD {pick.round}</Text>
                        <Text style={activeStyles.valuePickText}>PK {pick.pickNumber}</Text>
                      </View>
                      
                      <Image 
                        source={{ uri: getPlayerHeadshotUrl(pick.player.espnId, pick.player.position, pick.player.team) }} 
                        style={activeStyles.valueHeadshot}
                      />

                      <View style={activeStyles.valueInfo}>
                        <Text style={activeStyles.valueName} numberOfLines={1}>{getDisplayName(pick.player.name)}</Text>
                        <Text style={activeStyles.valueMeta}>{pick.player.position} · {pick.player.team} · ECR #{pick.player.rank}</Text>
                      </View>

                      <View style={[
                        activeStyles.valBadge, 
                        isSteal && activeStyles.valSteal, 
                        isReach && activeStyles.valReach
                      ]}>
                        <Text style={[
                          activeStyles.valBadgeText, 
                          isSteal && activeStyles.valStealText, 
                          isReach && activeStyles.valReachText
                        ]}>
                          {val === 0 ? 'ON ADP' : val > 0 ? `+${val} VAL` : `${val} REACH`}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {activeTab === 'performance' && (
            <View style={activeStyles.perfContainer}>
              <View style={activeStyles.telemetryCard}>
                <Text style={activeStyles.telemetryCardTitle}>SEASON TELEMETRY REPORT</Text>
                <View style={activeStyles.telemetryStatsRow}>
                  <View style={activeStyles.telemetryStat}>
                    <Text style={activeStyles.telemetryStatLabel}>AVG WEEKLY SCORE</Text>
                    <Text style={activeStyles.telemetryStatVal}>{Math.round(performanceTelemetry.avgScore)}</Text>
                  </View>
                  <View style={activeStyles.telemetryStat}>
                    <Text style={activeStyles.telemetryStatLabel}>TOTAL POINTS FOR</Text>
                    <Text style={activeStyles.telemetryStatVal}>{performanceTelemetry.ptsScored}</Text>
                  </View>
                  <View style={activeStyles.telemetryStat}>
                    <Text style={activeStyles.telemetryStatLabel}>TOTAL POINTS AGAINST</Text>
                    <Text style={activeStyles.telemetryStatVal}>{performanceTelemetry.ptsAllowed}</Text>
                  </View>
                </View>
              </View>

              <View style={activeStyles.routineGrid}>
                <View style={[activeStyles.routineCard, { borderColor: '#22c55e33' }]}>
                  <Text style={activeStyles.routineHeading}>🌟 EXCELS ROUTINELY AT</Text>
                  <Text style={activeStyles.routineBullet}>• Positional bye-week optimization</Text>
                  <Text style={activeStyles.routineBullet}>
                    {valueScore >= 0 
                      ? '• Capturing premium ADP value slips' 
                      : '• Stacking high-efficiency starter floor'}
                  </Text>
                  <Text style={activeStyles.routineBullet}>• Drafting elite WR vertical weapons</Text>
                </View>

                <View style={[activeStyles.routineCard, { borderColor: '#ef444433' }]}>
                  <Text style={activeStyles.routineHeading}>⚠️ FAILS ROUTINELY AT</Text>
                  <Text style={activeStyles.routineBullet}>• Over-valuing secondary defense/kicker assets</Text>
                  <Text style={activeStyles.routineBullet}>
                    {byeConflictCount >= 2 
                      ? '• Tolerating bye-week roster lockouts' 
                      : '• Early round reached positional capitalization'}
                  </Text>
                  <Text style={activeStyles.routineBullet}>• Neglecting late-round backup QB insurance</Text>
                </View>
              </View>

              <Text style={activeStyles.perfSectionTitle}>PROJECTED MATCH PLAYOUTS (14 WEEKS)</Text>
              <View style={activeStyles.weeklyList}>
                {performanceTelemetry.weeklyProjections.map((match) => (
                  <View key={match.week} style={activeStyles.weeklyRow}>
                    <View style={activeStyles.weeklyRoundLabel}>
                      <Text style={activeStyles.weeklyRoundText}>WK {match.week}</Text>
                    </View>
                    
                    <View style={activeStyles.weeklyRangeContainer}>
                      <Text style={activeStyles.weeklyRangeLabelText}>VS {match.opponent.toUpperCase()}</Text>
                      <View style={activeStyles.rangeBarBg}>
                        <View style={[
                          activeStyles.rangeBarFill,
                          {
                            left: `${Math.max(0, (match.floor - 80) * 100 / 80)}%`,
                            width: `${Math.max(10, (match.ceiling - match.floor) * 100 / 80)}%`
                          }
                        ]} />
                        <View style={[
                          activeStyles.rangeDot,
                          { left: `${Math.max(0, (match.median - 80) * 100 / 80)}%` }
                        ]} />
                      </View>
                      <Text style={activeStyles.weeklyScoreDetail}>
                        Range: {match.floor} - {match.ceiling} pts · Median: {match.median} pts
                      </Text>
                    </View>

                    <View style={[activeStyles.matchOutcomeBadge, match.isWin ? activeStyles.matchWin : activeStyles.matchLoss]}>
                      <Text style={[activeStyles.matchOutcomeText, match.isWin ? activeStyles.matchWinText : activeStyles.matchLossText]}>
                        {match.isWin ? `W (${match.median}-${match.oppScore})` : `L (${match.median}-${match.oppScore})`}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              <Text style={activeStyles.perfSectionTitle}>QUARTER-BY-QUARTER TELEMETRY</Text>
              <View style={activeStyles.quarterGrid}>
                <View style={activeStyles.quarterCard}>
                  <Text style={activeStyles.quarterTitle}>Q1 (WEEKS 1-4)</Text>
                  <Text style={activeStyles.quarterSubtitle}>{"\"Early-Season Burst\""}</Text>
                  <Text style={activeStyles.quarterStat}>STRENGTH: ELITE (94%)</Text>
                  <Text style={activeStyles.quarterBody}>Your healthy starters carry extreme high-end ADP strength to capture massive early momentum.</Text>
                </View>

                <View style={activeStyles.quarterCard}>
                  <Text style={activeStyles.quarterTitle}>Q2 (WEEKS 5-8)</Text>
                  <Text style={activeStyles.quarterSubtitle}>{"\"Bye Week Navigation\""}</Text>
                  <Text style={activeStyles.quarterStat}>RATING: {getByeScore()}%</Text>
                  <Text style={activeStyles.quarterBody}>
                    {byeConflictCount >= 2 
                      ? 'Roster contains severe overlapping positional byes. Waiver-wire streams required.' 
                      : 'Excellent bye dispersion gives you an immense advantage during heavy bye weeks.'}
                  </Text>
                </View>

                <View style={activeStyles.quarterCard}>
                  <Text style={activeStyles.quarterTitle}>Q3 (WEEKS 9-12)</Text>
                  <Text style={activeStyles.quarterSubtitle}>{"\"Mid-Season Consolidation\""}</Text>
                  <Text style={activeStyles.quarterStat}>STRENGTH: STABLE (88%)</Text>
                  <Text style={activeStyles.quarterBody}>Projected starter metrics are locked in. Roster capital guarantees highly consistent double-digit outputs.</Text>
                </View>

                <View style={activeStyles.quarterCard}>
                  <Text style={activeStyles.quarterTitle}>Q4 (WEEKS 13-17)</Text>
                  <Text style={activeStyles.quarterSubtitle}>{"\"Late-Season Playoff Push\""}</Text>
                  <Text style={activeStyles.quarterStat}>
                    DEPTH: {benchPlayers.length >= 5 ? 'DEEP (92%)' : 'THIN (64%)'}
                  </Text>
                  <Text style={activeStyles.quarterBody}>
                    {benchPlayers.length >= 5
                      ? 'Your deep bench ensures you survive late-season attrition and locking playoff runs.'
                      : 'Roster is thin. A single starting injury severely risks late playoff competitiveness.'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'leaderboard' && (
            <View style={activeStyles.lobbyContainer}>
              <View style={activeStyles.aiPanel}>
                <Text style={activeStyles.aiPanelTitle}>🤖 BOT MANAGER AI COGNITIVE TELEMETRY</Text>
                
                <AILearningChart
                  botTrainingSims={botTrainingSims}
                  isSimulating={isSimulating}
                  simProgress={simProgress}
                />

                <Text style={activeStyles.aiProgressExplanation}>
                  {botTrainingSims >= 10000 
                    ? '🏆 Bots are fully trained! Selection noise is minimized and strategy weights are fully optimized.' 
                    : '⚡ Bots are currently training. Running simulations decreases decision noise and refines positional strategy parameters.'}
                </Text>

                <View style={activeStyles.aiActionRow}>
                  <Pressable style={activeStyles.aiActionBtn} onPress={handlePopulateSims}>
                    <Text style={activeStyles.aiActionBtnText}>SIMULATE 5,000 LEAGUES</Text>
                  </Pressable>
                  <Pressable style={[activeStyles.aiActionBtn, activeStyles.aiClearBtn]} onPress={handleClearHistory}>
                    <Text style={activeStyles.aiActionBtnTextClear}>RESET DATABASE</Text>
                  </Pressable>
                </View>
              </View>

              <Text style={activeStyles.lobbySectionTitle}>HISTORICAL STANDINGS LOBBY ({historicalDrafts.length.toLocaleString()} DRAFTS)</Text>
              
              <StandingsTable
                leaderboardData={leaderboardData}
                userTeamName={getUserTeamName()}
              />
            </View>
          )}

          {activeTab === 'board' && (
            <View style={activeStyles.boardSection}>
              <View style={activeStyles.boardHeaderCard}>
                <Text style={activeStyles.boardHeaderTitle}>FULL DRAFT BOARD</Text>
                <Text style={activeStyles.boardHeaderSub}>
                  Review the entire 15-round, pick-by-pick league selections. Swipe horizontally to see all teams.
                </Text>
              </View>

              <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
                <View style={activeStyles.boardGridContainer}>
                  <View style={activeStyles.boardRow}>
                    <View style={activeStyles.boardRoundHeaderCell}>
                      <Text style={activeStyles.boardRoundHeaderText}>ROUND</Text>
                    </View>
                    {Array.from({ length: setup.leagueSize }, (_, idx) => {
                      const name = getTeamNameForIndex(idx, setup.userPosition);
                      const isUser = name === getUserTeamName() || name === 'Your Team';
                      return (
                        <View 
                          key={idx} 
                          style={[
                            activeStyles.boardTeamHeaderCell, 
                            isUser && activeStyles.boardTeamHeaderCellUser
                          ]}
                        >
                          <Text style={[activeStyles.boardTeamHeaderText, isUser && activeStyles.boardTeamHeaderTextUser]} numberOfLines={1}>
                            {isUser ? 'YOUR TEAM' : name.toUpperCase()}
                          </Text>
                          <Text style={activeStyles.boardTeamSubText}>
                            Pick {idx + 1}
                          </Text>
                        </View>
                      );
                    })}
                  </View>

                  {Array.from({ length: setup.rounds || 15 }, (_, rIdx) => {
                    const roundNum = rIdx + 1;
                    return (
                      <View key={rIdx} style={activeStyles.boardRow}>
                        <View style={activeStyles.boardRoundCell}>
                          <Text style={activeStyles.boardRoundCellText}>RD {roundNum}</Text>
                        </View>

                        {Array.from({ length: setup.leagueSize }, (_, tIdx) => {
                          const pick = draftHistory.find(
                            h => h.round === roundNum && h.teamIndex === tIdx
                          );
                          const cellTeamName = getTeamNameForIndex(tIdx, setup.userPosition);
                          const isUser = cellTeamName === getUserTeamName() || cellTeamName === 'Your Team';

                          if (!pick) {
                            return (
                              <View key={tIdx} style={activeStyles.boardPlayerCellEmpty}>
                                <Text style={activeStyles.boardPlayerTextEmpty}>-</Text>
                              </View>
                            );
                          }

                          const player = pick.player;
                          const posColor = Colors.positions[player.position as keyof typeof Colors.positions] || '#94a3b8';

                          return (
                            <View 
                              key={tIdx} 
                              style={[
                                activeStyles.boardPlayerCell,
                                isUser && activeStyles.boardPlayerCellUser,
                                { borderLeftColor: posColor, borderLeftWidth: 4 }
                              ]}
                            >
                              <View style={activeStyles.boardCellTopRow}>
                                <View style={[activeStyles.boardCellPosBadge, { backgroundColor: posColor }]}>
                                  <Text style={activeStyles.boardCellPosText}>{player.position}</Text>
                                </View>
                                <Text style={activeStyles.boardCellPickNumber}>
                                  #{pick.pickNumber}
                                </Text>
                              </View>
                              <Text style={activeStyles.boardCellName} numberOfLines={1}>
                                {getDisplayName(player.name)}
                              </Text>
                              <Text style={activeStyles.boardCellMeta}>
                                {player.team || 'FA'} · Bye {player.bye || '-'}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          )}

          <View style={activeStyles.actionContainer}>
            <Pressable 
              style={({ pressed }) => [activeStyles.primaryBtn, pressed && activeStyles.btnPressed]} 
              onPress={handleRestart}
            >
              <Text style={activeStyles.primaryBtnText}>START NEW MOCK DRAFT</Text>
            </Pressable>

            <Pressable 
              style={({ pressed }) => [activeStyles.secondaryBtn, pressed && activeStyles.btnPressed]} 
              onPress={handleHome}
            >
              <Text style={activeStyles.secondaryBtnText}>EXIT TO LOBBY</Text>
            </Pressable>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

export default function SafeDraftSummaryScreen() {
  return (
    <ErrorBoundary>
      <DraftSummaryScreen />
    </ErrorBoundary>
  );
}