"use client";

import React from 'react';
import { Menu, ShieldCheck, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TopbarProps {
  setMobileOpen: (open: boolean) => void;
  title?: string;
  subtitle?: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  setMobileOpen,
  title = 'Portal Overview',
  subtitle = 'Real-time medical staff & patient records',
}) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile hamburger + Page Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl border border-slate-200 text-slate-600 lg:hidden hover:bg-slate-50"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-brand-jetBlack leading-tight">
            {title}
          </h1>
          <p className="text-xs text-brand-muted hidden sm:block">{subtitle}</p>
        </div>
      </div>

      {/* Right: Status badge & User indicator */}
      <div className="flex items-center space-x-3">
        <div className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-2 h-2 mr-2 rounded-full bg-emerald-500 animate-pulse" />
          System Active
        </div>

        <div className="flex items-center pl-2 border-l border-slate-200 space-x-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-brand-bold border border-blue-200 flex items-center justify-center font-bold text-xs shadow-sm">
            <ShieldCheck className="w-5 h-5 text-brand-bold" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-brand-jetBlack leading-tight">
              {user?.name || 'Admin'}
            </p>
            <p className="text-[10px] text-slate-500">Super Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};
