'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  Filter,
  RefreshCw,
  Download,
  User,
  MapPin,
  Calendar,
} from 'lucide-react';
import { fetchLeaderDashboardData, FALLBACK_LEADER_DATA, type LeaderDashboardData } from '@/lib/leader-live-data';
import { Alert, FieldStats } from '@/lib/leader-data';
import {
  ALERT_PERIOD_LABELS,
  ALERT_RISK_LABELS,
  type AlertPeriod,
  type AlertRiskLevel,
  filterOperationalAlerts,
} from '@/lib/frontend-dss';

const FIELD_CODE_BY_NAME: Record<string, string> = {
  tu_phap: 'TU_PHAP',
  hanh_chinh: 'TU_PHAP',
  y_te: 'Y_TE_GD',
  giao_duc: 'Y_TE_GD',
  kinh_te: 'KINH_TE',
  thuong_mai: 'KINH_TE',
  an_ninh: 'AN_NINH',
  quoc_phong: 'AN_NINH',
  xay_dung: 'XAY_DUNG',
  ha_tang: 'XAY_DUNG',
  lao_dong: 'LAO_DONG',
  tbxh: 'LAO_DONG',
  tai_chinh: 'TAI_CHINH',
  dia_chinh: 'DIA_CHINH',
  moi_truong: 'MOI_TRUONG',
  van_hoa: 'VAN_HOA',
  du_lich: 'VAN_HOA',
};

function normalizeAscii(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function mapFieldCodeFromModule(value?: string): string {
  if (!value) return 'TU_PHAP';
  const normalized = normalizeAscii(value).replace(/\s+/g, '_');

  if (normalized.includes('tu_phap') || normalized.includes('hanh_chinh')) return 'TU_PHAP';
  if (normalized.includes('y_te') || normalized.includes('giao_duc') || normalized.includes('tram_y_te')) return 'Y_TE_GD';
  if (normalized.includes('kinh_te') || normalized.includes('thuong_mai') || normalized.includes('ho_kinh_doanh')) return 'KINH_TE';
  if (normalized.includes('an_ninh') || normalized.includes('quoc_phong') || normalized.includes('trat_tu')) return 'AN_NINH';
  if (normalized.includes('xay_dung') || normalized.includes('ha_tang') || normalized.includes('quy_hoach')) return 'XAY_DUNG';
  if (normalized.includes('lao_dong') || normalized.includes('tbxh') || normalized.includes('ho_ngheo')) return 'LAO_DONG';
  if (normalized.includes('tai_chinh') || normalized.includes('ngan_sach')) return 'TAI_CHINH';
  if (normalized.includes('dia_chinh') || normalized.includes('dat_dai') || normalized.includes('so_do')) return 'DIA_CHINH';
  if (normalized.includes('moi_truong') || normalized.includes('o_nhiem') || normalized.includes('rac_thai')) return 'MOI_TRUONG';
  if (normalized.includes('van_hoa') || normalized.includes('du_lich') || normalized.includes('di_tich')) return 'VAN_HOA';

  return FIELD_CODE_BY_NAME[normalized] || 'TU_PHAP';
}

function mapAlertType(value: string): Alert['type'] {
  if (value === 'danger') return 'critical';
  if (value === 'warning') return 'warning';
  return 'info';
}

function buildFieldNameMap(fields: FieldStats[]): Map<string, string> {
  return new Map(fields.map((field) => [field.code, field.name]));
}

function buildAlertsFromData(data: LeaderDashboardData, fieldByCode: Map<string, string>): Alert[] {
  const today = new Date().toISOString().slice(0, 10);
  const systemAlerts = data.systemAlerts.map((item) => {
    const fieldCode = mapFieldCodeFromModule(item.module);
    const fieldName = fieldByCode.get(fieldCode) || item.module;
    const createdDate = item.timestamp ? item.timestamp.slice(0, 10) : today;
    const countSuffix = item.count ? ` (${item.count} trường hợp)` : '';

    return {
      id: item.id,
      type: mapAlertType(item.type),
      fieldCode,
      fieldName,
      title: item.title,
      description: `${item.description}${countSuffix}`,
      department: item.module,
      createdDate,
      status: item.priority === 'high' ? 'new' : 'processing',
      priority: item.priority === 'high' ? 'high' : item.priority === 'medium' ? 'medium' : 'low',
    } as Alert;
  });

  const hotspotAlerts = data.hotspots.map((hotspot, index) => {
    const fieldCode = mapFieldCodeFromModule(hotspot.module);
    const fieldName = fieldByCode.get(fieldCode) || hotspot.module || 'An ninh';
    const severity = hotspot.severity || 'low';
    const type = severity === 'high' ? 'critical' : severity === 'medium' ? 'warning' : 'info';
    const priority = severity === 'high' ? 'high' : severity === 'medium' ? 'medium' : 'low';
    const hotspotId = Number(hotspot.id);
    const id = Number.isFinite(hotspotId) ? hotspotId + 10000 : 10000 + index;
    const description = hotspot.description
      ? hotspot.description
      : `Ghi nhận ${hotspot.reportCount} phản ánh tại ${hotspot.location || 'địa bàn'}.`;

    return {
      id,
      type,
      fieldCode,
      fieldName,
      title: `Điểm nóng: ${hotspot.name}`,
      description,
      department: hotspot.location || hotspot.module || fieldName,
      createdDate: today,
      status: 'new',
      priority,
    } as Alert;
  });

  const merged = [...hotspotAlerts, ...systemAlerts];
  const priorityWeight = { high: 3, medium: 2, low: 1 } as const;
  return merged.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
}

const FALLBACK_FIELD_MAP = buildFieldNameMap(FALLBACK_LEADER_DATA.fieldStatistics);
const FALLBACK_ALERTS = buildAlertsFromData(FALLBACK_LEADER_DATA, FALLBACK_FIELD_MAP);

export function AlertsManagementPage() {
  const [alerts, setAlerts] = useState<Alert[]>(() => FALLBACK_ALERTS);
  const [fields, setFields] = useState<FieldStats[]>(FALLBACK_LEADER_DATA.fieldStatistics);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [filterPeriod, setFilterPeriod] = useState<AlertPeriod>('30d');
  const [filterRisk, setFilterRisk] = useState<AlertRiskLevel | 'all'>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterField, setFilterField] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  useEffect(() => {
    let active = true;

    const loadAlerts = async () => {
      setIsLoading(true);
      try {
        const data = await fetchLeaderDashboardData();
        if (!active) return;
        const nextFieldMap = buildFieldNameMap(data.fieldStatistics);
        setFields(data.fieldStatistics);
        setAlerts(buildAlertsFromData(data, nextFieldMap));
      } catch {
        if (!active) return;
        setFields(FALLBACK_LEADER_DATA.fieldStatistics);
        setAlerts(FALLBACK_ALERTS);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadAlerts();
    return () => {
      active = false;
    };
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const data = await fetchLeaderDashboardData(true);
      const nextFieldMap = buildFieldNameMap(data.fieldStatistics);
      setFields(data.fieldStatistics);
      setAlerts(buildAlertsFromData(data, nextFieldMap));
    } catch {
      setFields(FALLBACK_LEADER_DATA.fieldStatistics);
      setAlerts(FALLBACK_ALERTS);
    } finally {
      setIsLoading(false);
    }
  };

  // Statistics
  const stats = {
    total: alerts.length,
    critical: alerts.filter((a) => a.type === 'critical').length,
    warning: alerts.filter((a) => a.type === 'warning').length,
    info: alerts.filter((a) => a.type === 'info').length,
    new: alerts.filter((a) => a.status === 'new').length,
    processing: alerts.filter((a) => a.status === 'processing').length,
    resolved: alerts.filter((a) => a.status === 'resolved').length,
  };

  // Filter alerts
  const commonFilteredAlerts = filterOperationalAlerts(alerts, {
    period: filterPeriod,
    risk: filterRisk,
  });

  const filteredAlerts = commonFilteredAlerts.filter((alert) => {
    const matchType = filterType === 'all' || alert.type === filterType;
    const matchField = filterField === 'all' || alert.fieldCode === filterField;
    const matchStatus = filterStatus === 'all' || alert.status === filterStatus;
    return matchType && matchField && matchStatus;
  });

  const handleUpdateStatus = (alertId: number, newStatus: 'new' | 'processing' | 'resolved') => {
    const updatedAlerts = alerts.map((alert) =>
      alert.id === alertId ? { ...alert, status: newStatus } : alert
    );
    setAlerts(updatedAlerts);
    setSelectedAlert(null);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return {
          bg: 'bg-status-danger/10',
          border: 'border-status-danger/30',
          text: 'text-status-danger',
          badge: 'bg-status-danger/20 text-status-danger',
        };
      case 'warning':
        return {
          bg: 'bg-status-warning/10',
          border: 'border-status-warning/30',
          text: 'text-status-warning',
          badge: 'bg-status-warning/20 text-status-warning',
        };
      default:
        return {
          bg: 'bg-primary/10',
          border: 'border-primary/30',
          text: 'text-primary',
          badge: 'bg-primary/20 text-primary',
        };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="destructive">Mới</Badge>;
      case 'processing':
        return <Badge className="bg-primary/20 text-primary">Đang xử lý</Badge>;
      case 'resolved':
        return <Badge className="bg-status-success/20 text-status-success">Đã xử lý</Badge>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Ưu tiên cao</Badge>;
      case 'medium':
        return <Badge className="bg-status-warning/20 text-status-warning">Ưu tiên trung bình</Badge>;
      default:
        return <Badge variant="secondary">Ưu tiên thấp</Badge>;
    }
  };

  return (
    <div className="space-y-4 px-4 py-4 sm:space-y-5 sm:px-5 lg:space-y-6 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cảnh báo & Điểm nóng</h1>
          <p className="text-muted-foreground mt-1">
            Theo dõi và xử lý các cảnh báo, vấn đề cần chú ý
          </p>
        </div>
        <div className="flex w-full flex-wrap gap-2 xl:w-auto xl:flex-nowrap">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Tổng số</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-status-danger/20 bg-status-danger/10">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Nghiêm trọng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-status-danger">{stats.critical}</div>
          </CardContent>
        </Card>
        <Card className="border-status-warning/20 bg-status-warning/10">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Cảnh báo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-status-warning">{stats.warning}</div>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/10">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs flex items-center gap-1">
              <Info className="w-3 h-3" />
              Thông tin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.info}</div>
          </CardContent>
        </Card>
        <Card className="border-status-danger/30">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Mới</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-status-danger">{stats.new}</div>
          </CardContent>
        </Card>
        <Card className="border-primary/30">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Đang xử lý</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.processing}</div>
          </CardContent>
        </Card>
        <Card className="border-status-success/30">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Đã xử lý</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-status-success">{stats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
        <Select value={filterPeriod} onValueChange={(v) => setFilterPeriod(v as AlertPeriod)}>
          <SelectTrigger className="w-full xl:w-[180px]">
            <SelectValue placeholder="Thời gian" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ALERT_PERIOD_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterRisk} onValueChange={(v) => setFilterRisk(v as AlertRiskLevel | 'all')}>
          <SelectTrigger className="w-full xl:w-[180px]">
            <SelectValue placeholder="Mức độ rủi ro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả mức độ</SelectItem>
            {Object.entries(ALERT_RISK_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full xl:w-[180px]">
            <SelectValue placeholder="Loại cảnh báo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="critical">Nghiêm trọng</SelectItem>
            <SelectItem value="warning">Cảnh báo</SelectItem>
            <SelectItem value="info">Thông tin</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterField} onValueChange={setFilterField}>
          <SelectTrigger className="w-full xl:w-[200px]">
            <SelectValue placeholder="Lĩnh vực" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả lĩnh vực</SelectItem>
            {fields.map((field) => (
              <SelectItem key={field.id} value={field.code}>
                {field.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full xl:w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="new">Mới</SelectItem>
            <SelectItem value="processing">Đang xử lý</SelectItem>
            <SelectItem value="resolved">Đã xử lý</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alerts List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tất cả ({stats.total})</TabsTrigger>
          <TabsTrigger value="critical">Nghiêm trọng ({stats.critical})</TabsTrigger>
          <TabsTrigger value="warning">Cảnh báo ({stats.warning})</TabsTrigger>
          <TabsTrigger value="new">Mới ({stats.new})</TabsTrigger>
        </TabsList>

        {(['all', 'critical', 'warning', 'new'] as const).map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <div className="grid gap-4">
              {filteredAlerts
                .filter((alert) => {
                  if (tab === 'all') return true;
                  if (tab === 'new') return alert.status === 'new';
                  return alert.type === tab;
                })
                .map((alert) => {
                  const colors = getAlertColor(alert.type);
                  return (
                    <Card
                      key={alert.id}
                      className={`${colors.bg} ${colors.border} border-2 cursor-pointer hover:shadow-md transition-all`}
                      onClick={() => setSelectedAlert(alert)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={colors.text}>{getAlertIcon(alert.type)}</div>
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge className={colors.badge}>
                                  {alert.type === 'critical' && ALERT_RISK_LABELS.critical}
                                  {alert.type === 'warning' && ALERT_RISK_LABELS.warning}
                                  {alert.type === 'info' && ALERT_RISK_LABELS.info}
                                </Badge>
                                {getStatusBadge(alert.status)}
                                {getPriorityBadge(alert.priority)}
                                <Badge variant="outline">{alert.fieldName}</Badge>
                              </div>
                              <CardTitle className={`text-lg ${colors.text}`}>
                                {alert.title}
                              </CardTitle>
                              <CardDescription className="text-sm">
                                {alert.description}
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span>{alert.department}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>{alert.createdDate}</span>
                            </div>
                            {alert.dueDate && (
                              <div className="flex items-center gap-2 text-amber-600 font-medium">
                                <Clock className="w-4 h-4" />
                                <span>Hạn: {alert.dueDate}</span>
                              </div>
                            )}
                            {alert.assignedTo && (
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span>{alert.assignedTo}</span>
                              </div>
                            )}
                          </div>
                          <Button size="sm" variant="outline">
                            Xem chi tiết
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Alert Detail Dialog */}
      {selectedAlert && (
        <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className={getAlertColor(selectedAlert.type).badge}>
                    {selectedAlert.type === 'critical' && ALERT_RISK_LABELS.critical}
                    {selectedAlert.type === 'warning' && ALERT_RISK_LABELS.warning}
                    {selectedAlert.type === 'info' && ALERT_RISK_LABELS.info}
                  </Badge>
                  {getStatusBadge(selectedAlert.status)}
                  {getPriorityBadge(selectedAlert.priority)}
                  <Badge variant="outline">{selectedAlert.fieldName}</Badge>
                </div>
                <DialogTitle className="text-2xl">{selectedAlert.title}</DialogTitle>
                <DialogDescription className="text-base">
                  {selectedAlert.description}
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Information Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Lĩnh vực</label>
                  <div className="mt-1 font-semibold">{selectedAlert.fieldName}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phòng ban</label>
                  <div className="mt-1 font-semibold">{selectedAlert.department}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ngày phát hiện</label>
                  <div className="mt-1 font-semibold">{selectedAlert.createdDate}</div>
                </div>
                {selectedAlert.dueDate && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Hạn xử lý</label>
                    <div className="mt-1 font-semibold text-amber-600">
                      {selectedAlert.dueDate}
                    </div>
                  </div>
                )}
                {selectedAlert.assignedTo && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Người phụ trách
                    </label>
                    <div className="mt-1 font-semibold">{selectedAlert.assignedTo}</div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Trạng thái</label>
                  <div className="mt-1">{getStatusBadge(selectedAlert.status)}</div>
                </div>
              </div>

              {/* Action Note */}
              {selectedAlert.status !== 'resolved' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Ghi chú xử lý</label>
                  <Textarea placeholder="Nhập ghi chú về cách xử lý..." rows={4} />
                </div>
              )}
            </div>

            <DialogFooter>
              {selectedAlert.status !== 'resolved' && (
                <div className="flex gap-2 w-full justify-end">
                  <Button variant="outline" onClick={() => setSelectedAlert(null)}>
                    Đóng
                  </Button>
                  {selectedAlert.status === 'new' && (
                    <Button onClick={() => handleUpdateStatus(selectedAlert.id, 'processing')}>
                      <Clock className="w-4 h-4 mr-2" />
                      Bắt đầu xử lý
                    </Button>
                  )}
                  {selectedAlert.status === 'processing' && (
                    <Button onClick={() => handleUpdateStatus(selectedAlert.id, 'resolved')}>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Đánh dấu đã xử lý
                    </Button>
                  )}
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
