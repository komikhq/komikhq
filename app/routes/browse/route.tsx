import type { Route } from "./+types/route";
import { BrowseFilterBar } from "./_components/browse-filter-bar";
import { BrowseComicGrid } from "./_components/browse-comic-grid";
import { SITE_NAME } from "@/constants";

export function meta(): Route.MetaDescriptors {
  return [
    { title: `Browse Manga, Manhwa & Manhua | ${SITE_NAME}` },
    {
      name: "description",
      content:
        "Explore thousands of popular manga, manhwa, and manhua with complete genre and status filters on KomikHQ.",
    },
    { property: "og:title", content: `Browse Manga, Manhwa & Manhua | ${SITE_NAME}` },
    {
      property: "og:description",
      content:
        "Explore thousands of popular manga, manhwa, and manhua with complete genre and status filters on KomikHQ.",
    },
  ];
}

export default function BrowseRoute() {
  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 px-4 pt-4 pb-20">
      <BrowseFilterBar />
      <BrowseComicGrid />
    </div>
  );
}

