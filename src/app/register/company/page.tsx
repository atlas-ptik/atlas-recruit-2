// src/app/register/company/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  MailIcon,
  LockIcon,
  Building,
  Tag,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MainLayout } from "@/components/layout/main-layout";
import { useApi } from "@/contexts/ApiContext";
import { PATHS } from "@/lib/constants";

export default function RegisterCompanyPage() {
  const { registerCompany, isLoading } = useApi();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    kata_sandi: "",
    konfirmasi_kata_sandi: "",
    nama: "",
    industri: "",
  });

  // Error handling
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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

    // Company name validation
    if (!formData.nama) {
      newFieldErrors.nama = "Nama perusahaan harus diisi";
    }

    // Industry validation
    if (!formData.industri) {
      newFieldErrors.industri = "Industri harus diisi";
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
      nama: formData.nama,
      industri: formData.industri,
    };

    try {
      await registerCompany(registrationData);
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
              Daftar Akun Perusahaan
            </h1>
            <p className="text-muted-foreground text-center mt-1">
              Rekrut talenta terbaik dari universitas terkemuka di Indonesia
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

          {/* Notice Alert */}
          <Alert className="mb-6 bg-primary/10 text-primary border-primary/20">
            <AlertDescription>
              Akun perusahaan akan diverifikasi oleh admin sebelum dapat
              digunakan. Kami akan mengirimkan notifikasi melalui email setelah
              akun diaktifkan.
            </AlertDescription>
          </Alert>

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
                  placeholder="perusahaan@example.com"
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

            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="nama">
                Nama Perusahaan <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="nama"
                  name="nama"
                  type="text"
                  placeholder="PT Example Indonesia"
                  className={`pl-10 ${
                    fieldErrors.nama ? "border-destructive" : ""
                  }`}
                  value={formData.nama}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              {fieldErrors.nama && (
                <p className="text-sm text-destructive">{fieldErrors.nama}</p>
              )}
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <Label htmlFor="industri">
                Industri <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="industri"
                  name="industri"
                  type="text"
                  placeholder="Teknologi, Keuangan, dll."
                  className={`pl-10 ${
                    fieldErrors.industri ? "border-destructive" : ""
                  }`}
                  value={formData.industri}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              {fieldErrors.industri && (
                <p className="text-sm text-destructive">
                  {fieldErrors.industri}
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
