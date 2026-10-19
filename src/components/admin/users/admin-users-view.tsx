import { AdminGuard } from "../common/admin-guard"
import { AdminUserManagementCard } from "./admin-user-management-card"

export function AdminUsersView() {
  return (
    <AdminGuard>
      <AdminUserManagementCard />
    </AdminGuard>
  )
}
