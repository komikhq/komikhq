import React, { useState, useEffect } from "react";
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
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { API_BASE_URL } from "@/constants";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  username?: string | null;
  role: string;
  createdAt: string;
}

export function AdminUserManagementCard() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("user");
  const [editPassword, setEditPassword] = useState("");

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/users?q=${encodeURIComponent(search)}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Gagal mengambil daftar pengguna");
      const data = (await res.json()) as any;
      setUsers(data.users || []);
    } catch (err: any) {
      toast.error(err.message || "Gagal memuat pengguna.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleOpenEdit = (user: UserItem) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role || "user");
    setEditPassword("");
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          role: editRole,
          password: editPassword || undefined,
        }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui pengguna.");

      toast.success(`Data pengguna ${editName} berhasil diperbarui.`);
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan perubahan.");
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/users/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Gagal menghapus pengguna.");

      toast.success(data.message || `User ${deleteTarget.name} telah dihapus.`);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus akun.");
    }
  };

  const handleCreateUser = async () => {
    if (!editName || !editEmail || !editPassword) {
      toast.error("Nama, email, dan kata sandi wajib diisi.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          password: editPassword,
          role: editRole,
        }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) throw new Error(data.error || "Gagal membuat pengguna baru.");

      toast.success(`Pengguna ${editName} berhasil dibuat.`);
      setIsAddOpen(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Gagal membuat pengguna.");
    }
  };

  return (
    <>
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold">Manajemen Pengguna</CardTitle>
            <CardDescription className="text-xs">
              Kelola role, kredensial, dan status verifikasi seluruh pengguna KomikHQ.
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
                setEditName("");
                setEditEmail("");
                setEditRole("user");
                setEditPassword("");
                setIsAddOpen(true);
              }}
              className="gap-1.5 text-xs"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Tambah User Baru</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="relative w-full max-w-sm">
            <MagnifyingGlass className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan nama atau email..."
              className="pl-9 text-xs h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="rounded-xl border border-border/60 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground font-semibold border-b border-border/60">
                <tr>
                  <th className="p-3">Pengguna</th>
                  <th className="p-3">Email & Status</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Tanggal Dibuat</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <ArrowsClockwise className="h-4 w-4 animate-spin text-primary" />
                        <span>Memuat daftar pengguna...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      Tidak ada pengguna ditemukan.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-border/60">
                            <AvatarImage src={u.image || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                              {u.name ? u.name.slice(0, 2).toUpperCase() : "US"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground">{u.name}</span>
                            <span className="text-[10px] text-muted-foreground">{u.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-foreground">{u.email}</span>
                          <div className="flex items-center gap-1 text-[10px]">
                            {u.emailVerified ? (
                              <span className="text-emerald-500 flex items-center gap-0.5">
                                <CheckCircle className="h-3 w-3" /> Terverifikasi
                              </span>
                            ) : (
                              <span className="text-amber-500 flex items-center gap-0.5">
                                <XCircle className="h-3 w-3" /> Belum Verifikasi
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
                        {new Date(u.createdAt).toLocaleDateString("id-ID", {
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
                            title="Edit Pengguna"
                          >
                            <PencilSimple className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteTarget(u)}
                            title="Hapus Pengguna"
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
      <Dialog open={Boolean(editingUser)} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Pengguna</DialogTitle>
            <DialogDescription>
              Perbarui rincian profil, role, atau kata sandi pengguna ini secara remote.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold block mb-1">Nama Lengkap</label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8 text-xs" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Alamat Email</label>
              <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="h-8 text-xs" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Role Akses</label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User Biasa</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="font-semibold block mb-1 flex items-center gap-1">
                <Key className="h-3.5 w-3.5 text-primary" />
                <span>Reset Kata Sandi (Opsional)</span>
              </label>
              <Input
                type="password"
                placeholder="Kosongkan jika tidak ingin mengubah"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setEditingUser(null)}>
              Batal
            </Button>
            <Button size="sm" onClick={handleSaveEdit}>
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah User Baru</DialogTitle>
            <DialogDescription>
              Buat akun baru secara langsung dari dashboard administrator.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold block mb-1">Nama Lengkap</label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Nama pengguna" className="h-8 text-xs" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Alamat Email</label>
              <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="email@domain.com" className="h-8 text-xs" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Kata Sandi</label>
              <Input type="password" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} placeholder="Minimal 8 karakter" className="h-8 text-xs" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Role Akses</label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User Biasa</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>
              Batal
            </Button>
            <Button size="sm" onClick={handleCreateUser}>
              Buat Akun
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deleteTarget)} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Konfirmasi Hapus Pengguna</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pengguna <strong className="text-foreground">{deleteTarget?.name}</strong> ({deleteTarget?.email})? Tindakan ini permanen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>
              Batal
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteUser}>
              Hapus Permanen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
