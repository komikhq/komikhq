import type { Route } from "./+types/route";
import { LoginFormCard } from "@/components/auth/login-form-card";
import { SITE_NAME } from "@/constants";

export function meta(): Route.MetaDescriptors {
  return [
    { title: `Sign In | ${SITE_NAME}` },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function LoginRoute() {
  return <LoginFormCard />;
}

