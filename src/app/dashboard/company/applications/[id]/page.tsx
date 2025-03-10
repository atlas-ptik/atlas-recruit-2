// src/app/dashboard/company/applications/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Clock,
  FileText,
  Download,
  ExternalLink,
  Send,
  Loader2,
  AlertTriangle,
  User,
  Check,
  MailIcon,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogClose,
} from "@/components/ui/dialog";
import { useApi } from "@/contexts/ApiContext";
import { PATHS, APPLICATION_STATUS } from "@/lib/constants";
import { formatDate, formatDateTime } from "@/lib/utils";
import {
  ApplicationDetail,
  ApplicationHistory,
  ApplicationStatus,
  UpdateApplicationStatusRequest,
} from "@/lib/api/applicationService";

export default function CompanyApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { services } = useApi();

  // State for application details
  const [application, setApplication] = useState<ApplicationDetail | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // State for status update
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<ApplicationStatus | "">("");
  const [statusNote, setStatusNote] = useState("");

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

  // Prepare next status options based on current status
  const getNextStatusOptions = () => {
    if (!application) return [];

    const currentStatus = application.status;

    switch (currentStatus) {
      case "menunggu":
        return [
          { value: "ditinjau", label: "Ditinjau" },
          { value: "shortlist", label: "Shortlist" },
          { value: "ditolak", label: "Tolak Lamaran" },
        ];
      case "ditinjau":
        return [
          { value: "shortlist", label: "Shortlist" },
          { value: "ditolak", label: "Tolak Lamaran" },
        ];
      case "shortlist":
        return [
          { value: "wawancara", label: "Jadwalkan Wawancara" },
          { value: "ditolak", label: "Tolak Lamaran" },
        ];
      case "wawancara":
        return [
          { value: "ditawari", label: "Tawarkan Posisi" },
          { value: "ditolak", label: "Tolak Lamaran" },
        ];
      case "ditawari":
        return [
          { value: "diterima", label: "Terima Kandidat" },
          { value: "ditolak", label: "Tolak Lamaran" },
        ];
      case "diterima":
      case "ditolak":
        return []; // Terminal states, no next status
      default:
        return [];
    }
  };

  // Open status update dialog
  const openStatusDialog = (status: ApplicationStatus) => {
    setNewStatus(status);

    // Set default notes based on status
    switch (status) {
      case "ditinjau":
        setStatusNote(
          "Lamaran Anda sedang dalam peninjauan oleh tim rekrutmen kami."
        );
        break;
      case "shortlist":
        setStatusNote(
          "Selamat! Anda telah masuk dalam shortlist kandidat untuk posisi ini."
        );
        break;
      case "wawancara":
        setStatusNote(
          "Kami ingin mengundang Anda untuk wawancara. Tim HR kami akan menghubungi Anda untuk menentukan jadwal yang sesuai."
        );
        break;
      case "ditawari":
        setStatusNote(
          "Selamat! Kami ingin menawarkan Anda posisi ini. Tim HR kami akan menghubungi Anda untuk diskusi lebih lanjut tentang penawaran."
        );
        break;
      case "diterima":
        setStatusNote(
          "Selamat! Anda resmi diterima untuk posisi ini. Tim HR kami akan menghubungi Anda untuk proses onboarding."
        );
        break;
      case "ditolak":
        setStatusNote(
          "Terima kasih atas ketertarikan Anda pada posisi ini. Setelah evaluasi menyeluruh, kami memutuskan untuk melanjutkan dengan kandidat lain yang lebih sesuai dengan kebutuhan kami saat ini."
        );
        break;
      default:
        setStatusNote("");
    }

    setUpdateError("");
    setShowStatusDialog(true);
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!newStatus || !statusNote.trim()) {
      setUpdateError("Status dan catatan harus diisi");
      return;
    }

    setIsUpdatingStatus(true);
    setUpdateError("");

    try {
      const updateData: UpdateApplicationStatusRequest = {
        status: newStatus as ApplicationStatus,
        catatan: statusNote,
      };

      await services.application.updateApplicationStatus(
        id as string,
        updateData
      );

      // Update local state with new status and add to history
      if (application) {
        const updatedApplication = { ...application };
        updatedApplication.status = newStatus as ApplicationStatus;

        // Add new history entry (mock data as we don't have the exact details from API)
        const newHistoryEntry: ApplicationHistory = {
          status: newStatus as ApplicationStatus,
          catatan: statusNote,
          nama_pengguna: "You", // This would be replaced by actual user name from context
          peran: "perusahaan",
          dibuat_pada: new Date().toISOString(),
        };

        updatedApplication.riwayat = [
          newHistoryEntry,
          ...(updatedApplication.riwayat || []),
        ];

        setApplication(updatedApplication);
      }

      // Close dialog
      setShowStatusDialog(false);

      // Reset form
      setNewStatus("");
      setStatusNote("");
    } catch (err) {
      console.error("Failed to update application status:", err);
      setUpdateError("Gagal memperbarui status lamaran. Silakan coba lagi.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

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

  // Helper function to get icon for status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "menunggu":
        return <Clock className="h-4 w-4" />;
      case "ditinjau":
        return <FileText className="h-4 w-4" />;
      case "shortlist":
        return <Check className="h-4 w-4" />;
      case "wawancara":
        return <Calendar className="h-4 w-4" />;
      case "ditawari":
        return <Send className="h-4 w-4" />;
      case "diterima":
        return <Check className="h-4 w-4" />;
      case "ditolak":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link
            href={PATHS.COMPANY_APPLICATIONS}
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

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 text-primary animate-spin mr-2" />
          <span>Memuat detail lamaran...</span>
        </div>
      )}

      {/* Application Details */}
      {!isLoading && !error && application && (
        <>
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">
                  Lamaran dari {application.nama_depan}{" "}
                  {application.nama_belakang}
                </h1>
                {application.status && (
                  <Badge
                    variant="outline"
                    className={`
                      px-3 py-1 
                      ${getApplicationStatusInfo(application.status).color} 
                      ${getApplicationStatusInfo(application.status).bgColor} 
                      ${
                        getApplicationStatusInfo(application.status).borderColor
                      }
                    `}
                  >
                    {getApplicationStatusInfo(application.status).label}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-1">
                Untuk posisi{" "}
                <span className="font-medium">
                  {application.judul_lowongan}
                </span>{" "}
                • Dilamar pada {formatDate(application.tanggal_melamar)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {getNextStatusOptions().map((option) => (
                <Button
                  key={option.value}
                  variant={
                    option.value === "ditolak" ? "destructive" : "default"
                  }
                  onClick={() =>
                    openStatusDialog(option.value as ApplicationStatus)
                  }
                >
                  {getStatusIcon(option.value)}
                  <span className="ml-2">{option.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Tabs defaultValue="application" className="space-y-6">
                <TabsList>
                  <TabsTrigger
                    value="application"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Lamaran
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    Riwayat Status
                  </TabsTrigger>
                </TabsList>

                {/* Application Tab */}
                <TabsContent value="application" className="space-y-6">
                  {/* Cover Letter */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Surat Lamaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 border rounded-md bg-muted/20 whitespace-pre-line">
                        {application.surat_lamaran}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Resume */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Resume</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between p-4 border rounded-md bg-muted/20">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                          <span>
                            Resume_{application.nama_depan}_
                            {application.nama_belakang}.pdf
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Job Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Detail Lowongan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="px-3 py-1 text-sm">
                          {application.jenis_pekerjaan}
                        </Badge>
                        <Badge variant="outline" className="px-3 py-1 text-sm">
                          {application.lokasi}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">
                          Deskripsi Pekerjaan
                        </h3>
                        <p className="text-muted-foreground text-sm whitespace-pre-line">
                          {application.deskripsi_lowongan}
                        </p>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={PATHS.JOB_DETAILS(application.judul_lowongan)}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Lihat Lowongan Lengkap
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Riwayat Status Lamaran
                      </CardTitle>
                      <CardDescription>
                        Log perubahan status lamaran
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {application.riwayat && application.riwayat.length > 0 ? (
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
                                        oleh {history.nama_pengguna} (
                                        {history.peran})
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          Belum ada riwayat status
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Applicant Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profil Pelamar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center mb-4">
                    <Avatar className="h-20 w-20 mb-3">
                      {application.foto ? (
                        <AvatarImage
                          src={application.foto}
                          alt={`${application.nama_depan} ${application.nama_belakang}`}
                        />
                      ) : (
                        <AvatarFallback className="text-xl">
                          {application.nama_depan?.[0] || ""}
                          {application.nama_belakang?.[0] || ""}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <h2 className="text-lg font-semibold">
                      {application.nama_depan} {application.nama_belakang}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {application.jurusan || "Tidak ada informasi jurusan"}
                    </p>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MailIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">
                          {/* Dummy email since it's not in the API response */}
                          {application.nama_depan.toLowerCase()}.
                          {application.nama_belakang.toLowerCase()}@example.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Pendidikan</p>
                        <p className="text-sm text-muted-foreground">
                          {application.jurusan || "Tidak tersedia"}{" "}
                          {/* This is just major, but we're making it look like education */}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Lokasi</p>
                        <p className="text-sm text-muted-foreground">
                          {/* Dummy location since it's not in the API response */}
                          Jakarta, Indonesia
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="#">
                      <User className="h-4 w-4 mr-2" />
                      Lihat Profil Lengkap
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistic Lamaran</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Lamaran dilihat
                      </span>
                      <span className="font-medium">3 kali</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Pembaruan terakhir
                      </span>
                      <span className="font-medium">
                        {application.riwayat && application.riwayat.length > 0
                          ? formatDate(application.riwayat[0].dibuat_pada)
                          : formatDate(application.tanggal_melamar)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Dilamar pada
                      </span>
                      <span className="font-medium">
                        {formatDate(application.tanggal_melamar)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Perbarui Status Lamaran</DialogTitle>
            <DialogDescription>
              Perbarui status lamaran dan berikan catatan untuk pelamar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {updateError && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{updateError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="status">Status Baru</Label>
              <Select
                value={newStatus}
                onValueChange={(value) =>
                  setNewStatus(value as ApplicationStatus)
                }
                disabled={isUpdatingStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  {getNextStatusOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="statusNote">Catatan untuk Pelamar</Label>
              <Textarea
                id="statusNote"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                disabled={isUpdatingStatus}
                rows={5}
                placeholder="Berikan penjelasan tentang status ini"
              />
              <p className="text-xs text-muted-foreground">
                Catatan ini akan terlihat oleh pelamar dan tercatat dalam
                riwayat status.
              </p>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isUpdatingStatus}>
                Batal
              </Button>
            </DialogClose>
            <Button
              onClick={handleStatusUpdate}
              disabled={isUpdatingStatus || !newStatus || !statusNote.trim()}
              variant={newStatus === "ditolak" ? "destructive" : "default"}
            >
              {isUpdatingStatus ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Perbarui Status"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
