import { useNavigate } from "react-router"
import {
  ArrowLeftIcon as ArrowLeft,
  ArrowRightIcon as ArrowRight,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { CommentSection } from "@/routes/comic/_components/comment/comment-section"
import { useReader } from "../context/reader-context"

export function ReaderFooterNav() {
  const navigate = useNavigate()
  const { comicSlug, navInfo, data } = useReader()

  return (
    <footer className="mx-auto max-w-3xl px-4 pt-8 pb-20">
      {/* Chapter Transition Buttons */}
      <div className="flex items-center justify-between gap-4">
        {navInfo.prevSlug ? (
          <Button
            variant="outline"
            className="border-neutral-700 bg-neutral-900 text-neutral-100 hover:bg-neutral-800 hover:text-white"
            onClick={() => navigate(`/komik/${comicSlug}/${navInfo.prevSlug}`)}
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

        {navInfo.nextSlug ? (
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => navigate(`/komik/${comicSlug}/${navInfo.nextSlug}`)}
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

      {/* Reader Discussion / Comments */}
      {data?.comic?.id && data?.chapter?.id && (
        <section className="mt-12 border-t border-neutral-800/80 pt-8">
          <CommentSection
            comicId={data.comic.id}
            chapterId={data.chapter.id}
          />
        </section>
      )}
    </footer>
  )
}
