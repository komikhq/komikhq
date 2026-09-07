import React, { useState } from "react";
import { PaperPlaneRight, X, EyeClosed } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface CommentInputProps {
  placeholder?: string;
  parentId?: string | null;
  replyToName?: string | null;
  onSubmit: (
    content: string,
    parentId?: string | null,
    guestInfo?: { guestName?: string; guestEmail?: string; isSpoiler?: boolean }
  ) => Promise<void>;
  onCancelReply?: () => void;
  autoFocus?: boolean;
  isLoggedIn?: boolean;
}

export function CommentInput({
  placeholder = "Tulis komentar Anda...",
  parentId,
  replyToName,
  onSubmit,
  onCancelReply,
  autoFocus = false,
  isLoggedIn = false,
}: CommentInputProps) {
  const [content, setContent] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load guest info from localStorage if not logged in
  React.useEffect(() => {
    if (!isLoggedIn && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("komikhq_guest_info");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.guestName) setGuestName(parsed.guestName);
          if (parsed.guestEmail) setGuestEmail(parsed.guestEmail);
        }
      } catch {
        // Ignore parsing errors
      }
    }
  }, [isLoggedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    if (!isLoggedIn && (!guestName.trim() || !guestEmail.trim())) {
      alert("Nama dan Email wajib diisi untuk mengirim komentar sebagai Guest!");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Save guest info to localStorage for future comments
      if (!isLoggedIn && typeof window !== "undefined") {
        try {
          localStorage.setItem(
            "komikhq_guest_info",
            JSON.stringify({
              guestName: guestName.trim(),
              guestEmail: guestEmail.trim(),
            })
          );
        } catch {
          // Ignore localStorage errors
        }
      }

      await onSubmit(content.trim(), parentId, {
        guestName: !isLoggedIn ? guestName.trim() : undefined,
        guestEmail: !isLoggedIn ? guestEmail.trim() : undefined,
        isSpoiler,
      });
      setContent("");
      setIsSpoiler(false);
      if (onCancelReply) onCancelReply();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {replyToName && (
        <div className="flex items-center justify-between bg-primary/10 px-3 py-1.5 rounded-md border border-primary/20 text-xs text-primary font-medium">
          <span>Membalas @{replyToName}</span>
          {onCancelReply && (
            <button
              type="button"
              onClick={onCancelReply}
              className="hover:opacity-75 transition-opacity"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}

      {!isLoggedIn && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Input
            type="text"
            placeholder="Nama Anda (Guest)*"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
            className="bg-muted/40 border-border text-foreground placeholder:text-muted-foreground text-xs h-9 focus:border-primary"
          />
          <Input
            type="email"
            placeholder="Email Anda (Guest)*"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            required
            className="bg-muted/40 border-border text-foreground placeholder:text-muted-foreground text-xs h-9 focus:border-primary"
          />
        </div>
      )}

      <Textarea
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        autoFocus={autoFocus}
        className="bg-muted/40 border-border text-foreground placeholder:text-muted-foreground min-h-[80px] text-sm focus:border-primary"
      />

      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors">
          <input
            type="checkbox"
            checked={isSpoiler}
            onChange={(e) => setIsSpoiler(e.target.checked)}
            className="rounded border-border bg-muted/40 text-primary focus:ring-0 focus:ring-offset-0 h-3.5 w-3.5 accent-primary"
          />
          <EyeClosed className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Mengandung Spoiler</span>
        </label>

        <div className="flex items-center gap-2">
          {onCancelReply && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancelReply}
              disabled={isSubmitting}
              className="text-xs text-neutral-400"
            >
              Batal
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            disabled={!content.trim() || isSubmitting || (!isLoggedIn && (!guestName.trim() || !guestEmail.trim()))}
            className="text-xs"
          >
            <PaperPlaneRight className="mr-1.5 h-3.5 w-3.5" />
            {isSubmitting ? "Mengirim..." : "Kirim Komentar"}
          </Button>
        </div>
      </div>
    </form>
  );
}
