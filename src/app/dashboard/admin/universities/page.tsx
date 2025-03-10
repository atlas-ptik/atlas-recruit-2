// src/app/dashboard/admin/universities/page.tsx - Halaman manajemen universitas
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
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
import { BookOpen, MoreVertical, Plus, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/contexts/ApiContext";
// Removed toast import
import { University } from "@/lib/api/universityService";

export default function AdminUniversitiesPage() {
  const { services } = useApi();

  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [locations, setLocations] = useState<string[]>([]);
  const [deleteUniversityId, setDeleteUniversityId] = useState<string | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Define loadUniversities with useCallback
  const loadUniversities = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters = {
        halaman: currentPage,
        per_halaman: 10,
        keyword: searchQuery || undefined,
        lokasi: locationFilter || undefined,
      };

      const response = await services.university.getUniversities(filters);
      setUniversities(response.universitas);
      setTotalPages(response.pagination.halaman_total);

      // Only update locations if not already loaded
      if (locations.length === 0 && response.lokasi) {
        setLocations(response.lokasi);
      }
    } catch (error) {
      console.error("Error loading universities:", error);
      alert("Error: Gagal memuat data universitas");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, locationFilter, services.university]);

  // Load universities on initial render and when filters change
  useEffect(() => {
    loadUniversities();
  }, [loadUniversities]);

  const handleDelete = async () => {
    if (!deleteUniversityId) return;

    try {
      await services.university.deleteUniversity(deleteUniversityId);
      alert("Sukses: Universitas berhasil dihapus");
      loadUniversities();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal menghapus universitas";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteUniversityId(null);
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteUniversityId(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kelola Universitas</h1>
        <Button asChild>
          <Link href="/dashboard/admin/universities/new">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Universitas
          </Link>
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        {/* Filters */}
        <div className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama universitas..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Semua Lokasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Semua Lokasi</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
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
                <TableHead className="min-w-[150px]">Nama</TableHead>
                <TableHead className="min-w-[120px]">Lokasi</TableHead>
                <TableHead className="min-w-[120px]">Website</TableHead>
                <TableHead className="min-w-[150px]">Terdaftar Pada</TableHead>
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
                        <Skeleton className="h-4 w-[150px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[120px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
              ) : universities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <BookOpen className="h-10 w-10 mb-2" />
                      <p>Tidak ada universitas yang ditemukan</p>
                      {(searchQuery || locationFilter) && (
                        <Button
                          variant="link"
                          onClick={() => {
                            setSearchQuery("");
                            setLocationFilter("");
                          }}
                        >
                          Reset filter
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                universities.map((university, index) => (
                  <TableRow key={university.id}>
                    <TableCell>{(currentPage - 1) * 10 + index + 1}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {university.logo ? (
                          <span
                            style={{
                              backgroundImage: `url(${university.logo})`,
                              backgroundSize: "contain",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              width: "24px",
                              height: "24px",
                              display: "inline-block",
                              marginRight: "8px",
                              borderRadius: "2px",
                            }}
                          ></span>
                        ) : (
                          <BookOpen className="w-5 h-5 mr-2 text-muted-foreground" />
                        )}
                        {university.nama}
                      </div>
                    </TableCell>
                    <TableCell>{university.lokasi}</TableCell>
                    <TableCell>
                      <a
                        href={`https://${university.situs_web}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {university.situs_web}
                      </a>
                    </TableCell>
                    <TableCell>
                      {new Date(university.dibuat_pada).toLocaleDateString(
                        "id-ID",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
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
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/admin/universities/${university.id}`}
                            >
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => confirmDelete(university.id)}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus Universitas</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus universitas ini? Tindakan ini
              tidak dapat dibatalkan dan akan menghapus semua data terkait.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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
