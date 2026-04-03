'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/store/uiStore';
import { useLanguage } from '@/hooks/useLanguage';

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { t } = useLanguage();
  const pathname = usePathname();

  const menuItems = [
    {
      href: '/dashboard',
      icon: '📊',
      label: 'Dashboard',
      labelFr: 'Tableau de bord',
    },
    {
      href: '/dashboard/patients',
      icon: '👥',
      label: 'Patients',
      labelFr: 'Patients',
    },
    {
      href: '/dashboard/history',
      icon: '📋',
      label: 'Consultation History',
      labelFr: 'Historique des consultations',
    },
    {
      href: '/dashboard/reports',
      icon: '📄',
      label: 'Reports',
      labelFr: 'Rapports',
    },
    {
      href: '/dashboard/settings',
      icon: '⚙️',
      label: 'Settings',
      labelFr: 'Paramètres',
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 mt-20 h-[calc(100vh-80px)] w-64 bg-[#0F1B2D] border-r border-[rgba(0,212,255,0.15)] overflow-y-auto z-40 transform transition-transform duration-300 lg:static lg:z-auto lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 space-y-2">
          {menuItems.map((item) => {
            const isItemActive = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  // Close sidebar on mobile after navigation
                  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                    toggleSidebar();
                  }
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isItemActive
                    ? 'bg-[#00D4FF]/20 border border-[#00D4FF]/50 text-[#00D4FF]'
                    : 'text-[#8BA3BE] hover:bg-[#162236] hover:text-[#E8F4FD]'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-[rgba(0,212,255,0.15)]">
          <div className="space-y-2 text-sm text-[#8BA3BE]">
            <p className="text-xs text-[#00D4FF] font-semibold">BRAIN HEALTH</p>
            <p className="text-xs">Operation HELIX-FT</p>
            <p className="text-xs">MVP v2.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
