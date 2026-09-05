import React from "react";
import { ListBullets } from "@phosphor-icons/react";

export function ListAllFilterBar() {
  return (
    <div className="flex items-center gap-2">
      <ListBullets className="h-6 w-6 text-primary" />
      <h1 className="text-2xl font-bold tracking-tight">Daftar Lengkap Komik (A-Z)</h1>
    </div>
  );
}
