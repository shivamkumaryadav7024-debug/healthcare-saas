import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { initializeMockData } from '../store/patientSlice';
import { showInfoNotification } from '../utils/toast';
import { FiSearch, FiGrid, FiList } from 'react-icons/fi';
import PatientGrid from '../components/PatientGrid';
import PatientList from '../components/PatientList';
import Button from '../components/Button';
import Loading from '../components/Loading';

const PatientsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { patients, loading } = useAppSelector((state) => state.patient);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (patients.length === 0) {
      dispatch(initializeMockData());
    }
  }, [dispatch, patients.length]);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPatient = (patient: any) => {
    navigate(`/patients/${patient.id}`, { state: { patient } });
    showInfoNotification(`Viewing details for ${patient.name}`);
  };

  if (loading && patients.length === 0) {
    return <Loading message="Loading patients..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Patients
          </h1>
          <p className="text-gray-600">Manage and view patient information</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Search */}
            <div>
              <div className="flex items-center">
                <FiSearch className="absolute ml-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex gap-4 items-center justify-start md:justify-end">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FiGrid size={18} /> Grid View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FiList size={18} /> List View
              </button>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-gray-600">
            Showing {filteredPatients.length} of {patients.length} patients
          </p>
        </div>

        {/* Content */}
        <div>
          {filteredPatients.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600 text-lg mb-4">No patients found</p>
              <Button
                onClick={() => setSearchTerm('')}
                variant="primary"
              >
                Clear Search
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <PatientGrid
              patients={filteredPatients}
              onSelectPatient={handleSelectPatient}
            />
          ) : (
            <PatientList
              patients={filteredPatients}
              onSelectPatient={handleSelectPatient}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientsPage;
