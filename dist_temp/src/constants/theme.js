"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxContentWidth = exports.BottomTabInset = exports.Spacing = exports.Fonts = exports.Colors = exports.DarkColors = exports.LightColors = void 0;
exports.useColors = useColors;
const react_native_1 = require("react-native");
const useThemeStore_1 = require("@/store/useThemeStore");
exports.LightColors = {
    background: '#F8FAFC', // Premium off-white / light slate
    surface: '#FFFFFF', // Solid white surface for cards
    surfaceLifted: '#F1F2F4', // Light gray raised surface (blended silver/grey)
    coltsNavy: '#2c2c2c', // Dark Slate - Primary Brand Color (Obsidian Elegance Graphite)
    coltsNavyLight: '#4a4a4a', // Sleek light border (Sleek Slate)
    primaryAccent: '#2c2c2c', // Slate primary text
    secondaryAccent: '#4a4a4a', // Muted slate secondary text
    hofYellow: '#EF8354', // Vibrant Brand Coral Accent (#EF8354)
    inactiveAccent: '#4a4a4a', // High contrast inactive state slate
    // Premium "Stadium Lights" Brand Colors
    coltsBlueGlow: 'rgba(0, 44, 95, 0.14)',
    doordashRedGlow: 'rgba(239, 68, 68, 0.07)',
    coltsBlue: '#002C5F',
    doordashRed: '#FF3008',
    // Premium Glassmorphism & Materials tokens (Apple HIG Vibrancy)
    glassSurface: 'rgba(255, 255, 255, 0.85)',
    glassBorder: 'rgba(0, 0, 0, 0.08)',
    glassBorderGold: 'rgba(255, 205, 0, 0.25)', // HOF Yellow-themed glass border
    glassSurfaceLight: 'rgba(241, 242, 244, 0.5)',
    shadows: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
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
};
exports.DarkColors = {
    background: '#0c0c0c', // Obsidian dark background
    surface: '#2c2c2c', // Elegant graphite surface
    surfaceLifted: '#4a4a4a', // Sleek lifted surface
    coltsNavy: '#2c2c2c', // Mapped to elegant surface
    coltsNavyLight: '#4a4a4a', // Sleek border outline
    primaryAccent: '#FFFFFF', // Bright text
    secondaryAccent: '#94a3b8', // Muted slate secondary text
    hofYellow: '#EF8354', // Vibrant Brand Coral Accent (#EF8354)
    inactiveAccent: '#cbd5e1', // High contrast inactive state slate in dark mode
    // Premium "Stadium Lights" Brand Colors
    coltsBlueGlow: 'rgba(0, 44, 95, 0.14)',
    doordashRedGlow: 'rgba(239, 68, 68, 0.07)',
    coltsBlue: '#002C5F',
    doordashRed: '#FF3008',
    // Glassmorphism tokens for dark mode
    glassSurface: 'rgba(44, 44, 44, 0.85)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
    glassBorderGold: 'rgba(255, 205, 0, 0.25)', // HOF Yellow-themed glass border
    glassSurfaceLight: 'rgba(74, 74, 74, 0.5)',
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
};
// Dynamic backward-compatible Colors constant (routes to LightColors or DarkColors at runtime)
exports.Colors = new Proxy({}, {
    get(target, prop) {
        const theme = useThemeStore_1.useThemeStore.getState().theme;
        return theme === 'dark' ? exports.DarkColors[prop] : exports.LightColors[prop];
    }
});
exports.Fonts = {
    headings: 'Oswald',
    stats: 'JetBrainsMono',
    body: 'Inter',
};
exports.Spacing = {
    half: 2,
    one: 4,
    two: 8,
    three: 16,
    four: 24,
    five: 32,
    six: 64,
};
exports.BottomTabInset = react_native_1.Platform.select({ ios: 50, android: 80 }) ?? 0;
exports.MaxContentWidth = 800;
// Reactive colors hook for functional components
function useColors() {
    const theme = (0, useThemeStore_1.useThemeStore)((state) => state.theme);
    return theme === 'dark' ? exports.DarkColors : exports.LightColors;
}
