// Register Service Worker
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('✓ Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          console.error('✗ Service Worker registration failed:', error);
        });
    });
  } else {
    console.warn('Service Workers not supported in this browser');
  }
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('✗ This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    console.log('✓ Notification permission already granted');
    return true;
  }

  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('✓ Notification permission granted');
      }
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  console.log('✗ Notification permission denied');
  return false;
};

// Send local notification via Service Worker
export const sendLocalNotification = (title: string, options?: NotificationOptions) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    return new Notification(title, {
      icon: '/vite.svg',
      badge: '/vite.svg',
      ...options,
    });
  }
};

// Check if push notifications are enabled
export const isPushNotificationsEnabled = (): boolean => {
  return 'Notification' in window && Notification.permission === 'granted';
};

// Send push notification via Notification API
export const sendPushNotification = (
  title: string,
  options?: NotificationOptions
): Notification | null => {
  if (!('Notification' in window)) {
    console.log('Push notifications not supported');
    return null;
  }

  if (Notification.permission === 'granted') {
    try {
      return new Notification(title, {
        icon: '/vite.svg',
        badge: '/vite.svg',
        tag: 'healthcare-notification',
        requireInteraction: false,
        ...options,
      });
    } catch (error) {
      console.error('Error sending push notification:', error);
      return null;
    }
  }

  return null;
};

// Type-specific push notifications
export const sendSuccessPushNotification = (
  title: string,
  options?: NotificationOptions
): Notification | null => {
  return sendPushNotification(title, {
    ...options,
    tag: 'success-notification',
  });
};

export const sendErrorPushNotification = (
  title: string,
  options?: NotificationOptions
): Notification | null => {
  return sendPushNotification(title, {
    ...options,
    tag: 'error-notification',
  });
};

export const sendWarningPushNotification = (
  title: string,
  options?: NotificationOptions
): Notification | null => {
  return sendPushNotification(title, {
    ...options,
    tag: 'warning-notification',
  });
};

export const sendInfoPushNotification = (
  title: string,
  options?: NotificationOptions
): Notification | null => {
  return sendPushNotification(title, {
    ...options,
    tag: 'info-notification',
  });
};

// Subscribe to push notifications
export const subscribeToPushNotifications = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push notifications not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      console.log('✓ Already subscribed to push notifications');
      return subscription;
    }

    console.log('Push notifications available');
    return null;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    return null;
  }
};
