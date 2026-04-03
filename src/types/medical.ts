import { Specialty } from './specialty';

export interface Diagnosis {
  title: string;
  icdCode: string;
  confidence: number;
  evidenceLevel: 'A' | 'B' | 'C';
  causalPathway: string;
  isPrimary?: boolean;
}

export interface MedicalSource {
  id: string;
  title: string;
  authors?: string;
  year?: number;
  url: string;
  doi?: string;
  pubmedId?: string;
  source: 'PubMed' | 'WHO' | 'ESC' | 'ACC' | 'AHA' | 'NICE' | 'HAS' | 'Cochrane' | 'Other';
}

export interface SOAPReport {
  subjective: {
    chiefComplaint: string;
    historyOfPresentIllness: string;
    pastMedicalHistory: string;
    medications: string[];
    allergies: string[];
  };
  objective: {
    vitalSigns: Record<string, any>;
    physicalExamination: string;
    labResults?: string;
    imagingResults?: string;
  };
  assessment: {
    primaryDiagnosis: Diagnosis;
    differentialDiagnoses: Diagnosis[];
    causalAnalysis: string;
  };
  plan: {
    treatment: string[];
    medications: string[];
    followUp: string;
    referrals?: string;
    urgentFlags?: string[];
  };
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  specialty: Specialty;
  status: 'in_progress' | 'completed' | 'cancelled';
  chiefComplaint: string;
  startedAt: Date;
  completedAt?: Date;
  soapReport?: SOAPReport;
  pdfUrl?: string;
  createdAt: Date;
}

export interface MedicalContext {
  specialty: Specialty;
  language: 'en' | 'fr';
  patientAge?: number;
  isDiabetic?: boolean;
  isHypertensive?: boolean;
  riskFactors?: string[];
}
