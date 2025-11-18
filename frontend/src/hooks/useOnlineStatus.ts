/**
 * useOnlineStatus Hook
 * Detects and tracks online/offline status
 */

import { useState, useEffect } from 'react';
import { offlineDetectionService } from '../services/errorHandling';

export interface UseOnlineStatusReturn {
  isOnline: boolean;
  isOffline: boolean;
}

/**
 * Hook for detecting online/offline status
 */
export const useOnlineStatus = (): UseOnlineStatusReturn => {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    // Subscribe to offline detection service
    const unsubscribe = offlineDetectionService.subscribe((isOffline) => {
      setIsOnline(!isOffline);
    });

    return unsubscribe as unknown as () => void;
  }, []);
  return {
    isOnline,
    isOffline: !isOnline,
  };
};

export default useOnlineStatus;
