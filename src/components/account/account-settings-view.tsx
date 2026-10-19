import { AuthGuard } from "@/components/auth/auth-guard"
import { AccountThemeCard } from "./account-theme-card"
import { AccountPreferencesCard } from "./account-preferences-card"
import { AccountPasswordCard } from "./account-password-card"
import { AccountDangerZoneCard } from "./account-danger-zone-card"

export function AccountSettingsView() {
  return (
    <AuthGuard>
      <div className="flex w-full flex-col gap-6">
        <AccountThemeCard />
        <AccountPreferencesCard />
        <AccountPasswordCard />
        <AccountDangerZoneCard />
      </div>
    </AuthGuard>
  )
}
