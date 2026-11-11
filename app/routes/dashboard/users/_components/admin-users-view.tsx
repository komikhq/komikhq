import { AdminGuard } from "@/routes/dashboard/_components/admin-guard"
import { UserTableSection } from "./user-table-section"

export function AdminUsersView() {
  return (
    <AdminGuard>
      <UserTableSection />
    </AdminGuard>
  )
}
