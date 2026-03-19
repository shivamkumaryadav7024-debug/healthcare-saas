import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { initializeMockData, setSelectedPatient } from '../store/patientSlice';
import { showSuccessNotification } from '../utils/toast';
import { FiEye, FiUsers, FiCalendar, FiClock, FiUsers as FiPatients, FiBarChart2, FiPhone, FiSettings } from 'react-icons/fi';
import Card from '../components/Card';
import Loading from '../components/Loading';
import Button from '../components/Button';
import NotificationDemo from '../components/NotificationDemo';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { patients } = useAppSelector((state) => state.patient);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize mock data
    dispatch(initializeMockData());
    setLoading(false);

    // Show welcome notification only once per session (using sessionStorage)
    const sessionKey = `welcome_toast_shown_${user?.uid}`;
    const alreadyShown = sessionStorage.getItem(sessionKey);
    
    if (!alreadyShown && user?.displayName) {
      showSuccessNotification(`Welcome back, ${user.displayName}!`);
      sessionStorage.setItem(sessionKey, 'true');
    }
  }, [dispatch, user?.uid]);

  const activePatients = patients.filter((p) => p.status === 'Active').length;
  const totalAppointments = patients.length;
  const appointmentToday = patients.filter((p) =>
    p.appointmentDate === new Date().toISOString().split('T')[0]
  ).length;

  const handleViewPatient = (id: string) => {
    const patient = patients.find((p) => p.id === id);
    if (patient) {
      dispatch(setSelectedPatient(patient));
      navigate(`/patients/${id}`);
    }
  };

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">Welcome to HealthHub Platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card
            title="Total Patients"
            value={patients.length}
            icon={<FiUsers size={28} className="text-indigo-600" />}
          />
          <Card
            title="Active Patients"
            value={activePatients}
            icon={<FiEye size={28} className="text-green-600" />}
          />
          <Card
            title="Total Appointments"
            value={totalAppointments}
            icon={<FiCalendar size={28} className="text-blue-600" />}
          />
          <Card
            title="Appointments Today"
            value={appointmentToday}
            icon={<FiClock size={28} className="text-orange-600" />}
          />
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Recent Patients
            </h2>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/patients')}
            >
              View All
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Last Visit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.slice(0, 5).map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {patient.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {patient.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          patient.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {patient.lastVisit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewPatient(patient.id)}
                        className="text-indigo-600 hover:text-indigo-900 font-semibold text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notification Demo */}
        <div className="mb-8">
          <NotificationDemo />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="primary"
              onClick={() => navigate('/patients')}
              className="w-full"
              icon={FiPatients}
              iconPosition="left"
            >
              Patients
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/analytics')}
              className="w-full"
              icon={FiBarChart2}
              iconPosition="left"
            >
              Analytics
            </Button>
            <Button
              variant="secondary"
              onClick={() => showSuccessNotification('Appointment scheduled successfully!')}
              className="w-full"
              icon={FiPhone}
              iconPosition="left"
            >
              Schedule
            </Button>
            <Button
              variant="secondary"
              onClick={() => showSuccessNotification('Settings updated!')}
              className="w-full"
              icon={FiSettings}
              iconPosition="left"
            >
              Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
