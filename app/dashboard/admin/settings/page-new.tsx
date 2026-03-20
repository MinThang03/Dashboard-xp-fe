'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  Settings,
  Save,
  Globe,
  Mail,
  Bell,
  Shield,
  Palette,
  Database,
  Key,
} from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Smart Dashboard Dashboard',
    siteUrl: 'https://ubnd.example.vn',
    adminEmail: 'admin@ubnd.vn',
    enableNotifications: true,
    enableEmail: true,
    maintenanceMode: false,
    autoBackup: true,
    sessionTimeout: 30,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Cài đặt Hệ thống
        </h1>
        <p className="text-muted-foreground mt-1">
          Cấu hình và tùy chỉnh hệ thống
        </p>
      </div>

      {/* General Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/20 rounded-lg">
            <Globe className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Cài đặt chung</h3>
            <p className="text-sm text-muted-foreground">Thông tin cơ bản về hệ thống</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Tên hệ thống
            </label>
            <Input
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              URL hệ thống
            </label>
            <Input
              value={settings.siteUrl}
              onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Email quản trị
            </label>
            <Input
              type="email"
              value={settings.adminEmail}
              onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
            />
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <Bell className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Thông báo</h3>
            <p className="text-sm text-muted-foreground">Cài đặt thông báo và cảnh báo</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
            <div>
              <p className="font-medium text-foreground">Bật thông báo</p>
              <p className="text-sm text-muted-foreground">Nhận thông báo trong ứng dụng</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, enableNotifications: !settings.enableNotifications })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.enableNotifications ? 'bg-primary' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.enableNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
            <div>
              <p className="font-medium text-foreground">Bật email thông báo</p>
              <p className="text-sm text-muted-foreground">Gửi thông báo qua email</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, enableEmail: !settings.enableEmail })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.enableEmail ? 'bg-primary' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.enableEmail ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-500/20 rounded-lg">
            <Shield className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Bảo mật</h3>
            <p className="text-sm text-muted-foreground">Cài đặt bảo mật hệ thống</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
            <div>
              <p className="font-medium text-foreground">Chế độ bảo trì</p>
              <p className="text-sm text-muted-foreground">Tạm ngưng truy cập hệ thống</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Thời gian timeout phiên (phút)
            </label>
            <Input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
            />
          </div>
        </div>
      </Card>

      {/* Database Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-500/20 rounded-lg">
            <Database className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Cơ sở dữ liệu</h3>
            <p className="text-sm text-muted-foreground">Quản lý và sao lưu dữ liệu</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
            <div>
              <p className="font-medium text-foreground">Tự động sao lưu</p>
              <p className="text-sm text-muted-foreground">Sao lưu dữ liệu hàng ngày</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, autoBackup: !settings.autoBackup })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoBackup ? 'bg-primary' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              Sao lưu ngay
            </Button>
            <Button variant="outline" className="flex-1">
              Khôi phục
            </Button>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Hủy</Button>
        <Button className="bg-primary gap-2">
          <Save className="w-4 h-4" />
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
}
