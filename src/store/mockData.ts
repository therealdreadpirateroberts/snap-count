export interface Player {
  rank: number;
  name: string;
  position: 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DST';
  team: string;
  bye: number;
  adp: number;
  posRank: string;
  projectedPoints: number;
  draftedBy: string | null; // null if available, team name otherwise
  recommendationReason?: string;
}

export interface NewsStory {
  id: string;
  tag: 'BREAKING' | 'INJURY' | 'CONTRACT' | 'RULING' | 'AWARDS' | 'CAMP' | 'TRADE';
  tagColor: string;
  timeAgo: string;
  headline: string;
  summary: string;
  take: string;
  playersAffected: {
    name: string;
    position: string;
    trend: 'up' | 'down';
  }[];
}

// Helper to get ESPN team logos CDN
export const getTeamLogoUrl = (team: string): string => {
  const cleanTeam = team.toLowerCase().trim();
  const mapping: { [key: string]: string } = {
    ari: 'ari', atl: 'atl', bal: 'bal', buf: 'buf', car: 'car', chi: 'chi', cin: 'cin', cle: 'cle',
    dal: 'dal', den: 'den', det: 'det', gb: 'gb', hou: 'hou', ind: 'ind', jax: 'jax', kc: 'kc',
    lac: 'lac', lar: 'lar', lv: 'lv', mia: 'mia', min: 'min', ne: 'ne', no: 'no', nyg: 'nyg',
    nyj: 'nyj', phi: 'phi', pit: 'pit', sea: 'sea', sf: 'sf', tb: 'tb', ten: 'ten', was: 'was'
  };
  const key = mapping[cleanTeam] || 'ind';
  return `https://a.espncdn.com/i/teamlogos/nfl/500/${key}.png`;
};

// programmatically generate a high-quality list of 150 players
const QB_NAMES = [
  { name: 'Patrick Mahomes', team: 'KC', bye: 6 },
  { name: 'Josh Allen', team: 'BUF', bye: 12 },
  { name: 'Lamar Jackson', team: 'BAL', bye: 14 },
  { name: 'Jalen Hurts', team: 'PHI', bye: 5 },
  { name: 'C.J. Stroud', team: 'HOU', bye: 14 },
  { name: 'Joe Burrow', team: 'CIN', bye: 12 },
  { name: 'Anthony Richardson', team: 'IND', bye: 14 },
  { name: 'Dak Prescott', team: 'DAL', bye: 7 },
  { name: 'Jordan Love', team: 'GB', bye: 10 },
  { name: 'Brock Purdy', team: 'SF', bye: 9 },
  { name: 'Kyler Murray', team: 'ARI', bye: 11 },
  { name: 'Caleb Williams', team: 'CHI', bye: 7 },
  { name: 'Jared Goff', team: 'DET', bye: 5 },
  { name: 'Tua Tagovailoa', team: 'MIA', bye: 6 },
  { name: 'Trevor Lawrence', team: 'JAX', bye: 12 },
  { name: 'Kirk Cousins', team: 'ATL', bye: 12 },
  { name: 'Jayden Daniels', team: 'WAS', bye: 14 },
  { name: 'Justin Herbert', team: 'LAC', bye: 8 }
];

const RB_NAMES = [
  { name: 'Christian McCaffrey', team: 'SF', bye: 9 },
  { name: 'Breece Hall', team: 'NYJ', bye: 12 },
  { name: 'Bijan Robinson', team: 'ATL', bye: 12 },
  { name: 'Saquon Barkley', team: 'PHI', bye: 5 },
  { name: 'Jonathan Taylor', team: 'IND', bye: 14 },
  { name: 'Jahmyr Gibbs', team: 'DET', bye: 5 },
  { name: 'Derrick Henry', team: 'BAL', bye: 14 },
  { name: 'Kyren Williams', team: 'LAR', bye: 6 },
  { name: 'De\'Von Achane', team: 'MIA', bye: 6 },
  { name: 'Travis Etienne Jr.', team: 'JAX', bye: 12 },
  { name: 'Isiah Pacheco', team: 'KC', bye: 6 },
  { name: 'James Cook', team: 'BUF', bye: 12 },
  { name: 'Josh Jacobs', team: 'GB', bye: 10 },
  { name: 'Alvin Kamara', team: 'NO', bye: 14 },
  { name: 'Rachaad White', team: 'TB', bye: 11 },
  { name: 'Joe Mixon', team: 'HOU', bye: 14 },
  { name: 'Kenneth Walker III', team: 'SEA', bye: 10 },
  { name: 'David Montgomery', team: 'DET', bye: 5 },
  { name: 'James Conner', team: 'ARI', bye: 11 },
  { name: 'D\'Andre Swift', team: 'CHI', bye: 7 },
  { name: 'Zamir White', team: 'LV', bye: 10 },
  { name: 'Raheem Mostert', team: 'MIA', bye: 6 },
  { name: 'Najee Harris', team: 'PIT', bye: 9 },
  { name: 'Jaylen Warren', team: 'PIT', bye: 9 },
  { name: 'Tony Pollard', team: 'TEN', bye: 5 },
  { name: 'Javonte Williams', team: 'DEN', bye: 14 },
  { name: 'Brian Robinson Jr.', team: 'WAS', bye: 14 },
  { name: 'Jonathon Brooks', team: 'CAR', bye: 11 },
  { name: 'Ty Chandler', team: 'MIN', bye: 6 },
  { name: 'Devin Singletary', team: 'NYG', bye: 11 },
  { name: 'Chuba Hubbard', team: 'CAR', bye: 11 },
  { name: 'Gus Edwards', team: 'LAC', bye: 8 },
  { name: 'Zach Charbonnet', team: 'SEA', bye: 10 },
  { name: 'Jerome Ford', team: 'CLE', bye: 10 },
  { name: 'Trey Benson', team: 'ARI', bye: 11 },
  { name: 'Ezekiel Elliott', team: 'DAL', bye: 7 },
  { name: 'Blake Corum', team: 'LAR', bye: 6 },
  { name: 'Rico Dowdle', team: 'DAL', bye: 7 }
];

const WR_NAMES = [
  { name: 'CeeDee Lamb', team: 'DAL', bye: 7 },
  { name: 'Tyreek Hill', team: 'MIA', bye: 6 },
  { name: 'Justin Jefferson', team: 'MIN', bye: 6 },
  { name: 'Ja\'Marr Chase', team: 'CIN', bye: 12 },
  { name: 'Amon-Ra St. Brown', team: 'DET', bye: 5 },
  { name: 'A.J. Brown', team: 'PHI', bye: 5 },
  { name: 'Garrett Wilson', team: 'NYJ', bye: 12 },
  { name: 'Puka Nacua', team: 'LAR', bye: 6 },
  { name: 'Marvin Harrison Jr.', team: 'ARI', bye: 11 },
  { name: 'Davante Adams', team: 'LV', bye: 10 },
  { name: 'Chris Olave', team: 'NO', bye: 14 },
  { name: 'Drake London', team: 'ATL', bye: 12 },
  { name: 'Brandon Aiyuk', team: 'SF', bye: 9 },
  { name: 'Mike Evans', team: 'TB', bye: 11 },
  { name: 'Nico Collins', team: 'HOU', bye: 14 },
  { name: 'Deebo Samuel Sr.', team: 'SF', bye: 9 },
  { name: 'Malik Nabers', team: 'NYG', bye: 11 },
  { name: 'Jaylen Waddle', team: 'MIA', bye: 6 },
  { name: 'D.K. Metcalf', team: 'SEA', bye: 10 },
  { name: 'DJ Moore', team: 'CHI', bye: 7 },
  { name: 'DeVonta Smith', team: 'PHI', bye: 5 },
  { name: 'Stefon Diggs', team: 'HOU', bye: 14 },
  { name: 'Cooper Kupp', team: 'LAR', bye: 6 },
  { name: 'Zay Flowers', team: 'BAL', bye: 14 },
  { name: 'Tee Higgins', team: 'CIN', bye: 12 },
  { name: 'Amari Cooper', team: 'CLE', bye: 10 },
  { name: 'George Pickens', team: 'PIT', bye: 9 },
  { name: 'Tank Dell', team: 'HOU', bye: 14 },
  { name: 'Terry McLaurin', team: 'WAS', bye: 14 },
  { name: 'Christian Kirk', team: 'JAX', bye: 12 },
  { name: 'Chris Godwin', team: 'TB', bye: 11 },
  { name: 'Keenan Allen', team: 'CHI', bye: 7 },
  { name: 'Jayden Reed', team: 'GB', bye: 10 },
  { name: 'Calvin Ridley', team: 'TEN', bye: 5 },
  { name: 'Rashee Rice', team: 'KC', bye: 6 },
  { name: 'Rome Odunze', team: 'CHI', bye: 7 },
  { name: 'Diontae Johnson', team: 'CAR', bye: 11 },
  { name: 'Hollywood Brown', team: 'KC', bye: 6 },
  { name: 'Courtland Sutton', team: 'DEN', bye: 14 },
  { name: 'Jaxon Smith-Njigba', team: 'SEA', bye: 10 },
  { name: 'Ladd McConkey', team: 'LAC', bye: 8 },
  { name: 'Brian Thomas Jr.', team: 'JAX', bye: 12 },
  { name: 'Keon Coleman', team: 'BUF', bye: 12 },
  { name: 'Xavier Worthy', team: 'KC', bye: 6 },
  { name: 'Curtis Samuel', team: 'BUF', bye: 12 },
  { name: 'Tyler Lockett', team: 'SEA', bye: 10 },
  { name: 'Jakobi Meyers', team: 'LV', bye: 10 },
  { name: 'Romeo Doubs', team: 'GB', bye: 10 }
];

const TE_NAMES = [
  { name: 'Sam LaPorta', team: 'DET', bye: 5 },
  { name: 'Travis Kelce', team: 'KC', bye: 6 },
  { name: 'Trey McBride', team: 'ARI', bye: 11 },
  { name: 'Mark Andrews', team: 'BAL', bye: 14 },
  { name: 'Dalton Kincaid', team: 'BUF', bye: 12 },
  { name: 'George Kittle', team: 'SF', bye: 9 },
  { name: 'Kyle Pitts', team: 'ATL', bye: 12 },
  { name: 'Evan Engram', team: 'JAX', bye: 12 },
  { name: 'Jake Ferguson', team: 'DAL', bye: 7 },
  { name: 'David Njoku', team: 'CLE', bye: 10 },
  { name: 'Brock Bowers', team: 'LV', bye: 10 },
  { name: 'Dallas Goedert', team: 'PHI', bye: 5 },
  { name: 'Pat Freiermuth', team: 'PIT', bye: 9 },
  { name: 'Taysom Hill', team: 'NO', bye: 14 },
  { name: 'Cole Kmet', team: 'CHI', bye: 7 },
  { name: 'Hunter Henry', team: 'NE', bye: 14 }
];

const K_NAMES = [
  { name: 'Brandon Aubrey', team: 'DAL', bye: 7 },
  { name: 'Harrison Butker', team: 'KC', bye: 6 },
  { name: 'Justin Tucker', team: 'BAL', bye: 14 },
  { name: 'Ka\'imi Fairbairn', team: 'HOU', bye: 14 },
  { name: 'Jake Elliott', team: 'PHI', bye: 5 },
  { name: 'Younghoe Koo', team: 'ATL', bye: 12 },
  { name: 'Jason Sanders', team: 'MIA', bye: 6 },
  { name: 'Evan McPherson', team: 'CIN', bye: 12 }
];

const DST_NAMES = [
  { name: 'San Francisco 49ers', team: 'SF', bye: 9 },
  { name: 'Baltimore Ravens', team: 'BAL', bye: 14 },
  { name: 'New York Jets', team: 'NYJ', bye: 12 },
  { name: 'Dallas Cowboys', team: 'DAL', bye: 7 },
  { name: 'Cleveland Browns', team: 'CLE', bye: 10 },
  { name: 'Buffalo Bills', team: 'BUF', bye: 12 },
  { name: 'Pittsburgh Steelers', team: 'PIT', bye: 9 },
  { name: 'Houston Texans', team: 'HOU', bye: 14 }
];

export const generateMockRankings = (): Player[] => {
  const players: Player[] = [];
  
  // High quality distribution to make 150 players
  let qbIdx = 0, rbIdx = 0, wrIdx = 0, teIdx = 0, kIdx = 0, dstIdx = 0;
  
  // We want to construct a realistic draft order distribution
  // R1: 8 WRs, 4 RBs
  // R2: 4 WRs, 6 RBs, 2 TEs
  // R3: 3 QBs, 4 RBs, 4 WRs, 1 TE
  // etc.
  
  for (let i = 1; i <= 150; i++) {
    let chosen: { name: string; team: string; bye: number };
    let pos: 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DST';
    
    // Simple distribution rules based on index to mix positions naturally
    if (i <= 12) {
      // Round 1: Elite WRs and RBs
      if (i % 3 === 0 && rbIdx < RB_NAMES.length) {
        chosen = RB_NAMES[rbIdx++];
        pos = 'RB';
      } else if (wrIdx < WR_NAMES.length) {
        chosen = WR_NAMES[wrIdx++];
        pos = 'WR';
      } else {
        chosen = RB_NAMES[rbIdx++];
        pos = 'RB';
      }
    } else if (i <= 24) {
      // Round 2: RBs, WRs, and elite TEs
      if (i === 15 && teIdx < TE_NAMES.length) {
        chosen = TE_NAMES[teIdx++];
        pos = 'TE';
      } else if (i === 22 && teIdx < TE_NAMES.length) {
        chosen = TE_NAMES[teIdx++];
        pos = 'TE';
      } else if (i % 2 === 0 && rbIdx < RB_NAMES.length) {
        chosen = RB_NAMES[rbIdx++];
        pos = 'RB';
      } else if (wrIdx < WR_NAMES.length) {
        chosen = WR_NAMES[wrIdx++];
        pos = 'WR';
      } else {
        chosen = RB_NAMES[rbIdx++];
        pos = 'RB';
      }
    } else if (i <= 48) {
      // Rounds 3-4: QBs start dropping, more WRs & RBs
      if ((i === 27 || i === 33 || i === 42) && qbIdx < QB_NAMES.length) {
        chosen = QB_NAMES[qbIdx++];
        pos = 'QB';
      } else if (i % 3 === 1 && rbIdx < RB_NAMES.length) {
        chosen = RB_NAMES[rbIdx++];
        pos = 'RB';
      } else if (i % 3 === 2 && teIdx < TE_NAMES.length) {
        chosen = TE_NAMES[teIdx++];
        pos = 'TE';
      } else if (wrIdx < WR_NAMES.length) {
        chosen = WR_NAMES[wrIdx++];
        pos = 'WR';
      } else {
        chosen = RB_NAMES[rbIdx++];
        pos = 'RB';
      }
    } else if (i <= 110) {
      // Rounds 5-9: Standard depth
      if (i % 7 === 0 && qbIdx < QB_NAMES.length) {
        chosen = QB_NAMES[qbIdx++];
        pos = 'QB';
      } else if (i % 6 === 2 && teIdx < TE_NAMES.length) {
        chosen = TE_NAMES[teIdx++];
        pos = 'TE';
      } else if (i % 2 === 0 && rbIdx < RB_NAMES.length) {
        chosen = RB_NAMES[rbIdx++];
        pos = 'RB';
      } else if (wrIdx < WR_NAMES.length) {
        chosen = WR_NAMES[wrIdx++];
        pos = 'WR';
      } else if (rbIdx < RB_NAMES.length) {
        chosen = RB_NAMES[rbIdx++];
        pos = 'RB';
      } else {
        chosen = QB_NAMES[qbIdx++];
        pos = 'QB';
      }
    } else {
      // Rounds 10-13: Deep bench, DSTs, and Kickers start appearing
      if (i % 6 === 0 && dstIdx < DST_NAMES.length) {
        chosen = DST_NAMES[dstIdx++];
        pos = 'DST';
      } else if (i % 7 === 1 && kIdx < K_NAMES.length) {
        chosen = K_NAMES[kIdx++];
        pos = 'K';
      } else if (i % 4 === 2 && qbIdx < QB_NAMES.length) {
        chosen = QB_NAMES[qbIdx++];
        pos = 'QB';
      } else if (i % 4 === 3 && teIdx < TE_NAMES.length) {
        chosen = TE_NAMES[teIdx++];
        pos = 'TE';
      } else if (rbIdx < RB_NAMES.length && i % 2 === 0) {
        chosen = RB_NAMES[rbIdx++];
        pos = 'RB';
      } else if (wrIdx < WR_NAMES.length) {
        chosen = WR_NAMES[wrIdx++];
        pos = 'WR';
      } else if (rbIdx < RB_NAMES.length) {
        chosen = RB_NAMES[rbIdx++];
        pos = 'RB';
      } else {
        // Fallback fillers to ensure we reach 150 safely
        chosen = { name: `Player Backup ${i}`, team: 'FA', bye: 9 };
        pos = 'WR';
      }
    }
    
    // In case chosen is somehow undefined due to running out of list items
    if (!chosen) {
      if (rbIdx < RB_NAMES.length) {
        chosen = RB_NAMES[rbIdx++];
        pos = 'RB';
      } else {
        chosen = { name: `Pro Reserve ${i}`, team: 'FA', bye: 9 };
        pos = 'WR';
      }
    }

    // Determine counts of positions to assign positional rank (e.g. QB5)
    const positionCount = players.filter(p => p.position === pos).length + 1;
    const posRank = `${pos}${positionCount}`;

    // Project points: baseline around 300 for top down to 80 for lower ranks
    const projectedPoints = Math.round(320 - (i * 1.5) + (pos === 'QB' ? 60 : 0));

    // Dynamic AI draft advice text
    let recommendationReason = 'Great value pick here.';
    if (i < 10) recommendationReason = 'Elite cornerstone player with league-winning upside.';
    else if (pos === 'QB') recommendationReason = 'Top-tier dual-threat option to anchor your passing attack.';
    else if (pos === 'RB') recommendationReason = 'High-volume workhorse with guaranteed goal-line touches.';
    else if (pos === 'WR') recommendationReason = 'Elite target-share monster in a highly efficient offense.';
    else if (pos === 'TE') recommendationReason = 'Provides positional scarcity advantage and red-zone reliance.';

    players.push({
      rank: i,
      name: chosen.name,
      position: pos,
      team: chosen.team,
      bye: chosen.bye,
      adp: Number((i + (Math.sin(i) * 2.5)).toFixed(1)),
      posRank,
      projectedPoints,
      draftedBy: null,
      recommendationReason
    });
  }
  
  return players;
};

export const MOCK_NEWS: NewsStory[] = [
  {
    id: 'news-1',
    tag: 'BREAKING',
    tagColor: '#EF4444', // Danger red
    timeAgo: '42m ago',
    headline: 'Anthony Richardson dominates first-team reps; looking fully healthy in Colts camp',
    summary: 'Anthony Richardson was dynamic in full-contact drills today, completing 12 of 14 passes with two deep touchdowns while displaying zero limitations from his previous shoulder surgery.',
    take: 'Richardson has top-3 QB upside in Shane Steichen\'s offense. His rushing floor is secure, making him an absolute steal at his current late-round ADP.',
    playersAffected: [
      { name: 'Anthony Richardson', position: 'QB', trend: 'up' },
      { name: 'Michael Pittman Jr.', position: 'WR', trend: 'up' }
    ]
  },
  {
    id: 'news-2',
    tag: 'INJURY',
    tagColor: '#fbbf24', // Warning yellow
    timeAgo: '2h ago',
    headline: 'Breece Hall limited at Jets practice with minor hamstring tightness',
    summary: 'Jets head coach Robert Saleh stated that Hall was held out of team drills as a pure precaution due to hamstring soreness. The staff expects him to be fully active next week.',
    take: 'Do not panic, but keep a close eye on this. Hamstring issues tend to linger for explosive backs. Excellent time to draft backup Braelon Allen in late rounds as an insurance policy.',
    playersAffected: [
      { name: 'Breece Hall', position: 'RB', trend: 'down' }
    ]
  },
  {
    id: 'news-3',
    tag: 'TRADE',
    tagColor: '#22C55E', // Success green
    timeAgo: '5h ago',
    headline: 'Bills trade for veteran WR Brandon Aiyuk in blockbusting deal with 49ers',
    summary: 'In a stunning trade, San Francisco has sent Brandon Aiyuk to Buffalo in exchange for draft picks. Aiyuk immediately steps in as Josh Allen\'s undisputed WR1 target.',
    take: 'Aiyuk\'s target share will skyrocket in Buffalo compared to SF\'s crowded offense. Upgraded to a rock-solid WR1. Meanwhile, Khalil Shakir takes a hit, and Deebo Samuel/Trey McBride get small target bumps.',
    playersAffected: [
      { name: 'Brandon Aiyuk', position: 'WR', trend: 'up' },
      { name: 'Josh Allen', position: 'QB', trend: 'up' },
      { name: 'Deebo Samuel Sr.', position: 'WR', trend: 'up' }
    ]
  },
  {
    id: 'news-4',
    tag: 'CONTRACT',
    tagColor: '#c084fc', // Kicker purple
    timeAgo: '1d ago',
    headline: 'CeeDee Lamb signs record-breaking 4-year contract extension',
    summary: 'The holdout is officially over. CeeDee Lamb has signed a massive extension making him one of the highest-paid players in the league. He is reporting to team facilities immediately.',
    take: 'Lamb returns to full-speed drills. Any ADP slide during the holdout is officially closed. He remains locked in as a top-3 overall draft pick in all formats.',
    playersAffected: [
      { name: 'CeeDee Lamb', position: 'WR', trend: 'up' },
      { name: 'Dak Prescott', position: 'QB', trend: 'up' }
    ]
  },
  {
    id: 'news-5',
    tag: 'CAMP',
    tagColor: '#94a3b8', // DST grey
    timeAgo: '2d ago',
    headline: 'Chiefs rookie Xavier Worthy flashing record-breaking speed in pads',
    summary: 'Camp reports indicate Worthy has been running deep routes with Patrick Mahomes that look absolutely indefensible. His ability to track deep balls has wowed coordinators.',
    take: 'Mahomes has his deep threat back. Worthy\'s speed opens up the middle for Kelce, but Worthy himself will be a boom-or-bust WR3. Worth drafting for the massive ceiling in high-powered KC.',
    playersAffected: [
      { name: 'Xavier Worthy', position: 'WR', trend: 'up' },
      { name: 'Patrick Mahomes', position: 'QB', trend: 'up' }
    ]
  }
];
