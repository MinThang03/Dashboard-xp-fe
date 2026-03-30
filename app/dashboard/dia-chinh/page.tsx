'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Plus, Pencil, Trash2, Eye, MapPin } from 'lucide-react';
import { thuaDatApi } from '@/lib/api';

type DiaChinhRecord = {
  MaThua: string;
  MaHoSo: string;
  SoTo: string;
  DienTich: number;
  LoaiDat: string;
  MucDichSuDung: string;
  ChuSoHuu: string;
  CCCD: string;
  DiaChiThuaDat: string;
  ToaDoX: number;
  ToaDoY: number;
  NguonGocSuDung: string;
  ThoiHanSuDung: string;
  SoSoDo: string;
  NgayCapSoDo: string;
  NgayNhapLieu: string;
  CanBoNhapLieu: string;
  TrangThai: string;
  GhiChu: string;
};

type DiaChinhForm = DiaChinhRecord;

const emptyForm: DiaChinhForm = {
  MaThua: '',
  MaHoSo: '',
  SoTo: '',
  DienTich: 0,
  LoaiDat: '',
  MucDichSuDung: '',
  ChuSoHuu: '',
  CCCD: '',
  DiaChiThuaDat: '',
  ToaDoX: 0,
  ToaDoY: 0,
  NguonGocSuDung: '',
  ThoiHanSuDung: '',
  SoSoDo: '',
  NgayCapSoDo: '',
  NgayNhapLieu: '',
  CanBoNhapLieu: '',
  TrangThai: 'Đang xử lý',
  GhiChu: '',
};

function toNumber(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function mapFromApi(item: any): DiaChinhRecord {
  return {
    MaThua: item.MaThua || '',
    MaHoSo: item.MaHoSo || '',
    SoTo: item.SoTo || item.SoToBanDo || '',
    DienTich: Number(item.DienTich || 0),
    LoaiDat: item.LoaiDat || '',
    MucDichSuDung: item.MucDichSuDung || '',
    ChuSoHuu: item.ChuSoHuu || '',
    CCCD: item.CCCD || '',
    DiaChiThuaDat: item.DiaChiThuaDat || '',
    ToaDoX: Number(item.ToaDoX || 0),
    ToaDoY: Number(item.ToaDoY || 0),
    NguonGocSuDung: item.NguonGocSuDung || '',
    ThoiHanSuDung: item.ThoiHanSuDung || '',
    SoSoDo: item.SoSoDo || '',
    NgayCapSoDo: item.NgayCapSoDo ? String(item.NgayCapSoDo).slice(0, 10) : '',
    NgayNhapLieu: item.NgayNhapLieu ? String(item.NgayNhapLieu).slice(0, 10) : '',
    CanBoNhapLieu: item.CanBoNhapLieu || '',
    TrangThai: item.TrangThai || 'Đang xử lý',
    GhiChu: item.GhiChu || '',
  };
}

export default function DiaChinhPage() {
  const [records, setRecords] = useState<DiaChinhRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<DiaChinhRecord | null>(null);
  const [form, setForm] = useState<DiaChinhForm>(emptyForm);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await thuaDatApi.getList({ page: 1, limit: 1000, loaiBanGhi: 'DIA_CHINH' });
      if (result.success && Array.isArray(result.data)) {
        setRecords(result.data.map(mapFromApi));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return records;
    return records.filter((x) =>
      [x.MaThua, x.SoTo, x.ChuSoHuu, x.DiaChiThuaDat, x.LoaiDat].some((v) => v.toLowerCase().includes(keyword)),
    );
  }, [records, search]);

  const handleCreate = async () => {
    if (!form.MaThua.trim()) {
      alert('Mã thửa là bắt buộc');
      return;
    }

    const payload = {
      LoaiBanGhi: 'DIA_CHINH',
      MaThua: form.MaThua.trim(),
      SoThua: form.MaThua.trim(),
      SoToBanDo: form.SoTo || null,
      MaHoSo: form.MaHoSo || null,
      SoTo: form.SoTo || null,
      DienTich: form.DienTich,
      LoaiDat: form.LoaiDat || null,
      MucDichSuDung: form.MucDichSuDung || null,
      ChuSoHuu: form.ChuSoHuu || null,
      CCCD: form.CCCD || null,
      DiaChiThuaDat: form.DiaChiThuaDat || null,
      ToaDoX: form.ToaDoX,
      ToaDoY: form.ToaDoY,
      NguonGocSuDung: form.NguonGocSuDung || null,
      ThoiHanSuDung: form.ThoiHanSuDung || null,
      SoSoDo: form.SoSoDo || null,
      NgayCapSoDo: form.NgayCapSoDo || null,
      NgayNhapLieu: form.NgayNhapLieu || null,
      CanBoNhapLieu: form.CanBoNhapLieu || null,
      TrangThai: form.TrangThai || 'Đang xử lý',
      GhiChu: form.GhiChu || null,
    };

    const result = await thuaDatApi.create(payload);
    if (result.success) {
      setIsAddOpen(false);
      setForm(emptyForm);
      await loadData();
      return;
    }
    alert(result.message || 'Không thể thêm hồ sơ địa chính');
  };

  const handleUpdate = async () => {
    if (!selected) return;

    const payload = {
      SoToBanDo: form.SoTo || null,
      MaHoSo: form.MaHoSo || null,
      SoTo: form.SoTo || null,
      DienTich: form.DienTich,
      LoaiDat: form.LoaiDat || null,
      MucDichSuDung: form.MucDichSuDung || null,
      ChuSoHuu: form.ChuSoHuu || null,
      CCCD: form.CCCD || null,
      DiaChiThuaDat: form.DiaChiThuaDat || null,
      ToaDoX: form.ToaDoX,
      ToaDoY: form.ToaDoY,
      NguonGocSuDung: form.NguonGocSuDung || null,
      ThoiHanSuDung: form.ThoiHanSuDung || null,
      SoSoDo: form.SoSoDo || null,
      NgayCapSoDo: form.NgayCapSoDo || null,
      NgayNhapLieu: form.NgayNhapLieu || null,
      CanBoNhapLieu: form.CanBoNhapLieu || null,
      TrangThai: form.TrangThai,
      GhiChu: form.GhiChu || null,
    };

    const result = await thuaDatApi.update(selected.MaThua, payload);
    if (result.success) {
      setIsEditOpen(false);
      setSelected(null);
      await loadData();
      return;
    }
    alert(result.message || 'Không thể cập nhật hồ sơ địa chính');
  };

  const handleDelete = async (record: DiaChinhRecord) => {
    if (!window.confirm(`Xóa hồ sơ thửa ${record.MaThua}?`)) return;
    const result = await thuaDatApi.delete(record.MaThua);
    if (result.success) {
      await loadData();
      return;
    }
    alert(result.message || 'Không thể xóa hồ sơ địa chính');
  };

  const openEdit = (record: DiaChinhRecord) => {
    setSelected(record);
    setForm({ ...record });
    setIsEditOpen(true);
  };

  const openView = (record: DiaChinhRecord) => {
    setSelected(record);
    setIsViewOpen(true);
  };

  return (
    <div className="w-full px-4 py-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Quản lý địa chính
          </CardTitle>
          <CardDescription>Tìm thấy {filtered.length} hồ sơ thửa đất</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo mã thửa, số tờ, chủ sở hữu, địa chỉ..."
              />
            </div>
            <Button onClick={() => { setForm(emptyForm); setIsAddOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm hồ sơ
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã thửa</TableHead>
                <TableHead>Số tờ</TableHead>
                <TableHead>Chủ sở hữu</TableHead>
                <TableHead>Loại đất</TableHead>
                <TableHead>Diện tích</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((x) => (
                <TableRow key={x.MaThua}>
                  <TableCell>{x.MaThua}</TableCell>
                  <TableCell>{x.SoTo}</TableCell>
                  <TableCell>{x.ChuSoHuu}</TableCell>
                  <TableCell>{x.LoaiDat}</TableCell>
                  <TableCell>{x.DienTich.toLocaleString('vi-VN')}</TableCell>
                  <TableCell><Badge variant="outline">{x.TrangThai}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openView(x)}><Eye className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => openEdit(x)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(x)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">Không có dữ liệu</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Thêm hồ sơ địa chính</DialogTitle>
            <DialogDescription>Lưu đầy đủ thông tin hồ sơ và thửa đất</DialogDescription>
          </DialogHeader>
          <DiaChinhFormView form={form} setForm={setForm} disableMaThua={false} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Hủy</Button>
            <Button onClick={handleCreate}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Cập nhật hồ sơ địa chính</DialogTitle>
            <DialogDescription>Mã thửa: {selected?.MaThua}</DialogDescription>
          </DialogHeader>
          <DiaChinhFormView form={form} setForm={setForm} disableMaThua />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Hủy</Button>
            <Button onClick={handleUpdate}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết hồ sơ địa chính</DialogTitle>
            <DialogDescription>Mã thửa: {selected?.MaThua}</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><strong>Mã hồ sơ:</strong> {selected.MaHoSo || '-'}</div>
              <div><strong>Số tờ:</strong> {selected.SoTo || '-'}</div>
              <div><strong>Chủ sở hữu:</strong> {selected.ChuSoHuu || '-'}</div>
              <div><strong>CCCD:</strong> {selected.CCCD || '-'}</div>
              <div><strong>Loại đất:</strong> {selected.LoaiDat || '-'}</div>
              <div><strong>Diện tích:</strong> {selected.DienTich.toLocaleString('vi-VN')} m2</div>
              <div><strong>Sổ đỏ:</strong> {selected.SoSoDo || '-'}</div>
              <div><strong>Ngày cấp:</strong> {selected.NgayCapSoDo || '-'}</div>
              <div className="col-span-2"><strong>Địa chỉ:</strong> {selected.DiaChiThuaDat || '-'}</div>
              <div className="col-span-2"><strong>Mục đích sử dụng:</strong> {selected.MucDichSuDung || '-'}</div>
              <div className="col-span-2"><strong>Ghi chú:</strong> {selected.GhiChu || '-'}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DiaChinhFormView({
  form,
  setForm,
  disableMaThua,
}: {
  form: DiaChinhForm;
  setForm: (value: DiaChinhForm) => void;
  disableMaThua: boolean;
}) {
  const setField = (key: keyof DiaChinhForm, value: string) => {
    if (key === 'DienTich' || key === 'ToaDoX' || key === 'ToaDoY') {
      setForm({ ...form, [key]: toNumber(value) });
      return;
    }
    setForm({ ...form, [key]: value } as DiaChinhForm);
  };

  return (
    <div className="grid grid-cols-2 gap-3 py-2">
      <Field label="Mã thửa" value={form.MaThua} onChange={(v) => setField('MaThua', v)} disabled={disableMaThua} />
      <Field label="Mã hồ sơ" value={form.MaHoSo} onChange={(v) => setField('MaHoSo', v)} />
      <Field label="Số tờ" value={form.SoTo} onChange={(v) => setField('SoTo', v)} />
      <Field label="Diện tích" type="number" value={String(form.DienTich)} onChange={(v) => setField('DienTich', v)} />
      <Field label="Loại đất" value={form.LoaiDat} onChange={(v) => setField('LoaiDat', v)} />
      <Field label="Mục đích sử dụng" value={form.MucDichSuDung} onChange={(v) => setField('MucDichSuDung', v)} />
      <Field label="Chủ sở hữu" value={form.ChuSoHuu} onChange={(v) => setField('ChuSoHuu', v)} />
      <Field label="CCCD" value={form.CCCD} onChange={(v) => setField('CCCD', v)} />
      <Field label="Tọa độ X" type="number" value={String(form.ToaDoX)} onChange={(v) => setField('ToaDoX', v)} />
      <Field label="Tọa độ Y" type="number" value={String(form.ToaDoY)} onChange={(v) => setField('ToaDoY', v)} />
      <Field label="Nguồn gốc sử dụng" value={form.NguonGocSuDung} onChange={(v) => setField('NguonGocSuDung', v)} />
      <Field label="Thời hạn sử dụng" value={form.ThoiHanSuDung} onChange={(v) => setField('ThoiHanSuDung', v)} />
      <Field label="Số sổ đỏ" value={form.SoSoDo} onChange={(v) => setField('SoSoDo', v)} />
      <Field label="Ngày cấp sổ đỏ" type="date" value={form.NgayCapSoDo} onChange={(v) => setField('NgayCapSoDo', v)} />
      <Field label="Ngày nhập liệu" type="date" value={form.NgayNhapLieu} onChange={(v) => setField('NgayNhapLieu', v)} />
      <Field label="Cán bộ nhập liệu" value={form.CanBoNhapLieu} onChange={(v) => setField('CanBoNhapLieu', v)} />
      <div className="space-y-1 col-span-2">
        <Label>Trạng thái</Label>
        <Input value={form.TrangThai} onChange={(e) => setField('TrangThai', e.target.value)} />
      </div>
      <div className="col-span-2 space-y-1">
        <Label>Địa chỉ thửa đất</Label>
        <Input value={form.DiaChiThuaDat} onChange={(e) => setField('DiaChiThuaDat', e.target.value)} />
      </div>
      <div className="col-span-2 space-y-1">
        <Label>Ghi chú</Label>
        <Textarea value={form.GhiChu} onChange={(e) => setField('GhiChu', e.target.value)} rows={2} />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} />
    </div>
  );
}
