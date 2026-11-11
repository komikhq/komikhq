import { useState, useMemo } from "react"
import {
  MagnifyingGlassIcon as MagnifyingGlass,
  UserPlusIcon as UserPlus,
  ShieldIcon as Shield,
  UserIcon as User,
  TrashIcon as Trash,
  PencilSimpleIcon as PencilSimple,
  CheckCircleIcon as CheckCircle,
  XCircleIcon as XCircle,
  ArrowsClockwiseIcon as ArrowsClockwise,
} from "@phosphor-icons/react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { useAdminUsers, type UserItem } from "@/hooks/use-admin-users"
import { UserFormDialog } from "./user-form-dialog"
import { UserDeleteDialog } from "./user-delete-dialog"

export function UserTableSection() {
  const {
    users,
    loading,
    isFetching,
    submitting,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    totalRecords,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  } = useAdminUsers(10)

  // Dialog states
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserItem | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null)

  const handleOpenAdd = () => {
    setEditingUser(null)
    setFormOpen(true)
  }

  const handleOpenEdit = (u: UserItem) => {
    setEditingUser(u)
    setFormOpen(true)
  }

  const handleOpenDelete = (u: UserItem) => {
    setDeleteTarget(u)
    setDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      const ok = await deleteUser(deleteTarget)
      if (ok) {
        setDeleteOpen(false)
        setDeleteTarget(null)
      }
    }
  }

  const handleFormSubmit = async (data: {
    name: string
    email: string
    password?: string
    role: string
  }) => {
    if (editingUser) {
      return updateUser(editingUser.id, data)
    } else {
      return createUser(data)
    }
  }

  const handleBulkAction = async (action: string, selectedRows: UserItem[]) => {
    if (action === "delete") {
      const ok = window.confirm(
        `Are you sure you want to permanently delete ${selectedRows.length} selected user(s)?`
      )
      if (!ok) return
      for (const u of selectedRows) {
        await deleteUser(u)
      }
    }
  }

  // Column definitions for TanStack DataTable
  const columns = useMemo<ColumnDef<UserItem>[]>(
    () => [
      {
        accessorKey: "name",
        header: "User",
        cell: ({ row }) => {
          const u = row.original
          const initials = u.name
            ? u.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()
            : "US"

          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border border-border/60">
                <AvatarImage src={u.image || undefined} alt={u.name} />
                <AvatarFallback className="bg-primary/10 text-[11px] font-bold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="truncate font-semibold text-foreground">
                  {u.name}
                </span>
                <span className="truncate font-mono text-[10px] text-muted-foreground">
                  {u.id}
                </span>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "email",
        header: "Email & Status",
        cell: ({ row }) => {
          const u = row.original
          return (
            <div className="flex flex-col gap-0.5">
              <span className="truncate font-medium text-foreground">
                {u.email}
              </span>
              <div className="flex items-center gap-1 text-[10px]">
                {u.emailVerified ? (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="h-3 w-3" /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <XCircle className="h-3 w-3" /> Unverified
                  </span>
                )}
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
          const role = row.original.role
          const isAdmin = role === "admin"
          return (
            <Badge
              variant={isAdmin ? "default" : "secondary"}
              className="gap-1 px-2 text-[10px] font-semibold capitalize"
            >
              {isAdmin ? (
                <>
                  <Shield className="h-3 w-3 text-amber-400" />
                  <span>Admin</span>
                </>
              ) : (
                <>
                  <User className="h-3 w-3 text-muted-foreground" />
                  <span>User</span>
                </>
              )}
            </Badge>
          )
        },
      },
      {
        accessorKey: "createdAt",
        header: "Joined Date",
        cell: ({ row }) => {
          const dateStr = row.original.createdAt
          return (
            <span className="text-muted-foreground">
              {new Date(dateStr).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const u = row.original
          return (
            <div className="flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => handleOpenEdit(u)}
                title="Edit User"
              >
                <PencilSimple className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                onClick={() => handleOpenDelete(u)}
                title="Delete User"
              >
                <Trash className="h-3.5 w-3.5" />
              </Button>
            </div>
          )
        },
      },
    ],
    []
  )

  return (
    <>
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle className="text-lg font-bold">User Management</CardTitle>
            <CardDescription className="text-xs">
              Manage accounts, roles, credentials, and verification status of all KomikHQ users.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchUsers(false)}
              disabled={loading || isFetching}
              className="gap-1.5 text-xs cursor-pointer"
            >
              <ArrowsClockwise
                className={`h-3.5 w-3.5 ${isFetching || loading ? "animate-spin text-primary" : ""}`}
              />
              <span>Refresh</span>
            </Button>
            <Button
              size="sm"
              onClick={handleOpenAdd}
              className="gap-1.5 text-xs cursor-pointer"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Add New User</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search & Role Filter Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <MagnifyingGlass className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or user ID..."
                className="h-9 pl-9 text-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                Role Filter:
              </span>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-9 w-36 text-xs bg-background">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="user">Regular User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stable Height DataTable */}
          <DataTable
            columns={columns}
            data={users}
            loading={loading}
            loadingMessage="Loading users catalog..."
            emptyMessage="No users found matching your search criteria."
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 50, 100]}
            fixedHeight={true}
            showGhostRows={true}
            enableRowSelection={true}
            enableRowNumbers={true}
            bulkActions={[
              {
                label: "Delete Selected",
                value: "delete",
                variant: "destructive",
              },
            ]}
            onBulkAction={handleBulkAction}
            serverPagination={{
              page,
              totalPages,
              totalRecords,
              onPageChange: setPage,
            }}
          />
        </CardContent>
      </Card>

      {/* Form Dialog for Add & Edit */}
      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        user={editingUser}
        onSubmit={handleFormSubmit}
        submitting={submitting}
      />

      {/* Delete Confirmation Alert Dialog */}
      <UserDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        user={deleteTarget}
        onConfirm={handleConfirmDelete}
        submitting={submitting}
      />
    </>
  )
}

