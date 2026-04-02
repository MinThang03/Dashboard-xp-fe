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
import { 
  Map, MapPin, CheckCircle2, Clock, Search, Plus, Download, Eye, Edit,
  User, Calendar, AlertTriangle, FileCheck, Camera, Ruler
} from 'lucide-react';
import { bienDongDatApi } from '@/lib/api';
import { FunctionStyledPanel } from '@/components/charts/function-styled-panel';

// Mock data thẩm định thực địa
interface ThamDinhThucDia {
  MaBienDongId?: number;
  MaThamDinh: string;
  MaHoSo: string;
  DiaChi: string;
  MaThua: string;
  SoTo: string;
  LoaiThamDinh: string;
  NgayThamDinh: string;
  CanBoThamDinh: string;
  DonViThamDinh: string;
  DienTichHoSo: number;
  DienTichThucTe: number;
  TrangThai: string;
  KetQuaThamDinh: string;
  MoTaSaiLech: string;
  HinhAnhChungCu: number;
  DeXuatXuLy: string;
  GhiChu: string;
}

const mockThamDinh: ThamDinhThucDia[] = [
  {
    MaThamDinh: 'TD001',
    MaHoSo: 'HS2025-001',
    DiaChi: 'Thửa 123, Tờ 45, Khu phố 1, Phường A',
    MaThua: '123',
    SoTo: '45',
    LoaiThamDinh: 'Cấp sổ đỏ mới',
    NgayThamDinh: '2025-01-15',
    CanBoThamDinh: 'Nguyễn Văn X',
    DonViThamDinh: 'Phòng Địa chính',
    DienTichHoSo: 120,
    DienTichThucTe: 120,
    TrangThai: 'Hoàn thành',
    KetQuaThamDinh: 'Đúng hồ sơ',
    MoTaSaiLech: '',
    HinhAnhChungCu: 5,
    DeXuatXuLy: '',
    GhiChu: ''
  },
  {
    MaThamDinh: 'TD002',
    MaHoSo: 'HS2025-002',
    DiaChi: 'Thửa 456, Tờ 67, Khu phố 2, Phường B',
    MaThua: '456',
    SoTo: '67',
    LoaiThamDinh: 'Chuyển nhượng',
    NgayThamDinh: '2025-01-20',
    CanBoThamDinh: 'Trần Thị Y',
    DonViThamDinh: 'Phòng Địa chính',
    DienTichHoSo: 200,
    DienTichThucTe: 185,
    TrangThai: 'Phát hiện sai lệch',
    KetQuaThamDinh: 'Sai diện tích',
    MoTaSaiLech: 'Diện tích thực tế nhỏ hơn 15m² so với hồ sơ. Có dấu hiệu lấn chiếm đất công',
    HinhAnhChungCu: 8,
    DeXuatXuLy: 'Yêu cầu đo đạc lại, hoàn thiện hồ sơ',
    GhiChu: 'Cần kiểm tra ranh giới với thửa kế cận'
  },
  {
    MaThamDinh: 'TD003',
    MaHoSo: 'HS2025-003',
    DiaChi: 'Thửa 789, Tờ 89, Thôn 1, Xã C',
    MaThua: '789',
    SoTo: '89',
    LoaiThamDinh: 'Tách thửa',
    NgayThamDinh: '2025-01-25',
    CanBoThamDinh: 'Lê Văn Z',
    DonViThamDinh: 'Phòng Địa chính',
    DienTichHoSo: 500,
    DienTichThucTe: 0,
    TrangThai: 'Chờ thẩm định',
    KetQuaThamDinh: '',
    MoTaSaiLech: '',
    HinhAnhChungCu: 0,
    DeXuatXuLy: '',
    GhiChu: 'Dự kiến thẩm định 25/01/2025'
  },
  {
    MaThamDinh: 'TD004',
    MaHoSo: 'HS2025-004',
    DiaChi: 'Thửa 234, Tờ 12, Khu phố 3, Phường D',
    MaThua: '234',
    SoTo: '12',
    LoaiThamDinh: 'Cấp đổi sổ',
    NgayThamDinh: '2025-01-10',
    CanBoThamDinh: 'Phạm Văn A',
    DonViThamDinh: 'Phòng Địa chính',
    DienTichHoSo: 80,
    DienTichThucTe: 80,
    TrangThai: 'Hoàn thành',
    KetQuaThamDinh: 'Đúng hồ sơ',
    MoTaSaiLech: '',
    HinhAnhChungCu: 4,
    DeXuatXuLy: '',
    GhiChu: ''
  },
  {
    MaThamDinh: 'TD005',
    MaHoSo: 'HS2025-005',
    DiaChi: 'Thửa 567, Tờ 34, Khu phố 4, Phường E',
    MaThua: '567',
    SoTo: '34',
    LoaiThamDinh: 'Cấp phép xây dựng',
    NgayThamDinh: '2025-01-18',
    CanBoThamDinh: 'Hoàng Thị B',
    DonViThamDinh: 'Phòng Xây dựng',
    DienTichHoSo: 150,
    DienTichThucTe: 0,
    TrangThai: 'Đang thẩm định',
    KetQuaThamDinh: '',
    MoTaSaiLech: '',
    HinhAnhChungCu: 3,
    DeXuatXuLy: '',
    GhiChu: 'Đang kiểm tra quy hoạch'
  },
  {
    MaThamDinh: 'TD006',
    MaHoSo: 'HS2025-006',
    DiaChi: 'Thửa 890, Tờ 56, Thôn 2, Xã F',
    MaThua: '890',
    SoTo: '56',
    LoaiThamDinh: 'Hợp thửa',
    NgayThamDinh: '2025-01-12',
    CanBoThamDinh: 'Nguyễn Thị C',
    DonViThamDinh: 'Phòng Địa chính',
    DienTichHoSo: 350,
    DienTichThucTe: 365,
    TrangThai: 'Phát hiện sai lệch',
    KetQuaThamDinh: 'Sai ranh giới',
    MoTaSaiLech: 'Ranh giới phía Đông không khớp với hồ sơ gốc, chênh lệch 15m²',
    HinhAnhChungCu: 6,
    DeXuatXuLy: 'Đo đạc lại, điều chỉnh hồ sơ',
    GhiChu: ''
  }
];

const loaiThamDinhOptions = ['Cấp sổ đỏ mới', 'Cấp đổi sổ', 'Chuyển nhượng', 'Tách thửa', 'Hợp thửa', 'Cấp phép xây dựng', 'Khác'];
const trangThaiOptions = ['Chờ thẩm định', 'Đang thẩm định', 'Hoàn thành', 'Phát hiện sai lệch', 'Hủy'];
const ketQuaOptions = ['Đúng hồ sơ', 'Sai diện tích', 'Sai ranh giới', 'Sai mục đích SDĐ', 'Không đủ điều kiện'];

const emptyThamDinhForm: ThamDinhThucDia = {
  MaThamDinh: '',
  MaHoSo: '',
  DiaChi: '',
  MaThua: '',
  SoTo: '',
  LoaiThamDinh: '',
  NgayThamDinh: '',
  CanBoThamDinh: '',
  DonViThamDinh: '',
  DienTichHoSo: 0,
  DienTichThucTe: 0,
  TrangThai: 'Chờ thẩm định',
  KetQuaThamDinh: '',
  MoTaSaiLech: '',
  HinhAnhChungCu: 0,
  DeXuatXuLy: '',
  GhiChu: '',
};

function toNumber(value: unknown): number {
  const num = Number(value ?? 0);
  return Number.isFinite(num) ? num : 0;
}

function toDateString(value: unknown): string {
  if (!value) return '';
  return String(value).slice(0, 10);
}

function mapFromApi(item: any): ThamDinhThucDia {
  const id = Number(item.MaBienDong);
  return {
    MaBienDongId: Number.isFinite(id) ? id : undefined,
    MaThamDinh: item.MaBienDongText || (Number.isFinite(id) ? `TD${String(id).padStart(3, '0')}` : ''),
    MaHoSo: item.MaHoSo || '',
    DiaChi: item.DiaChiThuaDat || '',
    MaThua: item.MaThua || '',
    SoTo: item.SoTo || '',
    LoaiThamDinh: item.LoaiThamDinh || '',
    NgayThamDinh: toDateString(item.NgayThamDinh),
    CanBoThamDinh: item.CanBoThamDinh || '',
    DonViThamDinh: item.DonViThamDinh || '',
    DienTichHoSo: toNumber(item.DienTichHoSo),
    DienTichThucTe: toNumber(item.DienTichThucTe),
    TrangThai: item.TrangThai || 'Chờ thẩm định',
    KetQuaThamDinh: item.KetQuaThamDinh || '',
    MoTaSaiLech: item.MoTaSaiLech || '',
    HinhAnhChungCu: toNumber(item.HinhAnhChungCu),
    DeXuatXuLy: item.DeXuatXuLy || '',
    GhiChu: item.GhiChu || '',
  };
}

export default function ThamDinhThucDiaPage() {
  const [records, setRecords] = useState<ThamDinhThucDia[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrangThai, setFilterTrangThai] = useState<string>('all');
  const [filterLoai, setFilterLoai] = useState<string>('all');
  const [selectedTD, setSelectedTD] = useState<ThamDinhThucDia | null>(null);
  const [addForm, setAddForm] = useState<ThamDinhThucDia>(emptyThamDinhForm);
  const [editForm, setEditForm] = useState<ThamDinhThucDia>(emptyThamDinhForm);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const loadData = async () => {
    const result = await bienDongDatApi.getList({ page: 1, limit: 5000, loaiBanGhi: 'THAM_DINH_THUC_DIA' });
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
    if (!addForm.MaThua.trim()) {
      alert('Mã thửa là bắt buộc');
      return;
    }

    const payload = {
      LoaiBanGhi: 'THAM_DINH_THUC_DIA',
      MaBienDongText: addForm.MaThamDinh || null,
      MaHoSo: addForm.MaHoSo || null,
      MaThua: addForm.MaThua,
      SoTo: addForm.SoTo || null,
      LoaiBienDong: addForm.LoaiThamDinh || 'Thẩm định thực địa',
      NgayBienDong: addForm.NgayThamDinh || new Date().toISOString().slice(0, 10),
      DiaChiThuaDat: addForm.DiaChi || null,
      LoaiThamDinh: addForm.LoaiThamDinh || null,
      NgayThamDinh: addForm.NgayThamDinh || null,
      CanBoThamDinh: addForm.CanBoThamDinh || null,
      DonViThamDinh: addForm.DonViThamDinh || null,
      DienTichHoSo: toNumber(addForm.DienTichHoSo),
      DienTichThucTe: toNumber(addForm.DienTichThucTe),
      TrangThai: addForm.TrangThai || 'Chờ thẩm định',
      KetQuaThamDinh: addForm.KetQuaThamDinh || null,
      MoTaSaiLech: addForm.MoTaSaiLech || null,
      HinhAnhChungCu: toNumber(addForm.HinhAnhChungCu),
      DeXuatXuLy: addForm.DeXuatXuLy || null,
      GhiChu: addForm.GhiChu || null,
    };

    const result = await bienDongDatApi.create(payload);
    if (!result.success) {
      alert(result.message || 'Không thể tạo hồ sơ thẩm định');
      return;
    }

    setIsAddOpen(false);
    setAddForm(emptyThamDinhForm);
    await loadData();
  };

  const handleUpdate = async () => {
    if (!selectedTD?.MaBienDongId) {
      alert('Không xác định được bản ghi để cập nhật');
      return;
    }

    const payload = {
      MaBienDongText: editForm.MaThamDinh || null,
      MaHoSo: editForm.MaHoSo || null,
      MaThua: editForm.MaThua || '',
      SoTo: editForm.SoTo || null,
      LoaiBienDong: editForm.LoaiThamDinh || 'Thẩm định thực địa',
      NgayBienDong: editForm.NgayThamDinh || new Date().toISOString().slice(0, 10),
      DiaChiThuaDat: editForm.DiaChi || null,
      LoaiThamDinh: editForm.LoaiThamDinh || null,
      NgayThamDinh: editForm.NgayThamDinh || null,
      CanBoThamDinh: editForm.CanBoThamDinh || null,
      DonViThamDinh: editForm.DonViThamDinh || null,
      DienTichHoSo: toNumber(editForm.DienTichHoSo),
      DienTichThucTe: toNumber(editForm.DienTichThucTe),
      TrangThai: editForm.TrangThai || 'Chờ thẩm định',
      KetQuaThamDinh: editForm.KetQuaThamDinh || null,
      MoTaSaiLech: editForm.MoTaSaiLech || null,
      HinhAnhChungCu: toNumber(editForm.HinhAnhChungCu),
      DeXuatXuLy: editForm.DeXuatXuLy || null,
      GhiChu: editForm.GhiChu || null,
    };

    const result = await bienDongDatApi.update(selectedTD.MaBienDongId, payload);
    if (!result.success) {
      alert(result.message || 'Không thể cập nhật hồ sơ thẩm định');
      return;
    }

    setIsEditOpen(false);
    setSelectedTD(null);
    setEditForm(emptyThamDinhForm);
    await loadData();
  };

  const filteredData = records.filter((item) => {
    const matchesSearch =
      item.MaThamDinh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.MaHoSo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.DiaChi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.CanBoThamDinh.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrangThai = filterTrangThai === 'all' || item.TrangThai === filterTrangThai;
    const matchesLoai = filterLoai === 'all' || item.LoaiThamDinh === filterLoai;
    return matchesSearch && matchesTrangThai && matchesLoai;
  });

  const stats = {
    total: records.length,
    choThamDinh: records.filter(r => r.TrangThai === 'Chờ thẩm định').length,
    dangThamDinh: records.filter(r => r.TrangThai === 'Đang thẩm định').length,
    hoanThanh: records.filter(r => r.TrangThai === 'Hoàn thành').length,
    saiLech: records.filter(r => r.TrangThai === 'Phát hiện sai lệch').length,
    tongAnh: records.reduce((sum, r) => sum + r.HinhAnhChungCu, 0)
  };

  const getTrangThaiBadge = (trangThai: string) => {
    switch (trangThai) {
      case 'Hoàn thành': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Đang thẩm định': return <Badge className="bg-blue-500 hover:bg-blue-600"><Clock className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Chờ thẩm định': return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Phát hiện sai lệch': return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Hủy': return <Badge variant="secondary">{trangThai}</Badge>;
      default: return <Badge variant="secondary">{trangThai}</Badge>;
    }
  };

  const getKetQuaBadge = (ketQua: string) => {
    if (!ketQua) return <span className="text-muted-foreground">-</span>;
    if (ketQua === 'Đúng hồ sơ') return <Badge className="bg-green-500">{ketQua}</Badge>;
    return <Badge variant="destructive">{ketQua}</Badge>;
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary via-primary to-secondary rounded-lg p-4 sm:p-5 xl:p-6 text-white">
        <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Map className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Cập nhật Hồ sơ Thẩm định Thực địa</h1>
              <p className="text-blue-100">Cập nhật thông tin thực tế khi thẩm định tại hiện trường</p>
            </div>
          </div>
          <Dialog
            open={isAddOpen}
            onOpenChange={(open) => {
              setIsAddOpen(open);
              if (open) setAddForm(emptyThamDinhForm);
            }}
          >
            <DialogTrigger asChild>
              <Button className="w-full 2xl:w-auto bg-white text-blue-600 hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />
                Tạo hồ sơ thẩm định
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tạo hồ sơ thẩm định thực địa mới</DialogTitle>
                <DialogDescription>Nhập thông tin hồ sơ cần thẩm định</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Mã hồ sơ gốc *</Label>
                  <Input placeholder="Nhập mã hồ sơ" value={addForm.MaHoSo} onChange={(e) => setAddForm((prev) => ({ ...prev, MaHoSo: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Loại thẩm định *</Label>
                  <Select value={addForm.LoaiThamDinh || undefined} onValueChange={(value) => setAddForm((prev) => ({ ...prev, LoaiThamDinh: value }))}>
                    <SelectTrigger><SelectValue placeholder="Chọn loại" /></SelectTrigger>
                    <SelectContent>
                      {loaiThamDinhOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Địa chỉ *</Label>
                  <Input placeholder="Nhập địa chỉ thửa đất" value={addForm.DiaChi} onChange={(e) => setAddForm((prev) => ({ ...prev, DiaChi: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Mã thửa</Label>
                  <Input placeholder="Nhập mã thửa" value={addForm.MaThua} onChange={(e) => setAddForm((prev) => ({ ...prev, MaThua: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Số tờ</Label>
                  <Input placeholder="Nhập số tờ" value={addForm.SoTo} onChange={(e) => setAddForm((prev) => ({ ...prev, SoTo: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Diện tích theo hồ sơ (m²)</Label>
                  <Input type="number" placeholder="Nhập diện tích" value={addForm.DienTichHoSo} onChange={(e) => setAddForm((prev) => ({ ...prev, DienTichHoSo: toNumber(e.target.value) }))} />
                </div>
                <div className="space-y-2">
                  <Label>Ngày thẩm định dự kiến</Label>
                  <Input type="date" value={addForm.NgayThamDinh} onChange={(e) => setAddForm((prev) => ({ ...prev, NgayThamDinh: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Cán bộ thẩm định *</Label>
                  <Input placeholder="Chọn cán bộ" value={addForm.CanBoThamDinh} onChange={(e) => setAddForm((prev) => ({ ...prev, CanBoThamDinh: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Đơn vị thẩm định</Label>
                  <Input placeholder="Nhập đơn vị" value={addForm.DonViThamDinh} onChange={(e) => setAddForm((prev) => ({ ...prev, DonViThamDinh: e.target.value }))} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Ghi chú</Label>
                  <Textarea placeholder="Nhập ghi chú" value={addForm.GhiChu} onChange={(e) => setAddForm((prev) => ({ ...prev, GhiChu: e.target.value }))} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Hình ảnh hồ sơ ban đầu</Label>
                  <Input type="file" accept="image/*" multiple />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Hủy</Button>
                <Button onClick={handleCreate}>Tạo hồ sơ</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <FunctionStyledPanel
        title="Hiệu suất thẩm định thực địa"
        subtitle="Biểu đồ phân tán phản ánh số hồ sơ theo trạng thái và bằng chứng ảnh hiện trường"
        variant="land-field-survey"
        items={[
          { label: 'Tổng hồ sơ', value: stats.total, color: '#3b82f6' },
          { label: 'Chờ thẩm định', value: stats.choThamDinh, color: '#f59e0b' },
          { label: 'Đang thẩm định', value: stats.dangThamDinh, color: '#6366f1' },
          { label: 'Hoàn thành', value: stats.hoanThanh, color: '#22c55e' },
          { label: 'Sai lệch', value: stats.saiLech, color: '#ef4444' },
          { label: 'Hình ảnh', value: stats.tongAnh, color: '#a855f7' },
        ]}
      />

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo mã, địa chỉ, cán bộ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterLoai} onValueChange={setFilterLoai}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Loại thẩm định" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {loaiThamDinhOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterTrangThai} onValueChange={setFilterTrangThai}>
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
          <CardTitle>Danh sách hồ sơ thẩm định thực địa</CardTitle>
          <CardDescription>Tìm thấy {filteredData.length} hồ sơ</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã TĐ</TableHead>
                <TableHead>Mã hồ sơ</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Ngày TĐ</TableHead>
                <TableHead>Cán bộ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Kết quả</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.MaThamDinh}>
                  <TableCell className="font-medium text-blue-600">{item.MaThamDinh}</TableCell>
                  <TableCell className="text-sm">{item.MaHoSo}</TableCell>
                  <TableCell>
                    <div className="max-w-[150px] truncate text-sm" title={item.DiaChi}>
                      <MapPin className="inline h-3 w-3 mr-1" />
                      {item.DiaChi}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.LoaiThamDinh}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {item.NgayThamDinh}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <User className="h-3 w-3" />
                      {item.CanBoThamDinh}
                    </div>
                  </TableCell>
                  <TableCell>{getTrangThaiBadge(item.TrangThai)}</TableCell>
                  <TableCell>{getKetQuaBadge(item.KetQuaThamDinh)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {/* View Dialog */}
                      <Dialog open={isViewOpen && selectedTD?.MaThamDinh === item.MaThamDinh} onOpenChange={(open) => { setIsViewOpen(open); if (!open) setSelectedTD(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedTD(item); setIsViewOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Chi tiết thẩm định thực địa</DialogTitle>
                            <DialogDescription>Mã: {item.MaThamDinh} - Hồ sơ: {item.MaHoSo}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Địa chỉ</p>
                              <p className="font-medium">{item.DiaChi}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Mã thửa / Số tờ</p>
                              <p className="font-medium">{item.MaThua} / {item.SoTo}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Loại thẩm định</p>
                              <Badge variant="outline">{item.LoaiThamDinh}</Badge>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Ngày thẩm định</p>
                              <p className="font-medium">{item.NgayThamDinh}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Trạng thái</p>
                              {getTrangThaiBadge(item.TrangThai)}
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3">Cán bộ thẩm định</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Họ tên</p>
                                  <p className="font-medium">{item.CanBoThamDinh}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Đơn vị</p>
                                  <p className="font-medium">{item.DonViThamDinh}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Ruler className="h-4 w-4" /> Kết quả đo đạc
                              </h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">DT theo hồ sơ</p>
                                  <p className="font-medium">{item.DienTichHoSo} m²</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">DT thực tế</p>
                                  <p className="font-medium">{item.DienTichThucTe > 0 ? `${item.DienTichThucTe} m²` : 'Chưa đo'}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Chênh lệch</p>
                                  <p className={`font-medium ${item.DienTichThucTe > 0 && item.DienTichHoSo !== item.DienTichThucTe ? 'text-red-600' : 'text-green-600'}`}>
                                    {item.DienTichThucTe > 0 ? `${item.DienTichThucTe - item.DienTichHoSo} m²` : '-'}
                                  </p>
                                </div>
                              </div>
                            </div>
                            {item.KetQuaThamDinh && (
                              <div className="col-span-2 border-t pt-4 mt-2">
                                <h4 className="font-semibold mb-3">Kết quả thẩm định</h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Kết luận</p>
                                    {getKetQuaBadge(item.KetQuaThamDinh)}
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Số hình ảnh</p>
                                    <div className="flex items-center gap-1">
                                      <Camera className="h-4 w-4" />
                                      <span className="font-medium">{item.HinhAnhChungCu} ảnh</span>
                                    </div>
                                  </div>
                                  {item.MoTaSaiLech && (
                                    <div className="space-y-1 col-span-2">
                                      <p className="text-sm text-muted-foreground">Mô tả sai lệch</p>
                                      <p className="font-medium text-red-600">{item.MoTaSaiLech}</p>
                                    </div>
                                  )}
                                  {item.DeXuatXuLy && (
                                    <div className="space-y-1 col-span-2">
                                      <p className="text-sm text-muted-foreground">Đề xuất xử lý</p>
                                      <p className="font-medium">{item.DeXuatXuLy}</p>
                                    </div>
                                  )}
                                </div>
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
                      <Dialog open={isEditOpen && selectedTD?.MaThamDinh === item.MaThamDinh} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setSelectedTD(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedTD(item); setEditForm({ ...item }); setIsEditOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Cập nhật kết quả thẩm định</DialogTitle>
                            <DialogDescription>Mã: {item.MaThamDinh}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2 col-span-2">
                              <Label>Địa chỉ</Label>
                              <Input value={editForm.DiaChi} onChange={(e) => setEditForm((prev) => ({ ...prev, DiaChi: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                              <Label>Loại thẩm định</Label>
                              <Select value={editForm.LoaiThamDinh} onValueChange={(value) => setEditForm((prev) => ({ ...prev, LoaiThamDinh: value }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {loaiThamDinhOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Cán bộ thẩm định</Label>
                              <Input value={editForm.CanBoThamDinh} onChange={(e) => setEditForm((prev) => ({ ...prev, CanBoThamDinh: e.target.value }))} />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label>Đơn vị thẩm định</Label>
                              <Input value={editForm.DonViThamDinh} onChange={(e) => setEditForm((prev) => ({ ...prev, DonViThamDinh: e.target.value }))} />
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
                              <Label>Kết quả thẩm định</Label>
                              <Select value={editForm.KetQuaThamDinh || undefined} onValueChange={(value) => setEditForm((prev) => ({ ...prev, KetQuaThamDinh: value }))}>
                                <SelectTrigger><SelectValue placeholder="Chọn kết quả" /></SelectTrigger>
                                <SelectContent>
                                  {ketQuaOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Diện tích thực tế (m²)</Label>
                              <Input type="number" value={editForm.DienTichThucTe} onChange={(e) => setEditForm((prev) => ({ ...prev, DienTichThucTe: toNumber(e.target.value) }))} />
                            </div>
                            <div className="space-y-2">
                              <Label>Số hình ảnh chứng cứ</Label>
                              <Input type="number" value={editForm.HinhAnhChungCu} onChange={(e) => setEditForm((prev) => ({ ...prev, HinhAnhChungCu: toNumber(e.target.value) }))} />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label>Thêm hình ảnh kết quả thẩm định</Label>
                              <Input type="file" accept="image/*" multiple />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label>Mô tả sai lệch (nếu có)</Label>
                              <Textarea value={editForm.MoTaSaiLech} onChange={(e) => setEditForm((prev) => ({ ...prev, MoTaSaiLech: e.target.value }))} placeholder="Mô tả chi tiết sai lệch phát hiện được" />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label>Đề xuất xử lý</Label>
                              <Textarea value={editForm.DeXuatXuLy} onChange={(e) => setEditForm((prev) => ({ ...prev, DeXuatXuLy: e.target.value }))} placeholder="Đề xuất phương án xử lý" />
                            </div>
                            <div className="space-y-2 col-span-2">
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
    </div>
  );
}
