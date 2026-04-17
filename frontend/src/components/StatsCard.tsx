import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-indigo-600',
  trend,
  trendValue,
}: StatsCardProps) {
  const trendColors = {
    up: 'text-emerald-600',
    down: 'text-rose-600',
    neutral: 'text-gray-500',
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-lg hover:shadow-gray-900/5 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2 tracking-tight">
            {value}
          </p>
          {subtitle && (
            <div className="flex items-center gap-2 mt-2">
              <p className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
              {trend && trendValue && (
                <p className={`text-xs font-medium ${trendColors[trend]}`}>
                  {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {trendValue}
                </p>
              )}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}