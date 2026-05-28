import { useAuthStore } from '../useAuthStore';
import { useDraftStore } from '../useDraftStore';
import { useHistoryStore } from '../useHistoryStore';
import { useAuthSync } from '../../hooks/useAuthSync';
import { renderHook } from '@testing-library/react-native';

describe('useAuthSync hook', () => {
  beforeEach(() => {
    useDraftStore.getState().resetDraft();
    useAuthStore.setState({ user: null });
  });

  it('should preserve active drafting state and call rehydrateUserData when authentication change is triggered', () => {
    // 1. Establish an active draft in useDraftStore
    useDraftStore.getState().startDraft();
    expect(useDraftStore.getState().draftStatus).toBe('drafting');
    expect(useDraftStore.getState().currentPick).toBe(1);

    // 2. Render the hook to listen to the store updates
    renderHook(() => useAuthSync());

    const rehydrateSpy = jest.spyOn(useHistoryStore.getState(), 'rehydrateUserData');

    // 3. Simulate logging in a new user
    useAuthStore.setState({
      user: {
        id: 'user_123',
        email: 'lou.bradstafford@gmail.com',
        name: '@Brad_Drafter',
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

    // 4. Verify that rehydrateUserData was called on auth change
    expect(rehydrateSpy).toHaveBeenCalledTimes(1);

    // 5. Verify active drafting state remains completely intact
    expect(useDraftStore.getState().draftStatus).toBe('drafting');
    expect(useDraftStore.getState().currentPick).toBe(1);

    rehydrateSpy.mockRestore();
  });
});
