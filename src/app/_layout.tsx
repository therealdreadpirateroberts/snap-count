import React, { useEffect } from 'react';
import '../global.css';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { 
  Oswald_500Medium, 
  Oswald_700Bold 
} from '@expo-google-fonts/oswald';
import { 
  JetBrainsMono_500Medium, 
  JetBrainsMono_700Bold 
} from '@expo-google-fonts/jetbrains-mono';
import { 
  Inter_400Regular, 
  Inter_600SemiBold, 
  Inter_700Bold 
} from '@expo-google-fonts/inter';
import { useColors } from '@/constants/theme';
import { useThemeStore } from '@/store/useThemeStore';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, TextInput, AppState } from 'react-native';
import { useAuthSync } from '@/hooks/useAuthSync';
import { useAuthStore } from '@/store/useAuthStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { saveBotParamsNow } from '@/store/_helpers';

// Prevent splash screen auto-hiding until assets are loaded
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const Colors = useColors();
  const theme = useThemeStore((state) => state.theme);
  const { initAuth, isInitialized } = useAuthStore();

  useAuthSync();

  const [fontsLoaded, fontError] = useFonts({
    'Oswald': Oswald_700Bold,
    'Oswald-Medium': Oswald_500Medium,
    'JetBrainsMono': JetBrainsMono_500Medium,
    'JetBrainsMono-Bold': JetBrainsMono_700Bold,
    'Inter': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background') {
        try {
          saveBotParamsNow();
        } catch (e) {
          console.error('Failed to auto-save bot params on background', e);
        }
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
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
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError, isInitialized]);

  if ((!fontsLoaded && !fontError) || !isInitialized) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <StatusBar style={theme === 'dark' ? 'light' : 'dark'} backgroundColor={Colors.obsidianBlack} />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: Colors.obsidianBlack },
              animation: 'fade',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="rankings" />
            <Stack.Screen name="news" />
            <Stack.Screen name="wizard/setup" />
            <Stack.Screen name="wizard/active" />
            <Stack.Screen name="wizard/summary" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="recap" />
            <Stack.Screen name="algo-admin" />
          </Stack>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
