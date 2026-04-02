'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Briefcase, CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { hoSoTthcApi } from '@/lib/api';
import { VisualStatsPanel } from '@/components/charts/visual-stats-panel';

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

      <VisualStatsPanel
        title="Biểu đồ hiệu suất Bộ phận Một cửa"
        subtitle="Theo dõi hồ sơ chờ xử lý, đang xử lý, hoàn thành và quá hạn"
        items={[
          { label: 'Chờ xử lý', value: stats.choXuLy, color: '#f59e0b' },
          { label: 'Đang xử lý', value: stats.dangXuLy, color: '#3b82f6' },
          { label: 'Hoàn thành', value: stats.hoanThanh, color: '#22c55e' },
          { label: 'Quá hạn', value: stats.quaHan, color: '#ef4444' },
        ]}
      />

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
