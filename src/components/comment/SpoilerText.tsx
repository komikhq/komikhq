import React, { useState } from "react";
import { Warning } from "@phosphor-icons/react";

interface SpoilerTextProps {
  text: string;
  isSpoilerComment?: boolean;
}

export function SpoilerText({ text, isSpoilerComment = false }: SpoilerTextProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  // If the whole comment is marked as spoiler and user hasn't clicked reveal yet
  if (isSpoilerComment && !isRevealed) {
    return (
      <span
        onClick={() => setIsRevealed(true)}
        className="cursor-pointer select-none rounded bg-neutral-800/80 px-2 py-1 text-xs text-neutral-400 blur-sm hover:blur-none transition-all duration-200 border border-neutral-700/50 inline-flex items-center gap-1.5"
        title="Klik untuk melihat spoiler"
      >
        <Warning className="h-3.5 w-3.5 text-amber-500 shrink-0" />
        <span>Komentar ini mengandung spoiler. Klik untuk membaca.</span>
      </span>
    );
  }

  // Parse inline ||spoiler|| syntax
  const parts = text.split(/(\|\|.*?\|\|)/g);

  return (
    <span>
      {parts.map((part, index) => {
        if (part.startsWith("||") && part.endsWith("||") && part.length > 4) {
          const spoilerContent = part.slice(2, -2);
          return <InlineSpoiler key={index} content={spoilerContent} />;
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}

function InlineSpoiler({ content }: { content: string }) {
  const [revealed, setRevealed] = useState(false);

  if (revealed) {
    return (
      <span
        onClick={() => setRevealed(false)}
        className="bg-neutral-800 text-neutral-200 rounded px-1.5 py-0.5 cursor-pointer text-xs border border-neutral-700/50 transition-colors"
        title="Klik untuk menyembunyikan spoiler"
      >
        {content}
      </span>
    );
  }

  return (
    <span
      onClick={() => setRevealed(true)}
      className="cursor-pointer select-none rounded bg-neutral-800 text-transparent blur-[5px] hover:blur-none transition-all duration-200 px-1.5 py-0.5 border border-neutral-700/30"
      title="Klik untuk melihat spoiler"
    >
      {content}
    </span>
  );
}
