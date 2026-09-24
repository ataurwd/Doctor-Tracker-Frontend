"use client";

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Patient, Doctor, PatientCondition, PatientGender } from '../../types';
import { api } from '../../lib/api';

interface EditPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  doctors: Doctor[];
  onPatientUpdated: () => void;
}

export const EditPatientModal: React.FC<EditPatientModalProps> = ({
  isOpen,
  onClose,
  patient,
  doctors,
  onPatientUpdated,
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    age: number | '';
    gender: PatientGender;
    condition: PatientCondition;
    phone: string;
    doctorId: string;
    medicalNotes: string;
  }>({
    name: '',
    age: '',
    gender: 'Male',
    condition: 'Stable',
    phone: '',
    doctorId: '',
    medicalNotes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (patient) {
      const docId =
        typeof patient.doctorId === 'object' && patient.doctorId !== null
          ? (patient.doctorId as Doctor)._id
          : String(patient.doctorId);

      setFormData({
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        condition: patient.condition,
        phone: patient.phone,
        doctorId: docId,
        medicalNotes: patient.medicalNotes || '',
      });
      setError(null);
    }
  }, [patient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;

    if (!formData.name || formData.age === '' || !formData.phone || !formData.doctorId) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.updatePatient(patient._id, formData);
      onPatientUpdated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update patient record');
    } finally {
      setLoading(false);
    }
  };

  if (!patient) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Patient Information"
      subtitle={`Updating record for ${patient.name}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-brand-jetBlack mb-1">
            Patient Full Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-bold bg-slate-50/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-brand-jetBlack mb-1">Age *</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  age: e.target.value === '' ? '' : parseInt(e.target.value, 10),
                })
              }
              required
              min={0}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-bold bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-jetBlack mb-1">Gender *</label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value as PatientGender })
              }
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-bold bg-slate-50/50"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-brand-jetBlack mb-1">
              Medical Condition *
            </label>
            <select
              value={formData.condition}
              onChange={(e) =>
                setFormData({ ...formData, condition: e.target.value as PatientCondition })
              }
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-bold bg-slate-50/50"
            >
              <option value="Critical">Critical</option>
              <option value="Stable">Stable</option>
              <option value="Recovering">Recovering</option>
              <option value="Routine Checkup">Routine Checkup</option>
              <option value="Under Observation">Under Observation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-jetBlack mb-1">
              Contact Phone *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-bold bg-slate-50/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-jetBlack mb-1">
            Assigned Doctor *
          </label>
          <select
            value={formData.doctorId}
            onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
            required
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-bold bg-slate-50/50"
          >
            <option value="">Select a Doctor</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.name} ({doc.specialization} - {doc.hospital})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-jetBlack mb-1">
            Clinical Notes / Diagnosis
          </label>
          <textarea
            rows={3}
            value={formData.medicalNotes}
            onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-bold bg-slate-50/50"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
