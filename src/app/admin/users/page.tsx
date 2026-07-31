"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  UsersRound,
  Plus,
  Pencil,
  Trash2,
  KeyRound,
  Search,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ─── Types ───

interface UserData {
  id: string;
  name: string;
  username: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

// ─── Role Config ───

const roleConfig: Record<string, { label: string; color: string }> = {
  admin: { label: "Admin", color: "bg-orange-100 text-orange-700" },
  sales: { label: "Sales", color: "bg-sky-100 text-sky-700" },
};

// ─── Component ───

export default function UsersPage() {
  const { data: session } = useSession();
  const currentUserId = (session?.user as { id?: string })?.id;

  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Dialogs
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  // Form state
  const [addForm, setAddForm] = useState({
    name: "",
    username: "",
    password: "",
    role: "sales",
  });
  const [editForm, setEditForm] = useState({
    name: "",
    username: "",
    role: "",
    isActive: true,
  });
  const [passwordForm, setPasswordForm] = useState({ password: "" });
  const [saving, setSaving] = useState(false);

  // ─── Fetch users ───
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch {
      toast.error("Gagal memuat data pengguna");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ─── Add user ───
  const handleAdd = async () => {
    if (!addForm.name || !addForm.username || !addForm.password) {
      toast.error("Semua field wajib diisi");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      if (res.ok) {
        toast.success("Pengguna berhasil ditambahkan");
        setShowAddDialog(false);
        setAddForm({ name: "", username: "", password: "", role: "sales" });
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal menambahkan pengguna");
      }
    } catch {
      toast.error("Gagal menambahkan pengguna");
    } finally {
      setSaving(false);
    }
  };

  // ─── Edit user ───
  const handleEdit = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          role: editForm.role,
          isActive: editForm.isActive,
        }),
      });
      if (res.ok) {
        toast.success("Pengguna berhasil diupdate");
        setShowEditDialog(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal mengupdate pengguna");
      }
    } catch {
      toast.error("Gagal mengupdate pengguna");
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete user ───
  const handleDelete = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Pengguna berhasil dihapus");
        setShowDeleteDialog(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal menghapus pengguna");
      }
    } catch {
      toast.error("Gagal menghapus pengguna");
    } finally {
      setSaving(false);
    }
  };

  // ─── Change password ───
  const handleChangePassword = async () => {
    if (!selectedUser) return;
    if (!passwordForm.password || passwordForm.password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordForm.password }),
      });
      if (res.ok) {
        toast.success("Password berhasil diubah");
        setShowPasswordDialog(false);
        setPasswordForm({ password: "" });
        setSelectedUser(null);
      } else {
        const data = await res.json();
        toast.error(data.error || "Gagal mengubah password");
      }
    } catch {
      toast.error("Gagal mengubah password");
    } finally {
      setSaving(false);
    }
  };

  // ─── Open edit dialog ───
  const openEditDialog = (user: UserData) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
    });
    setShowEditDialog(true);
  };

  // ─── Filter users ───
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
  );

  const isSelf = (userId: string) => userId === currentUserId;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <UsersRound className="h-5 w-5 text-slate-500" />
            Pengguna
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola akun pengguna admin panel
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-[#14B8A6] hover:bg-[#0D9488] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Pengguna
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Cari nama atau username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Card className="border-slate-200/80 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-slate-400"
                      >
                        {search ? "Tidak ada hasil" : "Belum ada pengguna"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => {
                      const rc = roleConfig[user.role] || roleConfig.sales;
                      return (
                        <TableRow key={user.id} className="hover:bg-slate-50">
                          <TableCell className="font-medium text-slate-700">
                            {user.name}
                            {isSelf(user.id) && (
                              <span className="text-xs text-slate-400 ml-1">
                                (Anda)
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-slate-500 text-sm">
                            @{user.username}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={rc.color}
                            >
                              {rc.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={
                                user.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }
                            >
                              {user.isActive ? "Aktif" : "Nonaktif"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(user)}
                                className="text-[#14B8A6] hover:text-[#0D9488]"
                                title="Edit"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setPasswordForm({ password: "" });
                                  setShowPasswordDialog(true);
                                }}
                                className="text-amber-600 hover:text-amber-700"
                                title="Ubah Password"
                              >
                                <KeyRound className="h-4 w-4" />
                              </Button>
                              {!isSelf(user.id) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setShowDeleteDialog(true);
                                  }}
                                  className="text-red-500 hover:text-red-600"
                                  title="Hapus"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        {filteredUsers.length === 0 ? (
          <Card className="border-slate-200/80 shadow-sm">
            <CardContent className="p-6 text-center text-slate-400">
              {search ? "Tidak ada hasil" : "Belum ada pengguna"}
            </CardContent>
          </Card>
        ) : (
          filteredUsers.map((user) => {
            const rc = roleConfig[user.role] || roleConfig.sales;
            return (
              <Card key={user.id} className="border-slate-200/80 shadow-sm">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">
                        {user.name}
                        {isSelf(user.id) && (
                          <span className="text-xs text-slate-400 ml-1">
                            (Anda)
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        @{user.username}
                      </p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <Badge variant="secondary" className={rc.color}>
                        {rc.label}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={
                          user.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {user.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(user)}
                      className="flex-1 text-[#14B8A6] hover:text-[#0D9488] hover:bg-[#14B8A6]/10"
                    >
                      <Pencil className="h-4 w-4 mr-1.5" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setPasswordForm({ password: "" });
                        setShowPasswordDialog(true);
                      }}
                      className="flex-1 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                    >
                      <KeyRound className="h-4 w-4 mr-1.5" />
                      Password
                    </Button>
                    {!isSelf(user.id) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteDialog(true);
                        }}
                        className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1.5" />
                        Hapus
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* ── Add User Dialog ── */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Pengguna Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nama *</Label>
              <Input
                value={addForm.name}
                onChange={(e) =>
                  setAddForm({ ...addForm, name: e.target.value })
                }
                placeholder="Nama lengkap"
              />
            </div>
            <div className="space-y-2">
              <Label>Username *</Label>
              <Input
                value={addForm.username}
                onChange={(e) =>
                  setAddForm({ ...addForm, username: e.target.value })
                }
                placeholder="Username untuk login"
              />
            </div>
            <div className="space-y-2">
              <Label>Password *</Label>
              <Input
                type="password"
                value={addForm.password}
                onChange={(e) =>
                  setAddForm({ ...addForm, password: e.target.value })
                }
                placeholder="Minimal 6 karakter"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={addForm.role}
                onValueChange={(value) =>
                  setAddForm({ ...addForm, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Batal
            </Button>
            <Button
              className="bg-[#14B8A6] hover:bg-[#0D9488] text-white"
              onClick={handleAdd}
              disabled={
                saving || !addForm.name || !addForm.username || !addForm.password
              }
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Edit User Dialog ── */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pengguna</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nama</Label>
              <Input
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Username</Label>
              <Input value={editForm.username} disabled className="bg-slate-50" />
              <p className="text-xs text-slate-400">Username tidak bisa diubah</p>
            </div>
            {selectedUser && !isSelf(selectedUser.id) && (
              <>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select
                    value={editForm.role}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editForm.isActive ? "aktif" : "nonaktif"}
                    onValueChange={(value) =>
                      setEditForm({
                        ...editForm,
                        isActive: value === "aktif",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aktif">Aktif</SelectItem>
                      <SelectItem value="nonaktif">Nonaktif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            {selectedUser && isSelf(selectedUser.id) && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                <p className="text-xs text-amber-700">
                  Anda tidak bisa mengubah role atau status akun sendiri.
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Batal
            </Button>
            <Button
              className="bg-[#14B8A6] hover:bg-[#0D9488] text-white"
              onClick={handleEdit}
              disabled={saving}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Change Password Dialog ── */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-slate-500">
              Mengubah password untuk:{" "}
              <strong>{selectedUser?.name}</strong>
            </p>
            <div className="space-y-2">
              <Label>Password Baru *</Label>
              <Input
                type="password"
                value={passwordForm.password}
                onChange={(e) =>
                  setPasswordForm({ password: e.target.value })
                }
                placeholder="Minimal 6 karakter"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPasswordDialog(false)}
            >
              Batal
            </Button>
            <Button
              className="bg-[#14B8A6] hover:bg-[#0D9488] text-white"
              onClick={handleChangePassword}
              disabled={saving || !passwordForm.password}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ubah Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete User AlertDialog ── */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengguna?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda yakin ingin menghapus pengguna{" "}
              <strong>{selectedUser?.name}</strong>? Tindakan ini tidak bisa
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
