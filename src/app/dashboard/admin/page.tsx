// src/app/dashboard/admin/page.tsx - Halaman dashboard admin
"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UsersIcon,
  Building,
  BookOpen,
  Code,
  UserCheck,
  FileText,
  Briefcase,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useApi } from "@/contexts/ApiContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Types
interface StatCard {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  linkHref?: string;
  linkText?: string;
}

export default function AdminDashboardPage() {
  const { services } = useApi();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    universities: 0,
    skills: 0,
    companies: 0,
    students: 0,
    pendingCompanies: 0,
    activeJobs: 0,
    applications: 0,
  });

  useEffect(() => {
    // Simulate loading of stats
    const loadStats = async () => {
      // In a real implementation, you would fetch actual data:
      // const universities = await services.university.getUniversities();
      // const skills = await services.skill.getSkills();
      // etc.

      // For demo purposes, using dummy data
      setTimeout(() => {
        setStats({
          universities: 25,
          skills: 127,
          companies: 84,
          students: 1235,
          pendingCompanies: 7,
          activeJobs: 156,
          applications: 645,
        });
        setIsLoading(false);
      }, 1000);
    };

    loadStats();
  }, [services]);

  const statCards: StatCard[] = [
    {
      title: "Total Universitas",
      value: stats.universities,
      icon: BookOpen,
      description: "Universitas terdaftar",
      change: "+3 bulan ini",
      trend: "up",
      linkHref: "/dashboard/admin/universities",
      linkText: "Kelola Universitas",
    },
    {
      title: "Total Keahlian",
      value: stats.skills,
      icon: Code,
      description: "Keahlian terdaftar",
      change: "+12 bulan ini",
      trend: "up",
      linkHref: "/dashboard/admin/skills",
      linkText: "Kelola Keahlian",
    },
    {
      title: "Total Perusahaan",
      value: stats.companies,
      icon: Building,
      description: "Perusahaan terdaftar",
      change: "+5 bulan ini",
      trend: "up",
      linkHref: "/dashboard/admin/companies",
      linkText: "Kelola Perusahaan",
    },
    {
      title: "Total Mahasiswa",
      value: stats.students,
      icon: UsersIcon,
      description: "Mahasiswa terdaftar",
      change: "+127 bulan ini",
      trend: "up",
      linkHref: "/dashboard/admin/users?role=mahasiswa",
      linkText: "Lihat Mahasiswa",
    },
    {
      title: "Perusahaan Menunggu",
      value: stats.pendingCompanies,
      icon: AlertCircle,
      description: "Perlu verifikasi",
      trend: "neutral",
      linkHref: "/dashboard/admin/companies?status=pending",
      linkText: "Verifikasi Sekarang",
    },
    {
      title: "Lowongan Aktif",
      value: stats.activeJobs,
      icon: Briefcase,
      description: "Semua lowongan",
      change: "+18 minggu ini",
      trend: "up",
      linkHref: "/dashboard/admin/jobs",
      linkText: "Lihat Lowongan",
    },
    {
      title: "Lamaran Aktif",
      value: stats.applications,
      icon: FileText,
      description: "Semua lamaran",
      change: "+86 minggu ini",
      trend: "up",
      linkHref: "/dashboard/admin/applications",
      linkText: "Lihat Lamaran",
    },
    {
      title: "Pengguna Aktif",
      value: `${stats.companies + stats.students}`,
      icon: UserCheck,
      description: "Total pengguna",
      change: "+132 bulan ini",
      trend: "up",
      linkHref: "/dashboard/admin/users",
      linkText: "Kelola Pengguna",
    },
  ];

  const renderStatCard = (stat: StatCard, index: number) => {
    const Icon = stat.icon;
    return (
      <Card key={index} className="hover:border-primary/50 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div className="text-2xl font-bold">
              {typeof stat.value === "number"
                ? stat.value.toLocaleString("id-ID")
                : stat.value}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {stat.description}
            {stat.change && (
              <Badge
                className={`ml-2 ${
                  stat.trend === "up"
                    ? "bg-green-500/20 text-green-500"
                    : stat.trend === "down"
                    ? "bg-red-500/20 text-red-500"
                    : "bg-yellow-500/20 text-yellow-500"
                }`}
                variant="outline"
              >
                {stat.trend === "up" && <TrendingUp className="h-3 w-3 mr-1" />}
                {stat.change}
              </Badge>
            )}
          </p>
          {stat.linkHref && (
            <Button
              variant="link"
              className="p-0 h-auto mt-2 text-xs font-normal"
              asChild
            >
              <Link href={stat.linkHref}>{stat.linkText}</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">Ringkasan Platform</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.slice(0, 4).map(renderStatCard)}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Aktivitas & Perhatian</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.slice(4).map(renderStatCard)}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
