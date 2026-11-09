import type { Route } from "./+types/route";
import { HistoryHeader } from "./_components/history-header";
import { HistoryList } from "./_components/history-list";
import { SITE_NAME } from "@/constants";
import { requireUser } from "@/lib/auth-server";

export async function loader({ request }: Route.LoaderArgs) {
  const sessionData = await requireUser(request);
  return { user: sessionData.user };
}

export function meta(): Route.MetaDescriptors {
  return [
    { title: `Reading History | ${SITE_NAME}` },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function HistoryRoute() {
  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 px-4 pt-4 pb-20">
      <HistoryHeader />
      <HistoryList />
    </div>
  );
}

