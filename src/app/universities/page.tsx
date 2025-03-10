// src/app/universities/page.tsx - Halaman daftar universitas
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
import { useApi } from "@/contexts/ApiContext";
import { University } from "@/lib/api/universityService";
import {
  GraduationCap,
  Search,
  ExternalLink,
  Filter,
  Users,
  Globe,
} from "lucide-react";
import { PATHS } from "@/lib/constants";

// Sample locations for filters
const locations = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
  "Medan",
  "Makassar",
  "Semarang",
  "Malang",
];

export default function UniversitiesPage() {
  const { services } = useApi();
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<
    University[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [locationFilter, setLocationFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 6;

  // Dummy student counts for UI purposes only (not in API response)
  const [universityStudentCounts, setUniversityStudentCounts] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    const fetchUniversities = async () => {
      setIsLoading(true);
      try {
        const response = await services.university.getUniversities({
          per_halaman: 100, // Get all for client-side filtering
        });

        setUniversities(response.universitas);
        setFilteredUniversities(response.universitas);

        // Create dummy student counts
        const studentCounts: Record<string, number> = {};
        response.universitas.forEach((univ) => {
          studentCounts[univ.id] = Math.floor(Math.random() * 500) + 100; // Random between 100-600
        });
        setUniversityStudentCounts(studentCounts);

        setTotalPages(Math.ceil(response.universitas.length / itemsPerPage));
      } catch (error) {
        console.error("Failed to fetch universities:", error);
        // Fallback to empty array if API fails
        setUniversities([]);
        setFilteredUniversities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUniversities();
  }, [services.university]);

  useEffect(() => {
    // Apply filters
    let result = [...universities];

    if (searchQuery) {
      result = result.filter((univ) =>
        univ.nama.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (locationFilter) {
      result = result.filter((univ) => univ.lokasi === locationFilter);
    }

    setFilteredUniversities(result);
    setTotalPages(Math.ceil(result.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [universities, searchQuery, locationFilter]);

  const paginatedUniversities = filteredUniversities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLocationFilter("");
  };

  return (
    <MainLayout>
      <div className="container px-4 py-8 md:py-12">
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Universitas Mitra
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            Jelajahi universitas-universitas terkemuka yang bermitra dengan kami
            untuk menyalurkan lulusan berbakat ke dunia kerja.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card border rounded-lg p-4 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Cari nama universitas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="md:w-1/3">
                <Select
                  value={locationFilter}
                  onValueChange={setLocationFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Lokasi" />
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
                {filteredUniversities.length} universitas ditemukan
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Terapkan Filter
                </Button>
                {(searchQuery || locationFilter) && (
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

        {/* Universities Grid */}
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
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex space-x-4 mt-4">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
          </div>
        ) : filteredUniversities.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">
              Tidak ada universitas ditemukan
            </h3>
            <p className="text-muted-foreground mb-4">
              Coba ubah kriteria pencarian atau filter Anda
            </p>
            <Button onClick={clearFilters}>Hapus Semua Filter</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedUniversities.map((university) => (
                <Card
                  key={university.id}
                  className="overflow-hidden group hover:border-primary/50 transition-all duration-300"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                        {university.logo ? (
                          <div
                            style={{
                              backgroundImage: `url(${university.logo})`,
                              backgroundSize: "contain",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              width: "100%",
                              height: "100%",
                            }}
                            role="img"
                            aria-label={`Logo ${university.nama}`}
                          />
                        ) : (
                          <GraduationCap className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {university.nama}
                        </CardTitle>
                        <CardDescription>{university.lokasi}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-4">
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>
                          {universityStudentCounts[university.id] || "N/A"}{" "}
                          mahasiswa
                        </span>
                      </div>
                      {university.situs_web && (
                        <div className="flex items-center text-sm">
                          <Globe className="h-4 w-4 mr-1 text-muted-foreground" />
                          <a
                            href={`https://${university.situs_web}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {university.situs_web}
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full group-hover:border-primary/50 group-hover:bg-primary/5"
                    >
                      <Link href={PATHS.UNIVERSITY_DETAILS(university.id)}>
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
