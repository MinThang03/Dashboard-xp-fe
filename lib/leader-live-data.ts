import {
  vanBanApi,
  hoTichApi,
  chungThucApi,
  hoKhauApi,
  hoSoTthcApi,
  tramYTeApi,
  dichBenhApi,
  tiemChungApi,
  phieuKhamApi,
  luotKhamApi,
  coSoGiaoDucApi,
  lopHocApi,
  hoKinhDoanhApi,
  choDiemKinhDoanhApi,
  thuPhiApi,
  hoTroDoanhNghiepApi,
  thongKeKinhTeApi,
  tamTruTamVangApi,
  viPhamApi,
  diemNongAnNinhApi,
  phanAnhApi,
  anNinhTratTuApi,
  haTangDoThiApi,
  hoSoCapPhepXayDungApi,
  xayDungTraiPhepApi,
  theoDoiTratTuXayDungApi,
  nhaOCongTrinhApi,
  ruiRoQuyHoachApi,
  hoNgheoApi,
  baoTroXaHoiApi,
  nguoiCoCongApi,
  viecLamApi,
  nganSachApi,
  duToanNganSachApi,
  giaiNganApi,
  thuaDatApi,
  bienDongDatApi,
  racThaiApi,
  baoCaoONhiemApi,
  tramQuanTracMTApi,
  diemThuGomRacApi,
  diTichApi,
  leHoiApi,
  langNgheApi,
  hoSoDiTichApi,
  coSoKinhDoanhDuLichApi,
  usersApi,
} from '@/lib/api';
import type { ModuleStats, AlertItem, KPIData, HotspotItem } from '@/lib/dashboard-stats';
import type { FieldStats, FieldKPI, OfficerKPI } from '@/lib/leader-data';
import {
  MODULE_STATISTICS,
  SUMMARY_STATS,
  KPI_MONTHLY_DATA,
  CASES_BY_DEPARTMENT,
  BUDGET_BY_DEPARTMENT,
  SYSTEM_ALERTS,
  HOTSPOT_DATA,
} from '@/lib/dashboard-stats';
import {
  FIELD_STATISTICS,
  FIELD_KPI_DETAILED,
  OFFICER_KPI_DATA,
} from '@/lib/leader-data';

type StatsTotals = {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
};

export interface LeaderDashboardData {
  moduleStats: ModuleStats[];
  summaryStats: typeof SUMMARY_STATS;
  kpiMonthlyData: KPIData[];
  casesByDepartment: typeof CASES_BY_DEPARTMENT;
  budgetByDepartment: typeof BUDGET_BY_DEPARTMENT;
  systemAlerts: AlertItem[];
  hotspots: HotspotItem[];
  fieldStatistics: FieldStats[];
  fieldKpiDetailed: FieldKPI[];
  officerKpiData: OfficerKPI[];
}

const MODULE_META = MODULE_STATISTICS.map(({ id, name, icon, color, bgGradient, subStats }) => ({
  id,
  name,
  icon,
  color,
  bgGradient,
  subStats,
}));

const FIELD_META = FIELD_STATISTICS.map(({ id, code, name, icon, color, bgGradient }) => ({
  id,
  code,
  name,
  icon,
  color,
  bgGradient,
}));

const FIELD_BY_MA_LINH_VUC: Record<number, string> = {
  1: 'TU_PHAP',
  2: 'Y_TE_GD',
  3: 'KINH_TE',
  4: 'AN_NINH',
  5: 'XAY_DUNG',
  6: 'LAO_DONG',
  7: 'TAI_CHINH',
  8: 'DIA_CHINH',
  9: 'MOI_TRUONG',
  10: 'VAN_HOA',
};

const FIELD_BY_MODULE_ID: Record<string, string> = {
  'hanh-chinh-tu-phap': 'TU_PHAP',
  'y-te-giao-duc': 'Y_TE_GD',
  'kinh-te-thuong-mai': 'KINH_TE',
  'quoc-phong-an-ninh': 'AN_NINH',
  'xay-dung-ha-tang': 'XAY_DUNG',
  'lao-dong-tbxh': 'LAO_DONG',
  'tai-chinh': 'TAI_CHINH',
  'dia-chinh': 'DIA_CHINH',
  'moi-truong': 'MOI_TRUONG',
  'van-hoa-du-lich': 'VAN_HOA',
};

const MODULE_BY_FIELD_CODE = Object.entries(FIELD_BY_MODULE_ID).reduce<Record<string, string>>(
  (acc, [moduleId, fieldCode]) => {
    acc[fieldCode] = moduleId;
    return acc;
  },
  {},
);

const CACHE_TTL_MS = 60 * 1000;
let cached: { timestamp: number; data: LeaderDashboardData } | null = null;

function toNumber(value: unknown): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function sumKeys(data: Record<string, any> | undefined, keys: string[]): number {
  if (!data) return 0;
  return keys.reduce((sum, key) => sum + toNumber(data[key]), 0);
}

function deriveTotals(
  data: Record<string, any> | undefined,
  options?: { completedKeys?: string[]; pendingKeys?: string[]; overdueKeys?: string[] },
): StatsTotals {
  const total = toNumber(data?.total);
  const completed = sumKeys(data, options?.completedKeys ?? ['hoanThanh', 'daXuLy', 'hoatDong', 'daHoanThanh']);
  const pending = sumKeys(data, options?.pendingKeys ?? ['dangXuLy', 'choXuLy', 'daTiepNhan', 'choBoSung']);
  const overdue = sumKeys(data, options?.overdueKeys ?? ['quaHan', 'overdue']);

  let finalCompleted = completed;
  let finalPending = pending;

  if (!completed && !pending && total) {
    finalCompleted = total;
  } else if (!completed && pending && total) {
    finalCompleted = Math.max(total - pending, 0);
  } else if (!pending && total && completed < total) {
    finalPending = total - completed;
  }

  return {
    total,
    completed: finalCompleted,
    pending: finalPending,
    overdue,
  };
}

function sumTotals(items: StatsTotals[]): StatsTotals {
  return items.reduce(
    (acc, item) => ({
      total: acc.total + item.total,
      completed: acc.completed + item.completed,
      pending: acc.pending + item.pending,
      overdue: acc.overdue + item.overdue,
    }),
    { total: 0, completed: 0, pending: 0, overdue: 0 },
  );
}

function unwrapStats(result: any): Record<string, any> {
  if (!result) return {};
  if (typeof result.success === 'boolean') {
    return result.success ? (result.data ?? {}) : {};
  }
  if (typeof result.data === 'object') {
    return result.data ?? {};
  }
  return result;
}

async function safeStats(promise: Promise<any>): Promise<Record<string, any>> {
  try {
    return unwrapStats(await promise);
  } catch {
    return {};
  }
}

function unwrapList(result: any): any[] {
  if (!result) return [];
  if (typeof result.success === 'boolean') {
    if (!result.success) return [];
    return Array.isArray(result.data) ? result.data : [];
  }
  if (Array.isArray(result.data)) return result.data;
  return Array.isArray(result) ? result : [];
}

function normalizeAscii(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function mapFieldCodeFromText(value?: string | null): string | null {
  if (!value) return null;
  const normalized = normalizeAscii(value);

  if (normalized.includes('tu phap') || normalized.includes('ho tich') || normalized.includes('chung thuc')) {
    return 'TU_PHAP';
  }
  if (normalized.includes('y te') || normalized.includes('giao duc') || normalized.includes('tram y te')) {
    return 'Y_TE_GD';
  }
  if (normalized.includes('kinh te') || normalized.includes('thuong mai') || normalized.includes('ho kinh doanh')) {
    return 'KINH_TE';
  }
  if (normalized.includes('an ninh') || normalized.includes('quoc phong') || normalized.includes('trat tu')) {
    return 'AN_NINH';
  }
  if (normalized.includes('xay dung') || normalized.includes('ha tang') || normalized.includes('quy hoach')) {
    return 'XAY_DUNG';
  }
  if (normalized.includes('lao dong') || normalized.includes('tbxh') || normalized.includes('ho ngheo')) {
    return 'LAO_DONG';
  }
  if (normalized.includes('tai chinh') || normalized.includes('ngan sach')) {
    return 'TAI_CHINH';
  }
  if (normalized.includes('dia chinh') || normalized.includes('dat dai') || normalized.includes('so do')) {
    return 'DIA_CHINH';
  }
  if (normalized.includes('moi truong') || normalized.includes('o nhiem') || normalized.includes('rac thai')) {
    return 'MOI_TRUONG';
  }
  if (normalized.includes('van hoa') || normalized.includes('du lich') || normalized.includes('di tich')) {
    return 'VAN_HOA';
  }

  return null;
}

function parseDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function monthKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function monthLabel(date: Date): string {
  return `T${date.getMonth() + 1}`;
}

function buildMonthBuckets(count: number): Array<{ key: string; label: string }> {
  const now = new Date();
  const buckets: Array<{ key: string; label: string }> = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ key: monthKey(d), label: monthLabel(d) });
  }
  return buckets;
}

function formatMoneyShort(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} ty`;
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(0)} tr`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(0)} k`;
  return `${Math.round(value)}`;
}

function buildFieldStatistics(moduleStats: ModuleStats[]): FieldStats[] {
  return FIELD_META.map((field) => {
    const moduleId = MODULE_BY_FIELD_CODE[field.code];
    const moduleStat = moduleStats.find((m) => m.id === moduleId);
    const totalCases = moduleStat?.total ?? 0;
    const completedCases = moduleStat?.completed ?? 0;
    const pendingCases = moduleStat?.pending ?? 0;
    const overdueCases = moduleStat?.overdue ?? 0;

    const completionRate = totalCases ? Math.round((completedCases / totalCases) * 100) : 0;
    const onTimeRate = completedCases
      ? Math.max(0, Math.round(((completedCases - overdueCases) / completedCases) * 100))
      : 0;

    return {
      ...field,
      totalCases,
      completedCases,
      pendingCases,
      overdueCases,
      completionRate,
      onTimeRate,
      satisfactionRate: 0,
      trend: 0,
      trendDirection: 'stable',
      departments: [],
      alerts: [],
    };
  });
}

function buildCasesByDepartment(moduleStats: ModuleStats[]) {
  return moduleStats.map((module) => ({
    name: module.name.split(' - ')[0],
    value: module.total,
    color: module.color,
    completed: module.completed,
    pending: module.pending,
    overdue: module.overdue,
  }));
}

function buildSummaryStats(moduleStats: ModuleStats[], systemAlerts: AlertItem[]) {
  const totalCases = moduleStats.reduce((sum, m) => sum + m.total, 0);
  const completedCases = moduleStats.reduce((sum, m) => sum + m.completed, 0);
  const pendingCases = moduleStats.reduce((sum, m) => sum + m.pending, 0);
  const overdueCases = moduleStats.reduce((sum, m) => sum + m.overdue, 0);
  const onTimeRate = totalCases ? Math.round((completedCases / totalCases) * 100) : 0;
  const totalAlerts = systemAlerts.filter((alert) => alert.type === 'danger' || alert.type === 'warning').length;
  const criticalAlerts = systemAlerts.filter((alert) => alert.priority === 'high').length;

  return {
    totalCases,
    completedCases,
    pendingCases,
    overdueCases,
    onTimeRate,
    avgSatisfaction: 0,
    totalAlerts,
    criticalAlerts,
  };
}

function buildBudgetByDepartment(nganSachRows: any[]) {
  const result = FIELD_META.map((field) => ({
    name: field.name.split(' - ')[0],
    allocated: 0,
    spent: 0,
    percent: 0,
  }));

  nganSachRows.forEach((row) => {
    const fieldCode = FIELD_BY_MA_LINH_VUC[toNumber(row.MaLinhVuc)];
    if (!fieldCode) return;

    const fieldIndex = FIELD_META.findIndex((meta) => meta.code === fieldCode);
    if (fieldIndex < 0) return;

    const allocated = toNumber(row.TongDuToan);
    const spent = toNumber(row.DaGiaiNgan);

    result[fieldIndex].allocated += allocated;
    result[fieldIndex].spent += spent;
  });

  result.forEach((item) => {
    const allocated = item.allocated;
    const spent = item.spent;
    item.percent = allocated > 0 ? Math.round((spent / allocated) * 100) : 0;
    item.allocated = Math.round(allocated / 1_000_000);
    item.spent = Math.round(spent / 1_000_000);
  });

  return result;
}

function buildHotspots(diemNongAnNinhRows: any[]): HotspotItem[] {
  if (!Array.isArray(diemNongAnNinhRows)) return [];

  return diemNongAnNinhRows.map((item, index) => {
    const severityRaw = normalizeAscii(String(item.MucDoNghiemTrong || item.MucDo || ''));
    let severity: HotspotItem['severity'] = 'low';
    if (severityRaw.includes('cao') || severityRaw.includes('nghiem')) severity = 'high';
    if (severityRaw.includes('trung')) severity = 'medium';

    return {
      id: item.MaDiem ?? index + 1,
      name: item.TenDiem || item.TenDiaDiem || 'Diem nong',
      location: item.DiaDiem || '',
      module: 'An ninh',
      severity,
      lat: Number(item.ToaDoLat ?? 0) || 0,
      lng: Number(item.ToaDoLng ?? 0) || 0,
      description: item.MoTa || '',
      reportCount: Number(item.SoDoiTuong ?? 0) || 0,
    };
  });
}

function buildSystemAlerts(stats: {
  hoSoTthc: StatsTotals;
  phanAnh: StatsTotals;
  viPham: StatsTotals;
  baoCaoONhiem: StatsTotals;
  nganSach: { pending: number };
}): AlertItem[] {
  const alerts = SYSTEM_ALERTS.map((alert) => ({ ...alert }));

  alerts.forEach((alert) => {
    if (alert.module.includes('Hanh chinh') || alert.module.includes('Hành chính')) {
      alert.count = stats.hoSoTthc.overdue;
    }
    if (alert.module.includes('Tai chinh') || alert.module.includes('Tài chính')) {
      alert.count = stats.nganSach.pending;
    }
    if (alert.module.includes('An ninh')) {
      alert.count = stats.phanAnh.pending + stats.viPham.pending;
    }
    if (alert.module.includes('Moi truong') || alert.module.includes('Môi trường')) {
      alert.count = stats.baoCaoONhiem.pending;
    }
  });

  return alerts.filter((alert) => alert.count > 0);
}

function buildOfficerKpiData(
  hoSoRows: any[],
  loaiThuTucMap: Record<number, string>,
  users: Array<{ id: number; fullName: string; roleId?: number }>,
) {
  const userMap = new Map<number, { name: string }>();
  users.forEach((u) => userMap.set(u.id, { name: u.fullName || `User ${u.id}` }));

  const monthBuckets = buildMonthBuckets(3);
  const byOfficer = new Map<
    number,
    {
      total: number;
      completed: number;
      overdue: number;
      monthly: Record<string, { completed: number; onTime: number }>;
      fieldCounts: Record<string, number>;
    }
  >();
  const today = new Date();

  hoSoRows.forEach((row) => {
    const officerId = toNumber(row.CanBoXuLy);
    if (!officerId) return;

    const status = String(row.TrangThai || '');
    const dueDate = parseDate(row.NgayHenTra);
    const doneDate = parseDate(row.NgayHoanThanh);
    const createdDate = parseDate(row.NgayNop || row.NgayTao) || today;

    const linhVuc = row.LinhVuc || loaiThuTucMap[toNumber(row.MaLoaiThuTuc)] || '';
    const fieldCode = mapFieldCodeFromText(linhVuc) || 'TU_PHAP';

    const isCompleted = status === 'Hoàn thành';
    const isOverdue = !isCompleted && dueDate ? dueDate < today : false;
    const onTime = isCompleted && (!dueDate || !doneDate || doneDate <= dueDate);

    if (!byOfficer.has(officerId)) {
      const monthly: Record<string, { completed: number; onTime: number }> = {};
      monthBuckets.forEach((bucket) => {
        monthly[bucket.key] = { completed: 0, onTime: 0 };
      });
      byOfficer.set(officerId, { total: 0, completed: 0, overdue: 0, monthly, fieldCounts: {} });
    }

    const bucket = byOfficer.get(officerId);
    if (!bucket) return;

    bucket.total += 1;
    if (isCompleted) bucket.completed += 1;
    if (isOverdue) bucket.overdue += 1;

    const key = monthKey(createdDate);
    if (bucket.monthly[key]) {
      if (isCompleted) bucket.monthly[key].completed += 1;
      if (onTime) bucket.monthly[key].onTime += 1;
    }

    bucket.fieldCounts[fieldCode] = (bucket.fieldCounts[fieldCode] ?? 0) + 1;
  });

  return Array.from(byOfficer.entries()).map(([officerId, stats]) => {
    const userName = userMap.get(officerId)?.name || `User ${officerId}`;
    const sortedFields = Object.entries(stats.fieldCounts).sort((a, b) => b[1] - a[1]);
    const fieldCode = sortedFields[0]?.[0] ?? 'TU_PHAP';
    const fieldMeta = FIELD_META.find((field) => field.code === fieldCode);
    const fieldName = fieldMeta?.name ?? 'Hanh chinh Tu phap';
    const total = stats.total;
    const completed = stats.completed;
    const pending = Math.max(0, total - completed);
    const overdue = stats.overdue;

    const completionRate = total ? Math.round((completed / total) * 100) : 0;
    const onTimeRate = completed ? Math.round(((completed - overdue) / completed) * 100) : 0;
    const qualityScore = Math.round(completionRate * 0.7 + onTimeRate * 0.3);

    const monthlyData = monthBuckets.map((bucket) => ({
      month: bucket.label,
      completed: stats.monthly[bucket.key]?.completed ?? 0,
      onTime: stats.monthly[bucket.key]?.onTime ?? 0,
      satisfaction: 0,
    }));

    return {
      id: `CB${officerId}`,
      name: userName,
      position: 'Can bo xu ly',
      department: fieldName,
      fieldCode,
      fieldName,
      targetCases: total,
      completedCases: completed,
      pendingCases: pending,
      overdueCases: overdue,
      completionRate,
      onTimeRate,
      satisfactionRate: 0,
      qualityScore,
      trend: 0,
      trendDirection: 'stable',
      monthlyData,
    } as OfficerKPI;
  });
}

function buildFieldKpiDetailed(
  fieldStats: FieldStats[],
  budgetByDepartment: typeof BUDGET_BY_DEPARTMENT,
  fieldMonthlyMap: Record<string, Record<string, { total: number; completed: number; onTime: number }>>,
  officerData: OfficerKPI[],
) {
  const monthBuckets = buildMonthBuckets(3);

  return fieldStats.map((field) => {
    const budget = budgetByDepartment.find((item) => item.name === field.name.split(' - ')[0]);
    const budgetExecution = budget && budget.allocated > 0 ? Math.round((budget.spent / budget.allocated) * 100) : 0;

    const monthlyComparison = monthBuckets.map((bucket) => {
      const monthData = fieldMonthlyMap[field.code]?.[bucket.key];
      return {
        month: bucket.label,
        completed: monthData?.completed ?? 0,
        target: monthData?.total ?? 0,
        onTime: monthData?.onTime ?? 0,
      };
    });

    const officers = officerData
      .filter((officer) => officer.fieldCode === field.code)
      .map((officer) => ({
        name: officer.name,
        position: officer.position,
        completionRate: officer.completionRate,
        satisfactionRate: officer.satisfactionRate,
        status: officer.qualityScore >= 95 ? 'excellent' : officer.qualityScore >= 85 ? 'good' : 'normal',
      }));

    return {
      code: field.code,
      name: field.name,
      icon: field.icon,
      color: field.color,
      targetCases: field.totalCases,
      completedCases: field.completedCases,
      pendingCases: field.pendingCases,
      overdueCases: field.overdueCases,
      completionRate: field.completionRate,
      onTimeRate: field.onTimeRate,
      satisfactionRate: field.satisfactionRate,
      budgetExecution,
      trend: field.trend,
      trendDirection: field.trendDirection,
      officers,
      monthlyComparison,
    } as FieldKPI;
  });
}

function buildKpiMonthlyData(
  hoSoRows: any[],
  loaiThuTucMap: Record<number, string>,
): {
  kpiMonthlyData: KPIData[];
  fieldMonthlyMap: Record<string, Record<string, { total: number; completed: number; onTime: number }>>;
} {
  const monthBuckets = buildMonthBuckets(6);
  const buckets: Record<string, KPIData> = {};
  const fieldMonthlyMap: Record<string, Record<string, { total: number; completed: number; onTime: number }>> = {};
  const today = new Date();

  monthBuckets.forEach((bucket) => {
    buckets[bucket.key] = {
      month: bucket.label,
      totalCases: 0,
      completedOnTime: 0,
      overdue: 0,
      satisfaction: 0,
    };
  });

  hoSoRows.forEach((row) => {
    const createdDate = parseDate(row.NgayNop || row.NgayTao);
    if (!createdDate) return;

    const key = monthKey(createdDate);
    const bucket = buckets[key];
    if (!bucket) return;

    const status = String(row.TrangThai || '');
    const dueDate = parseDate(row.NgayHenTra);
    const doneDate = parseDate(row.NgayHoanThanh);
    const isCompleted = status === 'Hoàn thành';
    const isOverdue = !isCompleted && dueDate ? dueDate < today : false;
    const onTime = isCompleted && (!dueDate || !doneDate || doneDate <= dueDate);

    bucket.totalCases += 1;
    if (onTime) bucket.completedOnTime += 1;
    if (isOverdue) bucket.overdue += 1;

    const linhVuc = row.LinhVuc || loaiThuTucMap[toNumber(row.MaLoaiThuTuc)] || '';
    const fieldCode = mapFieldCodeFromText(linhVuc) || 'TU_PHAP';

    if (!fieldMonthlyMap[fieldCode]) {
      fieldMonthlyMap[fieldCode] = {};
      monthBuckets.forEach((monthBucket) => {
        fieldMonthlyMap[fieldCode][monthBucket.key] = { total: 0, completed: 0, onTime: 0 };
      });
    }

    const fieldBucket = fieldMonthlyMap[fieldCode][key];
    if (!fieldBucket) return;

    fieldBucket.total += 1;
    if (isCompleted) fieldBucket.completed += 1;
    if (onTime) fieldBucket.onTime += 1;
  });

  return { kpiMonthlyData: monthBuckets.map((bucket) => buckets[bucket.key]), fieldMonthlyMap };
}

export async function fetchLeaderDashboardData(force = false): Promise<LeaderDashboardData> {
  if (!force && cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const [
    vanBanStats,
    hoTichStats,
    chungThucStats,
    hoKhauStats,
    hoSoTthcStats,
    tramYTeStats,
    dichBenhStats,
    tiemChungStats,
    phieuKhamStats,
    luotKhamStats,
    coSoGiaoDucStats,
    lopHocStats,
    hoKinhDoanhStats,
    choDiemStats,
    thuPhiStats,
    hoTroDnStats,
    thongKeKinhTeStats,
    tamTruStats,
    viPhamStats,
    diemNongAnNinhStats,
    phanAnhStats,
    anNinhStats,
    haTangStats,
    hoSoCapPhepStats,
    xayDungTraiPhepStats,
    theoDoiStats,
    nhaOStats,
    ruiRoStats,
    hoNgheoStats,
    baoTroStats,
    nguoiCoCongStats,
    viecLamStats,
    nganSachStats,
    duToanStats,
    giaiNganStats,
    thuaDatStats,
    bienDongDatStats,
    racThaiStats,
    baoCaoONhiemStats,
    tramQuanTracStats,
    diemThuGomStats,
    diTichStats,
    leHoiStats,
    langNgheStats,
    hoSoDiTichStats,
    coSoDuLichStats,
    hoSoListRes,
    loaiThuTucRes,
    usersRes,
    nganSachListRes,
    diemNongListRes,
  ] = await Promise.all([
    safeStats(vanBanApi.getStats()),
    safeStats(hoTichApi.getStats()),
    safeStats(chungThucApi.getStats()),
    safeStats(hoKhauApi.getStats()),
    safeStats(hoSoTthcApi.getStats()),
    safeStats(tramYTeApi.getStats()),
    safeStats(dichBenhApi.getStats()),
    safeStats(tiemChungApi.getStats()),
    safeStats(phieuKhamApi.getStats()),
    safeStats(luotKhamApi.getStats()),
    safeStats(coSoGiaoDucApi.getStats()),
    safeStats(lopHocApi.getStats()),
    safeStats(hoKinhDoanhApi.getStats()),
    safeStats(choDiemKinhDoanhApi.getStats()),
    safeStats(thuPhiApi.getStats()),
    safeStats(hoTroDoanhNghiepApi.getStats()),
    safeStats(thongKeKinhTeApi.getStats()),
    safeStats(tamTruTamVangApi.getStats()),
    safeStats(viPhamApi.getStats()),
    safeStats(diemNongAnNinhApi.getStats()),
    safeStats(phanAnhApi.getStats()),
    safeStats(anNinhTratTuApi.getStats()),
    safeStats(haTangDoThiApi.getStats()),
    safeStats(hoSoCapPhepXayDungApi.getStats()),
    safeStats(xayDungTraiPhepApi.getStats()),
    safeStats(theoDoiTratTuXayDungApi.getStats()),
    safeStats(nhaOCongTrinhApi.getStats()),
    safeStats(ruiRoQuyHoachApi.getStats()),
    safeStats(hoNgheoApi.getStats()),
    safeStats(baoTroXaHoiApi.getStats()),
    safeStats(nguoiCoCongApi.getStats()),
    safeStats(viecLamApi.getStats()),
    safeStats(nganSachApi.getStats()),
    safeStats(duToanNganSachApi.getStats()),
    safeStats(giaiNganApi.getStats()),
    safeStats(thuaDatApi.getStats()),
    safeStats(bienDongDatApi.getStats()),
    safeStats(racThaiApi.getStats()),
    safeStats(baoCaoONhiemApi.getStats()),
    safeStats(tramQuanTracMTApi.getStats()),
    safeStats(diemThuGomRacApi.getStats()),
    safeStats(diTichApi.getStats()),
    safeStats(leHoiApi.getStats()),
    safeStats(langNgheApi.getStats()),
    safeStats(hoSoDiTichApi.getStats()),
    safeStats(coSoKinhDoanhDuLichApi.getStats()),
    hoSoTthcApi.getList({ page: 1, limit: 5000 }),
    hoSoTthcApi.getLoaiThuTuc(),
    usersApi.getList(),
    nganSachApi.getList({ page: 1, limit: 5000 }),
    diemNongAnNinhApi.getList({ page: 1, limit: 500 }),
  ]);

  const hoSoRows = unwrapList(hoSoListRes);
  const loaiThuTucRows = unwrapList(loaiThuTucRes);
  const usersRows = unwrapList(usersRes).map((user) => ({
    id: toNumber(user.id),
    fullName: String(user.fullName || user.username || `User ${user.id}`),
    roleId: toNumber(user.roleId),
  }));

  const loaiThuTucMap = loaiThuTucRows.reduce<Record<number, string>>((acc, item) => {
    const key = toNumber(item.MaLoaiThuTuc);
    if (key) {
      acc[key] = String(item.LinhVuc || item.TenThuTuc || '');
    }
    return acc;
  }, {});

  const { kpiMonthlyData, fieldMonthlyMap } = buildKpiMonthlyData(hoSoRows, loaiThuTucMap);
  const officerKpiData = buildOfficerKpiData(hoSoRows, loaiThuTucMap, usersRows);

  const hoSoTotals = deriveTotals(hoSoTthcStats, {
    completedKeys: ['hoanThanh'],
    pendingKeys: ['daTiepNhan', 'dangXuLy', 'choBoSung'],
    overdueKeys: ['quaHan'],
  });
  const chungThucTotals = deriveTotals(chungThucStats, { completedKeys: ['hoanThanh'], pendingKeys: ['dangXuLy'] });
  const hoTichTotals = deriveTotals(hoTichStats);
  const hoKhauTotals = deriveTotals(hoKhauStats);
  const vanBanTotals = deriveTotals(vanBanStats, { completedKeys: ['daXuLy'], pendingKeys: ['dangXuLy', 'moi'] });

  const justiceTotals = sumTotals([hoSoTotals, chungThucTotals, hoTichTotals, hoKhauTotals, vanBanTotals]);

  const yTeTotals = sumTotals([
    deriveTotals(tramYTeStats),
    deriveTotals(dichBenhStats),
    deriveTotals(tiemChungStats),
    deriveTotals(phieuKhamStats),
    deriveTotals(luotKhamStats),
    deriveTotals(coSoGiaoDucStats),
    deriveTotals(lopHocStats),
  ]);

  const kinhTeTotals = sumTotals([
    deriveTotals(hoKinhDoanhStats),
    deriveTotals(choDiemStats),
    deriveTotals(thuPhiStats),
    deriveTotals(hoTroDnStats),
    deriveTotals(thongKeKinhTeStats),
  ]);

  const anNinhTotals = sumTotals([
    deriveTotals(tamTruStats),
    deriveTotals(viPhamStats, { completedKeys: ['daXuLy'], pendingKeys: ['dangXuLy'] }),
    deriveTotals(phanAnhStats, { completedKeys: ['daXuLy'], pendingKeys: ['choXuLy'] }),
    deriveTotals(anNinhStats, { pendingKeys: ['dangXuLy'] }),
    deriveTotals(diemNongAnNinhStats),
  ]);

  const xayDungTotals = sumTotals([
    deriveTotals(haTangStats),
    deriveTotals(hoSoCapPhepStats),
    deriveTotals(xayDungTraiPhepStats),
    deriveTotals(theoDoiStats),
    deriveTotals(nhaOStats),
    deriveTotals(ruiRoStats),
  ]);

  const laoDongTotals = sumTotals([
    deriveTotals(hoNgheoStats),
    deriveTotals(baoTroStats),
    deriveTotals(nguoiCoCongStats),
    deriveTotals(viecLamStats),
  ]);

  const taiChinhTotals = sumTotals([
    deriveTotals(nganSachStats, { completedKeys: ['total'], pendingKeys: ['dangThucHien'] }),
    deriveTotals(duToanStats),
    deriveTotals(giaiNganStats),
  ]);

  const diaChinhTotals = sumTotals([
    deriveTotals(thuaDatStats),
    deriveTotals(bienDongDatStats),
  ]);

  const moiTruongTotals = sumTotals([
    deriveTotals(racThaiStats),
    deriveTotals(baoCaoONhiemStats, { completedKeys: ['daXuLy'], pendingKeys: ['choXuLy'] }),
    deriveTotals(tramQuanTracStats),
    deriveTotals(diemThuGomStats),
  ]);

  const vanHoaTotals = sumTotals([
    deriveTotals(diTichStats),
    deriveTotals(leHoiStats),
    deriveTotals(langNgheStats),
    deriveTotals(hoSoDiTichStats),
    deriveTotals(coSoDuLichStats),
  ]);

  const moduleTotalsById: Record<string, StatsTotals> = {
    'hanh-chinh-tu-phap': justiceTotals,
    'y-te-giao-duc': yTeTotals,
    'kinh-te-thuong-mai': kinhTeTotals,
    'quoc-phong-an-ninh': anNinhTotals,
    'xay-dung-ha-tang': xayDungTotals,
    'lao-dong-tbxh': laoDongTotals,
    'tai-chinh': taiChinhTotals,
    'dia-chinh': diaChinhTotals,
    'moi-truong': moiTruongTotals,
    'van-hoa-du-lich': vanHoaTotals,
  };

  const subStatsByModule: Record<string, ModuleStats['subStats']> = {
    'hanh-chinh-tu-phap': [
      { label: 'Hộ tịch', value: hoTichTotals.total },
      { label: 'Chứng thực', value: chungThucTotals.total },
      { label: 'Hộ khẩu', value: hoKhauTotals.total },
      { label: 'Văn bản', value: vanBanTotals.total },
    ],
    'y-te-giao-duc': [
      { label: 'Lượt khám', value: phieuKhamStats.total ?? 0 },
      { label: 'Tiêm chủng', value: tiemChungStats.total ?? 0 },
      { label: 'Học sinh', value: lopHocStats.total ?? 0 },
      { label: 'Trường học', value: coSoGiaoDucStats.total ?? 0 },
    ],
    'kinh-te-thuong-mai': [
      { label: 'Hộ kinh doanh', value: hoKinhDoanhStats.total ?? 0 },
      { label: 'Chợ/Điểm KD', value: choDiemStats.total ?? 0 },
      { label: 'Thu phí', value: thuPhiStats.total ?? 0 },
      { label: 'DN nhỏ', value: hoTroDnStats.total ?? 0 },
    ],
    'quoc-phong-an-ninh': [
      { label: 'Tạm trú/vắng', value: tamTruStats.total ?? 0 },
      { label: 'Vi phạm', value: viPhamStats.total ?? 0 },
      { label: 'Phản ánh', value: phanAnhStats.total ?? 0 },
      { label: 'Điểm nóng', value: diemNongAnNinhStats.total ?? 0 },
    ],
    'xay-dung-ha-tang': [
      { label: 'Cấp phép', value: hoSoCapPhepStats.total ?? 0 },
      { label: 'Theo dõi XD', value: theoDoiStats.total ?? 0 },
      { label: 'Hạ tầng', value: haTangStats.total ?? 0 },
      { label: 'Vi phạm XD', value: xayDungTraiPhepStats.total ?? 0 },
    ],
    'lao-dong-tbxh': [
      { label: 'Hộ nghèo', value: hoNgheoStats.total ?? 0 },
      { label: 'Bảo trợ XH', value: baoTroStats.total ?? 0 },
      { label: 'Người có công', value: nguoiCoCongStats.total ?? 0 },
      { label: 'Việc làm', value: viecLamStats.total ?? 0 },
    ],
    'tai-chinh': [
      { label: 'Thu NS', value: formatMoneyShort(toNumber(nganSachStats.totalThu || nganSachStats.totalDuToan || 0)) },
      { label: 'Chi NS', value: formatMoneyShort(toNumber(nganSachStats.totalGiaiNgan || 0)) },
      { label: 'Giải ngân', value: giaiNganStats.total ?? 0 },
      { label: 'Dự toán', value: duToanStats.total ?? 0 },
    ],
    'dia-chinh': [
      { label: 'Hồ sơ đất', value: thuaDatStats.total ?? 0 },
      { label: 'Biến động', value: bienDongDatStats.total ?? 0 },
      { label: 'Cấp sổ đỏ', value: 0 },
      { label: 'Tranh chấp', value: 0 },
    ],
    'moi-truong': [
      { label: 'Chất lượng MT', value: tramQuanTracStats.total ?? 0 },
      { label: 'Thu gom rác', value: diemThuGomStats.total ?? 0 },
      { label: 'Vi phạm', value: baoCaoONhiemStats.total ?? 0 },
      { label: 'Điểm ô nhiễm', value: 0 },
    ],
    'van-hoa-du-lich': [
      { label: 'Di tích', value: diTichStats.total ?? 0 },
      { label: 'Làng nghề', value: langNgheStats.total ?? 0 },
      { label: 'Lễ hội', value: leHoiStats.total ?? 0 },
      { label: 'Cơ sở DL', value: coSoDuLichStats.total ?? 0 },
    ],
  };

  const moduleStats: ModuleStats[] = MODULE_META.map((meta) => {
    const totals = moduleTotalsById[meta.id] ?? { total: 0, completed: 0, pending: 0, overdue: 0 };
    const subStats = subStatsByModule[meta.id] ?? meta.subStats;

    return {
      ...meta,
      total: totals.total,
      completed: totals.completed,
      pending: totals.pending,
      overdue: totals.overdue,
      trend: 0,
      trendDirection: 'stable',
      subStats,
    } as ModuleStats;
  });

  const budgetByDepartment = buildBudgetByDepartment(unwrapList(nganSachListRes));
  const hotspots = buildHotspots(unwrapList(diemNongListRes));

  const systemAlerts = buildSystemAlerts({
    hoSoTthc: hoSoTotals,
    phanAnh: deriveTotals(phanAnhStats, { completedKeys: ['daXuLy'], pendingKeys: ['choXuLy'] }),
    viPham: deriveTotals(viPhamStats, { completedKeys: ['daXuLy'], pendingKeys: ['dangXuLy'] }),
    baoCaoONhiem: deriveTotals(baoCaoONhiemStats, { completedKeys: ['daXuLy'], pendingKeys: ['choXuLy'] }),
    nganSach: { pending: toNumber(nganSachStats.dangThucHien) },
  });

  const fieldStatistics = buildFieldStatistics(moduleStats);
  const fieldKpiDetailed = buildFieldKpiDetailed(fieldStatistics, budgetByDepartment, fieldMonthlyMap, officerKpiData);

  const casesByDepartment = buildCasesByDepartment(moduleStats);
  const summaryStats = buildSummaryStats(moduleStats, systemAlerts);

  const data: LeaderDashboardData = {
    moduleStats,
    summaryStats,
    kpiMonthlyData,
    casesByDepartment,
    budgetByDepartment,
    systemAlerts,
    hotspots: hotspots.length ? hotspots : HOTSPOT_DATA,
    fieldStatistics,
    fieldKpiDetailed,
    officerKpiData,
  };

  cached = { timestamp: Date.now(), data };
  return data;
}

export const FALLBACK_LEADER_DATA: LeaderDashboardData = {
  moduleStats: MODULE_STATISTICS,
  summaryStats: SUMMARY_STATS,
  kpiMonthlyData: KPI_MONTHLY_DATA,
  casesByDepartment: CASES_BY_DEPARTMENT,
  budgetByDepartment: BUDGET_BY_DEPARTMENT,
  systemAlerts: SYSTEM_ALERTS,
  hotspots: HOTSPOT_DATA,
  fieldStatistics: FIELD_STATISTICS,
  fieldKpiDetailed: FIELD_KPI_DETAILED,
  officerKpiData: OFFICER_KPI_DATA,
};
