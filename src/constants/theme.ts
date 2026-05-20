import { Platform } from 'react-native';

export const Colors = {
  background: '#040b1f',      // Deep field navy
  surface: '#0a1530',         // Raised surface
  surfaceLifted: '#0f1d3d',   // Lifted surface
  coltsNavy: '#002C5F',       // Base Colts Navy
  coltsNavyLight: '#1a4480',  // Colts Navy for gradients
  primaryAccent: '#F8FAFC',   // White primary text/active states
  secondaryAccent: '#E2E8F0', // Dim white
  hofYellow: '#FFCD00',       // Hall of Fame yellow (A+ draft grades)

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
