/**
 * Continuous Background Draft Simulator & ML Optimizer
 * Runs in the background on the host system to simulate millions of drafts.
 * Enforces strict starting roster completeness and draft slot rotations.
 * Continuously writes evolved parameters and real-time standings to scratch_live_metrics.json.
 */

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

let masterPlayers;
const scratchPlayersPath = path.join(__dirname, '../scratch_players_code.txt');
if (fs.existsSync(scratchPlayersPath)) {
  const content = fs.readFileSync(scratchPlayersPath, 'utf8');
  try {
    masterPlayers = eval('[' + content + ']');
    console.log(`✅ Loaded ${masterPlayers.length} players from scratch_players_code.txt for background simulation.`);
  } catch (err) {
    console.error('Failed to parse players from scratch_players_code.txt:', err);
    process.exit(1);
  }
} else {
  console.error('scratch_players_code.txt not found!');
  process.exit(1);
}

const STRATEGY_PARAMS = {
  'Zero RB': { earlyRoundRB_penalty: -90.0, earlyRoundWRTE_bonus: 25.0, roundLimit: 5 },
  'Hero RB': { anchorRB_bonus: 40.0, earlyRB2_penalty: -65.0, roundLimitAnchor: 2, roundLimitRB2: 5 },
  'Late QB/TE Focus': { earlyQB_penalty: -60.0, earlyTE_penalty: -60.0, roundLimit: 6 },
  'Balanced': { adpSteal_multiplier: 1.2, adpSteal_cap: 25.0, adpGapThreshold: 6 },
  'Robust RB': { earlyRB_bonus: 90.0, earlyQBTEWR_penalty: -25.0, roundLimit: 3 },
  'Elite QB/TE Premium': { earlyQB_bonus: 55.0, earlyTE_bonus: 55.0, roundLimit: 4 }
};

const BOT_PROFILES = {
  'Andy': { name: 'Andy', strategyCamp: 'Balanced', expertPreference: 'Andy', learningAccuracy: 0.96 },
  'Mike': { name: 'Mike', strategyCamp: 'Hero RB', expertPreference: 'Mike', learningAccuracy: 0.96 },
  'Jason': { name: 'Jason', strategyCamp: 'Late QB/TE Focus', expertPreference: 'Jason', learningAccuracy: 0.96 },
  'Sarah': { name: 'Sarah', strategyCamp: 'Zero RB', expertPreference: 'ECR Consensus', learningAccuracy: 0.94 },
  'David': { name: 'David', strategyCamp: 'Hero RB', expertPreference: 'ECR Consensus', learningAccuracy: 0.94 },
  'Jessica': { name: 'Jessica', strategyCamp: 'Balanced', expertPreference: 'ECR Consensus', learningAccuracy: 0.94 },
  'Michael': { name: 'Michael', strategyCamp: 'Elite QB/TE Premium', expertPreference: 'ECR Consensus', learningAccuracy: 0.92 },
  'Emily': { name: 'Emily', strategyCamp: 'Zero RB', expertPreference: 'ECR Consensus', learningAccuracy: 0.92 },
  'James': { name: 'James', strategyCamp: 'Balanced', expertPreference: 'Andy', learningAccuracy: 0.92 },
  'Ashley': { name: 'Ashley', strategyCamp: 'Robust RB', expertPreference: 'Mike', learningAccuracy: 0.90 },
  'Robert': { name: 'Robert', strategyCamp: 'Elite QB/TE Premium', expertPreference: 'Jason', learningAccuracy: 0.90 },
  'Your Team': { name: 'Your Team', strategyCamp: 'Robust RB', expertPreference: 'ECR Consensus', learningAccuracy: 0.95 }
};

const formats = ['PPR', 'Half-PPR', 'Standard'];
const opponentStyles = ['Expert Consensus', 'Standard ADP', 'Casual League'];

const applyFormatAndSort = (players, format) => {
  const formatKey = format === 'Half-PPR' ? 'halfPpr' : format === 'Standard' ? 'halfPpr' : 'ppr';
  return [...players].map(p => ({
    ...p,
    rank: p.ranks[formatKey] || p.rank,
    adp: p.adp
  })).sort((a, b) => a.rank - b.rank);
};

// Pre-generate and cache sorted players lists for each format at startup
const cachedFormattedPlayers = {};
formats.forEach(f => {
  cachedFormattedPlayers[f] = applyFormatAndSort(masterPlayers, f);
});

const calculateCpuPlayerScore = (player, activeTeamIdx, teamName, currentPick, setup, roster) => {
  const profile = BOT_PROFILES[teamName] || { strategyCamp: 'Balanced', expertPreference: 'ECR Consensus' };
  const camp = profile.strategyCamp;
  const currentRound = Math.ceil(currentPick / setup.leagueSize);
  const pos = player.position;

  // Strict complete roster locks
  const neededStartingSlots =
    (roster.QB === 0 ? 1 : 0) +
    (roster.TE === 0 ? 1 : 0) +
    (roster.K === 0 ? 1 : 0) +
    (roster.DST === 0 ? 1 : 0) +
    Math.max(0, 2 - roster.RB) +
    Math.max(0, 2 - roster.WR);
  const roundsRemaining = setup.rounds - currentRound + 1;
  const hasRosterUrgency = neededStartingSlots >= roundsRemaining;

  if (hasRosterUrgency) {
    const isMissingQB = roster.QB === 0 && pos === 'QB';
    const isMissingTE = roster.TE === 0 && pos === 'TE';
    const isMissingK = roster.K === 0 && pos === 'K';
    const isMissingDST = roster.DST === 0 && pos === 'DST';
    const isMissingRB = roster.RB < 2 && pos === 'RB';
    const isMissingWR = roster.WR < 2 && pos === 'WR';
    if (!isMissingQB && !isMissingTE && !isMissingK && !isMissingDST && !isMissingRB && !isMissingWR) {
      return -99999;
    }
  }

  // Delay Kickers / DST strictly to final rounds (UNLESS there is roster urgency)
  const totalPicks = setup.rounds * setup.leagueSize;
  const finalPicksCount = 2 * setup.leagueSize;
  const isFinalTwoRounds = currentPick > (totalPicks - finalPicksCount);
  if (pos === 'K' || pos === 'DST') {
    if (!isFinalTwoRounds && !hasRosterUrgency) return -99999;
    if (pos === 'K' && roster.K > 0) return -99999;
    if (pos === 'DST' && roster.DST > 0) return -99999;
    return 150 - player.rank;
  }

  let score = 300 - player.rank;

  const valueGap = currentPick - player.adp;
  const valueStealMitigation = valueGap > 10 ? Math.min(50, valueGap * 3.0) : 0;

  if (camp === 'Zero RB') {
    const params = STRATEGY_PARAMS['Zero RB'];
    if (currentRound <= params.roundLimit) {
      if (pos === 'RB') score += Math.min(0, params.earlyRoundRB_penalty + valueStealMitigation);
      if (pos === 'WR' || pos === 'TE') score += params.earlyRoundWRTE_bonus;
    }
  } else if (camp === 'Hero RB') {
    const params = STRATEGY_PARAMS['Hero RB'];
    if (pos === 'RB') {
      if (currentRound <= params.roundLimitAnchor) {
        if (roster.RB === 0) score += params.anchorRB_bonus;
      } else if (currentRound <= params.roundLimitRB2) {
        score += Math.min(0, params.earlyRB2_penalty + valueStealMitigation);
      }
    }
  } else if (camp === 'Late QB/TE Focus') {
    const params = STRATEGY_PARAMS['Late QB/TE Focus'];
    if (currentRound < params.roundLimit) {
      if (pos === 'QB') score += Math.min(0, params.earlyQB_penalty + valueStealMitigation);
      if (pos === 'TE') score += Math.min(0, params.earlyTE_penalty + valueStealMitigation);
    }
  } else if (camp === 'Balanced') {
    const params = STRATEGY_PARAMS['Balanced'];
    const gap = currentPick - player.adp;
    if (gap > params.adpGapThreshold) {
      score += Math.min(params.adpSteal_cap, gap * params.adpSteal_multiplier);
    }
  } else if (camp === 'Robust RB') {
    const params = STRATEGY_PARAMS['Robust RB'];
    if (currentRound <= params.roundLimit) {
      if (pos === 'RB') score += params.earlyRB_bonus;
      if (pos === 'QB' || pos === 'TE' || pos === 'WR') score += Math.min(0, params.earlyQBTEWR_penalty + valueStealMitigation);
    }
  } else if (camp === 'Elite QB/TE Premium') {
    const params = STRATEGY_PARAMS['Elite QB/TE Premium'];
    if (currentRound <= params.roundLimit) {
      if (pos === 'QB' && roster.QB === 0) score += params.earlyQB_bonus;
      if (pos === 'TE' && roster.TE === 0) score += params.earlyTE_bonus;
      if (pos === 'RB' || pos === 'WR') score += Math.min(0, -25 + valueStealMitigation);
    }
  }

  if (pos === 'QB' && roster.QB >= 2) return -99999;
  if (pos === 'TE' && roster.TE >= 2) return -99999;
  if (pos === 'RB' && roster.RB >= 5) return -99999;
  if (pos === 'WR' && roster.WR >= 6) return -99999;

  return score;
};

const getTeamNameForIndex = (idx, rotationOffset = 0) => {
  const names = Object.keys(BOT_PROFILES);
  const rotatedIdx = (idx + rotationOffset) % names.length;
  return names[rotatedIdx] || `CPU RIVAL ${rotatedIdx}`;
};

const getTeamIndexForPick = (pick, leagueSize, draftType) => {
  const round = Math.ceil(pick / leagueSize);
  const indexInRound = (pick - 1) % leagueSize;
  if (draftType === 'Snake' && round % 2 === 0) {
    return leagueSize - 1 - indexInRound;
  }
  return indexInRound;
};

const calculateRosterPoints = (roster) => {
  let qb_max = 0;
  let rb1 = 0, rb2 = 0;
  let wr1 = 0, wr2 = 0;
  let te_max = 0;
  let k_max = 0;
  let dst_max = 0;
  let flex_max = 0;

  for (let i = 0; i < roster.length; i++) {
    const p = roster[i];
    const pts = p.projectedPoints;
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

  return qb_max + rb1 + rb2 + wr1 + wr2 + te_max + flex_max + k_max + dst_max;
};

const runSimulationUnit = (setup, rotationOffset = 0, preSortedPlayers) => {
  const players = preSortedPlayers || applyFormatAndSort(masterPlayers, setup.leagueFormat);
  const totalPicks = setup.rounds * setup.leagueSize;

  // Clear draftedBy statuses on players directly to avoid array mapping allocations
  for (let i = 0; i < players.length; i++) {
    players[i].draftedBy = null;
  }

  const teamRosterCounts = Array.from({ length: setup.leagueSize }, () => ({
    QB: 0, RB: 0, WR: 0, TE: 0, K: 0, DST: 0
  }));
  const teamRosterPlayers = Array.from({ length: setup.leagueSize }, () => []);

  let firstUndraftedCursor = 0;

  for (let pick = 1; pick <= totalPicks; pick++) {
    const activeTeamIdx = getTeamIndexForPick(pick, setup.leagueSize, setup.draftType);
    const teamName = getTeamNameForIndex(activeTeamIdx, rotationOffset);

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

    let pool = [];
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
    let bestScore = -100000;

    for (let i = 0; i < pool.length; i++) {
      const player = pool[i];
      const score = calculateCpuPlayerScore(
        player,
        activeTeamIdx,
        teamName,
        pick,
        setup,
        roster
      );
      if (score > bestScore) {
        bestScore = score;
        chosenPlayer = player;
      }
    }

    if (chosenPlayer) {
      chosenPlayer.draftedBy = teamName;
      teamRosterPlayers[activeTeamIdx].push(chosenPlayer);
      roster[chosenPlayer.position]++;
    }
  }

  // Reset draftedBy for future simulations
  for (let i = 0; i < players.length; i++) {
    players[i].draftedBy = null;
  }

  const teamBaselines = teamRosterPlayers.map(r => calculateRosterPoints(r));
  const wins = Array(setup.leagueSize).fill(0);
  const numWeeks = 14;
  const simCount = 5;

  const weeklyScores = new Float64Array(setup.leagueSize);
  const unpaired = new Int32Array(setup.leagueSize);
  const simWins = new Int32Array(setup.leagueSize);

  for (let sim = 0; sim < simCount; sim++) {
    simWins.fill(0);
    for (let week = 0; week < numWeeks; week++) {
      for (let i = 0; i < setup.leagueSize; i++) {
        weeklyScores[i] = (teamBaselines[i] / numWeeks) + (Math.random() - 0.5) * 35;
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
        if (weeklyScores[t1] > weeklyScores[t2]) simWins[t1]++;
        else simWins[t2]++;
      }
    }
    for (let i = 0; i < setup.leagueSize; i++) wins[i] += simWins[i];
  }

  return Array.from({ length: setup.leagueSize }, (_, i) => {
    const name = getTeamNameForIndex(i, rotationOffset);
    const r = teamRosterCounts[i];
    const invalid = (r.QB < 1 || r.RB < 2 || r.WR < 2 || r.TE < 1 || r.K < 1 || r.DST < 1);
    return {
      teamIdx: i,
      teamName: name,
      strategyCamp: BOT_PROFILES[name].strategyCamp,
      wins: Number((wins[i] / simCount).toFixed(1)),
      losses: Number((numWeeks - (wins[i] / simCount)).toFixed(1)),
      invalid
    };
  });
};

// Continuous background loop stats
const liveStats = {
  totalSims: 0,
  botRecords: {},
  strategyRecords: {},
  slotRecords: {},
  parameterMutations: STRATEGY_PARAMS,
  rosterViolations: 0,
  lastUpdated: Date.now()
};

const outputFilePath = path.join(__dirname, '../scratch_live_metrics.json');

console.log('🏁 Background Draft Simulator Service initialized. Writing updates to scratch_live_metrics.json...');

const runContinuousLoop = () => {
  const batchSize = 2000;
  for (let b = 0; b < batchSize; b++) {
    const offset = Math.floor(Math.random() * 12);
    const setup = {
      leagueSize: 12,
      rounds: 15,
      draftType: 'Snake',
      leagueFormat: formats[b % formats.length],
      opponentStyle: opponentStyles[b % opponentStyles.length]
    };

    const results = runSimulationUnit(setup, offset, cachedFormattedPlayers[setup.leagueFormat]);
    results.forEach(res => {
      // Bot records
      if (!liveStats.botRecords[res.teamName]) {
        liveStats.botRecords[res.teamName] = { wins: 0, losses: 0 };
      }
      liveStats.botRecords[res.teamName].wins += res.wins;
      liveStats.botRecords[res.teamName].losses += res.losses;

      // Strategy camp records
      if (!liveStats.strategyRecords[res.strategyCamp]) {
        liveStats.strategyRecords[res.strategyCamp] = { wins: 0, losses: 0 };
      }
      liveStats.strategyRecords[res.strategyCamp].wins += res.wins;
      liveStats.strategyRecords[res.strategyCamp].losses += res.losses;

      // Draft slot records
      const slot = res.teamIdx + 1;
      if (!liveStats.slotRecords[slot]) {
        liveStats.slotRecords[slot] = { wins: 0, losses: 0 };
      }
      liveStats.slotRecords[slot].wins += res.wins;
      liveStats.slotRecords[slot].losses += res.losses;

      if (res.invalid) {
        liveStats.rosterViolations++;
      }
    });

    liveStats.totalSims++;
  }

  // 1. Identify worst-performing strategy camp (Lowest Win Rate)
  let worstCamp = 'Robust RB';
  let lowestWinRate = 1.0;
  Object.entries(liveStats.strategyRecords).forEach(([camp, rec]) => {
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
  const step = 0.5 + Math.random() * 1.5;
  
  if (worstCamp === 'Robust RB') {
    if (Math.random() > 0.5) {
      liveStats.parameterMutations['Robust RB'].earlyRB_bonus = Number((Math.min(120, (liveStats.parameterMutations['Robust RB'].earlyRB_bonus || 90) + step)).toFixed(2));
    } else {
      liveStats.parameterMutations['Robust RB'].earlyQBTEWR_penalty = Number((Math.min(-10, (liveStats.parameterMutations['Robust RB'].earlyQBTEWR_penalty || -25) + step)).toFixed(2));
    }
  } else if (worstCamp === 'Late QB/TE Focus') {
    if (Math.random() > 0.5) {
      liveStats.parameterMutations['Late QB/TE Focus'].earlyQB_penalty = Number((Math.min(-20, (liveStats.parameterMutations['Late QB/TE Focus'].earlyQB_penalty || -60) + step)).toFixed(2));
    } else {
      liveStats.parameterMutations['Late QB/TE Focus'].earlyTE_penalty = Number((Math.min(-20, (liveStats.parameterMutations['Late QB/TE Focus'].earlyTE_penalty || -60) + step)).toFixed(2));
    }
  } else if (worstCamp === 'Zero RB') {
    if (Math.random() > 0.5) {
      liveStats.parameterMutations['Zero RB'].earlyRoundRB_penalty = Number((Math.min(-30, (liveStats.parameterMutations['Zero RB'].earlyRoundRB_penalty || -90) + step)).toFixed(2));
    } else {
      liveStats.parameterMutations['Zero RB'].earlyRoundWRTE_bonus = Number((Math.min(60, (liveStats.parameterMutations['Zero RB'].earlyRoundWRTE_bonus || 25) + step)).toFixed(2));
    }
  } else if (worstCamp === 'Hero RB') {
    if (Math.random() > 0.5) {
      liveStats.parameterMutations['Hero RB'].anchorRB_bonus = Number((Math.min(80, (liveStats.parameterMutations['Hero RB'].anchorRB_bonus || 40) + step)).toFixed(2));
    } else {
      liveStats.parameterMutations['Hero RB'].earlyRB2_penalty = Number((Math.min(-20, (liveStats.parameterMutations['Hero RB'].earlyRB2_penalty || -65) + step)).toFixed(2));
    }
  } else if (worstCamp === 'Balanced') {
    if (Math.random() > 0.5) {
      liveStats.parameterMutations['Balanced'].adpSteal_multiplier = Number((Math.min(3.0, (liveStats.parameterMutations['Balanced'].adpSteal_multiplier || 1.2) + step * 0.05)).toFixed(2));
    } else {
      liveStats.parameterMutations['Balanced'].adpGapThreshold = Number((Math.max(2, (liveStats.parameterMutations['Balanced'].adpGapThreshold || 6) - 0.1)).toFixed(2));
    }
  } else if (worstCamp === 'Elite QB/TE Premium') {
    if (Math.random() > 0.5) {
      liveStats.parameterMutations['Elite QB/TE Premium'].earlyQB_bonus = Number((Math.min(80, (liveStats.parameterMutations['Elite QB/TE Premium'].earlyQB_bonus || 55) + step)).toFixed(2));
    } else {
      liveStats.parameterMutations['Elite QB/TE Premium'].earlyTE_bonus = Number((Math.min(80, (liveStats.parameterMutations['Elite QB/TE Premium'].earlyTE_bonus || 55) + step)).toFixed(2));
    }
  }

  // Add tiny exploration noise to ALL strategy parameters to keep them dynamic
  Object.keys(liveStats.parameterMutations).forEach(camp => {
    Object.keys(liveStats.parameterMutations[camp]).forEach(param => {
      if (typeof liveStats.parameterMutations[camp][param] === 'number') {
        const noise = (Math.random() - 0.5) * 0.15;
        liveStats.parameterMutations[camp][param] = Number((liveStats.parameterMutations[camp][param] + noise).toFixed(2));
      }
    });
  });

  liveStats.lastUpdated = Date.now();

  try {
    fs.writeFileSync(outputFilePath, JSON.stringify(liveStats, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write metrics file:', err);
  }

  // Schedule next batch immediately to run at maximum performance (10x+ speedup)
  setImmediate(runContinuousLoop);
};

runContinuousLoop();
