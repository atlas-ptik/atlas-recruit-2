// src/app/companies/page.tsx - Halaman daftar perusahaan
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building,
  ExternalLink,
  Filter,
  Search,
  MapPin,
  Briefcase,
} from "lucide-react";
import { PATHS } from "@/lib/constants";

// Interface for Company type
interface Company {
  id: string;
  nama: string;
  industri: string;
  deskripsi?: string;
  lokasi?: string;
  logo?: string;
  jumlah_lowongan: number;
}

// Sample industries and locations for filters
const industries = [
  "Teknologi",
  "Keuangan",
  "Pendidikan",
  "Kesehatan",
  "Manufaktur",
  "Retail",
  "Media",
  "Konsultan",
  "Lainnya",
];

const locations = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
  "Medan",
  "Makassar",
  "Semarang",
  "Bali",
];

// Mock company data
const mockCompanies: Company[] = [
  {
    id: "comp-001",
    nama: "Tech Innovations",
    industri: "Teknologi",
    deskripsi:
      "Perusahaan teknologi inovatif yang fokus pada pengembangan solusi digital",
    lokasi: "Jakarta",
    logo: "",
    jumlah_lowongan: 5,
  },
  {
    id: "comp-002",
    nama: "Financial Group",
    industri: "Keuangan",
    deskripsi: "Layanan keuangan dan perbankan terkemuka di Indonesia",
    lokasi: "Jakarta",
    logo: "",
    jumlah_lowongan: 3,
  },
  {
    id: "comp-003",
    nama: "EduTech Solutions",
    industri: "Pendidikan",
    deskripsi: "Platform pendidikan digital untuk menghubungkan siswa dan guru",
    lokasi: "Bandung",
    logo: "",
    jumlah_lowongan: 2,
  },
  {
    id: "comp-004",
    nama: "Health Care Providers",
    industri: "Kesehatan",
    deskripsi: "Jaringan layanan kesehatan dengan teknologi modern",
    lokasi: "Surabaya",
    logo: "",
    jumlah_lowongan: 4,
  },
  {
    id: "comp-005",
    nama: "Manufacturing Excellence",
    industri: "Manufaktur",
    deskripsi: "Perusahaan manufaktur dengan standar internasional",
    lokasi: "Semarang",
    logo: "",
    jumlah_lowongan: 6,
  },
  {
    id: "comp-006",
    nama: "Retail Chain Group",
    industri: "Retail",
    deskripsi: "Jaringan retail terbesar dengan cabang di seluruh Indonesia",
    lokasi: "Jakarta",
    logo: "",
    jumlah_lowongan: 8,
  },
];

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [industryFilter, setIndustryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 6;

  useEffect(() => {
    // Simulate API fetch
    const fetchCompanies = () => {
      setIsLoading(true);
      setTimeout(() => {
        setCompanies(mockCompanies);
        setFilteredCompanies(mockCompanies);
        setTotalPages(Math.ceil(mockCompanies.length / itemsPerPage));
        setIsLoading(false);
      }, 1000);
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...companies];

    if (searchQuery) {
      result = result.filter(
        (company) =>
          company.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (company.deskripsi &&
            company.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (industryFilter) {
      result = result.filter((company) => company.industri === industryFilter);
    }

    if (locationFilter) {
      result = result.filter((company) => company.lokasi === locationFilter);
    }

    setFilteredCompanies(result);
    setTotalPages(Math.ceil(result.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [companies, searchQuery, industryFilter, locationFilter]);

  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  const clearFilters = () => {
    setSearchQuery("");
    setIndustryFilter("");
    setLocationFilter("");
  };

  return (
    <MainLayout>
      <div className="container px-4 py-8 md:py-12">
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Perusahaan Terkemuka
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            Jelajahi perusahaan-perusahaan yang berkolaborasi dengan kami untuk
            mencari talenta terbaik dari universitas terkemuka di Indonesia.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card border rounded-lg p-4 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Cari nama perusahaan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:w-2/5">
                <Select
                  value={industryFilter}
                  onValueChange={setIndustryFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Industri" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua Industri</SelectItem>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={locationFilter}
                  onValueChange={setLocationFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Lokasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua Lokasi</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {filteredCompanies.length} perusahaan ditemukan
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Terapkan Filter
                </Button>
                {(searchQuery || industryFilter || locationFilter) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                  >
                    Hapus Filter
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Companies Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Skeleton className="h-16 w-full" />
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">
              Tidak ada perusahaan ditemukan
            </h3>
            <p className="text-muted-foreground mb-4">
              Coba ubah kriteria pencarian atau filter Anda
            </p>
            <Button onClick={clearFilters}>Hapus Semua Filter</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCompanies.map((company) => (
                <Card
                  key={company.id}
                  className="overflow-hidden group hover:border-primary/50 transition-all duration-300"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                        <Building className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {company.nama}
                        </CardTitle>
                        <CardDescription>{company.industri}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground line-clamp-3 min-h-[4.5rem]">
                      {company.deskripsi}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {company.lokasi && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-sm">{company.lokasi}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm">
                          {company.jumlah_lowongan} Lowongan Aktif
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full group-hover:border-primary/50 group-hover:bg-primary/5"
                    >
                      <Link href={PATHS.COMPANY_DETAILS(company.id)}>
                        Lihat Profil
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <Button
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="icon"
                            onClick={() => setCurrentPage(page)}
                            className={
                              currentPage === page
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : ""
                            }
                          >
                            {page}
                          </Button>
                        </PaginationItem>
                      )
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
