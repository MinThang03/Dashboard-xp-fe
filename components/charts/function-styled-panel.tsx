'use client';

import { Card } from '@/components/ui/card';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type StyledItem = {
  label: string;
  value: number;
  color: string;
};

type PanelVariant =
  | 'eco-business'
  | 'eco-market'
  | 'eco-fee'
  | 'eco-sme'
  | 'eco-report'
  | 'sec-residence'
  | 'sec-violation'
  | 'sec-order'
  | 'sec-feedback'
  | 'sec-hotspot'
  | 'infra-permit'
  | 'infra-order'
  | 'infra-infra'
  | 'infra-illegal'
  | 'infra-housing'
  | 'social-poverty'
  | 'social-protection'
  | 'social-meritorious'
  | 'social-jobs'
  | 'finance-revenue'
  | 'finance-expense'
  | 'finance-budget-compare'
  | 'finance-overrun-alert'
  | 'finance-disbursement'
  | 'finance-trend-ai'
  | 'finance-reporting'
  | 'land-search'
  | 'land-change'
  | 'land-cert'
  | 'land-field-survey'
  | 'land-dispute'
  | 'land-risk-ai'
  | 'land-backlog'
  | 'land-reporting'
  | 'env-air-quality'
  | 'env-waste-management'
  | 'env-pollution-report'
  | 'env-environment-overview'
  | 'culture-heritage'
  | 'culture-heritage-dossier'
  | 'culture-tourism-business'
  | 'culture-craft-village'
  | 'culture-festival'
  | 'culture-cultural-report';

type FunctionStyledPanelProps = {
  title: string;
  subtitle: string;
  items: StyledItem[];
  variant: PanelVariant;
};

const WRAPPER_STYLES: Record<PanelVariant, string> = {
  'eco-business': 'bg-gradient-to-r from-emerald-50 to-lime-50 border-emerald-100',
  'eco-market': 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-100',
  'eco-fee': 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-100',
  'eco-sme': 'bg-gradient-to-r from-indigo-50 to-violet-50 border-indigo-100',
  'eco-report': 'bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200',
  'sec-residence': 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-100',
  'sec-violation': 'bg-gradient-to-r from-rose-50 to-red-50 border-rose-100',
  'sec-order': 'bg-gradient-to-r from-sky-50 to-indigo-50 border-sky-100',
  'sec-feedback': 'bg-gradient-to-r from-fuchsia-50 to-pink-50 border-fuchsia-100',
  'sec-hotspot': 'bg-gradient-to-r from-red-50 to-orange-50 border-red-100',
  'infra-permit': 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100',
  'infra-order': 'bg-gradient-to-r from-yellow-50 to-lime-50 border-yellow-100',
  'infra-infra': 'bg-gradient-to-r from-slate-50 to-zinc-100 border-slate-200',
  'infra-illegal': 'bg-gradient-to-r from-red-50 to-rose-50 border-red-100',
  'infra-housing': 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-100',
  'social-poverty': 'bg-gradient-to-r from-rose-50 to-pink-50 border-rose-100',
  'social-protection': 'bg-gradient-to-r from-fuchsia-50 to-violet-50 border-fuchsia-100',
  'social-meritorious': 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100',
  'social-jobs': 'bg-gradient-to-r from-sky-50 to-cyan-50 border-sky-100',
  'finance-revenue': 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100',
  'finance-expense': 'bg-gradient-to-r from-red-50 to-orange-50 border-red-100',
  'finance-budget-compare': 'bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-100',
  'finance-overrun-alert': 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-100',
  'finance-disbursement': 'bg-gradient-to-r from-cyan-50 to-teal-50 border-cyan-100',
  'finance-trend-ai': 'bg-gradient-to-r from-violet-50 to-indigo-50 border-violet-100',
  'finance-reporting': 'bg-gradient-to-r from-slate-50 to-zinc-100 border-slate-200',
  'land-search': 'bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-100',
  'land-change': 'bg-gradient-to-r from-lime-50 to-emerald-50 border-lime-100',
  'land-cert': 'bg-gradient-to-r from-blue-50 to-sky-50 border-blue-100',
  'land-field-survey': 'bg-gradient-to-r from-cyan-50 to-indigo-50 border-cyan-100',
  'land-dispute': 'bg-gradient-to-r from-rose-50 to-orange-50 border-rose-100',
  'land-risk-ai': 'bg-gradient-to-r from-purple-50 to-fuchsia-50 border-purple-100',
  'land-backlog': 'bg-gradient-to-r from-amber-50 to-red-50 border-amber-100',
  'land-reporting': 'bg-gradient-to-r from-emerald-50 to-slate-50 border-emerald-100',
  'env-air-quality': 'bg-gradient-to-r from-cyan-50 to-sky-50 border-cyan-100',
  'env-waste-management': 'bg-gradient-to-r from-amber-50 to-lime-50 border-amber-100',
  'env-pollution-report': 'bg-gradient-to-r from-rose-50 to-red-50 border-rose-100',
  'env-environment-overview': 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100',
  'culture-heritage': 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100',
  'culture-heritage-dossier': 'bg-gradient-to-r from-violet-50 to-purple-50 border-violet-100',
  'culture-tourism-business': 'bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-100',
  'culture-craft-village': 'bg-gradient-to-r from-fuchsia-50 to-pink-50 border-fuchsia-100',
  'culture-festival': 'bg-gradient-to-r from-indigo-50 to-pink-50 border-indigo-100',
  'culture-cultural-report': 'bg-gradient-to-r from-slate-50 to-violet-50 border-slate-200',
};

function renderChart(variant: PanelVariant, items: StyledItem[]) {
  const data = items.map((item, idx) => ({
    ...item,
    short: item.label.length > 12 ? `${item.label.slice(0, 12)}...` : item.label,
    order: idx + 1,
  }));

  const anim = {
    isAnimationActive: true,
    animationDuration: 950,
    animationEasing: 'ease-out' as const,
  };

  switch (variant) {
    case 'eco-business':
    case 'sec-hotspot':
    case 'social-poverty':
    case 'land-change':
    case 'env-air-quality':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius={84}>
            <PolarGrid strokeDasharray="3 3" />
            <PolarAngleAxis dataKey="short" tick={{ fontSize: 10 }} />
            <Radar dataKey="value" stroke="#0f766e" fill="#0f766e" fillOpacity={0.45} {...anim} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      );

    case 'eco-market':
    case 'sec-residence':
    case 'social-protection':
    case 'land-risk-ai':
    case 'env-waste-management':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart innerRadius="28%" outerRadius="96%" data={data} startAngle={90} endAngle={-270}>
            <RadialBar dataKey="value" background cornerRadius={8} label={{ position: 'insideStart', fill: '#fff', fontSize: 10 }} {...anim}>
              {data.map((item) => (
                <Cell key={`radial-${item.label}`} fill={item.color} />
              ))}
            </RadialBar>
            <Legend iconSize={8} layout="horizontal" verticalAlign="bottom" />
            <Tooltip />
          </RadialBarChart>
        </ResponsiveContainer>
      );

    case 'eco-fee':
    case 'infra-illegal':
    case 'finance-expense':
    case 'land-dispute':
    case 'env-pollution-report':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -24, bottom: 20 }}>
            <defs>
              <linearGradient id="fillAreaA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="short" tick={{ fontSize: 10 }} angle={-12} textAnchor="end" height={36} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#d97706" fill="url(#fillAreaA)" strokeWidth={2} {...anim} />
          </AreaChart>
        </ResponsiveContainer>
      );

    case 'eco-sme':
    case 'infra-housing':
    case 'social-jobs':
    case 'land-backlog':
    case 'env-environment-overview':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="short" tick={{ fontSize: 10 }} angle={-8} textAnchor="end" height={34} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} {...anim}>
              {data.map((item) => (
                <Cell key={`comp-bar-${item.label}`} fill={item.color} />
              ))}
            </Bar>
            <Line type="monotone" dataKey="value" stroke="#334155" strokeWidth={2} dot={{ r: 2 }} {...anim} />
          </ComposedChart>
        </ResponsiveContainer>
      );

    case 'eco-report':
    case 'infra-permit':
    case 'finance-revenue':
    case 'land-search':
    case 'culture-heritage':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 10, left: 14, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="short" width={90} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="value" radius={[0, 8, 8, 0]} {...anim}>
              {data.map((item) => (
                <Cell key={`hbar-${item.label}`} fill={item.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );

    case 'sec-violation':
    case 'finance-budget-compare':
    case 'land-field-survey':
    case 'culture-heritage-dossier':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 8, right: 8, left: -20, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="order" type="number" allowDecimals={false} name="Nhom" tick={{ fontSize: 10 }} />
            <YAxis dataKey="value" type="number" allowDecimals={false} name="Gia tri" tick={{ fontSize: 10 }} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={data} {...anim}>
              {data.map((item) => (
                <Cell key={`scatter-${item.label}`} fill={item.color} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      );

    case 'sec-order':
    case 'infra-order':
    case 'finance-overrun-alert':
    case 'finance-trend-ai':
    case 'land-cert':
    case 'culture-tourism-business':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="short" tick={{ fontSize: 10 }} angle={-10} textAnchor="end" height={34} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#0f172a" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} {...anim} />
          </LineChart>
        </ResponsiveContainer>
      );

    case 'sec-feedback':
    case 'infra-infra':
    case 'social-meritorious':
    case 'finance-disbursement':
    case 'finance-reporting':
    case 'land-reporting':
    case 'culture-craft-village':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="50%" innerRadius={34} outerRadius={86} paddingAngle={2} {...anim}>
              {data.map((item) => (
                <Cell key={`pie-${item.label}`} fill={item.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend iconSize={8} />
          </PieChart>
        </ResponsiveContainer>
      );

    case 'culture-festival':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="short" tick={{ fontSize: 10 }} angle={-10} textAnchor="end" height={34} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} {...anim}>
              {data.map((item) => (
                <Cell key={`festival-${item.label}`} fill={item.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );

    case 'culture-cultural-report':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -24, bottom: 20 }}>
            <defs>
              <linearGradient id="fillAreaCulture" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.75} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="short" tick={{ fontSize: 10 }} angle={-12} textAnchor="end" height={36} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#5b21b6" fill="url(#fillAreaCulture)" strokeWidth={2.5} {...anim} />
          </AreaChart>
        </ResponsiveContainer>
      );

    default:
      return null;
  }
}

export function FunctionStyledPanel({ title, subtitle, items, variant }: FunctionStyledPanelProps) {
  const safeItems = items.map((item) => ({
    ...item,
    value: Number.isFinite(item.value) ? item.value : 0,
  }));

  const total = safeItems.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className={`border shadow-lg p-4 sm:p-5 ${WRAPPER_STYLES[variant]}`}>
      <div className="flex flex-col gap-1 mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-600">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_1.25fr] gap-4">
        <div className="space-y-2">
          <div className="rounded-lg bg-white/90 border px-3 py-2">
            <p className="text-xs uppercase tracking-wide text-slate-500">Tong hop</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">{total.toLocaleString('vi-VN')}</p>
          </div>

          {safeItems.map((item) => (
            <div key={item.label} className="rounded-lg border bg-white/80 px-3 py-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <p className="text-sm text-slate-700 truncate">{item.label}</p>
              </div>
              <p className="text-sm font-semibold text-slate-900">{item.value.toLocaleString('vi-VN')}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border bg-white/95 p-2 h-[280px]">{renderChart(variant, safeItems)}</div>
      </div>
    </Card>
  );
}
