"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, ToggleLeft, ToggleRight } from "lucide-react";

interface SalesUser {
  id: string;
  name: string;
  username: string;
  isActive: boolean;
  createdAt: string;
  totalLeads: number;
  totalFollowups: number;
  activeLeads: number;
  approvedLeads: number;
}

export default function AdminSalesPage() {
  const [sales, setSales] = useState<SalesUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editUser, setEditUser] = useState<SalesUser | null>(null);
  const [form, setForm] = useState({ name: "", username: "", password: "" });

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await fetch("/api/admin/sales");
      if (res.ok) {
        const data = await res.json();
        setSales(data.sales);
      }
    } catch (error) {
      console.error("Fetch sales error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSales = async () => {
    try {
      const res = await fetch("/api/admin/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowAddDialog(false);
        setForm({ name: "", username: "", password: "" });
        fetchSales();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menambah sales");
      }
    } catch (error) {
      console.error("Add sales error:", error);
    }
  };

  const handleEditSales = async () => {
    if (!editUser) return;
    try {
      const res = await fetch("/api/admin/sales", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editUser.id,
          name: form.name,
          username: form.username,
          password: form.password || undefined,
        }),
      });
      if (res.ok) {
        setShowEditDialog(false);
        setEditUser(null);
        setForm({ name: "", username: "", password: "" });
        fetchSales();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal mengupdate sales");
      }
    } catch (error) {
      console.error("Edit sales error:", error);
    }
  };

  const handleToggleActive = async (user: SalesUser) => {
    try {
      const res = await fetch("/api/admin/sales", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, isActive: !user.isActive }),
      });
      if (res.ok) {
        fetchSales();
      }
    } catch (error) {
      console.error("Toggle active error:", error);
    }
  };

  const openEditDialog = (user: SalesUser) => {
    setEditUser(user);
    setForm({ name: user.name, username: user.username, password: "" });
    setShowEditDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sales</h1>
          <p className="text-slate-500 text-sm">Kelola tim sales</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#14B8A6] hover:bg-[#0D9488] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Sales
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Sales Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nama *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nama lengkap"
                />
              </div>
              <div className="space-y-2">
                <Label>Username *</Label>
                <Input
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Username untuk login"
                />
              </div>
              <div className="space-y-2">
                <Label>Password *</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Minimal 6 karakter"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Batal</Button>
              <Button
                className="bg-[#14B8A6] hover:bg-[#0D9488] text-white"
                onClick={handleAddSales}
                disabled={!form.name || !form.username || !form.password}
              >
                Simpan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-slate-800">{sales.length}</p>
            <p className="text-xs text-slate-500">Total Sales</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {sales.filter((s) => s.isActive).length}
            </p>
            <p className="text-xs text-slate-500">Aktif</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-[#14B8A6]">
              {sales.reduce((sum, s) => sum + s.activeLeads, 0)}
            </p>
            <p className="text-xs text-slate-500">Leads Aktif</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">
              {sales.reduce((sum, s) => sum + s.approvedLeads, 0)}
            </p>
            <p className="text-xs text-slate-500">Leads Deal</p>
          </CardContent>
        </Card>
      </div>

      {/* Desktop Table (md+) */}
      <div className="hidden md:block">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Leads</TableHead>
                    <TableHead>Leads Aktif</TableHead>
                    <TableHead>Deal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                        Memuat data...
                      </TableCell>
                    </TableRow>
                  ) : sales.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                        Belum ada sales
                      </TableCell>
                    </TableRow>
                  ) : (
                    sales.map((user) => (
                      <TableRow key={user.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium text-slate-700">
                          {user.name}
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm">
                          {user.username}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                          >
                            {user.isActive ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{user.totalLeads}</TableCell>
                        <TableCell className="text-sm">{user.activeLeads}</TableCell>
                        <TableCell className="text-sm font-medium text-emerald-600">
                          {user.approvedLeads}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(user)}
                              className="text-[#14B8A6] hover:text-[#0D9488]"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleActive(user)}
                              className={user.isActive ? "text-red-500 hover:text-red-600" : "text-green-500 hover:text-green-600"}
                            >
                              {user.isActive ? (
                                <ToggleRight className="h-4 w-4" />
                              ) : (
                                <ToggleLeft className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Card Layout (< md) */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <Card>
            <CardContent className="p-6 text-center text-slate-400">
              Memuat data...
            </CardContent>
          </Card>
        ) : sales.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-slate-400">
              Belum ada sales
            </CardContent>
          </Card>
        ) : (
          sales.map((user) => (
            <Card key={user.id} className="rounded-lg border">
              <CardContent className="p-4 space-y-3">
                {/* Name & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{user.name}</p>
                    <p className="text-sm text-slate-500 truncate">@{user.username}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`shrink-0 ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {user.isActive ? "Aktif" : "Nonaktif"}
                  </Badge>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-md bg-slate-50 px-2 py-1.5">
                    <p className="text-lg font-bold text-slate-700">{user.totalLeads}</p>
                    <p className="text-[11px] text-slate-500">Total Leads</p>
                  </div>
                  <div className="rounded-md bg-slate-50 px-2 py-1.5">
                    <p className="text-lg font-bold text-[#14B8A6]">{user.activeLeads}</p>
                    <p className="text-[11px] text-slate-500">Leads Aktif</p>
                  </div>
                  <div className="rounded-md bg-slate-50 px-2 py-1.5">
                    <p className="text-lg font-bold text-emerald-600">{user.approvedLeads}</p>
                    <p className="text-[11px] text-slate-500">Deal</p>
                  </div>
                </div>

                {/* Action Buttons */}
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
                    onClick={() => handleToggleActive(user)}
                    className={`flex-1 ${user.isActive ? "text-red-500 hover:text-red-600 hover:bg-red-50" : "text-green-500 hover:text-green-600 hover:bg-green-50"}`}
                  >
                    {user.isActive ? (
                      <>
                        <ToggleRight className="h-4 w-4 mr-1.5" />
                        Nonaktifkan
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="h-4 w-4 mr-1.5" />
                        Aktifkan
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Sales</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nama *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Username *</Label>
              <Input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Password (kosongkan jika tidak diubah)</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Password baru"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Batal</Button>
            <Button
              className="bg-[#14B8A6] hover:bg-[#0D9488] text-white"
              onClick={handleEditSales}
              disabled={!form.name || !form.username}
            >
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
