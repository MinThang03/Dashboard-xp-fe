'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Shield,
  Search,
  Plus,
  Download,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck,
  Eye,
  Edit,
  X,
  AlertTriangle,
  FileText,
  UserCheck,
  History,
} from 'lucide-react';
import { mockHoSoNghiepVu, mockLichSuXuLyHoSo, formatDateTime } from '@/lib/mock-data';

// Interface cho Hồ sơ nghiệp vụ (Chứng thực)
interface HoSoNghiepVu {
  MaHoSo: string;
  TenNghiepVu: string;
  MaCongDan: number;
  TenCongDan: string;
  MaLinhVuc: number;
  TenLinhVuc: string;
  MaLoaiNghiepVu: number;
  LoaiHoSo: string;
  MaCanBoXuLy: number;
  TenCanBoXuLy: string;
  MaTrangThai: string;
  TrangThai: string;
  NgayTao: string;
  HanXuLy: string;
  NgayHoanThanh: string | null;
  MucDoUuTien: number;
  GhiChuXuLy: string;
}

interface LichSuXuLy {
  MaLichSu: number;
  MaHoSo: string;
  TrangThaiCu: string;
  TrangThaiMoi: string;
  NguoiThucHien: number;
  TenNguoiThucHien: string;
  ThoiGian: string;
  GhiChu: string;
}

export default function ChungThucPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  
  // State for dialogs
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedHoSo, setSelectedHoSo] = useState<HoSoNghiepVu | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<LichSuXuLy[]>([]);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    MaHoSo: '',
    TenNghiepVu: '',
    TenCongDan: '',
    LoaiHoSo: '',
    TenCanBoXuLy: '',
    TrangThai: 'Mới tạo',
    MaTrangThai: 'MOI_TAO',
    HanXuLy: '',
    MucDoUuTien: 2,
    GhiChuXuLy: '',
  });

  // Filter data
  const filteredData = (mockHoSoNghiepVu as HoSoNghiepVu[]).filter((item) => {
    const matchSearch = 
      item.MaHoSo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.TenNghiepVu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.TenCongDan.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchStatus = statusFilter === 'all' || item.MaTrangThai === statusFilter;
    const matchPriority = priorityFilter === 'all' || item.MucDoUuTien.toString() === priorityFilter;
    
    return matchSearch && matchStatus && matchPriority;
  });

  // Stats
  const stats = {
    total: mockHoSoNghiepVu.length,
    pending: mockHoSoNghiepVu.filter((h) => h.MaTrangThai === 'CHO_DUYET' || h.MaTrangThai === 'MOI_TAO').length,
    processing: mockHoSoNghiepVu.filter((h) => h.MaTrangThai === 'DANG_XU_LY').length,
    completed: mockHoSoNghiepVu.filter((h) => h.MaTrangThai === 'HOAN_THANH').length,
  };

  // Handlers
  const handleView = (hoSo: HoSoNghiepVu) => {
    setSelectedHoSo(hoSo);
    setViewDialogOpen(true);
  };

  const handleEdit = (hoSo: HoSoNghiepVu) => {
    setSelectedHoSo(hoSo);
    setFormData({
      MaHoSo: hoSo.MaHoSo,
      TenNghiepVu: hoSo.TenNghiepVu,
      TenCongDan: hoSo.TenCongDan,
      LoaiHoSo: hoSo.LoaiHoSo,
      TenCanBoXuLy: hoSo.TenCanBoXuLy,
      TrangThai: hoSo.TrangThai,
      MaTrangThai: hoSo.MaTrangThai,
      HanXuLy: hoSo.HanXuLy.split(' ')[0],
      MucDoUuTien: hoSo.MucDoUuTien,
      GhiChuXuLy: hoSo.GhiChuXuLy,
    });
    setEditDialogOpen(true);
  };

  const handleViewHistory = (hoSo: HoSoNghiepVu) => {
    setSelectedHoSo(hoSo);
    const history = (mockLichSuXuLyHoSo as LichSuXuLy[]).filter(h => h.MaHoSo === hoSo.MaHoSo);
    setSelectedHistory(history);
    setHistoryDialogOpen(true);
  };

  const handleAdd = () => {
    const newMaHoSo = `HS-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(mockHoSoNghiepVu.length + 1).padStart(4, '0')}`;
    setFormData({
      MaHoSo: newMaHoSo,
      TenNghiepVu: '',
      TenCongDan: '',
      LoaiHoSo: '',
      TenCanBoXuLy: '',
      TrangThai: 'Mới tạo',
      MaTrangThai: 'MOI_TAO',
      HanXuLy: '',
      MucDoUuTien: 2,
      GhiChuXuLy: '',
    });
    setAddDialogOpen(true);
  };

  const handleSave = () => {
    console.log('Saving:', formData);
    setEditDialogOpen(false);
    setAddDialogOpen(false);
  };

  // Helper functions
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'HOAN_THANH':
        return <Badge className="bg-green-500/10 text-green-700 border-0">Hoàn thành</Badge>;
      case 'DANG_XU_LY':
        return <Badge className="bg-blue-500/10 text-blue-700 border-0">Đang xử lý</Badge>;
      case 'CHO_DUYET':
        return <Badge className="bg-yellow-500/10 text-yellow-700 border-0">Chờ duyệt</Badge>;
      case 'TU_CHOI':
        return <Badge className="bg-red-500/10 text-red-700 border-0">Từ chối</Badge>;
      default:
        return <Badge className="bg-gray-500/10 text-gray-700 border-0">Mới tạo</Badge>;
    }
  };

  const getPriorityBadge = (priority: number) => {
    switch (priority) {
      case 1:
        return <Badge className="bg-red-500/10 text-red-700 border-0"><AlertTriangle className="w-3 h-3 mr-1" />Cao</Badge>;
      case 2:
        return <Badge className="bg-yellow-500/10 text-yellow-700 border-0">Trung bình</Badge>;
      case 3:
        return <Badge className="bg-green-500/10 text-green-700 border-0">Thấp</Badge>;
      default:
        return <Badge className="bg-gray-500/10 text-gray-700 border-0">Thường</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary via-accent to-primary p-6 sm:p-8 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">Chứng thực, Xác nhận</h1>
              </div>
              <p className="text-sm sm:text-base text-white/90">Quản lý hồ sơ chứng thực chữ ký, bản sao và xác nhận giấy tờ</p>
            </div>
            <Button className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo hồ sơ mới
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="p-4 sm:p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-xl">
              <FileCheck className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{stats.total}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Tổng hồ sơ</p>
        </Card>

        <Card className="p-4 sm:p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 sm:p-3 bg-status-warning/10 rounded-xl">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-status-warning" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{stats.pending}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Chờ xử lý</p>
        </Card>

        <Card className="p-4 sm:p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-xl">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{stats.processing}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Đang xử lý</p>
        </Card>

        <Card className="p-4 sm:p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 sm:p-3 bg-status-success/10 rounded-xl">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-status-success" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{stats.completed}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Hoàn thành</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 border-0 shadow-lg">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
          <div className="flex-1 min-w-[200px] sm:min-w-[250px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm hồ sơ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 h-10 sm:h-11 bg-slate-50 text-sm sm:text-base"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 sm:h-11 px-3 sm:px-4 border border-input rounded-lg bg-slate-50 text-sm sm:text-base min-w-[140px] sm:min-w-[160px]"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="MOI_TAO">Mới tạo</option>
            <option value="CHO_DUYET">Chờ duyệt</option>
            <option value="DANG_XU_LY">Đang xử lý</option>
            <option value="HOAN_THANH">Hoàn thành</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-10 sm:h-11 px-3 sm:px-4 border border-input rounded-lg bg-slate-50 text-sm sm:text-base min-w-[140px] sm:min-w-[160px]"
          >
            <option value="all">Tất cả mức độ</option>
            <option value="1">Ưu tiên cao</option>
            <option value="2">Trung bình</option>
            <option value="3">Thấp</option>
          </select>
        </div>
      </Card>

      {/* Data Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold">Mã hồ sơ</th>
                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold hidden md:table-cell">Tên nghiệp vụ</th>
                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold">Công dân</th>
                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold hidden lg:table-cell">Cán bộ xử lý</th>
                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold">Trạng thái</th>
                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold hidden sm:table-cell">Mức độ</th>
                <th className="text-right p-3 sm:p-4 text-xs sm:text-sm font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.MaHoSo} className="border-t hover:bg-muted/30 transition-colors">
                  <td className="p-3 sm:p-4">
                    <div className="font-medium text-xs sm:text-sm">{item.MaHoSo}</div>
                    <div className="text-xs text-muted-foreground md:hidden mt-1">{item.TenNghiepVu}</div>
                  </td>
                  <td className="p-3 sm:p-4 hidden md:table-cell">
                    <div className="text-xs sm:text-sm">{item.TenNghiepVu}</div>
                    <div className="text-xs text-muted-foreground">{item.LoaiHoSo}</div>
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">{item.TenCongDan}</span>
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 hidden lg:table-cell text-xs sm:text-sm">{item.TenCanBoXuLy}</td>
                  <td className="p-3 sm:p-4">{getStatusBadge(item.MaTrangThai)}</td>
                  <td className="p-3 sm:p-4 hidden sm:table-cell">{getPriorityBadge(item.MucDoUuTien)}</td>
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleView(item)}>
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(item)}>
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hidden sm:inline-flex" onClick={() => handleViewHistory(item)}>
                        <History className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Không tìm thấy hồ sơ phù hợp</p>
          </div>
        )}
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Chi tiết hồ sơ chứng thực
            </DialogTitle>
            <DialogDescription>
              Mã hồ sơ: {selectedHoSo?.MaHoSo}
            </DialogDescription>
          </DialogHeader>
          {selectedHoSo && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Tên nghiệp vụ</Label>
                  <p className="font-medium">{selectedHoSo.TenNghiepVu}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Loại hồ sơ</Label>
                  <p className="font-medium">{selectedHoSo.LoaiHoSo}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Công dân yêu cầu</Label>
                  <p className="font-medium">{selectedHoSo.TenCongDan}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Lĩnh vực</Label>
                  <p className="font-medium">{selectedHoSo.TenLinhVuc}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Cán bộ xử lý</Label>
                  <p className="font-medium">{selectedHoSo.TenCanBoXuLy}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Trạng thái</Label>
                  <div>{getStatusBadge(selectedHoSo.MaTrangThai)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Ngày tạo</Label>
                  <p className="font-medium">{formatDateTime(selectedHoSo.NgayTao)}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Hạn xử lý</Label>
                  <p className="font-medium">{formatDateTime(selectedHoSo.HanXuLy)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Ngày hoàn thành</Label>
                  <p className="font-medium">
                    {selectedHoSo.NgayHoanThanh ? formatDateTime(selectedHoSo.NgayHoanThanh) : 'Chưa hoàn thành'}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Mức độ ưu tiên</Label>
                  <div>{getPriorityBadge(selectedHoSo.MucDoUuTien)}</div>
                </div>
              </div>
              {selectedHoSo.GhiChuXuLy && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Ghi chú xử lý</Label>
                  <p className="font-medium bg-slate-50 p-3 rounded-lg">{selectedHoSo.GhiChuXuLy}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Sửa hồ sơ chứng thực
            </DialogTitle>
            <DialogDescription>
              Cập nhật thông tin hồ sơ: {formData.MaHoSo}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="TenNghiepVu">Tên nghiệp vụ *</Label>
                <Input
                  id="TenNghiepVu"
                  value={formData.TenNghiepVu}
                  onChange={(e) => setFormData({...formData, TenNghiepVu: e.target.value})}
                  placeholder="Nhập tên nghiệp vụ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="LoaiHoSo">Loại hồ sơ *</Label>
                <Select value={formData.LoaiHoSo} onValueChange={(v) => setFormData({...formData, LoaiHoSo: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại hồ sơ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chứng thực chữ ký">Chứng thực chữ ký</SelectItem>
                    <SelectItem value="Chứng thực bản sao">Chứng thực bản sao</SelectItem>
                    <SelectItem value="Xác nhận giấy tờ">Xác nhận giấy tờ</SelectItem>
                    <SelectItem value="Chứng thực hợp đồng">Chứng thực hợp đồng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="TenCongDan">Tên công dân *</Label>
                <Input
                  id="TenCongDan"
                  value={formData.TenCongDan}
                  onChange={(e) => setFormData({...formData, TenCongDan: e.target.value})}
                  placeholder="Nhập tên công dân"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="TenCanBoXuLy">Cán bộ xử lý</Label>
                <Input
                  id="TenCanBoXuLy"
                  value={formData.TenCanBoXuLy}
                  onChange={(e) => setFormData({...formData, TenCanBoXuLy: e.target.value})}
                  placeholder="Nhập tên cán bộ"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="HanXuLy">Hạn xử lý</Label>
                <Input
                  id="HanXuLy"
                  type="date"
                  value={formData.HanXuLy}
                  onChange={(e) => setFormData({...formData, HanXuLy: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="MucDoUuTien">Mức độ ưu tiên</Label>
                <Select value={formData.MucDoUuTien.toString()} onValueChange={(v) => setFormData({...formData, MucDoUuTien: parseInt(v)})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Cao</SelectItem>
                    <SelectItem value="2">Trung bình</SelectItem>
                    <SelectItem value="3">Thấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="TrangThai">Trạng thái</Label>
              <Select value={formData.MaTrangThai} onValueChange={(v) => setFormData({...formData, MaTrangThai: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MOI_TAO">Mới tạo</SelectItem>
                  <SelectItem value="DANG_XU_LY">Đang xử lý</SelectItem>
                  <SelectItem value="CHO_DUYET">Chờ duyệt</SelectItem>
                  <SelectItem value="HOAN_THANH">Hoàn thành</SelectItem>
                  <SelectItem value="TU_CHOI">Từ chối</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="GhiChuXuLy">Ghi chú xử lý</Label>
              <Textarea
                id="GhiChuXuLy"
                value={formData.GhiChuXuLy}
                onChange={(e) => setFormData({...formData, GhiChuXuLy: e.target.value})}
                placeholder="Nhập ghi chú xử lý..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button onClick={handleSave}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Thêm hồ sơ chứng thực mới
            </DialogTitle>
            <DialogDescription>
              Mã hồ sơ: {formData.MaHoSo}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-TenNghiepVu">Tên nghiệp vụ *</Label>
                <Input
                  id="add-TenNghiepVu"
                  value={formData.TenNghiepVu}
                  onChange={(e) => setFormData({...formData, TenNghiepVu: e.target.value})}
                  placeholder="Nhập tên nghiệp vụ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-LoaiHoSo">Loại hồ sơ *</Label>
                <Select value={formData.LoaiHoSo} onValueChange={(v) => setFormData({...formData, LoaiHoSo: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại hồ sơ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chứng thực chữ ký">Chứng thực chữ ký</SelectItem>
                    <SelectItem value="Chứng thực bản sao">Chứng thực bản sao</SelectItem>
                    <SelectItem value="Xác nhận giấy tờ">Xác nhận giấy tờ</SelectItem>
                    <SelectItem value="Chứng thực hợp đồng">Chứng thực hợp đồng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-TenCongDan">Tên công dân *</Label>
                <Input
                  id="add-TenCongDan"
                  value={formData.TenCongDan}
                  onChange={(e) => setFormData({...formData, TenCongDan: e.target.value})}
                  placeholder="Nhập tên công dân"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-TenCanBoXuLy">Cán bộ xử lý</Label>
                <Input
                  id="add-TenCanBoXuLy"
                  value={formData.TenCanBoXuLy}
                  onChange={(e) => setFormData({...formData, TenCanBoXuLy: e.target.value})}
                  placeholder="Nhập tên cán bộ"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-HanXuLy">Hạn xử lý</Label>
                <Input
                  id="add-HanXuLy"
                  type="date"
                  value={formData.HanXuLy}
                  onChange={(e) => setFormData({...formData, HanXuLy: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-MucDoUuTien">Mức độ ưu tiên</Label>
                <Select value={formData.MucDoUuTien.toString()} onValueChange={(v) => setFormData({...formData, MucDoUuTien: parseInt(v)})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Cao</SelectItem>
                    <SelectItem value="2">Trung bình</SelectItem>
                    <SelectItem value="3">Thấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-GhiChuXuLy">Ghi chú</Label>
              <Textarea
                id="add-GhiChuXuLy"
                value={formData.GhiChuXuLy}
                onChange={(e) => setFormData({...formData, GhiChuXuLy: e.target.value})}
                placeholder="Nhập ghi chú..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button onClick={handleSave}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm hồ sơ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Lịch sử xử lý hồ sơ
            </DialogTitle>
            <DialogDescription>
              Mã hồ sơ: {selectedHoSo?.MaHoSo}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedHistory.length > 0 ? (
              <div className="space-y-4">
                {selectedHistory.map((history, index) => (
                  <div key={history.MaLichSu} className="relative pl-6 pb-4">
                    {index !== selectedHistory.length - 1 && (
                      <div className="absolute left-2 top-4 bottom-0 w-0.5 bg-gray-200"></div>
                    )}
                    <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{history.TenNguoiThucHien}</span>
                        <span className="text-sm text-muted-foreground">{formatDateTime(history.ThoiGian)}</span>
                      </div>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Thay đổi trạng thái: </span>
                        <Badge variant="outline" className="mr-2">{history.TrangThaiCu}</Badge>
                        →
                        <Badge variant="outline" className="ml-2">{history.TrangThaiMoi}</Badge>
                      </p>
                      {history.GhiChu && (
                        <p className="text-sm text-muted-foreground mt-2">Ghi chú: {history.GhiChu}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có lịch sử xử lý</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHistoryDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
