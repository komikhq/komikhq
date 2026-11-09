import { AuthGuard } from "@/components/auth/auth-guard"
import { AccountProfileCard } from "./account-profile-card"
import { AccountIdentityCard } from "./account-identity-card"

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
