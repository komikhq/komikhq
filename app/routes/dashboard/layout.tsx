import { Outlet, useLocation } from "react-router";
import type { Route } from "./+types/layout";
import { AdminTabNav, type AdminTabNavProps } from "@/routes/dashboard/_components/admin-tab-nav";
import { AdminFooter } from "@/routes/dashboard/_components/admin-footer";
import { SITE_NAME } from "@/constants";
import { requireAdmin } from "@/lib/auth-server";

export async function loader({ request }: Route.LoaderArgs) {
  const sessionData = await requireAdmin(request);
  return { user: sessionData.user };
}

export function meta(): Route.MetaDescriptors {
  return [
    { title: `Admin Dashboard & Control Panel | ${SITE_NAME}` },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function DashboardLayout() {
  const location = useLocation();
  const path = location.pathname;

  let currentTab: AdminTabNavProps["currentTab"] = "overview";
  if (path.includes("/dashboard/users")) currentTab = "users";
  else if (path.includes("/dashboard/comics")) currentTab = "comics";
  else if (path.includes("/dashboard/genres")) currentTab = "genres";
  else if (path.includes("/dashboard/moderation")) currentTab = "moderation";
  else if (path.includes("/dashboard/analytics")) currentTab = "analytics";
  else if (path.includes("/dashboard/settings")) currentTab = "settings";

  return (
    <div className="flex w-full flex-col gap-6 px-4 pt-4 pb-20 sm:px-6 lg:px-8">
      <AdminTabNav currentTab={currentTab} />
      <Outlet />
      <AdminFooter />
    </div>
  );
}

