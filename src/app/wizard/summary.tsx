import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, Image, ActivityIndicator, Platform, Animated, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDraftStore } from '@/store/useDraftStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useSimulationStore } from '@/store/useSimulationStore';
import { getTeamNameForIndex, getUserTeamName } from '@/store/_helpers';
import { getTeamLogoUrl } from '@/store/mockData';
import { Fonts, useColors } from '@/constants/theme';
import { useThemeStore } from '@/store/useThemeStore';
import BackgroundTexture from '@/components/BackgroundTexture';
import AppHeader from '@/components/AppHeader';
import AppTabBar from '@/components/AppTabBar';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import GradeCard from '@/components/GradeCard';
import { PlayerHeadshot } from '@/components/PlayerHeadshot';
import { ProceduralTradingCard, resolvePlayerCard } from '@/components/ProceduralTradingCard';
import { PlayerCardData } from '@/types/tradingCard';
import { PLAYER_REGISTRY } from '@/store/playerRegistry';
import RosterTable from '@/components/RosterTable';
import * as Haptics from 'expo-haptics';
import Svg, { Path, Circle, G, Rect, Defs, Stop, LinearGradient } from 'react-native-svg';
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


const getGradeLetterFromPoints = (pts: number): string => {
  const rounded = Math.round(pts);
  const clamped = Math.max(1, Math.min(10, rounded));
  return String(clamped);
};

const getGradePoints = (grade: string): number => {
  const pts = parseInt(grade, 10);
  return isNaN(pts) ? 0 : pts;
};

function DraftSummaryScreen() {
  const Colors = useColors();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 1024;
  
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

  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);

  const [cardFlipped, setCardFlipped] = useState(false);
  const flipAnim = React.useRef(new Animated.Value(0)).current;

  const rotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const handleCardPress = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    const toValue = cardFlipped ? 0 : 1;
    
    Animated.spring(flipAnim, {
      toValue,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Toggle content exactly halfway through the rotation animation
    setTimeout(() => {
      setCardFlipped(!cardFlipped);
    }, 120);
  };


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
    const gradeVal = parseInt(grade, 10);
    const gradeBonus = gradeVal >= 10 ? 15 : gradeVal === 9 ? 10 : gradeVal >= 7 ? 5 : 0;
    const avgScore = 100 + (valueScore * 0.8) + gradeBonus;
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

  // Build reactive DraftRecap for the completed draft
  const currentRecap = useMemo(() => {
    if (roster.length === 0) return null;
    
    // Map Roster to PickInfo
    const mappedRoster = roster.map((p, idx) => {
      const pickNum = getUserPickNumber(p.name);
      const round = ((p as any).round !== undefined && (p as any).round !== null)
        ? (p as any).round
        : Math.ceil((typeof pickNum === 'number' ? pickNum : 1) / setup.leagueSize);
      return {
        name: p.name,
        position: p.position,
        team: p.team || 'FA',
        image: p.espnId ? `https://a.espncdn.com/i/headshots/nfl/players/full/${p.espnId}.png` : '',
        pick: pickNum,
        round
      };
    });

    const topPicks = mappedRoster.slice(0, 3);
    const projectedPPG = Math.round(performanceTelemetry.avgScore);
    const byeRank = Math.max(1, Math.min(12, 12 - projectedWins + 3));
    
    return {
      id: 'active_completion',
      grade: grade,
      efficiency: `${Math.min(99.9, Math.max(70.0, 90.0 + valueScore * 1.5)).toFixed(1)}%`,
      projectedRecord: `${projectedWins}-${projectedLosses}`,
      topPicks,
      roster: mappedRoster,
      pointsPerGame: `${projectedPPG} PPG`,
      byeWeekStrength: `Rank: #${byeRank}`,
      syncId: `MX-${Math.floor(projectedWins * 10 || 90)}-${roster[0]?.name.slice(0, 2).toUpperCase() || 'MM'}`,
    };
  }, [roster, grade, valueScore, projectedWins, projectedLosses, performanceTelemetry.avgScore, setup.leagueSize]);

  const getPsaGrade = (rank: number) => {
    if (rank <= 5) return { num: '10', desc: 'GEM MT' };
    if (rank <= 15) return { num: '9', desc: 'MINT' };
    if (rank <= 30) return { num: '8', desc: 'NM-MT' };
    if (rank <= 50) return { num: '7', desc: 'NM' };
    if (rank <= 80) return { num: '6', desc: 'EX-MT' };
    if (rank <= 110) return { num: '5', desc: 'EX' };
    return { num: '4', desc: 'VG-EX' };
  };

  const getPlayerDetails = (name: string, position?: string): {
    rank: number;
    adp: number;
    projectedPoints: number;
    bye: number;
    posRank: string;
  } => {
    const storePlayers = usePlayerStore.getState().players || [];
    const cleanName = name.toLowerCase().trim();
    const storeMatch = storePlayers.find((p: any) => p.name.toLowerCase().trim() === cleanName);
    if (storeMatch) {
      return {
        rank: storeMatch.rank,
        adp: storeMatch.adp,
        projectedPoints: storeMatch.projectedPoints,
        bye: storeMatch.bye,
        posRank: storeMatch.posRank,
      };
    }

    let baseRank = 150;
    let baseAdp = 150;
    let basePoints = 120;
    let baseBye = 6;
    let basePosRank = `${position || 'WR'}12`;

    const regPlayer = PLAYER_REGISTRY.find(p => p.name.toLowerCase().trim() === cleanName);
    const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    if (regPlayer) {
      baseBye = (nameHash % 9) + 4;
      if (regPlayer.position === 'QB') {
        baseRank = (nameHash % 20) + 1;
        baseAdp = baseRank * 4 + 10;
        basePoints = 320 - baseRank * 4;
        basePosRank = `QB${baseRank}`;
      } else if (regPlayer.position === 'RB') {
        baseRank = (nameHash % 40) + 1;
        baseAdp = baseRank * 2.5 + 5;
        basePoints = 240 - baseRank * 2.5;
        basePosRank = `RB${baseRank}`;
      } else if (regPlayer.position === 'WR') {
        baseRank = (nameHash % 50) + 1;
        baseAdp = baseRank * 2.2 + 5;
        basePoints = 230 - baseRank * 2.0;
        basePosRank = `WR${baseRank}`;
      } else if (regPlayer.position === 'TE') {
        baseRank = (nameHash % 25) + 1;
        baseAdp = baseRank * 4 + 20;
        basePoints = 180 - baseRank * 3;
        basePosRank = `TE${baseRank}`;
      } else {
        baseRank = (nameHash % 30) + 120;
        baseAdp = baseRank + 5;
        basePoints = 110 - (baseRank - 120);
        basePosRank = `${regPlayer.position}${baseRank - 120 + 1}`;
      }
    } else {
      baseBye = (nameHash % 9) + 4;
      baseRank = (nameHash % 200) + 1;
      baseAdp = baseRank + (nameHash % 10);
      basePoints = 200 - (baseRank * 0.5);
    }

    return {
      rank: baseRank,
      adp: Number(baseAdp.toFixed(1)),
      projectedPoints: Number(basePoints.toFixed(1)),
      bye: baseBye,
      posRank: basePosRank,
    };
  };

  const getPlayerStatsForHeader = (position: string, projectedPoints: number) => {
    const pts = projectedPoints || 0;
    const ppg = (pts / 17).toFixed(1);
    let yards = 0;
    let touchdowns = 0;

    if (position === 'QB') {
      yards = Math.round(pts * 12.5);
      touchdowns = Math.round(pts * 0.085);
    } else if (position === 'RB') {
      yards = Math.round(pts * 4.2 + 200);
      touchdowns = Math.round(pts * 0.038);
    } else if (position === 'WR') {
      yards = Math.round(pts * 4.5 + 100);
      touchdowns = Math.round(pts * 0.032);
    } else if (position === 'TE') {
      yards = Math.round(pts * 4.8);
      touchdowns = Math.round(pts * 0.042);
    } else {
      yards = Math.round(pts);
      touchdowns = 0;
    }

    return {
      ppg: `${ppg}`,
      yards: yards.toLocaleString(),
      tds: `${touchdowns}`
    };
  };

  const renderPsaLabel = (recap: any, player: any) => {
    const { style, variant } = resolvePlayerCard(String(recap.id || player.name));
    const year = setup.year || 2026;
    const details = getPlayerDetails(player.name, player.position);
    const headerStats = getPlayerStatsForHeader(player.position, details.projectedPoints);
    const psaGrade = getPsaGrade(details.rank);

    return (
      <View style={activeStyles.psaLabelContainer}>
        <View style={activeStyles.psaTwoColumnLayout}>
          {/* LEFT COLUMN */}
          <View style={activeStyles.psaLeftColumn}>
            {/* Band 1 - Year tag */}
            <Text style={activeStyles.psaYearTag} numberOfLines={1}>
              {`${year} ${style.name.toUpperCase()} ${variant.name.toUpperCase()}`}
            </Text>
            {/* Band 2 - Player name */}
            <Text style={activeStyles.psaPlayerName} numberOfLines={1}>
              {player.name.toUpperCase()}
            </Text>
            {/* Band 3 - Player meta row */}
            <Text style={activeStyles.psaMetaRow} numberOfLines={1}>
              {`${player.team} · ${details.posRank} · BYE ${details.bye}`}
            </Text>
            {/* Band 4 - Stat row */}
            <View style={activeStyles.psaStatRow}>
              <View style={activeStyles.psaStatCell}>
                <Text style={activeStyles.psaStatLabel}>PPG</Text>
                <Text style={activeStyles.psaStatValue}>{headerStats.ppg}</Text>
              </View>
              <View style={activeStyles.psaStatCell}>
                <Text style={activeStyles.psaStatLabel}>YARDS</Text>
                <Text style={activeStyles.psaStatValue}>{headerStats.yards}</Text>
              </View>
              <View style={activeStyles.psaStatCell}>
                <Text style={activeStyles.psaStatLabel}>TDS</Text>
                <Text style={activeStyles.psaStatValue}>{headerStats.tds}</Text>
              </View>
            </View>
          </View>

          {/* RIGHT COLUMN VERTICAL STACK */}
          <View style={activeStyles.psaRightColumn}>
            {/* Stack Item 1 - ECR Score */}
            <View style={activeStyles.psaEcrBox}>
              <Text style={activeStyles.psaRightLabel}>ECR</Text>
              <Text style={activeStyles.psaRightValue}>{details.rank}</Text>
            </View>
            {/* Stack Item 2 - ADP Score (Yellow Highlight) */}
            <View style={activeStyles.psaAdpBox}>
              <Text style={activeStyles.psaAdpLabel}>ADP</Text>
              <Text style={activeStyles.psaAdpValue}>{details.adp}</Text>
            </View>
            {/* Stack Item 3 - PSA Grade */}
            <View style={activeStyles.psaGradeBox}>
              <Text style={activeStyles.psaGradeLabel}>{psaGrade.desc}</Text>
              <Text style={activeStyles.psaGradeValue}>{psaGrade.num}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const getCardTemplate = (name: string) => {
    const templates = ['chrome', 'rpa', 'kaboom', 'downtown'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash += name.charCodeAt(i);
    }
    return templates[hash % templates.length];
  };

  const renderToppsChromeCard = (recap: any, player: any) => {
    const teamColors: Record<string, string[]> = {
      SF: ['#AA0000', '#B3995D'],
      LV: ['#000000', '#A6AEB5'],
      KC: ['#E31837', '#FFB81C'],
      DAL: ['#869397', '#002244'],
      LAR: ['#003594', '#FFA300'],
      DET: ['#0076B6', '#B0B7BC'],
      NYJ: ['#125740', '#FFFFFF'],
      ATL: ['#A71930', '#000000'],
      BUF: ['#00338D', '#C60C30'],
      GB: ['#203731', '#FFB612'],
    };

    const colors = teamColors[player.team] || ['#64748b', '#475569', '#FFCD00'];

    const cardData: PlayerCardData = {
      id: String(recap.id || player.name),
      name: player.name,
      position: player.position as any,
      team: player.team,
      teamColors: colors,
      stats: {
        'GRADE': recap.grade,
        'EFFICIENCY': recap.efficiency,
        'PGM': recap.pointsPerGame,
        'RECORD': recap.projectedRecord
      },
      imageUrl: player.image || undefined,
      is_rookie: player.is_rookie,
    };

    return (
      <ProceduralTradingCard player={cardData} width={240} />
    );
  };

  const renderExpandedBackCardContent = (recap: any) => {
    const detail = coachStrategyAnalysis;

    // Generate PSA text
    const psaGradeNum = recap.grade;
    let psaGradeText = 'GEM MT';
    switch (psaGradeNum) {
      case '10': psaGradeText = 'GEM MT'; break;
      case '9': psaGradeText = 'MINT'; break;
      case '8': psaGradeText = 'NM-MT'; break;
      case '7': psaGradeText = 'NM'; break;
      case '6': psaGradeText = 'EX-MT'; break;
      case '5': psaGradeText = 'EX'; break;
      case '4': psaGradeText = 'VG-EX'; break;
      case '3': psaGradeText = 'VG'; break;
      case '2': psaGradeText = 'GOOD'; break;
      case '1': psaGradeText = 'POOR'; break;
      default: psaGradeText = 'MINT'; break;
    }

    return (
      <View style={activeStyles.expandedBackContainer}>
        {/* Premium PSA Label Header */}
        <View style={activeStyles.expandedPsaHeader}>
          <View style={activeStyles.expandedPsaHeaderContent}>
            <View style={activeStyles.expandedPsaHeaderLeft}>
              <Text style={activeStyles.expandedPsaHeaderKicker} numberOfLines={1}>2025 MOCK MAXXING CHROME</Text>
              <Text style={activeStyles.expandedPsaHeaderTitle} numberOfLines={1}>DRAFT ROSTER AUDIT</Text>
              <Text style={activeStyles.expandedPsaHeaderMeta} numberOfLines={1}>
                REC: {recap.projectedRecord} • {recap.pointsPerGame}
              </Text>
            </View>
            <View style={activeStyles.expandedPsaHeaderRight}>
              <Text style={activeStyles.expandedPsaHeaderGradeDesc} numberOfLines={1}>{psaGradeText}</Text>
              <Text style={activeStyles.expandedPsaHeaderGradeNum}>{psaGradeNum}</Text>
            </View>
          </View>
          <View style={activeStyles.expandedPsaBarcodeRow}>
            <Text style={activeStyles.expandedPsaBarcode}>||||| | |||| | ||||| | ||| ||</Text>
            <Text style={activeStyles.expandedPsaSerial}>#{recap.syncId}</Text>
          </View>
        </View>

        {/* Scrollable Content inside the Slab backing */}
        <ScrollView 
          style={activeStyles.expandedScrollArea} 
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {/* Section 1: The Selected Roster */}
          <View style={activeStyles.expandedSection}>
            <Text style={activeStyles.expandedSectionTitle}>PICKED ROSTER (15 ROUNDS)</Text>
            <View style={activeStyles.rosterListContainer}>
              {recap.roster.map((player: any, idx: number) => {
                const roundText = `RD ${player.round}`;
                return (
                  <View key={idx} style={activeStyles.rosterRowItem}>
                    <View style={activeStyles.rosterRowLeft}>
                      <View style={activeStyles.rosterRoundPill}>
                        <Text style={activeStyles.rosterRoundText}>{roundText}</Text>
                      </View>
                      <View style={activeStyles.rosterPlayerInfo}>
                        <Text style={activeStyles.rosterPlayerName} numberOfLines={1}>
                          {player.name}
                        </Text>
                        <Text style={activeStyles.rosterPlayerTeamPos}>
                          {player.position} • {player.team}
                        </Text>
                      </View>
                    </View>
                    <View style={activeStyles.rosterRowRight}>
                      <Text style={activeStyles.rosterPickText}>{player.pick}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Section 2: Coaching Telemetry Report */}
          <View style={activeStyles.expandedSection}>
            <Text style={activeStyles.expandedSectionTitle}>COACHING TELEMETRY</Text>
            <View style={activeStyles.expandedInsightsCard}>
              <Text style={activeStyles.expandedInsightsText}>
                {detail.feedback}
              </Text>
            </View>
          </View>

          {/* Section 3: Rarity/Efficiency Metrics */}
          <View style={activeStyles.expandedSection}>
            <Text style={activeStyles.expandedSectionTitle}>METRIC TELEMETRY</Text>
            <View style={activeStyles.expandedTelemetryRow}>
              <View style={activeStyles.expandedTelemetryBox}>
                <Text style={activeStyles.expandedTelemetryVal}>{recap.efficiency}</Text>
                <Text style={activeStyles.expandedTelemetryLbl}>DRAFT EFFICIENCY</Text>
              </View>
              <View style={activeStyles.expandedTelemetryBox}>
                <Text style={activeStyles.expandedTelemetryVal}>
                  #{byeConflictCount === 0 ? 1 : byeConflictCount === 1 ? 3 : 5}
                </Text>
                <Text style={activeStyles.expandedTelemetryLbl}>BYE WEEK RANK</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Return CTA */}
        <Pressable 
          style={({ pressed }) => [
            activeStyles.expandedCloseFlipBtn,
            pressed && activeStyles.expandedCloseFlipBtnPressed
          ]} 
          onPress={handleCardPress}
        >
          <Text style={activeStyles.expandedCloseFlipBtnText}>TAP TO FLIP BACK</Text>
        </Pressable>
      </View>
    );
  };

  const renderPsaSlabComponent = () => {
    if (!currentRecap) return null;
    const player = currentRecap.topPicks[0];
    if (!player) return null;

    return (
      <View style={activeStyles.cardContainer}>
        <Pressable 
          onPress={handleCardPress}
          style={({ pressed }) => [
            activeStyles.cardPressableArea,
            pressed && activeStyles.cardPressableAreaPressed
          ]}
        >
          <Animated.View style={[
            { flex: 1 },
            { transform: [{ rotateY }] }
          ]}>
            {cardFlipped ? (
              <View style={[activeStyles.maximizedCardBack, { transform: [{ rotateY: '180deg' }] }]}>
                {renderExpandedBackCardContent(currentRecap)}
              </View>
            ) : (
              <View style={activeStyles.maximizedCardFront}>
                {renderPsaLabel(currentRecap, player)}
                {renderToppsChromeCard(currentRecap, player)}
                
                {/* Full-Slab Glossy Reflection Overlay representing a protective shiny acrylic shell */}
                <View style={activeStyles.slabGlossOverlay} pointerEvents="none">
                  <Svg style={StyleSheet.absoluteFillObject} width="100%" height="100%">
                    <Defs>
                      <LinearGradient id={`summarySlabGloss`} x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0%" stopColor="rgba(255,255,255,0)" />
                        <Stop offset="25%" stopColor="rgba(255,255,255,0)" />
                        <Stop offset="38%" stopColor="rgba(255,255,255,0.18)" />
                        <Stop offset="42%" stopColor="rgba(255,255,255,0.30)" />
                        <Stop offset="46%" stopColor="rgba(255,255,255,0.18)" />
                        <Stop offset="58%" stopColor="rgba(255,255,255,0)" />
                        <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
                      </LinearGradient>
                    </Defs>
                    <Rect width="100%" height="100%" fill={`url(#summarySlabGloss)`} />
                  </Svg>
                </View>
              </View>
            )}
          </Animated.View>
        </Pressable>
      </View>
    );
  };



  return (
    <View style={activeStyles.container}>
      <BackgroundTexture />
      <SafeAreaView style={activeStyles.safeArea} edges={['top', 'bottom']}>
        
        <AppHeader
          title="DRAFT SCORECARD"
          subtitle="HIGH-FIDELITY ANALYTICS SUITE"
          showBack={true}
          backText="HOME"
          backAction={handleHome}
        />

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 20, paddingBottom: 96 }}>
          {renderPsaSlabComponent()}
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

        {!isDesktop && <AppTabBar visible={true} />}
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