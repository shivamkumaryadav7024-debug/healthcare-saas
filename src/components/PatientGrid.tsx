import React from 'react';
import { Patient } from '../types';

interface PatientGridProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
}

const PatientGrid: React.FC<PatientGridProps> = ({ patients, onSelectPatient }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {patients.map((patient) => (
        <div
          key={patient.id}
          onClick={() => onSelectPatient(patient)}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer hover:border-indigo-500 border-2 border-transparent"
        >
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900">{patient.name}</h3>
            <p className="text-sm text-gray-600">{patient.email}</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-semibold">{patient.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">DOB:</span>
              <span className="font-semibold">{patient.dateOfBirth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gender:</span>
              <span className="font-semibold">{patient.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span
                className={`font-semibold px-2 py-1 rounded text-xs ${
                  patient.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {patient.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Visit:</span>
              <span className="font-semibold">{patient.lastVisit}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientGrid;
