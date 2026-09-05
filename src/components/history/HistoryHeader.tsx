import React from "react";
import { ClockCounterClockwise } from "@phosphor-icons/react";

export function HistoryHeader() {
  return (
    <div className="flex items-center gap-2">
      <ClockCounterClockwise className="h-6 w-6 text-primary" />
      <h1 className="text-2xl font-bold tracking-tight">Reading History</h1>
    </div>
  );
}
