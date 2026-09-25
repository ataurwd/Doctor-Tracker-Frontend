import React from 'react';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
  vertical?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = '',
  text,
  vertical = true,
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  };

  return (
    <div
      className={`flex items-center justify-center gap-3 ${
        vertical ? 'flex-col' : 'flex-row'
      } ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <Loader2
          className={`${sizeMap[size]} animate-spin text-brand-bold shrink-0 drop-shadow-sm`}
        />
      </div>
      {text && (
        <span className="text-xs font-semibold text-slate-500 animate-pulse tracking-wide select-none">
          {text}
        </span>
      )}
    </div>
  );
};

export default Spinner;
