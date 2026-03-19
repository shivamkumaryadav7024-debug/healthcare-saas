import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationState, Notification } from '../types';

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.notifications.unshift(notification);
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    markAsRead(state, action: PayloadAction<string>) {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    clearNotifications(state) {
      state.notifications = [];
    },
  },
});

export const { addNotification, removeNotification, markAsRead, clearNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;
