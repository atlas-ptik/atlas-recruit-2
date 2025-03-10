// src/app/dashboard/company/jobs/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Briefcase,
  Building,
  MapPin,
  Clock,
  Search,
  PlusCircle,
  MoreHorizontal,
  Loader2,
  AlertTriangle,
  Pencil,
  Copy,
  Trash2,
  ExternalLink,
  ChevronRight,
  X,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useApi } from "@/contexts/ApiContext";
import { PATHS, JOB_TYPES, PAGINATION } from "@/lib/constants";
import { JobListing, JobFilterParams } from "@/lib/api/jobService";

export default function CompanyJobsPage() {
  const { services } = useApi();

  // State for jobs
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // State for pagination
  const [pagination, setPagination] = useState({
    total: 0,
    halaman: PAGINATION.DEFAULT_PAGE,
    per_halaman: PAGINATION.DEFAULT_PER_PAGE,
    halaman_total: 0,
  });

  // State for filters
  const [filters, setFilters] = useState<JobFilterParams>({
    halaman: PAGINATION.DEFAULT_PAGE,
    per_halaman: PAGINATION.DEFAULT_PER_PAGE,
    keyword: "",
    jenis_pekerjaan: "",
    lokasi: "",
  });

  // State for search keyword (separate from filters to avoid immediate filtering)
  const [searchKeyword, setSearchKeyword] = useState("");

  // State for job deletion
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Load jobs on component mount or filter change
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await services.job.getJobs(filters);
        setJobs(response.lowongan);
        setPagination(response.pagination);
        setError("");
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Gagal memuat daftar lowongan. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [services.job, filters]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      halaman: PAGINATION.DEFAULT_PAGE,
      keyword: searchKeyword,
    }));
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      halaman: PAGINATION.DEFAULT_PAGE,
      [key]: value,
    }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      halaman: PAGINATION.DEFAULT_PAGE,
      per_halaman: PAGINATION.DEFAULT_PER_PAGE,
      keyword: "",
      jenis_pekerjaan: "",
      lokasi: "",
    });
    setSearchKeyword("");
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      halaman: page,
    }));
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle job deletion
  const handleDeleteJob = async () => {
    if (!jobToDelete) return;

    setIsDeleting(true);
    setDeleteError("");

    try {
      await services.job.deleteJob(jobToDelete);

      // Update local state to remove deleted job
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobToDelete));

      // Close dialog
      setShowDeleteDialog(false);
    } catch (err) {
      console.error("Failed to delete job:", err);
      setDeleteError("Gagal menghapus lowongan. Silakan coba lagi.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Confirmation dialog for job deletion
  const openDeleteConfirmation = (jobId: string) => {
    setJobToDelete(jobId);
    setDeleteError("");
    setShowDeleteDialog(true);
  };

  // Generate pagination buttons
  const getPaginationButtons = () => {
    const buttons = [];
    const { halaman, halaman_total } = pagination;

    // Always show first page
    buttons.push(
      <Button
        key="first"
        variant={halaman === 1 ? "default" : "outline"}
        size="sm"
        onClick={() => handlePageChange(1)}
        disabled={halaman === 1 || isLoading}
        className={halaman === 1 ? "bg-primary text-primary-foreground" : ""}
      >
        1
      </Button>
    );

    // Show ellipsis if needed
    if (halaman > 3) {
      buttons.push(
        <span key="ellipsis1" className="px-2 py-1">
          ...
        </span>
      );
    }

    // Show pages around current page
    for (
      let i = Math.max(2, halaman - 1);
      i <= Math.min(halaman_total - 1, halaman + 1);
      i++
    ) {
      if (i === 1 || i === halaman_total) continue; // Skip first and last pages as they're always shown
      buttons.push(
        <Button
          key={i}
          variant={halaman === i ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          disabled={isLoading}
          className={halaman === i ? "bg-primary text-primary-foreground" : ""}
        >
          {i}
        </Button>
      );
    }

    // Show ellipsis if needed
    if (halaman < halaman_total - 2) {
      buttons.push(
        <span key="ellipsis2" className="px-2 py-1">
          ...
        </span>
      );
    }

    // Always show last page if we have more than one page
    if (halaman_total > 1) {
      buttons.push(
        <Button
          key="last"
          variant={halaman === halaman_total ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(halaman_total)}
          disabled={halaman === halaman_total || isLoading}
          className={
            halaman === halaman_total
              ? "bg-primary text-primary-foreground"
              : ""
          }
        >
          {halaman_total}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Kelola Lowongan</h1>
            <p className="text-muted-foreground">
              Lihat dan kelola semua lowongan yang Anda publikasikan
            </p>
          </div>
          <Button asChild>
            <Link href={PATHS.COMPANY_JOB_CREATE}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Buat Lowongan
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan judul atau deskripsi lowongan"
                className="pl-10"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            <Button type="submit">Cari</Button>
          </form>

          <div className="flex gap-2">
            {/* Job Type Filter */}
            <Select
              value={filters.jenis_pekerjaan || ""}
              onValueChange={(value) =>
                handleFilterChange("jenis_pekerjaan", value)
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Jenis Pekerjaan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua Jenis</SelectItem>
                {JOB_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Location Filter */}
            <Select
              value={filters.lokasi || ""}
              onValueChange={(value) => handleFilterChange("lokasi", value)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Lokasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua Lokasi</SelectItem>
                <SelectItem value="Jakarta">Jakarta</SelectItem>
                <SelectItem value="Bandung">Bandung</SelectItem>
                <SelectItem value="Surabaya">Surabaya</SelectItem>
                <SelectItem value="Yogyakarta">Yogyakarta</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
              </SelectContent>
            </Select>

            {/* Reset Filter Button */}
            {(filters.keyword || filters.jenis_pekerjaan || filters.lokasi) && (
              <Button
                variant="ghost"
                onClick={handleResetFilters}
                className="px-2"
              >
                <X className="h-4 w-4 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Applied Filters */}
        {(filters.keyword || filters.jenis_pekerjaan || filters.lokasi) && (
          <div className="flex flex-wrap gap-2">
            {filters.keyword && (
              <Badge variant="outline" className="bg-primary/10 px-3 py-1">
                Kata Kunci: {filters.keyword}
              </Badge>
            )}
            {filters.jenis_pekerjaan && (
              <Badge variant="outline" className="bg-primary/10 px-3 py-1">
                Jenis:{" "}
                {JOB_TYPES.find((t) => t.value === filters.jenis_pekerjaan)
                  ?.label || filters.jenis_pekerjaan}
              </Badge>
            )}
            {filters.lokasi && (
              <Badge variant="outline" className="bg-primary/10 px-3 py-1">
                Lokasi: {filters.lokasi}
              </Badge>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="py-8 flex justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        )}

        {/* No Jobs */}
        {!isLoading && !error && jobs.length === 0 && (
          <div className="text-center py-16 px-4">
            <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Belum Ada Lowongan</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              {filters.keyword || filters.jenis_pekerjaan || filters.lokasi
                ? "Tidak ada lowongan yang sesuai dengan filter yang diterapkan."
                : "Anda belum membuat lowongan pekerjaan. Mulai dengan membuat lowongan pertama Anda untuk menarik kandidat yang tepat."}
            </p>
            {filters.keyword || filters.jenis_pekerjaan || filters.lokasi ? (
              <Button onClick={handleResetFilters}>
                <X className="h-4 w-4 mr-2" />
                Reset Filter
              </Button>
            ) : (
              <Button asChild>
                <Link href={PATHS.COMPANY_JOB_CREATE}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Buat Lowongan
                </Link>
              </Button>
            )}
          </div>
        )}

        {/* Jobs List */}
        {!isLoading && !error && jobs.length > 0 && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Menampilkan{" "}
                {(pagination.halaman - 1) * pagination.per_halaman + 1}-
                {Math.min(
                  pagination.halaman * pagination.per_halaman,
                  pagination.total
                )}{" "}
                dari {pagination.total} lowongan
              </p>
            </div>

            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg"
                >
                  <div className="flex items-start gap-4 sm:flex-1">
                    {/* Company Logo */}
                    <div className="w-12 h-12 rounded-md flex-shrink-0 overflow-hidden bg-muted">
                      {job.logo_perusahaan ? (
                        <Image
                          src={job.logo_perusahaan}
                          alt={`${job.nama_perusahaan} logo`}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building className="w-full h-full p-2 text-muted-foreground" />
                      )}
                    </div>

                    {/* Job Details */}
                    <div>
                      <h3 className="font-semibold">{job.judul}</h3>
                      <div className="flex flex-wrap gap-y-1 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center mr-4">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {job.lokasi || "Remote"}
                        </span>
                        <span className="flex items-center mr-4">
                          <Briefcase className="h-3.5 w-3.5 mr-1" />
                          {JOB_TYPES.find(
                            (t) => t.value === job.jenis_pekerjaan
                          )?.label || job.jenis_pekerjaan}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          Terakhir diperbarui: 15 Mar 2025
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <Link
                      href={`${PATHS.COMPANY_APPLICATIONS}?lowongan_id=${job.id}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      20 Lamaran
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            href={PATHS.JOB_DETAILS(job.id)}
                            className="flex items-center cursor-pointer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            <span>Lihat Publik</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={PATHS.COMPANY_JOB_EDIT(job.id)}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`${PATHS.COMPANY_JOB_CREATE}?duplicate=${job.id}`}
                            className="flex items-center cursor-pointer"
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            <span>Duplikat</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive cursor-pointer"
                          onClick={() => openDeleteConfirmation(job.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Hapus</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.halaman_total > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.halaman - 1)}
                    disabled={pagination.halaman === 1 || isLoading}
                    aria-label="Previous page"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                  </Button>

                  <div className="flex items-center space-x-2">
                    {getPaginationButtons()}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.halaman + 1)}
                    disabled={
                      pagination.halaman === pagination.halaman_total ||
                      isLoading
                    }
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Lowongan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus lowongan ini? Tindakan ini tidak
              dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteJob}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Hapus"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
