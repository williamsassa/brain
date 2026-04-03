'use client';

import { PatientIdentity } from '@/types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useLanguage } from '@/hooks/useLanguage';

interface CommonSectionProps {
  data: Partial<PatientIdentity>;
  onChange: (data: Partial<PatientIdentity>) => void;
}

export default function CommonSection({ data, onChange }: CommonSectionProps) {
  const { t } = useLanguage();

  const calculateBMI = (height?: number, weight?: number) => {
    if (!height || !weight) return undefined;
    return Math.round((weight / (height / 100) ** 2) * 10) / 10;
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const weight = parseFloat(e.target.value) || undefined;
    onChange({
      weight,
      bmi: calculateBMI(data.height, weight),
    });
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseFloat(e.target.value) || undefined;
    onChange({
      height,
      bmi: calculateBMI(height, data.weight),
    });
  };

  return (
    <div className="space-y-6">
      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#00D4FF]">
            {t('first_name' as any)} *
          </label>
          <Input
            type="text"
            placeholder="John"
            value={data.firstName || ''}
            onChange={(e) => onChange({ firstName: e.target.value })}
            className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#00D4FF]">
            {t('last_name' as any)} *
          </label>
          <Input
            type="text"
            placeholder="Doe"
            value={data.lastName || ''}
            onChange={(e) => onChange({ lastName: e.target.value })}
            className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]"
          />
        </div>
      </div>

      {/* Date of Birth and Gender */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#00D4FF]">
            {t('date_of_birth' as any)} *
          </label>
          <Input
            type="date"
            value={data.dateOfBirth || ''}
            onChange={(e) => onChange({ dateOfBirth: e.target.value })}
            className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#00D4FF]">
            {t('gender' as any)} *
          </label>
          <Select
            value={data.gender || ''}
            onChange={(e) => onChange({ gender: e.target.value as any })}
            className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]"
          >
            <option value="">Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="Other">Other</option>
          </Select>
        </div>
      </div>

      {/* Blood Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">
          {t('blood_type' as any)}
        </label>
        <Select
          value={data.bloodType || ''}
          onChange={(e) => onChange({ bloodType: e.target.value })}
          className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]"
        >
          <option value="">Select Blood Type</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </Select>
      </div>

      {/* Height and Weight */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#00D4FF]">
            {t('height' as any)} (cm)
          </label>
          <Input
            type="number"
            placeholder="170"
            value={data.height || ''}
            onChange={handleHeightChange}
            className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#00D4FF]">
            {t('weight' as any)} (kg)
          </label>
          <Input
            type="number"
            placeholder="70"
            value={data.weight || ''}
            onChange={handleWeightChange}
            className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]"
          />
        </div>
      </div>

      {/* BMI Display */}
      {data.bmi && (
        <div className="p-4 rounded-lg bg-[#00D4FF]/10 border border-[#00D4FF]/30">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-[#00D4FF]">{t('bmi' as any)}</span>
            <span className="text-lg font-bold text-[#00D4FF]">{data.bmi}</span>
          </div>
        </div>
      )}

      {/* Address and Phone */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">
          {t('address' as any)}
        </label>
        <Input
          type="text"
          placeholder="123 Main St, City, Country"
          value={data.address || ''}
          onChange={(e) => onChange({ address: e.target.value })}
          className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">
          {t('phone' as any)}
        </label>
        <Input
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={data.phone || ''}
          onChange={(e) => onChange({ phone: e.target.value })}
          className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]"
        />
      </div>

      {/* Emergency Contact */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">
          {t('emergency_contact' as any)}
        </label>
        <Input
          type="tel"
          placeholder="Emergency contact number"
          value={data.emergencyContact || ''}
          onChange={(e) => onChange({ emergencyContact: e.target.value })}
          className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]"
        />
      </div>
    </div>
  );
}
