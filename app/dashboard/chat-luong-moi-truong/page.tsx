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
import { Activity, AlertTriangle, CheckCircle2, Eye, Edit, MapPin, Plus, Search, Trash2 } from 'lucide-react';
import { FunctionStyledPanel } from '@/components/charts/function-styled-panel';
import { tramQuanTracMTApi } from '@/lib/api';

interface TramQuanTracRecord {
  MaTram?: number;
  TenTram: string;
  DiaChi: string;
  ToaDo: string;
  LoaiTram: string;
  TrangThai: string;
  NgayLapDat: string;
  GhiChu: string;
}

const loaiTramOptions = ['Không khí', 'Nước mặt', 'Nước ngầm', 'Đất'];
const trangThaiOptions = ['Hoạt động', 'Bảo trì', 'Tạm dừng'];

const emptyForm: TramQuanTracRecord = {
  TenTram: '',
  DiaChi: '',
  ToaDo: '',
  LoaiTram: '',
  TrangThai: 'Hoạt động',
  NgayLapDat: '',
  GhiChu: '',
};

function toDateString(value: unknown): string {
  if (!value) return '';
  return String(value).slice(0, 10);
}

function mapFromApi(item: any): TramQuanTracRecord {
  return {
    MaTram: Number(item.MaTram),
    TenTram: item.TenTram || '',
    DiaChi: item.DiaChi || '',
    ToaDo: item.ToaDo || '',
    LoaiTram: item.LoaiTram || '',
    TrangThai: item.TrangThai || 'Hoạt động',
    NgayLapDat: toDateString(item.NgayLapDat),
    GhiChu: item.GhiChu || '',
  };
}

export default function ChatLuongMoiTruongPage() {
  const [records, setRecords] = useState<TramQuanTracRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLoai, setFilterLoai] = useState<string>('all');
  const [selected, setSelected] = useState<TramQuanTracRecord | null>(null);
  const [addForm, setAddForm] = useState<TramQuanTracRecord>(emptyForm);
  const [editForm, setEditForm] = useState<TramQuanTracRecord>(emptyForm);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const loadData = async () => {
    const result = await tramQuanTracMTApi.getList({ page: 1, limit: 5000 });
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
    if (!addForm.TenTram.trim()) {
      alert('Tên trạm là bắt buộc');
      return;
    }

    const result = await tramQuanTracMTApi.create({
      TenTram: addForm.TenTram,
      DiaChi: addForm.DiaChi || null,
      ToaDo: addForm.ToaDo || null,
      LoaiTram: addForm.LoaiTram || null,
      TrangThai: addForm.TrangThai || 'Hoạt động',
      NgayLapDat: addForm.NgayLapDat || null,
      GhiChu: addForm.GhiChu || null,
    });

    if (!result.success) {
      alert(result.message || 'Không thể thêm trạm quan trắc');
      return;
    }

    setIsAddOpen(false);
    setAddForm(emptyForm);
    await loadData();
  };

  const handleUpdate = async () => {
    if (!selected?.MaTram) {
      alert('Không xác định được trạm để cập nhật');
      return;
    }

    const result = await tramQuanTracMTApi.update(selected.MaTram, {
      TenTram: editForm.TenTram,
      DiaChi: editForm.DiaChi || null,
      ToaDo: editForm.ToaDo || null,
      LoaiTram: editForm.LoaiTram || null,
      TrangThai: editForm.TrangThai || 'Hoạt động',
      NgayLapDat: editForm.NgayLapDat || null,
      GhiChu: editForm.GhiChu || null,
    });

    if (!result.success) {
      alert(result.message || 'Không thể cập nhật trạm quan trắc');
      return;
    }

    setIsEditOpen(false);
    setSelected(null);
    setEditForm(emptyForm);
    await loadData();
  };

  const handleDelete = async (record: TramQuanTracRecord) => {
    if (!record.MaTram) {
      alert('Không xác định được trạm để xóa');
      return;
    }

    if (!window.confirm(`Xóa trạm ${record.TenTram}?`)) {
      return;
    }

    const result = await tramQuanTracMTApi.delete(record.MaTram);
    if (!result.success) {
      alert(result.message || 'Không thể xóa trạm quan trắc');
      return;
    }

    await loadData();
  };

  const filteredData = records.filter((item) => {
    const matchesSearch =
      item.TenTram.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.DiaChi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ToaDo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLoai = filterLoai === 'all' || item.LoaiTram === filterLoai;
    return matchesSearch && matchesLoai;
  });

  const stats = {
    total: records.length,
    active: records.filter((x) => x.TrangThai === 'Hoạt động').length,
    warning: records.filter((x) => x.TrangThai === 'Bảo trì' || x.TrangThai === 'Tạm dừng').length,
  };

  const chartItems = [
    { label: 'Tổng trạm', value: stats.total, color: '#0284c7' },
    { label: 'Đang hoạt động', value: stats.active, color: '#16a34a' },
    { label: 'Cần kiểm tra', value: stats.warning, color: '#f59e0b' },
  ];

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      <div className="bg-gradient-to-r from-status-success via-secondary to-status-success rounded-lg p-4 sm:p-5 xl:p-6 text-white">
        <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Giám sát Chất lượng Môi trường</h1>
              <p className="text-green-100">Quản lý danh sách trạm quan trắc môi trường</p>
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
              <Button className="bg-white text-green-600 hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />
                Thêm trạm
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Thêm trạm quan trắc</DialogTitle>
                <DialogDescription>Nhập thông tin trạm mới</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2 col-span-2">
                  <Label>Tên trạm *</Label>
                  <Input value={addForm.TenTram} onChange={(e) => setAddForm((p) => ({ ...p, TenTram: e.target.value }))} />
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
                  <Label>Loại trạm</Label>
                  <Select value={addForm.LoaiTram || undefined} onValueChange={(v) => setAddForm((p) => ({ ...p, LoaiTram: v }))}>
                    <SelectTrigger><SelectValue placeholder="Chọn loại" /></SelectTrigger>
                    <SelectContent>
                      {loaiTramOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <Select value={addForm.TrangThai} onValueChange={(v) => setAddForm((p) => ({ ...p, TrangThai: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {trangThaiOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ngày lắp đặt</Label>
                  <Input type="date" value={addForm.NgayLapDat} onChange={(e) => setAddForm((p) => ({ ...p, NgayLapDat: e.target.value }))} />
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
        title="Toan canh van hanh tram quan trac"
        subtitle="Theo doi nhanh so luong tram hoat dong va cac diem can bao tri"
        items={chartItems}
        variant="env-air-quality"
      />

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Tìm theo tên trạm, địa chỉ, tọa độ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterLoai} onValueChange={setFilterLoai}>
              <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Loại trạm" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {loaiTramOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách trạm quan trắc</CardTitle>
          <CardDescription>Tìm thấy {filteredData.length} trạm</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã</TableHead>
                <TableHead>Tên trạm</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày lắp</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.MaTram}>
                  <TableCell className="font-medium">{item.MaTram}</TableCell>
                  <TableCell>{item.TenTram}</TableCell>
                  <TableCell>{item.LoaiTram || '-'}</TableCell>
                  <TableCell>{item.DiaChi || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={item.TrangThai === 'Hoạt động' ? 'secondary' : 'destructive'}>{item.TrangThai}</Badge>
                  </TableCell>
                  <TableCell>{item.NgayLapDat || '-'}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Dialog open={isViewOpen && selected?.MaTram === item.MaTram} onOpenChange={(open) => { setIsViewOpen(open); if (!open) setSelected(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelected(item); setIsViewOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Chi tiết trạm</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-2 text-sm">
                            <p><strong>Tên trạm:</strong> {item.TenTram}</p>
                            <p><strong>Loại trạm:</strong> {item.LoaiTram || '-'}</p>
                            <p><strong>Địa chỉ:</strong> {item.DiaChi || '-'}</p>
                            <p><strong>Tọa độ:</strong> {item.ToaDo || '-'}</p>
                            <p><strong>Trạng thái:</strong> {item.TrangThai}</p>
                            <p><strong>Ngày lắp đặt:</strong> {item.NgayLapDat || '-'}</p>
                            <p><strong>Ghi chú:</strong> {item.GhiChu || '-'}</p>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={isEditOpen && selected?.MaTram === item.MaTram} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setSelected(null); }}>
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
                            <DialogTitle>Cập nhật trạm</DialogTitle>
                            <DialogDescription>Mã trạm: {item.MaTram}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2 col-span-2">
                              <Label>Tên trạm</Label>
                              <Input value={editForm.TenTram} onChange={(e) => setEditForm((p) => ({ ...p, TenTram: e.target.value }))} />
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
                              <Label>Loại trạm</Label>
                              <Select value={editForm.LoaiTram || undefined} onValueChange={(v) => setEditForm((p) => ({ ...p, LoaiTram: v }))}>
                                <SelectTrigger><SelectValue placeholder="Chọn loại" /></SelectTrigger>
                                <SelectContent>
                                  {loaiTramOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Trạng thái</Label>
                              <Select value={editForm.TrangThai} onValueChange={(v) => setEditForm((p) => ({ ...p, TrangThai: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {trangThaiOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Ngày lắp đặt</Label>
                              <Input type="date" value={editForm.NgayLapDat} onChange={(e) => setEditForm((p) => ({ ...p, NgayLapDat: e.target.value }))} />
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

      {stats.warning > 0 && (
        <Card className="border-l-4 border-l-status-warning">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-status-warning">
              <AlertTriangle className="h-5 w-5" />
              Cảnh báo vận hành
            </CardTitle>
          </CardHeader>
          <CardContent>
            Có {stats.warning} trạm đang bảo trì hoặc tạm dừng, cần kiểm tra kế hoạch vận hành.
          </CardContent>
        </Card>
      )}

      {stats.active > 0 && (
        <Card className="border-l-4 border-l-status-success">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-status-success">
              <CheckCircle2 className="h-5 w-5" />
              Trạm hoạt động ổn định
            </CardTitle>
          </CardHeader>
          <CardContent>
            Có {stats.active} trạm đang hoạt động bình thường.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
