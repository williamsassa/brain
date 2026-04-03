'use client';

import { VitalSigns } from '@/types';
import { Input } from '@/components/ui/Input';
import { useLanguage } from '@/hooks/useLanguage';

interface VitalSignsSectionProps {
  data: Partial<VitalSigns>;
  onChange: (data: Partial<VitalSigns>) => void;
}

export default function VitalSignsSection({ data, onChange }: VitalSignsSectionProps) {
  const { t } = useLanguage();

  const vitalFields = [
    {
      key: 'systolic',
      label: `${t('blood_pressure' as any)} - ${t('systolic' as any)} (mmHg)`,
      placeholder: '120',
      type: 'number',
    },
    {
      key: 'diastolic',
      label: `${t('blood_pressure' as any)} - ${t('diastolic' as any)} (mmHg)`,
      placeholder: '80',
      type: 'number',
    },
    {
      key: 'heartRate',
      label: t('heart_rate' as any),
      placeholder: '72',
      type: 'number',
    },
    {
      key: 'temperature',
      label: t('temperature' as any),
      placeholder: '36.5',
      type: 'number',
      step: '0.1',
    },
    {
      key: 'o2Saturation',
      label: t('o2_saturation' as any),
      placeholder: '98',
      type: 'number',
    },
    {
      key: 'respiratoryRate',
      label: t('respiratory_rate' as any),
      placeholder: '16',
      type: 'number',
    },
  ];

  const handleChange = (key: keyof VitalSigns, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    onChange({
      [key]: numValue,
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)]">
        <h3 className="font-semibold text-[#00D4FF] mb-4">{t('vital_signs' as any)}</h3>
        <p className="text-sm text-[#8BA3BE]">
          Enter patient vital signs. Fields are optional and can be filled incrementally.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {vitalFields.map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="block text-sm font-medium text-[#00D4FF]">
              {field.label}
            </label>
            <Input
              type={field.type}
              step={field.step || '1'}
              placeholder={field.placeholder}
              value={data[field.key as keyof VitalSigns] || ''}
              onChange={(e) =>
                handleChange(field.key as keyof VitalSigns, e.target.value)
              }
              className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]"
            />
          </div>
        ))}
      </div>

      {/* Blood Pressure Display */}
      {(data.systolic || data.diastolic) && (
        <div className="p-4 rounded-lg bg-[#00D4FF]/10 border border-[#00D4FF]/30">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-[#00D4FF]">
              {t('blood_pressure' as any)}
            </span>
            <span className="text-lg font-bold text-[#00D4FF]">
              {data.systolic || '-'}/{data.diastolic || '-'} mmHg
            </span>
          </div>
          {data.systolic && data.diastolic && (
            <p className="text-xs text-[#8BA3BE] mt-2">
              {data.systolic < 120 && data.diastolic < 80
                ? 'Normal'
                : data.systolic < 130 && data.diastolic < 80
                ? 'Elevated'
                : 'High Blood Pressure'}
            </p>
          )}
        </div>
      )}

      {/* HR Status */}
      {data.heartRate && (
        <div className="p-4 rounded-lg bg-[#00D4FF]/10 border border-[#00D4FF]/30">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-[#00D4FF]">
              {t('heart_rate' as any)}
            </span>
            <span className="text-lg font-bold text-[#00D4FF]">{data.heartRate} bpm</span>
          </div>
          <p className="text-xs text-[#8BA3BE] mt-2">
            {data.heartRate < 60
              ? 'Bradycardia'
              : data.heartRate > 100
              ? 'Tachycardia'
              : 'Normal'}
          </p>
        </div>
      )}

      {/* Temperature Status */}
      {data.temperature && (
        <div className="p-4 rounded-lg bg-[#00D4FF]/10 border border-[#00D4FF]/30">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-[#00D4FF]">
              {t('temperature' as any)}
            </span>
            <span className="text-lg font-bold text-[#00D4FF]">{data.temperature}°C</span>
          </div>
          <p className="text-xs text-[#8BA3BE] mt-2">
            {data.temperature < 36.1
              ? 'Hypothermia'
              : data.temperature > 37.5
              ? 'Fever'
              : 'Normal'}
          </p>
        </div>
      )}
    </div>
  );
}
