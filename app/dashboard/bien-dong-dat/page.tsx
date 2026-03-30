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
  Activity, TrendingUp, AlertCircle, BarChart3, Search, Plus, Download,
  Eye, Edit, CheckCircle2, Clock, XCircle, ArrowRightLeft, Scissors,
  Merge, FileText, User, Calendar, LandPlot
} from 'lucide-react';
import { bienDongDatApi } from '@/lib/api';

// Mock data biến động đất đai
interface BienDongDat {
  MaBienDongId?: number;
  MaBienDong: string;
  LoaiBienDong: string;
  MaThua: string;
  SoTo: string;
  DienTichCu: number;
  DienTichMoi: number;
  LoaiDatCu: string;
  LoaiDatMoi: string;
  ChuSoHuuCu: string;
  ChuSoHuuMoi: string;
  CCCDCu: string;
  CCCDMoi: string;
  NgayDeNghi: string;
  NgayDuyet: string;
  TrangThai: string;
  CanBoXuLy: string;
  LyDo: string;
  GhiChu: string;
}

const mockBienDong: BienDongDat[] = [
  {
    MaBienDong: 'BD001',
    LoaiBienDong: 'Chuyển mục đích sử dụng',
    MaThua: '123',
    SoTo: '45',
    DienTichCu: 250,
    DienTichMoi: 250,
    LoaiDatCu: 'Đất nông nghiệp',
    LoaiDatMoi: 'Đất ở',
    ChuSoHuuCu: 'Nguyễn Văn An',
    ChuSoHuuMoi: 'Nguyễn Văn An',
    CCCDCu: '001234567890',
    CCCDMoi: '001234567890',
    NgayDeNghi: '2025-01-05',
    NgayDuyet: '2025-01-15',
    TrangThai: 'Đã duyệt',
    CanBoXuLy: 'Trần Văn Bình',
    LyDo: 'Xây dựng nhà ở',
    GhiChu: ''
  },
  {
    MaBienDong: 'BD002',
    LoaiBienDong: 'Tách thửa',
    MaThua: '456',
    SoTo: '67',
    DienTichCu: 300,
    DienTichMoi: 150,
    LoaiDatCu: 'Đất ở',
    LoaiDatMoi: 'Đất ở',
    ChuSoHuuCu: 'Trần Thị Bình',
    ChuSoHuuMoi: 'Trần Văn Cường (con)',
    CCCDCu: '001234567891',
    CCCDMoi: '001234567899',
    NgayDeNghi: '2025-01-10',
    NgayDuyet: '',
    TrangThai: 'Chờ duyệt',
    CanBoXuLy: 'Nguyễn Thị Lan',
    LyDo: 'Chia tài sản cho con',
    GhiChu: 'Hồ sơ đầy đủ, đang chờ lãnh đạo ký'
  },
  {
    MaBienDong: 'BD003',
    LoaiBienDong: 'Gộp thửa',
    MaThua: '789, 790',
    SoTo: '89',
    DienTichCu: 500,
    DienTichMoi: 500,
    LoaiDatCu: 'Đất nông nghiệp',
    LoaiDatMoi: 'Đất nông nghiệp',
    ChuSoHuuCu: 'Lê Văn Dũng',
    ChuSoHuuMoi: 'Lê Văn Dũng',
    CCCDCu: '001234567892',
    CCCDMoi: '001234567892',
    NgayDeNghi: '2025-01-08',
    NgayDuyet: '',
    TrangThai: 'Đang xử lý',
    CanBoXuLy: 'Phạm Thị Em',
    LyDo: 'Gộp các thửa liền kề để thuận tiện canh tác',
    GhiChu: 'Đang đo đạc thực địa'
  },
  {
    MaBienDong: 'BD004',
    LoaiBienDong: 'Chuyển nhượng',
    MaThua: '234',
    SoTo: '12',
    DienTichCu: 120,
    DienTichMoi: 120,
    LoaiDatCu: 'Đất ở',
    LoaiDatMoi: 'Đất ở',
    ChuSoHuuCu: 'Phạm Văn Phát',
    ChuSoHuuMoi: 'Hoàng Thị Giang',
    CCCDCu: '001234567893',
    CCCDMoi: '001234567894',
    NgayDeNghi: '2025-01-12',
    NgayDuyet: '2025-01-18',
    TrangThai: 'Đã duyệt',
    CanBoXuLy: 'Trần Văn Bình',
    LyDo: 'Mua bán chuyển nhượng',
    GhiChu: 'Đã hoàn tất thủ tục sang tên'
  },
  {
    MaBienDong: 'BD005',
    LoaiBienDong: 'Thừa kế',
    MaThua: '567',
    SoTo: '34',
    DienTichCu: 200,
    DienTichMoi: 200,
    LoaiDatCu: 'Đất ở',
    LoaiDatMoi: 'Đất ở',
    ChuSoHuuCu: 'Nguyễn Văn Hải (đã mất)',
    ChuSoHuuMoi: 'Nguyễn Thị Hương (con gái)',
    CCCDCu: '001234567895',
    CCCDMoi: '001234567896',
    NgayDeNghi: '2025-01-03',
    NgayDuyet: '2025-01-10',
    TrangThai: 'Đã duyệt',
    CanBoXuLy: 'Nguyễn Thị Lan',
    LyDo: 'Thừa kế theo di chúc',
    GhiChu: ''
  },
  {
    MaBienDong: 'BD006',
    LoaiBienDong: 'Chuyển mục đích sử dụng',
    MaThua: '890',
    SoTo: '56',
    DienTichCu: 500,
    DienTichMoi: 500,
    LoaiDatCu: 'Đất nông nghiệp',
    LoaiDatMoi: 'Đất thương mại',
    ChuSoHuuCu: 'Công ty TNHH ABC',
    ChuSoHuuMoi: 'Công ty TNHH ABC',
    CCCDCu: '0100123456',
    CCCDMoi: '0100123456',
    NgayDeNghi: '2025-01-15',
    NgayDuyet: '',
    TrangThai: 'Từ chối',
    CanBoXuLy: 'Phạm Thị Em',
    LyDo: 'Xây dựng nhà xưởng',
    GhiChu: 'Vị trí thuộc quy hoạch đất nông nghiệp, không được chuyển đổi'
  },
  {
    MaBienDong: 'BD007',
    LoaiBienDong: 'Tặng cho',
    MaThua: '345',
    SoTo: '78',
    DienTichCu: 180,
    DienTichMoi: 180,
    LoaiDatCu: 'Đất ở',
    LoaiDatMoi: 'Đất ở',
    ChuSoHuuCu: 'Lê Thị Kim',
    ChuSoHuuMoi: 'Lê Văn Long (cháu)',
    CCCDCu: '001234567897',
    CCCDMoi: '001234567898',
    NgayDeNghi: '2025-01-18',
    NgayDuyet: '',
    TrangThai: 'Chờ duyệt',
    CanBoXuLy: 'Trần Văn Bình',
    LyDo: 'Bà ngoại tặng cho cháu',
    GhiChu: 'Đã có hợp đồng tặng cho công chứng'
  }
];

const loaiBienDongOptions = ['Chuyển mục đích sử dụng', 'Tách thửa', 'Gộp thửa', 'Chuyển nhượng', 'Thừa kế', 'Tặng cho', 'Góp vốn'];
const trangThaiOptions = ['Chờ duyệt', 'Đang xử lý', 'Đã duyệt', 'Từ chối'];
const loaiDatOptions = ['Đất ở', 'Đất nông nghiệp', 'Đất thương mại', 'Đất công cộng', 'Đất hỗn hợp'];

const emptyBienDongForm: BienDongDat = {
  MaBienDong: '',
  LoaiBienDong: '',
  MaThua: '',
  SoTo: '',
  DienTichCu: 0,
  DienTichMoi: 0,
  LoaiDatCu: '',
  LoaiDatMoi: '',
  ChuSoHuuCu: '',
  ChuSoHuuMoi: '',
  CCCDCu: '',
  CCCDMoi: '',
  NgayDeNghi: '',
  NgayDuyet: '',
  TrangThai: 'Chờ duyệt',
  CanBoXuLy: '',
  LyDo: '',
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

function mapFromApi(item: any): BienDongDat {
  const id = Number(item.MaBienDong);
  return {
    MaBienDongId: Number.isFinite(id) ? id : undefined,
    MaBienDong: item.MaBienDongText || (Number.isFinite(id) ? `BD${String(id).padStart(3, '0')}` : ''),
    LoaiBienDong: item.LoaiBienDong || '',
    MaThua: item.MaThua || '',
    SoTo: item.SoTo || '',
    DienTichCu: toNumber(item.DienTichCu),
    DienTichMoi: toNumber(item.DienTichMoi),
    LoaiDatCu: item.LoaiDatCu || '',
    LoaiDatMoi: item.LoaiDatMoi || '',
    ChuSoHuuCu: item.ChuSoHuuCu || '',
    ChuSoHuuMoi: item.ChuSoHuuMoi || '',
    CCCDCu: item.CCCDCu || '',
    CCCDMoi: item.CCCDMoi || '',
    NgayDeNghi: toDateString(item.NgayDeNghi),
    NgayDuyet: toDateString(item.NgayDuyet),
    TrangThai: item.TrangThai || 'Chờ duyệt',
    CanBoXuLy: item.CanBoXuLy || '',
    LyDo: item.LyDo || '',
    GhiChu: item.GhiChu || '',
  };
}

export default function BienDongDatPage() {
  const [records, setRecords] = useState<BienDongDat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterLoaiBD, setFilterLoaiBD] = useState<string>('all');
  const [selectedBienDong, setSelectedBienDong] = useState<BienDongDat | null>(null);
  const [addForm, setAddForm] = useState<BienDongDat>(emptyBienDongForm);
  const [editForm, setEditForm] = useState<BienDongDat>(emptyBienDongForm);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const loadData = async () => {
    const result = await bienDongDatApi.getList({ page: 1, limit: 5000, loaiBanGhi: 'BIEN_DONG_DAT' });
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
      LoaiBanGhi: 'BIEN_DONG_DAT',
      MaBienDongText: addForm.MaBienDong || null,
      MaThua: addForm.MaThua || '',
      LoaiBienDong: addForm.LoaiBienDong || '',
      NgayBienDong: addForm.NgayDeNghi || new Date().toISOString().slice(0, 10),
      SoTo: addForm.SoTo || null,
      DienTichCu: toNumber(addForm.DienTichCu),
      DienTichMoi: toNumber(addForm.DienTichMoi),
      LoaiDatCu: addForm.LoaiDatCu || null,
      LoaiDatMoi: addForm.LoaiDatMoi || null,
      ChuSoHuuCu: addForm.ChuSoHuuCu || null,
      ChuSoHuuMoi: addForm.ChuSoHuuMoi || null,
      CCCDCu: addForm.CCCDCu || null,
      CCCDMoi: addForm.CCCDMoi || null,
      NgayDeNghi: addForm.NgayDeNghi || null,
      NgayDuyet: addForm.NgayDuyet || null,
      TrangThai: addForm.TrangThai || 'Chờ duyệt',
      CanBoXuLy: addForm.CanBoXuLy || null,
      LyDo: addForm.LyDo || null,
      GhiChu: addForm.GhiChu || null,
    };

    const result = await bienDongDatApi.create(payload);
    if (!result.success) {
      alert(result.message || 'Không thể tạo biến động đất đai');
      return;
    }

    setIsAddOpen(false);
    setAddForm(emptyBienDongForm);
    await loadData();
  };

  const handleUpdate = async () => {
    if (!selectedBienDong?.MaBienDongId) {
      alert('Không xác định được bản ghi để cập nhật');
      return;
    }

    const payload = {
      MaBienDongText: editForm.MaBienDong || null,
      MaThua: editForm.MaThua || '',
      LoaiBienDong: editForm.LoaiBienDong || '',
      NgayBienDong: editForm.NgayDeNghi || new Date().toISOString().slice(0, 10),
      SoTo: editForm.SoTo || null,
      DienTichCu: toNumber(editForm.DienTichCu),
      DienTichMoi: toNumber(editForm.DienTichMoi),
      LoaiDatCu: editForm.LoaiDatCu || null,
      LoaiDatMoi: editForm.LoaiDatMoi || null,
      ChuSoHuuCu: editForm.ChuSoHuuCu || null,
      ChuSoHuuMoi: editForm.ChuSoHuuMoi || null,
      CCCDCu: editForm.CCCDCu || null,
      CCCDMoi: editForm.CCCDMoi || null,
      NgayDeNghi: editForm.NgayDeNghi || null,
      NgayDuyet: editForm.NgayDuyet || null,
      TrangThai: editForm.TrangThai || 'Chờ duyệt',
      CanBoXuLy: editForm.CanBoXuLy || null,
      LyDo: editForm.LyDo || null,
      GhiChu: editForm.GhiChu || null,
    };

    const result = await bienDongDatApi.update(selectedBienDong.MaBienDongId, payload);
    if (!result.success) {
      alert(result.message || 'Không thể cập nhật biến động đất đai');
      return;
    }

    setIsEditOpen(false);
    setSelectedBienDong(null);
    setEditForm(emptyBienDongForm);
    await loadData();
  };

  const handleViewDialogChange = (open: boolean) => {
    setIsViewOpen(open);
    if (!open) setSelectedBienDong(null);
  };

  const handleEditDialogChange = (open: boolean) => {
    setIsEditOpen(open);
    if (!open) setSelectedBienDong(null);
  };

  const filteredData = records.filter((item) => {
    const matchesSearch =
      item.MaBienDong.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ChuSoHuuCu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ChuSoHuuMoi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.MaThua.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || item.TrangThai === filterStatus;
    const matchesLoaiBD = filterLoaiBD === 'all' || item.LoaiBienDong === filterLoaiBD;
    return matchesSearch && matchesStatus && matchesLoaiBD;
  });

  const stats = {
    total: records.length,
    chuyenMDSD: records.filter(r => r.LoaiBienDong === 'Chuyển mục đích sử dụng').length,
    tachGop: records.filter(r => r.LoaiBienDong === 'Tách thửa' || r.LoaiBienDong === 'Gộp thửa').length,
    chuyenNhuong: records.filter(r => r.LoaiBienDong === 'Chuyển nhượng' || r.LoaiBienDong === 'Thừa kế' || r.LoaiBienDong === 'Tặng cho').length,
    choDuyet: records.filter(r => r.TrangThai === 'Chờ duyệt').length,
    daDuyet: records.filter(r => r.TrangThai === 'Đã duyệt').length
  };

  const getTrangThaiBadge = (trangThai: string) => {
    switch (trangThai) {
      case 'Đã duyệt': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Đang xử lý': return <Badge className="bg-blue-500 hover:bg-blue-600"><Activity className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Chờ duyệt': return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Từ chối': return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      default: return <Badge variant="secondary">{trangThai}</Badge>;
    }
  };

  const getLoaiBienDongIcon = (loai: string) => {
    switch (loai) {
      case 'Chuyển mục đích sử dụng': return <ArrowRightLeft className="h-4 w-4" />;
      case 'Tách thửa': return <Scissors className="h-4 w-4" />;
      case 'Gộp thửa': return <Merge className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-status-success via-secondary to-status-success p-4 sm:p-5 xl:p-6 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Quản lý Biến động Đất đai</h1>
                <p className="text-sm sm:text-base text-white/90">Theo dõi chuyển đổi, tách gộp, chuyển nhượng quyền sử dụng đất</p>
              </div>
            </div>
            <Dialog
              open={isAddOpen}
              onOpenChange={(open) => {
                setIsAddOpen(open);
                if (open) setAddForm(emptyBienDongForm);
              }}
            >
              <DialogTrigger asChild>
                <Button className="w-full 2xl:w-auto bg-white text-status-success hover:bg-white/90">
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Thêm biến động</span>
                  <span className="sm:hidden">Thêm</span>
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ghi nhận biến động đất đai mới</DialogTitle>
                <DialogDescription>Nhập thông tin biến động sử dụng đất</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Loại biến động *</Label>
                  <Select value={addForm.LoaiBienDong || undefined} onValueChange={(value) => setAddForm((prev) => ({ ...prev, LoaiBienDong: value }))}>
                    <SelectTrigger><SelectValue placeholder="Chọn loại biến động" /></SelectTrigger>
                    <SelectContent>
                      {loaiBienDongOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
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
                  <Label>Diện tích cũ (m²)</Label>
                  <Input type="number" placeholder="Nhập diện tích" value={addForm.DienTichCu} onChange={(e) => setAddForm((prev) => ({ ...prev, DienTichCu: toNumber(e.target.value) }))} />
                </div>
                <div className="space-y-2">
                  <Label>Diện tích mới (m²)</Label>
                  <Input type="number" placeholder="Nhập diện tích" value={addForm.DienTichMoi} onChange={(e) => setAddForm((prev) => ({ ...prev, DienTichMoi: toNumber(e.target.value) }))} />
                </div>
                <div className="space-y-2">
                  <Label>Loại đất cũ</Label>
                  <Select value={addForm.LoaiDatCu || undefined} onValueChange={(value) => setAddForm((prev) => ({ ...prev, LoaiDatCu: value }))}>
                    <SelectTrigger><SelectValue placeholder="Chọn loại đất" /></SelectTrigger>
                    <SelectContent>
                      {loaiDatOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Loại đất mới</Label>
                  <Select value={addForm.LoaiDatMoi || undefined} onValueChange={(value) => setAddForm((prev) => ({ ...prev, LoaiDatMoi: value }))}>
                    <SelectTrigger><SelectValue placeholder="Chọn loại đất" /></SelectTrigger>
                    <SelectContent>
                      {loaiDatOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Chủ sở hữu cũ *</Label>
                  <Input placeholder="Nhập tên chủ sở hữu cũ" value={addForm.ChuSoHuuCu} onChange={(e) => setAddForm((prev) => ({ ...prev, ChuSoHuuCu: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>CCCD cũ</Label>
                  <Input placeholder="Nhập CCCD" value={addForm.CCCDCu} onChange={(e) => setAddForm((prev) => ({ ...prev, CCCDCu: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Chủ sở hữu mới *</Label>
                  <Input placeholder="Nhập tên chủ sở hữu mới" value={addForm.ChuSoHuuMoi} onChange={(e) => setAddForm((prev) => ({ ...prev, ChuSoHuuMoi: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>CCCD mới</Label>
                  <Input placeholder="Nhập CCCD" value={addForm.CCCDMoi} onChange={(e) => setAddForm((prev) => ({ ...prev, CCCDMoi: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Cán bộ xử lý</Label>
                  <Input placeholder="Tên cán bộ" value={addForm.CanBoXuLy} onChange={(e) => setAddForm((prev) => ({ ...prev, CanBoXuLy: e.target.value }))} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Lý do biến động</Label>
                  <Textarea placeholder="Nhập lý do" value={addForm.LyDo} onChange={(e) => setAddForm((prev) => ({ ...prev, LyDo: e.target.value }))} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Ghi chú</Label>
                  <Textarea placeholder="Nhập ghi chú" value={addForm.GhiChu} onChange={(e) => setAddForm((prev) => ({ ...prev, GhiChu: e.target.value }))} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Hủy</Button>
                <Button onClick={handleCreate}>Lưu biến động</Button>
              </DialogFooter>
            </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Tổng biến động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-xl sm:text-2xl font-bold">{stats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Chuyển MĐSD</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
              <span className="text-xl sm:text-2xl font-bold">{stats.chuyenMDSD}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Tách/Gộp thửa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Scissors className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
              <span className="text-xl sm:text-2xl font-bold">{stats.tachGop}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-status-warning">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Chuyển quyền</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-status-warning" />
              <span className="text-xl sm:text-2xl font-bold">{stats.chuyenNhuong}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-status-warning">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Chờ duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-status-warning" />
              <span className="text-xl sm:text-2xl font-bold">{stats.choDuyet}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-status-success">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Đã duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-status-success" />
              <span className="text-xl sm:text-2xl font-bold">{stats.daDuyet}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo mã, chủ sở hữu, mã thửa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 sm:h-11"
              />
            </div>
            <Select value={filterLoaiBD} onValueChange={setFilterLoaiBD}>
              <SelectTrigger className="w-full sm:w-[200px] h-10 sm:h-11">
                <SelectValue placeholder="Loại biến động" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {loaiBienDongOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px] h-10 sm:h-11">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {trangThaiOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full sm:w-auto h-10 sm:h-11">
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Xuất Excel</span>
              <span className="sm:hidden">Xuất</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Danh sách biến động đất đai</CardTitle>
          <CardDescription>Tìm thấy {filteredData.length} biến động</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs sm:text-sm">Mã BD</TableHead>
                  <TableHead className="text-xs sm:text-sm">Loại biến động</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden md:table-cell">Thửa/Tờ</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Chủ cũ → Mới</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm hidden xl:table-cell">DT cũ/mới</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Loại đất</TableHead>
                  <TableHead className="text-xs sm:text-sm hidden md:table-cell">Ngày đề nghị</TableHead>
                  <TableHead className="text-xs sm:text-sm">Trạng thái</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.MaBienDong}>
                    <TableCell className="font-medium text-primary text-xs sm:text-sm p-3 sm:p-4">{item.MaBienDong}</TableCell>
                    <TableCell className="p-3 sm:p-4">
                      <div className="flex items-center gap-2">
                        {getLoaiBienDongIcon(item.LoaiBienDong)}
                        <span className="text-xs sm:text-sm">{item.LoaiBienDong}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell p-3 sm:p-4">
                      <div className="text-xs sm:text-sm">
                        <div>Thửa: {item.MaThua}</div>
                        <div className="text-muted-foreground">Tờ: {item.SoTo}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell p-3 sm:p-4">
                      <div className="text-xs sm:text-sm">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {item.ChuSoHuuCu}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          → {item.ChuSoHuuMoi}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right hidden xl:table-cell p-3 sm:p-4">
                      <div className="text-xs sm:text-sm">
                        <div>{item.DienTichCu} m²</div>
                        <div className="text-muted-foreground">→ {item.DienTichMoi} m²</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell p-3 sm:p-4">
                      <div className="text-xs sm:text-sm">
                        <div>{item.LoaiDatCu}</div>
                        {item.LoaiDatCu !== item.LoaiDatMoi && (
                          <div className="text-status-success">→ {item.LoaiDatMoi}</div>
                        )}
                      </div>
                    </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {item.NgayDeNghi}
                    </div>
                  </TableCell>
                  <TableCell>{getTrangThaiBadge(item.TrangThai)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {/* View Dialog */}
                      <Dialog open={isViewOpen && selectedBienDong?.MaBienDong === item.MaBienDong} onOpenChange={handleViewDialogChange}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedBienDong(item); setIsViewOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Chi tiết biến động đất đai</DialogTitle>
                            <DialogDescription>Mã biến động: {item.MaBienDong}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Loại biến động</p>
                              <p className="font-medium flex items-center gap-2">{getLoaiBienDongIcon(item.LoaiBienDong)} {item.LoaiBienDong}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Trạng thái</p>
                              {getTrangThaiBadge(item.TrangThai)}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Mã thửa / Số tờ</p>
                              <p className="font-medium">{item.MaThua} / {item.SoTo}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Ngày đề nghị</p>
                              <p className="font-medium">{item.NgayDeNghi}</p>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3">Thông tin trước biến động</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Chủ sở hữu</p>
                                  <p className="font-medium">{item.ChuSoHuuCu}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">CCCD</p>
                                  <p className="font-medium">{item.CCCDCu}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Diện tích</p>
                                  <p className="font-medium">{item.DienTichCu} m²</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Loại đất</p>
                                  <p className="font-medium">{item.LoaiDatCu}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3">Thông tin sau biến động</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Chủ sở hữu</p>
                                  <p className="font-medium">{item.ChuSoHuuMoi}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">CCCD</p>
                                  <p className="font-medium">{item.CCCDMoi}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Diện tích</p>
                                  <p className="font-medium">{item.DienTichMoi} m²</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Loại đất</p>
                                  <p className="font-medium">{item.LoaiDatMoi}</p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Cán bộ xử lý</p>
                              <p className="font-medium">{item.CanBoXuLy}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Ngày duyệt</p>
                              <p className="font-medium">{item.NgayDuyet || 'Chưa duyệt'}</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Lý do biến động</p>
                              <p className="font-medium">{item.LyDo}</p>
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
                      <Dialog open={isEditOpen && selectedBienDong?.MaBienDong === item.MaBienDong} onOpenChange={handleEditDialogChange}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedBienDong(item); setEditForm({ ...item }); setIsEditOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Cập nhật biến động</DialogTitle>
                            <DialogDescription>Mã biến động: {item.MaBienDong}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin biến động</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label>Loại biến động</Label>
                                  <Input value={editForm.LoaiBienDong} onChange={(e) => setEditForm((prev) => ({ ...prev, LoaiBienDong: e.target.value }))} />
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
                                  <Label>Ngày đề nghị</Label>
                                  <Input type="date" value={editForm.NgayDeNghi} onChange={(e) => setEditForm((prev) => ({ ...prev, NgayDeNghi: e.target.value }))} />
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
                              <div className="space-y-2 mt-4">
                                <Label>Lý do biến động</Label>
                                <Textarea value={editForm.LyDo} onChange={(e) => setEditForm((prev) => ({ ...prev, LyDo: e.target.value }))} rows={2} />
                              </div>
                            </div>

                            <div className="bg-amber-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin trước biến động</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Chủ sở hữu cũ</Label>
                                  <Input value={editForm.ChuSoHuuCu} onChange={(e) => setEditForm((prev) => ({ ...prev, ChuSoHuuCu: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>CCCD cũ</Label>
                                  <Input value={editForm.CCCDCu} onChange={(e) => setEditForm((prev) => ({ ...prev, CCCDCu: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Diện tích cũ (m²)</Label>
                                  <Input type="number" value={editForm.DienTichCu} onChange={(e) => setEditForm((prev) => ({ ...prev, DienTichCu: toNumber(e.target.value) }))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Loại đất cũ</Label>
                                  <Input value={editForm.LoaiDatCu} onChange={(e) => setEditForm((prev) => ({ ...prev, LoaiDatCu: e.target.value }))} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin sau biến động</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Chủ sở hữu mới</Label>
                                  <Input value={editForm.ChuSoHuuMoi} onChange={(e) => setEditForm((prev) => ({ ...prev, ChuSoHuuMoi: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>CCCD mới</Label>
                                  <Input value={editForm.CCCDMoi} onChange={(e) => setEditForm((prev) => ({ ...prev, CCCDMoi: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Diện tích mới (m²)</Label>
                                  <Input type="number" value={editForm.DienTichMoi} onChange={(e) => setEditForm((prev) => ({ ...prev, DienTichMoi: toNumber(e.target.value) }))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Loại đất mới</Label>
                                  <Input value={editForm.LoaiDatMoi} onChange={(e) => setEditForm((prev) => ({ ...prev, LoaiDatMoi: e.target.value }))} />
                                </div>
                              </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Xử lý</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Cán bộ xử lý</Label>
                                  <Input value={editForm.CanBoXuLy} onChange={(e) => setEditForm((prev) => ({ ...prev, CanBoXuLy: e.target.value }))} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Ngày duyệt</Label>
                                  <Input type="date" value={editForm.NgayDuyet} onChange={(e) => setEditForm((prev) => ({ ...prev, NgayDuyet: e.target.value }))} />
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

