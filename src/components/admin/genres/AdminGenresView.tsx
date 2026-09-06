import React from "react";
import { AdminGuard } from "../AdminGuard";
import { GenreTableSection } from "./GenreTableSection";

export function AdminGenresView() {
  return (
    <AdminGuard>
      <GenreTableSection />
    </AdminGuard>
  );
}
