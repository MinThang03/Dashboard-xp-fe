'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { hoSoTthcApi } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

type LoaiThuTucItem = {
  MaLoaiThuTuc: number;
  TenThuTuc: string;
  LinhVuc?: string | null;
  ThoiGianXuLy?: number | null;
  PhiDichVu?: number | null;
};

const FALLBACK_LOAI_THU_TUC: LoaiThuTucItem[] = [
  { MaLoaiThuTuc: 1, TenThuTuc: 'Đăng ký khai sinh', LinhVuc: 'Tư pháp' },
  { MaLoaiThuTuc: 2, TenThuTuc: 'Chứng thực bản sao', LinhVuc: 'Tư pháp' },
  { MaLoaiThuTuc: 3, TenThuTuc: 'Cấp phép xây dựng', LinhVuc: 'Địa chính' },
];

function generateMaHoSo() {
  const now = new Date();
  const dateKey = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomKey = String(Math.floor(1000 + Math.random() * 9000));
  return `HS-${dateKey}-${randomKey}`;
}

export default function SubmitPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loaiThuTucList, setLoaiThuTucList] = useState<LoaiThuTucItem[]>(FALLBACK_LOAI_THU_TUC);
  const [formData, setFormData] = useState({
    MaLoaiThuTuc: '',
    TenThuTuc: '',
    LinhVuc: '',
    NguoiNop: user?.name || '',
    CCCD: '',
    SoDienThoai: '',
    Email: user?.email || '',
    DiaChiLienHe: '',
    GhiChu: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadLoaiThuTuc = async () => {
      const response = await hoSoTthcApi.getLoaiThuTuc();
      if (!active) return;
      if (response?.success && Array.isArray(response.data) && response.data.length) {
        setLoaiThuTucList(response.data);
      }
    };

    loadLoaiThuTuc();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!formData.MaLoaiThuTuc && loaiThuTucList.length) {
      const first = loaiThuTucList[0];
      setFormData((prev) => ({
        ...prev,
        MaLoaiThuTuc: String(first.MaLoaiThuTuc),
        TenThuTuc: first.TenThuTuc,
        LinhVuc: first.LinhVuc || '',
      }));
    }
  }, [formData.MaLoaiThuTuc, loaiThuTucList]);

  const selectedLoaiThuTuc = useMemo(() => {
    return loaiThuTucList.find((item) => String(item.MaLoaiThuTuc) === String(formData.MaLoaiThuTuc));
  }, [formData.MaLoaiThuTuc, loaiThuTucList]);

  const handleLoaiThuTucChange = (value: string) => {
    const selected = loaiThuTucList.find((item) => String(item.MaLoaiThuTuc) === value);
    setFormData((prev) => ({
      ...prev,
      MaLoaiThuTuc: value,
      TenThuTuc: selected?.TenThuTuc || '',
      LinhVuc: selected?.LinhVuc || '',
    }));
  };

  const handleSubmit = async () => {
    setMessage(null);
    setCreatedId(null);

    if (!formData.NguoiNop.trim()) {
      setMessage('Vui lòng nhập họ tên người nộp.');
      return;
    }

    const maLoaiThuTuc = Number(formData.MaLoaiThuTuc || selectedLoaiThuTuc?.MaLoaiThuTuc);
    if (!Number.isFinite(maLoaiThuTuc)) {
      setMessage('Vui lòng chọn loại thủ tục.');
      return;
    }

    const maHoSo = generateMaHoSo();
    const payload = {
      MaHoSo: maHoSo,
      SoHoSo: maHoSo,
      MaLoaiThuTuc: maLoaiThuTuc,
      TenThuTuc: formData.TenThuTuc || selectedLoaiThuTuc?.TenThuTuc || null,
      NguoiNop: formData.NguoiNop.trim(),
      CCCD: formData.CCCD.trim() || null,
      SoDienThoai: formData.SoDienThoai.trim() || null,
      Email: formData.Email.trim() || null,
      DiaChiLienHe: formData.DiaChiLienHe.trim() || null,
      LinhVuc: formData.LinhVuc || selectedLoaiThuTuc?.LinhVuc || null,
      NgayNop: new Date().toISOString().slice(0, 10),
      TrangThai: 'Đã tiếp nhận',
      GhiChu: formData.GhiChu.trim() || null,
    };

    setIsSubmitting(true);
    try {
      const response = await hoSoTthcApi.create(payload);
      if (!response?.success) {
        throw new Error(response?.message || 'Nộp hồ sơ thất bại');
      }
      setCreatedId(maHoSo);
      setMessage('Nộp hồ sơ thành công.');
      setFormData((prev) => ({
        ...prev,
        CCCD: '',
        SoDienThoai: '',
        DiaChiLienHe: '',
        GhiChu: '',
      }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Nộp hồ sơ thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Nộp hồ sơ trực tuyến</h1>
        <p className="text-muted-foreground mt-1">
          Điền đầy đủ thông tin để tạo hồ sơ thủ tục hành chính
        </p>
      </div>

      <Card className="bg-card border-border p-4 sm:p-6 lg:p-8 space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Loại thủ tục</Label>
            <Select value={formData.MaLoaiThuTuc} onValueChange={handleLoaiThuTucChange}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại thủ tục" />
              </SelectTrigger>
              <SelectContent>
                {loaiThuTucList.map((item) => (
                  <SelectItem key={item.MaLoaiThuTuc} value={String(item.MaLoaiThuTuc)}>
                    {item.TenThuTuc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Thủ tục</Label>
              <Input value={formData.TenThuTuc} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Lĩnh vực</Label>
              <Input value={formData.LinhVuc} readOnly className="bg-muted" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Họ tên người nộp</Label>
              <Input
                value={formData.NguoiNop}
                onChange={(e) => setFormData({ ...formData, NguoiNop: e.target.value })}
                placeholder="Họ và tên"
              />
            </div>
            <div className="space-y-2">
              <Label>CCCD</Label>
              <Input
                value={formData.CCCD}
                onChange={(e) => setFormData({ ...formData, CCCD: e.target.value })}
                placeholder="Số CCCD"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Số điện thoại</Label>
              <Input
                value={formData.SoDienThoai}
                onChange={(e) => setFormData({ ...formData, SoDienThoai: e.target.value })}
                placeholder="0912 345 678"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={formData.Email}
                onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Địa chỉ liên hệ</Label>
            <Input
              value={formData.DiaChiLienHe}
              onChange={(e) => setFormData({ ...formData, DiaChiLienHe: e.target.value })}
              placeholder="Địa chỉ liên hệ"
            />
          </div>

          <div className="space-y-2">
            <Label>Ghi chú</Label>
            <Textarea
              value={formData.GhiChu}
              onChange={(e) => setFormData({ ...formData, GhiChu: e.target.value })}
              placeholder="Thông tin bổ sung (nếu có)"
            />
          </div>
        </div>

        {message && (
          <div className="text-sm text-muted-foreground">
            {message}
            {createdId && <span className="ml-2 font-medium">Mã hồ sơ: {createdId}</span>}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          {createdId && (
            <Button variant="outline" onClick={() => router.push('/dashboard/track')}>
              Tra cứu hồ sơ
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Đang nộp...' : 'Nộp hồ sơ'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
