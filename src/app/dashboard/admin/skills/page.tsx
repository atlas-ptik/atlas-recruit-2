// src/app/dashboard/admin/skills/page.tsx - Halaman manajemen keahlian
"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Code, MoreVertical, Plus, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/contexts/ApiContext";
// Removed toast import
import {
  Skill,
  CreateSkillRequest,
  UpdateSkillRequest,
} from "@/lib/api/skillService";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export default function AdminSkillsPage() {
  const { services } = useApi();

  // State for skills data
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // State for CRUD operations
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState<
    CreateSkillRequest | UpdateSkillRequest
  >({
    nama: "",
    kategori: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define loadSkills with useCallback
  const loadSkills = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters = {
        halaman: currentPage,
        per_halaman: 20,
        keyword: searchQuery || undefined,
        kategori: categoryFilter || undefined,
      };

      const response = await services.skill.getSkills(filters);
      setSkills(response.keahlian);
      setTotalPages(response.pagination.halaman_total);

      // Only update categories if not already loaded
      if (categories.length === 0 && response.kategori) {
        setCategories(response.kategori);
      }
    } catch (error) {
      console.error("Error loading skills:", error);
      console.error("Gagal memuat data keahlian");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, categoryFilter, services.skill]);

  // Load skills on initial render and when filters change
  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  // Handle add skill
  const handleAddSkill = async () => {
    setIsSubmitting(true);
    try {
      // Validation
      if (!formData.nama || !formData.kategori) {
        alert("Error: Nama dan kategori keahlian wajib diisi");
        setIsSubmitting(false);
        return;
      }

      await services.skill.createSkill(formData as CreateSkillRequest);

      alert("Sukses: Keahlian berhasil ditambahkan");

      // Reset form and close dialog
      setFormData({ nama: "", kategori: "" });
      setIsAddDialogOpen(false);

      // Reload skills
      loadSkills();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal menambahkan keahlian";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit skill
  const handleEditSkill = async () => {
    if (!currentSkill) return;

    setIsSubmitting(true);
    try {
      // Validation
      if (!formData.nama || !formData.kategori) {
        alert("Error: Nama dan kategori keahlian wajib diisi");
        setIsSubmitting(false);
        return;
      }

      // Only update if there are changes
      const updates: UpdateSkillRequest = {};
      if (formData.nama !== currentSkill.nama) {
        updates.nama = formData.nama;
      }
      if (formData.kategori !== currentSkill.kategori) {
        updates.kategori = formData.kategori;
      }

      if (Object.keys(updates).length > 0) {
        await services.skill.updateSkill(currentSkill.id, updates);

        alert("Sukses: Keahlian berhasil diperbarui");
      } else {
        alert("Info: Tidak ada perubahan yang dilakukan");
      }

      // Reset form and close dialog
      setFormData({ nama: "", kategori: "" });
      setCurrentSkill(null);
      setIsEditDialogOpen(false);

      // Reload skills
      loadSkills();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal memperbarui keahlian";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete skill
  const handleDeleteSkill = async () => {
    if (!currentSkill) return;

    try {
      await services.skill.deleteSkill(currentSkill.id);

      alert("Sukses: Keahlian berhasil dihapus");

      // Reset and close dialog
      setCurrentSkill(null);
      setIsDeleteDialogOpen(false);

      // Reload skills
      loadSkills();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Gagal menghapus keahlian. Keahlian mungkin sedang digunakan.";
      alert(`Error: ${errorMessage}`);
      setIsDeleteDialogOpen(false);
    }
  };

  // Open edit dialog with current skill data
  const openEditDialog = (skill: Skill) => {
    setCurrentSkill(skill);
    setFormData({
      nama: skill.nama,
      kategori: skill.kategori,
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (skill: Skill) => {
    setCurrentSkill(skill);
    setIsDeleteDialogOpen(true);
  };

  // Handle form field changes
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kelola Keahlian</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Keahlian
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        {/* Filters */}
        <div className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari keahlian..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Semua Kategori</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">No</TableHead>
                <TableHead className="min-w-[200px]">Nama Keahlian</TableHead>
                <TableHead className="min-w-[150px]">Kategori</TableHead>
                <TableHead className="min-w-[150px]">Tanggal Dibuat</TableHead>
                <TableHead className="w-[70px] text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeletons
                Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[200px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[100px] rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
              ) : skills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Code className="h-10 w-10 mb-2" />
                      <p>Tidak ada keahlian yang ditemukan</p>
                      {(searchQuery || categoryFilter) && (
                        <Button
                          variant="link"
                          onClick={() => {
                            setSearchQuery("");
                            setCategoryFilter("");
                          }}
                        >
                          Reset filter
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                skills.map((skill, index) => (
                  <TableRow key={skill.id}>
                    <TableCell>{(currentPage - 1) * 20 + index + 1}</TableCell>
                    <TableCell className="font-medium">{skill.nama}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary"
                      >
                        {skill.kategori}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(skill.dibuat_pada).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openEditDialog(skill)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => openDeleteDialog(skill)}
                          >
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center py-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => {
                      if (currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                      }
                    }}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                <PaginationItem className="flex items-center text-sm">
                  Halaman {currentPage} dari {totalPages}
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => {
                      if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1);
                      }
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Add Skill Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Keahlian Baru</DialogTitle>
            <DialogDescription>
              Tambahkan keahlian baru ke dalam platform
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="skill-name">
                Nama Keahlian <span className="text-destructive">*</span>
              </Label>
              <Input
                id="skill-name"
                value={formData.nama}
                onChange={(e) => handleChange("nama", e.target.value)}
                placeholder="Contoh: React, PHP, Project Management"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skill-category">
                Kategori <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <Select
                  value={formData.kategori}
                  onValueChange={(value) => handleChange("kategori", value)}
                >
                  <SelectTrigger className="flex-grow">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                    <SelectItem value="Baru">+ Kategori Baru</SelectItem>
                  </SelectContent>
                </Select>
                {formData.kategori === "Baru" && (
                  <Input
                    placeholder="Masukkan kategori baru"
                    onChange={(e) => handleChange("kategori", e.target.value)}
                    className="flex-grow"
                  />
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setFormData({ nama: "", kategori: "" });
                setIsAddDialogOpen(false);
              }}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              onClick={handleAddSkill}
              disabled={isSubmitting || !formData.nama || !formData.kategori}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Skill Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Keahlian</DialogTitle>
            <DialogDescription>
              Ubah informasi keahlian yang ada
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-skill-name">
                Nama Keahlian <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-skill-name"
                value={formData.nama}
                onChange={(e) => handleChange("nama", e.target.value)}
                placeholder="Contoh: React, PHP, Project Management"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-skill-category">
                Kategori <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <Select
                  value={formData.kategori}
                  onValueChange={(value) => handleChange("kategori", value)}
                >
                  <SelectTrigger className="flex-grow">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                    <SelectItem value="Baru">+ Kategori Baru</SelectItem>
                  </SelectContent>
                </Select>
                {formData.kategori === "Baru" && (
                  <Input
                    placeholder="Masukkan kategori baru"
                    onChange={(e) => handleChange("kategori", e.target.value)}
                    className="flex-grow"
                  />
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setFormData({ nama: "", kategori: "" });
                setCurrentSkill(null);
                setIsEditDialogOpen(false);
              }}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              onClick={handleEditSkill}
              disabled={isSubmitting || !formData.nama || !formData.kategori}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus Keahlian</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus keahlian &quot;
              {currentSkill?.nama}&quot;? Keahlian hanya dapat dihapus jika
              tidak digunakan oleh lowongan atau profil pengguna.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSkill}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
