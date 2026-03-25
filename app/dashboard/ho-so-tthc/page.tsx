'use client';

import { useState, useEffect } from 'react';
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
  FileText,
  Search,
  Plus,
  Download,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  X,
  Trash2,
  Inbox,
  Printer,
} from 'lucide-react';
import { formatDateTime } from '@/lib/mock-data';
import { hoSoTthcApi } from '@/lib/api';

// Extended mock data for TTHC
const mockHoSoTTHC = [
  {
    MaHoSo: 'TTHC-2024-0001',
    TenThuTuc: 'Đăng ký khai sinh',
    MaCongDan: 1,
    TenCongDan: 'Nguyễn Văn An',
    CCCD: '001234567890',
    SoDienThoai: '0901234567',
    Email: 'nguyenvanan@gmail.com',
    DiaChiLienHe: 'Số 123, Phường 1',
    LoaiThuTuc: 'Hộ tịch',
    LinhVuc: 'Tư pháp',
    MaTrangThai: 'DANG_XU_LY',
    TrangThai: 'Đang xử lý',
    NgayTiepNhan: '2024-01-15 08:30:00',
    HanXuLy: '2024-01-18 17:00:00',
    NgayHenTra: '2024-01-18 17:00:00',
    NgayHoanThanh: null,
    CanBoTiepNhan: 'Trần Văn Bình',
    CanBoXuLy: 'Nguyễn Thị Dung',
    KetQuaXuLy: '',
    PhiLePhi: 0,
    GhiChu: '',
    SoBienNhan: 'BN-2024-0001',
  },
  {
    MaHoSo: 'TTHC-2024-0002',
    TenThuTuc: 'Cấp bản sao trích lục hộ tịch',
    MaCongDan: 2,
    TenCongDan: 'Trần Thị Bình',
    CCCD: '001234567891',
    SoDienThoai: '0912345678',
    Email: 'tranthibinh@gmail.com',
    DiaChiLienHe: 'Số 45, Phường 2',
    LoaiThuTuc: 'Hộ tịch',
    LinhVuc: 'Tư pháp',
    MaTrangThai: 'CHO_DUYET',
    TrangThai: 'Chờ duyệt',
    NgayTiepNhan: '2024-01-16 09:15:00',
    HanXuLy: '2024-01-19 17:00:00',
    NgayHenTra: '2024-01-19 17:00:00',
    NgayHoanThanh: null,
    CanBoTiepNhan: 'Trần Văn Bình',
    CanBoXuLy: 'Trần Văn Bình',
    KetQuaXuLy: '',
    PhiLePhi: 5000,
    GhiChu: 'Cần bổ sung giấy tờ',
    SoBienNhan: 'BN-2024-0002',
  },
  {
    MaHoSo: 'TTHC-2024-0003',
    TenThuTuc: 'Xác nhận tình trạng hôn nhân',
    MaCongDan: 3,
    TenCongDan: 'Lê Văn Cường',
    CCCD: '001234567892',
    SoDienThoai: '0923456789',
    Email: 'levancuong@gmail.com',
    DiaChiLienHe: 'Số 67, Phường 3',
    LoaiThuTuc: 'Hộ tịch',
    LinhVuc: 'Tư pháp',
    MaTrangThai: 'HOAN_THANH',
    TrangThai: 'Hoàn thành',
    NgayTiepNhan: '2024-01-10 10:00:00',
    HanXuLy: '2024-01-13 17:00:00',
    NgayHenTra: '2024-01-13 17:00:00',
    NgayHoanThanh: '2024-01-12 14:00:00',
    CanBoTiepNhan: 'Nguyễn Thị Dung',
    CanBoXuLy: 'Nguyễn Thị Dung',
    KetQuaXuLy: 'Đã cấp giấy xác nhận',
    PhiLePhi: 10000,
    GhiChu: '',
    SoBienNhan: 'BN-2024-0003',
  },
  {
    MaHoSo: 'TTHC-2024-0004',
    TenThuTuc: 'Đăng ký kết hôn',
    MaCongDan: 4,
    TenCongDan: 'Phạm Văn Đức',
    CCCD: '001234567893',
    SoDienThoai: '0934567890',
    Email: 'phamvanduc@gmail.com',
    DiaChiLienHe: 'Số 89, Phường 1',
    LoaiThuTuc: 'Hộ tịch',
    LinhVuc: 'Tư pháp',
    MaTrangThai: 'QUA_HAN',
    TrangThai: 'Quá hạn',
    NgayTiepNhan: '2024-01-05 08:30:00',
    HanXuLy: '2024-01-08 17:00:00',
    NgayHenTra: '2024-01-08 17:00:00',
    NgayHoanThanh: null,
    CanBoTiepNhan: 'Trần Văn Bình',
    CanBoXuLy: 'Nguyễn Thị Dung',
    KetQuaXuLy: '',
    PhiLePhi: 0,
    GhiChu: 'Chưa hoàn thiện hồ sơ',
    SoBienNhan: 'BN-2024-0004',
  },
  {
    MaHoSo: 'TTHC-2024-0005',
    TenThuTuc: 'Chứng thực bản sao từ bản chính',
    MaCongDan: 5,
    TenCongDan: 'Hoàng Thị Em',
    CCCD: '001234567894',
    SoDienThoai: '0945678901',
    Email: 'hoangthiem@gmail.com',
    DiaChiLienHe: 'Số 12, Phường 2',
    LoaiThuTuc: 'Chứng thực',
    LinhVuc: 'Tư pháp',
    MaTrangThai: 'MOI_TAO',
    TrangThai: 'Mới tiếp nhận',
    NgayTiepNhan: '2024-01-20 14:00:00',
    HanXuLy: '2024-01-20 17:00:00',
    NgayHenTra: '2024-01-20 17:00:00',
    NgayHoanThanh: null,
    CanBoTiepNhan: 'Trần Văn Bình',
    CanBoXuLy: '',
    KetQuaXuLy: '',
    PhiLePhi: 2000,
    GhiChu: '',
    SoBienNhan: 'BN-2024-0005',
  },
];

interface HoSoTTHC {
  MaHoSo: string;
  MaLoaiThuTuc?: number;
  TenThuTuc: string;
  MaCongDan: number;
  TenCongDan: string;
  CCCD: string;
  SoDienThoai: string;
  Email: string;
  DiaChiLienHe: string;
  LoaiThuTuc: string;
  LinhVuc: string;
  MaTrangThai: string;
  TrangThai: string;
  NgayTiepNhan: string;
  HanXuLy: string;
  NgayHenTra: string;
  NgayHoanThanh: string | null;
  CanBoTiepNhan: string;
  CanBoXuLy: string;
  KetQuaXuLy: string;
  PhiLePhi: number;
  GhiChu: string;
  SoBienNhan: string;
}

export default function HoSoTTHCPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [hoSoList, setHoSoList] = useState<HoSoTTHC[]>([]);
  const [filteredData, setFilteredData] = useState<HoSoTTHC[]>([]);
  const [loaiThuTucList, setLoaiThuTucList] = useState<any[]>([]);
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedHoSo, setSelectedHoSo] = useState<HoSoTTHC | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    MaHoSo: '',
    MaLoaiThuTuc: '',
    TenThuTuc: '',
    TenCongDan: '',
    CCCD: '',
    SoDienThoai: '',
    Email: '',
    DiaChiLienHe: '',
    LoaiThuTuc: '',
    LinhVuc: 'Tư pháp',
    MaTrangThai: 'DA_TIEP_NHAN',
    HanXuLy: '',
    CanBoXuLy: '',
    PhiLePhi: 0,
    GhiChu: '',
  });

  const mapStatusToCode = (status: string) => {
    if (status === 'Đã tiếp nhận') return 'DA_TIEP_NHAN';
    if (status === 'Hoàn thành') return 'HOAN_THANH';
    if (status === 'Đang xử lý') return 'DANG_XU_LY';
    if (status === 'Chờ bổ sung') return 'CHO_BO_SUNG';
    if (status === 'Từ chối') return 'TU_CHOI';
    return 'DA_TIEP_NHAN';
  };

  const mapCodeToStatus = (status: string) => {
    if (status === 'DA_TIEP_NHAN') return 'Đã tiếp nhận';
    if (status === 'HOAN_THANH') return 'Hoàn thành';
    if (status === 'DANG_XU_LY') return 'Đang xử lý';
    if (status === 'CHO_BO_SUNG') return 'Chờ bổ sung';
    if (status === 'TU_CHOI') return 'Từ chối';
    return 'Đã tiếp nhận';
  };

  const cleanText = (value: string, maxLength: number) => {
    const normalized = String(value || '').trim();
    if (!normalized) {
      return '';
    }
    return normalized.slice(0, maxLength);
  };

  const mapFromApi = (item: any): HoSoTTHC => {
    const loaiThuTuc = loaiThuTucList.find((l) => l.MaLoaiThuTuc === item.MaLoaiThuTuc);
    const tenThuTuc = item.TenThuTuc || loaiThuTuc?.TenThuTuc || `Thủ tục #${item.MaLoaiThuTuc}`;
    return {
      MaHoSo: item.MaHoSo,
      MaLoaiThuTuc: item.MaLoaiThuTuc,
      TenThuTuc: tenThuTuc,
      MaCongDan: 0,
      TenCongDan: item.NguoiNop || '',
      CCCD: item.CCCD || '',
      SoDienThoai: item.SoDienThoai || '',
      Email: item.Email || '',
      DiaChiLienHe: item.DiaChiLienHe || '',
      LoaiThuTuc: tenThuTuc,
      LinhVuc: item.LinhVuc || 'Tư pháp',
      MaTrangThai: mapStatusToCode(item.TrangThai || ''),
      TrangThai: item.TrangThai || 'Đã tiếp nhận',
      NgayTiepNhan: item.NgayNop || '',
      HanXuLy: item.NgayHenTra || '',
      NgayHenTra: item.NgayHenTra || '',
      NgayHoanThanh: item.NgayHoanThanh || null,
      CanBoTiepNhan: '',
      CanBoXuLy: item.CanBoXuLy ? String(item.CanBoXuLy) : '',
      KetQuaXuLy: item.KetQua || '',
      PhiLePhi: Number(item.PhiLePhi || 0),
      GhiChu: item.GhiChu || '',
      SoBienNhan: item.SoHoSo || item.MaHoSo,
    };
  };

  const loadData = async () => {
    const [hoSoRes, loaiRes] = await Promise.all([
      hoSoTthcApi.getList({ page: 1, limit: 500 }),
      hoSoTthcApi.getLoaiThuTuc(),
    ]);

    const loaiData = loaiRes.success && Array.isArray(loaiRes.data) ? loaiRes.data : [];
    setLoaiThuTucList(loaiData);

    if (hoSoRes.success && Array.isArray(hoSoRes.data)) {
      const mapped = hoSoRes.data.map((item: any) => {
        const loaiThuTuc = loaiData.find((l: any) => l.MaLoaiThuTuc === item.MaLoaiThuTuc);
        const tenThuTuc = item.TenThuTuc || loaiThuTuc?.TenThuTuc || `Thủ tục #${item.MaLoaiThuTuc}`;
        return {
          MaHoSo: item.MaHoSo,
          MaLoaiThuTuc: item.MaLoaiThuTuc,
          TenThuTuc: tenThuTuc,
          MaCongDan: 0,
          TenCongDan: item.NguoiNop || '',
          CCCD: item.CCCD || '',
          SoDienThoai: item.SoDienThoai || '',
          Email: item.Email || '',
          DiaChiLienHe: item.DiaChiLienHe || '',
          LoaiThuTuc: tenThuTuc,
          LinhVuc: item.LinhVuc || 'Tư pháp',
          MaTrangThai: mapStatusToCode(item.TrangThai || ''),
          TrangThai: item.TrangThai || 'Đã tiếp nhận',
          NgayTiepNhan: item.NgayNop || '',
          HanXuLy: item.NgayHenTra || '',
          NgayHenTra: item.NgayHenTra || '',
          NgayHoanThanh: item.NgayHoanThanh || null,
          CanBoTiepNhan: '',
          CanBoXuLy: item.CanBoXuLy ? String(item.CanBoXuLy) : '',
          KetQuaXuLy: item.KetQua || '',
          PhiLePhi: Number(item.PhiLePhi || 0),
          GhiChu: item.GhiChu || '',
          SoBienNhan: item.SoHoSo || item.MaHoSo,
        } as HoSoTTHC;
      });
      setHoSoList(mapped);
      setFilteredData(mapped);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update filter when inputs change
  useEffect(() => {
    const filtered = hoSoList.filter((item) => {
      const matchSearch = 
        item.MaHoSo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.TenThuTuc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.TenCongDan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.CCCD.includes(searchQuery);
      
      const matchStatus = statusFilter === 'all' || item.MaTrangThai === statusFilter;
      const matchCategory = categoryFilter === 'all' || item.LoaiThuTuc === categoryFilter;
      
      return matchSearch && matchStatus && matchCategory;
    });
    setFilteredData(filtered);
  }, [searchQuery, statusFilter, categoryFilter, hoSoList]);

  // Stats
  const stats = {
    total: hoSoList.length,
    pending: hoSoList.filter((h) => h.MaTrangThai === 'DA_TIEP_NHAN' || h.MaTrangThai === 'CHO_BO_SUNG').length,
    processing: hoSoList.filter((h) => h.MaTrangThai === 'DANG_XU_LY').length,
    completed: hoSoList.filter((h) => h.MaTrangThai === 'HOAN_THANH').length,
    overdue: hoSoList.filter((h) => h.MaTrangThai === 'TU_CHOI').length,
  };

  // Handlers
  const handleView = (hoSo: HoSoTTHC) => {
    setSelectedHoSo(hoSo);
    setViewDialogOpen(true);
  };

  const handleEdit = (hoSo: HoSoTTHC) => {
    setSelectedHoSo(hoSo);
    setFormData({
      MaHoSo: hoSo.MaHoSo,
      MaLoaiThuTuc: hoSo.MaLoaiThuTuc ? String(hoSo.MaLoaiThuTuc) : '',
      TenThuTuc: hoSo.TenThuTuc,
      TenCongDan: hoSo.TenCongDan,
      CCCD: hoSo.CCCD,
      SoDienThoai: hoSo.SoDienThoai,
      Email: hoSo.Email,
      DiaChiLienHe: hoSo.DiaChiLienHe,
      LoaiThuTuc: hoSo.LoaiThuTuc,
      LinhVuc: hoSo.LinhVuc,
      MaTrangThai: hoSo.MaTrangThai,
      HanXuLy: hoSo.HanXuLy.split(' ')[0],
      CanBoXuLy: hoSo.CanBoXuLy,
      PhiLePhi: hoSo.PhiLePhi,
      GhiChu: hoSo.GhiChu,
    });
    setEditDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedHoSo(null);
    const newMaHoSo = `TTHC-${new Date().getFullYear()}-${String(hoSoList.length + 1).padStart(4, '0')}`;
    setFormData({
      MaHoSo: newMaHoSo,
      MaLoaiThuTuc: loaiThuTucList?.[0]?.MaLoaiThuTuc ? String(loaiThuTucList[0].MaLoaiThuTuc) : '',
      TenThuTuc: '',
      TenCongDan: '',
      CCCD: '',
      SoDienThoai: '',
      Email: '',
      DiaChiLienHe: '',
      LoaiThuTuc: '',
      LinhVuc: 'Tư pháp',
      MaTrangThai: 'DA_TIEP_NHAN',
      HanXuLy: '',
      CanBoXuLy: '',
      PhiLePhi: 0,
      GhiChu: '',
    });
    setAddDialogOpen(true);
  };

  const handleSave = async () => {
    const tenThuTuc = cleanText(formData.TenThuTuc || formData.LoaiThuTuc, 200);
    const tenCongDan = cleanText(formData.TenCongDan, 150);
    const cccd = cleanText(formData.CCCD, 20);
    const soDienThoai = cleanText(formData.SoDienThoai, 20);
    const email = cleanText(formData.Email, 100);
    const diaChiLienHe = cleanText(formData.DiaChiLienHe, 255);
    const linhVuc = cleanText(formData.LinhVuc, 100);

    if (!tenThuTuc) {
      alert('Vui lòng nhập tên thủ tục.');
      return;
    }

    if (!tenCongDan) {
      alert('Vui lòng nhập tên công dân.');
      return;
    }

    if (formData.CCCD.trim().length > 20) {
      alert('CCCD tối đa 20 ký tự.');
      return;
    }

    if (formData.SoDienThoai.trim().length > 20) {
      alert('Số điện thoại tối đa 20 ký tự.');
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Email không đúng định dạng.');
      return;
    }

    const selectedLoai = loaiThuTucList.find((l) => String(l.MaLoaiThuTuc) === String(formData.MaLoaiThuTuc));
    const matchedLoai = loaiThuTucList.find((l) => l.TenThuTuc === formData.LoaiThuTuc || l.TenThuTuc === formData.TenThuTuc);
    const maLoaiThuTuc = selectedLoai?.MaLoaiThuTuc || matchedLoai?.MaLoaiThuTuc || loaiThuTucList?.[0]?.MaLoaiThuTuc || 1;

    const payload = {
      MaHoSo: formData.MaHoSo,
      SoHoSo: formData.MaHoSo,
      MaLoaiThuTuc: maLoaiThuTuc,
      TenThuTuc: tenThuTuc || null,
      NguoiNop: tenCongDan,
      CCCD: cccd || null,
      SoDienThoai: soDienThoai || null,
      Email: email || null,
      DiaChiLienHe: diaChiLienHe || null,
      LinhVuc: linhVuc || null,
      NgayNop: new Date().toISOString().split('T')[0],
      NgayHenTra: formData.HanXuLy ? String(formData.HanXuLy).split('T')[0] : null,
      TrangThai: mapCodeToStatus(formData.MaTrangThai),
      CanBoXuLy: formData.CanBoXuLy ? Number(formData.CanBoXuLy) : null,
      PhiLePhi: Number(formData.PhiLePhi || 0),
      KetQua: formData.KetQuaXuLy || '',
      GhiChu: formData.GhiChu || '',
    };

    try {
      if (editDialogOpen && selectedHoSo) {
        const result = await hoSoTthcApi.update(selectedHoSo.MaHoSo, payload);
        if (!result?.success) {
          throw new Error(result?.message || 'Không thể cập nhật hồ sơ TTHC');
        }
        setEditDialogOpen(false);
      } else if (addDialogOpen) {
        const result = await hoSoTthcApi.create(payload);
        if (!result?.success) {
          throw new Error(result?.message || 'Không thể tạo hồ sơ TTHC');
        }
        setAddDialogOpen(false);
      }

      await loadData();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Lưu hồ sơ TTHC thất bại');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'HOAN_THANH':
        return <Badge className="bg-green-500/10 text-green-700 border-0"><CheckCircle2 className="w-3 h-3 mr-1" />Hoàn thành</Badge>;
      case 'DANG_XU_LY':
        return <Badge className="bg-blue-500/10 text-blue-700 border-0"><Clock className="w-3 h-3 mr-1" />Đang xử lý</Badge>;
      case 'CHO_BO_SUNG':
        return <Badge className="bg-yellow-500/10 text-yellow-700 border-0"><Clock className="w-3 h-3 mr-1" />Chờ bổ sung</Badge>;
      case 'TU_CHOI':
        return <Badge className="bg-red-500/10 text-red-700 border-0"><AlertCircle className="w-3 h-3 mr-1" />Từ chối</Badge>;
      default:
        return <Badge className="bg-gray-500/10 text-gray-700 border-0"><Inbox className="w-3 h-3 mr-1" />Đã tiếp nhận</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-3 sm:px-4 lg:px-5 py-3 sm:py-4">
      <div className="w-full space-y-3 sm:space-y-4">
        
        {/* Header with Stats */}
        <div className="bg-gradient-to-r from-red-600 via-purple-600 to-blue-900 rounded-2xl p-4 sm:p-5 xl:p-6 text-white">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl xl:text-4xl font-bold mb-2">Hồ sơ Thủ tục Hành chính</h1>
            <p className="text-red-100">Tiếp nhận, xử lý và theo dõi hồ sơ thủ tục hành chính</p>
          </div>

          {/* Stats Cards in Header */}
          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-5 gap-4">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-white/70 text-sm font-semibold mb-3">TỔNG HỒ SƠ</p>
                  <p className="text-4xl font-bold text-white">{stats.total}</p>
                </div>
                <User className="w-6 h-6 text-white/50" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-white/70 text-sm font-semibold mb-3">CHỜ XỬ LÝ</p>
                  <p className="text-4xl font-bold text-white">{stats.pending}</p>
                </div>
                <AlertCircle className="w-6 h-6 text-white/50" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-white/70 text-sm font-semibold mb-3">ĐANG XỬ LÝ</p>
                  <p className="text-4xl font-bold text-white">{stats.processing}</p>
                </div>
                <Clock className="w-6 h-6 text-white/50" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-white/70 text-sm font-semibold mb-3">HOÀN THÀNH</p>
                  <p className="text-4xl font-bold text-white">{stats.completed}</p>
                </div>
                <CheckCircle2 className="w-6 h-6 text-white/50" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-white/70 text-sm font-semibold mb-3">QUÁ HẠN</p>
                  <p className="text-4xl font-bold text-white">{stats.overdue}</p>
                </div>
                <AlertCircle className="w-6 h-6 text-white/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <Card className="p-3 bg-white">
          <div className="space-y-2">
            {/* Search and Filters */}
            <div className="flex flex-col 2xl:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2 w-3 h-3 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm mã, tên thủ tục, công dân..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 bg-slate-50 text-sm py-1 h-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="2xl:w-48 bg-slate-50 text-sm h-8 py-1">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="DA_TIEP_NHAN">Đã tiếp nhận</SelectItem>
                  <SelectItem value="DANG_XU_LY">Đang xử lý</SelectItem>
                  <SelectItem value="CHO_BO_SUNG">Chờ bổ sung</SelectItem>
                  <SelectItem value="HOAN_THANH">Hoàn thành</SelectItem>
                  <SelectItem value="TU_CHOI">Từ chối</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="2xl:w-48 bg-slate-50 text-sm h-8 py-1">
                  <SelectValue placeholder="Loại thủ tục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  {loaiThuTucList.map((loai: any) => (
                    <SelectItem key={loai.MaLoaiThuTuc} value={loai.TenThuTuc}>{loai.TenThuTuc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="gap-2 text-sm h-8 py-1">
                <Plus className="w-3 h-3" />
                Tiếp nhận hồ sơ
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  const csvContent = [
                    ['Mã HS', 'Số biên nhận', 'Tên thủ tục', 'Công dân', 'CCCD', 'Loại', 'Ngày tiếp nhận', 'Hạn xử lý'],
                    ...filteredData.map(hs => [
                      hs.MaHoSo,
                      hs.SoBienNhan,
                      hs.TenThuTuc,
                      hs.TenCongDan,
                      hs.CCCD,
                      hs.LoaiThuTuc,
                      hs.NgayTiepNhan,
                      hs.HanXuLy
                    ])
                  ].map(row => row.join(',')).join('\n');

                  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(blob);
                  link.download = `ho-so-tthc-${new Date().toISOString().split('T')[0]}.csv`;
                  link.click();
                }}
                className="gap-2 text-sm h-8 py-1"
              >
                <Download className="w-3 h-3" />
                Xuất Excel
              </Button>
            </div>
          </div>
        </Card>

        {/* Table with Horizontal Scroll */}
        <Card className="bg-white overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="min-w-[1280px] w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="text-left px-3  font-semibold text-xs text-slate-500 whitespace-nowrap">Mã hồ sơ</th>
                  <th className="text-left px-3  font-semibold text-xs text-slate-500 whitespace-nowrap">Số biên nhận</th>
                  <th className="text-left px-3  font-semibold text-xs text-slate-500 whitespace-nowrap">Tên thủ tục</th>
                  <th className="text-left px-3  font-semibold text-xs text-slate-500 whitespace-nowrap">Công dân</th>
                  <th className="text-left px-3  font-semibold text-xs text-slate-500 whitespace-nowrap">CCCD</th>
                  <th className="text-left px-3  font-semibold text-xs text-slate-500 whitespace-nowrap">Loại</th>
                  <th className="text-left px-3  font-semibold text-xs text-slate-500 whitespace-nowrap">Ngày tiếp nhận</th>
                  <th className="text-left px-3  font-semibold text-xs text-slate-500 whitespace-nowrap">Hạn xử lý</th>
                  <th className="text-left px-3  font-semibold text-xs text-slate-500 whitespace-nowrap">Phí/Lệ phí</th>
                  <th className="text-left px-3  font-semibold text-xs text-slate-500 whitespace-nowrap">Trạng thái</th>
                  <th className="text-right px-3  font-semibold text-xs text-slate-500 whitespace-nowrap sticky right-0 bg-slate-100">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((hoSo) => (
                    <tr key={hoSo.MaHoSo} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                      <td className="px-1 py-0.5 text-xs text-primary font-semibold">{hoSo.MaHoSo}</td>
                      <td className="px-1 py-0.5 text-xs text-slate-600">{hoSo.SoBienNhan}</td>
                      <td className="px-1 py-0.5 text-xs text-slate-600 max-w-xs truncate" title={hoSo.TenThuTuc}>{hoSo.TenThuTuc}</td>
                      <td className="px-1 py-0.5 text-xs text-slate-600">{hoSo.TenCongDan}</td>
                      <td className="px-1 py-0.5 text-xs text-slate-600 font-mono">{hoSo.CCCD}</td>
                      <td className="px-1 py-0.5 text-xs"><Badge variant="outline" className="text-xs py-0.5">{hoSo.LoaiThuTuc}</Badge></td>
                      <td className="px-1 py-0.5 text-xs text-slate-600">{formatDateTime(hoSo.NgayTiepNhan)}</td>
                      <td className="px-1 py-0.5 text-xs text-slate-600">{formatDateTime(hoSo.HanXuLy)}</td>
                      <td className="px-1 py-0.5 text-xs text-slate-600">{hoSo.PhiLePhi > 0 ? hoSo.PhiLePhi.toLocaleString('vi-VN') + ' ₫' : 'Miễn phí'}</td>
                      <td className="px-1 py-0.5 text-xs">{getStatusBadge(hoSo.MaTrangThai)}</td>
                      <td className="px-1 py-0.5 sticky right-0 bg-white flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleView(hoSo)}
                          title="Xem chi tiết"
                          className="h-6 w-6 p-0 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(hoSo)}
                          title="Chỉnh sửa"
                          className="h-6 w-6 p-0 hover:bg-orange-50 hover:text-orange-600"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={async () => {
                            if (window.confirm(`Bạn có chắc chắn muốn xóa hồ sơ ${hoSo.MaHoSo}?`)) {
                              const result = await hoSoTthcApi.delete(hoSo.MaHoSo);
                              if (!result?.success) {
                                alert(result?.message || 'Không thể xóa hồ sơ TTHC');
                                return;
                              }
                              await loadData();
                            }
                          }}
                          title="Xóa"
                          className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="p-8 text-center text-slate-500">
                      <Inbox className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>Không tìm thấy hồ sơ phù hợp</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto text-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Eye className="w-4 h-4" />
              Chi tiết hồ sơ
            </DialogTitle>
            <DialogDescription className="text-xs">
              {selectedHoSo?.MaHoSo} | {selectedHoSo?.SoBienNhan}
            </DialogDescription>
          </DialogHeader>
          {selectedHoSo && (
            <div className="grid grid-cols-2 gap-2 py-2">
              <div>
                <Label className="text-xs text-slate-500">Mã hồ sơ</Label>
                <p className="font-medium text-sm">{selectedHoSo.MaHoSo}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Số biên nhận</Label>
                <p className="font-medium">{selectedHoSo.SoBienNhan}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-xs text-slate-500">Tên thủ tục</Label>
                <p className="font-medium">{selectedHoSo.TenThuTuc}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Họ và tên</Label>
                <p className="font-medium">{selectedHoSo.TenCongDan}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">CCCD</Label>
                <p className="font-medium font-mono">{selectedHoSo.CCCD}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Số điện thoại</Label>
                <p className="font-medium">{selectedHoSo.SoDienThoai}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Email</Label>
                <p className="font-medium">{selectedHoSo.Email}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-xs text-slate-500">Địa chỉ</Label>
                <p className="font-medium">{selectedHoSo.DiaChiLienHe}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Loại thủ tục</Label>
                <p className="font-medium">{selectedHoSo.LoaiThuTuc}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Lĩnh vực</Label>
                <p className="font-medium">{selectedHoSo.LinhVuc}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Ngày tiếp nhận</Label>
                <p className="font-medium">{formatDateTime(selectedHoSo.NgayTiepNhan)}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Hạn xử lý</Label>
                <p className="font-medium">{formatDateTime(selectedHoSo.HanXuLy)}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Cán bộ xử lý</Label>
                <p className="font-medium">{selectedHoSo.CanBoXuLy || 'Chưa phân công'}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-500">Trạng thái</Label>
                <div className="mt-1">{getStatusBadge(selectedHoSo.MaTrangThai)}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto text-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Edit className="w-4 h-4" />
              Cập nhật hồ sơ
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 py-2">
            <div>
              <Label>Tên thủ tục *</Label>
              <Input value={formData.TenThuTuc} onChange={(e) => setFormData({...formData, TenThuTuc: e.target.value})} />
            </div>
            <div>
              <Label>Loại thủ tục *</Label>
              <Select
                value={formData.MaLoaiThuTuc}
                onValueChange={(v) => {
                  const selected = loaiThuTucList.find((l: any) => String(l.MaLoaiThuTuc) === v);
                  setFormData({
                    ...formData,
                    MaLoaiThuTuc: v,
                    LoaiThuTuc: selected?.TenThuTuc || '',
                    TenThuTuc: selected?.TenThuTuc || formData.TenThuTuc,
                    LinhVuc: selected?.LinhVuc || formData.LinhVuc,
                    PhiLePhi: Number(selected?.PhiDichVu ?? formData.PhiLePhi),
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {loaiThuTucList.map((loai: any) => (
                    <SelectItem key={loai.MaLoaiThuTuc} value={String(loai.MaLoaiThuTuc)}>
                      {loai.TenThuTuc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tên công dân *</Label>
              <Input value={formData.TenCongDan} onChange={(e) => setFormData({...formData, TenCongDan: e.target.value})} />
            </div>
            <div>
              <Label>CCCD *</Label>
              <Input value={formData.CCCD} onChange={(e) => setFormData({...formData, CCCD: e.target.value})} />
            </div>
            <div>
              <Label>Số điện thoại</Label>
              <Input value={formData.SoDienThoai} onChange={(e) => setFormData({...formData, SoDienThoai: e.target.value})} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={formData.Email} onChange={(e) => setFormData({...formData, Email: e.target.value})} />
            </div>
            <div className="col-span-2">
              <Label>Địa chỉ liên hệ</Label>
              <Input value={formData.DiaChiLienHe} onChange={(e) => setFormData({...formData, DiaChiLienHe: e.target.value})} />
            </div>
            <div>
              <Label>Hạn xử lý</Label>
              <Input type="datetime-local" value={formData.HanXuLy} onChange={(e) => setFormData({...formData, HanXuLy: e.target.value})} />
            </div>
            <div>
              <Label>Cán bộ xử lý</Label>
              <Input value={formData.CanBoXuLy} onChange={(e) => setFormData({...formData, CanBoXuLy: e.target.value})} />
            </div>
            <div>
              <Label>Trạng thái</Label>
              <Select value={formData.MaTrangThai} onValueChange={(v) => setFormData({...formData, MaTrangThai: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DA_TIEP_NHAN">Đã tiếp nhận</SelectItem>
                  <SelectItem value="DANG_XU_LY">Đang xử lý</SelectItem>
                  <SelectItem value="CHO_BO_SUNG">Chờ bổ sung</SelectItem>
                  <SelectItem value="HOAN_THANH">Hoàn thành</SelectItem>
                  <SelectItem value="TU_CHOI">Từ chối</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Phí/Lệ phí (VNĐ)</Label>
              <Input type="number" value={formData.PhiLePhi} onChange={(e) => setFormData({...formData, PhiLePhi: parseInt(e.target.value) || 0})} />
            </div>
            <div className="col-span-2">
              <Label>Ghi chú</Label>
              <Textarea value={formData.GhiChu} onChange={(e) => setFormData({...formData, GhiChu: e.target.value})} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSave}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto text-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Plus className="w-4 h-4" />
              Tiếp nhận hồ sơ mới
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 py-2">
            <div>
              <Label>Tên thủ tục *</Label>
              <Select value={formData.TenThuTuc} onValueChange={(v) => setFormData({...formData, TenThuTuc: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thủ tục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Đăng ký khai sinh">Đăng ký khai sinh</SelectItem>
                  <SelectItem value="Đăng ký kết hôn">Đăng ký kết hôn</SelectItem>
                  <SelectItem value="Đăng ký khai tử">Đăng ký khai tử</SelectItem>
                  <SelectItem value="Cấp bản sao trích lục hộ tịch">Cấp bản sao trích lục hộ tịch</SelectItem>
                  <SelectItem value="Xác nhận tình trạng hôn nhân">Xác nhận tình trạng hôn nhân</SelectItem>
                  <SelectItem value="Chứng thực bản sao từ bản chính">Chứng thực bản sao từ bản chính</SelectItem>
                  <SelectItem value="Chứng thực chữ ký">Chứng thực chữ ký</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Loại thủ tục *</Label>
              <Select
                value={formData.MaLoaiThuTuc}
                onValueChange={(v) => {
                  const selected = loaiThuTucList.find((l: any) => String(l.MaLoaiThuTuc) === v);
                  setFormData({
                    ...formData,
                    MaLoaiThuTuc: v,
                    LoaiThuTuc: selected?.TenThuTuc || '',
                    TenThuTuc: selected?.TenThuTuc || formData.TenThuTuc,
                    LinhVuc: selected?.LinhVuc || formData.LinhVuc,
                    PhiLePhi: Number(selected?.PhiDichVu ?? formData.PhiLePhi),
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {loaiThuTucList.map((loai: any) => (
                    <SelectItem key={loai.MaLoaiThuTuc} value={String(loai.MaLoaiThuTuc)}>
                      {loai.TenThuTuc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tên công dân *</Label>
              <Input placeholder="Nhập họ và tên" value={formData.TenCongDan} onChange={(e) => setFormData({...formData, TenCongDan: e.target.value})} />
            </div>
            <div>
              <Label>CCCD *</Label>
              <Input placeholder="Nhập số CCCD" value={formData.CCCD} onChange={(e) => setFormData({...formData, CCCD: e.target.value})} />
            </div>
            <div>
              <Label>Số điện thoại</Label>
              <Input placeholder="0xxx xxx xxx" value={formData.SoDienThoai} onChange={(e) => setFormData({...formData, SoDienThoai: e.target.value})} />
            </div>
            <div>
              <Label>Email</Label>
              <Input placeholder="email@example.com" value={formData.Email} onChange={(e) => setFormData({...formData, Email: e.target.value})} />
            </div>
            <div className="col-span-2">
              <Label>Địa chỉ liên hệ</Label>
              <Input value={formData.DiaChiLienHe} onChange={(e) => setFormData({...formData, DiaChiLienHe: e.target.value})} />
            </div>
            <div>
              <Label>Hạn xử lý</Label>
              <Input type="datetime-local" value={formData.HanXuLy} onChange={(e) => setFormData({...formData, HanXuLy: e.target.value})} />
            </div>
            <div>
              <Label>Cán bộ xử lý</Label>
              <Input placeholder="Nhập cán bộ phụ trách" value={formData.CanBoXuLy} onChange={(e) => setFormData({...formData, CanBoXuLy: e.target.value})} />
            </div>
            <div>
              <Label>Phí/Lệ phí (VNĐ)</Label>
              <Input type="number" value={formData.PhiLePhi} onChange={(e) => setFormData({...formData, PhiLePhi: parseInt(e.target.value) || 0})} />
            </div>
            <div className="col-span-2">
              <Label>Ghi chú</Label>
              <Textarea placeholder="Nhập ghi chú nếu có..." value={formData.GhiChu} onChange={(e) => setFormData({...formData, GhiChu: e.target.value})} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSave}>Tiếp nhận hồ sơ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
