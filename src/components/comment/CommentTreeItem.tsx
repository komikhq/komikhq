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
  isLoggedIn?: boolean;
}

export function CommentTreeItem({ comment, onSubmitReply, isLoggedIn = false }: CommentTreeItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const [isLiked, setIsLiked] = useState(false);

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

  const formattedDate = new Date(comment.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="group/item relative space-y-3">
      <div className="flex gap-3 items-start">
        <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 shrink-0 overflow-hidden">
          {comment.author.image ? (
            <img src={comment.author.image} alt={comment.author.name} className="w-full h-full object-cover" />
          ) : (
            <User className="h-4 w-4 text-neutral-400" />
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-semibold text-neutral-200">{comment.author.name}</span>
            {comment.author.isGuest && (
              <span className="bg-neutral-800 text-neutral-400 text-[10px] px-1.5 py-0.5 rounded border border-neutral-700">
                Guest
              </span>
            )}
            {comment.replyToUser?.name && (
              <span className="text-primary font-medium flex items-center gap-1">
                <span>Replying to</span>
                <span className="underline">@{comment.replyToUser.name}</span>
              </span>
            )}
            <span className="text-[11px] text-neutral-500">{formattedDate}</span>
          </div>

          <div className="text-sm text-neutral-300 leading-relaxed break-words">
            {comment.isDeleted ? (
              <span className="italic text-neutral-500">[Komentar ini telah dihapus]</span>
            ) : (
              <SpoilerText text={comment.content} isSpoilerComment={comment.isSpoiler} />
            )}
          </div>

          <div className="flex items-center gap-4 pt-1 text-xs">
            <button
              onClick={handleToggleLike}
              className={`flex items-center gap-1 transition-colors ${
                isLiked ? "text-primary font-semibold" : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <ThumbsUp className={`h-3.5 w-3.5 ${isLiked ? "fill-current" : ""}`} />
              <span>{likeCount}</span>
            </button>

            <button
              onClick={() => setIsReplying((prev) => !prev)}
              className="flex items-center gap-1 text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <ChatCircleText className="h-3.5 w-3.5" />
              <span>Balas</span>
            </button>
          </div>
        </div>
      </div>

      {isReplying && (
        <div className="ml-11 mt-2">
          <CommentInput
            placeholder={`Balas @${comment.author.name}...`}
            parentId={comment.id}
            replyToName={comment.author.name}
            onSubmit={onSubmitReply}
            onCancelReply={() => setIsReplying(false)}
            autoFocus
          />
        </div>
      )}

      {/* Visual Tree Line for Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-4 pl-4 border-l-2 border-neutral-800 space-y-4 pt-2">
          {comment.replies.map((reply) => (
            <CommentTreeItem
              key={reply.id}
              comment={reply}
              onSubmitReply={onSubmitReply}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      )}
    </div>
  );
}
