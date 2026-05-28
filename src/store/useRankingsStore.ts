import { create } from 'zustand';
import { Player, generateMockRankings, ESPN_ID_MAPPING } from './mockData';
import { applyFormatAndSort } from './_helpers';
import { useAuthStore } from './useAuthStore';
import { usePlayerStore } from './usePlayerStore';
import { useDraftStore } from './useDraftStore';
import { log } from '../utils/logger';
import { API_CONFIG } from '../config/api';

const isWeb = typeof window !== 'undefined' && window.localStorage;
const SYNC_TIME_KEY = 'mockmaxxing_last_synced_at';
const CACHE_KEY = 'mockmaxxing_cached_players';

const getUserStorageKeys = () => {
  const userId = useAuthStore.getState().user?.id;
  if (userId) {
    return {
      MY_RANKS: `mockmaxxing_my_ranks_user_${userId}`,
      MY_RANKS_NAME: `mockmaxxing_my_ranks_name_user_${userId}`
    };
  }
  return {
    MY_RANKS: 'mockmaxxing_my_ranks',
    MY_RANKS_NAME: 'mockmaxxing_my_ranks_name'
  };
};

const getInitialMyRanks = (): Player[] | null => {
  try {
    if (isWeb) {
      const cached = window.localStorage.getItem(getUserStorageKeys().MY_RANKS);
      if (cached) {
        return JSON.parse(cached);
      }
    }
  } catch (e) {
    log('RankingsStore', 'Failed to load cached myRanks', e);
  }
  return null;
};

const getInitialMyRanksName = (): string | null => {
  try {
    if (isWeb) {
      return window.localStorage.getItem(getUserStorageKeys().MY_RANKS_NAME);
    }
  } catch (e) {
    log('RankingsStore', 'Failed to load cached myRanksName', e);
  }
  return null;
};

const getInitialSyncTime = (): number | null => {
  try {
    if (isWeb) {
      const val = window.localStorage.getItem(SYNC_TIME_KEY);
      if (val) {
        return parseInt(val, 10);
      }
    }
  } catch (e) {
    log('RankingsStore', 'Failed to load sync time', e);
  }
  return null;
};

interface RankingsState {
  myRanks: Player[] | null;
  myRanksName: string | null;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error' | 'stale';
  lastSyncedAt: number | null;
  syncError: string | null;

  initializeMyRanks: (template?: 'consensus' | 'Andy' | 'Mike' | 'Jason' | 'blank', name?: string) => void;
  reorderMyRanks: (rank: number, direction: 'up' | 'down') => void;
  resetMyRanks: () => void;
  setMyRanks: (customList: Player[], name?: string) => void;
  syncRankings: (force?: boolean) => Promise<void>;
  setRankingsState: (updates: Partial<RankingsState>) => void;
}

export const useRankingsStore = create<RankingsState>((set, get) => ({
  myRanks: getInitialMyRanks(),
  myRanksName: getInitialMyRanksName(),
  syncStatus: 'idle',
  lastSyncedAt: getInitialSyncTime(),
  syncError: null,

  setRankingsState: (updates) => set(updates),

  initializeMyRanks: (template = 'consensus', name) => {
    const players = usePlayerStore.getState().players;
    const setup = useDraftStore.getState().setup;
    let baseList = [...players];
    
    const sheetName = name || (
      template === 'consensus' ? 'My Custom Top 250' :
      template === 'Andy' ? "Andy Holloway's Board Copy" :
      template === 'Mike' ? "Mike Wright's Board Copy" :
      template === 'Jason' ? "Jason Moore's Board Copy" :
      template === 'blank' ? 'My Custom Cheat Sheet' : 'My Imported Cheat Sheet'
    );

    if (isWeb) {
      try {
        window.localStorage.setItem(getUserStorageKeys().MY_RANKS_NAME, sheetName);
      } catch (cacheErr) {
        log('RankingsStore', 'Failed to cache custom rankings name', cacheErr);
      }
    }

    if (template === 'blank') {
      if (isWeb) {
        try {
          window.localStorage.setItem(getUserStorageKeys().MY_RANKS, JSON.stringify([]));
        } catch (cacheErr) {
          log('RankingsStore', 'Failed to cache custom rankings', cacheErr);
        }
      }
      set({ myRanks: [], myRanksName: sheetName });
      return;
    }

    if (template !== 'consensus') {
      const formatKey = setup.leagueFormat === 'Half-PPR' ? 'halfPpr' : setup.leagueFormat === 'Standard' ? 'halfPpr' : setup.leagueFormat === 'Dynasty' ? 'dynasty' : 'ppr';
      // Sort baseList by the selected expert's rank for that format
      baseList.sort((a, b) => {
        const rankA = a.expertRanks[template]?.[formatKey] ?? a.ranks[formatKey] ?? a.rank;
        const rankB = b.expertRanks[template]?.[formatKey] ?? b.ranks[formatKey] ?? b.rank;
        return rankA - rankB;
      });
    }

    const posCounts: Record<string, number> = {};
    const customList = baseList.map((p, idx) => {
      const pos = p.position;
      posCounts[pos] = (posCounts[pos] || 0) + 1;
      return {
        ...p,
        rank: idx + 1,
        posRank: `${pos}${posCounts[pos]}`,
        draftedBy: null
      };
    });
    
    if (isWeb) {
      try {
        window.localStorage.setItem(getUserStorageKeys().MY_RANKS, JSON.stringify(customList));
      } catch (cacheErr) {
        log('RankingsStore', 'Failed to cache custom rankings', cacheErr);
      }
    }
    
    set({ myRanks: customList, myRanksName: sheetName });
  },

  reorderMyRanks: (rank, direction) => {
    const { myRanks } = get();
    if (!myRanks) return;
    
    const index = myRanks.findIndex(p => p.rank === rank);
    if (index === -1) return;
    
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= myRanks.length) return;
    
    const updated = [...myRanks];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    
    const posCounts: Record<string, number> = {};
    const finalRanks = updated.map((p, idx) => {
      const pos = p.position;
      posCounts[pos] = (posCounts[pos] || 0) + 1;
      return {
        ...p,
        rank: idx + 1,
        posRank: `${pos}${posCounts[pos]}`
      };
    });
    
    if (isWeb) {
      try {
        window.localStorage.setItem(getUserStorageKeys().MY_RANKS, JSON.stringify(finalRanks));
      } catch (cacheErr) {
        log('RankingsStore', 'Failed to cache custom rankings', cacheErr);
      }
    }
    
    set({ myRanks: finalRanks });
  },

  resetMyRanks: () => {
    if (isWeb) {
      try {
        window.localStorage.removeItem(getUserStorageKeys().MY_RANKS);
        window.localStorage.removeItem(getUserStorageKeys().MY_RANKS_NAME);
      } catch (cacheErr) {
        log('RankingsStore', 'Failed to clear cached custom rankings', cacheErr);
      }
    }
    set({ myRanks: null, myRanksName: null });
  },

  setMyRanks: (customList, name) => {
    const posCounts: Record<string, number> = {};
    const finalRanks = customList.map((p, idx) => {
      const pos = p.position;
      posCounts[pos] = (posCounts[pos] || 0) + 1;
      return {
        ...p,
        rank: idx + 1,
        posRank: `${pos}${posCounts[pos]}`,
        draftedBy: null
      };
    });

    if (isWeb) {
      try {
        window.localStorage.setItem(getUserStorageKeys().MY_RANKS, JSON.stringify(finalRanks));
        if (name) {
          window.localStorage.setItem(getUserStorageKeys().MY_RANKS_NAME, name);
        }
      } catch (cacheErr) {
        log('RankingsStore', 'Failed to cache custom rankings', cacheErr);
      }
    }
    set((state) => ({ 
      myRanks: finalRanks,
      myRanksName: name || state.myRanksName || 'My Custom Cheat Sheet'
    }));
  },

  syncRankings: async (force = false) => {
    const { syncStatus, lastSyncedAt } = get();
    
    // Prevent double syncing unless forced
    if (syncStatus === 'syncing' && !force) return;
    
    // If not forced and synced within 10 seconds, throttle it
    if (!force && lastSyncedAt && Date.now() - lastSyncedAt < 10000) {
      return;
    }
    
    set({ syncStatus: 'syncing', syncError: null });
    
    try {
      const ECR_API_ENDPOINT = API_CONFIG.ECR_API_ENDPOINT;
      
      let fetchedPlayers: any[] = [];
      let success = false;
      
      try {
        const response = await fetch(ECR_API_ENDPOINT, { method: 'GET', headers: { 'Accept': 'application/json' } });
        if (response.ok) {
          const data = await response.json();
          fetchedPlayers = Array.isArray(data) ? data : data.players || [];
          if (fetchedPlayers.length > 0) {
            success = true;
          } else {
            throw new Error('Malformed JSON or empty player list');
          }
        } else {
          throw new Error('Network response not OK');
        }
      } catch (err) {
        log('RankingsStore', '[SyncEngine] Live network rankings fetch failed. Failing sync...', err);
        throw err;
      }
      
      let baseList: Player[] = [];
      
      if (success) {
        // Parse fetched player records and convert to Player interface
        baseList = fetchedPlayers.map((p: any, idx: number) => {
          const rawName = p.name || p.player_name || 'Unknown Player';
          const pos = (p.position || p.player_position_id || 'RB').toUpperCase() as Player['position'];
          const team = (p.team || p.player_team_id || 'FA').toUpperCase();
          const bye = parseInt(p.bye || p.player_bye_week || '0', 10);
          const rank = parseInt(p.rank || p.rank_ecr || String(idx + 1), 10);
          let adp = parseFloat(p.adp || '0');
          if (adp === 0 || adp > 260 || adp === parseFloat(p.player_owned_avg || '0') || (rank < 30 && adp > 50)) {
            const playerHash = rawName.charCodeAt(0) + rawName.charCodeAt(rawName.length - 1 || 0);
            const variance = (playerHash % 9) - 4; // -4 to +4
            const rankFactor = Math.min(3.0, rank / 50.0);
            const scaledVariance = Math.round(variance * rankFactor * 10) / 10;
            adp = Math.max(1.0, rank + scaledVariance);
          }
          
          const ranks = {
            halfPpr: rank,
            ppr: p.ranks?.ppr || (pos === 'WR' ? Math.max(1, rank - 2) : pos === 'RB' ? Math.min(250, rank + 2) : rank),
            dynasty: p.ranks?.dynasty || rank
          };
          
          const expertRanks = {
            Andy: {
              halfPpr: p.expertRanks?.Andy?.halfPpr || ranks.halfPpr,
              ppr: p.expertRanks?.Andy?.ppr || ranks.ppr,
              dynasty: p.expertRanks?.Andy?.dynasty || ranks.dynasty
            },
            Mike: {
              halfPpr: p.expertRanks?.Mike?.halfPpr || ranks.halfPpr,
              ppr: p.expertRanks?.Mike?.ppr || ranks.ppr,
              dynasty: p.expertRanks?.Mike?.dynasty || ranks.dynasty
            },
            Jason: {
              halfPpr: p.expertRanks?.Jason?.halfPpr || ranks.halfPpr,
              ppr: p.expertRanks?.Jason?.ppr || ranks.ppr,
              dynasty: p.expertRanks?.Jason?.dynasty || ranks.dynasty
            }
          };
          
          return {
            rank,
            espnId: null,
            name: rawName,
            position: pos,
            team,
            bye,
            adp,
            posRank: `${pos}${idx + 1}`,
            projectedPoints: 330 - (rank * 1.1) + (pos === 'QB' ? 65 : 0),
            draftedBy: null,
            ranks,
            expertRanks
          };
        });
      } else {
        // Dynamic Live Sync Simulation
        log('RankingsStore', '[SyncEngine] Emulating live consensus ranking updates...');
        const originalList = generateMockRankings();
        
        baseList = originalList.map((p) => {
          let ranks = { ...p.ranks };
          let expertRanks = { ...p.expertRanks };
          
          const seed = Math.floor(Date.now() / 600000); // changes every 10 mins
          const playerHash = p.name.charCodeAt(0) + p.name.charCodeAt(p.name.length - 1);
          
          if ((playerHash + seed) % 19 === 0 && p.rank > 5 && p.rank < 240) {
            const dir = (playerHash + seed) % 2 === 0 ? 1 : -1;
            ranks.halfPpr = Math.max(1, p.ranks.halfPpr + dir);
            ranks.ppr = Math.max(1, p.ranks.ppr + dir);
            ranks.dynasty = Math.max(1, p.ranks.dynasty + dir);
            
            expertRanks = {
              Andy: {
                halfPpr: Math.max(1, p.expertRanks.Andy.halfPpr + dir),
                ppr: Math.max(1, p.expertRanks.Andy.ppr + dir),
                dynasty: Math.max(1, p.expertRanks.Andy.dynasty + dir)
              },
              Mike: {
                halfPpr: Math.max(1, p.expertRanks.Mike.halfPpr + dir),
                ppr: Math.max(1, p.expertRanks.Mike.ppr + dir),
                dynasty: Math.max(1, p.expertRanks.Mike.dynasty + dir)
              },
              Jason: {
                halfPpr: Math.max(1, p.expertRanks.Jason.halfPpr + dir),
                ppr: Math.max(1, p.expertRanks.Jason.ppr + dir),
                dynasty: Math.max(1, p.expertRanks.Jason.dynasty + dir)
              }
            };
          }
          
          let team = p.team;
          if (p.name === 'Davante Adams' && (seed % 3 === 0)) {
            team = 'KC';
          } else if (p.name === 'Christian McCaffrey' && (seed % 4 === 0)) {
            team = 'SF';
          }
          
          return {
            ...p,
            team,
            ranks,
            expertRanks
          };
        });
      }
      
      const syncedPlayers = baseList.map((player) => {
        let lookupName = player.name.toLowerCase().trim();
        lookupName = lookupName.replace(/\s+(jr\.|sr\.|iii|ii|iv|v|v\.|ii\.|iii\.|jr|sr)$/, '');
        lookupName = lookupName.replace(/['`\-\.\s]/g, '');
        
        let espnId: number | null = null;
        if (player.position === 'DST') {
          espnId = null;
        } else {
          espnId = ESPN_ID_MAPPING[lookupName] || null;
        }
        
        return {
          ...player,
          espnId
        };
      });
      
      const setup = useDraftStore.getState().setup;
      const finalSorted = applyFormatAndSort(
        syncedPlayers,
        setup.leagueFormat,
        setup.rankingsBase,
        get().myRanks
      );
      
      if (isWeb) {
        try {
          window.localStorage.setItem(CACHE_KEY, JSON.stringify(syncedPlayers));
          window.localStorage.setItem(SYNC_TIME_KEY, String(Date.now()));
        } catch (cacheErr) {
          log('RankingsStore', 'Failed to cache synced rankings', cacheErr);
        }
      }
      
      const draftStatus = useDraftStore.getState().draftStatus;
      if (draftStatus === 'drafting') {
        log('RankingsStore', '[SyncEngine] Sync successfully loaded new ranks in background, but active draft is in progress. Skipping live players override to prevent draft corruption.');
      } else {
        usePlayerStore.getState().setPlayers(finalSorted);
      }
      
      set({
        syncStatus: 'synced',
        lastSyncedAt: Date.now(),
        syncError: null
      });
      
      log('RankingsStore', '[SyncEngine] ECR consensus rankings successfully synced and updated in Zustand store.');
    } catch (err: any) {
      log('RankingsStore', '[SyncEngine] Sync failed: ', err);
      set({
        syncStatus: 'stale',
        syncError: err?.message || 'Unknown network error'
      });
    }
  },
}));
