import React from "react";
import { Gear, HardDrives, EnvelopeSimple, ShieldCheck } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function AdminPlatformSettingsCard() {
  return (
    <Card className="border-border/60 shadow-xs">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Gear className="h-5 w-5 text-primary" />
          <span>Pengaturan Platform & Layanan Backend</span>
        </CardTitle>
        <CardDescription className="text-xs">
          Konfigurasi umum aplikasi, penyedia email verifikasi, dan status penyimpanan media.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 text-xs">
        <div className="space-y-2">
          <label className="font-semibold block text-foreground">Nama Platform</label>
          <Input defaultValue="KomikHQ - Platform Baca Komik Digital" className="h-9 text-xs" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-border/60 bg-muted/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold flex items-center gap-1.5">
                <EnvelopeSimple className="h-4 w-4 text-sky-500" />
                <span>Resend Email API</span>
              </span>
              <Badge variant="secondary" className="text-[10px] text-emerald-500 bg-emerald-500/10">Active</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Pengiriman email verifikasi registrasi dan reset password.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/60 bg-muted/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold flex items-center gap-1.5">
                <HardDrives className="h-4 w-4 text-purple-500" />
                <span>Cloudflare R2 Bucket</span>
              </span>
              <Badge variant="secondary" className="text-[10px] text-emerald-500 bg-emerald-500/10">Connected</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Penyimpanan gambar avatar pengguna dan media komik.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button size="sm">Simpan Konfigurasi</Button>
        </div>
      </CardContent>
    </Card>
  );
}
