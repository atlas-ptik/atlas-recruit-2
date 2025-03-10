// src/app/dashboard/admin/universities/new/page.tsx - Halaman tambah universitas baru
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useApi } from "@/contexts/ApiContext";
// Removed toast import
import { CreateUniversityRequest } from "@/lib/api/universityService";
import { ArrowLeft, ImageIcon, Loader2 } from "lucide-react";

export default function AddUniversityPage() {
  const router = useRouter();
  const { services } = useApi();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateUniversityRequest>({
    nama: "",
    lokasi: "",
    situs_web: "",
    deskripsi: "",
    logo: "", // In a real app, this would be a file upload
  });

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic validation
      if (!formData.nama || !formData.lokasi) {
        alert("Error: Nama dan lokasi universitas wajib diisi");
        return;
      }

      // Clean up website URL (remove http://, https://)
      let websiteUrl = formData.situs_web;
      if (websiteUrl) {
        websiteUrl = websiteUrl.replace(/^https?:\/\//, "");
        formData.situs_web = websiteUrl;
      }

      // Submit data
      await services.university.createUniversity(formData);

      alert("Sukses: Universitas berhasil ditambahkan!");

      // Redirect to universities list
      router.push("/dashboard/admin/universities");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Gagal menambahkan universitas";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/admin/universities">
              Universitas
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Tambah Baru</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tambah Universitas Baru</h1>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      </div>

      <Card className="border-border/40 shadow-sm">
        <CardHeader>
          <CardTitle>Form Universitas</CardTitle>
          <CardDescription>
            Lengkapi formulir di bawah ini untuk menambahkan universitas baru
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nama">
                  Nama Universitas <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nama"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Universitas Indonesia"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lokasi">
                  Lokasi <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lokasi"
                  name="lokasi"
                  value={formData.lokasi}
                  onChange={handleChange}
                  placeholder="Jakarta"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="situs_web">Situs Web</Label>
              <Input
                id="situs_web"
                name="situs_web"
                value={formData.situs_web}
                onChange={handleChange}
                placeholder="ui.ac.id"
              />
              <p className="text-xs text-muted-foreground">
                Isi tanpa http:// atau https://
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">URL Logo</Label>
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                  {formData.logo ? (
                    <div
                      style={{
                        backgroundImage: `url(${formData.logo})`,
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        width: "100%",
                        height: "100%",
                      }}
                      role="img"
                      aria-label="Logo preview"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <Input
                  id="logo"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                  className="flex-grow"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Masukkan URL lengkap gambar logo universitas. Disarankan ukuran
                200x200 piksel.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                placeholder="Deskripsi tentang universitas ini..."
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <span className="text-destructive">*</span> menandakan kolom
                wajib diisi
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/admin/universities")}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Simpan Universitas
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
