import React, { useState } from "react";
import { Gear, HardDrives, EnvelopeSimple, Broom, CircleNotch } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function AdminPlatformSettingsCard() {
  const [purging, setPurging] = useState(false);

  const getApiUrl = () => (window as any).__PUBLIC_API_URL__ || "http://localhost:8787";

  const handlePurgeOrphans = async () => {
    setPurging(true);
    try {
      const res = await fetch(`${getApiUrl()}/v1/admin/storage/purge-orphans`, {
        method: "POST",
        credentials: "include",
      });

      const data: any = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || `Berhasil membersihkan ${data.purgedCount} file sampah (${data.totalSizeMB} MB).`);
      } else {
        toast.error(data.error || "Gagal melakukan pembersihan storage R2.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan jaringan saat memproses pembersihan.");
    } finally {
      setPurging(false);
    }
  };

  return (
    <div className="space-y-6">
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

      {/* Manual Storage Purge Card */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
            <Broom className="h-5 w-5 text-amber-500" />
            <span>Pembersihan Manual Storage R2 (Purge Orphan Images)</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Hapus file gambar terisolasi/sampah di Cloudflare R2 yang tidak lagi terhubung ke database akibat pengunggahan yang terputus atau chapter yang dihapus.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-xs">
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-1.5">
            <p className="font-semibold text-amber-600 dark:text-amber-400">
              💡 Pembersihan Hemat Kuota (Manual Trigger Only)
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Fungsi ini tidak berjalan secara otomatis via Cron agar tidak menguras kuota R2 Class A Operations Anda. Eksekusi hanya ketika Anda baru saja mengalami masalah koneksi saat mengunggah komik.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="destructive"
              size="sm"
              className="gap-2 text-xs"
              disabled={purging}
              onClick={handlePurgeOrphans}
            >
              {purging ? (
                <>
                  <CircleNotch className="h-4 w-4 animate-spin" />
                  <span>Memindai & Membersihkan...</span>
                </>
              ) : (
                <>
                  <Broom className="h-4 w-4" />
                  <span>Purge File Gambar Sampah</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
