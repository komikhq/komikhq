import React from "react";
import { Globe, Bell, Shield } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function AccountPreferencesCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold">Pengaturan Aplikasi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Bahasa Konten</h4>
              <p className="text-xs text-muted-foreground">Bahasa antarmuka dan metadata utama.</p>
            </div>
          </div>
          <Badge variant="outline">Bahasa Indonesia</Badge>
        </div>

        <Separator />

        <div className="flex items-center justify-between py-2">
          <div className="flex items-start gap-3">
            <Bell className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Notifikasi Bab Baru</h4>
              <p className="text-xs text-muted-foreground">Pemberitahuan saat bab komik favorit dirilis.</p>
            </div>
          </div>
          <Badge variant="secondary">Aktif</Badge>
        </div>

        <Separator />

        <div className="flex items-center justify-between py-2">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Privasi Data</h4>
              <p className="text-xs text-muted-foreground">Sinkronisasi riwayat baca dan bookmark aman.</p>
            </div>
          </div>
          <Badge variant="outline">Aktif</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
