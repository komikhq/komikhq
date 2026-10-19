import React from "react"
import { AdminGuard } from "../common/admin-guard"
import { GenreTableSection } from "./genre-table-section"

export function AdminGenresView() {
  return (
    <AdminGuard>
      <GenreTableSection />
    </AdminGuard>
  )
}
