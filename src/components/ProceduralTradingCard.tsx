import React, { useMemo } from 'react';
import { StyleSheet, View, Image, Platform } from 'react-native';
import Svg, { 
  Path, Rect, Circle, Defs, LinearGradient, Stop, 
  G, Line, Image as SvgImage, ClipPath, Polygon,
  Text as SvgText
} from 'react-native-svg';
import { useColors, Fonts } from '@/constants/theme';
import { CardStyleConfig, CardVariantConfig, PlayerCardData, HoloPatternType, SignatureInkType, MemorabiliaType, BgType, CardVariety, CARD_VARIETIES } from '@/types/tradingCard';
import { getTeamLogoUrl } from '@/store/mockData';

const fullTeamNames: Record<string, string> = {
  SF: 'NINERS',
  LV: 'RAIDERS',
  KC: 'CHIEFS',
  DAL: 'COWBOYS',
  LAR: 'RAMS',
  DET: 'LIONS',
  NYJ: 'JETS',
  ATL: 'FALCONS',
  BUF: 'BILLS',
  GB: 'PACKERS',
  ARI: 'CARDS',
  BAL: 'RAVENS',
  CAR: 'PANTHERS',
  CHI: 'BEARS',
  CIN: 'BENGALS',
  CLE: 'BROWNS',
  DEN: 'BRONCOS',
  HOU: 'TEXANS',
  IND: 'COLTS',
  JAX: 'JAGS',
  LAC: 'BOLTS',
  MIA: 'DOLPHINS',
  MIN: 'VIKINGS',
  NE: 'PATS',
  NO: 'SAINTS',
  NYG: 'GIANTS',
  PHI: 'EAGLES',
  PIT: 'STEELERS',
  SEA: 'HAWKS',
  TB: 'BUCS',
  TEN: 'TITANS',
  WAS: 'COMMANDS',
};

// Static imports mapping for all 8 card variety background plates
const varietyImages: Record<CardVariety, any> = {
  topps_chrome_purple_wave_refractor: require('../../assets/card-varieties/variety_01_topps_chrome_purple_wave_refractor.png'),
  panini_kaboom: require('../../assets/card-varieties/variety_02_panini_kaboom.png'),
  panini_prizm_mosaic: require('../../assets/card-varieties/variety_03_panini_prizm_mosaic.png'),
  donruss_downtown_a: require('../../assets/card-varieties/variety_04_donruss_downtown_a.png'),
  donruss_downtown_b: require('../../assets/card-varieties/variety_05_donruss_downtown_b.png'),
  panini_national_treasures: require('../../assets/card-varieties/variety_06_panini_national_treasures.png'),
  donruss_downtown_c: require('../../assets/card-varieties/variety_07_donruss_downtown_c.png'),
  topps_chrome_base_2025: require('../../assets/card-varieties/variety_08_topps_chrome_base_2025.png'),
};

// High-fidelity position-specific stadium backgrounds
const studioBackgrounds: Record<string, any> = {
  qb: require('../../assets/images/studio_qb.png'),
  rb: require('../../assets/images/studio_rb.png'),
  wr: require('../../assets/images/studio_wr.png'),
  te: require('../../assets/images/studio_te.png'),
  k: require('../../assets/images/studio_te.png'),
  dst: require('../../assets/images/studio_qb.png'),
};

// Full city + nickname mappings for all 32 NFL teams
const fullTeamNamesWithCity: Record<string, string> = {
  ARI: 'ARIZONA CARDINALS',
  ATL: 'ATLANTA FALCONS',
  BAL: 'BALTIMORE RAVENS',
  BUF: 'BUFFALO BILLS',
  CAR: 'CAROLINA PANTHERS',
  CHI: 'CHICAGO BEARS',
  CIN: 'CINCINNATI BENGALS',
  CLE: 'CLEVELAND BROWNS',
  DAL: 'DALLAS COWBOYS',
  DEN: 'DENVER BRONCOS',
  DET: 'DETROIT LIONS',
  GB: 'GREEN BAY PACKERS',
  HOU: 'HOUSTON TEXANS',
  IND: 'INDIANAPOLIS COLTS',
  JAX: 'JACKSONVILLE JAGUARS',
  KC: 'KANSAS CITY CHIEFS',
  LAC: 'LOS ANGELES CHARGERS',
  LAR: 'LOS ANGELES RAMS',
  LV: 'LAS VEGAS RAIDERS',
  MIA: 'MIAMI DOLPHINS',
  MIN: 'MINNESOTA VIKINGS',
  NE: 'NEW ENGLAND PATRIOTS',
  NO: 'NEW ORLEANS SAINTS',
  NYG: 'NEW YORK GIANTS',
  NYJ: 'NEW YORK JETS',
  PHI: 'PHILADELPHIA EAGLES',
  PIT: 'PITTSBURGH STEELERS',
  SEA: 'SEATTLE SEAHAWKS',
  SF: 'SAN FRANCISCO 49ERS',
  TB: 'TAMPA BAY BUCCANEERS',
  TEN: 'TENNESSEE TITANS',
  WAS: 'WASHINGTON COMMANDERS'
};

interface ProceduralTradingCardProps {
  player: PlayerCardData;
  customStyle?: CardStyleConfig;
  customVariant?: CardVariantConfig;
  width?: number;
}

export const ProceduralTradingCard: React.FC<ProceduralTradingCardProps> = React.memo(({
  player,
  customStyle,
  customVariant,
  width = 300
}) => {
  const themedColors = useColors();
  
  // 2:3 Standard Trading Card Aspect Ratio
  const height = width * 1.5;

  // Resolve configuration through stable deterministic hashing (only kept for parallel wear values etc.)
  const { style, variant } = useMemo(() => {
    if (customStyle && customVariant) {
      return { style: customStyle, variant: customVariant };
    }
    return resolvePlayerCard(player.id);
  }, [player.id, customStyle, customVariant]);

  // TASK 4: Permanent variety background selection locked deterministically per player (equal uniform distribution)
  const selectedVariety = useMemo(() => {
    const hash = getDeterministicHash(player.id || player.name || 'MM');
    return CARD_VARIETIES[hash % CARD_VARIETIES.length] || CARD_VARIETIES[0];
  }, [player.id, player.name]);

  // Extract variables
  const wear = variant.wearCoefficient;
  const primaryColor = player.teamColors[0] || themedColors.obsidianBlack;
  const secondaryColor = player.teamColors[1] || themedColors.midGray;
  const accentColor = player.teamColors[2] || themedColors.hofYellow;

  const resolvedIsRookie = player.is_rookie !== undefined ? player.is_rookie : (player.position !== 'DST' && player.position !== 'K');
  const teamCode = (player.team_code || player.team || 'FA').toUpperCase();
  const nameFull = player.name_full || player.name;
  const rawTeamName = player.team_name_full || fullTeamNames[teamCode] || teamCode;
  const fullTeamName = player.team_name_full || fullTeamNamesWithCity[teamCode] || (teamCode + ' FOOTBALL');
  const teamWatermark = rawTeamName.split('').join(' ').toUpperCase();
  const signatureText = player.signature_render || nameFull;

  // Holographic Overlays
  const renderHoloPattern = () => {
    switch (variant.holoPattern) {
      case 'cracked_ice':
        return (
          <G opacity={variant.holoOpacity}>
            <Path d="M0 0 L100 80 L50 180 L0 120 Z" fill="rgba(255,255,255,0.18)" />
            <Path d="M100 80 L220 30 L180 160 L50 180 Z" fill="rgba(255,255,255,0.08)" />
            <Path d="M220 30 L320 0 L320 140 L180 160 Z" fill="rgba(255,255,255,0.22)" />
            <Path d="M50 180 L180 160 L120 320 L0 260 Z" fill="rgba(255,255,255,0.14)" />
            <Path d="M180 160 L320 140 L280 340 L120 320 Z" fill="rgba(255,255,255,0.25)" />
            <Path d="M0 260 L120 320 L80 480 L0 440 Z" fill="rgba(255,255,255,0.06)" />
            <Path d="M120 320 L280 340 L320 480 L80 480 Z" fill="rgba(255,255,255,0.16)" />
            <Path d="M0 0 L100 80 L220 30 L320 0 M50 180 L180 160 L320 140 M120 320 L280 340 M100 80 L50 180 L120 320 L80 480 M180 160 L120 320 M220 30 L180 160 L280 340 L320 480 M0 120 L50 180 M0 260 L120 320 M0 440 L80 480" 
              stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1" />
          </G>
        );
      case 'refractor':
        return (
          <Rect x="0" y="0" width="320" height="480" fill="url(#refractorGrad)" opacity={variant.holoOpacity} />
        );
      case 'vinyl':
        return (
          <G opacity={variant.holoOpacity}>
            <Circle cx="160" cy="200" r="60" fill="none" stroke="rgba(255,205,0,0.2)" strokeWidth="2" />
            <Circle cx="160" cy="200" r="100" fill="none" stroke="rgba(255,205,0,0.15)" strokeWidth="4" />
            <Circle cx="160" cy="200" r="140" fill="none" stroke="rgba(255,205,0,0.12)" strokeWidth="6" />
            <Circle cx="160" cy="200" r="180" fill="none" stroke="rgba(255,205,0,0.08)" strokeWidth="8" />
            <Circle cx="160" cy="200" r="220" fill="none" stroke="rgba(255,205,0,0.05)" strokeWidth="12" />
            <Line x1="0" y1="40" x2="320" y2="360" stroke="rgba(255,255,255,0.25)" strokeWidth="40" opacity="0.3" />
            <Line x1="0" y1="360" x2="320" y2="40" stroke="rgba(255,255,255,0.25)" strokeWidth="40" opacity="0.3" />
          </G>
        );
      case 'pulsar':
        return (
          <G opacity={variant.holoOpacity}>
            {Array.from({ length: 12 }).map((_, idx) => {
              const angle = (idx * 30 * Math.PI) / 180;
              const x2 = 160 + 400 * Math.cos(angle);
              const y2 = 200 + 400 * Math.sin(angle);
              return (
                <Line 
                  key={idx}
                  x1="160" y1="200" x2={x2.toString()} y2={y2.toString()} 
                  stroke={accentColor} strokeWidth="15" opacity="0.15" 
                />
              );
            })}
          </G>
        );
      default:
        return null;
    }
  };

  // Card Wear Simulation Layer
  const renderPhysicalWear = () => {
    if (wear <= 0) return null;
    return (
      <G opacity={wear}>
        <Path d="M20 3 L0 23" stroke="#F4F5F7" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
        <Path d="M300 3 L320 23" stroke="#F4F5F7" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
        <Path d="M0 450 L20 477" stroke="#F4F5F7" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        <Path d="M320 450 L300 477" stroke="#F4F5F7" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        <Line x1="0" y1="120" x2="3" y2="124" stroke="rgba(244,245,247,0.7)" strokeWidth="2" />
        <Line x1="320" y1="280" x2="316" y2="284" stroke="rgba(244,245,247,0.7)" strokeWidth="2.5" />
        <Path d="M40 80 Q 90 140, 50 200" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
        <Path d="M220 280 Q 250 360, 200 420" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
      </G>
    );
  };

  return (
    <View style={[styles.cardContainer, { width, height }]}>
      {/* LAYER 2: High-Resolution Card Variety Background Plate (Opaque Backing) */}
      <Image 
        source={varietyImages[selectedVariety]} 
        style={styles.backgroundImage} 
        resizeMode="stretch"
      />

      <Svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 320 480" 
        preserveAspectRatio="xMidYMid meet"
        style={styles.svgOverlay}
      >
        <Defs>
          {/* Holographic Refractor Gradient */}
          <LinearGradient id="refractorGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="rgba(255,0,0,0.25)" />
            <Stop offset="20%" stopColor="rgba(255,255,0,0.18)" />
            <Stop offset="40%" stopColor="rgba(0,255,0,0.18)" />
            <Stop offset="60%" stopColor="rgba(0,255,255,0.18)" />
            <Stop offset="80%" stopColor="rgba(0,0,255,0.18)" />
            <Stop offset="100%" stopColor="rgba(255,0,255,0.25)" />
          </LinearGradient>

          {/* Premium Gold Logo Metallic Gradient */}
          <LinearGradient id="goldLogoGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FFE58F" />
            <Stop offset="30%" stopColor="#FADB14" />
            <Stop offset="70%" stopColor="#D4AF37" />
            <Stop offset="100%" stopColor="#8C6B0D" />
          </LinearGradient>

          {/* Shared Canonical Photo Centered Capsule ClipPath */}
          <ClipPath id="centeredCapsuleClip">
            <Rect x="40" y="70" width="240" height="280" rx="120" />
          </ClipPath>
        </Defs>

        {/* ----------------------------------------------------
            LAYER 1: Base Card Surface backing (Transparent to let Plate shine through)
            ---------------------------------------------------- */}
        <Rect x="0" y="0" width="320" height="480" rx="16" fill="none" />

        {/* ----------------------------------------------------
            LAYER 3: Shared Static Content Overlay (Canon Architecture)
            ---------------------------------------------------- */}

        {/* 1. Left Edge Watermark (Bold White 14.5px Team Name) */}
        <G>
          <SvgText 
            x="24" y="230" 
            fontSize="14.5" 
            fontWeight="bold" 
            fill="#FFFFFF" 
            opacity="0.85"
            textAnchor="middle" 
            fontFamily={Fonts.headings} 
            transform="rotate(-90 24 230)"
            letterSpacing="2.5"
          >
            {fullTeamName.toUpperCase()}
          </SvgText>
        </G>

        {/* 2. Top-Left Corner: Capsule Rookie Badge (RC) - Dynamic Gold Foil (Rookies Only) */}
        {resolvedIsRookie && (
          <G transform="translate(16, 16)">
            <Path d="M0 10 L16 5 L32 10 L32 26 C32 35 16 41 16 41 C16 41 0 35 0 26 Z" fill="url(#goldLogoGrad)" stroke="#FFE58F" strokeWidth="1.5" />
            <Path d="M3 11 L16 7.5 L29 11 L29 25 C29 32 16 37.5 16 37.5 C16 37.5 3 32 3 25 Z" fill="#2C2005" />
            <SvgText x="16" y="24" fontSize="9" fontWeight="900" fill="url(#goldLogoGrad)" textAnchor="middle" fontFamily={Fonts.headings}>RC</SvgText>
          </G>
        )}

        {/* 3. Top-Right Corner: Gold Topps Logo - Vertically Aligned with Left Capsule */}
        <SvgText 
          x="304" 
          y="41" 
          fontSize="14.5" 
          fontWeight="900" 
          fill="url(#goldLogoGrad)" 
          fontStyle="italic" 
          fontFamily={Fonts.body} 
          textAnchor="end"
        >
          topps
        </SvgText>

        {/* 4. Center: Capsule Photo Frame Border & Image (Clipped inside standard Capsule) */}
        <G>
          {/* Centered Capsule Frame Border */}
          <Rect x="40" y="70" width="240" height="280" rx="120" fill="none" stroke="#CBD5E1" strokeWidth="2.5" />
          
          <G clipPath="url(#centeredCapsuleClip)">
            {/* 1. High-fidelity position-specific stadium background backing layer */}
            <SvgImage 
              href={studioBackgrounds[(player.position || 'WR').toLowerCase()] || studioBackgrounds.wr}
              x="40"
              y="70"
              width="240"
              height="280"
              preserveAspectRatio="xMidYMid slice" 
            />

            {/* 2. Soft white frosted glass layer overlaying the busy stadium photo */}
            <Rect 
              x="40" 
              y="70" 
              width="240" 
              height="280" 
              fill="#FFFFFF" 
              opacity="0.28" 
            />

            {/* 3. Transparent Action Player shot layered perfectly on top */}
            {player.imageUrl || player.photo_url ? (
              <SvgImage 
                href={{ uri: player.photo_url || player.imageUrl }} 
                x="40"
                y="70"
                width="240"
                height="280"
                preserveAspectRatio="xMidYMid slice" 
              />
            ) : (
              <G>
                <Circle cx="160" cy="180" r="40" fill="#E8EAED" opacity="0.25" />
                <Path d="M110 260 Q 160 210, 210 260 Z" fill="#E8EAED" opacity="0.2" />
              </G>
            )}
          </G>
        </G>

        {/* 5. Autograph Signature Block (Horizontal Cursive Script centered above Details Pill) */}
        <G transform="translate(160, 385)">
          <SvgText 
            x="0" y="0" 
            fontSize="27" 
            fontWeight="900" 
            fill="#FFFFFF" 
            stroke="#FFFFFF"
            strokeWidth="0.8"
            textAnchor="middle" 
            fontFamily={Platform.OS === 'ios' ? 'Snell Roundhand' : (Platform.OS === 'android' ? 'serif' : 'cursive')}
            fontStyle="italic"
          >
            {signatureText}
          </SvgText>
        </G>

        {/* 6. Bottom Details Strip (Stadium capsule pill containing logo, name, and position) */}
        <G>
          {/* Outer Stadium Capsule */}
          <Rect x="16" y="412" width="288" height="48" rx="24" ry="24" fill="#0c0c0c" stroke="#FFFFFF" strokeWidth="1.5" />

          {/* Separator Lines */}
          <Line x1="56" y1="412" x2="56" y2="460" stroke="#FFFFFF" strokeWidth="1.5" />
          <Line x1="248" y1="412" x2="248" y2="460" stroke="#FFFFFF" strokeWidth="1.5" />

          {/* Left Pill Cap: Dynamic Team Logo */}
          <SvgImage 
            href={{ uri: getTeamLogoUrl(player.team || player.team_code || 'FA') }} 
            x="21"
            y="421"
            width="30"
            height="30"
            preserveAspectRatio="xMidYMid meet"
          />

          {/* Center Pill Area: Stacked Italicized Uppercase Player Name */}
          <G>
            <SvgText 
              x="152" y="430" 
              fontSize="10" 
              fontWeight="bold" 
              fontStyle="italic" 
              fill="#cbd5e1" 
              textAnchor="middle" 
              fontFamily={Fonts.body}
              letterSpacing="1"
            >
              {nameFull.split(' ')[0].toUpperCase()}
            </SvgText>
            <SvgText 
              x="152" y="450" 
              fontSize="17.5" 
              fontWeight="900" 
              fontStyle="italic" 
              fill="#FFFFFF" 
              textAnchor="middle" 
              fontFamily={Fonts.headings}
              letterSpacing="0.5"
            >
              {nameFull.split(' ').slice(1).join(' ').toUpperCase()}
            </SvgText>
          </G>

          {/* Right Pill Cap: Centered Italicized Position Text */}
          <SvgText 
            x="276" y="442" 
            fontSize="16" 
            fontWeight="900" 
            fontStyle="italic" 
            fill="#FFFFFF" 
            textAnchor="middle" 
            fontFamily={Fonts.headings}
          >
            {player.position}
          </SvgText>
        </G>

        {/* ----------------------------------------------------
            LAYER 4: Parallel Holographic Overlays
            ---------------------------------------------------- */}
        {renderHoloPattern()}

        {/* LAYER 5: Parallel border glow outlines */}
        <Rect 
          x="6" y="6" width="308" height="468" rx="11" 
          fill="none" 
          stroke="url(#borderFoilGrad)" 
          strokeWidth={variant.borderWidth} 
        />

        {/* LAYER 6: Physical Wear Overlays */}
        {renderPhysicalWear()}
      </Svg>
    </View>
  );
});

ProceduralTradingCard.displayName = 'ProceduralTradingCard';

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 10,
    backgroundColor: '#1A1D21',
  },
  backgroundImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  svgOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
});

// ==========================================
// STATIC DATA CONFIG SETS (MOCK 50 STYLES)
// ==========================================
export const mockCardStyles: CardStyleConfig[] = Array.from({ length: 50 }).map((_, idx) => {
  const names = [
    'Prizm', 'Rated Rookie', 'Kaboom!', 'Downtown', 'Topps Chrome', 
    'Metal Universe', 'National Treasures', 'Flawless', 'E-X2000', 'Bowman Chrome',
    'Fleer Ultra', 'Immaculate', 'Obsidian', 'Color Blast', 'Blank Slate',
    'Pinnacle Certified', 'Precious Metal Gems', 'Crown Royale', 'SP Authentic', 'SPx',
    'Select Field', 'Phoenix', 'Donruss Elite', 'Spectra', 'Zenith',
    'Illusions', 'Absolute Tools', 'Gridiron Kings', 'Topps Finest', 'Clear Vision',
    'Optic Rookie', 'Noir Spotlight', 'Prestige', 'Score Board', 'Bowman Best',
    'Game Jersey', 'Elements', 'Gold Standard', 'Classics', 'Contenders Ticket',
    'Origins', 'Mosaic', 'Panini Black', 'Mirror Certified', 'Plates Patches',
    'Rookies Stars', 'XR', 'Leaf Metal', 'Pro Set', 'Wild Card'
  ];

  const bgTypes: BgType[] = ['gradient', 'circuit', 'skyline', 'nebula', 'solid', 'abstract'];
  
  return {
    id: idx,
    name: names[idx] || `Brand-${idx}`,
    bgType: bgTypes[idx % bgTypes.length] || 'gradient',
    bgColors: ['#1E293B', '#0F172A'],
    frameType: idx % 3 === 0 ? 'geometric' : idx % 3 === 1 ? 'classic' : 'minimal',
    frameColors: ['#64748b', '#475569'],
    fontFamily: idx % 2 === 0 ? 'Oswald' : 'Inter',
    textColor: '#F4F5F7',
    accentColor: '#FFCD00',
    badgeStyle: idx % 4 === 0 ? 'rookie' : 'none',
    layoutPaths: []
  };
});

// ===========================================
// STATIC DATA CONFIG SETS (MOCK 50 PARALLELS)
// ===========================================
export const mockCardVariants: CardVariantConfig[] = Array.from({ length: 50 }).map((_, idx) => {
  const names = [
    'Base Chrome', 'Silver Prizm', 'Refractor', 'Gold Vinyl 1/1', 'Cracked Ice /25',
    'Black Pandora /5', 'Tiger Stripe', 'Zebra Prizm', 'Gold Foil /10', 'Emerald Crystal /5',
    'Platinum 1/1', 'Red Wave /99', 'Blue Shimmer /75', 'Orange Pulsar /25', 'Teal Scope /50',
    'Pink Velocity /79', 'Green Mojo /25', 'Purple Power /10', 'Military Camo /25', 'White Sparkle',
    'Red/White/Blue', 'Tie-Dye /25', 'Gold Star /50', 'Hyper Checker', 'Lazer Beam',
    'Disco Lights', 'Genesis Cloud', 'Elephant Hide', 'Peacock Feathers', 'Dual Patch /25',
    'Dual Autograph /15', 'NFL Shield 1/1', 'Superfractor 1/1', 'Emerald Ice /10', 'Orange Glow /25',
    'Ruby Wave /100', 'Sapphire Blue /75', 'Bronze Mirror /199', 'Sparkle Red /99', 'Lime Green /50',
    'Die-Cut Gold /24', 'Laundry Tag 1/1', 'Silver Ink Auto /49', 'Gold Paint Auto /10', 'Blue Ballpoint /99',
    'Black Sharpie /199', 'Attic Vintage', 'Diamond Inset /5', 'Etched Copper /99', 'Carbon Stealth /10'
  ];

  const holos: HoloPatternType[] = ['none', 'refractor', 'cracked_ice', 'vinyl', 'pulsar', 'shimmer', 'mosaic', 'bubble', 'swirl'];
  const sigs: SignatureInkType[] = ['none', 'blue_ballpoint', 'black_sharpie', 'gold_paint_pen', 'silver_metallic'];
  const memos: MemorabiliaType[] = ['none', 'single_patch', 'dual_patch', 'laundry_tag'];

  const wearVal = idx === 46 ? 0.85 : idx === 48 ? 0.2 : idx === 44 ? 0.15 : 0.0;
  
  return {
    id: idx,
    name: names[idx] || `Parallel-${idx}`,
    holoPattern: holos[idx % holos.length] || 'none',
    holoOpacity: 0.15 + (idx % 3) * 0.1,
    borderColor: idx % 4 === 0 ? '#FFCD00' : '#64748b',
    borderWidth: idx % 3 === 0 ? 2 : 1,
    borderGlow: idx % 5 === 0,
    serialMax: idx % 3 === 0 ? 99 : idx % 5 === 0 ? 1 : null,
    serialStyle: idx % 5 === 0 ? 'laser_black' : 'foil_silver',
    wearCoefficient: wearVal,
    signatureInk: sigs[idx % sigs.length] || 'none',
    memorabilia: memos[idx % memos.length] || 'none'
  };
});

// ==========================================
// DETERMINISTIC HASH RESOLVER UTILITY
// ==========================================

export function getDeterministicHash(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return Math.abs(hash >>> 0);
}

export function resolvePlayerCard(playerId: string) {
  const hash = getDeterministicHash(playerId || 'MM');
  const styleIdx = hash % 50;
  const variantIdx = (hash >> 5) % 50;
  
  return {
    style: mockCardStyles[styleIdx] || mockCardStyles[0],
    variant: mockCardVariants[variantIdx] || mockCardVariants[0]
  };
}
