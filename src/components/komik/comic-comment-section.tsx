import { CommentSection } from "@/components/comment/comment-section"

interface ComicCommentSectionProps {
  slug?: string
  comicId?: string
}

export function ComicCommentSection({ comicId }: ComicCommentSectionProps) {
  if (!comicId) {
    return null
  }

  return (
    <section className="mt-2">
      <CommentSection comicId={comicId} variant="default" />
    </section>
  )
}
