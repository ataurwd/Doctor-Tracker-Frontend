import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendPositive = true,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card hover:shadow-cardHover transition-all duration-300 relative overflow-hidden group">
      {/* Decorative gradient corner tint */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-sky-100/40 to-transparent rounded-bl-full pointer-events-none" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">{title}</p>
          <h4 className="text-3xl font-extrabold text-brand-jetBlack mt-2 tracking-tight">{value}</h4>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>

        <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-bold border border-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs">
          <span
            className={`font-semibold mr-1.5 ${
              trendPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {trend}
          </span>
          <span className="text-slate-500">vs last month</span>
        </div>
      )}
    </div>
  );
};
