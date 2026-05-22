import React from 'react';
import { render } from '@testing-library/react-native';
import LeaderboardScreen from '../leaderboard';
import { useSimulationStore } from '@/store/useSimulationStore';
import { useAuthStore } from '@/store/useAuthStore';

describe('LeaderboardScreen Smoke Test', () => {
  beforeEach(() => {
    useSimulationStore.setState({
      liveSimRunning: false,
      liveSimStats: {
        totalSims: 10,
        botRecords: {
          Andy: { wins: 5, losses: 5 },
          Mike: { wins: 6, losses: 4 }
        },
        strategyRecords: {
          'Hero RB': { wins: 5, losses: 5 }
        },
        slotRecords: {
          1: { wins: 5, losses: 5 }
        },
        parameterMutations: {
          'Robust RB': {},
          'Late QB/TE Focus': {},
          'Zero RB': {},
          'Hero RB': {},
          'Balanced': {},
          'Elite QB/TE Premium': {}
        },
        rosterViolations: 0
      }
    });

    useAuthStore.setState({
      registeredUsers: {}
    });
  });

  it('renders successfully without throwing exceptions', () => {
    const { toJSON } = render(<LeaderboardScreen />);
    expect(toJSON()).not.toBeNull();
  });
});
