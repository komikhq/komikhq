import * as React from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  type RowSelectionState,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CaretLeft,
  CaretRight,
  CaretDoubleLeft,
  CaretDoubleRight,
} from "@phosphor-icons/react"
import { DataTableColumnHeader } from "./data-table-column-header"

export interface BulkActionItem {
  label: string
  value: string
  variant?: "default" | "destructive"
}

export interface ServerPaginationConfig {
  page: number
  totalPages: number
  totalRecords?: number
  onPageChange: (page: number) => void
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
  loadingMessage?: string
  emptyMessage?: string
  pageSize?: number
  pageSizeOptions?: number[]
  enablePagination?: boolean
  enableSorting?: boolean
  enableRowSelection?: boolean
  enableRowNumbers?: boolean
  bulkActions?: BulkActionItem[]
  onBulkAction?: (action: string, selectedRows: TData[]) => void | Promise<void>
  serverPagination?: ServerPaginationConfig
}

export function DataTable<TData, TValue>({
  columns: userColumns,
  data,
  loading = false,
  loadingMessage = "Loading data...",
  emptyMessage = "No results found.",
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  enablePagination = true,
  enableSorting = true,
  enableRowSelection = false,
  enableRowNumbers = true,
  bulkActions,
  onBulkAction,
  serverPagination,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [selectedBulkAction, setSelectedBulkAction] = React.useState<string>("")
  const [bulkSubmitting, setBulkSubmitting] = React.useState(false)

  // Merge extra columns: Selection Checkbox and Row Number (#)
  const columns = React.useMemo<ColumnDef<TData, TValue>[]>(() => {
    const list: ColumnDef<TData, TValue>[] = []

    // 1. Checkbox Selection Column
    if (enableRowSelection) {
      list.push({
        id: "_select",
        header: ({ table }) => (
          <div className="flex items-center justify-center px-1">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all rows"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center px-1">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      } as ColumnDef<TData, TValue>)
    }

    // 2. Row Number Column (#)
    if (enableRowNumbers) {
      list.push({
        id: "_number",
        header: () => (
          <span className="block w-8 text-center font-semibold text-muted-foreground">
            #
          </span>
        ),
        cell: ({ row, table }) => {
          const pageIndex = table.getState().pagination?.pageIndex ?? 0
          const currPageSize = table.getState().pagination?.pageSize ?? pageSize
          const serverPage = serverPagination?.page

          const num = serverPage
            ? (serverPage - 1) * currPageSize + row.index + 1
            : pageIndex * currPageSize + row.index + 1

          return (
            <span className="block w-8 text-center font-mono text-[11px] text-muted-foreground">
              {num}
            </span>
          )
        },
        enableSorting: false,
        enableHiding: false,
      } as ColumnDef<TData, TValue>)
    }

    // 3. User Defined Columns (with auto-header sorting wrapper if header is plain string)
    userColumns.forEach((col) => {
      if (
        enableSorting &&
        col.enableSorting !== false &&
        typeof col.header === "string"
      ) {
        const title = col.header
        list.push({
          ...col,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title={title} />
          ),
        } as ColumnDef<TData, TValue>)
      } else {
        list.push(col)
      }
    })

    return list
  }, [
    userColumns,
    enableRowSelection,
    enableRowNumbers,
    enableSorting,
    pageSize,
    serverPagination?.page,
  ])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(enableSorting ? { getSortedRowModel: getSortedRowModel() } : {}),
    ...(enablePagination && !serverPagination
      ? { getPaginationRowModel: getPaginationRowModel() }
      : {}),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })

  // Selected rows
  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((row) => row.original)

  const handleApplyBulk = async () => {
    if (!selectedBulkAction || selectedRows.length === 0 || !onBulkAction) return
    setBulkSubmitting(true)
    try {
      await onBulkAction(selectedBulkAction, selectedRows)
      table.resetRowSelection()
      setSelectedBulkAction("")
    } finally {
      setBulkSubmitting(false)
    }
  }

  // Calculate pagination details
  const isServer = Boolean(serverPagination)
  const currentPage = isServer
    ? serverPagination!.page
    : table.getState().pagination.pageIndex + 1
  const totalPages = isServer
    ? serverPagination!.totalPages
    : table.getPageCount()
  const totalEntries = isServer
    ? serverPagination!.totalRecords ?? data.length
    : data.length

  const currentPageSize = table.getState().pagination.pageSize
  const startEntry =
    data.length === 0 ? 0 : (currentPage - 1) * currentPageSize + 1
  const endEntry = Math.min(currentPage * currentPageSize, totalEntries)

  const canPrev = isServer ? currentPage > 1 : table.getCanPreviousPage()
  const canNext = isServer ? currentPage < totalPages : table.getCanNextPage()

  const handleFirstPage = () => {
    if (isServer) serverPagination?.onPageChange(1)
    else table.setPageIndex(0)
  }

  const handlePrevPage = () => {
    if (isServer) serverPagination?.onPageChange(currentPage - 1)
    else table.previousPage()
  }

  const handleNextPage = () => {
    if (isServer) serverPagination?.onPageChange(currentPage + 1)
    else table.nextPage()
  }

  const handleLastPage = () => {
    if (isServer) serverPagination?.onPageChange(totalPages)
    else table.setPageIndex(totalPages - 1)
  }

  return (
    <div className="space-y-3">
      {/* WordPress Style Bulk Action Toolbar */}
      {enableRowSelection && bulkActions && bulkActions.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
          <div className="flex items-center gap-2">
            <Select
              value={selectedBulkAction}
              onValueChange={setSelectedBulkAction}
              disabled={bulkSubmitting}
            >
              <SelectTrigger className="h-8 w-44 text-xs bg-background">
                <SelectValue placeholder="Bulk Actions" />
              </SelectTrigger>
              <SelectContent>
                {bulkActions.map((action) => (
                  <SelectItem key={action.value} value={action.value}>
                    {action.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 text-xs cursor-pointer bg-background hover:bg-accent"
              disabled={
                !selectedBulkAction || selectedRows.length === 0 || bulkSubmitting
              }
              onClick={handleApplyBulk}
            >
              {bulkSubmitting ? "Applying..." : "Apply"}
            </Button>
          </div>

          {selectedRows.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="secondary" className="text-[11px] font-semibold text-primary">
                {selectedRows.length} of {data.length} selected
              </Badge>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => table.resetRowSelection()}
              >
                Clear Selection
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Main Table Container */}
      <div className="overflow-hidden rounded-xl border border-border/60">
        <Table className="text-xs">
          <TableHeader className="bg-muted/60">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-border/60">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-10 px-3 text-xs font-semibold text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="divide-y divide-border/40">
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {loadingMessage}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="transition-colors hover:bg-muted/30 border-border/40 data-[state=selected]:bg-primary/5"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Advanced Pagination Bar */}
      {enablePagination && (totalEntries > 0 || isServer) && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground px-1 pt-1">
          <div>
            Showing {startEntry} to {endEntry} of {totalEntries} entries
            {selectedRows.length > 0 && (
              <span className="text-primary font-medium ml-1.5">
                ({selectedRows.length} selected)
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            {/* Rows Per Page Selector */}
            {!isServer && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] whitespace-nowrap text-muted-foreground">
                  Rows per page:
                </span>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(val) => table.setPageSize(Number(val))}
                >
                  <SelectTrigger className="h-8 w-16 text-xs bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {pageSizeOptions.map((sz) => (
                      <SelectItem key={sz} value={`${sz}`}>
                        {sz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Page Navigation Buttons */}
            <div className="flex items-center gap-1">
              <span className="mr-2 text-xs font-medium text-foreground">
                Page {currentPage} of {Math.max(totalPages, 1)}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 cursor-pointer"
                onClick={handleFirstPage}
                disabled={!canPrev}
                title="First Page"
              >
                <CaretDoubleLeft className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 cursor-pointer"
                onClick={handlePrevPage}
                disabled={!canPrev}
                title="Previous Page"
              >
                <CaretLeft className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 cursor-pointer"
                onClick={handleNextPage}
                disabled={!canNext}
                title="Next Page"
              >
                <CaretRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 cursor-pointer"
                onClick={handleLastPage}
                disabled={!canNext}
                title="Last Page"
              >
                <CaretDoubleRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
