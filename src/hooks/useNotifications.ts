import { useEffect, useState } from 'react';
import {
  registerServiceWorker,
  requestNotificationPermission,
  sendLocalNotification,
} from '../services/notificationService';

export const useNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Check if notifications are supported
    const supported =
      'serviceWorker' in navigator &&
      'Notification' in window &&
      'PushManager' in window;
    setIsSupported(supported);

    if (supported) {
      // Register Service Worker
      registerServiceWorker().then((registration) => {
        setSwRegistration(registration);

        // Request notification permission
        requestNotificationPermission().then((granted) => {
          setIsPermissionGranted(granted);
        });
      });
    }
  }, []);

  const sendNotification = async (
    title: string,
    options?: NotificationOptions
  ) => {
    if (!isSupported || !isPermissionGranted) {
      console.warn('Notifications not supported or permission not granted');
      return;
    }

    await sendLocalNotification(title, options);
  };

  return {
    isSupported,
    isPermissionGranted,
    swRegistration,
    sendNotification,
  };
};
