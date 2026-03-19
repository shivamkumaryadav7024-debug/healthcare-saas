import React from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { Notification } from '../types';

interface NotificationItemProps {
  notification: Notification;
  onClose?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClose,
}) => {
  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
  }[notification.type];

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800',
    warning: 'text-yellow-800',
  }[notification.type];

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  }[notification.type];

  return (
    <div
      className={`border rounded-lg p-4 mb-2 ${bgColor} flex justify-between items-start`}
    >
      <div className="flex items-start">
        <span className={`font-bold text-lg mr-3 ${textColor}`}>{icon}</span>
        <div>
          <h4 className={`font-semibold ${textColor}`}>{notification.title}</h4>
          <p className={`text-sm ${textColor}`}>{notification.message}</p>
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`font-bold ${textColor} hover:opacity-75`}
        >
          ✕
        </button>
      )}
    </div>
  );
};

const NotificationCenter: React.FC = () => {
  const { notifications } = useAppSelector((state) => state.notification);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-sm max-h-96 overflow-y-auto">
      {notifications.slice(0, 3).map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationCenter;
