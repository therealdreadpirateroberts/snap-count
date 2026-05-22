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

const getInitialFeaturedSlot1Key = (): string => {
  try {
    if (isWeb) {
      const val = window.localStorage.getItem('mockmaxxing_featured_slot_1');
      if (val) return val;
    }
  } catch (e) {
    log('PlayerStore', 'Failed to load featured slot 1 key', e);
  }
  return 'mock-draft';
};

const getInitialHomepageTileCap = (): number => {
  try {
    if (isWeb) {
      const val = window.localStorage.getItem('mockmaxxing_homepage_tile_cap');
      if (val) return parseInt(val, 10);
    }
  } catch (e) {
    log('PlayerStore', 'Failed to load homepage tile cap', e);
  }
  return 10;
};

const getInitialShowNewsOnHomepage = (): boolean => {
  try {
    if (isWeb) {
      const val = window.localStorage.getItem('mockmaxxing_show_news');
      if (val) return val === 'true';
    }
  } catch (e) {
    log('PlayerStore', 'Failed to load show news preference', e);
  }
  return false;
};

interface PlayerState {
  players: Player[];
  news: NewsStory[];
  searchQuery: string;
  positionFilter: 'ALL' | 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DST';
  featuredSlot1Key: string;
  homepageTileCap: number;
  showNewsOnHomepage: boolean;
  
  setSearchQuery: (query: string) => void;
  setPositionFilter: (filter: 'ALL' | 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DST') => void;
  setFeaturedSlot1Key: (key: string) => void;
  setHomepageTileCap: (cap: number) => void;
  setShowNewsOnHomepage: (show: boolean) => void;
  setPlayers: (players: Player[]) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  players: applyFormatAndSort(getInitialPlayers(), 'Standard', 'ECR Consensus'),
  news: MOCK_NEWS,
  searchQuery: '',
  positionFilter: 'ALL',
  featuredSlot1Key: getInitialFeaturedSlot1Key(),
  homepageTileCap: getInitialHomepageTileCap(),
  showNewsOnHomepage: getInitialShowNewsOnHomepage(),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setPositionFilter: (filter) => set({ positionFilter: filter }),
  
  setFeaturedSlot1Key: (key: string) => {
    try {
      if (isWeb) {
        window.localStorage.setItem('mockmaxxing_featured_slot_1', key);
      }
    } catch (e) {
      log('PlayerStore', 'Failed to save featured slot 1 key', e);
    }
    set({ featuredSlot1Key: key });
  },

  setHomepageTileCap: (cap: number) => {
    try {
      if (isWeb) {
        window.localStorage.setItem('mockmaxxing_homepage_tile_cap', cap.toString());
      }
    } catch (e) {
      log('PlayerStore', 'Failed to save homepage tile cap', e);
    }
    set({ homepageTileCap: cap });
  },

  setShowNewsOnHomepage: (show: boolean) => {
    try {
      if (isWeb) {
        window.localStorage.setItem('mockmaxxing_show_news', show ? 'true' : 'false');
      }
    } catch (e) {
      log('PlayerStore', 'Failed to save show news preference', e);
    }
    set({ showNewsOnHomepage: show });
  },

  setPlayers: (players) => set({ players }),
}));
