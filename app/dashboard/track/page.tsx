'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { hoSoTthcApi } from '@/lib/api';

export default function TrackPage() {
  const [caseId, setCaseId] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    if (status === 'Hoàn thành') {
      return <Badge className="bg-green-500/10 text-green-700 border-0">Hoàn thành</Badge>;
    }
    if (status === 'Đang xử lý') {
      return <Badge className="bg-blue-500/10 text-blue-700 border-0">Đang xử lý</Badge>;
    }
    if (status === 'Chờ bổ sung') {
      return <Badge className="bg-yellow-500/10 text-yellow-700 border-0">Chờ bổ sung</Badge>;
    }
    if (status === 'Từ chối') {
      return <Badge className="bg-red-500/10 text-red-700 border-0">Từ chối</Badge>;
    }
    return <Badge className="bg-gray-500/10 text-gray-700 border-0">Đã tiếp nhận</Badge>;
  };

  const handleSearch = async () => {
    const trimmed = caseId.trim();
    if (!trimmed) {
      setError('Vui lòng nhập mã hồ sơ.');
      setResult(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await hoSoTthcApi.getById(trimmed);
      if (!response?.success || !response.data) {
        throw new Error('Không tìm thấy hồ sơ phù hợp.');
      }
      setResult(response.data);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : 'Tra cứu thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Tra cứu hồ sơ của tôi
        </h1>
        <p className="text-muted-foreground mt-1">
          Nhập mã hồ sơ để theo dõi tình trạng
        </p>
      </div>

      <Card className="bg-card border-border p-4 sm:p-6 lg:p-8">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Mã hồ sơ
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="HS-2024-001"
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  className="pl-10 bg-input border-border"
                />
              </div>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? 'Đang tra cứu...' : 'Tra cứu'}
              </Button>
            </div>
          </div>

          {error && <div className="pt-4 text-center text-sm text-red-600">{error}</div>}

          {!error && !result && (
            <div className="pt-4 text-center text-muted-foreground text-sm">
              <p>Vui lòng nhập mã hồ sơ để xem chi tiết tiến độ xử lý</p>
            </div>
          )}
        </div>
      </Card>

      {result && (
        <Card className="bg-card border-border p-4 sm:p-6 lg:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{result.TenThuTuc || 'Hồ sơ thủ tục'}</h2>
              <p className="text-sm text-muted-foreground">Mã hồ sơ: {result.MaHoSo}</p>
            </div>
            {getStatusBadge(result.TrangThai || 'Đã tiếp nhận')}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Người nộp:</span>{' '}
              <span className="font-medium">{result.NguoiNop || '-'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Số hồ sơ:</span>{' '}
              <span className="font-medium">{result.SoHoSo || '-'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Ngày nộp:</span>{' '}
              <span className="font-medium">{String(result.NgayNop || '').slice(0, 10) || '-'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Ngày hẹn trả:</span>{' '}
              <span className="font-medium">{String(result.NgayHenTra || '').slice(0, 10) || '-'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Ngày hoàn thành:</span>{' '}
              <span className="font-medium">{String(result.NgayHoanThanh || '').slice(0, 10) || '-'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Lĩnh vực:</span>{' '}
              <span className="font-medium">{result.LinhVuc || '-'}</span>
            </div>
          </div>

          {result.GhiChu && (
            <div className="text-sm text-muted-foreground">
              Ghi chú: {result.GhiChu}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
