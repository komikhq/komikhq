import React from "react";
import { AdminGuard } from "../AdminGuard";
import { AdminComicDetailHeader } from "./AdminComicDetailHeader";
import { ChapterTableSection } from "./ChapterTableSection";

interface AdminComicDetailViewProps {
  comicId: string;
}

export function AdminComicDetailView({ comicId }: AdminComicDetailViewProps) {
  return (
    <AdminGuard>
      <div className="space-y-6">
        <AdminComicDetailHeader comicId={comicId} />
        <ChapterTableSection comicId={comicId} />
      </div>
    </AdminGuard>
  );
}
