// src/app/register/page.tsx
"use client";

import Link from "next/link";
import { Briefcase, GraduationCap, Building, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/main-layout";
import { PATHS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] px-4">
        <div className="w-full max-w-3xl">
          {/* Logo and Title */}
          <div className="flex flex-col items-center mb-10">
            <Link href={PATHS.HOME} className="flex items-center gap-2 mb-4">
              <Briefcase className="h-8 w-8 text-primary animate-neon-pulse" />
              <span className="font-bold text-2xl">Atlas Recruit</span>
            </Link>
            <h1 className="text-3xl font-bold text-center">Pilih Jenis Akun</h1>
            <p className="text-muted-foreground text-center mt-1 max-w-md">
              Daftar sesuai dengan kebutuhan Anda untuk mendapatkan pengalaman
              terbaik
            </p>
          </div>

          {/* Account Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Account */}
            <Link
              href={PATHS.REGISTER_STUDENT}
              className={cn(
                "group relative flex flex-col items-center p-6 rounded-lg border-2 border-border",
                "transition-all duration-300 hover:border-primary/50 hover:bg-primary/5",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              )}
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Mahasiswa</h2>
              <p className="text-center text-muted-foreground mb-4">
                Untuk mahasiswa atau lulusan universitas yang ingin mencari
                pekerjaan
              </p>
              <Button
                variant="outline"
                className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                Daftar Sebagai Mahasiswa <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <div className="absolute inset-0 border-2 border-transparent rounded-lg transition-all duration-300 group-hover:border-primary/20 group-hover:shadow-[0_0_15px_rgba(0,255,65,0.2)] pointer-events-none"></div>
            </Link>

            {/* Company Account */}
            <Link
              href={PATHS.REGISTER_COMPANY}
              className={cn(
                "group relative flex flex-col items-center p-6 rounded-lg border-2 border-border",
                "transition-all duration-300 hover:border-primary/50 hover:bg-primary/5",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              )}
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Perusahaan</h2>
              <p className="text-center text-muted-foreground mb-4">
                Untuk perusahaan yang ingin merekrut talenta dari universitas
                terbaik
              </p>
              <Button
                variant="outline"
                className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                Daftar Sebagai Perusahaan{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <div className="absolute inset-0 border-2 border-transparent rounded-lg transition-all duration-300 group-hover:border-primary/20 group-hover:shadow-[0_0_15px_rgba(0,255,65,0.2)] pointer-events-none"></div>
            </Link>
          </div>

          {/* Login Link */}
          <div className="mt-8 text-center">
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
