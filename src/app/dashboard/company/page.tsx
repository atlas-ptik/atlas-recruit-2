// src/app/dashboard/company/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Briefcase,
  FileText,
  ChevronRight,
  Clock,
  Building,
  MapPin,
  PlusCircle,
  Users,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useApi } from "@/contexts/ApiContext";
import { PATHS, APPLICATION_STATUS } from "@/lib/constants";
import { truncateText, formatDate } from "@/lib/utils";
import { JobListing } from "@/lib/api/jobService";
import { Application } from "@/lib/api/applicationService";

export default function CompanyDashboardPage() {
  const { user, services } = useApi();

  // State for jobs
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [jobsError, setJobsError] = useState("");

  // State for applications
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [applicationsError, setApplicationsError] = useState("");

  // Get company profile data from context
  const companyProfile = user?.peran === "perusahaan" ? user : null;

  // Statistics
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    shortlistedApplications: 0,
    interviewingApplications: 0,
    offeredApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
  });

  // Load company jobs
  useEffect(() => {
    const fetchCompanyJobs = async () => {
      setIsLoadingJobs(true);
      try {
        const response = await services.job.getJobs({
          halaman: 1,
          per_halaman: 5,
          // API actually accepts perusahaan_id but the student's id would be automatically
          // determined from their authentication token
        });
        setJobs(response.lowongan);
        setStats((prev) => ({
          ...prev,
          totalJobs: response.pagination.total,
          activeJobs: response.lowongan.length,
        }));
        setJobsError("");
      } catch (err) {
        console.error("Failed to fetch company jobs:", err);
        setJobsError("Gagal memuat daftar lowongan perusahaan.");
      } finally {
        setIsLoadingJobs(false);
      }
    };

    fetchCompanyJobs();
  }, [services.job]);

  // Load recent applications
  useEffect(() => {
    const fetchRecentApplications = async () => {
      setIsLoadingApplications(true);
      try {
        const response = await services.application.getApplications({
          halaman: 1,
          per_halaman: 5,
        });
        setApplications(response.lamaran);

        // Update application stats
        const pendingCount = response.lamaran.filter(
          (app) => app.status === "menunggu"
        ).length;
        const shortlistedCount = response.lamaran.filter(
          (app) => app.status === "shortlist"
        ).length;
        const interviewingCount = response.lamaran.filter(
          (app) => app.status === "wawancara"
        ).length;
        const offeredCount = response.lamaran.filter(
          (app) => app.status === "ditawari"
        ).length;
        const acceptedCount = response.lamaran.filter(
          (app) => app.status === "diterima"
        ).length;
        const rejectedCount = response.lamaran.filter(
          (app) => app.status === "ditolak"
        ).length;

        setStats((prev) => ({
          ...prev,
          totalApplications: response.pagination.total,
          pendingApplications: pendingCount,
          shortlistedApplications: shortlistedCount,
          interviewingApplications: interviewingCount,
          offeredApplications: offeredCount,
          acceptedApplications: acceptedCount,
          rejectedApplications: rejectedCount,
        }));

        setApplicationsError("");
      } catch (err) {
        console.error("Failed to fetch recent applications:", err);
        setApplicationsError("Gagal memuat daftar lamaran terbaru.");
      } finally {
        setIsLoadingApplications(false);
      }
    };

    fetchRecentApplications();
  }, [services.application]);

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
        icon = <Users className="h-4 w-4" />;
        break;
      case "ditawari":
        icon = <Briefcase className="h-4 w-4" />;
        break;
      case "diterima":
        icon = <CheckCircle2 className="h-4 w-4" />;
        break;
      case "ditolak":
        icon = <AlertTriangle className="h-4 w-4" />;
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
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Halo, {typeof companyProfile?.detail?.nama === "string" ? companyProfile.detail.nama : "Perusahaan"}!
        </h1>
        <p className="text-muted-foreground">
          Selamat datang di dashboard perusahaan Anda. Kelola lowongan dan
          lamaran dari kandidat potensial.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Lowongan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 text-primary mr-2" />
              <div className="text-2xl font-bold">
                {isLoadingJobs ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  stats.totalJobs
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Lamaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-primary mr-2" />
              <div className="text-2xl font-bold">
                {isLoadingApplications ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  stats.totalApplications
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lamaran Belum Ditinjau
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-primary mr-2" />
              <div className="text-2xl font-bold">
                {isLoadingApplications ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  stats.pendingApplications
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Wawancara & Penawaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-primary mr-2" />
              <div className="text-2xl font-bold">
                {isLoadingApplications ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  stats.interviewingApplications + stats.offeredApplications
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jobs" className="flex items-center">
            <Briefcase className="h-4 w-4 mr-2" /> Lowongan Saya
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" /> Lamaran Terbaru
          </TabsTrigger>
        </TabsList>

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Lowongan Aktif</h2>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={PATHS.COMPANY_JOBS} className="flex items-center">
                  Lihat Semua <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
              <Button asChild>
                <Link href={PATHS.COMPANY_JOB_CREATE}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Buat Lowongan
                </Link>
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {jobsError && (
            <Card className="bg-destructive/10 border-destructive/20">
              <CardContent className="py-4 text-center text-destructive">
                {jobsError}
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {isLoadingJobs && !jobsError && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 border rounded-lg space-y-3">
                  <div className="flex gap-3">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Jobs */}
          {!isLoadingJobs && !jobsError && jobs.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-1">
                  Belum Ada Lowongan
                </h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  Anda belum membuat lowongan pekerjaan. Mulai dengan membuat
                  lowongan pertama Anda untuk menarik kandidat yang tepat.
                </p>
                <Button asChild>
                  <Link href={PATHS.COMPANY_JOB_CREATE}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Buat Lowongan
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Jobs List */}
          {!isLoadingJobs && !jobsError && jobs.length > 0 && (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4 md:flex-1">
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
                      <Link
                        href={PATHS.JOB_DETAILS(job.id)}
                        className="font-semibold hover:text-primary transition-colors"
                      >
                        {job.judul}
                      </Link>
                      <div className="flex flex-wrap gap-y-1 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center mr-4">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {job.lokasi || "Remote"}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {job.jenis_pekerjaan}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-between md:justify-end flex-wrap">
                    <Link
                      href={`${PATHS.COMPANY_APPLICATIONS}?lowongan_id=${job.id}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      20 Lamaran
                    </Link>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={PATHS.JOB_DETAILS(job.id)}>Lihat</Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={PATHS.COMPANY_JOB_EDIT(job.id)}>Edit</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {jobs.length > 0 && (
                <div className="flex justify-center mt-4">
                  <Button variant="outline" asChild>
                    <Link href={PATHS.COMPANY_JOBS}>Lihat Semua Lowongan</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Lamaran Terbaru</h2>
            <Button variant="outline" asChild>
              <Link
                href={PATHS.COMPANY_APPLICATIONS}
                className="flex items-center"
              >
                Lihat Semua <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>

          {/* Error Message */}
          {applicationsError && (
            <Card className="bg-destructive/10 border-destructive/20">
              <CardContent className="py-4 text-center text-destructive">
                {applicationsError}
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {isLoadingApplications && !applicationsError && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center p-4 border rounded-lg"
                >
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <div>
                    <Skeleton className="h-8 w-20 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Applications */}
          {!isLoadingApplications &&
            !applicationsError &&
            applications.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-1">
                    Belum Ada Lamaran
                  </h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Belum ada lamaran yang masuk untuk lowongan Anda. Pastikan
                    lowongan Anda terlihat menarik untuk menarik kandidat
                    potensial.
                  </p>
                </CardContent>
              </Card>
            )}

          {/* Applications List */}
          {!isLoadingApplications &&
            !applicationsError &&
            applications.length > 0 && (
              <div className="space-y-4">
                {applications.map((application) => {
                  const statusInfo = getApplicationStatusInfo(
                    application.status
                  );

                  return (
                    <Link
                      key={application.id}
                      href={`${PATHS.COMPANY_APPLICATIONS}/${application.id}`}
                      className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg hover:bg-card/60 transition-colors"
                    >
                      <div className="md:flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {application.nama_depan} {application.nama_belakang}
                          </h3>
                          <span className="text-sm text-muted-foreground">
                            untuk
                          </span>
                          <span className="font-medium">
                            {truncateText(application.judul_lowongan, 40)}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-y-1 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center mr-4">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            Dilamar pada{" "}
                            {formatDate(application.tanggal_melamar)}
                          </span>
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className={`px-3 py-1 ${statusInfo.color} ${statusInfo.bgColor} flex items-center gap-1`}
                      >
                        {statusInfo.icon}
                        {statusInfo.label}
                      </Badge>
                    </Link>
                  );
                })}

                {applications.length > 0 && (
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" asChild>
                      <Link href={PATHS.COMPANY_APPLICATIONS}>
                        Lihat Semua Lamaran
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
        </TabsContent>
      </Tabs>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Applications by Status */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Status Lamaran</CardTitle>
            <CardDescription>
              Distribusi lamaran berdasarkan status saat ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingApplications ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="h-4 w-2/5" />
                <Skeleton className="h-4 w-1/5" />
              </div>
            ) : (
              <div className="space-y-4">
                {stats.totalApplications > 0 ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Menunggu</span>
                        <span className="font-medium">
                          {stats.pendingApplications}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-yellow-500 h-full"
                          style={{
                            width: `${
                              (stats.pendingApplications /
                                stats.totalApplications) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shortlist</span>
                        <span className="font-medium">
                          {stats.shortlistedApplications}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full"
                          style={{
                            width: `${
                              (stats.shortlistedApplications /
                                stats.totalApplications) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Wawancara</span>
                        <span className="font-medium">
                          {stats.interviewingApplications}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-purple-500 h-full"
                          style={{
                            width: `${
                              (stats.interviewingApplications /
                                stats.totalApplications) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Ditawari</span>
                        <span className="font-medium">
                          {stats.offeredApplications}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-pink-500 h-full"
                          style={{
                            width: `${
                              (stats.offeredApplications /
                                stats.totalApplications) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Diterima</span>
                        <span className="font-medium">
                          {stats.acceptedApplications}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-green-500 h-full"
                          style={{
                            width: `${
                              (stats.acceptedApplications /
                                stats.totalApplications) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Ditolak</span>
                        <span className="font-medium">
                          {stats.rejectedApplications}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-red-500 h-full"
                          style={{
                            width: `${
                              (stats.rejectedApplications /
                                stats.totalApplications) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    Belum ada data lamaran untuk ditampilkan.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aksi Cepat</CardTitle>
            <CardDescription>Tindakan yang dapat Anda lakukan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" asChild>
              <Link href={PATHS.COMPANY_JOB_CREATE}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Buat Lowongan Baru
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={PATHS.COMPANY_APPLICATIONS}>
                <FileText className="mr-2 h-4 w-4" />
                Tinjau Lamaran Masuk
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={PATHS.COMPANY_PROFILE}>
                <Building className="mr-2 h-4 w-4" />
                Perbarui Profil Perusahaan
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
