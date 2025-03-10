// src/app/dashboard/student/applications/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Building,
  Clock,
  ChevronRight,
  Search,
  FileText,
  Filter,
  CheckCircle2,
  Calendar,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/contexts/ApiContext";
import { PATHS, APPLICATION_STATUS, PAGINATION } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import {
  Application,
  ApplicationStatus,
  ApplicationFilterParams,
} from "@/lib/api/applicationService";

export default function StudentApplicationsPage() {
  const { services } = useApi();

  // State for applications
  const [applications, setApplications] = useState<Application[]>([]);
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
  const [filters, setFilters] = useState<ApplicationFilterParams>({
    halaman: PAGINATION.DEFAULT_PAGE,
    per_halaman: PAGINATION.DEFAULT_PER_PAGE,
    status: undefined,
  });

  // Active tab reflects filter status
  const [activeTab, setActiveTab] = useState<string>("all");

  // State for search keyword
  const [searchKeyword, setSearchKeyword] = useState("");

  // Set of active applications to handle deletion
  const [pendingDeletions, setPendingDeletions] = useState<Set<string>>(
    new Set()
  );
  const [deletionError, setDeletionError] = useState("");

  // Load applications
  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      try {
        const response = await services.application.getApplications(filters);
        setApplications(response.lamaran);
        setPagination(response.pagination);
        setError("");
      } catch (err) {
        console.error("Failed to fetch applications:", err);
        setError("Gagal memuat daftar lamaran. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [services.application, filters]);

  // Handle tab change - update status filter
  const handleTabChange = (value: string) => {
    setActiveTab(value);

    setFilters((prev) => ({
      ...prev,
      halaman: PAGINATION.DEFAULT_PAGE,
      status: value === "all" ? undefined : (value as ApplicationStatus),
    }));
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real application, implement search functionality by calling API with search params
    // For now, we'll just filter client-side for demo purposes
    console.log("Searching for:", searchKeyword);
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

  // Delete an application
  const handleDeleteApplication = async (applicationId: string) => {
    // Only menunggu status applications can be deleted
    const application = applications.find((app) => app.id === applicationId);
    if (!application || application.status !== "menunggu") {
      setDeletionError(
        "Hanya lamaran dengan status 'Menunggu' yang dapat dihapus."
      );
      return;
    }

    try {
      setPendingDeletions((prev) => new Set(prev).add(applicationId));
      await services.application.deleteApplication(applicationId);

      // Update local state to remove deleted application
      setApplications((prev) => prev.filter((app) => app.id !== applicationId));
      setDeletionError("");
    } catch (err) {
      console.error("Failed to delete application:", err);
      setDeletionError("Gagal menghapus lamaran. Silakan coba lagi.");
    } finally {
      setPendingDeletions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(applicationId);
        return newSet;
      });
    }
  };

  // Get pagination buttons
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

  // Helper function to get application status info
  const getApplicationStatusInfo = (status: string) => {
    const statusInfo = APPLICATION_STATUS.find((s) => s.value === status);

    if (!statusInfo) {
      return {
        color: "text-muted-foreground",
        bgColor: "bg-muted/50",
        label: status,
        icon: <Clock className="h-4 w-4" />,
      };
    }

    let icon;
    switch (status) {
      case "menunggu":
        icon = <Clock className="h-4 w-4" />;
        break;
      case "ditinjau":
        icon = <FileText className="h-4 w-4" />;
        break;
      case "shortlist":
        icon = <CheckCircle2 className="h-4 w-4" />;
        break;
      case "wawancara":
        icon = <Calendar className="h-4 w-4" />;
        break;
      case "ditawari":
        icon = <Briefcase className="h-4 w-4" />;
        break;
      case "diterima":
        icon = <CheckCircle2 className="h-4 w-4" />;
        break;
      case "ditolak":
        icon = <X className="h-4 w-4" />;
        break;
      default:
        icon = <Clock className="h-4 w-4" />;
    }

    let bgColor;
    switch (status) {
      case "menunggu":
        bgColor = "bg-yellow-500/10";
        break;
      case "ditinjau":
        bgColor = "bg-blue-500/10";
        break;
      case "shortlist":
        bgColor = "bg-indigo-500/10";
        break;
      case "wawancara":
        bgColor = "bg-purple-500/10";
        break;
      case "ditawari":
        bgColor = "bg-pink-500/10";
        break;
      case "diterima":
        bgColor = "bg-green-500/10";
        break;
      case "ditolak":
        bgColor = "bg-red-500/10";
        break;
      default:
        bgColor = "bg-muted/50";
    }

    return {
      color: statusInfo.color,
      bgColor,
      label: statusInfo.label,
      icon,
    };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Lamaran Saya</h1>
          <p className="text-muted-foreground">
            Kelola dan pantau status lamaran pekerjaan Anda
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari lamaran berdasarkan posisi atau perusahaan"
                className="pl-10"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            <Button type="submit">Cari</Button>
          </form>

          {/* Mobile Filter Button */}
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Lamaran</SheetTitle>
                </SheetHeader>
                <div className="py-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select value={activeTab} onValueChange={handleTabChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Semua status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Status</SelectItem>
                          {APPLICATION_STATUS.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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
        </div>

        {/* Status Tabs (Desktop only) */}
        <div className="hidden sm:block">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-4 md:grid-cols-8 w-full">
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="menunggu">Menunggu</TabsTrigger>
              <TabsTrigger value="ditinjau">Ditinjau</TabsTrigger>
              <TabsTrigger value="shortlist">Shortlist</TabsTrigger>
              <TabsTrigger value="wawancara">Wawancara</TabsTrigger>
              <TabsTrigger value="ditawari">Ditawari</TabsTrigger>
              <TabsTrigger value="diterima">Diterima</TabsTrigger>
              <TabsTrigger value="ditolak">Ditolak</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Deletion Error */}
        {deletionError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{deletionError}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row gap-4 p-6 border rounded-lg animate-pulse"
              >
                <div className="md:flex-1 space-y-2">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <Skeleton className="h-8 w-20 rounded-full" />
                  <Skeleton className="h-9 w-20 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Applications */}
        {!isLoading && !error && applications.length === 0 && (
          <div className="text-center py-16 px-4">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Tidak Ada Lamaran</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              {activeTab === "all"
                ? "Anda belum mengirimkan lamaran apapun. Mulai dengan mencari lowongan yang sesuai dengan keahlian dan minat Anda."
                : `Tidak ada lamaran dengan status ${
                    APPLICATION_STATUS.find((s) => s.value === activeTab)
                      ?.label || activeTab
                  }.`}
            </p>
            <Button asChild>
              <Link href={PATHS.JOBS}>
                <Search className="h-4 w-4 mr-2" />
                Cari Lowongan
              </Link>
            </Button>
          </div>
        )}

        {/* Applications List */}
        {!isLoading && !error && applications.length > 0 && (
          <div className="space-y-6">
            <div className="space-y-4">
              {applications.map((application) => {
                const statusInfo = getApplicationStatusInfo(application.status);
                const canDelete = application.status === "menunggu";
                const isDeleting = pendingDeletions.has(application.id);

                return (
                  <div
                    key={application.id}
                    className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="md:flex-1">
                      <Link
                        href={`${PATHS.STUDENT_APPLICATIONS}/${application.id}`}
                        className="font-semibold hover:text-primary transition-colors"
                      >
                        {application.judul_lowongan}
                      </Link>
                      <div className="flex flex-wrap gap-y-1 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center mr-4">
                          <Building className="h-3.5 w-3.5 mr-1" />
                          {application.nama_perusahaan}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          Dilamar pada {formatDate(application.tanggal_melamar)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={`px-3 py-1 ${statusInfo.color} ${statusInfo.bgColor} flex items-center gap-1`}
                      >
                        {statusInfo.icon}
                        {statusInfo.label}
                      </Badge>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={`${PATHS.STUDENT_APPLICATIONS}/${application.id}`}
                          >
                            Detail
                          </Link>
                        </Button>

                        {canDelete && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleDeleteApplication(application.id)
                            }
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Hapus"
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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
    </DashboardLayout>
  );
}
