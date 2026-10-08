import React from "react"
import { AdminGuard } from "../common/AdminGuard"
import { ComicTableSection } from "./ComicTableSection"

export function AdminComicsView() {
  return (
    <AdminGuard>
      <ComicTableSection />
    </AdminGuard>
  )
}
