export const CARD_VARIETIES = [
  'topps_chrome_purple_wave_refractor',
  'panini_kaboom',
  'panini_prizm_mosaic',
  'donruss_downtown_a',
  'donruss_downtown_b',
  'panini_national_treasures',
  'donruss_downtown_c',
  'topps_chrome_base_2025',
] as const;

export type CardVariety = typeof CARD_VARIETIES[number];

export type BgType = 'solid' | 'gradient' | 'pattern' | 'skyline' | 'starburst' | 'abstract' | 'circuit' | 'nebula';
export type FrameType = 'geometric' | 'classic' | 'ticket' | 'crown' | 'comic' | 'minimal' | 'retro' | 'industrial';
export type HoloPatternType = 'none' | 'refractor' | 'cracked_ice' | 'pulsar' | 'shimmer' | 'mosaic' | 'vinyl' | 'bubble' | 'swirl';
export type SerialStyleType = 'stamp_gold' | 'laser_black' | 'foil_silver' | 'none';
export type SignatureInkType = 'none' | 'blue_ballpoint' | 'black_sharpie' | 'gold_paint_pen' | 'silver_metallic';
export type MemorabiliaType = 'none' | 'single_patch' | 'dual_patch' | 'laundry_tag';

export interface CardStyleConfig {
  id: number;
  name: string;
  bgType: BgType;
  bgColors: string[];
  frameType: FrameType;
  frameColors: string[];
  fontFamily: 'Oswald' | 'JetBrainsMono' | 'Inter';
  textColor: string;
  accentColor: string;
  badgeStyle: 'rookie' | 'nt' | 'classic' | 'modern' | 'none';
  layoutPaths: string[];
}

export interface CardVariantConfig {
  id: number;
  name: string;
  holoPattern: HoloPatternType;
  holoOpacity: number;
  borderColor: string;
  borderWidth: number;
  borderGlow: boolean;
  serialMax: number | null;
  serialStyle: SerialStyleType;
  wearCoefficient: number; // 0.0 (Gem Mint) to 1.0 (Heavy Distressed)
  signatureInk: SignatureInkType;
  memorabilia: MemorabiliaType;
}

export interface PlayerCardData {
  id: string;
  name: string;
  position: 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DST';
  team: string;
  teamColors: string[]; // Primary, Secondary, Accent
  stats: Record<string, string | number>;
  imageUrl?: string;
  
  // Canonical fields for player badge wireframe compliance
  year_product?: string;
  name_full?: string;
  team_code?: string;
  position_rank?: string;
  bye_week?: number;
  ppg?: number;
  yards?: number;
  touchdowns?: number;
  ecr?: number;
  psa_grade_label?: string;
  psa_grade_number?: number;
  is_rookie?: boolean;
  card_variety?: CardVariety;
  team_name_full?: string;
  photo_url?: string;
  signature_render?: string;
}
