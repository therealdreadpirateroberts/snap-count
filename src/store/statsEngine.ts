export interface GameStat {
  week: number;
  opponent: string;
  points: number;
  yards: number;
  touchdowns: number;
  receptions?: number;
  targets?: number;
}

// Simple LCG PRNG for stable, reproducible seed-based random values
function getDeterministicRandom(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  let state = Math.abs(hash);
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483647;
  };
}

const NFL_TEAMS = [
  'ARI', 'ATL', 'BAL', 'BUF', 'CAR', 'CHI', 'CIN', 'CLE',
  'DAL', 'DEN', 'DET', 'GB', 'HOU', 'IND', 'JAX', 'KC',
  'LAC', 'LAR', 'LV', 'MIA', 'MIN', 'NE', 'NO', 'NYG',
  'NYJ', 'PHI', 'PIT', 'SEA', 'SF', 'TB', 'TEN', 'WAS'
];

export function generateGameStats(
  playerName: string,
  position: string,
  year: number,
  projectedPoints: number
): GameStat[] {
  const rand = getDeterministicRandom(`${playerName}-${year}`);
  
  // Stable bye week between 5 and 13
  let nameHash = 0;
  for (let i = 0; i < playerName.length; i++) {
    nameHash += playerName.charCodeAt(i);
  }
  const byeWeek = (nameHash % 9) + 5;
  
  const stats: GameStat[] = [];
  const activeWeeksCount = 17; // 17 games in an 18-week season
  
  // Calculate average points per active game
  const baseAvgPoints = projectedPoints / activeWeeksCount;
  
  // Generate random weights for each active week to distribute points
  const activeWeights: number[] = [];
  let totalWeight = 0;
  for (let i = 0; i < activeWeeksCount; i++) {
    const w = 0.5 + rand() * 1.0; // variance from 0.5 to 1.5
    activeWeights.push(w);
    totalWeight += w;
  }
  
  // Scale weights to match projectedPoints exactly
  const weekPoints: number[] = activeWeights.map(w => {
    return Math.round((w / totalWeight) * projectedPoints);
  });
  
  // Clean up rounding errors so the sum equals projectedPoints EXACTLY
  const currentSum = weekPoints.reduce((a, b) => a + b, 0);
  const diff = projectedPoints - currentSum;
  if (weekPoints.length > 0) {
    weekPoints[0] += diff;
  }

  let activeGameIdx = 0;
  
  for (let w = 1; w <= 18; w++) {
    if (w === byeWeek) {
      stats.push({
        week: w,
        opponent: 'BYE',
        points: 0,
        yards: 0,
        touchdowns: 0,
        receptions: 0,
        targets: 0
      });
      continue;
    }
    
    const pts = Math.max(0, weekPoints[activeGameIdx]);
    
    // Select deterministic random opponent
    let oppIdx = Math.floor(rand() * NFL_TEAMS.length);
    let opponent = NFL_TEAMS[oppIdx];
    // Simple mock team mapping fallback
    if (opponent === 'IND' && playerName.includes('Taylor')) {
      opponent = 'TEN';
    }
    
    let yards = 0;
    let touchdowns = 0;
    let receptions = 0;
    let targets = 0;
    
    // Position-specific realistic stat generation
    if (position === 'QB') {
      // QBs get passing yards + passing TDs. 1 fantasy point = 0.04 yards, 4 points = 1 TD.
      // E.g., 20 points -> 250 yards (10 pts) + 2.5 TDs (10 pts)
      const passingRatio = 0.5 + rand() * 0.2; // 50% to 70% of points come from yards
      const yardPts = pts * passingRatio;
      const tdPts = pts - yardPts;
      
      yards = Math.round(yardPts / 0.04);
      touchdowns = Math.max(0, Math.round(tdPts / 4));
      
      // Let's add some rushing flourish
      const rushYds = Math.round(rand() * 25);
      yards += rushYds;
    } 
    else if (position === 'RB') {
      // RBs get rushing yards, receptions, receiving yards, TDs. 
      // 1 fantasy point = 0.1 yards, 6 points = 1 TD, 1 point = 1 reception.
      // E.g. 15 points -> 80 yards (8 pts) + 1 TD (6 pts) + 1 reception (1 pt)
      const hasTd = pts >= 10 && rand() > 0.45;
      touchdowns = hasTd ? 1 : 0;
      if (pts >= 22 && rand() > 0.7) touchdowns = 2;
      
      const remainPts = pts - touchdowns * 6;
      receptions = Math.max(0, Math.round(remainPts * 0.25));
      const yardPts = remainPts - receptions;
      yards = Math.max(0, Math.round(yardPts / 0.1));
      targets = Math.round(receptions * (1.2 + rand() * 0.4));
    } 
    else if (position === 'WR') {
      // WRs get receiving yards, receptions, TDs, targets.
      const hasTd = pts >= 10 && rand() > 0.5;
      touchdowns = hasTd ? 1 : 0;
      if (pts >= 24 && rand() > 0.65) touchdowns = 2;
      
      const remainPts = pts - touchdowns * 6;
      receptions = Math.max(1, Math.round(remainPts * 0.35));
      const yardPts = remainPts - receptions;
      yards = Math.max(0, Math.round(yardPts / 0.1));
      targets = Math.round(receptions * (1.3 + rand() * 0.5));
    } 
    else if (position === 'TE') {
      // TEs get receiving yards, receptions, TDs, targets.
      const hasTd = pts >= 8 && rand() > 0.6;
      touchdowns = hasTd ? 1 : 0;
      
      const remainPts = pts - touchdowns * 6;
      receptions = Math.max(1, Math.round(remainPts * 0.38));
      const yardPts = remainPts - receptions;
      yards = Math.max(0, Math.round(yardPts / 0.1));
      targets = Math.round(receptions * (1.2 + rand() * 0.3));
    } 
    else if (position === 'K') {
      // Kickers get field goals made (3 pts) + extra points made (1 pt)
      const fgMade = Math.max(0, Math.round(pts / 3));
      const xpMade = Math.max(0, pts % 3);
      points: pts;
      yards = fgMade; // use yards column to store FGs made
      touchdowns = xpMade; // use TDs column to store XPs made
    } 
    else if (position === 'DST') {
      // DSTs get sacks, INTs, fumbles, safety, TDs, points allowed
      const sacks = Math.max(1, Math.round(rand() * 4));
      const ints = rand() > 0.6 ? 1 : 0;
      const defTDs = pts >= 14 && rand() > 0.8 ? 1 : 0;
      yards = sacks; // store sacks here
      touchdowns = ints; // store ints here
      receptions = defTDs; // store defTDs here
    }
    
    stats.push({
      week: w,
      opponent,
      points: pts,
      yards,
      touchdowns,
      receptions,
      targets
    });
    
    activeGameIdx++;
  }
  
  return stats;
}
