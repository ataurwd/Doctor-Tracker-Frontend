"use client";

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import {
  HeartPulse,
  Lock,
  Mail,
  ShieldAlert,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

interface QuickUser {
  id: string;
  name: string;
  role: string;
  email: string;
  password: string;
  initials: string;
}

const DEMO_USERS: QuickUser[] = [
  {
    id: 'user-1',
    name: 'Sarah Connor',
    role: 'Primary Admin',
    email: 'admin@doctortracker.com',
    password: 'admin123',
    initials: 'SC',
  },
  {
    id: 'user-2',
    name: 'Dr. Arthur Bell',
    role: 'Operations Admin',
    email: 'director@doctortracker.com',
    password: 'director123',
    initials: 'AB',
  },
  {
    id: 'user-3',
    name: 'Elena Vasquez',
    role: 'Records Admin',
    email: 'supervisor@doctortracker.com',
    password: 'supervisor123',
    initials: 'EV',
  },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@doctortracker.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('user-1');
  const [filledNotice, setFilledNotice] = useState<string | null>(
    'Credentials pre-loaded for Sarah Connor (Primary Admin). Click "Sign In" below!'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuickUser = (user: QuickUser) => {
    setEmail(user.email);
    setPassword(user.password);
    setSelectedUserId(user.id);
    setFilledNotice(`Credentials loaded for ${user.name} (${user.role}). Click "Sign In to Portal" to enter!`);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-brand-softWhite flex flex-col justify-center items-center p-4 sm:p-6 relative selection:bg-brand-bold selection:text-white">
      {/* Background ambient gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-light/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-md w-full relative z-10">
        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-brand-bold text-white flex items-center justify-center mx-auto mb-3 shadow-xl shadow-brand-bold/25 ring-4 ring-blue-100">
            <HeartPulse className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-brand-jetBlack tracking-tight">
            Doctor<span className="text-brand-bold">Tracker</span>
          </h2>
          <p className="text-xs text-brand-muted mt-1 font-medium">
            Administrative Management & Healthcare Telemetry Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/80 relative overflow-hidden">
          {/* Top colored accent line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-bold via-brand-light to-brand-bold" />

          <div className="mb-5">
            <h3 className="text-lg font-bold text-brand-jetBlack">Administrator Login</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose an administrative profile below or type credentials manually
            </p>
          </div>

          {/* Quick Login Test Accounts - Spacious & Uncut design */}
          <div className="mb-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-brand-bold" />
                Quick Login Test Accounts
              </span>
              <span className="text-[10px] text-brand-bold font-semibold">1-Click Auto Fill</span>
            </div>

            <div className="space-y-2">
              {DEMO_USERS.map((user) => {
                const isSelected = selectedUserId === user.id;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelectQuickUser(user)}
                    className={`w-full p-2.5 sm:p-3 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between group ${
                      isSelected
                        ? 'border-brand-bold bg-blue-50/60 shadow-sm ring-1 ring-brand-bold'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-brand-bold text-white shadow-sm'
                            : 'bg-blue-50 text-brand-bold group-hover:bg-brand-bold group-hover:text-white'
                        }`}
                      >
                        {user.initials}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-brand-jetBlack truncate">
                            {user.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-white border border-slate-200 text-brand-bold shrink-0">
                            {user.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 pl-2">
                      {isSelected ? (
                        <span className="inline-flex items-center text-xs font-bold text-brand-bold">
                          <CheckCircle2 className="w-4 h-4 mr-1 text-brand-bold" />
                          <span className="hidden sm:inline">Active</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400 group-hover:text-brand-bold">
                          Select
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Notice */}
          {filledNotice && (
            <div className="mb-4 p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/80 text-brand-bold text-xs flex items-center space-x-2 animate-in fade-in duration-200">
              <UserCheck className="w-4 h-4 shrink-0 text-brand-bold" />
              <span className="text-[11px] leading-tight font-medium">{filledNotice}</span>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2 animate-in fade-in duration-200">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-xs font-semibold text-brand-jetBlack mb-1">
                Administrator Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSelectedUserId('');
                    if (error) setError(null);
                    if (filledNotice) setFilledNotice(null);
                  }}
                  placeholder="admin@doctortracker.com"
                  required
                  autoComplete="off"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-bold/20 focus:border-brand-bold bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-jetBlack mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                    if (filledNotice) setFilledNotice(null);
                  }}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-bold/20 focus:border-brand-bold bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full mt-2 font-bold shadow-md shadow-brand-bold/20"
              rightIcon={!loading ? <ArrowRight className="w-4 h-4" /> : undefined}
            >
              {loading ? 'Authenticating & Loading...' : 'Sign In to Portal'}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-slate-400 mt-6">
          Doctor Tracker Portal • Secured with JWT Authentication & Role-Based Access
        </p>
      </div>
    </div>
  );
}
