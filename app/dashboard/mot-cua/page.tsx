'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Briefcase, CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { hoSoTthcApi } from '@/lib/api';

export default function MotCuaPage() {
  const [stats, setStats] = useState({
    choXuLy: 0,
    dangXuLy: 0,
    hoanThanh: 0,
    quaHan: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const result = await hoSoTthcApi.getStats();
      if (!result.success || !result.data) {
        return;
      }

      const pending = Number(result.data.daTiepNhan || 0) + Number(result.data.choBoSung || 0);
      setStats({
        choXuLy: pending,
        dangXuLy: Number(result.data.dangXuLy || 0),
        hoanThanh: Number(result.data.hoanThanh || 0),
        quaHan: Number(result.data.quaHan || 0),
      });
    };

    loadStats();
  }, []);

  return (
    <div className="w-full px-3 sm:px-4 lg:px-5 py-3 sm:py-4 space-y-4 sm:space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary via-primary to-secondary p-4 sm:p-5 xl:p-6 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col 2xl:flex-row items-start 2xl:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Bộ phận Một cửa</h1>
              </div>
              <p className="text-white/90">Theo dõi giải quyết thủ tục hành chính</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-yellow-500/10 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.choXuLy}</p>
          <p className="text-sm text-muted-foreground">Chờ xử lý</p>
        </Card>

        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.dangXuLy}</p>
          <p className="text-sm text-muted-foreground">Đang xử lý</p>
        </Card>

        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.hoanThanh}</p>
          <p className="text-sm text-muted-foreground">Hoàn thành</p>
        </Card>

        <Card className="p-6 border-0 shadow-lg hover-lift">
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 bg-red-500/10 rounded-xl">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.quaHan}</p>
          <p className="text-sm text-muted-foreground">Quá hạn</p>
        </Card>
      </div>

      <Card className="p-6 border-0 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Tỷ lệ giải quyết đúng hạn</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Tháng này</span>
              <span className="text-sm font-semibold text-green-600">95.2%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 to-green-600" style={{ width: '95.2%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Quý này</span>
              <span className="text-sm font-semibold text-blue-600">92.8%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600" style={{ width: '92.8%' }}></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
