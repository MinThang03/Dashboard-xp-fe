'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  PartyPopper, 
  Plus, 
  Search, 
  Calendar,
  Users,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Clock
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LeHoi {
  MaLeHoi: string;
  TenLeHoi: string;
  DiaDiem: string;
  ThoiGian: string;
  QuyMo: number;
  DuKien: number;
  TrangThai: 'Hoàn thành' | 'Sắp diễn ra' | 'Đang chuẩn bị' | 'Đang diễn ra';
  LoaiLeHoi: string;
  NguoiChuTri: string;
  KinhPhi: number;
  MoTa: string;
}

const mockLeHoi: LeHoi[] = [
  {
    MaLeHoi: 'LH001',
    TenLeHoi: 'Lễ hội mùa xuân',
    DiaDiem: 'Đình làng Phú Xá',
    ThoiGian: '2026-02-15',
    QuyMo: 5000,
    DuKien: 5200,
    TrangThai: 'Hoàn thành',
    LoaiLeHoi: 'Truyền thống',
    NguoiChuTri: 'UBND xã Mẫu',
    KinhPhi: 150000000,
    MoTa: 'Lễ hội đầu xuân với các hoạt động văn hóa dân gian'
  },
  {
    MaLeHoi: 'LH002',
    TenLeHoi: 'Hội làng truyền thống',
    DiaDiem: 'Đền Đồng Cổ',
    ThoiGian: '2026-03-15',
    QuyMo: 2000,
    DuKien: 2500,
    TrangThai: 'Sắp diễn ra',
    LoaiLeHoi: 'Truyền thống',
    NguoiChuTri: 'Ban quản lý di tích',
    KinhPhi: 80000000,
    MoTa: 'Lễ hội làng với các nghi lễ tâm linh'
  },
  {
    MaLeHoi: 'LH003',
    TenLeHoi: 'Hội chợ văn hóa',
    DiaDiem: 'Sân UBND xã',
    ThoiGian: '2026-04-30',
    QuyMo: 8000,
    DuKien: 10000,
    TrangThai: 'Đang chuẩn bị',
    LoaiLeHoi: 'Văn hóa',
    NguoiChuTri: 'UBND xã Mẫu',
    KinhPhi: 200000000,
    MoTa: 'Hội chợ giới thiệu sản phẩm văn hóa địa phương'
  },
  {
    MaLeHoi: 'LH004',
    TenLeHoi: 'Festival âm nhạc',
    DiaDiem: 'Công viên xã',
    ThoiGian: '2026-06-01',
    QuyMo: 3000,
    DuKien: 3500,
    TrangThai: 'Đang chuẩn bị',
    LoaiLeHoi: 'Giải trí',
    NguoiChuTri: 'Phòng VH-TT',
    KinhPhi: 120000000,
    MoTa: 'Festival âm nhạc trẻ với các nghệ sĩ địa phương'
  },
  {
    MaLeHoi: 'LH005',
    TenLeHoi: 'Ngày hội thể thao',
    DiaDiem: 'Sân vận động xã',
    ThoiGian: '2026-05-10',
    QuyMo: 1500,
    DuKien: 1800,
    TrangThai: 'Đang chuẩn bị',
    LoaiLeHoi: 'Thể thao',
    NguoiChuTri: 'Phòng GDDT',
    KinhPhi: 60000000,
    MoTa: 'Ngày hội thể thao phong trào toàn dân'
  },
  {
    MaLeHoi: 'LH006',
    TenLeHoi: 'Lễ kỷ niệm thành lập',
    DiaDiem: 'UBND xã Mẫu',
    ThoiGian: '2026-07-20',
    QuyMo: 1000,
    DuKien: 1200,
    TrangThai: 'Đang chuẩn bị',
    LoaiLeHoi: 'Kỷ niệm',
    NguoiChuTri: 'UBND xã Mẫu',
    KinhPhi: 100000000,
    MoTa: 'Lễ kỷ niệm ngày thành lập xã'
  },
  {
    MaLeHoi: 'LH007',
    TenLeHoi: 'Hội xuân 2025',
    DiaDiem: 'Chùa Bồ Đề',
    ThoiGian: '2026-01-28',
    QuyMo: 4000,
    DuKien: 4500,
    TrangThai: 'Hoàn thành',
    LoaiLeHoi: 'Tôn giáo',
    NguoiChuTri: 'Ban quản lý chùa',
    KinhPhi: 90000000,
    MoTa: 'Hội xuân tại chùa với các hoạt động tâm linh'
  },
  {
    MaLeHoi: 'LH008',
    TenLeHoi: 'Ngày hội du lịch',
    DiaDiem: 'Toàn xã',
    ThoiGian: '2026-08-15',
    QuyMo: 6000,
    DuKien: 7000,
    TrangThai: 'Đang chuẩn bị',
    LoaiLeHoi: 'Du lịch',
    NguoiChuTri: 'Phòng VH-TT',
    KinhPhi: 180000000,
    MoTa: 'Ngày hội quảng bá du lịch địa phương'
  }
];

const trangThaiColors = {
  'Hoàn thành': 'bg-green-100 text-green-700',
  'Sắp diễn ra': 'bg-blue-100 text-blue-700',
  'Đang chuẩn bị': 'bg-yellow-100 text-yellow-700',
  'Đang diễn ra': 'bg-purple-100 text-purple-700'
};

export default function LeHoiPage() {
  const [leHoiList, setLeHoiList] = useState<LeHoi[]>(mockLeHoi);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrangThai, setSelectedTrangThai] = useState<string>('all');
  const [viewDialog, setViewDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [addDialog, setAddDialog] = useState(false);
  const [selectedLeHoi, setSelectedLeHoi] = useState<LeHoi | null>(null);
  const [formData, setFormData] = useState<Partial<LeHoi>>({});

  // Thống kê
  const tongLeHoi = leHoiList.length;
  const sapDienRa = leHoiList.filter(lh => lh.TrangThai === 'Sắp diễn ra').length;
  const tongNguoiThamGia = leHoiList.reduce((sum, lh) => sum + lh.QuyMo, 0);
  const tongKinhPhi = leHoiList.reduce((sum, lh) => sum + lh.KinhPhi, 0);

  // Dữ liệu biểu đồ quy mô
  const chartData = leHoiList.slice(0, 6).map(lh => ({
    name: lh.TenLeHoi.length > 15 ? lh.TenLeHoi.substring(0, 15) + '...' : lh.TenLeHoi,
    'Dự kiến': lh.DuKien,
    'Thực tế': lh.QuyMo
  }));

  // Lọc
  const filteredLeHoi = leHoiList.filter(lh => {
    const matchSearch = lh.TenLeHoi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       lh.DiaDiem.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       lh.LoaiLeHoi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTrangThai = selectedTrangThai === 'all' || lh.TrangThai === selectedTrangThai;
    return matchSearch && matchTrangThai;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const handleView = (leHoi: LeHoi) => {
    setSelectedLeHoi(leHoi);
    setViewDialog(true);
  };

  const handleEdit = (leHoi: LeHoi) => {
    setSelectedLeHoi(leHoi);
    setFormData(leHoi);
    setEditDialog(true);
  };

  const handleAdd = () => {
    setFormData({
      TrangThai: 'Đang chuẩn bị',
      QuyMo: 0,
      DuKien: 0,
      KinhPhi: 0
    });
    setAddDialog(true);
  };

  const handleDelete = (maLeHoi: string) => {
    if (confirm('Bạn có chắc muốn xóa lễ hội này?')) {
      setLeHoiList(leHoiList.filter(lh => lh.MaLeHoi !== maLeHoi));
    }
  };

  const handleSaveEdit = () => {
    if (selectedLeHoi && formData) {
      setLeHoiList(leHoiList.map(lh =>
        lh.MaLeHoi === selectedLeHoi.MaLeHoi ? { ...lh, ...formData } : lh
      ));
      setEditDialog(false);
    }
  };

  const handleSaveAdd = () => {
    if (formData.TenLeHoi) {
      const newLeHoi: LeHoi = {
        MaLeHoi: `LH${String(leHoiList.length + 1).padStart(3, '0')}`,
        TenLeHoi: formData.TenLeHoi || '',
        DiaDiem: formData.DiaDiem || '',
        ThoiGian: formData.ThoiGian || '',
        QuyMo: formData.QuyMo || 0,
        DuKien: formData.DuKien || 0,
        TrangThai: (formData.TrangThai as LeHoi['TrangThai']) || 'Đang chuẩn bị',
        LoaiLeHoi: formData.LoaiLeHoi || '',
        NguoiChuTri: formData.NguoiChuTri || '',
        KinhPhi: formData.KinhPhi || 0,
        MoTa: formData.MoTa || ''
      };
      setLeHoiList([...leHoiList, newLeHoi]);
      setAddDialog(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary via-accent to-primary p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <PartyPopper className="h-10 w-10" />
            <h1 className="text-3xl font-bold">Lễ hội - Sự kiện</h1>
          </div>
          <p className="text-pink-50">Quản lý lễ hội, sự kiện văn hóa địa phương</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lễ hội/năm</CardTitle>
            <PartyPopper className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">{tongLeHoi}</div>
            <p className="text-xs text-muted-foreground">Tổng số lễ hội</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sắp diễn ra</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{sapDienRa}</div>
            <p className="text-xs text-muted-foreground">Sự kiện sắp tới</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người tham gia</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{tongNguoiThamGia.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Tổng lượt tham gia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kinh phí</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {(tongKinhPhi / 1000000).toFixed(0)}M
            </div>
            <p className="text-xs text-muted-foreground">Tổng kinh phí (VNĐ)</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Quy mô lễ hội</CardTitle>
          <CardDescription>So sánh dự kiến và thực tế người tham gia</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Dự kiến" fill="#a855f7" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Thực tế" fill="#ec4899" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Danh sách Lễ hội</CardTitle>
              <CardDescription>Quản lý {filteredLeHoi.length} lễ hội và sự kiện</CardDescription>
            </div>
            <Button onClick={handleAdd} className="bg-pink-600 hover:bg-pink-700">
              <Plus className="mr-2 h-4 w-4" />
              Thêm lễ hội
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm lễ hội..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedTrangThai} onValueChange={setSelectedTrangThai}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                <SelectItem value="Sắp diễn ra">Sắp diễn ra</SelectItem>
                <SelectItem value="Đang chuẩn bị">Đang chuẩn bị</SelectItem>
                <SelectItem value="Đang diễn ra">Đang diễn ra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Tên lễ hội</TableHead>
                  <TableHead>Địa điểm</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Quy mô</TableHead>
                  <TableHead>Kinh phí</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeHoi.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                      Không tìm thấy lễ hội nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeHoi.map((leHoi) => (
                    <TableRow key={leHoi.MaLeHoi}>
                      <TableCell className="font-medium">{leHoi.MaLeHoi}</TableCell>
                      <TableCell className="font-medium">{leHoi.TenLeHoi}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {leHoi.DiaDiem}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {leHoi.ThoiGian}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{leHoi.LoaiLeHoi}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          {leHoi.QuyMo.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {(leHoi.KinhPhi / 1000000).toFixed(0)}M
                      </TableCell>
                      <TableCell>
                        <Badge className={trangThaiColors[leHoi.TrangThai]}>
                          {leHoi.TrangThai}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(leHoi)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(leHoi)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(leHoi.MaLeHoi)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PartyPopper className="h-5 w-5 text-pink-600" />
              Chi tiết Lễ hội
            </DialogTitle>
            <DialogDescription>Thông tin chi tiết về lễ hội</DialogDescription>
          </DialogHeader>
          {selectedLeHoi && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Mã lễ hội</Label>
                  <p className="font-medium">{selectedLeHoi.MaLeHoi}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tên lễ hội</Label>
                  <p className="font-medium">{selectedLeHoi.TenLeHoi}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Địa điểm</Label>
                  <p className="font-medium">{selectedLeHoi.DiaDiem}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Thời gian</Label>
                  <p className="font-medium">{selectedLeHoi.ThoiGian}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Loại lễ hội</Label>
                  <p className="font-medium">{selectedLeHoi.LoaiLeHoi}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Trạng thái</Label>
                  <div className="mt-1">
                    <Badge className={trangThaiColors[selectedLeHoi.TrangThai]}>
                      {selectedLeHoi.TrangThai}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Quy mô thực tế</Label>
                  <p className="font-medium">{selectedLeHoi.QuyMo.toLocaleString()} người</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Dự kiến</Label>
                  <p className="font-medium">{selectedLeHoi.DuKien.toLocaleString()} người</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Người chủ trì</Label>
                  <p className="font-medium">{selectedLeHoi.NguoiChuTri}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Kinh phí</Label>
                  <p className="font-medium">{formatCurrency(selectedLeHoi.KinhPhi)}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Mô tả</Label>
                <p className="font-medium">{selectedLeHoi.MoTa}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Lễ hội</DialogTitle>
            <DialogDescription>Cập nhật thông tin lễ hội</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tên lễ hội *</Label>
                <Input
                  value={formData.TenLeHoi || ''}
                  onChange={(e) => setFormData({ ...formData, TenLeHoi: e.target.value })}
                />
              </div>
              <div>
                <Label>Loại lễ hội</Label>
                <Input
                  value={formData.LoaiLeHoi || ''}
                  onChange={(e) => setFormData({ ...formData, LoaiLeHoi: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Địa điểm</Label>
                <Input
                  value={formData.DiaDiem || ''}
                  onChange={(e) => setFormData({ ...formData, DiaDiem: e.target.value })}
                />
              </div>
              <div>
                <Label>Thời gian</Label>
                <Input
                  type="date"
                  value={formData.ThoiGian || ''}
                  onChange={(e) => setFormData({ ...formData, ThoiGian: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Quy mô thực tế</Label>
                <Input
                  type="number"
                  value={formData.QuyMo || ''}
                  onChange={(e) => setFormData({ ...formData, QuyMo: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Dự kiến</Label>
                <Input
                  type="number"
                  value={formData.DuKien || ''}
                  onChange={(e) => setFormData({ ...formData, DuKien: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Kinh phí</Label>
                <Input
                  type="number"
                  value={formData.KinhPhi || ''}
                  onChange={(e) => setFormData({ ...formData, KinhPhi: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Người chủ trì</Label>
                <Input
                  value={formData.NguoiChuTri || ''}
                  onChange={(e) => setFormData({ ...formData, NguoiChuTri: e.target.value })}
                />
              </div>
              <div>
                <Label>Trạng thái</Label>
                <Select
                  value={formData.TrangThai}
                  onValueChange={(value) => setFormData({ ...formData, TrangThai: value as LeHoi['TrangThai'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                    <SelectItem value="Sắp diễn ra">Sắp diễn ra</SelectItem>
                    <SelectItem value="Đang chuẩn bị">Đang chuẩn bị</SelectItem>
                    <SelectItem value="Đang diễn ra">Đang diễn ra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea
                value={formData.MoTa || ''}
                onChange={(e) => setFormData({ ...formData, MoTa: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveEdit} className="bg-pink-600 hover:bg-pink-700">
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thêm Lễ hội mới</DialogTitle>
            <DialogDescription>Nhập thông tin lễ hội mới</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tên lễ hội *</Label>
                <Input
                  value={formData.TenLeHoi || ''}
                  onChange={(e) => setFormData({ ...formData, TenLeHoi: e.target.value })}
                  placeholder="Nhập tên lễ hội"
                />
              </div>
              <div>
                <Label>Loại lễ hội</Label>
                <Input
                  value={formData.LoaiLeHoi || ''}
                  onChange={(e) => setFormData({ ...formData, LoaiLeHoi: e.target.value })}
                  placeholder="Vd: Truyền thống, Văn hóa..."
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Địa điểm</Label>
                <Input
                  value={formData.DiaDiem || ''}
                  onChange={(e) => setFormData({ ...formData, DiaDiem: e.target.value })}
                  placeholder="Địa điểm tổ chức"
                />
              </div>
              <div>
                <Label>Thời gian</Label>
                <Input
                  type="date"
                  value={formData.ThoiGian || ''}
                  onChange={(e) => setFormData({ ...formData, ThoiGian: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Quy mô thực tế</Label>
                <Input
                  type="number"
                  value={formData.QuyMo || ''}
                  onChange={(e) => setFormData({ ...formData, QuyMo: parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Dự kiến</Label>
                <Input
                  type="number"
                  value={formData.DuKien || ''}
                  onChange={(e) => setFormData({ ...formData, DuKien: parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Kinh phí (VNĐ)</Label>
                <Input
                  type="number"
                  value={formData.KinhPhi || ''}
                  onChange={(e) => setFormData({ ...formData, KinhPhi: parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Người chủ trì</Label>
                <Input
                  value={formData.NguoiChuTri || ''}
                  onChange={(e) => setFormData({ ...formData, NguoiChuTri: e.target.value })}
                  placeholder="UBND xã, Phòng..."
                />
              </div>
              <div>
                <Label>Trạng thái</Label>
                <Select
                  value={formData.TrangThai}
                  onValueChange={(value) => setFormData({ ...formData, TrangThai: value as LeHoi['TrangThai'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                    <SelectItem value="Sắp diễn ra">Sắp diễn ra</SelectItem>
                    <SelectItem value="Đang chuẩn bị">Đang chuẩn bị</SelectItem>
                    <SelectItem value="Đang diễn ra">Đang diễn ra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea
                value={formData.MoTa || ''}
                onChange={(e) => setFormData({ ...formData, MoTa: e.target.value })}
                rows={3}
                placeholder="Mô tả về lễ hội..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveAdd} className="bg-pink-600 hover:bg-pink-700">
              Thêm lễ hội
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
