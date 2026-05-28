import { create } from 'zustand';
import { Player, generateMockRankings } from './mockData';
import {
  getTeamIndexForPick,
  getTeamNameForIndex,
  getUserNextPick,
  getPlayerSuggestionScores,
  getPlayerSuggestionScore,
  calculateCpuPlayerScore,
  applyFormatAndSort,
  getUserTeamName
} from './_helpers';
import { DraftPick, BotProfile, HistoricalDraft, DraftSetup } from './types';
import { usePlayerStore } from './usePlayerStore';
import { useRankingsStore } from './useRankingsStore';
import { useHistoryStore } from './useHistoryStore';
import { log } from '../utils/logger';

interface DraftState {
  setup: DraftSetup;
  draftStatus: 'setup' | 'drafting' | 'summary';
  currentPick: number; // 1-based
  draftHistory: DraftPick[];
  cpuIsThinking: boolean;
  thinkingCpuName: string;
  
  updateSetup: (updates: Partial<DraftSetup>) => void;
  startDraft: () => void;
  triggerInstantDraft: () => void;
  resetDraft: () => void;
  draftPlayer: (rank: number, teamIndex: number, teamName: string) => void;
  simulateCpuTurn: (onUserTurnReached: () => void) => void;
  getSuggestedPicks: () => Player[];
  getTakePercentages: () => { [rank: number]: number };
  getUserRoster: () => Player[];
  getDraftGrade: () => {
    grade: string;
    valueScore: number;
    playoffChance: number;
    projectedWins: number;
    projectedLosses: number;
  };
  getSimulatedDraftProbabilities: () => { [rank: number]: number };
  setDraftState: (state: Partial<DraftState>) => void;
}

export const useDraftStore = create<DraftState>((set, get) => ({
  setup: {
    leagueSize: 12,
    userPosition: 1,
    rounds: 15,
    opponentStyle: 'Standard ADP',
    draftType: 'Snake',
    leagueFormat: 'Standard',
    rankingsBase: 'ECR Consensus',
    userStrategy: 'Late QB/TE Focus',
    passingTdPoints: 6,
    tePremium: false,
    flexCount: 1,
    year: 2026,
    rosterSlots: {
      QB: 1,
      RB: 2,
      WR: 2,
      TE: 1,
      FLEX: 1,
      K: 1,
      DST: 1,
      BENCH: 6,
      IR: 1
    }
  },
  draftStatus: 'setup',
  currentPick: 1,
  draftHistory: [],
  cpuIsThinking: false,
  thinkingCpuName: '',

  setDraftState: (updates) => set(updates),

  updateSetup: (updates) => set((state) => {
    const nextSetup = { ...state.setup, ...updates };
    // bounds check userPosition if leagueSize changes
    if (nextSetup.userPosition > nextSetup.leagueSize) {
      nextSetup.userPosition = nextSetup.leagueSize;
    }
    
    // If format, rankings base, or year changed and we're in setup status, re-apply and re-sort
    if ((updates.leagueFormat || updates.rankingsBase || updates.year) && state.draftStatus === 'setup') {
      const myRanks = useRankingsStore.getState().myRanks;
      const nextPlayers = applyFormatAndSort(
        generateMockRankings(updates.year !== undefined ? updates.year : nextSetup.year), 
        updates.leagueFormat || state.setup.leagueFormat,
        updates.rankingsBase || state.setup.rankingsBase,
        myRanks
      );
      usePlayerStore.getState().setPlayers(nextPlayers);
    }
    
    return { setup: nextSetup };
  }),

  startDraft: () => {
    const { setup } = get();
    const myRanks = useRankingsStore.getState().myRanks;
    const freshPlayers = applyFormatAndSort(generateMockRankings(setup.year), setup.leagueFormat, setup.rankingsBase, myRanks);
    usePlayerStore.getState().setPlayers(freshPlayers);
    set({
      draftStatus: 'drafting',
      currentPick: 1,
      draftHistory: [],
      cpuIsThinking: false,
      thinkingCpuName: '',
    });
  },

  triggerInstantDraft: () => {
    const { setup } = get();
    const myRanks = useRankingsStore.getState().myRanks;
    const botTrainingSims = useHistoryStore.getState().botTrainingSims;
    const freshPlayers = applyFormatAndSort(generateMockRankings(setup.year), setup.leagueFormat, setup.rankingsBase, myRanks);
    const draftHistory: DraftPick[] = [];
    const totalPicks = setup.rounds * setup.leagueSize;

    const teamRosterCounts: { [idx: number]: { QB: number; RB: number; WR: number; TE: number; K: number; DST: number } } = {};
    const teamRosterPlayers: { [idx: number]: Player[] } = {};
    for (let idx = 0; idx < setup.leagueSize; idx++) {
      teamRosterCounts[idx] = { QB: 0, RB: 0, WR: 0, TE: 0, K: 0, DST: 0 };
      teamRosterPlayers[idx] = [];
    }

    let firstUndraftedCursor = 0;

    for (let pick = 1; pick <= totalPicks; pick++) {
      const activeTeamIdx = getTeamIndexForPick(pick, setup.leagueSize, setup.draftType);
      const teamName = getTeamNameForIndex(activeTeamIdx, setup.userPosition);

      while (firstUndraftedCursor < freshPlayers.length && freshPlayers[firstUndraftedCursor].draftedBy) {
        firstUndraftedCursor++;
      }
      if (firstUndraftedCursor >= freshPlayers.length) break;

      const roster = teamRosterCounts[activeTeamIdx];
      const isMissingQB = roster.QB === 0;
      const isMissingTE = roster.TE === 0;
      const isMissingK = roster.K === 0;
      const isMissingDST = roster.DST === 0;
      const isMissingRB = roster.RB < 2;
      const isMissingWR = roster.WR < 2;

      const neededStartingSlots =
        (isMissingQB ? 1 : 0) +
        (isMissingTE ? 1 : 0) +
        (isMissingK ? 1 : 0) +
        (isMissingDST ? 1 : 0) +
        (isMissingRB ? 2 - roster.RB : 0) +
        (isMissingWR ? 2 - roster.WR : 0);
      const currentRound = Math.ceil(pick / setup.leagueSize);
      const roundsRemaining = setup.rounds - currentRound + 1;

      let pool: Player[] = [];
      if (neededStartingSlots >= roundsRemaining) {
        let cursor = firstUndraftedCursor;
        while (pool.length < 20 && cursor < freshPlayers.length) {
          const p = freshPlayers[cursor];
          if (!p.draftedBy) {
            const pos = p.position;
            const match = (pos === 'QB' && isMissingQB) ||
                          (pos === 'TE' && isMissingTE) ||
                          (pos === 'K' && isMissingK) ||
                          (pos === 'DST' && isMissingDST) ||
                          (pos === 'RB' && isMissingRB) ||
                          (pos === 'WR' && isMissingWR);
            if (match) {
              pool.push(p);
            }
          }
          cursor++;
        }
        if (pool.length === 0) {
          let fallbackCursor = firstUndraftedCursor;
          while (pool.length < 20 && fallbackCursor < freshPlayers.length) {
            const p = freshPlayers[fallbackCursor];
            if (!p.draftedBy) {
              pool.push(p);
            }
            fallbackCursor++;
          }
        }
      } else {
        let cursor = firstUndraftedCursor;
        while (pool.length < 20 && cursor < freshPlayers.length) {
          const p = freshPlayers[cursor];
          if (!p.draftedBy) {
            pool.push(p);
          }
          cursor++;
        }
      }

      let chosenPlayer = pool[0];
      let bestScore = -10000;

      for (let i = 0; i < pool.length; i++) {
        const player = pool[i];
        let score = 0;
        if (activeTeamIdx === setup.userPosition - 1) {
          const bestAvailableRank = freshPlayers[firstUndraftedCursor].rank;
          score = getPlayerSuggestionScore(
            player,
            pick,
            setup,
            roster,
            bestAvailableRank
          );
        } else {
          score = calculateCpuPlayerScore(
            player,
            activeTeamIdx,
            teamName,
            pick,
            setup,
            roster,
            botTrainingSims
          );
        }

        if (score > bestScore) {
          bestScore = score;
          chosenPlayer = player;
        }
      }

      if (chosenPlayer) {
        chosenPlayer.draftedBy = teamName;
        teamRosterPlayers[activeTeamIdx].push(chosenPlayer);
        roster[chosenPlayer.position]++;

        draftHistory.push({
          pickNumber: pick,
          round: Math.ceil(pick / setup.leagueSize),
          teamIndex: activeTeamIdx,
          teamName,
          player: { ...chosenPlayer, draftedBy: teamName }
        });
      }
    }

    usePlayerStore.getState().setPlayers(freshPlayers);
    set({
      draftHistory,
      currentPick: totalPicks + 1,
      draftStatus: 'summary',
      cpuIsThinking: false,
      thinkingCpuName: '',
    });

    useHistoryStore.getState().saveCurrentDraftToHistory();
  },

  resetDraft: () => {
    log('DraftStore', '[Store Telemetry] resetDraft() invoked!');
    const { setup } = get();
    const myRanks = useRankingsStore.getState().myRanks;
    const freshPlayers = applyFormatAndSort(generateMockRankings(setup.year), setup.leagueFormat, setup.rankingsBase, myRanks);
    usePlayerStore.getState().setPlayers(freshPlayers);
    const randomPos = 1;
    set({
      draftStatus: 'setup',
      currentPick: 1,
      draftHistory: [],
      cpuIsThinking: false,
      thinkingCpuName: '',
      setup: {
        ...setup,
        userPosition: randomPos
      }
    });
  },

  draftPlayer: (rank, teamIndex, teamName) => {
    const players = usePlayerStore.getState().players;
    const updatedPlayers = players.map((p) => {
      if (p.rank === rank) {
        return { ...p, draftedBy: teamName };
      }
      return p;
    });
    usePlayerStore.getState().setPlayers(updatedPlayers);

    const player = players.find((p) => p.rank === rank);
    if (!player) return;

    set((state) => {
      const round = Math.ceil(state.currentPick / state.setup.leagueSize);
      const newPick: DraftPick = {
        pickNumber: state.currentPick,
        round,
        teamIndex,
        teamName,
        player: { ...player, draftedBy: teamName },
      };

      const nextPick = state.currentPick + 1;
      const totalPicks = state.setup.rounds * state.setup.leagueSize;
      const nextStatus = nextPick > totalPicks ? 'summary' : 'drafting';

      if (nextStatus === 'summary') {
        setTimeout(() => {
          useHistoryStore.getState().saveCurrentDraftToHistory();
        }, 50);
      }

      return {
        draftHistory: [...state.draftHistory, newPick],
        currentPick: nextPick,
        draftStatus: nextStatus,
        cpuIsThinking: false,
        thinkingCpuName: '',
      };
    });
  },

  simulateCpuTurn: (onUserTurnReached) => {
    const { draftStatus, currentPick, setup, draftPlayer } = get();
    
    if (draftStatus !== 'drafting') return;
    
    const maxPicks = setup.rounds * setup.leagueSize;
    if (currentPick > maxPicks) {
      set({ draftStatus: 'summary' });
      return;
    }

    const activeTeamIdx = getTeamIndexForPick(currentPick, setup.leagueSize, setup.draftType);
    
    // Check if it's the User's turn
    if (activeTeamIdx === setup.userPosition - 1) {
      onUserTurnReached();
      return;
    }

    const teamName = getTeamNameForIndex(activeTeamIdx, setup.userPosition);
    set({ cpuIsThinking: true, thinkingCpuName: teamName });

    // CPU Drafting Algorithm
    setTimeout(() => {
      const { currentPick: verifiedPick } = get();
      log('DraftStore', `[CPU Debug] Timeout fired for pick ${currentPick}. verifiedPick: ${verifiedPick}, teamName: ${teamName}`);
      if (verifiedPick !== currentPick) {
        log('DraftStore', `[CPU Debug] Pick mismatch (race condition check aborted): verifiedPick (${verifiedPick}) !== currentPick (${currentPick})`);
        return; // Prevent race conditions
      }

      try {
        const currentPlayers = usePlayerStore.getState().players;
        const botTrainingSims = useHistoryStore.getState().botTrainingSims;
        
        // Roster need check
        const cpuRoster = currentPlayers.filter(p => p.draftedBy === teamName);
        const qbCount = cpuRoster.filter(p => p.position === 'QB').length;
        const rbCount = cpuRoster.filter(p => p.position === 'RB').length;
        const wrCount = cpuRoster.filter(p => p.position === 'WR').length;
        const teCount = cpuRoster.filter(p => p.position === 'TE').length;
        const kCount = cpuRoster.filter(p => p.position === 'K').length;
        const dstCount = cpuRoster.filter(p => p.position === 'DST').length;

        const available = currentPlayers.filter(p => !p.draftedBy);

        const slots = setup.rosterSlots || {
          QB: 1,
          RB: 2,
          WR: 2,
          TE: 1,
          FLEX: setup.flexCount || 1,
          K: 1,
          DST: 1,
          BENCH: 6,
          IR: 1
        };

        // Find best player based on needs using the advanced archetype and ECR system
        const missingPositions: string[] = [];
        if (qbCount < slots.QB) missingPositions.push('QB');
        if (teCount < slots.TE) missingPositions.push('TE');
        if (kCount < slots.K) missingPositions.push('K');
        if (dstCount < slots.DST) missingPositions.push('DST');
        if (rbCount < slots.RB) missingPositions.push('RB');
        if (wrCount < slots.WR) missingPositions.push('WR');

        const neededStartingSlots =
          Math.max(0, slots.QB - qbCount) +
          Math.max(0, slots.TE - teCount) +
          Math.max(0, slots.K - kCount) +
          Math.max(0, slots.DST - dstCount) +
          Math.max(0, slots.RB - rbCount) +
          Math.max(0, slots.WR - wrCount);
        const currentRound = Math.ceil(currentPick / setup.leagueSize);
        const roundsRemaining = setup.rounds - currentRound + 1;

        let pool: Player[];
        if (neededStartingSlots >= roundsRemaining) {
          const strictAvailable = available.filter(p => missingPositions.includes(p.position));
          pool = strictAvailable.length > 0 ? strictAvailable.slice(0, 20) : available.slice(0, 20);
        } else {
          pool = available.slice(0, 20);
        }

        let chosenPlayer = pool[0]; // fallback
        let bestScore = -10000;

        log('DraftStore', `[CPU Debug] Pick ${currentPick}: ${teamName} pool size: ${pool.length}`);

        pool.forEach(player => {
          const score = calculateCpuPlayerScore(
            player,
            activeTeamIdx,
            teamName,
            currentPick,
            setup,
            {
              QB: qbCount,
              RB: rbCount,
              WR: wrCount,
              TE: teCount,
              K: kCount,
              DST: dstCount
            },
            botTrainingSims
          );

          if (score > bestScore) {
            bestScore = score;
            chosenPlayer = player;
          }
        });

        if (chosenPlayer) {
          log('DraftStore', `[CPU Debug] Pick ${currentPick}: ${teamName} drafted ${chosenPlayer.name} with score ${bestScore}`);
          draftPlayer(chosenPlayer.rank, activeTeamIdx, teamName);
        } else {
          log('DraftStore', `[CPU Debug] Pick ${currentPick}: No player chosen!`);
        }
      } catch (err) {
        log('DraftStore', `[CPU Debug] Pick ${currentPick}: Error in scoring/draft logic:`, err);
        set({ cpuIsThinking: false, thinkingCpuName: '' });
        
        try {
          const currentPlayers = usePlayerStore.getState().players;
          const available = currentPlayers.filter(p => !p.draftedBy);
          if (available.length > 0) {
            log('DraftStore', `[CPU Debug] Pick ${currentPick}: Exception fallback drafting player ${available[0].name}`);
            draftPlayer(available[0].rank, activeTeamIdx, teamName);
          }
        } catch (fallbackErr) {
          log('DraftStore', `[CPU Debug] Pick ${currentPick}: Critical error in exception fallback:`, fallbackErr);
        }
      }
    }, 112); // Animated 112ms pick delay
  },

  getSuggestedPicks: () => {
    const { currentPick, setup, getTakePercentages } = get();
    const players = usePlayerStore.getState().players;
    const available = players.filter(p => !p.draftedBy);
    if (available.length === 0) return [];

    const userRoster = players.filter(p => p.draftedBy === getUserTeamName());
    let candidates = getPlayerSuggestionScores(available, currentPick, setup, userRoster);

    if (candidates.length === 0) return [];

    const bestAvailableRank = available.length > 0 ? available[0].rank : 1;

    // Safety net
    if (candidates.filter(c => c.finalScore > 0).length === 0) {
      candidates = available.map(player => ({
        player,
        finalScore: 260 - (player.rank - bestAvailableRank) * 5.0
      }));
    }

    const takePercentages = getTakePercentages();

    const validCandidates = candidates
      .filter(c => c.finalScore > 0)
      .sort((a, b) => b.finalScore - a.finalScore);

    if (validCandidates.length === 0) return [];

    const suggested = validCandidates
      .filter(c => (takePercentages[c.player.rank] ?? 0) >= 70)
      .map(c => c.player);

    if (suggested.length === 0 && validCandidates.length > 0) {
      return [validCandidates[0].player];
    }

    return suggested;
  },

  getTakePercentages: () => {
    const { currentPick, setup } = get();
    const players = usePlayerStore.getState().players;
    const available = players.filter(p => !p.draftedBy);
    const userRoster = players.filter(p => p.draftedBy === getUserTeamName());

    let candidates = getPlayerSuggestionScores(available, currentPick, setup, userRoster);
    if (candidates.length === 0) return {};

    const bestAvailableRank = available.length > 0 ? available[0].rank : 1;

    if (candidates.filter(c => c.finalScore > 0).length === 0) {
      candidates = available.map(player => ({
        player,
        finalScore: 260 - (player.rank - bestAvailableRank) * 5.0
      }));
    }

    let bestScore = -100000;
    candidates.forEach(c => {
      if (c.finalScore > bestScore) {
        bestScore = c.finalScore;
      }
    });

    const currentRound = Math.ceil(currentPick / setup.leagueSize);
    const temp = Math.min(25.0, 6.0 + currentRound * 1.2);

    const takePercentages: { [rank: number]: number } = {};
    candidates.forEach(c => {
      if (c.finalScore <= 0 || bestScore <= 0) {
        takePercentages[c.player.rank] = 0;
      } else {
        const scoreGap = c.finalScore - bestScore;
        const takePercent = Math.round(Math.exp(scoreGap / temp) * 100);
        takePercentages[c.player.rank] = Math.max(0, Math.min(100, takePercent));
      }
    });

    players.forEach(p => {
      if (takePercentages[p.rank] === undefined) {
        takePercentages[p.rank] = 0;
      }
    });

    return takePercentages;
  },

  getUserRoster: () => {
    const players = usePlayerStore.getState().players;
    return players.filter(p => p.draftedBy === getUserTeamName());
  },

  getDraftGrade: () => {
    const { draftHistory, setup } = get();
    const players = usePlayerStore.getState().players;
    
    // Group drafted players by team index
    const teamRosters: { [teamIdx: number]: Player[] } = {};
    for (let i = 0; i < setup.leagueSize; i++) {
      teamRosters[i] = [];
    }
    
    players.forEach(p => {
      if (p.draftedBy) {
        const pick = draftHistory.find(h => h.player.name === p.name);
        if (pick) {
          teamRosters[pick.teamIndex].push(p);
        }
      }
    });

    const userIndex = setup.userPosition - 1;
    const userRoster = teamRosters[userIndex] || [];
    
    if (userRoster.length === 0) {
      return { grade: '8', valueScore: 0, playoffChance: 50, projectedWins: 7, projectedLosses: 7 };
    }

    const calculateRosterScore = (roster: Player[]): number => {
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
      teamBaselines[i] = calculateRosterScore(teamRosters[i]);
    }

    const simCount = 1000;
    const numWeeks = 14;
    let userWinsTotal = 0;
    let userLossesTotal = 0;
    let userPlayoffsCount = 0;

    const weeklyScores = new Float64Array(setup.leagueSize);
    const unpaired = new Int32Array(setup.leagueSize);
    const wins = new Int32Array(setup.leagueSize);
    
    const standingRanks = Array.from({ length: setup.leagueSize }, (_, idx) => ({
      idx,
      wins: 0,
      score: 0
    }));

    for (let sim = 0; sim < simCount; sim++) {
      wins.fill(0);
      
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
            wins[t1]++;
          } else {
            wins[t2]++;
          }
        }
      }
      
      for (let i = 0; i < setup.leagueSize; i++) {
        standingRanks[i].idx = i;
        standingRanks[i].wins = wins[i];
        standingRanks[i].score = teamBaselines[i];
      }
      
      standingRanks.sort((a, b) => b.wins - a.wins || b.score - a.score);
      
      let userRank = 12;
      for (let rankIdx = 0; rankIdx < setup.leagueSize; rankIdx++) {
        if (standingRanks[rankIdx].idx === userIndex) {
          userRank = rankIdx + 1;
          break;
        }
      }
      
      userWinsTotal += wins[userIndex];
      userLossesTotal += (numWeeks - wins[userIndex]);
      
      if (userRank <= 4) {
        userPlayoffsCount++;
      }
    }

    const avgWins = userWinsTotal / simCount;
    const avgLosses = userLossesTotal / simCount;
    const playoffChance = Math.round((userPlayoffsCount / simCount) * 100);

    let totalDiff = 0;
    const userPicks = draftHistory.filter(h => h.teamName === getUserTeamName());
    userPicks.forEach(pick => {
      totalDiff += (pick.player.adp - pick.pickNumber);
    });
    const avgDiff = userPicks.length > 0 ? totalDiff / userPicks.length : 0;

    let grade = '8';
    if (avgWins >= 10.0) grade = '10';
    else if (avgWins >= 9.0) grade = '9';
    else if (avgWins >= 8.0) grade = '8';
    else if (avgWins >= 7.0) grade = '7';
    else if (avgWins >= 6.0) grade = '6';
    else if (avgWins >= 5.0) grade = '5';
    else grade = '4';

    return {
      grade,
      valueScore: Number(avgDiff.toFixed(1)),
      playoffChance,
      projectedWins: Number(avgWins.toFixed(1)),
      projectedLosses: Number(avgLosses.toFixed(1))
    };
  },

  getSimulatedDraftProbabilities: () => {
    const { currentPick, setup, draftHistory } = get();
    const players = usePlayerStore.getState().players;
    const available = players.filter(p => !p.draftedBy);
    
    const userNextPick = getUserNextPick(currentPick, setup);
    if (!userNextPick) {
      return {};
    }

    const simCount = 1000;
    const draftedCounts: { [rank: number]: number } = {};
    available.forEach(p => {
      draftedCounts[p.rank] = 0;
    });

    const teamRostersBase: { [teamIdx: number]: { QB: number; RB: number; WR: number; TE: number; K: number; DST: number } } = {};
    for (let i = 0; i < setup.leagueSize; i++) {
      teamRostersBase[i] = { QB: 0, RB: 0, WR: 0, TE: 0, K: 0, DST: 0 };
    }
    draftHistory.forEach(h => {
      teamRostersBase[h.teamIndex][h.player.position]++;
    });

    const botTrainingSims = useHistoryStore.getState().botTrainingSims;

    for (let sim = 0; sim < simCount; sim++) {
      const simDraftedSet = new Set<number>();
      
      const simRosters: { [teamIdx: number]: { QB: number; RB: number; WR: number; TE: number; K: number; DST: number } } = {};
      for (let i = 0; i < setup.leagueSize; i++) {
        simRosters[i] = { ...teamRostersBase[i] };
      }

      for (let p = currentPick; p < userNextPick; p++) {
        const activeTeamIdx = getTeamIndexForPick(p, setup.leagueSize, setup.draftType);
        const activeTeamName = getTeamNameForIndex(activeTeamIdx, setup.userPosition);
        
        let bestPlayer: Player | null = null;
        let bestScore = -10000;
        
        let checked = 0;
        for (let i = 0; i < available.length && checked < 20; i++) {
          const player = available[i];
          if (simDraftedSet.has(player.rank)) continue;
          checked++;
          
          const teamRoster = simRosters[activeTeamIdx];
          
          const score = calculateCpuPlayerScore(
            player,
            activeTeamIdx,
            activeTeamName,
            p,
            setup,
            teamRoster,
            botTrainingSims
          );
          
          if (score > bestScore) {
            bestScore = score;
            bestPlayer = player;
          }
        }

        if (!bestPlayer || bestScore < -9000) {
          for (let i = 0; i < available.length; i++) {
            const player = available[i];
            if (!simDraftedSet.has(player.rank)) {
              bestPlayer = player;
              break;
            }
          }
        }

        if (bestPlayer) {
          simDraftedSet.add(bestPlayer.rank);
          simRosters[activeTeamIdx][bestPlayer.position]++;
        }
      }

      simDraftedSet.forEach(rank => {
        if (draftedCounts[rank] !== undefined) {
          draftedCounts[rank]++;
        }
      });
    }

    const percentages: { [rank: number]: number } = {};
    available.forEach(p => {
      percentages[p.rank] = Math.round((draftedCounts[p.rank] / simCount) * 100);
    });

    return percentages;
  },
}));
