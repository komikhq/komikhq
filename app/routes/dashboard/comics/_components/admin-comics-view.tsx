import { AdminGuard } from "@/routes/dashboard/_components/admin-guard"
import { ComicTableSection } from "./comic-table-section"

export function AdminComicsView() {
  return (
    <AdminGuard>
      <ComicTableSection />
    </AdminGuard>
  )
}
