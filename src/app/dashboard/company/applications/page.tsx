// src/app/dashboard/company/applications/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Briefcase,
  Clock,
  Search,
  ChevronRight,
  Loader2,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Calendar,
  X,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useApi } from "@/contexts/ApiContext";
import { PATHS, APPLICATION_STATUS, PAGINATION } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import {
  Application,
  ApplicationStatus,
  ApplicationFilterParams,
} from "@/lib/api/applicationService";

export default function CompanyApplicationsPage() {
  const searchParams = useSearchParams();
  const jobIdParam = searchParams?.get("lowongan_id");
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
    lowongan_id: jobIdParam || undefined,
  });

  // Active tab reflects filter status
  const [activeTab, setActiveTab] = useState<string>("all");

  // State for search keyword
  const [searchKeyword, setSearchKeyword] = useState("");

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
    // For now, we'll just console log it for demo purposes
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

  // Clear job filter
  const clearJobFilter = () => {
    setFilters((prev) => ({
      ...prev,
      lowongan_id: undefined,
    }));
  };

  // Helper function to get application status color and icon
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Kelola Lamaran</h1>
          <p className="text-muted-foreground">
            {filters.lowongan_id
              ? "Kelola lamaran untuk lowongan yang Anda pilih"
              : "Kelola semua lamaran untuk lowongan yang Anda publikasikan"}
          </p>

          {/* Job filter indicator */}
          {filters.lowongan_id && (
            <div className="mt-2 flex items-center">
              <Badge variant="outline" className="bg-primary/10 px-3 py-1">
                <span className="mr-2">Filter lowongan aktif</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearJobFilter}
                  className="h-4 w-4 p-0 rounded-full hover:bg-primary/20"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Clear filter</span>
                </Button>
              </Badge>
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama pelamar"
                className="pl-10"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            <Button type="submit">Cari</Button>
          </form>
        </div>

        {/* Status Tabs */}
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

        {/* No Applications */}
        {!isLoading && !error && applications.length === 0 && (
          <div className="text-center py-16 px-4">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Belum Ada Lamaran</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              {activeTab === "all"
                ? filters.lowongan_id
                  ? "Belum ada lamaran yang masuk untuk lowongan ini."
                  : "Belum ada lamaran yang masuk untuk semua lowongan Anda."
                : `Tidak ada lamaran dengan status ${
                    APPLICATION_STATUS.find((s) => s.value === activeTab)
                      ?.label || activeTab
                  }.`}
            </p>
          </div>
        )}

        {/* Applications List */}
        {!isLoading && !error && applications.length > 0 && (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">
                Menampilkan{" "}
                {(pagination.halaman - 1) * pagination.per_halaman + 1}-
                {Math.min(
                  pagination.halaman * pagination.per_halaman,
                  pagination.total
                )}{" "}
                dari {pagination.total} lamaran
              </p>
            </div>

            <div className="space-y-4">
              {applications.map((application) => {
                const statusInfo = getApplicationStatusInfo(application.status);

                return (
                  <Link
                    key={application.id}
                    href={`${PATHS.COMPANY_APPLICATIONS}/${application.id}`}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-lg hover:bg-card/60 transition-colors"
                  >
                    {/* Applicant Avatar & Info */}
                    <div className="flex items-center gap-3 sm:w-1/3">
                      <Avatar className="h-10 w-10">
                        {application.foto ? (
                          <AvatarImage
                            src={application.foto}
                            alt={`${application.nama_depan} ${application.nama_belakang}`}
                          />
                        ) : (
                          <AvatarFallback>
                            {application.nama_depan?.[0] || ""}
                            {application.nama_belakang?.[0] || ""}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">
                          {application.nama_depan} {application.nama_belakang}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          <Clock className="inline-block h-3.5 w-3.5 mr-1" />
                          {formatDate(application.tanggal_melamar)}
                        </p>
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="sm:flex-1">
                      <p className="text-sm font-medium">
                        <Briefcase className="inline-block h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        {application.judul_lowongan}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {application.jenis_pekerjaan}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <Badge
                        variant="outline"
                        className={`px-3 py-1 ${statusInfo.color} ${statusInfo.bgColor} flex items-center gap-1`}
                      >
                        {statusInfo.icon}
                        {statusInfo.label}
                      </Badge>

                      <Button variant="ghost" size="icon" className="sm:hidden">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </Link>
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
