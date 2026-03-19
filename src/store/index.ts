import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import patientReducer from './patientSlice';
import notificationReducer from './notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patient: patientReducer,
    notification: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
