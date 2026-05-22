import { useDraftStore } from '../useDraftStore';
import { usePlayerStore } from '../usePlayerStore';

jest.useFakeTimers();

describe('useDraftStore.cpuTurn progression loop', () => {
  beforeEach(() => {
    useDraftStore.getState().resetDraft();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should trigger CPU thinking state and then draft a player after timeout', () => {
    // Set user position to 2, so pick 1 is a CPU turn
    useDraftStore.getState().updateSetup({ userPosition: 2, leagueSize: 12 });
    useDraftStore.getState().startDraft();

    const store = useDraftStore.getState();
    expect(store.currentPick).toBe(1);

    const onUserTurnReached = jest.fn();
    store.simulateCpuTurn(onUserTurnReached);

    // Should indicate CPU is thinking
    expect(useDraftStore.getState().cpuIsThinking).toBe(true);
    expect(useDraftStore.getState().thinkingCpuName).not.toBe('');
    expect(onUserTurnReached).not.toHaveBeenCalled();

    // Advance fake timers by 450ms to fire the CPU pick
    jest.advanceTimersByTime(450);

    // CPU should have finished thinking and drafted a player
    const nextState = useDraftStore.getState();
    expect(nextState.cpuIsThinking).toBe(false);
    expect(nextState.currentPick).toBe(2);
    expect(nextState.draftHistory.length).toBe(1);

    const pick = nextState.draftHistory[0];
    expect(pick.pickNumber).toBe(1);
    expect(pick.player).toBeDefined();
    expect(pick.player.draftedBy).toBe(pick.teamName);

    // Player in player store should also mark draftedBy
    const draftedPlayerInStore = usePlayerStore.getState().players.find(p => p.rank === pick.player.rank);
    expect(draftedPlayerInStore?.draftedBy).toBe(pick.teamName);
  });

  it('should call onUserTurnReached when it is the user\'s turn', () => {
    // Set user position to 1, so pick 1 is the user's turn
    useDraftStore.getState().updateSetup({ userPosition: 1, leagueSize: 12 });
    useDraftStore.getState().startDraft();

    const store = useDraftStore.getState();
    const onUserTurnReached = jest.fn();
    store.simulateCpuTurn(onUserTurnReached);

    // Should not think, immediately call callback
    expect(useDraftStore.getState().cpuIsThinking).toBe(false);
    expect(onUserTurnReached).toHaveBeenCalledTimes(1);
    expect(useDraftStore.getState().currentPick).toBe(1);
  });

  it('should run a sequence of CPU picks, checking no duplicates or skips', () => {
    // User is pick 5. CPU picks 1, 2, 3, 4.
    useDraftStore.getState().updateSetup({ userPosition: 5, leagueSize: 12 });
    useDraftStore.getState().startDraft();

    const onUserTurnReached = jest.fn();

    // Simulate Pick 1
    useDraftStore.getState().simulateCpuTurn(onUserTurnReached);
    jest.advanceTimersByTime(450);
    expect(useDraftStore.getState().currentPick).toBe(2);

    // Simulate Pick 2
    useDraftStore.getState().simulateCpuTurn(onUserTurnReached);
    jest.advanceTimersByTime(450);
    expect(useDraftStore.getState().currentPick).toBe(3);

    // Simulate Pick 3
    useDraftStore.getState().simulateCpuTurn(onUserTurnReached);
    jest.advanceTimersByTime(450);
    expect(useDraftStore.getState().currentPick).toBe(4);

    // Simulate Pick 4
    useDraftStore.getState().simulateCpuTurn(onUserTurnReached);
    jest.advanceTimersByTime(450);
    expect(useDraftStore.getState().currentPick).toBe(5);

    // Now it should be the user's turn (pick 5)
    useDraftStore.getState().simulateCpuTurn(onUserTurnReached);
    expect(onUserTurnReached).toHaveBeenCalledTimes(1);
    expect(useDraftStore.getState().currentPick).toBe(5);

    // Verify history contains 4 distinct picks and players
    const history = useDraftStore.getState().draftHistory;
    expect(history.length).toBe(4);
    
    const pickNumbers = history.map(h => h.pickNumber);
    expect(pickNumbers).toEqual([1, 2, 3, 4]);

    const draftedRanks = history.map(h => h.player.rank);
    const uniqueRanks = new Set(draftedRanks);
    expect(uniqueRanks.size).toBe(4); // No duplicates
  });
});
