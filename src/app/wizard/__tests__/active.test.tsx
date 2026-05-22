import React from 'react';
import { render } from '@testing-library/react-native';
import SafeActiveDraftScreen from '../active';
import { useDraftStore } from '@/store/useDraftStore';
import { usePlayerStore } from '@/store/usePlayerStore';

describe('SafeActiveDraftScreen Smoke Test', () => {
  beforeEach(() => {
    // Populate players list
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
        },
        {
          name: 'CeeDee Lamb',
          position: 'WR',
          team: 'DAL',
          rank: 2,
          posRank: 'WR1',
          bye: 7,
          projectedPoints: 320,
          espnId: 4426377,
          ranks: { halfPpr: 2, ppr: 2, dynasty: 2 },
          adp: 2.5,
          draftedBy: null,
          expertRanks: {
            Andy: { halfPpr: 2, ppr: 2, dynasty: 2 },
            Mike: { halfPpr: 2, ppr: 2, dynasty: 2 },
            Jason: { halfPpr: 2, ppr: 2, dynasty: 2 }
          }
        }
      ]
    });

    // Populate draft store and transition state to drafting
    useDraftStore.setState({
      draftStatus: 'drafting',
      currentPick: 1,
      draftHistory: [],
      cpuIsThinking: false,
      thinkingCpuName: '',
      setup: {
        leagueSize: 12,
        userPosition: 1,
        rounds: 15,
        draftType: 'Snake',
        flexCount: 1,
        userStrategy: 'Hero RB',
        rankingsBase: 'ECR Consensus',
        opponentStyle: 'Standard ADP',
        leagueFormat: 'Half-PPR',
        passingTdPoints: 4,
        tePremium: false
      }
    });
  });

  it('renders successfully without throwing exceptions', () => {
    const { toJSON } = render(<SafeActiveDraftScreen />);
    expect(toJSON()).not.toBeNull();
  });
});
