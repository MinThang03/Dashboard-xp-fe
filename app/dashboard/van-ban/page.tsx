'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockVanBan, formatDate, formatDateTime } from '@/lib/mock-data';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Building2,
  User,
  Paperclip,
} from 'lucide-react';

export default function VanBanPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLoai, setFilterLoai] = useState<string>('all');
  const [filterTrangThai, setFilterTrangThai] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const filteredData = mockVanBan.filter((item) => {
    const search = searchQuery.toLowerCase();
    const matchesSearch =
      item.SoKyHieu.toLowerCase().includes(search) ||
      item.TrichYeu.toLowerCase().includes(search) ||
      item.CoQuanBanHanh.toLowerCase().includes(search);
    const matchesLoai = filterLoai === 'all' || item.LoaiVanBan === filterLoai;
    const matchesTrangThai = filterTrangThai === 'all' || item.TrangThai === filterTrangThai;
    return matchesSearch && matchesLoai && matchesTrangThai;
  });

  const handleView = (item: any) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setFormData({ ...item });
    setIsEditOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      SoKyHieu: '',
      TrichYeu: '',
      LoaiVanBan: 'Đến',
      LoaiVB: 'Công văn',
      CoQuanBanHanh: '',
      NgayBanHanh: new Date().toISOString().split('T')[0],
      NgayDen: new Date().toISOString().split('T')[0],
      MaLinhVuc: 1,
      NguoiXuLy: 1,
      TrangThai: 'Mới',
      FileDinhKem: '',
      GhiChu: '',
    });
    setIsAddOpen(true);
  };

  const handleSave = () => {
    console.log('Saving:', formData);
    setIsEditOpen(false);
    setIsAddOpen(false);
  };

  const handleDelete = (item: any) => {
    if (confirm(`Bạn có chắc chắn muốn xóa văn bản ${item.SoKyHieu}?`)) {
      console.log('Deleting:', item);
    }
  };

  const stats = {
    den: mockVanBan.filter(v => v.LoaiVanBan === 'Đến').length,
    di: mockVanBan.filter(v => v.LoaiVanBan === 'Đi').length,
    dangXuLy: mockVanBan.filter(v => v.TrangThai === 'Đang xử lý').length,
    hoanThanh: mockVanBan.filter(v => v.TrangThai === 'Hoàn thành').length,
  };


  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-secondary via-primary to-secondary p-6 sm:p-8 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">Quản lý Văn bản</h1>
              </div>
              <p className="text-sm sm:text-base text-white/90">Tiếp nhận, phân loại văn bản đến/đi</p>
            </div>
            <Button onClick={handleAdd} className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Thêm văn bản
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="p-4 sm:p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 sm:p-3 bg-status-danger/10 rounded-xl">
              <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-status-danger" />
            </div>
            <Badge className="bg-status-danger/10 text-status-danger border-0 text-xs sm:text-sm">Đến</Badge>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{stats.den}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">VB đến</p>
        </Card>

        <Card className="p-4 sm:p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 sm:p-3 bg-status-success/10 rounded-xl">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-status-success" />
            </div>
            <Badge className="bg-status-success/10 text-status-success border-0 text-xs sm:text-sm">Đi</Badge>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{stats.di}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">VB đi</p>
        </Card>

        <Card className="p-4 sm:p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-xl">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <Badge className="bg-primary/10 text-primary border-0 text-xs sm:text-sm">Đang xử lý</Badge>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{stats.dangXuLy}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Đang xử lý</p>
        </Card>

        <Card className="p-4 sm:p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 sm:p-3 bg-secondary/10 rounded-xl">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
            </div>
            <Badge className="bg-secondary/10 text-secondary border-0 text-xs sm:text-sm">Hoàn thành</Badge>
          </div>
          <p className="text-2xl sm:text-3xl font-bold">{stats.hoanThanh}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">Hoàn thành</p>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card className="p-3 sm:p-4 md:p-6 border-0 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm theo số ký hiệu, trích yếu, cơ quan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 h-10 sm:h-11 bg-slate-50 text-sm sm:text-base"
            />
          </div>
          <select
            value={filterLoai}
            onChange={(e) => setFilterLoai(e.target.value)}
            className="h-10 sm:h-11 px-3 sm:px-4 border border-input rounded-lg bg-slate-50 text-sm sm:text-base w-full sm:w-auto"
          >
            <option value="all">Tất cả loại</option>
            <option value="Đến">VB Đến</option>
            <option value="Đi">VB Đi</option>
          </select>
          <select
            value={filterTrangThai}
            onChange={(e) => setFilterTrangThai(e.target.value)}
            className="h-10 sm:h-11 px-3 sm:px-4 border border-input rounded-lg bg-slate-50 text-sm sm:text-base w-full sm:w-auto"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Mới">Mới</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Hoàn thành">Hoàn thành</option>
          </select>
          <Button variant="outline" className="h-10 sm:h-11 w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Xuất Excel</span>
            <span className="sm:hidden">Xuất</span>
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="overflow-x-auto -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
          <table className="w-full min-w-max">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold">Số ký hiệu</th>
                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold hidden md:table-cell">Trích yếu</th>
                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold hidden sm:table-cell">Loại VB</th>
                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold hidden lg:table-cell">Cơ quan BH</th>
                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold hidden md:table-cell">Ngày BH</th>
                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-semibold">Trạng thái</th>
                <th className="text-right p-3 sm:p-4 text-xs sm:text-sm font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.MaVanBan} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-secondary flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="font-semibold text-xs sm:text-sm text-primary">{item.SoKyHieu}</span>
                        <p className="text-xs text-muted-foreground md:hidden truncate" title={item.TrichYeu}>{item.TrichYeu.length > 15 ? item.TrichYeu.substring(0, 15) + '...' : item.TrichYeu}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 hidden md:table-cell">
                    <p className="max-w-xs sm:max-w-md truncate text-xs sm:text-sm" title={item.TrichYeu}>{item.TrichYeu.length > 15 ? item.TrichYeu.substring(0, 15) + '...' : item.TrichYeu}</p>
                  </td>
                  <td className="p-3 sm:p-4 hidden sm:table-cell">
                    <Badge className={item.LoaiVanBan === 'Đến' ? 'bg-status-danger/10 text-status-danger border-0 text-xs' : 'bg-status-success/10 text-status-success border-0 text-xs'}>
                      {item.LoaiVB}
                    </Badge>
                  </td>
                  <td className="p-3 sm:p-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                      <span className="max-w-xs truncate">{item.CoQuanBanHanh}</span>
                    </div>
                  </td>
                  <td className="p-3 sm:p-4 hidden md:table-cell text-xs sm:text-sm text-muted-foreground">
                    {formatDate(item.NgayBanHanh)}
                  </td>
                  <td className="p-3 sm:p-4">
                    <Badge 
                      className={
                        item.TrangThai === 'Hoàn thành' 
                          ? 'bg-status-success/10 text-status-success border-0 text-xs sm:text-sm' 
                          : item.TrangThai === 'Đang xử lý'
                          ? 'bg-secondary/10 text-secondary border-0 text-xs sm:text-sm'
                          : 'bg-status-warning/10 text-status-warning border-0 text-xs sm:text-sm'
                      }
                    >
                      {item.TrangThai}
                    </Badge>
                  </td>
                  <td className="p-3 sm:p-4">
                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                        onClick={() => handleView(item)}
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-status-danger hover:text-status-danger"
                        onClick={() => handleDelete(item)}
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="w-[95vw] max-w-sm sm:max-w-2xl md:max-w-3xl h-[85vh] sm:h-auto sm:max-h-[85vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-base sm:text-lg md:text-xl">Chi tiết văn bản</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">Thông tin chi tiết văn bản</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="sm:col-span-2">
                  <Label className="text-xs sm:text-sm text-muted-foreground">Số ký hiệu</Label>
                  <p className="font-semibold text-base sm:text-lg">{selectedItem.SoKyHieu}</p>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs sm:text-sm text-muted-foreground">Trích yếu</Label>
                  <p className="font-medium text-xs sm:text-sm">{selectedItem.TrichYeu}</p>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm text-muted-foreground">Loại văn bản</Label>
                  <Badge className={selectedItem.LoaiVanBan === 'Đến' ? 'bg-status-danger/10 text-status-danger border-0 text-xs' : 'bg-status-success/10 text-status-success border-0 text-xs'}>
                    {selectedItem.LoaiVanBan}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm text-muted-foreground">Loại VB</Label>
                  <p className="font-medium text-xs sm:text-sm">{selectedItem.LoaiVB}</p>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs sm:text-sm text-muted-foreground">Cơ quan ban hành</Label>
                  <p className="font-medium text-xs sm:text-sm">{selectedItem.CoQuanBanHanh}</p>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm text-muted-foreground">Ngày ban hành</Label>
                  <p className="font-medium text-xs sm:text-sm">{formatDate(selectedItem.NgayBanHanh)}</p>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm text-muted-foreground">Ngày đến</Label>
                  <p className="font-medium text-xs sm:text-sm">{formatDate(selectedItem.NgayDen)}</p>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm text-muted-foreground">Trạng thái</Label>
                  <Badge className={
                    selectedItem.TrangThai === 'Hoàn thành' 
                      ? 'bg-status-success/10 text-status-success border-0 text-xs sm:text-sm' 
                      : selectedItem.TrangThai === 'Đang xử lý'
                      ? 'bg-secondary/10 text-secondary border-0 text-xs sm:text-sm'
                      : 'bg-status-warning/10 text-status-warning border-0 text-xs sm:text-sm'
                  }>
                    {selectedItem.TrangThai}
                  </Badge>
                </div>
                {selectedItem.FileDinhKem && (
                  <div className="sm:col-span-2">
                    <Label className="text-xs sm:text-sm text-muted-foreground">File đính kèm</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Paperclip className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                      <a href={selectedItem.FileDinhKem} className="text-primary hover:underline text-xs sm:text-sm">
                        Tải xuống file
                      </a>
                    </div>
                  </div>
                )}
                {selectedItem.GhiChu && (
                  <div className="sm:col-span-2">
                    <Label className="text-xs sm:text-sm text-muted-foreground">Ghi chú</Label>
                    <p className="font-medium text-xs sm:text-sm">{selectedItem.GhiChu}</p>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <Label className="text-xs sm:text-sm text-muted-foreground">Ngày tạo</Label>
                  <p className="font-medium text-xs sm:text-sm">{formatDateTime(selectedItem.NgayTao)}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsViewOpen(false)}>
              Đóng
            </Button>
            <Button className="w-full sm:w-auto" onClick={() => {
              setIsViewOpen(false);
              handleEdit(selectedItem);
            }}>
              <Edit className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="w-[95vw] max-w-sm sm:max-w-2xl md:max-w-3xl h-[85vh] sm:h-auto sm:max-h-[85vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-base sm:text-lg md:text-xl">Chỉnh sửa văn bản</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">Cập nhật thông tin văn bản</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 sm:space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div>
                <Label htmlFor="SoKyHieu">Số ký hiệu <span className="text-status-danger">*</span></Label>
                <Input
                  id="SoKyHieu"
                  value={formData.SoKyHieu || ''}
                  onChange={(e) => setFormData({ ...formData, SoKyHieu: e.target.value })}
                  placeholder="VD: 01/CV-UBND"
                  className="h-10"
                />
              </div>
              <div>
                <Label htmlFor="LoaiVanBan">Loại văn bản</Label>
                <select
                  id="LoaiVanBan"
                  value={formData.LoaiVanBan || 'Đến'}
                  onChange={(e) => setFormData({ ...formData, LoaiVanBan: e.target.value })}
                  className="w-full h-10 px-3 border border-input rounded-md"
                >
                  <option value="Đến">Đến</option>
                  <option value="Đi">Đi</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="TrichYeu">Trích yếu <span className="text-status-danger">*</span></Label>
                <Textarea
                  id="TrichYeu"
                  value={formData.TrichYeu || ''}
                  onChange={(e) => setFormData({ ...formData, TrichYeu: e.target.value })}
                  placeholder="Nhập trích yếu văn bản"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="LoaiVB">Loại VB</Label>
                <select
                  id="LoaiVB"
                  value={formData.LoaiVB || 'Công văn'}
                  onChange={(e) => setFormData({ ...formData, LoaiVB: e.target.value })}
                  className="w-full h-10 px-3 border border-input rounded-md"
                >
                  <option value="Công văn">Công văn</option>
                  <option value="Quyết định">Quyết định</option>
                  <option value="Báo cáo">Báo cáo</option>
                  <option value="Thông báo">Thông báo</option>
                  <option value="Tờ trình">Tờ trình</option>
                </select>
              </div>
              <div>
                <Label htmlFor="TrangThai">Trạng thái</Label>
                <select
                  id="TrangThai"
                  value={formData.TrangThai || 'Mới'}
                  onChange={(e) => setFormData({ ...formData, TrangThai: e.target.value })}
                  className="w-full h-10 px-3 border border-input rounded-md"
                >
                  <option value="Mới">Mới</option>
                  <option value="Đang xử lý">Đang xử lý</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                </select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="CoQuanBanHanh">Cơ quan ban hành</Label>
                <Input
                  id="CoQuanBanHanh"
                  value={formData.CoQuanBanHanh || ''}
                  onChange={(e) => setFormData({ ...formData, CoQuanBanHanh: e.target.value })}
                  placeholder="Nhập tên cơ quan"
                />
              </div>
              <div>
                <Label htmlFor="NgayBanHanh">Ngày ban hành</Label>
                <Input
                  id="NgayBanHanh"
                  type="date"
                  value={formData.NgayBanHanh || ''}
                  onChange={(e) => setFormData({ ...formData, NgayBanHanh: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="NgayDen">Ngày đến</Label>
                <Input
                  id="NgayDen"
                  type="date"
                  value={formData.NgayDen || ''}
                  onChange={(e) => setFormData({ ...formData, NgayDen: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="FileDinhKem">File đính kèm</Label>
                <Input
                  id="FileDinhKem"
                  value={formData.FileDinhKem || ''}
                  onChange={(e) => setFormData({ ...formData, FileDinhKem: e.target.value })}
                  placeholder="Đường dẫn file"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="GhiChu">Ghi chú</Label>
                <Textarea
                  id="GhiChu"
                  value={formData.GhiChu || ''}
                  onChange={(e) => setFormData({ ...formData, GhiChu: e.target.value })}
                  placeholder="Nhập ghi chú (nếu có)"
                  rows={2}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave}>
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="w-[95vw] max-w-sm sm:max-w-2xl md:max-w-3xl h-[85vh] sm:h-auto sm:max-h-[85vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-base sm:text-lg md:text-xl">Thêm văn bản mới</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">Nhập thông tin văn bản mới</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 sm:space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div>
                <Label htmlFor="add_SoKyHieu">Số ký hiệu <span className="text-red-500">*</span></Label>
                <Input
                  id="add_SoKyHieu"
                  value={formData.SoKyHieu || ''}
                  onChange={(e) => setFormData({ ...formData, SoKyHieu: e.target.value })}
                  placeholder="VD: 01/CV-UBND"
                />
              </div>
              <div>
                <Label htmlFor="add_LoaiVanBan">Loại văn bản</Label>
                <select
                  id="add_LoaiVanBan"
                  value={formData.LoaiVanBan || 'Đến'}
                  onChange={(e) => setFormData({ ...formData, LoaiVanBan: e.target.value })}
                  className="w-full h-10 px-3 border border-input rounded-md"
                >
                  <option value="Đến">Đến</option>
                  <option value="Đi">Đi</option>
                </select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="add_TrichYeu">Trích yếu <span className="text-red-500">*</span></Label>
                <Textarea
                  id="add_TrichYeu"
                  value={formData.TrichYeu || ''}
                  onChange={(e) => setFormData({ ...formData, TrichYeu: e.target.value })}
                  placeholder="Nhập trích yếu văn bản"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="add_LoaiVB">Loại VB</Label>
                <select
                  id="add_LoaiVB"
                  value={formData.LoaiVB || 'Công văn'}
                  onChange={(e) => setFormData({ ...formData, LoaiVB: e.target.value })}
                  className="w-full h-10 px-3 border border-input rounded-md"
                >
                  <option value="Công văn">Công văn</option>
                  <option value="Quyết định">Quyết định</option>
                  <option value="Báo cáo">Báo cáo</option>
                  <option value="Thông báo">Thông báo</option>
                  <option value="Tờ trình">Tờ trình</option>
                </select>
              </div>
              <div>
                <Label htmlFor="add_TrangThai">Trạng thái</Label>
                <select
                  id="add_TrangThai"
                  value={formData.TrangThai || 'Mới'}
                  onChange={(e) => setFormData({ ...formData, TrangThai: e.target.value })}
                  className="w-full h-10 px-3 border border-input rounded-md"
                >
                  <option value="Mới">Mới</option>
                  <option value="Đang xử lý">Đang xử lý</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                </select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="add_CoQuanBanHanh">Cơ quan ban hành</Label>
                <Input
                  id="add_CoQuanBanHanh"
                  value={formData.CoQuanBanHanh || ''}
                  onChange={(e) => setFormData({ ...formData, CoQuanBanHanh: e.target.value })}
                  placeholder="Nhập tên cơ quan"
                />
              </div>
              <div>
                <Label htmlFor="add_NgayBanHanh">Ngày ban hành</Label>
                <Input
                  id="add_NgayBanHanh"
                  type="date"
                  value={formData.NgayBanHanh || ''}
                  onChange={(e) => setFormData({ ...formData, NgayBanHanh: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="add_NgayDen">Ngày đến</Label>
                <Input
                  id="add_NgayDen"
                  type="date"
                  value={formData.NgayDen || ''}
                  onChange={(e) => setFormData({ ...formData, NgayDen: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="add_FileDinhKem">File đính kèm</Label>
                <Input
                  id="add_FileDinhKem"
                  value={formData.FileDinhKem || ''}
                  onChange={(e) => setFormData({ ...formData, FileDinhKem: e.target.value })}
                  placeholder="Đường dẫn file"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="add_GhiChu">Ghi chú</Label>
                <Textarea
                  id="add_GhiChu"
                  value={formData.GhiChu || ''}
                  onChange={(e) => setFormData({ ...formData, GhiChu: e.target.value })}
                  placeholder="Nhập ghi chú (nếu có)"
                  rows={2}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm mới
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
