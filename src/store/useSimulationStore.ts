import { create } from 'zustand';
import { Player, generateMockRankings } from './mockData';
import {
  BOT_OPTIMIZED_PARAMS,
  DEFAULT_BOT_PROFILES,
  getUserTeamName,
  runFastSimulation,
  applyFormatAndSort
} from './_helpers';
import { DraftPick, BotProfile, HistoricalDraft, DraftSetup } from './types';
import liveMetricsData from '../../scratch_live_metrics.json';
import { useAuthStore } from './useAuthStore';
import { usePlayerStore } from './usePlayerStore';
import { useDraftStore } from './useDraftStore';
import { useRankingsStore } from './useRankingsStore';
import { useHistoryStore } from './useHistoryStore';
import { log } from '../utils/logger';

interface SimulationStats {
  totalSims: number;
  botRecords: { [botName: string]: { wins: number; losses: number } };
  strategyRecords: { [strategyCamp: string]: { wins: number; losses: number } };
  slotRecords: { [slotNumber: number]: { wins: number; losses: number } };
  parameterMutations: { [strategyCamp: string]: { [paramName: string]: number } };
  rosterViolations: number;
}

interface SimulationState {
  botProfiles: { [name: string]: BotProfile };
  liveSimRunning: boolean;
  liveSimStats: SimulationStats;

  startLiveSimulationLoop: () => void;
  stopLiveSimulationLoop: () => void;
  resetLiveSimulationStats: () => void;
  clearSimulatedCohorts: () => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  botProfiles: DEFAULT_BOT_PROFILES,
  liveSimRunning: false,
  liveSimStats: {
    totalSims: liveMetricsData.totalSims,
    botRecords: {
      ...liveMetricsData.botRecords,
      'Sophia': { wins: 56984200.0, losses: 62058000.0 },
      'William': { wins: 61380000.0, losses: 57468300.0 }
    },
    strategyRecords: liveMetricsData.strategyRecords,
    slotRecords: liveMetricsData.slotRecords as any,
    parameterMutations: liveMetricsData.parameterMutations as any,
    rosterViolations: liveMetricsData.rosterViolations,
  },

  startLiveSimulationLoop: () => {
    const { liveSimRunning } = get();
    if (liveSimRunning) return;
    set({ liveSimRunning: true });

    // Local accumulator to avoid high-frequency React state updates (which cause scroll lag & layout thrashing)
    let accumulatedStats = { ...get().liveSimStats };
    let lastUiUpdate = Date.now();

    const runBatch = () => {
      if (!get().liveSimRunning) {
        // Flush final stats to store on stop
        set({ liveSimStats: accumulatedStats });
        return;
      }
      const setup = useDraftStore.getState().setup;
      const myRanks = useRankingsStore.getState().myRanks;
      const botProfiles = get().botProfiles;
      const botTrainingSims = useHistoryStore.getState().botTrainingSims;
      
      const batchSize = 250; // Increased to 250 (10x larger batch size)
      const nextBotRecords = { ...accumulatedStats.botRecords };
      const nextStrategyRecords = { ...accumulatedStats.strategyRecords };
      const nextSlotRecords = { ...accumulatedStats.slotRecords };
      let violations = accumulatedStats.rosterViolations;
      
      // Pre-generate and pre-sort player database once per batch to avoid redundant ECR mapping and sorting
      const basePlayers = applyFormatAndSort(generateMockRankings(), setup.leagueFormat, setup.rankingsBase, myRanks);
      
      for (let i = 0; i < batchSize; i++) {
        const offset = Math.floor(Math.random() * 12);
        const randomUserPos = (Math.floor(Math.random() * 12)) + 1;
        
        // Select a coach to simulate
        const registeredList = Object.values(useAuthStore.getState().registeredUsers);
        let targetCoachName = getUserTeamName();
        let targetUserPos = randomUserPos;
        
        if (registeredList.length > 0) {
          if (Math.random() > 0.4) {
            const randUser = registeredList[Math.floor(Math.random() * registeredList.length)];
            targetCoachName = randUser.name;
            if (randUser.preferences && typeof randUser.preferences.draftPos === 'number') {
              targetUserPos = randUser.preferences.draftPos;
            }
          }
        }

        const simSetup = {
          ...setup,
          userPosition: targetUserPos,
          opponentStyle: Math.random() > 0.5 ? 'Standard ADP' : 'Expert Consensus'
        } as DraftSetup;

        const draft = runFastSimulation(simSetup, myRanks, botProfiles, botTrainingSims, offset, basePlayers, targetCoachName);
        
        draft.teams.forEach(team => {
          let qb = 0, rb = 0, wr = 0, te = 0, k = 0, dst = 0;
          for (let pIdx = 0; pIdx < team.roster.length; pIdx++) {
            const pos = team.roster[pIdx].position;
            if (pos === 'QB') qb++;
            else if (pos === 'RB') rb++;
            else if (pos === 'WR') wr++;
            else if (pos === 'TE') te++;
            else if (pos === 'K') k++;
            else if (pos === 'DST') dst++;
          }
          if (qb < 1 || rb < 2 || wr < 2 || te < 1 || k < 1 || dst < 1) {
            violations++;
          }

          const name = team.teamName;
          if (!nextBotRecords[name]) nextBotRecords[name] = { wins: 0, losses: 0 };
          nextBotRecords[name].wins += team.wins;
          nextBotRecords[name].losses += team.losses;

          const camp = team.strategyCamp;
          if (!nextStrategyRecords[camp]) nextStrategyRecords[camp] = { wins: 0, losses: 0 };
          nextStrategyRecords[camp].wins += team.wins;
          nextStrategyRecords[camp].losses += team.losses;
        });

        draft.teams.forEach(team => {
          const slot = team.teamIndex + 1;
          if (!nextSlotRecords[slot]) nextSlotRecords[slot] = { wins: 0, losses: 0 };
          nextSlotRecords[slot].wins += team.wins;
          nextSlotRecords[slot].losses += team.losses;
        });
      }

      // 1. Identify worst-performing strategy camp (Lowest Win Rate)
      let worstCamp = 'Robust RB';
      let lowestWinRate = 1.0;
      Object.entries(nextStrategyRecords).forEach(([camp, rec]) => {
        const total = rec.wins + rec.losses;
        if (total > 0) {
          const wr = rec.wins / total;
          if (wr < lowestWinRate) {
            lowestWinRate = wr;
            worstCamp = camp;
          }
        }
      });

      // 2. Directed reinforcement mutation to worst camp parameters
      const mutatedParams = JSON.parse(JSON.stringify(accumulatedStats.parameterMutations));
      const step = 0.5 + Math.random() * 1.5;
      
      if (worstCamp === 'Robust RB') {
        if (Math.random() > 0.5) {
          mutatedParams['Robust RB'].earlyRB_bonus = Number((Math.min(120, (mutatedParams['Robust RB'].earlyRB_bonus || 90) + step)).toFixed(2));
        } else {
          mutatedParams['Robust RB'].earlyQBTEWR_penalty = Number((Math.min(-10, (mutatedParams['Robust RB'].earlyQBTEWR_penalty || -25) + step)).toFixed(2));
        }
      } else if (worstCamp === 'Late QB/TE Focus') {
        if (Math.random() > 0.5) {
          mutatedParams['Late QB/TE Focus'].earlyQB_penalty = Number((Math.min(-20, (mutatedParams['Late QB/TE Focus'].earlyQB_penalty || -60) + step)).toFixed(2));
        } else {
          mutatedParams['Late QB/TE Focus'].earlyTE_penalty = Number((Math.min(-20, (mutatedParams['Late QB/TE Focus'].earlyTE_penalty || -60) + step)).toFixed(2));
        }
      } else if (worstCamp === 'Zero RB') {
        if (Math.random() > 0.5) {
          mutatedParams['Zero RB'].earlyRoundRB_penalty = Number((Math.min(-30, (mutatedParams['Zero RB'].earlyRoundRB_penalty || -90) + step)).toFixed(2));
        } else {
          mutatedParams['Zero RB'].earlyRoundWRTE_bonus = Number((Math.min(60, (mutatedParams['Zero RB'].earlyRoundWRTE_bonus || 25) + step)).toFixed(2));
        }
      } else if (worstCamp === 'Hero RB') {
        if (Math.random() > 0.5) {
          mutatedParams['Hero RB'].anchorRB_bonus = Number((Math.min(80, (mutatedParams['Hero RB'].anchorRB_bonus || 40) + step)).toFixed(2));
        } else {
          mutatedParams['Hero RB'].earlyRB2_penalty = Number((Math.min(-20, (mutatedParams['Hero RB'].earlyRB2_penalty || -65) + step)).toFixed(2));
        }
      } else if (worstCamp === 'Balanced') {
        if (Math.random() > 0.5) {
          mutatedParams['Balanced'].adpSteal_multiplier = Number((Math.min(3.0, (mutatedParams['Balanced'].adpSteal_multiplier || 1.2) + step * 0.05)).toFixed(2));
        } else {
          mutatedParams['Balanced'].adpGapThreshold = Number((Math.max(2, (mutatedParams['Balanced'].adpGapThreshold || 6) - 0.1)).toFixed(2));
        }
      } else if (worstCamp === 'Elite QB/TE Premium') {
        if (Math.random() > 0.5) {
          mutatedParams['Elite QB/TE Premium'].earlyQB_bonus = Number((Math.min(80, (mutatedParams['Elite QB/TE Premium'].earlyQB_bonus || 55) + step)).toFixed(2));
        } else {
          mutatedParams['Elite QB/TE Premium'].earlyTE_bonus = Number((Math.min(80, (mutatedParams['Elite QB/TE Premium'].earlyTE_bonus || 55) + step)).toFixed(2));
        }
      }

      // Add tiny exploration noise to ALL strategy parameters to keep them dynamic
      Object.keys(mutatedParams).forEach(camp => {
        Object.keys(mutatedParams[camp]).forEach(param => {
          if (typeof mutatedParams[camp][param] === 'number') {
            const noise = (Math.random() - 0.5) * 0.15;
            mutatedParams[camp][param] = Number((mutatedParams[camp][param] + noise).toFixed(2));
          }
        });
      });

      accumulatedStats = {
        totalSims: accumulatedStats.totalSims + batchSize,
        botRecords: nextBotRecords,
        strategyRecords: nextStrategyRecords,
        slotRecords: nextSlotRecords,
        parameterMutations: mutatedParams,
        rosterViolations: violations
      };

      // Throttled UI state commit (every 500ms) to ensure premium high-fps scrolling and zero layout thrashing
      const now = Date.now();
      if (now - lastUiUpdate >= 500) {
        set({ liveSimStats: accumulatedStats });
        lastUiUpdate = now;
      }

      setTimeout(runBatch, 10); // Decreased from 80ms to 10ms to achieve up to 80x throughput acceleration
    };

    runBatch();
  },

  stopLiveSimulationLoop: () => {
    set({ liveSimRunning: false });
  },

  resetLiveSimulationStats: () => {
    set({
      liveSimStats: {
        totalSims: 0,
        botRecords: {},
        strategyRecords: {},
        slotRecords: {},
        parameterMutations: BOT_OPTIMIZED_PARAMS as any,
        rosterViolations: 0
      }
    });
  },

  clearSimulatedCohorts: () => {
    const registeredNames = Object.values(useAuthStore.getState().registeredUsers).map(u => u.name);
    const defaultBotNames = Array.from(new Set([
      'Andy', 'Mike', 'Jason', 'Sarah', 'David', 'Jessica', 'Michael', 'Emily', 'James', 'Ashley', 'Robert',
      getUserTeamName(),
      ...registeredNames
    ]));
    const currentBotRecords = get().liveSimStats.botRecords;
    const cleanBotRecords: { [botName: string]: { wins: number; losses: number } } = {};
    const metricsBots = liveMetricsData.botRecords as any;
    
    defaultBotNames.forEach(name => {
      if (currentBotRecords[name]) {
        cleanBotRecords[name] = currentBotRecords[name];
      } else if (metricsBots[name]) {
        cleanBotRecords[name] = metricsBots[name];
      } else {
        cleanBotRecords[name] = { wins: 0, losses: 0 };
      }
    });

    set((state) => ({
      liveSimStats: {
        ...state.liveSimStats,
        botRecords: cleanBotRecords
      }
    }));
  },
}));
