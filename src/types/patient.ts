import { Specialty } from './specialty';

export interface PatientIdentity {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'M' | 'F' | 'Other';
  bloodType?: string;
  height?: number;
  weight?: number;
  bmi?: number;
  address?: string;
  phone?: string;
  emergencyContact?: string;
}

export interface VitalSigns {
  systolic?: number;
  diastolic?: number;
  heartRate?: number;
  temperature?: number;
  o2Saturation?: number;
  respiratoryRate?: number;
}

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  forTreatment: string;
}

export interface MedicalHistory {
  familyHistory?: string;
  previousSurgeries?: string;
  chronicConditions?: string[];
  medications?: MedicationItem[];
  allergies?: string[];
  intolerances?: string[];
  vaccinationHistory?: string;
  tobacco?: { yes: boolean; quantity?: string };
  alcohol?: boolean;
  childDiseases?: string[];
}

export interface PatientForm {
  id: string;
  patientId?: string;
  consultationId?: string;
  specialty: Specialty;
  identity: PatientIdentity;
  vitals: VitalSigns;
  medicalHistory: MedicalHistory;
  chiefComplaint: string;
  symptomOnsetDate?: string;
  painScale?: number;
  additionalSymptoms?: string[];
  specialtyData?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Patient {
  id: string;
  doctorId: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'M' | 'F' | 'Other';
  bloodType?: string;
  height?: number;
  weight?: number;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  createdAt: Date;
  updatedAt: Date;
}
