// src/app/register/student/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  MailIcon,
  LockIcon,
  UserIcon,
  School,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MainLayout } from "@/components/layout/main-layout";
import { useApi } from "@/contexts/ApiContext";
import { PATHS } from "@/lib/constants";
import { University } from "@/lib/api/universityService";

export default function RegisterStudentPage() {
  const { registerStudent, isLoading, services } = useApi();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    kata_sandi: "",
    konfirmasi_kata_sandi: "",
    nama_depan: "",
    nama_belakang: "",
    universitas_id: "",
  });

  // Universities list
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(true);
  const [universityError, setUniversityError] = useState("");

  // Error handling
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Load universities on component mount
  useEffect(() => {
    const fetchUniversities = async () => {
      setIsLoadingUniversities(true);
      try {
        const response = await services.university.getUniversities({
          per_halaman: 100, // Get a large number to avoid pagination
        });
        setUniversities(response.universitas);
        setUniversityError("");
      } catch (err) {
        console.error("Failed to fetch universities:", err);
        setUniversityError(
          "Gagal memuat daftar universitas. Silakan refresh halaman."
        );
      } finally {
        setIsLoadingUniversities(false);
      }
    };

    fetchUniversities();
  }, [services.university]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle university select change
  const handleUniversityChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      universitas_id: value,
    }));

    // Clear field error
    if (fieldErrors.universitas_id) {
      setFieldErrors((prev) => ({
        ...prev,
        universitas_id: "",
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newFieldErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newFieldErrors.email = "Email harus diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newFieldErrors.email = "Email tidak valid";
    }

    // Password validation
    if (!formData.kata_sandi) {
      newFieldErrors.kata_sandi = "Kata sandi harus diisi";
    } else if (formData.kata_sandi.length < 8) {
      newFieldErrors.kata_sandi = "Kata sandi minimal 8 karakter";
    }

    // Password confirmation
    if (formData.kata_sandi !== formData.konfirmasi_kata_sandi) {
      newFieldErrors.konfirmasi_kata_sandi = "Konfirmasi kata sandi tidak sama";
    }

    // Name validation
    if (!formData.nama_depan) {
      newFieldErrors.nama_depan = "Nama depan harus diisi";
    }

    if (!formData.nama_belakang) {
      newFieldErrors.nama_belakang = "Nama belakang harus diisi";
    }

    // University validation
    if (!formData.universitas_id) {
      newFieldErrors.universitas_id = "Universitas harus dipilih";
    }

    setFieldErrors(newFieldErrors);
    return Object.keys(newFieldErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Create registration data
    const registrationData = {
      email: formData.email,
      kata_sandi: formData.kata_sandi,
      nama_depan: formData.nama_depan,
      nama_belakang: formData.nama_belakang,
      universitas_id: formData.universitas_id,
    };

    try {
      await registerStudent(registrationData);
      // Redirect is handled in the context
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mendaftar. Silakan coba lagi."
      );
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="flex flex-col items-center mb-8">
            <Link href={PATHS.HOME} className="flex items-center gap-2 mb-4">
              <Briefcase className="h-8 w-8 text-primary animate-neon-pulse" />
              <span className="font-bold text-2xl">Atlas Recruit</span>
            </Link>
            <h1 className="text-2xl font-bold text-center">
              Daftar Akun Mahasiswa
            </h1>
            <p className="text-muted-foreground text-center mt-1">
              Bergabunglah dengan ribuan mahasiswa dan temukan peluang karir
            </p>
          </div>

          {/* Back to Registration Choice */}
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link
                href={PATHS.REGISTER}
                className="flex items-center text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Kembali ke pilihan akun
              </Link>
            </Button>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="mb-6 bg-destructive/10 text-destructive border-destructive/20">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* University Load Error */}
          {universityError && (
            <Alert className="mb-6 bg-amber-500/10 text-amber-500 border-amber-500/20">
              <AlertDescription>{universityError}</AlertDescription>
            </Alert>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="contoh@email.com"
                  className={`pl-10 ${
                    fieldErrors.email ? "border-destructive" : ""
                  }`}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-sm text-destructive">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="kata_sandi">
                Kata Sandi <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="kata_sandi"
                  name="kata_sandi"
                  type="password"
                  placeholder="Minimal 8 karakter"
                  className={`pl-10 ${
                    fieldErrors.kata_sandi ? "border-destructive" : ""
                  }`}
                  value={formData.kata_sandi}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              {fieldErrors.kata_sandi && (
                <p className="text-sm text-destructive">
                  {fieldErrors.kata_sandi}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="konfirmasi_kata_sandi">
                Konfirmasi Kata Sandi{" "}
                <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="konfirmasi_kata_sandi"
                  name="konfirmasi_kata_sandi"
                  type="password"
                  placeholder="Konfirmasi kata sandi"
                  className={`pl-10 ${
                    fieldErrors.konfirmasi_kata_sandi
                      ? "border-destructive"
                      : ""
                  }`}
                  value={formData.konfirmasi_kata_sandi}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              {fieldErrors.konfirmasi_kata_sandi && (
                <p className="text-sm text-destructive">
                  {fieldErrors.konfirmasi_kata_sandi}
                </p>
              )}
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="nama_depan">
                Nama Depan <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="nama_depan"
                  name="nama_depan"
                  type="text"
                  placeholder="Nama depan"
                  className={`pl-10 ${
                    fieldErrors.nama_depan ? "border-destructive" : ""
                  }`}
                  value={formData.nama_depan}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              {fieldErrors.nama_depan && (
                <p className="text-sm text-destructive">
                  {fieldErrors.nama_depan}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="nama_belakang">
                Nama Belakang <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="nama_belakang"
                  name="nama_belakang"
                  type="text"
                  placeholder="Nama belakang"
                  className={`pl-10 ${
                    fieldErrors.nama_belakang ? "border-destructive" : ""
                  }`}
                  value={formData.nama_belakang}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              {fieldErrors.nama_belakang && (
                <p className="text-sm text-destructive">
                  {fieldErrors.nama_belakang}
                </p>
              )}
            </div>

            {/* University Selection */}
            <div className="space-y-2">
              <Label htmlFor="universitas">
                Universitas <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Select
                  value={formData.universitas_id}
                  onValueChange={handleUniversityChange}
                  disabled={isLoading || isLoadingUniversities}
                >
                  <SelectTrigger
                    className={`${
                      fieldErrors.universitas_id ? "border-destructive" : ""
                    }`}
                    id="universitas"
                  >
                    <div className="flex items-center">
                      <School className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Pilih universitas" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingUniversities ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Memuat...</span>
                      </div>
                    ) : universities.length > 0 ? (
                      universities.map((university) => (
                        <SelectItem key={university.id} value={university.id}>
                          {university.nama}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-muted-foreground">
                        Tidak ada data universitas
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
              {fieldErrors.universitas_id && (
                <p className="text-sm text-destructive">
                  {fieldErrors.universitas_id}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Daftar"
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Sudah memiliki akun?{" "}
              <Link href={PATHS.LOGIN} className="text-primary hover:underline">
                Masuk Sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
