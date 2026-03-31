"use client";

import { useEffect, useMemo, useState } from "react";
import { Ban, AlertTriangle, Clock, CheckCircle2, Search, Plus, Download, Eye, Edit, MapPin, Calendar, User, Gavel, FileX, DollarSign, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { xayDungTraiPhepApi } from "@/lib/api";

interface XayDungTraiPhep {
  MaViPham?: number | string;
  MaVuViec: string;
  DiaChi: string;
  MaThua: string;
  SoTo: string;
  ChuCongTrinh: string;
  CCCD: string;
  SoDienThoai: string;
  LoaiViPham: string;
  MoTaViPham: string;
  DienTichViPham: number;
  NgayPhatHien: string;
  NguoiPhatHien: string;
  TrangThai: string;
  BienPhapXuLy: string;
  SoTien: number;
  SoQuyetDinhXP: string;
  NgayQD: string;
  ThoiHanThaoGo: string;
  DaCuongChe: boolean;
  NgayCuongChe: string;
  KetQuaXuLy: string;
  GhiChu: string;
}

const mockTraiPhep: XayDungTraiPhep[] = [
  {
    MaVuViec: "XDTP001",
    DiaChi: "123 Đường ABC, Khu phố 1, phường XYZ",
    MaThua: "123",
    SoTo: "45",
    ChuCongTrinh: "Nguyễn Văn An",
    CCCD: "001234567890",
    SoDienThoai: "0901234567",
    LoaiViPham: "Xây dựng không phép",
    MoTaViPham: "Xây dựng nhà 2 tầng không có giấy phép xây dựng",
    DienTichViPham: 80,
    NgayPhatHien: "2025-01-05",
    NguoiPhatHien: "Đội quản lý TTXD",
    TrangThai: "Đã xử lý",
    BienPhapXuLy: "Phạt tiền, yêu cầu bổ sung giấy phép",
    SoTien: 50000000,
    SoQuyetDinhXP: "QĐ-2025-001",
    NgayQD: "2025-01-10",
    ThoiHanThaoGo: "",
    DaCuongChe: false,
    NgayCuongChe: "",
    KetQuaXuLy: "Đã nộp phạt, đang hoàn thiện giấy phép",
    GhiChu: "",
  },
  {
    MaVuViec: "XDTP002",
    DiaChi: "456 Đường DEF, Thôn 2, xã GHI",
    MaThua: "456",
    SoTo: "67",
    ChuCongTrinh: "Trần Văn Bình",
    CCCD: "001234567891",
    SoDienThoai: "0902345678",
    LoaiViPham: "Xây dựng không phép",
    MoTaViPham: "Xây dựng nhà xưởng trên đất nông nghiệp không chuyển mục đích",
    DienTichViPham: 500,
    NgayPhatHien: "2024-12-20",
    NguoiPhatHien: "Tổ dân phố",
    TrangThai: "Chờ cưỡng chế",
    BienPhapXuLy: "Phạt tiền, cưỡng chế tháo dỡ",
    SoTien: 150000000,
    SoQuyetDinhXP: "QĐ-2025-002",
    NgayQD: "2025-01-05",
    ThoiHanThaoGo: "2025-01-20",
    DaCuongChe: false,
    NgayCuongChe: "",
    KetQuaXuLy: "",
    GhiChu: "Không hợp tác, chuyển cưỡng chế",
  },
  {
    MaVuViec: "XDTP003",
    DiaChi: "789 Đường KLM, Khu phố 3, phường NOP",
    MaThua: "789",
    SoTo: "89",
    ChuCongTrinh: "Công ty TNHH ABC",
    CCCD: "0108765432",
    SoDienThoai: "0903456789",
    LoaiViPham: "Xây dựng sai phép",
    MoTaViPham: "Xây vượt 2 tầng so với giấy phép (4 tầng thay vì 2 tầng)",
    DienTichViPham: 200,
    NgayPhatHien: "2025-01-08",
    NguoiPhatHien: "Đội quản lý TTXD",
    TrangThai: "Đang xử lý",
    BienPhapXuLy: "Đình chỉ thi công, lập biên bản xử phạt",
    SoTien: 0,
    SoQuyetDinhXP: "",
    NgayQD: "",
    ThoiHanThaoGo: "",
    DaCuongChe: false,
    NgayCuongChe: "",
    KetQuaXuLy: "",
    GhiChu: "Chủ đầu tư cam kết tự tháo dỡ",
  },
  {
    MaVuViec: "XDTP005",
    DiaChi: "567 Đường WXY, Thôn 3, xã ZAB",
    MaThua: "567",
    SoTo: "34",
    ChuCongTrinh: "Hoàng Văn Em",
    CCCD: "001234567893",
    SoDienThoai: "0905678901",
    LoaiViPham: "Xây dựng không phép",
    MoTaViPham: "Xây dựng chuồng trại chăn nuôi không phép, gây ô nhiễm",
    DienTichViPham: 300,
    NgayPhatHien: "2024-11-15",
    NguoiPhatHien: "Phản ánh người dân",
    TrangThai: "Đã cưỡng chế",
    BienPhapXuLy: "Phạt tiền, cưỡng chế tháo dỡ",
    SoTien: 100000000,
    SoQuyetDinhXP: "QĐ-2024-015",
    NgayQD: "2024-11-25",
    ThoiHanThaoGo: "2024-12-10",
    DaCuongChe: true,
    NgayCuongChe: "2024-12-15",
    KetQuaXuLy: "Đã tháo dỡ hoàn toàn, thu hồi đất",
    GhiChu: "",
  },
  {
    MaVuViec: "XDTP006",
    DiaChi: "890 Đường CDE, Khu phố 5, phường FGH",
    MaThua: "890",
    SoTo: "56",
    ChuCongTrinh: "Lê Thị Giang",
    CCCD: "001234567894",
    SoDienThoai: "0906789012",
    LoaiViPham: "Xây dựng sai phép",
    MoTaViPham: "Cơi nới ban công lấn ra vỉa hè không phép",
    DienTichViPham: 8,
    NgayPhatHien: "2025-01-12",
    NguoiPhatHien: "Đội quản lý TTXD",
    TrangThai: "Mới phát hiện",
    BienPhapXuLy: "",
    SoTien: 0,
    SoQuyetDinhXP: "",
    NgayQD: "",
    ThoiHanThaoGo: "",
    DaCuongChe: false,
    NgayCuongChe: "",
    KetQuaXuLy: "",
    GhiChu: "Đang lập hồ sơ xử lý",
  },
];

const loaiViPhamOptions = ["Xây dựng không phép", "Xây dựng sai phép", "Lấn chiếm đất công", "Xây trên đất không được phép", "Khác"];
const trangThaiOptions = ["Mới phát hiện", "Đang xử lý", "Đã xử lý", "Chờ cưỡng chế", "Đã cưỡng chế"];
const bienPhapOptions = ["Nhắc nhở", "Phạt tiền", "Yêu cầu tháo dỡ", "Đình chỉ thi công", "Phạt tiền, yêu cầu tháo dỡ", "Phạt tiền, cưỡng chế tháo dỡ"];

const defaultFormData = (): XayDungTraiPhep => ({
  MaVuViec: "",
  DiaChi: "",
  MaThua: "",
  SoTo: "",
  ChuCongTrinh: "",
  CCCD: "",
  SoDienThoai: "",
  LoaiViPham: "Xây dựng không phép",
  MoTaViPham: "",
  DienTichViPham: 0,
  NgayPhatHien: new Date().toISOString().split("T")[0],
  NguoiPhatHien: "",
  TrangThai: "Mới phát hiện",
  BienPhapXuLy: "",
  SoTien: 0,
  SoQuyetDinhXP: "",
  NgayQD: "",
  ThoiHanThaoGo: "",
  DaCuongChe: false,
  NgayCuongChe: "",
  KetQuaXuLy: "",
  GhiChu: "",
});

export default function XayDungTraiPhepPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [records, setRecords] = useState<XayDungTraiPhep[]>([]);
  const [filterTrangThai, setFilterTrangThai] = useState<string>("all");
  const [filterLoai, setFilterLoai] = useState<string>("all");
  const [selectedVu, setSelectedVu] = useState<XayDungTraiPhep | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState<XayDungTraiPhep>(defaultFormData());

  useEffect(() => {
    const loadData = async () => {
      const response = await xayDungTraiPhepApi.getList({ page: 1, limit: 500 });
      if (response.success && Array.isArray(response.data)) {
        setRecords(response.data);
      }
    };
    loadData();
  }, []);

  const reloadData = async () => {
    const response = await xayDungTraiPhepApi.getList({ page: 1, limit: 500 });
    if (response.success && Array.isArray(response.data)) {
      setRecords(response.data);
    }
  };

  const getRecordId = (item: any): number | null => {
    const id = Number(item?.MaViPham);
    return Number.isFinite(id) && id > 0 ? id : null;
  };

  const isSameRecord = (a: any, b: any): boolean => {
    if (!a || !b) return false;

    const idA = getRecordId(a);
    const idB = getRecordId(b);
    if (idA && idB) return idA === idB;

    const maA = String(a?.MaVuViec ?? "").trim();
    const maB = String(b?.MaVuViec ?? "").trim();
    if (maA && maB) return maA === maB;

    return false;
  };

  const getRowKey = (item: XayDungTraiPhep, index: number): string => {
    const id = getRecordId(item);
    if (id) return `xdtp-${id}`;

    const maVuViec = String(item.MaVuViec ?? "").trim();
    if (maVuViec) return `xdtp-code-${maVuViec}-${index}`;

    return `xdtp-row-${index}`;
  };

  const filteredData = useMemo(() => {
    return records.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        String(item.MaVuViec ?? "").toLowerCase().includes(q) ||
        String(item.ChuCongTrinh ?? "").toLowerCase().includes(q) ||
        String(item.DiaChi ?? "").toLowerCase().includes(q);
      const matchesTrangThai = filterTrangThai === "all" || item.TrangThai === filterTrangThai;
      const matchesLoai = filterLoai === "all" || item.LoaiViPham === filterLoai;
      return matchesSearch && matchesTrangThai && matchesLoai;
    });
  }, [records, searchQuery, filterTrangThai, filterLoai]);

  const stats = useMemo(() => ({
    total: records.length,
    moiPhatHien: records.filter((r) => r.TrangThai === "Mới phát hiện").length,
    dangXuLy: records.filter((r) => r.TrangThai === "Đang xử lý").length,
    daXuLy: records.filter((r) => r.TrangThai === "Đã xử lý").length,
    cuongChe: records.filter((r) => r.TrangThai === "Chờ cưỡng chế" || r.TrangThai === "Đã cưỡng chế").length,
    tongTienPhat: records.reduce((sum, r) => sum + (Number(r.SoTien) || 0), 0),
  }), [records]);

  const getTrangThaiBadge = (trangThai: string) => {
    switch (trangThai) {
      case "Đã xử lý":
        return (
          <Badge className="bg-status-success hover:bg-status-success">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {trangThai}
          </Badge>
        );
      case "Đang xử lý":
        return (
          <Badge className="bg-primary hover:bg-primary">
            <Clock className="h-3 w-3 mr-1" />
            {trangThai}
          </Badge>
        );
      case "Mới phát hiện":
        return (
          <Badge className="bg-status-danger hover:bg-status-danger">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {trangThai}
          </Badge>
        );
      case "Chờ cưỡng chế":
        return (
          <Badge className="bg-status-warning hover:bg-status-warning">
            <Gavel className="h-3 w-3 mr-1" />
            {trangThai}
          </Badge>
        );
      case "Đã cưỡng chế":
        return (
          <Badge className="bg-secondary hover:bg-secondary text-white">
            <Ban className="h-3 w-3 mr-1" />
            {trangThai}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{trangThai}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  const openAddDialog = () => {
    setSelectedVu(null);
    setFormData(defaultFormData());
    setIsAddOpen(true);
  };

  const openEditDialog = (item: XayDungTraiPhep) => {
    setSelectedVu(item);
    setFormData(item);
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    const id = getRecordId(selectedVu);
    if (isEditOpen) {
      if (!id) return;
      await xayDungTraiPhepApi.update(id, formData);
    } else {
      await xayDungTraiPhepApi.create(formData);
    }
    await reloadData();
    setIsAddOpen(false);
    setIsEditOpen(false);
  };

  const handleDelete = async (item: XayDungTraiPhep) => {
    const id = getRecordId(item);
    if (!id) return;
    if (!confirm(`Bạn có chắc chắn muốn xóa vụ ${item.MaVuViec || id}?`)) return;

    await xayDungTraiPhepApi.delete(id);
    await reloadData();
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      <div className="bg-gradient-to-r from-status-danger via-primary to-status-danger rounded-lg p-4 sm:p-5 xl:p-6 text-white">
        <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Ban className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Quản lý Xây dựng Trái phép</h1>
              <p className="text-status-danger/20">Phát hiện, xử lý công trình xây dựng trái phép</p>
            </div>
          </div>
          <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (!open) setFormData(defaultFormData()); }}>
            <DialogTrigger asChild>
              <Button className="w-full 2xl:w-auto bg-white text-status-danger hover:bg-white/90" onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Ghi nhận vi phạm
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ghi nhận vi phạm xây dựng trái phép</DialogTitle>
                <DialogDescription>Nhập thông tin vụ việc vi phạm</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Mã vụ việc</Label>
                  <Input value={formData.MaVuViec} onChange={(e) => setFormData({ ...formData, MaVuViec: e.target.value })} placeholder="VD: XDTP007" />
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <Select value={formData.TrangThai} onValueChange={(v) => setFormData({ ...formData, TrangThai: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      {trangThaiOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Địa chỉ vi phạm *</Label>
                  <Input value={formData.DiaChi} onChange={(e) => setFormData({ ...formData, DiaChi: e.target.value })} placeholder="Nhập địa chỉ" />
                </div>
                <div className="space-y-2">
                  <Label>Mã thửa</Label>
                  <Input value={formData.MaThua} onChange={(e) => setFormData({ ...formData, MaThua: e.target.value })} placeholder="Nhập mã thửa" />
                </div>
                <div className="space-y-2">
                  <Label>Số tờ</Label>
                  <Input value={formData.SoTo} onChange={(e) => setFormData({ ...formData, SoTo: e.target.value })} placeholder="Nhập số tờ" />
                </div>
                <div className="space-y-2">
                  <Label>Loại vi phạm *</Label>
                  <Select value={formData.LoaiViPham} onValueChange={(v) => setFormData({ ...formData, LoaiViPham: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại vi phạm" />
                    </SelectTrigger>
                    <SelectContent>
                      {loaiViPhamOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Diện tích vi phạm (m²)</Label>
                  <Input
                    type="number"
                    value={formData.DienTichViPham}
                    onChange={(e) => setFormData({ ...formData, DienTichViPham: parseFloat(e.target.value) || 0 })}
                    placeholder="Nhập diện tích"
                  />
                </div>
                <div className="col-span-2 border-t pt-4 mt-2">
                  <h4 className="font-semibold mb-3">Chủ công trình</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Họ tên *</Label>
                      <Input value={formData.ChuCongTrinh} onChange={(e) => setFormData({ ...formData, ChuCongTrinh: e.target.value })} placeholder="Nhập tên" />
                    </div>
                    <div className="space-y-2">
                      <Label>CCCD</Label>
                      <Input value={formData.CCCD} onChange={(e) => setFormData({ ...formData, CCCD: e.target.value })} placeholder="Nhập CCCD" />
                    </div>
                    <div className="space-y-2">
                      <Label>Điện thoại</Label>
                      <Input value={formData.SoDienThoai} onChange={(e) => setFormData({ ...formData, SoDienThoai: e.target.value })} placeholder="Nhập SĐT" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Ngày phát hiện *</Label>
                  <Input type="date" value={formData.NgayPhatHien} onChange={(e) => setFormData({ ...formData, NgayPhatHien: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Người/đơn vị phát hiện</Label>
                  <Input value={formData.NguoiPhatHien} onChange={(e) => setFormData({ ...formData, NguoiPhatHien: e.target.value })} placeholder="Nhập thông tin" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Mô tả vi phạm *</Label>
                  <Textarea
                    value={formData.MoTaViPham}
                    onChange={(e) => setFormData({ ...formData, MoTaViPham: e.target.value })}
                    placeholder="Mô tả chi tiết hành vi vi phạm"
                    rows={3}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Biện pháp xử lý</Label>
                  <Textarea
                    value={formData.BienPhapXuLy}
                    onChange={(e) => setFormData({ ...formData, BienPhapXuLy: e.target.value })}
                    placeholder="Phạt tiền, yêu cầu tháo dỡ, ..."
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 col-span-2">
                  <div className="space-y-2">
                    <Label>Số tiền phạt</Label>
                    <Input type="number" value={formData.SoTien} onChange={(e) => setFormData({ ...formData, SoTien: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Số QĐ xử phạt</Label>
                    <Input value={formData.SoQuyetDinhXP} onChange={(e) => setFormData({ ...formData, SoQuyetDinhXP: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Ngày quyết định</Label>
                    <Input type="date" value={formData.NgayQD} onChange={(e) => setFormData({ ...formData, NgayQD: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Thời hạn tháo gỡ</Label>
                    <Input type="date" value={formData.ThoiHanThaoGo} onChange={(e) => setFormData({ ...formData, ThoiHanThaoGo: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Đã cưỡng chế?</Label>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={formData.DaCuongChe} onChange={(e) => setFormData({ ...formData, DaCuongChe: e.target.checked })} />
                      <span>Đánh dấu cưỡng chế</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Ngày cưỡng chế</Label>
                    <Input type="date" value={formData.NgayCuongChe} onChange={(e) => setFormData({ ...formData, NgayCuongChe: e.target.value })} disabled={!formData.DaCuongChe} />
                  </div>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Kết quả xử lý</Label>
                  <Textarea value={formData.KetQuaXuLy} onChange={(e) => setFormData({ ...formData, KetQuaXuLy: e.target.value })} rows={2} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Ghi chú</Label>
                  <Textarea value={formData.GhiChu} onChange={(e) => setFormData({ ...formData, GhiChu: e.target.value })} placeholder="Nhập ghi chú" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleSave}>Ghi nhận</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-status-danger">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng vụ việc</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileX className="h-5 w-5 text-status-danger" />
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-status-warning">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mới phát hiện</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-status-warning" />
              <span className="text-2xl font-bold">{stats.moiPhatHien}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đang xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{stats.dangXuLy}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-status-success">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đã xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-status-success" />
              <span className="text-2xl font-bold">{stats.daXuLy}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cưỡng chế</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Gavel className="h-5 w-5 text-secondary" />
              <span className="text-2xl font-bold">{stats.cuongChe}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-teal-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng tiền phạt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-teal-500" />
              <span className="text-lg font-bold">{(stats.tongTienPhat / 1000000).toFixed(0)}tr</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo mã, chủ công trình, địa chỉ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterLoai} onValueChange={setFilterLoai}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Loại vi phạm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {loaiViPhamOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterTrangThai} onValueChange={setFilterTrangThai}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {trangThaiOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Xuất Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách vi phạm xây dựng trái phép</CardTitle>
          <CardDescription>Tìm thấy {filteredData.length} vụ việc</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã vụ</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Chủ công trình</TableHead>
                <TableHead>Loại vi phạm</TableHead>
                <TableHead>Ngày PH</TableHead>
                <TableHead>Tiền phạt</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={getRowKey(item, index)}>
                  <TableCell className="font-medium text-red-600">{item.MaVuViec}</TableCell>
                  <TableCell>
                    <div className="max-w-[150px] truncate text-sm" title={item.DiaChi}>
                      <MapPin className="inline h-3 w-3 mr-1" />
                      {item.DiaChi}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <User className="h-3 w-3" />
                      {item.ChuCongTrinh}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-status-danger border-status-danger/30">
                      {item.LoaiViPham}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {item.NgayPhatHien}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.SoTien > 0 ? <span className="font-medium text-red-600">{formatCurrency(item.SoTien)}</span> : <span className="text-muted-foreground">-</span>}
                  </TableCell>
                  <TableCell>{getTrangThaiBadge(item.TrangThai)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Dialog open={isViewOpen && isSameRecord(selectedVu, item)} onOpenChange={(open) => { setIsViewOpen(open); if (!open) setSelectedVu(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedVu(item); setIsViewOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Chi tiết vụ vi phạm</DialogTitle>
                            <DialogDescription>Mã vụ: {item.MaVuViec}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-1 col-span-2">
                              <p className="text-sm text-muted-foreground">Địa chỉ vi phạm</p>
                              <p className="font-medium">{item.DiaChi}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Mã thửa / Số tờ</p>
                              <p className="font-medium">
                                {item.MaThua} / {item.SoTo}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Diện tích vi phạm</p>
                              <p className="font-medium">{item.DienTichViPham} m²</p>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3">Chủ công trình</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Họ tên</p>
                                  <p className="font-medium">{item.ChuCongTrinh}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">CCCD</p>
                                  <p className="font-medium">{item.CCCD}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Điện thoại</p>
                                  <p className="font-medium">{item.SoDienThoai}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2 border-t pt-4 mt-2">
                              <h4 className="font-semibold mb-3 text-red-600">Thông tin vi phạm</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Loại vi phạm</p>
                                  <Badge variant="outline" className="text-red-600">
                                    {item.LoaiViPham}
                                  </Badge>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Ngày phát hiện</p>
                                  <p className="font-medium">{item.NgayPhatHien}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Người/đơn vị phát hiện</p>
                                  <p className="font-medium">{item.NguoiPhatHien}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Trạng thái</p>
                                  {getTrangThaiBadge(item.TrangThai)}
                                </div>
                                <div className="space-y-1 col-span-2">
                                  <p className="text-sm text-muted-foreground">Mô tả vi phạm</p>
                                  <p className="font-medium">{item.MoTaViPham}</p>
                                </div>
                              </div>
                            </div>
                            {(item.BienPhapXuLy || item.SoQuyetDinhXP || item.ThoiHanThaoGo || item.DaCuongChe || item.NgayCuongChe) && (
                              <div className="col-span-2 border-t pt-4 mt-2">
                                <h4 className="font-semibold mb-3">Biện pháp xử lý</h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1 col-span-2">
                                    <p className="text-sm text-muted-foreground">Biện pháp</p>
                                    <p className="font-medium">{item.BienPhapXuLy}</p>
                                  </div>
                                  {item.SoTien > 0 && (
                                    <div className="space-y-1">
                                      <p className="text-sm text-muted-foreground">Số tiền phạt</p>
                                      <p className="font-medium text-red-600">{formatCurrency(item.SoTien)}</p>
                                    </div>
                                  )}
                                  {item.SoQuyetDinhXP && (
                                    <div className="space-y-1">
                                      <p className="text-sm text-muted-foreground">Số QĐ xử phạt</p>
                                      <p className="font-medium">
                                        {item.SoQuyetDinhXP} ({item.NgayQD})
                                      </p>
                                    </div>
                                  )}
                                  {item.ThoiHanThaoGo && (
                                    <div className="space-y-1">
                                      <p className="text-sm text-muted-foreground">Thời hạn tháo gỡ</p>
                                      <p className="font-medium">{item.ThoiHanThaoGo}</p>
                                    </div>
                                  )}
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Tình trạng cưỡng chế</p>
                                    <p className="font-medium">{item.DaCuongChe ? 'Đã cưỡng chế' : 'Chưa cưỡng chế'}</p>
                                  </div>
                                  {item.DaCuongChe && (
                                    <div className="space-y-1">
                                      <p className="text-sm text-muted-foreground">Ngày cưỡng chế</p>
                                      <p className="font-medium">{item.NgayCuongChe}</p>
                                    </div>
                                  )}
                                  {item.KetQuaXuLy && (
                                    <div className="space-y-1 col-span-2">
                                      <p className="text-sm text-muted-foreground">Kết quả xử lý</p>
                                      <p className="font-medium">{item.KetQuaXuLy}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            {item.GhiChu && (
                              <div className="space-y-1 col-span-2">
                                <p className="text-sm text-muted-foreground">Ghi chú</p>
                                <p className="font-medium">{item.GhiChu}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={isEditOpen && isSameRecord(selectedVu, item)} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setSelectedVu(null); }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Cập nhật vụ vi phạm</DialogTitle>
                            <DialogDescription>Mã vụ: {item.MaVuViec}</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2 col-span-2">
                              <Label>Địa chỉ vi phạm</Label>
                              <Input value={formData.DiaChi} onChange={(e) => setFormData({ ...formData, DiaChi: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                              <Label>Loại vi phạm</Label>
                              <Select value={formData.LoaiViPham} onValueChange={(v) => setFormData({ ...formData, LoaiViPham: v })}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {loaiViPhamOptions.map((opt) => (
                                    <SelectItem key={opt} value={opt}>
                                      {opt}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Diện tích vi phạm (m²)</Label>
                              <Input type="number" value={formData.DienTichViPham} onChange={(e) => setFormData({ ...formData, DienTichViPham: parseFloat(e.target.value) || 0 })} />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label>Mô tả vi phạm</Label>
                              <Textarea value={formData.MoTaViPham} onChange={(e) => setFormData({ ...formData, MoTaViPham: e.target.value })} rows={2} />
                            </div>
                            <div className="col-span-2 border-t pt-4">
                              <h4 className="font-semibold mb-3">Chủ công trình</h4>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label>Họ tên</Label>
                                  <Input value={formData.ChuCongTrinh} onChange={(e) => setFormData({ ...formData, ChuCongTrinh: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                  <Label>CCCD</Label>
                                  <Input value={formData.CCCD} onChange={(e) => setFormData({ ...formData, CCCD: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                  <Label>Số điện thoại</Label>
                                  <Input value={formData.SoDienThoai} onChange={(e) => setFormData({ ...formData, SoDienThoai: e.target.value })} />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Trạng thái</Label>
                              <Select value={formData.TrangThai} onValueChange={(v) => setFormData({ ...formData, TrangThai: v })}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {trangThaiOptions.map((opt) => (
                                    <SelectItem key={opt} value={opt}>
                                      {opt}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Biện pháp xử lý</Label>
                              <Select value={formData.BienPhapXuLy} onValueChange={(v) => setFormData({ ...formData, BienPhapXuLy: v })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn biện pháp" />
                                </SelectTrigger>
                                <SelectContent>
                                  {bienPhapOptions.map((opt) => (
                                    <SelectItem key={opt} value={opt}>
                                      {opt}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Số tiền phạt (VNĐ)</Label>
                              <Input type="number" value={formData.SoTien} onChange={(e) => setFormData({ ...formData, SoTien: parseFloat(e.target.value) || 0 })} />
                            </div>
                            <div className="space-y-2">
                              <Label>Số QĐ xử phạt</Label>
                              <Input value={formData.SoQuyetDinhXP} onChange={(e) => setFormData({ ...formData, SoQuyetDinhXP: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                              <Label>Ngày quyết định</Label>
                              <Input type="date" value={formData.NgayQD} onChange={(e) => setFormData({ ...formData, NgayQD: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                              <Label>Thời hạn tháo gỡ</Label>
                              <Input type="date" value={formData.ThoiHanThaoGo} onChange={(e) => setFormData({ ...formData, ThoiHanThaoGo: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                              <Label>Đã cưỡng chế?</Label>
                              <div className="flex items-center gap-2 h-10">
                                <input type="checkbox" checked={formData.DaCuongChe} onChange={(e) => setFormData({ ...formData, DaCuongChe: e.target.checked })} />
                                <span className="text-sm">Đánh dấu cưỡng chế</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Ngày cưỡng chế</Label>
                              <Input type="date" value={formData.NgayCuongChe} onChange={(e) => setFormData({ ...formData, NgayCuongChe: e.target.value })} disabled={!formData.DaCuongChe} />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label>Kết quả xử lý</Label>
                              <Textarea value={formData.KetQuaXuLy} onChange={(e) => setFormData({ ...formData, KetQuaXuLy: e.target.value })} />
                            </div>
                            <div className="space-y-2 col-span-2">
                              <Label>Ghi chú</Label>
                              <Textarea value={formData.GhiChu} onChange={(e) => setFormData({ ...formData, GhiChu: e.target.value })} />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                              Hủy
                            </Button>
                            <Button onClick={handleSave}>Cập nhật</Button>
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
