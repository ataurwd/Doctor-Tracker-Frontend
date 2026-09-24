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
  UserCheck,
  CheckCircle2,
  ShieldCheck,
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
    role: 'Chief Administrator',
    email: 'admin@doctortracker.com',
    password: 'admin123',
    initials: 'SC',
  },
  {
    id: 'user-2',
    name: 'Dr. Arthur Bell',
    role: 'Medical Director',
    email: 'director@doctortracker.com',
    password: 'director123',
    initials: 'AB',
  },
  {
    id: 'user-3',
    name: 'Elena Vasquez',
    role: 'Clinical Supervisor',
    email: 'supervisor@doctortracker.com',
    password: 'supervisor123',
    initials: 'EV',
  },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [filledNotice, setFilledNotice] = useState<string | null>(null);
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
    setFilledNotice(`Credentials filled for ${user.name} (${user.role}). Click "Sign In" below!`);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-brand-softWhite flex flex-col justify-center items-center p-4 sm:p-6">
      {/* Container */}
      <div className="max-w-lg w-full">
        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-brand-bold text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-brand-bold/25">
            <HeartPulse className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-brand-jetBlack tracking-tight">
            Doctor<span className="text-brand-bold">Tracker</span>
          </h2>
          <p className="text-xs text-brand-muted mt-1">
            Administrative Management & Healthcare Telemetry Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/80">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-brand-jetBlack">Portal Login</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a quick login account or enter your administrator credentials
            </p>
          </div>

          {/* Quick Login User Selector Buttons */}
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-brand-light" />
                Quick Login Test Accounts
              </span>
              <span className="text-[10px] text-brand-bold font-medium">Click to fill form</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {DEMO_USERS.map((user) => {
                const isSelected = selectedUserId === user.id;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelectQuickUser(user)}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between relative group ${
                      isSelected
                        ? 'border-brand-bold bg-blue-50/70 shadow-sm ring-1 ring-brand-bold'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-bold absolute top-2.5 right-2.5" />
                    )}

                    <div className="flex items-center space-x-2 mb-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isSelected
                            ? 'bg-brand-bold text-white'
                            : 'bg-sky-100 text-brand-bold group-hover:bg-brand-bold group-hover:text-white transition-colors'
                        }`}
                      >
                        {user.initials}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-brand-jetBlack truncate leading-tight">
                          {user.name}
                        </p>
                      </div>
                    </div>

                    <div>
                      <span className="inline-block text-[10px] px-2 py-0.5 rounded-md font-semibold bg-white border border-slate-200/80 text-brand-bold truncate max-w-full">
                        {user.role}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fill Notice */}
          {filledNotice && (
            <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-brand-bold text-xs flex items-center space-x-2 animate-in fade-in duration-200">
              <UserCheck className="w-4 h-4 shrink-0 text-brand-bold" />
              <span>{filledNotice}</span>
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
          <form onSubmit={handleSubmit} className="space-y-4">
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
                    setSelectedUserId(null);
                    if (error) setError(null);
                    if (filledNotice) setFilledNotice(null);
                  }}
                  placeholder="admin@doctortracker.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-bold focus:border-brand-bold bg-slate-50/50"
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
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-bold focus:border-brand-bold bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
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
              className="w-full mt-2"
              rightIcon={<ShieldCheck className="w-4 h-4" />}
            >
              Sign In to Portal
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
