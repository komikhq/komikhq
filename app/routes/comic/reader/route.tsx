import type { Route } from "./+types/route";
import { ReaderHeaderBar } from "./_components/reader-header-bar";
import { ReaderImageStack } from "./_components/reader-image-stack";
import { ReaderFooterNav } from "./_components/reader-footer-nav";
import { chaptersApi } from "@/lib/sdk-client";
import { SITE_NAME } from "@/constants";

interface ChapterData {
  comic?: { title?: string; id?: string };
  chapter?: { title?: string; chapterNumber?: string; id?: string };
  pages?: any[];
  allChapters?: any[];
}

export async function loader({ params }: Route.LoaderArgs) {
  const { slug, chapterSlug } = params;
  let chapterData: ChapterData | null = null;

  if (slug && chapterSlug) {
    try {
      chapterData = (await chaptersApi.getPublicChapter({
        slug,
        chapterSlug,
      })) as unknown as ChapterData;
    } catch (error) {
      console.warn(
        `[ReaderPage] Failed to load chapter metadata for ${slug}/${chapterSlug}:`,
        error
      );
    }
  }

  const formatSlug = (value: string | undefined, fallback: string) =>
    value
      ? value
          .replace(/-/g, " ")
          .replace(/\b\w/g, (letter) => letter.toUpperCase())
      : fallback;

  const formattedSlug = formatSlug(slug?.replace(/-\d{4}$/, ""), "Comic");
  const fallbackChapter = chapterSlug
    ? `Chapter ${chapterSlug.replace(/^(chapter-|ch-)/i, "")}`
    : "Chapter";

  const comicTitle = chapterData?.comic?.title || formattedSlug;
  const chapterTitle = chapterData?.chapter?.title || fallbackChapter;

  return {
    slug,
    chapterSlug,
    chapterData,
    comicTitle,
    chapterTitle,
  };
}

export function meta({ data }: Route.MetaArgs & { data?: any }): Route.MetaDescriptors {
  const comicTitle = data?.comicTitle || "Comic";
  const chapterTitle = data?.chapterTitle || "Chapter";

  return [
    { title: `Read ${comicTitle} ${chapterTitle} Online | ${SITE_NAME}` },
    {
      name: "description",
      content: `Read ${comicTitle} ${chapterTitle} online in high quality with distraction-free scrolling on ${SITE_NAME}.`,
    },
    {
      property: "og:title",
      content: `Read ${comicTitle} ${chapterTitle} Online | ${SITE_NAME}`,
    },
    {
      property: "og:description",
      content: `Read ${comicTitle} ${chapterTitle} online in high quality with distraction-free scrolling on ${SITE_NAME}.`,
    },
  ];
}

export default function ComicReaderRoute({ loaderData }: Route.ComponentProps) {
  const { slug, chapterSlug, chapterData } = loaderData;

  return (
    <div className="min-h-screen bg-neutral-950 pb-20 text-neutral-100">
      <ReaderHeaderBar
        comicSlug={slug}
        chapterSlug={chapterSlug}
        initialData={chapterData}
      />
      <ReaderImageStack
        comicSlug={slug}
        chapterSlug={chapterSlug}
        initialData={chapterData}
      />
      <ReaderFooterNav
        comicSlug={slug}
        chapterSlug={chapterSlug}
        initialData={chapterData}
      />
    </div>
  );
}

