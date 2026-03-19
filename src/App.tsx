import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { store } from './store';
import { auth } from './services/firebase';
import { useAppDispatch } from './hooks/useAppDispatch';
import { setUser, setLoading as setAuthLoading } from './store/authSlice';
import { useNotifications } from './hooks/useNotifications';
import Navbar from './components/Navbar';
import ToastProvider from './components/ToastProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './components/Loading';

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const PatientsPage = lazy(() => import('./pages/PatientsPage'));
const PatientDetailsPage = lazy(() => import('./pages/PatientDetailsPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isPermissionGranted } = useNotifications(); // Initialize notifications

  useEffect(() => {
    dispatch(setAuthLoading(true));

    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName,
            photoURL: user.photoURL,
          })
        );
      } else {
        dispatch(setUser(null));
      }
      // Always set loading to false when auth state is determined
      dispatch(setAuthLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Router>
      <Navbar />
      <ToastProvider />
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <ProtectedRoute>
                <PatientsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients/:patientId"
            element={
              <ProtectedRoute>
                <PatientDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />

        {/* Default Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      </Suspense>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
