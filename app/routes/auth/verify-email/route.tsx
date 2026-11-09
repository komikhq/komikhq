import type { Route } from "./+types/route";
import { VerifyEmailCard } from "./_components/verify-email-card";
import { SITE_NAME } from "@/constants";

export function meta(): Route.MetaDescriptors {
  return [
    { title: `Verify Email | ${SITE_NAME}` },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function VerifyEmailRoute() {
  return <VerifyEmailCard />;
}

