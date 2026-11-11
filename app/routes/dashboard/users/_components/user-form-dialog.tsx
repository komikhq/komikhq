import { useState, useEffect } from "react"
import { KeyIcon as Key } from "@phosphor-icons/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { UserItem } from "@/hooks/use-admin-users"

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: UserItem | null
  onSubmit: (data: {
    name: string
    email: string
    password?: string
    role: string
  }) => Promise<boolean>
  submitting?: boolean
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
  submitting = false,
}: UserFormDialogProps) {
  const isEditing = Boolean(user)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("user")
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (open) {
      if (user) {
        setName(user.name || "")
        setEmail(user.email || "")
        setRole(user.role || "user")
        setPassword("")
      } else {
        setName("")
        setEmail("")
        setRole("user")
        setPassword("")
      }
    }
  }, [open, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await onSubmit({
      name,
      email,
      role,
      password: password || undefined,
    })
    if (success) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">
            {isEditing ? `Edit User: ${user?.name}` : "Add New User"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {isEditing
              ? "Update profile details, permissions, or set a new password."
              : "Create a new user account with assigned role and credentials."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 py-2 text-xs">
          <div className="space-y-1.5">
            <Label htmlFor="user-name" className="text-xs font-semibold">
              Full Name
            </Label>
            <Input
              id="user-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="h-9 text-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="user-email" className="text-xs font-semibold">
              Email Address
            </Label>
            <Input
              id="user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="h-9 text-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="user-role" className="text-xs font-semibold">
              Role Permission
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="user-role" className="h-9 text-xs">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Regular User</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="user-password"
              className="flex items-center gap-1.5 text-xs font-semibold"
            >
              <Key className="h-3.5 w-3.5 text-primary" />
              <span>
                {isEditing ? "Reset Password (Optional)" : "Password"}
              </span>
            </Label>
            <Input
              id="user-password"
              type="password"
              placeholder={
                isEditing
                  ? "Leave blank to keep current password"
                  : "At least 8 characters"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-9 text-xs"
              required={!isEditing}
              minLength={isEditing ? undefined : 8}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={submitting}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting}>
              {submitting
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

