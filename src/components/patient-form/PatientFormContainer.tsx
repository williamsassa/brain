'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PatientForm, PatientIdentity, VitalSigns, MedicalHistory } from '@/types';
import { usePatientStore } from '@/store/patientStore';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/Button';
import CommonSection from './sections/CommonSection';
import VitalSignsSection from './sections/VitalSigns';
import CardiologyForm from './specialties/CardiologyForm';
import GeneralMedicineForm from './specialties/GeneralMedicineForm';
import OphthalmologyForm from './specialties/OphthalmologyForm';
import DermatologyForm from './specialties/DermatologyForm';
import DentistryForm from './specialties/DentistryForm';
import PediatricsForm from './specialties/PediatricsForm';
import PsychiatryForm from './specialties/PsychiatryForm';
import AnesthesiologyForm from './specialties/AnesthesiologyForm';
import EndocrinologyForm from './specialties/EndocrinologyForm';
import OncologyForm from './specialties/OncologyForm';
import RespiratoryForm from './specialties/RespiratoryForm';
import { CheckCircle, AlertCircle, ChevronDown, Save, UserPlus, Activity, Stethoscope, FileText } from 'lucide-react';

export default function PatientFormContainer() {
  const { doctor } = useAuthStore();
  const { currentPatient, updateCurrentPatient } = usePatientStore();
  const { language } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    common: true,
    vitals: true,
    complaint: true,
    specialty: false,
  });

  // Auto-analysis debounce
  const autoAnalysisTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastAnalyzedDataRef = useRef<string>('');

  // Auto-analysis: trigger when form data changes significantly
  const triggerAutoAnalysis = useCallback((fieldName: string, newValue: any) => {
    if (!currentPatient || !doctor) return;

    // Clear previous timer
    if (autoAnalysisTimerRef.current) {
      clearTimeout(autoAnalysisTimerRef.current);
    }

    // Debounce: wait 2 seconds after last change
    autoAnalysisTimerRef.current = setTimeout(async () => {
      const dataSnapshot = JSON.stringify({
        identity: currentPatient.identity,
        vitals: currentPatient.vitals,
        chiefComplaint: currentPatient.chiefComplaint,
        medicalHistory: currentPatient.medicalHistory,
        specialtyData: currentPatient.specialtyData,
      });

      // Only analyze if data actually changed
      if (dataSnapshot === lastAnalyzedDataRef.current) return;
      lastAnalyzedDataRef.current = dataSnapshot;

      // Only auto-analyze if there's enough data
      const hasBasicData = currentPatient.identity?.firstName || currentPatient.chiefComplaint ||
        currentPatient.vitals?.systolic || currentPatient.vitals?.heartRate;
      if (!hasBasicData) return;

      // Build analysis prompt
      const prompt = language === 'en'
        ? `The doctor just updated the patient form field "${fieldName}" with value: ${JSON.stringify(newValue)}. Analyze this new information in the context of all available patient data.`
        : `Le médecin vient de mettre à jour le champ "${fieldName}" avec la valeur : ${JSON.stringify(newValue)}. Analysez cette information dans le contexte de toutes les données patient disponibles.`;

      try {
        const { useChatStore } = await import('@/store/chatStore');
        const store = useChatStore.getState();
        const { v4: uuidv4 } = await import('uuid');

        // Add system message
        store.addMessage({
          id: uuidv4(),
          role: 'user',
          content: prompt,
          messageType: 'system',
          createdAt: new Date(),
          timestamp: Date.now(),
        });
        store.setLoading(true);

        const patientData = {
          identity: currentPatient.identity,
          vitals: currentPatient.vitals,
          medicalHistory: currentPatient.medicalHistory,
          chiefComplaint: currentPatient.chiefComplaint,
          symptoms: currentPatient.additionalSymptoms,
          painScale: currentPatient.painScale,
          specialtyData: currentPatient.specialtyData,
        };

        const messages = [...store.messages.slice(-10)].map(m => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages,
            patientData,
            specialty: doctor.specialty,
            language,
            isAutoAnalysis: true,
          }),
        });

        if (!response.ok || !response.body) {
          store.setLoading(false);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let content = '';

        store.addMessage({
          id: uuidv4(),
          role: 'assistant',
          content: '',
          messageType: 'text',
          createdAt: new Date(),
          timestamp: Date.now(),
        });

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          content += decoder.decode(value, { stream: true });
          store.updateLastMessage(content);
        }

        store.setLoading(false);
      } catch (error) {
        console.error('Auto-analysis error:', error);
        const { useChatStore } = await import('@/store/chatStore');
        useChatStore.getState().setLoading(false);
      }
    }, 2500);
  }, [currentPatient, doctor, language]);

  const handleIdentityChange = (data: Partial<PatientIdentity>) => {
    updateCurrentPatient({
      identity: { ...currentPatient?.identity, ...data },
    });
    const key = Object.keys(data)[0];
    if (key && data[key as keyof PatientIdentity]) {
      triggerAutoAnalysis(`Patient ${key}`, data[key as keyof PatientIdentity]);
    }
  };

  const handleVitalsChange = (data: Partial<VitalSigns>) => {
    updateCurrentPatient({
      vitals: { ...currentPatient?.vitals, ...data },
    });
    const key = Object.keys(data)[0];
    if (key && data[key as keyof VitalSigns]) {
      triggerAutoAnalysis(`Vital sign: ${key}`, data[key as keyof VitalSigns]);
    }
  };

  const handleMedicalHistoryChange = (data: Partial<MedicalHistory>) => {
    updateCurrentPatient({
      medicalHistory: { ...currentPatient?.medicalHistory, ...data },
    });
    const key = Object.keys(data)[0];
    if (key) {
      triggerAutoAnalysis(`Medical history: ${key}`, data[key as keyof MedicalHistory]);
    }
  };

  const handleChiefComplaintChange = (complaint: string) => {
    updateCurrentPatient({ chiefComplaint: complaint });
    if (complaint.length > 10) {
      triggerAutoAnalysis('Chief complaint', complaint);
    }
  };

  const handleSpecialtyDataChange = (data: Record<string, any>) => {
    updateCurrentPatient({
      specialtyData: { ...currentPatient?.specialtyData, ...data },
    });
    const key = Object.keys(data)[0];
    if (key) {
      triggerAutoAnalysis(`Specialty data: ${key}`, data[key]);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSavePatient = async () => {
    if (!currentPatient || !doctor) return;
    setIsSaving(true);
    try {
      if (!currentPatient.identity?.firstName || !currentPatient.identity?.lastName) {
        return;
      }
      // TODO: Save to Supabase
      console.log('Saving patient:', currentPatient);
    } catch (error) {
      console.error('Error saving patient:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentPatient) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-20">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[#00D4FF]"
        >
          <Activity size={32} />
        </motion.div>
        <p className="text-[#8BA3BE] mt-4 text-sm">Initializing patient form...</p>
      </div>
    );
  }

  const isCommonFilled = !!(currentPatient.identity?.firstName && currentPatient.identity?.lastName);
  const isVitalsFilled = !!(currentPatient.vitals?.systolic && currentPatient.vitals?.heartRate);
  const hasComplaint = !!(currentPatient.chiefComplaint && currentPatient.chiefComplaint.length > 3);

  const filledCount = [isCommonFilled, isVitalsFilled, hasComplaint].filter(Boolean).length;
  const progressPercent = Math.round((filledCount / 3) * 100);

  const specialtyFormMap: Record<string, React.FC<{ data: Record<string, any>; onChange: (data: Record<string, any>) => void }>> = {
    cardiology: CardiologyForm,
    general: GeneralMedicineForm,
    ophthalmology: OphthalmologyForm,
    dermatology: DermatologyForm,
    dentistry: DentistryForm,
    pediatrics: PediatricsForm,
    psychiatry: PsychiatryForm,
    anesthesiology: AnesthesiologyForm,
    endocrinology: EndocrinologyForm,
    oncology: OncologyForm,
    respiratory: RespiratoryForm,
  };

  const SpecialtyFormComponent = doctor?.specialty ? specialtyFormMap[doctor.specialty] : null;

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#8BA3BE]">{language === 'en' ? 'Completion' : 'Progression'}</span>
          <span className="text-[#00D4FF] font-medium">{progressPercent}%</span>
        </div>
        <div className="h-1.5 bg-[#162236] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#00D4FF] to-[#00E5A0] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {/* Patient Identity */}
        <SectionAccordion
          title={language === 'en' ? 'Patient Identity' : 'Identité du Patient'}
          icon={<UserPlus size={16} />}
          isComplete={isCommonFilled}
          isExpanded={expandedSections.common}
          onToggle={() => toggleSection('common')}
        >
          <CommonSection data={currentPatient.identity} onChange={handleIdentityChange} />
        </SectionAccordion>

        {/* Vital Signs */}
        <SectionAccordion
          title={language === 'en' ? 'Vital Signs' : 'Signes Vitaux'}
          icon={<Activity size={16} />}
          isComplete={isVitalsFilled}
          isExpanded={expandedSections.vitals}
          onToggle={() => toggleSection('vitals')}
        >
          <VitalSignsSection data={currentPatient.vitals} onChange={handleVitalsChange} />
        </SectionAccordion>

        {/* Chief Complaint */}
        <SectionAccordion
          title={language === 'en' ? 'Chief Complaint' : 'Motif de Consultation'}
          icon={<FileText size={16} />}
          isComplete={hasComplaint}
          isExpanded={expandedSections.complaint}
          onToggle={() => toggleSection('complaint')}
        >
          <div className="space-y-3 pt-3">
            <textarea
              value={currentPatient.chiefComplaint || ''}
              onChange={(e) => handleChiefComplaintChange(e.target.value)}
              placeholder={language === 'en' ? 'Describe the chief complaint...' : 'Décrivez le motif de consultation...'}
              rows={3}
              className="w-full p-3 rounded-lg bg-[#0A1628] border border-[#00D4FF]/10 text-[#E8F4FD] placeholder-[#8BA3BE]/50 focus:border-[#00D4FF]/40 focus:outline-none resize-none text-sm transition-all"
            />
            <div className="space-y-2">
              <label className="text-xs text-[#8BA3BE]">{language === 'en' ? 'Pain Scale' : 'Échelle de douleur'}: {currentPatient.painScale || 0}/10</label>
              <input
                type="range"
                min="0"
                max="10"
                value={currentPatient.painScale || 0}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  updateCurrentPatient({ painScale: val });
                  if (val > 0) triggerAutoAnalysis('Pain scale', val);
                }}
                className="w-full h-2 bg-[#162236] rounded-lg appearance-none cursor-pointer accent-[#00D4FF]"
              />
              <div className="flex justify-between text-[10px] text-[#8BA3BE]">
                <span>0 - {language === 'en' ? 'No pain' : 'Aucune'}</span>
                <span>10 - {language === 'en' ? 'Worst pain' : 'Maximale'}</span>
              </div>
            </div>
          </div>
        </SectionAccordion>

        {/* Specialty Section */}
        {SpecialtyFormComponent && (
          <SectionAccordion
            title={`${doctor?.specialty ? doctor.specialty.charAt(0).toUpperCase() + doctor.specialty.slice(1) : ''} ${language === 'en' ? 'Assessment' : 'Évaluation'}`}
            icon={<Stethoscope size={16} />}
            isComplete={false}
            isExpanded={expandedSections.specialty}
            onToggle={() => toggleSection('specialty')}
          >
            <SpecialtyFormComponent
              data={currentPatient.specialtyData || {}}
              onChange={handleSpecialtyDataChange}
            />
          </SectionAccordion>
        )}
      </div>

      {/* Save Button */}
      <div className="flex-shrink-0 pt-3 border-t border-[#00D4FF]/8">
        <Button
          onClick={handleSavePatient}
          className="w-full bg-gradient-to-r from-[#00D4FF] to-[#00A8D4] hover:from-[#00B8FF] hover:to-[#0088B8] text-[#0A1628] font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-cyan-500/10"
          disabled={!isCommonFilled || isSaving}
        >
          <Save size={16} className="mr-2" />
          {isSaving
            ? (language === 'en' ? 'Saving...' : 'Enregistrement...')
            : (language === 'en' ? 'Save Patient' : 'Enregistrer Patient')}
        </Button>
      </div>
    </div>
  );
}

// Reusable accordion section component
function SectionAccordion({ title, icon, isComplete, isExpanded, onToggle, children }: {
  title: string;
  icon: React.ReactNode;
  isComplete: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border transition-all duration-200 ${
      isExpanded
        ? 'border-[#00D4FF]/20 bg-[#0D1B2A]/60'
        : 'border-[#00D4FF]/8 bg-[#0D1B2A]/30 hover:border-[#00D4FF]/15'
    }`}>
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between transition-all"
      >
        <div className="flex items-center gap-3">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
            isComplete
              ? 'bg-[#00E5A0]/15 text-[#00E5A0]'
              : 'bg-[#162236] text-[#8BA3BE]'
          }`}>
            {isComplete ? <CheckCircle size={14} /> : icon}
          </div>
          <span className="text-sm font-medium text-[#E8F4FD]">{title}</span>
          {isComplete && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00E5A0]/10 text-[#00E5A0] font-medium">
              Done
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-[#8BA3BE]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
