"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { EditPatientModal } from '../../components/patients/EditPatientModal';
import { DeletePatientModal } from '../../components/patients/DeletePatientModal';
import { Patient, Doctor, Pagination as PaginationType } from '../../types';
import { api } from '../../lib/api';
import {
  Search,
  Calendar,
  Filter,
  RotateCcw,
  Edit2,
  Trash2,
  Users,
  Building,
  UserCheck,
} from 'lucide-react';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filter state
  const [search, setSearch] = useState('');
  const [condition, setCondition] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [loading, setLoading] = useState(true);

  // Modals state
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);

  // Load doctors for filter dropdown and edit modal
  useEffect(() => {
    async function loadDoctors() {
      try {
        const res = await api.getDoctors({ limit: 100 });
        if (res.success) setDoctors(res.data);
      } catch (e) {
        console.error('Failed to load doctors list:', e);
      }
    }
    loadDoctors();
  }, []);

  const fetchPatients = useCallback(
    async (pageToFetch = 1) => {
      setLoading(true);
      try {
        const res = await api.getPatients({
          search,
          condition,
          doctorId: selectedDoctorId,
          startDate,
          endDate,
          page: pageToFetch,
          limit: 10,
        });

        if (res.success) {
          setPatients(res.data);
          if (res.pagination) setPagination(res.pagination);
        }
      } catch (err) {
        console.error('Failed to fetch patients:', err);
      } finally {
        setLoading(false);
      }
    },
    [search, condition, selectedDoctorId, startDate, endDate]
  );

  // Debounced query execution
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPatients(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchPatients]);

  const handleResetFilters = () => {
    setSearch('');
    setCondition('');
    setSelectedDoctorId('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <DashboardLayout
      title="Patient Management"
      subtitle="Dedicated registry for patient admission records, condition classification, and physician assignments"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-brand-jetBlack">All Registered Patients</h2>
            <p className="text-xs text-brand-muted">
              {pagination.total} patient records found
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-card space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="relative lg:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient by name, phone, notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-bold bg-slate-50/50"
              />
            </div>

            {/* Condition Filter */}
            <div>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-bold bg-slate-50/50 text-slate-700"
              >
                <option value="">All Conditions</option>
                <option value="Critical">Critical</option>
                <option value="Stable">Stable</option>
                <option value="Recovering">Recovering</option>
                <option value="Routine Checkup">Routine Checkup</option>
                <option value="Under Observation">Under Observation</option>
              </select>
            </div>

            {/* Doctor Filter */}
            <div>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-bold bg-slate-50/50 text-slate-700"
              >
                <option value="">All Doctors</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filters */}
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

          {/* Date-wise Filter */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs text-brand-muted">
            <span className="font-semibold text-slate-600 flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Admission Date Filter:
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

        {/* Patients Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
          {loading ? (
            <div className="py-24 flex items-center justify-center">
              <Spinner
                size="lg"
                text="Querying patients with indexed MongoDB aggregation..."
              />
            </div>
          ) : patients.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-bold flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-brand-jetBlack">No patients found</h4>
              <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">
                No matching records with current filter settings.
              </p>
              <Button variant="outline" size="sm" onClick={handleResetFilters} className="mt-4">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Patient Name</th>
                    <th className="py-3.5 px-4">Age / Gender</th>
                    <th className="py-3.5 px-4">Condition</th>
                    <th className="py-3.5 px-4">Assigned Doctor</th>
                    <th className="py-3.5 px-4">Admission Date</th>
                    <th className="py-3.5 px-4">Medical Notes</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patients.map((patient) => {
                    const assignedDoc =
                      typeof patient.doctorId === 'object' && patient.doctorId !== null
                        ? (patient.doctorId as Doctor)
                        : null;

                    return (
                      <tr key={patient._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-brand-jetBlack">{patient.name}</p>
                          <p className="text-[11px] text-slate-400">{patient.phone}</p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {patient.age} yrs • {patient.gender}
                        </td>
                        <td className="py-3.5 px-4">
                          <Badge condition={patient.condition} />
                        </td>
                        <td className="py-3.5 px-4">
                          {assignedDoc ? (
                            <div>
                              <p className="font-semibold text-brand-jetBlack">{assignedDoc.name}</p>
                              <p className="text-[11px] text-brand-bold">
                                {assignedDoc.specialization}
                              </p>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-medium">
                          {new Date(patient.admissionDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="py-3.5 px-4 max-w-xs truncate text-slate-500">
                          {patient.medicalNotes || '—'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center space-x-1.5">
                            <button
                              onClick={() => setEditingPatient(patient)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-brand-bold hover:bg-blue-50 transition-colors"
                              title="Edit patient"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingPatient(patient)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete patient"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="px-4">
            <Pagination
              pagination={pagination}
              onPageChange={(newPage) => fetchPatients(newPage)}
            />
          </div>
        </div>
      </div>

      {/* Edit Patient Modal */}
      <EditPatientModal
        isOpen={!!editingPatient}
        onClose={() => setEditingPatient(null)}
        patient={editingPatient}
        doctors={doctors}
        onPatientUpdated={() => fetchPatients(pagination.page)}
      />

      {/* Delete Patient Confirmation Modal */}
      <DeletePatientModal
        isOpen={!!deletingPatient}
        onClose={() => setDeletingPatient(null)}
        patient={deletingPatient}
        onPatientDeleted={() => fetchPatients(pagination.page)}
      />
    </DashboardLayout>
  );
}
