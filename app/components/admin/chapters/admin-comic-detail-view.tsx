import { AdminGuard } from "../common/admin-guard"
import { AdminComicDetailHeader } from "./admin-comic-detail-header"
import { ChapterTableSection } from "./chapter-table-section"

interface AdminComicDetailViewProps {
  comicId: string
}

export function AdminComicDetailView({ comicId }: AdminComicDetailViewProps) {
  return (
    <AdminGuard>
      <div className="space-y-6">
        <AdminComicDetailHeader comicId={comicId} />
        <ChapterTableSection comicId={comicId} />
      </div>
    </AdminGuard>
  )
}
