// hooks/useNotifications.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  registerServiceWorker,
  requestNotificationPermission,
  sendLocalNotification,
  isPermissionGranted,
  listenForSwMessages,
  type NotificationPayload,
} from '../services/notificationService';

export interface UseNotificationsReturn {
  isSupported: boolean;
  isPermissionGranted: boolean;
  isRegistered: boolean;
  requestPermission: () => Promise<boolean>;
  sendNotification: (title: string, options?: NotificationPayload) => Promise<boolean>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [permissionGranted, setPermissionGranted] = useState(isPermissionGranted);
  const [isRegistered, setIsRegistered] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  const isSupported =
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'Notification' in window;

  useEffect(() => {
    if (!isSupported) return;

    // Register SW once on mount
    registerServiceWorker().then((reg) => {
      setIsRegistered(!!reg);
    });

    // Sync permission state (user may have changed it in browser settings)
    setPermissionGranted(isPermissionGranted());

    // Listen for notification click events coming from SW
    cleanupRef.current = listenForSwMessages((data) => {
      console.log('[useNotifications] SW message received:', data);
    });

    return () => cleanupRef.current?.();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const requestPermission = useCallback(async (): Promise<boolean> => {
    const granted = await requestNotificationPermission();
    setPermissionGranted(granted);
    return granted;
  }, []);

  const sendNotification = useCallback(
    async (title: string, options?: NotificationPayload): Promise<boolean> => {
      if (!permissionGranted) {
        console.warn('[useNotifications] Cannot send – permission not granted');
        return false;
      }
      return sendLocalNotification(title, options);
    },
    [permissionGranted]
  );

  return { isSupported, isPermissionGranted: permissionGranted, isRegistered, requestPermission, sendNotification };
};