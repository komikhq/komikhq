import type { Route } from "./+types/route";
import { AccountSettingsView } from "@/routes/account/settings/_components/account-settings-view";
import { SITE_NAME } from "@/constants";

export function meta(): Route.MetaDescriptors {
  return [
    { title: `Account Settings | ${SITE_NAME}` },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function AccountSettingsRoute() {
  return <AccountSettingsView />;
}

