// src/app/jobs/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Briefcase,
  Building,
  Clock,
  Award,
  CheckCircle,
  DollarSign,
  CalendarDays,
  Share2,
  BookmarkPlus,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { MainLayout } from "@/components/layout/main-layout";
import { useApi } from "@/contexts/ApiContext";
import { PATHS, JOB_TYPES, EXPERIENCE_LEVELS } from "@/lib/constants";
import { JobDetail } from "@/lib/api/jobService";
import { formatDate } from "@/lib/utils";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated, services } = useApi();

  // State for job details
  const [job, setJob] = useState<JobDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // State for application
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [applicationError, setApplicationError] = useState("");
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  // Load job details on component mount
  useEffect(() => {
    const fetchJobDetails = async () => {
      setIsLoading(true);
      try {
        const jobData = await services.job.getJobById(id as string);
        setJob(jobData);
        setError("");
      } catch (err) {
        console.error("Failed to fetch job details:", err);
        setError("Gagal memuat detail lowongan. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id, services.job]);

  // Handle application submission
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      router.push(
        `${PATHS.LOGIN}?redirect=${encodeURIComponent(
          window.location.pathname
        )}`
      );
      return;
    }

    if (user?.peran !== "mahasiswa") {
      setApplicationError("Hanya akun mahasiswa yang dapat mengirim lamaran.");
      return;
    }

    if (!coverLetter.trim()) {
      setApplicationError("Surat lamaran harus diisi.");
      return;
    }

    // In a real application, we would upload the resume file first
    // For now, we'll use a placeholder URL
    const resumeUrlToUse =
      resumeUrl || "https://example.com/placeholder-resume.pdf";

    setIsApplying(true);
    setApplicationError("");

    try {
      await services.application.createApplication({
        lowongan_id: id as string,
        surat_lamaran: coverLetter,
        resume: resumeUrlToUse,
      });

      setApplicationSuccess(true);
      setCoverLetter("");
      setResumeUrl("");
    } catch (err) {
      console.error("Failed to submit application:", err);
      setApplicationError(
        err instanceof Error
          ? err.message
          : "Gagal mengirim lamaran. Silakan coba lagi."
      );
    } finally {
      setIsApplying(false);
    }
  };

  // Format the job type label
  const getJobTypeLabel = (type: string) => {
    return JOB_TYPES.find((t) => t.value === type)?.label || type;
  };

  // Format the experience level label
  const getExperienceLevelLabel = (level: string) => {
    return EXPERIENCE_LEVELS.find((l) => l.value === level)?.label || level;
  };

  // Format salary range
  const formatSalary = (min?: number, max?: number, showSalary = true) => {
    if (!showSalary) return "Gaji tidak ditampilkan";
    if (!min && !max) return "Gaji belum ditentukan";

    const formatNumber = (num: number) => {
      return new Intl.NumberFormat("id-ID").format(num);
    };

    if (min && max) {
      return `Rp ${formatNumber(min)} - Rp ${formatNumber(max)}`;
    } else if (min) {
      return `Mulai dari Rp ${formatNumber(min)}`;
    } else if (max) {
      return `Hingga Rp ${formatNumber(max)}`;
    }

    return "Gaji belum ditentukan";
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <div>
          <Button variant="ghost" size="sm" asChild>
            <Link
              href={PATHS.JOBS}
              className="flex items-center text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Kembali ke daftar lowongan
            </Link>
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 text-primary animate-spin mr-2" />
            <span>Memuat detail lowongan...</span>
          </div>
        )}

        {/* Job Detail Content */}
        {!isLoading && !error && job && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Header */}
              <div className="bg-card rounded-lg p-6 border">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Company Logo */}
                  <div className="w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden bg-muted">
                    {job.logo_perusahaan ? (
                      <Image
                        src={job.logo_perusahaan}
                        alt={`${job.nama_perusahaan} logo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building className="w-full h-full p-3 text-muted-foreground" />
                    )}
                  </div>

                  {/* Job Details */}
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold">{job.judul}</h1>
                    <div className="flex flex-wrap gap-y-2 text-sm mt-2">
                      <span className="flex items-center mr-4 text-muted-foreground">
                        <Building className="h-4 w-4 mr-1" />
                        {job.nama_perusahaan}
                      </span>
                      <span className="flex items-center mr-4 text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.lokasi}
                      </span>
                      <span className="flex items-center mr-4 text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {getJobTypeLabel(job.jenis_pekerjaan)}
                      </span>
                      <span className="flex items-center text-muted-foreground">
                        <Award className="h-4 w-4 mr-1" />
                        {getExperienceLevelLabel(job.level_pengalaman)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" className="text-sm">
                    <BookmarkPlus className="h-4 w-4 mr-1" />
                    Simpan
                  </Button>
                  <Button variant="outline" size="sm" className="text-sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Bagikan
                  </Button>
                </div>
              </div>

              {/* Job Description */}
              <div className="bg-card rounded-lg p-6 border">
                <h2 className="text-xl font-semibold mb-4">
                  Deskripsi Pekerjaan
                </h2>
                <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-ul:leading-relaxed">
                  <p>{job.deskripsi}</p>
                </div>
              </div>

              {/* Job Requirements */}
              <div className="bg-card rounded-lg p-6 border">
                <h2 className="text-xl font-semibold mb-4">Persyaratan</h2>
                <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-ul:leading-relaxed">
                  <p>{job.persyaratan}</p>
                </div>
              </div>

              {/* Job Responsibilities */}
              <div className="bg-card rounded-lg p-6 border">
                <h2 className="text-xl font-semibold mb-4">Tanggung Jawab</h2>
                <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-ul:leading-relaxed">
                  <p>{job.tanggung_jawab}</p>
                </div>
              </div>

              {/* Job Benefits */}
              <div className="bg-card rounded-lg p-6 border">
                <h2 className="text-xl font-semibold mb-4">Keuntungan</h2>
                <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-ul:leading-relaxed">
                  <p>{job.keuntungan}</p>
                </div>
              </div>

              {/* Required Skills */}
              <div className="bg-card rounded-lg p-6 border">
                <h2 className="text-xl font-semibold mb-4">
                  Keahlian yang Dibutuhkan
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.keahlian.map((skill) => (
                    <Badge
                      key={skill.id}
                      variant={skill.wajib ? "default" : "outline"}
                      className={`
                        rounded-full px-3 py-1 text-sm 
                        ${
                          skill.wajib
                            ? "bg-primary/20 text-primary border-primary/30"
                            : ""
                        }
                      `}
                    >
                      {skill.wajib && <CheckCircle className="h-3 w-3 mr-1" />}
                      {skill.nama}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Apply Form for Students */}
              {user?.peran === "mahasiswa" && (
                <div className="bg-card rounded-lg p-6 border">
                  <h2 className="text-xl font-semibold mb-4">
                    Lamar Pekerjaan
                  </h2>

                  {/* Success Message */}
                  {applicationSuccess && (
                    <Alert className="mb-4 bg-green-500/10 text-green-500 border-green-500/20">
                      <AlertDescription>
                        Lamaran Anda berhasil dikirim! Anda dapat melihat status
                        lamaran Anda di halaman Lamaran Saya.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Error Message */}
                  {applicationError && (
                    <Alert className="mb-4 bg-destructive/10 text-destructive border-destructive/20">
                      <AlertDescription>{applicationError}</AlertDescription>
                    </Alert>
                  )}

                  {!applicationSuccess && (
                    <form onSubmit={handleApply} className="space-y-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="coverLetter"
                          className="block text-sm font-medium"
                        >
                          Surat Lamaran{" "}
                          <span className="text-destructive">*</span>
                        </label>
                        <Textarea
                          id="coverLetter"
                          placeholder="Jelaskan mengapa Anda tertarik dengan posisi ini dan mengapa Anda adalah kandidat yang tepat."
                          rows={6}
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          disabled={isApplying}
                          className="resize-y"
                        />
                      </div>

                      {/* You would implement a file upload component here */}
                      <div className="space-y-2">
                        <label
                          htmlFor="resume"
                          className="block text-sm font-medium"
                        >
                          Resume <span className="text-destructive">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            id="resume"
                            accept=".pdf,.doc,.docx"
                            disabled={isApplying}
                            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Format yang diterima: PDF, DOC, DOCX. Maksimal 5MB.
                        </p>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isApplying}
                      >
                        {isApplying ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Mengirim...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Kirim Lamaran
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              )}

              {/* Login/Register CTA for unauthenticated users */}
              {!isAuthenticated && (
                <div className="bg-card rounded-lg p-6 border">
                  <h2 className="text-xl font-semibold mb-2">
                    Tertarik dengan posisi ini?
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Masuk atau daftar untuk mengirim lamaran ke posisi ini.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild>
                      <Link
                        href={`${PATHS.LOGIN}?redirect=${encodeURIComponent(
                          window.location.pathname
                        )}`}
                      >
                        Masuk
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={PATHS.REGISTER}>Daftar</Link>
                    </Button>
                  </div>
                </div>
              )}

              {/* Company account message */}
              {user?.peran === "perusahaan" && (
                <div className="bg-card rounded-lg p-6 border">
                  <p className="text-muted-foreground">
                    Anda sedang masuk menggunakan akun perusahaan. Hanya akun
                    mahasiswa yang dapat mengirim lamaran.
                  </p>
                </div>
              )}

              {/* Admin account message */}
              {user?.peran === "admin" && (
                <div className="bg-card rounded-lg p-6 border">
                  <p className="text-muted-foreground">
                    Anda sedang masuk menggunakan akun admin. Hanya akun
                    mahasiswa yang dapat mengirim lamaran.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Job Summary */}
              <div className="bg-card rounded-lg p-6 border sticky top-24">
                <h2 className="text-lg font-semibold mb-4">
                  Informasi Lowongan
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <DollarSign className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                    <div>
                      <span className="block text-sm font-medium">
                        Kisaran Gaji
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatSalary(
                          job.gaji_min,
                          job.gaji_max,
                          job.tampilkan_gaji
                        )}
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Clock className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                    <div>
                      <span className="block text-sm font-medium">
                        Jenis Pekerjaan
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {getJobTypeLabel(job.jenis_pekerjaan)}
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Award className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                    <div>
                      <span className="block text-sm font-medium">
                        Level Pengalaman
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {getExperienceLevelLabel(job.level_pengalaman)}
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <MapPin className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                    <div>
                      <span className="block text-sm font-medium">Lokasi</span>
                      <span className="text-sm text-muted-foreground">
                        {job.lokasi}
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Building className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                    <div>
                      <span className="block text-sm font-medium">
                        Perusahaan
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {job.nama_perusahaan}
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Briefcase className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                    <div>
                      <span className="block text-sm font-medium">
                        Industri
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {job.industri}
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CalendarDays className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                    <div>
                      <span className="block text-sm font-medium">
                        Batas Lamaran
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(job.batas_lamaran)}
                      </span>
                    </div>
                  </li>
                </ul>

                {/* Quick Apply Button (for students) */}
                {user?.peran === "mahasiswa" && (
                  <Button className="w-full mt-6" asChild>
                    <a href="#apply-section">
                      <Send className="mr-2 h-4 w-4" />
                      Lamar Sekarang
                    </a>
                  </Button>
                )}

                {/* Login/Register Button (for unauthenticated users) */}
                {!isAuthenticated && (
                  <Button className="w-full mt-6" asChild>
                    <Link
                      href={`${PATHS.LOGIN}?redirect=${encodeURIComponent(
                        window.location.pathname
                      )}`}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Masuk untuk Melamar
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
