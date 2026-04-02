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
  TrendingUp, Coins, Calendar, CheckCircle2, Search, Plus, Download, Eye, Edit,
  DollarSign, Percent, FileText, Clock, CircleDollarSign
} from 'lucide-react';
import { nganSachApi } from '@/lib/api';
import { FunctionStyledPanel } from '@/components/charts/function-styled-panel';

// Mock data thu ngân sách
interface ThuNganSach {
  MaNganSach?: number;
  MaThu: string;
  LoaiThu: string;
  NguonThu: string;
  MoTa: string;
  SoTien: number;
  SoTienKeHoach: number;
  NguoiNop: string;
  DiaChi: string;
  NgayThu: string;
  NguoiThu: string;
  TrangThai: string;
  PhuongThuc: string;
  SoBienLai: string;
  GhiChu: string;
}

const mockThuNganSach: ThuNganSach[] = [
  {
    MaThu: 'THU001',
    LoaiThu: 'Phí hành chính',
    NguonThu: 'Thu phí cấp giấy chứng nhận',
    MoTa: 'Phí làm thủ tục hành chính công tháng 1/2025',
    SoTien: 15500000,
    SoTienKeHoach: 15000000,
    NguoiNop: 'Nhiều người',
    DiaChi: '',
    NgayThu: '2025-01-15',
    NguoiThu: 'Nguyễn Thị A',
    TrangThai: 'Đã xác nhận',
    PhuongThuc: 'Chuyển khoản',
    SoBienLai: 'BL-2025-001',
    GhiChu: ''
  },
  {
    MaThu: 'THU002',
    LoaiThu: 'Phí chợ',
    NguonThu: 'Thu phí chợ tháng 1',
    MoTa: 'Phí kinh doanh tại chợ trung tâm',
    SoTien: 8200000,
    SoTienKeHoach: 10000000,
    NguoiNop: '45 hộ kinh doanh',
    DiaChi: 'Chợ Trung tâm',
    NgayThu: '2025-01-20',
    NguoiThu: 'Trần Văn B',
    TrangThai: 'Đã xác nhận',
    PhuongThuc: 'Tiền mặt',
    SoBienLai: 'BL-2025-002',
    GhiChu: 'Còn 5 hộ chưa nộp'
  },
  {
    MaThu: 'THU003',
    LoaiThu: 'Phí môi trường',
    NguonThu: 'Thu phí bảo vệ môi trường',
    MoTa: 'Phí thu gom rác thải tháng 1/2025',
    SoTien: 12800000,
    SoTienKeHoach: 15000000,
    NguoiNop: 'Hộ dân các khu phố',
    DiaChi: 'Toàn xã/phường',
    NgayThu: '2025-01-25',
    NguoiThu: 'Lê Thị C',
    TrangThai: 'Chờ xác nhận',
    PhuongThuc: 'Tiền mặt',
    SoBienLai: 'BL-2025-003',
    GhiChu: 'Đang thu tiếp các thôn còn lại'
  },
  {
    MaThu: 'THU004',
    LoaiThu: 'Thu từ đất',
    NguonThu: 'Thu tiền sử dụng đất',
    MoTa: 'Tiền sử dụng đất khi cấp sổ đỏ',
    SoTien: 125000000,
    SoTienKeHoach: 100000000,
    NguoiNop: 'Nguyễn Văn D',
    DiaChi: 'Khu phố 2, Phường A',
    NgayThu: '2025-01-10',
    NguoiThu: 'Phạm Văn E',
    TrangThai: 'Đã xác nhận',
    PhuongThuc: 'Chuyển khoản',
    SoBienLai: 'BL-2025-004',
    GhiChu: ''
  },
  {
    MaThu: 'THU005',
    LoaiThu: 'Thuế',
    NguonThu: 'Thuế môn bài hộ kinh doanh',
    MoTa: 'Thuế môn bài năm 2025',
    SoTien: 45000000,
    SoTienKeHoach: 50000000,
    NguoiNop: '120 hộ kinh doanh',
    DiaChi: 'Toàn xã/phường',
    NgayThu: '2025-01-08',
    NguoiThu: 'Hoàng Thị F',
    TrangThai: 'Đã xác nhận',
    PhuongThuc: 'Nhiều hình thức',
    SoBienLai: 'BL-2025-005',
    GhiChu: ''
  },
  {
    MaThu: 'THU006',
    LoaiThu: 'Phạt vi phạm',
    NguonThu: 'Thu tiền phạt vi phạm hành chính',
    MoTa: 'Tiền phạt vi phạm trật tự xây dựng',
    SoTien: 50000000,
    SoTienKeHoach: 0,
    NguoiNop: 'Công ty ABC',
    DiaChi: 'KCN D',
    NgayThu: '2025-01-12',
    NguoiThu: 'Nguyễn Văn G',
    TrangThai: 'Đã xác nhận',
    PhuongThuc: 'Chuyển khoản',
    SoBienLai: 'BL-2025-006',
    GhiChu: 'Theo QĐ xử phạt số 05/2025'
  },
  {
    MaThu: 'THU007',
    LoaiThu: 'Lệ phí',
    NguonThu: 'Lệ phí đăng ký hộ tịch',
    MoTa: 'Lệ phí khai sinh, khai tử, kết hôn',
    SoTien: 3500000,
    SoTienKeHoach: 4000000,
    NguoiNop: 'Nhiều người',
    DiaChi: '',
    NgayThu: '2025-01-28',
    NguoiThu: 'Trần Thị H',
    TrangThai: 'Chờ xác nhận',
    PhuongThuc: 'Tiền mặt',
    SoBienLai: 'BL-2025-007',
    GhiChu: ''
  }
];

const loaiThuOptions = ['Phí hành chính', 'Phí chợ', 'Phí môi trường', 'Thu từ đất', 'Thuế', 'Lệ phí', 'Phạt vi phạm', 'Khác'];
const trangThaiOptions = ['Chờ xác nhận', 'Đã xác nhận', 'Hoàn trả', 'Hủy'];
const phuongThucOptions = ['Tiền mặt', 'Chuyển khoản', 'Nhiều hình thức'];

const emptyThuForm: ThuNganSach = {
  MaThu: '',
  LoaiThu: '',
  NguonThu: '',
  MoTa: '',
  SoTien: 0,
  SoTienKeHoach: 0,
  NguoiNop: '',
  DiaChi: '',
  NgayThu: '',
  NguoiThu: '',
  TrangThai: 'Chờ xác nhận',
  PhuongThuc: 'Tiền mặt',
  SoBienLai: '',
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

function mapFromApi(item: any): ThuNganSach {
  return {
    MaNganSach: item.MaNganSach,
    MaThu: item.MaThu || '',
    LoaiThu: item.LoaiThu || '',
    NguonThu: item.NguonThu || '',
    MoTa: item.MoTa || '',
    SoTien: toNumber(item.SoTien),
    SoTienKeHoach: toNumber(item.SoTienKeHoach),
    NguoiNop: item.NguoiNop || '',
    DiaChi: item.DiaChi || '',
    NgayThu: toDateString(item.NgayThu),
    NguoiThu: item.NguoiThu || '',
    TrangThai: item.TrangThai || 'Chờ xác nhận',
    PhuongThuc: item.PhuongThuc || 'Tiền mặt',
    SoBienLai: item.SoBienLai || '',
    GhiChu: item.GhiChu || '',
  };
}

export default function ThuNganSachPage() {
  const [records, setRecords] = useState<ThuNganSach[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLoai, setFilterLoai] = useState<string>('all');
  const [filterTrangThai, setFilterTrangThai] = useState<string>('all');
  const [selectedThu, setSelectedThu] = useState<ThuNganSach | null>(null);
  const [addForm, setAddForm] = useState<ThuNganSach>(emptyThuForm);
  const [editForm, setEditForm] = useState<ThuNganSach>(emptyThuForm);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const loadData = async () => {
    const result = await nganSachApi.getList({ page: 1, limit: 5000, loaiBanGhi: 'THU_NGAN_SACH' });
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
    const year = addForm.NgayThu ? Number(addForm.NgayThu.slice(0, 4)) : new Date().getFullYear();
    const tongDuToan = toNumber(addForm.SoTienKeHoach || addForm.SoTien);
    const daGiaiNgan = toNumber(addForm.SoTien);

    const payload = {
      LoaiBanGhi: 'THU_NGAN_SACH',
      Nam: year,
      TongDuToan: tongDuToan,
      DaGiaiNgan: daGiaiNgan,
      TrangThai: addForm.TrangThai || 'Chờ xác nhận',
      MaThu: addForm.MaThu || null,
      LoaiThu: addForm.LoaiThu || null,
      NguonThu: addForm.NguonThu || null,
      MoTa: addForm.MoTa || null,
      SoTien: daGiaiNgan,
      SoTienKeHoach: toNumber(addForm.SoTienKeHoach),
      NguoiNop: addForm.NguoiNop || null,
      DiaChi: addForm.DiaChi || null,
      NgayThu: addForm.NgayThu || null,
      NguoiThu: addForm.NguoiThu || null,
      PhuongThuc: addForm.PhuongThuc || null,
      SoBienLai: addForm.SoBienLai || null,
      GhiChu: addForm.GhiChu || null,
    };

    const result = await nganSachApi.create(payload);
    if (!result.success) {
      alert(result.message || 'Không thể tạo khoản thu');
      return;
    }

    setIsAddOpen(false);
    setAddForm(emptyThuForm);
    await loadData();
  };

  const handleUpdate = async () => {
    if (!selectedThu?.MaNganSach) {
      alert('Không xác định được bản ghi để cập nhật');
      return;
    }

    const year = editForm.NgayThu ? Number(editForm.NgayThu.slice(0, 4)) : new Date().getFullYear();
    const payload = {
      Nam: year,
      TongDuToan: toNumber(editForm.SoTienKeHoach || editForm.SoTien),
      DaGiaiNgan: toNumber(editForm.SoTien),
      TrangThai: editForm.TrangThai || 'Chờ xác nhận',
      MaThu: editForm.MaThu || null,
      LoaiThu: editForm.LoaiThu || null,
      NguonThu: editForm.NguonThu || null,
      MoTa: editForm.MoTa || null,
      SoTien: toNumber(editForm.SoTien),
      SoTienKeHoach: toNumber(editForm.SoTienKeHoach),
      NguoiNop: editForm.NguoiNop || null,
      DiaChi: editForm.DiaChi || null,
      NgayThu: editForm.NgayThu || null,
      NguoiThu: editForm.NguoiThu || null,
      PhuongThuc: editForm.PhuongThuc || null,
      SoBienLai: editForm.SoBienLai || null,
      GhiChu: editForm.GhiChu || null,
    };

    const result = await nganSachApi.update(selectedThu.MaNganSach, payload);
    if (!result.success) {
      alert(result.message || 'Không thể cập nhật khoản thu');
      return;
    }

    setIsEditOpen(false);
    setSelectedThu(null);
    setEditForm(emptyThuForm);
    await loadData();
  };

  const filteredData = records.filter((item) => {
    const matchesSearch =
      item.MaThu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.NguonThu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.NguoiNop.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLoai = filterLoai === 'all' || item.LoaiThu === filterLoai;
    const matchesTrangThai = filterTrangThai === 'all' || item.TrangThai === filterTrangThai;
    return matchesSearch && matchesLoai && matchesTrangThai;
  });

  const tongThu = records.filter(t => t.TrangThai === 'Đã xác nhận').reduce((sum, t) => sum + t.SoTien, 0);
  const tongKeHoach = records.reduce((sum, t) => sum + t.SoTienKeHoach, 0);
  const tyLeDat = tongKeHoach > 0 ? Math.round((tongThu / tongKeHoach) * 100) : 0;

  const stats = {
    tongThu,
    tongKeHoach,
    tyLeDat,
    soKhoanThu: records.length,
    daXacNhan: records.filter(t => t.TrangThai === 'Đã xác nhận').length,
    choXacNhan: records.filter(t => t.TrangThai === 'Chờ xác nhận').length
  };

  const getTrangThaiBadge = (trangThai: string) => {
    switch (trangThai) {
      case 'Đã xác nhận': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Chờ xác nhận': return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Hoàn trả': return <Badge className="bg-blue-500 hover:bg-blue-600">{trangThai}</Badge>;
      case 'Hủy': return <Badge variant="destructive">{trangThai}</Badge>;
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
      <div className="bg-gradient-to-r from-status-success via-status-success to-secondary rounded-lg p-4 sm:p-5 xl:p-6 text-white">
        <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Theo dõi Thu ngân sách</h1>
              <p className="text-green-100">Quản lý và theo dõi các khoản thu ngân sách địa phương</p>
            </div>
          </div>
          <Dialog
            open={isAddOpen}
            onOpenChange={(open) => {
              setIsAddOpen(open);
              if (open) setAddForm(emptyThuForm);
            }}
          >
            <DialogTrigger asChild>
              <Button className="w-full 2xl:w-auto bg-white text-green-600 hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />
                Thêm khoản thu
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Thêm khoản thu ngân sách</DialogTitle>
                <DialogDescription>Nhập thông tin khoản thu mới</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Loại thu *</Label>
                  <Select value={addForm.LoaiThu || undefined} onValueChange={(value) => setAddForm((prev) => ({ ...prev, LoaiThu: value }))}>
                    <SelectTrigger><SelectValue placeholder="Chọn loại thu" /></SelectTrigger>
                    <SelectContent>
                      {loaiThuOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ngày thu *</Label>
                  <Input type="date" value={addForm.NgayThu} onChange={(e) => setAddForm((prev) => ({ ...prev, NgayThu: e.target.value }))} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Nguồn thu *</Label>
                  <Input placeholder="Nhập nguồn thu" value={addForm.NguonThu} onChange={(e) => setAddForm((prev) => ({ ...prev, NguonThu: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Số tiền (VNĐ) *</Label>
                  <Input type="number" placeholder="Nhập số tiền" value={addForm.SoTien} onChange={(e) => setAddForm((prev) => ({ ...prev, SoTien: toNumber(e.target.value) }))} />
                </div>
                <div className="space-y-2">
                  <Label>Kế hoạch (VNĐ)</Label>
                  <Input type="number" placeholder="Nhập số tiền kế hoạch" value={addForm.SoTienKeHoach} onChange={(e) => setAddForm((prev) => ({ ...prev, SoTienKeHoach: toNumber(e.target.value) }))} />
                </div>
                <div className="space-y-2">
                  <Label>Người nộp</Label>
                  <Input placeholder="Nhập tên người nộp" value={addForm.NguoiNop} onChange={(e) => setAddForm((prev) => ({ ...prev, NguoiNop: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Địa chỉ</Label>
                  <Input placeholder="Nhập địa chỉ" value={addForm.DiaChi} onChange={(e) => setAddForm((prev) => ({ ...prev, DiaChi: e.target.value }))} />
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
                  <Label>Người thu</Label>
                  <Input placeholder="Nhập tên người thu" value={addForm.NguoiThu} onChange={(e) => setAddForm((prev) => ({ ...prev, NguoiThu: e.target.value }))} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Mô tả</Label>
                  <Textarea placeholder="Mô tả chi tiết khoản thu" value={addForm.MoTa} onChange={(e) => setAddForm((prev) => ({ ...prev, MoTa: e.target.value }))} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Ghi chú</Label>
                  <Textarea placeholder="Nhập ghi chú" value={addForm.GhiChu} onChange={(e) => setAddForm((prev) => ({ ...prev, GhiChu: e.target.value }))} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Hủy</Button>
                <Button onClick={handleCreate}>Thêm khoản thu</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <FunctionStyledPanel
        title="Nhịp tăng trưởng thu ngân sách"
        subtitle="Biểu đồ cột ngang nhấn mạnh tiến độ thu, mức đạt kế hoạch và trạng thái xác nhận"
        variant="finance-revenue"
        items={[
          { label: 'Tổng thu', value: stats.tongThu, color: '#22c55e' },
          { label: 'Kế hoạch', value: stats.tongKeHoach, color: '#3b82f6' },
          { label: 'Tỷ lệ đạt (%)', value: stats.tyLeDat, color: '#8b5cf6' },
          { label: 'Số khoản thu', value: stats.soKhoanThu, color: '#0ea5e9' },
          { label: 'Đã xác nhận', value: stats.daXacNhan, color: '#10b981' },
          { label: 'Chờ xác nhận', value: stats.choXacNhan, color: '#f59e0b' },
        ]}
      />

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo mã, nguồn thu, người nộp..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterLoai} onValueChange={setFilterLoai}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Loại thu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {loaiThuOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
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
          <CardTitle>Danh sách khoản thu ngân sách</CardTitle>
          <CardDescription>Tìm thấy {filteredData.length} khoản thu</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã</TableHead>
                <TableHead>Loại thu</TableHead>
                <TableHead>Nguồn thu</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Ngày thu</TableHead>
                <TableHead>Người thu</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={item.MaNganSach ?? (item.MaThu || `row-${index}`)}>
                  <TableCell className="font-medium text-green-600">{item.MaThu}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.LoaiThu}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[150px] truncate text-sm" title={item.NguonThu}>
                      {item.NguonThu}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-medium text-green-600">
                      <DollarSign className="h-3 w-3" />
                      {formatCurrency(item.SoTien)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {item.NgayThu}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{item.NguoiThu}</TableCell>
                  <TableCell>{getTrangThaiBadge(item.TrangThai)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {/* View Dialog */}
                      <Dialog open={isViewOpen && selectedThu?.MaThu === item.MaThu} onOpenChange={(open) => { setIsViewOpen(open); if (!open) setSelectedThu(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedThu(item); setIsViewOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Chi tiết khoản thu</DialogTitle>
                            <DialogDescription>Mã: {item.MaThu}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Loại thu</p>
                              <Badge variant="outline">{item.LoaiThu}</Badge>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Trạng thái</p>
                              {getTrangThaiBadge(item.TrangThai)}
                            </div>
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Nguồn thu</p>
                              <p className="font-medium">{item.NguonThu}</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Mô tả</p>
                              <p className="font-medium">{item.MoTa}</p>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3">Thông tin tài chính</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Số tiền thu</p>
                                  <p className="font-bold text-lg text-green-600">{formatCurrency(item.SoTien)}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Kế hoạch</p>
                                  <p className="font-medium">{item.SoTienKeHoach > 0 ? formatCurrency(item.SoTienKeHoach) : '-'}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Tỷ lệ đạt</p>
                                  <p className={`font-medium ${item.SoTienKeHoach > 0 && item.SoTien >= item.SoTienKeHoach ? 'text-green-600' : 'text-amber-600'}`}>
                                    {item.SoTienKeHoach > 0 ? `${Math.round((item.SoTien / item.SoTienKeHoach) * 100)}%` : '-'}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3">Thông tin người nộp</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Người nộp</p>
                                  <p className="font-medium">{item.NguoiNop}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Địa chỉ</p>
                                  <p className="font-medium">{item.DiaChi || '-'}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3">Thông tin giao dịch</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Ngày thu</p>
                                  <p className="font-medium">{item.NgayThu}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Người thu</p>
                                  <p className="font-medium">{item.NguoiThu}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Phương thức</p>
                                  <p className="font-medium">{item.PhuongThuc}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Số biên lai</p>
                                  <p className="font-medium">{item.SoBienLai}</p>
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
                      <Dialog open={isEditOpen && selectedThu?.MaThu === item.MaThu} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setSelectedThu(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedThu(item); setEditForm({ ...item }); setIsEditOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Cập nhật khoản thu</DialogTitle>
                            <DialogDescription>Mã: {item.MaThu}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin khoản thu</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Loại thu</Label>
                                  <Input value={editForm.LoaiThu} onChange={(e) => setEditForm((prev) => ({ ...prev, LoaiThu: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Nguồn thu</Label>
                                  <Input value={editForm.NguonThu} onChange={(e) => setEditForm((prev) => ({ ...prev, NguonThu: e.target.value }))} />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label>Mô tả</Label>
                                  <Textarea value={editForm.MoTa} onChange={(e) => setEditForm((prev) => ({ ...prev, MoTa: e.target.value }))} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin tài chính</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Số tiền (VNĐ)</Label>
                                  <Input type="number" value={editForm.SoTien} onChange={(e) => setEditForm((prev) => ({ ...prev, SoTien: toNumber(e.target.value) }))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Kế hoạch (VNĐ)</Label>
                                  <Input type="number" value={editForm.SoTienKeHoach} onChange={(e) => setEditForm((prev) => ({ ...prev, SoTienKeHoach: toNumber(e.target.value) }))} />
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

                            <div className="bg-amber-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin người nộp</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Người nộp</Label>
                                  <Input value={editForm.NguoiNop} onChange={(e) => setEditForm((prev) => ({ ...prev, NguoiNop: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Địa chỉ</Label>
                                  <Input value={editForm.DiaChi} onChange={(e) => setEditForm((prev) => ({ ...prev, DiaChi: e.target.value }))} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin giao dịch</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Ngày thu</Label>
                                  <Input type="date" value={editForm.NgayThu} onChange={(e) => setEditForm((prev) => ({ ...prev, NgayThu: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Người thu</Label>
                                  <Input value={editForm.NguoiThu} onChange={(e) => setEditForm((prev) => ({ ...prev, NguoiThu: e.target.value }))} />
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
                                  <Label>Số biên lai</Label>
                                  <Input value={editForm.SoBienLai} onChange={(e) => setEditForm((prev) => ({ ...prev, SoBienLai: e.target.value }))} />
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
