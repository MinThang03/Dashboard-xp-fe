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
import { CheckCircle2, Clock, Edit, Eye, MapPin, Plus, Scale, Search, Trash2 } from 'lucide-react';
import { FunctionStyledPanel } from '@/components/charts/function-styled-panel';
import { racThaiApi } from '@/lib/api';

interface RacThaiRecord {
  MaDiem?: number;
  TenDiem: string;
  DiaChi: string;
  ToaDo: string;
  LoaiRac: string;
  KhoiLuongThang: number;
  TinhTrang: string;
  NgayCapNhat: string;
  TuyenThuGom: string;
  ThoiGianThuGom: string;
  GhiChu: string;
}

const loaiRacOptions = ['Hữu cơ', 'Tái chế', 'Hỗn hợp', 'Công nghiệp', 'Nguy hại'];
const tinhTrangOptions = ['Bình thường', 'Đang thu gom', 'Quá tải', 'Tạm dừng'];

const emptyForm: RacThaiRecord = {
  TenDiem: '',
  DiaChi: '',
  ToaDo: '',
  LoaiRac: '',
  KhoiLuongThang: 0,
  TinhTrang: 'Bình thường',
  NgayCapNhat: '',
  TuyenThuGom: '',
  ThoiGianThuGom: '',
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

function toTimeString(value: unknown): string {
  if (!value) return '';
  return String(value).slice(0, 5);
}

function mapFromApi(item: any): RacThaiRecord {
  return {
    MaDiem: Number(item.MaDiem),
    TenDiem: item.TenDiem || '',
    DiaChi: item.DiaChi || '',
    ToaDo: item.ToaDo || '',
    LoaiRac: item.LoaiRac || '',
    KhoiLuongThang: toNumber(item.KhoiLuongThang),
    TinhTrang: item.TinhTrang || 'Bình thường',
    NgayCapNhat: toDateString(item.NgayCapNhat),
    TuyenThuGom: item.TuyenThuGom || '',
    ThoiGianThuGom: toTimeString(item.ThoiGianThuGom),
    GhiChu: item.GhiChu || '',
  };
}

export default function RacThaiPage() {
  const [records, setRecords] = useState<RacThaiRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLoai, setFilterLoai] = useState<string>('all');
  const [selected, setSelected] = useState<RacThaiRecord | null>(null);
  const [addForm, setAddForm] = useState<RacThaiRecord>(emptyForm);
  const [editForm, setEditForm] = useState<RacThaiRecord>(emptyForm);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const loadData = async () => {
    const result = await racThaiApi.getList({ page: 1, limit: 5000 });
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
    if (!addForm.TenDiem.trim()) {
      alert('Tên điểm thu gom là bắt buộc');
      return;
    }

    const result = await racThaiApi.create({
      TenDiem: addForm.TenDiem,
      DiaChi: addForm.DiaChi || null,
      ToaDo: addForm.ToaDo || null,
      LoaiRac: addForm.LoaiRac || null,
      KhoiLuongThang: toNumber(addForm.KhoiLuongThang),
      TinhTrang: addForm.TinhTrang || 'Bình thường',
      NgayCapNhat: addForm.NgayCapNhat || new Date().toISOString(),
      TuyenThuGom: addForm.TuyenThuGom || null,
      ThoiGianThuGom: addForm.ThoiGianThuGom || null,
      GhiChu: addForm.GhiChu || null,
    });

    if (!result.success) {
      alert(result.message || 'Không thể tạo điểm thu gom');
      return;
    }

    setIsAddOpen(false);
    setAddForm(emptyForm);
    await loadData();
  };

  const handleUpdate = async () => {
    if (!selected?.MaDiem) {
      alert('Không xác định được bản ghi để cập nhật');
      return;
    }

    const result = await racThaiApi.update(selected.MaDiem, {
      TenDiem: editForm.TenDiem,
      DiaChi: editForm.DiaChi || null,
      ToaDo: editForm.ToaDo || null,
      LoaiRac: editForm.LoaiRac || null,
      KhoiLuongThang: toNumber(editForm.KhoiLuongThang),
      TinhTrang: editForm.TinhTrang || 'Bình thường',
      NgayCapNhat: editForm.NgayCapNhat || new Date().toISOString(),
      TuyenThuGom: editForm.TuyenThuGom || null,
      ThoiGianThuGom: editForm.ThoiGianThuGom || null,
      GhiChu: editForm.GhiChu || null,
    });

    if (!result.success) {
      alert(result.message || 'Không thể cập nhật điểm thu gom');
      return;
    }

    setIsEditOpen(false);
    setSelected(null);
    setEditForm(emptyForm);
    await loadData();
  };

  const handleDelete = async (record: RacThaiRecord) => {
    if (!record.MaDiem) {
      alert('Không xác định được bản ghi để xóa');
      return;
    }

    if (!window.confirm(`Xóa điểm thu gom ${record.TenDiem}?`)) {
      return;
    }

    const result = await racThaiApi.delete(record.MaDiem);
    if (!result.success) {
      alert(result.message || 'Không thể xóa điểm thu gom');
      return;
    }

    await loadData();
  };

  const filteredData = records.filter((item) => {
    const matchesSearch =
      item.TenDiem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.DiaChi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ToaDo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLoai = filterLoai === 'all' || item.LoaiRac === filterLoai;
    return matchesSearch && matchesLoai;
  });

  const stats = {
    total: records.length,
    totalKhoiLuong: records.reduce((sum, item) => sum + toNumber(item.KhoiLuongThang), 0),
    normal: records.filter((item) => item.TinhTrang === 'Bình thường').length,
  };

  const chartItems = [
    { label: 'Tổng điểm thu gom', value: stats.total, color: '#f59e0b' },
    { label: 'Khối lượng kg/tháng', value: stats.totalKhoiLuong, color: '#d97706' },
    { label: 'Điểm bình thường', value: stats.normal, color: '#16a34a' },
  ];

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      <div className="bg-gradient-to-r from-status-warning via-accent to-status-warning rounded-lg p-4 sm:p-5 xl:p-6 text-white">
        <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Trash2 className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Quản lý Rác thải</h1>
              <p className="text-amber-100">Theo dõi điểm thu gom và khối lượng rác thải</p>
            </div>
          </div>
          <Dialog
            open={isAddOpen}
            onOpenChange={(open) => {
              setIsAddOpen(open);
              if (open) setAddForm(emptyForm);
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-white text-amber-600 hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />
                Thêm điểm thu gom
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Thêm điểm thu gom</DialogTitle>
                <DialogDescription>Nhập thông tin điểm thu gom mới</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2 col-span-2">
                  <Label>Tên điểm *</Label>
                  <Input value={addForm.TenDiem} onChange={(e) => setAddForm((p) => ({ ...p, TenDiem: e.target.value }))} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Địa chỉ</Label>
                  <Input value={addForm.DiaChi} onChange={(e) => setAddForm((p) => ({ ...p, DiaChi: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Tọa độ</Label>
                  <Input value={addForm.ToaDo} onChange={(e) => setAddForm((p) => ({ ...p, ToaDo: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Loại rác</Label>
                  <Select value={addForm.LoaiRac || undefined} onValueChange={(v) => setAddForm((p) => ({ ...p, LoaiRac: v }))}>
                    <SelectTrigger><SelectValue placeholder="Chọn loại" /></SelectTrigger>
                    <SelectContent>
                      {loaiRacOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Khối lượng (kg/tháng)</Label>
                  <Input type="number" value={addForm.KhoiLuongThang} onChange={(e) => setAddForm((p) => ({ ...p, KhoiLuongThang: toNumber(e.target.value) }))} />
                </div>
                <div className="space-y-2">
                  <Label>Tình trạng</Label>
                  <Select value={addForm.TinhTrang} onValueChange={(v) => setAddForm((p) => ({ ...p, TinhTrang: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {tinhTrangOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ngày cập nhật</Label>
                  <Input type="date" value={addForm.NgayCapNhat} onChange={(e) => setAddForm((p) => ({ ...p, NgayCapNhat: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Tuyến thu gom</Label>
                  <Input value={addForm.TuyenThuGom} onChange={(e) => setAddForm((p) => ({ ...p, TuyenThuGom: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Thời gian thu gom</Label>
                  <Input type="time" value={addForm.ThoiGianThuGom} onChange={(e) => setAddForm((p) => ({ ...p, ThoiGianThuGom: e.target.value }))} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Ghi chú</Label>
                  <Textarea value={addForm.GhiChu} onChange={(e) => setAddForm((p) => ({ ...p, GhiChu: e.target.value }))} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Hủy</Button>
                <Button onClick={handleCreate}>Thêm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <FunctionStyledPanel
        title="Bức tranh thu gom rác thải"
        subtitle="Tổng hợp khối lượng thu gom theo tình trạng vận hành từng điểm"
        items={chartItems}
        variant="env-waste-management"
      />

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Tìm theo tên điểm, địa chỉ, tọa độ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterLoai} onValueChange={setFilterLoai}>
              <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Loại rác" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {loaiRacOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách điểm thu gom</CardTitle>
          <CardDescription>Tìm thấy {filteredData.length} điểm</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã</TableHead>
                <TableHead>Tên điểm</TableHead>
                <TableHead>Loại rác</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead className="text-right">Khối lượng</TableHead>
                <TableHead>Tình trạng</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.MaDiem}>
                  <TableCell className="font-medium">{item.MaDiem}</TableCell>
                  <TableCell>{item.TenDiem}</TableCell>
                  <TableCell>{item.LoaiRac || '-'}</TableCell>
                  <TableCell>{item.DiaChi || '-'}</TableCell>
                  <TableCell className="text-right">{item.KhoiLuongThang}</TableCell>
                  <TableCell>
                    <Badge variant={item.TinhTrang === 'Bình thường' ? 'secondary' : 'destructive'}>{item.TinhTrang}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Dialog open={isViewOpen && selected?.MaDiem === item.MaDiem} onOpenChange={(open) => { setIsViewOpen(open); if (!open) setSelected(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelected(item); setIsViewOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Chi tiết điểm thu gom</DialogTitle></DialogHeader>
                          <div className="space-y-2 text-sm">
                            <p><strong>Tên điểm:</strong> {item.TenDiem}</p>
                            <p><strong>Địa chỉ:</strong> {item.DiaChi || '-'}</p>
                            <p><strong>Tọa độ:</strong> {item.ToaDo || '-'}</p>
                            <p><strong>Loại rác:</strong> {item.LoaiRac || '-'}</p>
                            <p><strong>Khối lượng:</strong> {item.KhoiLuongThang}</p>
                            <p><strong>Tình trạng:</strong> {item.TinhTrang}</p>
                            <p><strong>Ngày cập nhật:</strong> {item.NgayCapNhat || '-'}</p>
                            <p><strong>Tuyến thu gom:</strong> {item.TuyenThuGom || '-'}</p>
                            <p><strong>Thời gian thu gom:</strong> {item.ThoiGianThuGom || '-'}</p>
                            <p><strong>Ghi chú:</strong> {item.GhiChu || '-'}</p>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={isEditOpen && selected?.MaDiem === item.MaDiem} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setSelected(null); }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelected(item);
                              setEditForm({ ...item });
                              setIsEditOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Cập nhật điểm thu gom</DialogTitle>
                            <DialogDescription>Mã điểm: {item.MaDiem}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2 col-span-2">
                              <Label>Tên điểm</Label>
                              <Input value={editForm.TenDiem} onChange={(e) => setEditForm((p) => ({ ...p, TenDiem: e.target.value }))} />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label>Địa chỉ</Label>
                              <Input value={editForm.DiaChi} onChange={(e) => setEditForm((p) => ({ ...p, DiaChi: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                              <Label>Tọa độ</Label>
                              <Input value={editForm.ToaDo} onChange={(e) => setEditForm((p) => ({ ...p, ToaDo: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                              <Label>Loại rác</Label>
                              <Select value={editForm.LoaiRac || undefined} onValueChange={(v) => setEditForm((p) => ({ ...p, LoaiRac: v }))}>
                                <SelectTrigger><SelectValue placeholder="Chọn loại" /></SelectTrigger>
                                <SelectContent>
                                  {loaiRacOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Khối lượng (kg/tháng)</Label>
                              <Input type="number" value={editForm.KhoiLuongThang} onChange={(e) => setEditForm((p) => ({ ...p, KhoiLuongThang: toNumber(e.target.value) }))} />
                            </div>
                            <div className="space-y-2">
                              <Label>Tình trạng</Label>
                              <Select value={editForm.TinhTrang} onValueChange={(v) => setEditForm((p) => ({ ...p, TinhTrang: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {tinhTrangOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Ngày cập nhật</Label>
                              <Input type="date" value={editForm.NgayCapNhat} onChange={(e) => setEditForm((p) => ({ ...p, NgayCapNhat: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                              <Label>Tuyến thu gom</Label>
                              <Input value={editForm.TuyenThuGom} onChange={(e) => setEditForm((p) => ({ ...p, TuyenThuGom: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                              <Label>Thời gian thu gom</Label>
                              <Input type="time" value={editForm.ThoiGianThuGom} onChange={(e) => setEditForm((p) => ({ ...p, ThoiGianThuGom: e.target.value }))} />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label>Ghi chú</Label>
                              <Textarea value={editForm.GhiChu} onChange={(e) => setEditForm((p) => ({ ...p, GhiChu: e.target.value }))} />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Hủy</Button>
                            <Button onClick={handleUpdate}>Cập nhật</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredData.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">Không có dữ liệu</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
