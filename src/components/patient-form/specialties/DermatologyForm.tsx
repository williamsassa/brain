'use client';

import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Card } from '@/components/ui/Card';

interface DermatologyFormProps {
  data?: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export default function DermatologyForm({ data = {}, onChange }: DermatologyFormProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-4 border-[rgba(0,212,255,0.15)] bg-gradient-to-r from-[#162236] to-[#0F1B2D]">
        <h3 className="font-bold text-[#00D4FF] mb-2">🧴 Dermatology Assessment</h3>
        <p className="text-sm text-[#8BA3BE]">Skin and dermatological conditions evaluation</p>
      </Card>

      {/* Chief Complaint */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Chief Complaint *</label>
        <textarea
          placeholder="Skin rash, lesions, itching, etc."
          value={data.chiefComplaint || ''}
          onChange={(e) => handleChange('chiefComplaint', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={3}
        />
      </div>

      {/* Skin Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Skin Type</label>
        <select
          value={data.skinType || ''}
          onChange={(e) => handleChange('skinType', e.target.value)}
          className="w-full p-2 rounded bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD]"
        >
          <option value="">Select...</option>
          <option value="dry">Dry</option>
          <option value="oily">Oily</option>
          <option value="combination">Combination</option>
          <option value="sensitive">Sensitive</option>
          <option value="normal">Normal</option>
        </select>
      </div>

      {/* Skin Conditions */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">Skin Conditions</label>
        <div className="space-y-2">
          {[
            'Acne', 'Psoriasis', 'Eczema', 'Dermatitis', 'Urticaria',
            'Vitiligo', 'Alopecia', 'Rosacea', 'Warts', 'fungal infections',
            'Skin Cancer Suspicion'
          ].map((condition) => (
            <label key={condition} className="flex items-center gap-3 p-2 rounded hover:bg-[#162236] cursor-pointer transition">
              <Checkbox
                checked={data.skinConditions?.includes(condition) || false}
                onChange={() => {
                  const current = data.skinConditions || [];
                  const updated = current.includes(condition)
                    ? current.filter((t: string) => t !== condition)
                    : [...current, condition];
                  handleChange('skinConditions', updated);
                }}
              />
              <span className="text-sm text-[#E8F4FD]">{condition}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Duration & Location */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#00D4FF]">Duration</label>
          <Input placeholder="e.g., 2 weeks" value={data.duration || ''} onChange={(e) => handleChange('duration', e.target.value)}
            className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#00D4FF]">Location</label>
          <Input placeholder="e.g., Face, hands" value={data.location || ''} onChange={(e) => handleChange('location', e.target.value)}
            className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]" />
        </div>
      </div>

      {/* Symptoms */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">Associated Symptoms</label>
        <div className="space-y-2">
          {['Itching', 'Burning', 'Pain', 'Bleeding', 'Oozing', 'Fever'].map((symptom) => (
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

      {/* Previous Treatments */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Previous Treatments</label>
        <textarea
          placeholder="Medications, creams, therapies tried..."
          value={data.previousTreatments || ''}
          onChange={(e) => handleChange('previousTreatments', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={2}
        />
      </div>

      {/* Triggers */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Associated Triggers</label>
        <textarea
          placeholder="e.g., stress, weather, specific products..."
          value={data.triggers || ''}
          onChange={(e) => handleChange('triggers', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={2}
        />
      </div>

      {/* Allergies */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Skin Allergies</label>
        <textarea
          placeholder="Known product or ingredient allergies..."
          value={data.skinAllergies || ''}
          onChange={(e) => handleChange('skinAllergies', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={2}
        />
      </div>

      <motion.div className="p-4 rounded-lg bg-gradient-to-r from-[#00D4FF]/10 to-[#00A8D4]/10 border border-[#00D4FF]/30"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p className="text-sm text-[#00D4FF]">✓ Dermatology assessment completed</p>
      </motion.div>
    </motion.div>
  );
}
