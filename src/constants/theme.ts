import { Platform } from 'react-native';
import { useThemeStore } from '@/store/useThemeStore';

export const LightColors = {
  background: '#1F4712',      // Deep Field Green (Dark Forest / Field Green)
  surface: '#6B3615',         // Pigskin Brown Content Surface (strictly no buttons)
  surfaceLifted: '#8b4a20',   // Lifted Pigskin Brown
  coltsNavy: '#1F4712',       // Deep Field Green primary brand
  coltsNavyLight: '#9EA7B0',  // Chrome Silver secondary border/outlines
  primaryAccent: '#F4F5F7',   // Chalk White text
  secondaryAccent: '#9EA7B0', // Chrome Silver secondary labels/meta
  hofYellow: '#FFC107',       // Penalty-Flag Yellow
  inactiveAccent: '#cbd5e1',  // High contrast inactive
  pylonOrange: '#FF5722',     // Pylon Orange primary Action CTA
  deepGraphite: '#1A1D21',    // Deep Graphite trading card backing
  
  // Premium "Stadium Lights" Brand Colors
  coltsBlueGlow: 'rgba(31, 71, 18, 0.14)',
  doordashRedGlow: 'rgba(255, 87, 34, 0.07)',
  coltsBlue: '#1F4712',
  doordashRed: '#FF5722',
  
  // Premium Glassmorphism & Materials tokens (Apple HIG Vibrancy)
  glassSurface: 'rgba(107, 54, 21, 0.85)', // Pigskin Brown based glass
  glassBorder: 'rgba(244, 245, 247, 0.12)', // Chalk White-themed glass border
  glassBorderGold: 'rgba(255, 193, 7, 0.25)', // Penalty Yellow-themed glass border
  glassSurfaceLight: 'rgba(139, 74, 32, 0.5)',
  
  shadows: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },

  positions: {
    QB: '#f87171',
    RB: '#4ade80',
    WR: '#60a5fa',
    TE: '#fb923c',
    K: '#c084fc',
    DST: '#94a3b8',
  },

  status: {
    danger: '#EF4444',
    success: '#22C55E',
    warning: '#fbbf24',
  }
} as const;

export const DarkColors = {
  background: '#1F4712',      // Deep Field Green (Dark Forest / Field Green)
  surface: '#6B3615',         // Pigskin Brown Content Surface (strictly no buttons)
  surfaceLifted: '#8b4a20',   // Lifted Pigskin Brown
  coltsNavy: '#1F4712',       // Deep Field Green primary brand
  coltsNavyLight: '#9EA7B0',  // Chrome Silver secondary border/outlines
  primaryAccent: '#F4F5F7',   // Chalk White text
  secondaryAccent: '#9EA7B0', // Chrome Silver secondary labels/meta
  hofYellow: '#FFC107',       // Penalty-Flag Yellow
  inactiveAccent: '#cbd5e1',  // High contrast inactive
  pylonOrange: '#FF5722',     // Pylon Orange primary Action CTA
  deepGraphite: '#1A1D21',    // Deep Graphite trading card backing
  
  // Premium "Stadium Lights" Brand Colors
  coltsBlueGlow: 'rgba(31, 71, 18, 0.14)',
  doordashRedGlow: 'rgba(255, 87, 34, 0.07)',
  coltsBlue: '#1F4712',
  doordashRed: '#FF5722',
  
  // Glassmorphism tokens for dark mode
  glassSurface: 'rgba(107, 54, 21, 0.85)', // Pigskin Brown based glass
  glassBorder: 'rgba(244, 245, 247, 0.12)', // Chalk White-themed glass border
  glassBorderGold: 'rgba(255, 193, 7, 0.25)', // Penalty Yellow-themed glass border
  glassSurfaceLight: 'rgba(139, 74, 32, 0.5)',
  
  shadows: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },

  positions: {
    QB: '#ef4444',
    RB: '#22c55e',
    WR: '#3b82f6',
    TE: '#f97316',
    K: '#a855f7',
    DST: '#64748b',
  },

  status: {
    danger: '#EF4444',
    success: '#22C55E',
    warning: '#fbbf24',
  }
} as const;

// Dynamic backward-compatible Colors constant (routes to LightColors or DarkColors at runtime)
export const Colors = new Proxy({}, {
  get(target, prop) {
    const theme = useThemeStore.getState().theme;
    return theme === 'dark' ? DarkColors[prop as keyof typeof DarkColors] : LightColors[prop as keyof typeof LightColors];
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


// Reactive colors hook for functional components
export function useColors() {
  const theme = useThemeStore((state) => state.theme);
  return theme === 'dark' ? DarkColors : LightColors;
}

