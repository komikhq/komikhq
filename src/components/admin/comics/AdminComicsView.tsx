import React from "react";
import { AdminGuard } from "../AdminGuard";
import { ComicTableSection } from "./ComicTableSection";

export function AdminComicsView() {
  return (
    <AdminGuard>
      <ComicTableSection />
    </AdminGuard>
  );
}
