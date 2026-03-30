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
import { AlertCircle, AlertTriangle, CheckCircle2, Clock, Edit, Eye, FileText, Plus, Search, Trash2 } from 'lucide-react';
import { baoCaoONhiemApi } from '@/lib/api';

interface BaoCaoONhiem {
  MaBaoCao?: number;
  LoaiONhiem: string;
  KhuVuc: string;
  MucDo: string;
  NoiDung: string;
  NgayBaoCao: string;
  NguoiBaoCao: number;
  TrangThai: string;
}

const loaiONhiemOptions = ['Không khí', 'Nước', 'Tiếng ồn', 'Rác thải', 'Đất', 'Khác'];
const mucDoOptions = ['Nhẹ', 'Trung bình', 'Nghiêm trọng'];
const trangThaiOptions = ['Chờ xử lý', 'Đang xử lý', 'Đã xử lý'];

const emptyForm: BaoCaoONhiem = {
  LoaiONhiem: '',
  KhuVuc: '',
  MucDo: 'Nhẹ',
  NoiDung: '',
  NgayBaoCao: '',
  NguoiBaoCao: 0,
  TrangThai: 'Chờ xử lý',
};

function toNumber(value: unknown): number {
  const num = Number(value ?? 0);
  return Number.isFinite(num) ? num : 0;
}

function toDateString(value: unknown): string {
  if (!value) return '';
  return String(value).slice(0, 10);
}

function mapFromApi(item: any): BaoCaoONhiem {
  return {
    MaBaoCao: Number(item.MaBaoCao),
    LoaiONhiem: item.LoaiONhiem || '',
    KhuVuc: item.KhuVuc || '',
    MucDo: item.MucDo || 'Nhẹ',
    NoiDung: item.NoiDung || '',
    NgayBaoCao: toDateString(item.NgayBaoCao),
    NguoiBaoCao: toNumber(item.NguoiBaoCao),
    TrangThai: item.TrangThai || 'Chờ xử lý',
  };
}

export default function BaoCaoONhiemPage() {
  const [records, setRecords] = useState<BaoCaoONhiem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLoai, setFilterLoai] = useState<string>('all');
  const [filterMucDo, setFilterMucDo] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<BaoCaoONhiem | null>(null);
  const [addForm, setAddForm] = useState<BaoCaoONhiem>(emptyForm);
  const [editForm, setEditForm] = useState<BaoCaoONhiem>(emptyForm);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const loadData = async () => {
    const result = await baoCaoONhiemApi.getList({ page: 1, limit: 5000 });
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
    if (!addForm.LoaiONhiem.trim()) {
      alert('Loại ô nhiễm là bắt buộc');
      return;
    }
    if (!addForm.NgayBaoCao) {
      alert('Ngày báo cáo là bắt buộc');
      return;
    }

    const result = await baoCaoONhiemApi.create({
      LoaiONhiem: addForm.LoaiONhiem,
      KhuVuc: addForm.KhuVuc || null,
      MucDo: addForm.MucDo || null,
      NoiDung: addForm.NoiDung || null,
      NgayBaoCao: addForm.NgayBaoCao,
      NguoiBaoCao: toNumber(addForm.NguoiBaoCao) || null,
      TrangThai: addForm.TrangThai || 'Chờ xử lý',
    });

    if (!result.success) {
      alert(result.message || 'Không thể tạo báo cáo ô nhiễm');
      return;
    }

    setIsAddOpen(false);
    setAddForm(emptyForm);
    await loadData();
  };

  const handleUpdate = async () => {
    if (!selectedItem?.MaBaoCao) {
      alert('Không xác định được bản ghi để cập nhật');
      return;
    }

    const result = await baoCaoONhiemApi.update(selectedItem.MaBaoCao, {
      LoaiONhiem: editForm.LoaiONhiem,
      KhuVuc: editForm.KhuVuc || null,
      MucDo: editForm.MucDo || null,
      NoiDung: editForm.NoiDung || null,
      NgayBaoCao: editForm.NgayBaoCao,
      NguoiBaoCao: toNumber(editForm.NguoiBaoCao) || null,
      TrangThai: editForm.TrangThai || 'Chờ xử lý',
    });

    if (!result.success) {
      alert(result.message || 'Không thể cập nhật báo cáo ô nhiễm');
      return;
    }

    setIsEditOpen(false);
    setSelectedItem(null);
    setEditForm(emptyForm);
    await loadData();
  };

  const handleDelete = async (item: BaoCaoONhiem) => {
    if (!item.MaBaoCao) {
      alert('Không xác định được bản ghi để xóa');
      return;
    }

    if (!window.confirm(`Xóa báo cáo #${item.MaBaoCao}?`)) {
      return;
    }

    const result = await baoCaoONhiemApi.delete(item.MaBaoCao);
    if (!result.success) {
      alert(result.message || 'Không thể xóa báo cáo ô nhiễm');
      return;
    }

    await loadData();
  };

  const filteredData = records.filter((item) => {
    const search = searchQuery.toLowerCase();
    const matchesSearch =
      String(item.MaBaoCao ?? '').toLowerCase().includes(search) ||
      item.LoaiONhiem.toLowerCase().includes(search) ||
      item.KhuVuc.toLowerCase().includes(search) ||
      item.NoiDung.toLowerCase().includes(search) ||
      String(item.NguoiBaoCao ?? '').toLowerCase().includes(search);
    const matchesLoai = filterLoai === 'all' || item.LoaiONhiem === filterLoai;
    const matchesMucDo = filterMucDo === 'all' || item.MucDo === filterMucDo;
    const matchesStatus = filterStatus === 'all' || item.TrangThai === filterStatus;
    return matchesSearch && matchesLoai && matchesMucDo && matchesStatus;
  });

  const stats = {
    tongBaoCao: records.length,
    tiepNhan: records.filter((r) => r.TrangThai === 'Chờ xử lý').length,
    dangXuLy: records.filter((r) => r.TrangThai === 'Đang xử lý').length,
    daXuLy: records.filter((r) => r.TrangThai === 'Đã xử lý').length,
    nghiemTrong: records.filter((r) => r.MucDo === 'Nghiêm trọng').length,
  };

  const getMucDoBadge = (mucDo: string) => {
    switch (mucDo) {
      case 'Nhẹ': return <Badge className="bg-green-500 hover:bg-green-600">{mucDo}</Badge>;
      case 'Trung bình': return <Badge className="bg-amber-500 hover:bg-amber-600">{mucDo}</Badge>;
      case 'Nghiêm trọng': return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />{mucDo}</Badge>;
      default: return <Badge variant="secondary">{mucDo}</Badge>;
    }
  };

  const getTrangThaiBadge = (trangThai: string) => {
    switch (trangThai) {
      case 'Chờ xử lý': return <Badge className="bg-blue-500 hover:bg-blue-600"><FileText className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Đang xử lý': return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      case 'Đã xử lý': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />{trangThai}</Badge>;
      default: return <Badge variant="secondary">{trangThai}</Badge>;
    }
  };

  const getLoaiIcon = (loai: string) => {
    switch (loai) {
      case 'Không khí': return '💨';
      case 'Nước': return '💧';
      case 'Tiếng ồn': return '🔊';
      case 'Rác thải': return '🗑️';
      case 'Đất': return '🌍';
      default: return '⚠️';
    }
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-status-danger to-primary rounded-lg p-4 sm:p-5 xl:p-6 text-white">
        <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Báo cáo Ô nhiễm Môi trường</h1>
              <p className="text-red-100">Tiếp nhận và xử lý các báo cáo ô nhiễm từ người dân</p>
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
              <Button className="w-full 2xl:w-auto bg-white text-red-600 hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />
                Tiếp nhận báo cáo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tiếp nhận báo cáo ô nhiễm mới</DialogTitle>
                <DialogDescription>Nhập thông tin báo cáo ô nhiễm</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Loại ô nhiễm *</Label>
                  <Select value={addForm.LoaiONhiem || undefined} onValueChange={(v) => setAddForm((p) => ({ ...p, LoaiONhiem: v }))}>
                    <SelectTrigger><SelectValue placeholder="Chọn loại" /></SelectTrigger>
                    <SelectContent>
                      {loaiONhiemOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Khu vực</Label>
                  <Input value={addForm.KhuVuc} onChange={(e) => setAddForm((p) => ({ ...p, KhuVuc: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Mức độ</Label>
                  <Select value={addForm.MucDo || undefined} onValueChange={(v) => setAddForm((p) => ({ ...p, MucDo: v }))}>
                    <SelectTrigger><SelectValue placeholder="Chọn mức độ" /></SelectTrigger>
                    <SelectContent>
                      {mucDoOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ngày báo cáo *</Label>
                  <Input type="date" value={addForm.NgayBaoCao} onChange={(e) => setAddForm((p) => ({ ...p, NgayBaoCao: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Mã người báo cáo</Label>
                  <Input type="number" value={addForm.NguoiBaoCao} onChange={(e) => setAddForm((p) => ({ ...p, NguoiBaoCao: toNumber(e.target.value) }))} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Nội dung</Label>
                  <Textarea rows={4} value={addForm.NoiDung} onChange={(e) => setAddForm((p) => ({ ...p, NoiDung: e.target.value }))} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Trạng thái</Label>
                  <Select value={addForm.TrangThai} onValueChange={(v) => setAddForm((p) => ({ ...p, TrangThai: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {trangThaiOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Hủy</Button>
                <Button onClick={handleCreate}>Tiếp nhận</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng báo cáo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold">{stats.tongBaoCao}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mới tiếp nhận</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{stats.tiepNhan}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đang xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold">{stats.dangXuLy}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đã xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{stats.daXuLy}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Nghiêm trọng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold">{stats.nghiemTrong}</span>
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
                placeholder="Tìm theo mã, loại, khu vực, nội dung..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterLoai} onValueChange={setFilterLoai}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {loaiONhiemOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterMucDo} onValueChange={setFilterMucDo}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Mức độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {mucDoOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {trangThaiOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách báo cáo ô nhiễm</CardTitle>
          <CardDescription>Tìm thấy {filteredData.length} báo cáo</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Khu vực</TableHead>
                <TableHead>Người báo cáo</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Mức độ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.MaBaoCao}>
                  <TableCell className="font-medium text-primary">#{item.MaBaoCao}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{getLoaiIcon(item.LoaiONhiem)}</span>
                      <span>{item.LoaiONhiem}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.KhuVuc || '-'}</TableCell>
                  <TableCell>{item.NguoiBaoCao || '-'}</TableCell>
                  <TableCell>{item.NgayBaoCao}</TableCell>
                  <TableCell>{getMucDoBadge(item.MucDo)}</TableCell>
                  <TableCell>{getTrangThaiBadge(item.TrangThai)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Dialog open={isViewOpen && selectedItem?.MaBaoCao === item.MaBaoCao} onOpenChange={(open) => { setIsViewOpen(open); if (!open) setSelectedItem(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(item); setIsViewOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Chi tiết báo cáo ô nhiễm</DialogTitle>
                            <DialogDescription>Mã: {item.MaBaoCao}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Loại ô nhiễm</p>
                              <p className="font-medium">{getLoaiIcon(item.LoaiONhiem)} {item.LoaiONhiem}</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Khu vực</p>
                              <p className="font-medium">{item.KhuVuc || '-'}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Mức độ</p>
                              {getMucDoBadge(item.MucDo)}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Trạng thái</p>
                              {getTrangThaiBadge(item.TrangThai)}
                            </div>
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Nội dung</p>
                              <p className="font-medium">{item.NoiDung || '-'}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Ngày báo cáo</p>
                              <p className="font-medium">{item.NgayBaoCao}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Mã người báo cáo</p>
                              <p className="font-medium">{item.NguoiBaoCao || '-'}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={isEditOpen && selectedItem?.MaBaoCao === item.MaBaoCao} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setSelectedItem(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(item); setIsEditOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Cập nhật báo cáo ô nhiễm</DialogTitle>
                            <DialogDescription>Mã: {item.MaBaoCao}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                              <Label>Loại ô nhiễm</Label>
                              <Select value={editForm.LoaiONhiem || undefined} onValueChange={(v) => setEditForm((p) => ({ ...p, LoaiONhiem: v }))}>
                                <SelectTrigger><SelectValue placeholder="Chọn loại" /></SelectTrigger>
                                <SelectContent>
                                  {loaiONhiemOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Khu vực</Label>
                              <Input value={editForm.KhuVuc} onChange={(e) => setEditForm((p) => ({ ...p, KhuVuc: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                              <Label>Mức độ</Label>
                              <Select value={editForm.MucDo || undefined} onValueChange={(v) => setEditForm((p) => ({ ...p, MucDo: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {mucDoOptions.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
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
                              <Label>Ngày báo cáo</Label>
                              <Input type="date" value={editForm.NgayBaoCao} onChange={(e) => setEditForm((p) => ({ ...p, NgayBaoCao: e.target.value }))} />
                            </div>
                            <div className="space-y-2">
                              <Label>Mã người báo cáo</Label>
                              <Input type="number" value={editForm.NguoiBaoCao} onChange={(e) => setEditForm((p) => ({ ...p, NguoiBaoCao: toNumber(e.target.value) }))} />
                            </div>
                            <div className="space-y-2">
                              <Label>Nội dung</Label>
                              <Textarea rows={4} value={editForm.NoiDung} onChange={(e) => setEditForm((p) => ({ ...p, NoiDung: e.target.value }))} />
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
