import type { Route } from "./+types/route"
import { chaptersApi } from "@/lib/sdk-client"
import { SITE_NAME } from "@/constants"
import { ReaderProvider } from "./context/reader-context"
import { ReaderHeaderBar } from "./_components/hud/reader-header-bar"
import { ReaderCanvas } from "./_components/canvas/reader-canvas"
import { ReaderBottomHud } from "./_components/hud/reader-bottom-hud"
import { ReaderProgressPill } from "./_components/hud/reader-progress-pill"
import { ReaderChapterDrawer } from "./_components/hud/reader-chapter-drawer"
import { ReaderSettingsModal } from "./_components/hud/reader-settings-modal"
import { ReaderFooterNav } from "./_components/reader-footer-nav"
import type { ChapterFullData } from "./types/reader.types"

export async function loader({ params }: Route.LoaderArgs) {
  const { slug, chapterSlug } = params
  let chapterData: ChapterFullData | null = null

  if (slug && chapterSlug) {
    try {
      chapterData = (await chaptersApi.getPublicChapter({
        slug,
        chapterSlug,
      })) as unknown as ChapterFullData
    } catch (error) {
      console.warn(
        `[ReaderPage] Failed to load chapter metadata for ${slug}/${chapterSlug}:`,
        error
      )
    }
  }

  const formatSlug = (value: string | undefined, fallback: string) =>
    value
      ? value
          .replace(/-/g, " ")
          .replace(/\b\w/g, (letter) => letter.toUpperCase())
      : fallback

  const formattedSlug = formatSlug(slug?.replace(/-\d{4}$/, ""), "Comic")
  const fallbackChapter = chapterSlug
    ? `Chapter ${chapterSlug.replace(/^(chapter-|ch-)/i, "")}`
    : "Chapter"

  const comicTitle = chapterData?.comic?.title || formattedSlug
  const chapterTitle = chapterData?.chapter?.title || fallbackChapter

  return {
    slug,
    chapterSlug,
    chapterData,
    comicTitle,
    chapterTitle,
  }
}

export function meta({ data }: Route.MetaArgs & { data?: any }): Route.MetaDescriptors {
  const comicTitle = data?.comicTitle || "Comic"
  const chapterTitle = data?.chapterTitle || "Chapter"

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
  ]
}

export default function ComicReaderRoute({ loaderData }: Route.ComponentProps) {
  const { slug, chapterSlug, chapterData } = loaderData

  return (
    <ReaderProvider
      initialData={chapterData}
      comicSlug={slug}
      chapterSlug={chapterSlug}
    >
      <div className="relative min-h-screen bg-neutral-950 text-neutral-100">
        {/* Top Header Bar */}
        <ReaderHeaderBar />

        {/* Dynamic Reader Canvas (Webtoon Scroll or Paged Viewer) */}
        <div className="pt-12 sm:pt-14">
          <ReaderCanvas />
        </div>

        {/* Footer Navigation & Comments */}
        <ReaderFooterNav />

        {/* Floating Bottom HUD Controls */}
        <ReaderBottomHud />

        {/* Floating Minimal Progress Pill */}
        <ReaderProgressPill />

        {/* Slide-out Chapters Drawer */}
        <ReaderChapterDrawer />

        {/* Reader Preferences Modal */}
        <ReaderSettingsModal />
      </div>
    </ReaderProvider>
  )
}
