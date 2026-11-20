import type { Route } from "./+types/route";
import { ComicHeaderCard } from "./_components/comic-header-card";
import { ComicChapterList } from "./_components/comic-chapter-list";
import { ComicCommentSection } from "./_components/comic-comment-section";
import { comicsApi } from "@/lib/sdk-client";
import { SITE_NAME } from "@/constants";

export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params;
  if (!slug) {
    throw new Response("Comic slug is required", { status: 400 });
  }

  let response: any;
  try {
    response = await comicsApi.getComicBySlug({ slug });
  } catch (err: any) {
    const status = err?.status || err?.response?.status || 404;
    throw new Response(err?.message || "Comic Not Found", { status });
  }

  const rawData = response?.data || response;
  if (!rawData || (!rawData.id && !rawData.title)) {
    throw new Response("Comic Not Found", { status: 404 });
  }

  const resolvedComic = rawData.comic || rawData;
  const normalizedData = {
    ...rawData,
    comic: resolvedComic,
    title: resolvedComic.title || rawData.title,
    synopsis: resolvedComic.synopsis || rawData.synopsis,
    coverUrl: resolvedComic.coverUrl || rawData.coverUrl,
    type: resolvedComic.type || rawData.type,
    status: resolvedComic.status || rawData.status,
    accessTier: resolvedComic.accessTier || rawData.accessTier,
    genres: rawData.genres || resolvedComic.genres || [],
    creators: rawData.creators || resolvedComic.creators || [],
    chapters: rawData.chapters || resolvedComic.chapters || [],
  };

  return {
    slug,
    comicData: normalizedData,
    comic: resolvedComic,
  };
}

export function meta({ data }: Route.MetaArgs & { data?: any }): Route.MetaDescriptors {
  const comic = data?.comic;
  const slug = data?.slug;
  const formattedTitle =
    comic?.title ||
    (slug
      ? slug.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())
      : "Comic");

  const title = `Read ${formattedTitle} Online | ${SITE_NAME}`;
  const description =
    comic?.synopsis || comic?.description
      ? (comic.synopsis || comic.description).slice(0, 160)
      : `Read ${formattedTitle} manga, manhwa, and manhua for free on ${SITE_NAME}.`;

  const ogImage = comic?.cover_url || comic?.coverUrl || "/images/og.png";

  return [
    { title },
    { name: "description", content: description },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:type", content: "book" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: ogImage },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "ComicSeries",
        name: formattedTitle,
        description,
        image: ogImage,
        genre: comic?.genres?.map((g: any) => g.name) || [],
      },
    },
  ];
}

export default function ComicDetailRoute({ loaderData }: Route.ComponentProps) {
  const { slug, comicData, comic } = loaderData;

  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-6 px-4 pt-4 pb-20">
      <ComicHeaderCard slug={slug} initialData={comicData} />
      <ComicChapterList slug={slug} initialChapters={comicData?.chapters} />
      <ComicCommentSection slug={slug} comicId={comic?.id} />
    </div>
  );
}

