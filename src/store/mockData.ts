export interface Player {
  rank: number; // Consensus rank based on selected format
  espnId: number | null; // Bulletproof CDN ID
  name: string;
  position: 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DST';
  team: string;
  bye: number;
  adp: number;
  posRank: string;
  projectedPoints: number;
  draftedBy: string | null; // null if available, team name otherwise
  recommendationReason?: string;
  
  // Format specific consensus ranks
  ranks: {
    halfPpr: number;
    ppr: number;
    dynasty: number;
  };
  
  // Ranks for each individual expert
  expertRanks: {
    [expertName: string]: {
      halfPpr: number;
      ppr: number;
      dynasty: number;
    };
  };
}

export interface NewsStory {
  id: string;
  tag: 'BREAKING' | 'INJURY' | 'CONTRACT' | 'RULING' | 'AWARDS' | 'CAMP' | 'TRADE';
  tagColor: string;
  timeAgo: string;
  timestamp: number; // Relational timestamp for sorting (higher is newer)
  headline: string;
  summary: string;
  take: string;
  playersAffected: {
    name: string;
    position: string;
    trend: 'up' | 'down';
  }[];
}

// Official ESPN Player IDs Database (For flawless transparent headshots)
export const ESPN_ID_MAPPING: { [key: string]: number } = {
  'aaronjonessr': 3042519,
  'adamrandall': 4685526,
  'adonaimitchell': 4597500,
  'ajbarner': 4576297,
  'ajbrown': 4047646,
  'alecpierce': 4360078,
  'alvinkamara': 3054850,
  'amonrastbrown': 4374302,
  'andyborregales': 4569923,
  'antoniowilliams': 5081432,
  'ashtonjeanty': 4697920,
  'bakermayfield': 3052587,
  'bhayshultuten': 4882093,
  'bijanrobinson': 4430807,
  'blakecorum': 4429096,
  'bonix': 4426338,
  'braelonallen': 4685247,
  'brandonaiyuk': 4360438,
  'brandonaubrey': 3953687,
  'breecehall': 4427366,
  'brentonstrange': 4430539,
  'brianrobinsonjr': 4241474,
  'brianthomasjr': 4432773,
  'brockbowers': 4432665,
  'brockpurdy': 4361741,
  'bryceyoung': 4685720,
  'buckyirving': 4596448,
  'cadeotton': 4243331,
  'cairosantos': 17427,
  'calebwilliams': 4431611,
  'calvinridley': 3925357,
  'camerondicker': 4362081,
  'camlittle': 4686361,
  'camskattebo': 4696981,
  'camward': 4688380,
  'carnelltate': 4871023,
  'ceedeelamb': 4241389,
  'chasebrown': 4362238,
  'chasemclaughlin': 3150744,
  'chigokonkwo': 4360635,
  'chimeredike': 4431268,
  'chrisbell': 4869961,
  'chrisbrazzellii': 5091739,
  'chrisgodwinjr': 3116165,
  'chrisolave': 4361370,
  'chrisrodriguezjr': 4362619,
  'christianmccaffrey': 3117251,
  'christianwatson': 4248528,
  'chubahubbard': 4241416,
  'cjstroud': 4432577,
  'colstonloveland': 4685387,
  'courtlandsutton': 3128429,
  'dakprescott': 2577417,
  'dallasgoedert': 3121023,
  'daltonkincaid': 4385690,
  'daltonschultz': 3117256,
  'dandreswift': 4259545,
  'danieljones': 3917792,
  'darnellmooney': 4040655,
  'davanteadams': 16800,
  'davidmontgomery': 4035538,
  'davidnjoku': 3123076,
  'deebosamuelsr': 3126486,
  'demondclaiborne': 4832846,
  'denzelboston': 4832800,
  'derrickhenry': 3043078,
  'devinneal': 4682652,
  'devonachane': 4429160,
  'devontasmith': 4241478,
  'dezhaunstribling': 4710714,
  'djmoore': 3915416,
  'dkmetcalf': 4047650,
  'dontayvionwicks': 4428850,
  'drakelondon': 4426502,
  'drakemaye': 4431452,
  'dylansampson': 5081397,
  'eddypineiro': 4034949,
  'elicayomanor': 4883647,
  'elijahsarratt': 5088338,
  'elistowers': 4431574,
  'emanuelwilson': 4887558,
  'emekaegbuka': 4431588,
  'emmettjohnson': 4832955,
  'evanmcpherson': 4360234,
  'fernandomendoza': 4837248,
  'garrettwilson': 4569618,
  'genosmith': 15864,
  'georgekittle': 3040151,
  'georgepickens': 4426354,
  'germiebernard': 4685261,
  'gunnarhelm': 4686728,
  'haroldfanninjr': 5083076,
  'hunterhenry': 3046439,
  'isaacteslaa': 5123663,
  'isaiahlikely': 4361050,
  'isiahpacheco': 4361529,
  'jacobybrissett': 2578570,
  'jacorycroskeymerritt': 4575131,
  'jadarianprice': 4685512,
  'jahmyrgibbs': 4429795,
  'jakeferguson': 4242355,
  'jakobilane': 4870847,
  'jakobimeyers': 3916433,
  'jalencoker': 4695883,
  'jalenhurts': 4040715,
  'jalenmcmillan': 4430834,
  'jalennailor': 4382466,
  'jamarrchase': 4362628,
  'jamesconner': 3045147,
  'jamescookiii': 4379399,
  'jamesonwilliams': 4426388,
  'jaredgoff': 3046779,
  'jasonmyers': 2473037,
  'jauanjennings': 3886598,
  'javontewilliams': 4361579,
  'jaxonsmithnjigba': 4430878,
  'jaxsondart': 4689114,
  'jaydendaniels': 4426348,
  'jaydenhiggins': 4877706,
  'jaydenreed': 4362249,
  'jaylenwaddle': 4372016,
  'jaylenwarren': 4569987,
  'jaylenwright': 4682745,
  'jaylinnoel': 4586312,
  'jeremiyahlove': 4870808,
  'jerryjeudy': 4241463,
  'jkdobbins': 4241985,
  'joeburrow': 3915511,
  'jonahcoleman': 4702555,
  'jonathantaylor': 4242335,
  'jonathonbrooks': 4678008,
  'jordanaddison': 4429205,
  'jordanlove': 4036378,
  'jordanmason': 4360569,
  'jordyntyson': 4880281,
  'joshallen': 3918298,
  'joshdowns': 4688813,
  'joshjacobs': 4047365,
  'justinherbert': 4038941,
  'justinjefferson': 4262921,
  'juwanjohnson': 3929645,
  'kaimifairbairn': 2971573,
  'kalebjohnson': 4819231,
  'kayshonboutte': 4429022,
  'kaytronallen': 4685246,
  'kcconcepcion': 4870653,
  'keatonmitchell': 4596334,
  'kendremiller': 4599739,
  'kennethgainwell': 4371733,
  'kennethwalkeriii': 4567048,
  'kenyonsadiq': 5083315,
  'khalilshakir': 4373678,
  'kimanividal': 4430968,
  'kylemonangai': 4608686,
  'kylepittssr': 4360248,
  'kylermurray': 3917315,
  'kyrenwilliams': 4430737,
  'laddmcconkey': 4612826,
  'lamarjackson': 3916387,
  'lutherburdeniii': 4683062,
  'makailemon': 4870795,
  'malachifields': 4682648,
  'maliknabers': 4595348,
  'malikwashington': 4569603,
  'malikwillis': 4242512,
  'markandrews': 3116365,
  'marvinharrisonjr': 4432708,
  'matthewgolden': 4701936,
  'matthewstafford': 12483,
  'michaelpittmanjr': 4035687,
  'michaelwilson': 4360761,
  'mikeevans': 16737,
  'mikewashingtonjr': 4686658,
  'nicholassingleton': 4685555,
  'nicocollins': 4258173,
  'olliegordonii': 4711533,
  'omarcooperjr': 4723820,
  'omarionhampton': 4683050,
  'orondegadsdenii': 4595342,
  'parkerwashington': 4432620,
  'patbryant': 4600981,
  'patrickmahomesii': 3139477,
  'pukanacua': 4426515,
  'quentinjohnston': 4429025,
  'quinshonjudkins': 4685702,
  'rachaadwhite': 4697815,
  'rasheerice': 4428331,
  'rashidshaheed': 4032473,
  'raydavis': 4429501,
  'rhamondrestevenson': 4569173,
  'rickypearsall': 4428209,
  'ricodowdle': 4038815,
  'rjharvey': 4568490,
  'romeodoubs': 4361432,
  'romeodunze': 4431299,
  'ryanflournoy': 5083754,
  'samdarnold': 3912547,
  'samlaporta': 4430027,
  'saquonbarkley': 3929630,
  'seantucker': 4430871,
  'skylerbell': 4683153,
  'stefondiggs': 2976212,
  'tankbigsby': 4429013,
  'tankdell': 4366031,
  'teehiggins': 4239993,
  'terranceferguson': 4570037,
  'terrymclaurin': 3121422,
  'tetairoamcmillan': 4685472,
  'tetaroamcmillan': 4686159,
  'tjhockenson': 4036133,
  'tonypollard': 3916148,
  'travisetiennejr': 4239996,
  'travishunter': 4685415,
  'traviskelce': 15847,
  'treharris': 4686612,
  'tretucker': 4428718,
  'treveyonhenderson': 4432710,
  'trevorlawrence': 4360310,
  'treybenson': 4429275,
  'treymcbride': 4361307,
  'troyfranklin': 4431280,
  'tuckerkraft': 4572680,
  'tyjaespears': 4428557,
  'tylerallgeier': 4373626,
  'tylerloop': 4697745,
  'tylershough': 4360689,
  'tylerwarren': 4431459,
  'tyreekhill': 3116406,
  'tyronetracyjr': 4360516,
  'wandalerobinson': 4569587,
  'woodymarks': 4429059,
  'xavierworthy': 4683062,
  'zachariahbranch': 4870612,
  'zachcharbonnet': 4426385,
  'zayflowers': 4429615,
};



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
  { name: 'Evan McPherson', team: 'CIN', bye: 12 },
  { name: 'Cameron Dicker', team: 'LAC', bye: 8 },
  { name: 'Dustin Hopkins', team: 'CLE', bye: 10 },
  { name: 'Cairo Santos', team: 'CHI', bye: 7 },
  { name: 'Tyler Bass', team: 'BUF', bye: 12 },
  { name: 'Matt Gay', team: 'IND', bye: 14 },
  { name: 'Jake Moody', team: 'SF', bye: 9 },
  { name: 'Chris Boswell', team: 'PIT', bye: 9 },
  { name: 'Greg Zuerlein', team: 'NYJ', bye: 12 }
];

const DST_NAMES = [
  { name: 'San Francisco 49ers', team: 'SF', bye: 9 },
  { name: 'Baltimore Ravens', team: 'BAL', bye: 14 },
  { name: 'New York Jets', team: 'NYJ', bye: 12 },
  { name: 'Dallas Cowboys', team: 'DAL', bye: 7 },
  { name: 'Cleveland Browns', team: 'CLE', bye: 10 },
  { name: 'Buffalo Bills', team: 'BUF', bye: 12 },
  { name: 'Pittsburgh Steelers', team: 'PIT', bye: 9 },
  { name: 'Houston Texans', team: 'HOU', bye: 14 },
  { name: 'Kansas City Chiefs', team: 'KC', bye: 6 },
  { name: 'Philadelphia Eagles', team: 'PHI', bye: 5 },
  { name: 'Detroit Lions', team: 'DET', bye: 5 },
  { name: 'Miami Dolphins', team: 'MIA', bye: 6 },
  { name: 'Chicago Bears', team: 'CHI', bye: 7 },
  { name: 'Jacksonville Jaguars', team: 'JAX', bye: 12 },
  { name: 'Tampa Bay Buccaneers', team: 'TB', bye: 11 },
  { name: 'Seattle Seahawks', team: 'SEA', bye: 10 }
];

export const generateMockRankings = (): Player[] => {
  return [
  {
    rank: 1,
    espnId: 4430807,
    name: "Bijan Robinson",
    position: "RB",
    team: "ATL",
    bye: 11,
    adp: 1.1,
    posRank: "RB1",
    projectedPoints: 329,
    draftedBy: null,
    ranks: {
      halfPpr: 1,
      ppr: 3,
      dynasty: 1
    },
    expertRanks: {
      Andy : { halfPpr: 1, ppr: 3, dynasty: 1 },
      Mike : { halfPpr: 1, ppr: 3, dynasty: 1 },
      Jason : { halfPpr: 1, ppr: 3, dynasty: 1 },
    }
  },
  {
    rank: 2,
    espnId: 4362628,
    name: "Ja'Marr Chase",
    position: "WR",
    team: "CIN",
    bye: 6,
    adp: 2,
    posRank: "WR1",
    projectedPoints: 328,
    draftedBy: null,
    ranks: {
      halfPpr: 2,
      ppr: 1,
      dynasty: 2
    },
    expertRanks: {
      Andy : { halfPpr: 1, ppr: 1, dynasty: 1 },
      Mike : { halfPpr: 2, ppr: 1, dynasty: 2 },
      Jason : { halfPpr: 2, ppr: 1, dynasty: 2 },
    }
  },
  {
    rank: 3,
    espnId: 4429795,
    name: "Jahmyr Gibbs",
    position: "RB",
    team: "DET",
    bye: 6,
    adp: 3,
    posRank: "RB2",
    projectedPoints: 327,
    draftedBy: null,
    ranks: {
      halfPpr: 3,
      ppr: 5,
      dynasty: 1
    },
    expertRanks: {
      Andy : { halfPpr: 3, ppr: 5, dynasty: 1 },
      Mike : { halfPpr: 3, ppr: 5, dynasty: 1 },
      Jason : { halfPpr: 3, ppr: 5, dynasty: 1 },
    }
  },
  {
    rank: 4,
    espnId: 4426515,
    name: "Puka Nacua",
    position: "WR",
    team: "LAR",
    bye: 11,
    adp: 3.9,
    posRank: "WR2",
    projectedPoints: 326,
    draftedBy: null,
    ranks: {
      halfPpr: 4,
      ppr: 2,
      dynasty: 4
    },
    expertRanks: {
      Andy : { halfPpr: 2, ppr: 1, dynasty: 2 },
      Mike : { halfPpr: 4, ppr: 2, dynasty: 4 },
      Jason : { halfPpr: 4, ppr: 2, dynasty: 4 },
    }
  },
  {
    rank: 5,
    espnId: 4430878,
    name: "Jaxon Smith-Njigba",
    position: "WR",
    team: "SEA",
    bye: 11,
    adp: 4.7,
    posRank: "WR3",
    projectedPoints: 324,
    draftedBy: null,
    ranks: {
      halfPpr: 5,
      ppr: 3,
      dynasty: 5
    },
    expertRanks: {
      Andy : { halfPpr: 3, ppr: 1, dynasty: 3 },
      Mike : { halfPpr: 5, ppr: 3, dynasty: 5 },
      Jason : { halfPpr: 5, ppr: 3, dynasty: 5 },
    }
  },
  {
    rank: 6,
    espnId: 3117251,
    name: "Christian McCaffrey",
    position: "RB",
    team: "SF",
    bye: 8,
    adp: 5.5,
    posRank: "RB3",
    projectedPoints: 323,
    draftedBy: null,
    ranks: {
      halfPpr: 6,
      ppr: 8,
      dynasty: 6
    },
    expertRanks: {
      Andy : { halfPpr: 6, ppr: 8, dynasty: 6 },
      Mike : { halfPpr: 6, ppr: 8, dynasty: 6 },
      Jason : { halfPpr: 6, ppr: 8, dynasty: 6 },
    }
  },
  {
    rank: 7,
    espnId: 4374302,
    name: "Amon-Ra St. Brown",
    position: "WR",
    team: "DET",
    bye: 6,
    adp: 7.6,
    posRank: "WR4",
    projectedPoints: 322,
    draftedBy: null,
    ranks: {
      halfPpr: 7,
      ppr: 5,
      dynasty: 7
    },
    expertRanks: {
      Andy : { halfPpr: 5, ppr: 3, dynasty: 5 },
      Mike : { halfPpr: 7, ppr: 5, dynasty: 7 },
      Jason : { halfPpr: 7, ppr: 5, dynasty: 7 },
    }
  },
  {
    rank: 8,
    espnId: 4241389,
    name: "CeeDee Lamb",
    position: "WR",
    team: "DAL",
    bye: 14,
    adp: 8.3,
    posRank: "WR5",
    projectedPoints: 321,
    draftedBy: null,
    ranks: {
      halfPpr: 8,
      ppr: 6,
      dynasty: 8
    },
    expertRanks: {
      Andy : { halfPpr: 6, ppr: 4, dynasty: 6 },
      Mike : { halfPpr: 8, ppr: 6, dynasty: 8 },
      Jason : { halfPpr: 8, ppr: 6, dynasty: 8 },
    }
  },
  {
    rank: 9,
    espnId: 4242335,
    name: "Jonathan Taylor",
    position: "RB",
    team: "IND",
    bye: 13,
    adp: 8.5,
    posRank: "RB4",
    projectedPoints: 320,
    draftedBy: null,
    ranks: {
      halfPpr: 9,
      ppr: 11,
      dynasty: 9
    },
    expertRanks: {
      Andy : { halfPpr: 9, ppr: 11, dynasty: 9 },
      Mike : { halfPpr: 9, ppr: 11, dynasty: 9 },
      Jason : { halfPpr: 9, ppr: 11, dynasty: 9 },
    }
  },
  {
    rank: 10,
    espnId: 4262921,
    name: "Justin Jefferson",
    position: "WR",
    team: "MIN",
    bye: 6,
    adp: 10.4,
    posRank: "WR6",
    projectedPoints: 319,
    draftedBy: null,
    ranks: {
      halfPpr: 10,
      ppr: 8,
      dynasty: 10
    },
    expertRanks: {
      Andy : { halfPpr: 8, ppr: 6, dynasty: 8 },
      Mike : { halfPpr: 10, ppr: 8, dynasty: 10 },
      Jason : { halfPpr: 10, ppr: 8, dynasty: 10 },
    }
  },
  {
    rank: 11,
    espnId: 4379399,
    name: "James Cook III",
    position: "RB",
    team: "BUF",
    bye: 7,
    adp: 11.2,
    posRank: "RB5",
    projectedPoints: 318,
    draftedBy: null,
    ranks: {
      halfPpr: 11,
      ppr: 13,
      dynasty: 11
    },
    expertRanks: {
      Andy : { halfPpr: 11, ppr: 13, dynasty: 11 },
      Mike : { halfPpr: 11, ppr: 13, dynasty: 11 },
      Jason : { halfPpr: 11, ppr: 13, dynasty: 11 },
    }
  },
  {
    rank: 12,
    espnId: 4426502,
    name: "Drake London",
    position: "WR",
    team: "ATL",
    bye: 11,
    adp: 11.8,
    posRank: "WR7",
    projectedPoints: 317,
    draftedBy: null,
    ranks: {
      halfPpr: 12,
      ppr: 10,
      dynasty: 12
    },
    expertRanks: {
      Andy : { halfPpr: 10, ppr: 8, dynasty: 10 },
      Mike : { halfPpr: 12, ppr: 10, dynasty: 12 },
      Jason : { halfPpr: 12, ppr: 10, dynasty: 12 },
    }
  },
  {
    rank: 13,
    espnId: 4429160,
    name: "De'Von Achane",
    position: "RB",
    team: "MIA",
    bye: 6,
    adp: 13.8,
    posRank: "RB6",
    projectedPoints: 316,
    draftedBy: null,
    ranks: {
      halfPpr: 13,
      ppr: 15,
      dynasty: 13
    },
    expertRanks: {
      Andy : { halfPpr: 13, ppr: 15, dynasty: 13 },
      Mike : { halfPpr: 8, ppr: 10, dynasty: 8 },
      Jason : { halfPpr: 13, ppr: 15, dynasty: 13 },
    }
  },
  {
    rank: 14,
    espnId: 4890973,
    name: "Ashton Jeanty",
    position: "RB",
    team: "LV",
    bye: 13,
    adp: 13.7,
    posRank: "RB7",
    projectedPoints: 315,
    draftedBy: null,
    ranks: {
      halfPpr: 14,
      ppr: 16,
      dynasty: 1
    },
    expertRanks: {
      Andy : { halfPpr: 14, ppr: 16, dynasty: 1 },
      Mike : { halfPpr: 14, ppr: 16, dynasty: 1 },
      Jason : { halfPpr: 14, ppr: 16, dynasty: 1 },
    }
  },
  {
    rank: 15,
    espnId: 4258173,
    name: "Nico Collins",
    position: "WR",
    team: "HOU",
    bye: 8,
    adp: 15.6,
    posRank: "WR8",
    projectedPoints: 314,
    draftedBy: null,
    ranks: {
      halfPpr: 15,
      ppr: 13,
      dynasty: 15
    },
    expertRanks: {
      Andy : { halfPpr: 13, ppr: 11, dynasty: 13 },
      Mike : { halfPpr: 15, ppr: 13, dynasty: 15 },
      Jason : { halfPpr: 15, ppr: 13, dynasty: 15 },
    }
  },
  {
    rank: 16,
    espnId: 4361307,
    name: "Trey McBride",
    position: "TE",
    team: "ARI",
    bye: 14,
    adp: 17,
    posRank: "TE1",
    projectedPoints: 312,
    draftedBy: null,
    ranks: {
      halfPpr: 16,
      ppr: 16,
      dynasty: 1
    },
    expertRanks: {
      Andy : { halfPpr: 16, ppr: 16, dynasty: 1 },
      Mike : { halfPpr: 16, ppr: 16, dynasty: 1 },
      Jason : { halfPpr: 10, ppr: 10, dynasty: 1 },
    }
  },
  {
    rank: 17,
    espnId: 4362238,
    name: "Chase Brown",
    position: "RB",
    team: "CIN",
    bye: 6,
    adp: 16,
    posRank: "RB8",
    projectedPoints: 311,
    draftedBy: null,
    ranks: {
      halfPpr: 17,
      ppr: 19,
      dynasty: 17
    },
    expertRanks: {
      Andy : { halfPpr: 17, ppr: 19, dynasty: 17 },
      Mike : { halfPpr: 17, ppr: 19, dynasty: 17 },
      Jason : { halfPpr: 17, ppr: 19, dynasty: 17 },
    }
  },
  {
    rank: 18,
    espnId: 3929630,
    name: "Saquon Barkley",
    position: "RB",
    team: "PHI",
    bye: 10,
    adp: 16.6,
    posRank: "RB9",
    projectedPoints: 310,
    draftedBy: null,
    ranks: {
      halfPpr: 18,
      ppr: 20,
      dynasty: 18
    },
    expertRanks: {
      Andy : { halfPpr: 18, ppr: 20, dynasty: 18 },
      Mike : { halfPpr: 18, ppr: 20, dynasty: 18 },
      Jason : { halfPpr: 18, ppr: 20, dynasty: 18 },
    }
  },
  {
    rank: 19,
    espnId: 4595348,
    name: "Malik Nabers",
    position: "WR",
    team: "NYG",
    bye: 8,
    adp: 19,
    posRank: "WR9",
    projectedPoints: 309,
    draftedBy: null,
    ranks: {
      halfPpr: 19,
      ppr: 17,
      dynasty: 1
    },
    expertRanks: {
      Andy : { halfPpr: 17, ppr: 15, dynasty: 1 },
      Mike : { halfPpr: 19, ppr: 17, dynasty: 1 },
      Jason : { halfPpr: 19, ppr: 17, dynasty: 1 },
    }
  },
  {
    rank: 20,
    espnId: 4428331,
    name: "Rashee Rice",
    position: "WR",
    team: "KC",
    bye: 5,
    adp: 19.2,
    posRank: "WR10",
    projectedPoints: 308,
    draftedBy: null,
    ranks: {
      halfPpr: 20,
      ppr: 18,
      dynasty: 20
    },
    expertRanks: {
      Andy : { halfPpr: 18, ppr: 16, dynasty: 18 },
      Mike : { halfPpr: 20, ppr: 18, dynasty: 20 },
      Jason : { halfPpr: 20, ppr: 18, dynasty: 20 },
    }
  },
  {
    rank: 21,
    espnId: 4685382,
    name: "Omarion Hampton",
    position: "RB",
    team: "LAC",
    bye: 7,
    adp: 22.7,
    posRank: "RB10",
    projectedPoints: 307,
    draftedBy: null,
    ranks: {
      halfPpr: 21,
      ppr: 23,
      dynasty: 1
    },
    expertRanks: {
      Andy : { halfPpr: 21, ppr: 23, dynasty: 1 },
      Mike : { halfPpr: 21, ppr: 23, dynasty: 1 },
      Jason : { halfPpr: 21, ppr: 23, dynasty: 1 },
    }
  },
  {
    rank: 22,
    espnId: 4432665,
    name: "Brock Bowers",
    position: "TE",
    team: "LV",
    bye: 13,
    adp: 21.6,
    posRank: "TE2",
    projectedPoints: 306,
    draftedBy: null,
    ranks: {
      halfPpr: 22,
      ppr: 22,
      dynasty: 1
    },
    expertRanks: {
      Andy : { halfPpr: 22, ppr: 22, dynasty: 1 },
      Mike : { halfPpr: 22, ppr: 22, dynasty: 1 },
      Jason : { halfPpr: 22, ppr: 22, dynasty: 1 },
    }
  },
  {
    rank: 23,
    espnId: 4426354,
    name: "George Pickens",
    position: "WR",
    team: "DAL",
    bye: 14,
    adp: 21.2,
    posRank: "WR11",
    projectedPoints: 305,
    draftedBy: null,
    ranks: {
      halfPpr: 23,
      ppr: 21,
      dynasty: 23
    },
    expertRanks: {
      Andy : { halfPpr: 21, ppr: 19, dynasty: 21 },
      Mike : { halfPpr: 23, ppr: 21, dynasty: 23 },
      Jason : { halfPpr: 23, ppr: 21, dynasty: 23 },
    }
  },
  {
    rank: 24,
    espnId: 4567048,
    name: "Kenneth Walker III",
    position: "RB",
    team: "KC",
    bye: 5,
    adp: 23.5,
    posRank: "RB11",
    projectedPoints: 304,
    draftedBy: null,
    ranks: {
      halfPpr: 24,
      ppr: 26,
      dynasty: 24
    },
    expertRanks: {
      Andy : { halfPpr: 24, ppr: 26, dynasty: 24 },
      Mike : { halfPpr: 24, ppr: 26, dynasty: 24 },
      Jason : { halfPpr: 24, ppr: 26, dynasty: 24 },
    }
  },
  {
    rank: 25,
    espnId: 4361370,
    name: "Chris Olave",
    position: "WR",
    team: "NO",
    bye: 8,
    adp: 25.5,
    posRank: "WR12",
    projectedPoints: 302,
    draftedBy: null,
    ranks: {
      halfPpr: 25,
      ppr: 23,
      dynasty: 25
    },
    expertRanks: {
      Andy : { halfPpr: 23, ppr: 21, dynasty: 23 },
      Mike : { halfPpr: 25, ppr: 23, dynasty: 25 },
      Jason : { halfPpr: 25, ppr: 23, dynasty: 25 },
    }
  },
  {
    rank: 26,
    espnId: 3918298,
    name: "Josh Allen",
    position: "QB",
    team: "BUF",
    bye: 7,
    adp: 24.4,
    posRank: "QB1",
    projectedPoints: 366,
    draftedBy: null,
    ranks: {
      halfPpr: 26,
      ppr: 26,
      dynasty: 26
    },
    expertRanks: {
      Andy : { halfPpr: 26, ppr: 26, dynasty: 26 },
      Mike : { halfPpr: 26, ppr: 26, dynasty: 26 },
      Jason : { halfPpr: 26, ppr: 26, dynasty: 26 },
    }
  },
  {
    rank: 27,
    espnId: 4047646,
    name: "A.J. Brown",
    position: "WR",
    team: "PHI",
    bye: 10,
    adp: 24.8,
    posRank: "WR13",
    projectedPoints: 300,
    draftedBy: null,
    ranks: {
      halfPpr: 27,
      ppr: 25,
      dynasty: 27
    },
    expertRanks: {
      Andy : { halfPpr: 25, ppr: 23, dynasty: 25 },
      Mike : { halfPpr: 27, ppr: 25, dynasty: 27 },
      Jason : { halfPpr: 27, ppr: 25, dynasty: 27 },
    }
  },
  {
    rank: 28,
    espnId: 3043078,
    name: "Derrick Henry",
    position: "RB",
    team: "BAL",
    bye: 13,
    adp: 29.7,
    posRank: "RB12",
    projectedPoints: 299,
    draftedBy: null,
    ranks: {
      halfPpr: 28,
      ppr: 30,
      dynasty: 73
    },
    expertRanks: {
      Andy : { halfPpr: 28, ppr: 30, dynasty: 73 },
      Mike : { halfPpr: 28, ppr: 30, dynasty: 73 },
      Jason : { halfPpr: 28, ppr: 30, dynasty: 73 },
    }
  },
  {
    rank: 29,
    espnId: 4870808,
    name: "Jeremiyah Love",
    position: "RB",
    team: "ARI",
    bye: 14,
    adp: 29.6,
    posRank: "RB13",
    projectedPoints: 298,
    draftedBy: null,
    ranks: {
      halfPpr: 29,
      ppr: 31,
      dynasty: 29
    },
    expertRanks: {
      Andy : { halfPpr: 29, ppr: 31, dynasty: 29 },
      Mike : { halfPpr: 29, ppr: 31, dynasty: 29 },
      Jason : { halfPpr: 29, ppr: 31, dynasty: 29 },
    }
  },
  {
    rank: 30,
    espnId: 4047365,
    name: "Josh Jacobs",
    position: "RB",
    team: "GB",
    bye: 11,
    adp: 30,
    posRank: "RB14",
    projectedPoints: 297,
    draftedBy: null,
    ranks: {
      halfPpr: 30,
      ppr: 32,
      dynasty: 30
    },
    expertRanks: {
      Andy : { halfPpr: 30, ppr: 32, dynasty: 30 },
      Mike : { halfPpr: 30, ppr: 32, dynasty: 30 },
      Jason : { halfPpr: 30, ppr: 32, dynasty: 30 },
    }
  },
  {
    rank: 31,
    espnId: 3916387,
    name: "Lamar Jackson",
    position: "QB",
    team: "BAL",
    bye: 13,
    adp: 31.6,
    posRank: "QB2",
    projectedPoints: 361,
    draftedBy: null,
    ranks: {
      halfPpr: 31,
      ppr: 31,
      dynasty: 31
    },
    expertRanks: {
      Andy : { halfPpr: 31, ppr: 31, dynasty: 31 },
      Mike : { halfPpr: 31, ppr: 31, dynasty: 31 },
      Jason : { halfPpr: 31, ppr: 31, dynasty: 31 },
    }
  },
  {
    rank: 32,
    espnId: 4685472,
    name: "Tetairoa McMillan",
    position: "WR",
    team: "CAR",
    bye: 5,
    adp: 29.4,
    posRank: "WR14",
    projectedPoints: 295,
    draftedBy: null,
    ranks: {
      halfPpr: 32,
      ppr: 30,
      dynasty: 7
    },
    expertRanks: {
      Andy : { halfPpr: 30, ppr: 28, dynasty: 5 },
      Mike : { halfPpr: 32, ppr: 30, dynasty: 7 },
      Jason : { halfPpr: 32, ppr: 30, dynasty: 7 },
    }
  },
  {
    rank: 33,
    espnId: 4239993,
    name: "Tee Higgins",
    position: "WR",
    team: "CIN",
    bye: 6,
    adp: 33.7,
    posRank: "WR15",
    projectedPoints: 294,
    draftedBy: null,
    ranks: {
      halfPpr: 33,
      ppr: 31,
      dynasty: 33
    },
    expertRanks: {
      Andy : { halfPpr: 31, ppr: 29, dynasty: 31 },
      Mike : { halfPpr: 33, ppr: 31, dynasty: 33 },
      Jason : { halfPpr: 33, ppr: 31, dynasty: 33 },
    }
  },
  {
    rank: 34,
    espnId: 4431452,
    name: "Drake Maye",
    position: "QB",
    team: "NE",
    bye: 11,
    adp: 35.4,
    posRank: "QB3",
    projectedPoints: 358,
    draftedBy: null,
    ranks: {
      halfPpr: 34,
      ppr: 34,
      dynasty: 9
    },
    expertRanks: {
      Andy : { halfPpr: 34, ppr: 34, dynasty: 9 },
      Mike : { halfPpr: 34, ppr: 34, dynasty: 9 },
      Jason : { halfPpr: 34, ppr: 34, dynasty: 9 },
    }
  },
  {
    rank: 35,
    espnId: 4241478,
    name: "DeVonta Smith",
    position: "WR",
    team: "PHI",
    bye: 10,
    adp: 35.7,
    posRank: "WR16",
    projectedPoints: 292,
    draftedBy: null,
    ranks: {
      halfPpr: 35,
      ppr: 33,
      dynasty: 35
    },
    expertRanks: {
      Andy : { halfPpr: 33, ppr: 31, dynasty: 33 },
      Mike : { halfPpr: 35, ppr: 33, dynasty: 35 },
      Jason : { halfPpr: 35, ppr: 33, dynasty: 35 },
    }
  },
  {
    rank: 36,
    espnId: 4569618,
    name: "Garrett Wilson",
    position: "WR",
    team: "NYJ",
    bye: 13,
    adp: 34.6,
    posRank: "WR17",
    projectedPoints: 290,
    draftedBy: null,
    ranks: {
      halfPpr: 36,
      ppr: 34,
      dynasty: 36
    },
    expertRanks: {
      Andy : { halfPpr: 34, ppr: 32, dynasty: 34 },
      Mike : { halfPpr: 36, ppr: 34, dynasty: 36 },
      Jason : { halfPpr: 36, ppr: 34, dynasty: 36 },
    }
  },
  {
    rank: 37,
    espnId: 4723086,
    name: "Colston Loveland",
    position: "TE",
    team: "CHI",
    bye: 10,
    adp: 39.2,
    posRank: "TE3",
    projectedPoints: 289,
    draftedBy: null,
    ranks: {
      halfPpr: 37,
      ppr: 37,
      dynasty: 12
    },
    expertRanks: {
      Andy : { halfPpr: 37, ppr: 37, dynasty: 12 },
      Mike : { halfPpr: 37, ppr: 37, dynasty: 12 },
      Jason : { halfPpr: 37, ppr: 37, dynasty: 12 },
    }
  },
  {
    rank: 38,
    espnId: 4430737,
    name: "Kyren Williams",
    position: "RB",
    team: "LAR",
    bye: 11,
    adp: 35.7,
    posRank: "RB15",
    projectedPoints: 288,
    draftedBy: null,
    ranks: {
      halfPpr: 38,
      ppr: 40,
      dynasty: 38
    },
    expertRanks: {
      Andy : { halfPpr: 38, ppr: 40, dynasty: 38 },
      Mike : { halfPpr: 38, ppr: 40, dynasty: 38 },
      Jason : { halfPpr: 38, ppr: 40, dynasty: 38 },
    }
  },
  {
    rank: 39,
    espnId: 4427366,
    name: "Breece Hall",
    position: "RB",
    team: "NYJ",
    bye: 13,
    adp: 35.9,
    posRank: "RB16",
    projectedPoints: 287,
    draftedBy: null,
    ranks: {
      halfPpr: 39,
      ppr: 41,
      dynasty: 39
    },
    expertRanks: {
      Andy : { halfPpr: 39, ppr: 41, dynasty: 39 },
      Mike : { halfPpr: 39, ppr: 41, dynasty: 39 },
      Jason : { halfPpr: 39, ppr: 41, dynasty: 39 },
    }
  },
  {
    rank: 40,
    espnId: 4361579,
    name: "Javonte Williams",
    position: "RB",
    team: "DAL",
    bye: 14,
    adp: 36.8,
    posRank: "RB17",
    projectedPoints: 286,
    draftedBy: null,
    ranks: {
      halfPpr: 40,
      ppr: 42,
      dynasty: 40
    },
    expertRanks: {
      Andy : { halfPpr: 40, ppr: 42, dynasty: 40 },
      Mike : { halfPpr: 40, ppr: 42, dynasty: 40 },
      Jason : { halfPpr: 40, ppr: 42, dynasty: 40 },
    }
  },
  {
    rank: 41,
    espnId: 16800,
    name: "Davante Adams",
    position: "WR",
    team: "LAR",
    bye: 11,
    adp: 38.5,
    posRank: "WR18",
    projectedPoints: 285,
    draftedBy: null,
    ranks: {
      halfPpr: 41,
      ppr: 39,
      dynasty: 86
    },
    expertRanks: {
      Andy : { halfPpr: 39, ppr: 37, dynasty: 84 },
      Mike : { halfPpr: 41, ppr: 39, dynasty: 86 },
      Jason : { halfPpr: 41, ppr: 39, dynasty: 86 },
    }
  },
  {
    rank: 42,
    espnId: 4429615,
    name: "Zay Flowers",
    position: "WR",
    team: "BAL",
    bye: 13,
    adp: 44.5,
    posRank: "WR19",
    projectedPoints: 284,
    draftedBy: null,
    ranks: {
      halfPpr: 42,
      ppr: 40,
      dynasty: 42
    },
    expertRanks: {
      Andy : { halfPpr: 40, ppr: 38, dynasty: 40 },
      Mike : { halfPpr: 42, ppr: 40, dynasty: 42 },
      Jason : { halfPpr: 42, ppr: 40, dynasty: 42 },
    }
  },
  {
    rank: 43,
    espnId: 4612826,
    name: "Ladd McConkey",
    position: "WR",
    team: "LAC",
    bye: 7,
    adp: 40.4,
    posRank: "WR20",
    projectedPoints: 283,
    draftedBy: null,
    ranks: {
      halfPpr: 43,
      ppr: 41,
      dynasty: 18
    },
    expertRanks: {
      Andy : { halfPpr: 41, ppr: 39, dynasty: 16 },
      Mike : { halfPpr: 43, ppr: 41, dynasty: 18 },
      Jason : { halfPpr: 43, ppr: 41, dynasty: 18 },
    }
  },
  {
    rank: 44,
    espnId: 4239996,
    name: "Travis Etienne Jr.",
    position: "RB",
    team: "NO",
    bye: 8,
    adp: 44.9,
    posRank: "RB18",
    projectedPoints: 282,
    draftedBy: null,
    ranks: {
      halfPpr: 44,
      ppr: 46,
      dynasty: 44
    },
    expertRanks: {
      Andy : { halfPpr: 44, ppr: 46, dynasty: 44 },
      Mike : { halfPpr: 44, ppr: 46, dynasty: 44 },
      Jason : { halfPpr: 44, ppr: 46, dynasty: 44 },
    }
  },
  {
    rank: 45,
    espnId: 3915511,
    name: "Joe Burrow",
    position: "QB",
    team: "CIN",
    bye: 6,
    adp: 45.9,
    posRank: "QB4",
    projectedPoints: 346,
    draftedBy: null,
    ranks: {
      halfPpr: 45,
      ppr: 45,
      dynasty: 45
    },
    expertRanks: {
      Andy : { halfPpr: 45, ppr: 45, dynasty: 45 },
      Mike : { halfPpr: 45, ppr: 45, dynasty: 45 },
      Jason : { halfPpr: 45, ppr: 45, dynasty: 45 },
    }
  },
  {
    rank: 46,
    espnId: 4685278,
    name: "Luther Burden III",
    position: "WR",
    team: "CHI",
    bye: 10,
    adp: 48.8,
    posRank: "WR21",
    projectedPoints: 279,
    draftedBy: null,
    ranks: {
      halfPpr: 46,
      ppr: 44,
      dynasty: 21
    },
    expertRanks: {
      Andy : { halfPpr: 44, ppr: 42, dynasty: 19 },
      Mike : { halfPpr: 46, ppr: 44, dynasty: 21 },
      Jason : { halfPpr: 46, ppr: 44, dynasty: 21 },
    }
  },
  {
    rank: 47,
    espnId: 3121422,
    name: "Terry McLaurin",
    position: "WR",
    team: "WAS",
    bye: 7,
    adp: 45.1,
    posRank: "WR22",
    projectedPoints: 278,
    draftedBy: null,
    ranks: {
      halfPpr: 47,
      ppr: 45,
      dynasty: 47
    },
    expertRanks: {
      Andy : { halfPpr: 45, ppr: 43, dynasty: 45 },
      Mike : { halfPpr: 47, ppr: 45, dynasty: 47 },
      Jason : { halfPpr: 47, ppr: 45, dynasty: 47 },
    }
  },
  {
    rank: 48,
    espnId: 4372016,
    name: "Jaylen Waddle",
    position: "WR",
    team: "DEN",
    bye: 10,
    adp: 47,
    posRank: "WR23",
    projectedPoints: 277,
    draftedBy: null,
    ranks: {
      halfPpr: 48,
      ppr: 46,
      dynasty: 48
    },
    expertRanks: {
      Andy : { halfPpr: 46, ppr: 44, dynasty: 46 },
      Mike : { halfPpr: 48, ppr: 46, dynasty: 48 },
      Jason : { halfPpr: 48, ppr: 46, dynasty: 48 },
    }
  },
  {
    rank: 49,
    espnId: 4596448,
    name: "Bucky Irving",
    position: "RB",
    team: "TB",
    bye: 10,
    adp: 49,
    posRank: "RB19",
    projectedPoints: 276,
    draftedBy: null,
    ranks: {
      halfPpr: 49,
      ppr: 51,
      dynasty: 49
    },
    expertRanks: {
      Andy : { halfPpr: 49, ppr: 51, dynasty: 49 },
      Mike : { halfPpr: 49, ppr: 51, dynasty: 49 },
      Jason : { halfPpr: 49, ppr: 51, dynasty: 49 },
    }
  },
  {
    rank: 50,
    espnId: 4567750,
    name: "Emeka Egbuka",
    position: "WR",
    team: "TB",
    bye: 10,
    adp: 54,
    posRank: "WR24",
    projectedPoints: 275,
    draftedBy: null,
    ranks: {
      halfPpr: 50,
      ppr: 48,
      dynasty: 25
    },
    expertRanks: {
      Andy : { halfPpr: 48, ppr: 46, dynasty: 23 },
      Mike : { halfPpr: 50, ppr: 48, dynasty: 25 },
      Jason : { halfPpr: 50, ppr: 48, dynasty: 25 },
    }
  },
  {
    rank: 51,
    espnId: 4426388,
    name: "Jameson Williams",
    position: "WR",
    team: "DET",
    bye: 6,
    adp: 55.1,
    posRank: "WR25",
    projectedPoints: 274,
    draftedBy: null,
    ranks: {
      halfPpr: 51,
      ppr: 49,
      dynasty: 51
    },
    expertRanks: {
      Andy : { halfPpr: 49, ppr: 47, dynasty: 49 },
      Mike : { halfPpr: 51, ppr: 49, dynasty: 51 },
      Jason : { halfPpr: 51, ppr: 49, dynasty: 51 },
    }
  },
  {
    rank: 52,
    espnId: 4426348,
    name: "Jayden Daniels",
    position: "QB",
    team: "WAS",
    bye: 7,
    adp: 55.1,
    posRank: "QB5",
    projectedPoints: 338,
    draftedBy: null,
    ranks: {
      halfPpr: 52,
      ppr: 52,
      dynasty: 27
    },
    expertRanks: {
      Andy : { halfPpr: 52, ppr: 52, dynasty: 27 },
      Mike : { halfPpr: 52, ppr: 52, dynasty: 27 },
      Jason : { halfPpr: 52, ppr: 52, dynasty: 27 },
    }
  },
  {
    rank: 53,
    espnId: 16737,
    name: "Mike Evans",
    position: "WR",
    team: "SF",
    bye: 8,
    adp: 53,
    posRank: "WR26",
    projectedPoints: 272,
    draftedBy: null,
    ranks: {
      halfPpr: 53,
      ppr: 51,
      dynasty: 53
    },
    expertRanks: {
      Andy : { halfPpr: 51, ppr: 49, dynasty: 51 },
      Mike : { halfPpr: 53, ppr: 51, dynasty: 53 },
      Jason : { halfPpr: 53, ppr: 51, dynasty: 53 },
    }
  },
  {
    rank: 54,
    espnId: 4696981,
    name: "Cam Skattebo",
    position: "RB",
    team: "NYG",
    bye: 8,
    adp: 49.7,
    posRank: "RB20",
    projectedPoints: 271,
    draftedBy: null,
    ranks: {
      halfPpr: 54,
      ppr: 56,
      dynasty: 54
    },
    expertRanks: {
      Andy : { halfPpr: 54, ppr: 56, dynasty: 54 },
      Mike : { halfPpr: 54, ppr: 56, dynasty: 54 },
      Jason : { halfPpr: 54, ppr: 56, dynasty: 54 },
    }
  },
  {
    rank: 55,
    espnId: 4432710,
    name: "TreVeyon Henderson",
    position: "RB",
    team: "NE",
    bye: 11,
    adp: 53.9,
    posRank: "RB21",
    projectedPoints: 270,
    draftedBy: null,
    ranks: {
      halfPpr: 55,
      ppr: 57,
      dynasty: 55
    },
    expertRanks: {
      Andy : { halfPpr: 55, ppr: 57, dynasty: 55 },
      Mike : { halfPpr: 55, ppr: 57, dynasty: 55 },
      Jason : { halfPpr: 55, ppr: 57, dynasty: 55 },
    }
  },
  {
    rank: 56,
    espnId: 4040715,
    name: "Jalen Hurts",
    position: "QB",
    team: "PHI",
    bye: 10,
    adp: 54.9,
    posRank: "QB6",
    projectedPoints: 333,
    draftedBy: null,
    ranks: {
      halfPpr: 56,
      ppr: 56,
      dynasty: 56
    },
    expertRanks: {
      Andy : { halfPpr: 56, ppr: 56, dynasty: 56 },
      Mike : { halfPpr: 56, ppr: 56, dynasty: 56 },
      Jason : { halfPpr: 56, ppr: 56, dynasty: 56 },
    }
  },
  {
    rank: 57,
    espnId: 4248528,
    name: "Christian Watson",
    position: "WR",
    team: "GB",
    bye: 11,
    adp: 61.6,
    posRank: "WR27",
    projectedPoints: 267,
    draftedBy: null,
    ranks: {
      halfPpr: 57,
      ppr: 55,
      dynasty: 57
    },
    expertRanks: {
      Andy : { halfPpr: 55, ppr: 53, dynasty: 55 },
      Mike : { halfPpr: 57, ppr: 55, dynasty: 57 },
      Jason : { halfPpr: 57, ppr: 55, dynasty: 57 },
    }
  },
  {
    rank: 58,
    espnId: 4259545,
    name: "D'Andre Swift",
    position: "RB",
    team: "CHI",
    bye: 10,
    adp: 55.7,
    posRank: "RB22",
    projectedPoints: 266,
    draftedBy: null,
    ranks: {
      halfPpr: 58,
      ppr: 60,
      dynasty: 58
    },
    expertRanks: {
      Andy : { halfPpr: 58, ppr: 60, dynasty: 58 },
      Mike : { halfPpr: 58, ppr: 60, dynasty: 58 },
      Jason : { halfPpr: 58, ppr: 60, dynasty: 58 },
    }
  },
  {
    rank: 59,
    espnId: 4685702,
    name: "Quinshon Judkins",
    position: "RB",
    team: "CLE",
    bye: 11,
    adp: 56.6,
    posRank: "RB23",
    projectedPoints: 265,
    draftedBy: null,
    ranks: {
      halfPpr: 59,
      ppr: 61,
      dynasty: 59
    },
    expertRanks: {
      Andy : { halfPpr: 59, ppr: 61, dynasty: 59 },
      Mike : { halfPpr: 59, ppr: 61, dynasty: 59 },
      Jason : { halfPpr: 59, ppr: 61, dynasty: 59 },
    }
  },
  {
    rank: 60,
    espnId: 4035538,
    name: "David Montgomery",
    position: "RB",
    team: "HOU",
    bye: 8,
    adp: 55.2,
    posRank: "RB24",
    projectedPoints: 264,
    draftedBy: null,
    ranks: {
      halfPpr: 60,
      ppr: 62,
      dynasty: 60
    },
    expertRanks: {
      Andy : { halfPpr: 60, ppr: 62, dynasty: 60 },
      Mike : { halfPpr: 60, ppr: 62, dynasty: 60 },
      Jason : { halfPpr: 60, ppr: 62, dynasty: 60 },
    }
  },
  {
    rank: 61,
    espnId: 3915416,
    name: "DJ Moore",
    position: "WR",
    team: "BUF",
    bye: 7,
    adp: 61,
    posRank: "WR28",
    projectedPoints: 263,
    draftedBy: null,
    ranks: {
      halfPpr: 61,
      ppr: 59,
      dynasty: 61
    },
    expertRanks: {
      Andy : { halfPpr: 59, ppr: 57, dynasty: 59 },
      Mike : { halfPpr: 61, ppr: 59, dynasty: 61 },
      Jason : { halfPpr: 61, ppr: 59, dynasty: 61 },
    }
  },
  {
    rank: 62,
    espnId: 4431459,
    name: "Tyler Warren",
    position: "TE",
    team: "IND",
    bye: 13,
    adp: 62,
    posRank: "TE4",
    projectedPoints: 262,
    draftedBy: null,
    ranks: {
      halfPpr: 62,
      ppr: 62,
      dynasty: 62
    },
    expertRanks: {
      Andy : { halfPpr: 62, ppr: 62, dynasty: 62 },
      Mike : { halfPpr: 62, ppr: 62, dynasty: 62 },
      Jason : { halfPpr: 62, ppr: 62, dynasty: 62 },
    }
  },
  {
    rank: 63,
    espnId: 4572680,
    name: "Tucker Kraft",
    position: "TE",
    team: "GB",
    bye: 11,
    adp: 65.5,
    posRank: "TE5",
    projectedPoints: 261,
    draftedBy: null,
    ranks: {
      halfPpr: 63,
      ppr: 63,
      dynasty: 63
    },
    expertRanks: {
      Andy : { halfPpr: 63, ppr: 63, dynasty: 63 },
      Mike : { halfPpr: 63, ppr: 63, dynasty: 63 },
      Jason : { halfPpr: 63, ppr: 63, dynasty: 63 },
    }
  },
  {
    rank: 64,
    espnId: 4431299,
    name: "Rome Odunze",
    position: "WR",
    team: "CHI",
    bye: 10,
    adp: 61.4,
    posRank: "WR29",
    projectedPoints: 260,
    draftedBy: null,
    ranks: {
      halfPpr: 64,
      ppr: 62,
      dynasty: 39
    },
    expertRanks: {
      Andy : { halfPpr: 62, ppr: 60, dynasty: 37 },
      Mike : { halfPpr: 64, ppr: 62, dynasty: 39 },
      Jason : { halfPpr: 64, ppr: 62, dynasty: 39 },
    }
  },
  {
    rank: 65,
    espnId: 4882093,
    name: "Bhayshul Tuten",
    position: "RB",
    team: "JAX",
    bye: 7,
    adp: 67.6,
    posRank: "RB25",
    projectedPoints: 258,
    draftedBy: null,
    ranks: {
      halfPpr: 65,
      ppr: 67,
      dynasty: 65
    },
    expertRanks: {
      Andy : { halfPpr: 65, ppr: 67, dynasty: 65 },
      Mike : { halfPpr: 65, ppr: 67, dynasty: 65 },
      Jason : { halfPpr: 65, ppr: 67, dynasty: 65 },
    }
  },
  {
    rank: 66,
    espnId: 4871023,
    name: "Carnell Tate",
    position: "WR",
    team: "TEN",
    bye: 9,
    adp: 62,
    posRank: "WR30",
    projectedPoints: 257,
    draftedBy: null,
    ranks: {
      halfPpr: 66,
      ppr: 64,
      dynasty: 66
    },
    expertRanks: {
      Andy : { halfPpr: 64, ppr: 62, dynasty: 64 },
      Mike : { halfPpr: 66, ppr: 64, dynasty: 66 },
      Jason : { halfPpr: 66, ppr: 64, dynasty: 66 },
    }
  },
  {
    rank: 67,
    espnId: 4685512,
    name: "Jadarian Price",
    position: "RB",
    team: "SEA",
    bye: 11,
    adp: 64.3,
    posRank: "RB26",
    projectedPoints: 256,
    draftedBy: null,
    ranks: {
      halfPpr: 67,
      ppr: 69,
      dynasty: 67
    },
    expertRanks: {
      Andy : { halfPpr: 67, ppr: 69, dynasty: 67 },
      Mike : { halfPpr: 67, ppr: 69, dynasty: 67 },
      Jason : { halfPpr: 67, ppr: 69, dynasty: 67 },
    }
  },
  {
    rank: 68,
    espnId: 4038941,
    name: "Justin Herbert",
    position: "QB",
    team: "LAC",
    bye: 7,
    adp: 73.4,
    posRank: "QB7",
    projectedPoints: 320,
    draftedBy: null,
    ranks: {
      halfPpr: 68,
      ppr: 68,
      dynasty: 68
    },
    expertRanks: {
      Andy : { halfPpr: 68, ppr: 68, dynasty: 68 },
      Mike : { halfPpr: 68, ppr: 68, dynasty: 68 },
      Jason : { halfPpr: 68, ppr: 68, dynasty: 68 },
    }
  },
  {
    rank: 69,
    espnId: 4569987,
    name: "Jaylen Warren",
    position: "RB",
    team: "PIT",
    bye: 9,
    adp: 71.8,
    posRank: "RB27",
    projectedPoints: 254,
    draftedBy: null,
    ranks: {
      halfPpr: 69,
      ppr: 71,
      dynasty: 69
    },
    expertRanks: {
      Andy : { halfPpr: 69, ppr: 71, dynasty: 69 },
      Mike : { halfPpr: 69, ppr: 71, dynasty: 69 },
      Jason : { halfPpr: 69, ppr: 71, dynasty: 69 },
    }
  },
  {
    rank: 70,
    espnId: 4431611,
    name: "Caleb Williams",
    position: "QB",
    team: "CHI",
    bye: 10,
    adp: 71.4,
    posRank: "QB8",
    projectedPoints: 318,
    draftedBy: null,
    ranks: {
      halfPpr: 70,
      ppr: 70,
      dynasty: 45
    },
    expertRanks: {
      Andy : { halfPpr: 70, ppr: 70, dynasty: 45 },
      Mike : { halfPpr: 70, ppr: 70, dynasty: 45 },
      Jason : { halfPpr: 70, ppr: 70, dynasty: 45 },
    }
  },
  {
    rank: 71,
    espnId: 4689114,
    name: "Jaxson Dart",
    position: "QB",
    team: "NYG",
    bye: 8,
    adp: 66.7,
    posRank: "QB9",
    projectedPoints: 317,
    draftedBy: null,
    ranks: {
      halfPpr: 71,
      ppr: 71,
      dynasty: 71
    },
    expertRanks: {
      Andy : { halfPpr: 71, ppr: 71, dynasty: 71 },
      Mike : { halfPpr: 71, ppr: 71, dynasty: 71 },
      Jason : { halfPpr: 71, ppr: 71, dynasty: 71 },
    }
  },
  {
    rank: 72,
    espnId: 4241416,
    name: "Chuba Hubbard",
    position: "RB",
    team: "CAR",
    bye: 5,
    adp: 73.4,
    posRank: "RB28",
    projectedPoints: 251,
    draftedBy: null,
    ranks: {
      halfPpr: 72,
      ppr: 74,
      dynasty: 72
    },
    expertRanks: {
      Andy : { halfPpr: 72, ppr: 74, dynasty: 72 },
      Mike : { halfPpr: 72, ppr: 74, dynasty: 72 },
      Jason : { halfPpr: 72, ppr: 74, dynasty: 72 },
    }
  },
  {
    rank: 73,
    espnId: 4047650,
    name: "DK Metcalf",
    position: "WR",
    team: "PIT",
    bye: 9,
    adp: 70.1,
    posRank: "WR31",
    projectedPoints: 250,
    draftedBy: null,
    ranks: {
      halfPpr: 73,
      ppr: 71,
      dynasty: 73
    },
    expertRanks: {
      Andy : { halfPpr: 71, ppr: 69, dynasty: 71 },
      Mike : { halfPpr: 73, ppr: 71, dynasty: 73 },
      Jason : { halfPpr: 73, ppr: 71, dynasty: 73 },
    }
  },
  {
    rank: 74,
    espnId: 4432708,
    name: "Marvin Harrison Jr.",
    position: "WR",
    team: "ARI",
    bye: 14,
    adp: 71,
    posRank: "WR32",
    projectedPoints: 249,
    draftedBy: null,
    ranks: {
      halfPpr: 74,
      ppr: 72,
      dynasty: 49
    },
    expertRanks: {
      Andy : { halfPpr: 72, ppr: 70, dynasty: 47 },
      Mike : { halfPpr: 74, ppr: 72, dynasty: 49 },
      Jason : { halfPpr: 74, ppr: 72, dynasty: 49 },
    }
  },
  {
    rank: 75,
    espnId: 4360078,
    name: "Alec Pierce",
    position: "WR",
    team: "IND",
    bye: 13,
    adp: 78,
    posRank: "WR33",
    projectedPoints: 248,
    draftedBy: null,
    ranks: {
      halfPpr: 75,
      ppr: 73,
      dynasty: 75
    },
    expertRanks: {
      Andy : { halfPpr: 73, ppr: 71, dynasty: 73 },
      Mike : { halfPpr: 75, ppr: 73, dynasty: 75 },
      Jason : { halfPpr: 75, ppr: 73, dynasty: 75 },
    }
  },
  {
    rank: 76,
    espnId: 3128429,
    name: "Courtland Sutton",
    position: "WR",
    team: "DEN",
    bye: 10,
    adp: 77.5,
    posRank: "WR34",
    projectedPoints: 246,
    draftedBy: null,
    ranks: {
      halfPpr: 76,
      ppr: 74,
      dynasty: 76
    },
    expertRanks: {
      Andy : { halfPpr: 74, ppr: 72, dynasty: 74 },
      Mike : { halfPpr: 76, ppr: 74, dynasty: 76 },
      Jason : { halfPpr: 76, ppr: 74, dynasty: 76 },
    }
  },
  {
    rank: 77,
    espnId: 5083076,
    name: "Harold Fannin Jr.",
    position: "TE",
    team: "CLE",
    bye: 11,
    adp: 83.2,
    posRank: "TE6",
    projectedPoints: 245,
    draftedBy: null,
    ranks: {
      halfPpr: 77,
      ppr: 77,
      dynasty: 77
    },
    expertRanks: {
      Andy : { halfPpr: 77, ppr: 77, dynasty: 77 },
      Mike : { halfPpr: 77, ppr: 77, dynasty: 77 },
      Jason : { halfPpr: 77, ppr: 77, dynasty: 77 },
    }
  },
  {
    rank: 78,
    espnId: 4360310,
    name: "Trevor Lawrence",
    position: "QB",
    team: "JAX",
    bye: 7,
    adp: 81.1,
    posRank: "QB10",
    projectedPoints: 309,
    draftedBy: null,
    ranks: {
      halfPpr: 78,
      ppr: 78,
      dynasty: 78
    },
    expertRanks: {
      Andy : { halfPpr: 78, ppr: 78, dynasty: 78 },
      Mike : { halfPpr: 78, ppr: 78, dynasty: 78 },
      Jason : { halfPpr: 78, ppr: 78, dynasty: 78 },
    }
  },
  {
    rank: 79,
    espnId: 4880281,
    name: "Jordyn Tyson",
    position: "WR",
    team: "NO",
    bye: 8,
    adp: 82.2,
    posRank: "WR35",
    projectedPoints: 243,
    draftedBy: null,
    ranks: {
      halfPpr: 79,
      ppr: 77,
      dynasty: 79
    },
    expertRanks: {
      Andy : { halfPpr: 77, ppr: 75, dynasty: 77 },
      Mike : { halfPpr: 79, ppr: 77, dynasty: 79 },
      Jason : { halfPpr: 79, ppr: 77, dynasty: 79 },
    }
  },
  {
    rank: 80,
    espnId: 4568490,
    name: "RJ Harvey",
    position: "RB",
    team: "DEN",
    bye: 10,
    adp: 75.2,
    posRank: "RB29",
    projectedPoints: 242,
    draftedBy: null,
    ranks: {
      halfPpr: 80,
      ppr: 82,
      dynasty: 80
    },
    expertRanks: {
      Andy : { halfPpr: 80, ppr: 82, dynasty: 80 },
      Mike : { halfPpr: 80, ppr: 82, dynasty: 80 },
      Jason : { halfPpr: 80, ppr: 82, dynasty: 80 },
    }
  },
  {
    rank: 81,
    espnId: 4360761,
    name: "Michael Wilson",
    position: "WR",
    team: "ARI",
    bye: 14,
    adp: 74.5,
    posRank: "WR36",
    projectedPoints: 241,
    draftedBy: null,
    ranks: {
      halfPpr: 81,
      ppr: 79,
      dynasty: 81
    },
    expertRanks: {
      Andy : { halfPpr: 79, ppr: 77, dynasty: 79 },
      Mike : { halfPpr: 81, ppr: 79, dynasty: 81 },
      Jason : { halfPpr: 81, ppr: 79, dynasty: 81 },
    }
  },
  {
    rank: 82,
    espnId: 4038815,
    name: "Rico Dowdle",
    position: "RB",
    team: "PIT",
    bye: 9,
    adp: 77.1,
    posRank: "RB30",
    projectedPoints: 240,
    draftedBy: null,
    ranks: {
      halfPpr: 82,
      ppr: 84,
      dynasty: 82
    },
    expertRanks: {
      Andy : { halfPpr: 82, ppr: 84, dynasty: 82 },
      Mike : { halfPpr: 82, ppr: 84, dynasty: 82 },
      Jason : { halfPpr: 82, ppr: 84, dynasty: 82 },
    }
  },
  {
    rank: 83,
    espnId: 2577417,
    name: "Dak Prescott",
    position: "QB",
    team: "DAL",
    bye: 14,
    adp: 83,
    posRank: "QB11",
    projectedPoints: 304,
    draftedBy: null,
    ranks: {
      halfPpr: 83,
      ppr: 83,
      dynasty: 83
    },
    expertRanks: {
      Andy : { halfPpr: 83, ppr: 83, dynasty: 83 },
      Mike : { halfPpr: 83, ppr: 83, dynasty: 83 },
      Jason : { halfPpr: 83, ppr: 83, dynasty: 83 },
    }
  },
  {
    rank: 84,
    espnId: 4569173,
    name: "Rhamondre Stevenson",
    position: "RB",
    team: "NE",
    bye: 11,
    adp: 90.7,
    posRank: "RB31",
    projectedPoints: 238,
    draftedBy: null,
    ranks: {
      halfPpr: 84,
      ppr: 86,
      dynasty: 84
    },
    expertRanks: {
      Andy : { halfPpr: 84, ppr: 86, dynasty: 84 },
      Mike : { halfPpr: 84, ppr: 86, dynasty: 84 },
      Jason : { halfPpr: 84, ppr: 86, dynasty: 84 },
    }
  },
  {
    rank: 85,
    espnId: 4430027,
    name: "Sam LaPorta",
    position: "TE",
    team: "DET",
    bye: 6,
    adp: 85,
    posRank: "TE7",
    projectedPoints: 236,
    draftedBy: null,
    ranks: {
      halfPpr: 85,
      ppr: 85,
      dynasty: 60
    },
    expertRanks: {
      Andy : { halfPpr: 85, ppr: 85, dynasty: 60 },
      Mike : { halfPpr: 85, ppr: 85, dynasty: 60 },
      Jason : { halfPpr: 85, ppr: 85, dynasty: 60 },
    }
  },
  {
    rank: 86,
    espnId: 3116165,
    name: "Chris Godwin Jr.",
    position: "WR",
    team: "TB",
    bye: 10,
    adp: 89.4,
    posRank: "WR37",
    projectedPoints: 235,
    draftedBy: null,
    ranks: {
      halfPpr: 86,
      ppr: 84,
      dynasty: 86
    },
    expertRanks: {
      Andy : { halfPpr: 84, ppr: 82, dynasty: 84 },
      Mike : { halfPpr: 86, ppr: 84, dynasty: 86 },
      Jason : { halfPpr: 86, ppr: 84, dynasty: 86 },
    }
  },
  {
    rank: 87,
    espnId: 4360248,
    name: "Kyle Pitts Sr.",
    position: "TE",
    team: "ATL",
    bye: 11,
    adp: 83.5,
    posRank: "TE8",
    projectedPoints: 234,
    draftedBy: null,
    ranks: {
      halfPpr: 87,
      ppr: 87,
      dynasty: 87
    },
    expertRanks: {
      Andy : { halfPpr: 87, ppr: 87, dynasty: 87 },
      Mike : { halfPpr: 87, ppr: 87, dynasty: 87 },
      Jason : { halfPpr: 87, ppr: 87, dynasty: 87 },
    }
  },
  {
    rank: 88,
    espnId: 3916148,
    name: "Tony Pollard",
    position: "RB",
    team: "TEN",
    bye: 9,
    adp: 91.5,
    posRank: "RB32",
    projectedPoints: 233,
    draftedBy: null,
    ranks: {
      halfPpr: 88,
      ppr: 90,
      dynasty: 88
    },
    expertRanks: {
      Andy : { halfPpr: 88, ppr: 90, dynasty: 88 },
      Mike : { halfPpr: 88, ppr: 90, dynasty: 88 },
      Jason : { halfPpr: 88, ppr: 90, dynasty: 88 },
    }
  },
  {
    rank: 89,
    espnId: 4608686,
    name: "Kyle Monangai",
    position: "RB",
    team: "CHI",
    bye: 10,
    adp: 90.8,
    posRank: "RB33",
    projectedPoints: 232,
    draftedBy: null,
    ranks: {
      halfPpr: 89,
      ppr: 91,
      dynasty: 89
    },
    expertRanks: {
      Andy : { halfPpr: 89, ppr: 91, dynasty: 89 },
      Mike : { halfPpr: 89, ppr: 91, dynasty: 89 },
      Jason : { halfPpr: 89, ppr: 91, dynasty: 89 },
    }
  },
  {
    rank: 90,
    espnId: 4432773,
    name: "Brian Thomas Jr.",
    position: "WR",
    team: "JAX",
    bye: 7,
    adp: 93.6,
    posRank: "WR38",
    projectedPoints: 231,
    draftedBy: null,
    ranks: {
      halfPpr: 90,
      ppr: 88,
      dynasty: 65
    },
    expertRanks: {
      Andy : { halfPpr: 88, ppr: 86, dynasty: 63 },
      Mike : { halfPpr: 90, ppr: 88, dynasty: 65 },
      Jason : { halfPpr: 90, ppr: 88, dynasty: 65 },
    }
  },
  {
    rank: 91,
    espnId: 4870795,
    name: "Makai Lemon",
    position: "WR",
    team: "PHI",
    bye: 10,
    adp: 92.8,
    posRank: "WR39",
    projectedPoints: 230,
    draftedBy: null,
    ranks: {
      halfPpr: 91,
      ppr: 89,
      dynasty: 91
    },
    expertRanks: {
      Andy : { halfPpr: 89, ppr: 87, dynasty: 89 },
      Mike : { halfPpr: 91, ppr: 89, dynasty: 91 },
      Jason : { halfPpr: 91, ppr: 89, dynasty: 91 },
    }
  },
  {
    rank: 92,
    espnId: 4361741,
    name: "Brock Purdy",
    position: "QB",
    team: "SF",
    bye: 8,
    adp: 99.4,
    posRank: "QB12",
    projectedPoints: 294,
    draftedBy: null,
    ranks: {
      halfPpr: 92,
      ppr: 92,
      dynasty: 92
    },
    expertRanks: {
      Andy : { halfPpr: 92, ppr: 92, dynasty: 92 },
      Mike : { halfPpr: 92, ppr: 92, dynasty: 92 },
      Jason : { halfPpr: 92, ppr: 92, dynasty: 92 },
    }
  },
  {
    rank: 93,
    espnId: 4429096,
    name: "Blake Corum",
    position: "RB",
    team: "LAR",
    bye: 11,
    adp: 91.1,
    posRank: "RB34",
    projectedPoints: 228,
    draftedBy: null,
    ranks: {
      halfPpr: 93,
      ppr: 95,
      dynasty: 68
    },
    expertRanks: {
      Andy : { halfPpr: 93, ppr: 95, dynasty: 68 },
      Mike : { halfPpr: 93, ppr: 95, dynasty: 68 },
      Jason : { halfPpr: 93, ppr: 95, dynasty: 68 },
    }
  },
  {
    rank: 94,
    espnId: 3916433,
    name: "Jakobi Meyers",
    position: "WR",
    team: "JAX",
    bye: 7,
    adp: 90.2,
    posRank: "WR40",
    projectedPoints: 227,
    draftedBy: null,
    ranks: {
      halfPpr: 94,
      ppr: 92,
      dynasty: 94
    },
    expertRanks: {
      Andy : { halfPpr: 92, ppr: 90, dynasty: 92 },
      Mike : { halfPpr: 94, ppr: 92, dynasty: 94 },
      Jason : { halfPpr: 94, ppr: 92, dynasty: 94 },
    }
  },
  {
    rank: 95,
    espnId: 4432620,
    name: "Parker Washington",
    position: "WR",
    team: "JAX",
    bye: 7,
    adp: 91.2,
    posRank: "WR41",
    projectedPoints: 226,
    draftedBy: null,
    ranks: {
      halfPpr: 95,
      ppr: 93,
      dynasty: 95
    },
    expertRanks: {
      Andy : { halfPpr: 93, ppr: 91, dynasty: 93 },
      Mike : { halfPpr: 95, ppr: 93, dynasty: 95 },
      Jason : { halfPpr: 95, ppr: 93, dynasty: 95 },
    }
  },
  {
    rank: 96,
    espnId: 3139477,
    name: "Patrick Mahomes II",
    position: "QB",
    team: "KC",
    bye: 5,
    adp: 96,
    posRank: "QB13",
    projectedPoints: 289,
    draftedBy: null,
    ranks: {
      halfPpr: 96,
      ppr: 96,
      dynasty: 96
    },
    expertRanks: {
      Andy : { halfPpr: 96, ppr: 96, dynasty: 96 },
      Mike : { halfPpr: 96, ppr: 96, dynasty: 96 },
      Jason : { halfPpr: 96, ppr: 96, dynasty: 96 },
    }
  },
  {
    rank: 97,
    espnId: 4241985,
    name: "J.K. Dobbins",
    position: "RB",
    team: "DEN",
    bye: 10,
    adp: 100.9,
    posRank: "RB35",
    projectedPoints: 223,
    draftedBy: null,
    ranks: {
      halfPpr: 97,
      ppr: 99,
      dynasty: 97
    },
    expertRanks: {
      Andy : { halfPpr: 97, ppr: 99, dynasty: 97 },
      Mike : { halfPpr: 97, ppr: 99, dynasty: 97 },
      Jason : { halfPpr: 97, ppr: 99, dynasty: 97 },
    }
  },
  {
    rank: 98,
    espnId: 12483,
    name: "Matthew Stafford",
    position: "QB",
    team: "LAR",
    bye: 11,
    adp: 96,
    posRank: "QB14",
    projectedPoints: 287,
    draftedBy: null,
    ranks: {
      halfPpr: 98,
      ppr: 98,
      dynasty: 143
    },
    expertRanks: {
      Andy : { halfPpr: 98, ppr: 98, dynasty: 143 },
      Mike : { halfPpr: 98, ppr: 98, dynasty: 143 },
      Jason : { halfPpr: 98, ppr: 98, dynasty: 143 },
    }
  },
  {
    rank: 99,
    espnId: 4428209,
    name: "Ricky Pearsall",
    position: "WR",
    team: "SF",
    bye: 8,
    adp: 104.9,
    posRank: "WR42",
    projectedPoints: 221,
    draftedBy: null,
    ranks: {
      halfPpr: 99,
      ppr: 97,
      dynasty: 99
    },
    expertRanks: {
      Andy : { halfPpr: 97, ppr: 95, dynasty: 97 },
      Mike : { halfPpr: 99, ppr: 97, dynasty: 99 },
      Jason : { halfPpr: 99, ppr: 97, dynasty: 99 },
    }
  },
  {
    rank: 100,
    espnId: 4429205,
    name: "Jordan Addison",
    position: "WR",
    team: "MIN",
    bye: 6,
    adp: 98,
    posRank: "WR43",
    projectedPoints: 220,
    draftedBy: null,
    ranks: {
      halfPpr: 100,
      ppr: 98,
      dynasty: 100
    },
    expertRanks: {
      Andy : { halfPpr: 98, ppr: 96, dynasty: 98 },
      Mike : { halfPpr: 100, ppr: 98, dynasty: 100 },
      Jason : { halfPpr: 100, ppr: 98, dynasty: 100 },
    }
  },
  {
    rank: 101,
    espnId: 4426338,
    name: "Bo Nix",
    position: "QB",
    team: "DEN",
    bye: 10,
    adp: 109.1,
    posRank: "QB15",
    projectedPoints: 284,
    draftedBy: null,
    ranks: {
      halfPpr: 101,
      ppr: 101,
      dynasty: 101
    },
    expertRanks: {
      Andy : { halfPpr: 101, ppr: 101, dynasty: 101 },
      Mike : { halfPpr: 101, ppr: 101, dynasty: 101 },
      Jason : { halfPpr: 101, ppr: 101, dynasty: 101 },
    }
  },
  {
    rank: 102,
    espnId: 4035687,
    name: "Michael Pittman Jr.",
    position: "WR",
    team: "PIT",
    bye: 9,
    adp: 100,
    posRank: "WR44",
    projectedPoints: 218,
    draftedBy: null,
    ranks: {
      halfPpr: 102,
      ppr: 100,
      dynasty: 102
    },
    expertRanks: {
      Andy : { halfPpr: 100, ppr: 98, dynasty: 100 },
      Mike : { halfPpr: 102, ppr: 100, dynasty: 102 },
      Jason : { halfPpr: 102, ppr: 100, dynasty: 102 },
    }
  },
  {
    rank: 103,
    espnId: 4385690,
    name: "Dalton Kincaid",
    position: "TE",
    team: "BUF",
    bye: 7,
    adp: 96.8,
    posRank: "TE9",
    projectedPoints: 217,
    draftedBy: null,
    ranks: {
      halfPpr: 103,
      ppr: 103,
      dynasty: 78
    },
    expertRanks: {
      Andy : { halfPpr: 103, ppr: 103, dynasty: 78 },
      Mike : { halfPpr: 103, ppr: 103, dynasty: 78 },
      Jason : { halfPpr: 103, ppr: 103, dynasty: 78 },
    }
  },
  {
    rank: 104,
    espnId: 4575131,
    name: "Jacory Croskey-Merritt",
    position: "RB",
    team: "WAS",
    bye: 7,
    adp: 101.9,
    posRank: "RB36",
    projectedPoints: 216,
    draftedBy: null,
    ranks: {
      halfPpr: 104,
      ppr: 106,
      dynasty: 104
    },
    expertRanks: {
      Andy : { halfPpr: 104, ppr: 106, dynasty: 104 },
      Mike : { halfPpr: 104, ppr: 106, dynasty: 104 },
      Jason : { halfPpr: 104, ppr: 106, dynasty: 104 },
    }
  },
  {
    rank: 105,
    espnId: 4569587,
    name: "Wan'Dale Robinson",
    position: "WR",
    team: "TEN",
    bye: 9,
    adp: 109.2,
    posRank: "WR45",
    projectedPoints: 214,
    draftedBy: null,
    ranks: {
      halfPpr: 105,
      ppr: 103,
      dynasty: 105
    },
    expertRanks: {
      Andy : { halfPpr: 103, ppr: 101, dynasty: 103 },
      Mike : { halfPpr: 105, ppr: 103, dynasty: 105 },
      Jason : { halfPpr: 105, ppr: 103, dynasty: 105 },
    }
  },
  {
    rank: 106,
    espnId: 3042519,
    name: "Aaron Jones Sr.",
    position: "RB",
    team: "MIN",
    bye: 6,
    adp: 99.6,
    posRank: "RB37",
    projectedPoints: 213,
    draftedBy: null,
    ranks: {
      halfPpr: 106,
      ppr: 108,
      dynasty: 106
    },
    expertRanks: {
      Andy : { halfPpr: 106, ppr: 108, dynasty: 106 },
      Mike : { halfPpr: 106, ppr: 108, dynasty: 106 },
      Jason : { halfPpr: 106, ppr: 108, dynasty: 106 },
    }
  },
  {
    rank: 107,
    espnId: 4362249,
    name: "Jayden Reed",
    position: "WR",
    team: "GB",
    bye: 11,
    adp: 102.7,
    posRank: "WR46",
    projectedPoints: 212,
    draftedBy: null,
    ranks: {
      halfPpr: 107,
      ppr: 105,
      dynasty: 107
    },
    expertRanks: {
      Andy : { halfPpr: 105, ppr: 103, dynasty: 105 },
      Mike : { halfPpr: 107, ppr: 105, dynasty: 107 },
      Jason : { halfPpr: 107, ppr: 105, dynasty: 107 },
    }
  },
  {
    rank: 108,
    espnId: 15847,
    name: "Travis Kelce",
    position: "TE",
    team: "KC",
    bye: 5,
    adp: 112.3,
    posRank: "TE10",
    projectedPoints: 211,
    draftedBy: null,
    ranks: {
      halfPpr: 108,
      ppr: 108,
      dynasty: 153
    },
    expertRanks: {
      Andy : { halfPpr: 108, ppr: 108, dynasty: 153 },
      Mike : { halfPpr: 108, ppr: 108, dynasty: 153 },
      Jason : { halfPpr: 108, ppr: 108, dynasty: 153 },
    }
  },
  {
    rank: 109,
    espnId: 3046779,
    name: "Jared Goff",
    position: "QB",
    team: "DET",
    bye: 6,
    adp: 109,
    posRank: "QB16",
    projectedPoints: 275,
    draftedBy: null,
    ranks: {
      halfPpr: 109,
      ppr: 109,
      dynasty: 109
    },
    expertRanks: {
      Andy : { halfPpr: 109, ppr: 109, dynasty: 109 },
      Mike : { halfPpr: 109, ppr: 109, dynasty: 109 },
      Jason : { halfPpr: 109, ppr: 109, dynasty: 109 },
    }
  },
  {
    rank: 110,
    espnId: 3917315,
    name: "Kyler Murray",
    position: "QB",
    team: "MIN",
    bye: 6,
    adp: 107.8,
    posRank: "QB17",
    projectedPoints: 274,
    draftedBy: null,
    ranks: {
      halfPpr: 110,
      ppr: 110,
      dynasty: 110
    },
    expertRanks: {
      Andy : { halfPpr: 110, ppr: 110, dynasty: 110 },
      Mike : { halfPpr: 110, ppr: 110, dynasty: 110 },
      Jason : { halfPpr: 110, ppr: 110, dynasty: 110 },
    }
  },
  {
    rank: 111,
    espnId: 4242355,
    name: "Jake Ferguson",
    position: "TE",
    team: "DAL",
    bye: 14,
    adp: 104.3,
    posRank: "TE11",
    projectedPoints: 208,
    draftedBy: null,
    ranks: {
      halfPpr: 111,
      ppr: 111,
      dynasty: 111
    },
    expertRanks: {
      Andy : { halfPpr: 111, ppr: 111, dynasty: 111 },
      Mike : { halfPpr: 111, ppr: 111, dynasty: 111 },
      Jason : { halfPpr: 111, ppr: 111, dynasty: 111 },
    }
  },
  {
    rank: 112,
    espnId: 4371733,
    name: "Kenneth Gainwell",
    position: "RB",
    team: "TB",
    bye: 10,
    adp: 107.5,
    posRank: "RB38",
    projectedPoints: 207,
    draftedBy: null,
    ranks: {
      halfPpr: 112,
      ppr: 114,
      dynasty: 112
    },
    expertRanks: {
      Andy : { halfPpr: 112, ppr: 114, dynasty: 112 },
      Mike : { halfPpr: 112, ppr: 114, dynasty: 112 },
      Jason : { halfPpr: 112, ppr: 114, dynasty: 112 },
    }
  },
  {
    rank: 113,
    espnId: 4429025,
    name: "Quentin Johnston",
    position: "WR",
    team: "LAC",
    bye: 7,
    adp: 110.7,
    posRank: "WR47",
    projectedPoints: 206,
    draftedBy: null,
    ranks: {
      halfPpr: 113,
      ppr: 111,
      dynasty: 113
    },
    expertRanks: {
      Andy : { halfPpr: 111, ppr: 109, dynasty: 111 },
      Mike : { halfPpr: 113, ppr: 111, dynasty: 113 },
      Jason : { halfPpr: 113, ppr: 111, dynasty: 113 },
    }
  },
  {
    rank: 114,
    espnId: 4688813,
    name: "Josh Downs",
    position: "WR",
    team: "IND",
    bye: 13,
    adp: 116.3,
    posRank: "WR48",
    projectedPoints: 205,
    draftedBy: null,
    ranks: {
      halfPpr: 114,
      ppr: 112,
      dynasty: 114
    },
    expertRanks: {
      Andy : { halfPpr: 112, ppr: 110, dynasty: 112 },
      Mike : { halfPpr: 114, ppr: 112, dynasty: 114 },
      Jason : { halfPpr: 114, ppr: 112, dynasty: 114 },
    }
  },
  {
    rank: 115,
    espnId: 3040151,
    name: "George Kittle",
    position: "TE",
    team: "SF",
    bye: 8,
    adp: 112.7,
    posRank: "TE12",
    projectedPoints: 204,
    draftedBy: null,
    ranks: {
      halfPpr: 115,
      ppr: 115,
      dynasty: 115
    },
    expertRanks: {
      Andy : { halfPpr: 115, ppr: 115, dynasty: 115 },
      Mike : { halfPpr: 115, ppr: 115, dynasty: 115 },
      Jason : { halfPpr: 115, ppr: 115, dynasty: 115 },
    }
  },
  {
    rank: 116,
    espnId: 4595342,
    name: "Oronde Gadsden II",
    position: "TE",
    team: "LAC",
    bye: 7,
    adp: 123,
    posRank: "TE13",
    projectedPoints: 202,
    draftedBy: null,
    ranks: {
      halfPpr: 116,
      ppr: 116,
      dynasty: 116
    },
    expertRanks: {
      Andy : { halfPpr: 116, ppr: 116, dynasty: 116 },
      Mike : { halfPpr: 116, ppr: 116, dynasty: 116 },
      Jason : { halfPpr: 116, ppr: 116, dynasty: 116 },
    }
  },
  {
    rank: 117,
    espnId: 4036378,
    name: "Jordan Love",
    position: "QB",
    team: "GB",
    bye: 11,
    adp: 107.6,
    posRank: "QB18",
    projectedPoints: 266,
    draftedBy: null,
    ranks: {
      halfPpr: 117,
      ppr: 117,
      dynasty: 117
    },
    expertRanks: {
      Andy : { halfPpr: 117, ppr: 117, dynasty: 117 },
      Mike : { halfPpr: 117, ppr: 117, dynasty: 117 },
      Jason : { halfPpr: 117, ppr: 117, dynasty: 117 },
    }
  },
  {
    rank: 118,
    espnId: 4697815,
    name: "Rachaad White",
    position: "RB",
    team: "WAS",
    bye: 7,
    adp: 122.7,
    posRank: "RB39",
    projectedPoints: 200,
    draftedBy: null,
    ranks: {
      halfPpr: 118,
      ppr: 120,
      dynasty: 118
    },
    expertRanks: {
      Andy : { halfPpr: 118, ppr: 120, dynasty: 118 },
      Mike : { halfPpr: 118, ppr: 120, dynasty: 118 },
      Jason : { halfPpr: 118, ppr: 120, dynasty: 118 },
    }
  },
  {
    rank: 119,
    espnId: 4361050,
    name: "Isaiah Likely",
    position: "TE",
    team: "NYG",
    bye: 8,
    adp: 128.5,
    posRank: "TE14",
    projectedPoints: 199,
    draftedBy: null,
    ranks: {
      halfPpr: 119,
      ppr: 119,
      dynasty: 119
    },
    expertRanks: {
      Andy : { halfPpr: 119, ppr: 119, dynasty: 119 },
      Mike : { halfPpr: 119, ppr: 119, dynasty: 119 },
      Jason : { halfPpr: 119, ppr: 119, dynasty: 119 },
    }
  },
  {
    rank: 120,
    espnId: 3121023,
    name: "Dallas Goedert",
    position: "TE",
    team: "PHI",
    bye: 10,
    adp: 127.2,
    posRank: "TE15",
    projectedPoints: 198,
    draftedBy: null,
    ranks: {
      halfPpr: 120,
      ppr: 120,
      dynasty: 120
    },
    expertRanks: {
      Andy : { halfPpr: 120, ppr: 120, dynasty: 120 },
      Mike : { halfPpr: 120, ppr: 120, dynasty: 120 },
      Jason : { halfPpr: 120, ppr: 120, dynasty: 120 },
    }
  },
  {
    rank: 121,
    espnId: 4877706,
    name: "Jayden Higgins",
    position: "WR",
    team: "HOU",
    bye: 8,
    adp: 128.3,
    posRank: "WR49",
    projectedPoints: 197,
    draftedBy: null,
    ranks: {
      halfPpr: 121,
      ppr: 119,
      dynasty: 121
    },
    expertRanks: {
      Andy : { halfPpr: 119, ppr: 117, dynasty: 119 },
      Mike : { halfPpr: 121, ppr: 119, dynasty: 121 },
      Jason : { halfPpr: 121, ppr: 119, dynasty: 121 },
    }
  },
  {
    rank: 122,
    espnId: 4360569,
    name: "Jordan Mason",
    position: "RB",
    team: "MIN",
    bye: 6,
    adp: 124.4,
    posRank: "RB40",
    projectedPoints: 196,
    draftedBy: null,
    ranks: {
      halfPpr: 122,
      ppr: 124,
      dynasty: 122
    },
    expertRanks: {
      Andy : { halfPpr: 122, ppr: 124, dynasty: 122 },
      Mike : { halfPpr: 122, ppr: 124, dynasty: 122 },
      Jason : { halfPpr: 122, ppr: 124, dynasty: 122 },
    }
  },
  {
    rank: 123,
    espnId: 4360689,
    name: "Tyler Shough",
    position: "QB",
    team: "NO",
    bye: 8,
    adp: 120.5,
    posRank: "QB19",
    projectedPoints: 260,
    draftedBy: null,
    ranks: {
      halfPpr: 123,
      ppr: 123,
      dynasty: 123
    },
    expertRanks: {
      Andy : { halfPpr: 123, ppr: 123, dynasty: 123 },
      Mike : { halfPpr: 123, ppr: 123, dynasty: 123 },
      Jason : { halfPpr: 123, ppr: 123, dynasty: 123 },
    }
  },
  {
    rank: 124,
    espnId: 3052587,
    name: "Baker Mayfield",
    position: "QB",
    team: "TB",
    bye: 10,
    adp: 126.5,
    posRank: "QB20",
    projectedPoints: 259,
    draftedBy: null,
    ranks: {
      halfPpr: 124,
      ppr: 124,
      dynasty: 124
    },
    expertRanks: {
      Andy : { halfPpr: 124, ppr: 124, dynasty: 124 },
      Mike : { halfPpr: 124, ppr: 124, dynasty: 124 },
      Jason : { halfPpr: 124, ppr: 124, dynasty: 124 },
    }
  },
  {
    rank: 125,
    espnId: 4373626,
    name: "Tyler Allgeier",
    position: "RB",
    team: "ARI",
    bye: 14,
    adp: 130,
    posRank: "RB41",
    projectedPoints: 192,
    draftedBy: null,
    ranks: {
      halfPpr: 125,
      ppr: 127,
      dynasty: 125
    },
    expertRanks: {
      Andy : { halfPpr: 125, ppr: 127, dynasty: 125 },
      Mike : { halfPpr: 125, ppr: 127, dynasty: 125 },
      Jason : { halfPpr: 125, ppr: 127, dynasty: 125 },
    }
  },
  {
    rank: 126,
    espnId: 4373678,
    name: "Khalil Shakir",
    position: "WR",
    team: "BUF",
    bye: 7,
    adp: 131,
    posRank: "WR50",
    projectedPoints: 191,
    draftedBy: null,
    ranks: {
      halfPpr: 126,
      ppr: 124,
      dynasty: 126
    },
    expertRanks: {
      Andy : { halfPpr: 124, ppr: 122, dynasty: 124 },
      Mike : { halfPpr: 126, ppr: 124, dynasty: 126 },
      Jason : { halfPpr: 126, ppr: 124, dynasty: 126 },
    }
  },
  {
    rank: 127,
    espnId: 4242512,
    name: "Malik Willis",
    position: "QB",
    team: "MIA",
    bye: 6,
    adp: 121.9,
    posRank: "QB21",
    projectedPoints: 255,
    draftedBy: null,
    ranks: {
      halfPpr: 127,
      ppr: 127,
      dynasty: 127
    },
    expertRanks: {
      Andy : { halfPpr: 127, ppr: 127, dynasty: 127 },
      Mike : { halfPpr: 127, ppr: 127, dynasty: 127 },
      Jason : { halfPpr: 127, ppr: 127, dynasty: 127 },
    }
  },
  {
    rank: 128,
    espnId: 4426385,
    name: "Zach Charbonnet",
    position: "RB",
    team: "SEA",
    bye: 11,
    adp: 120.3,
    posRank: "RB42",
    projectedPoints: 189,
    draftedBy: null,
    ranks: {
      halfPpr: 128,
      ppr: 130,
      dynasty: 128
    },
    expertRanks: {
      Andy : { halfPpr: 128, ppr: 130, dynasty: 128 },
      Mike : { halfPpr: 128, ppr: 130, dynasty: 128 },
      Jason : { halfPpr: 128, ppr: 130, dynasty: 128 },
    }
  },
  {
    rank: 129,
    espnId: 4683062,
    name: "Xavier Worthy",
    position: "WR",
    team: "KC",
    bye: 5,
    adp: 126.4,
    posRank: "WR51",
    projectedPoints: 188,
    draftedBy: null,
    ranks: {
      halfPpr: 129,
      ppr: 127,
      dynasty: 104
    },
    expertRanks: {
      Andy : { halfPpr: 127, ppr: 125, dynasty: 102 },
      Mike : { halfPpr: 129, ppr: 127, dynasty: 104 },
      Jason : { halfPpr: 129, ppr: 127, dynasty: 104 },
    }
  },
  {
    rank: 130,
    espnId: 4360516,
    name: "Tyrone Tracy Jr.",
    position: "RB",
    team: "NYG",
    bye: 8,
    adp: 132.6,
    posRank: "RB43",
    projectedPoints: 187,
    draftedBy: null,
    ranks: {
      halfPpr: 130,
      ppr: 132,
      dynasty: 130
    },
    expertRanks: {
      Andy : { halfPpr: 130, ppr: 132, dynasty: 130 },
      Mike : { halfPpr: 130, ppr: 132, dynasty: 130 },
      Jason : { halfPpr: 130, ppr: 132, dynasty: 130 },
    }
  },
  {
    rank: 131,
    espnId: 4429059,
    name: "Woody Marks",
    position: "RB",
    team: "HOU",
    bye: 8,
    adp: 123.1,
    posRank: "RB44",
    projectedPoints: 186,
    draftedBy: null,
    ranks: {
      halfPpr: 131,
      ppr: 133,
      dynasty: 131
    },
    expertRanks: {
      Andy : { halfPpr: 131, ppr: 133, dynasty: 131 },
      Mike : { halfPpr: 131, ppr: 133, dynasty: 131 },
      Jason : { halfPpr: 131, ppr: 133, dynasty: 131 },
    }
  },
  {
    rank: 132,
    espnId: 4361432,
    name: "Romeo Doubs",
    position: "WR",
    team: "NE",
    bye: 11,
    adp: 126.7,
    posRank: "WR52",
    projectedPoints: 185,
    draftedBy: null,
    ranks: {
      halfPpr: 132,
      ppr: 130,
      dynasty: 132
    },
    expertRanks: {
      Andy : { halfPpr: 130, ppr: 128, dynasty: 130 },
      Mike : { halfPpr: 132, ppr: 130, dynasty: 132 },
      Jason : { halfPpr: 132, ppr: 130, dynasty: 132 },
    }
  },
  {
    rank: 133,
    espnId: 4870653,
    name: "KC Concepcion",
    position: "WR",
    team: "CLE",
    bye: 11,
    adp: 127.7,
    posRank: "WR53",
    projectedPoints: 184,
    draftedBy: null,
    ranks: {
      halfPpr: 133,
      ppr: 131,
      dynasty: 133
    },
    expertRanks: {
      Andy : { halfPpr: 131, ppr: 129, dynasty: 131 },
      Mike : { halfPpr: 133, ppr: 131, dynasty: 133 },
      Jason : { halfPpr: 133, ppr: 131, dynasty: 133 },
    }
  },
  {
    rank: 134,
    espnId: 4362619,
    name: "Chris Rodriguez Jr.",
    position: "RB",
    team: "JAX",
    bye: 7,
    adp: 131.3,
    posRank: "RB45",
    projectedPoints: 183,
    draftedBy: null,
    ranks: {
      halfPpr: 134,
      ppr: 136,
      dynasty: 134
    },
    expertRanks: {
      Andy : { halfPpr: 134, ppr: 136, dynasty: 134 },
      Mike : { halfPpr: 134, ppr: 136, dynasty: 134 },
      Jason : { halfPpr: 134, ppr: 136, dynasty: 134 },
    }
  },
  {
    rank: 135,
    espnId: 4695883,
    name: "Jalen Coker",
    position: "WR",
    team: "CAR",
    bye: 5,
    adp: 137.7,
    posRank: "WR54",
    projectedPoints: 182,
    draftedBy: null,
    ranks: {
      halfPpr: 135,
      ppr: 133,
      dynasty: 135
    },
    expertRanks: {
      Andy : { halfPpr: 133, ppr: 131, dynasty: 133 },
      Mike : { halfPpr: 135, ppr: 133, dynasty: 135 },
      Jason : { halfPpr: 135, ppr: 133, dynasty: 135 },
    }
  },
  {
    rank: 136,
    espnId: 3929645,
    name: "Juwan Johnson",
    position: "TE",
    team: "NO",
    bye: 8,
    adp: 141.4,
    posRank: "TE16",
    projectedPoints: 180,
    draftedBy: null,
    ranks: {
      halfPpr: 136,
      ppr: 136,
      dynasty: 136
    },
    expertRanks: {
      Andy : { halfPpr: 136, ppr: 136, dynasty: 136 },
      Mike : { halfPpr: 136, ppr: 136, dynasty: 136 },
      Jason : { halfPpr: 136, ppr: 136, dynasty: 136 },
    }
  },
  {
    rank: 137,
    espnId: 4701936,
    name: "Matthew Golden",
    position: "WR",
    team: "GB",
    bye: 11,
    adp: 137,
    posRank: "WR55",
    projectedPoints: 179,
    draftedBy: null,
    ranks: {
      halfPpr: 137,
      ppr: 135,
      dynasty: 137
    },
    expertRanks: {
      Andy : { halfPpr: 135, ppr: 133, dynasty: 135 },
      Mike : { halfPpr: 137, ppr: 135, dynasty: 137 },
      Jason : { halfPpr: 137, ppr: 135, dynasty: 137 },
    }
  },
  {
    rank: 138,
    espnId: 3116365,
    name: "Mark Andrews",
    position: "TE",
    team: "BAL",
    bye: 13,
    adp: 149,
    posRank: "TE17",
    projectedPoints: 178,
    draftedBy: null,
    ranks: {
      halfPpr: 138,
      ppr: 138,
      dynasty: 138
    },
    expertRanks: {
      Andy : { halfPpr: 138, ppr: 138, dynasty: 138 },
      Mike : { halfPpr: 138, ppr: 138, dynasty: 138 },
      Jason : { halfPpr: 138, ppr: 138, dynasty: 138 },
    }
  },
  {
    rank: 139,
    espnId: 4432577,
    name: "C.J. Stroud",
    position: "QB",
    team: "HOU",
    bye: 8,
    adp: 144.6,
    posRank: "QB22",
    projectedPoints: 242,
    draftedBy: null,
    ranks: {
      halfPpr: 139,
      ppr: 139,
      dynasty: 139
    },
    expertRanks: {
      Andy : { halfPpr: 139, ppr: 139, dynasty: 139 },
      Mike : { halfPpr: 139, ppr: 139, dynasty: 139 },
      Jason : { halfPpr: 139, ppr: 139, dynasty: 139 },
    }
  },
  {
    rank: 140,
    espnId: 4428557,
    name: "Tyjae Spears",
    position: "RB",
    team: "TEN",
    bye: 9,
    adp: 134.4,
    posRank: "RB46",
    projectedPoints: 176,
    draftedBy: null,
    ranks: {
      halfPpr: 140,
      ppr: 142,
      dynasty: 140
    },
    expertRanks: {
      Andy : { halfPpr: 140, ppr: 142, dynasty: 140 },
      Mike : { halfPpr: 140, ppr: 142, dynasty: 140 },
      Jason : { halfPpr: 140, ppr: 142, dynasty: 140 },
    }
  },
  {
    rank: 141,
    espnId: 3912547,
    name: "Sam Darnold",
    position: "QB",
    team: "SEA",
    bye: 11,
    adp: 138.2,
    posRank: "QB23",
    projectedPoints: 240,
    draftedBy: null,
    ranks: {
      halfPpr: 141,
      ppr: 141,
      dynasty: 141
    },
    expertRanks: {
      Andy : { halfPpr: 141, ppr: 141, dynasty: 141 },
      Mike : { halfPpr: 141, ppr: 141, dynasty: 141 },
      Jason : { halfPpr: 141, ppr: 141, dynasty: 141 },
    }
  },
  {
    rank: 142,
    espnId: 4678008,
    name: "Jonathon Brooks",
    position: "RB",
    team: "CAR",
    bye: 5,
    adp: 142,
    posRank: "RB47",
    projectedPoints: 174,
    draftedBy: null,
    ranks: {
      halfPpr: 142,
      ppr: 144,
      dynasty: 117
    },
    expertRanks: {
      Andy : { halfPpr: 142, ppr: 144, dynasty: 117 },
      Mike : { halfPpr: 142, ppr: 144, dynasty: 117 },
      Jason : { halfPpr: 142, ppr: 144, dynasty: 117 },
    }
  },
  {
    rank: 143,
    espnId: 4430539,
    name: "Brenton Strange",
    position: "TE",
    team: "JAX",
    bye: 7,
    adp: 154.4,
    posRank: "TE18",
    projectedPoints: 173,
    draftedBy: null,
    ranks: {
      halfPpr: 143,
      ppr: 143,
      dynasty: 143
    },
    expertRanks: {
      Andy : { halfPpr: 143, ppr: 143, dynasty: 143 },
      Mike : { halfPpr: 143, ppr: 143, dynasty: 143 },
      Jason : { halfPpr: 143, ppr: 143, dynasty: 143 },
    }
  },
  {
    rank: 144,
    espnId: 4361529,
    name: "Isiah Pacheco",
    position: "RB",
    team: "DET",
    bye: 6,
    adp: 138.2,
    posRank: "RB48",
    projectedPoints: 172,
    draftedBy: null,
    ranks: {
      halfPpr: 144,
      ppr: 146,
      dynasty: 144
    },
    expertRanks: {
      Andy : { halfPpr: 144, ppr: 146, dynasty: 144 },
      Mike : { halfPpr: 144, ppr: 146, dynasty: 144 },
      Jason : { halfPpr: 144, ppr: 146, dynasty: 144 },
    }
  },
  {
    rank: 145,
    espnId: 5081397,
    name: "Dylan Sampson",
    position: "RB",
    team: "CLE",
    bye: 11,
    adp: 145,
    posRank: "RB49",
    projectedPoints: 170,
    draftedBy: null,
    ranks: {
      halfPpr: 145,
      ppr: 147,
      dynasty: 145
    },
    expertRanks: {
      Andy : { halfPpr: 145, ppr: 147, dynasty: 145 },
      Mike : { halfPpr: 145, ppr: 147, dynasty: 145 },
      Jason : { halfPpr: 145, ppr: 147, dynasty: 145 },
    }
  },
  {
    rank: 146,
    espnId: 3054850,
    name: "Alvin Kamara",
    position: "RB",
    team: "NO",
    bye: 8,
    adp: 140.2,
    posRank: "RB50",
    projectedPoints: 169,
    draftedBy: null,
    ranks: {
      halfPpr: 146,
      ppr: 148,
      dynasty: 146
    },
    expertRanks: {
      Andy : { halfPpr: 146, ppr: 148, dynasty: 146 },
      Mike : { halfPpr: 146, ppr: 148, dynasty: 146 },
      Jason : { halfPpr: 146, ppr: 148, dynasty: 146 },
    }
  },
  {
    rank: 147,
    espnId: 3046439,
    name: "Hunter Henry",
    position: "TE",
    team: "NE",
    bye: 11,
    adp: 138.2,
    posRank: "TE19",
    projectedPoints: 168,
    draftedBy: null,
    ranks: {
      halfPpr: 147,
      ppr: 147,
      dynasty: 147
    },
    expertRanks: {
      Andy : { halfPpr: 147, ppr: 147, dynasty: 147 },
      Mike : { halfPpr: 147, ppr: 147, dynasty: 147 },
      Jason : { halfPpr: 147, ppr: 147, dynasty: 147 },
    }
  },
  {
    rank: 148,
    espnId: 4702555,
    name: "Jonah Coleman",
    position: "RB",
    team: "DEN",
    bye: 10,
    adp: 156.9,
    posRank: "RB51",
    projectedPoints: 167,
    draftedBy: null,
    ranks: {
      halfPpr: 148,
      ppr: 150,
      dynasty: 148
    },
    expertRanks: {
      Andy : { halfPpr: 148, ppr: 150, dynasty: 148 },
      Mike : { halfPpr: 148, ppr: 150, dynasty: 148 },
      Jason : { halfPpr: 148, ppr: 150, dynasty: 148 },
    }
  },
  {
    rank: 149,
    espnId: 4596334,
    name: "Keaton Mitchell",
    position: "RB",
    team: "LAC",
    bye: 7,
    adp: 143,
    posRank: "RB52",
    projectedPoints: 166,
    draftedBy: null,
    ranks: {
      halfPpr: 149,
      ppr: 151,
      dynasty: 149
    },
    expertRanks: {
      Andy : { halfPpr: 149, ppr: 151, dynasty: 149 },
      Mike : { halfPpr: 149, ppr: 151, dynasty: 149 },
      Jason : { halfPpr: 149, ppr: 151, dynasty: 149 },
    }
  },
  {
    rank: 150,
    espnId: 4032473,
    name: "Rashid Shaheed",
    position: "WR",
    team: "SEA",
    bye: 11,
    adp: 144,
    posRank: "WR56",
    projectedPoints: 165,
    draftedBy: null,
    ranks: {
      halfPpr: 150,
      ppr: 148,
      dynasty: 150
    },
    expertRanks: {
      Andy : { halfPpr: 148, ppr: 146, dynasty: 148 },
      Mike : { halfPpr: 150, ppr: 148, dynasty: 150 },
      Jason : { halfPpr: 150, ppr: 148, dynasty: 150 },
    }
  },
  {
    rank: 151,
    espnId: 4685720,
    name: "Bryce Young",
    position: "QB",
    team: "CAR",
    bye: 5,
    adp: 142,
    posRank: "QB24",
    projectedPoints: 229,
    draftedBy: null,
    ranks: {
      halfPpr: 151,
      ppr: 151,
      dynasty: 151
    },
    expertRanks: {
      Andy : { halfPpr: 151, ppr: 151, dynasty: 151 },
      Mike : { halfPpr: 151, ppr: 151, dynasty: 151 },
      Jason : { halfPpr: 151, ppr: 151, dynasty: 151 },
    }
  },
  {
    rank: 152,
    espnId: 3045147,
    name: "James Conner",
    position: "RB",
    team: "ARI",
    bye: 14,
    adp: 161,
    posRank: "RB53",
    projectedPoints: 163,
    draftedBy: null,
    ranks: {
      halfPpr: 152,
      ppr: 154,
      dynasty: 152
    },
    expertRanks: {
      Andy : { halfPpr: 152, ppr: 154, dynasty: 152 },
      Mike : { halfPpr: 152, ppr: 154, dynasty: 152 },
      Jason : { halfPpr: 152, ppr: 154, dynasty: 152 },
    }
  },
  {
    rank: 153,
    espnId: 4685247,
    name: "Braelon Allen",
    position: "RB",
    team: "NYJ",
    bye: 13,
    adp: 162,
    posRank: "RB54",
    projectedPoints: 162,
    draftedBy: null,
    ranks: {
      halfPpr: 153,
      ppr: 155,
      dynasty: 153
    },
    expertRanks: {
      Andy : { halfPpr: 153, ppr: 155, dynasty: 153 },
      Mike : { halfPpr: 153, ppr: 155, dynasty: 153 },
      Jason : { halfPpr: 153, ppr: 155, dynasty: 153 },
    }
  },
  {
    rank: 154,
    espnId: 4241474,
    name: "Brian Robinson Jr.",
    position: "RB",
    team: "ATL",
    bye: 11,
    adp: 151,
    posRank: "RB55",
    projectedPoints: 161,
    draftedBy: null,
    ranks: {
      halfPpr: 154,
      ppr: 156,
      dynasty: 154
    },
    expertRanks: {
      Andy : { halfPpr: 154, ppr: 156, dynasty: 154 },
      Mike : { halfPpr: 154, ppr: 156, dynasty: 154 },
      Jason : { halfPpr: 154, ppr: 156, dynasty: 154 },
    }
  },
  {
    rank: 155,
    espnId: 4832800,
    name: "Denzel Boston",
    position: "WR",
    team: "CLE",
    bye: 11,
    adp: 149,
    posRank: "WR57",
    projectedPoints: 160,
    draftedBy: null,
    ranks: {
      halfPpr: 155,
      ppr: 153,
      dynasty: 155
    },
    expertRanks: {
      Andy : { halfPpr: 153, ppr: 151, dynasty: 153 },
      Mike : { halfPpr: 155, ppr: 153, dynasty: 155 },
      Jason : { halfPpr: 155, ppr: 153, dynasty: 155 },
    }
  },
  {
    rank: 156,
    espnId: 4723820,
    name: "Omar Cooper Jr.",
    position: "WR",
    team: "NYJ",
    bye: 13,
    adp: 168,
    posRank: "WR58",
    projectedPoints: 158,
    draftedBy: null,
    ranks: {
      halfPpr: 156,
      ppr: 154,
      dynasty: 156
    },
    expertRanks: {
      Andy : { halfPpr: 154, ppr: 152, dynasty: 154 },
      Mike : { halfPpr: 156, ppr: 154, dynasty: 156 },
      Jason : { halfPpr: 156, ppr: 154, dynasty: 156 },
    }
  },
  {
    rank: 157,
    espnId: 4429013,
    name: "Tank Bigsby",
    position: "RB",
    team: "PHI",
    bye: 10,
    adp: 154,
    posRank: "RB56",
    projectedPoints: 157,
    draftedBy: null,
    ranks: {
      halfPpr: 157,
      ppr: 159,
      dynasty: 157
    },
    expertRanks: {
      Andy : { halfPpr: 157, ppr: 159, dynasty: 157 },
      Mike : { halfPpr: 157, ppr: 159, dynasty: 157 },
      Jason : { halfPpr: 157, ppr: 159, dynasty: 157 },
    }
  },
  {
    rank: 158,
    espnId: 4685415,
    name: "Travis Hunter",
    position: "WR",
    team: "JAX",
    bye: 7,
    adp: 170,
    posRank: "WR59",
    projectedPoints: 156,
    draftedBy: null,
    ranks: {
      halfPpr: 158,
      ppr: 156,
      dynasty: 158
    },
    expertRanks: {
      Andy : { halfPpr: 156, ppr: 154, dynasty: 156 },
      Mike : { halfPpr: 158, ppr: 156, dynasty: 158 },
      Jason : { halfPpr: 158, ppr: 156, dynasty: 158 },
    }
  },
  {
    rank: 159,
    espnId: 4241463,
    name: "Jerry Jeudy",
    position: "WR",
    team: "CLE",
    bye: 11,
    adp: 168,
    posRank: "WR60",
    projectedPoints: 155,
    draftedBy: null,
    ranks: {
      halfPpr: 159,
      ppr: 157,
      dynasty: 159
    },
    expertRanks: {
      Andy : { halfPpr: 157, ppr: 155, dynasty: 157 },
      Mike : { halfPpr: 159, ppr: 157, dynasty: 159 },
      Jason : { halfPpr: 159, ppr: 157, dynasty: 159 },
    }
  },
  {
    rank: 160,
    espnId: 4688380,
    name: "Cam Ward",
    position: "QB",
    team: "TEN",
    bye: 9,
    adp: 151,
    posRank: "QB25",
    projectedPoints: 219,
    draftedBy: null,
    ranks: {
      halfPpr: 160,
      ppr: 160,
      dynasty: 160
    },
    expertRanks: {
      Andy : { halfPpr: 160, ppr: 160, dynasty: 160 },
      Mike : { halfPpr: 160, ppr: 160, dynasty: 160 },
      Jason : { halfPpr: 160, ppr: 160, dynasty: 160 },
    }
  },
  {
    rank: 161,
    espnId: 4887558,
    name: "Emanuel Wilson",
    position: "RB",
    team: "SEA",
    bye: 11,
    adp: 155,
    posRank: "RB57",
    projectedPoints: 153,
    draftedBy: null,
    ranks: {
      halfPpr: 161,
      ppr: 163,
      dynasty: 161
    },
    expertRanks: {
      Andy : { halfPpr: 161, ppr: 163, dynasty: 161 },
      Mike : { halfPpr: 161, ppr: 163, dynasty: 161 },
      Jason : { halfPpr: 161, ppr: 163, dynasty: 161 },
    }
  },
  {
    rank: 162,
    espnId: 3886598,
    name: "Jauan Jennings",
    position: "WR",
    team: "MIN",
    bye: 6,
    adp: 165,
    posRank: "WR61",
    projectedPoints: 152,
    draftedBy: null,
    ranks: {
      halfPpr: 162,
      ppr: 160,
      dynasty: 162
    },
    expertRanks: {
      Andy : { halfPpr: 160, ppr: 158, dynasty: 160 },
      Mike : { halfPpr: 162, ppr: 160, dynasty: 162 },
      Jason : { halfPpr: 162, ppr: 160, dynasty: 162 },
    }
  },
  {
    rank: 163,
    espnId: 4360438,
    name: "Brandon Aiyuk",
    position: "WR",
    team: "SF",
    bye: 8,
    adp: 163,
    posRank: "WR62",
    projectedPoints: 151,
    draftedBy: null,
    ranks: {
      halfPpr: 163,
      ppr: 161,
      dynasty: 163
    },
    expertRanks: {
      Andy : { halfPpr: 161, ppr: 159, dynasty: 161 },
      Mike : { halfPpr: 163, ppr: 161, dynasty: 163 },
      Jason : { halfPpr: 163, ppr: 161, dynasty: 163 },
    }
  },
  {
    rank: 164,
    espnId: 2976212,
    name: "Stefon Diggs",
    position: "WR",
    team: "FA",
    bye: 0,
    adp: 170,
    posRank: "WR63",
    projectedPoints: 150,
    draftedBy: null,
    ranks: {
      halfPpr: 164,
      ppr: 162,
      dynasty: 209
    },
    expertRanks: {
      Andy : { halfPpr: 162, ppr: 160, dynasty: 207 },
      Mike : { halfPpr: 164, ppr: 162, dynasty: 209 },
      Jason : { halfPpr: 164, ppr: 162, dynasty: 209 },
    }
  },
  {
    rank: 165,
    espnId: 4832955,
    name: "Emmett Johnson",
    position: "RB",
    team: "KC",
    bye: 5,
    adp: 156,
    posRank: "RB58",
    projectedPoints: 148,
    draftedBy: null,
    ranks: {
      halfPpr: 165,
      ppr: 167,
      dynasty: 165
    },
    expertRanks: {
      Andy : { halfPpr: 165, ppr: 167, dynasty: 165 },
      Mike : { halfPpr: 165, ppr: 167, dynasty: 165 },
      Jason : { halfPpr: 165, ppr: 167, dynasty: 165 },
    }
  },
  {
    rank: 166,
    espnId: 4686658,
    name: "Mike Washington Jr.",
    position: "RB",
    team: "LV",
    bye: 13,
    adp: 154,
    posRank: "RB59",
    projectedPoints: 147,
    draftedBy: null,
    ranks: {
      halfPpr: 166,
      ppr: 168,
      dynasty: 166
    },
    expertRanks: {
      Andy : { halfPpr: 166, ppr: 168, dynasty: 166 },
      Mike : { halfPpr: 166, ppr: 168, dynasty: 166 },
      Jason : { halfPpr: 166, ppr: 168, dynasty: 166 },
    }
  },
  {
    rank: 167,
    espnId: 4430834,
    name: "Jalen McMillan",
    position: "WR",
    team: "TB",
    bye: 10,
    adp: 176,
    posRank: "WR64",
    projectedPoints: 146,
    draftedBy: null,
    ranks: {
      halfPpr: 167,
      ppr: 165,
      dynasty: 167
    },
    expertRanks: {
      Andy : { halfPpr: 165, ppr: 163, dynasty: 165 },
      Mike : { halfPpr: 167, ppr: 165, dynasty: 167 },
      Jason : { halfPpr: 167, ppr: 165, dynasty: 167 },
    }
  },
  {
    rank: 168,
    espnId: 4429022,
    name: "Kayshon Boutte",
    position: "WR",
    team: "NE",
    bye: 11,
    adp: 174,
    posRank: "WR65",
    projectedPoints: 145,
    draftedBy: null,
    ranks: {
      halfPpr: 168,
      ppr: 166,
      dynasty: 168
    },
    expertRanks: {
      Andy : { halfPpr: 166, ppr: 164, dynasty: 166 },
      Mike : { halfPpr: 168, ppr: 166, dynasty: 168 },
      Jason : { halfPpr: 168, ppr: 166, dynasty: 168 },
    }
  },
  {
    rank: 169,
    espnId: 3126486,
    name: "Deebo Samuel Sr.",
    position: "WR",
    team: "FA",
    bye: 0,
    adp: 175,
    posRank: "WR66",
    projectedPoints: 144,
    draftedBy: null,
    ranks: {
      halfPpr: 169,
      ppr: 167,
      dynasty: 169
    },
    expertRanks: {
      Andy : { halfPpr: 167, ppr: 165, dynasty: 167 },
      Mike : { halfPpr: 169, ppr: 167, dynasty: 169 },
      Jason : { halfPpr: 169, ppr: 167, dynasty: 169 },
    }
  },
  {
    rank: 170,
    espnId: 4597500,
    name: "Adonai Mitchell",
    position: "WR",
    team: "NYJ",
    bye: 13,
    adp: 179,
    posRank: "WR67",
    projectedPoints: 143,
    draftedBy: null,
    ranks: {
      halfPpr: 170,
      ppr: 168,
      dynasty: 170
    },
    expertRanks: {
      Andy : { halfPpr: 168, ppr: 166, dynasty: 168 },
      Mike : { halfPpr: 170, ppr: 168, dynasty: 170 },
      Jason : { halfPpr: 170, ppr: 168, dynasty: 170 },
    }
  },
  {
    rank: 171,
    espnId: 3117256,
    name: "Dalton Schultz",
    position: "TE",
    team: "HOU",
    bye: 8,
    adp: 174,
    posRank: "TE20",
    projectedPoints: 142,
    draftedBy: null,
    ranks: {
      halfPpr: 171,
      ppr: 171,
      dynasty: 171
    },
    expertRanks: {
      Andy : { halfPpr: 171, ppr: 171, dynasty: 171 },
      Mike : { halfPpr: 171, ppr: 171, dynasty: 171 },
      Jason : { halfPpr: 171, ppr: 171, dynasty: 171 },
    }
  },
  {
    rank: 172,
    espnId: 3917792,
    name: "Daniel Jones",
    position: "QB",
    team: "IND",
    bye: 13,
    adp: 181,
    posRank: "QB26",
    projectedPoints: 206,
    draftedBy: null,
    ranks: {
      halfPpr: 172,
      ppr: 172,
      dynasty: 172
    },
    expertRanks: {
      Andy : { halfPpr: 172, ppr: 172, dynasty: 172 },
      Mike : { halfPpr: 172, ppr: 172, dynasty: 172 },
      Jason : { halfPpr: 172, ppr: 172, dynasty: 172 },
    }
  },
  {
    rank: 173,
    espnId: 4360635,
    name: "Chig Okonkwo",
    position: "TE",
    team: "WAS",
    bye: 7,
    adp: 170,
    posRank: "TE21",
    projectedPoints: 140,
    draftedBy: null,
    ranks: {
      halfPpr: 173,
      ppr: 173,
      dynasty: 173
    },
    expertRanks: {
      Andy : { halfPpr: 173, ppr: 173, dynasty: 173 },
      Mike : { halfPpr: 173, ppr: 173, dynasty: 173 },
      Jason : { halfPpr: 173, ppr: 173, dynasty: 173 },
    }
  },
  {
    rank: 174,
    espnId: 5081432,
    name: "Antonio Williams",
    position: "WR",
    team: "WAS",
    bye: 7,
    adp: 165,
    posRank: "WR68",
    projectedPoints: 139,
    draftedBy: null,
    ranks: {
      halfPpr: 174,
      ppr: 172,
      dynasty: 174
    },
    expertRanks: {
      Andy : { halfPpr: 172, ppr: 170, dynasty: 172 },
      Mike : { halfPpr: 174, ppr: 172, dynasty: 174 },
      Jason : { halfPpr: 174, ppr: 172, dynasty: 174 },
    }
  },
  {
    rank: 175,
    espnId: 5083315,
    name: "Kenyon Sadiq",
    position: "TE",
    team: "NYJ",
    bye: 13,
    adp: 181,
    posRank: "TE22",
    projectedPoints: 137,
    draftedBy: null,
    ranks: {
      halfPpr: 175,
      ppr: 175,
      dynasty: 175
    },
    expertRanks: {
      Andy : { halfPpr: 175, ppr: 175, dynasty: 175 },
      Mike : { halfPpr: 175, ppr: 175, dynasty: 175 },
      Jason : { halfPpr: 175, ppr: 175, dynasty: 175 },
    }
  },
  {
    rank: 176,
    espnId: 4685555,
    name: "Nicholas Singleton",
    position: "RB",
    team: "TEN",
    bye: 9,
    adp: 179,
    posRank: "RB60",
    projectedPoints: 136,
    draftedBy: null,
    ranks: {
      halfPpr: 176,
      ppr: 178,
      dynasty: 176
    },
    expertRanks: {
      Andy : { halfPpr: 176, ppr: 178, dynasty: 176 },
      Mike : { halfPpr: 176, ppr: 178, dynasty: 176 },
      Jason : { halfPpr: 176, ppr: 178, dynasty: 176 },
    }
  },
  {
    rank: 177,
    espnId: null,
    name: "Houston Texans",
    position: "DST",
    team: "HOU",
    bye: 8,
    adp: 186,
    posRank: "DST1",
    projectedPoints: 135,
    draftedBy: null,
    ranks: {
      halfPpr: 177,
      ppr: 177,
      dynasty: 177
    },
    expertRanks: {
      Andy : { halfPpr: 177, ppr: 177, dynasty: 177 },
      Mike : { halfPpr: 177, ppr: 177, dynasty: 177 },
      Jason : { halfPpr: 177, ppr: 177, dynasty: 177 },
    }
  },
  {
    rank: 178,
    espnId: 4685246,
    name: "Kaytron Allen",
    position: "RB",
    team: "WAS",
    bye: 7,
    adp: 190,
    posRank: "RB61",
    projectedPoints: 134,
    draftedBy: null,
    ranks: {
      halfPpr: 178,
      ppr: 180,
      dynasty: 178
    },
    expertRanks: {
      Andy : { halfPpr: 178, ppr: 180, dynasty: 178 },
      Mike : { halfPpr: 178, ppr: 180, dynasty: 178 },
      Jason : { halfPpr: 178, ppr: 180, dynasty: 178 },
    }
  },
  {
    rank: 179,
    espnId: 4430968,
    name: "Kimani Vidal",
    position: "RB",
    team: "LAC",
    bye: 7,
    adp: 179,
    posRank: "RB62",
    projectedPoints: 133,
    draftedBy: null,
    ranks: {
      halfPpr: 179,
      ppr: 181,
      dynasty: 179
    },
    expertRanks: {
      Andy : { halfPpr: 179, ppr: 181, dynasty: 179 },
      Mike : { halfPpr: 179, ppr: 181, dynasty: 179 },
      Jason : { halfPpr: 179, ppr: 181, dynasty: 179 },
    }
  },
  {
    rank: 180,
    espnId: null,
    name: "Denver Broncos",
    position: "DST",
    team: "DEN",
    bye: 10,
    adp: 174,
    posRank: "DST2",
    projectedPoints: 132,
    draftedBy: null,
    ranks: {
      halfPpr: 180,
      ppr: 180,
      dynasty: 180
    },
    expertRanks: {
      Andy : { halfPpr: 180, ppr: 180, dynasty: 180 },
      Mike : { halfPpr: 180, ppr: 180, dynasty: 180 },
      Jason : { halfPpr: 180, ppr: 180, dynasty: 180 },
    }
  },
  {
    rank: 181,
    espnId: 4036133,
    name: "T.J. Hockenson",
    position: "TE",
    team: "MIN",
    bye: 6,
    adp: 178,
    posRank: "TE23",
    projectedPoints: 131,
    draftedBy: null,
    ranks: {
      halfPpr: 181,
      ppr: 181,
      dynasty: 181
    },
    expertRanks: {
      Andy : { halfPpr: 181, ppr: 181, dynasty: 181 },
      Mike : { halfPpr: 181, ppr: 181, dynasty: 181 },
      Jason : { halfPpr: 181, ppr: 181, dynasty: 181 },
    }
  },
  {
    rank: 182,
    espnId: 4576297,
    name: "AJ Barner",
    position: "TE",
    team: "SEA",
    bye: 11,
    adp: 194,
    posRank: "TE24",
    projectedPoints: 130,
    draftedBy: null,
    ranks: {
      halfPpr: 182,
      ppr: 182,
      dynasty: 182
    },
    expertRanks: {
      Andy : { halfPpr: 182, ppr: 182, dynasty: 182 },
      Mike : { halfPpr: 182, ppr: 182, dynasty: 182 },
      Jason : { halfPpr: 182, ppr: 182, dynasty: 182 },
    }
  },
  {
    rank: 183,
    espnId: 4431280,
    name: "Troy Franklin",
    position: "WR",
    team: "DEN",
    bye: 10,
    adp: 186,
    posRank: "WR69",
    projectedPoints: 129,
    draftedBy: null,
    ranks: {
      halfPpr: 183,
      ppr: 181,
      dynasty: 183
    },
    expertRanks: {
      Andy : { halfPpr: 181, ppr: 179, dynasty: 181 },
      Mike : { halfPpr: 183, ppr: 181, dynasty: 183 },
      Jason : { halfPpr: 183, ppr: 181, dynasty: 183 },
    }
  },
  {
    rank: 184,
    espnId: null,
    name: "Seattle Seahawks",
    position: "DST",
    team: "SEA",
    bye: 11,
    adp: 178,
    posRank: "DST3",
    projectedPoints: 128,
    draftedBy: null,
    ranks: {
      halfPpr: 184,
      ppr: 184,
      dynasty: 184
    },
    expertRanks: {
      Andy : { halfPpr: 184, ppr: 184, dynasty: 184 },
      Mike : { halfPpr: 184, ppr: 184, dynasty: 184 },
      Jason : { halfPpr: 184, ppr: 184, dynasty: 184 },
    }
  },
  {
    rank: 185,
    espnId: 4686612,
    name: "Tre' Harris",
    position: "WR",
    team: "LAC",
    bye: 7,
    adp: 191,
    posRank: "WR70",
    projectedPoints: 126,
    draftedBy: null,
    ranks: {
      halfPpr: 185,
      ppr: 183,
      dynasty: 185
    },
    expertRanks: {
      Andy : { halfPpr: 183, ppr: 181, dynasty: 183 },
      Mike : { halfPpr: 185, ppr: 183, dynasty: 185 },
      Jason : { halfPpr: 185, ppr: 183, dynasty: 185 },
    }
  },
  {
    rank: 186,
    espnId: 4428718,
    name: "Tre Tucker",
    position: "WR",
    team: "LV",
    bye: 13,
    adp: 198,
    posRank: "WR71",
    projectedPoints: 125,
    draftedBy: null,
    ranks: {
      halfPpr: 186,
      ppr: 184,
      dynasty: 186
    },
    expertRanks: {
      Andy : { halfPpr: 184, ppr: 182, dynasty: 184 },
      Mike : { halfPpr: 186, ppr: 184, dynasty: 186 },
      Jason : { halfPpr: 186, ppr: 184, dynasty: 186 },
    }
  },
  {
    rank: 187,
    espnId: null,
    name: "Los Angeles Rams",
    position: "DST",
    team: "LAR",
    bye: 11,
    adp: 190,
    posRank: "DST4",
    projectedPoints: 124,
    draftedBy: null,
    ranks: {
      halfPpr: 187,
      ppr: 187,
      dynasty: 187
    },
    expertRanks: {
      Andy : { halfPpr: 187, ppr: 187, dynasty: 187 },
      Mike : { halfPpr: 187, ppr: 187, dynasty: 187 },
      Jason : { halfPpr: 187, ppr: 187, dynasty: 187 },
    }
  },
  {
    rank: 188,
    espnId: 4429501,
    name: "Ray Davis",
    position: "RB",
    team: "BUF",
    bye: 7,
    adp: 197,
    posRank: "RB63",
    projectedPoints: 123,
    draftedBy: null,
    ranks: {
      halfPpr: 188,
      ppr: 190,
      dynasty: 188
    },
    expertRanks: {
      Andy : { halfPpr: 188, ppr: 190, dynasty: 188 },
      Mike : { halfPpr: 188, ppr: 190, dynasty: 188 },
      Jason : { halfPpr: 188, ppr: 190, dynasty: 188 },
    }
  },
  {
    rank: 189,
    espnId: 4430871,
    name: "Sean Tucker",
    position: "RB",
    team: "TB",
    bye: 10,
    adp: 180,
    posRank: "RB64",
    projectedPoints: 122,
    draftedBy: null,
    ranks: {
      halfPpr: 189,
      ppr: 191,
      dynasty: 189
    },
    expertRanks: {
      Andy : { halfPpr: 189, ppr: 191, dynasty: 189 },
      Mike : { halfPpr: 189, ppr: 191, dynasty: 189 },
      Jason : { halfPpr: 189, ppr: 191, dynasty: 189 },
    }
  },
  {
    rank: 190,
    espnId: 2578570,
    name: "Jacoby Brissett",
    position: "QB",
    team: "ARI",
    bye: 14,
    adp: 190,
    posRank: "QB27",
    projectedPoints: 186,
    draftedBy: null,
    ranks: {
      halfPpr: 190,
      ppr: 190,
      dynasty: 190
    },
    expertRanks: {
      Andy : { halfPpr: 190, ppr: 190, dynasty: 190 },
      Mike : { halfPpr: 190, ppr: 190, dynasty: 190 },
      Jason : { halfPpr: 190, ppr: 190, dynasty: 190 },
    }
  },
  {
    rank: 191,
    espnId: null,
    name: "Philadelphia Eagles",
    position: "DST",
    team: "PHI",
    bye: 10,
    adp: 182,
    posRank: "DST5",
    projectedPoints: 120,
    draftedBy: null,
    ranks: {
      halfPpr: 191,
      ppr: 191,
      dynasty: 191
    },
    expertRanks: {
      Andy : { halfPpr: 191, ppr: 191, dynasty: 191 },
      Mike : { halfPpr: 191, ppr: 191, dynasty: 191 },
      Jason : { halfPpr: 191, ppr: 191, dynasty: 191 },
    }
  },
  {
    rank: 192,
    espnId: 3116406,
    name: "Tyreek Hill",
    position: "WR",
    team: "FA",
    bye: 0,
    adp: 180,
    posRank: "WR72",
    projectedPoints: 119,
    draftedBy: null,
    ranks: {
      halfPpr: 192,
      ppr: 190,
      dynasty: 237
    },
    expertRanks: {
      Andy : { halfPpr: 190, ppr: 188, dynasty: 235 },
      Mike : { halfPpr: 192, ppr: 190, dynasty: 237 },
      Jason : { halfPpr: 192, ppr: 190, dynasty: 237 },
    }
  },
  {
    rank: 193,
    espnId: 4682745,
    name: "Jaylen Wright",
    position: "RB",
    team: "MIA",
    bye: 6,
    adp: 190,
    posRank: "RB65",
    projectedPoints: 118,
    draftedBy: null,
    ranks: {
      halfPpr: 193,
      ppr: 195,
      dynasty: 193
    },
    expertRanks: {
      Andy : { halfPpr: 193, ppr: 195, dynasty: 193 },
      Mike : { halfPpr: 193, ppr: 195, dynasty: 193 },
      Jason : { halfPpr: 193, ppr: 195, dynasty: 193 },
    }
  },
  {
    rank: 194,
    espnId: 4586312,
    name: "Jaylin Noel",
    position: "WR",
    team: "HOU",
    bye: 8,
    adp: 185,
    posRank: "WR73",
    projectedPoints: 117,
    draftedBy: null,
    ranks: {
      halfPpr: 194,
      ppr: 192,
      dynasty: 194
    },
    expertRanks: {
      Andy : { halfPpr: 192, ppr: 190, dynasty: 192 },
      Mike : { halfPpr: 194, ppr: 192, dynasty: 194 },
      Jason : { halfPpr: 194, ppr: 192, dynasty: 194 },
    }
  },
  {
    rank: 195,
    espnId: null,
    name: "Jacksonville Jaguars",
    position: "DST",
    team: "JAX",
    bye: 7,
    adp: 195,
    posRank: "DST6",
    projectedPoints: 115,
    draftedBy: null,
    ranks: {
      halfPpr: 195,
      ppr: 195,
      dynasty: 195
    },
    expertRanks: {
      Andy : { halfPpr: 195, ppr: 195, dynasty: 195 },
      Mike : { halfPpr: 195, ppr: 195, dynasty: 195 },
      Jason : { halfPpr: 195, ppr: 195, dynasty: 195 },
    }
  },
  {
    rank: 196,
    espnId: 5123663,
    name: "Isaac TeSlaa",
    position: "WR",
    team: "DET",
    bye: 6,
    adp: 193,
    posRank: "WR74",
    projectedPoints: 114,
    draftedBy: null,
    ranks: {
      halfPpr: 196,
      ppr: 194,
      dynasty: 196
    },
    expertRanks: {
      Andy : { halfPpr: 194, ppr: 192, dynasty: 194 },
      Mike : { halfPpr: 196, ppr: 194, dynasty: 196 },
      Jason : { halfPpr: 196, ppr: 194, dynasty: 196 },
    }
  },
  {
    rank: 197,
    espnId: null,
    name: "Pittsburgh Steelers",
    position: "DST",
    team: "PIT",
    bye: 9,
    adp: 197,
    posRank: "DST7",
    projectedPoints: 113,
    draftedBy: null,
    ranks: {
      halfPpr: 197,
      ppr: 197,
      dynasty: 197
    },
    expertRanks: {
      Andy : { halfPpr: 197, ppr: 197, dynasty: 197 },
      Mike : { halfPpr: 197, ppr: 197, dynasty: 197 },
      Jason : { halfPpr: 197, ppr: 197, dynasty: 197 },
    }
  },
  {
    rank: 198,
    espnId: null,
    name: "New England Patriots",
    position: "DST",
    team: "NE",
    bye: 11,
    adp: 201,
    posRank: "DST8",
    projectedPoints: 112,
    draftedBy: null,
    ranks: {
      halfPpr: 198,
      ppr: 198,
      dynasty: 198
    },
    expertRanks: {
      Andy : { halfPpr: 198, ppr: 198, dynasty: 198 },
      Mike : { halfPpr: 198, ppr: 198, dynasty: 198 },
      Jason : { halfPpr: 198, ppr: 198, dynasty: 198 },
    }
  },
  {
    rank: 199,
    espnId: 3953687,
    name: "Brandon Aubrey",
    position: "K",
    team: "DAL",
    bye: 14,
    adp: 205,
    posRank: "K1",
    projectedPoints: 111,
    draftedBy: null,
    ranks: {
      halfPpr: 199,
      ppr: 199,
      dynasty: 199
    },
    expertRanks: {
      Andy : { halfPpr: 199, ppr: 199, dynasty: 199 },
      Mike : { halfPpr: 199, ppr: 199, dynasty: 199 },
      Jason : { halfPpr: 199, ppr: 199, dynasty: 199 },
    }
  },
  {
    rank: 200,
    espnId: null,
    name: "Minnesota Vikings",
    position: "DST",
    team: "MIN",
    bye: 6,
    adp: 200,
    posRank: "DST9",
    projectedPoints: 110,
    draftedBy: null,
    ranks: {
      halfPpr: 200,
      ppr: 200,
      dynasty: 200
    },
    expertRanks: {
      Andy : { halfPpr: 200, ppr: 200, dynasty: 200 },
      Mike : { halfPpr: 200, ppr: 200, dynasty: 200 },
      Jason : { halfPpr: 200, ppr: 200, dynasty: 200 },
    }
  },
  {
    rank: 201,
    espnId: 2971573,
    name: "Ka'imi Fairbairn",
    position: "K",
    team: "HOU",
    bye: 8,
    adp: 204,
    posRank: "K2",
    projectedPoints: 109,
    draftedBy: null,
    ranks: {
      halfPpr: 201,
      ppr: 201,
      dynasty: 201
    },
    expertRanks: {
      Andy : { halfPpr: 201, ppr: 201, dynasty: 201 },
      Mike : { halfPpr: 201, ppr: 201, dynasty: 201 },
      Jason : { halfPpr: 201, ppr: 201, dynasty: 201 },
    }
  },
  {
    rank: 202,
    espnId: 3925357,
    name: "Calvin Ridley",
    position: "WR",
    team: "TEN",
    bye: 9,
    adp: 199,
    posRank: "WR75",
    projectedPoints: 108,
    draftedBy: null,
    ranks: {
      halfPpr: 202,
      ppr: 200,
      dynasty: 202
    },
    expertRanks: {
      Andy : { halfPpr: 200, ppr: 198, dynasty: 200 },
      Mike : { halfPpr: 202, ppr: 200, dynasty: 202 },
      Jason : { halfPpr: 202, ppr: 200, dynasty: 202 },
    }
  },
  {
    rank: 203,
    espnId: 4570037,
    name: "Terrance Ferguson",
    position: "TE",
    team: "LAR",
    bye: 11,
    adp: 194,
    posRank: "TE25",
    projectedPoints: 107,
    draftedBy: null,
    ranks: {
      halfPpr: 203,
      ppr: 203,
      dynasty: 203
    },
    expertRanks: {
      Andy : { halfPpr: 203, ppr: 203, dynasty: 203 },
      Mike : { halfPpr: 203, ppr: 203, dynasty: 203 },
      Jason : { halfPpr: 203, ppr: 203, dynasty: 203 },
    }
  },
  {
    rank: 204,
    espnId: 4600981,
    name: "Pat Bryant",
    position: "WR",
    team: "DEN",
    bye: 10,
    adp: 204,
    posRank: "WR76",
    projectedPoints: 106,
    draftedBy: null,
    ranks: {
      halfPpr: 204,
      ppr: 202,
      dynasty: 204
    },
    expertRanks: {
      Andy : { halfPpr: 202, ppr: 200, dynasty: 202 },
      Mike : { halfPpr: 204, ppr: 202, dynasty: 204 },
      Jason : { halfPpr: 204, ppr: 202, dynasty: 204 },
    }
  },
  {
    rank: 205,
    espnId: 4832846,
    name: "Demond Claiborne",
    position: "RB",
    team: "MIN",
    bye: 6,
    adp: 202,
    posRank: "RB66",
    projectedPoints: 104,
    draftedBy: null,
    ranks: {
      halfPpr: 205,
      ppr: 207,
      dynasty: 205
    },
    expertRanks: {
      Andy : { halfPpr: 205, ppr: 207, dynasty: 205 },
      Mike : { halfPpr: 205, ppr: 207, dynasty: 205 },
      Jason : { halfPpr: 205, ppr: 207, dynasty: 205 },
    }
  },
  {
    rank: 206,
    espnId: 4362081,
    name: "Cameron Dicker",
    position: "K",
    team: "LAC",
    bye: 7,
    adp: 203,
    posRank: "K3",
    projectedPoints: 103,
    draftedBy: null,
    ranks: {
      halfPpr: 206,
      ppr: 206,
      dynasty: 206
    },
    expertRanks: {
      Andy : { halfPpr: 206, ppr: 206, dynasty: 206 },
      Mike : { halfPpr: 206, ppr: 206, dynasty: 206 },
      Jason : { halfPpr: 206, ppr: 206, dynasty: 206 },
    }
  },
  {
    rank: 207,
    espnId: 4040655,
    name: "Darnell Mooney",
    position: "WR",
    team: "NYG",
    bye: 8,
    adp: 198,
    posRank: "WR77",
    projectedPoints: 102,
    draftedBy: null,
    ranks: {
      halfPpr: 207,
      ppr: 205,
      dynasty: 207
    },
    expertRanks: {
      Andy : { halfPpr: 205, ppr: 203, dynasty: 205 },
      Mike : { halfPpr: 207, ppr: 205, dynasty: 207 },
      Jason : { halfPpr: 207, ppr: 205, dynasty: 207 },
    }
  },
  {
    rank: 208,
    espnId: 4686361,
    name: "Cam Little",
    position: "K",
    team: "JAX",
    bye: 7,
    adp: 196,
    posRank: "K4",
    projectedPoints: 101,
    draftedBy: null,
    ranks: {
      halfPpr: 208,
      ppr: 208,
      dynasty: 208
    },
    expertRanks: {
      Andy : { halfPpr: 208, ppr: 208, dynasty: 208 },
      Mike : { halfPpr: 208, ppr: 208, dynasty: 208 },
      Jason : { halfPpr: 208, ppr: 208, dynasty: 208 },
    }
  },
  {
    rank: 209,
    espnId: null,
    name: "Cleveland Browns",
    position: "DST",
    team: "CLE",
    bye: 11,
    adp: 203,
    posRank: "DST10",
    projectedPoints: 100,
    draftedBy: null,
    ranks: {
      halfPpr: 209,
      ppr: 209,
      dynasty: 209
    },
    expertRanks: {
      Andy : { halfPpr: 209, ppr: 209, dynasty: 209 },
      Mike : { halfPpr: 209, ppr: 209, dynasty: 209 },
      Jason : { halfPpr: 209, ppr: 209, dynasty: 209 },
    }
  },
  {
    rank: 210,
    espnId: 5083754,
    name: "Ryan Flournoy",
    position: "WR",
    team: "DAL",
    bye: 14,
    adp: 222,
    posRank: "WR78",
    projectedPoints: 99,
    draftedBy: null,
    ranks: {
      halfPpr: 210,
      ppr: 208,
      dynasty: 210
    },
    expertRanks: {
      Andy : { halfPpr: 208, ppr: 206, dynasty: 208 },
      Mike : { halfPpr: 210, ppr: 208, dynasty: 210 },
      Jason : { halfPpr: 210, ppr: 208, dynasty: 210 },
    }
  },
  {
    rank: 211,
    espnId: 4431268,
    name: "Chimere Dike",
    position: "WR",
    team: "TEN",
    bye: 9,
    adp: 220,
    posRank: "WR79",
    projectedPoints: 98,
    draftedBy: null,
    ranks: {
      halfPpr: 211,
      ppr: 209,
      dynasty: 211
    },
    expertRanks: {
      Andy : { halfPpr: 209, ppr: 207, dynasty: 209 },
      Mike : { halfPpr: 211, ppr: 209, dynasty: 211 },
      Jason : { halfPpr: 211, ppr: 209, dynasty: 211 },
    }
  },
  {
    rank: 212,
    espnId: null,
    name: "Los Angeles Chargers",
    position: "DST",
    team: "LAC",
    bye: 7,
    adp: 209,
    posRank: "DST11",
    projectedPoints: 97,
    draftedBy: null,
    ranks: {
      halfPpr: 212,
      ppr: 212,
      dynasty: 212
    },
    expertRanks: {
      Andy : { halfPpr: 212, ppr: 212, dynasty: 212 },
      Mike : { halfPpr: 212, ppr: 212, dynasty: 212 },
      Jason : { halfPpr: 212, ppr: 212, dynasty: 212 },
    }
  },
  {
    rank: 213,
    espnId: 2473037,
    name: "Jason Myers",
    position: "K",
    team: "SEA",
    bye: 11,
    adp: 216,
    posRank: "K5",
    projectedPoints: 96,
    draftedBy: null,
    ranks: {
      halfPpr: 213,
      ppr: 213,
      dynasty: 213
    },
    expertRanks: {
      Andy : { halfPpr: 213, ppr: 213, dynasty: 213 },
      Mike : { halfPpr: 213, ppr: 213, dynasty: 213 },
      Jason : { halfPpr: 213, ppr: 213, dynasty: 213 },
    }
  },
  {
    rank: 214,
    espnId: 4686728,
    name: "Gunnar Helm",
    position: "TE",
    team: "TEN",
    bye: 9,
    adp: 220,
    posRank: "TE26",
    projectedPoints: 95,
    draftedBy: null,
    ranks: {
      halfPpr: 214,
      ppr: 214,
      dynasty: 214
    },
    expertRanks: {
      Andy : { halfPpr: 214, ppr: 214, dynasty: 214 },
      Mike : { halfPpr: 214, ppr: 214, dynasty: 214 },
      Jason : { halfPpr: 214, ppr: 214, dynasty: 214 },
    }
  },
  {
    rank: 215,
    espnId: 4869961,
    name: "Chris Bell",
    position: "WR",
    team: "MIA",
    bye: 6,
    adp: 209,
    posRank: "WR80",
    projectedPoints: 93,
    draftedBy: null,
    ranks: {
      halfPpr: 215,
      ppr: 213,
      dynasty: 215
    },
    expertRanks: {
      Andy : { halfPpr: 213, ppr: 211, dynasty: 213 },
      Mike : { halfPpr: 215, ppr: 213, dynasty: 215 },
      Jason : { halfPpr: 215, ppr: 213, dynasty: 215 },
    }
  },
  {
    rank: 216,
    espnId: 4685261,
    name: "Germie Bernard",
    position: "WR",
    team: "PIT",
    bye: 9,
    adp: 213,
    posRank: "WR81",
    projectedPoints: 92,
    draftedBy: null,
    ranks: {
      halfPpr: 216,
      ppr: 214,
      dynasty: 216
    },
    expertRanks: {
      Andy : { halfPpr: 214, ppr: 212, dynasty: 214 },
      Mike : { halfPpr: 216, ppr: 214, dynasty: 216 },
      Jason : { halfPpr: 216, ppr: 214, dynasty: 216 },
    }
  },
  {
    rank: 217,
    espnId: null,
    name: "Green Bay Packers",
    position: "DST",
    team: "GB",
    bye: 11,
    adp: 208,
    posRank: "DST12",
    projectedPoints: 91,
    draftedBy: null,
    ranks: {
      halfPpr: 217,
      ppr: 217,
      dynasty: 217
    },
    expertRanks: {
      Andy : { halfPpr: 217, ppr: 217, dynasty: 217 },
      Mike : { halfPpr: 217, ppr: 217, dynasty: 217 },
      Jason : { halfPpr: 217, ppr: 217, dynasty: 217 },
    }
  },
  {
    rank: 218,
    espnId: 3123076,
    name: "David Njoku",
    position: "TE",
    team: "LAC",
    bye: 7,
    adp: 218,
    posRank: "TE27",
    projectedPoints: 90,
    draftedBy: null,
    ranks: {
      halfPpr: 218,
      ppr: 218,
      dynasty: 218
    },
    expertRanks: {
      Andy : { halfPpr: 218, ppr: 218, dynasty: 218 },
      Mike : { halfPpr: 218, ppr: 218, dynasty: 218 },
      Jason : { halfPpr: 218, ppr: 218, dynasty: 218 },
    }
  },
  {
    rank: 219,
    espnId: 4034949,
    name: "Eddy Pineiro",
    position: "K",
    team: "SF",
    bye: 8,
    adp: 222,
    posRank: "K6",
    projectedPoints: 89,
    draftedBy: null,
    ranks: {
      halfPpr: 219,
      ppr: 219,
      dynasty: 219
    },
    expertRanks: {
      Andy : { halfPpr: 219, ppr: 219, dynasty: 219 },
      Mike : { halfPpr: 219, ppr: 219, dynasty: 219 },
      Jason : { halfPpr: 219, ppr: 219, dynasty: 219 },
    }
  },
  {
    rank: 220,
    espnId: 4710714,
    name: "De'Zhaun Stribling",
    position: "WR",
    team: "SF",
    bye: 8,
    adp: 232,
    posRank: "WR82",
    projectedPoints: 88,
    draftedBy: null,
    ranks: {
      halfPpr: 220,
      ppr: 218,
      dynasty: 220
    },
    expertRanks: {
      Andy : { halfPpr: 218, ppr: 216, dynasty: 218 },
      Mike : { halfPpr: 220, ppr: 218, dynasty: 220 },
      Jason : { halfPpr: 220, ppr: 218, dynasty: 220 },
    }
  },
  {
    rank: 221,
    espnId: 4428850,
    name: "Dontayvion Wicks",
    position: "WR",
    team: "PHI",
    bye: 10,
    adp: 212,
    posRank: "WR83",
    projectedPoints: 87,
    draftedBy: null,
    ranks: {
      halfPpr: 221,
      ppr: 219,
      dynasty: 221
    },
    expertRanks: {
      Andy : { halfPpr: 219, ppr: 217, dynasty: 219 },
      Mike : { halfPpr: 221, ppr: 219, dynasty: 221 },
      Jason : { halfPpr: 221, ppr: 219, dynasty: 221 },
    }
  },
  {
    rank: 222,
    espnId: 4360234,
    name: "Evan McPherson",
    position: "K",
    team: "CIN",
    bye: 6,
    adp: 225,
    posRank: "K7",
    projectedPoints: 86,
    draftedBy: null,
    ranks: {
      halfPpr: 222,
      ppr: 222,
      dynasty: 222
    },
    expertRanks: {
      Andy : { halfPpr: 222, ppr: 222, dynasty: 222 },
      Mike : { halfPpr: 222, ppr: 222, dynasty: 222 },
      Jason : { halfPpr: 222, ppr: 222, dynasty: 222 },
    }
  },
  {
    rank: 223,
    espnId: null,
    name: "Kansas City Chiefs",
    position: "DST",
    team: "KC",
    bye: 5,
    adp: 217,
    posRank: "DST13",
    projectedPoints: 85,
    draftedBy: null,
    ranks: {
      halfPpr: 223,
      ppr: 223,
      dynasty: 223
    },
    expertRanks: {
      Andy : { halfPpr: 223, ppr: 223, dynasty: 223 },
      Mike : { halfPpr: 223, ppr: 223, dynasty: 223 },
      Jason : { halfPpr: 223, ppr: 223, dynasty: 223 },
    }
  },
  {
    rank: 224,
    espnId: 4711533,
    name: "Ollie Gordon II",
    position: "RB",
    team: "MIA",
    bye: 6,
    adp: 227,
    posRank: "RB67",
    projectedPoints: 84,
    draftedBy: null,
    ranks: {
      halfPpr: 224,
      ppr: 226,
      dynasty: 224
    },
    expertRanks: {
      Andy : { halfPpr: 224, ppr: 226, dynasty: 224 },
      Mike : { halfPpr: 224, ppr: 226, dynasty: 224 },
      Jason : { halfPpr: 224, ppr: 226, dynasty: 224 },
    }
  },
  {
    rank: 225,
    espnId: 4431574,
    name: "Eli Stowers",
    position: "TE",
    team: "PHI",
    bye: 10,
    adp: 219,
    posRank: "TE28",
    projectedPoints: 82,
    draftedBy: null,
    ranks: {
      halfPpr: 225,
      ppr: 225,
      dynasty: 225
    },
    expertRanks: {
      Andy : { halfPpr: 225, ppr: 225, dynasty: 225 },
      Mike : { halfPpr: 225, ppr: 225, dynasty: 225 },
      Jason : { halfPpr: 225, ppr: 225, dynasty: 225 },
    }
  },
  {
    rank: 226,
    espnId: 4366031,
    name: "Tank Dell",
    position: "WR",
    team: "HOU",
    bye: 8,
    adp: 229,
    posRank: "WR84",
    projectedPoints: 81,
    draftedBy: null,
    ranks: {
      halfPpr: 226,
      ppr: 224,
      dynasty: 226
    },
    expertRanks: {
      Andy : { halfPpr: 224, ppr: 222, dynasty: 224 },
      Mike : { halfPpr: 226, ppr: 224, dynasty: 226 },
      Jason : { halfPpr: 226, ppr: 224, dynasty: 226 },
    }
  },
  {
    rank: 227,
    espnId: 4697745,
    name: "Tyler Loop",
    position: "K",
    team: "BAL",
    bye: 13,
    adp: 236,
    posRank: "K8",
    projectedPoints: 80,
    draftedBy: null,
    ranks: {
      halfPpr: 227,
      ppr: 227,
      dynasty: 227
    },
    expertRanks: {
      Andy : { halfPpr: 227, ppr: 227, dynasty: 227 },
      Mike : { halfPpr: 227, ppr: 227, dynasty: 227 },
      Jason : { halfPpr: 227, ppr: 227, dynasty: 227 },
    }
  },
  {
    rank: 228,
    espnId: 4837248,
    name: "Fernando Mendoza",
    position: "QB",
    team: "LV",
    bye: 13,
    adp: 234,
    posRank: "QB28",
    projectedPoints: 144,
    draftedBy: null,
    ranks: {
      halfPpr: 228,
      ppr: 228,
      dynasty: 228
    },
    expertRanks: {
      Andy : { halfPpr: 228, ppr: 228, dynasty: 228 },
      Mike : { halfPpr: 228, ppr: 228, dynasty: 228 },
      Jason : { halfPpr: 228, ppr: 228, dynasty: 228 },
    }
  },
  {
    rank: 229,
    espnId: 4870612,
    name: "Zachariah Branch",
    position: "WR",
    team: "ATL",
    bye: 11,
    adp: 241,
    posRank: "WR85",
    projectedPoints: 78,
    draftedBy: null,
    ranks: {
      halfPpr: 229,
      ppr: 227,
      dynasty: 229
    },
    expertRanks: {
      Andy : { halfPpr: 227, ppr: 225, dynasty: 227 },
      Mike : { halfPpr: 229, ppr: 227, dynasty: 229 },
      Jason : { halfPpr: 229, ppr: 227, dynasty: 229 },
    }
  },
  {
    rank: 230,
    espnId: null,
    name: "Baltimore Ravens",
    position: "DST",
    team: "BAL",
    bye: 13,
    adp: 239,
    posRank: "DST14",
    projectedPoints: 77,
    draftedBy: null,
    ranks: {
      halfPpr: 230,
      ppr: 230,
      dynasty: 230
    },
    expertRanks: {
      Andy : { halfPpr: 230, ppr: 230, dynasty: 230 },
      Mike : { halfPpr: 230, ppr: 230, dynasty: 230 },
      Jason : { halfPpr: 230, ppr: 230, dynasty: 230 },
    }
  },
  {
    rank: 231,
    espnId: 4569923,
    name: "Andy Borregales",
    position: "K",
    team: "NE",
    bye: 11,
    adp: 219,
    posRank: "K9",
    projectedPoints: 76,
    draftedBy: null,
    ranks: {
      halfPpr: 231,
      ppr: 231,
      dynasty: 231
    },
    expertRanks: {
      Andy : { halfPpr: 231, ppr: 231, dynasty: 231 },
      Mike : { halfPpr: 231, ppr: 231, dynasty: 231 },
      Jason : { halfPpr: 231, ppr: 231, dynasty: 231 },
    }
  },
  {
    rank: 232,
    espnId: 17427,
    name: "Cairo Santos",
    position: "K",
    team: "CHI",
    bye: 10,
    adp: 238,
    posRank: "K10",
    projectedPoints: 75,
    draftedBy: null,
    ranks: {
      halfPpr: 232,
      ppr: 232,
      dynasty: 232
    },
    expertRanks: {
      Andy : { halfPpr: 232, ppr: 232, dynasty: 232 },
      Mike : { halfPpr: 232, ppr: 232, dynasty: 232 },
      Jason : { halfPpr: 232, ppr: 232, dynasty: 232 },
    }
  },
  {
    rank: 233,
    espnId: 4870847,
    name: "Ja'Kobi Lane",
    position: "WR",
    team: "BAL",
    bye: 13,
    adp: 242,
    posRank: "WR86",
    projectedPoints: 74,
    draftedBy: null,
    ranks: {
      halfPpr: 233,
      ppr: 231,
      dynasty: 233
    },
    expertRanks: {
      Andy : { halfPpr: 231, ppr: 229, dynasty: 231 },
      Mike : { halfPpr: 233, ppr: 231, dynasty: 233 },
      Jason : { halfPpr: 233, ppr: 231, dynasty: 233 },
    }
  },
  {
    rank: 234,
    espnId: 4685526,
    name: "Adam Randall",
    position: "RB",
    team: "BAL",
    bye: 13,
    adp: 243,
    posRank: "RB68",
    projectedPoints: 73,
    draftedBy: null,
    ranks: {
      halfPpr: 234,
      ppr: 236,
      dynasty: 234
    },
    expertRanks: {
      Andy : { halfPpr: 234, ppr: 236, dynasty: 234 },
      Mike : { halfPpr: 234, ppr: 236, dynasty: 234 },
      Jason : { halfPpr: 234, ppr: 236, dynasty: 234 },
    }
  },
  {
    rank: 235,
    espnId: 3150744,
    name: "Chase McLaughlin",
    position: "K",
    team: "TB",
    bye: 10,
    adp: 223,
    posRank: "K11",
    projectedPoints: 72,
    draftedBy: null,
    ranks: {
      halfPpr: 235,
      ppr: 235,
      dynasty: 235
    },
    expertRanks: {
      Andy : { halfPpr: 235, ppr: 235, dynasty: 235 },
      Mike : { halfPpr: 235, ppr: 235, dynasty: 235 },
      Jason : { halfPpr: 235, ppr: 235, dynasty: 235 },
    }
  },
  {
    rank: 236,
    espnId: 4429275,
    name: "Trey Benson",
    position: "RB",
    team: "ARI",
    bye: 14,
    adp: 233,
    posRank: "RB69",
    projectedPoints: 70,
    draftedBy: null,
    ranks: {
      halfPpr: 236,
      ppr: 238,
      dynasty: 211
    },
    expertRanks: {
      Andy : { halfPpr: 236, ppr: 238, dynasty: 211 },
      Mike : { halfPpr: 236, ppr: 238, dynasty: 211 },
      Jason : { halfPpr: 236, ppr: 238, dynasty: 211 },
    }
  },
  {
    rank: 237,
    espnId: 4382466,
    name: "Jalen Nailor",
    position: "WR",
    team: "LV",
    bye: 13,
    adp: 228,
    posRank: "WR87",
    projectedPoints: 69,
    draftedBy: null,
    ranks: {
      halfPpr: 237,
      ppr: 235,
      dynasty: 237
    },
    expertRanks: {
      Andy : { halfPpr: 235, ppr: 233, dynasty: 235 },
      Mike : { halfPpr: 237, ppr: 235, dynasty: 237 },
      Jason : { halfPpr: 237, ppr: 235, dynasty: 237 },
    }
  },
  {
    rank: 238,
    espnId: 4569603,
    name: "Malik Washington",
    position: "WR",
    team: "MIA",
    bye: 6,
    adp: 226,
    posRank: "WR88",
    projectedPoints: 68,
    draftedBy: null,
    ranks: {
      halfPpr: 238,
      ppr: 236,
      dynasty: 238
    },
    expertRanks: {
      Andy : { halfPpr: 236, ppr: 234, dynasty: 236 },
      Mike : { halfPpr: 238, ppr: 236, dynasty: 238 },
      Jason : { halfPpr: 238, ppr: 236, dynasty: 238 },
    }
  },
  {
    rank: 239,
    espnId: 4682652,
    name: "Devin Neal",
    position: "RB",
    team: "NO",
    bye: 8,
    adp: 227,
    posRank: "RB70",
    projectedPoints: 67,
    draftedBy: null,
    ranks: {
      halfPpr: 239,
      ppr: 241,
      dynasty: 239
    },
    expertRanks: {
      Andy : { halfPpr: 239, ppr: 241, dynasty: 239 },
      Mike : { halfPpr: 239, ppr: 241, dynasty: 239 },
      Jason : { halfPpr: 239, ppr: 241, dynasty: 239 },
    }
  },
  {
    rank: 240,
    espnId: 5088338,
    name: "Elijah Sarratt",
    position: "WR",
    team: "BAL",
    bye: 13,
    adp: 252,
    posRank: "WR89",
    projectedPoints: 66,
    draftedBy: null,
    ranks: {
      halfPpr: 240,
      ppr: 238,
      dynasty: 240
    },
    expertRanks: {
      Andy : { halfPpr: 238, ppr: 236, dynasty: 238 },
      Mike : { halfPpr: 240, ppr: 238, dynasty: 240 },
      Jason : { halfPpr: 240, ppr: 238, dynasty: 240 },
    }
  },
  {
    rank: 241,
    espnId: 4819231,
    name: "Kaleb Johnson",
    position: "RB",
    team: "PIT",
    bye: 9,
    adp: 241,
    posRank: "RB71",
    projectedPoints: 65,
    draftedBy: null,
    ranks: {
      halfPpr: 241,
      ppr: 243,
      dynasty: 241
    },
    expertRanks: {
      Andy : { halfPpr: 241, ppr: 243, dynasty: 241 },
      Mike : { halfPpr: 241, ppr: 243, dynasty: 241 },
      Jason : { halfPpr: 241, ppr: 243, dynasty: 241 },
    }
  },
  {
    rank: 242,
    espnId: 4243331,
    name: "Cade Otton",
    position: "TE",
    team: "TB",
    bye: 10,
    adp: 236,
    posRank: "TE29",
    projectedPoints: 64,
    draftedBy: null,
    ranks: {
      halfPpr: 242,
      ppr: 242,
      dynasty: 242
    },
    expertRanks: {
      Andy : { halfPpr: 242, ppr: 242, dynasty: 242 },
      Mike : { halfPpr: 242, ppr: 242, dynasty: 242 },
      Jason : { halfPpr: 242, ppr: 242, dynasty: 242 },
    }
  },
  {
    rank: 243,
    espnId: 4883647,
    name: "Elic Ayomanor",
    position: "WR",
    team: "TEN",
    bye: 9,
    adp: 231,
    posRank: "WR90",
    projectedPoints: 63,
    draftedBy: null,
    ranks: {
      halfPpr: 243,
      ppr: 241,
      dynasty: 243
    },
    expertRanks: {
      Andy : { halfPpr: 241, ppr: 239, dynasty: 241 },
      Mike : { halfPpr: 243, ppr: 241, dynasty: 243 },
      Jason : { halfPpr: 243, ppr: 241, dynasty: 243 },
    }
  },
  {
    rank: 244,
    espnId: 4682648,
    name: "Malachi Fields",
    position: "WR",
    team: "NYG",
    bye: 8,
    adp: 244,
    posRank: "WR91",
    projectedPoints: 62,
    draftedBy: null,
    ranks: {
      halfPpr: 244,
      ppr: 242,
      dynasty: 244
    },
    expertRanks: {
      Andy : { halfPpr: 242, ppr: 240, dynasty: 242 },
      Mike : { halfPpr: 244, ppr: 242, dynasty: 244 },
      Jason : { halfPpr: 244, ppr: 242, dynasty: 244 },
    }
  },
  {
    rank: 245,
    espnId: 5091739,
    name: "Chris Brazzell II",
    position: "WR",
    team: "CAR",
    bye: 5,
    adp: 248,
    posRank: "WR92",
    projectedPoints: 60,
    draftedBy: null,
    ranks: {
      halfPpr: 245,
      ppr: 243,
      dynasty: 245
    },
    expertRanks: {
      Andy : { halfPpr: 243, ppr: 241, dynasty: 243 },
      Mike : { halfPpr: 245, ppr: 243, dynasty: 245 },
      Jason : { halfPpr: 245, ppr: 243, dynasty: 245 },
    }
  },
  {
    rank: 246,
    espnId: 4683153,
    name: "Skyler Bell",
    position: "WR",
    team: "BUF",
    bye: 7,
    adp: 249,
    posRank: "WR93",
    projectedPoints: 59,
    draftedBy: null,
    ranks: {
      halfPpr: 246,
      ppr: 244,
      dynasty: 246
    },
    expertRanks: {
      Andy : { halfPpr: 244, ppr: 242, dynasty: 244 },
      Mike : { halfPpr: 246, ppr: 244, dynasty: 246 },
      Jason : { halfPpr: 246, ppr: 244, dynasty: 246 },
    }
  },
  {
    rank: 247,
    espnId: null,
    name: "Buffalo Bills",
    position: "DST",
    team: "BUF",
    bye: 7,
    adp: 247,
    posRank: "DST15",
    projectedPoints: 58,
    draftedBy: null,
    ranks: {
      halfPpr: 247,
      ppr: 247,
      dynasty: 247
    },
    expertRanks: {
      Andy : { halfPpr: 247, ppr: 247, dynasty: 247 },
      Mike : { halfPpr: 247, ppr: 247, dynasty: 247 },
      Jason : { halfPpr: 247, ppr: 247, dynasty: 247 },
    }
  },
  {
    rank: 248,
    espnId: null,
    name: "Detroit Lions",
    position: "DST",
    team: "DET",
    bye: 6,
    adp: 242,
    posRank: "DST16",
    projectedPoints: 57,
    draftedBy: null,
    ranks: {
      halfPpr: 248,
      ppr: 248,
      dynasty: 248
    },
    expertRanks: {
      Andy : { halfPpr: 248, ppr: 248, dynasty: 248 },
      Mike : { halfPpr: 248, ppr: 248, dynasty: 248 },
      Jason : { halfPpr: 248, ppr: 248, dynasty: 248 },
    }
  },
  {
    rank: 249,
    espnId: 15864,
    name: "Geno Smith",
    position: "QB",
    team: "NYJ",
    bye: 13,
    adp: 255,
    posRank: "QB29",
    projectedPoints: 121,
    draftedBy: null,
    ranks: {
      halfPpr: 249,
      ppr: 249,
      dynasty: 249
    },
    expertRanks: {
      Andy : { halfPpr: 249, ppr: 249, dynasty: 249 },
      Mike : { halfPpr: 249, ppr: 249, dynasty: 249 },
      Jason : { halfPpr: 249, ppr: 249, dynasty: 249 },
    }
  },
  {
    rank: 250,
    espnId: 4599739,
    name: "Kendre Miller",
    position: "RB",
    team: "NO",
    bye: 8,
    adp: 250,
    posRank: "RB72",
    projectedPoints: 55,
    draftedBy: null,
    ranks: {
      halfPpr: 250,
      ppr: 250,
      dynasty: 250
    },
    expertRanks: {
      Andy : { halfPpr: 250, ppr: 250, dynasty: 250 },
      Mike : { halfPpr: 250, ppr: 250, dynasty: 250 },
      Jason : { halfPpr: 250, ppr: 250, dynasty: 250 },
    }
  },
  {
    rank: 251,
    espnId: 4249086,
    name: "Cameron Dicker",
    position: "K",
    team: "LAC",
    bye: 5,
    adp: 225,
    posRank: "K12",
    projectedPoints: 78,
    draftedBy: null,
    ranks: {
      halfPpr: 251,
      ppr: 251,
      dynasty: 251
    },
    expertRanks: {
      Andy : { halfPpr: 251, ppr: 251, dynasty: 251 },
      Mike : { halfPpr: 251, ppr: 251, dynasty: 251 },
      Jason : { halfPpr: 251, ppr: 251, dynasty: 251 },
    }
  },
  {
    rank: 252,
    espnId: 15683,
    name: "Jason Myers",
    position: "K",
    team: "SEA",
    bye: 10,
    adp: 230,
    posRank: "K13",
    projectedPoints: 76,
    draftedBy: null,
    ranks: {
      halfPpr: 252,
      ppr: 252,
      dynasty: 252
    },
    expertRanks: {
      Andy : { halfPpr: 252, ppr: 252, dynasty: 252 },
      Mike : { halfPpr: 252, ppr: 252, dynasty: 252 },
      Jason : { halfPpr: 252, ppr: 252, dynasty: 252 },
    }
  },
  {
    rank: 253,
    espnId: 14221,
    name: "Greg Zuerlein",
    position: "K",
    team: "NYJ",
    bye: 12,
    adp: 235,
    posRank: "K14",
    projectedPoints: 74,
    draftedBy: null,
    ranks: {
      halfPpr: 253,
      ppr: 253,
      dynasty: 253
    },
    expertRanks: {
      Andy : { halfPpr: 253, ppr: 253, dynasty: 253 },
      Mike : { halfPpr: 253, ppr: 253, dynasty: 253 },
      Jason : { halfPpr: 253, ppr: 253, dynasty: 253 },
    }
  },
  {
    rank: 254,
    espnId: 4683072,
    name: "Blake Grupe",
    position: "K",
    team: "NO",
    bye: 14,
    adp: 240,
    posRank: "K15",
    projectedPoints: 72,
    draftedBy: null,
    ranks: {
      halfPpr: 254,
      ppr: 254,
      dynasty: 254
    },
    expertRanks: {
      Andy : { halfPpr: 254, ppr: 254, dynasty: 254 },
      Mike : { halfPpr: 254, ppr: 254, dynasty: 254 },
      Jason : { halfPpr: 254, ppr: 254, dynasty: 254 },
    }
  },
  {
    rank: 255,
    espnId: 3917384,
    name: "Younghoe Koo",
    position: "K",
    team: "ATL",
    bye: 12,
    adp: 245,
    posRank: "K16",
    projectedPoints: 70,
    draftedBy: null,
    ranks: {
      halfPpr: 255,
      ppr: 255,
      dynasty: 255
    },
    expertRanks: {
      Andy : { halfPpr: 255, ppr: 255, dynasty: 255 },
      Mike : { halfPpr: 255, ppr: 255, dynasty: 255 },
      Jason : { halfPpr: 255, ppr: 255, dynasty: 255 },
    }
  }

  ];
};

export const MOCK_NEWS: NewsStory[] = [
  {
    id: 'news-1',
    timestamp: Date.now() - 42 * 60 * 1000,
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
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
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
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
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
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
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
    timestamp: Date.now() - 48 * 60 * 60 * 1000,
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
