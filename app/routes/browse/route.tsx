import type { Route } from "./+types/route";
import { BrowseFilterBar } from "./_components/browse-filter-bar";
import { BrowseComicGrid } from "./_components/browse-comic-grid";
import { SITE_NAME } from "@/constants";
import { comicsApi, genresApi } from "@/lib/sdk-client";
import { sortGenresByNaturalName } from "@/lib/sort-genres";

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

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || url.searchParams.get("search") || undefined;
  const genre = url.searchParams.get("genre") || undefined;
  const status = (url.searchParams.get("status") as any) || undefined;
  const sort = (url.searchParams.get("sort") as any) || undefined;

  try {
    const [comicsRes, genresRes] = await Promise.allSettled([
      comicsApi.listComics({ q, genre, status, sort, limit: 20 }),
      genresApi.listGenres(),
    ]);

    if (comicsRes.status === "rejected" && genresRes.status === "rejected") {
      throw new Response("Failed to load catalog from server", { status: 503 });
    }

    const comics =
      comicsRes.status === "fulfilled"
        ? (comicsRes.value as any)?.data?.items ||
          (comicsRes.value as any)?.comics ||
          (comicsRes.value as any)?.data ||
          []
        : [];
    const rawGenres =
      genresRes.status === "fulfilled"
        ? (genresRes.value as any)?.data || (genresRes.value as any)?.genres || []
        : [];
    const genres = sortGenresByNaturalName(rawGenres);

    return { comics, genres };
  } catch (err) {
    if (err instanceof Response) throw err;
    return { comics: [], genres: [] };
  }
}

export default function BrowseRoute({ loaderData }: Route.ComponentProps) {
  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 px-4 pt-4 pb-20">
      <BrowseFilterBar initialGenres={loaderData?.genres} />
      <BrowseComicGrid initialComics={loaderData?.comics} />
    </div>
  );
}

