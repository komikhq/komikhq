import React from "react";
import { BookmarkSimple } from "@phosphor-icons/react";

export function BookmarkHeader() {
  return (
    <div className="flex items-center gap-2">
      <BookmarkSimple className="h-6 w-6 text-primary" weight="fill" />
      <h1 className="text-2xl font-bold tracking-tight">Your Bookmarks</h1>
    </div>
  );
}
