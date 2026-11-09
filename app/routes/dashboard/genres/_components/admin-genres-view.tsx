import { AdminGuard } from "@/routes/dashboard/_components/admin-guard"
import { GenreTableSection } from "./genre-table-section"

export function AdminGenresView() {
  return (
    <AdminGuard>
      <GenreTableSection />
    </AdminGuard>
  )
}
