import { create } from 'zustand';
import { Player, generateMockRankings, MOCK_NEWS, NewsStory } from './mockData';

export interface DraftPick {
  pickNumber: number;
  round: number;
  teamIndex: number;
  teamName: string;
  player: Player;
}

interface DraftSetup {
  leagueSize: number;
  userPosition: number;
  rounds: number;
  opponentStyle: 'Standard ADP' | 'Expert Consensus' | 'Beat the Sharks' | 'Casual League';
  draftType: 'Snake' | 'Linear';
}

interface SnapState {
  players: Player[];
  news: NewsStory[];
  searchQuery: string;
  positionFilter: 'ALL' | 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DST';
  setup: DraftSetup;
  
  // Active Draft state
  draftStatus: 'setup' | 'drafting' | 'summary';
  currentPick: number; // 1-based
  draftHistory: DraftPick[];
  cpuIsThinking: boolean;
  thinkingCpuName: string;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setPositionFilter: (filter: 'ALL' | 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DST') => void;
  updateSetup: (updates: Partial<DraftSetup>) => void;
  startDraft: () => void;
  resetDraft: () => void;
  draftPlayer: (rank: number, teamIndex: number, teamName: string) => void;
  simulateCpuTurn: (onUserTurnReached: () => void) => void;
  getSuggestedPicks: () => Player[];
  getUserRoster: () => Player[];
  getDraftGrade: () => { grade: string; valueScore: number };
}

// Helper to calculate which team is picking at a given pick number
export const getTeamIndexForPick = (
  pick: number,
  leagueSize: number,
  draftType: 'Snake' | 'Linear'
): number => {
  const round = Math.ceil(pick / leagueSize);
  const indexInRound = (pick - 1) % leagueSize; // 0 to leagueSize - 1
  
  if (draftType === 'Snake' && round % 2 === 0) {
    // Reverse pick direction in even rounds for Snake
    return leagueSize - 1 - indexInRound;
  }
  return indexInRound;
};

export const getTeamNameForIndex = (
  idx: number,
  userPosition: number
): string => {
  if (idx === userPosition - 1) {
    return 'Your Team';
  }
  
  const mascots = [
    'Apex Predators', 'Blitz Brigade', 'Gridiron Giants', 'Red Zone Rebels',
    'Hail Marys', 'Snap Count Squad', 'Dynasty Demons', 'Punt Kings',
    'Pocket Passers', 'Sharks', 'Audible Allstars', 'Touchdown Titans',
    'End Zone Empire', 'Wildcats'
  ];
  
  return mascots[idx % mascots.length];
};

export const useSnapStore = create<SnapState>((set, get) => ({
  players: generateMockRankings(),
  news: MOCK_NEWS,
  searchQuery: '',
  positionFilter: 'ALL',
  setup: {
    leagueSize: 12,
    userPosition: 6,
    rounds: 14,
    opponentStyle: 'Standard ADP',
    draftType: 'Snake',
  },
  draftStatus: 'setup',
  currentPick: 1,
  draftHistory: [],
  cpuIsThinking: false,
  thinkingCpuName: '',

  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setPositionFilter: (filter) => set({ positionFilter: filter }),
  
  updateSetup: (updates) => set((state) => {
    const nextSetup = { ...state.setup, ...updates };
    // bounds check userPosition if leagueSize changes
    if (nextSetup.userPosition > nextSetup.leagueSize) {
      nextSetup.userPosition = nextSetup.leagueSize;
    }
    return { setup: nextSetup };
  }),

  startDraft: () => {
    const freshPlayers = generateMockRankings();
    set({
      players: freshPlayers,
      draftStatus: 'drafting',
      currentPick: 1,
      draftHistory: [],
      cpuIsThinking: false,
      thinkingCpuName: '',
    });
  },

  resetDraft: () => {
    set({
      players: generateMockRankings(),
      draftStatus: 'setup',
      currentPick: 1,
      draftHistory: [],
      cpuIsThinking: false,
      thinkingCpuName: '',
    });
  },

  draftPlayer: (rank, teamIndex, teamName) => {
    set((state) => {
      const updatedPlayers = state.players.map((p) => {
        if (p.rank === rank) {
          return { ...p, draftedBy: teamName };
        }
        return p;
      });

      const player = state.players.find((p) => p.rank === rank);
      if (!player) return {};

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

      return {
        players: updatedPlayers,
        draftHistory: [...state.draftHistory, newPick],
        currentPick: nextPick,
        draftStatus: nextStatus,
        cpuIsThinking: false,
        thinkingCpuName: '',
      };
    });
  },

  simulateCpuTurn: (onUserTurnReached) => {
    const { draftStatus, currentPick, setup, players, draftPlayer, simulateCpuTurn } = get();
    
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

    // CPU Drafting Algorithm:
    // CPUs select based on ADP with a small random noise, and check basic roster composition:
    // e.g. They won't take two QBs or TEs early on, they prioritize RBs/WRs.
    setTimeout(() => {
      const { players: currentPlayers, currentPick: verifiedPick } = get();
      if (verifiedPick !== currentPick) return; // Prevent race conditions

      // Roster need check
      const cpuRoster = currentPlayers.filter(p => p.draftedBy === teamName);
      const qbCount = cpuRoster.filter(p => p.position === 'QB').length;
      const teCount = cpuRoster.filter(p => p.position === 'TE').length;
      const kCount = cpuRoster.filter(p => p.position === 'K').length;
      const dstCount = cpuRoster.filter(p => p.position === 'DST').length;

      const available = currentPlayers.filter(p => !p.draftedBy);

      // Find best player based on needs
      let chosenPlayer = available[0]; // fallback to best available by rank
      
      // Calculate a "need score" for the available players
      const pool = available.slice(0, 12); // Look at top 12 available
      let bestScore = -9999;

      pool.forEach(player => {
        let score = 200 - player.rank; // Base rank score

        // ADP bias depending on setting
        const adpDiff = player.rank - player.adp;
        score += adpDiff * 1.5;

        // Position caps for CPUs
        if (player.position === 'QB' && qbCount >= 1) {
          score -= verifiedPick < (setup.rounds * 0.7) ? 150 : 50; // heavily penalize 2nd QB early
        }
        if (player.position === 'TE' && teCount >= 1) {
          score -= verifiedPick < (setup.rounds * 0.7) ? 150 : 50; // heavily penalize 2nd TE early
        }
        if (player.position === 'K' && kCount >= 1) {
          score -= 300; // never draft 2 kickers
        }
        if (player.position === 'DST' && dstCount >= 1) {
          score -= 300; // never draft 2 DST
        }

        // Kickers and DSTs should never go early
        if ((player.position === 'K' || player.position === 'DST') && verifiedPick < (setup.rounds - 3) * setup.leagueSize) {
          score -= 200;
        }

        if (score > bestScore) {
          bestScore = score;
          chosenPlayer = player;
        }
      });

      if (chosenPlayer) {
        draftPlayer(chosenPlayer.rank, activeTeamIdx, teamName);
        
        // Recurse to run the next pick!
        simulateCpuTurn(onUserTurnReached);
      }
    }, 450); // Animated 450ms pick delay
  },

  getSuggestedPicks: () => {
    const { players, currentPick, setup } = get();
    const available = players.filter(p => !p.draftedBy);
    
    // Return top 3 suggested picks that fit basic user roster needs
    const userRoster = players.filter(p => p.draftedBy === 'Your Team');
    const qbCount = userRoster.filter(p => p.position === 'QB').length;
    const teCount = userRoster.filter(p => p.position === 'TE').length;
    const kCount = userRoster.filter(p => p.position === 'K').length;
    const dstCount = userRoster.filter(p => p.position === 'DST').length;

    return available.filter(player => {
      if (player.position === 'QB' && qbCount >= 2) return false;
      if (player.position === 'TE' && teCount >= 2) return false;
      if (player.position === 'K' && kCount >= 1) return false;
      if (player.position === 'DST' && dstCount >= 1) return false;
      
      // Delay kickers/defenses to late rounds
      const currentRound = Math.ceil(currentPick / setup.leagueSize);
      if ((player.position === 'K' || player.position === 'DST') && currentRound < (setup.rounds - 2)) {
        return false;
      }
      return true;
    }).slice(0, 3);
  },

  getUserRoster: () => {
    const { players } = get();
    return players.filter(p => p.draftedBy === 'Your Team');
  },

  getDraftGrade: () => {
    const { draftHistory, setup } = get();
    const userPicks = draftHistory.filter(h => h.teamName === 'Your Team');
    
    if (userPicks.length === 0) return { grade: 'B', valueScore: 0 };

    // Value score is average difference: (Player's ADP - Actual Pick Number)
    // Positive is great (drafted a player past their ADP), negative is reach.
    let totalDiff = 0;
    userPicks.forEach(pick => {
      totalDiff += (pick.player.adp - pick.pickNumber);
    });

    const avgDiff = totalDiff / userPicks.length;

    let grade = 'B';
    if (avgDiff > 4.5) grade = 'A+';
    else if (avgDiff > 1.5) grade = 'A';
    else if (avgDiff > -1.0) grade = 'B+';
    else if (avgDiff > -3.5) grade = 'B';
    else if (avgDiff > -6.0) grade = 'C';
    else grade = 'D';

    return { grade, valueScore: Number(avgDiff.toFixed(1)) };
  }
}));
