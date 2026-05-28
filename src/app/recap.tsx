import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Platform, Image, NativeSyntheticEvent, NativeScrollEvent, Animated, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColors, Fonts, Spacing, MaxContentWidth } from '@/constants/theme';
import { useThemeStore } from '@/store/useThemeStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import BackgroundTexture from '@/components/BackgroundTexture';
import AppHeader from '@/components/AppHeader';
import AppTabBar from '@/components/AppTabBar';
import * as Haptics from 'expo-haptics';
import Svg, { Path, Circle, G, Rect, Defs, RadialGradient, Stop, LinearGradient } from 'react-native-svg';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PlayerHeadshot } from '@/components/PlayerHeadshot';
import { ProceduralTradingCard, resolvePlayerCard } from '@/components/ProceduralTradingCard';
import { PlayerCardData } from '@/types/tradingCard';
import { useDraftStore } from '@/store/useDraftStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { PLAYER_REGISTRY } from '@/store/playerRegistry';

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
  roster: PickInfo[]; // Full 15 picks
  pointsPerGame: string;
  byeWeekStrength: string;
  syncId: string;
}

interface StatsDetail {
  valuePicks: string[];
  reachPicks: string[];
  rosterBalance: { position: string; grade: string }[];
  coachingNotes: string;
}

const statsDetails: Record<string, StatsDetail> = {
  '1': {
    valuePicks: ['Travis Kelce (+4.2 vs ADP)', 'Davante Adams (+1.8 vs ADP)'],
    reachPicks: ['None (Optimal Choice Value)'],
    rosterBalance: [
      { position: 'QB', grade: '10' },
      { position: 'RB', grade: '10' },
      { position: 'WR', grade: '10' },
      { position: 'TE', grade: '10' },
    ],
    coachingNotes: 'Absolute masterclass. Executed a Zero-RB anchor build with CMC at 1.01, stacking Davante Adams and Travis Kelce for historic offensive output. Analytical models project a 98% playoff probability.',
  },
  '2': {
    valuePicks: ['Kyren Williams (+2.1 vs ADP)', 'Sam LaPorta (+1.5 vs ADP)'],
    reachPicks: ['CeeDee Lamb (-0.8 vs ADP)'],
    rosterBalance: [
      { position: 'QB', grade: '8' },
      { position: 'RB', grade: '10' },
      { position: 'WR', grade: '10' },
      { position: 'TE', grade: '10' },
    ],
    coachingNotes: 'Robust Hero-RB strategy with Lamb and Kyren Williams. Sam LaPorta provides elite TE value. High consistency build, though bye-week coordination is tight.',
  },
  '3': {
    valuePicks: ['Drake London (+1.9 vs ADP)'],
    reachPicks: ['Josh Allen (-1.2 vs ADP)'],
    rosterBalance: [
      { position: 'QB', grade: '10' },
      { position: 'RB', grade: '10' },
      { position: 'WR', grade: '10' },
      { position: 'TE', grade: '7' },
    ],
    coachingNotes: 'Balanced draft execution. Secured high-floor volume with Breece Hall, backed by Allen\'s elite dual-threat QB production. Excellent WR value in London.',
  },
  '4': {
    valuePicks: ['Josh Jacobs (+2.5 vs ADP)'],
    reachPicks: ['Patrick Mahomes (-2.1 vs ADP)'],
    rosterBalance: [
      { position: 'QB', grade: '10' },
      { position: 'RB', grade: '7' },
      { position: 'WR', grade: '10' },
      { position: 'TE', grade: '6' },
    ],
    coachingNotes: 'Aggressive WR-first draft. Stacking St. Brown and Mahomes gives you an elite weekly ceiling. RB depth is a concern but weekly variance is highly favorable.',
  },
};

function RecapContent() {
  const router = useRouter();
  const Colors = useColors();
  const { theme } = useThemeStore();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const [showBackCardId, setShowBackCardId] = useState<string | null>(null);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [expandedFlipped, setExpandedFlipped] = useState(false);
  const expandedFlipAnim = useRef(new Animated.Value(0)).current;
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const rotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const expandedRotateY = expandedFlipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const handleCardPress = (id: string) => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    setExpandedCardId(id);
    setExpandedFlipped(false);
    expandedFlipAnim.setValue(0);
  };

  const handleExpandedCardFlip = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    const toValue = expandedFlipped ? 0 : 1;
    
    Animated.spring(expandedFlipAnim, {
      toValue,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Toggle content exactly halfway through the rotation animation
    setTimeout(() => {
      setExpandedFlipped(!expandedFlipped);
    }, 120);
  };

  const handleCloseExpandedCard = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
    Animated.timing(expandedFlipAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setExpandedFlipped(false);
      setExpandedCardId(null);
    });
  };

  const historicalDrafts = useHistoryStore(state => state.historicalDrafts || []);

  const draftRecaps = React.useMemo(() => {
    // 1. Map user completed manual drafts from history
    const userRecaps: DraftRecap[] = historicalDrafts
      .filter(draft => draft.isManual)
      .map(draft => {
        const userTeam = draft.teams.find(t => t.teamIndex === draft.userPosition - 1);
        const userRoster = userTeam ? userTeam.roster : [];
        const sortedUserRoster = [...userRoster].sort((a, b) => (a.round || 1) - (b.round || 1));
        
        const topPicks = sortedUserRoster.slice(0, 3).map(p => ({
          name: p.name,
          position: p.position,
          team: p.team || 'FA',
          image: p.espnId ? `https://a.espncdn.com/i/headshots/nfl/players/full/${p.espnId}.png` : '',
          pick: p.pick || '1.01',
          round: p.round || 1
        }));

        const roster = sortedUserRoster.map(p => ({
          name: p.name,
          position: p.position,
          team: p.team || 'FA',
          image: p.espnId ? `https://a.espncdn.com/i/headshots/nfl/players/full/${p.espnId}.png` : '',
          pick: p.pick || '1.01',
          round: p.round || 1
        }));

        const projectedPPG = (100 + (draft.valueScore || 0) * 0.8 + parseInt(draft.grade || '8', 10) * 1.5).toFixed(1);
        const byeRank = Math.max(1, Math.min(12, 12 - draft.projectedWins + 3));

        return {
          id: draft.id,
          grade: draft.grade,
          efficiency: `${Math.min(99.9, Math.max(70.0, 90.0 + draft.valueScore * 1.5)).toFixed(1)}%`,
          projectedRecord: `${draft.projectedWins}-${draft.projectedLosses}`,
          topPicks,
          roster,
          pointsPerGame: `${projectedPPG} PPG`,
          byeWeekStrength: `Rank: #${byeRank}`,
          syncId: `MX-${Math.floor(draft.projectedWins * 10 || 90)}-${userRoster[0]?.name.slice(0, 2).toUpperCase() || 'MM'}${draft.userPosition || 1}`,
        };
      });

    // 2. Static starter badges
    const staticRecaps: DraftRecap[] = [
      {
        id: '1',
        grade: '10',
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
        roster: [
          { name: 'Christian McCaffrey', position: 'RB', team: 'SF', image: '', pick: '1.01', round: 1 },
          { name: 'Davante Adams', position: 'WR', team: 'LV', image: '', pick: '2.12', round: 2 },
          { name: 'Travis Kelce', position: 'TE', team: 'KC', image: '', pick: '3.01', round: 3 },
          { name: 'Stefon Diggs', position: 'WR', team: 'HOU', image: '', pick: '4.12', round: 4 },
          { name: 'Lamar Jackson', position: 'QB', team: 'BAL', image: '', pick: '5.01', round: 5 },
          { name: 'Zamir White', position: 'RB', team: 'LV', image: '', pick: '6.12', round: 6 },
          { name: 'Jaylen Warren', position: 'RB', team: 'PIT', image: '', pick: '7.01', round: 7 },
          { name: 'Jaxon Smith-Njigba', position: 'WR', team: 'SEA', image: '', pick: '8.12', round: 8 },
          { name: 'Brian Robinson Jr.', position: 'RB', team: 'WAS', image: '', pick: '9.01', round: 9 },
          { name: 'Jordan Love', position: 'QB', team: 'GB', image: '', pick: '10.12', round: 10 },
          { name: 'Rashid Shaheed', position: 'WR', team: 'NO', image: '', pick: '11.01', round: 11 },
          { name: 'T.J. Hockenson', position: 'TE', team: 'MIN', image: '', pick: '12.12', round: 12 },
          { name: 'Harrison Butker', position: 'K', team: 'KC', image: '', pick: '13.01', round: 13 },
          { name: 'Jets Defense', position: 'DST', team: 'NYJ', image: '', pick: '14.12', round: 14 },
          { name: 'Chuba Hubbard', position: 'RB', team: 'CAR', image: '', pick: '15.01', round: 15 },
        ],
        pointsPerGame: '128.4 PPG',
        byeWeekStrength: 'Rank: #1',
        syncId: 'MX-986-CM31',
      },
      {
        id: '2',
        grade: '9',
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
        roster: [
          { name: 'CeeDee Lamb', position: 'WR', team: 'DAL', image: '', pick: '1.04', round: 1 },
          { name: 'Kyren Williams', position: 'RB', team: 'LAR', image: '', pick: '2.09', round: 2 },
          { name: 'Sam LaPorta', position: 'TE', team: 'DET', image: '', pick: '3.04', round: 3 },
          { name: 'Cooper Kupp', position: 'WR', team: 'LAR', image: '', pick: '4.09', round: 4 },
          { name: 'Joe Burrow', position: 'QB', team: 'CIN', image: '', pick: '5.04', round: 5 },
          { name: 'Kenneth Walker III', position: 'RB', team: 'SEA', image: '', pick: '6.09', round: 6 },
          { name: 'Rashee Rice', position: 'WR', team: 'KC', image: '', pick: '7.04', round: 7 },
          { name: 'Dallas Goedert', position: 'TE', team: 'PHI', image: '', pick: '8.09', round: 8 },
          { name: 'Devin Singletary', position: 'RB', team: 'NYG', image: '', pick: '9.04', round: 9 },
          { name: 'Jameson Williams', position: 'WR', team: 'DET', image: '', pick: '10.09', round: 10 },
          { name: 'Kirk Cousins', position: 'QB', team: 'ATL', image: '', pick: '11.04', round: 11 },
          { name: 'Tyler Bass', position: 'K', team: 'BUF', image: '', pick: '12.09', round: 12 },
          { name: 'Browns Defense', position: 'DST', team: 'CLE', image: '', pick: '13.04', round: 13 },
          { name: 'Tyjae Spears', position: 'RB', team: 'TEN', image: '', pick: '14.09', round: 14 },
          { name: 'Romeo Doubs', position: 'WR', team: 'GB', image: '', pick: '15.04', round: 15 },
        ],
        pointsPerGame: '119.8 PPG',
        byeWeekStrength: 'Rank: #3',
        syncId: 'MX-942-CL44',
      },
      {
        id: '3',
        grade: '10',
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
        roster: [
          { name: 'Breece Hall', position: 'RB', team: 'NYJ', image: '', pick: '1.06', round: 1 },
          { name: 'Drake London', position: 'WR', team: 'ATL', image: '', pick: '2.07', round: 2 },
          { name: 'Josh Allen', position: 'QB', team: 'BUF', image: '', pick: '3.06', round: 3 },
          { name: 'DeVonta Smith', position: 'WR', team: 'PHI', image: '', pick: '4.07', round: 4 },
          { name: 'Kenneth Walker III', position: 'RB', team: 'SEA', image: '', pick: '5.06', round: 5 },
          { name: 'Terry McLaurin', position: 'WR', team: 'WAS', image: '', pick: '6.07', round: 6 },
          { name: 'David Montgomery', position: 'RB', team: 'DET', image: '', pick: '7.06', round: 7 },
          { name: 'Jake Ferguson', position: 'TE', team: 'DAL', image: '', pick: '8.07', round: 8 },
          { name: 'Courtland Sutton', position: 'WR', team: 'DEN', image: '', pick: '9.06', round: 9 },
          { name: 'Devin Singletary', position: 'RB', team: 'NYG', image: '', pick: '10.07', round: 10 },
          { name: 'Jared Goff', position: 'QB', team: 'DET', image: '', pick: '11.06', round: 11 },
          { name: 'Justin Tucker', position: 'K', team: 'BAL', image: '', pick: '12.07', round: 12 },
          { name: 'Ravens Defense', position: 'DST', team: 'BAL', image: '', pick: '13.06', round: 13 },
          { name: 'Tyjae Spears', position: 'RB', team: 'TEN', image: '', pick: '14.07', round: 14 },
          { name: 'Demario Douglas', position: 'WR', team: 'NE', image: '', pick: '15.06', round: 15 },
        ],
        pointsPerGame: '122.5 PPG',
        byeWeekStrength: 'Rank: #2',
        syncId: 'MX-961-BH44',
      },
      {
        id: '4',
        grade: '8',
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
        roster: [
          { name: 'Amon-Ra St. Brown', position: 'WR', team: 'DET', image: '', pick: '1.05', round: 1 },
          { name: 'Patrick Mahomes', position: 'QB', team: 'KC', image: '', pick: '2.08', round: 2 },
          { name: 'Josh Jacobs', position: 'RB', team: 'GB', image: '', pick: '3.05', round: 3 },
          { name: 'DK Metcalf', position: 'WR', team: 'SEA', image: '', pick: '4.08', round: 4 },
          { name: 'Zay Flowers', position: 'WR', team: 'BAL', image: '', pick: '5.05', round: 5 },
          { name: 'D\'Andre Swift', position: 'RB', team: 'CHI', image: '', pick: '6.08', round: 6 },
          { name: 'Jonnu Smith', position: 'TE', team: 'MIA', image: '', pick: '7.05', round: 7 },
          { name: 'Najee Harris', position: 'RB', team: 'PIT', image: '', pick: '8.08', round: 8 },
          { name: 'Keon Coleman', position: 'WR', team: 'BUF', image: '', pick: '9.05', round: 9 },
          { name: 'Gus Edwards', position: 'RB', team: 'LAC', image: '', pick: '10.08', round: 10 },
          { name: 'Christian Watson', position: 'WR', team: 'GB', image: '', pick: '11.05', round: 11 },
          { name: 'Jake Moody', position: 'K', team: 'SF', image: '', pick: '12.08', round: 12 },
          { name: 'Chiefs Defense', position: 'DST', team: 'KC', image: '', pick: '13.05', round: 13 },
          { name: 'Jaleel McLaughlin', position: 'RB', team: 'DEN', image: '', pick: '14.08', round: 14 },
          { name: 'Noah Fant', position: 'TE', team: 'SEA', image: '', pick: '15.05', round: 15 },
        ],
        pointsPerGame: '112.4 PPG',
        byeWeekStrength: 'Rank: #5',
        syncId: 'MX-898-PM31',
      }
    ];

    return [...userRecaps, ...staticRecaps];
  }, [historicalDrafts]);

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

  const renderPsaLabel = (recap: DraftRecap, player: PickInfo) => {
    const { style, variant } = resolvePlayerCard(String(recap.id || player.name));
    const year = useDraftStore.getState().setup.year || 2026;
    const details = getPlayerDetails(player.name, player.position);
    const headerStats = getPlayerStatsForHeader(player.position, details.projectedPoints);
    const psaGrade = getPsaGrade(details.rank);

    return (
      <View style={styles.psaLabelContainer}>
        <View style={styles.psaTwoColumnLayout}>
          {/* LEFT COLUMN */}
          <View style={styles.psaLeftColumn}>
            {/* Band 1 - Year tag */}
            <Text style={styles.psaYearTag} numberOfLines={1}>
              {`${year} ${style.name.toUpperCase()} ${variant.name.toUpperCase()}`}
            </Text>
            {/* Band 2 - Player name */}
            <Text style={styles.psaPlayerName} numberOfLines={1}>
              {player.name.toUpperCase()}
            </Text>
            {/* Band 3 - Player meta row */}
            <Text style={styles.psaMetaRow} numberOfLines={1}>
              {`${player.team} · ${details.posRank} · BYE ${details.bye}`}
            </Text>
            {/* Band 4 - Stat row */}
            <View style={styles.psaStatRow}>
              <View style={styles.psaStatCell}>
                <Text style={styles.psaStatLabel}>PPG</Text>
                <Text style={styles.psaStatValue}>{headerStats.ppg}</Text>
              </View>
              <View style={styles.psaStatCell}>
                <Text style={styles.psaStatLabel}>YARDS</Text>
                <Text style={styles.psaStatValue}>{headerStats.yards}</Text>
              </View>
              <View style={styles.psaStatCell}>
                <Text style={styles.psaStatLabel}>TDS</Text>
                <Text style={styles.psaStatValue}>{headerStats.tds}</Text>
              </View>
            </View>
          </View>

          {/* RIGHT COLUMN VERTICAL STACK */}
          <View style={styles.psaRightColumn}>
            {/* Stack Item 1 - ECR Score */}
            <View style={styles.psaEcrBox}>
              <Text style={styles.psaRightLabel}>ECR</Text>
              <Text style={styles.psaRightValue}>{details.rank}</Text>
            </View>
            {/* Stack Item 2 - ADP Score (Yellow Highlight) */}
            <View style={styles.psaAdpBox}>
              <Text style={styles.psaAdpLabel}>ADP</Text>
              <Text style={styles.psaAdpValue}>{details.adp}</Text>
            </View>
            {/* Stack Item 3 - PSA Grade */}
            <View style={styles.psaGradeBox}>
              <Text style={styles.psaGradeLabel}>{psaGrade.desc}</Text>
              <Text style={styles.psaGradeValue}>{psaGrade.num}</Text>
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

  const renderToppsChromeCard = (recap: DraftRecap, player: PickInfo) => {
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

    const cleanPName = player.name.toLowerCase().replace(/[^a-z]/g, '').trim();
    const registryMatch = PLAYER_REGISTRY.find(rp => rp.name.toLowerCase().replace(/[^a-z]/g, '').trim() === cleanPName && rp.position === player.position);
    const isRookie = registryMatch ? registryMatch.rookieSeason === 2026 : false;

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
      is_rookie: isRookie,
    };

    return (
      <ProceduralTradingCard player={cardData} width={258} />
    );
  };

  const renderBackCardContent = (recap: DraftRecap) => {
    const detail = statsDetails[recap.id] || statsDetails['1'];

    return (
      <View style={styles.backCardContainer}>
        
        {/* Header */}
        <View style={styles.backCardHeader}>
          <View style={styles.backGradeWrapper}>
            <Text style={styles.backGradeText}>{recap.grade}</Text>
          </View>
          <View style={styles.backTitleContainer}>
            <Text style={styles.backTitle}>DRAFT TELEMETRY</Text>
            <Text style={styles.backSubtitle}>ID: {recap.syncId}</Text>
          </View>
          <Pressable style={styles.backCloseBtn} onPress={() => handleCardPress(recap.id)}>
            <Text style={styles.backCloseBtnText}>✕</Text>
          </Pressable>
        </View>

        {/* Content scroll area */}
        <ScrollView style={styles.backCardScroll} showsVerticalScrollIndicator={false}>
          {/* 1. Metrics */}
          <View style={styles.backStatsSection}>
            <Text style={styles.backSectionHeader}>VALUE & REACH METRICS</Text>
            <View style={styles.backMetricsList}>
              {detail.valuePicks.map((v, idx) => (
                <View key={idx} style={styles.backMetricItem}>
                  <Text style={styles.backMetricBullet}>✓</Text>
                  <Text style={styles.backMetricText}>{v}</Text>
                </View>
              ))}
              {detail.reachPicks.map((r, idx) => (
                <View key={idx} style={styles.backMetricItem}>
                  <Text style={[styles.backMetricBullet, { color: '#ef4444' }]}>⚠</Text>
                  <Text style={styles.backMetricText}>{r}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 2. Roster Distribution */}
          <View style={styles.backStatsSection}>
            <Text style={styles.backSectionHeader}>ROSTER DISTRIBUTION</Text>
            <View style={styles.positionGrid}>
              {detail.rosterBalance.map((item, idx) => (
                <View key={idx} style={styles.positionCard}>
                  <Text style={styles.positionLabel}>{item.position}</Text>
                  <View style={styles.positionGradeBadge}>
                    <Text style={styles.positionGradeText}>{item.grade}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* 3. Telemetry Notes */}
          <View style={styles.backStatsSection}>
            <Text style={styles.backSectionHeader}>COACHING TELEMETRY REPORT</Text>
            <View style={styles.insightsCard}>
              <Text style={styles.insightsText}>{detail.coachingNotes}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Return CTA */}
        <Pressable 
          style={({ pressed }) => [
            styles.closeFlipBtn,
            pressed && styles.closeFlipBtnPressed
          ]} 
          onPress={() => handleCardPress(recap.id)}
        >
          <Text style={styles.closeFlipBtnText}>TAP TO FLIP BACK</Text>
        </Pressable>

      </View>
    );
  };

  const renderExpandedBackCardContent = (recap: DraftRecap) => {
    const detail = statsDetails[recap.id] || statsDetails['1'];

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
      <View style={styles.expandedBackContainer}>
        {/* Premium PSA Label Header (feels like certified slab back) */}
        <View style={styles.expandedPsaHeader}>
          <View style={styles.expandedPsaHeaderContent}>
            <View style={styles.expandedPsaHeaderLeft}>
              <Text style={styles.expandedPsaHeaderKicker} numberOfLines={1}>2025 MOCK MAXXING CHROME</Text>
              <Text style={styles.expandedPsaHeaderTitle} numberOfLines={1}>DRAFT ROSTER AUDIT</Text>
              <Text style={styles.expandedPsaHeaderMeta} numberOfLines={1}>
                REC: {recap.projectedRecord} • {recap.pointsPerGame}
              </Text>
            </View>
            <View style={styles.expandedPsaHeaderRight}>
              <Text style={styles.expandedPsaHeaderGradeDesc} numberOfLines={1}>{psaGradeText}</Text>
              <Text style={styles.expandedPsaHeaderGradeNum}>{psaGradeNum}</Text>
            </View>
          </View>
          <View style={styles.expandedPsaBarcodeRow}>
            <Text style={styles.expandedPsaBarcode}>||||| | |||| | ||||| | ||| ||</Text>
            <Text style={styles.expandedPsaSerial}>#{recap.syncId}</Text>
          </View>
        </View>

        {/* Scrollable Content inside the Slab backing */}
        <ScrollView 
          style={styles.expandedScrollArea} 
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {/* Section 1: The Selected Roster (15 rounds) */}
          <View style={styles.expandedSection}>
            <Text style={styles.expandedSectionTitle}>PICKED ROSTER (15 ROUNDS)</Text>
            <View style={styles.rosterListContainer}>
              {recap.roster.map((player, idx) => {
                const roundText = `RD ${player.round}`;
                return (
                  <View key={idx} style={styles.rosterRowItem}>
                    <View style={styles.rosterRowLeft}>
                      <View style={styles.rosterRoundPill}>
                        <Text style={styles.rosterRoundText}>{roundText}</Text>
                      </View>
                      <View style={styles.rosterPlayerInfo}>
                        <Text style={styles.rosterPlayerName} numberOfLines={1}>
                          {player.name}
                        </Text>
                        <Text style={styles.rosterPlayerTeamPos}>
                          {player.position} • {player.team}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.rosterRowRight}>
                      <Text style={styles.rosterPickText}>{player.pick}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Section 2: Coaching Telemetry Report */}
          <View style={styles.expandedSection}>
            <Text style={styles.expandedSectionTitle}>COACHING TELEMETRY</Text>
            <View style={styles.expandedInsightsCard}>
              <Text style={styles.expandedInsightsText}>
                {detail.coachingNotes}
              </Text>
            </View>
          </View>

          {/* Section 3: Rarity/Efficiency Metrics */}
          <View style={styles.expandedSection}>
            <Text style={styles.expandedSectionTitle}>METRIC TELEMETRY</Text>
            <View style={styles.expandedTelemetryRow}>
              <View style={styles.expandedTelemetryBox}>
                <Text style={styles.expandedTelemetryVal}>{recap.efficiency}</Text>
                <Text style={styles.expandedTelemetryLbl}>DRAFT EFFICIENCY</Text>
              </View>
              <View style={styles.expandedTelemetryBox}>
                <Text style={styles.expandedTelemetryVal}>
                  {recap.byeWeekStrength.replace(/^Rank:\s*/i, '')}
                </Text>
                <Text style={styles.expandedTelemetryLbl}>BYE WEEK RANK</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Return CTA */}
        <Pressable 
          style={({ pressed }) => [
            styles.expandedCloseFlipBtn,
            pressed && styles.expandedCloseFlipBtnPressed
          ]} 
          onPress={handleExpandedCardFlip}
        >
          <Text style={styles.expandedCloseFlipBtnText}>TAP TO FLIP BACK</Text>
        </Pressable>
      </View>
    );
  };

  const renderExpandedCard = () => {
    if (!expandedCardId) return null;
    const recap = draftRecaps.find(r => r.id === expandedCardId);
    if (!recap) return null;
    const player = recap.topPicks[0];

    // Compute dimensions keeping 1.5 aspect ratio
    const expandedWidth = Math.min(screenWidth - 48, (screenHeight - 140) / 1.5, 380);
    const expandedHeight = expandedWidth * 1.5;

    return (
      <View style={styles.maximizedOverlay}>
        {/* Transparent dark glass backdrop pressable to close */}
        <Pressable 
          style={StyleSheet.absoluteFillObject} 
          onPress={handleCloseExpandedCard} 
        />

        {/* Close button on the top right */}
        <Pressable 
          style={styles.maximizedCloseButton} 
          onPress={handleCloseExpandedCard}
        >
          <Text style={styles.maximizedCloseButtonText}>✕</Text>
        </Pressable>

        <View style={styles.maximizedCardWrapper}>
          <Pressable 
            onPress={handleExpandedCardFlip}
            style={({ pressed }) => [
              {
                width: expandedWidth,
                height: expandedHeight,
              },
              pressed && styles.cardPressableAreaPressed
            ]}
          >
            <Animated.View style={[
              styles.maximizedCardInner,
              {
                width: expandedWidth,
                height: expandedHeight,
                transform: [{ rotateY: expandedRotateY }]
              }
            ]}>
              <View style={styles.cardPressableArea}>
                {expandedFlipped ? (
                  <View style={[styles.maximizedCardBack, { transform: [{ rotateY: '180deg' }] }]}>
                    {renderExpandedBackCardContent(recap)}
                  </View>
                ) : (
                  <View style={styles.maximizedCardFront}>
                    {renderPsaLabel(recap, player)}
                    {renderToppsChromeCard(recap, player)}
                    
                    {/* Full-Slab Glossy Reflection Overlay representing a protective shiny acrylic shell */}
                    <View style={styles.slabGlossOverlay} pointerEvents="none">
                      <Svg style={StyleSheet.absoluteFillObject} width="100%" height="100%">
                        <Defs>
                          <LinearGradient id={`expandedSlabGloss-${recap.id}`} x1="0" y1="0" x2="1" y2="1">
                            <Stop offset="0%" stopColor="rgba(255,255,255,0)" />
                            <Stop offset="25%" stopColor="rgba(255,255,255,0)" />
                            <Stop offset="38%" stopColor="rgba(255,255,255,0.18)" />
                            <Stop offset="42%" stopColor="rgba(255,255,255,0.30)" />
                            <Stop offset="46%" stopColor="rgba(255,255,255,0.18)" />
                            <Stop offset="58%" stopColor="rgba(255,255,255,0)" />
                            <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
                          </LinearGradient>
                        </Defs>
                        <Rect width="100%" height="100%" fill={`url(#expandedSlabGloss-${recap.id})`} />
                      </Svg>
                    </View>
                  </View>
                )}
              </View>
            </Animated.View>
          </Pressable>
        </View>

        {/* Dynamic Instructional Subtitle */}
        <Text style={styles.expandedInstructions}>
          {expandedFlipped ? "TAP SLAB TO FLIP FRONT" : "TAP SLAB TO REVEAL ROSTER"}
        </Text>
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
          showBack={true}
          backText="BACK"
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
              snapToInterval={300 + 24} // card width + margin
              decelerationRate="fast"
              snapToAlignment="center"
            >
              {draftRecaps.map((recap, index) => {
                const player = recap.topPicks[0];
                return (
                  <View key={recap.id} style={styles.cardContainer}>
                    
                    {/* Interactive card body (tap anywhere other than action buttons to flip in-place) */}
                    <Pressable 
                      onPress={() => handleCardPress(recap.id)}
                      style={({ pressed }) => [
                        styles.cardPressableArea,
                        pressed && styles.cardPressableAreaPressed
                      ]}
                    >
                      <Animated.View style={[
                        { flex: 1 },
                        recap.id === flippedCardId && {
                          transform: [{ rotateY }]
                        }
                      ]}>
                        {showBackCardId === recap.id ? (
                          <View style={[styles.backCardContainer, { transform: [{ rotateY: '180deg' }] }]}>
                            {renderBackCardContent(recap)}
                          </View>
                        ) : (
                          <>
                            {renderPsaLabel(recap, player)}
                            {renderToppsChromeCard(recap, player)}
                          </>
                        )}
                      </Animated.View>
                    </Pressable>

                    {/* Tactile Micro-Action Buttons at bottom of card - Outside interactive pressable to prevent collision */}
                    <View style={styles.cardActionContainer}>
                      <View style={styles.cardActionRow}>
                        <Pressable 
                          style={({ pressed }) => [
                            styles.cardActionBtn,
                            pressed && styles.cardActionBtnPressed
                          ]}
                          onPress={() => handleCardPress(recap.id)}
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

                    {/* Full-Slab Glossy Reflection Overlay representing a protective shiny acrylic shell */}
                    {showBackCardId !== recap.id && (
                      <View style={styles.slabGlossOverlay} pointerEvents="none">
                        <Svg style={StyleSheet.absoluteFillObject} width="100%" height="100%">
                          <Defs>
                            <LinearGradient id={`slabGloss-${recap.id}`} x1="0" y1="0" x2="1" y2="1">
                              <Stop offset="0%" stopColor="rgba(255,255,255,0)" />
                              <Stop offset="25%" stopColor="rgba(255,255,255,0)" />
                              <Stop offset="38%" stopColor="rgba(255,255,255,0.18)" />
                              <Stop offset="42%" stopColor="rgba(255,255,255,0.30)" />
                              <Stop offset="46%" stopColor="rgba(255,255,255,0.18)" />
                              <Stop offset="58%" stopColor="rgba(255,255,255,0)" />
                              <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
                            </LinearGradient>
                          </Defs>
                          <Rect width="100%" height="100%" fill={`url(#slabGloss-${recap.id})`} />
                        </Svg>
                      </View>
                    )}

                  </View>
                );
              })}
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
      {renderExpandedCard()}
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
      backgroundColor: Colors.primaryAccent,
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
      height: 615,
    },
    swiperContent: {
      paddingHorizontal: 24,
      alignItems: 'center',
      gap: 24,
    },
    cardContainer: {
      width: 300,
      height: 585,
      backgroundColor: 'rgba(255, 255, 255, 0.05)', // Highly transparent clear plastic slab backing
      borderRadius: 24,
      borderWidth: 9.5, // Substantially thicker acrylic slab outer rim for plastic texture
      borderColor: 'rgba(241, 245, 249, 0.48)', // Brighter, more pronounced frosted clear acrylic slab border bezel
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.28, // Stronger shadow density to make the clear plastic slab stand out
      shadowRadius: 10,
      elevation: 7,
      overflow: 'hidden',
    },
    slabGlossOverlay: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 200,
      borderRadius: 14, // Matches the inner boundary border radius inside thick bevels
      overflow: 'hidden',
    },
    cardTopHalf: {
      flex: 1.25,
      backgroundColor: '#1A1D21', // Deep Graphite top half
      paddingTop: 34,
      paddingHorizontal: 8,
      paddingBottom: 10,
      position: 'relative',
      justifyContent: 'center',
    },
    gradeContainer: {
      position: 'absolute',
      top: 8,
      right: 8,
      zIndex: 10,
      width: 42,
      height: 42,
    },
    medalTextContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    gradeText: {
      fontFamily: Fonts.headings,
      fontSize: 15,
      fontWeight: 'bold',
      color: '#000000', // solid black text overlay for Gold Medal
    },
    baseballContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      gap: 6,
    },
    baseballCard: {
      flex: 1,
      backgroundColor: '#1A1D21', // Deep Graphite
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: '#6B3615', // framed by brown
      overflow: 'hidden',
      height: 140,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 2,
    },
    teamStripe: {
      height: 4,
      width: '100%',
    },
    baseballCardImageContainer: {
      width: '100%',
      height: 72,
      backgroundColor: '#6B3615', // Pigskin Brown leather matting frame
      padding: 8, // inner padding around photos (brown frame)
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
      color: Colors.hofYellow, // Hall of Fame Yellow highlight
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
      borderColor: Colors.chromeSilver,
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
      backgroundColor: Colors.chromeSilver,
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
      backgroundColor: Colors.liftedCharcoal,
      borderWidth: 1,
      borderColor: Colors.chromeSilver,
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
      backgroundColor: Colors.deepFieldGreen,
    },
    indicatorDotInactive: {
      width: 8,
      backgroundColor: Colors.chromeSilver,
    },
    justForYouSection: {
      paddingHorizontal: Spacing.four,
      marginTop: Spacing.two,
    },
    justForYouHeading: {
      fontFamily: Fonts.headings,
      fontSize: 22,
      fontWeight: 'bold',
      color: Colors.obsidianBlack,
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
      backgroundColor: Colors.deepGraphiteCharcoal,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: Colors.chromeSilver,
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
      backgroundColor: Colors.chromeSilver,
    },
    feedCardContent: {
      padding: Spacing.three,
    },
    feedCardKicker: {
      fontFamily: Fonts.stats,
      fontSize: 8,
      fontWeight: 'bold',
      color: Colors.deepFieldGreen,
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
    cardPressableArea: {
      flex: 1,
      width: '100%',
      padding: 10, // Recess spacer mimic inside acrylic slab
      borderWidth: 1.5,
      borderColor: 'rgba(255, 255, 255, 0.12)', // Faint inner beveled recess groove matching real plastic slabs
      borderRadius: 16,
    },
    cardPressableAreaPressed: {
      opacity: 0.95,
    },
    cardBottomHalfStats: {
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.two,
      paddingTop: Spacing.one,
      paddingBottom: 4,
    },
    cardActionContainer: {
      paddingHorizontal: Spacing.two,
      paddingBottom: Spacing.two,
    },
    maximizedOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(12, 12, 12, 0.95)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    maximizedCloseButton: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 60 : 40,
      right: 24,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      borderWidth: 1.5,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1010,
    },
    maximizedCloseButtonText: {
      fontSize: 20,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    maximizedCardWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 24,
      overflow: 'visible',
    },
    maximizedCardInner: {
      backgroundColor: '#1A1D21', // Deep Graphite slab backing
      borderRadius: 24,
      borderWidth: 9.5, // Thicker acrylic slab outer bezel
      borderColor: 'rgba(241, 245, 249, 0.48)', // Pronounced frosted clear acrylic slab border bezel
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 15,
      overflow: 'hidden',
    },
    maximizedCardFront: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    maximizedCardBack: {
      flex: 1,
      width: '100%',
      height: '100%',
      backgroundColor: '#1A1D21', // Deep Graphite
    },
    expandedInstructions: {
      fontFamily: Fonts.headings,
      fontSize: 12,
      fontWeight: 'bold',
      color: Colors.hofYellow, // Hall of Fame Yellow highlight
      letterSpacing: 1.2,
      marginTop: 20,
      textAlign: 'center',
    },
    expandedBackContainer: {
      flex: 1,
      padding: 12,
      justifyContent: 'space-between',
    },
    expandedPsaHeader: {
      backgroundColor: '#FFFFFF',
      borderWidth: 3.5,
      borderColor: '#D9261C', // Bright PSA Red border
      borderRadius: 8,
      padding: 6,
      marginBottom: 10,
    },
    expandedPsaHeaderContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#FFFFFF',
    },
    expandedPsaHeaderLeft: {
      flex: 1,
      justifyContent: 'center',
    },
    expandedPsaHeaderRight: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      minWidth: 75,
    },
    expandedPsaHeaderKicker: {
      fontFamily: Fonts.stats,
      fontSize: 9,
      fontWeight: 'bold',
      color: '#0c0c0c',
    },
    expandedPsaHeaderTitle: {
      fontFamily: Fonts.headings,
      fontSize: 13,
      fontWeight: '900',
      color: '#0c0c0c',
      marginTop: 2,
    },
    expandedPsaHeaderMeta: {
      fontFamily: Fonts.stats,
      fontSize: 9,
      color: '#475569',
      marginTop: 2,
    },
    expandedPsaHeaderGradeDesc: {
      fontFamily: Fonts.headings,
      fontSize: 10,
      fontWeight: 'bold',
      color: '#0c0c0c',
    },
    expandedPsaHeaderGradeNum: {
      fontFamily: Fonts.headings,
      fontSize: 22,
      fontWeight: '900',
      color: '#D9261C', // Grade in PSA red
      marginTop: -3,
    },
    expandedPsaBarcodeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 0.5,
      borderColor: 'rgba(0,0,0,0.1)',
      paddingTop: 3,
      marginTop: 3,
    },
    expandedPsaBarcode: {
      fontFamily: Fonts.stats,
      fontSize: 8.5,
      letterSpacing: 0.2,
      color: '#0c0c0c',
    },
    expandedPsaSerial: {
      fontFamily: Fonts.stats,
      fontSize: 8.5,
      color: '#475569',
    },
    expandedScrollArea: {
      flex: 1,
      marginVertical: 4,
    },
    expandedSection: {
      marginBottom: 14,
    },
    expandedSectionTitle: {
      fontFamily: Fonts.headings,
      fontSize: 8.5,
      color: Colors.pigskinBrown, // Pigskin Brown accent flourish
      letterSpacing: 1.5,
      fontWeight: 'bold',
      marginBottom: 6,
    },
    rosterListContainer: {
      gap: 5,
    },
    rosterRowItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(255, 255, 255, 0.04)', // Elevated Lifted Charcoal texture
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 0.5,
      borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    rosterRowLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flex: 1,
    },
    rosterRoundPill: {
      backgroundColor: Colors.hofYellow, // Hall of Fame Yellow fill
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 4,
      minWidth: 34,
      alignItems: 'center',
    },
    rosterRoundText: {
      fontFamily: Fonts.stats,
      fontSize: 8,
      fontWeight: 'bold',
      color: '#0c0c0c', // Solid Obsidian Black text on Yellow fill for contrast
    },
    rosterPlayerInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    rosterPlayerName: {
      fontFamily: Fonts.body,
      fontSize: 11,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    rosterPlayerTeamPos: {
      fontFamily: Fonts.body,
      fontSize: 8.5,
      color: 'rgba(255, 255, 255, 0.5)',
      marginTop: 1,
    },
    rosterRowRight: {
      alignItems: 'flex-end',
    },
    rosterPickText: {
      fontFamily: Fonts.stats,
      fontSize: 10,
      color: Colors.hofYellow,
      fontWeight: 'bold',
    },
    expandedInsightsCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.03)', // Lifted Charcoal surface
      borderRadius: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    expandedInsightsText: {
      fontFamily: Fonts.body,
      fontSize: 10.5,
      color: '#e2e8f0',
      lineHeight: 15,
    },
    expandedTelemetryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
    },
    expandedTelemetryBox: {
      flex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: 8,
      padding: 8,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    expandedTelemetryVal: {
      fontFamily: Fonts.stats,
      fontSize: 13,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    expandedTelemetryLbl: {
      fontFamily: Fonts.body,
      fontSize: 7.5,
      color: 'rgba(255, 255, 255, 0.5)',
      marginTop: 2,
    },
    expandedCloseFlipBtn: {
      backgroundColor: Colors.liftedCharcoal,
      borderWidth: 1,
      borderColor: Colors.chromeSilver,
      borderRadius: 10,
      paddingVertical: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 4,
    },
    expandedCloseFlipBtnPressed: {
      opacity: 0.75,
    },
    expandedCloseFlipBtnText: {
      fontFamily: Fonts.body,
      fontSize: 10,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    backCardContainer: {
      flex: 1,
      padding: Spacing.three,
      justifyContent: 'space-between',
    },
    backCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: Spacing.two,
      borderBottomWidth: 1,
      borderColor: 'rgba(255,255,255,0.08)',
    },
    backGradeWrapper: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: Colors.hofYellow,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backGradeText: {
      fontFamily: Fonts.headings,
      fontSize: 14,
      fontWeight: 'bold',
      color: '#000000',
    },
    backTitleContainer: {
      flex: 1,
      marginLeft: Spacing.two,
    },
    backTitle: {
      fontFamily: Fonts.headings,
      fontSize: 14,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
      letterSpacing: 0.5,
    },
    backSubtitle: {
      fontFamily: Fonts.stats,
      fontSize: 9,
      color: Colors.secondaryAccent,
      marginTop: 2,
    },
    backCloseBtn: {
      padding: 4,
    },
    backCloseBtnText: {
      fontSize: 18,
      color: Colors.secondaryAccent,
      fontWeight: 'bold',
    },
    backCardScroll: {
      flex: 1,
      marginVertical: Spacing.two,
    },
    backStatsSection: {
      marginBottom: Spacing.three,
    },
    backSectionHeader: {
      fontFamily: Fonts.headings,
      fontSize: 9,
      color: Colors.pigskinBrown,
      letterSpacing: 1.5,
      fontWeight: 'bold',
      marginBottom: Spacing.one,
    },
    backMetricsList: {
      gap: 6,
    },
    backMetricItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)',
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 8,
    },
    backMetricBullet: {
      fontSize: 11,
      color: Colors.hofYellow,
      marginRight: 8,
      fontWeight: 'bold',
    },
    backMetricText: {
      fontFamily: Fonts.stats,
      fontSize: 10,
      color: Colors.primaryAccent,
    },
    positionGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 6,
    },
    positionCard: {
      flex: 1,
      backgroundColor: isDark ? '#2c2c2c' : '#E8EAED',
      borderRadius: 8,
      padding: 6,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    },
    positionLabel: {
      fontFamily: Fonts.body,
      fontSize: 8.5,
      color: Colors.secondaryAccent,
      fontWeight: 'bold',
    },
    positionGradeBadge: {
      marginTop: 4,
      backgroundColor: 'rgba(255, 205, 0, 0.12)',
      paddingHorizontal: 6,
      paddingVertical: 1.5,
      borderRadius: 4,
    },
    positionGradeText: {
      fontFamily: Fonts.headings,
      fontSize: 9.5,
      color: Colors.hofYellow,
      fontWeight: 'bold',
    },
    insightsCard: {
      backgroundColor: isDark ? '#2c2c2c' : '#E8EAED',
      borderRadius: 12,
      padding: Spacing.two,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    },
    insightsText: {
      fontFamily: Fonts.body,
      fontSize: 11,
      color: Colors.primaryAccent,
      lineHeight: 16.5,
    },
    closeFlipBtn: {
      backgroundColor: Colors.liftedCharcoal,
      borderWidth: 1,
      borderColor: Colors.chromeSilver,
      borderRadius: 12,
      paddingVertical: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: Spacing.one,
    },
    closeFlipBtnPressed: {
      opacity: 0.75,
    },
    closeFlipBtnText: {
      fontFamily: Fonts.body,
      fontSize: 10.5,
      fontWeight: 'bold',
      color: Colors.primaryAccent,
    },

    // PSA Grading Slab Styles
    psaLabelContainer: {
      backgroundColor: '#FFFFFF',
      borderWidth: 3.5,
      borderColor: '#D9261C', // Branded PSA Red
      borderRadius: 8,
      padding: 6,
      marginBottom: 8,
    },
    psaTwoColumnLayout: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#FFFFFF',
    },
    psaLeftColumn: {
      flex: 1.1,
      justifyContent: 'space-between',
      paddingRight: 6,
    },
    psaRightColumn: {
      width: 76,
      gap: 3.5,
      alignItems: 'stretch',
    },
    psaYearTag: {
      fontFamily: Fonts.stats,
      fontSize: 7.5,
      fontWeight: 'bold',
      color: '#64748b',
      letterSpacing: 0.3,
    },
    psaPlayerName: {
      fontFamily: Fonts.headings,
      fontSize: 13.5,
      fontWeight: '900',
      color: '#0c0c0c',
      marginVertical: 1,
    },
    psaMetaRow: {
      fontFamily: Fonts.stats,
      fontSize: 8,
      fontWeight: 'bold',
      color: '#475569',
    },
    psaStatRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderTopWidth: 0.5,
      borderColor: '#cbd5e1',
      paddingTop: 2,
      marginTop: 3,
    },
    psaStatCell: {
      alignItems: 'center',
      flex: 1,
    },
    psaStatLabel: {
      fontFamily: Fonts.body,
      fontSize: 6.5,
      color: '#64748b',
      fontWeight: 'bold',
    },
    psaStatValue: {
      fontFamily: Fonts.stats,
      fontSize: 9,
      fontWeight: '900',
      color: '#0c0c0c',
    },
    // Right Column Stack Styles
    psaEcrBox: {
      borderWidth: 0.5,
      borderColor: '#cbd5e1',
      borderRadius: 3.5,
      paddingVertical: 1.5,
      alignItems: 'center',
      backgroundColor: '#FAFAFA',
    },
    psaRightLabel: {
      fontFamily: Fonts.body,
      fontSize: 6.5,
      color: '#64748b',
      fontWeight: 'bold',
    },
    psaRightValue: {
      fontFamily: Fonts.stats,
      fontSize: 9,
      fontWeight: 'bold',
      color: '#0c0c0c',
    },
    psaAdpBox: {
      borderWidth: 1.2,
      borderColor: '#0c0c0c',
      borderRadius: 3.5,
      paddingVertical: 2,
      alignItems: 'center',
      backgroundColor: '#FFCD00', // Highlight Yellow!
    },
    psaAdpLabel: {
      fontFamily: Fonts.body,
      fontSize: 7,
      color: '#0c0c0c',
      fontWeight: '900',
    },
    psaAdpValue: {
      fontFamily: Fonts.stats,
      fontSize: 12,
      fontWeight: '900',
      color: '#0c0c0c',
    },
    psaGradeBox: {
      borderWidth: 0.5,
      borderColor: '#cbd5e1',
      borderRadius: 3.5,
      paddingVertical: 1.5,
      alignItems: 'center',
      backgroundColor: '#FAFAFA',
    },
    psaGradeLabel: {
      fontFamily: Fonts.body,
      fontSize: 6,
      color: '#D9261C', // Red description text
      fontWeight: '900',
    },
    psaGradeValue: {
      fontFamily: Fonts.headings,
      fontSize: 10,
      fontWeight: '900',
      color: '#D9261C',
    },

    // Topps Chrome Card Styles
    chromeCardContainer: {
      flex: 1,
      borderWidth: 2,
      borderRadius: 10,
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: '#1E293B',
    },
    chromeCardBg: {
      ...StyleSheet.absoluteFillObject,
      opacity: 0.35,
    },
    chromeLightBeam: {
      position: 'absolute',
      top: -150,
      left: -75,
      width: 225,
      height: 600,
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      transform: [{ rotate: '25deg' }],
    },
    verticalTeamContainer: {
      position: 'absolute',
      left: 8,
      top: 30,
      bottom: 30,
      justifyContent: 'center',
      zIndex: 5,
    },
    verticalTeamText: {
      fontFamily: Fonts.headings,
      fontSize: 22,
      fontWeight: '900',
      opacity: 0.2,
      textAlign: 'center',
      lineHeight: 24,
    },
    rookieBadgeContainer: {
      position: 'absolute',
      top: 8,
      left: 8,
      zIndex: 10,
    },
    rookieBadgeTextWrapper: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rookieBadgeText: {
      fontFamily: Fonts.headings,
      fontSize: 11,
      fontWeight: 'bold',
      color: '#0c0c0c',
    },
    toppsChromeLogoContainer: {
      position: 'absolute',
      top: 8,
      right: 8,
      zIndex: 10,
      alignItems: 'flex-end',
    },
    toppsChromeLogoText: {
      fontFamily: 'Inter',
      fontSize: 9,
      fontStyle: 'italic',
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    toppsChromeSubText: {
      fontFamily: Fonts.headings,
      fontSize: 8.5,
      fontWeight: '900',
      color: '#FFCD00',
      letterSpacing: 0.2,
    },
    chromePlayerFrame: {
      width: '72%',
      height: '68%',
      alignSelf: 'center',
      marginTop: 26,
      borderWidth: 1.5,
      borderRadius: 100, // Elegant arch outline
      overflow: 'hidden',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    chromePlayerImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    autographContainer: {
      position: 'absolute',
      bottom: 36,
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 12,
    },
    autographText: {
      fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : Platform.OS === 'web' ? 'Caveat' : 'cursive',
      fontSize: Platform.OS === 'ios' ? 32 : 26, // Scale up Snell Roundhand for readability
      fontWeight: 'bold',
      color: '#ffffff', // White cursive signature autograph overlay
      letterSpacing: 0.5,
      transform: [{ rotate: '-8deg' }], // Slightly more diagonal and sloppy signature rotation
      opacity: 0.85,
    },
    autographSubText: {
      fontFamily: Fonts.body,
      fontSize: 6.5,
      color: 'rgba(255, 255, 255, 0.4)',
      letterSpacing: 0.5,
      marginTop: 3,
    },
    foilStampContainer: {
      position: 'absolute',
      bottom: 36,
      right: 15,
      zIndex: 10,
    },
    foilStampText: {
      fontFamily: Fonts.stats,
      fontSize: 10,
      color: '#FFD700', // Gold color stamp
      fontWeight: 'bold',
      opacity: 0.8,
    },
    chromePlayerBottomBar: {
      position: 'absolute',
      bottom: 6,
      left: 10,
      right: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 15,
      borderTopWidth: 0.5,
      borderColor: 'rgba(255,255,255,0.15)',
      paddingTop: 4,
    },
    chromePlayerBottomBarPressed: {
      opacity: 0.75,
    },
    chromeBottomLeftNameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    chromeTeamMonogram: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chromeTeamMonogramText: {
      fontFamily: Fonts.headings,
      fontSize: 12,
      fontWeight: '900',
      color: '#FFFFFF',
      fontStyle: 'italic',
      textTransform: 'uppercase',
    },
    chromeNameTextWrapper: {
      justifyContent: 'center',
    },
    chromePlayerFirstName: {
      fontFamily: Fonts.body,
      fontSize: 8.5,
      fontWeight: 'bold',
      color: '#cbd5e1',
      letterSpacing: 0.5,
      lineHeight: 9,
    },
    chromePlayerLastName: {
      fontFamily: Fonts.headings,
      fontSize: 15,
      fontWeight: '900',
      color: '#FFFFFF',
      marginTop: -2,
    },
    chromePosBox: {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
    },
    chromePosText: {
      fontFamily: Fonts.stats,
      fontSize: 9,
      color: '#cbd5e1',
    },
    psaLogoPill: {
      backgroundColor: '#0F2C59', // PSA Dark Blue
      paddingHorizontal: 6,
      paddingVertical: 1,
      borderRadius: 4,
      alignSelf: 'center',
    },
    psaLogoText: {
      fontFamily: Fonts.stats,
      fontSize: 8,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    // RPA TEMPLATE STYLES
    rpaSerialContainer: {
      position: 'absolute',
      top: 8,
      right: 10,
      zIndex: 10,
      backgroundColor: '#FFFBEB',
      borderColor: '#F59E0B',
      borderWidth: 1,
      paddingHorizontal: 5,
      paddingVertical: 1,
      borderRadius: 4,
    },
    rpaSerialText: {
      fontFamily: Fonts.stats,
      fontSize: 8.5,
      color: '#B45309',
      fontWeight: 'bold',
    },
    rpaHeaderBrand: {
      position: 'absolute',
      top: 8,
      alignSelf: 'center',
      zIndex: 10,
    },
    rpaBrandName: {
      fontFamily: Fonts.headings,
      fontSize: 9,
      color: '#64748b',
      letterSpacing: 2,
      fontWeight: '900',
    },
    rpaPlayerFrame: {
      width: 135,
      height: 160,
      position: 'absolute',
      right: 12,
      top: 65,
      borderRadius: 8,
      borderWidth: 1,
      overflow: 'hidden',
    },
    rpaPlayerImage: {
      width: '100%',
      height: '100%',
    },
    jerseyPatchWindow: {
      width: 90,
      height: 90,
      position: 'absolute',
      left: 20,
      top: 85,
      borderRadius: 8,
      borderWidth: 1.5,
      borderColor: '#94A3B8',
      overflow: 'hidden',
      backgroundColor: '#1E293B',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    rpaAutographContainer: {
      position: 'absolute',
      bottom: 50,
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 12,
    },
    rpaAutographText: {
      fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : Platform.OS === 'web' ? 'Caveat' : 'cursive',
      fontSize: 25,
      fontWeight: 'bold',
      color: '#1D4ED8',
      transform: [{ rotate: '-4deg' }],
    },

    // KABOOM TEMPLATE STYLES
    kaboomTextContainer: {
      position: 'absolute',
      top: 8,
      alignSelf: 'center',
      zIndex: 10,
    },
    kaboomTextMain: {
      fontFamily: Fonts.headings,
      fontSize: 34,
      fontWeight: '900',
      color: '#FFCD00',
      textShadowColor: '#000000',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 1,
      letterSpacing: 0.5,
      transform: [{ rotate: '-6deg' }],
    },
    kaboomPlayerFrame: {
      width: 200,
      height: 200,
      position: 'absolute',
      alignSelf: 'center',
      top: 75,
      borderRadius: 100,
      borderWidth: 2,
      overflow: 'hidden',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    kaboomPlayerImage: {
      width: '100%',
      height: '100%',
    },
    kaboomSignatureContainer: {
      position: 'absolute',
      bottom: 42,
      alignSelf: 'center',
      alignItems: 'center',
      zIndex: 12,
    },
    kaboomPlayerNameText: {
      fontFamily: Fonts.headings,
      fontSize: 13,
      fontWeight: '900',
      color: '#FFFFFF',
      letterSpacing: 1,
      textShadowColor: '#000000',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    kaboomInsertLabel: {
      fontFamily: Fonts.body,
      fontSize: 7,
      color: '#FFCD00',
      fontWeight: 'bold',
      letterSpacing: 0.5,
    },

    // DOWNTOWN TEMPLATE STYLES
    downtownPlayerFrame: {
      width: 170,
      height: 180,
      position: 'absolute',
      alignSelf: 'center',
      top: 80,
      overflow: 'hidden',
      zIndex: 5,
    },
    downtownPlayerImage: {
      width: '100%',
      height: '100%',
    },
    downtownTitleContainer: {
      position: 'absolute',
      bottom: 45,
      alignSelf: 'center',
      zIndex: 12,
    },
    downtownTitleText: {
      fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : Platform.OS === 'web' ? 'Caveat' : 'cursive',
      fontSize: 32,
      color: '#047857',
      fontWeight: 'bold',
      textShadowColor: '#FFFFFF',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
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
