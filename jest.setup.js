import React from 'react';
import { Animated } from 'react-native';

const originalEvent = Animated.event;
Animated.event = (argSheets, config) => {
  if (config) {
    config.useNativeDriver = false;
  }
  return originalEvent(argSheets, config);
};

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  usePathname: () => '/',
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn().mockResolvedValue({
        sound: {
          setOnPlaybackStatusUpdate: jest.fn(),
          unloadAsync: jest.fn(),
          stopAsync: jest.fn(),
        },
      }),
    },
    setAudioModeAsync: jest.fn(),
  },
}));

jest.mock('expo-file-system', () => ({
  documentDirectory: 'mock-doc-dir/',
  getInfoAsync: jest.fn().mockResolvedValue({ exists: true }),
  readAsStringAsync: jest.fn().mockResolvedValue('{}'),
  writeAsStringAsync: jest.fn(),
}));

jest.mock('expo-file-system/legacy', () => ({
  documentDirectory: 'mock-doc-dir/',
  getInfoAsync: jest.fn().mockResolvedValue({ exists: true }),
  readAsStringAsync: jest.fn().mockResolvedValue('{}'),
  writeAsStringAsync: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => inset,
  };
});

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn().mockReturnValue(true),
  useFonts: () => [true, null],
}));

jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn(),
  isSpeakingAsync: jest.fn().mockResolvedValue(false),
}));

jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      eas: {
        projectId: 'mock-project-id',
      },
    },
  },
}));

jest.mock('expo-device', () => ({
  isDevice: true,
  brand: 'Apple',
  manufacturer: 'Apple',
  modelName: 'iPhone',
}));

// Mock reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  return {
    GestureHandlerRootView: ({ children }) => children,
    PanResponder: {
      create: () => ({ panHandlers: {} }),
    },
  };
});

// Mock @gorhom/bottom-sheet
jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const { View } = require('react-native');
  class BottomSheet extends React.Component {
    expand = () => {};
    collapse = () => {};
    snapToIndex = () => {};
    close = () => {};
    render() {
      return <View testID="bottom-sheet">{this.props.children}</View>;
    }
  }
  return {
    __esModule: true,
    default: BottomSheet,
    BottomSheetView: ({ children }) => <View>{children}</View>,
    BottomSheetScrollView: ({ children }) => <View>{children}</View>,
    BottomSheetTextInput: (props) => <View {...props} />,
  };
});
