'use client';

import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Card } from '@/components/ui/Card';

interface PediatricsFormProps {
  data?: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export default function PediatricsForm({ data = {}, onChange }: PediatricsFormProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-4 border-[rgba(0,212,255,0.15)] bg-gradient-to-r from-[#162236] to-[#0F1B2D]">
        <h3 className="font-bold text-[#00D4FF] mb-2">👶 Pediatrics Assessment</h3>
        <p className="text-sm text-[#8BA3BE]">Children and adolescent medical evaluation</p>
      </Card>

      {/* Child Information */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#00D4FF]">Age (Years)</label>
          <Input type="number" placeholder="5" value={data.age || ''} onChange={(e) => handleChange('age', e.target.value)}
            className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#00D4FF]">Weight (kg)</label>
          <Input type="number" placeholder="20" value={data.weight || ''} onChange={(e) => handleChange('weight', e.target.value)}
            className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]" />
        </div>
      </div>

      {/* Chief Complaint */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Chief Complaint *</label>
        <textarea
          placeholder="Fever, cough, rash, difficulty eating, etc."
          value={data.chiefComplaint || ''}
          onChange={(e) => handleChange('chiefComplaint', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={3}
        />
      </div>

      {/* Symptoms */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">Symptoms</label>
        <div className="space-y-2">
          {['Fever', 'Cough', 'Rash', 'Vomiting', 'Diarrhea', 'Ear Pain', 'Sore Throat', 'Lethargy'].map((symptom) => (
            <label key={symptom} className="flex items-center gap-3 p-2 rounded hover:bg-[#162236] cursor-pointer transition">
              <Checkbox
                checked={data.symptoms?.includes(symptom) || false}
                onChange={() => {
                  const current = data.symptoms || [];
                  const updated = current.includes(symptom)
                    ? current.filter((t: string) => t !== symptom)
                    : [...current, symptom];
                  handleChange('symptoms', updated);
                }}
              />
              <span className="text-sm text-[#E8F4FD]">{symptom}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Immunization Status */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">Immunization Status</label>
        <div className="space-y-2">
          {['Up to date', 'Partially vaccinated', 'Not vaccinated'].map((status) => (
            <label key={status} className="flex items-center gap-3 p-2 rounded hover:bg-[#162236] cursor-pointer transition">
              <Checkbox
                checked={data.immunizationStatus === status}
                onChange={() => handleChange('immunizationStatus', status)}
              />
              <span className="text-sm text-[#E8F4FD]">{status}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Developmental History */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Developmental Milestones</label>
        <textarea
          placeholder="Walking, talking, other developmental notes..."
          value={data.developmentalMilestones || ''}
          onChange={(e) => handleChange('developmentalMilestones', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={2}
        />
      </div>

      {/* Birth History */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Birth History</label>
        <textarea
          placeholder="Complications, prematurity, birth weight..."
          value={data.birthHistory || ''}
          onChange={(e) => handleChange('birthHistory', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={2}
        />
      </div>

      {/* Allergies & Medications */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Current Medications</label>
        <textarea
          placeholder="List all medications including vitamins..."
          value={data.currentMedications || ''}
          onChange={(e) => handleChange('currentMedications', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={2}
        />
      </div>

      <motion.div className="p-4 rounded-lg bg-gradient-to-r from-[#00D4FF]/10 to-[#00A8D4]/10 border border-[#00D4FF]/30"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p className="text-sm text-[#00D4FF]">✓ Pediatrics assessment completed</p>
      </motion.div>
    </motion.div>
  );
}
