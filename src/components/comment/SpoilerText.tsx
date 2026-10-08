import React, { useState } from "react"
import { Warning } from "@phosphor-icons/react"

interface SpoilerTextProps {
  text: string
  isSpoilerComment?: boolean
}

export function SpoilerText({
  text,
  isSpoilerComment = false,
}: SpoilerTextProps) {
  const [isRevealed, setIsRevealed] = useState(false)

  // If the whole comment is marked as spoiler and user hasn't clicked reveal yet
  if (isSpoilerComment && !isRevealed) {
    return (
      <span
        onClick={() => setIsRevealed(true)}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded border border-neutral-700/50 bg-neutral-800/80 px-2 py-1 text-xs text-neutral-400 blur-sm transition-all duration-200 select-none hover:blur-none"
        title="Klik untuk melihat spoiler"
      >
        <Warning className="h-3.5 w-3.5 shrink-0 text-amber-500" />
        <span>Komentar ini mengandung spoiler. Klik untuk membaca.</span>
      </span>
    )
  }

  // Parse inline ||spoiler|| syntax
  const parts = text.split(/(\|\|.*?\|\|)/g)

  return (
    <span>
      {parts.map((part, index) => {
        if (part.startsWith("||") && part.endsWith("||") && part.length > 4) {
          const spoilerContent = part.slice(2, -2)
          return <InlineSpoiler key={index} content={spoilerContent} />
        }
        return <span key={index}>{part}</span>
      })}
    </span>
  )
}

function InlineSpoiler({ content }: { content: string }) {
  const [revealed, setRevealed] = useState(false)

  if (revealed) {
    return (
      <span
        onClick={() => setRevealed(false)}
        className="cursor-pointer rounded border border-neutral-700/50 bg-neutral-800 px-1.5 py-0.5 text-xs text-neutral-200 transition-colors"
        title="Klik untuk menyembunyikan spoiler"
      >
        {content}
      </span>
    )
  }

  return (
    <span
      onClick={() => setRevealed(true)}
      className="cursor-pointer rounded border border-neutral-700/30 bg-neutral-800 px-1.5 py-0.5 text-transparent blur-[5px] transition-all duration-200 select-none hover:blur-none"
      title="Klik untuk melihat spoiler"
    >
      {content}
    </span>
  )
}
