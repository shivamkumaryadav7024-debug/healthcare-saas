// services/notificationService.ts

let _swRegistration: ServiceWorkerRegistration | null = null;

// ─── Service Worker ───────────────────────────────────────────────────────────

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    _swRegistration = reg;
    console.log('[SW] Registered, scope:', reg.scope);
    return reg;
  } catch (err) {
    console.error('[SW] Registration failed:', err);
    return null;
  }
};

export const getSwRegistration = () => _swRegistration;

// ─── Permission ───────────────────────────────────────────────────────────────

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  try {
    const result = await Notification.requestPermission();
    return result === 'granted';
  } catch (err) {
    console.error('[Notif] Permission request failed:', err);
    return false;
  }
};

export const isPermissionGranted = () =>
  'Notification' in window && Notification.permission === 'granted';

// ─── Send Notification ────────────────────────────────────────────────────────

export interface NotificationPayload {
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  url?: string;
  data?: Record<string, unknown>;
}

export const sendLocalNotification = async (
  title: string,
  options: NotificationPayload = {}
): Promise<boolean> => {
  if (!isPermissionGranted()) {
    console.warn('[Notif] Permission not granted');
    return false;
  }

  const payload: NotificationOptions = {
    icon: '/vite.svg',
    badge: '/vite.svg',
    tag: 'healthhub',
    requireInteraction: false,
    ...options,
    data: { url: options.url ?? '/', ...options.data },
  };

  try {
    // Prefer service worker showNotification (works when tab is in background)
    const sw = _swRegistration ?? (await navigator.serviceWorker.ready.catch(() => null));
    if (sw?.showNotification) {
      await sw.showNotification(title, payload);
    } else {
      // Fallback: direct Notification constructor (foreground only)
      new Notification(title, payload);
    }
    return true;
  } catch (err) {
    console.error('[Notif] Failed to show notification:', err);
    return false;
  }
};

// ─── Preset use-cases ─────────────────────────────────────────────────────────

export const notifyPatientUpdate = (patientName: string) =>
  sendLocalNotification('Patient Record Updated', {
    body: `${patientName}'s record has been synced.`,
    tag: 'patient-update',
  });

export const notifyAppointment = (doctorName: string, time: string) =>
  sendLocalNotification('Appointment Reminder', {
    body: `${doctorName} – ${time}`,
    tag: 'appointment',
    requireInteraction: true,
  });

export const notifyCriticalAlert = (reading: string, patient: string) =>
  sendLocalNotification('Critical Alert', {
    body: `${patient}: ${reading} – Immediate attention required.`,
    tag: 'critical-alert',
    requireInteraction: true,
  });

// ─── Listen for SW → App messages ────────────────────────────────────────────

export const listenForSwMessages = (
  handler: (data: Record<string, unknown>) => void
) => {
  if (!('serviceWorker' in navigator)) return () => {};
  const listener = (event: MessageEvent) => {
    if (event.data?.type === 'NOTIFICATION_CLICK') handler(event.data);
  };
  navigator.serviceWorker.addEventListener('message', listener);
  return () => navigator.serviceWorker.removeEventListener('message', listener);
};