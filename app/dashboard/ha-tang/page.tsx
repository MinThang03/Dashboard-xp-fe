'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Construction, 
  Plus, 
  Search, 
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Calendar,
  Lightbulb,
  Bridge,
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

interface HaTang {
  MaHaTang: string;
  TenHangMuc: string;
  LoaiHaTang: 'Đường' | 'Cầu' | 'Cống' | 'Chiếu sáng';
  ViTri: string;
  TinhTrang: 'Tốt' | 'Trung bình' | 'Xuống cấp' | 'Nguy hiểm';
  ChieuDai?: number;
  KichThuoc: string;
  NamXayDung: number;
  LanSuaChua: string;
  GhiChu: string;
}

const mockHaTang: HaTang[] = [
  {
    MaHaTang: 'HT001',
    TenHangMuc: 'Đường Nguyễn Trãi',
    LoaiHaTang: 'Đường',
    ViTri: 'Thôn Phú Xá',
    TinhTrang: 'Tốt',
    ChieuDai: 850,
    KichThuoc: 'Rộng 5m',
    NamXayDung: 2020,
    LanSuaChua: '2026-01-05',
    GhiChu: 'Đã bê tông hóa toàn tuyến'
  },
  {
    MaHaTang: 'HT002',
    TenHangMuc: 'Cầu Khu 2',
    LoaiHaTang: 'Cầu',
    ViTri: 'Khu 2, xã Mẫu',
    TinhTrang: 'Xuống cấp',
    ChieuDai: 25,
    KichThuoc: 'Rộng 4m',
    NamXayDung: 2010,
    LanSuaChua: '2024-06-10',
    GhiChu: 'Mặt cầu lún nứt, cần sửa chữa gấp'
  },
  {
    MaHaTang: 'HT003',
    TenHangMuc: 'Hệ thống đèn công viên',
    LoaiHaTang: 'Chiếu sáng',
    ViTri: 'Công viên xã',
    TinhTrang: 'Tốt',
    KichThuoc: '25 bóng đèn LED',
    NamXayDung: 2022,
    LanSuaChua: '2026-01-10',
    GhiChu: 'Hoạt động tốt, tiết kiệm điện'
  },
  {
    MaHaTang: 'HT004',
    TenHangMuc: 'Cống thoát nước chính',
    LoaiHaTang: 'Cống',
    ViTri: 'Đường Trung Tâm',
    TinhTrang: 'Trung bình',
    ChieuDai: 120,
    KichThuoc: 'Đường kính 80cm',
    NamXayDung: 2015,
    LanSuaChua: '2025-10-20',
    GhiChu: 'Cần nạo vét định kỳ'
  },
  {
    MaHaTang: 'HT005',
    TenHangMuc: 'Đường Lê Lợi',
    LoaiHaTang: 'Đường',
    ViTri: 'Thôn Bồ Đề',
    TinhTrang: 'Xuống cấp',
    ChieuDai: 650,
    KichThuoc: 'Rộng 3.5m',
    NamXayDung: 2008,
    LanSuaChua: '2023-08-15',
    GhiChu: 'Mặt đường hư hỏng nhiều điểm'
  },
  {
    MaHaTang: 'HT006',
    TenHangMuc: 'Cầu Đồng Cổ',
    LoaiHaTang: 'Cầu',
    ViTri: 'Thôn Đồng Cổ',
    TinhTrang: 'Tốt',
    ChieuDai: 18,
    KichThuoc: 'Rộng 3.5m',
    NamXayDung: 2021,
    LanSuaChua: '2026-01-08',
    GhiChu: 'Cầu bê tông mới, tình trạng tốt'
  },
  {
    MaHaTang: 'HT007',
    TenHangMuc: 'Đèn đường Nguyễn Trãi',
    LoaiHaTang: 'Chiếu sáng',
    ViTri: 'Đường Nguyễn Trãi',
    TinhTrang: 'Trung bình',
    KichThuoc: '15 bóng đèn',
    NamXayDung: 2018,
    LanSuaChua: '2025-12-05',
    GhiChu: 'Một số bóng đèn hỏng cần thay'
  },
  {
    MaHaTang: 'HT008',
    TenHangMuc: 'Cống thôn Kim Long',
    LoaiHaTang: 'Cống',
    ViTri: 'Thôn Kim Long',
    TinhTrang: 'Nguy hiểm',
    ChieuDai: 80,
    KichThuoc: 'Đường kính 60cm',
    NamXayDung: 2005,
    LanSuaChua: '2022-05-10',
    GhiChu: 'Cống cũ, nghẹt thường xuyên, cần thay mới'
  }
];

const tinhTrangColors = {
  'Tốt': 'bg-green-100 text-green-700',
  'Trung bình': 'bg-yellow-100 text-yellow-700',
  'Xuống cấp': 'bg-orange-100 text-orange-700',
  'Nguy hiểm': 'bg-red-100 text-red-700'
};

export default function HaTangPage() {
  const [haTangList, setHaTangList] = useState<HaTang[]>(mockHaTang);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoai, setSelectedLoai] = useState<string>('all');
  const [selectedTinhTrang, setSelectedTinhTrang] = useState<string>('all');
  const [viewDialog, setViewDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [addDialog, setAddDialog] = useState(false);
  const [selectedHaTang, setSelectedHaTang] = useState<HaTang | null>(null);
  const [formData, setFormData] = useState<Partial<HaTang>>({});

  // Thống kê
  const tongHangMuc = haTangList.length;
  const tot = haTangList.filter(ht => ht.TinhTrang === 'Tốt').length;
  const trungBinh = haTangList.filter(ht => ht.TinhTrang === 'Trung bình').length;
  const xuongCap = haTangList.filter(ht => ht.TinhTrang === 'Xuống cấp').length;
  const nguyHiem = haTangList.filter(ht => ht.TinhTrang === 'Nguy hiểm').length;

  // Dữ liệu biểu đồ theo loại
  const chartDataLoai = [
    { name: 'Đường', value: haTangList.filter(ht => ht.LoaiHaTang === 'Đường').length, color: '#3b82f6' },
    { name: 'Cầu', value: haTangList.filter(ht => ht.LoaiHaTang === 'Cầu').length, color: '#8b5cf6' },
    { name: 'Cống', value: haTangList.filter(ht => ht.LoaiHaTang === 'Cống').length, color: '#10b981' },
    { name: 'Chiếu sáng', value: haTangList.filter(ht => ht.LoaiHaTang === 'Chiếu sáng').length, color: '#f59e0b' }
  ];

  // Dữ liệu biểu đồ tình trạng
  const chartDataTinhTrang = [
    { name: 'Tốt', value: tot, color: '#16a34a' },
    { name: 'Trung bình', value: trungBinh, color: '#eab308' },
    { name: 'Xuống cấp', value: xuongCap, color: '#f97316' },
    { name: 'Nguy hiểm', value: nguyHiem, color: '#dc2626' }
  ];

  // Lọc
  const filteredHaTang = haTangList.filter(ht => {
    const matchSearch = ht.TenHangMuc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       ht.ViTri.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLoai = selectedLoai === 'all' || ht.LoaiHaTang === selectedLoai;
    const matchTinhTrang = selectedTinhTrang === 'all' || ht.TinhTrang === selectedTinhTrang;
    return matchSearch && matchLoai && matchTinhTrang;
  });

  const handleView = (haTang: HaTang) => {
    setSelectedHaTang(haTang);
    setViewDialog(true);
  };

  const handleEdit = (haTang: HaTang) => {
    setSelectedHaTang(haTang);
    setFormData(haTang);
    setEditDialog(true);
  };

  const handleAdd = () => {
    setFormData({
      LoaiHaTang: 'Đường',
      TinhTrang: 'Tốt',
      NamXayDung: 2024,
      LanSuaChua: new Date().toISOString().split('T')[0]
    });
    setAddDialog(true);
  };

  const handleDelete = (maHaTang: string) => {
    if (confirm('Bạn có chắc muốn xóa hạng mục này?')) {
      setHaTangList(haTangList.filter(ht => ht.MaHaTang !== maHaTang));
    }
  };

  const handleSaveEdit = () => {
    if (selectedHaTang && formData) {
      setHaTangList(haTangList.map(ht =>
        ht.MaHaTang === selectedHaTang.MaHaTang ? { ...ht, ...formData } : ht
      ));
      setEditDialog(false);
    }
  };

  const handleSaveAdd = () => {
    if (formData.TenHangMuc) {
      const newHaTang: HaTang = {
        MaHaTang: `HT${String(haTangList.length + 1).padStart(3, '0')}`,
        TenHangMuc: formData.TenHangMuc || '',
        LoaiHaTang: (formData.LoaiHaTang as HaTang['LoaiHaTang']) || 'Đường',
        ViTri: formData.ViTri || '',
        TinhTrang: (formData.TinhTrang as HaTang['TinhTrang']) || 'Tốt',
        ChieuDai: formData.ChieuDai,
        KichThuoc: formData.KichThuoc || '',
        NamXayDung: formData.NamXayDung || 2024,
        LanSuaChua: formData.LanSuaChua || new Date().toISOString().split('T')[0],
        GhiChu: formData.GhiChu || ''
      };
      setHaTangList([...haTangList, newHaTang]);
      setAddDialog(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-secondary via-muted to-secondary p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Construction className="h-10 w-10" />
            <h1 className="text-3xl font-bold">Hạ tầng kỹ thuật</h1>
          </div>
          <p className="text-gray-50">Theo dõi tình trạng đường xá, cầu cống, chiếu sáng</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng hạng mục</CardTitle>
            <Construction className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-600">{tongHangMuc}</div>
            <p className="text-xs text-muted-foreground">Đang quản lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tốt</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{tot}</div>
            <p className="text-xs text-muted-foreground">Hoạt động tốt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trung bình</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{trungBinh}</div>
            <p className="text-xs text-muted-foreground">Cần theo dõi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Xuống cấp</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{xuongCap}</div>
            <p className="text-xs text-muted-foreground">Cần sửa chữa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nguy hiểm</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{nguyHiem}</div>
            <p className="text-xs text-muted-foreground">Ưu tiên xử lý</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-slate-600" />
              Phân loại hạ tầng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartDataLoai}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartDataLoai.map((entry, index) => (
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
              <BarChart3 className="h-5 w-5 text-slate-600" />
              Tình trạng hạ tầng
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
              <CardTitle>Danh sách Hạ tầng</CardTitle>
              <CardDescription>Quản lý {filteredHaTang.length} hạng mục hạ tầng</CardDescription>
            </div>
            <Button onClick={handleAdd} className="bg-slate-600 hover:bg-slate-700">
              <Plus className="mr-2 h-4 w-4" />
              Thêm hạng mục
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm hạng mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedLoai} onValueChange={setSelectedLoai}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Loại hạ tầng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="Đường">Đường</SelectItem>
                <SelectItem value="Cầu">Cầu</SelectItem>
                <SelectItem value="Cống">Cống</SelectItem>
                <SelectItem value="Chiếu sáng">Chiếu sáng</SelectItem>
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
                <SelectItem value="Nguy hiểm">Nguy hiểm</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã</TableHead>
                  <TableHead>Tên hạng mục</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Vị trí</TableHead>
                  <TableHead>Kích thước</TableHead>
                  <TableHead>Năm XD</TableHead>
                  <TableHead>Tình trạng</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHaTang.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      Không tìm thấy hạng mục nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHaTang.map((haTang) => (
                    <TableRow key={haTang.MaHaTang}>
                      <TableCell className="font-medium">{haTang.MaHaTang}</TableCell>
                      <TableCell className="font-medium">{haTang.TenHangMuc}</TableCell>
                      <TableCell className="text-sm">{haTang.LoaiHaTang}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {haTang.ViTri}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {haTang.ChieuDai ? `${haTang.ChieuDai}m - ` : ''}{haTang.KichThuoc}
                      </TableCell>
                      <TableCell className="text-sm">{haTang.NamXayDung}</TableCell>
                      <TableCell>
                        <Badge className={tinhTrangColors[haTang.TinhTrang]}>
                          {haTang.TinhTrang}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(haTang)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(haTang)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(haTang.MaHaTang)}
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
              <Construction className="h-5 w-5 text-slate-600" />
              Chi tiết Hạ tầng
            </DialogTitle>
            <DialogDescription>Thông tin chi tiết hạng mục hạ tầng</DialogDescription>
          </DialogHeader>
          {selectedHaTang && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Mã hạng mục</Label>
                  <p className="font-medium">{selectedHaTang.MaHaTang}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tên hạng mục</Label>
                  <p className="font-medium">{selectedHaTang.TenHangMuc}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Loại hạ tầng</Label>
                  <p className="font-medium">{selectedHaTang.LoaiHaTang}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Vị trí</Label>
                  <p className="font-medium">{selectedHaTang.ViTri}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Tình trạng</Label>
                  <div className="mt-1">
                    <Badge className={tinhTrangColors[selectedHaTang.TinhTrang]}>
                      {selectedHaTang.TinhTrang}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Kích thước</Label>
                  <p className="font-medium">
                    {selectedHaTang.ChieuDai ? `${selectedHaTang.ChieuDai}m - ` : ''}
                    {selectedHaTang.KichThuoc}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Năm xây dựng</Label>
                  <p className="font-medium">{selectedHaTang.NamXayDung}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Lần sửa chữa gần nhất</Label>
                  <p className="font-medium">{selectedHaTang.LanSuaChua}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Ghi chú</Label>
                <p className="font-medium">{selectedHaTang.GhiChu}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Hạ tầng</DialogTitle>
            <DialogDescription>Cập nhật thông tin hạng mục hạ tầng</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tên hạng mục *</Label>
                <Input
                  value={formData.TenHangMuc || ''}
                  onChange={(e) => setFormData({ ...formData, TenHangMuc: e.target.value })}
                />
              </div>
              <div>
                <Label>Loại hạ tầng</Label>
                <Select
                  value={formData.LoaiHaTang}
                  onValueChange={(value) => setFormData({ ...formData, LoaiHaTang: value as HaTang['LoaiHaTang'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đường">Đường</SelectItem>
                    <SelectItem value="Cầu">Cầu</SelectItem>
                    <SelectItem value="Cống">Cống</SelectItem>
                    <SelectItem value="Chiếu sáng">Chiếu sáng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Vị trí</Label>
              <Input
                value={formData.ViTri || ''}
                onChange={(e) => setFormData({ ...formData, ViTri: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Chiều dài (m)</Label>
                <Input
                  type="number"
                  value={formData.ChieuDai || ''}
                  onChange={(e) => setFormData({ ...formData, ChieuDai: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Kích thước</Label>
                <Input
                  value={formData.KichThuoc || ''}
                  onChange={(e) => setFormData({ ...formData, KichThuoc: e.target.value })}
                />
              </div>
              <div>
                <Label>Năm xây dựng</Label>
                <Input
                  type="number"
                  value={formData.NamXayDung || ''}
                  onChange={(e) => setFormData({ ...formData, NamXayDung: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tình trạng</Label>
                <Select
                  value={formData.TinhTrang}
                  onValueChange={(value) => setFormData({ ...formData, TinhTrang: value as HaTang['TinhTrang'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tốt">Tốt</SelectItem>
                    <SelectItem value="Trung bình">Trung bình</SelectItem>
                    <SelectItem value="Xuống cấp">Xuống cấp</SelectItem>
                    <SelectItem value="Nguy hiểm">Nguy hiểm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Lần sửa chữa</Label>
                <Input
                  type="date"
                  value={formData.LanSuaChua || ''}
                  onChange={(e) => setFormData({ ...formData, LanSuaChua: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Ghi chú</Label>
              <Textarea
                value={formData.GhiChu || ''}
                onChange={(e) => setFormData({ ...formData, GhiChu: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveEdit} className="bg-slate-600 hover:bg-slate-700">
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thêm Hạ tầng mới</DialogTitle>
            <DialogDescription>Nhập thông tin hạng mục hạ tầng mới</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tên hạng mục *</Label>
                <Input
                  value={formData.TenHangMuc || ''}
                  onChange={(e) => setFormData({ ...formData, TenHangMuc: e.target.value })}
                  placeholder="Nhập tên hạng mục"
                />
              </div>
              <div>
                <Label>Loại hạ tầng</Label>
                <Select
                  value={formData.LoaiHaTang}
                  onValueChange={(value) => setFormData({ ...formData, LoaiHaTang: value as HaTang['LoaiHaTang'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đường">Đường</SelectItem>
                    <SelectItem value="Cầu">Cầu</SelectItem>
                    <SelectItem value="Cống">Cống</SelectItem>
                    <SelectItem value="Chiếu sáng">Chiếu sáng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Vị trí</Label>
              <Input
                value={formData.ViTri || ''}
                onChange={(e) => setFormData({ ...formData, ViTri: e.target.value })}
                placeholder="Thôn, đường..."
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Chiều dài (m)</Label>
                <Input
                  type="number"
                  value={formData.ChieuDai || ''}
                  onChange={(e) => setFormData({ ...formData, ChieuDai: parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Kích thước</Label>
                <Input
                  value={formData.KichThuoc || ''}
                  onChange={(e) => setFormData({ ...formData, KichThuoc: e.target.value })}
                  placeholder="Vd: Rộng 5m"
                />
              </div>
              <div>
                <Label>Năm xây dựng</Label>
                <Input
                  type="number"
                  value={formData.NamXayDung || ''}
                  onChange={(e) => setFormData({ ...formData, NamXayDung: parseInt(e.target.value) })}
                  placeholder="2024"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tình trạng</Label>
                <Select
                  value={formData.TinhTrang}
                  onValueChange={(value) => setFormData({ ...formData, TinhTrang: value as HaTang['TinhTrang'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tốt">Tốt</SelectItem>
                    <SelectItem value="Trung bình">Trung bình</SelectItem>
                    <SelectItem value="Xuống cấp">Xuống cấp</SelectItem>
                    <SelectItem value="Nguy hiểm">Nguy hiểm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Lần sửa chữa</Label>
                <Input
                  type="date"
                  value={formData.LanSuaChua || ''}
                  onChange={(e) => setFormData({ ...formData, LanSuaChua: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Ghi chú</Label>
              <Textarea
                value={formData.GhiChu || ''}
                onChange={(e) => setFormData({ ...formData, GhiChu: e.target.value })}
                rows={3}
                placeholder="Ghi chú về hạng mục..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveAdd} className="bg-slate-600 hover:bg-slate-700">
              Thêm hạng mục
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
