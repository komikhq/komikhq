import React from "react";
import { Card } from "@/components/ui/card";

export function HistoryList() {
  return (
    <Card className="p-8 text-center">
      <p className="text-sm text-muted-foreground">
        Belum ada riwayat bacaan. Chapter yang terakhir Anda baca akan tampil di sini.
      </p>
    </Card>
  );
}
