'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Landmark, 
  Plus, 
  Search, 
  FileText, 
  Calendar,
  CheckCircle2,
  Eye,
  Edit,
  Trash2,
  Upload,
  Download
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
import { FunctionStyledPanel } from '@/components/charts/function-styled-panel';
import { hoSoDiTichApi } from '@/lib/api';

interface HoSoDiTich {
  MaHoSo: string;
  TenDiTich: string;
  CapDo: 'Quốc gia' | 'Tỉnh' | 'Huyện';
  LoaiHoSo: string;
  TrangThai: 'Đã nộp' | 'Đang xử lý' | 'Hoàn thành' | 'Cần bổ sung';
  NgayNop: string;
  NgayDuyet: string;
  NguoiNop: string;
  TaiLieu: string;
  GhiChu: string;
}

const mockHoSo: HoSoDiTich[] = [
  {
    MaHoSo: 'HS001',
    TenDiTich: 'Đình làng Phú Xá',
    CapDo: 'Quốc gia',
    LoaiHoSo: 'Hồ sơ xếp hạng',
    TrangThai: 'Hoàn thành',
    NgayNop: '2026-01-10',
    NgayDuyet: '2026-01-15',
    NguoiNop: 'UBND xã Mẫu',
    TaiLieu: '15 tài liệu',
    GhiChu: 'Đã công nhận di tích cấp quốc gia'
  },
  {
    MaHoSo: 'HS002',
    TenDiTich: 'Chùa Bồ Đề',
    CapDo: 'Quốc gia',
    LoaiHoSo: 'Hồ sơ tu bổ',
    TrangThai: 'Đang xử lý',
    NgayNop: '2026-01-12',
    NgayDuyet: '',
    NguoiNop: 'Ban quản lý di tích',
    TaiLieu: '12 tài liệu',
    GhiChu: 'Đang thẩm định hồ sơ'
  },
  {
    MaHoSo: 'HS003',
    TenDiTich: 'Đền Đồng Cổ',
    CapDo: 'Tỉnh',
    LoaiHoSo: 'Hồ sơ bảo tồn',
    TrangThai: 'Cần bổ sung',
    NgayNop: '2026-01-08',
    NgayDuyet: '',
    NguoiNop: 'Trưởng thôn',
    TaiLieu: '8 tài liệu',
    GhiChu: 'Thiếu bản vẽ kiến trúc'
  },
  {
    MaHoSo: 'HS004',
    TenDiTich: 'Nhà thờ họ Nguyễn',
    CapDo: 'Tỉnh',
    LoaiHoSo: 'Hồ sơ tu bổ khẩn cấp',
    TrangThai: 'Đã nộp',
    NgayNop: '2026-01-14',
    NgayDuyet: '',
    NguoiNop: 'Trưởng họ Nguyễn',
    TaiLieu: '10 tài liệu',
    GhiChu: 'Mới tiếp nhận'
  },
  {
    MaHoSo: 'HS005',
    TenDiTich: 'Cổng làng cổ',
    CapDo: 'Huyện',
    LoaiHoSo: 'Hồ sơ xếp hạng',
    TrangThai: 'Đang xử lý',
    NgayNop: '2026-01-05',
    NgayDuyet: '',
    NguoiNop: 'UBND xã Mẫu',
    TaiLieu: '6 tài liệu',
    GhiChu: 'Đang chờ ý kiến chuyên gia'
  },
  {
    MaHoSo: 'HS006',
    TenDiTich: 'Đình Kim Long',
    CapDo: 'Tỉnh',
    LoaiHoSo: 'Hồ sơ bảo tồn định kỳ',
    TrangThai: 'Hoàn thành',
    NgayNop: '2025-12-20',
    NgayDuyet: '2026-01-03',
    NguoiNop: 'Ban quản lý di tích',
    TaiLieu: '14 tài liệu',
    GhiChu: 'Đã phê duyệt phương án bảo tồn'
  }
];

const trangThaiColors = {
  'Đã nộp': 'bg-blue-100 text-blue-700',
  'Đang xử lý': 'bg-yellow-100 text-yellow-700',
  'Hoàn thành': 'bg-green-100 text-green-700',
  'Cần bổ sung': 'bg-red-100 text-red-700'
};

const capDoColors = {
  'Quốc gia': 'bg-red-100 text-red-700',
  'Tỉnh': 'bg-blue-100 text-blue-700',
  'Huyện': 'bg-green-100 text-green-700'
};

function toDateString(value: unknown): string {
  if (!value) return '';
  const parsed = String(value);
  return parsed.length >= 10 ? parsed.slice(0, 10) : parsed;
}

function toNumericId(value: string): number {
  const direct = Number(value);
  if (Number.isFinite(direct)) return direct;
  const matched = value.match(/\d+/);
  return matched ? Number(matched[0]) : Number.NaN;
}

function mapFromApi(item: any): HoSoDiTich {
  const capDo = (item.CapDo || 'Huyện') as HoSoDiTich['CapDo'];
  const trangThai = (item.TrangThai || 'Đã nộp') as HoSoDiTich['TrangThai'];

  return {
    MaHoSo: String(item.MaHoSo ?? ''),
    TenDiTich: item.TenDiTich || '',
    CapDo: capDo,
    LoaiHoSo: item.LoaiHoSo || '',
    TrangThai: trangThai,
    NgayNop: toDateString(item.NgayNop || item.NgayLap),
    NgayDuyet: toDateString(item.NgayDuyet),
    NguoiNop: item.NguoiNop || '',
    TaiLieu: item.TaiLieu || '',
    GhiChu: item.GhiChu || item.NoiDung || '',
  };
}

function mapToApi(data: Partial<HoSoDiTich>) {
  return {
    TenDiTich: data.TenDiTich || null,
    CapDo: data.CapDo || null,
    LoaiHoSo: data.LoaiHoSo || null,
    TrangThai: data.TrangThai || 'Đã nộp',
    NgayNop: data.NgayNop || null,
    NgayDuyet: data.NgayDuyet || null,
    NguoiNop: data.NguoiNop || null,
    TaiLieu: data.TaiLieu || null,
    GhiChu: data.GhiChu || null,
    NoiDung: data.GhiChu || null,
  };
}

export default function HoSoDiTichPage() {
  const [hoSoList, setHoSoList] = useState<HoSoDiTich[]>(mockHoSo);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrangThai, setSelectedTrangThai] = useState<string>('all');
  const [viewDialog, setViewDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [addDialog, setAddDialog] = useState(false);
  const [selectedHoSo, setSelectedHoSo] = useState<HoSoDiTich | null>(null);
  const [formData, setFormData] = useState<Partial<HoSoDiTich>>({});

  const loadData = async () => {
    const result = await hoSoDiTichApi.getList({ page: 1, limit: 1000 });
    if (result.success && Array.isArray(result.data)) {
      setHoSoList(result.data.map(mapFromApi));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Thống kê
  const tongHoSo = hoSoList.length;
  const daNop = hoSoList.filter(hs => hs.TrangThai === 'Đã nộp').length;
  const dangXuLy = hoSoList.filter(hs => hs.TrangThai === 'Đang xử lý').length;
  const hoanThanh = hoSoList.filter(hs => hs.TrangThai === 'Hoàn thành').length;
  const canBoSung = hoSoList.filter(hs => hs.TrangThai === 'Cần bổ sung').length;

  const chartItems = [
    { label: 'Tổng hồ sơ', value: tongHoSo, color: '#d97706' },
    { label: 'Đã nộp', value: daNop, color: '#2563eb' },
    { label: 'Đang xử lý', value: dangXuLy, color: '#eab308' },
    { label: 'Hoàn thành', value: hoanThanh, color: '#16a34a' },
    { label: 'Cần bổ sung', value: canBoSung, color: '#dc2626' },
  ];

  // Lọc
  const filteredHoSo = hoSoList.filter(hs => {
    const matchSearch = hs.TenDiTich.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       hs.MaHoSo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       hs.NguoiNop.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTrangThai = selectedTrangThai === 'all' || hs.TrangThai === selectedTrangThai;
    return matchSearch && matchTrangThai;
  });

  const handleView = (hoSo: HoSoDiTich) => {
    setSelectedHoSo(hoSo);
    setViewDialog(true);
  };

  const handleEdit = (hoSo: HoSoDiTich) => {
    setSelectedHoSo(hoSo);
    setFormData(hoSo);
    setEditDialog(true);
  };

  const handleAdd = () => {
    setFormData({
      CapDo: 'Huyện',
      TrangThai: 'Đã nộp',
      NgayNop: new Date().toISOString().split('T')[0],
      NgayDuyet: ''
    });
    setAddDialog(true);
  };

  const handleDelete = async (maHoSo: string) => {
    if (confirm('Bạn có chắc muốn xóa hồ sơ này?')) {
      const id = toNumericId(maHoSo);
      if (Number.isFinite(id)) {
        const result = await hoSoDiTichApi.delete(id);
        if (result.success) {
          await loadData();
          return;
        }
      }
      setHoSoList(hoSoList.filter(hs => hs.MaHoSo !== maHoSo));
    }
  };

  const handleSaveEdit = async () => {
    if (selectedHoSo && formData) {
      const id = toNumericId(selectedHoSo.MaHoSo);
      if (Number.isFinite(id)) {
        const result = await hoSoDiTichApi.update(id, mapToApi(formData));
        if (result.success) {
          setEditDialog(false);
          await loadData();
          return;
        }
      }

      setHoSoList(hoSoList.map(hs =>
        hs.MaHoSo === selectedHoSo.MaHoSo ? { ...hs, ...formData } : hs
      ));
      setEditDialog(false);
    }
  };

  const handleSaveAdd = async () => {
    if (formData.TenDiTich) {
      const result = await hoSoDiTichApi.create(mapToApi(formData));
      if (result.success) {
        setAddDialog(false);
        await loadData();
        return;
      }

      const newHoSo: HoSoDiTich = {
        MaHoSo: `HS${String(hoSoList.length + 1).padStart(3, '0')}`,
        TenDiTich: formData.TenDiTich || '',
        CapDo: (formData.CapDo as HoSoDiTich['CapDo']) || 'Huyện',
        LoaiHoSo: formData.LoaiHoSo || '',
        TrangThai: (formData.TrangThai as HoSoDiTich['TrangThai']) || 'Đã nộp',
        NgayNop: formData.NgayNop || new Date().toISOString().split('T')[0],
        NgayDuyet: formData.NgayDuyet || '',
        NguoiNop: formData.NguoiNop || '',
        TaiLieu: formData.TaiLieu || '0 tài liệu',
        GhiChu: formData.GhiChu || ''
      };
      setHoSoList([...hoSoList, newHoSo]);
      setAddDialog(false);
    }
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-accent via-status-warning to-accent p-4 sm:p-5 xl:p-6 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-10 w-10" />
            <h1 className="text-3xl font-bold">Hồ sơ Di tích</h1>
          </div>
          <p className="text-amber-50">Quản lý hồ sơ, tài liệu di tích lịch sử văn hóa</p>
        </div>
      </div>

      <FunctionStyledPanel
        title="Tiến độ xử lý hồ sơ di tích"
        subtitle="Đo lường trạng thái thẩm định và các hồ sơ cần bổ sung trong kỳ"
        items={chartItems}
        variant="culture-heritage-dossier"
      />

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Danh sách Hồ sơ</CardTitle>
              <CardDescription>Quản lý {filteredHoSo.length} hồ sơ di tích</CardDescription>
            </div>
            <Button onClick={handleAdd} className="bg-amber-600 hover:bg-amber-700">
              <Plus className="mr-2 h-4 w-4" />
              Thêm hồ sơ
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm hồ sơ..."
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
                <SelectItem value="Đã nộp">Đã nộp</SelectItem>
                <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                <SelectItem value="Cần bổ sung">Cần bổ sung</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã HS</TableHead>
                  <TableHead>Tên di tích</TableHead>
                  <TableHead>Cấp độ</TableHead>
                  <TableHead>Loại hồ sơ</TableHead>
                  <TableHead>Người nộp</TableHead>
                  <TableHead>Ngày nộp</TableHead>
                  <TableHead>Tài liệu</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHoSo.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                      Không tìm thấy hồ sơ nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHoSo.map((hoSo) => (
                    <TableRow key={hoSo.MaHoSo}>
                      <TableCell className="font-medium">{hoSo.MaHoSo}</TableCell>
                      <TableCell className="font-medium">{hoSo.TenDiTich}</TableCell>
                      <TableCell>
                        <Badge className={capDoColors[hoSo.CapDo]}>
                          {hoSo.CapDo}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{hoSo.LoaiHoSo}</TableCell>
                      <TableCell className="text-sm">{hoSo.NguoiNop}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {hoSo.NgayNop}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <FileText className="h-3 w-3 text-muted-foreground" />
                          {hoSo.TaiLieu}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={trangThaiColors[hoSo.TrangThai]}>
                          {hoSo.TrangThai}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(hoSo)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(hoSo)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(hoSo.MaHoSo)}
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
              <FileText className="h-5 w-5 text-amber-600" />
              Chi tiết Hồ sơ
            </DialogTitle>
            <DialogDescription>Thông tin chi tiết hồ sơ di tích</DialogDescription>
          </DialogHeader>
          {selectedHoSo && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Mã hồ sơ</Label>
                  <p className="font-medium">{selectedHoSo.MaHoSo}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tên di tích</Label>
                  <p className="font-medium">{selectedHoSo.TenDiTich}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Cấp độ</Label>
                  <div className="mt-1">
                    <Badge className={capDoColors[selectedHoSo.CapDo]}>
                      {selectedHoSo.CapDo}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Loại hồ sơ</Label>
                  <p className="font-medium">{selectedHoSo.LoaiHoSo}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Trạng thái</Label>
                  <div className="mt-1">
                    <Badge className={trangThaiColors[selectedHoSo.TrangThai]}>
                      {selectedHoSo.TrangThai}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Người nộp</Label>
                  <p className="font-medium">{selectedHoSo.NguoiNop}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Ngày nộp</Label>
                  <p className="font-medium">{selectedHoSo.NgayNop}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Ngày duyệt</Label>
                  <p className="font-medium">{selectedHoSo.NgayDuyet || 'Chưa duyệt'}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Tài liệu đính kèm</Label>
                <p className="font-medium">{selectedHoSo.TaiLieu}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Ghi chú</Label>
                <p className="font-medium">{selectedHoSo.GhiChu}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialog(false)}>
              Đóng
            </Button>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Download className="mr-2 h-4 w-4" />
              Tải hồ sơ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Hồ sơ</DialogTitle>
            <DialogDescription>Cập nhật thông tin hồ sơ di tích</DialogDescription>
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
                <Label>Loại hồ sơ</Label>
                <Input
                  value={formData.LoaiHoSo || ''}
                  onChange={(e) => setFormData({ ...formData, LoaiHoSo: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Cấp độ</Label>
                <Select
                  value={formData.CapDo}
                  onValueChange={(value) => setFormData({ ...formData, CapDo: value as HoSoDiTich['CapDo'] })}
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
                <Label>Trạng thái</Label>
                <Select
                  value={formData.TrangThai}
                  onValueChange={(value) => setFormData({ ...formData, TrangThai: value as HoSoDiTich['TrangThai'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đã nộp">Đã nộp</SelectItem>
                    <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                    <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                    <SelectItem value="Cần bổ sung">Cần bổ sung</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Người nộp</Label>
                <Input
                  value={formData.NguoiNop || ''}
                  onChange={(e) => setFormData({ ...formData, NguoiNop: e.target.value })}
                />
              </div>
              <div>
                <Label>Ngày duyệt</Label>
                <Input
                  type="date"
                  value={formData.NgayDuyet || ''}
                  onChange={(e) => setFormData({ ...formData, NgayDuyet: e.target.value })}
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
            <DialogTitle>Thêm Hồ sơ mới</DialogTitle>
            <DialogDescription>Nhập thông tin hồ sơ di tích mới</DialogDescription>
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
                <Label>Loại hồ sơ</Label>
                <Input
                  value={formData.LoaiHoSo || ''}
                  onChange={(e) => setFormData({ ...formData, LoaiHoSo: e.target.value })}
                  placeholder="Vd: Hồ sơ xếp hạng"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Cấp độ</Label>
                <Select
                  value={formData.CapDo}
                  onValueChange={(value) => setFormData({ ...formData, CapDo: value as HoSoDiTich['CapDo'] })}
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
                <Label>Trạng thái</Label>
                <Select
                  value={formData.TrangThai}
                  onValueChange={(value) => setFormData({ ...formData, TrangThai: value as HoSoDiTich['TrangThai'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đã nộp">Đã nộp</SelectItem>
                    <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                    <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                    <SelectItem value="Cần bổ sung">Cần bổ sung</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Người nộp</Label>
                <Input
                  value={formData.NguoiNop || ''}
                  onChange={(e) => setFormData({ ...formData, NguoiNop: e.target.value })}
                  placeholder="UBND xã, Ban quản lý..."
                />
              </div>
              <div>
                <Label>Ngày nộp</Label>
                <Input
                  type="date"
                  value={formData.NgayNop || ''}
                  onChange={(e) => setFormData({ ...formData, NgayNop: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Tài liệu đính kèm</Label>
              <Input
                value={formData.TaiLieu || ''}
                onChange={(e) => setFormData({ ...formData, TaiLieu: e.target.value })}
                placeholder="Số lượng tài liệu"
              />
            </div>
            <div>
              <Label>Ghi chú</Label>
              <Textarea
                value={formData.GhiChu || ''}
                onChange={(e) => setFormData({ ...formData, GhiChu: e.target.value })}
                rows={3}
                placeholder="Ghi chú về hồ sơ..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveAdd} className="bg-amber-600 hover:bg-amber-700">
              Thêm hồ sơ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
