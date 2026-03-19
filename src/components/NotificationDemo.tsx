// components/NotificationDemo.tsx
import React, { useState } from 'react';
import { FiBell, FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';
import { useNotifications } from '../hooks/useNotifications';
import {
  notifyPatientUpdate,
  notifyAppointment,
  notifyCriticalAlert,
} from '../services/notificationService';

interface NotificationLog {
  id: string;
  title: string;
  body: string;
  timestamp: Date;
  type: 'success' | 'alert' | 'info';
}

const NotificationDemo: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isSupported, isPermissionGranted, isRegistered, requestPermission } =
    useNotifications();

  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [isRequesting, setIsRequesting] = useState(false);

  const addLog = (title: string, body: string, type: NotificationLog['type'] = 'info') =>
    setLogs((prev) => [{ id: Date.now().toString(), title, body, timestamp: new Date(), type }, ...prev].slice(0, 5));

  const removeLog = (id: string) => setLogs((prev) => prev.filter((n) => n.id !== id));

  const handleEnable = async () => {
    if (isPermissionGranted) return;
    setIsRequesting(true);
    const granted = await requestPermission();
    setIsRequesting(false);
    if (granted) {
      addLog('Notifications enabled', 'You will now receive desktop alerts.', 'success');
    } else {
      addLog('Permission denied', 'Enable notifications in your browser settings.', 'alert');
    }
  };

  // ── Demo actions ─────────────────────────────────────────────────────────────

  const handlePatientUpdate = async () => {
    const ok = await notifyPatientUpdate('John Doe');
    if (ok) addLog('Patient Record Updated', "John Doe's record has been synced.", 'info');
    else addLog('Blocked', 'Enable notifications first.', 'alert');
  };

  const handleAppointment = async () => {
    const ok = await notifyAppointment('Dr. Priya Sharma', 'Tomorrow @ 2:00 PM');
    if (ok) addLog('Appointment Reminder', 'Dr. Priya Sharma – Tomorrow @ 2:00 PM', 'success');
    else addLog('Blocked', 'Enable notifications first.', 'alert');
  };

  const handleCritical = async () => {
    const ok = await notifyCriticalAlert('BP 160/100 mmHg', 'Jane Smith');
    if (ok) addLog('Critical Alert', 'Jane Smith: BP 160/100 mmHg – Immediate attention required.', 'alert');
    else addLog('Blocked', 'Enable notifications first.', 'alert');
  };

  if (!isSupported) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 ${className}`}>
        Your browser does not support push notifications.
      </div>
    );
  }

  const statusColor = isPermissionGranted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  const statusLabel = isPermissionGranted ? '✓ ON' : '✗ OFF';

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <FiBell size={20} className="text-indigo-600" />
        <h3 className="text-base font-bold text-gray-900">Push Notifications</h3>
      </div>
      <p className="text-sm text-gray-500 mb-5">Service Worker · {isRegistered ? 'SW registered' : 'Registering…'}</p>

      {/* Status card */}
      <div className="mb-5 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">Permission status</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {isPermissionGranted ? 'Click any demo button below' : 'Click Enable to request permission'}
            </p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
            {statusLabel}
          </span>
        </div>

        <button
          onClick={handleEnable}
          disabled={isPermissionGranted || isRequesting}
          className={`w-full py-2 rounded-lg text-sm font-medium transition ${
            isPermissionGranted
              ? 'bg-green-100 text-green-700 cursor-default'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60'
          }`}
        >
          {isRequesting ? 'Requesting…' : isPermissionGranted ? '✓ Notifications enabled' : '🔔 Enable Notifications'}
        </button>
      </div>

      {/* Demo buttons */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Healthcare demos</p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handlePatientUpdate}
            disabled={!isPermissionGranted}
            className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-40 transition text-xs font-medium"
          >
            <FiInfo size={16} />
            Patient Info
          </button>
          <button
            onClick={handleAppointment}
            disabled={!isPermissionGranted}
            className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-40 transition text-xs font-medium"
          >
            <FiCheckCircle size={16} />
            Appointment
          </button>
          <button
            onClick={handleCritical}
            disabled={!isPermissionGranted}
            className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-40 transition text-xs font-medium"
          >
            <FiAlertCircle size={16} />
            Critical Alert
          </button>
        </div>
      </div>

      {/* Log */}
      {logs.length > 0 && (
        <div className="mb-5 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-500 mb-2">Recent</p>
          <div className="space-y-2">
            {logs.map((n) => (
              <div
                key={n.id}
                className={`p-2.5 rounded-lg flex items-start justify-between gap-2 ${
                  n.type === 'success' ? 'bg-green-50 border border-green-200' :
                  n.type === 'alert'   ? 'bg-red-50 border border-red-200' :
                                         'bg-blue-50 border border-blue-200'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold truncate ${
                    n.type === 'success' ? 'text-green-800' :
                    n.type === 'alert'   ? 'text-red-800' : 'text-blue-800'
                  }`}>{n.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{n.body}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.timestamp.toLocaleTimeString()}</p>
                </div>
                <button onClick={() => removeLog(n.id)} className="text-gray-400 hover:text-gray-600 shrink-0">
                  <FiX size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-xs font-semibold text-gray-700 mb-1.5">How it works</p>
        <ol className="text-xs text-gray-600 space-y-1 list-decimal ml-4">
          <li>Click <strong>Enable Notifications</strong> and accept the prompt</li>
          <li>Click a demo button — notification fires via Service Worker</li>
          <li>Switch to another tab to see the OS-level notification appear</li>
          <li>Check your system notification center if it doesn't pop up</li>
        </ol>
      </div>
    </div>
  );
};

export default NotificationDemo;