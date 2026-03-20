'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Bell, User, RotateCw, Upload, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);
  const [autoUpdateInterval, setAutoUpdateInterval] = useState(5);
  const [avatar, setAvatar] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=admin');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [tempAvatar, setTempAvatar] = useState(avatar);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Auto-update data every 5 minutes
  useEffect(() => {
    if (!autoUpdateEnabled) return;

    const interval = setInterval(() => {
      setLastUpdated(new Date());
      console.log(`Auto-updated data at ${new Date().toLocaleTimeString()}`);
    }, autoUpdateInterval * 60 * 1000);

    return () => clearInterval(interval);
  }, [autoUpdateEnabled, autoUpdateInterval]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTempAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = () => {
    setIsSaving(true);
    setTimeout(() => {
      setAvatar(tempAvatar);
      setShowAvatarDialog(false);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      console.log('Settings saved:', {
        notifications: notificationsEnabled,
        autoUpdate: autoUpdateEnabled,
        autoUpdateInterval,
      });
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary p-8 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Cài đặt hệ thống</h1>
          </div>
          <p className="text-white/90">Cấu hình các tham số và sở thích của bạn</p>
        </div>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <Check className="w-5 h-5 text-green-600" />
          <p className="text-sm text-green-700">Cài đặt đã được lưu thành công</p>
        </div>
      )}

      {/* Profile Avatar Settings */}
      <Card className="border-0 shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <User className="w-5 h-5" />
          Chỉnh sửa hồ sơ
        </h3>

        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-primary"
            />
            <Button
              size="sm"
              className="absolute bottom-0 right-0 rounded-full"
              onClick={() => setShowAvatarDialog(true)}
            >
              <Upload className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3 flex-1">
            <div>
              <Label className="text-sm text-muted-foreground">Tên đăng nhập</Label>
              <p className="font-semibold">admin@ubnd.vn</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Vai trò</Label>
              <Badge className="mt-1">Quản trị viên</Badge>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Tham gia lúc</Label>
              <p className="text-sm">15/01/2024</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="border-0 shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Thông báo
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="font-medium">Bật thông báo toàn bộ</p>
              <p className="text-sm text-muted-foreground mt-1">
                Nhận thông báo về các sự kiện quan trọng
              </p>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>

          {notificationsEnabled && (
            <div className="space-y-3 mt-4 pl-4 border-l-2 border-primary">
              <label className="flex items-center gap-3 p-3 rounded hover:bg-slate-50 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm">Thông báo hồ sơ mới</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded hover:bg-slate-50 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm">Thông báo phê duyệt</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded hover:bg-slate-50 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-sm">Thông báo hết hạn hồ sơ</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded hover:bg-slate-50 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm">Thông báo email</span>
              </label>
            </div>
          )}
        </div>
      </Card>

      {/* Auto-Update Settings */}
      <Card className="border-0 shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <RotateCw className="w-5 h-5" />
          Tự động cập nhật dữ liệu
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="font-medium">Bật tự động cập nhật</p>
              <p className="text-sm text-muted-foreground mt-1">
                Tự động làm mới dữ liệu theo định kỳ
              </p>
            </div>
            <Switch
              checked={autoUpdateEnabled}
              onCheckedChange={setAutoUpdateEnabled}
            />
          </div>

          {autoUpdateEnabled && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Label className="text-sm">Cập nhật dữ liệu mỗi (phút)</Label>
              <div className="flex gap-3 mt-3">
                <Input
                  type="number"
                  min="1"
                  max="60"
                  value={autoUpdateInterval}
                  onChange={(e) => setAutoUpdateInterval(parseInt(e.target.value) || 5)}
                  className="flex-1"
                />
                <Button variant="outline" size="sm">
                  {autoUpdateInterval} phút
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                ⏱️ Lần cập nhật cuối: {lastUpdated.toLocaleTimeString('vi-VN')}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* System Settings */}
      <Card className="border-0 shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-6">Cấu hình hệ thống</h3>

        <div className="space-y-4">
          <div>
            <Label className="text-sm">Tên hệ thống</Label>
            <Input
              defaultValue="Dashboard Xã/Phường Smart"
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">Thời gian hết hạn hồ sơ (ngày)</Label>
              <Input type="number" defaultValue="15" className="mt-2" />
            </div>
            <div>
              <Label className="text-sm">Cảnh báo trễ hạn (ngày)</Label>
              <Input type="number" defaultValue="3" className="mt-2" />
            </div>
          </div>

          <div>
            <Label className="text-sm">Email quản trị</Label>
            <Input
              type="email"
              defaultValue="admin@ubnd.vn"
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">Số hồ sơ tối đa mỗi ngày</Label>
              <Input type="number" defaultValue="100" className="mt-2" />
            </div>
            <div>
              <Label className="text-sm">Thời gian timeout (phút)</Label>
              <Input type="number" defaultValue="30" className="mt-2" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
          </Button>
          <Button variant="outline">Đặt lại mặc định</Button>
        </div>
      </Card>

      {/* Avatar Dialog */}
      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa ảnh đại diện</DialogTitle>
            <DialogDescription>
              Chọn ảnh mới từ máy tính của bạn
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-center">
              <img
                src={tempAvatar}
                alt="Avatar Preview"
                className="w-32 h-32 rounded-full border-4 border-primary"
              />
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary transition cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                id="avatar-upload"
              />
              <label htmlFor="avatar-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Nhấn để tải ảnh lên</p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG hoặc GIF (tối đa 5MB)
                </p>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAvatarDialog(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleSaveAvatar} disabled={isSaving}>
              {isSaving ? 'Đang lưu...' : 'Lưu ảnh'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
