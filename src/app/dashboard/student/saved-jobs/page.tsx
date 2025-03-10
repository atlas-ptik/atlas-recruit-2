// src/app/dashboard/student/saved-jobs/page.tsx - Halaman lowongan tersimpan mahasiswa
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bookmark,
  BookmarkMinus,
  Briefcase,
  Building,
  Clock,
  FileText,
  MapPin,
  Search,
  ExternalLink,
} from "lucide-react";
import { PATHS, JOB_TYPES } from "@/lib/constants";

// Types
interface SavedJob {
  id: string;
  job_id: string;
  judul: string;
  perusahaan: string;
  logo?: string;
  lokasi: string;
  jenis_pekerjaan: string;
  tanggal_disimpan: string;
  tanggal_posting: string;
  status_lamaran?: "belum_melamar" | "sudah_melamar";
}

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<SavedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isClearAllDialogOpen, setIsClearAllDialogOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const itemsPerPage = 5;

  // Mock data for saved jobs
  const mockSavedJobs: SavedJob[] = [
    {
      id: "save1",
      job_id: "job1",
      judul: "Frontend Developer",
      perusahaan: "Tech Innovations",
      logo: "",
      lokasi: "Jakarta",
      jenis_pekerjaan: "penuh-waktu",
      tanggal_disimpan: "2025-03-01T10:30:00",
      tanggal_posting: "2025-02-28T08:00:00",
      status_lamaran: "belum_melamar",
    },
    {
      id: "save2",
      job_id: "job2",
      judul: "UX Designer",
      perusahaan: "Creative Solutions",
      logo: "",
      lokasi: "Bandung",
      jenis_pekerjaan: "penuh-waktu",
      tanggal_disimpan: "2025-03-02T14:20:00",
      tanggal_posting: "2025-03-01T09:30:00",
      status_lamaran: "belum_melamar",
    },
    {
      id: "save3",
      job_id: "job3",
      judul: "Data Scientist",
      perusahaan: "Data Analytics Corp",
      logo: "",
      lokasi: "Jakarta",
      jenis_pekerjaan: "penuh-waktu",
      tanggal_disimpan: "2025-03-03T09:15:00",
      tanggal_posting: "2025-03-02T11:00:00",
      status_lamaran: "sudah_melamar",
    },
    {
      id: "save4",
      job_id: "job4",
      judul: "Backend Developer",
      perusahaan: "Software Solutions",
      logo: "",
      lokasi: "Surabaya",
      jenis_pekerjaan: "penuh-waktu",
      tanggal_disimpan: "2025-03-04T16:40:00",
      tanggal_posting: "2025-03-03T08:45:00",
      status_lamaran: "belum_melamar",
    },
    {
      id: "save5",
      job_id: "job5",
      judul: "UI Designer (Internship)",
      perusahaan: "Design Studio",
      logo: "",
      lokasi: "Yogyakarta",
      jenis_pekerjaan: "magang",
      tanggal_disimpan: "2025-03-05T11:20:00",
      tanggal_posting: "2025-03-04T14:30:00",
      status_lamaran: "belum_melamar",
    },
    {
      id: "save6",
      job_id: "job6",
      judul: "QA Engineer",
      perusahaan: "Tech Innovations",
      logo: "",
      lokasi: "Jakarta",
      jenis_pekerjaan: "kontrak",
      tanggal_disimpan: "2025-03-06T13:10:00",
      tanggal_posting: "2025-03-05T10:15:00",
      status_lamaran: "belum_melamar",
    },
  ];

  useEffect(() => {
    // In a real app, you'd fetch from API
    // const fetchSavedJobs = async () => {
    //   try {
    //     const response = await services.student.getSavedJobs();
    //     setSavedJobs(response.data);
    //   } catch (error) {
    //     console.error("Failed to fetch saved jobs:", error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };

    // Simulate API call with mockdata
    const fetchSavedJobs = () => {
      setTimeout(() => {
        setSavedJobs(mockSavedJobs);
        setFilteredJobs(mockSavedJobs);
        setTotalPages(Math.ceil(mockSavedJobs.length / itemsPerPage));
        setIsLoading(false);
      }, 1000);
    };

    fetchSavedJobs();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...savedJobs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.judul.toLowerCase().includes(query) ||
          job.perusahaan.toLowerCase().includes(query) ||
          job.lokasi.toLowerCase().includes(query)
      );
    }

    if (jobTypeFilter) {
      result = result.filter((job) => job.jenis_pekerjaan === jobTypeFilter);
    }

    setFilteredJobs(result);
    setTotalPages(Math.ceil(result.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [savedJobs, searchQuery, jobTypeFilter]);

  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRemoveJob = (jobId: string) => {
    setSelectedJobId(jobId);
    setIsRemoveDialogOpen(true);
  };

  const confirmRemoveJob = () => {
    if (!selectedJobId) return;

    // In a real app, you'd call API
    // const removeSavedJob = async () => {
    //   try {
    //     await services.student.removeSavedJob(selectedJobId);
    //     setSavedJobs(savedJobs.filter(job => job.id !== selectedJobId));
    //   } catch (error) {
    //     console.error("Failed to remove saved job:", error);
    //   }
    // };

    // Mock removal
    setSavedJobs(savedJobs.filter((job) => job.id !== selectedJobId));
    setIsRemoveDialogOpen(false);
    setSelectedJobId(null);
  };

  const confirmClearAll = () => {
    // In a real app, you'd call API
    // const clearAllSavedJobs = async () => {
    //   try {
    //     await services.student.clearAllSavedJobs();
    //     setSavedJobs([]);
    //   } catch (error) {
    //     console.error("Failed to clear saved jobs:", error);
    //   }
    // };

    // Mock clearing
    setSavedJobs([]);
    setIsClearAllDialogOpen(false);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setJobTypeFilter("");
  };

  const getJobTypeBadge = (type: string) => {
    const jobType = JOB_TYPES.find((t) => t.value === type);
    return jobType ? jobType.label : type;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Lowongan Tersimpan</h1>
          <p className="text-muted-foreground">
            Kelola lowongan yang telah Anda simpan untuk dibuka nanti
          </p>
        </div>

        {!isLoading && savedJobs.length > 0 && (
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setIsClearAllDialogOpen(true)}
          >
            <BookmarkMinus className="mr-2 h-4 w-4" />
            Hapus Semua
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari lowongan tersimpan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="w-full md:w-60">
              <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Jenis Pekerjaan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Semua Jenis Pekerjaan</SelectItem>
                  {JOB_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {(searchQuery || jobTypeFilter) && (
            <div className="flex justify-end mt-4">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Hapus Filter
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Area */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-16 w-16 rounded" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-60" />
                      <Skeleton className="h-4 w-40" />
                      <div className="flex gap-3 mt-1">
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 self-end sm:self-auto">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bookmark className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Tidak ada lowongan tersimpan
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Anda belum menyimpan lowongan apapun. Jelajahi lowongan yang
              tersedia dan simpan yang menarik untuk dibuka nanti.
            </p>
            <Button asChild>
              <Link href={PATHS.JOBS}>
                <Briefcase className="mr-2 h-4 w-4" />
                Jelajahi Lowongan
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : filteredJobs.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Tidak ada hasil ditemukan
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Tidak ada lowongan tersimpan yang cocok dengan filter Anda. Coba
              ubah pencarian atau hapus filter.
            </p>
            <Button onClick={clearFilters}>Hapus Filter</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedJobs.map((job) => (
              <Card
                key={job.id}
                className="overflow-hidden hover:border-primary/50 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="h-16 w-16 bg-muted rounded flex items-center justify-center shrink-0">
                        {job.logo ? (
                          <div
                            style={{
                              backgroundImage: `url(${job.logo})`,
                              backgroundSize: "contain",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              width: "100%",
                              height: "100%",
                            }}
                            role="img"
                            aria-label={`Logo ${job.perusahaan}`}
                          />
                        ) : (
                          <Building className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium hover:text-primary">
                          <Link href={PATHS.JOB_DETAILS(job.job_id)}>
                            {job.judul}
                          </Link>
                        </h3>
                        <p className="text-muted-foreground">
                          {job.perusahaan}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-1">
                          <Badge variant="outline" className="mt-1">
                            {getJobTypeBadge(job.jenis_pekerjaan)}
                          </Badge>
                          <div className="flex items-center mt-1 text-sm">
                            <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                            {job.lokasi}
                          </div>
                          <div className="flex items-center mt-1 text-sm">
                            <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                            Disimpan {formatDate(job.tanggal_disimpan)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 self-end sm:self-auto">
                      {job.status_lamaran === "sudah_melamar" ? (
                        <Button variant="outline" className="min-w-32" disabled>
                          <FileText className="mr-2 h-4 w-4" />
                          Sudah Dilamar
                        </Button>
                      ) : (
                        <Button asChild className="min-w-32">
                          <Link href={PATHS.JOB_DETAILS(job.job_id)}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </Link>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="min-w-32 border-destructive/50 text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveJob(job.id)}
                      >
                        <BookmarkMinus className="mr-2 h-4 w-4" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="flex h-10 items-center text-sm">
                      Halaman {currentPage} dari {totalPages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
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
        </>
      )}

      {/* Modals/Dialogs */}
      <AlertDialog
        open={isRemoveDialogOpen}
        onOpenChange={setIsRemoveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Lowongan Tersimpan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus lowongan ini dari daftar
              tersimpan? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveJob}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isClearAllDialogOpen}
        onOpenChange={setIsClearAllDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Semua Lowongan Tersimpan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus semua lowongan dari daftar
              tersimpan? Tindakan ini tidak dapat dibatalkan dan akan menghapus{" "}
              {savedJobs.length} lowongan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmClearAll}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus Semua
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
