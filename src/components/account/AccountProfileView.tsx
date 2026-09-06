import React from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AccountProfileCard } from "./AccountProfileCard";
import { AccountIdentityCard } from "./AccountIdentityCard";

export function AccountProfileView() {
  return (
    <AuthGuard>
      <div className="flex flex-col gap-6 w-full">
        <AccountProfileCard />
        <AccountIdentityCard />
      </div>
    </AuthGuard>
  );
}
