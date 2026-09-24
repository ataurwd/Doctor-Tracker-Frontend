"use client";

import React from 'react';
import Link from 'next/navigation';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UserRound,
  Users,
  LogOut,
  Activity,
  HeartPulse,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const navItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      active: pathname === '/',
    },
    {
      name: 'Doctors',
      href: '/doctors',
      icon: UserRound,
      active: pathname.startsWith('/doctors'),
    },
    {
      name: 'Patients',
      href: '/patients',
      icon: Users,
      active: pathname.startsWith('/patients'),
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Logo & Brand */}
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <a href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-brand-bold text-white flex items-center justify-center font-bold shadow-md shadow-brand-bold/20">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-brand-jetBlack">
                  Doctor<span className="text-brand-bold">Tracker</span>
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-brand-muted">
                  Hospital Admin
                </span>
              </div>
            </a>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 mt-2">
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Core Modules
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                    item.active
                      ? 'bg-blue-50 text-brand-bold border border-blue-200/80 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-brand-jetBlack'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 mr-3 transition-colors ${
                      item.active ? 'text-brand-bold' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.name}</span>
                  {item.active && (
                    <span className="ml-auto w-1.5 h-4 rounded-full bg-brand-bold" />
                  )}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Bottom: User Card & Logout */}
        <div className="p-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-brand-bold flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-brand-jetBlack truncate">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email || 'admin@doctortracker.com'}</p>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-100 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};
