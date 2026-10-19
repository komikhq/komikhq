import { useState, useEffect } from "react"
import {
  ArrowLeftIcon as ArrowLeft,
  ArrowRightIcon as ArrowRight,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { CommentSection } from "@/components/comment/comment-section"
import { chaptersApi } from "@/lib/sdk-client"

interface ReaderFooterNavProps {
  comicSlug?: string
  chapterSlug?: string
  initialData?: any
}

export function ReaderFooterNav({
  comicSlug,
  chapterSlug,
  initialData,
}: ReaderFooterNavProps) {
  const [data, setData] = useState<any>(initialData ?? null)
  const [navData, setNavData] = useState<{
    prevSlug: string | null
    nextSlug: string | null
  }>({
    prevSlug: null,
    nextSlug: null,
  })

  // Derive navigation from chapter data
  useEffect(() => {
    const source = data
    if (!source) return

    const allChapters: any[] = source.allChapters || []
    const currentIndex = allChapters.findIndex(
      (c) => c.slug === chapterSlug
    )

    const prev =
      currentIndex > 0 ? allChapters[currentIndex - 1].slug : null
    const next =
      currentIndex >= 0 && currentIndex < allChapters.length - 1
        ? allChapters[currentIndex + 1].slug
        : null

    setNavData({ prevSlug: prev, nextSlug: next })
  }, [data, chapterSlug])

  useEffect(() => {
    // Skip fetch if initialData was provided by SSR
    if (initialData || !comicSlug || !chapterSlug) return

    chaptersApi
      .getPublicChapter({ slug: comicSlug, chapterSlug })
      .then((res: any) => {
        setData(res)
      })
      .catch(() => {
        setNavData({ prevSlug: null, nextSlug: null })
      })
  }, [comicSlug, chapterSlug])

  return (
    <>
      <div className="mx-auto my-8 flex max-w-3xl items-center justify-between gap-4 px-4">
        {navData.prevSlug ? (
          <Button
            variant="outline"
            className="border-neutral-700 bg-neutral-900 text-neutral-100 hover:bg-neutral-800 hover:text-white"
            onClick={() =>
              (window.location.href = `/komik/${comicSlug}/${navData.prevSlug}`)
            }
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous Chapter
          </Button>
        ) : (
          <Button
            variant="outline"
            disabled
            className="border-neutral-800 bg-neutral-900/50 text-neutral-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            First Chapter
          </Button>
        )}

        {navData.nextSlug ? (
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() =>
              (window.location.href = `/komik/${comicSlug}/${navData.nextSlug}`)
            }
          >
            Next Chapter
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            disabled
            className="border-neutral-800 bg-neutral-900/50 text-neutral-500"
          >
            Last Chapter
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <section className="mx-auto mt-12 max-w-3xl px-4">
        <CommentSection
          comicId={data?.comic?.id}
          chapterId={data?.chapter?.id}
        />
      </section>
    </>
  )
}
