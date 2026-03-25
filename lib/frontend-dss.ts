import { ALERTS, type Alert } from '@/lib/leader-data';
import {
  BUDGET_BY_DEPARTMENT,
  KPI_MONTHLY_DATA,
  SYSTEM_ALERTS,
} from '@/lib/dashboard-stats';
import {
  mockHoSoTonDong,
  mockThongKeHoSoTonDong,
  mockThongKeDatDai,
} from '@/lib/mock-data';

export interface ForecastPoint {
  thang: string;
  thucTe: number | null;
  duBao: number;
  doTinCay: number;
}

export interface FinancialTrendRow {
  chiTieu: string;
  thangTruoc: number;
  duBaoThangSau: number;
  xuHuong: 'Tăng' | 'Giảm';
  tyLe: number;
  doTinCay: number;
}

export interface FinancialRisk {
  loai: string;
  mota: string;
  mucDo: 'Cao' | 'Trung bình' | 'Thấp';
}

export interface FinancialDssSnapshot {
  duBaoThu: ForecastPoint[];
  duBaoChi: ForecastPoint[];
  xuHuongChiTieu: FinancialTrendRow[];
  canhBaoRuiRo: FinancialRisk[];
  doChinhXac: number;
  xuHuongThangSau: number;
  soBaoCaoAi: number;
}

export interface BudgetAlertItem {
  MaKhoanMuc: string;
  TenKhoanMuc: string;
  DuToan: number;
  DaChi: number;
  TyLeThucHien: number;
  MucDo: 'Nghiêm trọng' | 'Trung bình' | 'Theo dõi' | 'An toàn';
  NgayCapNhat: string;
}

export interface BudgetDepartmentItem {
  name: string;
  allocated: number;
  spent: number;
  status: 'normal' | 'warning' | 'over';
}

export interface BudgetMonitoringSnapshot {
  budgetData: Array<{ month: string; allocated: number; spent: number }>;
  departmentBudget: BudgetDepartmentItem[];
  budgetAlerts: BudgetAlertItem[];
  totalAllocated: number;
  totalSpent: number;
  totalRemaining: number;
  percentageUsed: number;
  overBudgetCount: number;
  warningCount: number;
}

export type AlertRiskLevel = 'critical' | 'warning' | 'info' | 'safe';
export type AlertPeriod = '7d' | '30d' | '90d' | 'all';

export interface SharedAlertFilters {
  period: AlertPeriod;
  risk: AlertRiskLevel | 'all';
}

export interface SharedAlertSignal {
  id: string;
  title: string;
  description: string;
  level: AlertRiskLevel;
  source: string;
  createdDate: string;
}

export interface LeaderSignalSnapshot {
  doTinCayDuBao: number;
  xuHuongRuiRo7Ngay: Array<{
    ngay: string;
    diemRuiRo: number;
    critical: number;
    warning: number;
  }>;
  tongRuiRoHienTai: number;
}

export interface BacklogSnapshot {
  tongHoSoTonDong: number;
  quaHan: number;
  trongHan: number;
  trendDelta: number;
  doTinCayDuBao: number;
  theoLinhVuc: typeof mockThongKeHoSoTonDong.TheoLinhVuc;
  theoCanBo: typeof mockThongKeHoSoTonDong.TheoCanBo;
}

export const ALERT_RISK_LABELS: Record<AlertRiskLevel, string> = {
  critical: 'Nghiêm trọng',
  warning: 'Cảnh báo',
  info: 'Thông tin',
  safe: 'An toàn',
};

export const ALERT_PERIOD_LABELS: Record<AlertPeriod, string> = {
  '7d': '7 ngày',
  '30d': '30 ngày',
  '90d': '90 ngày',
  all: 'Toàn bộ',
};

function monthLabel(offset: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + offset);
  const mm = d.getMonth() + 1;
  const yy = d.getFullYear().toString().slice(-2);
  return `T${mm}/${yy}`;
}

function rounded(num: number): number {
  return Math.round(num * 10) / 10;
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function daysAgoIso(dayOffset: number): string {
  return toIsoDate(new Date(Date.now() - dayOffset * 24 * 3600 * 1000));
}

function mapAlertTypeToRisk(type: Alert['type']): AlertRiskLevel {
  if (type === 'critical') return 'critical';
  if (type === 'warning') return 'warning';
  return 'info';
}

function mapBudgetSeverityToRisk(level: BudgetAlertItem['MucDo']): AlertRiskLevel {
  if (level === 'Nghiêm trọng') return 'critical';
  if (level === 'Trung bình' || level === 'Theo dõi') return 'warning';
  return 'safe';
}

function dayDiffFromNow(dateStr: string): number {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return 0;
  }
  const now = new Date();
  const utcNow = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((utcNow - utcDate) / (24 * 3600 * 1000));
}

function inPeriod(dateStr: string, period: AlertPeriod): boolean {
  if (period === 'all') return true;
  const diff = dayDiffFromNow(dateStr);
  if (period === '7d') return diff <= 7;
  if (period === '30d') return diff <= 30;
  return diff <= 90;
}

function sumBudget() {
  const allocated = BUDGET_BY_DEPARTMENT.reduce((sum, d) => sum + d.allocated, 0);
  const spent = BUDGET_BY_DEPARTMENT.reduce((sum, d) => sum + d.spent, 0);
  return { allocated, spent };
}

function buildForecastSeries(currentValue: number, growthRate: number, confidenceStart: number): ForecastPoint[] {
  return [0, 1, 2, 3, 4].map((offset) => {
    const factor = Math.pow(1 + growthRate / 100, offset);
    return {
      thang: monthLabel(offset),
      thucTe: offset === 0 ? rounded(currentValue) : null,
      duBao: rounded(currentValue * factor),
      doTinCay: Math.max(80, confidenceStart - offset * 2),
    };
  });
}

export function getFinancialDssSnapshot(): FinancialDssSnapshot {
  const { allocated, spent } = sumBudget();
  const firstKpi = KPI_MONTHLY_DATA[0];
  const lastKpi = KPI_MONTHLY_DATA[KPI_MONTHLY_DATA.length - 1];
  const completionStart = firstKpi
    ? (firstKpi.completedOnTime / Math.max(firstKpi.totalCases, 1)) * 100
    : 88;
  const completionEnd = lastKpi
    ? (lastKpi.completedOnTime / Math.max(lastKpi.totalCases, 1)) * 100
    : completionStart;
  const completionMomentum = completionEnd - completionStart;

  const revenueNow = allocated * 0.086;
  const expenseNow = spent * 0.085;

  const revenueGrowth = 2.2 + completionMomentum * 0.1;
  const expenseGrowth = 2.8;

  const duBaoThu = buildForecastSeries(revenueNow, revenueGrowth, 92);
  const duBaoChi = buildForecastSeries(expenseNow, expenseGrowth, 90);

  const currentBalance = revenueNow - expenseNow;
  const nextBalance = duBaoThu[1].duBao - duBaoChi[1].duBao;
  const nextRatio = duBaoChi[1].duBao === 0 ? 0 : (duBaoThu[1].duBao / duBaoChi[1].duBao) * 100;

  const xuHuongChiTieu: FinancialTrendRow[] = [
    {
      chiTieu: 'Thu ngân sách',
      thangTruoc: rounded(revenueNow),
      duBaoThangSau: duBaoThu[1].duBao,
      xuHuong: duBaoThu[1].duBao >= revenueNow ? 'Tăng' : 'Giảm',
      tyLe: rounded(((duBaoThu[1].duBao - revenueNow) / revenueNow) * 100),
      doTinCay: 92,
    },
    {
      chiTieu: 'Chi ngân sách',
      thangTruoc: rounded(expenseNow),
      duBaoThangSau: duBaoChi[1].duBao,
      xuHuong: duBaoChi[1].duBao >= expenseNow ? 'Tăng' : 'Giảm',
      tyLe: rounded(((duBaoChi[1].duBao - expenseNow) / expenseNow) * 100),
      doTinCay: 90,
    },
    {
      chiTieu: 'Cân đối NS',
      thangTruoc: rounded(currentBalance),
      duBaoThangSau: rounded(nextBalance),
      xuHuong: nextBalance >= currentBalance ? 'Tăng' : 'Giảm',
      tyLe:
        currentBalance === 0
          ? 0
          : rounded(((nextBalance - currentBalance) / Math.abs(currentBalance)) * 100),
      doTinCay: 88,
    },
    {
      chiTieu: 'Tỷ lệ thu/chi',
      thangTruoc: rounded((revenueNow / expenseNow) * 100),
      duBaoThangSau: rounded(nextRatio),
      xuHuong: nextRatio >= (revenueNow / expenseNow) * 100 ? 'Tăng' : 'Giảm',
      tyLe: rounded(nextRatio - (revenueNow / expenseNow) * 100),
      doTinCay: 89,
    },
  ];

  const canhBaoRuiRo: FinancialRisk[] = [];
  if (BUDGET_BY_DEPARTMENT.some((d) => d.percent >= 95)) {
    canhBaoRuiRo.push({
      loai: 'Vượt dự toán',
      mota: 'Có khoản mục đã đạt hoặc vượt 95% ngân sách, cần cân đối sớm.',
      mucDo: 'Cao',
    });
  }

  if (nextBalance < 0) {
    canhBaoRuiRo.push({
      loai: 'Thiếu hụt quỹ tới',
      mota: 'Dự báo quý tới cho thấy chi lớn hơn thu ở một số tháng.',
      mucDo: 'Cao',
    });
  }

  if (mockThongKeHoSoTonDong.QuaHan >= 8) {
    canhBaoRuiRo.push({
      loai: 'Áp lực xử lý TTHC',
      mota: `Đang có ${mockThongKeHoSoTonDong.QuaHan} hồ sơ quá hạn, có nguy cơ ảnh hưởng KPI điều hành.`,
      mucDo: 'Trung bình',
    });
  }

  return {
    duBaoThu,
    duBaoChi,
    xuHuongChiTieu,
    canhBaoRuiRo,
    doChinhXac: 90,
    xuHuongThangSau: rounded(((duBaoThu[1].duBao - revenueNow) / revenueNow) * 100),
    soBaoCaoAi: 12 + canhBaoRuiRo.length,
  };
}

function deriveDynamicAlerts(startId: number): Alert[] {
  const alerts: Alert[] = [];
  let id = startId;

  if (mockThongKeHoSoTonDong.QuaHan > 0) {
    alerts.push({
      id: id++,
      type: mockThongKeHoSoTonDong.QuaHan >= 8 ? 'critical' : 'warning',
      fieldCode: 'TU_PHAP',
      fieldName: 'Hành chính công',
      title: `${mockThongKeHoSoTonDong.QuaHan} hồ sơ TTHC quá hạn`,
      description: 'Cần ưu tiên xử lý các hồ sơ tồn đọng để tránh tăng SLA trễ hạn.',
      department: 'Văn phòng UBND',
      createdDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      status: 'new',
      priority: mockThongKeHoSoTonDong.QuaHan >= 8 ? 'high' : 'medium',
      assignedTo: 'Tổ một cửa',
    });
  }

  const overdueLandCases = mockHoSoTonDong.filter(
    (item) => item.TenLinhVuc.includes('Địa chính') || item.TenLinhVuc.includes('Dia chinh'),
  ).length;

  if (overdueLandCases >= 2) {
    alerts.push({
      id: id++,
      type: 'warning',
      fieldCode: 'DIA_CHINH',
      fieldName: 'Đất đai',
      title: 'Nguy cơ điểm nóng khiếu nại đất đai',
      description: `Có ${overdueLandCases} hồ sơ địa chính tồn đọng, cần theo dõi sát để tránh phát sinh tranh chấp.`,
      department: 'Phong TNMT',
      createdDate: new Date().toISOString().slice(0, 10),
      status: 'processing',
      priority: 'medium',
      assignedTo: 'Tổ địa chính',
    });
  }

  const uncapturedRatio = (mockThongKeDatDai.ChuaCapGCN / mockThongKeDatDai.SoThua) * 100;
  if (uncapturedRatio >= 7) {
    alerts.push({
      id: id++,
      type: 'warning',
      fieldCode: 'DIA_CHINH',
      fieldName: 'Đất đai',
      title: 'Tỷ lệ chưa cấp GCN cao',
      description: `Tỷ lệ chưa cấp GCN đang ở mức ${rounded(uncapturedRatio)}%, cần có kế hoạch xử lý bổ sung.`,
      department: 'Phong TNMT',
      createdDate: new Date().toISOString().slice(0, 10),
      status: 'new',
      priority: 'medium',
    });
  }

  return alerts;
}

export function getOperationalAlerts(): Alert[] {
  const baseAlerts = ALERTS.map((item) => ({ ...item }));
  const systemMapped: Alert[] = SYSTEM_ALERTS.slice(0, 4).map((item, idx) => ({
    id: 3000 + idx,
    type: item.type === 'danger' ? 'critical' : item.type === 'warning' ? 'warning' : 'info',
    fieldCode:
      item.module === 'Tài chính' || item.module === 'Tai chinh'
        ? 'TAI_CHINH'
        : item.module === 'Địa chính' || item.module === 'Dia chinh'
          ? 'DIA_CHINH'
          : item.module === 'An ninh'
            ? 'AN_NINH'
            : 'TU_PHAP',
    fieldName: item.module,
    title: item.title,
    description: item.description,
    department: item.module,
    createdDate: item.timestamp.slice(0, 10),
    status: item.priority === 'high' ? 'new' : 'processing',
    priority: item.priority === 'high' ? 'high' : item.priority === 'medium' ? 'medium' : 'low',
  }));

  const dynamicAlerts = deriveDynamicAlerts(4000);

  const merged = [...dynamicAlerts, ...systemMapped, ...baseAlerts];
  return merged.sort((a, b) => {
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    return priorityWeight[b.priority] - priorityWeight[a.priority];
  });
}

export function filterOperationalAlerts(alerts: Alert[], filters: SharedAlertFilters): Alert[] {
  return alerts.filter((alert) => {
    const risk = mapAlertTypeToRisk(alert.type);
    const matchedRisk = filters.risk === 'all' || risk === filters.risk;
    const matchedPeriod = inPeriod(alert.createdDate, filters.period);
    return matchedRisk && matchedPeriod;
  });
}

export function getAssistantQuickStats() {
  const financial = getFinancialDssSnapshot();
  const alerts = getOperationalAlerts();
  const hoSoTreHan = mockThongKeHoSoTonDong.QuaHan;
  const totalHoSoDangXuLy = mockThongKeHoSoTonDong.TongHoSoTonDong;

  return {
    tyLeDungHan: Math.max(80, 100 - Math.round((hoSoTreHan / Math.max(1, totalHoSoDangXuLy)) * 100)),
    tongHoSoDangXuLy: totalHoSoDangXuLy,
    hoSoTreHan,
    tongCanhBao: alerts.length,
    canhBaoNghiemTrong: alerts.filter((a) => a.type === 'critical').length,
    duBaoThuThangToi: financial.duBaoThu[1]?.duBao ?? 0,
    duBaoChiThangToi: financial.duBaoChi[1]?.duBao ?? 0,
  };
}

export function getBacklogSnapshot(): BacklogSnapshot {
  const total = mockThongKeHoSoTonDong.TongHoSoTonDong;
  const overdue = mockThongKeHoSoTonDong.QuaHan;
  const overdueRate = total === 0 ? 0 : (overdue / total) * 100;

  return {
    tongHoSoTonDong: total,
    quaHan: overdue,
    trongHan: mockThongKeHoSoTonDong.TrongHan,
    trendDelta: rounded(-Math.max(3, 16 - overdueRate)),
    doTinCayDuBao: Math.max(82, 95 - rounded(overdueRate * 0.7)),
    theoLinhVuc: mockThongKeHoSoTonDong.TheoLinhVuc,
    theoCanBo: mockThongKeHoSoTonDong.TheoCanBo,
  };
}

export function getBacklogAlerts(): SharedAlertSignal[] {
  const snapshot = getBacklogSnapshot();
  const today = daysAgoIso(0);
  const level: AlertRiskLevel = snapshot.quaHan >= 8 ? 'critical' : snapshot.quaHan > 0 ? 'warning' : 'safe';

  return [
    {
      id: 'backlog-overdue-main',
      title: `${snapshot.quaHan} hồ sơ quá hạn cần xử lý`,
      description:
        level === 'critical'
          ? 'Khối lượng hồ sơ trễ hạn đang cao, cần ưu tiên điều phối xử lý liên phòng ban.'
          : level === 'warning'
            ? 'Đã phát sinh hồ sơ trễ hạn, cần theo dõi sát để không tăng SLA.'
            : 'Tình hình tồn đọng ổn định, tiếp tục duy trì tốc độ xử lý.',
      level,
      source: 'Hồ sơ tồn đọng',
      createdDate: today,
    },
  ];
}

export function getLandAlerts(disputeCount: number): SharedAlertSignal[] {
  const today = daysAgoIso(0);
  const uncapturedRatio = (mockThongKeDatDai.ChuaCapGCN / Math.max(1, mockThongKeDatDai.SoThua)) * 100;

  const signals: SharedAlertSignal[] = [
    {
      id: 'land-dispute-hotspot',
      title: 'Cảnh báo tranh chấp đất đai',
      description:
        disputeCount > 0
          ? `Có ${disputeCount} hồ sơ đang tranh chấp, cần ưu tiên hòa giải và xác minh thực địa.`
          : 'Chưa ghi nhận tranh chấp đang mở trong kỳ theo dõi.',
      level: disputeCount >= 2 ? 'critical' : disputeCount === 1 ? 'warning' : 'safe',
      source: 'Địa chính',
      createdDate: today,
    },
    {
      id: 'land-uncaptured-gcn',
      title: 'Tỷ lệ chưa cấp GCN',
      description: `Tỷ lệ chưa cấp GCN hiện tại là ${rounded(uncapturedRatio)}%.`,
      level: uncapturedRatio >= 10 ? 'critical' : uncapturedRatio >= 7 ? 'warning' : 'info',
      source: 'Địa chính',
      createdDate: today,
    },
  ];

  return signals;
}

export function getRedBookAlerts(boSungHoSo: number): SharedAlertSignal[] {
  const today = daysAgoIso(0);
  return [
    {
      id: 'redbook-missing-docs',
      title: 'Hồ sơ cần bổ sung giấy tờ',
      description:
        boSungHoSo > 0
          ? `Hiện có ${boSungHoSo} hồ sơ cần bổ sung. Cần gửi nhắc nhở và hướng dẫn chi tiết cho người dân.`
          : 'Không có hồ sơ đang chờ bổ sung trong kỳ theo dõi.',
      level: boSungHoSo >= 3 ? 'critical' : boSungHoSo > 0 ? 'warning' : 'safe',
      source: 'Cấp sổ đỏ',
      createdDate: today,
    },
  ];
}

export function filterSignalsByCommonFilters(
  signals: SharedAlertSignal[],
  filters: SharedAlertFilters,
): SharedAlertSignal[] {
  return signals.filter((signal) => {
    const matchedRisk = filters.risk === 'all' || signal.level === filters.risk;
    const matchedPeriod = inPeriod(signal.createdDate, filters.period);
    return matchedRisk && matchedPeriod;
  });
}

function getBudgetSeverity(percent: number): BudgetAlertItem['MucDo'] {
  if (percent >= 95) return 'Nghiêm trọng';
  if (percent >= 90) return 'Trung bình';
  if (percent >= 85) return 'Theo dõi';
  return 'An toàn';
}

function getBudgetStatus(percent: number): BudgetDepartmentItem['status'] {
  if (percent >= 100) return 'over';
  if (percent >= 92) return 'warning';
  return 'normal';
}

export function getBudgetMonitoringSnapshot(): BudgetMonitoringSnapshot {
  const now = new Date();
  const budgetAlerts: BudgetAlertItem[] = BUDGET_BY_DEPARTMENT.map((item, index) => {
    const allocated = item.allocated * 1_000_000;
    const spent = item.spent * 1_000_000;
    const percent = allocated === 0 ? 0 : (spent / allocated) * 100;

    return {
      MaKhoanMuc: `CB${String(index + 1).padStart(3, '0')}`,
      TenKhoanMuc: item.name,
      DuToan: allocated,
      DaChi: spent,
      TyLeThucHien: rounded(percent),
      MucDo: getBudgetSeverity(percent),
      NgayCapNhat: now.toISOString().slice(0, 10),
    };
  });

  const totalAllocated = BUDGET_BY_DEPARTMENT.reduce((sum, item) => sum + item.allocated, 0);
  const totalSpent = BUDGET_BY_DEPARTMENT.reduce((sum, item) => sum + item.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;
  const percentageUsed = totalAllocated === 0 ? 0 : Math.round((totalSpent / totalAllocated) * 100);

  const budgetData = KPI_MONTHLY_DATA.map((kpi) => {
    const allocated = rounded(totalAllocated / KPI_MONTHLY_DATA.length);
    const completionRate = kpi.totalCases === 0 ? 0 : kpi.completedOnTime / kpi.totalCases;
    const spentFactor = 0.85 + completionRate * 0.22;

    return {
      month: kpi.month,
      allocated,
      spent: rounded(Math.min(allocated * 1.08, allocated * spentFactor)),
    };
  });

  const departmentBudget: BudgetDepartmentItem[] = BUDGET_BY_DEPARTMENT.map((item) => ({
    name: item.name,
    allocated: item.allocated,
    spent: item.spent,
    status: getBudgetStatus(item.percent),
  }));

  return {
    budgetData,
    departmentBudget,
    budgetAlerts,
    totalAllocated,
    totalSpent,
    totalRemaining,
    percentageUsed,
    overBudgetCount: departmentBudget.filter((d) => d.status === 'over').length,
    warningCount: departmentBudget.filter((d) => d.status === 'warning').length,
  };
}

export function filterBudgetAlerts(
  alerts: BudgetAlertItem[],
  filters: SharedAlertFilters,
): BudgetAlertItem[] {
  return alerts.filter((alert) => {
    const risk = mapBudgetSeverityToRisk(alert.MucDo);
    const matchedRisk = filters.risk === 'all' || risk === filters.risk;
    const matchedPeriod = inPeriod(alert.NgayCapNhat, filters.period);
    return matchedRisk && matchedPeriod;
  });
}

function getRiskTrend7Days(alerts: Alert[]): LeaderSignalSnapshot['xuHuongRuiRo7Ngay'] {
  return Array.from({ length: 7 }, (_, i) => {
    const dayOffset = 6 - i;
    const baseDate = daysAgoIso(dayOffset);
    const critical = alerts.filter((a) => a.type === 'critical').length;
    const warning = alerts.filter((a) => a.type === 'warning').length;

    // Simulate short trend around current alert pressure for UI testing without backend.
    const dayDrift = dayOffset - 3;
    const driftFactor = dayDrift < 0 ? 1.05 : 0.95;
    const c = Math.max(0, Math.round(critical * driftFactor + (dayOffset % 2 === 0 ? 0 : -1)));
    const w = Math.max(0, Math.round(warning * (1 + dayDrift * 0.03)));
    const score = Math.min(100, Math.round(c * 14 + w * 6));

    return {
      ngay: baseDate.slice(5),
      diemRuiRo: score,
      critical: c,
      warning: w,
    };
  });
}

export function getLeaderSignalSnapshot(): LeaderSignalSnapshot {
  const financial = getFinancialDssSnapshot();
  const operational = getOperationalAlerts();
  const avgForecastConfidence =
    (financial.duBaoThu.reduce((s, p) => s + p.doTinCay, 0) +
      financial.duBaoChi.reduce((s, p) => s + p.doTinCay, 0)) /
    (financial.duBaoThu.length + financial.duBaoChi.length);

  const riskTrend = getRiskTrend7Days(operational);
  const tongRuiRoHienTai = riskTrend[riskTrend.length - 1]?.diemRuiRo ?? 0;

  return {
    doTinCayDuBao: rounded((avgForecastConfidence + financial.doChinhXac) / 2),
    xuHuongRuiRo7Ngay: riskTrend,
    tongRuiRoHienTai,
  };
}
