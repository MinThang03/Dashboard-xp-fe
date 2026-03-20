'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Shield, Check, X, Edit2, Save, Plus, Trash2 } from 'lucide-react';

// Fake data for role permissions
const rolePermissions = {
  ADMIN: {
    name: 'Quản trị viên',
    color: 'bg-red-500/10 text-red-700 border-red-200',
    permissions: [
      'Quản lý người dùng',
      'Cấu hình hệ thống',
      'Xem báo cáo',
      'Quản lý quyền',
      'Quản lý ngân sách',
      'Xem lịch sử',
      'Quản lý hồ sơ',
      'Xóa dữ liệu',
    ],
  },
  LANHDAO: {
    name: 'Lãnh đạo',
    color: 'bg-purple-500/10 text-purple-700 border-purple-200',
    permissions: [
      'Xem bảng điều khiển',
      'Phê duyệt hồ sơ',
      'Xem báo cáo',
      'Gửi thông báo',
      'Quản lý cảnh báo',
      'Xem lịch sử',
    ],
  },
  CANBO: {
    name: 'Cán bộ chuyên môn',
    color: 'bg-blue-500/10 text-blue-700 border-blue-200',
    permissions: [
      'Xử lý hồ sơ',
      'Upload tài liệu',
      'Xem báo cáo cá nhân',
      'Gửi phản ánh',
      'Quản lý hồ sơ',
    ],
  },
  CONGDAN: {
    name: 'Công dân',
    color: 'bg-green-500/10 text-green-700 border-green-200',
    permissions: [
      'Nộp hồ sơ',
      'Tra cứu hồ sơ',
      'Đánh giá dịch vụ',
      'Gửi phản ánh',
    ],
  },
};

const allAvailablePermissions = [
  'Quản lý người dùng',
  'Cấu hình hệ thống',
  'Xem báo cáo',
  'Quản lý quyền',
  'Quản lý ngân sách',
  'Xem lịch sử',
  'Quản lý hồ sơ',
  'Xóa dữ liệu',
  'Xem bảng điều khiển',
  'Phê duyệt hồ sơ',
  'Gửi thông báo',
  'Quản lý cảnh báo',
  'Xử lý hồ sơ',
  'Upload tài liệu',
  'Xem báo cáo cá nhân',
  'Gửi phản ánh',
  'Nộp hồ sơ',
  'Tra cứu hồ sơ',
  'Đánh giá dịch vụ',
];

interface RolePermissionsState {
  [key: string]: string[];
}

interface RoleData {
  [key: string]: {
    name: string;
    color: string;
    permissions: string[];
  };
}

export default function RolesPage() {
  const [roleData, setRoleData] = useState<RoleData>(rolePermissions);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<RolePermissionsState>(
    Object.fromEntries(
      Object.entries(rolePermissions).map(([key, val]) => [key, val.permissions])
    )
  );
  const [addRoleDialogOpen, setAddRoleDialogOpen] = useState(false);
  const [newRoleForm, setNewRoleForm] = useState({
    name: '',
    selectedPermissions: [] as string[],
  });

  // Get all unique permissions
  const allPermissions = Array.from(
    new Set(Object.values(roleData).flatMap(r => r.permissions))
  );

  const handlePermissionToggle = (roleKey: string, permission: string) => {
    setPermissions(prev => {
      const rolePerms = prev[roleKey] || [];
      if (rolePerms.includes(permission)) {
        return {
          ...prev,
          [roleKey]: rolePerms.filter(p => p !== permission),
        };
      } else {
        return {
          ...prev,
          [roleKey]: [...rolePerms, permission],
        };
      }
    });
  };

  const handleSave = (roleKey: string) => {
    console.log(`Saved permissions for ${roleKey}:`, permissions[roleKey]);
    setEditingRole(null);
  };

  const handleAddRole = () => {
    if (newRoleForm.name.trim()) {
      const roleKey = newRoleForm.name
        .toUpperCase()
        .replace(/\s+/g, '_')
        .replace(/[^A-Z0-9_]/g, '');

      const colorOptions = [
        'bg-orange-500/10 text-orange-700 border-orange-200',
        'bg-pink-500/10 text-pink-700 border-pink-200',
        'bg-indigo-500/10 text-indigo-700 border-indigo-200',
        'bg-cyan-500/10 text-cyan-700 border-cyan-200',
        'bg-teal-500/10 text-teal-700 border-teal-200',
      ];
      const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];

      const newRole = {
        name: newRoleForm.name,
        color: randomColor,
        permissions: newRoleForm.selectedPermissions,
      };

      setRoleData(prev => ({
        ...prev,
        [roleKey]: newRole,
      }));

      setPermissions(prev => ({
        ...prev,
        [roleKey]: newRoleForm.selectedPermissions,
      }));

      console.log('Added new role:', roleKey, newRole);

      // Reset form
      setNewRoleForm({ name: '', selectedPermissions: [] });
      setAddRoleDialogOpen(false);
    }
  };

  const handleNewRolePermissionToggle = (permission: string) => {
    setNewRoleForm(prev => {
      const selected = prev.selectedPermissions;
      if (selected.includes(permission)) {
        return {
          ...prev,
          selectedPermissions: selected.filter(p => p !== permission),
        };
      } else {
        return {
          ...prev,
          selectedPermissions: [...selected, permission],
        };
      }
    });
  };

  const handleDeleteRole = (roleKey: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vai trò này?')) {
      setRoleData(prev => {
        const updated = { ...prev };
        delete updated[roleKey];
        return updated;
      });

      setPermissions(prev => {
        const updated = { ...prev };
        delete updated[roleKey];
        return updated;
      });

      console.log('Deleted role:', roleKey);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header with Add Button */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary p-8 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Vai trò & Quyền</h1>
            </div>
            <p className="text-white/90">Quản lý vai trò và phân quyền cho người dùng</p>
          </div>
          <Button
            onClick={() => setAddRoleDialogOpen(true)}
            className="bg-white text-primary hover:bg-white/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm vai trò
          </Button>
        </div>
      </div>

      {/* Summary */}
      <Card className="border-0 shadow-lg p-6 bg-slate-50">
        <h3 className="font-semibold mb-4">Tóm tắt quyền hạn</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(rolePermissions).map(([roleKey, roleData]) => (
            <div key={roleKey} className="p-4 bg-white rounded-lg border border-border">
              <p className="font-medium text-sm mb-2">{roleData.name}</p>
              <p className="text-2xl font-bold">
                {permissions[roleKey]?.length || 0}
              </p>
              <p className="text-xs text-muted-foreground mt-1">quyền được gán</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Role Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(roleData).map(([roleKey, roleInfo]) => {
          const isEditing = editingRole === roleKey;
          const currentPerms = permissions[roleKey] || [];

          return (
            <Card key={roleKey} className="border-0 shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${roleInfo.color}`}>
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{roleInfo.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {currentPerms.length}/{allPermissions.length} quyền
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={isEditing ? 'default' : 'outline'}
                    onClick={() => {
                      if (isEditing) {
                        handleSave(roleKey);
                      } else {
                        setEditingRole(roleKey);
                      }
                    }}
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Lưu
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Chỉnh sửa
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleDeleteRole(roleKey)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Permissions Grid */}
              <div className="space-y-3">
                {isEditing
                  ? allPermissions.map(permission => {
                      const isChecked = currentPerms.includes(permission);
                      return (
                        <div key={permission} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                          <Checkbox
                            id={`${roleKey}-${permission}`}
                            checked={isChecked}
                            disabled={!isEditing}
                            onCheckedChange={() => {
                              if (isEditing) {
                                handlePermissionToggle(roleKey, permission);
                              }
                            }}
                          />
                          <Label
                            htmlFor={`${roleKey}-${permission}`}
                            className={`cursor-pointer flex-1 text-sm ${isEditing ? 'cursor-pointer' : ''}`}
                          >
                            {permission}
                          </Label>
                          {isChecked && !isEditing && (
                            <Check className="w-4 h-4 text-green-600" />
                          )}
                          {!isChecked && !isEditing && (
                            <X className="w-4 h-4 text-slate-300" />
                          )}
                        </div>
                      );
                    })
                  : currentPerms.slice(0, 5).map(permission => (
                      <div key={permission} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                        <Check className="w-4 h-4 text-green-600" />
                        <Label className="cursor-pointer flex-1 text-sm">
                          {permission}
                        </Label>
                      </div>
                    ))}
                
                {!isEditing && currentPerms.length > 5 && (
                  <div className="px-3 py-2 text-sm text-primary font-medium">
                    +{currentPerms.length - 5} quyền nữa
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="mt-6 pt-4 border-t flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Cập nhật lần cuối: Hôm nay 10:30 AM
                </span>
                <Badge className={roleInfo.color}>{roleInfo.name}</Badge>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Role Dialog */}
      <Dialog open={addRoleDialogOpen} onOpenChange={setAddRoleDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Thêm vai trò mới</DialogTitle>
            <DialogDescription>
              Nhập tên vai trò và chọn quyền cho vai trò này
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role-name">Tên vai trò *</Label>
              <Input
                id="role-name"
                placeholder="Ví dụ: Cán bộ tư pháp"
                value={newRoleForm.name}
                onChange={(e) => setNewRoleForm({ ...newRoleForm, name: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <Label>Chọn quyền cho vai trò này</Label>
              <div className="border rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
                {allAvailablePermissions.map(permission => (
                  <div key={permission} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded transition-colors">
                    <Checkbox
                      id={`new-role-${permission}`}
                      checked={newRoleForm.selectedPermissions.includes(permission)}
                      onCheckedChange={() => handleNewRolePermissionToggle(permission)}
                    />
                    <Label
                      htmlFor={`new-role-${permission}`}
                      className="cursor-pointer flex-1 text-sm"
                    >
                      {permission}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddRoleDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddRole}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm vai trò
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
