import { Outlet, useLocation } from "react-router";
import type { Route } from "./+types/layout";
import { AccountTabNav } from "@/routes/account/_components/account-tab-nav";
import { UserCircleIcon as UserCircle } from "@phosphor-icons/react";
import { requireUser } from "@/lib/auth-server";

export async function loader({ request }: Route.LoaderArgs) {
  const sessionData = await requireUser(request);
  return { user: sessionData.user };
}

export default function AccountLayout() {
  const location = useLocation();
  const currentTab = location.pathname.includes("/settings") ? "settings" : "profile";

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 pt-4 pb-20">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <UserCircle className="h-6 w-6 text-primary" />
            <span>Account Center</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your personal profile, credentials, and app preferences.
          </p>
        </div>

        <AccountTabNav currentTab={currentTab} />
      </div>

      <Outlet />
    </div>
  );
}
