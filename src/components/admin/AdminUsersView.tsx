import React from "react";
import { AdminGuard } from "./AdminGuard";
import { AdminUserManagementCard } from "./AdminUserManagementCard";

export function AdminUsersView() {
  return (
    <AdminGuard>
      <AdminUserManagementCard />
    </AdminGuard>
  );
}
