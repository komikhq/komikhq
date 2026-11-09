import type { Route } from "./+types/route";
import { ComicHeaderCard } from "./_components/comic-header-card";
import { ComicChapterList } from "./_components/comic-chapter-list";
import { ComicCommentSection } from "./_components/comic-comment-section";
import { comicsApi } from "@/lib/sdk-client";
import { SITE_NAME } from "@/constants";

export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params;
  let comicData: any = null;
  if (slug) {
    try {
      comicData = await comicsApi.getComicBySlug({ slug });
    } catch {
      comicData = null;
    }
  }

  return {
    slug,
    comicData,
    comic: comicData?.comic || comicData,
  };
}

export function meta({ data }: Route.MetaArgs): Route.MetaDescriptors {
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

