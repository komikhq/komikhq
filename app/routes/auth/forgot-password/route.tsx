import type { Route } from "./+types/route";
import { ForgotPasswordCard } from "./_components/forgot-password-card";
import { SITE_NAME } from "@/constants";

export function meta(): Route.MetaDescriptors {
  return [
    { title: `Forgot Password | ${SITE_NAME}` },
    { name: "description", content: `Reset your ${SITE_NAME} account password.` },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function ForgotPasswordRoute() {
  return <ForgotPasswordCard />;
}

