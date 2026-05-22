import React from 'react';
import { render } from '@testing-library/react-native';
import DraftSummaryScreen from '../summary';
import { useDraftStore } from '@/store/useDraftStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useSimulationStore } from '@/store/useSimulationStore';

describe('DraftSummaryScreen Smoke Test', () => {
  beforeEach(() => {
    // Populate players list with some players drafted by user and bots
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
          draftedBy: 'Your Team',
          expertRanks: {
            Andy: { halfPpr: 1, ppr: 1, dynasty: 1 }
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
          draftedBy: 'Andy',
          expertRanks: {
            Andy: { halfPpr: 2, ppr: 2, dynasty: 2 }
          }
        }
      ]
    });

    // Populate draft store
    useDraftStore.setState({
      draftStatus: 'summary',
      currentPick: 181,
      draftHistory: [
        {
          pickNumber: 1,
          round: 1,
          teamName: 'Your Team',
          teamIndex: 0,
          player: {
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
            draftedBy: 'Your Team',
            expertRanks: {
              Andy: { halfPpr: 1, ppr: 1, dynasty: 1 }
            }
          }
        }
      ],
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

    useHistoryStore.setState({
      historicalDrafts: [
        {
          id: 'draft_1',
          timestamp: Date.now(),
          grade: 'A',
          valueScore: 95,
          playoffChance: 90,
          projectedWins: 10,
          projectedLosses: 4,
          userPosition: 1,
          leagueSize: 12,
          opponentStyle: 'Standard ADP',
          leagueFormat: 'Half-PPR',
          rankingsBase: 'ECR Consensus',
          userStrategy: 'Hero RB',
          passingTdPoints: 4,
          tePremium: false,
          flexCount: 1,
          teams: [
            {
              teamIndex: 0,
              teamName: 'Your Team',
              wins: 10,
              losses: 4,
              playoffChance: 90,
              grade: 'A',
              strategyCamp: 'Hero RB',
              expertPreference: 'ECR Consensus',
              roster: []
            }
          ]
        }
      ],
      botTrainingSims: 100
    });

    useSimulationStore.setState({
      botProfiles: {
        Andy: { name: 'Andy', strategyCamp: 'Zero RB', expertPreference: 'ECR Consensus', learningAccuracy: 0.90 }
      }
    });
  });

  it('renders successfully without throwing exceptions', () => {
    const { toJSON } = render(<DraftSummaryScreen />);
    expect(toJSON()).not.toBeNull();
  });
});
