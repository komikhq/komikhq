import { useReader } from "../../context/reader-context"

export function ReaderProgressPill() {
  const { activePageIndex, pages, isHudVisible, toggleHud } = useReader()

  if (isHudVisible || pages.length === 0) return null

  return (
    <button
      type="button"
      onClick={toggleHud}
      aria-label="Show reader controls"
      className="fixed bottom-4 left-1/2 z-30 -translate-x-1/2 cursor-pointer rounded-full border border-neutral-800 bg-neutral-900/90 px-3.5 py-1.5 font-mono text-xs text-neutral-300 shadow-xl backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
    >
      <span className="font-semibold text-primary">{activePageIndex + 1}</span>
      <span className="text-neutral-500"> / {pages.length}</span>
    </button>
  )
}

