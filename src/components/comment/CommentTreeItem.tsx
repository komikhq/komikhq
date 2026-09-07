import React, { useState } from "react";
import { ThumbsUp, ChatCircleText, User } from "@phosphor-icons/react";
import { CommentInput } from "./CommentInput";
import { SpoilerText } from "./SpoilerText";
import { API_ROUTES } from "@/constants";
import { apiFetch } from "@/lib/api-client";

export interface CommentData {
  id: string;
  comicId?: string;
  chapterId?: string;
  rootId?: string | null;
  parentId?: string | null;
  depth: number;
  content: string;
  isSpoiler?: boolean;
  likeCount: number;
  replyCount: number;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: string;
  author: {
    id?: string | null;
    name: string;
    image?: string | null;
    isGuest?: boolean;
  };
  replyToUser?: {
    id: string;
    name: string;
  } | null;
  replies?: CommentData[];
}

interface CommentTreeItemProps {
  comment: CommentData;
  onSubmitReply: (
    content: string,
    parentId?: string | null,
    guestInfo?: { guestName?: string; guestEmail?: string; isSpoiler?: boolean }
  ) => Promise<void>;
  onDeleteComment?: (commentId: string) => Promise<void>;
  onOpenReportModal?: (commentId: string) => void;
  isLoggedIn?: boolean;
  currentUserId?: string | null;
  isAdmin?: boolean;
}

export function CommentTreeItem({
  comment,
  onSubmitReply,
  onDeleteComment,
  onOpenReportModal,
  isLoggedIn = false,
  currentUserId = null,
  isAdmin = false,
}: CommentTreeItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwnerOrAdmin = isAdmin || (currentUserId && comment.author?.id === currentUserId);

  const handleToggleLike = async () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikeCount((prev) => (nextState ? prev + 1 : prev - 1));

    try {
      await apiFetch(API_ROUTES.COMMENTS.LIKE(comment.id), { method: "POST" });
    } catch {
      // Rollback on failure
      setIsLiked(!nextState);
      setLikeCount((prev) => (nextState ? prev - 1 : prev + 1));
    }
  };

  const handleDelete = async () => {
    if (!onDeleteComment || isDeleting) return;
    if (!confirm("Apakah Anda yakin ingin menghapus komentar ini?")) return;

    try {
      setIsDeleting(true);
      await onDeleteComment(comment.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedDate = new Date(comment.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const authorName = comment.author?.name || "Guest";
  const authorImage = comment.author?.image || null;
  const isGuestAuthor = comment.author?.isGuest ?? (!comment.author?.id);

  return (
    <div className="group/item relative space-y-3">
      <div className="flex gap-3 items-start">
        <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground shrink-0 overflow-hidden">
          {authorImage ? (
            <img src={authorImage} alt={authorName} className="w-full h-full object-cover" />
          ) : (
            <User className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-semibold text-foreground">{authorName}</span>
            {isGuestAuthor && (
              <span className="bg-muted text-muted-foreground text-[10px] px-1.5 py-0.5 rounded border border-border font-medium">
                Guest
              </span>
            )}
            {comment.replyToUser?.name && (
              <span className="text-primary font-medium flex items-center gap-1">
                <span>Replying to</span>
                <span className="underline">@{comment.replyToUser.name}</span>
              </span>
            )}
            <span className="text-[11px] text-muted-foreground">{formattedDate}</span>
          </div>

          <div className="text-sm text-foreground/90 leading-relaxed break-words">
            {comment.isDeleted ? (
              <span className="italic text-muted-foreground">[Komentar ini telah dihapus]</span>
            ) : (
              <SpoilerText text={comment.content} isSpoilerComment={comment.isSpoiler} />
            )}
          </div>

          <div className="flex items-center gap-4 pt-1 text-xs">
            <button
              onClick={handleToggleLike}
              className={`flex items-center gap-1 transition-colors ${
                isLiked ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ThumbsUp className={`h-3.5 w-3.5 ${isLiked ? "fill-current" : ""}`} />
              <span>{likeCount}</span>
            </button>

            <button
              onClick={() => setIsReplying((prev) => !prev)}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChatCircleText className="h-3.5 w-3.5" />
              <span>Balas</span>
            </button>

            {onOpenReportModal && !comment.isDeleted && (
              <button
                onClick={() => onOpenReportModal(comment.id)}
                className="text-muted-foreground/70 hover:text-amber-500 transition-colors text-[11px]"
              >
                Laporkan
              </button>
            )}

            {isOwnerOrAdmin && !comment.isDeleted && onDeleteComment && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-muted-foreground/70 hover:text-rose-500 transition-colors text-[11px]"
              >
                {isDeleting ? "Menghapus..." : "Hapus"}
              </button>
            )}
          </div>
        </div>
      </div>

      {isReplying && (
        <div className="ml-11 mt-2">
          <CommentInput
            placeholder={`Balas @${authorName}...`}
            parentId={comment.id}
            replyToName={authorName}
            onSubmit={onSubmitReply}
            onCancelReply={() => setIsReplying(false)}
            autoFocus
            isLoggedIn={isLoggedIn}
          />
        </div>
      )}

      {/* Visual Tree Line for Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-4 pl-4 border-l-2 border-border space-y-4 pt-2">
          {comment.replies.map((reply) => (
            <CommentTreeItem
              key={reply.id}
              comment={reply}
              onSubmitReply={onSubmitReply}
              onDeleteComment={onDeleteComment}
              onOpenReportModal={onOpenReportModal}
              isLoggedIn={isLoggedIn}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
}
