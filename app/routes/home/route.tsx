import type { Route } from "./+types/route";
import { HomeHeroCard } from "./_components/home-hero-card";
import { HomeTrendingSection } from "./_components/home-trending-section";
import { HomePopularSection } from "./_components/home-popular-section";
import { HomeLatestAddedSection } from "./_components/home-latest-added-section";
import { HomeGenreComicsSection } from "./_components/home-genre-comics-section";
import { HomeTopGenresCard } from "./_components/home-top-genres-card";
import { HomeAllGenresCard } from "./_components/home-all-genres-card";
import { SITE_NAME, SITE_DESCRIPTION } from "@/constants";

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

export default function HomeRoute() {
  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 px-4 pt-4 pb-20">
      <HomeHeroCard />
      <HomeTrendingSection />
      <HomePopularSection />
      <HomeLatestAddedSection />
      <HomeGenreComicsSection />
      <HomeTopGenresCard />
      <HomeAllGenresCard />
    </div>
  );
}
