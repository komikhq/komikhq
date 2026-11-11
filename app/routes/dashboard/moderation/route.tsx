import { AdminGuard } from "@/routes/dashboard/_components/admin-guard"
import { ModerationTableSection } from "@/routes/dashboard/moderation/_components/moderation-table-section"

export default function DashboardModerationRoute() {
  return (
    <AdminGuard>
      <ModerationTableSection />
    </AdminGuard>
  )
}

