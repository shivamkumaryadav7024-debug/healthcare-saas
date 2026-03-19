import React from 'react';
import { FiBell, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { useNotifications } from '../hooks/useNotifications';
import Button from './Button';

interface NotificationDemoProps {
  className?: string;
}

const NotificationDemo: React.FC<NotificationDemoProps> = ({ className = '' }) => {
  const { isSupported, isPermissionGranted, sendNotification } = useNotifications();

  const handleInfoNotification = async () => {
    await sendNotification('Patient Information', {
      body: 'New patient record updated: John Doe (ID: 12345)',
      tag: 'patient-info',
      data: { url: '/patients', type: 'info' },
    });
  };

  const handleAppointmentNotification = async () => {
    await sendNotification('Appointment Reminder', {
      body: 'Appointment scheduled for tomorrow at 2:00 PM',
      tag: 'appointment-reminder',
      data: { url: '/dashboard', type: 'appointment' },
    });
  };

  const handleAlertNotification = async () => {
    await sendNotification('Alert: Action Required', {
      body: 'Patient needs attention - high blood pressure reading detected',
      tag: 'alert',
      data: { url: '/patients', type: 'alert' },
    });
  };

  const handleSuccessNotification = async () => {
    await sendNotification('Success!', {
      body: 'Patient appointment has been confirmed',
      tag: 'success',
      data: { url: '/dashboard', type: 'success' },
    });
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
      <div className="flex items-center gap-2 mb-4">
        <FiBell size={24} className="text-indigo-600" />
        <h3 className="text-lg font-bold text-gray-900">Service Worker Notifications</h3>
      </div>

      {!isPermissionGranted && (
        <p className="text-sm text-orange-600 mb-4">
          Please enable notifications in your browser settings to receive alerts
        </p>
      )}

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
          variant="secondary"
          size="sm"
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

      <p className="text-xs text-gray-600 mt-4">
        Click any button to trigger a Service Worker notification. The notification will appear even if you switch apps!
      </p>
    </div>
  );
};

export default NotificationDemo;
