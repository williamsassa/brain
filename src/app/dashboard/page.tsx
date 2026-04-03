'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import PatientFormContainer from '@/components/patient-form/PatientFormContainer';
import ChatContainer from '@/components/chat/ChatContainer';
import { useAuthStore } from '@/store/authStore';
import { usePatientStore } from '@/store/patientStore';
import { SPECIALTIES } from '@/types/specialty';
import { LogOut, Globe, User, Stethoscope, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';
import { PatientForm } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export default function DashboardPage() {
  const router = useRouter();
  const { doctor, user, logout } = useAuthStore();
  const { currentPatient, setCurrentPatient } = usePatientStore();
  const { language, toggleLanguage, t } = useLanguage();
  const [isClient, setIsClient] = useState(false);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auth guard
  useEffect(() => {
    if (!isClient) return;
    if (!doctor) {
      router.push('/auth');
      return;
    }
    if (!doctor.specialty) {
      router.push('/onboarding');
      return;
    }
  }, [isClient, doctor, router]);

  // Initialize empty patient form
  useEffect(() => {
    if (!isClient || !doctor) return;
    if (!currentPatient) {
      const newPatient: PatientForm = {
        id: uuidv4(),
        specialty: doctor.specialty,
        identity: {},
        vitals: {},
        medicalHistory: {},
        chiefComplaint: '',
        specialtyData: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCurrentPatient(newPatient);
    }
  }, [isClient, doctor, currentPatient, setCurrentPatient]);

  const handleLogout = async () => {
    const { signOut } = await import('firebase/auth');
    const { auth } = await import('@/lib/firebase');
    try {
      await signOut(auth);
    } catch (e) {}
    logout();
    router.push('/auth');
  };

  if (!isClient || !doctor || !doctor.specialty) {
    return (
      <div className="h-screen w-full bg-[#060d19] flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Animated loading spinner */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-[#00D4FF]/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-1 rounded-full border-2 border-transparent border-t-[#00D4FF]"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity size={24} className="text-[#00D4FF]" />
            </div>
          </div>
          <motion.p
            className="text-[#00D4FF] font-medium text-sm"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading BRAIN HEALTH...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  const specialtyConfig = SPECIALTIES[doctor.specialty as keyof typeof SPECIALTIES];

  if (!specialtyConfig) {
    router.push('/onboarding');
    return null;
  }

  return (
    <div className="h-screen bg-[#060d19] flex flex-col overflow-hidden">
      {/* Subtle animated background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[40%] -left-[20%] w-[60%] h-[60%] bg-[#00D4FF]/[0.02] rounded-full blur-[120px]" />
        <div className="absolute -bottom-[30%] -right-[15%] w-[50%] h-[50%] bg-[#5352ED]/[0.02] rounded-full blur-[120px]" />
      </div>

      {/* Top Navigation Bar */}
      <motion.header
        className="relative z-50 flex-shrink-0 border-b border-white/[0.06]"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="h-14 px-4 flex items-center justify-between bg-[#0a1020]/80 backdrop-blur-2xl">
          {/* Left side */}
          <div className="flex items-center gap-3">
            <motion.div
              className="flex items-center gap-2.5"
              whileHover={{ scale: 1.01 }}
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg shadow-[#00D4FF]/10">
                  <Image src="/logo.png" alt="BRAIN HEALTH" width={36} height={36} className="w-full h-full object-cover" />
                </div>
                <motion.div
                  className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#00E5A0] rounded-full border-2 border-[#0a1020]"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold tracking-tight text-white/90">BRAIN HEALTH</h1>
                <p className="text-[9px] text-white/25 font-medium tracking-[0.2em] uppercase">HELIX-FT</p>
              </div>
            </motion.div>

            <div className="hidden md:block w-px h-6 bg-white/[0.06] mx-1" />

            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
              <Stethoscope size={12} className="text-[#00D4FF]/70" />
              <span className="text-[11px] text-white/50 font-medium">{specialtyConfig.name}</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] text-white/40 hover:text-white/70 hover:bg-white/[0.06] hover:border-white/[0.1] transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Globe size={12} />
              {language === 'en' ? 'FR' : 'EN'}
            </motion.button>

            <div className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#00D4FF]/20 to-[#00D4FF]/5 flex items-center justify-center">
                <User size={10} className="text-[#00D4FF]/70" />
              </div>
              <span className="text-[11px] text-white/40">{doctor.email}</span>
            </div>

            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-[#FF4757]/60 hover:text-[#FF4757] bg-[#FF4757]/[0.04] hover:bg-[#FF4757]/[0.08] border border-[#FF4757]/[0.08] hover:border-[#FF4757]/20 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut size={12} />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content - Split Layout */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Left Panel - Patient Form */}
        <motion.div
          className="relative flex flex-col overflow-hidden bg-[#080e1a]/60"
          animate={{ width: leftPanelCollapsed ? '0px' : '50%' }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{ minWidth: leftPanelCollapsed ? 0 : '380px', maxWidth: leftPanelCollapsed ? 0 : '55%' }}
        >
          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
            <div className="p-4">
              <PatientFormContainer />
            </div>
          </div>
        </motion.div>

        {/* Resizable divider */}
        <div className="relative z-10 flex-shrink-0 w-px bg-white/[0.06] group">
          <motion.button
            onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-10 rounded-full bg-[#0f1829] border border-white/[0.1] flex items-center justify-center text-white/30 hover:text-[#00D4FF] hover:border-[#00D4FF]/30 hover:bg-[#0f1829] transition-all z-20 shadow-xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {leftPanelCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </motion.button>
        </div>

        {/* Right Panel - AI Chat */}
        <motion.div
          className="flex-1 flex flex-col overflow-hidden min-w-[380px]"
          layout
        >
          <ChatContainer />
        </motion.div>
      </div>
    </div>
  );
}
