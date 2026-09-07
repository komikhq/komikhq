import React, { useState } from "react";
import { Warning, X, PaperPlaneRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CommentReportModalProps {
  commentId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details?: string, guestInfo?: { guestName?: string; guestEmail?: string }) => Promise<void>;
  isLoggedIn?: boolean;
}

const REPORT_REASONS = [
  { id: "SPAM", label: "Spam atau Iklan Promosi" },
  { id: "HARASSMENT", label: "Ujaran Kebencian / Pelecehan / SARA" },
  { id: "SPOILER", label: "Spoiler Alur Cerita Tanpa Tag Sensor" },
  { id: "NSFW", label: "Konten Dewasa / Tidak Layak" },
  { id: "OTHER", label: "Lainnya (Jelaskan di bawah)" },
];

export function CommentReportModal({
  commentId,
  isOpen,
  onClose,
  onSubmit,
  isLoggedIn = false,
}: CommentReportModalProps) {
  const [selectedReason, setSelectedReason] = useState("SPAM");
  const [details, setDetails] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!isLoggedIn && (!guestName.trim() || !guestEmail.trim())) {
      alert("Nama dan Email wajib diisi untuk mengirim laporan!");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(selectedReason, details.trim() || undefined, {
        guestName: !isLoggedIn ? guestName.trim() : undefined,
        guestEmail: !isLoggedIn ? guestEmail.trim() : undefined,
      });
      onClose();
    } catch (err: any) {
      alert(err.message || "Gagal mengirim laporan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-2xl text-neutral-100 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
            <Warning className="h-5 w-5 shrink-0" />
            <span>Laporkan Komentar</span>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {!isLoggedIn && (
            <div className="space-y-2">
              <p className="font-semibold text-neutral-300">Identitas Pelapor (Guest)</p>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="text"
                  placeholder="Nama Anda*"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                  className="bg-neutral-950 border-neutral-800 text-xs h-8"
                />
                <Input
                  type="email"
                  placeholder="Email Anda*"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  required
                  className="bg-neutral-950 border-neutral-800 text-xs h-8"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="font-semibold text-neutral-300">Pilih Alasan Pelaporan:</p>
            <div className="space-y-1.5">
              {REPORT_REASONS.map((r) => (
                <label
                  key={r.id}
                  className="flex items-center gap-2 p-2 rounded-lg border border-neutral-800 hover:bg-neutral-850 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r.id}
                    checked={selectedReason === r.id}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="accent-primary"
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-neutral-300">Penjelasan Tambahan (Opsional):</label>
            <Textarea
              placeholder="Berikan keterangan detail jika diperlukan..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="bg-neutral-950 border-neutral-800 text-xs min-h-[60px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
              Batal
            </Button>
            <Button type="submit" size="sm" variant="destructive" disabled={isSubmitting}>
              <PaperPlaneRight className="mr-1.5 h-3.5 w-3.5" />
              {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
