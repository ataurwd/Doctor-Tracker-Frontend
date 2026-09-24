import React from 'react';
import { PatientCondition } from '../../types';

interface BadgeProps {
  condition?: PatientCondition | string;
  variant?: 'primary' | 'secondary' | 'outline' | 'custom';
  className?: string;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ condition, variant, className = '', children }) => {
  if (condition) {
    switch (condition) {
      case 'Critical':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-rose-500 animate-pulse" />
            Critical
          </span>
        );
      case 'Stable':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500" />
            Stable
          </span>
        );
      case 'Recovering':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-brand-bold border border-blue-200">
            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-brand-light" />
            Recovering
          </span>
        );
      case 'Routine Checkup':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-purple-500" />
            Routine Checkup
          </span>
        );
      case 'Under Observation':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-500" />
            Under Observation
          </span>
        );
    }
  }

  // Generic badge
  let baseStyle = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold';
  if (variant === 'primary') {
    baseStyle += ' bg-blue-50 text-brand-bold border border-blue-200';
  } else if (variant === 'secondary') {
    baseStyle += ' bg-sky-50 text-sky-700 border border-sky-200';
  } else {
    baseStyle += ' bg-slate-100 text-slate-700 border border-slate-200';
  }

  return <span className={`${baseStyle} ${className}`}>{children}</span>;
};
