'use client';

import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Card } from '@/components/ui/Card';

interface EndocrinologyFormProps {
  data?: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export default function EndocrinologyForm({ data = {}, onChange }: EndocrinologyFormProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-4 border-[rgba(0,212,255,0.15)] bg-gradient-to-r from-[#162236] to-[#0F1B2D]">
        <h3 className="font-bold text-[#00D4FF] mb-2">⚗️ Endocrinology Assessment</h3>
        <p className="text-sm text-[#8BA3BE]">Hormonal and metabolic disorders evaluation</p>
      </Card>

      {/* Chief Complaint */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Chief Complaint *</label>
        <textarea
          placeholder="Weight changes, fatigue, blood sugar issues, etc."
          value={data.chiefComplaint || ''}
          onChange={(e) => handleChange('chiefComplaint', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={3}
        />
      </div>

      {/* Weight Changes */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#00D4FF]">Weight Change (kg)</label>
          <Input type="number" placeholder="0" value={data.weightChange || ''} onChange={(e) => handleChange('weightChange', e.target.value)}
            className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#00D4FF]">Time Period (months)</label>
          <Input type="number" placeholder="3" value={data.weightChangePeriod || ''} onChange={(e) => handleChange('weightChangePeriod', e.target.value)}
            className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]" />
        </div>
      </div>

      {/* Endocrine Conditions */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">Endocrine Conditions</label>
        <div className="space-y-2">
          {['Type 1 Diabetes', 'Type 2 Diabetes', 'Hypothyroidism', 'Hyperthyroidism', 'PCOS', 'Cushing\'s Syndrome', 'Addison\'s Disease', 'Metabolic Syndrome'].map((condition) => (
            <label key={condition} className="flex items-center gap-3 p-2 rounded hover:bg-[#162236] cursor-pointer transition">
              <Checkbox
                checked={data.endoConditions?.includes(condition) || false}
                onChange={() => {
                  const current = data.endoConditions || [];
                  const updated = current.includes(condition)
                    ? current.filter((t: string) => t !== condition)
                    : [...current, condition];
                  handleChange('endoConditions', updated);
                }}
              />
              <span className="text-sm text-[#E8F4FD]">{condition}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Blood Sugar Profile */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">Blood Glucose (mg/dL)</label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-[#8BA3BE]">Fasting</label>
            <Input type="number" placeholder="100" value={data.fastingGlucose || ''} onChange={(e) => handleChange('fastingGlucose', e.target.value)}
              className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-[#8BA3BE]">HbA1c (%)</label>
            <Input type="number" step="0.1" placeholder="5.5" value={data.hba1c || ''} onChange={(e) => handleChange('hba1c', e.target.value)}
              className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]" />
          </div>
        </div>
      </div>

      {/* Thyroid Profile */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">Thyroid Profile</label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-[#8BA3BE]">TSH (mIU/L)</label>
            <Input type="number" step="0.1" placeholder="2.0" value={data.tsh || ''} onChange={(e) => handleChange('tsh', e.target.value)}
              className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-[#8BA3BE]">Free T4 (ng/dL)</label>
            <Input type="number" step="0.1" placeholder="1.5" value={data.freeT4 || ''} onChange={(e) => handleChange('freeT4', e.target.value)}
              className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]" />
          </div>
        </div>
      </div>

      {/* Current Medications */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Endocrine Medications</label>
        <textarea
          placeholder="Insulin, metformin, thyroid replacement, etc."
          value={data.endoMedications || ''}
          onChange={(e) => handleChange('endoMedications', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={2}
        />
      </div>

      {/* Lifestyle */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Lifestyle & Exercise</label>
        <textarea
          placeholder="Diet, physical activity, stress levels..."
          value={data.lifestyle || ''}
          onChange={(e) => handleChange('lifestyle', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={2}
        />
      </div>

      <motion.div className="p-4 rounded-lg bg-gradient-to-r from-[#00D4FF]/10 to-[#00A8D4]/10 border border-[#00D4FF]/30"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p className="text-sm text-[#00D4FF]">✓ Endocrinology assessment completed</p>
      </motion.div>
    </motion.div>
  );
}
