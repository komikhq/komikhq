import React, { useState } from "react";
import { PaperPlaneRight, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CommentInputProps {
  placeholder?: string;
  parentId?: string | null;
  replyToName?: string | null;
  onSubmit: (content: string, parentId?: string | null) => Promise<void>;
  onCancelReply?: () => void;
  autoFocus?: boolean;
}

export function CommentInput({
  placeholder = "Tulis komentar Anda...",
  parentId,
  replyToName,
  onSubmit,
  onCancelReply,
  autoFocus = false,
}: CommentInputProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit(content.trim(), parentId);
      setContent("");
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
      <Textarea
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        autoFocus={autoFocus}
        className="bg-neutral-950 border-neutral-800 text-neutral-100 placeholder:text-neutral-500 min-h-[80px] text-sm focus:border-primary"
      />
      <div className="flex justify-end gap-2">
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
        <Button type="submit" size="sm" disabled={!content.trim() || isSubmitting} className="text-xs">
          <PaperPlaneRight className="mr-1.5 h-3.5 w-3.5" />
          {isSubmitting ? "Mengirim..." : "Kirim Komentar"}
        </Button>
      </div>
    </form>
  );
}
