'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Landmark, 
  Plus, 
  Search, 
  MapPin, 
  Calendar, 
  Users,
  FileText,
  Eye,
  Edit,
  Trash2,
  BarChart3
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DiTich {
  MaDiTich: string;
  TenDiTich: string;
  DiaChi: string;
  CapDo: 'Quốc gia' | 'Tỉnh' | 'Huyện';
  LoaiDiTich: string;
  NamXayDung: number;
  TinhTrang: 'Tốt' | 'Trung bình' | 'Xuống cấp' | 'Nguy cấp';
  LuotKhachThang: number;
  MoTa: string;
  NgayCapNhat: string;
}

const mockDiTich: DiTich[] = [
  {
    MaDiTich: 'DT001',
    TenDiTich: 'Đình làng Phú Xá',
    DiaChi: 'Thôn Phú Xá, xã Mẫu',
    CapDo: 'Quốc gia',
    LoaiDiTich: 'Kiến trúc tín ngưỡng',
    NamXayDung: 1685,
    TinhTrang: 'Tốt',
    LuotKhachThang: 450,
    MoTa: 'Đình làng cổ với kiến trúc độc đáo thời Lê',
    NgayCapNhat: '2026-01-15'
  },
  {
    MaDiTich: 'DT002',
    TenDiTich: 'Chùa Bồ Đề',
    DiaChi: 'Thôn Bồ Đề, xã Mẫu',
    CapDo: 'Quốc gia',
    LoaiDiTich: 'Kiến trúc tôn giáo',
    NamXayDung: 1720,
    TinhTrang: 'Tốt',
    LuotKhachThang: 800,
    MoTa: 'Ngôi chùa nổi tiếng với các tác phẩm điêu khắc gỗ',
    NgayCapNhat: '2026-01-10'
  },
  {
    MaDiTich: 'DT003',
    TenDiTich: 'Đền Đồng Cổ',
    DiaChi: 'Thôn Đồng Cổ, xã Mẫu',
    CapDo: 'Tỉnh',
    LoaiDiTich: 'Kiến trúc tín ngưỡng',
    NamXayDung: 1820,
    TinhTrang: 'Trung bình',
    LuotKhachThang: 320,
    MoTa: 'Đền thờ vua Hùng, lễ hội mùa xuân',
    NgayCapNhat: '2026-01-12'
  },
  {
    MaDiTich: 'DT004',
    TenDiTich: 'Nhà thờ họ Nguyễn',
    DiaChi: 'Thôn Trung Tâm, xã Mẫu',
    CapDo: 'Tỉnh',
    LoaiDiTich: 'Kiến trúc gia đình',
    NamXayDung: 1890,
    TinhTrang: 'Xuống cấp',
    LuotKhachThang: 150,
    MoTa: 'Nhà thờ họ với kiến trúc Việt-Pháp',
    NgayCapNhat: '2026-01-08'
  },
  {
    MaDiTich: 'DT005',
    TenDiTich: 'Cổng làng cổ',
    DiaChi: 'Thôn Cổ Lễ, xã Mẫu',
    CapDo: 'Huyện',
    LoaiDiTich: 'Kiến trúc làng xã',
    NamXayDung: 1920,
    TinhTrang: 'Trung bình',
    LuotKhachThang: 200,
    MoTa: 'Cổng làng đá với chữ Hán cổ',
    NgayCapNhat: '2026-01-05'
  },
  {
    MaDiTich: 'DT006',
    TenDiTich: 'Đình Kim Long',
    DiaChi: 'Thôn Kim Long, xã Mẫu',
    CapDo: 'Tỉnh',
    LoaiDiTich: 'Kiến trúc tín ngưỡng',
    NamXayDung: 1750,
    TinhTrang: 'Tốt',
    LuotKhachThang: 380,
    MoTa: 'Đình làng với hệ thống tượng gỗ quý',
    NgayCapNhat: '2026-01-14'
  },
  {
    MaDiTich: 'DT007',
    TenDiTich: 'Miếu Đông Cổ',
    DiaChi: 'Thôn Đông Cổ, xã Mẫu',
    CapDo: 'Huyện',
    LoaiDiTich: 'Kiến trúc tín ngưỡng',
    NamXayDung: 1880,
    TinhTrang: 'Nguy cấp',
    LuotKhachThang: 80,
    MoTa: 'Miếu thờ thành hoàng cần tu bổ gấp',
    NgayCapNhat: '2026-01-03'
  },
  {
    MaDiTich: 'DT008',
    TenDiTich: 'Cầu đá Phú Lộc',
    DiaChi: 'Thôn Phú Lộc, xã Mẫu',
    CapDo: 'Tỉnh',
    LoaiDiTich: 'Công trình giao thông',
    NamXayDung: 1805,
    TinhTrang: 'Trung bình',
    LuotKhachThang: 250,
    MoTa: 'Cầu đá cổ thời Nguyễn với kiến trúc độc đáo',
    NgayCapNhat: '2026-01-11'
  }
];

const capDoColors = {
  'Quốc gia': 'bg-red-100 text-red-700',
  'Tỉnh': 'bg-blue-100 text-blue-700',
  'Huyện': 'bg-green-100 text-green-700'
};

const tinhTrangColors = {
  'Tốt': 'bg-green-100 text-green-700',
  'Trung bình': 'bg-yellow-100 text-yellow-700',
  'Xuống cấp': 'bg-orange-100 text-orange-700',
  'Nguy cấp': 'bg-red-100 text-red-700'
};

export default function DiTichPage() {
  const [diTichList, setDiTichList] = useState<DiTich[]>(mockDiTich);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCapDo, setSelectedCapDo] = useState<string>('all');
  const [selectedTinhTrang, setSelectedTinhTrang] = useState<string>('all');
  const [viewDialog, setViewDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [addDialog, setAddDialog] = useState(false);
  const [selectedDiTich, setSelectedDiTich] = useState<DiTich | null>(null);
  const [formData, setFormData] = useState<Partial<DiTich>>({});

  // Thống kê
  const tongDiTich = diTichList.length;
  const capQuocGia = diTichList.filter(dt => dt.CapDo === 'Quốc gia').length;
  const capTinh = diTichList.filter(dt => dt.CapDo === 'Tỉnh').length;
  const xuongCap = diTichList.filter(dt => dt.TinhTrang === 'Xuống cấp' || dt.TinhTrang === 'Nguy cấp').length;
  const tongKhach = diTichList.reduce((sum, dt) => sum + dt.LuotKhachThang, 0);

  // Dữ liệu biểu đồ theo cấp độ
  const chartDataCapDo = [
    { name: 'Quốc gia', value: capQuocGia, color: '#dc2626' },
    { name: 'Tỉnh', value: capTinh, color: '#2563eb' },
    { name: 'Huyện', value: diTichList.filter(dt => dt.CapDo === 'Huyện').length, color: '#16a34a' }
  ];

  // Dữ liệu biểu đồ theo tình trạng
  const chartDataTinhTrang = [
    { name: 'Tốt', value: diTichList.filter(dt => dt.TinhTrang === 'Tốt').length, color: '#16a34a' },
    { name: 'Trung bình', value: diTichList.filter(dt => dt.TinhTrang === 'Trung bình').length, color: '#eab308' },
    { name: 'Xuống cấp', value: diTichList.filter(dt => dt.TinhTrang === 'Xuống cấp').length, color: '#f97316' },
    { name: 'Nguy cấp', value: diTichList.filter(dt => dt.TinhTrang === 'Nguy cấp').length, color: '#dc2626' }
  ];

  // Lọc
  const filteredDiTich = diTichList.filter(dt => {
    const matchSearch = dt.TenDiTich.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       dt.DiaChi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       dt.LoaiDiTich.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCapDo = selectedCapDo === 'all' || dt.CapDo === selectedCapDo;
    const matchTinhTrang = selectedTinhTrang === 'all' || dt.TinhTrang === selectedTinhTrang;
    return matchSearch && matchCapDo && matchTinhTrang;
  });

  const handleView = (diTich: DiTich) => {
    setSelectedDiTich(diTich);
    setViewDialog(true);
  };

  const handleEdit = (diTich: DiTich) => {
    setSelectedDiTich(diTich);
    setFormData(diTich);
    setEditDialog(true);
  };

  const handleAdd = () => {
    setFormData({
      CapDo: 'Huyện',
      TinhTrang: 'Tốt',
      NamXayDung: 2000,
      LuotKhachThang: 0,
      NgayCapNhat: new Date().toISOString().split('T')[0]
    });
    setAddDialog(true);
  };

  const handleDelete = (maDiTich: string) => {
    if (confirm('Bạn có chắc muốn xóa di tích này?')) {
      setDiTichList(diTichList.filter(dt => dt.MaDiTich !== maDiTich));
    }
  };

  const handleSaveEdit = () => {
    if (selectedDiTich && formData) {
      setDiTichList(diTichList.map(dt =>
        dt.MaDiTich === selectedDiTich.MaDiTich ? { ...dt, ...formData } : dt
      ));
      setEditDialog(false);
    }
  };

  const handleSaveAdd = () => {
    if (formData.TenDiTich) {
      const newDiTich: DiTich = {
        MaDiTich: `DT${String(diTichList.length + 1).padStart(3, '0')}`,
        TenDiTich: formData.TenDiTich || '',
        DiaChi: formData.DiaChi || '',
        CapDo: (formData.CapDo as DiTich['CapDo']) || 'Huyện',
        LoaiDiTich: formData.LoaiDiTich || '',
        NamXayDung: formData.NamXayDung || 2000,
        TinhTrang: (formData.TinhTrang as DiTich['TinhTrang']) || 'Tốt',
        LuotKhachThang: formData.LuotKhachThang || 0,
        MoTa: formData.MoTa || '',
        NgayCapNhat: formData.NgayCapNhat || new Date().toISOString().split('T')[0]
      };
      setDiTichList([...diTichList, newDiTich]);
      setAddDialog(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-accent via-status-warning to-accent p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Landmark className="h-10 w-10" />
            <h1 className="text-3xl font-bold">Quản lý Di tích</h1>
          </div>
          <p className="text-amber-50">Bảo tồn và quản lý di tích lịch sử văn hóa</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng di tích</CardTitle>
            <Landmark className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{tongDiTich}</div>
            <p className="text-xs text-muted-foreground">Đang quản lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cấp quốc gia</CardTitle>
            <FileText className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{capQuocGia}</div>
            <p className="text-xs text-muted-foreground">Di tích quan trọng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cấp tỉnh</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{capTinh}</div>
            <p className="text-xs text-muted-foreground">Di tích địa phương</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Xuống cấp</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{xuongCap}</div>
            <p className="text-xs text-muted-foreground">Cần tu bổ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lượt khách/tháng</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{tongKhach.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Tổng lượt tham quan</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-amber-600" />
              Phân loại theo cấp độ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartDataCapDo}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartDataCapDo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-amber-600" />
              Tình trạng di tích
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartDataTinhTrang}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartDataTinhTrang.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Danh sách Di tích</CardTitle>
              <CardDescription>Quản lý thông tin {filteredDiTich.length} di tích</CardDescription>
            </div>
            <Button onClick={handleAdd} className="bg-amber-600 hover:bg-amber-700">
              <Plus className="mr-2 h-4 w-4" />
              Thêm di tích
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm di tích..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedCapDo} onValueChange={setSelectedCapDo}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Cấp độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả cấp</SelectItem>
                <SelectItem value="Quốc gia">Quốc gia</SelectItem>
                <SelectItem value="Tỉnh">Tỉnh</SelectItem>
                <SelectItem value="Huyện">Huyện</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTinhTrang} onValueChange={setSelectedTinhTrang}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Tình trạng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Tốt">Tốt</SelectItem>
                <SelectItem value="Trung bình">Trung bình</SelectItem>
                <SelectItem value="Xuống cấp">Xuống cấp</SelectItem>
                <SelectItem value="Nguy cấp">Nguy cấp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Tên di tích</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Cấp độ</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Năm XD</TableHead>
                  <TableHead>Tình trạng</TableHead>
                  <TableHead>Khách/tháng</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDiTich.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                      Không tìm thấy di tích nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDiTich.map((diTich) => (
                    <TableRow key={diTich.MaDiTich}>
                      <TableCell className="font-medium">{diTich.MaDiTich}</TableCell>
                      <TableCell className="font-medium">{diTich.TenDiTich}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {diTich.DiaChi}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={capDoColors[diTich.CapDo]}>
                          {diTich.CapDo}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{diTich.LoaiDiTich}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {diTich.NamXayDung}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={tinhTrangColors[diTich.TinhTrang]}>
                          {diTich.TinhTrang}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          {diTich.LuotKhachThang}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(diTich)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(diTich)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(diTich.MaDiTich)}
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
              <Landmark className="h-5 w-5 text-amber-600" />
              Chi tiết Di tích
            </DialogTitle>
            <DialogDescription>Thông tin chi tiết về di tích</DialogDescription>
          </DialogHeader>
          {selectedDiTich && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Mã di tích</Label>
                  <p className="font-medium">{selectedDiTich.MaDiTich}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tên di tích</Label>
                  <p className="font-medium">{selectedDiTich.TenDiTich}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Địa chỉ</Label>
                <p className="font-medium">{selectedDiTich.DiaChi}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Cấp độ</Label>
                  <div className="mt-1">
                    <Badge className={capDoColors[selectedDiTich.CapDo]}>
                      {selectedDiTich.CapDo}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Loại di tích</Label>
                  <p className="font-medium">{selectedDiTich.LoaiDiTich}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Năm xây dựng</Label>
                  <p className="font-medium">{selectedDiTich.NamXayDung}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tình trạng</Label>
                  <div className="mt-1">
                    <Badge className={tinhTrangColors[selectedDiTich.TinhTrang]}>
                      {selectedDiTich.TinhTrang}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Lượt khách/tháng</Label>
                  <p className="font-medium">{selectedDiTich.LuotKhachThang} người</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Ngày cập nhật</Label>
                  <p className="font-medium">{selectedDiTich.NgayCapNhat}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Mô tả</Label>
                <p className="font-medium">{selectedDiTich.MoTa}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Di tích</DialogTitle>
            <DialogDescription>Cập nhật thông tin di tích</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tên di tích *</Label>
                <Input
                  value={formData.TenDiTich || ''}
                  onChange={(e) => setFormData({ ...formData, TenDiTich: e.target.value })}
                />
              </div>
              <div>
                <Label>Loại di tích</Label>
                <Input
                  value={formData.LoaiDiTich || ''}
                  onChange={(e) => setFormData({ ...formData, LoaiDiTich: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Địa chỉ</Label>
              <Input
                value={formData.DiaChi || ''}
                onChange={(e) => setFormData({ ...formData, DiaChi: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Cấp độ</Label>
                <Select
                  value={formData.CapDo}
                  onValueChange={(value) => setFormData({ ...formData, CapDo: value as DiTich['CapDo'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quốc gia">Quốc gia</SelectItem>
                    <SelectItem value="Tỉnh">Tỉnh</SelectItem>
                    <SelectItem value="Huyện">Huyện</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Năm xây dựng</Label>
                <Input
                  type="number"
                  value={formData.NamXayDung || ''}
                  onChange={(e) => setFormData({ ...formData, NamXayDung: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Lượt khách/tháng</Label>
                <Input
                  type="number"
                  value={formData.LuotKhachThang || ''}
                  onChange={(e) => setFormData({ ...formData, LuotKhachThang: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label>Tình trạng</Label>
              <Select
                value={formData.TinhTrang}
                onValueChange={(value) => setFormData({ ...formData, TinhTrang: value as DiTich['TinhTrang'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tốt">Tốt</SelectItem>
                  <SelectItem value="Trung bình">Trung bình</SelectItem>
                  <SelectItem value="Xuống cấp">Xuống cấp</SelectItem>
                  <SelectItem value="Nguy cấp">Nguy cấp</SelectItem>
                </SelectContent>
              </Select>
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
            <Button onClick={handleSaveEdit} className="bg-amber-600 hover:bg-amber-700">
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thêm Di tích mới</DialogTitle>
            <DialogDescription>Nhập thông tin di tích mới</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tên di tích *</Label>
                <Input
                  value={formData.TenDiTich || ''}
                  onChange={(e) => setFormData({ ...formData, TenDiTich: e.target.value })}
                  placeholder="Nhập tên di tích"
                />
              </div>
              <div>
                <Label>Loại di tích</Label>
                <Input
                  value={formData.LoaiDiTich || ''}
                  onChange={(e) => setFormData({ ...formData, LoaiDiTich: e.target.value })}
                  placeholder="Vd: Kiến trúc tín ngưỡng"
                />
              </div>
            </div>
            <div>
              <Label>Địa chỉ</Label>
              <Input
                value={formData.DiaChi || ''}
                onChange={(e) => setFormData({ ...formData, DiaChi: e.target.value })}
                placeholder="Thôn, xã"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Cấp độ</Label>
                <Select
                  value={formData.CapDo}
                  onValueChange={(value) => setFormData({ ...formData, CapDo: value as DiTich['CapDo'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quốc gia">Quốc gia</SelectItem>
                    <SelectItem value="Tỉnh">Tỉnh</SelectItem>
                    <SelectItem value="Huyện">Huyện</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Năm xây dựng</Label>
                <Input
                  type="number"
                  value={formData.NamXayDung || ''}
                  onChange={(e) => setFormData({ ...formData, NamXayDung: parseInt(e.target.value) })}
                  placeholder="1800"
                />
              </div>
              <div>
                <Label>Lượt khách/tháng</Label>
                <Input
                  type="number"
                  value={formData.LuotKhachThang || ''}
                  onChange={(e) => setFormData({ ...formData, LuotKhachThang: parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <Label>Tình trạng</Label>
              <Select
                value={formData.TinhTrang}
                onValueChange={(value) => setFormData({ ...formData, TinhTrang: value as DiTich['TinhTrang'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tốt">Tốt</SelectItem>
                  <SelectItem value="Trung bình">Trung bình</SelectItem>
                  <SelectItem value="Xuống cấp">Xuống cấp</SelectItem>
                  <SelectItem value="Nguy cấp">Nguy cấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea
                value={formData.MoTa || ''}
                onChange={(e) => setFormData({ ...formData, MoTa: e.target.value })}
                rows={3}
                placeholder="Mô tả về di tích..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveAdd} className="bg-amber-600 hover:bg-amber-700">
              Thêm di tích
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
