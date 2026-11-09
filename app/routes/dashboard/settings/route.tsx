import { AdminGuard } from "@/components/admin/common/admin-guard";
import { SettingsDiagnosticsCard } from "@/components/admin/settings/settings-diagnostics-card";
import { SettingsSyncViewsCard } from "@/components/admin/settings/settings-sync-views-card";
import { SettingsSearchCacheCard } from "@/components/admin/settings/settings-search-cache-card";
import { SettingsR2PurgeCard } from "@/components/admin/settings/settings-r2-purge-card";

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

