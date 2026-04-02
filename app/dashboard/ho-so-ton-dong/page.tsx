'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  BarChart3,
  AlertTriangle,
  Clock,
  TrendingDown,
  Search,
  Download,
  Eye,
  Filter,
  Home,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  User,
  Calendar,
} from 'lucide-react';
import { bienDongDatApi, thuaDatApi } from '@/lib/api';
import {
  ALERT_PERIOD_LABELS,
  ALERT_RISK_LABELS,
  type BacklogSnapshot,
  type AlertPeriod,
  type AlertRiskLevel,
  type SharedAlertSignal,
  filterSignalsByCommonFilters,
} from '@/lib/frontend-dss';
import { FunctionStyledPanel } from '@/components/charts/function-styled-panel';

interface HoSoTonDongItem {
  MaHoSo: string;
  TenNghiepVu: string;
  TenCongDan: string;
  TenLinhVuc: string;
  NgayNhan: string;
  HanXuLy: string;
  SoNgayTonDong: number;
  LyDoTonDong: string;
  CanBoXuLy: string;
  MucDoQuaHan: 'Quá hạn' | 'Trong hạn';
}

function toDateString(value: unknown): string {
  if (!value) return '';
  return String(value).slice(0, 10);
}

function addDays(dateString: string, days: number): string {
  const base = new Date(dateString);
  if (Number.isNaN(base.getTime())) {
    return '';
  }
  base.setDate(base.getDate() + days);
  return base.toISOString().slice(0, 10);
}

function dayDiffFromToday(dateString: string): number {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return 0;
  }

  const now = new Date();
  const utcNow = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((utcNow - utcDate) / (24 * 3600 * 1000));
}

function isPendingStatus(status: unknown): boolean {
  const value = String(status || '').toLowerCase();
  if (!value) return true;
  return (
    value.includes('chờ') ||
    value.includes('đang') ||
    value.includes('bổ sung') ||
    value.includes('xử lý') ||
    value.includes('thẩm định')
  );
}

function buildBacklogSnapshot(records: HoSoTonDongItem[]): BacklogSnapshot {
  const tongHoSoTonDong = records.length;
  const quaHan = records.filter((item) => item.MucDoQuaHan === 'Quá hạn').length;
  const trongHan = tongHoSoTonDong - quaHan;

  const currentWindow = records.filter((item) => {
    const diff = dayDiffFromToday(item.NgayNhan);
    return diff <= 30 && item.MucDoQuaHan === 'Quá hạn';
  }).length;

  const previousWindow = records.filter((item) => {
    const diff = dayDiffFromToday(item.NgayNhan);
    return diff > 30 && diff <= 60 && item.MucDoQuaHan === 'Quá hạn';
  }).length;

  const trendDelta =
    previousWindow === 0
      ? currentWindow === 0
        ? 0
        : -100
      : Math.round(((previousWindow - currentWindow) / previousWindow) * 100);

  const fieldMap = new Map<string, { LinhVuc: string; SoLuong: number; QuaHan: number }>();
  for (const item of records) {
    const key = item.TenLinhVuc || 'Khác';
    const current = fieldMap.get(key) || { LinhVuc: key, SoLuong: 0, QuaHan: 0 };
    current.SoLuong += 1;
    if (item.MucDoQuaHan === 'Quá hạn') {
      current.QuaHan += 1;
    }
    fieldMap.set(key, current);
  }

  const officerMap = new Map<string, { CanBo: string; SoLuong: number }>();
  for (const item of records) {
    const key = item.CanBoXuLy || 'Chưa phân công';
    const current = officerMap.get(key) || { CanBo: key, SoLuong: 0 };
    current.SoLuong += 1;
    officerMap.set(key, current);
  }

  const doTinCayDuBao = Math.max(
    75,
    95 - Math.round((quaHan / Math.max(1, tongHoSoTonDong)) * 40),
  );

  return {
    tongHoSoTonDong,
    quaHan,
    trongHan,
    trendDelta,
    doTinCayDuBao,
    theoLinhVuc: Array.from(fieldMap.values()).sort((a, b) => b.SoLuong - a.SoLuong),
    theoCanBo: Array.from(officerMap.values()).sort((a, b) => b.SoLuong - a.SoLuong),
  };
}

function buildBacklogSignals(snapshot: BacklogSnapshot): SharedAlertSignal[] {
  const today = new Date().toISOString().slice(0, 10);
  const topOfficer = snapshot.theoCanBo[0];
  return [
    {
      id: 'backlog-overdue-main',
      title: `${snapshot.quaHan} hồ sơ quá hạn cần xử lý`,
      description:
        snapshot.quaHan >= 8
          ? 'Khối lượng hồ sơ trễ hạn đang cao, cần ưu tiên điều phối xử lý liên phòng ban.'
          : snapshot.quaHan > 0
            ? 'Đã phát sinh hồ sơ trễ hạn, cần theo dõi sát để không tăng SLA.'
            : 'Không ghi nhận hồ sơ trễ hạn trong kỳ theo dõi hiện tại.',
      level: snapshot.quaHan >= 8 ? 'critical' : snapshot.quaHan > 0 ? 'warning' : 'safe',
      source: 'Hồ sơ tồn đọng',
      createdDate: today,
    },
    {
      id: 'backlog-officer-load',
      title: 'Cảnh báo phân bổ cán bộ xử lý',
      description: topOfficer
        ? `${topOfficer.CanBo} đang phụ trách ${topOfficer.SoLuong} hồ sơ tồn đọng.`
        : 'Chưa có dữ liệu phân công cán bộ xử lý.',
      level: topOfficer?.SoLuong >= 5 ? 'warning' : 'info',
      source: 'Điều phối cán bộ',
      createdDate: today,
    },
  ];
}

export default function HoSoTonDongPage() {
  const router = useRouter();
  const [records, setRecords] = useState<HoSoTonDongItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<HoSoTonDongItem | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState<AlertPeriod>('30d');
  const [filterRisk, setFilterRisk] = useState<AlertRiskLevel | 'all'>('all');

  const loadData = async () => {
    try {
      const [capSoDoRes, thamDinhRes, tranhChapRes] = await Promise.all([
        thuaDatApi.getList({ page: 1, limit: 5000, loaiBanGhi: 'CAP_SO_DO' }),
        bienDongDatApi.getList({ page: 1, limit: 5000, loaiBanGhi: 'THAM_DINH_THUC_DIA' }),
        bienDongDatApi.getList({ page: 1, limit: 5000, loaiBanGhi: 'TRANH_CHAP_DAT' }),
      ]);

      const capSoDoItems = (capSoDoRes.success && Array.isArray(capSoDoRes.data)
        ? capSoDoRes.data
        : []
      ).filter((item: any) => isPendingStatus(item.TrangThai)).map((item: any): HoSoTonDongItem => {
        const ngayNhan =
          toDateString(item.NgayNop) ||
          toDateString(item.NgayNhapLieu) ||
          new Date().toISOString().slice(0, 10);
        const hanXuLy = toDateString(item.NgayHenTra) || addDays(ngayNhan, 20);
        return {
          MaHoSo: item.MaHoSo || `HS-SD-${item.MaThua || 'NA'}`,
          TenNghiepVu: 'Cấp giấy chứng nhận quyền sử dụng đất',
          TenCongDan: item.ChuSoHuu || 'Chưa cập nhật',
          TenLinhVuc: 'Địa chính - Cấp sổ đỏ',
          NgayNhan: ngayNhan,
          HanXuLy: hanXuLy,
          SoNgayTonDong: Math.max(dayDiffFromToday(ngayNhan), 0),
          LyDoTonDong: item.GhiChu || 'Hồ sơ đang trong quá trình xử lý.',
          CanBoXuLy: item.CanBoThamDinh || item.CanBoTiepNhan || 'Chưa phân công',
          MucDoQuaHan: dayDiffFromToday(hanXuLy) > 0 ? 'Quá hạn' : 'Trong hạn',
        };
      });

      const thamDinhItems = (thamDinhRes.success && Array.isArray(thamDinhRes.data)
        ? thamDinhRes.data
        : []
      ).filter((item: any) => isPendingStatus(item.TrangThai)).map((item: any): HoSoTonDongItem => {
        const ngayNhan =
          toDateString(item.NgayThamDinh) ||
          toDateString(item.NgayDeNghi) ||
          toDateString(item.NgayBienDong) ||
          new Date().toISOString().slice(0, 10);
        const hanXuLy = addDays(ngayNhan, 15) || ngayNhan;
        return {
          MaHoSo:
            item.MaHoSo ||
            item.MaBienDongText ||
            (item.MaBienDong ? `TD-${String(item.MaBienDong).padStart(4, '0')}` : 'TD-NA'),
          TenNghiepVu: `Thẩm định thực địa${item.LoaiThamDinh ? ` - ${item.LoaiThamDinh}` : ''}`,
          TenCongDan:
            item.ChuSoHuuMoi ||
            item.ChuSoHuuCu ||
            item.BenKhieuNai ||
            'Chưa cập nhật',
          TenLinhVuc: 'Địa chính - Thẩm định thực địa',
          NgayNhan: ngayNhan,
          HanXuLy: hanXuLy,
          SoNgayTonDong: Math.max(dayDiffFromToday(ngayNhan), 0),
          LyDoTonDong:
            item.MoTaSaiLech ||
            item.LyDo ||
            item.GhiChu ||
            'Đang chờ kết luận thẩm định thực địa.',
          CanBoXuLy: item.CanBoThamDinh || item.CanBoXuLy || 'Chưa phân công',
          MucDoQuaHan: dayDiffFromToday(hanXuLy) > 0 ? 'Quá hạn' : 'Trong hạn',
        };
      });

      const tranhChapItems = (tranhChapRes.success && Array.isArray(tranhChapRes.data)
        ? tranhChapRes.data
        : []
      ).filter((item: any) => isPendingStatus(item.TrangThai)).map((item: any): HoSoTonDongItem => {
        const ngayNhan =
          toDateString(item.NgayKhieuNai) ||
          toDateString(item.NgayDeNghi) ||
          toDateString(item.NgayBienDong) ||
          new Date().toISOString().slice(0, 10);
        const hanXuLy = addDays(ngayNhan, 30) || ngayNhan;
        return {
          MaHoSo:
            item.MaHoSo ||
            item.MaVu ||
            item.MaBienDongText ||
            (item.MaBienDong ? `TC-${String(item.MaBienDong).padStart(4, '0')}` : 'TC-NA'),
          TenNghiepVu: `Giải quyết tranh chấp${item.LoaiTranhChap ? ` - ${item.LoaiTranhChap}` : ' đất đai'}`,
          TenCongDan: item.BenKhieuNai || item.BenBiKhieuNai || item.ChuSoHuuMoi || 'Chưa cập nhật',
          TenLinhVuc: 'Địa chính - Tranh chấp đất đai',
          NgayNhan: ngayNhan,
          HanXuLy: hanXuLy,
          SoNgayTonDong: Math.max(dayDiffFromToday(ngayNhan), 0),
          LyDoTonDong:
            item.NoiDung ||
            item.LyDo ||
            item.GhiChu ||
            'Đang chờ xác minh và hòa giải theo quy định.',
          CanBoXuLy: item.CanBoThuLy || item.CanBoXuLy || 'Chưa phân công',
          MucDoQuaHan: dayDiffFromToday(hanXuLy) > 0 ? 'Quá hạn' : 'Trong hạn',
        };
      });

      const merged = [...capSoDoItems, ...thamDinhItems, ...tranhChapItems].sort(
        (a, b) => b.SoNgayTonDong - a.SoNgayTonDong,
      );
      setRecords(merged);
    } catch {
      setRecords([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const backlogSnapshot = useMemo(() => buildBacklogSnapshot(records), [records]);
  const backlogSignals = useMemo(
    () =>
      filterSignalsByCommonFilters(buildBacklogSignals(backlogSnapshot), {
        period: filterPeriod,
        risk: filterRisk,
      }),
    [backlogSnapshot, filterPeriod, filterRisk],
  );

  // Lọc dữ liệu
  const filteredData = records.filter(hs =>
    hs.TenNghiepVu.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hs.TenCongDan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (item: HoSoTonDongItem) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const handleExport = () => {
    const csvContent = [
      ['Mã HS', 'Tên nghiệp vụ', 'Công dân', 'Ngày nhận', 'Hạn XL', 'Số ngày', 'Mức độ'],
      ...filteredData.map(hs => [
        hs.MaHoSo,
        hs.TenNghiepVu,
        hs.TenCongDan,
        hs.NgayNhan,
        hs.HanXuLy,
        hs.SoNgayTonDong,
        hs.MucDoQuaHan
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ho-so-ton-dong-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleFilter = () => {
    setIsFilterOpen(true);
  };

  const getMucDoQuaHanBadge = (mucDo: string) => {
    switch (mucDo) {
      case 'Quá hạn':
        return <Badge className="bg-red-500/10 text-red-700 border-0"><XCircle className="w-3 h-3 mr-1" />{mucDo}</Badge>;
      case 'Trong hạn':
        return <Badge className="bg-green-500/10 text-green-700 border-0"><CheckCircle2 className="w-3 h-3 mr-1" />{mucDo}</Badge>;
      default:
        return <Badge variant="outline">{mucDo}</Badge>;
    }
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-1 hover:text-primary transition-colors">
            <Home className="w-4 h-4" />
            Bàn làm việc
          </button>
          <span>/</span>
          <span className="text-foreground font-medium">Hồ sơ Tồn đọng</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
      </div>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-status-warning via-primary to-status-warning p-4 sm:p-5 xl:p-6 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Thống kê Hồ sơ Tồn động</h1>
              </div>
              <p className="text-white/90">Báo cáo hồ sơ tồn đọng chưa xử lý theo lĩnh vực</p>
            </div>
            <div className="flex w-full 2xl:w-auto flex-col sm:flex-row gap-2 sm:gap-3">
              <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </div>
        </div>
      </div>

      <FunctionStyledPanel
        title="Áp lực hồ sơ tồn đọng địa chính"
        subtitle="Biểu đồ kết hợp biểu diễn tổng tồn đọng, quá hạn và xu hướng biến động theo chu kỳ"
        variant="land-backlog"
        items={[
          { label: 'Hồ sơ tồn đọng', value: backlogSnapshot.tongHoSoTonDong, color: '#ef4444' },
          { label: 'Quá hạn xử lý', value: backlogSnapshot.quaHan, color: '#dc2626' },
          { label: 'Trong hạn xử lý', value: backlogSnapshot.trongHan, color: '#f59e0b' },
          { label: 'Xu hướng giảm (%)', value: backlogSnapshot.trendDelta, color: '#22c55e' },
          { label: 'Độ tin cậy dự báo', value: backlogSnapshot.doTinCayDuBao, color: '#3b82f6' },
        ]}
      />

      <Card className="p-4 border-0 shadow-lg">
        <div className="flex flex-col md:flex-row gap-3">
          <Select value={filterPeriod} onValueChange={(v) => setFilterPeriod(v as AlertPeriod)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Thời gian" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ALERT_PERIOD_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterRisk} onValueChange={(v) => setFilterRisk(v as AlertRiskLevel | 'all')}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Mức độ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả mức độ</SelectItem>
              {Object.entries(ALERT_RISK_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {backlogSignals.map((signal) => (
        <Alert
          key={signal.id}
          className={
            signal.level === 'critical'
              ? 'bg-red-50 border-red-200'
              : signal.level === 'warning'
                ? 'bg-amber-50 border-amber-200'
                : 'bg-blue-50 border-blue-200'
          }
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{signal.title}:</strong> {signal.description}
          </AlertDescription>
        </Alert>
      ))}

      {/* Thống kê theo lĩnh vực và cán bộ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-0 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Theo lĩnh vực</h3>
          <div className="space-y-3">
            {backlogSnapshot.theoLinhVuc.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium">{item.LinhVuc}</p>
                  <p className="text-sm text-muted-foreground">{item.QuaHan} quá hạn</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{item.SoLuong}</span>
                  <Badge className={item.QuaHan > 0 ? 'bg-red-500/10 text-red-700 border-0' : 'bg-green-500/10 text-green-700 border-0'}>
                    {item.QuaHan > 0 ? 'Có quá hạn' : 'Tốt'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Theo cán bộ xử lý</h3>
          <div className="space-y-3">
            {backlogSnapshot.theoCanBo.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-medium">{item.CanBo}</p>
                </div>
                <span className="text-2xl font-bold">{item.SoLuong}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4 border-0 shadow-lg">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm hồ sơ..."
              className="pl-10 h-11 bg-slate-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-11" onClick={handleFilter}>
            <Filter className="w-4 h-4 mr-2" />
            Lọc
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="p-6 border-0 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Chi tiết hồ sơ tồn đọng</h3>
          <Badge className="bg-primary/10 text-primary border-0">
            Tổng: {filteredData.length}
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold">Mã HS</th>
                <th className="text-left p-4 font-semibold">Loại hồ sơ</th>
                <th className="text-left p-4 font-semibold">Công dân</th>
                <th className="text-left p-4 font-semibold">Ngày nhận</th>
                <th className="text-left p-4 font-semibold">Hạn XL</th>
                <th className="text-right p-4 font-semibold">Số ngày</th>
                <th className="text-left p-4 font-semibold">Tình trạng</th>
                <th className="text-right p-4 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((hs, index) => (
                <tr key={index} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className="font-semibold text-primary">{hs.MaHoSo}</span>
                  </td>
                  <td className="p-4">
                    <p className="font-medium">{hs.TenNghiepVu}</p>
                    <p className="text-xs text-muted-foreground">{hs.TenLinhVuc}</p>
                  </td>
                  <td className="p-4">{hs.TenCongDan}</td>
                  <td className="p-4 text-sm">{hs.NgayNhan}</td>
                  <td className="p-4 text-sm">{hs.HanXuLy}</td>
                  <td className="p-4 text-right">
                    <span className={`font-semibold ${hs.MucDoQuaHan === 'Quá hạn' ? 'text-red-600' : 'text-amber-600'}`}>
                      {hs.SoNgayTonDong} ngày
                    </span>
                  </td>
                  <td className="p-4">{getMucDoQuaHanBadge(hs.MucDoQuaHan)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleView(hs)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Chi tiết hồ sơ tồn đọng</DialogTitle>
            <DialogDescription>
              {selectedItem?.MaHoSo}
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
                <h3 className="font-semibold">{selectedItem.TenNghiepVu}</h3>
                {getMucDoQuaHanBadge(selectedItem.MucDoQuaHan)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Công dân</p>
                  <p className="font-medium">{selectedItem.TenCongDan}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lĩnh vực</p>
                  <Badge variant="outline">{selectedItem.TenLinhVuc}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày nhận</p>
                  <p className="font-medium">{selectedItem.NgayNhan}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hạn xử lý</p>
                  <p className="font-medium">{selectedItem.HanXuLy}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số ngày tồn đọng</p>
                  <p className={`font-semibold ${selectedItem.MucDoQuaHan === 'Quá hạn' ? 'text-red-600' : 'text-amber-600'}`}>
                    {selectedItem.SoNgayTonDong} ngày
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cán bộ xử lý</p>
                  <p className="font-medium">{selectedItem.CanBoXuLy}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">Lý do tồn đọng</p>
                <p className="p-3 bg-amber-50 rounded-lg text-amber-800 mt-1">{selectedItem.LyDoTonDong}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
