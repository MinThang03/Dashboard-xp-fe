'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { vaiTroApi } from '@/lib/api';

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

const roleColorByCode: Record<string, string> = {
  ADMIN: 'bg-red-500/10 text-red-700 border-red-200',
  LANHDAO: 'bg-purple-500/10 text-purple-700 border-purple-200',
  CANBO: 'bg-blue-500/10 text-blue-700 border-blue-200',
  CONGDAN: 'bg-green-500/10 text-green-700 border-green-200',
};

const fallbackRoleColors = [
  'bg-orange-500/10 text-orange-700 border-orange-200',
  'bg-pink-500/10 text-pink-700 border-pink-200',
  'bg-indigo-500/10 text-indigo-700 border-indigo-200',
  'bg-cyan-500/10 text-cyan-700 border-cyan-200',
  'bg-teal-500/10 text-teal-700 border-teal-200',
];

interface RoleItem {
  id: number;
  name: string;
  code: string;
  description?: string | null;
  permissions?: string[] | null;
  isActive?: boolean;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [permissions, setPermissions] = useState<Record<number, string[]>>({});
  const [addRoleDialogOpen, setAddRoleDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingRoleId, setIsSavingRoleId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [newRoleForm, setNewRoleForm] = useState({
    name: '',
    selectedPermissions: [] as string[],
  });

  const loadRoles = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    const result = await vaiTroApi.getList();
    if (result?.success && Array.isArray(result.data)) {
      const mapped = result.data.map((role: any) => ({
        id: role.id ?? role.MaVaiTro,
        name: role.name ?? role.TenVaiTro,
        code: role.code ?? role.MaCode,
        description: role.description ?? role.MoTa ?? null,
        permissions: Array.isArray(role.permissions)
          ? role.permissions
          : Array.isArray(role.DanhSachQuyen)
            ? role.DanhSachQuyen
            : [],
        isActive: role.isActive ?? role.TrangThai,
      }));

      setRoles(mapped);
      setPermissions(
        Object.fromEntries(mapped.map((role) => [role.id, role.permissions ?? []]))
      );
    } else {
      setErrorMessage(result?.message || 'Không thể tải danh sách vai trò');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!active) return;
      await loadRoles();
    };
    run();
    return () => {
      active = false;
    };
  }, [loadRoles]);

  const allPermissions = useMemo(() => {
    const rolePermissions = roles.flatMap((role) => role.permissions ?? []);
    return Array.from(new Set([...allAvailablePermissions, ...rolePermissions]));
  }, [roles]);

  const handlePermissionToggle = (roleId: number, permission: string) => {
    setPermissions(prev => {
      const rolePerms = prev[roleId] || [];
      if (rolePerms.includes(permission)) {
        return {
          ...prev,
          [roleId]: rolePerms.filter(p => p !== permission),
        };
      } else {
        return {
          ...prev,
          [roleId]: [...rolePerms, permission],
        };
      }
    });
  };

  const handleSave = async (roleId: number) => {
    setIsSavingRoleId(roleId);
    const result = await vaiTroApi.update(roleId, {
      permissions: permissions[roleId] || [],
    });

    if (result?.success) {
      setEditingRoleId(null);
      await loadRoles();
    } else {
      setErrorMessage(result?.message || 'Không thể lưu quyền vai trò');
    }
    setIsSavingRoleId(null);
  };

  const handleAddRole = async () => {
    if (newRoleForm.name.trim()) {
      setIsCreating(true);
      const result = await vaiTroApi.create({
        name: newRoleForm.name.trim(),
        permissions: newRoleForm.selectedPermissions,
      });

      if (result?.success) {
        setNewRoleForm({ name: '', selectedPermissions: [] });
        setAddRoleDialogOpen(false);
        await loadRoles();
      } else {
        setErrorMessage(result?.message || 'Không thể thêm vai trò');
      }
      setIsCreating(false);
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

  const handleDeleteRole = async (roleId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa vai trò này?')) {
      return;
    }

    const result = await vaiTroApi.delete(roleId);
    if (result?.success) {
      await loadRoles();
    } else {
      setErrorMessage(result?.message || 'Không thể xóa vai trò');
    }
  };

  const getRoleColor = (role: RoleItem, index: number) => {
    return roleColorByCode[role.code] || fallbackRoleColors[index % fallbackRoleColors.length];
  };

  return (
    <div className="space-y-4 px-4 py-4 sm:space-y-5 sm:px-5 lg:space-y-6 lg:px-6">
      {/* Header with Add Button */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary p-4 text-white sm:p-6 lg:p-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Vai trò & Quyền</h1>
            </div>
            <p className="text-white/90">Quản lý vai trò và phân quyền cho người dùng</p>
          </div>
          <Button
            onClick={() => setAddRoleDialogOpen(true)}
            className="w-full bg-white text-primary hover:bg-white/90 sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm vai trò
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Summary */}
      <Card className="border-0 shadow-lg p-6 bg-slate-50">
        <h3 className="font-semibold mb-4">Tóm tắt quyền hạn</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {roles.map((role) => (
            <div key={role.id} className="p-4 bg-white rounded-lg border border-border">
              <p className="font-medium text-sm mb-2">{role.name}</p>
              <p className="text-2xl font-bold">
                {permissions[role.id]?.length || 0}
              </p>
              <p className="text-xs text-muted-foreground mt-1">quyền được gán</p>
            </div>
          ))}
          {!roles.length && !isLoading && (
            <div className="col-span-full text-sm text-muted-foreground">
              Chưa có vai trò nào. Hãy thêm vai trò mới để bắt đầu.
            </div>
          )}
        </div>
      </Card>

      {/* Role Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roles.map((role, index) => {
          const isEditing = editingRoleId === role.id;
          const currentPerms = permissions[role.id] || [];
          const roleColor = getRoleColor(role, index);

          return (
            <Card key={role.id} className="border-0 shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${roleColor}`}>
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{role.name}</h3>
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
                        handleSave(role.id);
                      } else {
                        setEditingRoleId(role.id);
                      }
                    }}
                    disabled={isSavingRoleId === role.id}
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
                    onClick={() => handleDeleteRole(role.id)}
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
                            id={`${role.id}-${permission}`}
                            checked={isChecked}
                            disabled={!isEditing}
                            onCheckedChange={() => {
                              if (isEditing) {
                                handlePermissionToggle(role.id, permission);
                              }
                            }}
                          />
                          <Label
                            htmlFor={`${role.id}-${permission}`}
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
                <Badge className={roleColor}>{role.name}</Badge>
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
            <Button onClick={handleAddRole} disabled={isCreating}>
              <Plus className="w-4 h-4 mr-2" />
              {isCreating ? 'Đang thêm...' : 'Thêm vai trò'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
