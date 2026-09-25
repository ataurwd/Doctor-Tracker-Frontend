"use client";

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAuth } from '../../context/AuthContext';

import { Spinner } from '../ui/Spinner';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-softWhite flex items-center justify-center">
        <Spinner size="xl" text="Loading Doctor Tracker..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // AuthProvider handles redirect
  }

  return (
    <div className="min-h-screen bg-brand-softWhite flex flex-col">
      {/* Sidebar for desktop and drawer for mobile */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <Topbar setMobileOpen={setMobileOpen} title={title} subtitle={subtitle} />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
