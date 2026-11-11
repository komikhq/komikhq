import type { Route } from "./+types/route";
import { ResetPasswordCard } from "./_components/reset-password-card";
import { SITE_NAME } from "@/constants";

export function meta(): Route.MetaDescriptors {
  return [
    { title: `Reset Password | ${SITE_NAME}` },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function ResetPasswordRoute() {
  return <ResetPasswordCard />;
}

