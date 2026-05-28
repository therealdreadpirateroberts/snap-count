import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useHistoryStore } from '../store/useHistoryStore';
import { log } from '../utils/logger';

export const useAuthSync = () => {
  useEffect(() => {
    let lastUserId = useAuthStore.getState().user?.id || null;

    const unsubscribe = useAuthStore.subscribe(
      (state) => {
        const currentUserId = state.user?.id || null;

        if (currentUserId !== lastUserId) {
          log('AuthSync', `[Auth Sync] Active user transitioned: ${lastUserId} -> ${currentUserId}`);
          lastUserId = currentUserId;
          useHistoryStore.getState().rehydrateUserData();
        }
      }
    );

    return unsubscribe;
  }, []);
};
