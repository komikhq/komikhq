import React from "react"
import { AdminGuard } from "../common/AdminGuard"
import { AdminUserManagementCard } from "./AdminUserManagementCard"

export function AdminUsersView() {
  return (
    <AdminGuard>
      <AdminUserManagementCard />
    </AdminGuard>
  )
}
