import type { Route } from "./+types/route";
import { BookmarkHeader } from "./_components/bookmark-header";
import { BookmarkComicGrid } from "./_components/bookmark-comic-grid";
import { SITE_NAME } from "@/constants";
import { requireUser } from "@/lib/auth-server";

export async function loader({ request }: Route.LoaderArgs) {
  const sessionData = await requireUser(request);
  return { user: sessionData.user };
}

export function meta(): Route.MetaDescriptors {
  return [
    { title: `My Bookmarks | ${SITE_NAME}` },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function BookmarksRoute() {
  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 px-4 pt-4 pb-20">
      <BookmarkHeader />
      <BookmarkComicGrid />
    </div>
  );
}

