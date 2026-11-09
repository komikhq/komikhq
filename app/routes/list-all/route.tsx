import type { Route } from "./+types/route";
import { ListAllFilterBar } from "./_components/list-all-filter-bar";
import { ListAllComicTable } from "./_components/list-all-comic-table";
import { SITE_NAME } from "@/constants";

export function meta(): Route.MetaDescriptors {
  return [
    { title: `All Comics A-Z | ${SITE_NAME}` },
    {
      name: "description",
      content:
        "Browse the complete alphabetical A to Z catalog of comics, manga, manhwa, and manhua on KomikHQ.",
    },
    { property: "og:title", content: `All Comics A-Z | ${SITE_NAME}` },
    {
      property: "og:description",
      content:
        "Browse the complete alphabetical A to Z catalog of comics, manga, manhwa, and manhua on KomikHQ.",
    },
  ];
}

export default function ListAllRoute() {
  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 px-4 pt-4 pb-20">
      <ListAllFilterBar />
      <ListAllComicTable />
    </div>
  );
}

