import React from "react"
import { AdminGuard } from "../common/admin-guard"
import { ComicTableSection } from "./comic-table-section"

export function AdminComicsView() {
  return (
    <AdminGuard>
      <ComicTableSection />
    </AdminGuard>
  )
}
