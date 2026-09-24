"use client";

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Patient } from '../../types';
import { api } from '../../lib/api';
import { AlertTriangle } from 'lucide-react';

interface DeletePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  onPatientDeleted: () => void;
}

export const DeletePatientModal: React.FC<DeletePatientModalProps> = ({
  isOpen,
  onClose,
  patient,
  onPatientDeleted,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!patient) return;
    setLoading(true);
    setError(null);

    try {
      await api.deletePatient(patient._id);
      onPatientDeleted();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete patient');
    } finally {
      setLoading(false);
    }
  };

  if (!patient) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Patient Record"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="text-center">
          <p className="text-sm font-bold text-brand-jetBlack">
            Are you sure you want to delete patient{' '}
            <span className="text-rose-600 font-extrabold">{patient.name}</span>?
          </p>
          <p className="text-xs text-brand-muted mt-1">
            This action cannot be undone. All clinical logs associated with this patient will be removed.
          </p>
        </div>

        {error && (
          <div className="p-2.5 text-xs rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
            {error}
          </div>
        )}

        <div className="flex items-center justify-center space-x-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={loading} size="sm">
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={loading} size="sm">
            Confirm Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
