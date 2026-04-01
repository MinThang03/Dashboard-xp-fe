'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Bell, User, RotateCw, Upload, Check, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { systemSettingsApi } from '@/lib/api';

export default function SettingsPage() {
  const defaultAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin';
  const [settings, setSettings] = useState({
    systemName: 'Dashboard Xa/Phuong Smart',
    adminEmail: 'admin@ubnd.vn',
    defaultExpiryDays: 15,
    overdueWarningDays: 3,
    notificationsEnabled: true,
    autoUpdateEnabled: true,
    autoUpdateInterval: 5,
    avatarUrl: defaultAvatar,
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [tempAvatar, setTempAvatar] = useState(defaultAvatar);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      const result = await systemSettingsApi.get();

      if (!active) return;

      if (result?.success && result.data) {
        const data: any = result.data;
        const nextSettings = {
          systemName: data.systemName ?? data.TenHeThong ?? 'Dashboard Xa/Phuong Smart',
          adminEmail: data.adminEmail ?? data.EmailQuanTri ?? 'admin@ubnd.vn',
          defaultExpiryDays: Number(data.defaultExpiryDays ?? data.HanXuLyMacDinh ?? 15),
          overdueWarningDays: Number(data.overdueWarningDays ?? data.CanhBaoTreHan ?? 3),
          notificationsEnabled: Boolean(data.notificationsEnabled ?? data.ThongBao ?? true),
          autoUpdateEnabled: Boolean(data.autoUpdateEnabled ?? data.TuDongCapNhat ?? true),
          autoUpdateInterval: Number(data.autoUpdateInterval ?? data.ChuKyCapNhat ?? 5),
          avatarUrl: data.avatarUrl ?? data.AvatarUrl ?? defaultAvatar,
        };
        setSettings(nextSettings);
        setTempAvatar(nextSettings.avatarUrl);
      } else {
        setErrorMessage(result?.message || 'Không thể tải cài đặt hệ thống');
      }
      setIsLoading(false);
    };

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  // Auto-update data every 5 minutes
  useEffect(() => {
    if (!settings.autoUpdateEnabled) return;

    const interval = setInterval(() => {
      setLastUpdated(new Date());
      console.log(`Auto-updated data at ${new Date().toLocaleTimeString()}`);
    }, settings.autoUpdateInterval * 60 * 1000);

    return () => clearInterval(interval);
  }, [settings.autoUpdateEnabled, settings.autoUpdateInterval]);

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

  const handleSaveAvatar = async () => {
    setIsSavingAvatar(true);
    setErrorMessage(null);
    const result = await systemSettingsApi.update({ avatarUrl: tempAvatar });
    if (result?.success) {
      setSettings((prev) => ({ ...prev, avatarUrl: tempAvatar }));
      setShowAvatarDialog(false);
      setSaveMessage('Ảnh đại diện đã được cập nhật');
      setTimeout(() => setSaveMessage(null), 3000);
    } else {
      setErrorMessage(result?.message || 'Không thể lưu ảnh đại diện');
    }
    setIsSavingAvatar(false);
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    setErrorMessage(null);
    const result = await systemSettingsApi.update({
      systemName: settings.systemName,
      adminEmail: settings.adminEmail || null,
      defaultExpiryDays: settings.defaultExpiryDays,
      overdueWarningDays: settings.overdueWarningDays,
      notificationsEnabled: settings.notificationsEnabled,
      autoUpdateEnabled: settings.autoUpdateEnabled,
      autoUpdateInterval: settings.autoUpdateInterval,
      avatarUrl: settings.avatarUrl || null,
    });

    if (result?.success) {
      setSaveMessage('Cài đặt đã được lưu thành công');
      setLastUpdated(new Date());
      setTimeout(() => setSaveMessage(null), 3000);
    } else {
      setErrorMessage(result?.message || 'Không thể lưu cài đặt');
    }
    setIsSavingSettings(false);
  };

  return (
    <div className="space-y-4 px-4 py-4 sm:space-y-5 sm:px-5 lg:space-y-6 lg:px-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-secondary to-primary p-4 text-white sm:p-6 lg:p-8">
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
      {saveMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <Check className="w-5 h-5 text-green-600" />
          <p className="text-sm text-green-700">{saveMessage}</p>
        </div>
      )}

      {isLoading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
          Đang tải cài đặt hệ thống...
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-700">{errorMessage}</p>
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
              src={settings.avatarUrl}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-primary"
            />
            <Button
              size="sm"
              className="absolute bottom-0 right-0 rounded-full"
              onClick={() => {
                setTempAvatar(settings.avatarUrl);
                setShowAvatarDialog(true);
              }}
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
              checked={settings.notificationsEnabled}
              onCheckedChange={(value) =>
                setSettings((prev) => ({ ...prev, notificationsEnabled: value }))
              }
            />
          </div>

          {settings.notificationsEnabled && (
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
              checked={settings.autoUpdateEnabled}
              onCheckedChange={(value) =>
                setSettings((prev) => ({ ...prev, autoUpdateEnabled: value }))
              }
            />
          </div>

          {settings.autoUpdateEnabled && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Label className="text-sm">Cập nhật dữ liệu mỗi (phút)</Label>
              <div className="flex gap-3 mt-3">
                <Input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.autoUpdateInterval}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      autoUpdateInterval: parseInt(e.target.value) || 5,
                    }))
                  }
                  className="flex-1"
                />
                <Button variant="outline" size="sm">
                  {settings.autoUpdateInterval} phút
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
              value={settings.systemName}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, systemName: e.target.value }))
              }
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">Thời gian hết hạn hồ sơ (ngày)</Label>
              <Input
                type="number"
                value={settings.defaultExpiryDays}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    defaultExpiryDays: parseInt(e.target.value) || 0,
                  }))
                }
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-sm">Cảnh báo trễ hạn (ngày)</Label>
              <Input
                type="number"
                value={settings.overdueWarningDays}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    overdueWarningDays: parseInt(e.target.value) || 0,
                  }))
                }
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm">Email quản trị</Label>
            <Input
              type="email"
              value={settings.adminEmail}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, adminEmail: e.target.value }))
              }
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
          <Button onClick={handleSaveSettings} disabled={isSavingSettings || isLoading}>
            {isSavingSettings ? 'Đang lưu...' : 'Lưu cài đặt'}
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
            <Button onClick={handleSaveAvatar} disabled={isSavingAvatar}>
              {isSavingAvatar ? 'Đang lưu...' : 'Lưu ảnh'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
