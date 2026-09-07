import React from "react";
import { AdminGuard } from "./AdminGuard";
import { AdminStatsOverviewCard } from "./AdminStatsOverviewCard";

export function AdminOverviewView() {
  return (
    <AdminGuard>
      <div className="flex flex-col gap-6 w-full">
        <AdminStatsOverviewCard />
      </div>
    </AdminGuard>
  );
}
