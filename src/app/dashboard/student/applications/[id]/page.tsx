// src/app/dashboard/student/applications/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Building,
  MapPin,
  Briefcase,
  Clock,
  FileText,
  Calendar,
  Loader2,
  AlertTriangle,
  Download,
  ExternalLink,
  Send,
  Eye,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// No timeline component in shadcn/ui
import { Separator } from "@/components/ui/separator";
import { useApi } from "@/contexts/ApiContext";
import { PATHS, APPLICATION_STATUS } from "@/lib/constants";
import { formatDate, formatDateTime } from "@/lib/utils";
import {
  ApplicationDetail,
  ApplicationHistory,
} from "@/lib/api/applicationService";

export default function StudentApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { services } = useApi();

  // State for application details
  const [application, setApplication] = useState<ApplicationDetail | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // State for delete operation
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Load application details
  useEffect(() => {
    const fetchApplicationDetail = async () => {
      setIsLoading(true);
      try {
        const data = await services.application.getApplicationById(
          id as string
        );
        setApplication(data);
        setError("");
      } catch (err) {
        console.error("Failed to fetch application details:", err);
        setError("Gagal memuat detail lamaran. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchApplicationDetail();
    }
  }, [id, services.application]);

  // Helper function to get application status info
  const getApplicationStatusInfo = (status: string) => {
    const statusInfo = APPLICATION_STATUS.find((s) => s.value === status);

    if (!statusInfo) {
      return {
        color: "text-muted-foreground",
        bgColor: "bg-muted/50",
        borderColor: "border-muted",
        label: status,
      };
    }

    let color: string, bgColor: string, borderColor: string;

    switch (status) {
      case "menunggu":
        color = "text-yellow-500";
        bgColor = "bg-yellow-500/10";
        borderColor = "border-yellow-500/20";
        break;
      case "ditinjau":
        color = "text-blue-500";
        bgColor = "bg-blue-500/10";
        borderColor = "border-blue-500/20";
        break;
      case "shortlist":
        color = "text-indigo-500";
        bgColor = "bg-indigo-500/10";
        borderColor = "border-indigo-500/20";
        break;
      case "wawancara":
        color = "text-purple-500";
        bgColor = "bg-purple-500/10";
        borderColor = "border-purple-500/20";
        break;
      case "ditawari":
        color = "text-pink-500";
        bgColor = "bg-pink-500/10";
        borderColor = "border-pink-500/20";
        break;
      case "diterima":
        color = "text-green-500";
        bgColor = "bg-green-500/10";
        borderColor = "border-green-500/20";
        break;
      case "ditolak":
        color = "text-red-500";
        bgColor = "bg-red-500/10";
        borderColor = "border-red-500/20";
        break;
      default:
        color = "text-muted-foreground";
        bgColor = "bg-muted/50";
        borderColor = "border-muted";
    }

    return {
      color,
      bgColor,
      borderColor,
      label: statusInfo.label,
    };
  };

  // Helper function to get icon for timeline
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "menunggu":
        return <Clock className="h-4 w-4" />;
      case "ditinjau":
        return <Eye className="h-4 w-4" />;
      case "shortlist":
        return <FileText className="h-4 w-4" />;
      case "wawancara":
        return <Calendar className="h-4 w-4" />;
      case "ditawari":
        return <Send className="h-4 w-4" />;
      case "diterima":
        return <Briefcase className="h-4 w-4" />;
      case "ditolak":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Handle application deletion
  const handleDeleteApplication = async () => {
    // Only menunggu status applications can be deleted
    if (!application || application.status !== "menunggu") {
      setDeleteError(
        "Hanya lamaran dengan status 'Menunggu' yang dapat dihapus."
      );
      return;
    }

    try {
      setIsDeleting(true);
      await services.application.deleteApplication(id as string);

      // Redirect to applications list on successful deletion
      router.push(PATHS.STUDENT_APPLICATIONS);
    } catch (err) {
      console.error("Failed to delete application:", err);
      setDeleteError("Gagal menghapus lamaran. Silakan coba lagi.");
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link
            href={PATHS.STUDENT_APPLICATIONS}
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Kembali ke daftar lamaran
          </Link>
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Delete Error */}
      {deleteError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 text-primary animate-spin mr-2" />
          <span>Memuat detail lamaran...</span>
        </div>
      )}

      {/* Application Details */}
      {!isLoading && !error && application && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Job Info Card */}
            <Card>
              <CardHeader className="pb-0">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">
                      {application.judul_lowongan}
                    </CardTitle>
                    <CardDescription className="mt-1 flex items-center text-base">
                      <Building className="h-4 w-4 mr-1" />
                      {application.nama_perusahaan}
                    </CardDescription>
                  </div>

                  {/* Status Badge */}
                  {application.status && (
                    <div>
                      {(() => {
                        const statusInfo = getApplicationStatusInfo(
                          application.status
                        );
                        return (
                          <Badge
                            variant="outline"
                            className={`px-3 py-1 ${statusInfo.color} ${statusInfo.bgColor} border-${statusInfo.borderColor} text-sm flex items-center gap-1`}
                          >
                            {getStatusIcon(application.status)}
                            {statusInfo.label}
                          </Badge>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{application.lokasi}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span>{application.jenis_pekerjaan}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>
                      Dilamar pada {formatDate(application.tanggal_melamar)}
                    </span>
                  </div>
                </div>

                {/* Job Description */}
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Deskripsi Pekerjaan</h3>
                  <p className="text-muted-foreground">
                    {application.deskripsi_lowongan}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <Button variant="outline" asChild>
                  <Link
                    href={PATHS.JOB_DETAILS(application.judul_lowongan)}
                    target="_blank"
                    className="flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Lihat Lowongan
                  </Link>
                </Button>

                {application.status === "menunggu" && (
                  <Button
                    variant="destructive"
                    onClick={handleDeleteApplication}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <>Batalkan Lamaran</>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Application Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detail Lamaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Resume */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">Resume</h3>
                  <div className="flex items-center p-3 border rounded-md bg-muted/20">
                    <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                    <span className="flex-1">
                      Resume_{application.nama_depan}_
                      {application.nama_belakang}.pdf
                    </span>
                    <Button variant="ghost" size="sm" className="ml-2">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">Surat Lamaran</h3>
                  <div className="p-4 border rounded-md bg-muted/20">
                    <p className="text-muted-foreground whitespace-pre-line">
                      {application.surat_lamaran}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Application History */}
            {application.riwayat && application.riwayat.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Riwayat Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6 relative">
                    {/* Custom timeline implementation */}
                    <div className="absolute top-0 bottom-0 left-4 w-px bg-border" />

                    {application.riwayat.map(
                      (history: ApplicationHistory, index: number) => {
                        const statusInfo = getApplicationStatusInfo(
                          history.status
                        );

                        return (
                          <div key={index} className="relative pl-12">
                            {/* Timeline dot/icon */}
                            <div
                              className={`absolute left-0 p-1.5 rounded-full ${statusInfo.bgColor} ${statusInfo.color} border ${statusInfo.borderColor}`}
                            >
                              {getStatusIcon(history.status)}
                            </div>

                            {/* Content */}
                            <div>
                              <div className="flex items-baseline">
                                <h4 className="font-semibold">
                                  {statusInfo.label}
                                </h4>
                                <span className="text-xs text-muted-foreground ml-2">
                                  {formatDateTime(history.dibuat_pada)}
                                </span>
                              </div>
                              <div className="mt-1 space-y-1">
                                <p className="text-muted-foreground">
                                  {history.catatan}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  oleh {history.nama_pengguna} ({history.peran})
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Applicant Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informasi Pelamar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-muted mb-4 overflow-hidden">
                    {application.foto ? (
                      <Image
                        src={application.foto}
                        alt={`${application.nama_depan} ${application.nama_belakang}`}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-2xl font-bold">
                        {application.nama_depan?.[0] || ""}
                        {application.nama_belakang?.[0] || ""}
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg">
                    {application.nama_depan} {application.nama_belakang}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {application.jurusan || "Jurusan tidak tercantum"}
                  </p>
                </div>

                <Separator className="my-4" />

                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Status:</dt>
                    <dd className="font-medium">
                      {APPLICATION_STATUS.find(
                        (s) => s.value === application.status
                      )?.label || application.status}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Tanggal Melamar:</dt>
                    <dd className="font-medium">
                      {formatDate(application.tanggal_melamar)}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* What's Next Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Langkah Selanjutnya</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  switch (application.status) {
                    case "menunggu":
                      return (
                        <p className="text-muted-foreground text-sm">
                          Lamaran Anda sedang menunggu untuk ditinjau oleh
                          perusahaan. Kami akan memberi tahu Anda jika ada
                          pembaruan.
                        </p>
                      );
                    case "ditinjau":
                      return (
                        <p className="text-muted-foreground text-sm">
                          Lamaran Anda sedang dalam peninjauan. Tim rekrutmen
                          sedang mengevaluasi kesesuaian kualifikasi Anda dengan
                          posisi ini.
                        </p>
                      );
                    case "shortlist":
                      return (
                        <p className="text-muted-foreground text-sm">
                          Selamat! Anda masuk dalam daftar kandidat potensial.
                          Perusahaan akan menghubungi Anda untuk langkah
                          selanjutnya.
                        </p>
                      );
                    case "wawancara":
                      return (
                        <p className="text-muted-foreground text-sm">
                          Anda dijadwalkan untuk wawancara. Persiapkan diri
                          dengan baik dan pastikan untuk datang tepat waktu.
                        </p>
                      );
                    case "ditawari":
                      return (
                        <p className="text-muted-foreground text-sm">
                          Selamat! Anda telah ditawari posisi ini. Perusahaan
                          akan menghubungi Anda untuk diskusi lebih lanjut
                          tentang penawaran.
                        </p>
                      );
                    case "diterima":
                      return (
                        <p className="text-muted-foreground text-sm">
                          Selamat! Anda telah menerima tawaran untuk posisi ini.
                          Tim HR akan menghubungi Anda untuk proses orientasi.
                        </p>
                      );
                    case "ditolak":
                      return (
                        <p className="text-muted-foreground text-sm">
                          Maaf, lamaran Anda tidak lolos untuk posisi ini.
                          Jangan berkecil hati, teruslah mencari peluang lain
                          yang sesuai dengan keahlian Anda.
                        </p>
                      );
                    default:
                      return (
                        <p className="text-muted-foreground text-sm">
                          Pantau status lamaran Anda secara berkala untuk
                          mendapatkan informasi terbaru.
                        </p>
                      );
                  }
                })()}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
