// src/components/layout/dashboard-layout.tsx
"use client";

import { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";
import { useApi } from "@/contexts/ApiContext";
import { Loader2 } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isLoading, isAuthenticated } = useApi();

  // Menampilkan loading spinner saat cek autentikasi
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Jika tidak terautentikasi, komponen ApiContext akan mengarahkan ke halaman login
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 p-4 md:p-6">{children}</main>

        <Footer />
      </div>
    </div>
  );
}
