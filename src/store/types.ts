import { Player } from './mockData';

export interface DraftPick {
  pickNumber: number;
  round: number;
  teamIndex: number;
  teamName: string;
  player: Player;
}

export interface BotProfile {
  name: string;
  strategyCamp: 'Zero RB' | 'Hero RB' | 'Balanced' | 'Late QB/TE Focus' | 'Robust RB' | 'Elite QB/TE Premium';
  expertPreference: 'ECR Consensus' | 'Andy' | 'Mike' | 'Jason';
  learningAccuracy: number; // base accuracy (0.50 to 0.96)
}

export interface HistoricalDraft {
  id: string;
  timestamp: number;
  grade: string;
  valueScore: number;
  playoffChance: number;
  projectedWins: number;
  projectedLosses: number;
  userPosition: number;
  isManual?: boolean; // <-- Add isManual flag to identify user-completed drafts
  leagueSize: number;
  opponentStyle: string;
  leagueFormat: string;
  rankingsBase: string;
  userStrategy: string;
  passingTdPoints: number;
  tePremium: boolean;
  flexCount: number;
  teams: {
    teamIndex: number;
    teamName: string;
    strategyCamp: 'Zero RB' | 'Hero RB' | 'Balanced' | 'Late QB/TE Focus' | 'Robust RB' | 'Elite QB/TE Premium';
    expertPreference: 'ECR Consensus' | 'Andy' | 'Mike' | 'Jason';
    grade: string;
    wins: number;
    losses: number;
    playoffChance: number;
    roster: {
      name: string;
      position: string;
      team: string;
      rank: number;
      adp: number;
      projectedPoints: number;
      espnId: number | null;
      bye: number;
      pick?: string;
      round?: number;
    }[];
  }[];
}

export interface DraftSetup {
  leagueSize: number;
  userPosition: number;
  rounds: number;
  opponentStyle: 'Standard ADP' | 'Expert Consensus' | 'Beat the Sharks' | 'Casual League';
  draftType: 'Snake' | 'Linear';
  leagueFormat: 'Standard' | 'Half-PPR' | 'PPR' | 'Dynasty';
  rankingsBase: 'ECR Consensus' | 'Andy' | 'Mike' | 'Jason' | 'My Ranks';
  userStrategy?: 'Late QB/TE Focus' | 'Hero RB' | 'Zero RB' | 'Balanced' | 'Robust RB' | 'Elite QB/TE Premium';
  passingTdPoints: 4 | 6;
  tePremium: boolean;
  flexCount: number;
  pickClock?: number; // Numeric pick clock seconds (e.g. 10 to 120)
  rosterSlots?: {
    QB: number;
    RB: number;
    WR: number;
    TE: number;
    FLEX: number;
    K: number;
    DST: number;
    BENCH: number;
    IR: number;
  };
  year?: number;
}
