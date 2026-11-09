import { AdminGuard } from "@/routes/dashboard/_components/admin-guard"
import { AdminUserManagementCard } from "./admin-user-management-card"

export function AdminUsersView() {
  return (
    <AdminGuard>
      <AdminUserManagementCard />
    </AdminGuard>
  )
}
