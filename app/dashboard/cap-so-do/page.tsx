'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  FileCheck, Clock, CheckCircle2, TrendingUp, Search, Plus, Download,
  Eye, Edit, AlertTriangle, Calendar, User, FileText, ClipboardList, 
  XCircle, RotateCw, Send
} from 'lucide-react';
import {
  ALERT_PERIOD_LABELS,
  ALERT_RISK_LABELS,
  type AlertPeriod,
  type AlertRiskLevel,
  filterSignalsByCommonFilters,
  getRedBookAlerts,
} from '@/lib/frontend-dss';
import { thuaDatApi } from '@/lib/api';

// Mock data hồ sơ cấp sổ đỏ
interface HoSoCapSoDo {
  MaHoSo: string;
  ChuSoHuu: string;
  CCCD: string;
  SoDienThoai: string;
  DiaChiThuaDat: string;
  MaThua: string;
  SoTo: string;
  DienTich: number;
  LoaiDat: string;
  NgayNop: string;
  NgayHenTra: string;
  TrangThai: string;
  GiaiDoan: string;
  CanBoTiepNhan: string;
  CanBoThamDinh: string;
  SoSoDo: string;
  NgayCap: string;
  GhiChu: string;
  TienDo: number;
}

const mockCapSoDo: HoSoCapSoDo[] = [
  {
    MaHoSo: 'SD001',
    ChuSoHuu: 'Nguyễn Văn An',
    CCCD: '001234567890',
    SoDienThoai: '0901234567',
    DiaChiThuaDat: 'Thửa 123, Tờ 45, Khu phố 3',
    MaThua: '123',
    SoTo: '45',
    DienTich: 120.5,
    LoaiDat: 'Đất ở',
    NgayNop: '2025-01-05',
    NgayHenTra: '2025-01-25',
    TrangThai: 'Đã cấp',
    GiaiDoan: 'Hoàn thành',
    CanBoTiepNhan: 'Trần Văn Bình',
    CanBoThamDinh: 'Nguyễn Thị Lan',
    SoSoDo: 'AO 123456',
    NgayCap: '2025-01-20',
    GhiChu: '',
    TienDo: 100
  },
  {
    MaHoSo: 'SD002',
    ChuSoHuu: 'Trần Thị Bình',
    CCCD: '001234567891',
    SoDienThoai: '0902345678',
    DiaChiThuaDat: 'Thửa 456, Tờ 67, Khu phố 2',
    MaThua: '456',
    SoTo: '67',
    DienTich: 85.3,
    LoaiDat: 'Đất ở',
    NgayNop: '2025-01-10',
    NgayHenTra: '2025-01-30',
    TrangThai: 'Đang xử lý',
    GiaiDoan: 'Thẩm định thực địa',
    CanBoTiepNhan: 'Lê Văn Cường',
    CanBoThamDinh: 'Phạm Thị Dung',
    SoSoDo: '',
    NgayCap: '',
    GhiChu: 'Đang đo đạc thực địa',
    TienDo: 60
  },
  {
    MaHoSo: 'SD003',
    ChuSoHuu: 'Lê Văn Cường',
    CCCD: '001234567892',
    SoDienThoai: '0903456789',
    DiaChiThuaDat: 'Thửa 789, Tờ 89, Thôn 1',
    MaThua: '789',
    SoTo: '89',
    DienTich: 200.0,
    LoaiDat: 'Đất nông nghiệp',
    NgayNop: '2025-01-12',
    NgayHenTra: '2025-02-02',
    TrangThai: 'Chờ thẩm định',
    GiaiDoan: 'Tiếp nhận hồ sơ',
    CanBoTiepNhan: 'Trần Văn Bình',
    CanBoThamDinh: '',
    SoSoDo: '',
    NgayCap: '',
    GhiChu: 'Hồ sơ đầy đủ, chờ phân công',
    TienDo: 20
  },
  {
    MaHoSo: 'SD004',
    ChuSoHuu: 'Phạm Thị Dung',
    CCCD: '001234567893',
    SoDienThoai: '0904567890',
    DiaChiThuaDat: 'Thửa 234, Tờ 12, Khu phố 1',
    MaThua: '234',
    SoTo: '12',
    DienTich: 150.8,
    LoaiDat: 'Đất ở',
    NgayNop: '2025-01-08',
    NgayHenTra: '2025-01-28',
    TrangThai: 'Bổ sung hồ sơ',
    GiaiDoan: 'Yêu cầu bổ sung',
    CanBoTiepNhan: 'Nguyễn Thị Lan',
    CanBoThamDinh: 'Lê Văn Cường',
    SoSoDo: '',
    NgayCap: '',
    GhiChu: 'Thiếu giấy tờ chứng minh nguồn gốc đất',
    TienDo: 40
  },
  {
    MaHoSo: 'SD005',
    ChuSoHuu: 'Hoàng Văn Em',
    CCCD: '001234567894',
    SoDienThoai: '0905678901',
    DiaChiThuaDat: 'Thửa 567, Tờ 34, Khu phố 4',
    MaThua: '567',
    SoTo: '34',
    DienTich: 95.2,
    LoaiDat: 'Đất ở',
    NgayNop: '2025-01-06',
    NgayHenTra: '2025-01-26',
    TrangThai: 'Đang xử lý',
    GiaiDoan: 'Trình ký',
    CanBoTiepNhan: 'Trần Văn Bình',
    CanBoThamDinh: 'Nguyễn Thị Lan',
    SoSoDo: '',
    NgayCap: '',
    GhiChu: 'Đang chờ lãnh đạo ký duyệt',
    TienDo: 80
  },
  {
    MaHoSo: 'SD006',
    ChuSoHuu: 'Nguyễn Thị Phương',
    CCCD: '001234567895',
    SoDienThoai: '0906789012',
    DiaChiThuaDat: 'Thửa 890, Tờ 56, Thôn 2',
    MaThua: '890',
    SoTo: '56',
    DienTich: 300.0,
    LoaiDat: 'Đất nông nghiệp',
    NgayNop: '2025-01-03',
    NgayHenTra: '2025-01-23',
    TrangThai: 'Đã cấp',
    GiaiDoan: 'Hoàn thành',
    CanBoTiepNhan: 'Lê Văn Cường',
    CanBoThamDinh: 'Phạm Thị Dung',
    SoSoDo: 'AO 123457',
    NgayCap: '2025-01-18',
    GhiChu: '',
    TienDo: 100
  },
  {
    MaHoSo: 'SD007',
    ChuSoHuu: 'Lê Văn Giang',
    CCCD: '001234567896',
    SoDienThoai: '0907890123',
    DiaChiThuaDat: 'Thửa 345, Tờ 78, Khu phố 5',
    MaThua: '345',
    SoTo: '78',
    DienTich: 180.5,
    LoaiDat: 'Đất hỗn hợp',
    NgayNop: '2025-01-15',
    NgayHenTra: '2025-02-05',
    TrangThai: 'Từ chối',
    GiaiDoan: 'Kết thúc',
    CanBoTiepNhan: 'Nguyễn Thị Lan',
    CanBoThamDinh: 'Trần Văn Bình',
    SoSoDo: '',
    NgayCap: '',
    GhiChu: 'Đất không đủ điều kiện cấp sổ (đang tranh chấp)',
    TienDo: 0
  },
  {
    MaHoSo: 'SD008',
    ChuSoHuu: 'Trần Văn Hải',
    CCCD: '001234567897',
    SoDienThoai: '0908901234',
    DiaChiThuaDat: 'Thửa 678, Tờ 90, Khu phố 3',
    MaThua: '678',
    SoTo: '90',
    DienTich: 110.0,
    LoaiDat: 'Đất ở',
    NgayNop: '2025-01-18',
    NgayHenTra: '2025-02-08',
    TrangThai: 'Chờ thẩm định',
    GiaiDoan: 'Tiếp nhận hồ sơ',
    CanBoTiepNhan: 'Trần Văn Bình',
    CanBoThamDinh: '',
    SoSoDo: '',
    NgayCap: '',
    GhiChu: 'Hồ sơ mới tiếp nhận',
    TienDo: 10
  }
];

const trangThaiOptions = ['Chờ thẩm định', 'Đang xử lý', 'Bổ sung hồ sơ', 'Đã cấp', 'Từ chối'];
const giaiDoanOptions = ['Tiếp nhận hồ sơ', 'Thẩm định thực địa', 'Xét duyệt', 'Trình ký', 'In sổ', 'Hoàn thành', 'Yêu cầu bổ sung', 'Kết thúc'];
const loaiDatOptions = ['Đất ở', 'Đất nông nghiệp', 'Đất thương mại', 'Đất hỗn hợp'];

const emptyHoSoForm: HoSoCapSoDo = {
  MaHoSo: '',
  ChuSoHuu: '',
  CCCD: '',
  SoDienThoai: '',
  DiaChiThuaDat: '',
  MaThua: '',
  SoTo: '',
  DienTich: 0,
  LoaiDat: '',
  NgayNop: '',
  NgayHenTra: '',
  TrangThai: 'Chờ thẩm định',
  GiaiDoan: 'Tiếp nhận hồ sơ',
  CanBoTiepNhan: '',
  CanBoThamDinh: '',
  SoSoDo: '',
  NgayCap: '',
  GhiChu: '',
  TienDo: 0,
};

function toNumber(value: unknown): number {
  const num = Number(value ?? 0);
  return Number.isFinite(num) ? num : 0;
}

function toDateString(value: unknown): string {
  if (!value) return '';
  return String(value).slice(0, 10);
}

function mapFromApi(item: any): HoSoCapSoDo {
  return {
    MaHoSo: item.MaHoSo || '',
    ChuSoHuu: item.ChuSoHuu || '',
    CCCD: item.CCCD || '',
    SoDienThoai: item.SoDienThoai || '',
    DiaChiThuaDat: item.DiaChiThuaDat || '',
    MaThua: item.MaThua || '',
    SoTo: item.SoTo || item.SoToBanDo || '',
    DienTich: toNumber(item.DienTich),
    LoaiDat: item.LoaiDat || '',
    NgayNop: toDateString(item.NgayNop),
    NgayHenTra: toDateString(item.NgayHenTra),
    TrangThai: item.TrangThai || 'Chờ thẩm định',
    GiaiDoan: item.GiaiDoan || 'Tiếp nhận hồ sơ',
    CanBoTiepNhan: item.CanBoTiepNhan || '',
    CanBoThamDinh: item.CanBoThamDinh || '',
    SoSoDo: item.SoSoDo || '',
    NgayCap: toDateString(item.NgayCap),
    GhiChu: item.GhiChu || '',
    TienDo: toNumber(item.TienDo),
  };
}

export default function CapSoDoPage() {
  const [records, setRecords] = useState<HoSoCapSoDo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedHoSo, setSelectedHoSo] = useState<HoSoCapSoDo | null>(null);
  const [addForm, setAddForm] = useState<HoSoCapSoDo>(emptyHoSoForm);
  const [editForm, setEditForm] = useState<HoSoCapSoDo>(emptyHoSoForm);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState<AlertPeriod>('30d');
  const [filterRisk, setFilterRisk] = useState<AlertRiskLevel | 'all'>('all');

  const loadData = async () => {
    const result = await thuaDatApi.getList({ page: 1, limit: 5000, loaiBanGhi: 'CAP_SO_DO' });
    if (result.success && Array.isArray(result.data)) {
      setRecords(result.data.map(mapFromApi));
      return;
    }
    setRecords([]);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async () => {
    const payload = {
      LoaiBanGhi: 'CAP_SO_DO',
      MaThua: addForm.MaThua || '',
      SoThua: addForm.MaThua || '',
      SoToBanDo: addForm.SoTo || null,
      DienTich: toNumber(addForm.DienTich),
      ChuSoHuu: addForm.ChuSoHuu || null,
      TrangThai: addForm.TrangThai || 'Chờ thẩm định',
      MaHoSo: addForm.MaHoSo || null,
      SoTo: addForm.SoTo || null,
      LoaiDat: addForm.LoaiDat || null,
      CCCD: addForm.CCCD || null,
      DiaChiThuaDat: addForm.DiaChiThuaDat || null,
      SoDienThoai: addForm.SoDienThoai || null,
      NgayNop: addForm.NgayNop || null,
      NgayHenTra: addForm.NgayHenTra || null,
      GiaiDoan: addForm.GiaiDoan || null,
      CanBoTiepNhan: addForm.CanBoTiepNhan || null,
      CanBoThamDinh: addForm.CanBoThamDinh || null,
      SoSoDo: addForm.SoSoDo || null,
      NgayCap: addForm.NgayCap || null,
      TienDo: toNumber(addForm.TienDo),
      GhiChu: addForm.GhiChu || null,
    };

    const result = await thuaDatApi.create(payload);
    if (!result.success) {
      alert(result.message || 'Không thể tiếp nhận hồ sơ');
      return;
    }

    setIsAddOpen(false);
    setAddForm(emptyHoSoForm);
    await loadData();
  };

  const handleUpdate = async () => {
    if (!selectedHoSo?.MaThua) {
      alert('Không xác định được hồ sơ để cập nhật');
      return;
    }

    const payload = {
      MaHoSo: editForm.MaHoSo || null,
      SoToBanDo: editForm.SoTo || null,
      DienTich: toNumber(editForm.DienTich),
      ChuSoHuu: editForm.ChuSoHuu || null,
      TrangThai: editForm.TrangThai || 'Chờ thẩm định',
      SoTo: editForm.SoTo || null,
      LoaiDat: editForm.LoaiDat || null,
      CCCD: editForm.CCCD || null,
      DiaChiThuaDat: editForm.DiaChiThuaDat || null,
      SoDienThoai: editForm.SoDienThoai || null,
      NgayNop: editForm.NgayNop || null,
      NgayHenTra: editForm.NgayHenTra || null,
      GiaiDoan: editForm.GiaiDoan || null,
      CanBoTiepNhan: editForm.CanBoTiepNhan || null,
      CanBoThamDinh: editForm.CanBoThamDinh || null,
      SoSoDo: editForm.SoSoDo || null,
      NgayCap: editForm.NgayCap || null,
      TienDo: toNumber(editForm.TienDo),
      GhiChu: editForm.GhiChu || null,
    };

    const result = await thuaDatApi.update(selectedHoSo.MaThua, payload);
    if (!result.success) {
      alert(result.message || 'Không thể cập nhật hồ sơ');
      return;
    }

    setIsEditOpen(false);
    setSelectedHoSo(null);
    setEditForm(emptyHoSoForm);
    await loadData();
  };

  const filteredData = records.filter((item) => {
    const matchesSearch =
      item.MaHoSo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ChuSoHuu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.CCCD.includes(searchQuery) ||
      item.DiaChiThuaDat.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.TrangThai === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: records.length,
    choThamDinh: records.filter(r => r.TrangThai === 'Chờ thẩm định').length,
    dangXuLy: records.filter(r => r.TrangThai === 'Đang xử lý').length,
    boSungHS: records.filter(r => r.TrangThai === 'Bổ sung hồ sơ').length,
    daCap: records.filter(r => r.TrangThai === 'Đã cấp').length,
    tuChoi: records.filter(r => r.TrangThai === 'Từ chối').length,
    tyLeHoanThanh: records.length > 0
      ? ((records.filter(r => r.TrangThai === 'Đã cấp').length / records.length) * 100).toFixed(1)
      : '0.0'
  };

  const redBookSignals = filterSignalsByCommonFilters(getRedBookAlerts(stats.boSungHS), {
    period: filterPeriod,
    risk: filterRisk,
  });

  const getTrangThaiBadge = (trangThai: string) => {
    switch (trangThai) {
      case 'Đã cấp': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Đang xử lý': return <Badge className="bg-blue-500 hover:bg-blue-600"><RotateCw className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Chờ thẩm định': return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Bổ sung hồ sơ': return <Badge className="bg-orange-500 hover:bg-orange-600"><AlertTriangle className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Từ chối': return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      default: return <Badge variant="secondary">{trangThai}</Badge>;
    }
  };

  const getTienDoColor = (tienDo: number) => {
    if (tienDo === 100) return 'bg-green-500';
    if (tienDo >= 60) return 'bg-blue-500';
    if (tienDo >= 30) return 'bg-amber-500';
    return 'bg-gray-400';
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-status-danger to-primary rounded-lg p-4 sm:p-5 xl:p-6 text-white">
        <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <FileCheck className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Quản lý Cấp Sổ đỏ</h1>
              <p className="text-rose-100">Theo dõi tiến độ cấp giấy chứng nhận quyền sử dụng đất</p>
            </div>
          </div>
          <Dialog
            open={isAddOpen}
            onOpenChange={(open) => {
              setIsAddOpen(open);
              if (open) setAddForm(emptyHoSoForm);
            }}
          >
            <DialogTrigger asChild>
              <Button className="w-full 2xl:w-auto bg-white text-rose-600 hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />
                Tiếp nhận hồ sơ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tiếp nhận hồ sơ cấp sổ đỏ mới</DialogTitle>
                <DialogDescription>Nhập thông tin hồ sơ đề nghị cấp giấy chứng nhận</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Chủ sở hữu *</Label>
                  <Input placeholder="Nhập họ tên chủ sở hữu" value={addForm.ChuSoHuu} onChange={(e) => setAddForm((prev) => ({ ...prev, ChuSoHuu: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>CCCD *</Label>
                  <Input placeholder="Nhập số CCCD" value={addForm.CCCD} onChange={(e) => setAddForm((prev) => ({ ...prev, CCCD: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Số điện thoại</Label>
                  <Input placeholder="Nhập số điện thoại" value={addForm.SoDienThoai} onChange={(e) => setAddForm((prev) => ({ ...prev, SoDienThoai: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Loại đất *</Label>
                  <Select value={addForm.LoaiDat || undefined} onValueChange={(value) => setAddForm((prev) => ({ ...prev, LoaiDat: value }))}>
                    <SelectTrigger><SelectValue placeholder="Chọn loại đất" /></SelectTrigger>
                    <SelectContent>
                      {loaiDatOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Mã thửa *</Label>
                  <Input placeholder="Nhập mã thửa" value={addForm.MaThua} onChange={(e) => setAddForm((prev) => ({ ...prev, MaThua: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Số tờ *</Label>
                  <Input placeholder="Nhập số tờ" value={addForm.SoTo} onChange={(e) => setAddForm((prev) => ({ ...prev, SoTo: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Diện tích (m²) *</Label>
                  <Input type="number" placeholder="Nhập diện tích" value={addForm.DienTich} onChange={(e) => setAddForm((prev) => ({ ...prev, DienTich: toNumber(e.target.value) }))} />
                </div>
                <div className="space-y-2">
                  <Label>Ngày hẹn trả</Label>
                  <Input type="date" value={addForm.NgayHenTra} onChange={(e) => setAddForm((prev) => ({ ...prev, NgayHenTra: e.target.value }))} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Địa chỉ thửa đất *</Label>
                  <Input placeholder="Nhập địa chỉ chi tiết" value={addForm.DiaChiThuaDat} onChange={(e) => setAddForm((prev) => ({ ...prev, DiaChiThuaDat: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Cán bộ tiếp nhận</Label>
                  <Input placeholder="Tên cán bộ" value={addForm.CanBoTiepNhan} onChange={(e) => setAddForm((prev) => ({ ...prev, CanBoTiepNhan: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <Select value={addForm.TrangThai} onValueChange={(value) => setAddForm((prev) => ({ ...prev, TrangThai: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {trangThaiOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Ghi chú</Label>
                  <Textarea placeholder="Nhập ghi chú" value={addForm.GhiChu} onChange={(e) => setAddForm((prev) => ({ ...prev, GhiChu: e.target.value }))} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Hủy</Button>
                <Button onClick={handleCreate}>Tiếp nhận</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
        <Card className="border-l-4 border-l-gray-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng hồ sơ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Chờ thẩm định</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold">{stats.choThamDinh}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đang xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <RotateCw className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{stats.dangXuLy}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bổ sung HS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span className="text-2xl font-bold">{stats.boSungHS}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đã cấp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{stats.daCap}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Từ chối</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold">{stats.tuChoi}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tỷ lệ HT</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              <span className="text-2xl font-bold">{stats.tyLeHoanThanh}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo mã, chủ sở hữu, CCCD, địa chỉ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {trangThaiOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Xuất Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách hồ sơ cấp sổ đỏ</CardTitle>
          <CardDescription>Tìm thấy {filteredData.length} hồ sơ</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã hồ sơ</TableHead>
                <TableHead>Chủ sở hữu</TableHead>
                <TableHead>Thửa/Tờ</TableHead>
                <TableHead className="text-right">DT (m²)</TableHead>
                <TableHead>Ngày nộp</TableHead>
                <TableHead>Hẹn trả</TableHead>
                <TableHead>Giai đoạn</TableHead>
                <TableHead>Tiến độ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.MaHoSo}>
                  <TableCell className="font-medium text-primary">{item.MaHoSo}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{item.ChuSoHuu}</div>
                        <div className="text-xs text-muted-foreground">{item.SoDienThoai}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Thửa: {item.MaThua}</div>
                      <div className="text-muted-foreground">Tờ: {item.SoTo}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">{item.DienTich}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {item.NgayNop}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3" />
                      {item.NgayHenTra}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.GiaiDoan}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={item.TienDo} className={`w-16 h-2 [&>div]:${getTienDoColor(item.TienDo)}`} />
                      <span className="text-xs text-muted-foreground">{item.TienDo}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getTrangThaiBadge(item.TrangThai)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {/* View Dialog */}
                      <Dialog open={isViewOpen && selectedHoSo?.MaHoSo === item.MaHoSo} onOpenChange={(open) => { setIsViewOpen(open); if (!open) setSelectedHoSo(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedHoSo(item); setIsViewOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Chi tiết hồ sơ cấp sổ đỏ</DialogTitle>
                            <DialogDescription>Mã hồ sơ: {item.MaHoSo}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Chủ sở hữu</p>
                              <p className="font-medium">{item.ChuSoHuu}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">CCCD</p>
                              <p className="font-medium">{item.CCCD}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Số điện thoại</p>
                              <p className="font-medium">{item.SoDienThoai}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Loại đất</p>
                              <p className="font-medium">{item.LoaiDat}</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Địa chỉ thửa đất</p>
                              <p className="font-medium">{item.DiaChiThuaDat}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Mã thửa / Số tờ</p>
                              <p className="font-medium">{item.MaThua} / {item.SoTo}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Diện tích</p>
                              <p className="font-medium">{item.DienTich} m²</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Ngày nộp</p>
                              <p className="font-medium">{item.NgayNop}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Ngày hẹn trả</p>
                              <p className="font-medium">{item.NgayHenTra}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Cán bộ tiếp nhận</p>
                              <p className="font-medium">{item.CanBoTiepNhan}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Cán bộ thẩm định</p>
                              <p className="font-medium">{item.CanBoThamDinh || '-'}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Giai đoạn</p>
                              <Badge variant="outline">{item.GiaiDoan}</Badge>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Trạng thái</p>
                              {getTrangThaiBadge(item.TrangThai)}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Tiến độ</p>
                              <div className="flex items-center gap-2">
                                <Progress value={item.TienDo} className="flex-1" />
                                <span className="font-medium">{item.TienDo}%</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Số sổ đỏ</p>
                              <p className="font-medium">{item.SoSoDo || 'Chưa cấp'}</p>
                            </div>
                            {item.NgayCap && (
                              <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Ngày cấp</p>
                                <p className="font-medium">{item.NgayCap}</p>
                              </div>
                            )}
                            {item.GhiChu && (
                              <div className="space-y-1 col-span-2">
                                <p className="text-sm text-muted-foreground">Ghi chú</p>
                                <p className="font-medium">{item.GhiChu}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Edit Dialog */}
                      <Dialog open={isEditOpen && selectedHoSo?.MaHoSo === item.MaHoSo} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setSelectedHoSo(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedHoSo(item); setEditForm({ ...item }); setIsEditOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Cập nhật hồ sơ</DialogTitle>
                            <DialogDescription>Mã hồ sơ: {item.MaHoSo}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin chủ sở hữu</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label>Chủ sở hữu</Label>
                                  <Input value={editForm.ChuSoHuu} onChange={(e) => setEditForm((prev) => ({ ...prev, ChuSoHuu: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>CCCD</Label>
                                  <Input value={editForm.CCCD} onChange={(e) => setEditForm((prev) => ({ ...prev, CCCD: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Số điện thoại</Label>
                                  <Input value={editForm.SoDienThoai} onChange={(e) => setEditForm((prev) => ({ ...prev, SoDienThoai: e.target.value }))} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin thửa đất</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                  <Label>Địa chỉ thửa đất</Label>
                                  <Input value={editForm.DiaChiThuaDat} onChange={(e) => setEditForm((prev) => ({ ...prev, DiaChiThuaDat: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Mã thửa</Label>
                                  <Input value={editForm.MaThua} onChange={(e) => setEditForm((prev) => ({ ...prev, MaThua: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Số tờ</Label>
                                  <Input value={editForm.SoTo} onChange={(e) => setEditForm((prev) => ({ ...prev, SoTo: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Diện tích (m²)</Label>
                                  <Input type="number" value={editForm.DienTich} onChange={(e) => setEditForm((prev) => ({ ...prev, DienTich: toNumber(e.target.value) }))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Loại đất</Label>
                                  <Input value={editForm.LoaiDat} onChange={(e) => setEditForm((prev) => ({ ...prev, LoaiDat: e.target.value }))} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-amber-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Xử lý hồ sơ</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Ngày nộp</Label>
                                  <Input type="date" value={editForm.NgayNop} onChange={(e) => setEditForm((prev) => ({ ...prev, NgayNop: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Ngày hẹn trả</Label>
                                  <Input type="date" value={editForm.NgayHenTra} onChange={(e) => setEditForm((prev) => ({ ...prev, NgayHenTra: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Cán bộ tiếp nhận</Label>
                                  <Input value={editForm.CanBoTiepNhan} onChange={(e) => setEditForm((prev) => ({ ...prev, CanBoTiepNhan: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Cán bộ thẩm định</Label>
                                  <Input value={editForm.CanBoThamDinh} onChange={(e) => setEditForm((prev) => ({ ...prev, CanBoThamDinh: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Giai đoạn xử lý</Label>
                                  <Select value={editForm.GiaiDoan} onValueChange={(value) => setEditForm((prev) => ({ ...prev, GiaiDoan: value }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {giaiDoanOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Trạng thái</Label>
                                  <Select value={editForm.TrangThai} onValueChange={(value) => setEditForm((prev) => ({ ...prev, TrangThai: value }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {trangThaiOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Tiến độ (%)</Label>
                                  <Input type="number" min="0" max="100" value={editForm.TienDo} onChange={(e) => setEditForm((prev) => ({ ...prev, TienDo: toNumber(e.target.value) }))} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin cấp sổ</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Số sổ đỏ</Label>
                                  <Input value={editForm.SoSoDo} onChange={(e) => setEditForm((prev) => ({ ...prev, SoSoDo: e.target.value }))} placeholder="Nhập khi đã cấp" />
                                </div>
                                <div className="space-y-2">
                                  <Label>Ngày cấp</Label>
                                  <Input type="date" value={editForm.NgayCap} onChange={(e) => setEditForm((prev) => ({ ...prev, NgayCap: e.target.value }))} />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Ghi chú</Label>
                              <Textarea value={editForm.GhiChu} onChange={(e) => setEditForm((prev) => ({ ...prev, GhiChu: e.target.value }))} />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Hủy</Button>
                            <Button onClick={handleUpdate}>Cập nhật</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Cảnh báo hồ sơ cần bổ sung */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-3">
            <Select value={filterPeriod} onValueChange={(v) => setFilterPeriod(v as AlertPeriod)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Thời gian" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ALERT_PERIOD_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
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
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {redBookSignals.map((signal) => (
        <Card
          key={signal.id}
          className={
            signal.level === 'critical'
              ? 'border-l-4 border-l-red-500'
              : signal.level === 'warning'
                ? 'border-l-4 border-l-orange-500'
                : 'border-l-4 border-l-blue-500'
          }
        >
          <CardHeader>
            <CardTitle
              className={
                signal.level === 'critical'
                  ? 'flex items-center gap-2 text-red-600'
                  : signal.level === 'warning'
                    ? 'flex items-center gap-2 text-orange-600'
                    : 'flex items-center gap-2 text-blue-600'
              }
            >
              <AlertTriangle className="h-5 w-5" />
              {signal.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{signal.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
