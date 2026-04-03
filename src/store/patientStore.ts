import { create } from 'zustand';
import { PatientForm } from '@/types';

interface PatientStoreState {
  currentPatient: PatientForm | null;
  patientList: PatientForm[];
  loading: boolean;
  saveProgress: number;

  setCurrentPatient: (patient: PatientForm) => void;
  updateCurrentPatient: (data: Partial<PatientForm>) => void;
  setPatientList: (patients: PatientForm[]) => void;
  addPatient: (patient: PatientForm) => void;
  setLoading: (loading: boolean) => void;
  setSaveProgress: (progress: number) => void;
  resetCurrentPatient: () => void;
}

export const usePatientStore = create<PatientStoreState>((set) => ({
  currentPatient: null,
  patientList: [],
  loading: false,
  saveProgress: 0,

  setCurrentPatient: (patient) => set({ currentPatient: patient, saveProgress: 0 }),
  updateCurrentPatient: (data) => set((state) => ({
    currentPatient: state.currentPatient
      ? { ...state.currentPatient, ...data, updatedAt: new Date() }
      : null,
  })),
  setPatientList: (patients) => set({ patientList: patients }),
  addPatient: (patient) => set((state) => ({
    patientList: [...state.patientList, patient],
  })),
  setLoading: (loading) => set({ loading }),
  setSaveProgress: (progress) => set({ saveProgress: progress }),
  resetCurrentPatient: () => set({ currentPatient: null, saveProgress: 0 }),
}));
