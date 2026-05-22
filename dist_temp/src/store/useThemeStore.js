"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useThemeStore = void 0;
const zustand_1 = require("zustand");
exports.useThemeStore = (0, zustand_1.create)((set) => ({
    theme: 'light', // Light mode is default as per rebranding directive
    setTheme: (theme) => set({ theme }),
    toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));
