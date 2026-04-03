'use client';

import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Card } from '@/components/ui/Card';

interface AnesthesiologyFormProps {
  data?: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export default function AnesthesiologyForm({ data = {}, onChange }: AnesthesiologyFormProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-4 border-[rgba(0,212,255,0.15)] bg-gradient-to-r from-[#162236] to-[#0F1B2D]">
        <h3 className="font-bold text-[#00D4FF] mb-2">💉 Anesthesiology Assessment</h3>
        <p className="text-sm text-[#8BA3BE]">Anesthesia and pain management evaluation</p>
      </Card>

      {/* Planned Procedure */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Planned Procedure</label>
        <Input
          placeholder="e.g., Surgery type and procedure"
          value={data.plannedProcedure || ''}
          onChange={(e) => handleChange('plannedProcedure', e.target.value)}
          className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]"
        />
      </div>

      {/* Anesthesia Type Preference */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">Previous Anesthesia Experience</label>
        <div className="space-y-2">
          {['General', 'Regional', 'Local', 'Never had anesthesia'].map((type) => (
            <label key={type} className="flex items-center gap-3 p-2 rounded hover:bg-[#162236] cursor-pointer transition">
              <Checkbox
                checked={data.anesthesiaExperience === type}
                onChange={() => handleChange('anesthesiaExperience', type)}
              />
              <span className="text-sm text-[#E8F4FD]">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Adverse Reactions */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">Previous Adverse Reactions</label>
        <div className="space-y-2">
          {['Nausea/Vomiting', 'Allergic Reaction', 'Malignant Hyperthermia', 'Difficult Intubation', 'Blood Pressure Issues', 'Prolonged Recovery'].map((reaction) => (
            <label key={reaction} className="flex items-center gap-3 p-2 rounded hover:bg-[#162236] cursor-pointer transition">
              <Checkbox
                checked={data.adverseReactions?.includes(reaction) || false}
                onChange={() => {
                  const current = data.adverseReactions || [];
                  const updated = current.includes(reaction)
                    ? current.filter((t: string) => t !== reaction)
                    : [...current, reaction];
                  handleChange('adverseReactions', updated);
                }}
              />
              <span className="text-sm text-[#E8F4FD]">{reaction}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Medical Conditions */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">Relevant Medical Conditions</label>
        <div className="space-y-2">
          {['Hypertension', 'Diabetes', 'Heart Disease', 'Asthma', 'Sleep Apnea', 'Obesity', 'Liver Disease', 'Kidney Disease'].map((condition) => (
            <label key={condition} className="flex items-center gap-3 p-2 rounded hover:bg-[#162236] cursor-pointer transition">
              <Checkbox
                checked={data.medicalConditions?.includes(condition) || false}
                onChange={() => {
                  const current = data.medicalConditions || [];
                  const updated = current.includes(condition)
                    ? current.filter((t: string) => t !== condition)
                    : [...current, condition];
                  handleChange('medicalConditions', updated);
                }}
              />
              <span className="text-sm text-[#E8F4FD]">{condition}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Medications */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Current Medications (Critical)</label>
        <textarea
          placeholder="List all medications - important for anesthesia interactions"
          value={data.currentMedications || ''}
          onChange={(e) => handleChange('currentMedications', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={2}
        />
      </div>

      {/* Allergies */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Drug Allergies (CRITICAL)</label>
        <textarea
          placeholder="Especially anesthetic agents and antibiotics"
          value={data.drugAllergies || ''}
          onChange={(e) => handleChange('drugAllergies', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={2}
        />
      </div>

      {/* Fasting Status */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">NPO Status (Fasting)</label>
        <Input
          placeholder="Hours fasted (should be documented)"
          value={data.fastingHours || ''}
          onChange={(e) => handleChange('fastingHours', e.target.value)}
          className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]"
        />
      </div>

      <motion.div className="p-4 rounded-lg bg-gradient-to-r from-[#00D4FF]/10 to-[#00A8D4]/10 border border-[#00D4FF]/30"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p className="text-sm text-[#00D4FF]">✓ Anesthesiology assessment completed</p>
      </motion.div>
    </motion.div>
  );
}
