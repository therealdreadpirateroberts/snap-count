import { useDraftStore } from '../useDraftStore';
import { usePlayerStore } from '../usePlayerStore';

describe('useDraftStore.startDraft', () => {
  beforeEach(() => {
    useDraftStore.getState().resetDraft();
  });

  it('should initialize with default draft setup values in setup status', () => {
    const state = useDraftStore.getState();
    expect(state.draftStatus).toBe('setup');
    expect(state.currentPick).toBe(1);
    expect(state.draftHistory).toEqual([]);
    expect(state.cpuIsThinking).toBe(false);
    expect(state.thinkingCpuName).toBe('');
    expect(state.setup.leagueSize).toBe(12);
    expect(state.setup.userPosition).toBe(1);
    expect(state.setup.rounds).toBe(15);
    expect(state.setup.draftType).toBe('Snake');
  });

  it('should transition to drafting status on startDraft', () => {
    const store = useDraftStore.getState();
    store.startDraft();

    const nextState = useDraftStore.getState();
    expect(nextState.draftStatus).toBe('drafting');
    expect(nextState.currentPick).toBe(1);
    expect(nextState.draftHistory).toEqual([]);
    expect(nextState.cpuIsThinking).toBe(false);
    expect(nextState.thinkingCpuName).toBe('');

    // Players list in usePlayerStore should be populated
    const players = usePlayerStore.getState().players;
    expect(players.length).toBeGreaterThan(0);
    // Make sure no players are drafted yet
    expect(players.every(p => p.draftedBy === null)).toBe(true);
  });
});
