import React, { useState, useEffect } from 'react';
import { FiBell, FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { useNotifications } from '../hooks/useNotifications';
import Button from './Button';
import {
  requestNotificationPermission,
  sendCombinedNotification,
  isPushNotificationsEnabled,
  sendSuccessPushNotification,
  showSuccessNotification,
  showErrorNotification,
  showWarningNotification,
} from '../utils/toast';

interface NotificationDemoProps {
  className?: string;
}

const NotificationDemo: React.FC<NotificationDemoProps> = ({ className = '' }) => {
  const { isSupported, isPermissionGranted, sendNotification } = useNotifications();
  const [pushEnabled, setPushEnabled] = useState<boolean>(isPushNotificationsEnabled());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPushEnabled(isPushNotificationsEnabled());
  }, []);

  const handleEnablePushNotifications = async () => {
    setIsLoading(true);
    try {
      const permission = await requestNotificationPermission();
      setPushEnabled(permission);
      if (permission) {
        sendSuccessPushNotification('✓ Push Notifications Enabled', {
          body: 'You will now receive push notifications',
        });
        showSuccessNotification('Push notifications enabled!');
      } else {
        showWarningNotification('Push notifications permission denied');
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      showErrorNotification('Failed to enable push notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInfoNotification = async () => {
    await sendNotification('Patient Information', {
      body: 'New patient record updated: John Doe (ID: 12345)',
      tag: 'patient-info',
      data: { url: '/patients', type: 'info' },
    });
    sendCombinedNotification(
      'Patient Information Updated',
      'info',
      { showLocal: true, showPush: true }
    );
  };

  const handleAppointmentNotification = async () => {
    await sendNotification('Appointment Reminder', {
      body: 'Appointment scheduled for tomorrow at 2:00 PM',
      tag: 'appointment-reminder',
      data: { url: '/dashboard', type: 'appointment' },
    });
    sendCombinedNotification(
      'Appointment Reminder: Tomorrow at 2:00 PM',
      'success',
      { showLocal: true, showPush: true }
    );
  };

  const handleAlertNotification = async () => {
    await sendNotification('Alert: Action Required', {
      body: 'Patient needs attention - high blood pressure reading detected',
      tag: 'alert',
      data: { url: '/patients', type: 'alert' },
    });
    sendCombinedNotification(
      'Alert: High Blood Pressure Reading Detected',
      'error',
      { showLocal: true, showPush: true }
    );
  };

  const handleSuccessNotification = async () => {
    await sendNotification('Success!', {
      body: 'Patient appointment has been confirmed',
      tag: 'success',
      data: { url: '/dashboard', type: 'success' },
    });
    sendCombinedNotification(
      'Patient Appointment Confirmed Successfully',
      'success',
      { showLocal: true, showPush: true }
    );
  };

  if (!isSupported) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
        <p className="text-yellow-800 text-sm">
          Service Worker notifications are not supported in your browser
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FiBell size={24} className="text-indigo-600" />
          <h3 className="text-lg font-bold text-gray-900">Notification Center</h3>
        </div>
        <p className="text-sm text-gray-600">Test local toasts and push notifications</p>
      </div>

      {/* Push Notifications Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Push Notifications</h4>
            <p className="text-sm text-gray-600 mt-1">
              {pushEnabled
                ? '✓ Enabled - You will receive browser notifications'
                : '✗ Disabled - Enable to receive browser notifications'}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              pushEnabled
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {pushEnabled ? 'ON' : 'OFF'}
          </span>
        </div>
        <Button
          onClick={handleEnablePushNotifications}
          variant={pushEnabled ? 'secondary' : 'primary'}
          disabled={isLoading || pushEnabled}
          size="sm"
          className="w-full"
        >
          {isLoading ? 'Enabling...' : pushEnabled ? 'Enabled' : 'Enable Push Notifications'}
        </Button>
      </div>

      {!isPermissionGranted && (
        <p className="text-sm text-orange-600 mb-4">
          Please enable notifications in your browser settings to receive Service Worker alerts
        </p>
      )}

      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Combined Notifications (Toast + Push)</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button
            onClick={handleInfoNotification}
            variant="secondary"
            size="sm"
            icon={FiInfo}
            iconPosition="left"
            className="text-xs"
          >
            Patient Info
          </Button>
          <Button
            onClick={handleAppointmentNotification}
            variant="primary"
            size="sm"
            icon={FiCheckCircle}
            iconPosition="left"
            className="text-xs"
          >
            Appointment
          </Button>
          <Button
            onClick={handleAlertNotification}
            variant="danger"
            size="sm"
            icon={FiAlertCircle}
            iconPosition="left"
            className="text-xs"
          >
            Alert
          </Button>
          <Button
            onClick={handleSuccessNotification}
            variant="primary"
            size="sm"
            icon={FiCheckCircle}
            iconPosition="left"
            className="text-xs"
          >
            Success
          </Button>
        </div>
      </div>

      <p className="text-xs text-gray-600 mt-4 p-3 bg-blue-50 rounded border border-blue-200">
        💡 <strong>Tip:</strong> Local notifications appear as toasts in the app bottom-right. Push notifications appear in your system notification center. Enable push notifications to test both!
      </p>
    </div>
  );
};

export default NotificationDemo;
