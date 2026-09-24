"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Doctor, Patient, PatientCondition, PatientGender } from '../../types';
import { api } from '../../lib/api';
import { Plus, Trash2, Search, Calendar, Phone, FileText } from 'lucide-react';

interface DoctorPatientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  onPatientCountChanged?: () => void;
}

export const DoctorPatientsModal: React.FC<DoctorPatientsModalProps> = ({
  isOpen,
  onClose,
  doctor,
  onPatientCountChanged,
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // New patient state
  const [newPatient, setNewPatient] = useState<{
    name: string;
    age: number | '';
    gender: PatientGender;
    condition: PatientCondition;
    phone: string;
    medicalNotes: string;
  }>({
    name: '',
    age: '',
    gender: 'Male',
    condition: 'Stable',
    phone: '',
    medicalNotes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    if (!doctor) return;
    setLoading(true);
    try {
      const res = await api.getDoctorPatients(doctor._id, { search, limit: 50 });
      if (res.success) {
        setPatients(res.data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [doctor, search]);

  useEffect(() => {
    if (isOpen && doctor) {
      fetchPatients();
      setShowAddForm(false);
      setActionError(null);
    }
  }, [isOpen, doctor, fetchPatients]);

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor) return;
    if (!newPatient.name || newPatient.age === '' || !newPatient.phone) {
      setActionError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setActionError(null);
    try {
      await api.addPatientToDoctor(doctor._id, newPatient);
      setNewPatient({
        name: '',
        age: '',
        gender: 'Male',
        condition: 'Stable',
        phone: '',
        medicalNotes: '',
      });
      setShowAddForm(false);
      fetchPatients();
      if (onPatientCountChanged) onPatientCountChanged();
    } catch (err: any) {
      setActionError(err.message || 'Failed to add patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    if (!doctor) return;
    if (!confirm('Are you sure you want to remove this patient from the doctor list?')) return;

    try {
      await api.removePatientFromDoctor(doctor._id, patientId);
      setPatients((prev) => prev.filter((p) => p._id !== patientId));
      if (onPatientCountChanged) onPatientCountChanged();
    } catch (err: any) {
      alert(err.message || 'Failed to delete patient');
    }
  };

  if (!doctor) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${doctor.name} — Patient Roster`}
      subtitle={`${doctor.specialization} • ${doctor.hospital}`}
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Actions bar: Search & Add button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patients by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-bold bg-slate-50/50"
            />
          </div>

          <Button
            type="button"
            size="sm"
            variant={showAddForm ? 'outline' : 'primary'}
            onClick={() => setShowAddForm(!showAddForm)}
            leftIcon={showAddForm ? undefined : <Plus className="w-4 h-4" />}
          >
            {showAddForm ? 'Cancel New Patient' : 'Add New Patient'}
          </Button>
        </div>

        {/* Collapsible New Patient Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddPatient}
            className="p-4 rounded-xl bg-blue-50/40 border border-blue-200/80 space-y-3 animate-in fade-in duration-200"
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-bold">
              Assign New Patient to Dr. {doctor.name}
            </h4>

            {actionError && (
              <div className="p-2 text-xs rounded-lg bg-rose-50 border border-rose-200 text-rose-700">
                {actionError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Patient Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  required
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Age *
                </label>
                <input
                  type="number"
                  placeholder="e.g. 42"
                  value={newPatient.age}
                  onChange={(e) =>
                    setNewPatient({
                      ...newPatient,
                      age: e.target.value === '' ? '' : parseInt(e.target.value, 10),
                    })
                  }
                  required
                  min={0}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Gender *
                </label>
                <select
                  value={newPatient.gender}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, gender: e.target.value as PatientGender })
                  }
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Condition *
                </label>
                <select
                  value={newPatient.condition}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, condition: e.target.value as PatientCondition })
                  }
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                >
                  <option value="Critical">Critical</option>
                  <option value="Stable">Stable</option>
                  <option value="Recovering">Recovering</option>
                  <option value="Routine Checkup">Routine Checkup</option>
                  <option value="Under Observation">Under Observation</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                  required
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Medical Notes / Diagnosis
              </label>
              <input
                type="text"
                placeholder="Initial diagnosis or symptoms..."
                value={newPatient.medicalNotes}
                onChange={(e) => setNewPatient({ ...newPatient, medicalNotes: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" size="sm" variant="primary" isLoading={isSubmitting}>
                Save & Assign Patient
              </Button>
            </div>
          </form>
        )}

        {/* Patients List Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden max-h-96 overflow-y-auto">
          {loading ? (
            <div className="py-12 text-center text-xs text-brand-muted animate-pulse">
              Loading patients...
            </div>
          ) : patients.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No patients registered under this doctor yet.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Patient</th>
                  <th className="py-2.5 px-3">Age / Sex</th>
                  <th className="py-2.5 px-3">Condition</th>
                  <th className="py-2.5 px-3">Admission</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {patients.map((pat) => (
                  <tr key={pat._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3">
                      <p className="font-bold text-brand-jetBlack">{pat.name}</p>
                      <p className="text-[11px] text-slate-400">{pat.phone}</p>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {pat.age} yrs • {pat.gender}
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge condition={pat.condition} />
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {new Date(pat.admissionDate).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleDeletePatient(pat._id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Delete patient from doctor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Modal>
  );
};
