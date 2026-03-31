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
  Receipt, TrendingDown, AlertTriangle, CheckCircle2, Search, Plus, Download, Eye, Edit,
  DollarSign, FileText, Clock, CircleDollarSign, Calendar, User
} from 'lucide-react';
import { nganSachApi } from '@/lib/api';

// Mock data chi ngân sách
interface ChiNganSach {
  MaNganSach?: number;
  MaChi: string;
  LoaiChi: string;
  HangMucChi: string;
  MoTa: string;
  SoTien: number;
  DuToan: number;
  NguoiNhan: string;
  DonViNhan: string;
  NgayChi: string;
  NguoiDuyet: string;
  TrangThai: string;
  PhuongThuc: string;
  SoChungTu: string;
  GhiChu: string;
}

const mockChiNganSach: ChiNganSach[] = [
  {
    MaChi: 'CHI001',
    LoaiChi: 'Chi lương',
    HangMucChi: 'Lương cán bộ tháng 1/2025',
    MoTa: 'Chi trả lương và phụ cấp cho cán bộ, công chức, viên chức',
    SoTien: 125000000,
    DuToan: 125000000,
    NguoiNhan: 'Cán bộ, công chức',
    DonViNhan: 'UBND xã/phường',
    NgayChi: '2025-01-05',
    NguoiDuyet: 'Nguyễn Văn A',
    TrangThai: 'Đã chi',
    PhuongThuc: 'Chuyển khoản',
    SoChungTu: 'CT-2025-001',
    GhiChu: ''
  },
  {
    MaChi: 'CHI002',
    LoaiChi: 'Chi đầu tư',
    HangMucChi: 'Sửa chữa đường giao thông',
    MoTa: 'Sửa chữa đường giao thông nội bộ khu phố 2',
    SoTien: 45500000,
    DuToan: 50000000,
    NguoiNhan: 'Công ty TNHH XYZ',
    DonViNhan: 'Nhà thầu xây dựng',
    NgayChi: '2025-01-12',
    NguoiDuyet: 'Trần Văn B',
    TrangThai: 'Đã chi',
    PhuongThuc: 'Chuyển khoản',
    SoChungTu: 'CT-2025-002',
    GhiChu: 'Nghiệm thu ngày 10/01/2025'
  },
  {
    MaChi: 'CHI003',
    LoaiChi: 'Chi thường xuyên',
    HangMucChi: 'Mua sắm văn phòng phẩm',
    MoTa: 'Văn phòng phẩm phục vụ công tác hành chính quý 1/2025',
    SoTien: 8200000,
    DuToan: 10000000,
    NguoiNhan: 'Cửa hàng văn phòng phẩm ABC',
    DonViNhan: 'Nhà cung cấp',
    NgayChi: '2025-01-20',
    NguoiDuyet: '',
    TrangThai: 'Chờ phê duyệt',
    PhuongThuc: 'Tiền mặt',
    SoChungTu: 'CT-2025-003',
    GhiChu: ''
  },
  {
    MaChi: 'CHI004',
    LoaiChi: 'Chi hoạt động',
    HangMucChi: 'Chi tổ chức họp HĐND',
    MoTa: 'Chi phí tổ chức kỳ họp HĐND đầu năm 2025',
    SoTien: 15000000,
    DuToan: 15000000,
    NguoiNhan: 'Văn phòng HĐND',
    DonViNhan: 'HĐND xã/phường',
    NgayChi: '2025-01-08',
    NguoiDuyet: 'Lê Thị C',
    TrangThai: 'Đã chi',
    PhuongThuc: 'Tiền mặt',
    SoChungTu: 'CT-2025-004',
    GhiChu: ''
  },
  {
    MaChi: 'CHI005',
    LoaiChi: 'Chi sự nghiệp',
    HangMucChi: 'Hỗ trợ y tế cộng đồng',
    MoTa: 'Hỗ trợ hoạt động tiêm chủng mở rộng',
    SoTien: 25000000,
    DuToan: 20000000,
    NguoiNhan: 'Trạm Y tế',
    DonViNhan: 'Trạm Y tế xã/phường',
    NgayChi: '2025-01-15',
    NguoiDuyet: 'Phạm Văn D',
    TrangThai: 'Đã chi',
    PhuongThuc: 'Chuyển khoản',
    SoChungTu: 'CT-2025-005',
    GhiChu: 'Vượt dự toán do số lượng tiêm tăng'
  },
  {
    MaChi: 'CHI006',
    LoaiChi: 'Chi đầu tư',
    HangMucChi: 'Xây dựng nhà văn hóa',
    MoTa: 'Thanh toán đợt 1 xây dựng nhà văn hóa thôn 3',
    SoTien: 150000000,
    DuToan: 500000000,
    NguoiNhan: 'Công ty CP Xây dựng DEF',
    DonViNhan: 'Nhà thầu',
    NgayChi: '2025-01-18',
    NguoiDuyet: '',
    TrangThai: 'Chờ phê duyệt',
    PhuongThuc: 'Chuyển khoản',
    SoChungTu: 'CT-2025-006',
    GhiChu: 'Tạm ứng 30% giá trị hợp đồng'
  },
  {
    MaChi: 'CHI007',
    LoaiChi: 'Chi thường xuyên',
    HangMucChi: 'Tiền điện, nước tháng 1',
    MoTa: 'Thanh toán tiền điện, nước công sở',
    SoTien: 12500000,
    DuToan: 12000000,
    NguoiNhan: 'Điện lực, Công ty nước',
    DonViNhan: 'Nhà cung cấp dịch vụ',
    NgayChi: '2025-01-25',
    NguoiDuyet: 'Hoàng Thị E',
    TrangThai: 'Đã chi',
    PhuongThuc: 'Chuyển khoản',
    SoChungTu: 'CT-2025-007',
    GhiChu: ''
  }
];

const loaiChiOptions = ['Chi lương', 'Chi thường xuyên', 'Chi đầu tư', 'Chi hoạt động', 'Chi sự nghiệp', 'Chi khác'];
const trangThaiOptions = ['Chờ phê duyệt', 'Đã phê duyệt', 'Đã chi', 'Từ chối', 'Hủy'];
const phuongThucOptions = ['Tiền mặt', 'Chuyển khoản'];

const emptyChiForm: ChiNganSach = {
  MaChi: '',
  LoaiChi: '',
  HangMucChi: '',
  MoTa: '',
  SoTien: 0,
  DuToan: 0,
  NguoiNhan: '',
  DonViNhan: '',
  NgayChi: '',
  NguoiDuyet: '',
  TrangThai: 'Chờ phê duyệt',
  PhuongThuc: 'Tiền mặt',
  SoChungTu: '',
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

function mapFromApi(item: any): ChiNganSach {
  return {
    MaNganSach: item.MaNganSach,
    MaChi: item.MaChi || '',
    LoaiChi: item.LoaiChi || '',
    HangMucChi: item.HangMucChi || '',
    MoTa: item.MoTa || '',
    SoTien: toNumber(item.SoTien),
    DuToan: toNumber(item.DuToan),
    NguoiNhan: item.NguoiNhan || '',
    DonViNhan: item.DonViNhan || '',
    NgayChi: toDateString(item.NgayChi),
    NguoiDuyet: item.NguoiDuyetText || item.NguoiDuyet || '',
    TrangThai: item.TrangThai || 'Chờ phê duyệt',
    PhuongThuc: item.PhuongThuc || 'Tiền mặt',
    SoChungTu: item.SoChungTu || '',
    GhiChu: item.GhiChu || '',
  };
}

export default function ChiNganSachPage() {
  const [records, setRecords] = useState<ChiNganSach[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLoai, setFilterLoai] = useState<string>('all');
  const [filterTrangThai, setFilterTrangThai] = useState<string>('all');
  const [selectedChi, setSelectedChi] = useState<ChiNganSach | null>(null);
  const [addForm, setAddForm] = useState<ChiNganSach>(emptyChiForm);
  const [editForm, setEditForm] = useState<ChiNganSach>(emptyChiForm);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const loadData = async () => {
    const result = await nganSachApi.getList({ page: 1, limit: 5000, loaiBanGhi: 'CHI_NGAN_SACH' });
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
    const year = addForm.NgayChi ? Number(addForm.NgayChi.slice(0, 4)) : new Date().getFullYear();
    const payload = {
      LoaiBanGhi: 'CHI_NGAN_SACH',
      Nam: year,
      TongDuToan: toNumber(addForm.DuToan || addForm.SoTien),
      DaGiaiNgan: toNumber(addForm.SoTien),
      TrangThai: addForm.TrangThai || 'Chờ phê duyệt',
      MaChi: addForm.MaChi || null,
      LoaiChi: addForm.LoaiChi || null,
      HangMucChi: addForm.HangMucChi || null,
      MoTa: addForm.MoTa || null,
      SoTien: toNumber(addForm.SoTien),
      DuToan: toNumber(addForm.DuToan),
      NguoiNhan: addForm.NguoiNhan || null,
      DonViNhan: addForm.DonViNhan || null,
      NgayChi: addForm.NgayChi || null,
      NguoiDuyetText: addForm.NguoiDuyet || null,
      PhuongThuc: addForm.PhuongThuc || null,
      SoChungTu: addForm.SoChungTu || null,
      GhiChu: addForm.GhiChu || null,
    };

    const result = await nganSachApi.create(payload);
    if (!result.success) {
      alert(result.message || 'Không thể tạo khoản chi');
      return;
    }

    setIsAddOpen(false);
    setAddForm(emptyChiForm);
    await loadData();
  };

  const handleUpdate = async () => {
    if (!selectedChi?.MaNganSach) {
      alert('Không xác định được bản ghi để cập nhật');
      return;
    }

    const year = editForm.NgayChi ? Number(editForm.NgayChi.slice(0, 4)) : new Date().getFullYear();
    const payload = {
      Nam: year,
      TongDuToan: toNumber(editForm.DuToan || editForm.SoTien),
      DaGiaiNgan: toNumber(editForm.SoTien),
      TrangThai: editForm.TrangThai || 'Chờ phê duyệt',
      MaChi: editForm.MaChi || null,
      LoaiChi: editForm.LoaiChi || null,
      HangMucChi: editForm.HangMucChi || null,
      MoTa: editForm.MoTa || null,
      SoTien: toNumber(editForm.SoTien),
      DuToan: toNumber(editForm.DuToan),
      NguoiNhan: editForm.NguoiNhan || null,
      DonViNhan: editForm.DonViNhan || null,
      NgayChi: editForm.NgayChi || null,
      NguoiDuyetText: editForm.NguoiDuyet || null,
      PhuongThuc: editForm.PhuongThuc || null,
      SoChungTu: editForm.SoChungTu || null,
      GhiChu: editForm.GhiChu || null,
    };

    const result = await nganSachApi.update(selectedChi.MaNganSach, payload);
    if (!result.success) {
      alert(result.message || 'Không thể cập nhật khoản chi');
      return;
    }

    setIsEditOpen(false);
    setSelectedChi(null);
    setEditForm(emptyChiForm);
    await loadData();
  };

  const filteredData = records.filter((item) => {
    const matchesSearch =
      item.MaChi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.HangMucChi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.NguoiNhan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLoai = filterLoai === 'all' || item.LoaiChi === filterLoai;
    const matchesTrangThai = filterTrangThai === 'all' || item.TrangThai === filterTrangThai;
    return matchesSearch && matchesLoai && matchesTrangThai;
  });

  const tongChi = records.filter(c => c.TrangThai === 'Đã chi').reduce((sum, c) => sum + c.SoTien, 0);
  const tongDuToan = records.reduce((sum, c) => sum + c.DuToan, 0);
  const vuotDuToan = records.filter(c => c.SoTien > c.DuToan).length;

  const stats = {
    tongChi,
    tongDuToan,
    tyLeGiaiNgan: tongDuToan > 0 ? Math.round((tongChi / tongDuToan) * 100) : 0,
    soKhoanChi: records.length,
    daChi: records.filter(c => c.TrangThai === 'Đã chi').length,
    vuotDuToan
  };

  const getTrangThaiBadge = (trangThai: string) => {
    switch (trangThai) {
      case 'Đã chi': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Đã phê duyệt': return <Badge className="bg-blue-500 hover:bg-blue-600"><CheckCircle2 className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Chờ phê duyệt': return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Từ chối': return <Badge variant="destructive">{trangThai}</Badge>;
      case 'Hủy': return <Badge variant="secondary">{trangThai}</Badge>;
      default: return <Badge variant="secondary">{trangThai}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatShortCurrency = (amount: number) => {
    if (amount >= 1000000000) return `${(amount / 1000000000).toFixed(1)}B`;
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(0)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
    return amount.toString();
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-status-danger to-primary rounded-lg p-4 sm:p-5 xl:p-6 text-white">
        <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Receipt className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Theo dõi Chi ngân sách</h1>
              <p className="text-red-100">Quản lý và theo dõi các khoản chi ngân sách địa phương</p>
            </div>
          </div>
          <Dialog
            open={isAddOpen}
            onOpenChange={(open) => {
              setIsAddOpen(open);
              if (open) setAddForm(emptyChiForm);
            }}
          >
            <DialogTrigger asChild>
              <Button className="w-full 2xl:w-auto bg-white text-red-600 hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />
                Thêm khoản chi
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm khoản chi ngân sách</DialogTitle>
                <DialogDescription>Nhập thông tin khoản chi mới</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Loại chi *</Label>
                  <Select value={addForm.LoaiChi || undefined} onValueChange={(value) => setAddForm((prev) => ({ ...prev, LoaiChi: value }))}>
                    <SelectTrigger><SelectValue placeholder="Chọn loại chi" /></SelectTrigger>
                    <SelectContent>
                      {loaiChiOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ngày chi *</Label>
                  <Input type="date" value={addForm.NgayChi} onChange={(e) => setAddForm((prev) => ({ ...prev, NgayChi: e.target.value }))} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Hạng mục chi *</Label>
                  <Input placeholder="Nhập hạng mục chi" value={addForm.HangMucChi} onChange={(e) => setAddForm((prev) => ({ ...prev, HangMucChi: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Số tiền (VNĐ) *</Label>
                  <Input type="number" placeholder="Nhập số tiền" value={addForm.SoTien} onChange={(e) => setAddForm((prev) => ({ ...prev, SoTien: toNumber(e.target.value) }))} />
                </div>
                <div className="space-y-2">
                  <Label>Dự toán (VNĐ)</Label>
                  <Input type="number" placeholder="Nhập số tiền dự toán" value={addForm.DuToan} onChange={(e) => setAddForm((prev) => ({ ...prev, DuToan: toNumber(e.target.value) }))} />
                </div>
                <div className="space-y-2">
                  <Label>Người/Đơn vị nhận *</Label>
                  <Input placeholder="Nhập tên" value={addForm.NguoiNhan} onChange={(e) => setAddForm((prev) => ({ ...prev, NguoiNhan: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Đơn vị</Label>
                  <Input placeholder="Nhập đơn vị" value={addForm.DonViNhan} onChange={(e) => setAddForm((prev) => ({ ...prev, DonViNhan: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Phương thức</Label>
                  <Select value={addForm.PhuongThuc || undefined} onValueChange={(value) => setAddForm((prev) => ({ ...prev, PhuongThuc: value }))}>
                    <SelectTrigger><SelectValue placeholder="Chọn phương thức" /></SelectTrigger>
                    <SelectContent>
                      {phuongThucOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Số chứng từ</Label>
                  <Input placeholder="Nhập số chứng từ" value={addForm.SoChungTu} onChange={(e) => setAddForm((prev) => ({ ...prev, SoChungTu: e.target.value }))} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Mô tả</Label>
                  <Textarea placeholder="Mô tả chi tiết khoản chi" value={addForm.MoTa} onChange={(e) => setAddForm((prev) => ({ ...prev, MoTa: e.target.value }))} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Ghi chú</Label>
                  <Textarea placeholder="Nhập ghi chú" value={addForm.GhiChu} onChange={(e) => setAddForm((prev) => ({ ...prev, GhiChu: e.target.value }))} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Hủy</Button>
                <Button onClick={handleCreate}>Thêm khoản chi</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng chi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold">{formatShortCurrency(stats.tongChi)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Dự toán</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CircleDollarSign className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{formatShortCurrency(stats.tongDuToan)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tỷ lệ giải ngân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-purple-500" />
              <span className="text-2xl font-bold">{stats.tyLeGiaiNgan}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-teal-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Số khoản chi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-500" />
              <span className="text-2xl font-bold">{stats.soKhoanChi}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đã chi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{stats.daChi}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vượt dự toán</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold">{stats.vuotDuToan}</span>
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
                placeholder="Tìm theo mã, hạng mục, người nhận..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterLoai} onValueChange={setFilterLoai}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Loại chi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {loaiChiOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
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
              Xuất báo cáo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách khoản chi ngân sách</CardTitle>
          <CardDescription>Tìm thấy {filteredData.length} khoản chi</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã</TableHead>
                <TableHead>Loại chi</TableHead>
                <TableHead>Hạng mục</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>So với DT</TableHead>
                <TableHead>Ngày chi</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={item.MaNganSach ?? (item.MaChi || `row-${index}`)}>
                  <TableCell className="font-medium text-red-600">{item.MaChi}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.LoaiChi}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[150px] truncate text-sm" title={item.HangMucChi}>
                      {item.HangMucChi}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-medium text-red-600">
                      <DollarSign className="h-3 w-3" />
                      {formatCurrency(item.SoTien)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.DuToan > 0 ? (
                      <span className={`font-medium ${item.SoTien > item.DuToan ? 'text-red-600' : 'text-green-600'}`}>
                        {item.SoTien > item.DuToan ? '+' : ''}{Math.round(((item.SoTien - item.DuToan) / item.DuToan) * 100)}%
                      </span>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {item.NgayChi}
                    </div>
                  </TableCell>
                  <TableCell>{getTrangThaiBadge(item.TrangThai)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {/* View Dialog */}
                      <Dialog open={isViewOpen && selectedChi?.MaChi === item.MaChi} onOpenChange={(open) => { setIsViewOpen(open); if (!open) setSelectedChi(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedChi(item); setIsViewOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Chi tiết khoản chi</DialogTitle>
                            <DialogDescription>Mã: {item.MaChi}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Loại chi</p>
                              <Badge variant="outline">{item.LoaiChi}</Badge>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Trạng thái</p>
                              {getTrangThaiBadge(item.TrangThai)}
                            </div>
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Hạng mục chi</p>
                              <p className="font-medium">{item.HangMucChi}</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Mô tả</p>
                              <p className="font-medium">{item.MoTa}</p>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3">Thông tin tài chính</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Số tiền chi</p>
                                  <p className="font-bold text-lg text-red-600">{formatCurrency(item.SoTien)}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Dự toán</p>
                                  <p className="font-medium">{item.DuToan > 0 ? formatCurrency(item.DuToan) : '-'}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">So với dự toán</p>
                                  <p className={`font-medium ${item.SoTien > item.DuToan ? 'text-red-600' : 'text-green-600'}`}>
                                    {item.DuToan > 0 ? `${item.SoTien > item.DuToan ? '+' : ''}${Math.round(((item.SoTien - item.DuToan) / item.DuToan) * 100)}%` : '-'}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3">Người nhận</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Người/Đơn vị nhận</p>
                                  <p className="font-medium">{item.NguoiNhan}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Loại đơn vị</p>
                                  <p className="font-medium">{item.DonViNhan}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3">Thông tin giao dịch</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Ngày chi</p>
                                  <p className="font-medium">{item.NgayChi}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Người duyệt</p>
                                  <p className="font-medium">{item.NguoiDuyet || '-'}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Phương thức</p>
                                  <p className="font-medium">{item.PhuongThuc}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Số chứng từ</p>
                                  <p className="font-medium">{item.SoChungTu}</p>
                                </div>
                              </div>
                            </div>
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
                      <Dialog open={isEditOpen && selectedChi?.MaChi === item.MaChi} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setSelectedChi(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedChi(item); setEditForm({ ...item }); setIsEditOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Cập nhật khoản chi</DialogTitle>
                            <DialogDescription>Mã: {item.MaChi}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="bg-red-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin khoản chi</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Loại chi</Label>
                                  <Input value={editForm.LoaiChi} onChange={(e) => setEditForm((prev) => ({ ...prev, LoaiChi: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Hạng mục chi</Label>
                                  <Input value={editForm.HangMucChi} onChange={(e) => setEditForm((prev) => ({ ...prev, HangMucChi: e.target.value }))} />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label>Mô tả</Label>
                                  <Textarea value={editForm.MoTa} onChange={(e) => setEditForm((prev) => ({ ...prev, MoTa: e.target.value }))} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-amber-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin tài chính</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label>Số tiền (VNĐ)</Label>
                                  <Input type="number" value={editForm.SoTien} onChange={(e) => setEditForm((prev) => ({ ...prev, SoTien: toNumber(e.target.value) }))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Dự toán (VNĐ)</Label>
                                  <Input type="number" value={editForm.DuToan} onChange={(e) => setEditForm((prev) => ({ ...prev, DuToan: toNumber(e.target.value) }))} />
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
                              </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Người nhận</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Người/Đơn vị nhận</Label>
                                  <Input value={editForm.NguoiNhan} onChange={(e) => setEditForm((prev) => ({ ...prev, NguoiNhan: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Loại đơn vị</Label>
                                  <Input value={editForm.DonViNhan} onChange={(e) => setEditForm((prev) => ({ ...prev, DonViNhan: e.target.value }))} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin giao dịch</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Ngày chi</Label>
                                  <Input type="date" value={editForm.NgayChi} onChange={(e) => setEditForm((prev) => ({ ...prev, NgayChi: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Người duyệt</Label>
                                  <Input value={editForm.NguoiDuyet} onChange={(e) => setEditForm((prev) => ({ ...prev, NguoiDuyet: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Phương thức</Label>
                                  <Select value={editForm.PhuongThuc} onValueChange={(value) => setEditForm((prev) => ({ ...prev, PhuongThuc: value }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {phuongThucOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Số chứng từ</Label>
                                  <Input value={editForm.SoChungTu} onChange={(e) => setEditForm((prev) => ({ ...prev, SoChungTu: e.target.value }))} />
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
    </div>
  );
}
