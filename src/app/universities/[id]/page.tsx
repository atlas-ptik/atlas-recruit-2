// src/app/universities/[id]/page.tsx - University detail page
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import {
  ExternalLink,
  BookOpen,
  MapPin,
  Globe,
  Users,
  School,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useApi } from "@/contexts/ApiContext";
import { UniversityDetail } from "@/lib/api/universityService";
import Link from "next/link";
import { PATHS } from "@/lib/constants";

export default function UniversityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { services } = useApi();
  const [university, setUniversity] = useState<UniversityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        setLoading(true);

        // Get university details
        const universityData = await services.university.getUniversityById(
          id as string
        );
        setUniversity(universityData);
      } catch (err) {
        console.error("Error fetching university details:", err);
        setError("Gagal memuat data universitas. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUniversityData();
    }
  }, [id, services.university]);

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <UniversityDetailSkeleton />
        </div>
      </MainLayout>
    );
  }

  if (error || !university) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="flex flex-col items-center justify-center text-center p-8">
            <h2 className="text-2xl font-bold mb-4">
              {error || "Universitas tidak ditemukan"}
            </h2>
            <Button asChild>
              <Link href={PATHS.UNIVERSITIES}>
                Kembali ke Daftar Universitas
              </Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border border-primary/20">
          {/* Header with logo and university name */}
          <div className="relative h-40 bg-primary/10">
            <div className="absolute bottom-0 left-0 right-0 flex items-end p-6 transform translate-y-1/2">
              <Avatar className="h-24 w-24 border-4 border-background mr-4">
                {university.logo ? (
                  <Image
                    src={university.logo}
                    alt={university.nama}
                    className="object-cover"
                  />
                ) : (
                  <BookOpen className="h-12 w-12" />
                )}
              </Avatar>
              <div className="flex-1"></div>
            </div>
          </div>

          {/* Main content */}
          <CardContent className="pt-16 pb-6 px-6">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold">{university.nama}</h1>
                <div className="flex items-center mt-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{university.lokasi}</span>
                </div>
              </div>

              {university.situs_web && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="gap-2 mt-2 md:mt-0"
                >
                  <a
                    href={
                      university.situs_web.startsWith("http")
                        ? university.situs_web
                        : `https://${university.situs_web}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="h-4 w-4" />
                    Kunjungi Website
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              )}
            </div>

            {/* University description */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">
                Tentang Universitas
              </h2>
              <p className="whitespace-pre-line">
                {university.deskripsi || "Tidak ada deskripsi tersedia."}
              </p>
            </div>

            {/* University stats and info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 flex items-center">
                  <Users className="h-8 w-8 text-primary mr-4" />
                  <div>
                    <p className="text-lg font-bold">
                      {university.jumlah_mahasiswa || "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Mahasiswa Terdaftar
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 flex items-center">
                  <MapPin className="h-8 w-8 text-primary mr-4" />
                  <div>
                    <p className="text-lg font-bold">{university.lokasi}</p>
                    <p className="text-sm text-muted-foreground">Lokasi</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 flex items-center">
                  <School className="h-8 w-8 text-primary mr-4" />
                  <div>
                    <p className="text-lg font-bold">
                      {formatDate(university.dibuat_pada).split(" ")[2]}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tahun Bergabung
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA for students/companies */}
            <div className="mt-12 bg-card border border-border rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">
                Tertarik dengan Universitas Ini?
              </h3>
              <p className="text-muted-foreground mb-6">
                Daftar sebagai mahasiswa untuk mendapatkan akses ke lowongan
                yang sesuai dengan kualifikasi Anda
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href={PATHS.REGISTER_STUDENT}>
                    Daftar Sebagai Mahasiswa
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={PATHS.JOBS}>Lihat Lowongan</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

function UniversityDetailSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Header skeleton */}
      <div className="relative h-40 bg-muted">
        <div className="absolute bottom-0 left-0 right-0 flex items-end p-6 transform translate-y-1/2">
          <Skeleton className="h-24 w-24 rounded-full mr-4" />
          <div className="flex-1"></div>
        </div>
      </div>

      {/* Main content skeleton */}
      <CardContent className="pt-16 pb-6 px-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-32" />
          </div>

          <Skeleton className="h-9 w-36 mt-2 md:mt-0" />
        </div>

        {/* Description skeleton */}
        <div className="mt-8">
          <Skeleton className="h-7 w-48 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Stats skeleton */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>

        {/* CTA skeleton */}
        <Skeleton className="h-48 w-full mt-12 rounded-lg" />
      </CardContent>
    </Card>
  );
}
