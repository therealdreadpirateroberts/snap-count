"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RootLayout;
const react_1 = __importStar(require("react"));
require("../global.css");
const expo_status_bar_1 = require("expo-status-bar");
const expo_router_1 = require("expo-router");
const SplashScreen = __importStar(require("expo-splash-screen"));
const expo_font_1 = require("expo-font");
const oswald_1 = require("@expo-google-fonts/oswald");
const jetbrains_mono_1 = require("@expo-google-fonts/jetbrains-mono");
const inter_1 = require("@expo-google-fonts/inter");
const theme_1 = require("@/constants/theme");
const useThemeStore_1 = require("@/store/useThemeStore");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const useAuthStore_1 = require("@/store/useAuthStore");
const useCronSyncStore_1 = require("@/store/useCronSyncStore");
// Prevent splash screen auto-hiding until assets are loaded
SplashScreen.preventAutoHideAsync().catch(() => { });
function RootLayout() {
    const Colors = (0, theme_1.useColors)();
    const theme = (0, useThemeStore_1.useThemeStore)((state) => state.theme);
    const { initAuth, isInitialized } = (0, useAuthStore_1.useAuthStore)();
    const decrementCountdown = (0, useCronSyncStore_1.useCronSyncStore)((state) => state.decrementCountdown);
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            decrementCountdown();
        }, 1000);
        return () => clearInterval(interval);
    }, [decrementCountdown]);
    const [fontsLoaded, fontError] = (0, expo_font_1.useFonts)({
        'Oswald': oswald_1.Oswald_700Bold,
        'Oswald-Medium': oswald_1.Oswald_500Medium,
        'JetBrainsMono': jetbrains_mono_1.JetBrainsMono_500Medium,
        'JetBrainsMono-Bold': jetbrains_mono_1.JetBrainsMono_700Bold,
        'Inter': inter_1.Inter_400Regular,
        'Inter-SemiBold': inter_1.Inter_600SemiBold,
        'Inter-Bold': inter_1.Inter_700Bold,
    });
    (0, react_1.useEffect)(() => {
        initAuth();
    }, []);
    (0, react_1.useEffect)(() => {
        if (fontsLoaded) {
            console.log('✅ mockmaxxing Custom Fonts loaded successfully!');
        }
        if (fontError) {
            console.error('❌ mockmaxxing Custom Font Loading Error:', fontError);
        }
        // Inject elegant Caveat Google Font for premium cursive branding on Web
        if (typeof window !== 'undefined' && document.head) {
            const existingLink = document.getElementById('google-font-caveat');
            if (!existingLink) {
                const link = document.createElement('link');
                link.id = 'google-font-caveat';
                link.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap';
                link.rel = 'stylesheet';
                document.head.appendChild(link);
            }
        }
        if ((fontsLoaded || fontError) && isInitialized) {
            SplashScreen.hideAsync().catch(() => { });
        }
    }, [fontsLoaded, fontError, isInitialized]);
    if ((!fontsLoaded && !fontError) || !isInitialized) {
        return null;
    }
    return (<react_native_safe_area_context_1.SafeAreaProvider>
      <expo_status_bar_1.StatusBar style={theme === 'dark' ? 'light' : 'dark'} backgroundColor={Colors.background}/>
      <expo_router_1.Stack screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.background },
            animation: 'fade',
        }}>
        <expo_router_1.Stack.Screen name="index"/>
        <expo_router_1.Stack.Screen name="rankings"/>
        <expo_router_1.Stack.Screen name="news"/>
        <expo_router_1.Stack.Screen name="leaderboard"/>
        <expo_router_1.Stack.Screen name="qa-simulation"/>
        <expo_router_1.Stack.Screen name="wizard/setup"/>
        <expo_router_1.Stack.Screen name="wizard/active"/>
        <expo_router_1.Stack.Screen name="wizard/summary"/>
        <expo_router_1.Stack.Screen name="settings"/>
        <expo_router_1.Stack.Screen name="recap"/>
        <expo_router_1.Stack.Screen name="executive-dashboard"/>
      </expo_router_1.Stack>
    </react_native_safe_area_context_1.SafeAreaProvider>);
}
