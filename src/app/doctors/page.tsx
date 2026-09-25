"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { Pagination } from '../../components/ui/Pagination';
import { AddDoctorModal } from '../../components/doctors/AddDoctorModal';
import { DoctorPatientsModal } from '../../components/doctors/DoctorPatientsModal';
import { Doctor, Pagination as PaginationType } from '../../types';
import { api } from '../../lib/api';
import {
  UserPlus,
  Search,
  Building,
  Stethoscope,
  Phone,
  Mail,
  Users,
  Calendar,
  Filter,
  RotateCcw,
} from 'lucide-react';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    total: 0,
    page: 1,
    limit: 8,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [hospitals, setHospitals] = useState<string[]>([]);

  // Filter states
  const [search, setSearch] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDoctorForPatients, setSelectedDoctorForPatients] = useState<Doctor | null>(null);

  const fetchDoctors = useCallback(
    async (pageToFetch = 1) => {
      setLoading(true);
      try {
        const res = await api.getDoctors({
          search,
          specialization: selectedSpec,
          hospital: selectedHospital,
          startDate,
          endDate,
          page: pageToFetch,
          limit: 8,
        });

        if (res.success) {
          setDoctors(res.data);
          if (res.pagination) setPagination(res.pagination);
          if (res.filters?.specializations) setSpecializations(res.filters.specializations);
          if (res.filters?.hospitals) setHospitals(res.filters.hospitals);
        }
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
      } finally {
        setLoading(false);
      }
    },
    [search, selectedSpec, selectedHospital, startDate, endDate]
  );

  // Debounced search / filter trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDoctors(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchDoctors]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedSpec('');
    setSelectedHospital('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <DashboardLayout
      title="Doctor Management"
      subtitle="Administrative physician roster, specialties, and corresponding patient rosters"
    >
      <div className="space-y-6">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-brand-jetBlack">Physicians Directory</h2>
            <p className="text-xs text-brand-muted">
              {pagination.total} registered doctors in system
            </p>
          </div>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            variant="primary"
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Register New Doctor
          </Button>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-card space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, hospital, specialization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-bold bg-slate-50/50"
              />
            </div>

            {/* Specialization Filter */}
            <div>
              <select
                value={selectedSpec}
                onChange={(e) => setSelectedSpec(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-bold bg-slate-50/50 text-slate-700"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Hospital Filter */}
            <div>
              <select
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-bold bg-slate-50/50 text-slate-700"
              >
                <option value="">All Hospitals</option>
                {hospitals.map((hosp) => (
                  <option key={hosp} value={hosp}>
                    {hosp}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="w-full"
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Reset Filters
              </Button>
            </div>
          </div>

          {/* Date range filters */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs text-brand-muted">
            <span className="font-semibold text-slate-600 flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Registration Date Filter:
            </span>
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50/50"
              />
              <span>to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <Spinner
              size="lg"
              text="Querying doctors with optimized MongoDB pipeline..."
            />
          </div>
        ) : doctors.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-bold flex items-center justify-center mx-auto mb-3">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-brand-jetBlack">No doctors match your criteria</h4>
            <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">
              Try adjusting your search terms, date parameters, or clearing filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="mt-4"
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card hover:shadow-cardHover transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Avatar & Badge */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-brand-bold border border-blue-100 flex items-center justify-center font-extrabold text-sm group-hover:bg-brand-bold group-hover:text-white transition-colors duration-300 shadow-sm">
                      {doctor.name.replace('Dr. ', '').charAt(0)}
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-brand-bold border border-sky-200">
                      <Users className="w-3 h-3 mr-1 text-brand-light" />
                      {doctor.patientCount ?? 0} patients
                    </span>
                  </div>

                  {/* Doctor Info */}
                  <h3 className="text-sm font-bold text-brand-jetBlack group-hover:text-brand-bold transition-colors">
                    {doctor.name}
                  </h3>
                  <p className="text-xs font-semibold text-brand-bold mt-0.5">
                    {doctor.specialization}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center">
                      <Building className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                      <span className="truncate">{doctor.hospital}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                      <span className="truncate">{doctor.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                      <span className="truncate text-slate-500">{doctor.email}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action: View Corresponding Patients */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedDoctorForPatients(doctor)}
                    leftIcon={<Users className="w-3.5 h-3.5" />}
                  >
                    View Patients ({doctor.patientCount ?? 0})
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          pagination={pagination}
          onPageChange={(newPage) => fetchDoctors(newPage)}
        />
      </div>

      {/* Add Doctor Modal */}
      <AddDoctorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onDoctorAdded={() => fetchDoctors(1)}
      />

      {/* Doctor Patients Roster Modal (View, Add patient under doctor, Delete patient) */}
      <DoctorPatientsModal
        isOpen={!!selectedDoctorForPatients}
        onClose={() => setSelectedDoctorForPatients(null)}
        doctor={selectedDoctorForPatients}
        onPatientCountChanged={() => fetchDoctors(pagination.page)}
      />
    </DashboardLayout>
  );
}
