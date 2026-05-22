import { useAuthStore } from '../useAuthStore';
import { Player, generateMockRankings, ESPN_ID_MAPPING } from '../mockData';
import liveMetricsData from '../../../scratch_live_metrics.json';
import { DraftPick, BotProfile, HistoricalDraft, DraftSetup } from '../types';

export const getUserTeamName = (): string => {
  return useAuthStore.getState().user?.name || 'Your Team';
};

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
  userPosition: number,
  customUserTeamName?: string
): string => {
  if (idx === userPosition - 1) {
    return customUserTeamName || getUserTeamName();
  }
  
  // Assign experts to the first three non-user spots
  const nonUserSlots: number[] = [];
  for (let i = 0; i < 16; i++) {
    if (i !== userPosition - 1) {
      nonUserSlots.push(i);
    }
  }
  
  const expertIndex = nonUserSlots.indexOf(idx);
  if (expertIndex === 0) return 'Andy';
  if (expertIndex === 1) return 'Mike';
  if (expertIndex === 2) return 'Jason';
  
  const firstNames = [
    'Sarah', 'David', 'Jessica', 'Michael', 'Emily', 'James', 'Ashley', 'Robert',
    'Sophia', 'William', 'Daniel', 'Olivia', 'Matthew'
  ];
  
  return firstNames[(expertIndex - 3) % firstNames.length];
};

// Helper to calculate when the user's next turn is
export const getUserNextPick = (currentPick: number, setup: DraftSetup): number | null => {
  const totalPicks = setup.rounds * setup.leagueSize;
  for (let p = currentPick + 1; p <= totalPicks; p++) {
    const activeTeamIdx = getTeamIndexForPick(p, setup.leagueSize, setup.draftType);
    if (activeTeamIdx === setup.userPosition - 1) {
      return p;
    }
  }
  return null;
};

export const getPlayerSuggestionScores = (
  available: Player[],
  currentPick: number,
  setup: DraftSetup,
  userRoster: Player[]
): { player: Player; finalScore: number }[] => {
  const qbCount = userRoster.filter(p => p.position === 'QB').length;
  const rbCount = userRoster.filter(p => p.position === 'RB').length;
  const wrCount = userRoster.filter(p => p.position === 'WR').length;
  const teCount = userRoster.filter(p => p.position === 'TE').length;
  const kCount = userRoster.filter(p => p.position === 'K').length;
  const dstCount = userRoster.filter(p => p.position === 'DST').length;

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

  const currentRound = Math.ceil(currentPick / setup.leagueSize);
  const bestAvailableRank = available.length > 0 ? available[0].rank : 1;
  const strategy = setup.userStrategy || 'Late QB/TE Focus';

  return available.map(player => {
    // 1. Base Score derived relative to the best available player's rank (lower gap = higher score)
    // Relative ECR scoring avoids negative base scores in later rounds
    let baseScore = 260 - (player.rank - bestAvailableRank) * 5.0;

    // 2. ADP Value Steal Bonus: boost players that have fallen past their average draft position
    const valueSteal = player.adp - currentPick;
    const valueBonus = valueSteal > 0 ? Math.min(40, valueSteal * 2.0) : 0;
    let score = baseScore + valueBonus;

    // 3. Roster Construction Multiplier based on current position counts and escalating urgency
    let positionMultiplier = 1.0;
    const pos = player.position;

    if (pos === 'QB') {
      let qbMultiplier = 1.0;
      if (setup.passingTdPoints === 6) {
        qbMultiplier = 1.25;
      }
      if (qbCount === 0) {
        if (strategy === 'Late QB/TE Focus' || strategy === 'Hero RB' || strategy === 'Robust RB') {
          // Late QB focus: heavily penalize QBs early (before Rd 7), lift lock late
          positionMultiplier = currentRound >= 7 ? 2.0 : 0.3;
        } else if (strategy === 'Elite QB/TE Premium') {
          // Elite QB/TE Premium: aggressively target QB in first 3 rounds!
          positionMultiplier = currentRound <= 3 ? 2.5 : currentRound >= 7 ? 2.0 : 1.35;
        } else {
          positionMultiplier = currentRound >= 10 ? 2.5 : currentRound >= 7 ? 2.0 : 1.35;
        }
      } else if (qbCount < slots.QB) {
        positionMultiplier = 1.5;
      } else if (qbCount < slots.QB + Math.ceil(slots.BENCH / 5)) {
        positionMultiplier = currentRound >= 12 ? 0.8 : 0.4; // defer backups to very late
      } else {
        positionMultiplier = 0.0; // max cap reached
      }
      positionMultiplier *= qbMultiplier;
    } else if (pos === 'TE') {
      let teMultiplier = 1.0;
      if (setup.tePremium) {
        teMultiplier = 1.25;
      }
      if (teCount === 0) {
        if (strategy === 'Late QB/TE Focus' || strategy === 'Hero RB' || strategy === 'Robust RB') {
          // Late TE focus: heavily penalize TEs early (before Rd 10), lift lock late
          positionMultiplier = currentRound >= 10 ? 2.5 : 0.3;
        } else if (strategy === 'Elite QB/TE Premium') {
          // Elite QB/TE Premium: aggressively target TE in first 4 rounds!
          positionMultiplier = currentRound <= 4 ? 2.5 : currentRound >= 10 ? 2.5 : 1.35;
        } else {
          positionMultiplier = currentRound >= 10 ? 2.5 : currentRound >= 7 ? 2.0 : 1.35;
        }
      } else if (teCount < slots.TE) {
        positionMultiplier = 1.5;
      } else if (teCount < slots.TE + Math.ceil(slots.BENCH / 5)) {
        positionMultiplier = currentRound >= 12 ? 0.8 : 0.4;
      } else {
        positionMultiplier = 0.0;
      }
      positionMultiplier *= teMultiplier;
    } else if (pos === 'RB') {
      if (rbCount < slots.RB) {
        const isFirstRB = rbCount === 0;
        if (isFirstRB) {
          if (strategy === 'Zero RB') {
            positionMultiplier = currentRound >= 6 ? 1.8 : 0.2; // avoid RBs early
          } else if (strategy === 'Hero RB') {
            positionMultiplier = currentRound >= 2 ? 2.5 : 1.8; // secure elite anchor RB
          } else if (strategy === 'Late QB/TE Focus') {
            positionMultiplier = currentRound >= 5 ? 2.5 : 1.8; // prioritize RBs early
          } else if (strategy === 'Robust RB') {
            positionMultiplier = currentRound <= 4 ? 3.0 : 1.8; // secure early RBs aggressively
          } else if (strategy === 'Elite QB/TE Premium') {
            positionMultiplier = currentRound <= 4 ? 0.8 : 1.8; // defer slightly early RB
          } else {
            positionMultiplier = currentRound >= 5 ? 2.2 : 1.6;
          }
        } else {
          if (strategy === 'Zero RB') {
            positionMultiplier = currentRound >= 7 ? 2.0 : 0.3;
          } else if (strategy === 'Hero RB') {
            positionMultiplier = currentRound >= 7 ? 2.0 : 0.4; // wait on 2nd RB, load WRs
          } else if (strategy === 'Late QB/TE Focus') {
            positionMultiplier = currentRound >= 7 ? 2.2 : 1.65;
          } else if (strategy === 'Robust RB') {
            positionMultiplier = currentRound <= 4 ? 2.8 : 1.65; // keep buying early RBs!
          } else if (strategy === 'Elite QB/TE Premium') {
            positionMultiplier = currentRound <= 4 ? 0.8 : 1.65;
          } else {
            positionMultiplier = currentRound >= 7 ? 2.0 : 1.45;
          }
        }
      } else if (rbCount < slots.RB + slots.FLEX + Math.ceil(slots.BENCH / 2)) {
        if (strategy === 'Robust RB' && rbCount < slots.RB + 1) {
          positionMultiplier = currentRound <= 4 ? 2.5 : 1.2; // keep buying early RBs!
        } else {
          positionMultiplier = 1.1; // filled starters, normal bench addition weight
        }
      } else {
        positionMultiplier = 0.0;
      }
    } else if (pos === 'WR') {
      if (wrCount < slots.WR) {
        const isFirstWR = wrCount === 0;
        if (isFirstWR) {
          if (strategy === 'Zero RB') {
            positionMultiplier = currentRound >= 5 ? 2.5 : 2.0; // WR hoarding early
          } else if (strategy === 'Hero RB' || strategy === 'Late QB/TE Focus') {
            positionMultiplier = currentRound >= 5 ? 2.4 : 1.8; // priority WR early
          } else if (strategy === 'Robust RB') {
            positionMultiplier = currentRound <= 4 ? 0.4 : 2.0; // avoid WR early in Robust RB
          } else if (strategy === 'Elite QB/TE Premium') {
            positionMultiplier = currentRound <= 4 ? 0.8 : 2.0;
          } else {
            positionMultiplier = currentRound >= 5 ? 2.2 : 1.6;
          }
        } else {
          if (strategy === 'Zero RB') {
            positionMultiplier = currentRound >= 7 ? 2.2 : 1.8;
          } else if (strategy === 'Hero RB' || strategy === 'Late QB/TE Focus') {
            positionMultiplier = currentRound >= 7 ? 2.2 : 1.65;
          } else if (strategy === 'Robust RB') {
            positionMultiplier = currentRound <= 4 ? 0.3 : 1.8;
          } else if (strategy === 'Elite QB/TE Premium') {
            positionMultiplier = currentRound <= 4 ? 0.8 : 1.8;
          } else {
            positionMultiplier = 1.6;
          }
        }
      } else if (wrCount < slots.WR + slots.FLEX + Math.ceil(slots.BENCH / 2)) {
        if (strategy === 'Zero RB') {
          positionMultiplier = 1.3;
        } else if (strategy === 'Hero RB' || strategy === 'Late QB/TE Focus') {
          positionMultiplier = 1.2;
        } else if (strategy === 'Robust RB') {
          positionMultiplier = currentRound <= 4 ? 0.4 : 1.1;
        } else if (strategy === 'Elite QB/TE Premium') {
          positionMultiplier = currentRound <= 4 ? 0.8 : 1.1;
        } else {
          positionMultiplier = 1.1;
        }
      } else {
        positionMultiplier = 0.0;
      }
    } else if (pos === 'K') {
      const neededStartingSlots =
        Math.max(0, slots.QB - qbCount) +
        Math.max(0, slots.TE - teCount) +
        Math.max(0, slots.K - kCount) +
        Math.max(0, slots.DST - dstCount) +
        Math.max(0, slots.RB - rbCount) +
        Math.max(0, slots.WR - wrCount);
      const roundsRemaining = setup.rounds - currentRound + 1;
      const hasRosterUrgency = neededStartingSlots >= roundsRemaining;

      if (kCount >= slots.K || (currentRound < (setup.rounds - 1) && !hasRosterUrgency)) {
        positionMultiplier = 0.0; // strictly delay to final 2 rounds unless urgent
      } else {
        positionMultiplier = 1.0;
      }
    } else if (pos === 'DST') {
      const neededStartingSlots =
        Math.max(0, slots.QB - qbCount) +
        Math.max(0, slots.TE - teCount) +
        Math.max(0, slots.K - kCount) +
        Math.max(0, slots.DST - dstCount) +
        Math.max(0, slots.RB - rbCount) +
        Math.max(0, slots.WR - wrCount);
      const roundsRemaining = setup.rounds - currentRound + 1;
      const hasRosterUrgency = neededStartingSlots >= roundsRemaining;

      if (dstCount >= slots.DST || (currentRound < (setup.rounds - 1) && !hasRosterUrgency)) {
        positionMultiplier = 0.0;
      } else {
        positionMultiplier = 1.0;
      }
    }

    // Strict Complete Roster Rule for suggestions (Force missing starting positions)
    const neededStartingSlots =
      Math.max(0, slots.QB - qbCount) +
      Math.max(0, slots.TE - teCount) +
      Math.max(0, slots.K - kCount) +
      Math.max(0, slots.DST - dstCount) +
      Math.max(0, slots.RB - rbCount) +
      Math.max(0, slots.WR - wrCount);
    const roundsRemaining = setup.rounds - currentRound + 1;
    if (neededStartingSlots >= roundsRemaining) {
      const isMissingQB = qbCount < slots.QB && pos === 'QB';
      const isMissingTE = teCount < slots.TE && pos === 'TE';
      const isMissingK = kCount < slots.K && pos === 'K';
      const isMissingDST = dstCount < slots.DST && pos === 'DST';
      const isMissingRB = rbCount < slots.RB && pos === 'RB';
      const isMissingWR = wrCount < slots.WR && pos === 'WR';
      if (!isMissingQB && !isMissingTE && !isMissingK && !isMissingDST && !isMissingRB && !isMissingWR) {
        positionMultiplier = 0.0;
      }
    }

    const finalScore = score * positionMultiplier;

    return {
      player,
      finalScore
    };
  });
};

export const getPlayerSuggestionScore = (
  player: Player,
  currentPick: number,
  setup: DraftSetup,
  roster: { QB: number; RB: number; WR: number; TE: number; K: number; DST: number },
  bestAvailableRank: number
): number => {
  const qbCount = roster.QB;
  const rbCount = roster.RB;
  const wrCount = roster.WR;
  const teCount = roster.TE;
  const kCount = roster.K;
  const dstCount = roster.DST;

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

  const currentRound = Math.ceil(currentPick / setup.leagueSize);
  const strategy = setup.userStrategy || 'Late QB/TE Focus';

  let baseScore = 260 - (player.rank - bestAvailableRank) * 5.0;
  const valueSteal = player.adp - currentPick;
  const valueBonus = valueSteal > 0 ? Math.min(40, valueSteal * 2.0) : 0;
  let score = baseScore + valueBonus;

  let positionMultiplier = 1.0;
  const pos = player.position;

  if (pos === 'QB') {
    let qbMultiplier = 1.0;
    if (setup.passingTdPoints === 6) {
      qbMultiplier = 1.25;
    }
    if (qbCount === 0) {
      if (strategy === 'Late QB/TE Focus' || strategy === 'Hero RB' || strategy === 'Robust RB') {
        positionMultiplier = currentRound >= 7 ? 2.0 : 0.3;
      } else if (strategy === 'Elite QB/TE Premium') {
        positionMultiplier = currentRound <= 3 ? 2.5 : currentRound >= 7 ? 2.0 : 1.35;
      } else {
        positionMultiplier = currentRound >= 10 ? 2.5 : currentRound >= 7 ? 2.0 : 1.35;
      }
    } else if (qbCount < slots.QB) {
      positionMultiplier = 1.5;
    } else if (qbCount < slots.QB + Math.ceil(slots.BENCH / 5)) {
      positionMultiplier = currentRound >= 12 ? 0.8 : 0.4;
    } else {
      positionMultiplier = 0.0;
    }
    positionMultiplier *= qbMultiplier;
  } else if (pos === 'TE') {
    let teMultiplier = 1.0;
    if (setup.tePremium) {
      teMultiplier = 1.25;
    }
    if (teCount === 0) {
      if (strategy === 'Late QB/TE Focus' || strategy === 'Hero RB' || strategy === 'Robust RB') {
        positionMultiplier = currentRound >= 10 ? 2.5 : 0.3;
      } else if (strategy === 'Elite QB/TE Premium') {
        positionMultiplier = currentRound <= 4 ? 2.5 : currentRound >= 10 ? 2.5 : 1.35;
      } else {
        positionMultiplier = currentRound >= 10 ? 2.5 : currentRound >= 7 ? 2.0 : 1.35;
      }
    } else if (teCount < slots.TE) {
      positionMultiplier = 1.5;
    } else if (teCount < slots.TE + Math.ceil(slots.BENCH / 5)) {
      positionMultiplier = currentRound >= 12 ? 0.8 : 0.4;
    } else {
      positionMultiplier = 0.0;
    }
    positionMultiplier *= teMultiplier;
  } else if (pos === 'RB') {
    if (rbCount < slots.RB) {
      const isFirstRB = rbCount === 0;
      if (isFirstRB) {
        if (strategy === 'Zero RB') {
          positionMultiplier = currentRound >= 6 ? 1.8 : 0.2;
        } else if (strategy === 'Hero RB') {
          positionMultiplier = currentRound >= 2 ? 2.5 : 1.8;
        } else if (strategy === 'Late QB/TE Focus') {
          positionMultiplier = currentRound >= 5 ? 2.5 : 1.8;
        } else if (strategy === 'Robust RB') {
          positionMultiplier = currentRound <= 4 ? 3.0 : 1.8;
        } else if (strategy === 'Elite QB/TE Premium') {
          positionMultiplier = currentRound <= 4 ? 0.8 : 1.8;
        } else {
          positionMultiplier = currentRound >= 5 ? 2.2 : 1.6;
        }
      } else {
        if (strategy === 'Zero RB') {
          positionMultiplier = currentRound >= 7 ? 2.0 : 0.3;
        } else if (strategy === 'Hero RB') {
          positionMultiplier = currentRound >= 7 ? 2.0 : 0.4;
        } else if (strategy === 'Late QB/TE Focus') {
          positionMultiplier = currentRound >= 7 ? 2.2 : 1.65;
        } else if (strategy === 'Robust RB') {
          positionMultiplier = currentRound <= 4 ? 2.8 : 1.65;
        } else if (strategy === 'Elite QB/TE Premium') {
          positionMultiplier = currentRound <= 4 ? 0.8 : 1.65;
        } else {
          positionMultiplier = currentRound >= 7 ? 2.0 : 1.45;
        }
      }
    } else if (rbCount < slots.RB + slots.FLEX + Math.ceil(slots.BENCH / 2)) {
      if (strategy === 'Robust RB' && rbCount < slots.RB + 1) {
        positionMultiplier = currentRound <= 4 ? 2.5 : 1.2;
      } else {
        positionMultiplier = 1.1;
      }
    } else {
      positionMultiplier = 0.0;
    }
  } else if (pos === 'WR') {
    if (wrCount < slots.WR) {
      const isFirstWR = wrCount === 0;
      if (isFirstWR) {
        if (strategy === 'Zero RB') {
          positionMultiplier = currentRound >= 5 ? 2.5 : 2.0;
        } else if (strategy === 'Hero RB' || strategy === 'Late QB/TE Focus') {
          positionMultiplier = currentRound >= 5 ? 2.4 : 1.8;
        } else if (strategy === 'Robust RB') {
          positionMultiplier = currentRound <= 4 ? 0.4 : 2.0;
        } else if (strategy === 'Elite QB/TE Premium') {
          positionMultiplier = currentRound <= 4 ? 0.8 : 2.0;
        } else {
          positionMultiplier = currentRound >= 5 ? 2.2 : 1.6;
        }
      } else {
        if (strategy === 'Zero RB') {
          positionMultiplier = currentRound >= 7 ? 2.2 : 1.8;
        } else if (strategy === 'Hero RB' || strategy === 'Late QB/TE Focus') {
          positionMultiplier = currentRound >= 7 ? 2.2 : 1.65;
        } else if (strategy === 'Robust RB') {
          positionMultiplier = currentRound <= 4 ? 0.3 : 1.8;
        } else if (strategy === 'Elite QB/TE Premium') {
          positionMultiplier = currentRound <= 4 ? 0.8 : 1.8;
        } else {
          positionMultiplier = 1.6;
        }
      }
    } else if (wrCount < slots.WR + slots.FLEX + Math.ceil(slots.BENCH / 2)) {
      if (strategy === 'Zero RB') {
        positionMultiplier = 1.3;
      } else if (strategy === 'Hero RB' || strategy === 'Late QB/TE Focus') {
        positionMultiplier = 1.2;
      } else if (strategy === 'Robust RB') {
        positionMultiplier = currentRound <= 4 ? 0.4 : 1.1;
      } else if (strategy === 'Elite QB/TE Premium') {
        positionMultiplier = currentRound <= 4 ? 0.8 : 1.1;
      } else {
        positionMultiplier = 1.1;
      }
    } else {
      positionMultiplier = 0.0;
    }
  } else if (pos === 'K') {
    const neededStartingSlots =
      Math.max(0, slots.QB - qbCount) +
      Math.max(0, slots.TE - teCount) +
      Math.max(0, slots.K - kCount) +
      Math.max(0, slots.DST - dstCount) +
      Math.max(0, slots.RB - rbCount) +
      Math.max(0, slots.WR - wrCount);
    const roundsRemaining = setup.rounds - currentRound + 1;
    const hasRosterUrgency = neededStartingSlots >= roundsRemaining;

    if (kCount >= slots.K || (currentRound < (setup.rounds - 1) && !hasRosterUrgency)) {
      positionMultiplier = 0.0;
    } else {
      positionMultiplier = 1.0;
    }
  } else if (pos === 'DST') {
    const neededStartingSlots =
      Math.max(0, slots.QB - qbCount) +
      Math.max(0, slots.TE - teCount) +
      Math.max(0, slots.K - kCount) +
      Math.max(0, slots.DST - dstCount) +
      Math.max(0, slots.RB - rbCount) +
      Math.max(0, slots.WR - wrCount);
    const roundsRemaining = setup.rounds - currentRound + 1;
    const hasRosterUrgency = neededStartingSlots >= roundsRemaining;

    if (dstCount >= slots.DST || (currentRound < (setup.rounds - 1) && !hasRosterUrgency)) {
      positionMultiplier = 0.0;
    } else {
      positionMultiplier = 1.0;
    }
  }

  const neededStartingSlots =
    Math.max(0, slots.QB - qbCount) +
    Math.max(0, slots.TE - teCount) +
    Math.max(0, slots.K - kCount) +
    Math.max(0, slots.DST - dstCount) +
    Math.max(0, slots.RB - rbCount) +
    Math.max(0, slots.WR - wrCount);
  const roundsRemaining = setup.rounds - currentRound + 1;
  if (neededStartingSlots >= roundsRemaining) {
    const isMissingQB = qbCount < slots.QB && pos === 'QB';
    const isMissingTE = teCount < slots.TE && pos === 'TE';
    const isMissingK = kCount < slots.K && pos === 'K';
    const isMissingDST = dstCount < slots.DST && pos === 'DST';
    const isMissingRB = rbCount < slots.RB && pos === 'RB';
    const isMissingWR = wrCount < slots.WR && pos === 'WR';
    if (!isMissingQB && !isMissingTE && !isMissingK && !isMissingDST && !isMissingRB && !isMissingWR) {
      positionMultiplier = 0.0;
    }
  }

  return score * positionMultiplier;
};

// ==========================================
// HYPER-OPTIMIZED BOT STRATEGY COEFFICIENTS
// Automatically trained via 100,000 simulation genetic Monte Carlo
// ==========================================
export const BOT_OPTIMIZED_PARAMS = {
  "Zero RB": {
    "earlyRoundRB_penalty": -40,
    "earlyRoundWRTE_bonus": 114.05917438751202,
    "roundLimit": 5
  },
  "Hero RB": {
    "anchorRB_bonus": 40,
    "earlyRB2_penalty": -65,
    "roundLimitAnchor": 2,
    "roundLimitRB2": 5
  },
  "Late QB/TE Focus": {
    "earlyQB_penalty": -60,
    "earlyTE_penalty": -60,
    "roundLimit": 6
  },
  "Balanced": {
    "adpSteal_multiplier": 1.2,
    "adpSteal_cap": 25,
    "adpGapThreshold": 6
  },
  "Robust RB": {
    "earlyRB_bonus": 90,
    "earlyQBTEWR_penalty": -20,
    "roundLimit": 3
  },
  "Elite QB/TE Premium": {
    "earlyQB_bonus": 80,
    "earlyTE_bonus": 80,
    "roundLimit": 4
  }
};

export const DEFAULT_BOT_PROFILES: { [name: string]: BotProfile } = {
  'Andy': { name: 'Andy', strategyCamp: 'Balanced', expertPreference: 'Andy', learningAccuracy: 0.96 },
  'Mike': { name: 'Mike', strategyCamp: 'Hero RB', expertPreference: 'Mike', learningAccuracy: 0.96 },
  'Jason': { name: 'Jason', strategyCamp: 'Late QB/TE Focus', expertPreference: 'Jason', learningAccuracy: 0.96 },
  'Sarah': { name: 'Sarah', strategyCamp: 'Hero RB', expertPreference: 'ECR Consensus', learningAccuracy: 0.94 },
  'David': { name: 'David', strategyCamp: 'Hero RB', expertPreference: 'ECR Consensus', learningAccuracy: 0.94 },
  'Jessica': { name: 'Jessica', strategyCamp: 'Balanced', expertPreference: 'ECR Consensus', learningAccuracy: 0.94 },
  'Michael': { name: 'Michael', strategyCamp: 'Balanced', expertPreference: 'ECR Consensus', learningAccuracy: 0.92 },
  'Emily': { name: 'Emily', strategyCamp: 'Balanced', expertPreference: 'ECR Consensus', learningAccuracy: 0.92 },
  'James': { name: 'James', strategyCamp: 'Balanced', expertPreference: 'Andy', learningAccuracy: 0.92 },
  'Ashley': { name: 'Ashley', strategyCamp: 'Robust RB', expertPreference: 'Mike', learningAccuracy: 0.9 },
  'Robert': { name: 'Robert', strategyCamp: 'Balanced', expertPreference: 'Jason', learningAccuracy: 0.9 },
  'Sophia': { name: 'Sophia', strategyCamp: 'Zero RB', expertPreference: 'ECR Consensus', learningAccuracy: 0.93 },
  'William': { name: 'William', strategyCamp: 'Elite QB/TE Premium', expertPreference: 'ECR Consensus', learningAccuracy: 0.91 }
};

export const getBotLearningAccuracy = (sims: number, initialAcc: number): number => {
  const maxAcc = 0.98;
  const growth = (maxAcc - initialAcc) * (1 - Math.exp(-sims / 3000));
  return Number((initialAcc + growth).toFixed(3));
};

export const calculateCpuPlayerScore = (
  player: Player,
  teamIdx: number,
  teamName: string,
  currentPick: number,
  setup: DraftSetup,
  roster: { QB: number; RB: number; WR: number; TE: number; K: number; DST: number },
  botTrainingSims = 10000
): number => {
  const formatKey = setup.leagueFormat === 'Half-PPR' ? 'halfPpr' : setup.leagueFormat === 'Standard' ? 'halfPpr' : setup.leagueFormat === 'Dynasty' ? 'dynasty' : 'ppr';
  const currentRound = Math.ceil(currentPick / setup.leagueSize);
  
  // Retrieve Bot Profile
  const profile = DEFAULT_BOT_PROFILES[teamName] || {
    name: teamName,
    strategyCamp: (teamIdx % 6 === 0 ? 'Balanced' : teamIdx % 6 === 1 ? 'Zero RB' : teamIdx % 6 === 2 ? 'Hero RB' : teamIdx % 6 === 3 ? 'Late QB/TE Focus' : teamIdx % 6 === 4 ? 'Robust RB' : 'Elite QB/TE Premium') as BotProfile['strategyCamp'],
    expertPreference: 'ECR Consensus' as BotProfile['expertPreference'],
    learningAccuracy: 0.90
  };

  // 1. Get base rank for this team based on preferred expert
  let baseRank = player.ranks[formatKey];
  if (profile.expertPreference && profile.expertPreference !== 'ECR Consensus') {
    baseRank = player.expertRanks[profile.expertPreference]?.[formatKey] ?? baseRank;
  }
  
  // Base Player Quality (ECR)
  let score = 300 - baseRank;
  
  // 2. Adjust based on Opponent Style Bias
  const style = setup.opponentStyle;
  if (style === 'Standard ADP') {
    score = 300 - (player.adp * 0.7 + baseRank * 0.3);
  } else if (style === 'Casual League') {
    const seed = teamIdx * 50 + player.ranks[formatKey] + currentPick;
    const noise = Math.sin(seed) * 18;
    score = 300 - (player.adp * 0.65 + baseRank * 0.35) + noise;
  } else if (style === 'Beat the Sharks') {
    const adpValueGap = currentPick - player.adp;
    if (adpValueGap > 8) {
      score += Math.min(30, adpValueGap * 1.5);
    }
  }
  
  // 3. Scale strategy camp and learning accuracy adjustments
  const camp = profile.strategyCamp;
  const accuracy = getBotLearningAccuracy(botTrainingSims, profile.learningAccuracy);
  
  // Inject random decision noise that shrinks as bot learns/improves
  const noiseFactor = (1 - accuracy) * 80;
  const seed = teamIdx * 100 + player.ranks[formatKey];
  const personalPreference = Math.sin(seed) * 5 + (Math.sin(seed * 1.5) * noiseFactor);
  score += personalPreference;
  
  const pos = player.position;
  
  // 4. Custom rules adjustments
  if (pos === 'QB' && setup.passingTdPoints === 6) {
    score += 15;
  }
  if (pos === 'TE' && setup.tePremium) {
    score += 15;
  }
  
  // 5. Apply Strategy Camp Logic with Contextual Penalty Scaling (Mitigation)
  const valueGap = currentPick - player.adp;
  const valueStealMitigation = valueGap > 10 ? Math.min(50, valueGap * 3.0) : 0;

  if (camp === 'Zero RB') {
    const params = BOT_OPTIMIZED_PARAMS['Zero RB'];
    if (currentRound <= params.roundLimit) {
      if (pos === 'RB') score += Math.min(0, params.earlyRoundRB_penalty + valueStealMitigation);
      if (pos === 'WR' || pos === 'TE') score += params.earlyRoundWRTE_bonus;
    }
  } else if (camp === 'Hero RB') {
    const params = BOT_OPTIMIZED_PARAMS['Hero RB'];
    if (pos === 'RB') {
      if (currentRound <= params.roundLimitAnchor) {
        if (roster.RB === 0) score += params.anchorRB_bonus;
      } else if (currentRound <= params.roundLimitRB2) {
        score += Math.min(0, params.earlyRB2_penalty + valueStealMitigation);
      }
    }
  } else if (camp === 'Late QB/TE Focus') {
    const params = BOT_OPTIMIZED_PARAMS['Late QB/TE Focus'];
    if (currentRound < params.roundLimit) {
      if (pos === 'QB') score += Math.min(0, params.earlyQB_penalty + valueStealMitigation);
      if (pos === 'TE') score += Math.min(0, params.earlyTE_penalty + valueStealMitigation);
    }
  } else if (camp === 'Balanced') {
    const params = BOT_OPTIMIZED_PARAMS['Balanced'];
    const gap = currentPick - player.adp;
    if (gap > params.adpGapThreshold) {
      score += Math.min(params.adpSteal_cap, gap * params.adpSteal_multiplier);
    }
  } else if (camp === 'Robust RB') {
    const params = BOT_OPTIMIZED_PARAMS['Robust RB'];
    if (currentRound <= params.roundLimit) {
      if (pos === 'RB') score += params.earlyRB_bonus;
      if (pos === 'QB' || pos === 'TE' || pos === 'WR') score += Math.min(0, params.earlyQBTEWR_penalty + valueStealMitigation);
    }
  } else if (camp === 'Elite QB/TE Premium') {
    const params = BOT_OPTIMIZED_PARAMS['Elite QB/TE Premium'];
    if (currentRound <= params.roundLimit) {
      if (pos === 'QB' && roster.QB === 0) score += params.earlyQB_bonus;
      if (pos === 'TE' && roster.TE === 0) score += params.earlyTE_bonus;
      if (pos === 'RB' || pos === 'WR') score += Math.min(0, -25 + valueStealMitigation);
    }
  }
  
  // 6. Roster Construction Urgency, Caps, & Final Round K/DST Lock
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

  const finalPicksCount = 2 * setup.leagueSize;
  const totalPicks = setup.rounds * setup.leagueSize;
  const isFinalTwoRounds = currentPick > (totalPicks - finalPicksCount);
  
  const neededStartingSlots =
    Math.max(0, slots.QB - roster.QB) +
    Math.max(0, slots.TE - roster.TE) +
    Math.max(0, slots.K - roster.K) +
    Math.max(0, slots.DST - roster.DST) +
    Math.max(0, slots.RB - roster.RB) +
    Math.max(0, slots.WR - roster.WR);
  const roundsRemaining = setup.rounds - currentRound + 1;
  const hasRosterUrgency = neededStartingSlots >= roundsRemaining;

  if (pos === 'K' || pos === 'DST') {
    if (!isFinalTwoRounds && !hasRosterUrgency) {
      return -99999;
    }
    if (pos === 'K' && roster.K < slots.K) score += 150;
    if (pos === 'DST' && roster.DST < slots.DST) score += 150;
  }

  // Strict Complete Roster Rule (Force missing starting positions)
  if (hasRosterUrgency) {
    const isMissingQB = roster.QB < slots.QB && pos === 'QB';
    const isMissingTE = roster.TE < slots.TE && pos === 'TE';
    const isMissingK = roster.K < slots.K && pos === 'K';
    const isMissingDST = roster.DST < slots.DST && pos === 'DST';
    const isMissingRB = roster.RB < slots.RB && pos === 'RB';
    const isMissingWR = roster.WR < slots.WR && pos === 'WR';
    if (!isMissingQB && !isMissingTE && !isMissingK && !isMissingDST && !isMissingRB && !isMissingWR) {
      return -99999;
    }
  }
  
  // Positional starters urgency
  if (pos === 'QB' && roster.QB === 0 && currentRound >= 9) score += 35;
  if (pos === 'TE' && roster.TE === 0 && currentRound >= 9) score += 35;
  if (pos === 'RB' && roster.RB === 0 && currentRound >= 5) score += 25;
  if (pos === 'WR' && roster.WR === 0 && currentRound >= 5) score += 25;
  
  // Positional caps
  if (pos === 'QB') {
    if (roster.QB === slots.QB) {
      score -= currentRound <= 11 ? 120 : 40;
    } else if (roster.QB >= slots.QB + Math.ceil(slots.BENCH / 5)) {
      return -9999;
    }
  } else if (pos === 'TE') {
    if (roster.TE === slots.TE) {
      score -= currentRound <= 11 ? 120 : 40;
    } else if (roster.TE >= slots.TE + Math.ceil(slots.BENCH / 5)) {
      return -9999;
    }
  } else if (pos === 'RB') {
    if (roster.RB >= slots.RB + slots.FLEX + Math.ceil(slots.BENCH / 2)) {
      return -9999;
    }
  } else if (pos === 'WR') {
    if (roster.WR >= slots.WR + slots.FLEX + Math.ceil(slots.BENCH / 2)) {
      return -9999;
    }
  } else if (pos === 'K') {
    if (roster.K >= slots.K) return -9999;
  } else if (pos === 'DST') {
    if (roster.DST >= slots.DST) return -9999;
  }
  
  return score;
};

// Helper to sort players and recalculate positional ranks for a chosen format and rankings base
export const applyFormatAndSort = (
  players: Player[],
  format: 'Standard' | 'Half-PPR' | 'PPR' | 'Dynasty',
  rankingsBase: 'ECR Consensus' | 'Andy' | 'Mike' | 'Jason' | 'My Ranks',
  myRanks?: Player[] | null
): Player[] => {
  if (rankingsBase === 'My Ranks') {
    const customList = myRanks && myRanks.length > 0 ? myRanks : [];
    const customNames = new Set(customList.map(p => p.name.toLowerCase().trim()));
    const remaining = players.filter(p => !customNames.has(p.name.toLowerCase().trim()));
    const base = [...customList, ...remaining];
    
    const posCounts: { [key: string]: number } = {};
    return base.map((p, idx) => {
      const pos = p.position;
      posCounts[pos] = (posCounts[pos] || 0) + 1;
      return {
        ...p,
        rank: idx + 1,
        posRank: `${pos}${posCounts[pos]}`,
        draftedBy: null
      };
    });
  }

  const formatKey = format === 'Half-PPR' ? 'halfPpr' : format === 'Standard' ? 'halfPpr' : format === 'Dynasty' ? 'dynasty' : 'ppr';
  
  // Create copies of players with rank set to their format or expert specific rank
  const updated = players.map(p => {
    let chosenRank = p.ranks[formatKey];
    if (rankingsBase !== 'ECR Consensus') {
      chosenRank = p.expertRanks[rankingsBase]?.[formatKey] ?? chosenRank;
    }
    return {
      ...p,
      rank: chosenRank
    };
  });
  
  // Sort players by rank ascending
  updated.sort((a, b) => a.rank - b.rank);
  
  // Recalculate positional ranks (posRank) based on sorted order in this format
  const posCounts: { [key: string]: number } = {};
  return updated.map(p => {
    const pos = p.position;
    posCounts[pos] = (posCounts[pos] || 0) + 1;
    return {
      ...p,
      posRank: `${pos}${posCounts[pos]}`
    };
  });
};

// Fast Simulated Draft Runner
export const runFastSimulation = (
  setup: DraftSetup,
  myRanks: Player[] | null,
  botProfiles: { [name: string]: BotProfile },
  botTrainingSims = 10000,
  rotationOffset = 0,
  preSortedPlayers?: Player[],
  customUserTeamName?: string
): HistoricalDraft => {
  const players = preSortedPlayers || applyFormatAndSort(generateMockRankings(), setup.leagueFormat, setup.rankingsBase, myRanks);
  
  // Reset draftedBy directly to avoid mapping allocation overhead
  for (let i = 0; i < players.length; i++) {
    players[i].draftedBy = null;
  }

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
    const teamName = getTeamNameForIndex((activeTeamIdx + rotationOffset) % setup.leagueSize, setup.userPosition, customUserTeamName);
    
    while (firstUndraftedCursor < players.length && players[firstUndraftedCursor].draftedBy) {
      firstUndraftedCursor++;
    }
    if (firstUndraftedCursor >= players.length) break;
    
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
      while (pool.length < 15 && cursor < players.length) {
        const p = players[cursor];
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
        while (pool.length < 15 && fallbackCursor < players.length) {
          const p = players[fallbackCursor];
          if (!p.draftedBy) {
            pool.push(p);
          }
          fallbackCursor++;
        }
      }
    } else {
      let cursor = firstUndraftedCursor;
      while (pool.length < 15 && cursor < players.length) {
        const p = players[cursor];
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
      if (teamName === getUserTeamName()) {
        const bestAvailableRank = players[firstUndraftedCursor].rank;
        score = getPlayerSuggestionScore(player, pick, setup, roster, bestAvailableRank);
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

  // Set draftedBy directly on all players to null to avoid mapping allocation overhead
  for (let i = 0; i < players.length; i++) {
    players[i].draftedBy = null;
  }
  
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
  
  const teams = Array.from({ length: setup.leagueSize }, (_, idx) => {
    const name = getTeamNameForIndex((idx + rotationOffset) % setup.leagueSize, setup.userPosition);
    let strategyCamp: BotProfile['strategyCamp'] = 'Balanced';
    let expertPreference: BotProfile['expertPreference'] = 'ECR Consensus';
    
    if (name === getUserTeamName()) {
      strategyCamp = (setup.userStrategy || 'Balanced') as BotProfile['strategyCamp'];
      expertPreference = setup.rankingsBase as BotProfile['expertPreference'];
    } else {
      const profile = botProfiles[name] || DEFAULT_BOT_PROFILES[name];
      if (profile) {
        strategyCamp = profile.strategyCamp;
        expertPreference = profile.expertPreference;
      }
    }
    
    return {
      teamIndex: idx,
      teamName: name,
      strategyCamp,
      expertPreference,
      grade: grades[idx],
      wins: avgWins[idx],
      losses: avgLosses[idx],
      playoffChance: playoffChances[idx],
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
  
  const userIdx = teams.findIndex(t => t.teamName === getUserTeamName());
  const userRecord = userIdx !== -1 ? teams[userIdx] : teams[0];
  
  return {
    id: `draft_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
    timestamp: Date.now(),
    grade: userRecord ? userRecord.grade : 'B',
    valueScore: userIdx !== -1 ? valueScores[userIdx] : 0,
    playoffChance: userRecord ? userRecord.playoffChance : 50,
    projectedWins: userRecord ? userRecord.wins : 7,
    projectedLosses: userRecord ? userRecord.losses : 7,
    userPosition: userIdx !== -1 ? userIdx + 1 : setup.userPosition,
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
};

export const getPlayerTierInfo = (player: Player, filter: string, listIndex: number) => {
  const posIndex = parseInt(player.posRank.replace(/^[A-Z]+/i, ''), 10) || (listIndex + 1);
  const oneBasedListIndex = listIndex + 1;
  const overallRank = player.rank;

  if (filter === 'ALL') {
    if (overallRank <= 5) return { tier: 1, label: 'TIER 1 (ELITE)', color: '#ef4444' };
    if (overallRank <= 15) return { tier: 2, label: 'TIER 2 (STRONG STARTERS)', color: '#fbbf24' };
    if (overallRank <= 30) return { tier: 3, label: 'TIER 3 (SOLID OPTIONS)', color: '#fb923c' };
    if (overallRank <= 50) return { tier: 4, label: 'TIER 4 (FLEX / DEEP STARTERS)', color: '#60a5fa' };
    if (overallRank <= 75) return { tier: 5, label: 'TIER 5 (BENCH / UPSIDE)', color: '#4ade80' };
    if (overallRank <= 100) return { tier: 6, label: 'TIER 6 (BACKUPS)', color: '#c084fc' };
    if (overallRank <= 125) return { tier: 7, label: 'TIER 7 (DEEP ROSTER)', color: '#a7f3d0' };
    return { tier: 8, label: 'TIER 8 (DART THROWS)', color: '#94a3b8' };
  }

  if (filter === 'QB') {
    if (posIndex <= 3) return { tier: 1, label: 'TIER 1 (ELITE QB1)', color: '#ef4444' };
    if (posIndex <= 8) return { tier: 2, label: 'TIER 2 (STRONG QB1)', color: '#fbbf24' };
    if (posIndex <= 12) return { tier: 3, label: 'TIER 3 (LOW-END QB1)', color: '#fb923c' };
    if (posIndex <= 18) return { tier: 4, label: 'TIER 4 (STREAMER / HIGH QB2)', color: '#60a5fa' };
    if (posIndex <= 24) return { tier: 5, label: 'TIER 5 (LOW-END QB2)', color: '#4ade80' };
    return { tier: 6, label: 'TIER 6 (BACKUPS)', color: '#c084fc' };
  }

  if (filter === 'RB') {
    if (posIndex <= 4) return { tier: 1, label: 'TIER 1 (ELITE RB1)', color: '#ef4444' };
    if (posIndex <= 12) return { tier: 2, label: 'TIER 2 (STRONG RB1)', color: '#fbbf24' };
    if (posIndex <= 20) return { tier: 3, label: 'TIER 3 (SOLID RB2)', color: '#fb923c' };
    if (posIndex <= 30) return { tier: 4, label: 'TIER 4 (FLEX / RB3)', color: '#60a5fa' };
    if (posIndex <= 42) return { tier: 5, label: 'TIER 5 (UPSIDE BENCH)', color: '#4ade80' };
    return { tier: 6, label: 'TIER 6 (HANDCUFFS)', color: '#c084fc' };
  }

  if (filter === 'WR') {
    if (posIndex <= 5) return { tier: 1, label: 'TIER 1 (ELITE WR1)', color: '#ef4444' };
    if (posIndex <= 15) return { tier: 2, label: 'TIER 2 (STRONG WR1/2)', color: '#fbbf24' };
    if (posIndex <= 25) return { tier: 3, label: 'TIER 3 (SOLID WR2)', color: '#fb923c' };
    if (posIndex <= 40) return { tier: 4, label: 'TIER 4 (WR3 / FLEX)', color: '#60a5fa' };
    if (posIndex <= 60) return { tier: 5, label: 'TIER 5 (BENCH WR)', color: '#4ade80' };
    return { tier: 6, label: 'TIER 6 (DEEP ROSTER)', color: '#c084fc' };
  }

  if (filter === 'TE') {
    if (posIndex <= 3) return { tier: 1, label: 'TIER 1 (ELITE TE1)', color: '#ef4444' };
    if (posIndex <= 7) return { tier: 2, label: 'TIER 2 (STRONG STARTERS)', color: '#fbbf24' };
    if (posIndex <= 12) return { tier: 3, label: 'TIER 3 (STREAMERS / TE2)', color: '#fb923c' };
    return { tier: 4, label: 'TIER 4 (BACKUPS)', color: '#60a5fa' };
  }

  if (filter === 'FLEX') {
    if (oneBasedListIndex <= 10) return { tier: 1, label: 'TIER 1 (ELITE FLEX STARTERS)', color: '#ef4444' };
    if (oneBasedListIndex <= 25) return { tier: 2, label: 'TIER 2 (STRONG FLEX)', color: '#fbbf24' };
    if (oneBasedListIndex <= 50) return { tier: 3, label: 'TIER 3 (SOLID FLEX)', color: '#fb923c' };
    if (oneBasedListIndex <= 80) return { tier: 4, label: 'TIER 4 (FLEX OPTION)', color: '#60a5fa' };
    if (oneBasedListIndex <= 120) return { tier: 5, label: 'TIER 5 (BENCH FLEX)', color: '#4ade80' };
    return { tier: 6, label: 'TIER 6 (DEEP BENCH)', color: '#c084fc' };
  }

  if (filter === 'K' || filter === 'DST') {
    if (posIndex <= 3) return { tier: 1, label: 'TIER 1 (ELITE)', color: '#ef4444' };
    if (posIndex <= 8) return { tier: 2, label: 'TIER 2 (STRONG)', color: '#fbbf24' };
    if (posIndex <= 12) return { tier: 3, label: 'TIER 3 (STREAMER)', color: '#fb923c' };
    return { tier: 4, label: 'TIER 4 (OTHERS)', color: '#60a5fa' };
  }

  return { tier: 1, label: 'TIER 1', color: '#ef4444' };
};

