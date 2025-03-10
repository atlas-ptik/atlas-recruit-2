// src/app/login/page.tsx
"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Briefcase, MailIcon, LockIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MainLayout } from "@/components/layout/main-layout";
import { useApi } from "@/contexts/ApiContext";
import { PATHS } from "@/lib/constants";

// Component that uses useSearchParams safely
function LoginForm() {
  const { login, isLoading } = useApi();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle registration success message
  const getRegistrationMessage = () => {
    if (registered === "student") {
      return "Pendaftaran mahasiswa berhasil. Silakan login dengan akun baru Anda.";
    } else if (registered === "company") {
      return "Pendaftaran perusahaan berhasil. Akun Anda akan diaktifkan setelah verifikasi admin.";
    }
    return null;
  };

  const registrationMessage = getRegistrationMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan kata sandi harus diisi");
      return;
    }

    try {
      await login(email, password);
      // Redirect handled in ApiContext
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal login. Silakan coba lagi."
      );
    }
  };

  return (
    <>
      {/* Registration Success Alert */}
      {registrationMessage && (
        <Alert className="mb-6 bg-green-500/10 text-green-500 border-green-500/20">
          <AlertDescription>{registrationMessage}</AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6 bg-destructive/10 text-destructive border-destructive/20">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <MailIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="contoh@email.com"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Kata Sandi</Label>
            <Link
              href={PATHS.FORGOT_PASSWORD}
              className="text-sm text-primary hover:underline"
            >
              Lupa Kata Sandi?
            </Link>
          </div>
          <div className="relative">
            <LockIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            "Masuk"
          )}
        </Button>
      </form>
    </>
  );
}

// Loading fallback
function LoginFormFallback() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <MailIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="contoh@email.com"
            className="pl-10"
            disabled
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Kata Sandi</Label>
          <span className="text-sm text-primary hover:underline">
            Lupa Kata Sandi?
          </span>
        </div>
        <div className="relative">
          <LockIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="pl-10"
            disabled
          />
        </div>
      </div>

      <Button className="w-full" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Memuat...
      </Button>
    </div>
  );
}

export default function LoginPage() {
  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] px-4">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="flex flex-col items-center mb-8">
            <Link href={PATHS.HOME} className="flex items-center gap-2 mb-4">
              <Briefcase className="h-8 w-8 text-primary animate-neon-pulse" />
              <span className="font-bold text-2xl">Atlas Recruit</span>
            </Link>
            <h1 className="text-2xl font-bold text-center">
              Masuk ke Akun Anda
            </h1>
            <p className="text-muted-foreground text-center mt-1">
              Masukkan email dan kata sandi untuk melanjutkan
            </p>
          </div>

          {/* Suspense boundary for the form */}
          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm />
          </Suspense>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Belum memiliki akun?{" "}
              <Link
                href={PATHS.REGISTER}
                className="text-primary hover:underline"
              >
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
