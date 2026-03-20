'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Search,
  Plus,
  Download,
  User,
  Calendar,
  Users,
  MapPin,
  Eye,
  Edit,
  X,
} from 'lucide-react';

const modalStyles = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .modal-backdrop {
    animation: fadeIn 0.2s ease-in-out;
  }

  .modal-content {
    animation: slideIn 0.3s ease-out;
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = modalStyles;
  document.head.appendChild(style);
}

interface HoKhau {
  id: string;
  soHoKhau: string;
  chuHo: string;
  diaChi: string;
  soThanhVien: number;
  loai: 'thuong-tru' | 'tam-tru' | 'tam-vang';
  ngayDangKy: string;
  trangThai: 'active' | 'pending' | 'inactive';
}

const mockData: HoKhau[] = [
  {
    id: 'HK001',
    soHoKhau: 'HK-2024-001',
    chuHo: 'Nguyễn Văn A',
    diaChi: 'Số 10, Đường ABC, Phường 1',
    soThanhVien: 4,
    loai: 'thuong-tru',
    ngayDangKy: '2024-01-10',
    trangThai: 'active',
  },
  {
    id: 'HK002',
    soHoKhau: 'TT-2024-015',
    chuHo: 'Trần Thị B',
    diaChi: 'Số 25, Đường XYZ, Phường 2',
    soThanhVien: 2,
    loai: 'tam-tru',
    ngayDangKy: '2024-01-15',
    trangThai: 'active',
  },
];

const loaiLabels = {
  'thuong-tru': { label: 'Thường trú', color: 'bg-green-500/10 text-green-700' },
  'tam-tru': { label: 'Tạm trú', color: 'bg-blue-500/10 text-blue-700' },
  'tam-vang': { label: 'Tạm vắng', color: 'bg-amber-500/10 text-amber-700' },
};

interface FormData {
  soHoKhau: string;
  chuHo: string;
  cccd: string;
  ngaySinh: string;
  gioiTinh: string;
  soDienThoai: string;
  diaChi: string;
  soThanhVien: number;
  loai: 'thuong-tru' | 'tam-tru' | 'tam-vang';
  ngayDangKy: string;
  ghiChu: string;
}

export default function HoKhauPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'view' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<HoKhau | null>(null);
  const [formData, setFormData] = useState<FormData>({
    soHoKhau: '',
    chuHo: '',
    cccd: '',
    ngaySinh: '',
    gioiTinh: 'Nam',
    soDienThoai: '',
    diaChi: '',
    soThanhVien: 1,
    loai: 'thuong-tru',
    ngayDangKy: new Date().toISOString().split('T')[0],
    ghiChu: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'soThanhVien' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dữ liệu đăng ký:', formData);
    // TODO: Gửi dữ liệu lên server
    setShowModal(false);
    // Reset form
    setFormData({
      soHoKhau: '',
      chuHo: '',
      cccd: '',
      ngaySinh: '',
      gioiTinh: 'Nam',
      soDienThoai: '',
      diaChi: '',
      soThanhVien: 1,
      loai: 'thuong-tru',
      ngayDangKy: new Date().toISOString().split('T')[0],
      ghiChu: '',
    });
  };

  const handleViewItem = (item: HoKhau) => {
    setSelectedItem(item);
    setModalType('view');
    setShowDetailModal(true);
  };

  const handleEditItem = (item: HoKhau) => {
    setSelectedItem(item);
    setModalType('edit');
    setFormData({
      soHoKhau: item.soHoKhau,
      chuHo: item.chuHo,
      cccd: '',
      ngaySinh: '',
      gioiTinh: 'Nam',
      soDienThoai: '',
      diaChi: item.diaChi,
      soThanhVien: item.soThanhVien,
      loai: item.loai,
      ngayDangKy: item.ngayDangKy,
      ghiChu: '',
    });
    setShowDetailModal(true);
  };

  const handleDetailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Cập nhật hộ khẩu:', formData);
    // TODO: Gửi dữ liệu lên server
    setShowDetailModal(false);
    setSelectedItem(null);
  };

  const stats = {
    total: 245,
    thuongTru: 198,
    tamTru: 35,
    tamVang: 12,
  };

  return (
    <>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-accent to-primary p-8 text-white">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Home className="w-6 h-6" />
                  </div>
                  <h1 className="text-3xl font-bold">Quản lý Hộ khẩu - Cư trú</h1>
                </div>
                <p className="text-white/90">Đăng ký thường trú, tạm trú, tạm vắng</p>
              </div>
              <Button className="bg-white text-indigo-600 hover:bg-white/90" onClick={() => setShowModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Đăng ký mới
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 border-0 shadow-lg hover-lift">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-indigo-500/10 rounded-xl">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <p className="text-3xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Tổng hộ khẩu</p>
          </Card>

          <Card className="p-6 border-0 shadow-lg hover-lift">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <Home className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold">{stats.thuongTru}</p>
            <p className="text-sm text-muted-foreground">Thường trú</p>
          </Card>

          <Card className="p-6 border-0 shadow-lg hover-lift">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold">{stats.tamTru}</p>
            <p className="text-sm text-muted-foreground">Tạm trú</p>
          </Card>

          <Card className="p-6 border-0 shadow-lg hover-lift">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <p className="text-3xl font-bold">{stats.tamVang}</p>
            <p className="text-sm text-muted-foreground">Tạm vắng</p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 border-0 shadow-lg">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm theo số hộ khẩu, chủ hộ, địa chỉ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-slate-50"
              />
            </div>
            <Button variant="outline" className="h-11">
              <Download className="w-4 h-4 mr-2" />
              Xuất Excel
            </Button>
          </div>
        </Card>

        {/* Table */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold">Số hộ khẩu</th>
                  <th className="text-left p-4 font-semibold">Chủ hộ</th>
                  <th className="text-left p-4 font-semibold">Địa chỉ</th>
                  <th className="text-left p-4 font-semibold">Số thành viên</th>
                  <th className="text-left p-4 font-semibold">Loại</th>
                  <th className="text-left p-4 font-semibold">Ngày đăng ký</th>
                  <th className="text-right p-4 font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {mockData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <span className="font-semibold text-primary">{item.soHoKhau}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {item.chuHo}
                      </div>
                    </td>
                    <td className="p-4 text-sm">{item.diaChi}</td>
                    <td className="p-4">
                      <Badge className="bg-indigo-500/10 text-indigo-700 border-0">
                        <Users className="w-3 h-3 mr-1" />
                        {item.soThanhVien} người
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={`${loaiLabels[item.loai].color} border-0`}>
                        {loaiLabels[item.loai].label}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{item.ngayDangKy}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-blue-500/10 hover:text-blue-600"
                          onClick={() => handleViewItem(item)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-amber-500/10 hover:text-amber-600"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modal Đăng ký hộ khẩu */}
      {showModal && (
        <div className="modal-backdrop fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div 
            className="modal-content w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Full Width */}
            <div className="bg-gradient-to-r from-primary to-accent text-white p-6 flex items-center justify-between shrink-0">
              <h2 className="text-2xl font-bold">Đăng ký hộ khẩu mới</h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form - Scrollable */}
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-8 space-y-6">
              {/* Thông tin chủ hộ */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-900">Thông tin chủ hộ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Họ tên chủ hộ *</label>
                    <Input
                      type="text"
                      name="chuHo"
                      value={formData.chuHo}
                      onChange={handleInputChange}
                      placeholder="Nhập tên chủ hộ"
                      className="h-11"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Số CCCD/CMND *</label>
                    <Input
                      type="text"
                      name="cccd"
                      value={formData.cccd}
                      onChange={handleInputChange}
                      placeholder="Nhập số CCCD"
                      className="h-11"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Ngày sinh *</label>
                    <Input
                      type="date"
                      name="ngaySinh"
                      value={formData.ngaySinh}
                      onChange={handleInputChange}
                      className="h-11"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Giới tính *</label>
                    <select
                      name="gioiTinh"
                      value={formData.gioiTinh}
                      onChange={handleInputChange}
                      className="w-full h-11 px-3 border border-slate-200 rounded-lg bg-white"
                      required
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Số điện thoại</label>
                    <Input
                      type="tel"
                      name="soDienThoai"
                      value={formData.soDienThoai}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại"
                      className="h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Thông tin hộ khẩu */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-900">Thông tin hộ khẩu</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Địa chỉ *</label>
                    <Input
                      type="text"
                      name="diaChi"
                      value={formData.diaChi}
                      onChange={handleInputChange}
                      placeholder="Nhập địa chỉ"
                      className="h-11"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Số thành viên *</label>
                    <Input
                      type="number"
                      name="soThanhVien"
                      value={formData.soThanhVien}
                      onChange={handleInputChange}
                      min="1"
                      className="h-11"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Loại hộ khẩu *</label>
                    <select
                      name="loai"
                      value={formData.loai}
                      onChange={handleInputChange}
                      className="w-full h-11 px-3 border border-slate-200 rounded-lg bg-white"
                      required
                    >
                      <option value="thuong-tru">Thường trú</option>
                      <option value="tam-tru">Tạm trú</option>
                      <option value="tam-vang">Tạm vắng</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Ngày đăng ký *</label>
                    <Input
                      type="date"
                      name="ngayDangKy"
                      value={formData.ngayDangKy}
                      onChange={handleInputChange}
                      className="h-11"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Ghi chú */}
              <div>
                <label className="block text-sm font-medium mb-2">Ghi chú</label>
                <textarea
                  name="ghiChu"
                  value={formData.ghiChu}
                  onChange={handleInputChange}
                  placeholder="Nhập ghi chú nếu có"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="h-11"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="h-11 bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Đăng ký
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xem chi tiết / Chỉnh sửa */}
      {showDetailModal && selectedItem && (
        <div className="modal-backdrop fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div 
            className="modal-content w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6 flex items-center justify-between shrink-0">
              <h2 className="text-2xl font-bold">
                {modalType === 'view' ? '📋 Xem chi tiết hộ khẩu' : '✏️ Chỉnh sửa hộ khẩu'}
              </h2>
              <button 
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedItem(null);
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleDetailSubmit} className="overflow-y-auto flex-1 p-8 space-y-6">
              {/* Thông tin chủ hộ */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-900">Thông tin chủ hộ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Họ tên chủ hộ</label>
                    <Input
                      type="text"
                      name="chuHo"
                      value={formData.chuHo}
                      onChange={handleInputChange}
                      disabled={modalType === 'view'}
                      className="h-11"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Số CCCD/CMND</label>
                    <Input
                      type="text"
                      name="cccd"
                      value={formData.cccd}
                      onChange={handleInputChange}
                      disabled={modalType === 'view'}
                      className="h-11"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Ngày sinh</label>
                    <Input
                      type="date"
                      name="ngaySinh"
                      value={formData.ngaySinh}
                      onChange={handleInputChange}
                      disabled={modalType === 'view'}
                      className="h-11"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Giới tính</label>
                    <select
                      name="gioiTinh"
                      value={formData.gioiTinh}
                      onChange={handleInputChange}
                      disabled={modalType === 'view'}
                      className="w-full h-11 px-3 border border-slate-200 rounded-lg bg-white disabled:bg-slate-100"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Số điện thoại</label>
                    <Input
                      type="tel"
                      name="soDienThoai"
                      value={formData.soDienThoai}
                      onChange={handleInputChange}
                      disabled={modalType === 'view'}
                      className="h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Thông tin hộ khẩu */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-900">Thông tin hộ khẩu</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Số hộ khẩu</label>
                    <Input
                      type="text"
                      name="soHoKhau"
                      value={formData.soHoKhau}
                      disabled={true}
                      className="h-11 bg-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Địa chỉ</label>
                    <Input
                      type="text"
                      name="diaChi"
                      value={formData.diaChi}
                      onChange={handleInputChange}
                      disabled={modalType === 'view'}
                      className="h-11"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Số thành viên</label>
                    <Input
                      type="number"
                      name="soThanhVien"
                      value={formData.soThanhVien}
                      onChange={handleInputChange}
                      disabled={modalType === 'view'}
                      min="1"
                      className="h-11"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Loại hộ khẩu</label>
                    <select
                      name="loai"
                      value={formData.loai}
                      onChange={handleInputChange}
                      disabled={modalType === 'view'}
                      className="w-full h-11 px-3 border border-slate-200 rounded-lg bg-white disabled:bg-slate-100"
                    >
                      <option value="thuong-tru">Thường trú</option>
                      <option value="tam-tru">Tạm trú</option>
                      <option value="tam-vang">Tạm vắng</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Ngày đăng ký</label>
                    <Input
                      type="date"
                      name="ngayDangKy"
                      value={formData.ngayDangKy}
                      onChange={handleInputChange}
                      disabled={modalType === 'view'}
                      className="h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Ghi chú */}
              <div>
                <label className="block text-sm font-medium mb-2">Ghi chú</label>
                <textarea
                  name="ghiChu"
                  value={formData.ghiChu}
                  onChange={handleInputChange}
                  disabled={modalType === 'view'}
                  placeholder="Nhập ghi chú nếu có"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedItem(null);
                  }}
                  className="h-11"
                >
                  {modalType === 'view' ? 'Đóng' : 'Hủy'}
                </Button>
                {modalType === 'edit' && (
                  <Button
                    type="submit"
                    className="h-11 bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Cập nhật
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
