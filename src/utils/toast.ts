import { toast, ToastOptions } from 'react-toastify';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

// ==================== LOCAL NOTIFICATIONS (Toast) ====================
const defaultToastOptions: ToastOptions = {
  position: 'bottom-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showNotification = (
  message: string,
  type: NotificationType = 'info',
  options?: ToastOptions
) => {
  const customOptions = { ...defaultToastOptions, ...options };

  switch (type) {
    case 'success':
      return toast.success(message, customOptions);
    case 'error':
      return toast.error(message, customOptions);
    case 'warning':
      return toast.warning(message, customOptions);
    case 'info':
    default:
      return toast.info(message, customOptions);
  }
};

export const showSuccessNotification = (message: string, options?: ToastOptions) => {
  return showNotification(message, 'success', options);
};

export const showErrorNotification = (message: string, options?: ToastOptions) => {
  return showNotification(message, 'error', options);
};

export const showWarningNotification = (message: string, options?: ToastOptions) => {
  return showNotification(message, 'warning', options);
};

export const showInfoNotification = (message: string, options?: ToastOptions) => {
  return showNotification(message, 'info', options);
};

// ==================== PUSH NOTIFICATIONS (Browser) ====================

/**
 * Request permission for push notifications
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support push notifications');
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
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  return false;
};

/**
 * Send a push notification to the user
 */
export const sendPushNotification = (
  title: string,
  options?: NotificationOptions
): Notification | null => {
  console.log('🔔 Sending push notification:', { title, permission: Notification.permission });
  
  if (!('Notification' in window)) {
    console.warn(' Push notifications not supported in this browser');
    return null;
  }

  const permission = Notification.permission;
  console.log(' Current notification permission:', permission);

  if (permission === 'granted') {
    try {
      const defaultOptions: NotificationOptions = {
        icon: '/vite.svg',
        badge: '/vite.svg',
        tag: 'healthcare-notification',
        requireInteraction: false,
        ...options,
      };

      console.log('Creating notification with:', { title, ...defaultOptions });
      const notification = new Notification(title, defaultOptions);
      
      // Handle notification click
      notification.onclick = () => {
        console.log(' Notification clicked:', title);
        window.focus();
      };
      
      console.log(' Notification created and displayed:', title);
      return notification;
    } catch (error) {
      console.error('Error sending push notification:', error);
      return null;
    }
  } else if (permission === 'denied') {
    console.warn('Notification permission denied by user');
  } else {
    console.warn('Notification permission not granted. Current status:', permission);
  }

  return null;
};

/**
 * Success push notification
 */
export const sendSuccessPushNotification = (
  title: string,
  options?: NotificationOptions
): Notification | null => {
  return sendPushNotification(title, {
    ...options,
    tag: 'success-notification',
  });
};

/**
 * Error push notification
 */
export const sendErrorPushNotification = (
  title: string,
  options?: NotificationOptions
): Notification | null => {
  return sendPushNotification(title, {
    ...options,
    tag: 'error-notification',
  });
};

/**
 * Warning push notification
 */
export const sendWarningPushNotification = (
  title: string,
  options?: NotificationOptions
): Notification | null => {
  return sendPushNotification(title, {
    ...options,
    tag: 'warning-notification',
  });
};

/**
 * Info push notification
 */
export const sendInfoPushNotification = (
  title: string,
  options?: NotificationOptions
): Notification | null => {
  return sendPushNotification(title, {
    ...options,
    tag: 'info-notification',
  });
};

// ==================== COMBINED NOTIFICATIONS ====================

interface CombinedNotificationOptions {
  showLocal?: boolean;
  showPush?: boolean;
  toastOptions?: ToastOptions;
  pushOptions?: NotificationOptions;
}

/**
 * Send both local and push notifications together
 */
export const sendCombinedNotification = (
  message: string,
  type: NotificationType = 'info',
  options?: CombinedNotificationOptions
) => {
  const {
    showLocal = true,
    showPush = true,
    toastOptions,
    pushOptions,
  } = options || {};

  // Show local notification (toast)
  if (showLocal) {
    showNotification(message, type, toastOptions);
  }

  // Show push notification
  if (showPush && Notification.permission === 'granted') {
    switch (type) {
      case 'success':
        sendSuccessPushNotification(message, {
          ...pushOptions,
          body: '✓ Operation completed successfully',
        });
        break;
      case 'error':
        sendErrorPushNotification(message, {
          ...pushOptions,
          body: '✗ An error occurred',
        });
        break;
      case 'warning':
        sendWarningPushNotification(message, {
          ...pushOptions,
          body: '⚠ Please be careful',
        });
        break;
      case 'info':
      default:
        sendInfoPushNotification(message, {
          ...pushOptions,
          body: 'ℹ New information',
        });
        break;
    }
  }
};

/**
 * Check if push notifications are enabled
 */
export const isPushNotificationsEnabled = (): boolean => {
  return 'Notification' in window && Notification.permission === 'granted';
};
