import React from "react";
import { BookmarkSimple } from "@phosphor-icons/react";
import { Card, CardContent } from "@/components/ui/card";

export function BookmarkContent() {
  return (
    <div className="space-y-6 pb-20 pt-4 px-4 max-w-screen-2xl mx-auto">
      <div className="flex items-center gap-2">
        <BookmarkSimple className="h-6 w-6 text-primary" weight="fill" />
        <h1 className="text-2xl font-bold tracking-tight">Your Bookmarks</h1>
      </div>
      <Card className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No saved bookmarks yet. Saved comics will appear here.
        </p>
      </Card>
    </div>
  );
}
