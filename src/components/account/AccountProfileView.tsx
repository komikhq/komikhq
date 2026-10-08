import React from "react"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { AccountProfileCard } from "./AccountProfileCard"
import { AccountIdentityCard } from "./AccountIdentityCard"

export function AccountProfileView() {
  return (
    <AuthGuard>
      <div className="flex w-full flex-col gap-6">
        <AccountProfileCard />
        <AccountIdentityCard />
      </div>
    </AuthGuard>
  )
}
