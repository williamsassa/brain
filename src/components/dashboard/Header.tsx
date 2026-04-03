'use client';

import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { useLanguage } from '@/hooks/useLanguage';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  const router = useRouter();
  const { user, doctor, logout } = useAuthStore();
  const { toggleSidebar, language, toggleLanguage } = useUIStore();
  const { t } = useLanguage();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-[#0A1628]/80 backdrop-blur-sm border-b border-[rgba(0,212,255,0.15)]">
      <div className="max-w-full px-6 py-4 flex items-center justify-between">
        {/* Left: Logo and Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-[#162236] rounded-lg transition"
            title="Toggle sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-8 h-8 rounded-xl overflow-hidden">
              <Image src="/logo.png" alt="BRAIN HEALTH" width={32} height={32} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-bold">{t('app_name' as any)}</h1>
              <p className="text-xs text-[#8BA3BE]">Operation HELIX-FT</p>
            </div>
          </Link>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-4">
          {/* Specialty Badge */}
          {doctor?.specialty && (
            <div className="hidden sm:block px-4 py-2 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-sm font-medium">
              {doctor.specialty.charAt(0).toUpperCase() + doctor.specialty.slice(1)}
            </div>
          )}

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="p-2 hover:bg-[#162236] rounded-lg transition text-sm font-medium border border-transparent hover:border-[#00D4FF]/30"
            title="Toggle language"
          >
            {language === 'en' ? '🇬🇧 EN' : '🇫🇷 FR'}
          </button>

          {/* Profile Menu */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">{user?.email?.split('@')[0]}</p>
              <p className="text-xs text-[#8BA3BE]">Doctor</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#00D4FF]/20 border border-[#00D4FF]/30 flex items-center justify-center font-bold text-[#00D4FF]">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-xs sm:text-sm"
          >
            {t('sign_out' as any)}
          </Button>
        </div>
      </div>
    </header>
  );
}
