'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Download,
  Filter,
  RefreshCw,
  TrendingUp,
  BarChart3,
  MapPin,
  Users,
  AlertCircle,
  CheckCircle2,
  FileText,
  DollarSign,
  Leaf,
  Heart,
  Music,
  BookOpen,
  Map,
  Zap,
} from 'lucide-react';
import {
  BudgetRevenueCard,
  DossierStatisticsCard,
  CitizenSatisfactionCard,
  CrimeStatisticsCard,
  PetitionStatisticsCard,
} from '@/components/kpi-cards';
import {
  budgetRevenueKPI,
  investmentDisbursementKPI,
  dossierStatisticsKPI,
  citizenSatisfactionKPI,
  crimeStatisticsKPI,
  petitionStatisticsKPI,
  landManagementKPI,
  environmentKPI,
  cultureAndSocialKPI,
  knowledgeBase,
  gisData,
  systemIntegration,
} from '@/lib/kpi-data';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function LeaderDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedDisputeArea, setSelectedDisputeArea] = useState<
    (typeof landManagementKPI.disputesByArea)[number] | null
  >(null);
  const totalAirDays =
    environmentKPI.airQuality.goodDays +
    environmentKPI.airQuality.mediumDays +
    environmentKPI.airQuality.badDays;

  const heritageChartData = [
    {
      name: 'QG',
      value: cultureAndSocialKPI.heritageAndTourism.categories.nationalLevel,
    },
    {
      name: 'Cấp tỉnh',
      value: cultureAndSocialKPI.heritageAndTourism.categories.provinceLevel,
    },
    {
      name: 'Cấp huyện',
      value: cultureAndSocialKPI.heritageAndTourism.categories.districtLevel,
    },
    {
      name: 'Cấp xã',
      value: cultureAndSocialKPI.heritageAndTourism.categories.communeLevel,
    },
  ];

  const healthChartData = [
    {
      name: 'Hồ sơ sức khỏe',
      current: cultureAndSocialKPI.healthcareInsurance.ehealthProfile,
      target: cultureAndSocialKPI.healthcareInsurance.targetEhealth,
    },
    {
      name: 'BHYT',
      current: cultureAndSocialKPI.healthcareInsurance.healthInsuranceParticipation,
      target: cultureAndSocialKPI.healthcareInsurance.targetInsurance,
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Bảng Điều Khiển Lãnh Đạo
          </h1>
          <p className="text-muted-foreground mt-1">Theo dõi KPI các phòng ban và dự án</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Làm mới
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium">Khoảng thời gian</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm nay</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Phòng ban</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            <option value="all">Tất cả phòng ban</option>
            <option value="finance">Tài chính - Kế toán</option>
            <option value="land">Địa chính - Xây dựng</option>
            <option value="security">An ninh - Quốc phòng</option>
            <option value="labor">Lao động - An sinh</option>
            <option value="health">Y tế</option>
            <option value="culture">Văn hóa - Thể thao</option>
            <option value="environment">Môi trường</option>
          </select>
        </div>
      </div>

      {/* KPI Tabs */}
      <Tabs defaultValue="command-center" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:grid-cols-7 gap-2">
          <TabsTrigger value="command-center" className="text-xs md:text-sm">
            Chỉ huy
          </TabsTrigger>
          <TabsTrigger value="land" className="text-xs md:text-sm">
            Đất đai
          </TabsTrigger>
          <TabsTrigger value="environment" className="text-xs md:text-sm">
            Môi trường
          </TabsTrigger>
          <TabsTrigger value="culture" className="text-xs md:text-sm">
            Văn hóa
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="text-xs md:text-sm">
            CSDL
          </TabsTrigger>
          <TabsTrigger value="gis" className="text-xs md:text-sm">
            Bản đồ
          </TabsTrigger>
          <TabsTrigger value="integration" className="text-xs md:text-sm">
            Tích hợp
          </TabsTrigger>
        </TabsList>

        {/* Command Center Tab */}
        <TabsContent value="command-center" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <BudgetRevenueCard />
            <DossierStatisticsCard />
            <CitizenSatisfactionCard />
            <CrimeStatisticsCard />
            <PetitionStatisticsCard />

            {/* Investment Disbursement */}
            <Card className="hover-lift animate-fade-in-scale" style={{ animationDelay: '0.5s' }}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{investmentDisbursementKPI.title}</CardTitle>
                    <CardDescription>Giải ngân vốn công</CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Cao</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{investmentDisbursementKPI.percentage}%</span>
                    <span className="text-sm text-muted-foreground">
                      {investmentDisbursementKPI.current}/{investmentDisbursementKPI.target}T
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-green-600"
                      style={{ width: `${investmentDisbursementKPI.percentage}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </TabsContent>

        {/* Land Management Tab */}
        <TabsContent value="land" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {landManagementKPI.landUsageMap.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Tổng diện tích: {landManagementKPI.landUsageMap.totalArea} ha</p>
                  {landManagementKPI.landUsageMap.categories.map((cat, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-sm">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${cat.percentage}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{cat.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground border-t pt-2">
                  Cập nhật: {landManagementKPI.landUsageMap.lastUpdated}
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {landManagementKPI.certificateIssued.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-blue-50 p-3">
                    <p className="text-xs text-muted-foreground">Tổng cấp</p>
                    <p className="text-2xl font-bold text-blue-600">{landManagementKPI.certificateIssued.totalIssued}</p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-3">
                    <p className="text-xs text-muted-foreground">Năm nay</p>
                    <p className="text-2xl font-bold text-green-600">{landManagementKPI.certificateIssued.thisYear}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-yellow-50 p-3">
                    <p className="text-xs text-muted-foreground">Đang xử lý</p>
                    <p className="text-2xl font-bold text-yellow-600">{landManagementKPI.certificateIssued.pending}</p>
                  </div>
                  <div className="rounded-lg bg-red-50 p-3">
                    <p className="text-xs text-muted-foreground">Từ chối</p>
                    <p className="text-2xl font-bold text-red-600">{landManagementKPI.certificateIssued.rejectedCases}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-lg">{landManagementKPI.disputes.title}</CardTitle>
                    <CardDescription>
                      Nhìn nhanh tình hình tranh chấp đất đai theo xã/thôn và xem chi tiết từng vụ.
                    </CardDescription>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    Tổng đang xử lý:&nbsp;
                    <span className="font-semibold text-orange-600">
                      {landManagementKPI.disputes.active}
                    </span>
                    &nbsp;• Đã giải quyết:&nbsp;
                    <span className="font-semibold text-green-600">
                      {landManagementKPI.disputes.resolved}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-3 font-semibold text-muted-foreground">
                  <span>Xã / Phường</span>
                  <span>Thôn / Khu phố</span>
                  <span className="text-right">Số vụ tranh chấp</span>
                </div>
                {landManagementKPI.disputesByArea.map((row, idx) => (
                  <div
                    key={`${row.commune}-${row.village}-${idx}`}
                    className="grid grid-cols-3 items-center py-1 border-b border-border/40 last:border-b-0"
                  >
                    <span>{row.commune}</span>
                    <span>{row.village}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedDisputeArea(row)}
                      className="justify-self-end text-xs font-semibold px-3 py-1 rounded-full border border-status-warning text-status-warning hover:bg-status-warning/10 transition"
                    >
                      {row.cases} vụ
                    </button>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground pt-2">
                  <AlertCircle className="w-3 h-3 inline mr-1" />
                  Bấm vào số vụ để xem chi tiết từng hồ sơ tranh chấp tại xã/thôn tương ứng.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-lg">{landManagementKPI.landPlan.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {landManagementKPI.landPlan.approved && (
                  <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3 border border-green-200">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-green-900">Đã được phê duyệt</p>
                      <p className="text-xs text-green-700">Cập nhật: {landManagementKPI.landPlan.lastUpdated}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </TabsContent>

        {/* Environment Tab */}
        <TabsContent value="environment" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Leaf className="w-5 h-5" />
                  {environmentKPI.wasteManagement.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-blue-50 p-3">
                    <p className="text-xs text-muted-foreground">Thu gom</p>
                    <p className="text-2xl font-bold">{environmentKPI.wasteManagement.collectionRate}%</p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-3">
                    <p className="text-xs text-muted-foreground">Xử lý</p>
                    <p className="text-2xl font-bold">{environmentKPI.wasteManagement.processingRate}%</p>
                  </div>
                </div>
                <p className="text-sm font-semibold">{environmentKPI.wasteManagement.totalWaste} tấn/năm</p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  {environmentKPI.urbanDevelopment.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center rounded-lg bg-blue-50 p-2">
                    <p className="text-2xl font-bold text-blue-600">{environmentKPI.urbanDevelopment.completedProjects}</p>
                    <p className="text-xs text-muted-foreground">Hoàn thành</p>
                  </div>
                  <div className="text-center rounded-lg bg-yellow-50 p-2">
                    <p className="text-2xl font-bold text-yellow-600">{environmentKPI.urbanDevelopment.inProgressProjects}</p>
                    <p className="text-xs text-muted-foreground">Đang thực hiện</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chỉ số tổng quan môi trường */}
            {/* AQI */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Leaf className="w-5 h-5" />
                  {environmentKPI.airQuality.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">AQI trung bình (6-12 tháng)</span>
                  <span className="text-xl font-bold">{environmentKPI.airQuality.overallIndex}</span>
                </div>
                <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="bg-status-success"
                    style={{
                      width:
                        totalAirDays > 0
                          ? `${(environmentKPI.airQuality.goodDays / totalAirDays) * 100}%`
                          : '0%',
                    }}
                  />
                  <div
                    className="bg-status-warning"
                    style={{
                      width:
                        totalAirDays > 0
                          ? `${(environmentKPI.airQuality.mediumDays / totalAirDays) * 100}%`
                          : '0%',
                    }}
                  />
                  <div
                    className="bg-status-danger"
                    style={{
                      width:
                        totalAirDays > 0
                          ? `${(environmentKPI.airQuality.badDays / totalAirDays) * 100}%`
                          : '0%',
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Tốt: {environmentKPI.airQuality.goodDays} ngày</span>
                  <span>TB: {environmentKPI.airQuality.mediumDays} ngày</span>
                  <span>Kém: {environmentKPI.airQuality.badDays} ngày</span>
                </div>
              </CardContent>
            </Card>

            {/* Cây xanh */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Leaf className="w-5 h-5" />
                  {environmentKPI.greenCoverage.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    m²/người: {environmentKPI.greenCoverage.areaPerCapita}
                  </span>
                  <span className="text-muted-foreground">
                    Mục tiêu: {environmentKPI.greenCoverage.targetAreaPerCapita}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-status-success"
                    style={{ width: `${environmentKPI.greenCoverage.coveragePercent}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Đạt khoảng{' '}
                  <span className="font-semibold">{environmentKPI.greenCoverage.coveragePercent}%</span>{' '}
                  so với mục tiêu phủ xanh đô thị.
                </p>
              </CardContent>
            </Card>

            {/* Nước */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Leaf className="w-5 h-5" />
                  {environmentKPI.waterQuality.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="bg-status-success"
                    style={{ width: `${environmentKPI.waterQuality.safePercent}%` }}
                  />
                  <div
                    className="bg-status-warning"
                    style={{ width: `${environmentKPI.waterQuality.warningPercent}%` }}
                  />
                  <div
                    className="bg-status-danger"
                    style={{ width: `${environmentKPI.waterQuality.unsafePercent}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <span className="text-status-success">
                    An toàn: {environmentKPI.waterQuality.safePercent}%
                  </span>
                  <span className="text-status-warning">
                    Cảnh báo: {environmentKPI.waterQuality.warningPercent}%
                  </span>
                  <span className="text-status-danger">
                    Nguy cơ: {environmentKPI.waterQuality.unsafePercent}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Culture Tab */}
        <TabsContent value="culture" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Di tích & Du lịch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">Tổng số di tích lịch sử</div>
                    <div className="text-2xl font-bold text-primary">
                      {cultureAndSocialKPI.heritageAndTourism.totalHeritage}
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    Đã số hoá
                    <div className="text-lg font-semibold text-primary">
                      {cultureAndSocialKPI.heritageAndTourism.digitizedCount}/
                      {cultureAndSocialKPI.heritageAndTourism.totalDigitizable}
                    </div>
                  </div>
                </div>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={heritageChartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} />
                      <YAxis stroke="#9ca3af" fontSize={10} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e5e7eb',
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                        formatter={(value: any) => [`${value} di tích`, 'Số lượng']}
                      />
                      <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  An sinh xã hội
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">Tổng người nhận chi trả</div>
                    <div className="text-2xl font-bold text-status-success">
                      {cultureAndSocialKPI.socialWelfare.total}
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    Tỉ lệ không tiền mặt
                    <div className="text-lg font-semibold text-status-success">
                      {cultureAndSocialKPI.socialWelfare.nonCashRate}%
                    </div>
                  </div>
                </div>
                <div className="h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={cultureAndSocialKPI.socialWelfare.trends}
                      margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} />
                      <YAxis stroke="#9ca3af" fontSize={10} tickFormatter={(v) => `${v / 1000}k`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e5e7eb',
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                        formatter={(value: any) => [`${value} người`, 'Người hưởng lợi']}
                        labelFormatter={(label: string) => `Tháng: ${label}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="beneficiaries"
                        stroke="#16a34a"
                        fill="#bbf7d0"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                {cultureAndSocialKPI.socialWelfare.byArea && (
                  <div className="pt-2 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Tỉ lệ theo khu vực</p>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={cultureAndSocialKPI.socialWelfare.byArea}
                          margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="area" stroke="#9ca3af" fontSize={9} angle={-15} textAnchor="end" height={40} />
                          <YAxis stroke="#9ca3af" fontSize={9} tickFormatter={(v) => `${v}%`} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #e5e7eb',
                              borderRadius: 8,
                              fontSize: 11,
                            }}
                            formatter={(value: any) => [`${value}%`, 'Tỉ lệ']}
                          />
                          <Bar dataKey="percentage" fill="#16a34a" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Sức khỏe
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-baseline justify-between text-xs text-muted-foreground">
                  <span>
                    Hồ sơ sức khỏe điện tử / Mục tiêu:{' '}
                    <span className="font-semibold text-foreground">
                      {cultureAndSocialKPI.healthcareInsurance.ehealthProfile}% /{' '}
                      {cultureAndSocialKPI.healthcareInsurance.targetEhealth}%
                    </span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs text-muted-foreground">
                  <span>
                    Tham gia BHYT / Mục tiêu:{' '}
                    <span className="font-semibold text-foreground">
                      {cultureAndSocialKPI.healthcareInsurance.healthInsuranceParticipation}% /{' '}
                      {cultureAndSocialKPI.healthcareInsurance.targetInsurance}%
                    </span>
                  </span>
                </div>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={healthChartData}
                      margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                      barGap={4}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} />
                      <YAxis
                        stroke="#9ca3af"
                        fontSize={10}
                        tickFormatter={(v) => `${v}%`}
                        domain={[0, 100]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e5e7eb',
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                        formatter={(value: any, key: any) => [
                          `${value}%`,
                          key === 'current' ? 'Hiện tại' : 'Mục tiêu',
                        ]}
                      />
                      <Bar dataKey="target" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="current" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {[knowledgeBase.laws, knowledgeBase.regulations, knowledgeBase.buildingProcess, knowledgeBase.landCertificateProcess].map(
              (item, i) => (
                <Card key={i} className="hover-lift">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>Cập nhật: {item.lastUpdated || 'N/A'}</p>
                    {item.steps && <p>Bước: {item.steps}</p>}
                    {item.articles && <p>Điều: {item.articles}</p>}
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </TabsContent>

        {/* GIS Tab */}
        <TabsContent value="gis" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Map className="w-4 h-4" />
                  {gisData.administrativeMap.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Tỷ lệ: {gisData.administrativeMap.scale}</p>
                <p>Cập nhật: {gisData.administrativeMap.lastUpdated}</p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-base">{gisData.planningMap.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>{gisData.planningMap.zones} khu vực quy hoạch</p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-base">{gisData.constructionPermitMap.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>{gisData.constructionPermitMap.permits} giấy phép</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Integration Tab */}
        <TabsContent value="integration" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-base">{systemIntegration.lgsp.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge className={systemIntegration.lgsp.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {systemIntegration.lgsp.status === 'connected' ? 'Kết nối' : 'Mất kết nối'}
                </Badge>
                <p className="text-xs text-muted-foreground">Cập nhật: {systemIntegration.lgsp.lastSync}</p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-base">{systemIntegration.tabmis.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge className="bg-green-100 text-green-800">Kết nối</Badge>
                <p className="text-xs text-muted-foreground">Cập nhật: {systemIntegration.tabmis.lastSync}</p>
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="text-base">{systemIntegration.populationDatabase.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge className="bg-yellow-100 text-yellow-800">Đang xin</Badge>
                <p className="text-xs text-muted-foreground">Dự kiến: {systemIntegration.populationDatabase.expectedDate}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      {/* Dialog chi tiết tranh chấp đất đai theo thôn/xóm */}
      <Dialog
        open={selectedDisputeArea !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedDisputeArea(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Chi tiết tranh chấp đất đai –{' '}
              {selectedDisputeArea?.village} ({selectedDisputeArea?.commune})
            </DialogTitle>
            <DialogDescription>
              Danh sách các vụ tranh chấp để lãnh đạo nắm rõ tình hình và chỉ đạo xử lý.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            {selectedDisputeArea?.details && selectedDisputeArea.details.length > 0 ? (
              selectedDisputeArea.details.map((d) => (
                <div
                  key={d.id}
                  className="border border-border rounded-md p-3 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{d.subject}</span>
                    <span className="text-xs text-muted-foreground">Mã vụ: {d.id}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Loại vụ: {d.type} • Ngày tiếp nhận: {d.submittedAt}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Trạng thái: {d.status}
                  </span>
                  {d.parties && (
                    <span className="text-xs text-muted-foreground">
                      Các bên liên quan: {d.parties}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Chưa có dữ liệu chi tiết cho khu vực này.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedDisputeArea(null)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
