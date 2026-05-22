import { useRankingsStore } from '../useRankingsStore';
import { usePlayerStore } from '../usePlayerStore';

describe('useRankingsStore.syncRankings', () => {
  let originalFetch: typeof global.fetch;
  const mockFetch = jest.fn();

  beforeAll(() => {
    originalFetch = global.fetch;
    global.fetch = mockFetch as any;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useRankingsStore.setState({
      myRanks: null,
      myRanksName: null,
      syncStatus: 'idle',
      lastSyncedAt: null,
      syncError: null,
    });
  });

  it('should successfully sync rankings on fetch success', async () => {
    const mockPlayers = [
      {
        name: 'Christian McCaffrey',
        position: 'RB',
        team: 'SF',
        bye: 9,
        rank: 1,
        adp: 1.1,
        ranks: { halfPpr: 1, ppr: 1, dynasty: 1 },
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
        bye: 7,
        rank: 2,
        adp: 2.3,
        ranks: { halfPpr: 2, ppr: 2, dynasty: 2 },
        expertRanks: {
          Andy: { halfPpr: 2, ppr: 2, dynasty: 2 },
          Mike: { halfPpr: 2, ppr: 2, dynasty: 2 },
          Jason: { halfPpr: 2, ppr: 2, dynasty: 2 }
        }
      }
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlayers,
    });

    const store = useRankingsStore.getState();
    await store.syncRankings(true);

    const nextState = useRankingsStore.getState();
    expect(nextState.syncStatus).toBe('synced');
    expect(nextState.syncError).toBeNull();
    expect(nextState.lastSyncedAt).not.toBeNull();

    // Verify player store has the synced players loaded
    const loadedPlayers = usePlayerStore.getState().players;
    expect(loadedPlayers.length).toBeGreaterThan(0);
    expect(loadedPlayers[0].name).toBe('Christian McCaffrey');
  });

  it('should set syncStatus to stale on network failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network offline'));

    const store = useRankingsStore.getState();
    await store.syncRankings(true);

    const nextState = useRankingsStore.getState();
    expect(nextState.syncStatus).toBe('stale');
    expect(nextState.syncError).toBe('Network offline');
  });

  it('should set syncStatus to stale on malformed JSON payload', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      // Return invalid structure or throw parsing error
      json: async () => {
        throw new Error('Unexpected token < in JSON');
      },
    });

    const store = useRankingsStore.getState();
    await store.syncRankings(true);

    const nextState = useRankingsStore.getState();
    expect(nextState.syncStatus).toBe('stale');
    expect(nextState.syncError).toBe('Unexpected token < in JSON');
  });
});
