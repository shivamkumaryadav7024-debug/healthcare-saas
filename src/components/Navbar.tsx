import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { logout } from '../store/authSlice';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import {
  FiLogOut,
  FiBell,
  FiHome,
  FiUsers,
  FiBarChart2,
} from 'react-icons/fi';
import { showSuccessNotification, showInfoNotification } from '../utils/toast';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      const userName = user?.displayName || user?.email || 'User';
      const userInitial = userName.charAt(0).toUpperCase();
      showSuccessNotification(`${userInitial}. ${userName} logged out successfully`);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNotificationClick = () => {
    showInfoNotification('No new notifications at this time. Check back later!');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🏥</span>
              <span className="text-xl font-bold text-indigo-600 hidden sm:inline">
                HealthHub
              </span>
            </Link>
          </div>

          {/* Links */}
          {user && (
            <div className="flex items-center space-x-4 sm:space-x-6">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
              >
                <FiHome size={20} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <Link
                to="/patients"
                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
              >
                <FiUsers size={20} />
                <span className="hidden sm:inline">Patients</span>
              </Link>
              <Link
                to="/analytics"
                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
              >
                <FiBarChart2 size={20} />
                <span className="hidden sm:inline">Analytics</span>
              </Link>

              {/* Notifications */}
              <button 
                onClick={handleNotificationClick}
                className="p-2 text-gray-700 hover:text-indigo-600 transition hover:bg-indigo-50 rounded-lg"
                title="View Notifications"
              >
                <FiBell size={20} />
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-2 border-l pl-4">
                <span className="text-sm text-gray-700 hidden sm:inline">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                >
                  <FiLogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
