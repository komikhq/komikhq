import React from "react"
import { AdminGuard } from "../common/AdminGuard"
import { AdminStatsOverviewCard } from "./AdminStatsOverviewCard"

export function AdminOverviewView() {
  return (
    <AdminGuard>
      <div className="flex w-full flex-col gap-6">
        <AdminStatsOverviewCard />
      </div>
    </AdminGuard>
  )
}
