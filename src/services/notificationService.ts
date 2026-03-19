// Service Worker registration and notification utilities

export const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    });

    console.log('Service Worker registered successfully:', registration);

    // Check for updates periodically
    setInterval(() => {
      registration.update();
    }, 60000); // Check every minute

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
};

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Notifications not supported');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Notification permission request failed:', error);
      return false;
    }
  }

  return false;
};

export const subscribeToPushNotifications = async (registration: ServiceWorkerRegistration) => {
  if (!('pushManager' in registration)) {
    console.log('Push notifications not supported');
    return null;
  }

  try {
    // Get existing subscription
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      console.log('Already subscribed to push notifications');
      return subscription;
    }

    // Create new subscription (Note: Requires VAPID public key from backend)
    // For now, we'll just log that subscription would happen
    console.log('Push notifications available. Configure with VAPID key for production.');
    return null;
  } catch (error) {
    console.error('Push subscription failed:', error);
    return null;
  }
};

export const sendLocalNotification = async (title: string, options?: NotificationOptions) => {
  if (!('Notification' in window)) {
    console.log('Notifications not supported');
    return;
  }

  if (Notification.permission !== 'granted') {
    console.log('Notification permission not granted');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    const notificationOptions = {
      icon: '🏥',
      badge: '/logo.png',
      tag: 'healthhub-notification',
      requireInteraction: false,
      ...options,
    };

    if (registration && registration.showNotification) {
      await registration.showNotification(title, notificationOptions);
    } else {
      new Notification(title, notificationOptions);
    }
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};

export const sendMessageToServiceWorker = (message: any) => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(message);
  }
};

// Listen for messages from Service Worker
export const startListeningToServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('Message from Service Worker:', event.data);
    });
  }
};
