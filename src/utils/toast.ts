import { toast, ToastOptions } from 'react-toastify';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

const defaultOptions: ToastOptions = {
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
  const customOptions = { ...defaultOptions, ...options };

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
