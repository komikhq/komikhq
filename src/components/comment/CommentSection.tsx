import React, { useState, useEffect } from "react";
import { ChatCircleText } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommentInput } from "./CommentInput";
import { CommentTreeItem, type CommentData } from "./CommentTreeItem";
import { API_ROUTES } from "@/constants";
import { apiFetch } from "@/lib/api-client";

interface CommentSectionProps {
  comicId?: string;
  chapterId?: string;
}

export function CommentSection({ comicId, chapterId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = () => {
    if (!comicId && !chapterId) return;
    setIsLoading(true);

    apiFetch(API_ROUTES.COMMENTS.LIST({ comicId, chapterId }))
      .then((data) => {
        const rawList: CommentData[] = data.comments || [];
        setComments(buildCommentTree(rawList));
      })
      .catch(() => setComments([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchComments();
  }, [comicId, chapterId]);

  const buildCommentTree = (flatList: CommentData[]): CommentData[] => {
    const map = new Map<string, CommentData>();
    const roots: CommentData[] = [];

    flatList.forEach((item) => {
      map.set(item.id, { ...item, replies: [] });
    });

    flatList.forEach((item) => {
      const node = map.get(item.id)!;
      if (item.parentId && map.has(item.parentId)) {
        map.get(item.parentId)!.replies!.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  const handlePostComment = async (content: string, parentId?: string | null) => {
    await apiFetch(API_ROUTES.COMMENTS.ADD, {
      method: "POST",
      body: JSON.stringify({
        comicId: comicId || null,
        chapterId: chapterId || null,
        parentId: parentId || null,
        content,
      }),
    });
    fetchComments();
  };

  return (
    <Card className="border-neutral-800 bg-neutral-900 text-neutral-100">
      <CardHeader className="border-b border-neutral-800">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <ChatCircleText className="h-5 w-5 text-primary" />
          <span>Komentar</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <CommentInput onSubmit={handlePostComment} />

        {isLoading ? (
          <div className="space-y-4 pt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-neutral-800 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-800 rounded w-1/4" />
                  <div className="h-3 bg-neutral-800 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-xs text-neutral-500 py-6">
            Belum ada komentar. Jadilah yang pertama memberikan komentar!
          </p>
        ) : (
          <div className="space-y-6 pt-2">
            {comments.map((comment) => (
              <CommentTreeItem
                key={comment.id}
                comment={comment}
                onSubmitReply={handlePostComment}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
