'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Search, 
  Plus, 
  Download, 
  FileText,
  TrendingUp,
  Users,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Filter,
  X,
  ArrowLeft,
  Home,
} from 'lucide-react';

interface PageProps {
  title: string;
  description: string;
  gradientColors: string;
  icon: any;
  stats: Array<{
    label: string;
    value: string | number;
    color: string;
    icon: any;
  }>;
  tableHeaders?: string[];
  sampleData?: any[];
}

export function ModulePageTemplate({ 
  title, 
  description, 
  gradientColors, 
  icon: Icon,
  stats,
  tableHeaders = ['Mã', 'Tiêu đề', 'Trạng thái', 'Ngày tạo'],
  sampleData = []
}: PageProps) {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const handleView = (item: any) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsEditOpen(true);
  };

  const handleDelete = (item: any) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleExportExcel = () => {
    alert('Xuất Excel - Tính năng đang phát triển');
  };

  const handleExportPDF = () => {
    alert('Xuất PDF - Tính năng đang phát triển');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Home className="w-4 h-4" />
            Bàn làm việc
          </button>
          <span>/</span>
          <span className="text-foreground font-medium">{title}</span>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
      </div>

      {/* Header */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradientColors} p-8 text-white`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Icon className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">{title}</h1>
              </div>
              <p className="text-white/90">{description}</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setIsCreateOpen(true)} className="bg-white text-primary hover:bg-white/90">
                <Plus className="w-4 h-4 mr-2" />
                Tạo mới
              </Button>
              <Button onClick={handleExportExcel} className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0">
                <Download className="w-4 h-4 mr-2" />
                Xuất Excel
              </Button>
              <Button onClick={handleExportPDF} className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0">
                <FileText className="w-4 h-4 mr-2" />
                Xuất PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const StatIcon = stat.icon;
          return (
            <Card key={index} className="p-6 border-0 shadow-lg hover-lift">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-3 ${stat.color}/10 rounded-xl`}>
                  <StatIcon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Search & Filters */}
      <Card className="p-4 border-0 shadow-lg">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-10 h-11 bg-slate-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              className="h-11 px-4 border border-input rounded-lg bg-slate-50"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="pending">Chờ xử lý</option>
              <option value="completed">Hoàn thành</option>
            </select>
            <Button variant="outline" className="h-11">
              <Filter className="w-4 h-4 mr-2" />
              Lọc nâng cao
            </Button>
          </div>
          
          {/* Advanced Filters */}
          <div className="flex gap-4 pt-2 border-t">
            <div className="flex-1">
              <Label className="text-xs mb-1">Từ ngày</Label>
              <Input 
                type="date" 
                className="h-9 bg-slate-50"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label className="text-xs mb-1">Đến ngày</Label>
              <Input 
                type="date" 
                className="h-9 bg-slate-50"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setDateFrom('');
                  setDateTo('');
                }}
              >
                <X className="w-4 h-4 mr-1" />
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Content */}
      <Card className="p-6 border-0 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Danh sách</h3>
          <Badge className="bg-primary/10 text-primary border-0">
            Tổng: {sampleData.length || 0}
          </Badge>
        </div>
        
        {sampleData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold min-w-[100px]">Mã</th>
                  <th className="text-left p-4 font-semibold">Tiêu đề</th>
                  <th className="text-left p-4 font-semibold min-w-[120px]">Trạng thái</th>
                  <th className="text-left p-4 font-semibold min-w-[120px]">Ngày tạo</th>
                  <th className="text-right p-4 font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <span className="font-semibold text-primary">{item.id || `#${index + 1}`}</span>
                    </td>
                    <td className="p-4">{item.title || item.name || '-'}</td>
                    <td className="p-4">
                      <Badge className="bg-green-500/10 text-green-700 border-0">
                        {item.status || 'Hoạt động'}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{item.date || '2024-01-18'}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleView(item)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-500"
                          onClick={() => handleDelete(item)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Chưa có dữ liệu</p>
            <Button className="mt-4" onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm mới
            </Button>
          </div>
        )}
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tạo mới {title}</DialogTitle>
            <DialogDescription>
              Điền thông tin để tạo mới
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tiêu đề *</Label>
              <Input placeholder="Nhập tiêu đề..." />
            </div>
            <div className="space-y-2">
              <Label>Mô tả</Label>
              <Textarea placeholder="Nhập mô tả..." rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <select className="w-full h-10 px-3 border border-input rounded-lg">
                  <option>Đang hoạt động</option>
                  <option>Chờ xử lý</option>
                  <option>Hoàn thành</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Ngày tạo</Label>
                <Input type="date" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Hủy</Button>
            <Button onClick={() => {
              alert('Tạo mới thành công!');
              setIsCreateOpen(false);
            }}>Tạo mới</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết {title}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Mã</Label>
                  <p className="font-semibold">{selectedItem.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Trạng thái</Label>
                  <Badge className="bg-green-500/10 text-green-700 border-0 mt-1">
                    {selectedItem.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Tiêu đề</Label>
                <p className="font-semibold">{selectedItem.title}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Thông tin</Label>
                <p>{selectedItem.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Ngày tạo</Label>
                <p>{selectedItem.date}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa {title}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Tiêu đề *</Label>
                <Input defaultValue={selectedItem.title} />
              </div>
              <div className="space-y-2">
                <Label>Thông tin</Label>
                <Input defaultValue={selectedItem.name} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <select className="w-full h-10 px-3 border border-input rounded-lg" defaultValue={selectedItem.status}>
                    <option>Đang hoạt động</option>
                    <option>Chờ xử lý</option>
                    <option>Hoàn thành</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Ngày</Label>
                  <Input type="date" defaultValue={selectedItem.date} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Hủy</Button>
            <Button onClick={() => {
              alert('Cập nhật thành công!');
              setIsEditOpen(false);
            }}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa mục này không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="py-4">
              <p className="text-sm">
                <span className="font-semibold">Mã:</span> {selectedItem.id}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Tiêu đề:</span> {selectedItem.title}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Hủy</Button>
            <Button variant="destructive" onClick={() => {
              alert('Đã xóa thành công!');
              setIsDeleteOpen(false);
            }}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ModulePageTemplate;
