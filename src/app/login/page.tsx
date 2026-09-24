"use client";

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { HeartPulse, Lock, Mail, ShieldAlert, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@doctortracker.com');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-brand-softWhite flex flex-col justify-center items-center p-4 sm:p-6">
      {/* Container */}
      <div className="max-w-md w-full">
        {/* Brand header */}
        <div className="text-center mb-8">
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
        <div className="bg-white rounded-3xl p-8 shadow-card border border-slate-200/80">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-brand-jetBlack">Welcome Back</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your administrative credentials to access the console
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand-jetBlack mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@doctortracker.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-bold focus:border-brand-bold bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-jetBlack mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-bold focus:border-brand-bold bg-slate-50/50"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full mt-2"
            >
              Sign In to Portal
            </Button>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-sky-50 text-brand-bold hover:bg-sky-100 border border-sky-200/80 text-xs font-semibold transition-colors"
            >
              <Sparkles className="w-4 h-4 text-brand-light" />
              <span>Fill Demo Credentials (admin123)</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-slate-400 mt-6">
          Doctor Tracker Portal • Secured with JWT Authentication
        </p>
      </div>
    </div>
  );
}
