'use client';

import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Card } from '@/components/ui/Card';
import { useLanguage } from '@/hooks/useLanguage';

interface CardiologyFormProps {
  data?: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export default function CardiologyForm({ data = {}, onChange }: CardiologyFormProps) {
  const { t } = useLanguage();

  const handleChange = (field: string, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleCheckboxChange = (field: string) => {
    onChange({
      ...data,
      [field]: !data[field],
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 border-[rgba(0,212,255,0.15)] bg-[#162236]">
        <h3 className="font-bold text-[#00D4FF] mb-4">🫀 Cardiology Assessment</h3>
        <p className="text-sm text-[#8BA3BE]">
          Specialized cardiac evaluation fields for comprehensive cardiovascular assessment
        </p>
      </Card>

      {/* Chief Complaint */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">
          Chief Complaint *
        </label>
        <textarea
          placeholder="Describe main cardiac complaint (chest pain, shortness of breath, etc.)"
          value={data.chiefComplaint || ''}
          onChange={(e) => handleChange('chiefComplaint', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] placeholder-[#8BA3BE] focus:border-[#00D4FF] focus:outline-none resize-none"
          rows={3}
        />
      </div>

      {/* Symptom Onset Date */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">
          Symptom Onset Date
        </label>
        <Input
          type="date"
          value={data.symptomOnsetDate || ''}
          onChange={(e) => handleChange('symptomOnsetDate', e.target.value)}
          className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]"
        />
      </div>

      {/* Pain Scale */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">
          Pain Scale (0-10)
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="10"
            value={data.painScale || 0}
            onChange={(e) => handleChange('painScale', parseInt(e.target.value))}
            className="flex-1 h-2 bg-[#162236] rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-lg font-bold text-[#00D4FF] min-w-12">
            {data.painScale || 0}
          </span>
        </div>
      </div>

      {/* Chest Pain Characteristics */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">
          Chest Pain Characteristics
        </label>
        <div className="space-y-2">
          {['Pressure', 'Sharp', 'Dull', 'Radiating', 'Pleuritic'].map((type) => (
            <label
              key={type}
              className="flex items-center gap-3 p-2 rounded hover:bg-[#162236] cursor-pointer transition"
            >
              <Checkbox
                checked={data.painTypes?.includes(type) || false}
                onChange={() => {
                  const current = data.painTypes || [];
                  const updated = current.includes(type)
                    ? current.filter((t: string) => t !== type)
                    : [...current, type];
                  handleChange('painTypes', updated);
                }}
              />
              <span className="text-sm text-[#E8F4FD]">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Cardiac Risk Factors */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">
          Cardiac Risk Factors
        </label>
        <div className="space-y-2">
          {[
            { label: 'Hypertension', value: 'hypertension' },
            { label: 'Diabetes', value: 'diabetes' },
            { label: 'Hyperlipidemia', value: 'hyperlipidemia' },
            { label: 'Family History of Heart Disease', value: 'familyHistory' },
            { label: 'Smoking', value: 'smoking' },
            { label: 'Obesity', value: 'obesity' },
          ].map((risk) => (
            <label
              key={risk.value}
              className="flex items-center gap-3 p-2 rounded hover:bg-[#162236] cursor-pointer transition"
            >
              <Checkbox
                checked={data[risk.value] || false}
                onChange={() => handleCheckboxChange(risk.value)}
              />
              <span className="text-sm text-[#E8F4FD]">{risk.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Recent Tests */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">
          Recent Cardiac Tests
        </label>
        <div className="space-y-2">
          {['ECG', 'Echocardiogram', 'Stress Test', 'Angiography', 'Holter Monitor'].map(
            (test) => (
              <label
                key={test}
                className="flex items-center gap-3 p-2 rounded hover:bg-[#162236] cursor-pointer transition"
              >
                <Checkbox
                  checked={data.recentTests?.includes(test) || false}
                  onChange={() => {
                    const current = data.recentTests || [];
                    const updated = current.includes(test)
                      ? current.filter((t: string) => t !== test)
                      : [...current, test];
                    handleChange('recentTests', updated);
                  }}
                />
                <span className="text-sm text-[#E8F4FD]">{test}</span>
              </label>
            )
          )}
        </div>
      </div>

      {/* Ejection Fraction */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">
          Left Ventricular Ejection Fraction (%)
        </label>
        <Input
          type="number"
          min="0"
          max="100"
          step="0.1"
          placeholder="55"
          value={data.ejectionFraction || ''}
          onChange={(e) => handleChange('ejectionFraction', parseFloat(e.target.value))}
          className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]"
        />
        {data.ejectionFraction && (
          <p className="text-xs text-[#8BA3BE]">
            {data.ejectionFraction < 40
              ? 'Reduced'
              : data.ejectionFraction < 50
              ? 'Mildly Reduced'
              : 'Normal'}
          </p>
        )}
      </div>

      {/* Additional Symptoms */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">
          Associated Symptoms
        </label>
        <textarea
          placeholder="Shortness of breath, palpitations, syncope, fatigue, etc."
          value={data.additionalSymptoms || ''}
          onChange={(e) => handleChange('additionalSymptoms', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] placeholder-[#8BA3BE] focus:border-[#00D4FF] focus:outline-none resize-none"
          rows={3}
        />
      </div>

      {/* Current Cardiac Medications */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">
          Current Cardiac Medications
        </label>
        <textarea
          placeholder="List current medications (ACE inhibitors, beta-blockers, statins, etc.)"
          value={data.cardiacMedications || ''}
          onChange={(e) => handleChange('cardiacMedications', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] placeholder-[#8BA3BE] focus:border-[#00D4FF] focus:outline-none resize-none"
          rows={2}
        />
      </div>
    </div>
  );
}
