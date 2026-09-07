import React, { useState, useEffect } from "react";
import { ChatDots, Trash, Check, ArrowClockwise, ShieldWarning } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { API_ROUTES } from "@/constants";
import { apiFetch } from "@/lib/api-client";

interface ReportItem {
  id: string;
  commentId: string;
  reason: string;
  details?: string | null;
  status: "PENDING" | "RESOLVED" | "DISMISSED";
  createdAt: string;
  reporterName: string;
  commentContent?: string | null;
  commentIsDeleted?: boolean;
}

export function AdminModerationCard() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("PENDING");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const res = await apiFetch(API_ROUTES.ADMIN.REPORTS(1, 50, filterStatus));
      setReports(res.reports || []);
    } catch {
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filterStatus]);

  const handleAction = async (reportId: string, action: "delete_comment" | "dismiss") => {
    try {
      setProcessingId(reportId);
      await apiFetch(API_ROUTES.ADMIN.RESOLVE_REPORT(reportId), {
        method: "POST",
        body: JSON.stringify({ action }),
      });
      fetchReports();
    } catch (err: any) {
      alert(err.message || "Gagal memproses laporan");
    } finally {
      setProcessingId(null);
    }
  };

  const getReasonBadge = (reason: string) => {
    switch (reason) {
      case "SPAM":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">Spam</Badge>;
      case "HARASSMENT":
        return <Badge variant="outline" className="bg-rose-500/10 text-rose-400 border-rose-500/30">Pelecehan/SARA</Badge>;
      case "SPOILER":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">Spoiler</Badge>;
      case "NSFW":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">NSFW</Badge>;
      default:
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">Lainnya</Badge>;
    }
  };

  return (
    <Card className="border-border/60 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border/60">
        <div>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <ChatDots className="h-5 w-5 text-primary" />
            <span>Moderasi Komentar & Laporan</span>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-1">
            Tinjau dan ambil tindakan terhadap komentar yang dilaporkan oleh pengguna.
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={fetchReports} disabled={isLoading} className="h-8 gap-1.5 text-xs">
          <ArrowClockwise className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </Button>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Filter Bar */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground font-medium">Filter Status:</span>
          {["PENDING", "RESOLVED", "DISMISSED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                filterStatus === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* List Reports */}
        {isLoading ? (
          <div className="space-y-3 py-6 text-center text-xs text-muted-foreground">
            Memuat daftar laporan...
          </div>
        ) : reports.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground space-y-1">
            <ShieldWarning className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
            <p className="font-semibold text-foreground">Tidak Ada Laporan</p>
            <p>Belum ada laporan komentar dalam kategori ini.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-xl border border-border/60 bg-card hover:bg-accent/30 transition-colors space-y-3 text-xs"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    {getReasonBadge(report.reason)}
                    <span className="text-muted-foreground">
                      Dilaporkan oleh <strong className="text-foreground">{report.reporterName}</strong>
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(report.createdAt).toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-muted/60 border border-border/40 space-y-1">
                  <p className="text-[11px] font-semibold text-muted-foreground">Isi Komentar yang Dilaporkan:</p>
                  <p className="text-foreground italic">
                    {report.commentIsDeleted ? (
                      <span className="text-muted-foreground">[Telah dihapus]</span>
                    ) : (
                      `"${report.commentContent || "-"}"`
                    )}
                  </p>
                </div>

                {report.details && (
                  <p className="text-muted-foreground">
                    <strong>Catatan Pelapor:</strong> {report.details}
                  </p>
                )}

                {report.status === "PENDING" && !report.commentIsDeleted && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction(report.id, "dismiss")}
                      disabled={processingId === report.id}
                      className="h-7 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Abaikan Laporan
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleAction(report.id, "delete_comment")}
                      disabled={processingId === report.id}
                      className="h-7 text-xs"
                    >
                      <Trash className="mr-1 h-3 w-3" />
                      Hapus Komentar
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
