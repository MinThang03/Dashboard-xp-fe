'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Download,
  Search,
  Filter,
  AlertCircle,
  DollarSign,
} from 'lucide-react';
import { baoCaoApi, hoSoTthcApi, nganSachApi, vanBanApi } from '@/lib/api';
import { APPROVAL_CASES, ApprovalCase, FIELD_STATISTICS } from '@/lib/leader-data';

type ApprovalSource = 'hoSoTthc' | 'vanBan' | 'baoCao' | 'nganSach' | 'mock';

type ApprovalCaseItem = ApprovalCase & {
  source: ApprovalSource;
  sourceId: number | string;
};

const FIELD_CODE_BY_MA_LINH_VUC: Record<number, string> = {
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

const FALLBACK_CASES: ApprovalCaseItem[] = APPROVAL_CASES.map((item) => ({
  ...item,
  source: 'mock',
  sourceId: item.id,
}));

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

function unwrapList(result: any): any[] {
  if (!result) return [];
  if (typeof result.success === 'boolean') {
    if (!result.success) return [];
    return Array.isArray(result.data) ? result.data : [];
  }
  if (Array.isArray(result.data)) return result.data;
  return Array.isArray(result) ? result : [];
}

function toNumber(value: unknown): number | null {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function toText(value: unknown, fallback: string): string {
  const text = String(value ?? '').trim();
  return text || fallback;
}

function toDateString(value: unknown): string {
  if (!value) return '';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

function pickDate(...values: unknown[]): string {
  for (const value of values) {
    const date = toDateString(value);
    if (date) return date;
  }
  return '';
}

function mapApprovalStatus(value?: string | null): ApprovalCase['status'] {
  const normalized = normalizeAscii(String(value || '')).trim();
  if (!normalized) return 'pending';
  if (normalized.includes('tu choi') || normalized.includes('khong duyet')) return 'rejected';
  if (normalized.includes('da duyet') || normalized.includes('hoan thanh') || normalized.includes('da xu ly')) {
    return 'approved';
  }
  if (normalized.includes('dang') || normalized.includes('xu ly') || normalized.includes('tham dinh')) {
    return 'reviewing';
  }
  if (normalized.includes('cho') || normalized.includes('tiep nhan') || normalized.includes('moi')) {
    return 'pending';
  }
  return 'pending';
}

function daysUntil(dateStr: string): number | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  const now = new Date();
  const start = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const end = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.ceil((end - start) / (24 * 3600 * 1000));
}

function derivePriority(dueDate: string, status: ApprovalCase['status']): ApprovalCase['priority'] {
  if (status === 'approved' || status === 'rejected') return 'low';
  const days = daysUntil(dueDate);
  if (days === null) return 'medium';
  if (days < 0) return 'critical';
  if (days <= 3) return 'high';
  if (days <= 7) return 'medium';
  return 'low';
}

export function ApprovalsManagementPage() {
  const [cases, setCases] = useState<ApprovalCaseItem[]>(FALLBACK_CASES);
  const [selectedCase, setSelectedCase] = useState<ApprovalCaseItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);
  const fieldByCode = useMemo(() => {
    return new Map(FIELD_STATISTICS.map((field) => [field.code, field.name]));
  }, []);

  useEffect(() => {
    let active = true;

    const loadCases = async () => {
      try {
        const [hoSoRes, vanBanRes, baoCaoRes, nganSachRes] = await Promise.all([
          hoSoTthcApi.getList({ page: 1, limit: 500 }),
          vanBanApi.getList({ page: 1, limit: 500 }),
          baoCaoApi.getList({ page: 1, limit: 500 }),
          nganSachApi.getList({ page: 1, limit: 500, loaiBanGhi: 'BAO_CAO_TAI_CHINH' }),
        ]);

        if (!active) return;

        const hoSoRows = unwrapList(hoSoRes);
        const vanBanRows = unwrapList(vanBanRes);
        const baoCaoRows = unwrapList(baoCaoRes);
        const nganSachRows = unwrapList(nganSachRes);

        const hoSoCases = hoSoRows.map((row: any, index: number) => {
          const fieldCode =
            FIELD_CODE_BY_MA_LINH_VUC[toNumber(row.MaLinhVuc) ?? 0] ||
            mapFieldCodeFromText(row.LinhVuc || row.TenThuTuc || row.TenHoSo) ||
            'TU_PHAP';
          const fieldName = fieldByCode.get(fieldCode) || 'Tong hop';
          const status = mapApprovalStatus(row.TrangThai);
          const submittedDate = pickDate(row.NgayNop, row.NgayTao, row.createdAt) || '-';
          const dueDate = pickDate(row.NgayHenTra, row.HanXuLy) || '-';
          const baseId = 100000;
          const id = baseId + (toNumber(row.MaHoSo) ?? index);

          return {
            id,
            caseNumber: toText(row.MaHoSo || row.SoHoSo || row.SoBienNhan, `HS-${index + 1}`),
            title: toText(row.TenHoSo || row.TenThuTuc || row.TenThuTucHanhChinh, 'Ho so TTHC'),
            fieldCode,
            fieldName,
            department: toText(row.DonViTiepNhan || row.PhongBan || row.DonViXuLy, fieldName),
            submittedBy: toText(
              row.NguoiNop || row.HoTenNguoiNop || row.NguoiNopText || row.NguoiLapText,
              'Cong dan',
            ),
            submittedDate,
            dueDate,
            priority: derivePriority(dueDate, status),
            type: toText(row.LinhVuc || row.TenThuTuc, 'Ho so TTHC'),
            status,
            documents: [],
            source: 'hoSoTthc',
            sourceId: row.MaHoSo || row.SoHoSo || id,
          } as ApprovalCaseItem;
        });

        const vanBanCases = vanBanRows.map((row: any, index: number) => {
          const fieldCode =
            FIELD_CODE_BY_MA_LINH_VUC[toNumber(row.MaLinhVuc) ?? 0] ||
            mapFieldCodeFromText(row.LoaiVanBan || row.LinhVuc || row.TenVanBan) ||
            'TU_PHAP';
          const fieldName = fieldByCode.get(fieldCode) || 'Tong hop';
          const status = mapApprovalStatus(row.TrangThai);
          const submittedDate = pickDate(row.NgayBanHanh, row.NgayTao) || '-';
          const dueDate = pickDate(row.NgayCoHieuLuc, row.NgayHetHieuLuc) || '-';
          const baseId = 200000;
          const id = baseId + (toNumber(row.MaVanBan) ?? index);
          const fileName = toText(row.FileDinhKem, 'tai-lieu-dinh-kem.pdf');
          const documents = row.FileDinhKem ? [{ name: fileName, size: '1.0 MB' }] : [];

          return {
            id,
            caseNumber: toText(row.SoVanBan || row.SoKyHieu || row.MaVanBan, `VB-${index + 1}`),
            title: toText(row.TenVanBan || row.TrichYeu || row.SoVanBan, 'Van ban'),
            fieldCode,
            fieldName,
            department: toText(row.CoQuanBanHanh || row.PhongBan, fieldName),
            submittedBy: toText(row.NguoiSoan || row.NguoiTao || row.CoQuanBanHanh, 'Van thu'),
            submittedDate,
            dueDate,
            priority: derivePriority(dueDate, status),
            type: toText(row.LoaiVanBan || row.LinhVuc, 'Van ban'),
            status,
            documents,
            source: 'vanBan',
            sourceId: row.MaVanBan || id,
          } as ApprovalCaseItem;
        });

        const baoCaoCases = baoCaoRows.map((row: any, index: number) => {
          const fieldCode =
            FIELD_CODE_BY_MA_LINH_VUC[toNumber(row.MaLinhVuc) ?? 0] ||
            mapFieldCodeFromText(row.LinhVuc || row.TieuDe) ||
            'TU_PHAP';
          const fieldName = fieldByCode.get(fieldCode) || 'Tong hop';
          const status = mapApprovalStatus(row.TrangThai);
          const submittedDate = pickDate(row.NgayLap, row.NgayTao, row.NgayNop) || '-';
          const dueDate = pickDate(row.NgayNop, row.NgayLap) || '-';
          const baseId = 300000;
          const id = baseId + (toNumber(row.MaBaoCao) ?? index);
          const amount = toNumber(row.TongKinhPhi || row.TongDuToan || row.KinhPhi);

          return {
            id,
            caseNumber: toText(row.MaBaoCao, `BC-${index + 1}`),
            title: toText(row.TieuDe || row.TenBaoCao, 'Bao cao'),
            fieldCode,
            fieldName,
            department: toText(row.PhongBan || row.DonViLap, fieldName),
            submittedBy: toText(row.NguoiLapText || row.NguoiLap || row.NguoiTao, 'He thong'),
            submittedDate,
            dueDate,
            priority: derivePriority(dueDate, status),
            type: toText(row.LoaiBaoCao, 'Bao cao'),
            status,
            documents: [],
            amount: amount ?? undefined,
            source: 'baoCao',
            sourceId: row.MaBaoCao || id,
          } as ApprovalCaseItem;
        });

        const nganSachCases = nganSachRows.map((row: any, index: number) => {
          const fieldCode =
            FIELD_CODE_BY_MA_LINH_VUC[toNumber(row.MaLinhVuc) ?? 0] ||
            mapFieldCodeFromText(row.LinhVuc || row.TenKhoanMuc) ||
            'TAI_CHINH';
          const fieldName = fieldByCode.get(fieldCode) || 'Tong hop';
          const status = mapApprovalStatus(row.TrangThai);
          const submittedDate = pickDate(row.NgayCapNhat, row.NgayTao) || '-';
          const dueDate = pickDate(row.NgayCapNhat, row.NgayTao) || '-';
          const baseId = 400000;
          const id = baseId + (toNumber(row.MaNganSach) ?? index);
          const amount = toNumber(row.TongDuToan || row.SoTien || row.DaGiaiNgan);

          return {
            id,
            caseNumber: toText(row.MaNganSach, `TC-${index + 1}`),
            title: toText(row.TenKhoanMuc || row.MoTa, 'Bao cao tai chinh'),
            fieldCode,
            fieldName,
            department: toText(row.PhongBan || row.DonVi, fieldName),
            submittedBy: toText(row.NguoiTao || row.NguoiLap, 'Ke toan'),
            submittedDate,
            dueDate,
            priority: derivePriority(dueDate, status),
            type: toText(row.LoaiBanGhi || row.LoaiBaoCao, 'Bao cao tai chinh'),
            status,
            documents: [],
            amount: amount ?? undefined,
            source: 'nganSach',
            sourceId: row.MaNganSach || id,
          } as ApprovalCaseItem;
        });

        const mapped = [...hoSoCases, ...vanBanCases, ...baoCaoCases, ...nganSachCases];
        setCases(mapped.length ? mapped : FALLBACK_CASES);
      } catch {
        if (active) setCases(FALLBACK_CASES);
      }
    };

    loadCases();
    return () => {
      active = false;
    };
  }, [fieldByCode]);

  useEffect(() => {
    if (!selectedCase) return;
    const updated = cases.find(
      (item) => item.id === selectedCase.id && item.source === selectedCase.source,
    );
    if (updated) {
      setSelectedCase(updated);
    } else {
      setSelectedCase(null);
    }
  }, [cases, selectedCase?.id, selectedCase?.source]);

  // Filter cases
  const filteredCases = cases.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchPriority = filterPriority === 'all' || c.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  // Statistics
  const stats = {
    total: cases.length,
    pending: cases.filter((c) => c.status === 'pending').length,
    reviewing: cases.filter((c) => c.status === 'reviewing').length,
    approved: cases.filter((c) => c.status === 'approved').length,
    rejected: cases.filter((c) => c.status === 'rejected').length,
    critical: cases.filter((c) => c.priority === 'critical' && c.status === 'pending').length,
  };

  const handleApproval = (action: 'approve' | 'reject') => {
    setApprovalAction(action);
    setShowApprovalDialog(true);
  };

  const updateApprovalStatus = async (
    target: ApprovalCaseItem,
    action: 'approve' | 'reject',
  ) => {
    if (target.source === 'mock') return;

    const isApprove = action === 'approve';

    try {
      if (target.source === 'hoSoTthc') {
        const id = String(target.sourceId || '');
        if (!id) return;
        await hoSoTthcApi.update(id, { TrangThai: isApprove ? 'Hoàn thành' : 'Từ chối' });
      }

      if (target.source === 'vanBan') {
        const id = toNumber(target.sourceId);
        if (!id) return;
        await vanBanApi.update(id, { TrangThai: isApprove ? 'Đã xử lý' : 'Từ chối' });
      }

      if (target.source === 'baoCao') {
        const id = toNumber(target.sourceId);
        if (!id) return;
        await baoCaoApi.update(id, { TrangThai: isApprove ? 'Đã duyệt' : 'Từ chối' });
      }

      if (target.source === 'nganSach') {
        const id = toNumber(target.sourceId);
        if (!id) return;
        await nganSachApi.update(id, { TrangThai: isApprove ? 'Đã duyệt' : 'Từ chối' });
      }
    } catch (error) {
      console.warn('Khong the cap nhat trang thai phe duyet', error);
    }
  };

  const confirmApproval = async () => {
    if (!selectedCase || !approvalAction) return;

    const nextStatus = approvalAction === 'approve' ? 'approved' : 'rejected';
    const target = selectedCase;

    setCases((prev) =>
      prev.map((item) => (item.id === target.id ? { ...item, status: nextStatus } : item)),
    );
    setShowApprovalDialog(false);
    setSelectedCase(null);
    setApprovalAction(null);

    await updateApprovalStatus(target, approvalAction);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4 px-4 py-4 sm:space-y-5 sm:px-5 lg:space-y-6 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Phê duyệt & Ký số</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý và phê duyệt các hồ sơ, văn bản cần quyết định
          </p>
        </div>
        <div className="flex w-full flex-wrap gap-2 xl:w-auto xl:flex-nowrap">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Lọc nâng cao
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Xuất danh sách
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Tổng số hồ sơ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Chờ phê duyệt</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Đang xem xét</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{stats.reviewing}</div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Đã phê duyệt</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Từ chối</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{stats.rejected}</div>
          </CardContent>
        </Card>
        <Card className="border-red-300 bg-red-100">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Khẩn cấp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{stats.critical}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Tìm kiếm theo số hồ sơ, tiêu đề, phòng ban..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full xl:w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="pending">Chờ phê duyệt</SelectItem>
            <SelectItem value="reviewing">Đang xem xét</SelectItem>
            <SelectItem value="approved">Đã phê duyệt</SelectItem>
            <SelectItem value="rejected">Từ chối</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-full xl:w-[180px]">
            <SelectValue placeholder="Độ ưu tiên" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả mức độ</SelectItem>
            <SelectItem value="critical">Khẩn cấp</SelectItem>
            <SelectItem value="high">Cao</SelectItem>
            <SelectItem value="medium">Trung bình</SelectItem>
            <SelectItem value="low">Thấp</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cases List */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Chờ phê duyệt ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value="reviewing">
            Đang xem xét ({stats.reviewing})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Đã phê duyệt ({stats.approved})
          </TabsTrigger>
          <TabsTrigger value="all">Tất cả ({stats.total})</TabsTrigger>
        </TabsList>

        {(['pending', 'reviewing', 'approved', 'all'] as const).map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <div className="grid gap-4">
              {filteredCases
                .filter((c) => tab === 'all' || c.status === tab)
                .map((caseItem) => (
                  <Card
                    key={caseItem.id}
                    className={`cursor-pointer hover:shadow-md transition-all ${
                      caseItem.priority === 'critical' ? 'border-red-300' : ''
                    }`}
                    onClick={() => setSelectedCase(caseItem)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(caseItem.priority)}>
                              {caseItem.priority === 'critical' && 'Khẩn cấp'}
                              {caseItem.priority === 'high' && 'Cao'}
                              {caseItem.priority === 'medium' && 'Trung bình'}
                              {caseItem.priority === 'low' && 'Thấp'}
                            </Badge>
                            <Badge className={getStatusColor(caseItem.status)}>
                              {caseItem.status === 'pending' && 'Chờ phê duyệt'}
                              {caseItem.status === 'reviewing' && 'Đang xem xét'}
                              {caseItem.status === 'approved' && 'Đã phê duyệt'}
                              {caseItem.status === 'rejected' && 'Từ chối'}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {caseItem.caseNumber}
                            </span>
                          </div>
                          <CardTitle className="text-lg">{caseItem.title}</CardTitle>
                          <CardDescription>{caseItem.type}</CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{caseItem.fieldName}</div>
                          <div className="text-xs text-muted-foreground">{caseItem.department}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-6 text-sm">
                          <div>
                            <span className="text-muted-foreground">Người nộp:</span>
                            <span className="ml-2 font-medium">{caseItem.submittedBy}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Ngày nộp:</span>
                            <span className="ml-2 font-medium">{caseItem.submittedDate}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Hạn xử lý:</span>
                            <span className="ml-2 font-medium text-amber-600">
                              {caseItem.dueDate}
                            </span>
                          </div>
                          {caseItem.amount && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="font-medium text-green-600">
                                {(caseItem.amount / 1000000).toFixed(1)} triệu
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <FileText className="w-4 h-4 mr-2" />
                            Xem chi tiết
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Case Detail Dialog */}
      {selectedCase && (
        <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <DialogTitle className="text-2xl">{selectedCase.title}</DialogTitle>
                  <DialogDescription className="space-x-2">
                    <Badge className={getPriorityColor(selectedCase.priority)}>
                      {selectedCase.priority === 'critical' && 'Khẩn cấp'}
                      {selectedCase.priority === 'high' && 'Cao'}
                      {selectedCase.priority === 'medium' && 'Trung bình'}
                      {selectedCase.priority === 'low' && 'Thấp'}
                    </Badge>
                    <Badge className={getStatusColor(selectedCase.status)}>
                      {selectedCase.status === 'pending' && 'Chờ phê duyệt'}
                      {selectedCase.status === 'reviewing' && 'Đang xem xét'}
                      {selectedCase.status === 'approved' && 'Đã phê duyệt'}
                      {selectedCase.status === 'rejected' && 'Từ chối'}
                    </Badge>
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Case Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Số hồ sơ</label>
                  <div className="mt-1 font-semibold">{selectedCase.caseNumber}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Loại hồ sơ</label>
                  <div className="mt-1 font-semibold">{selectedCase.type}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Lĩnh vực</label>
                  <div className="mt-1 font-semibold">{selectedCase.fieldName}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phòng ban</label>
                  <div className="mt-1 font-semibold">{selectedCase.department}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Người nộp</label>
                  <div className="mt-1 font-semibold">{selectedCase.submittedBy}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ngày nộp</label>
                  <div className="mt-1 font-semibold">{selectedCase.submittedDate}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Hạn xử lý</label>
                  <div className="mt-1 font-semibold text-amber-600">{selectedCase.dueDate}</div>
                </div>
                {selectedCase.amount && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Số tiền</label>
                    <div className="mt-1 font-semibold text-green-600">
                      {selectedCase.amount.toLocaleString('vi-VN')} VNĐ
                    </div>
                  </div>
                )}
              </div>

              {/* Documents */}
              <div>
                <label className="text-sm font-medium">Tài liệu đính kèm</label>
                <div className="mt-2 space-y-2">
                  {selectedCase.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium">{doc.name}</div>
                          <div className="text-xs text-muted-foreground">{doc.size}</div>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              {selectedCase.status === 'pending' || selectedCase.status === 'reviewing' ? (
                <div className="flex gap-2 w-full justify-end">
                  <Button variant="outline" onClick={() => setSelectedCase(null)}>
                    Đóng
                  </Button>
                  <Button variant="destructive" onClick={() => handleApproval('reject')}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Từ chối
                  </Button>
                  <Button onClick={() => handleApproval('approve')}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Phê duyệt
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setSelectedCase(null)}>
                  Đóng
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Approval Confirmation Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalAction === 'approve' ? 'Xác nhận phê duyệt' : 'Xác nhận từ chối'}
            </DialogTitle>
            <DialogDescription>
              {approvalAction === 'approve'
                ? 'Bạn có chắc chắn muốn phê duyệt hồ sơ này?'
                : 'Bạn có chắc chắn muốn từ chối hồ sơ này?'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Hủy
            </Button>
            <Button
              variant={approvalAction === 'approve' ? 'default' : 'destructive'}
              onClick={confirmApproval}
            >
              {approvalAction === 'approve' ? 'Phê duyệt' : 'Từ chối'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
