import React from 'react';
import { render } from '@testing-library/react-native';
import LandingScreen from '../index';
import { useAuthStore } from '@/store/useAuthStore';
import { useHistoryStore } from '@/store/useHistoryStore';

describe('LandingScreen (Home) Smoke Test', () => {
  beforeEach(() => {
    // Log in a mock user so the main LandingScreen content renders instead of Onboarding
    useAuthStore.setState({
      user: {
        id: 'brad_123',
        email: 'lou.bradstafford@gmail.com',
        name: '@Brad',
        firstName: 'Brad',
        avatarUrl: '👑',
        provider: 'apple',
        preferences: {
          scoring: 'Half-PPR',
          draftPos: 1,
          draftStrategy: 'Hero RB'
        },
        phoneNumber: '502-216-6336'
      }
    });

    // Setup history store with defaults to prevent null checks
    useHistoryStore.setState({
      historicalDrafts: [],
      botTrainingSims: 0
    });
  });

  it('renders successfully without throwing exceptions', () => {
    const { toJSON } = render(<LandingScreen />);
    expect(toJSON()).not.toBeNull();
  });
});
