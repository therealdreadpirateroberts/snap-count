import { Platform } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';

export const LightColors = {
  obsidianBlack: '#0c0c0c',      // Obsidian Black primary text
  deepGraphiteCharcoal: '#1A1D21', // Deep Graphite content surface backing (luxury cards)
  liftedCharcoal: '#4a4a4a',   // Lifted Charcoal (nested sub-panels inside Graphite cards)
  deepFieldGreen: '#1F4712',       // Deep Field Green specialty clock banner ONLY
  chromeSilver: '#64748b',  // Mid-Gray structural chrome (replaces deprecated #9EA7B0)
  midGray: '#64748b',       // Mid-Gray structural chrome
  slate: '#475569',         // Slate textual chrome
  primaryAccent: '#F4F5F7',   // Chalk White background canvas base
  liftedCanvas: '#E8EAED',    // Dynamic elevated surface canvas (bottom sheets, modals, drawers)
  secondaryAccent: '#475569', // Slate textual chrome secondary labels/meta
  hofYellow: '#FFCD00',       // Hall of Fame Yellow highlight fill
  inactiveAccent: '#cbd5e1',  // High contrast inactive icons/tabs
  pylonOrange: '#FF5722',     // Pylon Orange primary Action CTA
  deepGraphite: '#1A1D21',    // Deep Graphite card backing
  pigskinBrown: '#6B3615',    // Pigskin Brown football flourish trim
  
  // Premium "Stadium Lights" Brand Colors
  deepFieldGreenGlow: 'rgba(31, 71, 18, 0.14)',
  pylonOrangeGlow: 'rgba(255, 87, 34, 0.07)',
  
  // Premium Glassmorphism & Materials tokens (Apple HIG Vibrancy)
  glassSurface: 'rgba(107, 54, 21, 0.85)', // Pigskin Brown based glass
  glassBorder: 'rgba(244, 245, 247, 0.12)', // Chalk White-themed glass border
  glassBorderGold: 'rgba(255, 205, 0, 0.25)', // HOF Yellow-themed glass border
  glassSurfaceLight: 'rgba(139, 74, 32, 0.5)',
  
  shadows: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },

  positions: {
    QB: '#b91c1c',   // Premium Crimson Red
    RB: '#15803d',   // Deep Grass Green
    WR: '#1d4ed8',   // Rich Slate Blue
    TE: '#c2410c',   // Stadium Amber
    K: '#7e22ce',    // Deep Violet
    DST: '#475569',  // Dark Steel Gray
  },

  status: {
    danger: '#ef4444',
    success: '#22C55E',
    warning: '#FFCD00',
  }
} as const;

// Both palettes are identical under the complete White Mode directive (fail-safe)
export const DarkColors = LightColors;

// Force backward-compatible Colors proxy to always return LightColors (White Mode)
export const Colors = new Proxy({}, {
  get(target, prop) {
    return LightColors[prop as keyof typeof LightColors];
  }
}) as typeof LightColors;

export const Fonts = {
  headings: 'Oswald',
  stats: 'JetBrainsMono',
  body: 'Inter',
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

// Force reactive colors hook to always return LightColors (White Mode)
export function useColors() {
  return LightColors;
}
