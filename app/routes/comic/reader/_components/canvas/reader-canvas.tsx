import { ImageIcon as Image } from "@phosphor-icons/react"
import { useReader } from "../../context/reader-context"
import { ReaderVerticalScroll } from "./reader-vertical-scroll"
import { ReaderPagedView } from "./reader-paged-view"

export function ReaderCanvas() {
  const { pages, settings } = useReader()

  if (!pages || pages.length === 0) {
    return (
      <main className="mx-auto max-w-3xl space-y-3 px-4 py-24 text-center">
        <Image className="mx-auto h-12 w-12 text-neutral-600" />
        <h3 className="text-base font-bold text-neutral-300">
          No Pages Available
        </h3>
        <p className="text-xs text-neutral-500">
          This chapter does not have any uploaded pages in the database yet.
        </p>
      </main>
    )
  }

  const isWebtoon = settings.mode === "webtoon"

  return (
    <main className="relative min-h-screen w-full bg-neutral-950">
      {isWebtoon ? <ReaderVerticalScroll /> : <ReaderPagedView />}
    </main>
  )
}

