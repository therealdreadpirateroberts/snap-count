import { create } from 'zustand';
import { Player, NewsStory, MOCK_NEWS, generateMockRankings } from './mockData';
import { applyFormatAndSort } from './_helpers';
import { log } from '../utils/logger';

const isWeb = typeof window !== 'undefined' && window.localStorage;
const CACHE_KEY = 'mockmaxxing_cached_players';

const getInitialPlayers = (): Player[] => {
  try {
    if (isWeb) {
      const cached = window.localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const first = parsed[0];
          if (first && typeof first === 'object' && 'rank' in first && 'name' in first && 'position' in first) {
            return parsed;
          }
        }
      }
    }
  } catch (e) {
    log('PlayerStore', 'Failed to load cached players', e);
  }
  return generateMockRankings();
};

interface PlayerState {
  players: Player[];
  news: NewsStory[];
  searchQuery: string;
  positionFilter: 'ALL' | 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DST';
  
  setSearchQuery: (query: string) => void;
  setPositionFilter: (filter: 'ALL' | 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DST') => void;
  setPlayers: (players: Player[]) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  players: applyFormatAndSort(getInitialPlayers(), 'Standard', 'ECR Consensus'),
  news: MOCK_NEWS,
  searchQuery: '',
  positionFilter: 'ALL',

  setSearchQuery: (query) => set({ searchQuery: query }),
  setPositionFilter: (filter) => set({ positionFilter: filter }),
  setPlayers: (players) => set({ players }),
}));
