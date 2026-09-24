"use client";

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { StatCard } from '../components/ui/StatCard';
import { AdmissionTrendChart } from '../components/charts/AdmissionTrendChart';
import { ConditionPieChart } from '../components/charts/ConditionPieChart';
import { DoctorWorkloadChart } from '../components/charts/DoctorWorkloadChart';
import { Button } from '../components/ui/Button';
import { api } from '../lib/api';
import {
  AnalyticsSummary,
  TrendItem,
  DoctorWorkloadItem,
} from '../types';
import {
  UserRound,
  Users,
  Activity,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Stethoscope,
} from 'lucide-react';

export default function DashboardPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [workload, setWorkload] = useState<DoctorWorkloadItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [sumRes, trendRes, workRes] = await Promise.all([
          api.getAnalyticsSummary(),
          api.getAnalyticsTrends(),
          api.getPatientsPerDoctor(),
        ]);

        if (sumRes.success) setSummary(sumRes.data);
        if (trendRes.success) setTrends(trendRes.data);
        if (workRes.success) setWorkload(workRes.data);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <DashboardLayout
      title="Hospital Admin Dashboard"
      subtitle="Comprehensive data visualization and real-time medical staff telemetry"
    >
      <div className="space-y-8">
        {/* KPI Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Registered Doctors"
            value={loading ? '...' : summary?.totalDoctors || 0}
            subtitle="Across 4 medical centers"
            icon={<UserRound className="w-6 h-6 text-brand-bold" />}
            trend="+12%"
            trendPositive={true}
          />
          <StatCard
            title="Total Active Patients"
            value={loading ? '...' : summary?.totalPatients || 0}
            subtitle="Currently under care"
            icon={<Users className="w-6 h-6 text-brand-bold" />}
            trend="+8%"
            trendPositive={true}
          />
          <StatCard
            title="Avg. Patients / Doctor"
            value={loading ? '...' : `${summary?.avgPatientsPerDoctor || 0}`}
            subtitle="Optimized workload target: 4.5"
            icon={<Stethoscope className="w-6 h-6 text-brand-bold" />}
            trend="+0.4"
            trendPositive={true}
          />
          <StatCard
            title="Critical Condition Cases"
            value={loading ? '...' : summary?.criticalCases || 0}
            subtitle="Requiring urgent attention"
            icon={<AlertCircle className="w-6 h-6 text-rose-600" />}
            trend="-2"
            trendPositive={true}
          />
        </div>

        {/* Charts Row 1: Admissions Timeline & Condition Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline Chart (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-brand-jetBlack flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-brand-bold" />
                  Patient Admission Trends
                </h3>
                <p className="text-xs text-brand-muted">
                  Daily patient intakes and registration trajectory over time
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 text-brand-bold font-semibold border border-blue-100">
                Live Timeline
              </span>
            </div>
            {loading ? (
              <div className="h-72 flex items-center justify-center text-xs text-brand-muted animate-pulse">
                Aggregating date statistics...
              </div>
            ) : (
              <AdmissionTrendChart data={trends} />
            )}
          </div>

          {/* Condition Distribution (1 col) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
            <div className="mb-4">
              <h3 className="text-base font-bold text-brand-jetBlack flex items-center">
                <Activity className="w-4 h-4 mr-2 text-brand-light" />
                Condition Breakdown
              </h3>
              <p className="text-xs text-brand-muted">Distribution by clinical classification</p>
            </div>
            {loading ? (
              <div className="h-72 flex items-center justify-center text-xs text-brand-muted animate-pulse">
                Loading condition analytics...
              </div>
            ) : (
              <ConditionPieChart data={summary?.conditionDistribution || []} />
            )}
          </div>
        </div>

        {/* Charts Row 2: Doctor Workload Chart & Quick Navigation Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Doctor Patient Distribution */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-brand-jetBlack">
                  Doctor Patient Workload
                </h3>
                <p className="text-xs text-brand-muted">
                  Comparison of active assigned patients per physician
                </p>
              </div>
              <a
                href="/doctors"
                className="text-xs font-semibold text-brand-bold hover:text-brand-boldDark inline-flex items-center"
              >
                View All Doctors <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
            {loading ? (
              <div className="h-72 flex items-center justify-center text-xs text-brand-muted animate-pulse">
                Loading workload data...
              </div>
            ) : (
              <DoctorWorkloadChart data={workload} />
            )}
          </div>

          {/* Top Doctors Quick Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-brand-jetBlack">Top Specialists</h3>
                <span className="text-[11px] text-slate-400">By Patient Volume</span>
              </div>
              <div className="space-y-3">
                {workload.slice(0, 5).map((doc, idx) => (
                  <div
                    key={doc._id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-100"
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-brand-bold font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-brand-jetBlack truncate">{doc.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{doc.specialization}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-brand-bold border border-blue-200 shrink-0">
                      {doc.patientCount} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4">
              <a href="/patients">
                <Button variant="secondary" size="sm" className="w-full">
                  Go to Dedicated Patients Page
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
