/**
 * Headless Evaluator for Final Standings
 * Runs a high-performance simulation of 20,000 drafts using the hyper-optimized 
 * strategy parameters to determine the exact total records and playoff rates 
 * of ALL 12 teams in the league.
 */

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

// ============================================================================
// 1. DYNAMIC PLAYER RANKINGS PARSER
// ============================================================================
console.log('📖 Loading Top 250 unified player database from scratch_players_code.txt...');
let masterPlayers;
const scratchPlayersPath = path.join(__dirname, '../scratch_players_code.txt');
if (fs.existsSync(scratchPlayersPath)) {
  const content = fs.readFileSync(scratchPlayersPath, 'utf8');
  try {
    masterPlayers = eval('[' + content + ']');
    console.log(`✅ Successfully loaded ${masterPlayers.length} real players.`);
  } catch (err) {
    console.error('Failed to parse players from scratch_players_code.txt:', err);
    process.exit(1);
  }
} else {
  console.error('scratch_players_code.txt not found!');
  process.exit(1);
}

// ============================================================================
// 2. HYPER-OPTIMIZED STRATEGY PARAMETERS & BOT PROFILES
// ============================================================================
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

// ============================================================================
// 3. Monte Carlo Simulator Core
// ============================================================================
const applyFormatAndSort = (players, format) => {
  const formatKey = format === 'Half-PPR' ? 'halfPpr' : format === 'Standard' ? 'halfPpr' : 'ppr';
  return [...players].map(p => ({
    ...p,
    rank: p.ranks[formatKey] || p.rank,
    adp: p.adp
  })).sort((a, b) => a.rank - b.rank);
};

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

  // Enforce strict kicker and defense last always rules (final two rounds only, UNLESS there is roster urgency)
  const totalPicks = setup.rounds * setup.leagueSize;
  const finalPicksCount = 2 * setup.leagueSize;
  const isFinalTwoRounds = currentPick > (totalPicks - finalPicksCount);

  if (pos === 'K' || pos === 'DST') {
    if (!isFinalTwoRounds && !hasRosterUrgency) {
      return -99999; // Never pick K/DST early
    }
    let kdstScore = 150 - player.rank;
    if (pos === 'K' && roster.K > 0) return -99999;
    if (pos === 'DST' && roster.DST > 0) return -99999;
    return kdstScore;
  }

  // Base ECR score
  let baseRank = player.rank;
  let score = 300 - baseRank;

  // Contextual Penalty Scaling (Value Mitigation)
  const valueGap = currentPick - player.adp;
  const valueStealMitigation = valueGap > 10 ? Math.min(50, valueGap * 3.0) : 0;

  // Apply Strategy Coefficients
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

  // Positional starter urgency in double-digit rounds
  if (pos === 'QB' && roster.QB === 0 && currentRound >= 8) score += 40;
  if (pos === 'TE' && roster.TE === 0 && currentRound >= 8) score += 40;
  if (pos === 'RB' && roster.RB === 0 && currentRound >= 5) score += 30;
  if (pos === 'WR' && roster.WR === 0 && currentRound >= 5) score += 30;

  // Caps
  if (pos === 'QB' && roster.QB >= 2) return -99999;
  if (pos === 'TE' && roster.TE >= 2) return -99999;
  if (pos === 'RB' && roster.RB >= 5) return -99999;
  if (pos === 'WR' && roster.WR >= 6) return -99999;

  return score;
};

const getTeamNameForIndex = (idx) => {
  const names = Object.keys(BOT_PROFILES);
  return names[idx] || `CPU RIVAL ${idx}`;
};

const calculateRosterPoints = (roster) => {
  const qbs = roster.filter(p => p.position === 'QB').map(p => p.projectedPoints).sort((a, b) => b - a);
  const rbs = roster.filter(p => p.position === 'RB').map(p => p.projectedPoints).sort((a, b) => b - a);
  const wrs = roster.filter(p => p.position === 'WR').map(p => p.projectedPoints).sort((a, b) => b - a);
  const tes = roster.filter(p => p.position === 'TE').map(p => p.projectedPoints).sort((a, b) => b - a);
  const ks = roster.filter(p => p.position === 'K').map(p => p.projectedPoints).sort((a, b) => b - a);
  const dsts = roster.filter(p => p.position === 'DST').map(p => p.projectedPoints).sort((a, b) => b - a);
  
  let score = 0;
  if (qbs.length > 0) score += qbs[0];
  if (rbs.length > 0) score += rbs[0];
  if (rbs.length > 1) score += rbs[1];
  if (wrs.length > 0) score += wrs[0];
  if (wrs.length > 1) score += wrs[1];
  if (tes.length > 0) score += tes[0];
  
  const flexPool = [
    ...(rbs.slice(2)),
    ...(wrs.slice(2)),
    ...(tes.slice(1))
  ].sort((a, b) => b - a);
  if (flexPool.length > 0) score += flexPool[0];
  if (ks.length > 0) score += ks[0];
  if (dsts.length > 0) score += dsts[0];
  
  const totalPoints = roster.reduce((sum, p) => sum + p.projectedPoints, 0);
  const benchPoints = totalPoints - score;
  score += Math.max(0, benchPoints * 0.1);
  return score;
};

// Simulates a single draft and subsequent head-to-head season
const runSimulationUnit = (setup) => {
  const players = applyFormatAndSort(masterPlayers, setup.leagueFormat);
  const totalPicks = setup.rounds * setup.leagueSize;

  const teamRosterCounts = Array.from({ length: setup.leagueSize }, () => ({
    QB: 0, RB: 0, WR: 0, TE: 0, K: 0, DST: 0
  }));
  const teamRosterPlayers = Array.from({ length: setup.leagueSize }, () => []);

  // 1. Run pick-by-pick Draft
  for (let pick = 1; pick <= totalPicks; pick++) {
    const activeTeamIdx = getTeamIndexForPick(pick, setup.leagueSize, setup.draftType);
    const teamName = getTeamNameForIndex(activeTeamIdx);

    const available = players.filter(p => !p.draftedBy);
    if (available.length === 0) break;

    const roster = teamRosterCounts[activeTeamIdx];
    const missingPositions = [];
    if (roster.QB === 0) missingPositions.push('QB');
    if (roster.TE === 0) missingPositions.push('TE');
    if (roster.K === 0) missingPositions.push('K');
    if (roster.DST === 0) missingPositions.push('DST');
    if (roster.RB < 2) missingPositions.push('RB');
    if (roster.WR < 2) missingPositions.push('WR');

    const neededStartingSlots =
      (roster.QB === 0 ? 1 : 0) +
      (roster.TE === 0 ? 1 : 0) +
      (roster.K === 0 ? 1 : 0) +
      (roster.DST === 0 ? 1 : 0) +
      Math.max(0, 2 - roster.RB) +
      Math.max(0, 2 - roster.WR);
    const currentRound = Math.ceil(pick / setup.leagueSize);
    const roundsRemaining = setup.rounds - currentRound + 1;

    let pool;
    if (neededStartingSlots >= roundsRemaining) {
      const strictAvailable = available.filter(p => missingPositions.includes(p.position));
      pool = strictAvailable.length > 0 ? strictAvailable.slice(0, 15) : available.slice(0, 15);
    } else {
      pool = available.slice(0, 15);
    }

    let chosenPlayer = pool[0];
    let bestScore = -100000;

    for (const player of pool) {
      const score = calculateCpuPlayerScore(
        player,
        activeTeamIdx,
        teamName,
        pick,
        setup,
        teamRosterCounts[activeTeamIdx]
      );
      if (score > bestScore) {
        bestScore = score;
        chosenPlayer = player;
      }
    }

    if (chosenPlayer) {
      chosenPlayer.draftedBy = teamName;
      teamRosterPlayers[activeTeamIdx].push(chosenPlayer);
      teamRosterCounts[activeTeamIdx][chosenPlayer.position]++;
    }
  }

  // Reset draftedBy for next simulation
  players.forEach(p => p.draftedBy = null);

  // 2. Calculate Roster Strengths
  const teamBaselines = teamRosterPlayers.map(r => calculateRosterPoints(r));

  // 3. Simulate 14-Week Season Matchups
  const wins = Array(setup.leagueSize).fill(0);
  const playoffCounts = Array(setup.leagueSize).fill(0);
  const numWeeks = 14;

  const simCount = 5; // Multi-week variance averaging
  for (let sim = 0; sim < simCount; sim++) {
    const simWins = Array(setup.leagueSize).fill(0);

    for (let week = 0; week < numWeeks; week++) {
      const weeklyScores = Array(setup.leagueSize).fill(0);
      for (let i = 0; i < setup.leagueSize; i++) {
        const variance = (Math.random() - 0.5) * 35;
        weeklyScores[i] = (teamBaselines[i] / numWeeks) + variance;
      }

      // Random weekly schedule pairings
      const unpaired = Array.from({ length: setup.leagueSize }, (_, idx) => idx);
      for (let i = unpaired.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [unpaired[i], unpaired[j]] = [unpaired[j], unpaired[i]];
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

    const standingRanks = Array.from({ length: setup.leagueSize }, (_, idx) => ({
      idx,
      wins: simWins[idx],
      score: teamBaselines[idx]
    })).sort((a, b) => b.wins - a.wins || b.score - a.score);

    for (let rankIndex = 0; rankIndex < 4; rankIndex++) {
      playoffCounts[standingRanks[rankIndex].idx]++;
    }
  }

  return Array.from({ length: setup.leagueSize }, (_, i) => ({
    teamIdx: i,
    teamName: getTeamNameForIndex(i),
    strategyCamp: BOT_PROFILES[getTeamNameForIndex(i)].strategyCamp,
    avgWins: Number((wins[i] / simCount).toFixed(2)),
    playoffsCount: playoffCounts[i],
    playoffChance: (playoffCounts[i] / simCount) * 100
  }));
};

const getTeamIndexForPick = (pick, leagueSize, draftType) => {
  const round = Math.ceil(pick / leagueSize);
  const indexInRound = (pick - 1) % leagueSize;
  if (draftType === 'Snake' && round % 2 === 0) {
    return leagueSize - 1 - indexInRound;
  }
  return indexInRound;
};

// ============================================================================
// 4. MAIN EVALUATION LOOP
// ============================================================================
const runEvaluation = () => {
  const totalSims = 25000; // 25,000 simulated leagues to achieve extremely stable statistics
  console.log(`\n🏆 Simulating ${totalSims.toLocaleString()} leagues (20,000+ seasons) with final hyper-optimized profiles...`);
  
  const t0 = performance.now();
  
  const accumWins = {};
  const accumPlayoffs = {};
  const accumCounts = {};

  Object.keys(BOT_PROFILES).forEach(name => {
    accumWins[name] = 0;
    accumPlayoffs[name] = 0;
    accumCounts[name] = 0;
  });

  for (let sim = 0; sim < totalSims; sim++) {
    const format = formats[sim % formats.length];
    const style = opponentStyles[sim % opponentStyles.length];
    const setup = {
      leagueSize: 12,
      rounds: 14,
      draftType: 'Snake',
      leagueFormat: format,
      opponentStyle: style
    };

    const results = runSimulationUnit(setup);
    results.forEach(res => {
      accumWins[res.teamName] += res.avgWins;
      accumPlayoffs[res.teamName] += res.playoffsCount;
      accumCounts[res.teamName]++;
    });

    if ((sim + 1) % 5000 === 0) {
      console.log(`   Processed ${((sim + 1)).toLocaleString()} simulations...`);
    }
  }

  const finalStandings = Object.keys(BOT_PROFILES).map(name => {
    const totalRuns = accumCounts[name];
    const avgWins = accumWins[name] / totalRuns;
    const avgLosses = 14.0 - avgWins;
    const playoffRate = (accumPlayoffs[name] / (totalRuns * 5)) * 100;
    return {
      name,
      strategyCamp: BOT_PROFILES[name].strategyCamp,
      expertPreference: BOT_PROFILES[name].expertPreference,
      learningAccuracy: BOT_PROFILES[name].learningAccuracy,
      avgWins: Number(avgWins.toFixed(2)),
      avgLosses: Number(avgLosses.toFixed(2)),
      playoffRate: Number(playoffRate.toFixed(1))
    };
  }).sort((a, b) => b.avgWins - a.avgWins || b.playoffRate - a.playoffRate);

  const duration = performance.now() - t0;
  console.log(`\n✅ Standings evaluation completed in ${(duration / 1000).toFixed(2)} seconds.`);
  console.log('\n======================================= FINAL LEAGUE STANDINGS =======================================');
  console.log(JSON.stringify(finalStandings, null, 2));
  console.log('======================================================================================================');
};

runEvaluation();
