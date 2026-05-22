import { useEffect, useState, useCallback } from 'react';
import { useRankingsStore } from '../store/useRankingsStore';

export const useRankingsSync = () => {
  const syncRankings = useRankingsStore(state => state.syncRankings);
  const syncStatus = useRankingsStore(state => state.syncStatus);
  const lastSyncedAt = useRankingsStore(state => state.lastSyncedAt);
  const syncError = useRankingsStore(state => state.syncError);

  const [timeAgo, setTimeAgo] = useState<string>('NEVER SYNCED');

  // Helper to format the time-ago text for the sync indicator
  const calculateTimeAgo = useCallback(() => {
    if (!lastSyncedAt) {
      return 'NEVER SYNCED';
    }
    const elapsedMs = Date.now() - lastSyncedAt;
    const elapsedSec = Math.floor(elapsedMs / 1000);
    const elapsedMin = Math.floor(elapsedSec / 60);

    if (elapsedSec < 5) {
      return 'JUST NOW';
    }
    if (elapsedSec < 60) {
      return `${elapsedSec}S AGO`;
    }
    if (elapsedMin < 60) {
      return `${elapsedMin}M AGO`;
    }
    return new Date(lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [lastSyncedAt]);

  // Update the time-ago counter text every second so it looks premium and alive!
  useEffect(() => {
    setTimeAgo(calculateTimeAgo());
    const interval = setInterval(() => {
      setTimeAgo(calculateTimeAgo());
    }, 1000);
    return () => clearInterval(interval);
  }, [calculateTimeAgo]);

  // Sync on app startup (on mount)
  useEffect(() => {
    console.log('📡 [RankingsSync] App initialized. Triggering automatic launch ECR sync...');
    syncRankings(false); // Throttle enabled to use cache if recently loaded
  }, [syncRankings]);

  // Polling check: every 10 seconds, check if our cache has expired (10 minutes)
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (lastSyncedAt) {
        const ageMs = Date.now() - lastSyncedAt;
        if (ageMs >= 600000) { // 10 minutes
          console.log('📡 [RankingsSync] 10-minute cache expired. Executing automatic background refresh...');
          syncRankings(true);
        }
      }
    }, 10000); // Check expiry every 10s

    return () => clearInterval(checkInterval);
  }, [lastSyncedAt, syncRankings]);

  const forceSync = useCallback(() => {
    console.log('📡 [RankingsSync] Manual sync triggered by user.');
    return syncRankings(true);
  }, [syncRankings]);

  return {
    syncStatus,
    lastSyncedAt,
    syncError,
    timeAgo,
    forceSync
  };
};
