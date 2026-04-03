export type Specialty =
  | 'general'
  | 'cardiology'
  | 'ophthalmology'
  | 'dermatology'
  | 'dentistry'
  | 'pediatrics'
  | 'psychiatry'
  | 'anesthesiology'
  | 'endocrinology'
  | 'oncology'
  | 'respiratory';

export interface SpecialtyConfig {
  id: Specialty;
  name: string;
  nameFr: string;
  icon: string;
  description: string;
  descriptionFr: string;
  color: string;
}

export const SPECIALTIES: Record<Specialty, SpecialtyConfig> = {
  general: {
    id: 'general',
    name: 'General Medicine',
    nameFr: 'Médecine Générale',
    icon: '⚕️',
    description: 'General Practice & Primary Care',
    descriptionFr: 'Pratique générale et soins primaires',
    color: '#2ECC71'
  },
  cardiology: {
    id: 'cardiology',
    name: 'Cardiology',
    nameFr: 'Cardiologie',
    icon: '🫀',
    description: 'Heart and Cardiovascular System',
    descriptionFr: 'Cœur et système cardiovasculaire',
    color: '#FF4757'
  },
  ophthalmology: {
    id: 'ophthalmology',
    name: 'Ophthalmology',
    nameFr: 'Ophtalmologie',
    icon: '👁️',
    description: 'Eye and Vision',
    descriptionFr: 'Œil et vision',
    color: '#00D4FF'
  },
  dermatology: {
    id: 'dermatology',
    name: 'Dermatology',
    nameFr: 'Dermatologie',
    icon: '🧴',
    description: 'Skin and Dermatological Conditions',
    descriptionFr: 'Peau et conditions dermatologiques',
    color: '#FFB347'
  },
  dentistry: {
    id: 'dentistry',
    name: 'Dentistry',
    nameFr: 'Dentisterie',
    icon: '🦷',
    description: 'Teeth and Oral Health',
    descriptionFr: 'Dents et santé buccale',
    color: '#00E5A0'
  },
  pediatrics: {
    id: 'pediatrics',
    name: 'Pediatrics',
    nameFr: 'Pédiatrie',
    icon: '👶',
    description: 'Children and Adolescent Medicine',
    descriptionFr: 'Médecine pédiatrique et de l\'adolescent',
    color: '#FF6B9D'
  },
  psychiatry: {
    id: 'psychiatry',
    name: 'Psychiatry',
    nameFr: 'Psychiatrie',
    icon: '🧠',
    description: 'Mental Health and Behavior',
    descriptionFr: 'Santé mentale et comportement',
    color: '#5352ED'
  },
  anesthesiology: {
    id: 'anesthesiology',
    name: 'Anesthesiology',
    nameFr: 'Anesthésiologie',
    icon: '💉',
    description: 'Anesthesia and Pain Management',
    descriptionFr: 'Anesthésie et gestion de la douleur',
    color: '#FFA502'
  },
  endocrinology: {
    id: 'endocrinology',
    name: 'Endocrinology',
    nameFr: 'Endocrinologie',
    icon: '⚗️',
    description: 'Hormones and Metabolism',
    descriptionFr: 'Hormones et métabolisme',
    color: '#00D4AA'
  },
  oncology: {
    id: 'oncology',
    name: 'Oncology',
    nameFr: 'Oncologie',
    icon: '🧬',
    description: 'Cancer and Tumors',
    descriptionFr: 'Cancer et tumeurs',
    color: '#A100F2'
  },
  respiratory: {
    id: 'respiratory',
    name: 'Respiratory',
    nameFr: 'Respiratoire',
    icon: '🫁',
    description: 'Lungs and Respiratory System',
    descriptionFr: 'Poumons et système respiratoire',
    color: '#3498DB'
  }
};
