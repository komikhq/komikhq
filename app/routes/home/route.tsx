import type { Route } from "./+types/route";
import { HomeHeroCard } from "./_components/home-hero-card";
import { HomeTrendingSection } from "./_components/home-trending-section";
import { HomePopularSection } from "./_components/home-popular-section";
import { HomeLatestAddedSection } from "./_components/home-latest-added-section";
import { HomeGenreComicsSection } from "./_components/home-genre-comics-section";
import { HomeTopGenresCard } from "./_components/home-top-genres-card";
import { HomeAllGenresCard } from "./_components/home-all-genres-card";
import { SITE_NAME, SITE_DESCRIPTION } from "@/constants";
import { comicsApi } from "@/lib/sdk-client";

export function meta(): Route.MetaDescriptors {
  return [
    { title: `${SITE_NAME} - Read Manga, Manhwa, and Manhua Online` },
    { name: "description", content: SITE_DESCRIPTION },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:type", content: "website" },
    { property: "og:title", content: `${SITE_NAME} - Read Manga, Manhwa, and Manhua Online` },
    { property: "og:description", content: SITE_DESCRIPTION },
    { property: "og:image", content: "/images/og.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: `${SITE_NAME} - Read Manga, Manhwa, and Manhua Online` },
    { name: "twitter:description", content: SITE_DESCRIPTION },
    { name: "twitter:image", content: "/images/og.png" },
  ];
}

export async function loader() {
  try {
    const [trendingRes, popularRes, latestRes] = await Promise.allSettled([
      comicsApi.listTrendingComics({ period: "daily", limit: "20" }),
      comicsApi.listTrendingComics({ period: "popular", limit: "20" }),
      comicsApi.browseComics({ limit: "12", sort: "latest" }),
    ]);

    return {
      trendingComics:
        trendingRes.status === "fulfilled" && trendingRes.value?.comics
          ? trendingRes.value.comics
          : [],
      popularComics:
        popularRes.status === "fulfilled" && popularRes.value?.comics
          ? popularRes.value.comics
          : [],
      latestComics:
        latestRes.status === "fulfilled" && latestRes.value?.comics
          ? latestRes.value.comics
          : [],
    };
  } catch (err) {
    console.error("Home loader error:", err);
    return {
      trendingComics: [],
      popularComics: [],
      latestComics: [],
    };
  }
}

export default function HomeRoute({ loaderData }: Route.ComponentProps) {
  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 px-4 pt-4 pb-20">
      <HomeHeroCard />
      <HomeTrendingSection initialComics={loaderData?.trendingComics} />
      <HomePopularSection initialComics={loaderData?.popularComics} />
      <HomeLatestAddedSection initialComics={loaderData?.latestComics} />
      <HomeGenreComicsSection />
      <HomeTopGenresCard />
      <HomeAllGenresCard />
    </div>
  );
}
