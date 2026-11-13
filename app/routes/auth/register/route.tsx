import type { Route } from "./+types/route";
import { RegisterFormCard } from "./_components/register-form-card";
import { SITE_NAME } from "@/constants";
import { requireGuest } from "@/lib/auth-server";

export async function loader({ request }: Route.LoaderArgs) {
  await requireGuest(request, "/account");
  return null;
}

export function meta(): Route.MetaDescriptors {
  return [
    { title: `Create Account | ${SITE_NAME}` },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function RegisterRoute() {
  return <RegisterFormCard />;
}

