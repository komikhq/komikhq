import type { Route } from "./+types/route";
import { BookmarkHeader } from "@/components/bookmark/bookmark-header";
import { BookmarkComicGrid } from "@/components/bookmark/bookmark-comic-grid";
import { SITE_NAME } from "@/constants";

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

