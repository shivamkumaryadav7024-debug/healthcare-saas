import React from 'react';

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onDismiss }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex justify-between items-center">
      <div className="flex items-center">
        <span className="text-red-600 font-bold mr-2">⚠️</span>
        <p className="text-red-700">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-600 hover:text-red-800 font-bold"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;
