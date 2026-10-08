import React from "react"
import { AdminGuard } from "../common/AdminGuard"
import { GenreTableSection } from "./GenreTableSection"

export function AdminGenresView() {
  return (
    <AdminGuard>
      <GenreTableSection />
    </AdminGuard>
  )
}
