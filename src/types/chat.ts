import { Diagnosis, MedicalSource } from './medical';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  messageType: 'text' | 'audio' | 'image' | 'system';
  metadata?: Record<string, any>;
  sources?: MedicalSource[];
  diagnoses?: Diagnosis[];
  createdAt: Date;
  timestamp?: number;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error?: string;
  consultationId?: string;
}

export interface ChatInputData {
  text?: string;
  audioUrl?: string;
  imageUrl?: string;
  type: 'text' | 'audio' | 'image';
}

export interface ChatStreamEvent {
  type: 'start' | 'delta' | 'end' | 'error';
  content?: string;
  diagnoses?: Diagnosis[];
  sources?: MedicalSource[];
  error?: string;
}

export interface QuickAction {
  label: string;
  labelFr: string;
  icon: string;
  prompt: string;
  promptFr: string;
}

export const QUICK_ACTIONS: QuickAction[] = [
  {
    label: 'Summarize',
    labelFr: 'Résumer',
    icon: '📋',
    prompt: 'Please summarize the key findings and provide a concise clinical summary.',
    promptFr: 'Résumez les conclusions clés et fournissez un résumé clinique concis.'
  },
  {
    label: 'Drug Interactions',
    labelFr: 'Interactions médicamenteuses',
    icon: '💊',
    prompt: 'Check for potential drug interactions with current medications and alert for any concerns.',
    promptFr: 'Vérifiez les interactions médicamenteuses potentielles et signalez les préoccupations.'
  },
  {
    label: 'Risk Assessment',
    labelFr: 'Évaluation des risques',
    icon: '📊',
    prompt: 'Provide a comprehensive risk assessment based on patient data and comorbidities.',
    promptFr: 'Fournissez une évaluation complète des risques basée sur les données du patient.'
  },
  {
    label: 'SOAP Report',
    labelFr: 'Rapport SOAP',
    icon: '🧾',
    prompt: 'Generate a comprehensive SOAP report (Subjective, Objective, Assessment, Plan).',
    promptFr: 'Générez un rapport SOAP complet (Subjectif, Objectif, Évaluation, Plan).'
  },
  {
    label: 'Differential Diagnosis',
    labelFr: 'Diagnostic différentiel',
    icon: '🔍',
    prompt: 'Provide a ranked list of differential diagnoses with confidence levels and rationale.',
    promptFr: 'Fournissez une liste classée de diagnostics différentiels avec niveaux de confiance.'
  },
  {
    label: 'Export PDF',
    labelFr: 'Exporter PDF',
    icon: '📤',
    prompt: 'Generate and download a comprehensive medical report in PDF format.',
    promptFr: 'Générez et téléchargez un rapport médical complet en format PDF.'
  }
];
