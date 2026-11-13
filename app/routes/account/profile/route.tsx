import type { Route } from "./+types/route";
import { AccountProfileView } from "@/routes/account/profile/_components/account-profile-view";
import { SITE_NAME } from "@/constants";

export function meta(): Route.MetaDescriptors {
  return [
    { title: `My Profile | ${SITE_NAME}` },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function AccountProfileRoute() {
  return <AccountProfileView />;
}

