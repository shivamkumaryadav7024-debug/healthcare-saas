// Authentication Types
export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Patient Types
export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  medicalHistory: string;
  lastVisit: string;
  status: 'Active' | 'Inactive';
  appointmentDate: string;
}

export interface PatientState {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  selectedPatient: Patient | null;
}

// Analytics Types
export interface AnalyticsData {
  totalPatients: number;
  activeAppointments: number;
  completedAppointments: number;
  totalRevenue: number;
  monthlyData: MonthlyData[];
  departmentStats: DepartmentStat[];
}

export interface MonthlyData {
  month: string;
  appointments: number;
  revenue: number;
}

export interface DepartmentStat {
  name: string;
  count: number;
  revenue: number;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  timestamp: number;
  read: boolean;
}

export interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}
