import React from "react";
import { ClockCounterClockwise } from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";

export function HistoryContent() {
  return (
    <div className="space-y-6 pb-20 pt-4 px-4 max-w-screen-2xl mx-auto">
      <div className="flex items-center gap-2">
        <ClockCounterClockwise className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">Reading History</h1>
      </div>
      <Card className="p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No reading history recorded yet. Your recently read chapters will show up here.
        </p>
      </Card>
    </div>
  );
}
