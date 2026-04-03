import { useAuthStore } from '@/store/authStore';
import { SPECIALTIES } from '@/types';

export const useSpecialty = () => {
  const { doctor } = useAuthStore();

  const currentSpecialty = doctor ? SPECIALTIES[doctor.specialty] : null;

  return {
    specialty: doctor?.specialty,
    specialtyConfig: currentSpecialty,
    allSpecialties: SPECIALTIES,
  };
};
