import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PatientState, Patient } from '../types';

const initialState: PatientState = {
  patients: [],
  loading: false,
  error: null,
  selectedPatient: null,
};

// Mock patient data
const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1-555-0101',
    dateOfBirth: '1985-03-15',
    gender: 'Male',
    address: '123 Main St, New York, NY',
    medicalHistory: 'Diabetes, Hypertension',
    lastVisit: '2024-02-20',
    status: 'Active',
    appointmentDate: '2024-03-25',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1-555-0102',
    dateOfBirth: '1990-07-22',
    gender: 'Female',
    address: '456 Oak Ave, Los Angeles, CA',
    medicalHistory: 'Asthma',
    lastVisit: '2024-02-18',
    status: 'Active',
    appointmentDate: '2024-03-28',
  },
  {
    id: '3',
    name: 'Robert Wilson',
    email: 'robert@example.com',
    phone: '+1-555-0103',
    dateOfBirth: '1978-11-08',
    gender: 'Male',
    address: '789 Pine Rd, Chicago, IL',
    medicalHistory: 'Heart Disease, Cholesterol',
    lastVisit: '2024-02-15',
    status: 'Active',
    appointmentDate: '2024-03-30',
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1-555-0104',
    dateOfBirth: '1995-01-12',
    gender: 'Female',
    address: '321 Elm St, Houston, TX',
    medicalHistory: 'None',
    lastVisit: '2024-02-22',
    status: 'Active',
    appointmentDate: '2024-03-22',
  },
  {
    id: '5',
    name: 'Michael Brown',
    email: 'michael@example.com',
    phone: '+1-555-0105',
    dateOfBirth: '1988-05-30',
    gender: 'Male',
    address: '654 Maple Dr, Phoenix, AZ',
    medicalHistory: 'Migraine',
    lastVisit: '2024-02-19',
    status: 'Inactive',
    appointmentDate: '2024-04-05',
  },
];

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setPatients(state, action: PayloadAction<Patient[]>) {
      state.patients = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedPatient(state, action: PayloadAction<Patient | null>) {
      state.selectedPatient = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearError(state) {
      state.error = null;
    },
    addPatient(state, action: PayloadAction<Patient>) {
      state.patients.push(action.payload);
    },
    updatePatient(state, action: PayloadAction<Patient>) {
      const index = state.patients.findIndex((p) => p.id === action.payload.id);
      if (index >= 0) {
        state.patients[index] = action.payload;
      }
    },
    initializeMockData(state) {
      state.patients = mockPatients;
    },
  },
});

export const {
  setLoading,
  setPatients,
  setSelectedPatient,
  setError,
  clearError,
  addPatient,
  updatePatient,
  initializeMockData,
} = patientSlice.actions;

export default patientSlice.reducer;
