// src/app/jobs/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  MapPin,
  Briefcase,
  Filter,
  ChevronDown,
  ChevronRight,
  Loader2,
  X,
  Clock,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MainLayout } from "@/components/layout/main-layout";
import { useApi } from "@/contexts/ApiContext";
import { PATHS, JOB_TYPES, PAGINATION } from "@/lib/constants";
import { JobListing, JobFilterParams } from "@/lib/api/jobService";
import { cn } from "@/lib/utils";

export default function JobsPage() {
  const { services } = useApi();

  // State for job listings
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
    lokasi: "",
    jenis_pekerjaan: "",
  });

  // State for tracking the active search filters
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Load jobs on component mount or filter change
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await services.job.getJobs(filters);
        setJobs(response.lowongan);
        setPagination(response.pagination);
        setError("");

        // Update active filters
        const newActiveFilters: string[] = [];
        if (filters.keyword)
          newActiveFilters.push(`Kata Kunci: ${filters.keyword}`);
        if (filters.lokasi) newActiveFilters.push(`Lokasi: ${filters.lokasi}`);
        if (filters.jenis_pekerjaan) {
          const jobType = JOB_TYPES.find(
            (type) => type.value === filters.jenis_pekerjaan
          );
          if (jobType) newActiveFilters.push(`Jenis: ${jobType.label}`);
        }
        setActiveFilters(newActiveFilters);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Gagal memuat lowongan. Silakan coba lagi.");
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
      halaman: PAGINATION.DEFAULT_PAGE, // Reset to first page on new search
    }));
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

  // Handle filter reset
  const handleResetFilters = () => {
    setFilters({
      halaman: PAGINATION.DEFAULT_PAGE,
      per_halaman: PAGINATION.DEFAULT_PER_PAGE,
      keyword: "",
      lokasi: "",
      jenis_pekerjaan: "",
    });
  };

  // Remove a specific filter
  const handleRemoveFilter = (filter: string) => {
    const keywordPrefix = "Kata Kunci: ";
    const locationPrefix = "Lokasi: ";
    const typePrefix = "Jenis: ";

    if (filter.startsWith(keywordPrefix)) {
      setFilters((prev) => ({
        ...prev,
        keyword: "",
        halaman: PAGINATION.DEFAULT_PAGE,
      }));
    } else if (filter.startsWith(locationPrefix)) {
      setFilters((prev) => ({
        ...prev,
        lokasi: "",
        halaman: PAGINATION.DEFAULT_PAGE,
      }));
    } else if (filter.startsWith(typePrefix)) {
      setFilters((prev) => ({
        ...prev,
        jenis_pekerjaan: "",
        halaman: PAGINATION.DEFAULT_PAGE,
      }));
    }
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
    <MainLayout>
      <div className="space-y-6">
        {/* Search Section */}
        <section className="bg-card shadow-sm rounded-lg p-6 border">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
              {/* Keyword Search */}
              <div className="md:col-span-4 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Posisi, keahlian, atau perusahaan"
                  className="pl-10"
                  value={filters.keyword || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, keyword: e.target.value }))
                  }
                />
              </div>

              {/* Location */}
              <div className="md:col-span-2 relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Lokasi"
                  className="pl-10"
                  value={filters.lokasi || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, lokasi: e.target.value }))
                  }
                />
              </div>

              {/* Job Type */}
              <div className="md:col-span-1">
                <Select
                  value={filters.jenis_pekerjaan || ""}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, jenis_pekerjaan: value }))
                  }
                >
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Jenis" />
                    </div>
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
              </div>

              {/* Search Button */}
              <div className="md:col-span-1">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Cari"
                  )}
                </Button>
              </div>
            </div>

            {/* Mobile Filters Button */}
            <div className="flex justify-end md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh]">
                  <SheetHeader>
                    <SheetTitle>Filter Lowongan</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Kata Kunci</label>
                      <Input
                        placeholder="Posisi, keahlian, atau perusahaan"
                        value={filters.keyword || ""}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            keyword: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Lokasi</label>
                      <Input
                        placeholder="Lokasi"
                        value={filters.lokasi || ""}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            lokasi: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Jenis Pekerjaan
                      </label>
                      <Select
                        value={filters.jenis_pekerjaan || ""}
                        onValueChange={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            jenis_pekerjaan: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Semua Jenis" />
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
                    </div>
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button type="submit" className="w-full">
                        Terapkan Filter
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {activeFilters.map((filter) => (
                  <div
                    key={filter}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm"
                  >
                    <span>{filter}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFilter(filter)}
                      aria-label={`Remove filter: ${filter}`}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-sm text-muted-foreground hover:text-primary px-2 flex items-center"
                >
                  Reset Semua
                </button>
              </div>
            )}
          </form>
        </section>

        {/* Job Listings Section */}
        <section className="space-y-4">
          {/* Results Count */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Memuat lowongan...
                </span>
              ) : error ? (
                "Lowongan Pekerjaan"
              ) : (
                `${pagination.total} Lowongan Pekerjaan Tersedia`
              )}
            </h2>
            <div className="text-sm text-muted-foreground">
              Menampilkan{" "}
              {jobs.length
                ? (pagination.halaman - 1) * pagination.per_halaman + 1
                : 0}
              -
              {Math.min(
                pagination.halaman * pagination.per_halaman,
                pagination.total
              )}{" "}
              dari {pagination.total}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-8 text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Coba Lagi
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && !error && (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card animate-pulse rounded-lg p-6 border"
                >
                  <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/3 mb-4"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-muted rounded w-24"></div>
                    <div className="h-6 bg-muted rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && !error && jobs.length === 0 && (
            <div className="bg-card rounded-lg p-8 border text-center">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-1">
                Tidak Ada Lowongan Ditemukan
              </h3>
              <p className="text-muted-foreground mb-4">
                Tidak ditemukan lowongan yang sesuai dengan filter pencarian
                Anda.
              </p>
              <Button onClick={handleResetFilters}>Reset Filter</Button>
            </div>
          )}

          {/* Job Cards */}
          {!isLoading && !error && jobs.length > 0 && (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={PATHS.JOB_DETAILS(job.id)}
                  className={cn(
                    "group block bg-card hover:bg-card/60 rounded-lg p-6 border border-border",
                    "transition-all duration-300 hover:border-primary/50 hover:shadow-sm",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                  )}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
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
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {job.judul}
                      </h3>
                      <div className="flex flex-wrap gap-y-1 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center mr-4">
                          <Building className="h-3.5 w-3.5 mr-1" />
                          {job.nama_perusahaan}
                        </span>
                        <span className="flex items-center mr-4">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {job.lokasi || "Remote"}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {JOB_TYPES.find(
                            (type) => type.value === job.jenis_pekerjaan
                          )?.label || job.jenis_pekerjaan}
                        </span>
                      </div>
                    </div>

                    {/* View Details Arrow */}
                    <div className="flex-shrink-0 flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="group-hover:text-primary"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !error && pagination.halaman_total > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.halaman - 1)}
                  disabled={pagination.halaman === 1 || isLoading}
                  aria-label="Previous page"
                >
                  <ChevronDown className="h-4 w-4 rotate-90" />
                </Button>

                <div className="flex items-center space-x-2">
                  {getPaginationButtons()}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.halaman + 1)}
                  disabled={
                    pagination.halaman === pagination.halaman_total || isLoading
                  }
                  aria-label="Next page"
                >
                  <ChevronDown className="h-4 w-4 -rotate-90" />
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
