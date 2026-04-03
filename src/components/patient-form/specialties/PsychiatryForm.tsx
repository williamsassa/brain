'use client';

import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Card } from '@/components/ui/Card';

interface PsychiatryFormProps {
  data?: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export default function PsychiatryForm({ data = {}, onChange }: PsychiatryFormProps) {
  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-4 border-[rgba(0,212,255,0.15)] bg-gradient-to-r from-[#162236] to-[#0F1B2D]">
        <h3 className="font-bold text-[#00D4FF] mb-2">🧠 Psychiatry Assessment</h3>
        <p className="text-sm text-[#8BA3BE]">Mental health and behavioral evaluation</p>
      </Card>

      {/* Chief Complaint */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Chief Complaint *</label>
        <textarea
          placeholder="Mood issues, anxiety, insomnia, etc."
          value={data.chiefComplaint || ''}
          onChange={(e) => handleChange('chiefComplaint', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={3}
        />
      </div>

      {/* Mental Health Symptoms */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">Mental Health Symptoms</label>
        <div className="space-y-2">
          {['Depression', 'Anxiety', 'Panic Attacks', 'OCD', 'PTSD', 'Insomnia', 'Nightmares', 'Hallucinations', 'Delusions'].map((symptom) => (
            <label key={symptom} className="flex items-center gap-3 p-2 rounded hover:bg-[#162236] cursor-pointer transition">
              <Checkbox
                checked={data.mentalSymptoms?.includes(symptom) || false}
                onChange={() => {
                  const current = data.mentalSymptoms || [];
                  const updated = current.includes(symptom)
                    ? current.filter((t: string) => t !== symptom)
                    : [...current, symptom];
                  handleChange('mentalSymptoms', updated);
                }}
              />
              <span className="text-sm text-[#E8F4FD]">{symptom}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Mood & Affect */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#00D4FF]">Mood (0-10)</label>
          <div className="flex items-center gap-2">
            <input type="range" min="0" max="10" value={data.moodScore || 5} onChange={(e) => handleChange('moodScore', parseInt(e.target.value))}
              className="flex-1 h-2 bg-[#162236] rounded-lg" />
            <span className="text-[#00D4FF]">{data.moodScore || 5}</span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#00D4FF]">Anxiety (0-10)</label>
          <div className="flex items-center gap-2">
            <input type="range" min="0" max="10" value={data.anxietyScore || 5} onChange={(e) => handleChange('anxietyScore', parseInt(e.target.value))}
              className="flex-1 h-2 bg-[#162236] rounded-lg" />
            <span className="text-[#00D4FF]">{data.anxietyScore || 5}</span>
          </div>
        </div>
      </div>

      {/* Suicidal/Homicidal Ideation */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#00D4FF]">Safety Assessment</label>
        <div className="space-y-2">
          {['Suicidal Ideation', 'Homicidal Ideation', 'Self-Harm', 'Substance Abuse'].map((risk) => (
            <label key={risk} className="flex items-center gap-3 p-2 rounded hover:bg-[#162236] cursor-pointer transition">
              <Checkbox
                checked={data.riskFactors?.includes(risk) || false}
                onChange={() => {
                  const current = data.riskFactors || [];
                  const updated = current.includes(risk)
                    ? current.filter((t: string) => t !== risk)
                    : [...current, risk];
                  handleChange('riskFactors', updated);
                }}
              />
              <span className="text-sm text-[#E8F4FD]">{risk}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Current Psychiatric Medications */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Current Psychiatric Medications</label>
        <textarea
          placeholder="Antidepressants, anxiolytics, antipsychotics..."
          value={data.psychiatricMeds || ''}
          onChange={(e) => handleChange('psychiatricMeds', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={2}
        />
      </div>

      {/* Previous Treatment */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Previous Psychiatric Treatment</label>
        <textarea
          placeholder="Therapy, hospitalization, medication history..."
          value={data.previousTreatment || ''}
          onChange={(e) => handleChange('previousTreatment', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={2}
        />
      </div>

      {/* Psychosocial Stressors */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#00D4FF]">Current Psychosocial Stressors</label>
        <textarea
          placeholder="Work, relationships, financial, family..."
          value={data.stressors || ''}
          onChange={(e) => handleChange('stressors', e.target.value)}
          className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] outline-none"
          rows={2}
        />
      </div>

      <motion.div className="p-4 rounded-lg bg-gradient-to-r from-[#00D4FF]/10 to-[#00A8D4]/10 border border-[#00D4FF]/30"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p className="text-sm text-[#00D4FF]">✓ Psychiatry assessment completed</p>
      </motion.div>
    </motion.div>
  );
}
