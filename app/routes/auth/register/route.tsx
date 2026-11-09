import type { Route } from "./+types/route";
import { RegisterFormCard } from "./_components/register-form-card";
import { SITE_NAME } from "@/constants";

export function meta(): Route.MetaDescriptors {
  return [
    { title: `Create Account | ${SITE_NAME}` },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function RegisterRoute() {
  return <RegisterFormCard />;
}

