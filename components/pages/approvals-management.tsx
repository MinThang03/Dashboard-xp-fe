'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Download,
  Search,
  Filter,
  AlertCircle,
  DollarSign,
} from 'lucide-react';
import { APPROVAL_CASES, ApprovalCase } from '@/lib/leader-data';

export function ApprovalsManagementPage() {
  const [cases, setCases] = useState(APPROVAL_CASES);
  const [selectedCase, setSelectedCase] = useState<ApprovalCase | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);

  // Filter cases
  const filteredCases = cases.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchPriority = filterPriority === 'all' || c.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  // Statistics
  const stats = {
    total: cases.length,
    pending: cases.filter((c) => c.status === 'pending').length,
    reviewing: cases.filter((c) => c.status === 'reviewing').length,
    approved: cases.filter((c) => c.status === 'approved').length,
    rejected: cases.filter((c) => c.status === 'rejected').length,
    critical: cases.filter((c) => c.priority === 'critical' && c.status === 'pending').length,
  };

  const handleApproval = (action: 'approve' | 'reject') => {
    setApprovalAction(action);
    setShowApprovalDialog(true);
  };

  const confirmApproval = () => {
    if (selectedCase && approvalAction) {
      const updatedCases = cases.map((c) =>
        c.id === selectedCase.id
          ? { ...c, status: approvalAction === 'approve' ? 'approved' : 'rejected' }
          : c
      );
      setCases(updatedCases as any);
      setShowApprovalDialog(false);
      setSelectedCase(null);
      setApprovalAction(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Phê duyệt & Ký số</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý và phê duyệt các hồ sơ, văn bản cần quyết định
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Lọc nâng cao
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Xuất danh sách
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Tổng số hồ sơ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Chờ phê duyệt</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Đang xem xét</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{stats.reviewing}</div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Đã phê duyệt</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Từ chối</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{stats.rejected}</div>
          </CardContent>
        </Card>
        <Card className="border-red-300 bg-red-100">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Khẩn cấp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{stats.critical}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Tìm kiếm theo số hồ sơ, tiêu đề, phòng ban..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="pending">Chờ phê duyệt</SelectItem>
            <SelectItem value="reviewing">Đang xem xét</SelectItem>
            <SelectItem value="approved">Đã phê duyệt</SelectItem>
            <SelectItem value="rejected">Từ chối</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Độ ưu tiên" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả mức độ</SelectItem>
            <SelectItem value="critical">Khẩn cấp</SelectItem>
            <SelectItem value="high">Cao</SelectItem>
            <SelectItem value="medium">Trung bình</SelectItem>
            <SelectItem value="low">Thấp</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cases List */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Chờ phê duyệt ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value="reviewing">
            Đang xem xét ({stats.reviewing})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Đã phê duyệt ({stats.approved})
          </TabsTrigger>
          <TabsTrigger value="all">Tất cả ({stats.total})</TabsTrigger>
        </TabsList>

        {(['pending', 'reviewing', 'approved', 'all'] as const).map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <div className="grid gap-4">
              {filteredCases
                .filter((c) => tab === 'all' || c.status === tab)
                .map((caseItem) => (
                  <Card
                    key={caseItem.id}
                    className={`cursor-pointer hover:shadow-md transition-all ${
                      caseItem.priority === 'critical' ? 'border-red-300' : ''
                    }`}
                    onClick={() => setSelectedCase(caseItem)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(caseItem.priority)}>
                              {caseItem.priority === 'critical' && 'Khẩn cấp'}
                              {caseItem.priority === 'high' && 'Cao'}
                              {caseItem.priority === 'medium' && 'Trung bình'}
                              {caseItem.priority === 'low' && 'Thấp'}
                            </Badge>
                            <Badge className={getStatusColor(caseItem.status)}>
                              {caseItem.status === 'pending' && 'Chờ phê duyệt'}
                              {caseItem.status === 'reviewing' && 'Đang xem xét'}
                              {caseItem.status === 'approved' && 'Đã phê duyệt'}
                              {caseItem.status === 'rejected' && 'Từ chối'}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {caseItem.caseNumber}
                            </span>
                          </div>
                          <CardTitle className="text-lg">{caseItem.title}</CardTitle>
                          <CardDescription>{caseItem.type}</CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{caseItem.fieldName}</div>
                          <div className="text-xs text-muted-foreground">{caseItem.department}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-6 text-sm">
                          <div>
                            <span className="text-muted-foreground">Người nộp:</span>
                            <span className="ml-2 font-medium">{caseItem.submittedBy}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Ngày nộp:</span>
                            <span className="ml-2 font-medium">{caseItem.submittedDate}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Hạn xử lý:</span>
                            <span className="ml-2 font-medium text-amber-600">
                              {caseItem.dueDate}
                            </span>
                          </div>
                          {caseItem.amount && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="font-medium text-green-600">
                                {(caseItem.amount / 1000000).toFixed(1)} triệu
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <FileText className="w-4 h-4 mr-2" />
                            Xem chi tiết
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Case Detail Dialog */}
      {selectedCase && (
        <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <DialogTitle className="text-2xl">{selectedCase.title}</DialogTitle>
                  <DialogDescription className="space-x-2">
                    <Badge className={getPriorityColor(selectedCase.priority)}>
                      {selectedCase.priority === 'critical' && 'Khẩn cấp'}
                      {selectedCase.priority === 'high' && 'Cao'}
                      {selectedCase.priority === 'medium' && 'Trung bình'}
                      {selectedCase.priority === 'low' && 'Thấp'}
                    </Badge>
                    <Badge className={getStatusColor(selectedCase.status)}>
                      {selectedCase.status === 'pending' && 'Chờ phê duyệt'}
                      {selectedCase.status === 'reviewing' && 'Đang xem xét'}
                      {selectedCase.status === 'approved' && 'Đã phê duyệt'}
                      {selectedCase.status === 'rejected' && 'Từ chối'}
                    </Badge>
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Case Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Số hồ sơ</label>
                  <div className="mt-1 font-semibold">{selectedCase.caseNumber}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Loại hồ sơ</label>
                  <div className="mt-1 font-semibold">{selectedCase.type}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Lĩnh vực</label>
                  <div className="mt-1 font-semibold">{selectedCase.fieldName}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phòng ban</label>
                  <div className="mt-1 font-semibold">{selectedCase.department}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Người nộp</label>
                  <div className="mt-1 font-semibold">{selectedCase.submittedBy}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ngày nộp</label>
                  <div className="mt-1 font-semibold">{selectedCase.submittedDate}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Hạn xử lý</label>
                  <div className="mt-1 font-semibold text-amber-600">{selectedCase.dueDate}</div>
                </div>
                {selectedCase.amount && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Số tiền</label>
                    <div className="mt-1 font-semibold text-green-600">
                      {selectedCase.amount.toLocaleString('vi-VN')} VNĐ
                    </div>
                  </div>
                )}
              </div>

              {/* Documents */}
              <div>
                <label className="text-sm font-medium">Tài liệu đính kèm</label>
                <div className="mt-2 space-y-2">
                  {selectedCase.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium">{doc.name}</div>
                          <div className="text-xs text-muted-foreground">{doc.size}</div>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              {selectedCase.status === 'pending' || selectedCase.status === 'reviewing' ? (
                <div className="flex gap-2 w-full justify-end">
                  <Button variant="outline" onClick={() => setSelectedCase(null)}>
                    Đóng
                  </Button>
                  <Button variant="destructive" onClick={() => handleApproval('reject')}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Từ chối
                  </Button>
                  <Button onClick={() => handleApproval('approve')}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Phê duyệt
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setSelectedCase(null)}>
                  Đóng
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Approval Confirmation Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalAction === 'approve' ? 'Xác nhận phê duyệt' : 'Xác nhận từ chối'}
            </DialogTitle>
            <DialogDescription>
              {approvalAction === 'approve'
                ? 'Bạn có chắc chắn muốn phê duyệt hồ sơ này?'
                : 'Bạn có chắc chắn muốn từ chối hồ sơ này?'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Hủy
            </Button>
            <Button
              variant={approvalAction === 'approve' ? 'default' : 'destructive'}
              onClick={confirmApproval}
            >
              {approvalAction === 'approve' ? 'Phê duyệt' : 'Từ chối'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
