import React, { useState } from 'react';
import { FiX, FiCalendar } from 'react-icons/fi';
import Button from './Button';
import { sendSuccessPushNotification, sendErrorPushNotification } from '../utils/toast';

interface RescheduleAppointmentModalProps {
  patientName: string;
  currentDate: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newDate: string) => void;
}

const RescheduleAppointmentModal: React.FC<RescheduleAppointmentModalProps> = ({
  patientName,
  currentDate,
  isOpen,
  onClose,
  onSave,
}) => {
  const [newDate, setNewDate] = useState(currentDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDate && newDate !== currentDate) {
      try {
        onSave(newDate);
        
        // Show browser push notification
        sendSuccessPushNotification(
          `✓ Appointment Rescheduled for ${patientName}`,
          {
            body: `New date: ${newDate}\nPrevious: ${currentDate}`,
            requireInteraction: false,
            tag: 'appointment-reschedule',
          }
        );
        
        onClose();
      } catch (error) {
        console.error('Error rescheduling appointment:', error);
        sendErrorPushNotification(
          '✗ Error Rescheduling',
          {
            body: 'Failed to reschedule appointment. Please try again.',
            requireInteraction: true,
          }
        );
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Reschedule Appointment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-semibold">Patient:</span> {patientName}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Appointment Date
            </label>
            <p className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700">
              {currentDate}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Appointment Date
            </label>
            <div className="flex items-center">
              <FiCalendar className="absolute ml-3 text-gray-400" size={18} />
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={FiCalendar}
              iconPosition="left"
              className="flex-1"
            >
              Reschedule
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RescheduleAppointmentModal;
