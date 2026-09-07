import React, { useState } from "react";
import { Gear, HardDrives, EnvelopeSimple, Broom, CircleNotch } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function AdminPlatformSettingsCard() {
  const [purging, setPurging] = useState(false);
  const [lastResult, setLastResult] = useState<{
    purgedCount: number;
    totalSizeMB: string;
    timestamp: string;
  } | null>(null);

  const getApiUrl = () => (window as any).__PUBLIC_API_URL__ || "http://localhost:8787";

  const handlePurgeOrphans = async () => {
    setPurging(true);
    const toastId = toast.loading("Memindai Cloudflare R2 bucket & membandingkan dengan database...");

    try {
      const res = await fetch(`${getApiUrl()}/v1/admin/storage/purge-orphans`, {
        method: "POST",
        credentials: "include",
      });

      const data: any = await res.json();
      if (res.ok && data.success) {
        const resultObj = {
          purgedCount: data.purgedCount || 0,
          totalSizeMB: data.totalSizeMB || "0.00",
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        };
        setLastResult(resultObj);

        toast.success(
          data.message || `Berhasil membersihkan ${resultObj.purgedCount} file sampah (${resultObj.totalSizeMB} MB).`,
          { id: toastId }
        );
      } else {
        toast.error(data.error || "Gagal melakukan pembersihan storage R2.", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan jaringan saat memproses pembersihan.", { id: toastId });
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

      {/* Manual Storage Purge Card (Cloudflare Style Layout) */}
      <Card className="border-border/60 shadow-xs">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <Broom className="h-5 w-5 text-amber-500 shrink-0" />
                <h3 className="text-base font-bold text-foreground">
                  Pembersihan Manual Storage R2 (Purge Orphan Images)
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Hapus file gambar terisolasi/sampah di Cloudflare R2 yang tidak lagi terhubung ke database akibat pengunggahan yang terputus atau chapter yang dihapus.
              </p>
              <div className="pt-1 flex flex-col gap-2">
                <span className="inline-flex items-center text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md w-fit">
                  Pembersihan Manual (Hemat Kuota R2 Class A Operations)
                </span>

                {purging && (
                  <div className="p-3 rounded-xl border border-amber-500/40 bg-amber-500/10 flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-medium">
                    <CircleNotch className="h-4 w-4 animate-spin shrink-0 text-amber-500" />
                    <span className="shimmer shimmer-color-amber-500">
                      Memindai R2 bucket & membandingkan dengan 100+ record database...
                    </span>
                  </div>
                )}

                {!purging && lastResult && (
                  <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                      <span>
                        Pembersihan Selesai: {lastResult.purgedCount} file sampah terhapus ({lastResult.totalSizeMB} MB dibebaskan)
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">Pukul {lastResult.timestamp}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <Button
                variant="destructive"
                size="sm"
                className="gap-2 text-xs w-full md:w-auto shrink-0 whitespace-nowrap h-10 px-4 cursor-pointer"
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
