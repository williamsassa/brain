'use client';

import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Card } from '@/components/ui/Card';

interface OncologyFormProps {
  data?: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export default function OncologyForm({ data = {}, onChange }: OncologyFormProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-4 border-[rgba(0,212,255,0.15)] bg-gradient-to-r from-[#162236] to-[#0F1B2D]">
        <h3 className="font-bold text-[#00D4FF] mb-2">🧬 Oncology Assessment</h3>
        <p className="text-sm text-[#8BA3BE]">Cancer screening and tumor management</p>
      </Card>

      {/* Chief Complaint */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Chief Complaint *</label>
        <textarea
          placeholder="Screening, symptoms, follow-up..."
          value={data.chiefComplaint || ''}
          onChange={(e) => handleChange('chiefComplaint', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={3}
        />
      </div>

      {/* Cancer History */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">Personal Cancer History</label>
        <textarea
          placeholder="Type, stage, treatment dates, current status..."
          value={data.cancerHistory || ''}
          onChange={(e) => handleChange('cancerHistory', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={2}
        />
      </div>

      {/* Family History */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">Family Cancer History</label>
        <textarea
          placeholder="Relative relationships, cancer types, age of diagnosis..."
          value={data.familyCancerHistory || ''}
          onChange={(e) => handleChange('familyCancerHistory', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={2}
        />
      </div>

      {/* Risk Factors */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">Cancer Risk Factors</label>
        <div className="space-y-2">
          {['Smoking', 'Heavy Alcohol Use', 'Obesity', 'HPV Infection', 'HBV/HCV', 'Radiation Exposure', 'Chemical Exposure'].map((factor) => (
            <label key={factor} className="flex items-center gap-3 p-2 rounded hover:bg-[#162236] cursor-pointer transition">
              <Checkbox
                checked={data.riskFactors?.includes(factor) || false}
                onChange={() => {
                  const current = data.riskFactors || [];
                  const updated = current.includes(factor)
                    ? current.filter((t: string) => t !== factor)
                    : [...current, factor];
                  handleChange('riskFactors', updated);
                }}
              />
              <span className="text-sm text-[#E8F4FD]">{factor}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Current Symptoms */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">Current Symptoms</label>
        <div className="space-y-2">
          {['Weight Loss', 'Fatigue', 'Pain', 'Bleeding', 'Lymphadenopathy', 'Night Sweats'].map((symptom) => (
            <label key={symptom} className="flex items-center gap-3 p-2 rounded hover:bg-[#162236] cursor-pointer transition">
              <Checkbox
                checked={data.currentSymptoms?.includes(symptom) || false}
                onChange={() => {
                  const current = data.currentSymptoms || [];
                  const updated = current.includes(symptom)
                    ? current.filter((t: string) => t !== symptom)
                    : [...current, symptom];
                  handleChange('currentSymptoms', updated);
                }}
              />
              <span className="text-sm text-[#E8F4FD]">{symptom}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Recent Exams & Tests */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Recent Tests & Imaging</label>
        <textarea
          placeholder="Imaging results, biopsy, tumor markers..."
          value={data.recentTests || ''}
          onChange={(e) => handleChange('recentTests', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={2}
        />
      </div>

      {/* Current Treatment */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Current Treatment Plan</label>
        <textarea
          placeholder="Chemotherapy, radiation, surgery, immunotherapy..."
          value={data.currentTreatment || ''}
          onChange={(e) => handleChange('currentTreatment', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={2}
        />
      </div>

      {/* Side Effects */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Treatment Side Effects</label>
        <textarea
          placeholder="Nausea, hair loss, neuropathy, fatigue..."
          value={data.sideEffects || ''}
          onChange={(e) => handleChange('sideEffects', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={2}
        />
      </div>

      <motion.div className="p-4 rounded-lg bg-gradient-to-r from-[#00D4FF]/10 to-[#00A8D4]/10 border border-[#00D4FF]/30"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p className="text-sm text-[#00D4FF]">✓ Oncology assessment completed</p>
      </motion.div>
    </motion.div>
  );
}
