// src/app/companies/[id]/page.tsx - Company detail page
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import {
  ExternalLink,
  Building,
  MapPin,
  Globe,
  Users,
  Briefcase,
  Calendar,
} from "lucide-react";
import { useApi } from "@/contexts/ApiContext";
import { JobListing } from "@/lib/api/jobService";
import Link from "next/link";
import { PATHS } from "@/lib/constants";
import apiClient from "@/lib/api/apiClient";

// Since there isn't a specific companyService in the provided code,
// we'll create a minimal implementation here
interface CompanyDetail {
  id: string;
  nama: string;
  email: string;
  industri: string;
  deskripsi?: string;
  lokasi?: string;
  situs_web?: string;
  logo?: string;
  ukuran?: string;
  tahun_berdiri?: number;
  status: "aktif" | "menunggu" | "ditolak";
}

async function getCompanyById(id: string): Promise<CompanyDetail> {
  const response = await apiClient.get<CompanyDetail>(`/perusahaan/${id}`);
  if (response.sukses && response.data) {
    return response.data;
  } else {
    throw new Error(response.pesan || "Gagal mengambil detail perusahaan");
  }
}

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { services } = useApi();
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);

        // Get company details
        const companyData = await getCompanyById(id as string);
        setCompany(companyData);

        // Fetch company's job listings
        const jobsResponse = await services.job.getJobs({
          perusahaan_id: id as string,
        });

        setJobs(jobsResponse.lowongan);
      } catch (err) {
        console.error("Error fetching company details:", err);
        setError("Gagal memuat data perusahaan. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompanyData();
    }
  }, [id, services.job]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <CompanyDetailSkeleton />
        </div>
      </MainLayout>
    );
  }

  if (error || !company) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="flex flex-col items-center justify-center text-center p-8">
            <h2 className="text-2xl font-bold mb-4">
              {error || "Perusahaan tidak ditemukan"}
            </h2>
            <Button asChild>
              <Link href={PATHS.COMPANIES}>Kembali ke Daftar Perusahaan</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info Card */}
          <div className="md:col-span-1">
            <Card className="bg-card/50 backdrop-blur-sm border border-primary/20 overflow-hidden">
              <div className="bg-primary/10 p-6 flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
                  {company.logo ? (
                    <Image
                      src={company.logo}
                      alt={company.nama}
                      className="object-cover"
                    />
                  ) : (
                    <Building className="h-12 w-12" />
                  )}
                </Avatar>
                <h1 className="text-2xl font-bold text-center">
                  {company.nama}
                </h1>
                <Badge variant="outline" className="mt-2">
                  {company.industri}
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {company.deskripsi && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Tentang Perusahaan
                      </h3>
                      <p>{company.deskripsi}</p>
                    </div>
                  )}

                  {company.lokasi && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <span>{company.lokasi}</span>
                    </div>
                  )}

                  {company.situs_web && (
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-primary" />
                      <a
                        href={
                          company.situs_web.startsWith("http")
                            ? company.situs_web
                            : `https://${company.situs_web}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center"
                      >
                        {company.situs_web.replace(/^https?:\/\//, "")}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  )}

                  {company.ukuran && (
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      <span>{company.ukuran}</span>
                    </div>
                  )}

                  {company.tahun_berdiri && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span>Berdiri sejak {company.tahun_berdiri}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="jobs" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="jobs" className="flex-1">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Lowongan Tersedia
                </TabsTrigger>
                <TabsTrigger value="about" className="flex-1">
                  <Building className="h-4 w-4 mr-2" />
                  Tentang Perusahaan
                </TabsTrigger>
              </TabsList>

              <TabsContent value="jobs" className="space-y-6">
                <h2 className="text-2xl font-bold">Lowongan Tersedia</h2>

                {jobs.length === 0 ? (
                  <div className="bg-card/50 backdrop-blur-sm border border-border p-8 rounded-lg text-center">
                    <p className="text-muted-foreground mb-4">
                      Saat ini tidak ada lowongan tersedia dari perusahaan ini.
                    </p>
                    <Button asChild variant="outline">
                      <Link href={PATHS.JOBS}>Lihat Semua Lowongan</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {jobs.map((job) => (
                      <Link
                        key={job.id}
                        href={PATHS.JOB_DETAILS(job.id)}
                        className="bg-card/50 backdrop-blur-sm hover:bg-card/70 border border-border p-4 rounded-lg transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {job.judul}
                            </h3>
                            <div className="flex items-center text-muted-foreground text-sm mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{job.lokasi}</span>
                              <span className="mx-2">•</span>
                              <span>{job.jenis_pekerjaan}</span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Detail
                          </Button>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="about">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">
                      Profil Perusahaan
                    </h2>
                    <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-lg">
                      <p className="whitespace-pre-line">
                        {company.deskripsi || "Tidak ada deskripsi tersedia."}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Informasi Perusahaan
                    </h3>
                    <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Industri
                        </h4>
                        <p>{company.industri}</p>
                      </div>

                      {company.ukuran && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">
                            Ukuran Perusahaan
                          </h4>
                          <p>{company.ukuran}</p>
                        </div>
                      )}

                      {company.tahun_berdiri && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">
                            Tahun Berdiri
                          </h4>
                          <p>{company.tahun_berdiri}</p>
                        </div>
                      )}

                      {company.lokasi && (
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">
                            Lokasi
                          </h4>
                          <p>{company.lokasi}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function CompanyDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <Card>
          <div className="p-6 flex flex-col items-center">
            <Skeleton className="h-24 w-24 rounded-full mb-4" />
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <div className="space-y-6">
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>

          <Skeleton className="h-8 w-1/3 mb-4" />

          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-64" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-56" />
                  <Skeleton className="h-4 w-36" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
