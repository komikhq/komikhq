import React from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AccountThemeCard } from "./AccountThemeCard";
import { AccountPreferencesCard } from "./AccountPreferencesCard";
import { AccountPasswordCard } from "./AccountPasswordCard";
import { AccountDangerZoneCard } from "./AccountDangerZoneCard";

export function AccountSettingsView() {
  return (
    <AuthGuard>
      <div className="flex flex-col gap-6 w-full">
        <AccountThemeCard />
        <AccountPreferencesCard />
        <AccountPasswordCard />
        <AccountDangerZoneCard />
      </div>
    </AuthGuard>
  );
}
