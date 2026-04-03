'use client';

import { motion } from 'framer-motion';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';

interface GeneralMedicineFormProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export default function GeneralMedicineForm({ data, onChange }: GeneralMedicineFormProps) {
  const handleChange = (key: string, value: any) => {
    onChange({ [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)]">
        <h3 className="font-semibold text-[#00D4FF] mb-2">⚕️ General Medicine Assessment</h3>
        <p className="text-sm text-[#8BA3BE]">
          Comprehensive general medical examination and patient history
        </p>
      </div>

      {/* Chief Complaint */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Chief Complaint</label>
        <textarea
          placeholder="Describe main reason for visit..."
          value={data.chiefComplaint || ''}
          onChange={(e) => handleChange('chiefComplaint', e.target.value)}
          className="w-full px-3 py-2 rounded bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] placeholder-[#8BA3BE] focus:border-[#00D4FF] focus:outline-none"
          rows={3}
        />
      </div>

      {/* Reason for Visit */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Reason for Visit</label>
        <Select
          value={data.reasonForVisit || ''}
          onChange={(e) => handleChange('reasonForVisit', e.target.value)}
          className="w-full px-3 py-2 rounded bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD]"
        >
          <option value="">Select reason...</option>
          <option value="routine_checkup">Routine Check-up</option>
          <option value="acute_illness">Acute Illness</option>
          <option value="chronic_management">Chronic Disease Management</option>
          <option value="preventive">Preventive Care</option>
          <option value="follow_up">Follow-up</option>
          <option value="other">Other</option>
        </Select>
      </div>

      {/* Duration of Symptoms */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Duration of Symptoms</label>
        <Input
          type="text"
          placeholder="e.g., 3 days, 2 weeks, 1 month"
          value={data.symptomDuration || ''}
          onChange={(e) => handleChange('symptomDuration', e.target.value)}
          className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]"
        />
      </div>

      {/* Associated Symptoms */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">Associated Symptoms</label>
        <div className="space-y-2">
          {[
            { id: 'fever', label: 'Fever 🌡️' },
            { id: 'cough', label: 'Cough 💨' },
            { id: 'fatigue', label: 'Fatigue 😴' },
            { id: 'bodyAches', label: 'Body Aches 💪' },
            { id: 'headache', label: 'Headache 🤕' },
            { id: 'shortnessOfBreath', label: 'Shortness of Breath 🫁' },
            { id: 'nausea', label: 'Nausea 🤢' },
            { id: 'diarrhea', label: 'Diarrhea 🚽' },
          ].map((symptom) => (
            <label key={symptom.id} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={data.symptoms?.[symptom.id] || false}
                onChange={(e) => {
                  const symptoms = { ...data.symptoms, [symptom.id]: e.target.checked };
                  handleChange('symptoms', symptoms);
                }}
                className="w-4 h-4 rounded border-[rgba(0,212,255,0.3)] bg-[#162236] cursor-pointer"
              />
              <span className="text-[#E8F4FD]">{symptom.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Current Medications */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Current Medications</label>
        <textarea
          placeholder="List current medications (one per line)..."
          value={data.currentMedications || ''}
          onChange={(e) => handleChange('currentMedications', e.target.value)}
          className="w-full px-3 py-2 rounded bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] placeholder-[#8BA3BE] focus:border-[#00D4FF] focus:outline-none"
          rows={3}
        />
      </div>

      {/* Allergies */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Allergies ⚠️</label>
        <textarea
          placeholder="List known allergies..."
          value={data.allergies || ''}
          onChange={(e) => handleChange('allergies', e.target.value)}
          className="w-full px-3 py-2 rounded bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] placeholder-[#8BA3BE] focus:border-[#00D4FF] focus:outline-none"
          rows={2}
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Clinical Notes</label>
        <textarea
          placeholder="Additional clinical observations..."
          value={data.clinicalNotes || ''}
          onChange={(e) => handleChange('clinicalNotes', e.target.value)}
          className="w-full px-3 py-2 rounded bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] placeholder-[#8BA3BE] focus:border-[#00D4FF] focus:outline-none"
          rows={3}
        />
      </div>

      {/* Summary Card */}
      <motion.div
        className="p-4 rounded-lg bg-gradient-to-r from-[#00D4FF]/10 to-[#00A8D4]/10 border border-[#00D4FF]/30"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-sm text-[#00D4FF]">
          ✓ General medicine assessment ready for review and diagnosis
        </p>
      </motion.div>
    </div>
  );
}
