import { useState, useEffect, useCallback, useRef } from "react"
import { toast } from "sonner"
import { administrationApi } from "@/lib/sdk-client"

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

export function useAdminUsers(initialPageSize = 10) {
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)

  const isInitialMount = useRef(true)

  const fetchUsers = useCallback(async (isBackground = false) => {
    if (isBackground) {
      setIsFetching(true)
    } else {
      setLoading(true)
    }

    try {
      const resJson: any = await administrationApi.adminListUsers({
        q: search.trim() || undefined,
        page: page,
        limit: pageSize,
      })

      const rawUsers: UserItem[] =
        resJson?.data?.users || resJson?.users || []

      // Client-side role filter fallback if server doesn't filter role
      const filtered =
        roleFilter === "all"
          ? rawUsers
          : rawUsers.filter((u) => u.role === roleFilter)

      setUsers(filtered)

      const pagination = resJson?.data?.pagination || resJson?.pagination
      if (pagination) {
        setTotalPages(pagination.totalPages || 1)
        setTotalRecords(pagination.total ?? filtered.length)
      } else {
        setTotalPages(1)
        setTotalRecords(filtered.length)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load users.")
    } finally {
      setLoading(false)
      setIsFetching(false)
    }
  }, [search, roleFilter, page, pageSize])

  // Initial load
  useEffect(() => {
    fetchUsers(false)
    isInitialMount.current = false
  }, [page, pageSize, roleFilter])

  // Debounced search
  useEffect(() => {
    if (isInitialMount.current) return
    const timer = setTimeout(() => {
      setPage(1)
      fetchUsers(true)
    }, 350)
    return () => clearTimeout(timer)
  }, [search])

  const createUser = async (data: {
    name: string
    email: string
    password?: string
    role: string
  }): Promise<boolean> => {
    if (!data.name || !data.email || !data.password) {
      toast.error("Name, email, and password are required.")
      return false
    }

    setSubmitting(true)
    try {
      await administrationApi.adminCreateUser({
        adminCreateUserRequest: {
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        },
      })
      toast.success(`User "${data.name}" successfully created.`)
      fetchUsers(true)
      return true
    } catch (err: any) {
      toast.error(err.message || "Failed to create user.")
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const updateUser = async (
    id: string,
    data: {
      name: string
      email: string
      password?: string
      role: string
    }
  ): Promise<boolean> => {
    setSubmitting(true)
    try {
      await administrationApi.adminUpdateUser({
        id,
        requestBody: {
          name: data.name,
          email: data.email,
          role: data.role,
          password: data.password || undefined,
        },
      })
      toast.success(`User "${data.name}" successfully updated.`)
      fetchUsers(true)
      return true
    } catch (err: any) {
      toast.error(err.message || "Failed to save changes.")
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const deleteUser = async (user: UserItem): Promise<boolean> => {
    setSubmitting(true)
    try {
      const data: any = await administrationApi.adminDeleteUser({
        id: user.id,
      })
      toast.success(data?.message || `User "${user.name}" has been deleted.`)
      fetchUsers(true)
      return true
    } catch (err: any) {
      toast.error(err.message || "Failed to delete account.")
      return false
    } finally {
      setSubmitting(false)
    }
  }

  return {
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
  }
}

