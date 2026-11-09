import { AdminGuard } from "@/routes/dashboard/_components/admin-guard";
import { SettingsDiagnosticsCard } from "@/routes/dashboard/settings/_components/settings-diagnostics-card";
import { SettingsSyncViewsCard } from "@/routes/dashboard/settings/_components/settings-sync-views-card";
import { SettingsSearchCacheCard } from "@/routes/dashboard/settings/_components/settings-search-cache-card";
import { SettingsR2PurgeCard } from "@/routes/dashboard/settings/_components/settings-r2-purge-card";

export default function DashboardSettingsRoute() {
  return (
    <AdminGuard>
      <div className="flex flex-col gap-6">
        <SettingsDiagnosticsCard />
        <SettingsSyncViewsCard />
        <SettingsSearchCacheCard />
        <SettingsR2PurgeCard />
      </div>
    </AdminGuard>
  );
}

