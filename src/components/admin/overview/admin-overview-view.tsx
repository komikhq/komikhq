import { AdminGuard } from "../common/admin-guard"
import { AdminStatsOverviewCard } from "./admin-stats-overview-card"

export function AdminOverviewView() {
  return (
    <AdminGuard>
      <div className="flex w-full flex-col gap-6">
        <AdminStatsOverviewCard />
      </div>
    </AdminGuard>
  )
}
