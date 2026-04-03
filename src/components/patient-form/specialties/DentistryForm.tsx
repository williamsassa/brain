'use client';

import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Card } from '@/components/ui/Card';

interface DentistryFormProps {
  data?: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export default function DentistryForm({ data = {}, onChange }: DentistryFormProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-4 border-[rgba(0,212,255,0.15)] bg-gradient-to-r from-[#162236] to-[#0F1B2D]">
        <h3 className="font-bold text-[#00D4FF] mb-2">🦷 Dentistry Assessment</h3>
        <p className="text-sm text-[#8BA3BE]">Oral health and dental examination</p>
      </Card>

      {/* Chief Complaint */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Chief Complaint *</label>
        <textarea
          placeholder="Tooth pain, bleeding gums, cavities, etc."
          value={data.chiefComplaint || ''}
          onChange={(e) => handleChange('chiefComplaint', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={3}
        />
      </div>

      {/* Pain Level */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Pain Level (0-10)</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="10"
            value={data.painLevel || 0}
            onChange={(e) => handleChange('painLevel', parseInt(e.target.value))}
            className="flex-1 h-2 bg-[#162236] rounded-lg"
          />
          <span className="text-lg font-bold text-[#00D4FF] min-w-12">{data.painLevel || 0}</span>
        </div>
      </div>

      {/* Dental Conditions */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">Dental Conditions</label>
        <div className="space-y-2">
          {['Cavities', 'Gum Disease', 'Plaque/Tartar', 'Tooth Sensitivity', 'Bruxism',
            'Malocclusion', 'Missing Teeth', 'Cracked Teeth', 'Periodontitis'].map((condition) => (
            <label key={condition} className="flex items-center gap-3 p-2 rounded hover:bg-[#162236] cursor-pointer transition">
              <Checkbox
                checked={data.dentalConditions?.includes(condition) || false}
                onChange={() => {
                  const current = data.dentalConditions || [];
                  const updated = current.includes(condition)
                    ? current.filter((t: string) => t !== condition)
                    : [...current, condition];
                  handleChange('dentalConditions', updated);
                }}
              />
              <span className="text-sm text-[#E8F4FD]">{condition}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Dental Habits */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">Dental Habits</label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-2 rounded hover:bg-[#162236] cursor-pointer">
            <Checkbox checked={data.brushesTwiceDaily || false} onChange={() => handleChange('brushesTwiceDaily', !data.brushesTwiceDaily)} />
            <span className="text-sm">Brushes twice daily</span>
          </label>
          <label className="flex items-center gap-3 p-2 rounded hover:bg-[#162236] cursor-pointer">
            <Checkbox checked={data.flosses || false} onChange={() => handleChange('flosses', !data.flosses)} />
            <span className="text-sm">Flosses regularly</span>
          </label>
          <label className="flex items-center gap-3 p-2 rounded hover:bg-[#162236] cursor-pointer">
            <Checkbox checked={data.usesMouthwash || false} onChange={() => handleChange('usesMouthwash', !data.usesMouthwash)} />
            <span className="text-sm">Uses mouthwash</span>
          </label>
        </div>
      </div>

      {/* Last Dental Visit */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Last Dental Visit</label>
        <Input type="date" value={data.lastDentalVisit || ''} onChange={(e) => handleChange('lastDentalVisit', e.target.value)}
          className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]" />
      </div>

      {/* Previous Treatments */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Previous Dental Treatments</label>
        <textarea
          placeholder="Fillings, root canals, extractions, implants..."
          value={data.previousTreatments || ''}
          onChange={(e) => handleChange('previousTreatments', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={2}
        />
      </div>

      {/* Dental Allergies */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Dental Allergies</label>
        <textarea
          placeholder="e.g., latex, specific medications..."
          value={data.dentalAllergies || ''}
          onChange={(e) => handleChange('dentalAllergies', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={2}
        />
      </div>

      <motion.div className="p-4 rounded-lg bg-gradient-to-r from-[#00D4FF]/10 to-[#00A8D4]/10 border border-[#00D4FF]/30"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p className="text-sm text-[#00D4FF]">✓ Dentistry assessment completed</p>
      </motion.div>
    </motion.div>
  );
}
