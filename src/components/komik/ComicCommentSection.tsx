import React from "react";
import { CommentSection } from "@/components/comment/CommentSection";
import { useComicDetail } from "@/hooks/use-comic-detail";

interface ComicCommentSectionProps {
  slug?: string;
}

export function ComicCommentSection({ slug }: ComicCommentSectionProps) {
  const { comicData, isLoading } = useComicDetail(slug);

  if (isLoading || !comicData?.comic?.id) {
    return null;
  }

  return (
    <section className="mt-2">
      <CommentSection comicId={comicData.comic.id} variant="default" />
    </section>
  );
}
