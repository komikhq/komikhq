import type { Route } from "./+types/route";
import { LoginFormCard } from "./_components/login-form-card";
import { SITE_NAME } from "@/constants";
import { requireGuest } from "@/lib/auth-server";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirectTo") || "/account";
  await requireGuest(request, redirectTo);
  return null;
}

export function meta(): Route.MetaDescriptors {
  return [
    { title: `Sign In | ${SITE_NAME}` },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function LoginRoute() {
  return <LoginFormCard />;
}

