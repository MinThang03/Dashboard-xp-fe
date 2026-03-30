'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileSearch, MapPin, Users, CheckCircle2, Search, Download, Eye, FileText, Layers, Home, Clock, TreePine } from 'lucide-react';
import { thuaDatApi } from '@/lib/api';

type TraCuuDatRecord = {
  MaThua: string;
  SoTo: string;
  DiaChiThuaDat: string;
  DienTich: number;
  LoaiDat: string;
  MucDichSuDung: string;
  ChuSoHuu: string;
  CCCD: string;
  DiaChiThuongTru: string;
  SoDienThoai: string;
  NguonGocSuDung: string;
  ThoiHanSuDung: string;
  SoSoDo: string;
  NgayCapSoDo: string;
  TrangThaiPhapLy: string;
  ToaDoX: number;
  ToaDoY: number;
  LoThoBan: string;
  HanCheSuDung: string;
  LoaiBanGhi: string;
};

function mapFromApi(item: any): TraCuuDatRecord {
  return {
    MaThua: item.MaThua || '',
    SoTo: item.SoTo || item.SoToBanDo || '',
    DiaChiThuaDat: item.DiaChiThuaDat || '',
    DienTich: Number(item.DienTich || 0),
    LoaiDat: item.LoaiDat || '',
    MucDichSuDung: item.MucDichSuDung || '',
    ChuSoHuu: item.ChuSoHuu || '',
    CCCD: item.CCCD || '',
    DiaChiThuongTru: item.DiaChiThuongTru || item.DiaChi || '',
    SoDienThoai: item.SoDienThoai || '',
    NguonGocSuDung: item.NguonGocSuDung || '',
    ThoiHanSuDung: item.ThoiHanSuDung || '',
    SoSoDo: item.SoSoDo || '',
    NgayCapSoDo: item.NgayCapSoDo ? String(item.NgayCapSoDo).slice(0, 10) : '',
    TrangThaiPhapLy: item.TrangThaiPhapLy || item.TrangThai || '',
    ToaDoX: Number(item.ToaDoX || 0),
    ToaDoY: Number(item.ToaDoY || 0),
    LoThoBan: item.LoThoBan || '',
    HanCheSuDung: item.HanCheSuDung || '',
    LoaiBanGhi: item.LoaiBanGhi || '',
  };
}

export default function TraCuuDatPage() {
  const [records, setRecords] = useState<TraCuuDatRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<string>('all');
  const [filterLoaiDat, setFilterLoaiDat] = useState<string>('all');
  const [filterTrangThai, setFilterTrangThai] = useState<string>('all');
  const [selected, setSelected] = useState<TraCuuDatRecord | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await thuaDatApi.getList({ page: 1, limit: 5000 });
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

  const loaiDatOptions = useMemo(() => {
    return Array.from(new Set(records.map((x) => x.LoaiDat).filter(Boolean))).sort();
  }, [records]);

  const trangThaiOptions = useMemo(() => {
    return Array.from(new Set(records.map((x) => x.TrangThaiPhapLy).filter(Boolean))).sort();
  }, [records]);

  const filtered = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    return records.filter((x) => {
      let matchesSearch = true;

      if (keyword) {
        if (searchType === 'thua') {
          matchesSearch = x.MaThua.toLowerCase().includes(keyword);
        } else if (searchType === 'to') {
          matchesSearch = x.SoTo.toLowerCase().includes(keyword);
        } else if (searchType === 'chusohuu') {
          matchesSearch = x.ChuSoHuu.toLowerCase().includes(keyword);
        } else if (searchType === 'cccd') {
          matchesSearch = x.CCCD.toLowerCase().includes(keyword);
        } else if (searchType === 'sodo') {
          matchesSearch = x.SoSoDo.toLowerCase().includes(keyword);
        } else {
          matchesSearch = [x.MaThua, x.SoTo, x.ChuSoHuu, x.CCCD, x.SoSoDo, x.DiaChiThuaDat]
            .join(' ')
            .toLowerCase()
            .includes(keyword);
        }
      }

      const matchesLoaiDat = filterLoaiDat === 'all' || x.LoaiDat === filterLoaiDat;
      const matchesTrangThai = filterTrangThai === 'all' || x.TrangThaiPhapLy === filterTrangThai;
      return matchesSearch && matchesLoaiDat && matchesTrangThai;
    });
  }, [records, searchQuery, searchType, filterLoaiDat, filterTrangThai]);

  const openView = (record: TraCuuDatRecord) => {
    setSelected(record);
    setIsViewOpen(true);
  };

  const stats = useMemo(() => {
    const tongHoSo = records.length;
    const daCo = records.filter((r) => r.TrangThaiPhapLy.toLowerCase().includes('đã cấp')).length;
    const chuaCo = tongHoSo - daCo;
    const tongDienTich = records.reduce((sum, r) => sum + r.DienTich, 0);
    const chuSoHuu = new Set(records.map((r) => r.CCCD).filter(Boolean)).size;
    const datO = records.filter((r) => r.LoaiDat.toLowerCase().includes('đất ở')).length;
    return { tongHoSo, daCo, chuaCo, tongDienTich, chuSoHuu, datO };
  }, [records]);

  const getTrangThaiBadge = (trangThai: string) => {
    if (!trangThai) return <Badge variant="secondary">Chưa cập nhật</Badge>;
    const value = trangThai.toLowerCase();
    if (value.includes('đã cấp')) {
      return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />{trangThai}</Badge>;
    }
    if (value.includes('đang')) {
      return <Badge className="bg-blue-500 hover:bg-blue-600"><Clock className="h-3 w-3 mr-1" />{trangThai}</Badge>;
    }
    if (value.includes('chờ') || value.includes('chưa')) {
      return <Badge className="bg-amber-500 hover:bg-amber-600"><Clock className="h-3 w-3 mr-1" />{trangThai}</Badge>;
    }
    return <Badge variant="outline">{trangThai}</Badge>;
  };

  const getLoaiDatBadge = (loaiDat: string) => {
    if (!loaiDat) return <Badge variant="outline">Chưa rõ</Badge>;
    const value = loaiDat.toLowerCase();
    if (value.includes('đất ở')) {
      return <Badge className="bg-rose-500 hover:bg-rose-600"><Home className="h-3 w-3 mr-1" />{loaiDat}</Badge>;
    }
    if (value.includes('nông nghiệp')) {
      return <Badge className="bg-green-500 hover:bg-green-600"><TreePine className="h-3 w-3 mr-1" />{loaiDat}</Badge>;
    }
    if (value.includes('lâm nghiệp')) {
      return <Badge className="bg-emerald-600 hover:bg-emerald-700"><TreePine className="h-3 w-3 mr-1" />{loaiDat}</Badge>;
    }
    if (value.includes('công nghiệp')) {
      return <Badge className="bg-purple-500 hover:bg-purple-600"><Layers className="h-3 w-3 mr-1" />{loaiDat}</Badge>;
    }
    return <Badge variant="outline">{loaiDat}</Badge>;
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      <div className="bg-gradient-to-r from-secondary via-primary to-secondary rounded-lg p-4 sm:p-5 xl:p-6 text-white">
        <div className="flex items-center gap-3">
          <FileSearch className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Tra cứu hồ sơ đất đai</h1>
            <p className="text-teal-100">Tra cứu thông tin thửa đất, sổ đỏ, chủ sở hữu theo dữ liệu backend</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-teal-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng hồ sơ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-500" />
              <span className="text-2xl font-bold">{stats.tongHoSo}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đã có sổ đỏ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{stats.daCo}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Chưa có sổ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold">{stats.chuaCo}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Chủ sở hữu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{stats.chuSoHuu}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đất ở đô thị</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-rose-500" />
              <span className="text-2xl font-bold">{stats.datO}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng DT (m2)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-purple-500" />
              <span className="text-2xl font-bold">{stats.tongDienTich.toLocaleString('vi-VN')}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Tìm kiếm thông tin đất đai
          </CardTitle>
          <CardDescription>Nhập thông tin để tra cứu hồ sơ địa chính | Kết quả: {filtered.length} hồ sơ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Loại tìm kiếm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="thua">Mã thửa</SelectItem>
                <SelectItem value="to">Số tờ bản đồ</SelectItem>
                <SelectItem value="chusohuu">Tên chủ sở hữu</SelectItem>
                <SelectItem value="cccd">Số CCCD</SelectItem>
                <SelectItem value="sodo">Số sổ đỏ</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Nhập thông tin tra cứu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterLoaiDat} onValueChange={setFilterLoaiDat}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Loại đất" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại đất</SelectItem>
                {loaiDatOptions.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterTrangThai} onValueChange={setFilterTrangThai}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {trangThaiOptions.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadData}>
              <Download className="mr-2 h-4 w-4" />
              Làm mới
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kết quả tra cứu</CardTitle>
          <CardDescription>Tìm thấy {filtered.length} thửa đất {loading ? '(đang tải...)' : ''}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thửa/Tờ</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Loại đất</TableHead>
                <TableHead>Diện tích</TableHead>
                <TableHead>Chủ sở hữu</TableHead>
                <TableHead>Số sổ đỏ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Xem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((x) => (
                <TableRow key={`${x.MaThua}-${x.LoaiBanGhi || x.SoTo}`}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {x.MaThua || '-'} / {x.SoTo || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate" title={x.DiaChiThuaDat}>{x.DiaChiThuaDat || '-'}</div>
                  </TableCell>
                  <TableCell>{getLoaiDatBadge(x.LoaiDat)}</TableCell>
                  <TableCell className="font-medium">{x.DienTich.toLocaleString('vi-VN')} m2</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="h-3 w-3" />
                      {x.ChuSoHuu || '-'}
                    </div>
                  </TableCell>
                  <TableCell>{x.SoSoDo ? <span className="text-primary font-medium">{x.SoSoDo}</span> : <span className="text-muted-foreground">-</span>}</TableCell>
                  <TableCell>{getTrangThaiBadge(x.TrangThaiPhapLy)}</TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => openView(x)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">Không có dữ liệu</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết thửa đất</DialogTitle>
            <DialogDescription>Thửa {selected?.MaThua || '-'}, Tờ bản đồ {selected?.SoTo || '-'}</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 border-b pb-4 mb-2">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Thông tin thửa đất
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Mã thửa / Số tờ</p>
                    <p className="font-medium">{selected.MaThua || '-'} / {selected.SoTo || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Diện tích</p>
                    <p className="font-medium">{selected.DienTich.toLocaleString('vi-VN')} m2</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Loại đất</p>
                    {getLoaiDatBadge(selected.LoaiDat)}
                  </div>
                  <div>
                    <p className="text-muted-foreground">Mục đích sử dụng</p>
                    <p className="font-medium">{selected.MucDichSuDung || '-'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Địa chỉ</p>
                    <p className="font-medium">{selected.DiaChiThuaDat || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tọa độ X</p>
                    <p className="font-medium">{selected.ToaDoX || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tọa độ Y</p>
                    <p className="font-medium">{selected.ToaDoY || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Lô thổ bản</p>
                    <p className="font-medium">{selected.LoThoBan || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Hạn chế sử dụng</p>
                    <p className="font-medium">{selected.HanCheSuDung || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="col-span-2 border-b pb-4 mb-2">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Thông tin chủ sở hữu
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Họ tên</p>
                    <p className="font-medium">{selected.ChuSoHuu || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Số CCCD</p>
                    <p className="font-medium">{selected.CCCD || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Điện thoại</p>
                    <p className="font-medium">{selected.SoDienThoai || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Địa chỉ thường trú</p>
                    <p className="font-medium">{selected.DiaChiThuongTru || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Thông tin pháp lý
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Nguồn gốc sử dụng</p>
                    <p className="font-medium">{selected.NguonGocSuDung || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Thời hạn sử dụng</p>
                    <p className="font-medium">{selected.ThoiHanSuDung || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Số sổ đỏ</p>
                    <p className="font-medium">{selected.SoSoDo || 'Chưa cấp'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Ngày cấp</p>
                    <p className="font-medium">{selected.NgayCapSoDo || 'Chưa cấp'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Trạng thái pháp lý</p>
                    {getTrangThaiBadge(selected.TrangThaiPhapLy)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <FileSearch className="h-5 w-5" />
            Hướng dẫn tra cứu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-muted-foreground text-sm">
          <p>- Có thể tra cứu theo mã thửa, số tờ bản đồ, tên chủ sở hữu, CCCD hoặc số sổ đỏ.</p>
          <p>- Sử dụng bộ lọc để thu hẹp kết quả theo loại đất và trạng thái pháp lý.</p>
          <p>- Nhấn biểu tượng mắt để xem toàn bộ thông tin chi tiết của thửa đất.</p>
        </CardContent>
      </Card>
    </div>
  );
}
