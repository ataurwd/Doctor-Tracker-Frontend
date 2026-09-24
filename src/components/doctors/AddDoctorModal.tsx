"use client";

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { api } from '../../lib/api';

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDoctorAdded: () => void;
}

export const AddDoctorModal: React.FC<AddDoctorModalProps> = ({
  isOpen,
  onClose,
  onDoctorAdded,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    hospital: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.specialization || !formData.hospital || !formData.phone || !formData.email) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.createDoctor(formData);
      setFormData({
        name: '',
        specialization: '',
        hospital: '',
        phone: '',
        email: '',
      });
      onDoctorAdded();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create doctor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Doctor"
      subtitle="Register a medical doctor into the administrative registry"
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
            Doctor Full Name *
          </label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Dr. Alexander Fleming"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-bold focus:border-brand-bold bg-slate-50/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-brand-jetBlack mb-1">
              Specialization *
            </label>
            <input
              type="text"
              name="specialization"
              placeholder="e.g. Cardiology, Neurology"
              value={formData.specialization}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-bold focus:border-brand-bold bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-jetBlack mb-1">
              Affiliated Hospital *
            </label>
            <input
              type="text"
              name="hospital"
              placeholder="e.g. Metropolitan General"
              value={formData.hospital}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-bold focus:border-brand-bold bg-slate-50/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-brand-jetBlack mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-bold focus:border-brand-bold bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-jetBlack mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              placeholder="doctor@hospital.org"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-bold focus:border-brand-bold bg-slate-50/50"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            Register Doctor
          </Button>
        </div>
      </form>
    </Modal>
  );
};
