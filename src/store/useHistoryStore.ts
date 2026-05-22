import { create } from 'zustand';
import { Player, generateMockRankings } from './mockData';
import {
  getTeamNameForIndex,
  applyFormatAndSort,
  getUserTeamName,
  runFastSimulation
} from './_helpers';
import { DraftPick, BotProfile, HistoricalDraft, DraftSetup } from './types';
import { useAuthStore } from './useAuthStore';
import { usePlayerStore } from './usePlayerStore';
import { useDraftStore } from './useDraftStore';
import { useRankingsStore } from './useRankingsStore';
import { useSimulationStore } from './useSimulationStore';
import { log } from '../utils/logger';

const isWeb = typeof window !== 'undefined' && window.localStorage;

const getUserStorageKeys = () => {
  const userId = useAuthStore.getState().user?.id;
  if (userId) {
    return {
      HISTORICAL_DRAFTS: `mockmaxxing_historical_drafts_user_${userId}`,
      BOT_TRAINING_SIMS: `mockmaxxing_bot_training_sims_user_${userId}`,
      MY_RANKS: `mockmaxxing_my_ranks_user_${userId}`,
      MY_RANKS_NAME: `mockmaxxing_my_ranks_name_user_${userId}`
    };
  }
  return {
    HISTORICAL_DRAFTS: 'mockmaxxing_historical_drafts',
    BOT_TRAINING_SIMS: 'mockmaxxing_bot_training_sims',
    MY_RANKS: 'mockmaxxing_my_ranks',
    MY_RANKS_NAME: 'mockmaxxing_my_ranks_name'
  };
};

const getInitialHistoricalDrafts = (): HistoricalDraft[] => {
  try {
    if (isWeb) {
      const cached = window.localStorage.getItem(getUserStorageKeys().HISTORICAL_DRAFTS);
      if (cached) {
        return JSON.parse(cached);
      }
    }
  } catch (e) {
    log('HistoryStore', 'Failed to load cached historicalDrafts', e);
  }
  return [];
};

const getInitialBotTrainingSims = (): number => {
  try {
    if (isWeb) {
      const cached = window.localStorage.getItem(getUserStorageKeys().BOT_TRAINING_SIMS);
      if (cached) {
        return parseInt(cached, 10);
      }
    }
  } catch (e) {
    log('HistoryStore', 'Failed to load cached botTrainingSims', e);
  }
  return 0;
};

interface HistoryState {
  historicalDrafts: HistoricalDraft[];
  botTrainingSims: number;

  populateHistory: (count: number) => void;
  clearHistory: () => void;
  saveCurrentDraftToHistory: () => void;
  runBotSelfImprovementTraining: () => void;
  rehydrateUserData: () => void;
  setHistoryState: (updates: Partial<HistoryState>) => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  historicalDrafts: getInitialHistoricalDrafts(),
  botTrainingSims: getInitialBotTrainingSims(),

  setHistoryState: (updates) => set(updates),

  saveCurrentDraftToHistory: () => {
    const { historicalDrafts } = get();
    const { draftHistory, setup } = useDraftStore.getState();
    const players = usePlayerStore.getState().players;
    const botProfiles = useSimulationStore.getState().botProfiles;

    if (draftHistory.length === 0) return;
    
    // Group drafted players by team index
    const teamRosterPlayers: { [teamIdx: number]: Player[] } = {};
    for (let i = 0; i < setup.leagueSize; i++) {
      teamRosterPlayers[i] = [];
    }
    
    players.forEach(p => {
      if (p.draftedBy) {
        const pick = draftHistory.find(h => h.player.name === p.name);
        if (pick) {
          teamRosterPlayers[pick.teamIndex].push(p);
        }
      }
    });

    const calculateRosterPoints = (roster: Player[]): number => {
      let qb_max = 0;
      let rb1 = 0, rb2 = 0;
      let wr1 = 0, wr2 = 0;
      let te_max = 0;
      let k_max = 0;
      let dst_max = 0;
      let flex_max = 0;
      let totalPoints = 0;

      for (let i = 0; i < roster.length; i++) {
        const p = roster[i];
        const pts = p.projectedPoints;
        totalPoints += pts;
        const pos = p.position;

        if (pos === 'QB') {
          if (pts > qb_max) qb_max = pts;
        } else if (pos === 'RB') {
          if (pts > rb1) {
            if (rb2 > flex_max) flex_max = rb2;
            rb2 = rb1;
            rb1 = pts;
          } else if (pts > rb2) {
            if (rb2 > flex_max) flex_max = rb2;
            rb2 = pts;
          } else {
            if (pts > flex_max) flex_max = pts;
          }
        } else if (pos === 'WR') {
          if (pts > wr1) {
            if (wr2 > flex_max) flex_max = wr2;
            wr2 = wr1;
            wr1 = pts;
          } else if (pts > wr2) {
            if (wr2 > flex_max) flex_max = wr2;
            wr2 = pts;
          } else {
            if (pts > flex_max) flex_max = pts;
          }
        } else if (pos === 'TE') {
          if (pts > te_max) {
            if (te_max > flex_max) flex_max = te_max;
            te_max = pts;
          } else {
            if (pts > flex_max) flex_max = pts;
          }
        } else if (pos === 'K') {
          if (pts > k_max) k_max = pts;
        } else if (pos === 'DST') {
          if (pts > dst_max) dst_max = pts;
        }
      }

      let score = qb_max + rb1 + rb2 + wr1 + wr2 + te_max + flex_max + k_max + dst_max;
      const benchPoints = totalPoints - score;
      score += Math.max(0, benchPoints * 0.1);
      
      return score;
    };

    const teamBaselines: { [teamIndex: number]: number } = {};
    for (let i = 0; i < setup.leagueSize; i++) {
      teamBaselines[i] = calculateRosterPoints(teamRosterPlayers[i]);
    }

    const numWeeks = 14;
    const wins = Array(setup.leagueSize).fill(0);
    const playoffCounts = Array(setup.leagueSize).fill(0);
    
    const simCount = 10;
    const weeklyScores = new Float64Array(setup.leagueSize);
    const unpaired = new Int32Array(setup.leagueSize);
    const simWins = new Int32Array(setup.leagueSize);

    // Pre-allocated object structures to avoid garbage collection
    const standingRanks = Array.from({ length: setup.leagueSize }, (_, idx) => ({
      idx,
      wins: 0,
      score: 0
    }));

    for (let sim = 0; sim < simCount; sim++) {
      simWins.fill(0);
      for (let week = 0; week < numWeeks; week++) {
        for (let i = 0; i < setup.leagueSize; i++) {
          const variance = (Math.random() - 0.5) * 35;
          weeklyScores[i] = (teamBaselines[i] / numWeeks) + variance;
          unpaired[i] = i;
        }
        
        for (let i = setup.leagueSize - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = unpaired[i];
          unpaired[i] = unpaired[j];
          unpaired[j] = temp;
        }
        
        for (let m = 0; m < setup.leagueSize; m += 2) {
          const t1 = unpaired[m];
          const t2 = unpaired[m + 1];
          if (weeklyScores[t1] > weeklyScores[t2]) {
            simWins[t1]++;
          } else {
            simWins[t2]++;
          }
        }
      }
      
      for (let i = 0; i < setup.leagueSize; i++) {
        wins[i] += simWins[i];
      }
      
      for (let i = 0; i < setup.leagueSize; i++) {
        standingRanks[i].idx = i;
        standingRanks[i].wins = simWins[i];
        standingRanks[i].score = teamBaselines[i];
      }
      standingRanks.sort((a, b) => b.wins - a.wins || b.score - a.score);
      for (let rankIndex = 0; rankIndex < 4; rankIndex++) {
        playoffCounts[standingRanks[rankIndex].idx]++;
      }
    }
    
    const avgWins = Array(setup.leagueSize).fill(0);
    const avgLosses = Array(setup.leagueSize).fill(0);
    const playoffChances = Array(setup.leagueSize).fill(0);
    const grades = Array(setup.leagueSize).fill('B');
    
    for (let i = 0; i < setup.leagueSize; i++) {
      const w = wins[i] / simCount;
      avgWins[i] = Number(w.toFixed(1));
      avgLosses[i] = Number((numWeeks - w).toFixed(1));
      playoffChances[i] = Math.round((playoffCounts[i] / simCount) * 100);
      
      if (w >= 10.0) grades[i] = 'A+';
      else if (w >= 9.0) grades[i] = 'A';
      else if (w >= 8.0) grades[i] = 'B+';
      else if (w >= 7.0) grades[i] = 'B';
      else if (w >= 6.0) grades[i] = 'C';
      else grades[i] = 'D';
    }
    
    const valueScores = Array(setup.leagueSize).fill(0);
    for (let i = 0; i < setup.leagueSize; i++) {
      let totalDiff = 0;
      const picks = draftHistory.filter(h => h.teamIndex === i);
      picks.forEach(p => {
        totalDiff += (p.player.adp - p.pickNumber);
      });
      valueScores[i] = picks.length > 0 ? Number((totalDiff / picks.length).toFixed(1)) : 0;
    }
    
    const userGradeResult = useDraftStore.getState().getDraftGrade();

    const teams = Array.from({ length: setup.leagueSize }, (_, idx) => {
      const name = getTeamNameForIndex(idx, setup.userPosition);
      let strategyCamp: BotProfile['strategyCamp'] = 'Balanced';
      let expertPreference: BotProfile['expertPreference'] = 'ECR Consensus';
      
      if (name === getUserTeamName()) {
        strategyCamp = (setup.userStrategy || 'Balanced') as BotProfile['strategyCamp'];
        expertPreference = setup.rankingsBase as BotProfile['expertPreference'];
      } else {
        const profile = botProfiles[name];
        if (profile) {
          strategyCamp = profile.strategyCamp;
          expertPreference = profile.expertPreference;
        }
      }
      
      const isUser = name === getUserTeamName();
      
      return {
        teamIndex: idx,
        teamName: name,
        strategyCamp,
        expertPreference,
        grade: isUser ? userGradeResult.grade : grades[idx],
        wins: isUser ? userGradeResult.projectedWins : avgWins[idx],
        losses: isUser ? userGradeResult.projectedLosses : avgLosses[idx],
        playoffChance: isUser ? userGradeResult.playoffChance : playoffChances[idx],
        roster: teamRosterPlayers[idx].map(p => ({
          name: p.name,
          position: p.position,
          rank: p.rank,
          adp: p.adp,
          projectedPoints: p.projectedPoints,
          espnId: p.espnId,
          bye: p.bye
        }))
      };
    });

    const newDraft: HistoricalDraft = {
      id: `draft_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
      timestamp: Date.now(),
      grade: userGradeResult.grade,
      valueScore: userGradeResult.valueScore,
      playoffChance: userGradeResult.playoffChance,
      projectedWins: userGradeResult.projectedWins,
      projectedLosses: userGradeResult.projectedLosses,
      userPosition: setup.userPosition,
      leagueSize: setup.leagueSize,
      opponentStyle: setup.opponentStyle,
      leagueFormat: setup.leagueFormat,
      rankingsBase: setup.rankingsBase,
      userStrategy: setup.userStrategy || 'Balanced',
      passingTdPoints: setup.passingTdPoints,
      tePremium: setup.tePremium,
      flexCount: setup.flexCount,
      teams
    };

    const updatedHistory = [newDraft, ...historicalDrafts];
    if (isWeb) {
      try {
        window.localStorage.setItem(getUserStorageKeys().HISTORICAL_DRAFTS, JSON.stringify(updatedHistory));
      } catch (cacheErr) {
        log('HistoryStore', 'Failed to cache historical drafts', cacheErr);
      }
    }
    set({ historicalDrafts: updatedHistory });
  },

  populateHistory: (count) => {
    const setup = useDraftStore.getState().setup;
    const myRanks = useRankingsStore.getState().myRanks;
    const botProfiles = useSimulationStore.getState().botProfiles;
    const botTrainingSims = get().botTrainingSims;

    const { historicalDrafts } = get();
    const newSims: HistoricalDraft[] = [];
    const trainingIncrement = count;
    
    const formats: ('Standard' | 'Half-PPR' | 'PPR' | 'Dynasty')[] = ['Standard', 'Half-PPR', 'PPR'];
    const strategies: ('Late QB/TE Focus' | 'Hero RB' | 'Zero RB' | 'Balanced' | 'Robust RB' | 'Elite QB/TE Premium')[] = ['Late QB/TE Focus', 'Hero RB', 'Zero RB', 'Balanced', 'Robust RB', 'Elite QB/TE Premium'];
    
    // Pre-sort player databases for each format to avoid redundant ECR calculations in the hot loop
    const preSortedByFormat = {
      'Standard': applyFormatAndSort(generateMockRankings(), 'Standard', setup.rankingsBase, myRanks),
      'Half-PPR': applyFormatAndSort(generateMockRankings(), 'Half-PPR', setup.rankingsBase, myRanks),
      'PPR': applyFormatAndSort(generateMockRankings(), 'PPR', setup.rankingsBase, myRanks),
      'Dynasty': applyFormatAndSort(generateMockRankings(), 'Dynasty', setup.rankingsBase, myRanks)
    };
    
    for (let s = 0; s < count; s++) {
      const randomFormat = formats[s % formats.length];
      const randomStrategy = strategies[s % strategies.length];
      const randomUserPos = (s % 12) + 1;
      
      const simSetup: DraftSetup = {
        ...setup,
        leagueFormat: randomFormat,
        userStrategy: randomStrategy,
        userPosition: randomUserPos,
        opponentStyle: s % 3 === 0 ? 'Standard ADP' : s % 3 === 1 ? 'Expert Consensus' : 'Casual League'
      };
      
      const simulatedDraft = runFastSimulation(
        simSetup, 
        myRanks, 
        botProfiles, 
        botTrainingSims, 
        s % 12, 
        preSortedByFormat[randomFormat]
      );
      newSims.push(simulatedDraft);
    }
    
    const updatedHistory = [...newSims, ...historicalDrafts].slice(0, 1500);
    const nextBotTrainingSims = Math.min(10000, botTrainingSims + trainingIncrement);
    
    if (isWeb) {
      try {
        window.localStorage.setItem(getUserStorageKeys().HISTORICAL_DRAFTS, JSON.stringify(updatedHistory));
        window.localStorage.setItem(getUserStorageKeys().BOT_TRAINING_SIMS, String(nextBotTrainingSims));
      } catch (cacheErr) {
        log('HistoryStore', 'Failed to cache populated historical drafts', cacheErr);
      }
    }
    
    set({ 
      historicalDrafts: updatedHistory,
      botTrainingSims: nextBotTrainingSims
    });
  },

  clearHistory: () => {
    if (isWeb) {
      try {
        window.localStorage.removeItem(getUserStorageKeys().HISTORICAL_DRAFTS);
        window.localStorage.setItem(getUserStorageKeys().BOT_TRAINING_SIMS, '0');
      } catch (cacheErr) {
        log('HistoryStore', 'Failed to clear cached historical drafts', cacheErr);
      }
    }
    set({ historicalDrafts: [], botTrainingSims: 0 });
  },

  runBotSelfImprovementTraining: () => {
    const nextBotTrainingSims = 10000;
    if (isWeb) {
      try {
        window.localStorage.setItem(getUserStorageKeys().BOT_TRAINING_SIMS, '10000');
      } catch (cacheErr) {
        log('HistoryStore', 'Failed to save training sims', cacheErr);
      }
    }
    set({ botTrainingSims: nextBotTrainingSims });
  },

  rehydrateUserData: () => {
    const keys = getUserStorageKeys();
    let userDrafts: HistoricalDraft[] = [];
    let userSims = 0;
    let userRanks: Player[] | null = null;
    let userRanksName: string | null = null;

    try {
      if (isWeb) {
        const cachedDrafts = window.localStorage.getItem(keys.HISTORICAL_DRAFTS);
        if (cachedDrafts) userDrafts = JSON.parse(cachedDrafts);

        const cachedSims = window.localStorage.getItem(keys.BOT_TRAINING_SIMS);
        if (cachedSims) userSims = parseInt(cachedSims, 10);

        const cachedRanks = window.localStorage.getItem(keys.MY_RANKS);
        if (cachedRanks) userRanks = JSON.parse(cachedRanks);

        const cachedRanksName = window.localStorage.getItem(keys.MY_RANKS_NAME);
        if (cachedRanksName) userRanksName = cachedRanksName;
      }
    } catch (e) {
      log('HistoryStore', 'Failed to rehydrate user data:', e);
    }

    set({
      historicalDrafts: userDrafts,
      botTrainingSims: userSims,
    });
    
    useRankingsStore.getState().setRankingsState({
      myRanks: userRanks,
      myRanksName: userRanksName
    });
  }
}));
