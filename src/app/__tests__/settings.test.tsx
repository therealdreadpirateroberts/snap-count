import React from 'react';
import { render } from '@testing-library/react-native';
import SettingsScreen from '../settings';
import { useAuthStore } from '@/store/useAuthStore';

describe('SettingsScreen Smoke Test', () => {
  beforeEach(() => {
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
  });

  it('renders successfully without throwing exceptions', () => {
    const { toJSON } = render(<SettingsScreen />);
    expect(toJSON()).not.toBeNull();
  });
});
