'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function TrackPage() {
  const [caseId, setCaseId] = useState('');

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Tra cứu hồ sơ của tôi
        </h1>
        <p className="text-muted-foreground mt-1">
          Nhập mã hồ sơ để theo dõi tình trạng
        </p>
      </div>

      <Card className="bg-card border-border p-8">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Mã hồ sơ
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="HS-2024-001"
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  className="pl-10 bg-input border-border"
                />
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Tra cứu
              </Button>
            </div>
          </div>

          <div className="pt-4 text-center text-muted-foreground text-sm">
            <p>Vui lòng nhập mã hồ sơ để xem chi tiết tiến độ xử lý</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
