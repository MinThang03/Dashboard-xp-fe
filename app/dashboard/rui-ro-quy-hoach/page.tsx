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
import { Progress } from '@/components/ui/progress';
import { 
  Zap, AlertTriangle, TrendingUp, BarChart3, Search, Plus, Download, Eye, Edit, Trash2,
  MapPin, Brain, ShieldAlert, Lightbulb, AlertCircle, CheckCircle2
} from 'lucide-react';
import { ruiRoQuyHoachApi } from '@/lib/api';
import { FunctionStyledPanel } from '@/components/charts/function-styled-panel';

// Mock data phân tích rủi ro quy hoạch
interface RuiRoQuyHoach {
  MaRuiRo?: number;
  MaPhanTich: string;
  KhuVuc: string;
  DiaChi: string;
  MaThua: string;
  SoTo: string;
  LoaiRuiRo: string;
  MucDoRuiRo: string;
  XacSuat: number;
  DoTinCayAI: number;
  MoTaRuiRo: string;
  NguyenNhan: string;
  KhuyenNghiAI: string;
  TrangThai: string;
  NgayPhanTich: string;
  NgayCapNhat: string;
  GhiChu: string;
}

const mockRuiRo: RuiRoQuyHoach[] = [
  {
    MaPhanTich: 'RRQH001',
    KhuVuc: 'Khu dân cư A - Phường 1',
    DiaChi: 'Đường ABC, Phường 1',
    MaThua: '100-150',
    SoTo: '45',
    LoaiRuiRo: 'Ngập lụt',
    MucDoRuiRo: 'Cao',
    XacSuat: 87,
    DoTinCayAI: 94,
    MoTaRuiRo: 'Khu vực trũng, nằm gần sông, hệ thống thoát nước kém',
    NguyenNhan: 'Địa hình thấp, mật độ xây dựng cao làm giảm thấm nước',
    KhuyenNghiAI: 'Nâng cấp hệ thống thoát nước, hạn chế cấp phép xây dựng mới, xây hồ điều tiết',
    TrangThai: 'Đang theo dõi',
    NgayPhanTich: '2025-01-10',
    NgayCapNhat: '2025-01-14',
    GhiChu: 'Đã xảy ra ngập 3 lần trong năm 2024'
  },
  {
    MaPhanTich: 'RRQH002',
    KhuVuc: 'Khu B - Phường 2',
    DiaChi: 'Đường DEF, Phường 2',
    MaThua: '200-250',
    SoTo: '67',
    LoaiRuiRo: 'Sạt lở',
    MucDoRuiRo: 'Trung bình',
    XacSuat: 65,
    DoTinCayAI: 88,
    MoTaRuiRo: 'Khu vực đồi, độ dốc cao, đất yếu',
    NguyenNhan: 'Mưa lớn kéo dài, xây dựng không theo quy chuẩn',
    KhuyenNghiAI: 'Kiểm tra gia cố nền móng, trồng cây chống xói mòn, hạn chế đào đất',
    TrangThai: 'Cần xử lý',
    NgayPhanTich: '2025-01-08',
    NgayCapNhat: '2025-01-12',
    GhiChu: ''
  },
  {
    MaPhanTich: 'RRQH003',
    KhuVuc: 'Khu C - Xã 3',
    DiaChi: 'Thôn 1, Xã 3',
    MaThua: '300-400',
    SoTo: '89',
    LoaiRuiRo: 'Tranh chấp đất',
    MucDoRuiRo: 'Thấp',
    XacSuat: 32,
    DoTinCayAI: 79,
    MoTaRuiRo: 'Khu vực có nhiều thửa đất chưa cấp sổ, ranh giới không rõ ràng',
    NguyenNhan: 'Lịch sử quản lý đất đai phức tạp, hồ sơ không đầy đủ',
    KhuyenNghiAI: 'Đẩy nhanh cấp sổ đỏ, đo đạc lại ranh giới, công bố công khai quy hoạch',
    TrangThai: 'Đã xử lý',
    NgayPhanTich: '2025-01-05',
    NgayCapNhat: '2025-01-10',
    GhiChu: 'Đã hoàn thành đo đạc'
  },
  {
    MaPhanTich: 'RRQH004',
    KhuVuc: 'Khu công nghiệp D',
    DiaChi: 'KCN D, Xã 4',
    MaThua: '500-600',
    SoTo: '12',
    LoaiRuiRo: 'Ô nhiễm môi trường',
    MucDoRuiRo: 'Cao',
    XacSuat: 91,
    DoTinCayAI: 96,
    MoTaRuiRo: 'Nhiều nhà máy xả thải, không có hệ thống xử lý tập trung',
    NguyenNhan: 'Quy hoạch KCN cũ thiếu hệ thống xử lý, doanh nghiệp vi phạm',
    KhuyenNghiAI: 'Xây dựng hệ thống xử lý nước thải tập trung, tăng cường giám sát, xử phạt nghiêm',
    TrangThai: 'Đang theo dõi',
    NgayPhanTich: '2025-01-12',
    NgayCapNhat: '2025-01-14',
    GhiChu: 'Đã lập danh sách doanh nghiệp vi phạm'
  },
  {
    MaPhanTich: 'RRQH005',
    KhuVuc: 'Khu E - Phường 5',
    DiaChi: 'Đường GHI, Phường 5',
    MaThua: '700-750',
    SoTo: '34',
    LoaiRuiRo: 'Xung đột quy hoạch',
    MucDoRuiRo: 'Trung bình',
    XacSuat: 58,
    DoTinCayAI: 82,
    MoTaRuiRo: 'Quy hoạch đường xuyên qua khu dân cư hiện hữu',
    NguyenNhan: 'Quy hoạch mới không đồng bộ với hiện trạng xây dựng',
    KhuyenNghiAI: 'Điều chỉnh hướng tuyến, đền bù thỏa đáng, tổ chức đối thoại với dân',
    TrangThai: 'Cần xử lý',
    NgayPhanTich: '2025-01-06',
    NgayCapNhat: '2025-01-13',
    GhiChu: 'Có 25 hộ dân bị ảnh hưởng'
  },
  {
    MaPhanTich: 'RRQH006',
    KhuVuc: 'Khu F - Phường 6',
    DiaChi: 'Đường JKL, Phường 6',
    MaThua: '800-850',
    SoTo: '56',
    LoaiRuiRo: 'Hạ tầng quá tải',
    MucDoRuiRo: 'Cao',
    XacSuat: 78,
    DoTinCayAI: 90,
    MoTaRuiRo: 'Mật độ dân cư tăng nhanh, hạ tầng không theo kịp',
    NguyenNhan: 'Cấp phép xây dựng quá nhiều, không đồng bộ hạ tầng',
    KhuyenNghiAI: 'Tạm dừng cấp phép, nâng cấp hạ tầng điện, nước, giao thông',
    TrangThai: 'Đang theo dõi',
    NgayPhanTich: '2025-01-09',
    NgayCapNhat: '2025-01-14',
    GhiChu: ''
  }
];

const loaiRuiRoOptions = ['Ngập lụt', 'Sạt lở', 'Tranh chấp đất', 'Ô nhiễm môi trường', 'Xung đột quy hoạch', 'Hạ tầng quá tải', 'Khác'];
const mucDoOptions = ['Thấp', 'Trung bình', 'Cao', 'Rất cao'];
const trangThaiOptions = ['Mới phát hiện', 'Đang theo dõi', 'Cần xử lý', 'Đang xử lý', 'Đã xử lý'];

const emptyRuiRoForm: RuiRoQuyHoach = {
  MaPhanTich: '',
  KhuVuc: '',
  DiaChi: '',
  MaThua: '',
  SoTo: '',
  LoaiRuiRo: '',
  MucDoRuiRo: 'Trung bình',
  XacSuat: 0,
  DoTinCayAI: 0,
  MoTaRuiRo: '',
  NguyenNhan: '',
  KhuyenNghiAI: '',
  TrangThai: 'Mới phát hiện',
  NgayPhanTich: new Date().toISOString().slice(0, 10),
  NgayCapNhat: new Date().toISOString().slice(0, 10),
  GhiChu: '',
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

function mapFromApi(item: any): RuiRoQuyHoach {
  return {
    MaRuiRo: Number(item.MaRuiRo || 0) || undefined,
    MaPhanTich: item.MaPhanTich || `RRQH${String(item.MaRuiRo || '').padStart(3, '0')}`,
    KhuVuc: item.KhuVuc || '',
    DiaChi: item.DiaChi || '',
    MaThua: item.MaThua || '',
    SoTo: item.SoTo || '',
    LoaiRuiRo: item.LoaiRuiRo || '',
    MucDoRuiRo: item.MucDoRuiRo || item.MucDoNghiemTrong || 'Trung bình',
    XacSuat: Number(item.XacSuat || 0),
    DoTinCayAI: Number(item.DoTinCayAI || 0),
    MoTaRuiRo: item.MoTaRuiRo || '',
    NguyenNhan: item.NguyenNhan || '',
    KhuyenNghiAI: item.KhuyenNghiAI || item.BienPhapXuLy || '',
    TrangThai: item.TrangThai || 'Mới phát hiện',
    NgayPhanTich: toDateString(item.NgayPhanTich || item.NgayPhatHien),
    NgayCapNhat: toDateString(item.NgayCapNhat),
    GhiChu: item.GhiChu || '',
  };
}

function mapToApi(data: Partial<RuiRoQuyHoach>) {
  return {
    MaPhanTich: data.MaPhanTich || null,
    KhuVuc: data.KhuVuc || null,
    DiaChi: data.DiaChi || null,
    MaThua: data.MaThua || null,
    SoTo: data.SoTo || null,
    LoaiRuiRo: data.LoaiRuiRo || null,
    MucDoRuiRo: data.MucDoRuiRo || 'Trung bình',
    XacSuat: data.XacSuat || 0,
    DoTinCayAI: data.DoTinCayAI || 0,
    MoTaRuiRo: data.MoTaRuiRo || null,
    NguyenNhan: data.NguyenNhan || null,
    KhuyenNghiAI: data.KhuyenNghiAI || null,
    TrangThai: data.TrangThai || 'Mới phát hiện',
    NgayPhanTich: data.NgayPhanTich || null,
    NgayCapNhat: data.NgayCapNhat || null,
    GhiChu: data.GhiChu || null,
  };
}

export default function RuiRoQuyHoachPage() {
  const [ruiRoList, setRuiRoList] = useState<RuiRoQuyHoach[]>(mockRuiRo);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMucDo, setFilterMucDo] = useState<string>('all');
  const [filterLoai, setFilterLoai] = useState<string>('all');
  const [selectedRuiRo, setSelectedRuiRo] = useState<RuiRoQuyHoach | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addFormData, setAddFormData] = useState<RuiRoQuyHoach>(emptyRuiRoForm);

  const loadData = async () => {
    const result = await ruiRoQuyHoachApi.getList({ page: 1, limit: 1000 });
    if (result.success && Array.isArray(result.data)) {
      setRuiRoList(result.data.map(mapFromApi));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredData = ruiRoList.filter((item) => {
    const matchesSearch =
      item.MaPhanTich.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.KhuVuc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.DiaChi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMucDo = filterMucDo === 'all' || item.MucDoRuiRo === filterMucDo;
    const matchesLoai = filterLoai === 'all' || item.LoaiRuiRo === filterLoai;
    return matchesSearch && matchesMucDo && matchesLoai;
  });

  const stats = {
    total: ruiRoList.length,
    ruiRoCao: ruiRoList.filter(r => r.MucDoRuiRo === 'Cao' || r.MucDoRuiRo === 'Rất cao').length,
    ruiRoTB: ruiRoList.filter(r => r.MucDoRuiRo === 'Trung bình').length,
    canXuLy: ruiRoList.filter(r => r.TrangThai === 'Cần xử lý').length,
    daXuLy: ruiRoList.filter(r => r.TrangThai === 'Đã xử lý').length,
    doTinCayTB: ruiRoList.length
      ? Math.round(ruiRoList.reduce((sum, r) => sum + r.DoTinCayAI, 0) / ruiRoList.length)
      : 0,
  };

  const handleCreate = async () => {
    const result = await ruiRoQuyHoachApi.create(mapToApi(addFormData));
    if (result.success) {
      setIsAddOpen(false);
      setAddFormData(emptyRuiRoForm);
      await loadData();
      return;
    }

    setRuiRoList((current) => [addFormData, ...current]);
    setIsAddOpen(false);
    setAddFormData(emptyRuiRoForm);
  };

  const handleUpdate = async () => {
    if (!selectedRuiRo) return;

    const id = selectedRuiRo.MaRuiRo || toNumericId(selectedRuiRo.MaPhanTich);
    if (Number.isFinite(id)) {
      const result = await ruiRoQuyHoachApi.update(id, mapToApi(selectedRuiRo));
      if (result.success) {
        setIsEditOpen(false);
        await loadData();
        return;
      }
    }

    setRuiRoList((current) =>
      current.map((item) => (item.MaPhanTich === selectedRuiRo.MaPhanTich ? selectedRuiRo : item)),
    );
    setIsEditOpen(false);
  };

  const handleDelete = async (item: RuiRoQuyHoach) => {
    if (!confirm(`Bạn có chắc muốn xóa phân tích ${item.MaPhanTich}?`)) {
      return;
    }

    const id = item.MaRuiRo || toNumericId(item.MaPhanTich);
    if (Number.isFinite(id)) {
      const result = await ruiRoQuyHoachApi.delete(id);
      if (result.success) {
        await loadData();
        return;
      }
    }

    setRuiRoList((current) => current.filter((row) => row.MaPhanTich !== item.MaPhanTich));
  };

  const getMucDoBadge = (mucDo: string) => {
    switch (mucDo) {
      case 'Rất cao': return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />{mucDo}</Badge>;
      case 'Cao': return <Badge className="bg-red-500 hover:bg-red-600"><AlertTriangle className="h-3 w-3 mr-1" />{mucDo}</Badge>;
      case 'Trung bình': return <Badge className="bg-amber-500 hover:bg-amber-600"><TrendingUp className="h-3 w-3 mr-1" />{mucDo}</Badge>;
      case 'Thấp': return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />{mucDo}</Badge>;
      default: return <Badge variant="secondary">{mucDo}</Badge>;
    }
  };

  const getTrangThaiBadge = (trangThai: string) => {
    switch (trangThai) {
      case 'Đã xử lý': return <Badge className="bg-green-500">{trangThai}</Badge>;
      case 'Đang xử lý': return <Badge className="bg-blue-500">{trangThai}</Badge>;
      case 'Cần xử lý': return <Badge variant="destructive">{trangThai}</Badge>;
      case 'Đang theo dõi': return <Badge className="bg-amber-500">{trangThai}</Badge>;
      default: return <Badge variant="secondary">{trangThai}</Badge>;
    }
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-accent to-primary rounded-lg p-4 sm:p-5 xl:p-6 text-white">
        <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Zap className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Đánh giá Rủi ro Quy hoạch (AI)</h1>
              <p className="text-purple-100">Phân tích rủi ro quy hoạch sử dụng đất bằng AI</p>
            </div>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-full 2xl:w-auto bg-white text-purple-600 hover:bg-white/90"
                onClick={() => setAddFormData(emptyRuiRoForm)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Phân tích mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Yêu cầu phân tích rủi ro mới</DialogTitle>
                <DialogDescription>Nhập thông tin khu vực cần phân tích</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2 col-span-2">
                  <Label>Khu vực *</Label>
                  <Input
                    placeholder="Nhập tên khu vực"
                    value={addFormData.KhuVuc}
                    onChange={(e) => setAddFormData({ ...addFormData, KhuVuc: e.target.value })}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Địa chỉ</Label>
                  <Input
                    placeholder="Nhập địa chỉ chi tiết"
                    value={addFormData.DiaChi}
                    onChange={(e) => setAddFormData({ ...addFormData, DiaChi: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mã thửa (từ - đến)</Label>
                  <Input
                    placeholder="VD: 100-150"
                    value={addFormData.MaThua}
                    onChange={(e) => setAddFormData({ ...addFormData, MaThua: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Số tờ</Label>
                  <Input
                    placeholder="Nhập số tờ"
                    value={addFormData.SoTo}
                    onChange={(e) => setAddFormData({ ...addFormData, SoTo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Loại rủi ro cần phân tích</Label>
                  <Select
                    value={addFormData.LoaiRuiRo}
                    onValueChange={(value) => setAddFormData({ ...addFormData, LoaiRuiRo: value })}
                  >
                    <SelectTrigger><SelectValue placeholder="Chọn loại" /></SelectTrigger>
                    <SelectContent>
                      {loaiRuiRoOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Mức độ rủi ro</Label>
                  <Select
                    value={addFormData.MucDoRuiRo}
                    onValueChange={(value) => setAddFormData({ ...addFormData, MucDoRuiRo: value })}
                  >
                    <SelectTrigger><SelectValue placeholder="Chọn mức độ" /></SelectTrigger>
                    <SelectContent>
                      {mucDoOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Mô tả tình huống</Label>
                  <Textarea
                    placeholder="Mô tả chi tiết tình huống cần phân tích"
                    rows={3}
                    value={addFormData.MoTaRuiRo}
                    onChange={(e) => setAddFormData({ ...addFormData, MoTaRuiRo: e.target.value })}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Ghi chú</Label>
                  <Textarea
                    placeholder="Nhập ghi chú"
                    value={addFormData.GhiChu}
                    onChange={(e) => setAddFormData({ ...addFormData, GhiChu: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Hủy</Button>
                <Button onClick={handleCreate}>
                  <Brain className="mr-2 h-4 w-4" />
                  Chạy phân tích AI
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <FunctionStyledPanel
        title="Phân bổ rủi ro quy hoạch bằng AI"
        subtitle="Biểu đồ vòng tròn thể hiện mức rủi ro, ưu tiên xử lý và độ tin cậy kết quả phân tích"
        variant="land-risk-ai"
        items={[
          { label: 'Tổng phân tích', value: stats.total, color: '#8b5cf6' },
          { label: 'Rủi ro cao', value: stats.ruiRoCao, color: '#ef4444' },
          { label: 'Rủi ro TB', value: stats.ruiRoTB, color: '#f59e0b' },
          { label: 'Cần xử lý', value: stats.canXuLy, color: '#f97316' },
          { label: 'Đã xử lý', value: stats.daXuLy, color: '#22c55e' },
          { label: 'Độ tin cậy AI (%)', value: stats.doTinCayTB, color: '#3b82f6' },
        ]}
      />

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo mã, khu vực, địa chỉ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterLoai} onValueChange={setFilterLoai}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Loại rủi ro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {loaiRuiRoOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterMucDo} onValueChange={setFilterMucDo}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Mức độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả mức độ</SelectItem>
                {mucDoOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách phân tích rủi ro quy hoạch</CardTitle>
          <CardDescription>Tìm thấy {filteredData.length} kết quả phân tích</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã</TableHead>
                <TableHead>Khu vực</TableHead>
                <TableHead>Loại rủi ro</TableHead>
                <TableHead>Mức độ</TableHead>
                <TableHead>Xác suất</TableHead>
                <TableHead>Độ tin cậy AI</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.MaPhanTich}>
                  <TableCell className="font-medium text-purple-600">{item.MaPhanTich}</TableCell>
                  <TableCell>
                    <div className="max-w-[150px] truncate text-sm" title={item.KhuVuc}>
                      <MapPin className="inline h-3 w-3 mr-1" />
                      {item.KhuVuc}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-secondary/30 text-secondary">
                      {item.LoaiRuiRo}
                    </Badge>
                  </TableCell>
                  <TableCell>{getMucDoBadge(item.MucDoRuiRo)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={item.XacSuat} className="w-16 h-2" />
                      <span className="text-sm font-medium">{item.XacSuat}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Brain className="h-3 w-3 text-blue-500" />
                      <span className="font-medium">{item.DoTinCayAI}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getTrangThaiBadge(item.TrangThai)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {/* View Dialog */}
                      <Dialog open={isViewOpen && selectedRuiRo?.MaPhanTich === item.MaPhanTich} onOpenChange={(open) => { setIsViewOpen(open); if (!open) setSelectedRuiRo(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedRuiRo({ ...item }); setIsViewOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Chi tiết phân tích rủi ro</DialogTitle>
                            <DialogDescription>Mã: {item.MaPhanTich}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Khu vực</p>
                              <p className="font-medium">{item.KhuVuc}</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Địa chỉ</p>
                              <p className="font-medium">{item.DiaChi}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Mã thửa / Số tờ</p>
                              <p className="font-medium">{item.MaThua} / {item.SoTo}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Ngày phân tích</p>
                              <p className="font-medium">{item.NgayPhanTich}</p>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-600">
                                <AlertCircle className="h-4 w-4" /> Phân tích rủi ro
                              </h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Loại rủi ro</p>
                                  <Badge variant="outline" className="text-red-600">{item.LoaiRuiRo}</Badge>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Mức độ</p>
                                  {getMucDoBadge(item.MucDoRuiRo)}
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Xác suất xảy ra</p>
                                  <div className="flex items-center gap-2">
                                    <Progress value={item.XacSuat} className="w-24 h-2" />
                                    <span className="font-bold text-lg">{item.XacSuat}%</span>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Độ tin cậy AI</p>
                                  <div className="flex items-center gap-2">
                                    <Brain className="h-4 w-4 text-blue-500" />
                                    <span className="font-bold text-lg">{item.DoTinCayAI}%</span>
                                  </div>
                                </div>
                                <div className="space-y-1 col-span-2">
                                  <p className="text-sm text-muted-foreground">Mô tả rủi ro</p>
                                  <p className="font-medium">{item.MoTaRuiRo}</p>
                                </div>
                                <div className="space-y-1 col-span-2">
                                  <p className="text-sm text-muted-foreground">Nguyên nhân</p>
                                  <p className="font-medium">{item.NguyenNhan}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3 flex items-center gap-2 text-purple-600">
                                <Lightbulb className="h-4 w-4" /> Khuyến nghị AI
                              </h4>
                              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                                <p className="font-medium">{item.KhuyenNghiAI}</p>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Trạng thái</p>
                              {getTrangThaiBadge(item.TrangThai)}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Cập nhật cuối</p>
                              <p className="font-medium">{item.NgayCapNhat}</p>
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
                      <Dialog open={isEditOpen && selectedRuiRo?.MaPhanTich === item.MaPhanTich} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setSelectedRuiRo(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedRuiRo({ ...item }); setIsEditOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Cập nhật phân tích rủi ro</DialogTitle>
                            <DialogDescription>Mã: {item.MaPhanTich}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Thông tin khu vực</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                  <Label>Khu vực</Label>
                                  <Input
                                    value={selectedRuiRo?.KhuVuc || ''}
                                    onChange={(e) => setSelectedRuiRo((prev) => prev ? ({ ...prev, KhuVuc: e.target.value }) : prev)}
                                  />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label>Địa chỉ</Label>
                                  <Input
                                    value={selectedRuiRo?.DiaChi || ''}
                                    onChange={(e) => setSelectedRuiRo((prev) => prev ? ({ ...prev, DiaChi: e.target.value }) : prev)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Mã thửa</Label>
                                  <Input
                                    value={selectedRuiRo?.MaThua || ''}
                                    onChange={(e) => setSelectedRuiRo((prev) => prev ? ({ ...prev, MaThua: e.target.value }) : prev)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Số tờ</Label>
                                  <Input
                                    value={selectedRuiRo?.SoTo || ''}
                                    onChange={(e) => setSelectedRuiRo((prev) => prev ? ({ ...prev, SoTo: e.target.value }) : prev)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Ngày phân tích</Label>
                                  <Input
                                    type="date"
                                    value={selectedRuiRo?.NgayPhanTich || ''}
                                    onChange={(e) => setSelectedRuiRo((prev) => prev ? ({ ...prev, NgayPhanTich: e.target.value }) : prev)}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="bg-red-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Phân tích rủi ro</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Loại rủi ro</Label>
                                  <Input
                                    value={selectedRuiRo?.LoaiRuiRo || ''}
                                    onChange={(e) => setSelectedRuiRo((prev) => prev ? ({ ...prev, LoaiRuiRo: e.target.value }) : prev)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Mức độ rủi ro</Label>
                                  <Select
                                    value={selectedRuiRo?.MucDoRuiRo || 'Trung bình'}
                                    onValueChange={(value) => setSelectedRuiRo((prev) => prev ? ({ ...prev, MucDoRuiRo: value }) : prev)}
                                  >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {mucDoOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Xác suất xảy ra (%)</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={selectedRuiRo?.XacSuat ?? 0}
                                    onChange={(e) => setSelectedRuiRo((prev) => prev ? ({ ...prev, XacSuat: Number(e.target.value) || 0 }) : prev)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Độ tin cậy AI (%)</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={selectedRuiRo?.DoTinCayAI ?? 0}
                                    onChange={(e) => setSelectedRuiRo((prev) => prev ? ({ ...prev, DoTinCayAI: Number(e.target.value) || 0 }) : prev)}
                                  />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label>Mô tả rủi ro</Label>
                                  <Textarea
                                    value={selectedRuiRo?.MoTaRuiRo || ''}
                                    rows={2}
                                    onChange={(e) => setSelectedRuiRo((prev) => prev ? ({ ...prev, MoTaRuiRo: e.target.value }) : prev)}
                                  />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <Label>Nguyên nhân</Label>
                                  <Textarea
                                    value={selectedRuiRo?.NguyenNhan || ''}
                                    rows={2}
                                    onChange={(e) => setSelectedRuiRo((prev) => prev ? ({ ...prev, NguyenNhan: e.target.value }) : prev)}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="bg-purple-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Khuyến nghị AI</h4>
                              <div className="space-y-2">
                                <Label>Khuyến nghị xử lý</Label>
                                <Textarea
                                  value={selectedRuiRo?.KhuyenNghiAI || ''}
                                  rows={3}
                                  onChange={(e) => setSelectedRuiRo((prev) => prev ? ({ ...prev, KhuyenNghiAI: e.target.value }) : prev)}
                                />
                              </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Trạng thái</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Trạng thái</Label>
                                  <Select
                                    value={selectedRuiRo?.TrangThai || 'Mới phát hiện'}
                                    onValueChange={(value) => setSelectedRuiRo((prev) => prev ? ({ ...prev, TrangThai: value }) : prev)}
                                  >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {trangThaiOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Ghi chú</Label>
                              <Textarea
                                value={selectedRuiRo?.GhiChu || ''}
                                onChange={(e) => setSelectedRuiRo((prev) => prev ? ({ ...prev, GhiChu: e.target.value }) : prev)}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Hủy</Button>
                            <Button onClick={handleUpdate}>Cập nhật</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
