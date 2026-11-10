import {
  CaretLeftIcon as CaretLeft,
  CaretRightIcon as CaretRight,
} from "@phosphor-icons/react"
import { useReader } from "../../context/reader-context"
import { getReaderWidthClass } from "../../lib/reader-helpers"
import { ReaderPageItem } from "./reader-page-item"

export function ReaderPagedView() {
  const {
    pages,
    activePageIndex,
    scrollToPage,
    settings,
    toggleHud,
  } = useReader()

  const currentPage = pages[activePageIndex]
  const isRTL = settings.mode === "paged-rtl"
  const widthClass = getReaderWidthClass(settings.width)

  const handleNext = () => {
    if (activePageIndex < pages.length - 1) {
      scrollToPage(activePageIndex + 1)
    }
  }

  const handlePrev = () => {
    if (activePageIndex > 0) {
      scrollToPage(activePageIndex - 1)
    }
  }

  const handleRightClick = () => {
    if (isRTL) {
      handlePrev()
    } else {
      handleNext()
    }
  }

  const handleLeftClick = () => {
    if (isRTL) {
      handleNext()
    } else {
      handlePrev()
    }
  }

  if (!currentPage) return null

  return (
    <div className={`relative mx-auto flex min-h-[80vh] items-center justify-center ${widthClass} py-4`}>
      {/* Active Page Item */}
      <div className="w-full">
        <ReaderPageItem
          key={currentPage.id || activePageIndex}
          page={currentPage}
          pageIndex={activePageIndex}
          totalPages={pages.length}
          priorityImmediate={true}
        />
      </div>

      {/* Interactive Click Zones: Left (30%), Center (40%), Right (30%) */}
      <div className="absolute inset-0 flex select-none">
        {/* Left Zone */}
        <button
          type="button"
          onClick={handleLeftClick}
          aria-label={isRTL ? "Next Page" : "Previous Page"}
          className="group relative flex w-[30%] items-center justify-start bg-transparent opacity-0 transition-opacity hover:opacity-100"
        >
          <div className="ml-4 rounded-full bg-black/60 p-2 text-white shadow-lg backdrop-blur">
            <CaretLeft className="h-6 w-6" />
          </div>
        </button>

        {/* Center Zone: Toggle HUD */}
        <button
          type="button"
          onClick={toggleHud}
          aria-label="Toggle HUD Controls"
          className="w-[40%] bg-transparent cursor-pointer"
        />

        {/* Right Zone */}
        <button
          type="button"
          onClick={handleRightClick}
          aria-label={isRTL ? "Previous Page" : "Next Page"}
          className="group relative flex w-[30%] items-center justify-end bg-transparent opacity-0 transition-opacity hover:opacity-100"
        >
          <div className="mr-4 rounded-full bg-black/60 p-2 text-white shadow-lg backdrop-blur">
            <CaretRight className="h-6 w-6" />
          </div>
        </button>
      </div>
    </div>
  )
}

