'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Loader2, ChevronLeft, User, Building2, Globe } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Specialty } from '@/types/specialty';

const ONBOARDING_SPECIALTIES = [
  { id: 'general' as Specialty, label: 'General Medicine', emoji: '⚕️', color: '#2ECC71',
    desc: 'General practice & primary care',
    fields: ['Full exam', 'Lab interpretation', 'Referral management', 'Chronic disease'] },
  { id: 'cardiology' as Specialty, label: 'Cardiology', emoji: '🫀', color: '#FF4757',
    desc: 'Heart & vascular system',
    fields: ['ECG analysis', 'BP monitoring', 'Cardiac markers', 'Echocardiography'] },
  { id: 'ophthalmology' as Specialty, label: 'Ophthalmology', emoji: '👁️', color: '#00D4FF',
    desc: 'Eye & visual system',
    fields: ['Visual acuity', 'IOP', 'Fundoscopy', 'Refraction'] },
  { id: 'dermatology' as Specialty, label: 'Dermatology', emoji: '🧴', color: '#F59E0B',
    desc: 'Skin, hair & nails',
    fields: ['Lesion mapping', 'Fitzpatrick scale', 'Dermoscopy', 'Patch test'] },
  { id: 'dentistry' as Specialty, label: 'Dentistry', emoji: '🦷', color: '#E5E7EB',
    desc: 'Oral & dental health',
    fields: ['Dental chart', 'X-ray analysis', 'Periodontal', 'Occlusion'] },
  { id: 'pediatrics' as Specialty, label: 'Pediatrics', emoji: '👶', color: '#00E5A0',
    desc: 'Infant & child health',
    fields: ['Growth charts', 'Development milestones', 'Vaccination', 'Nutrition'] },
  { id: 'psychiatry' as Specialty, label: 'Psychiatry', emoji: '🧠', color: '#5352ED',
    desc: 'Mental health & behavior',
    fields: ['PHQ-9', 'GAD-7', 'DSM-5 criteria', 'Risk assessment'] },
  { id: 'anesthesiology' as Specialty, label: 'Anesthesiology', emoji: '💉', color: '#00A8CC',
    desc: 'Perioperative care',
    fields: ['ASA status', 'Airway assessment', 'Drug dosing', 'NPO status'] },
  { id: 'endocrinology' as Specialty, label: 'Endocrinology', emoji: '⚗️', color: '#E879F9',
    desc: 'Hormones & metabolism',
    fields: ['HbA1c', 'Thyroid panel', 'Insulin protocol', 'Adrenal function'] },
  { id: 'oncology' as Specialty, label: 'Oncology', emoji: '🧬', color: '#34D399',
    desc: 'Cancer diagnosis & treatment',
    fields: ['TNM staging', 'Tumor markers', 'ECOG status', 'Protocol tracking'] },
  { id: 'respiratory' as Specialty, label: 'Respiratory', emoji: '🫁', color: '#FFB347',
    desc: 'Lungs & airways',
    fields: ['Spirometry', 'Peak flow', 'ABG analysis', 'Sleep study'] },
];

function OnboardingBG() {
  return (
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: 'linear-gradient(rgba(0,212,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,1) 1px,transparent 1px)',
          backgroundSize: '60px 60px' }} />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle,rgba(0,212,255,0.15) 0%,transparent 70%)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle,rgba(83,82,237,0.3) 0%,transparent 70%)' }} />
    </div>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div key={i} className="rounded-full"
          animate={{
            width: i === current ? 24 : 6,
            background: i < current ? '#00E5A0' : i === current ? '#00D4FF' : 'rgba(255,255,255,0.1)',
            height: 6,
          }}
          transition={{ duration: 0.35, ease: 'easeInOut' }} />
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { doctor, setDoctorProfile } = useAuthStore();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<Specialty | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    firstName: doctor?.email?.split('@')[0] || '',
    lastName: '',
    institution: '',
    language: 'en',
  });

  const selectedSpec = ONBOARDING_SPECIALTIES.find(s => s.id === selected);
  const hoveredSpec = ONBOARDING_SPECIALTIES.find(s => s.id === hovered);
  const displaySpec = hoveredSpec || selectedSpec;

  const canProceedStep0 = profile.firstName.trim() && profile.lastName.trim();
  const canProceedStep1 = !!selected;

  const handleConfirm = async () => {
    if (!selected) return;
    setSaving(true);

    // CRITICAL: Save to auth store so dashboard auth guard works
    setDoctorProfile({
      id: doctor?.id || 'user',
      email: doctor?.email || '',
      specialty: selected,
    });

    // Small delay for UX
    await new Promise(r => setTimeout(r, 800));
    router.push('/dashboard');
  };

  const inputClass = `
    w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white/80
    placeholder:text-white/20 focus:outline-none focus:border-[#00D4FF]/40 focus:bg-white/[0.05]
    transition-all duration-200
  `;

  return (
    <div className="min-h-screen bg-[#060d19] text-white flex flex-col overflow-hidden">
      <OnboardingBG />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#0050A0] flex items-center justify-center">
            <span className="text-white font-black text-sm">B</span>
          </div>
          <p className="text-[11px] font-bold text-white/50 tracking-tight">BRAIN HEALTH</p>
        </div>
        <StepIndicator current={step} total={3} />
        <p className="text-[10px] text-white/20 font-mono">Step {step + 1} / 3</p>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <AnimatePresence mode="wait">

          {/* STEP 0: Profile */}
          {step === 0 && (
            <motion.div key="step0"
              className="w-full max-w-md"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>

              <div className="mb-8">
                <motion.div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-5"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}>
                  <User size={20} className="text-[#00D4FF]/60" strokeWidth={1.5} />
                </motion.div>
                <h1 className="text-3xl font-black text-white/90 mb-2">Welcome, Doctor.</h1>
                <p className="text-sm text-white/30">Set up your professional profile to personalize your experience.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-white/25 font-mono uppercase tracking-widest mb-1.5">First Name *</label>
                    <input className={inputClass} placeholder="Youssef"
                      value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/25 font-mono uppercase tracking-widest mb-1.5">Last Name *</label>
                    <input className={inputClass} placeholder="El Amrani"
                      value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-white/25 font-mono uppercase tracking-widest mb-1.5">
                    <Building2 size={9} className="inline mr-1" />Institution (optional)
                  </label>
                  <input className={inputClass} placeholder="CHU Ibn Rochd, Casablanca"
                    value={profile.institution} onChange={e => setProfile(p => ({ ...p, institution: e.target.value }))} />
                </div>

                <div>
                  <label className="block text-[10px] text-white/25 font-mono uppercase tracking-widest mb-1.5">
                    <Globe size={9} className="inline mr-1" />Interface Language
                  </label>
                  <div className="flex gap-2">
                    {[{ val: 'en', label: 'English' }, { val: 'fr', label: 'Francais' }].map(opt => (
                      <motion.button key={opt.val}
                        onClick={() => setProfile(p => ({ ...p, language: opt.val }))}
                        className="flex-1 py-2.5 rounded-xl text-xs font-medium border transition-all"
                        style={profile.language === opt.val
                          ? { background: 'rgba(0,212,255,0.12)', borderColor: 'rgba(0,212,255,0.3)', color: '#00D4FF' }
                          : { background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)' }}
                        whileTap={{ scale: 0.97 }}>
                        {opt.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <motion.button
                onClick={() => setStep(1)}
                disabled={!canProceedStep0}
                className="mt-8 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#00D4FF] to-[#0060AA] text-white font-bold text-sm disabled:opacity-30 disabled:pointer-events-none shadow-xl shadow-[#00D4FF]/10"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                Continue <ArrowRight size={16} />
              </motion.button>
            </motion.div>
          )}

          {/* STEP 1: Specialty */}
          {step === 1 && (
            <motion.div key="step1"
              className="w-full max-w-5xl"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>

              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-black text-white/90 mb-2">
                  Select your <span className="text-[#00D4FF]">specialty</span>
                </h1>
                <p className="text-sm text-white/25">Your patient form and AI prompts will adapt to your field.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 mb-8">
                {ONBOARDING_SPECIALTIES.map((spec, i) => {
                  const isSelected = selected === spec.id;
                  return (
                    <motion.button key={spec.id}
                      onClick={() => setSelected(spec.id)}
                      onHoverStart={() => setHovered(spec.id)}
                      onHoverEnd={() => setHovered(null)}
                      className="relative p-4 rounded-2xl border text-left transition-all duration-200 group"
                      style={{
                        background: isSelected ? `${spec.color}10` : 'rgba(255,255,255,0.015)',
                        borderColor: isSelected ? `${spec.color}40` : 'rgba(255,255,255,0.05)',
                      }}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      whileHover={{ y: -4, borderColor: `${spec.color}30` }}
                      whileTap={{ scale: 0.96 }}>

                      {isSelected && (
                        <motion.div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ background: spec.color }}
                          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                          <Check size={9} className="text-white" strokeWidth={3} />
                        </motion.div>
                      )}

                      <span className="text-2xl mb-2 block">{spec.emoji}</span>
                      <p className="text-[11px] font-bold text-white/70 group-hover:text-white/90 transition-colors">{spec.label}</p>
                      <p className="text-[9px] text-white/20 mt-0.5">{spec.desc}</p>
                    </motion.button>
                  );
                })}
              </div>

              {/* Info panel */}
              <AnimatePresence>
                {displaySpec && (
                  <motion.div className="mb-6 p-4 rounded-2xl border flex items-start gap-4"
                    style={{ background: `${displaySpec.color}08`, borderColor: `${displaySpec.color}20` }}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                    key={displaySpec.id}>
                    <span className="text-3xl">{displaySpec.emoji}</span>
                    <div>
                      <p className="text-sm font-bold text-white/80 mb-1">
                        {displaySpec.label}
                        <span className="ml-2 text-[9px] font-normal opacity-50">Specialty form includes:</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {displaySpec.fields.map(f => (
                          <span key={f} className="text-[10px] px-2 py-0.5 rounded-full border font-mono"
                            style={{ color: displaySpec.color, borderColor: `${displaySpec.color}25`, background: `${displaySpec.color}08` }}>
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3">
                <motion.button onClick={() => setStep(0)}
                  className="flex items-center gap-1.5 px-5 py-3 rounded-xl border border-white/[0.07] text-white/30 hover:text-white/60 text-sm"
                  whileTap={{ scale: 0.96 }}>
                  <ChevronLeft size={14} /> Back
                </motion.button>
                <motion.button onClick={() => setStep(2)} disabled={!canProceedStep1}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-[#00D4FF] to-[#0060AA] text-white font-bold text-sm disabled:opacity-30 disabled:pointer-events-none shadow-xl shadow-[#00D4FF]/10"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  Confirm Specialty <ArrowRight size={16} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Confirmation */}
          {step === 2 && (
            <motion.div key="step2"
              className="w-full max-w-md text-center"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>

              {selectedSpec && (
                <>
                  <motion.div
                    className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center text-5xl border"
                    style={{ background: `${selectedSpec.color}0E`, borderColor: `${selectedSpec.color}25` }}
                    initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}>
                    {selectedSpec.emoji}
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <p className="text-[10px] font-mono tracking-widest text-white/20 uppercase mb-2">Ready to launch</p>
                    <h1 className="text-3xl font-black text-white/90 mb-2">
                      Dr. {profile.firstName || 'Doctor'} {profile.lastName || ''}
                    </h1>
                    <p className="text-base font-semibold mb-1" style={{ color: selectedSpec.color }}>
                      {selectedSpec.label}
                    </p>
                    {profile.institution && (
                      <p className="text-xs text-white/25 mb-6">{profile.institution}</p>
                    )}
                    {!profile.institution && <div className="mb-6" />}
                  </motion.div>

                  <motion.div className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-left mb-8 space-y-3"
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <p className="text-[10px] text-white/20 font-mono uppercase tracking-widest mb-3">Your setup</p>
                    {[
                      { label: 'Specialty', value: selectedSpec.label, color: selectedSpec.color },
                      { label: 'Interface', value: profile.language === 'fr' ? 'Francais' : 'English', color: '#00D4FF' },
                      { label: 'AI Model', value: 'HELIX-FT Medical AI', color: '#00E5A0' },
                      { label: 'Transcription', value: 'Whisper · FR/EN auto-detect', color: '#5352ED' },
                    ].map(row => (
                      <div key={row.label} className="flex items-center justify-between">
                        <span className="text-xs text-white/25">{row.label}</span>
                        <span className="text-xs font-semibold" style={{ color: row.color }}>{row.value}</span>
                      </div>
                    ))}
                  </motion.div>

                  <motion.div className="flex gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                    <motion.button onClick={() => setStep(1)}
                      className="px-5 py-3 rounded-xl border border-white/[0.07] text-white/30 hover:text-white/60 text-sm flex items-center gap-1.5"
                      whileTap={{ scale: 0.96 }}>
                      <ChevronLeft size={14} /> Edit
                    </motion.button>
                    <motion.button onClick={handleConfirm} disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-gradient-to-r from-[#00D4FF] to-[#0060AA] text-white font-bold text-sm disabled:opacity-70 shadow-xl shadow-[#00D4FF]/15"
                      whileHover={{ scale: saving ? 1 : 1.02, boxShadow: '0 20px 50px rgba(0,212,255,0.22)' }}
                      whileTap={{ scale: 0.96 }}>
                      {saving ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Setting up workspace...
                        </>
                      ) : (
                        <>
                          Enter BRAIN HEALTH
                          <ArrowRight size={16} />
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Bottom branding */}
      <div className="relative z-10 text-center pb-6">
        <p className="text-[9px] text-white/10 font-mono">
          BRAIN HEALTH · Operation HELIX-FT · For licensed healthcare professionals only
        </p>
      </div>
    </div>
  );
}
