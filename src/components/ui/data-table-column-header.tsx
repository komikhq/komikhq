import * as React from "react"
import type { Column } from "@tanstack/react-table"
import { CaretUpDown, CaretUp, CaretDown } from "@phosphor-icons/react"
import { cn } from "cn"

interface DataTableColumnHeaderProps<
  TData,
  TValue,
> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return (
      <div
        className={cn("text-xs font-semibold text-muted-foreground", className)}
      >
        {title}
      </div>
    )
  }

  const isSorted = column.getIsSorted()

  return (
    <button
      type="button"
      className={cn(
        "group -ml-1 flex cursor-pointer items-center gap-1 rounded-md px-1 py-0.5 text-xs font-semibold text-muted-foreground transition-colors select-none hover:text-foreground",
        isSorted && "font-bold text-foreground",
        className
      )}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      <span>{title}</span>
      {isSorted === "desc" ? (
        <CaretDown className="h-3.5 w-3.5 text-primary" />
      ) : isSorted === "asc" ? (
        <CaretUp className="h-3.5 w-3.5 text-primary" />
      ) : (
        <CaretUpDown className="h-3.5 w-3.5 opacity-40 transition-opacity group-hover:opacity-100" />
      )}
    </button>
  )
}
