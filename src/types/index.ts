export type PatientCondition = 'Critical' | 'Stable' | 'Recovering' | 'Routine Checkup' | 'Under Observation';
export type PatientGender = 'Male' | 'Female' | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin';
}

export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  patientCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: PatientGender;
  condition: PatientCondition;
  phone: string;
  doctorId: Doctor | string;
  admissionDate: string;
  medicalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: Pagination;
  filters?: {
    specializations?: string[];
    hospitals?: string[];
    conditions?: string[];
  };
}

export interface AnalyticsSummary {
  totalDoctors: number;
  totalPatients: number;
  avgPatientsPerDoctor: number;
  criticalCases: number;
  stableCases: number;
  recoveringCases: number;
  conditionDistribution: Array<{ condition: string; count: number }>;
}

export interface TrendItem {
  date: string;
  admissions: number;
}

export interface DoctorWorkloadItem {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  patientCount: number;
}
