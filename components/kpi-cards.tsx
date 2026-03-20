'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  budgetRevenueKPI,
  investmentDisbursementKPI,
  dossierStatisticsKPI,
  citizenSatisfactionKPI,
  crimeStatisticsKPI,
  petitionStatisticsKPI,
} from '@/lib/kpi-data';

// Budget Revenue Card
export function BudgetRevenueCard() {
  const remaining = budgetRevenueKPI.target - budgetRevenueKPI.current;

  return (
    <Card className="hover-lift animate-fade-in-scale">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{budgetRevenueKPI.title}</CardTitle>
            <CardDescription>{budgetRevenueKPI.period}</CardDescription>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/30 animate-pulse">Cao</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tiến độ</span>
            <span className="font-semibold">{budgetRevenueKPI.percentage}%</span>
          </div>
          <Progress value={budgetRevenueKPI.percentage} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Mục tiêu</p>
            <p className="font-semibold">{budgetRevenueKPI.target}T</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Đã thu</p>
            <p className="font-semibold">{budgetRevenueKPI.current}T</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Còn lại</p>
            <p className="font-semibold">{remaining.toFixed(1)}T</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={budgetRevenueKPI.monthlyData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#DA291C" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#DA291C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#DA291C"
              fillOpacity={1}
              fill="url(#colorValue)"
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Administrative Dossier Statistics Card
export function DossierStatisticsCard() {
  return (
    <Card className="hover-lift animate-fade-in-scale" style={{ animationDelay: '0.1s' }}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{dossierStatisticsKPI.title}</CardTitle>
            <CardDescription>{dossierStatisticsKPI.period}</CardDescription>
          </div>
          <Badge className="bg-blue-100 text-blue-800">Cao</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2 border-l-4 border-green-500 pl-3">
            <p className="text-xs text-muted-foreground">Đúng hạn</p>
            <p className="text-2xl font-bold text-green-600">{dossierStatisticsKPI.stats.onTime}</p>
            <p className="text-xs text-green-600">{dossierStatisticsKPI.percentages.onTimeRate}%</p>
          </div>
          <div className="space-y-2 border-l-4 border-red-500 pl-3">
            <p className="text-xs text-muted-foreground">Quá hạn</p>
            <p className="text-2xl font-bold text-red-600">{dossierStatisticsKPI.stats.overdue}</p>
            <p className="text-xs text-red-600">{dossierStatisticsKPI.percentages.overdueRate}%</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm border-t pt-3">
          <div>
            <p className="text-muted-foreground text-xs">Tổng hồ sơ</p>
            <p className="text-xl font-bold">{dossierStatisticsKPI.stats.total}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Trực tuyến</p>
            <p className="text-xl font-bold">{dossierStatisticsKPI.stats.online}</p>
            <p className="text-xs text-muted-foreground">{dossierStatisticsKPI.percentages.onlineRate}%</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={dossierStatisticsKPI.monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="onTime" fill="#10b981" radius={[8, 8, 0, 0]} />
            <Bar dataKey="overdue" fill="#ef4444" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Citizen Satisfaction Card
export function CitizenSatisfactionCard() {
  return (
    <Card className="hover-lift animate-fade-in-scale" style={{ animationDelay: '0.2s' }}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{citizenSatisfactionKPI.title}</CardTitle>
            <CardDescription>Điểm trung bình: {citizenSatisfactionKPI.overall}/10</CardDescription>
          </div>
          <Badge className="bg-yellow-100 text-yellow-800">Trung bình</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-600">{citizenSatisfactionKPI.overall}</div>
            <div className="text-xs text-muted-foreground mt-1">/10</div>
          </div>
          <div className="flex-1 space-y-2">
            {citizenSatisfactionKPI.categories.map((cat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{cat.name}</span>
                  <span className="font-semibold">{cat.score}</span>
                </div>
                <Progress value={(cat.score / 10) * 100} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Crime Statistics Card
export function CrimeStatisticsCard() {
  const [openVillage, setOpenVillage] = useState<(typeof crimeStatisticsKPI.byVillage)[number] | null>(null);

  const villageOptions = crimeStatisticsKPI.byVillage ?? [];

  const totalForVillage = (v: (typeof crimeStatisticsKPI.byVillage)[number]) =>
    v.theft + v.robbery + v.drugs + v.gambling + v.civilDisputes;

  return (
    <Card className="hover-lift animate-fade-in-scale" style={{ animationDelay: '0.3s' }}>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-lg">{crimeStatisticsKPI.title}</CardTitle>
            <CardDescription>Tổng cộng: {crimeStatisticsKPI.totalViolations} vụ (toàn xã)</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-red-100 text-red-800">Cao</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tổng quan số liệu */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-red-50 p-3 border border-red-200">
            <p className="text-xs text-muted-foreground mb-1">Tổng vụ việc</p>
            <p className="text-2xl font-bold text-red-600">{crimeStatisticsKPI.totalViolations}</p>
          </div>
          <div className="rounded-lg bg-orange-50 p-3 border border-orange-200">
            <p className="text-xs text-muted-foreground mb-1">Thôn/Khu phố</p>
            <p className="text-2xl font-bold text-orange-600">{villageOptions.length}</p>
          </div>
        </div>

        {/* Thống kê theo thôn/xóm với số vụ có thể bấm để xem chi tiết */}
        {villageOptions.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <p className="text-sm font-medium">Thống kê theo thôn / khu phố</p>
            <div className="space-y-2 text-sm max-h-40 overflow-y-auto pr-1">
              {villageOptions.map((v) => (
                <div
                  key={v.name}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-gradient-to-r from-card to-card/80 px-3 py-2.5 hover:shadow-sm transition"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-status-danger" />
                    <span className="font-medium">{v.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpenVillage(v)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full border border-status-danger text-status-danger hover:bg-status-danger/10 hover:scale-105 transition"
                  >
                    {totalForVillage(v)} vụ
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Biểu đồ xu hướng toàn xã */}
        <div className="space-y-2 pt-2 border-t">
          <p className="text-sm font-medium">Xu hướng 6 tháng (toàn xã)</p>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={crimeStatisticsKPI.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: 12,
                }}
                formatter={(value: any) => [`${value} vụ`, 'Số vụ vi phạm']}
              />
              <Line
                type="monotone"
                dataKey="violations"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ fill: '#ef4444', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      {openVillage && (
        <Dialog
          open={!!openVillage}
          onOpenChange={(open) => {
            if (!open) setOpenVillage(null);
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Thống kê vụ việc tại {openVillage.name}</DialogTitle>
              <DialogDescription>
                Tổng hợp số vụ theo từng loại trong 6–12 tháng gần đây.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Tổng cộng nổi bật ở trên */}
              <div className="rounded-lg bg-gradient-to-r from-status-danger/10 to-red-50 border-2 border-status-danger/30 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Tổng số vụ việc</p>
                <p className="text-3xl font-bold text-status-danger">
                  {totalForVillage(openVillage)} <span className="text-lg">vụ</span>
                </p>
              </div>

              {/* Danh sách các loại vụ với màu sắc động dựa trên số vụ */}
              {(() => {
                const cases = [
                  { name: 'Trộm cắp', count: openVillage.theft },
                  { name: 'Cướp giật', count: openVillage.robbery },
                  { name: 'Tệ nạn ma tuý', count: openVillage.drugs },
                  { name: 'Đánh bạc', count: openVillage.gambling },
                  { name: 'Tranh chấp dân sự', count: openVillage.civilDisputes },
                ];
                const maxCount = Math.max(...cases.map((c) => c.count));
                
                const getCaseColor = (count: number) => {
                  if (count === 0) {
                    return {
                      border: 'border-status-success',
                      bg: 'bg-status-success/10',
                      hoverBg: 'hover:bg-status-success/20',
                      dot: 'bg-status-success',
                      badge: 'bg-status-success/20 text-status-success border-status-success/40',
                    };
                  } else if (count >= 10 || count === maxCount) {
                    return {
                      border: 'border-status-danger',
                      bg: 'bg-status-danger/10',
                      hoverBg: 'hover:bg-status-danger/20',
                      dot: 'bg-status-danger',
                      badge: 'bg-status-danger/20 text-status-danger border-status-danger/40',
                    };
                  } else {
                    return {
                      border: 'border-status-warning',
                      bg: 'bg-status-warning/10',
                      hoverBg: 'hover:bg-status-warning/20',
                      dot: 'bg-status-warning',
                      badge: 'bg-status-warning/20 text-status-warning border-status-warning/40',
                    };
                  }
                };

                return (
                  <div className="grid grid-cols-1 gap-2.5">
                    {cases.map((caseItem) => {
                      const colors = getCaseColor(caseItem.count);
                      return (
                        <div
                          key={caseItem.name}
                          className={`flex items-center justify-between rounded-lg border-l-4 ${colors.border} ${colors.bg} px-4 py-3 ${colors.hoverBg} transition`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                            <span className="font-medium text-foreground">{caseItem.name}</span>
                          </div>
                          <Badge className={`${colors.badge} font-semibold`}>
                            {caseItem.count} vụ
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenVillage(null)}>
                Đóng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
// Petition Statistics Card
export function PetitionStatisticsCard() {
  const resolutionRate = (petitionStatisticsKPI.resolved / (petitionStatisticsKPI.resolved + petitionStatisticsKPI.pending)) * 100;

  return (
    <Card className="hover-lift animate-fade-in-scale" style={{ animationDelay: '0.4s' }}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{petitionStatisticsKPI.title}</CardTitle>
            <CardDescription>Tỷ lệ giải quyết: {resolutionRate.toFixed(1)}%</CardDescription>
          </div>
          <Badge className="bg-blue-100 text-blue-800">Cao</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2 rounded-lg bg-green-50 p-3 border border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-xs text-muted-foreground">Đã xử lý</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{petitionStatisticsKPI.resolved}</p>
          </div>
          <div className="space-y-2 rounded-lg bg-yellow-50 p-3 border border-yellow-200">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-xs text-muted-foreground">Đang xử lý</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{petitionStatisticsKPI.pending}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">Phân loại đơn thư</p>
          {petitionStatisticsKPI.categories.map((cat, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span>{cat.name}</span>
              <Badge variant="outline">{cat.count}</Badge>
            </div>
          ))}
        </div>

        <div className="text-xs text-muted-foreground border-t pt-2">
          Thời gian giải quyết trung bình: {petitionStatisticsKPI.averageResolutionDays} ngày
        </div>
      </CardContent>
    </Card>
  );
}
