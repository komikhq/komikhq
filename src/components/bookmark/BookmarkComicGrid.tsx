import React from "react";
import { Card } from "@/components/ui/card";

export function BookmarkComicGrid() {
  return (
    <Card className="p-8 text-center">
      <p className="text-sm text-muted-foreground">
        Belum ada komik yang disimpan dalam bookmark. Komik favorit Anda akan muncul di sini.
      </p>
    </Card>
  );
}
