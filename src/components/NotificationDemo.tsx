import React, { useState, useEffect } from 'react';
import { FiBell, FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { useNotifications } from '../hooks/useNotifications';
import Button from './Button';
import {
  requestNotificationPermission,
  isPushNotificationsEnabled,
  sendSuccessPushNotification,
  sendErrorPushNotification,
  sendWarningPushNotification,
  sendInfoPushNotification,
  sendPushNotification,
} from '../utils/toast';

interface NotificationDemoProps {
  className?: string;
}

const NotificationDemo: React.FC<NotificationDemoProps> = ({ className = '' }) => {
  const { isSupported, isPermissionGranted, sendNotification } = useNotifications();
  const [pushEnabled, setPushEnabled] = useState<boolean>(isPushNotificationsEnabled());
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    setPushEnabled(isPushNotificationsEnabled());
  }, []);

  const handleEnablePushNotifications = async () => {
    setIsLoading(true);
    setStatusMessage('Requesting permission...');
    try {
      const permission = await requestNotificationPermission();
      setPushEnabled(permission);
      if (permission) {
        sendSuccessPushNotification('✓ Push Notifications Enabled', {
          body: 'You will now receive browser notifications',
          requireInteraction: true,
        });
        setStatusMessage('✓ Push notifications enabled!');
        setTimeout(() => setStatusMessage(''), 3000);
      } else {
        setStatusMessage('✗ Permission denied');
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      setStatusMessage('✗ Failed to enable notifications');
      setTimeout(() => setStatusMessage(''), 3000);
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
    sendInfoPushNotification('📋 Patient Information Updated', {
      body: 'John Doe (ID: 12345) - Record synced',
      requireInteraction: false,
    });
  };

  const handleAppointmentNotification = async () => {
    await sendNotification('Appointment Reminder', {
      body: 'Appointment scheduled for tomorrow at 2:00 PM',
      tag: 'appointment-reminder',
      data: { url: '/dashboard', type: 'appointment' },
    });
    sendSuccessPushNotification('✓ Appointment Scheduled', {
      body: 'Tomorrow at 2:00 PM - Reminder set',
      requireInteraction: false,
    });
  };

  const handleAlertNotification = async () => {
    await sendNotification('Alert: Action Required', {
      body: 'Patient needs attention - high blood pressure reading detected',
      tag: 'alert',
      data: { url: '/patients', type: 'alert' },
    });
    sendErrorPushNotification('⚠ Alert: High Blood Pressure', {
      body: 'Patient needs immediate attention - BP reading abnormal',
      requireInteraction: true,
    });
  };

  const handleSuccessNotification = async () => {
    await sendNotification('Success!', {
      body: 'Patient appointment has been confirmed',
      tag: 'success',
      data: { url: '/dashboard', type: 'success' },
    });
    sendSuccessPushNotification('✓ Appointment Confirmed', {
      body: 'Patient has confirmed their appointment successfully',
      requireInteraction: false,
    });
  };

  if (!isSupported) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
        <p className="text-yellow-800 text-sm">
          Push notifications are not supported in your browser
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FiBell size={24} className="text-indigo-600" />
          <h3 className="text-lg font-bold text-gray-900">Browser Push Notifications</h3>
        </div>
        <p className="text-sm text-gray-600">Test browser notification API with real healthcare alerts</p>
      </div>

      {/* Push Notifications Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Browser Notifications</h4>
            <p className="text-sm text-gray-600 mt-1">
              {pushEnabled
                ? '✓ Enabled - Push notifications will appear in your system tray'
                : '✗ Disabled - Click enable to start receiving notifications'}
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
          {isLoading ? 'Requesting Permission...' : pushEnabled ? '✓ Enabled' : 'Enable Push Notifications'}
        </Button>
        {statusMessage && (
          <p className={`text-sm mt-2 ${statusMessage.includes('✓') ? 'text-green-600' : 'text-red-600'}`}>
            {statusMessage}
          </p>
        )}
      </div>

      {!isPermissionGranted && (
        <p className="text-sm text-orange-600 mb-4">
          ℹ Tip: Service Worker notifications need permission. Click "Enable Push Notifications" first.
        </p>
      )}

      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Healthcare Alert Demos</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button
            onClick={handleInfoNotification}
            variant="secondary"
            size="sm"
            icon={FiInfo}
            iconPosition="left"
            disabled={!pushEnabled}
            className="text-xs"
            title="Push notification demo"
          >
            Patient Info
          </Button>
          <Button
            onClick={handleAppointmentNotification}
            variant="primary"
            size="sm"
            icon={FiCheckCircle}
            iconPosition="left"
            disabled={!pushEnabled}
            className="text-xs"
            title="Push notification demo"
          >
            Appointment
          </Button>
          <Button
            onClick={handleAlertNotification}
            variant="danger"
            size="sm"
            icon={FiAlertCircle}
            iconPosition="left"
            disabled={!pushEnabled}
            className="text-xs"
            title="Push notification demo"
          >
            Alert
          </Button>
          <Button
            onClick={handleSuccessNotification}
            variant="primary"
            size="sm"
            icon={FiCheckCircle}
            iconPosition="left"
            disabled={!pushEnabled}
            className="text-xs"
            title="Push notification demo"
          >
            Success
          </Button>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-900">
          <strong>💡 How it works:</strong><br/>
          1. Click "Enable Push Notifications" and accept browser permission<br/>
          2. Click any alert button to test a healthcare notification<br/>
          3. Notifications appear in your system notification center<br/>
          4. Click the notification to interact with it
        </p>
      </div>
    </div>
  );
};

export default NotificationDemo;
