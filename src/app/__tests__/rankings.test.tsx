import React from 'react';
import { render } from '@testing-library/react-native';
import RankingsScreen from '../rankings';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useRankingsStore } from '@/store/useRankingsStore';

describe('RankingsScreen Smoke Test', () => {
  beforeEach(() => {
    usePlayerStore.setState({
      players: [
        {
          name: 'Christian McCaffrey',
          position: 'RB',
          team: 'SF',
          rank: 1,
          posRank: 'RB1',
          bye: 9,
          projectedPoints: 350,
          espnId: 3117256,
          ranks: { halfPpr: 1, ppr: 1, dynasty: 1 },
          adp: 1.5,
          draftedBy: null,
          expertRanks: {
            Andy: { halfPpr: 1, ppr: 1, dynasty: 1 },
            Mike: { halfPpr: 1, ppr: 1, dynasty: 1 },
            Jason: { halfPpr: 1, ppr: 1, dynasty: 1 }
          }
        }
      ]
    });

    useRankingsStore.setState({
      myRanks: [
        {
          name: 'Christian McCaffrey',
          position: 'RB',
          team: 'SF',
          rank: 1,
          posRank: 'RB1',
          bye: 9,
          projectedPoints: 350,
          espnId: 3117256,
          ranks: { halfPpr: 1, ppr: 1, dynasty: 1 },
          adp: 1.5,
          draftedBy: null,
          expertRanks: {
            Andy: { halfPpr: 1, ppr: 1, dynasty: 1 },
            Mike: { halfPpr: 1, ppr: 1, dynasty: 1 },
            Jason: { halfPpr: 1, ppr: 1, dynasty: 1 }
          }
        }
      ],
      myRanksName: 'My Custom Cheat Sheet',
      syncStatus: 'synced',
      syncError: null,
    });
  });

  it('renders successfully without throwing exceptions', () => {
    const { toJSON } = render(<RankingsScreen />);
    expect(toJSON()).not.toBeNull();
  });
});
