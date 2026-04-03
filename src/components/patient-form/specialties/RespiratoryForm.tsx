'use client';

import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Card } from '@/components/ui/Card';

interface RespiratoryFormProps {
  data?: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export default function RespiratoryForm({ data = {}, onChange }: RespiratoryFormProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-4 border-[rgba(0,212,255,0.15)] bg-gradient-to-r from-[#162236] to-[#0F1B2D]">
        <h3 className="font-bold text-[#00D4FF] mb-2">🫁 Respiratory Assessment</h3>
        <p className="text-sm text-[#8BA3BE]">Lungs and respiratory system evaluation</p>
      </Card>

      {/* Chief Complaint */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Chief Complaint *</label>
        <textarea
          placeholder="Cough, dyspnea, chest pain, etc."
          value={data.chiefComplaint || ''}
          onChange={(e) => handleChange('chiefComplaint', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={3}
        />
      </div>

      {/* Respiratory Symptoms */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">Respiratory Symptoms</label>
        <div className="space-y-2">
          {['Cough', 'Shortness of Breath', 'Wheezing', 'Stridor', 'Chest Pain', 'Hemoptysis', 'Sputum Production'].map((symptom) => (
            <label key={symptom} className="flex items-center gap-3 p-2 rounded hover:bg-[#162236] cursor-pointer transition">
              <Checkbox
                checked={data.respiratorySymptoms?.includes(symptom) || false}
                onChange={() => {
                  const current = data.respiratorySymptoms || [];
                  const updated = current.includes(symptom)
                    ? current.filter((t: string) => t !== symptom)
                    : [...current, symptom];
                  handleChange('respiratorySymptoms', updated);
                }}
              />
              <span className="text-sm text-[#E8F4FD]">{symptom}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Respiratory Conditions */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">Respiratory Conditions</label>
        <div className="space-y-2">
          {['Asthma', 'COPD', 'Pneumonia', 'Tuberculosis', 'Pulmonary Fibrosis', 'Sleep Apnea', 'Cystic Fibrosis', 'Bronchiectasis', 'Lung Cancer'].map((condition) => (
            <label key={condition} className="flex items-center gap-3 p-2 rounded hover:bg-[#162236] cursor-pointer transition">
              <Checkbox
                checked={data.respiratoryConditions?.includes(condition) || false}
                onChange={() => {
                  const current = data.respiratoryConditions || [];
                  const updated = current.includes(condition)
                    ? current.filter((t: string) => t !== condition)
                    : [...current, condition];
                  handleChange('respiratoryConditions', updated);
                }}
              />
              <span className="text-sm text-[#E8F4FD]">{condition}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Lung Function */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#00D4FF]">FEV1 (%)</label>
          <Input type="number" placeholder="80" value={data.fev1 || ''} onChange={(e) => handleChange('fev1', e.target.value)}
            className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#00D4FF]">FVC (%)</label>
          <Input type="number" placeholder="85" value={data.fvc || ''} onChange={(e) => handleChange('fvc', e.target.value)}
            className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]" />
        </div>
      </div>

      {/* Smoking Status */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">Smoking Status</label>
        <div className="space-y-2">
          {['Never smoker', 'Former smoker', 'Current smoker'].map((status) => (
            <label key={status} className="flex items-center gap-3 p-2 rounded hover:bg-[#162236] cursor-pointer transition">
              <Checkbox
                checked={data.smokingStatus === status}
                onChange={() => handleChange('smokingStatus', status)}
              />
              <span className="text-sm text-[#E8F4FD]">{status}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Pack-years */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Pack-years (if smoker)</label>
        <Input type="number" placeholder="0" value={data.packYears || ''} onChange={(e) => handleChange('packYears', e.target.value)}
          className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]" />
      </div>

      {/* Environmental Exposures */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Environmental/Occupational Exposures</label>
        <textarea
          placeholder="Asbestos, dust, chemicals, air pollution..."
          value={data.environmentalExposures || ''}
          onChange={(e) => handleChange('environmentalExposures', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={2}
        />
      </div>

      {/* Current Respiratory Medications */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Respiratory Medications</label>
        <textarea
          placeholder="Inhalers, nebulizers, oxygen, etc."
          value={data.respiratoryMeds || ''}
          onChange={(e) => handleChange('respiratoryMeds', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={2}
        />
      </div>

      <motion.div className="p-4 rounded-lg bg-gradient-to-r from-[#00D4FF]/10 to-[#00A8D4]/10 border border-[#00D4FF]/30"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p className="text-sm text-[#00D4FF]">✓ Respiratory assessment completed</p>
      </motion.div>
    </motion.div>
  );
}
