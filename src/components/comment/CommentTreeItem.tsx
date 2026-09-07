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
  variant?: "reader" | "default";
}

import { CommentDeleteDialog } from "./CommentDeleteDialog";

export function CommentTreeItem({
  comment,
  onSubmitReply,
  onDeleteComment,
  onOpenReportModal,
  isLoggedIn = false,
  currentUserId = null,
  isAdmin = false,
  variant = "reader",
}: CommentTreeItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const handleConfirmDelete = async () => {
    if (!onDeleteComment || isDeleting) return;

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

  const nameColor = variant === "reader" ? "text-neutral-200" : "text-foreground font-semibold";
  const textColor = variant === "reader" ? "text-neutral-300" : "text-foreground/90";
  const dateColor = variant === "reader" ? "text-neutral-500" : "text-muted-foreground";
  const guestBadgeClass =
    variant === "reader"
      ? "bg-neutral-800 text-neutral-400 border-neutral-700"
      : "bg-muted text-muted-foreground border-border";
  const actionBtnClass =
    variant === "reader"
      ? "text-neutral-400 hover:text-neutral-200"
      : "text-muted-foreground hover:text-foreground";
  const avatarBorderClass =
    variant === "reader" ? "bg-neutral-800 border-neutral-700" : "bg-muted border-border";
  const treeLineClass = variant === "reader" ? "border-neutral-800" : "border-border";

  return (
    <div className="group/item relative space-y-3">
      <div className="flex gap-3 items-start">
        <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 overflow-hidden ${avatarBorderClass}`}>
          {authorImage ? (
            <img src={authorImage} alt={authorName} className="w-full h-full object-cover" />
          ) : (
            <User className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className={nameColor}>{authorName}</span>
            {isGuestAuthor && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${guestBadgeClass}`}>
                Guest
              </span>
            )}
            {comment.replyToUser?.name && (
              <span className="text-primary font-medium flex items-center gap-1">
                <span>Replying to</span>
                <span className="underline">@{comment.replyToUser.name}</span>
              </span>
            )}
            <span className={`text-[11px] ${dateColor}`}>{formattedDate}</span>
          </div>

          <div className={`text-sm leading-relaxed break-words ${textColor}`}>
            {comment.isDeleted ? (
              <span className={`italic ${dateColor}`}>[Komentar ini telah dihapus]</span>
            ) : (
              <SpoilerText text={comment.content} isSpoilerComment={comment.isSpoiler} />
            )}
          </div>

          <div className="flex items-center gap-4 pt-1 text-xs">
            <button
              onClick={handleToggleLike}
              className={`flex items-center gap-1 transition-colors ${
                isLiked ? "text-primary font-semibold" : actionBtnClass
              }`}
            >
              <ThumbsUp className="h-3.5 w-3.5" weight={isLiked ? "fill" : "regular"} />
              <span>{likeCount}</span>
            </button>

            <button
              onClick={() => setIsReplying((prev) => !prev)}
              className={`flex items-center gap-1 transition-colors ${actionBtnClass}`}
            >
              <ChatCircleText className="h-3.5 w-3.5" />
              <span>Balas</span>
            </button>

            {onOpenReportModal && !comment.isDeleted && (
              <button
                onClick={() => onOpenReportModal(comment.id)}
                className="text-muted-foreground hover:text-amber-500 transition-colors text-[11px]"
              >
                Laporkan
              </button>
            )}

            {isOwnerOrAdmin && !comment.isDeleted && onDeleteComment && (
              <button
                onClick={() => setShowDeleteDialog(true)}
                disabled={isDeleting}
                className="text-muted-foreground hover:text-rose-500 transition-colors text-[11px]"
              >
                {isDeleting ? "Menghapus..." : "Hapus"}
              </button>
            )}
          </div>
        </div>
      </div>

      <CommentDeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

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
            variant={variant}
          />
        </div>
      )}

      {/* Visual Tree Line for Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className={`ml-4 pl-4 border-l-2 space-y-4 pt-2 ${treeLineClass}`}>
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
              variant={variant}
            />
          ))}
        </div>
      )}
    </div>
  );
}
