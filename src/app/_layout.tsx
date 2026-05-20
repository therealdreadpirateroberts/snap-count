import React, { useEffect } from 'react';
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
import { Colors } from '@/constants/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Prevent splash screen auto-hiding until assets are loaded
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
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
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={Colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="rankings" />
        <Stack.Screen name="news" />
        <Stack.Screen name="wizard/setup" />
        <Stack.Screen name="wizard/active" />
        <Stack.Screen name="wizard/summary" />
      </Stack>
    </SafeAreaProvider>
  );
}
