import React, { useState, useEffect } from "react"
import {
  MagnifyingGlass,
  UserPlus,
  Shield,
  User,
  Trash,
  PencilSimple,
  Key,
  CheckCircle,
  XCircle,
  ArrowsClockwise,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { getBaseApiUrl } from "@/lib/api-client"

export interface UserItem {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image?: string | null
  username?: string | null
  role: string
  createdAt: string
}

export function AdminUserManagementCard() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<UserItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)

  // Form states
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editRole, setEditRole] = useState("user")
  const [editPassword, setEditPassword] = useState("")

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(
        `${getBaseApiUrl()}/v1/admin/users?q=${encodeURIComponent(search)}`,
        {
          credentials: "include",
        }
      )
      if (!res.ok) throw new Error("Failed to fetch user list")
      const resJson = (await res.json()) as any
      const userList = resJson.data?.users || resJson.users || []
      setUsers(userList)
    } catch (err: any) {
      toast.error(err.message || "Failed to load users.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers()
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const handleOpenEdit = (user: UserItem) => {
    setEditingUser(user)
    setEditName(user.name)
    setEditEmail(user.email)
    setEditRole(user.role || "user")
    setEditPassword("")
  }

  const handleSaveEdit = async () => {
    if (!editingUser) return
    try {
      const res = await fetch(
        `${getBaseApiUrl()}/v1/admin/users/${editingUser.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: editName,
            email: editEmail,
            role: editRole,
            password: editPassword || undefined,
          }),
        }
      )

      const data = (await res.json()) as any
      if (!res.ok) throw new Error(data.error || "Failed to update user.")

      toast.success(`User ${editName} successfully updated.`)
      setEditingUser(null)
      fetchUsers()
    } catch (err: any) {
      toast.error(err.message || "Failed to save changes.")
    }
  }

  const handleDeleteUser = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(
        `${getBaseApiUrl()}/v1/admin/users/${deleteTarget.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      )

      const data = (await res.json()) as any
      if (!res.ok) throw new Error(data.error || "Failed to delete user.")

      toast.success(
        data.message || `User ${deleteTarget.name} has been deleted.`
      )
      setDeleteTarget(null)
      fetchUsers()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete account.")
    }
  }

  const handleCreateUser = async () => {
    if (!editName || !editEmail || !editPassword) {
      toast.error("Name, email, and password are required.")
      return
    }
    try {
      const res = await fetch(`${getBaseApiUrl()}/v1/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          password: editPassword,
          role: editRole,
        }),
      })

      const data = (await res.json()) as any
      if (!res.ok) throw new Error(data.error || "Failed to create new user.")

      toast.success(`User ${editName} successfully created.`)
      setIsAddOpen(false)
      fetchUsers()
    } catch (err: any) {
      toast.error(err.message || "Failed to create user.")
    }
  }

  return (
    <>
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle className="text-lg font-bold">User Management</CardTitle>
            <CardDescription className="text-xs">
              Manage roles, credentials, and verification status of all KomikHQ
              users.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchUsers}
              className="gap-1.5 text-xs"
            >
              <ArrowsClockwise className="h-3.5 w-3.5" />
              <span>Refresh</span>
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setEditName("")
                setEditEmail("")
                setEditRole("user")
                setEditPassword("")
                setIsAddOpen(true)
              }}
              className="gap-1.5 text-xs"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Add New User</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="relative w-full max-w-sm">
            <MagnifyingGlass className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="h-9 pl-9 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-border/60">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-muted/60 font-semibold text-muted-foreground">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Email & Status</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Created Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-muted-foreground"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <ArrowsClockwise className="h-4 w-4 animate-spin text-primary" />
                        <span>Loading users...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr
                      key={u.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-border/60">
                            <AvatarImage src={u.image || undefined} />
                            <AvatarFallback className="bg-primary/10 font-bold text-primary">
                              {u.name ? u.name.slice(0, 2).toUpperCase() : "US"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground">
                              {u.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {u.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-foreground">
                            {u.email}
                          </span>
                          <div className="flex items-center gap-1 text-[10px]">
                            {u.emailVerified ? (
                              <span className="flex items-center gap-0.5 text-emerald-500">
                                <CheckCircle className="h-3 w-3" /> Verified
                              </span>
                            ) : (
                              <span className="flex items-center gap-0.5 text-amber-500">
                                <XCircle className="h-3 w-3" /> Unverified
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={u.role === "admin" ? "default" : "secondary"}
                          className="gap-1 px-2 text-[10px] font-semibold"
                        >
                          {u.role === "admin" ? (
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
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {new Date(u.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={() => handleOpenEdit(u)}
                            title="Edit User"
                          >
                            <PencilSimple className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setDeleteTarget(u)}
                            title="Delete User"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog
        open={Boolean(editingUser)}
        onOpenChange={() => setEditingUser(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update profile details, role, or password for this user.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="mb-1 block font-semibold">Full Name</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <label className="mb-1 block font-semibold">Email Address</label>
              <Input
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <label className="mb-1 block font-semibold">Role</label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Regular User</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block flex items-center gap-1 font-semibold">
                <Key className="h-3.5 w-3.5 text-primary" />
                <span>Reset Password (Optional)</span>
              </label>
              <Input
                type="password"
                placeholder="Leave blank to keep unchanged"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingUser(null)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account directly from the admin dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="mb-1 block font-semibold">Full Name</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="User name"
                className="h-8 text-xs"
              />
            </div>
            <div>
              <label className="mb-1 block font-semibold">Email Address</label>
              <Input
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="email@domain.com"
                className="h-8 text-xs"
              />
            </div>
            <div>
              <label className="mb-1 block font-semibold">Password</label>
              <Input
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="h-8 text-xs"
              />
            </div>
            <div>
              <label className="mb-1 block font-semibold">Role</label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Regular User</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreateUser}>
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Confirm Delete User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user{" "}
              <strong className="text-foreground">{deleteTarget?.name}</strong>{" "}
              ({deleteTarget?.email})? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteUser}>
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
