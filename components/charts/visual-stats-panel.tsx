'use client';

import { Card } from '@/components/ui/card';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type VisualStatsItem = {
  label: string;
  value: number;
  color: string;
  helper?: string;
};

type VisualStatsPanelProps = {
  title: string;
  subtitle?: string;
  items: VisualStatsItem[];
  className?: string;
};

export function VisualStatsPanel({ title, subtitle, items, className }: VisualStatsPanelProps) {
  const safeItems = items.map((item) => ({
    ...item,
    value: Number.isFinite(item.value) ? item.value : 0,
  }));

  const total = safeItems.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className={`border-0 shadow-lg p-4 sm:p-5 ${className || ''}`}>
      <div className="flex flex-col gap-1 mb-4">
        <h3 className="text-base sm:text-lg font-semibold">{title}</h3>
        {subtitle ? <p className="text-xs sm:text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="space-y-2 sm:space-y-3">
          <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Tong quan</p>
            <p className="text-2xl sm:text-3xl font-bold">{total}</p>
          </div>

          {safeItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-lg border px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{item.label}</p>
                  {item.helper ? <p className="text-xs text-muted-foreground truncate">{item.helper}</p> : null}
                </div>
              </div>
              <p className="text-sm sm:text-base font-semibold">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-[260px] sm:h-[280px]">
          <div className="rounded-xl border bg-white p-2 h-[125px] sm:h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={safeItems} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={28} outerRadius={50} paddingAngle={3}>
                  {safeItems.map((item) => (
                    <Cell key={`pie-${item.label}`} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => value.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border bg-white p-2 h-[125px] sm:h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={safeItems} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} angle={-10} textAnchor="end" height={40} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number) => value.toLocaleString()} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {safeItems.map((item) => (
                    <Cell key={`bar-${item.label}`} fill={item.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
}
