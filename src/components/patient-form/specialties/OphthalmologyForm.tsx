'use client';

import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Card } from '@/components/ui/Card';

interface OphthalmologyFormProps {
  data?: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export default function OphthalmologyForm({ data = {}, onChange }: OphthalmologyFormProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleCheckboxChange = (field: string) => {
    onChange({ ...data, [field]: !data[field] });
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="p-4 border-[rgba(0,212,255,0.15)] bg-gradient-to-r from-[#162236] to-[#0F1B2D]">
        <h3 className="font-bold text-[#00D4FF] mb-2 flex items-center gap-2">👁️ Ophthalmology Assessment</h3>
        <p className="text-sm text-[#8BA3BE]">
          Vision and ocular evaluation including refractive errors and eye health
        </p>
      </Card>

      {/* Chief Complaint */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Chief Complaint *</label>
        <textarea
          placeholder="Vision problems, eye pain, floaters, etc."
          value={data.chiefComplaint || ''}
          onChange={(e) => handleChange('chiefComplaint', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] placeholder-[#8BA3BE] focus:border-[#00D4FF] outline-none"
          rows={3}
        />
      </div>

      {/* Vision Problems */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">Vision Problems</label>
        <div className="space-y-2">
          {[
            { label: 'Blurred Vision', icon: '😵' },
            { label: 'Double Vision', icon: '👀' },
            { label: 'Floaters', icon: '✨' },
            { label: 'Flashes of Light', icon: '⚡' },
            { label: 'Night Blindness', icon: '🌙' },
            { label: 'Color Vision Deficiency', icon: '🎨' },
          ].map((issue) => (
            <label key={issue.label} className="flex items-center gap-3 p-2 rounded hover:bg-[#162236] cursor-pointer transition">
              <Checkbox
                checked={data.visionProblems?.includes(issue.label) || false}
                onChange={() => {
                  const current = data.visionProblems || [];
                  const updated = current.includes(issue.label)
                    ? current.filter((t: string) => t !== issue.label)
                    : [...current, issue.label];
                  handleChange('visionProblems', updated);
                }}
              />
              <span className="text-sm">{issue.icon} {issue.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Visual Acuity */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#00D4FF]">OD (Right Eye)</label>
          <Input
            type="text"
            placeholder="20/20"
            value={data.visualAcuityOD || ''}
            onChange={(e) => handleChange('visualAcuityOD', e.target.value)}
            className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#00D4FF]">OS (Left Eye)</label>
          <Input
            type="text"
            placeholder="20/20"
            value={data.visualAcuityOS || ''}
            onChange={(e) => handleChange('visualAcuityOS', e.target.value)}
            className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]"
          />
        </div>
      </div>

      {/* Intraocular Pressure */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#00D4FF]">IOP OD (mmHg)</label>
          <Input
            type="number"
            placeholder="15"
            value={data.iopOD || ''}
            onChange={(e) => handleChange('iopOD', parseFloat(e.target.value))}
            className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#00D4FF]">IOP OS (mmHg)</label>
          <Input
            type="number"
            placeholder="15"
            value={data.iopOS || ''}
            onChange={(e) => handleChange('iopOS', parseFloat(e.target.value))}
            className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]"
          />
        </div>
      </div>

      {/* Eye Conditions */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">Eye Conditions</label>
        <div className="space-y-2">
          {[
            'Myopia (Nearsightedness)',
            'Hyperopia (Farsightedness)',
            'Astigmatism',
            'Presbyopia',
            'Cataracts',
            'Glaucoma',
            'Macular Degeneration',
            'Diabetic Retinopathy',
          ].map((condition) => (
            <label key={condition} className="flex items-center gap-3 p-2 rounded hover:bg-[#162236] cursor-pointer transition">
              <Checkbox
                checked={data.eyeConditions?.includes(condition) || false}
                onChange={() => {
                  const current = data.eyeConditions || [];
                  const updated = current.includes(condition)
                    ? current.filter((t: string) => t !== condition)
                    : [...current, condition];
                  handleChange('eyeConditions', updated);
                }}
              />
              <span className="text-sm text-[#E8F4FD]">{condition}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Last Eye Exam */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Last Eye Exam Date</label>
        <Input
          type="date"
          value={data.lastExamDate || ''}
          onChange={(e) => handleChange('lastExamDate', e.target.value)}
          className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]"
        />
      </div>

      {/* Family History */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">Family History</label>
        <div className="space-y-2">
          {['Glaucoma', 'Cataracts', 'Macular Degeneration', 'Blindness'].map((history) => (
            <label key={history} className="flex items-center gap-3 p-2 rounded hover:bg-[#162236] cursor-pointer transition">
              <Checkbox
                checked={data.familyHistory?.includes(history) || false}
                onChange={() => {
                  const current = data.familyHistory || [];
                  const updated = current.includes(history)
                    ? current.filter((t: string) => t !== history)
                    : [...current, history];
                  handleChange('familyHistory', updated);
                }}
              />
              <span className="text-sm text-[#E8F4FD]">{history}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Medications & Allergies */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Current Eye Medications</label>
        <textarea
          placeholder="Eye drops, ointments, etc."
          value={data.eyeMedications || ''}
          onChange={(e) => handleChange('eyeMedications', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] placeholder-[#8BA3BE] focus:border-[#00D4FF] outline-none"
          rows={2}
        />
      </div>

      <motion.div
        className="p-4 rounded-lg bg-gradient-to-r from-[#00D4FF]/10 to-[#00A8D4]/10 border border-[#00D4FF]/30"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-sm text-[#00D4FF]">✓ Ophthalmology assessment completed</p>
      </motion.div>
    </motion.div>
  );
}
