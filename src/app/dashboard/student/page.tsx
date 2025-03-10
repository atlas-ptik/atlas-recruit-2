// src/app/dashboard/student/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  Search,
  GraduationCap,
  CalendarDays,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import { useApi } from "@/contexts/ApiContext";
import { PATHS, APPLICATION_STATUS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { JobListing } from "@/lib/api/jobService";
import { Application } from "@/lib/api/applicationService";

export default function StudentDashboardPage() {
  const { user, services } = useApi();

  // State for recent jobs
  const [recentJobs, setRecentJobs] = useState<JobListing[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [jobsError, setJobsError] = useState("");

  // State for recent applications
  const [recentApplications, setRecentApplications] = useState<Application[]>(
    []
  );
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [applicationsError, setApplicationsError] = useState("");

  // Get student profile data from context
  const studentProfile = user?.peran === "mahasiswa" ? user : null;

  // Load recent jobs
  useEffect(() => {
    const fetchRecentJobs = async () => {
      setIsLoadingJobs(true);
      try {
        const response = await services.job.getJobs({
          halaman: 1,
          per_halaman: 3,
        });
        setRecentJobs(response.lowongan);
        setJobsError("");
      } catch (err) {
        console.error("Failed to fetch recent jobs:", err);
        setJobsError("Gagal memuat daftar lowongan terbaru.");
      } finally {
        setIsLoadingJobs(false);
      }
    };

    fetchRecentJobs();
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
        setRecentApplications(response.lamaran);
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
        icon = <CalendarDays className="h-4 w-4" />;
        break;
      case "ditawari":
        icon = <Briefcase className="h-4 w-4" />;
        break;
      case "diterima":
        icon = <CheckCircle2 className="h-4 w-4" />;
        break;
      case "ditolak":
        icon = <ChevronRight className="h-4 w-4" />;
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
          Halo, {String(studentProfile?.detail?.nama_depan || "Mahasiswa")}!
        </h1>
        <p className="text-muted-foreground">
          Selamat datang di dashboard Anda. Disini Anda dapat mengelola lamaran,
          melihat lowongan terbaru, dan mengatur profil Anda.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                  recentApplications.length
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lowongan Tersimpan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 text-primary mr-2" />
              <div className="text-2xl font-bold">0</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lamaran Aktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 text-primary mr-2" />
              <div className="text-2xl font-bold">
                {isLoadingApplications ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  recentApplications.filter(
                    (a) => a.status !== "ditolak" && a.status !== "diterima"
                  ).length
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="applications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="applications" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" /> Lamaran Terbaru
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center">
            <Briefcase className="h-4 w-4 mr-2" /> Lowongan Terbaru
          </TabsTrigger>
        </TabsList>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Lamaran Terbaru</h2>
            <Button variant="outline" asChild>
              <Link
                href={PATHS.STUDENT_APPLICATIONS}
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
            recentApplications.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-1">
                    Belum Ada Lamaran
                  </h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Anda belum mengirimkan lamaran apapun. Mulai dengan mencari
                    lowongan yang sesuai dengan keahlian dan minat Anda.
                  </p>
                  <Button asChild>
                    <Link href={PATHS.JOBS}>
                      <Search className="h-4 w-4 mr-2" />
                      Cari Lowongan
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

          {/* Applications List */}
          {!isLoadingApplications &&
            !applicationsError &&
            recentApplications.length > 0 && (
              <div className="space-y-4">
                {recentApplications.map((application) => {
                  const statusInfo = getApplicationStatusInfo(
                    application.status
                  );

                  return (
                    <Link
                      key={application.id}
                      href={`${PATHS.STUDENT_APPLICATIONS}/${application.id}`}
                      className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg hover:bg-card/60 transition-colors"
                    >
                      <div className="md:flex-1">
                        <h3 className="font-semibold">
                          {application.judul_lowongan}
                        </h3>
                        <div className="flex flex-wrap gap-y-1 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center mr-4">
                            <Building className="h-3.5 w-3.5 mr-1" />
                            {application.nama_perusahaan}
                          </span>
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
              </div>
            )}
        </TabsContent>

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Lowongan Terbaru</h2>
            <Button variant="outline" asChild>
              <Link href={PATHS.JOBS} className="flex items-center">
                Lihat Semua <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
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
                </div>
              ))}
            </div>
          )}

          {/* Jobs List */}
          {!isLoadingJobs && !jobsError && recentJobs.length > 0 && (
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <Link
                  key={job.id}
                  href={PATHS.JOB_DETAILS(job.id)}
                  className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg hover:bg-card/60 transition-colors"
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
                      <h3 className="font-semibold">{job.judul}</h3>
                      <div className="flex flex-wrap gap-y-1 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center mr-4">
                          <Building className="h-3.5 w-3.5 mr-1" />
                          {job.nama_perusahaan}
                        </span>
                        <span className="flex items-center mr-4">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {job.lokasi || "Remote"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="self-start md:self-center"
                  >
                    Lihat Detail
                  </Button>
                </Link>
              ))}
            </div>
          )}

          {/* No Jobs */}
          {!isLoadingJobs && !jobsError && recentJobs.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-1">
                  Tidak Ada Lowongan
                </h3>
                <p className="text-muted-foreground mb-4">
                  Tidak ada lowongan yang tersedia saat ini. Silakan periksa
                  kembali nanti.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Profile Completion Card */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Lengkapi Profil Anda
          </CardTitle>
          <CardDescription>
            Profil yang lengkap meningkatkan peluang Anda untuk mendapatkan
            pekerjaan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full md:w-2/3 bg-muted rounded-full h-4 overflow-hidden">
              <div className="bg-primary h-full w-3/4" />
            </div>
            <div className="text-sm">
              Kelengkapan profil: <span className="font-semibold">75%</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Informasi dasar</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Pendidikan</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Kontak</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-500" />
              <span>Tambahkan keahlian</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href={PATHS.STUDENT_PROFILE}>
              <GraduationCap className="h-4 w-4 mr-2" />
              Lengkapi Profil
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </DashboardLayout>
  );
}
