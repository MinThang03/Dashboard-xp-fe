'use client';

import { useEffect, useMemo, useState } from 'react';
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

const PROCEDURE_GROUPS: Record<string, string[]> = {
  'Hộ tịch': [
    'Đăng ký khai sinh',
    'Đăng ký khai tử',
    'Đăng ký kết hôn',
    'Đăng ký nhận cha, mẹ, con',
    'Thay đổi/cải chính hộ tịch',
    'Xác nhận tình trạng hôn nhân',
    'Cấp bản sao trích lục hộ tịch',
  ],
  'Cư trú': [
    'Đăng ký thường trú',
    'Đăng ký tạm trú',
    'Khai báo tạm vắng',
    'Xác nhận thông tin cư trú',
  ],
  'Chứng thực': [
    'Chứng thực bản sao từ bản chính',
    'Chứng thực chữ ký',
    'Chứng thực hợp đồng/giao dịch',
  ],
  'Đất đai': [
    'Xác nhận nguồn gốc đất',
    'Xác nhận hiện trạng sử dụng đất',
    'Xác nhận tranh chấp đất',
    'Hồ sơ cấp sổ đỏ',
  ],
  'Chính sách - xã hội': [
    'Xác nhận hộ nghèo/cận nghèo',
    'Trợ cấp xã hội',
    'Chính sách người có công',
    'Bảo trợ xã hội',
  ],
  'Hành chính khác': [
    'Xác nhận cư trú',
    'Xác nhận lý lịch',
    'Xác nhận độc thân',
    'Giấy xác nhận dân sự',
  ],
  'Kinh tế - doanh nghiệp': [
    'Đăng ký hộ kinh doanh cá thể',
    'Xác nhận ngành nghề',
    'Tạm ngừng kinh doanh',
  ],
};

const PROCEDURE_CATEGORIES = Object.keys(PROCEDURE_GROUPS);

const normalizeKey = (value: unknown) => String(value || '').trim().toLowerCase();

const inferProcedureCategory = (linhVuc: unknown, tenThuTuc: unknown) => {
  const lv = normalizeKey(linhVuc);
  const tt = normalizeKey(tenThuTuc);

  for (const category of PROCEDURE_CATEGORIES) {
    const found = PROCEDURE_GROUPS[category]?.some((name) => normalizeKey(name) === tt);
    if (found) {
      return category;
    }
  }

  if (lv.includes('hộ tịch')) return 'Hộ tịch';
  if (lv.includes('cư trú') || lv.includes('hộ khẩu') || lv.includes('tạm trú') || lv.includes('tạm vắng')) return 'Cư trú';
  if (lv.includes('chứng thực') || lv.includes('tư pháp')) return 'Chứng thực';
  if (lv.includes('đất') || lv.includes('địa chính') || lv.includes('quy hoạch')) return 'Đất đai';
  if (lv.includes('xã hội') || lv.includes('chính sách') || lv.includes('bảo trợ') || lv.includes('người có công')) return 'Chính sách - xã hội';
  if (lv.includes('kinh tế') || lv.includes('kinh doanh') || lv.includes('doanh nghiệp')) return 'Kinh tế - doanh nghiệp';
  return 'Hành chính khác';
};

export default function HoSoTTHCPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [hoSoList, setHoSoList] = useState<HoSoTTHC[]>([]);
  const [filteredData, setFilteredData] = useState<HoSoTTHC[]>([]);
  const [loaiThuTucList, setLoaiThuTucList] = useState<any[]>([]);
  const [statsSummary, setStatsSummary] = useState<any>(null);
  
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

  const procedureOptionsByCategory = useMemo(() => {
    const merged: Record<string, string[]> = {};

    for (const category of PROCEDURE_CATEGORIES) {
      merged[category] = [...(PROCEDURE_GROUPS[category] || [])];
    }

    for (const loai of loaiThuTucList) {
      const category = inferProcedureCategory(loai?.LinhVuc, loai?.TenThuTuc);
      const tenThuTuc = String(loai?.TenThuTuc || '').trim();
      if (!tenThuTuc) {
        continue;
      }
      if (!merged[category]) {
        merged[category] = [];
      }
      if (!merged[category].includes(tenThuTuc)) {
        merged[category].push(tenThuTuc);
      }
    }

    return merged;
  }, [loaiThuTucList]);

  const mapFromApi = (item: any, loaiList: any[]): HoSoTTHC => {
    const loaiThuTuc = loaiList.find((l) => l.MaLoaiThuTuc === item.MaLoaiThuTuc);
    const tenThuTuc = item.TenThuTuc || loaiThuTuc?.TenThuTuc || `Thủ tục #${item.MaLoaiThuTuc}`;
    const category = inferProcedureCategory(item.LinhVuc || loaiThuTuc?.LinhVuc, tenThuTuc);

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
      LoaiThuTuc: category,
      LinhVuc: category,
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
    const [hoSoRes, loaiRes, statsRes] = await Promise.all([
      hoSoTthcApi.getList({ page: 1, limit: 500 }),
      hoSoTthcApi.getLoaiThuTuc(),
      hoSoTthcApi.getStats(),
    ]);

    const loaiData = loaiRes.success && Array.isArray(loaiRes.data) ? loaiRes.data : [];
    setLoaiThuTucList(loaiData);
    if (statsRes.success && statsRes.data) {
      setStatsSummary(statsRes.data);
    }

    if (hoSoRes.success && Array.isArray(hoSoRes.data)) {
      const mapped = hoSoRes.data.map((item: any) => mapFromApi(item, loaiData));
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
  const overdueFromList = hoSoList.filter((h) => {
    if (!h.HanXuLy) return false;
    const due = new Date(h.HanXuLy);
    if (Number.isNaN(due.getTime())) return false;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return due < now && h.MaTrangThai !== 'HOAN_THANH' && h.MaTrangThai !== 'TU_CHOI';
  }).length;

  const stats = {
    total: Number(statsSummary?.total ?? hoSoList.length),
    pending: Number(statsSummary?.daTiepNhan ?? 0) + Number(statsSummary?.choBoSung ?? 0),
    processing: Number(statsSummary?.dangXuLy ?? hoSoList.filter((h) => h.MaTrangThai === 'DANG_XU_LY').length),
    completed: Number(statsSummary?.hoanThanh ?? hoSoList.filter((h) => h.MaTrangThai === 'HOAN_THANH').length),
    overdue: Number(statsSummary?.quaHan ?? overdueFromList),
  };

  // Handlers
  const handleView = (hoSo: HoSoTTHC) => {
    setSelectedHoSo(hoSo);
    setViewDialogOpen(true);
  };

  const handleEdit = (hoSo: HoSoTTHC) => {
    setSelectedHoSo(hoSo);
    const selectedCategory = inferProcedureCategory(hoSo.LinhVuc || hoSo.LoaiThuTuc, hoSo.TenThuTuc);
    setFormData({
      MaHoSo: hoSo.MaHoSo,
      MaLoaiThuTuc: hoSo.MaLoaiThuTuc ? String(hoSo.MaLoaiThuTuc) : '',
      TenThuTuc: hoSo.TenThuTuc,
      TenCongDan: hoSo.TenCongDan,
      CCCD: hoSo.CCCD,
      SoDienThoai: hoSo.SoDienThoai,
      Email: hoSo.Email,
      DiaChiLienHe: hoSo.DiaChiLienHe,
      LoaiThuTuc: selectedCategory,
      LinhVuc: selectedCategory,
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
    const defaultCategory = 'Hộ tịch';
    const defaultProcedure = procedureOptionsByCategory[defaultCategory]?.[0] || '';
    setFormData({
      MaHoSo: newMaHoSo,
      MaLoaiThuTuc: loaiThuTucList?.[0]?.MaLoaiThuTuc ? String(loaiThuTucList[0].MaLoaiThuTuc) : '',
      TenThuTuc: defaultProcedure,
      TenCongDan: '',
      CCCD: '',
      SoDienThoai: '',
      Email: '',
      DiaChiLienHe: '',
      LoaiThuTuc: defaultCategory,
      LinhVuc: defaultCategory,
      MaTrangThai: 'DA_TIEP_NHAN',
      HanXuLy: '',
      CanBoXuLy: '',
      PhiLePhi: 0,
      GhiChu: '',
    });
    setAddDialogOpen(true);
  };

  const handleSave = async () => {
    const tenThuTuc = cleanText(formData.TenThuTuc, 200);
    const procedureCategory = cleanText(formData.LoaiThuTuc || formData.LinhVuc, 100) || 'Hành chính khác';
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
    const matchedLoai = loaiThuTucList.find(
      (l) =>
        normalizeKey(l.TenThuTuc) === normalizeKey(tenThuTuc) &&
        inferProcedureCategory(l.LinhVuc, l.TenThuTuc) === procedureCategory,
    );
    const matchedByCategory = loaiThuTucList.find(
      (l) => inferProcedureCategory(l.LinhVuc, l.TenThuTuc) === procedureCategory,
    );
    const maLoaiThuTuc =
      selectedLoai?.MaLoaiThuTuc ||
      matchedLoai?.MaLoaiThuTuc ||
      matchedByCategory?.MaLoaiThuTuc ||
      loaiThuTucList?.[0]?.MaLoaiThuTuc ||
      1;

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
      LinhVuc: procedureCategory || linhVuc || null,
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
                  {PROCEDURE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
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
              <Select
                value={formData.TenThuTuc}
                onValueChange={(v) => setFormData({ ...formData, TenThuTuc: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thủ tục" />
                </SelectTrigger>
                <SelectContent>
                  {(procedureOptionsByCategory[formData.LoaiThuTuc] || []).map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Loại thủ tục *</Label>
              <Select
                value={formData.LoaiThuTuc}
                onValueChange={(v) => {
                  const options = procedureOptionsByCategory[v] || [];
                  const nextTenThuTuc = options.includes(formData.TenThuTuc)
                    ? formData.TenThuTuc
                    : options[0] || '';
                  setFormData({
                    ...formData,
                    LoaiThuTuc: v,
                    LinhVuc: v,
                    TenThuTuc: nextTenThuTuc,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROCEDURE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
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
                  {(procedureOptionsByCategory[formData.LoaiThuTuc] || []).map((name) => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Loại thủ tục *</Label>
              <Select
                value={formData.LoaiThuTuc}
                onValueChange={(v) => {
                  const options = procedureOptionsByCategory[v] || [];
                  const nextTenThuTuc = options.includes(formData.TenThuTuc)
                    ? formData.TenThuTuc
                    : options[0] || '';
                  setFormData({
                    ...formData,
                    LoaiThuTuc: v,
                    LinhVuc: v,
                    TenThuTuc: nextTenThuTuc,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROCEDURE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
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
