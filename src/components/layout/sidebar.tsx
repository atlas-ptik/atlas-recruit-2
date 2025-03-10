// src/components/layout/sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import {
  User,
  FileText,
  Briefcase,
  Building,
  BookOpen,
  Settings,
  PieChart,
  Code,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useApi } from "@/contexts/ApiContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarItem {
  title: string;
  href: string;
  icon: LucideIcon;
  submenu?: SidebarItem[];
  role?: "mahasiswa" | "perusahaan" | "admin";
}

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useApi();
  const [collapsed, setCollapsed] = useState(false);
  // Deteksi viewport
  useEffect(() => {
    const checkIsMobile = () => {
      setCollapsed(window.innerWidth < 1024);
    };
    
    // Cek saat mount
    checkIsMobile();
    
    // Cek saat resize
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Mendapatkan navigasi berdasarkan role pengguna
  const getSidebarItems = (): SidebarItem[] => {
    // Navigasi untuk mahasiswa
    if (user?.peran === "mahasiswa") {
      return [
        {
          title: "Dashboard",
          href: "/dashboard/student",
          icon: PieChart,
          role: "mahasiswa",
        },
        {
          title: "Lamaran Saya",
          href: "/dashboard/student/applications",
          icon: FileText,
          role: "mahasiswa",
        },
        {
          title: "Lowongan Tersimpan",
          href: "/dashboard/student/saved-jobs",
          icon: Briefcase,
          role: "mahasiswa",
        },
        {
          title: "Profil",
          href: "/dashboard/student/profile",
          icon: User,
          role: "mahasiswa",
        },
        {
          title: "Pengaturan",
          href: "/dashboard/student/settings",
          icon: Settings,
          role: "mahasiswa",
        },
      ];
    }
    
    // Navigasi untuk perusahaan
    if (user?.peran === "perusahaan") {
      return [
        {
          title: "Dashboard",
          href: "/dashboard/company",
          icon: PieChart,
          role: "perusahaan",
        },
        {
          title: "Kelola Lowongan",
          href: "/dashboard/company/jobs",
          icon: Briefcase,
          role: "perusahaan",
        },
        {
          title: "Lamaran Masuk",
          href: "/dashboard/company/applications",
          icon: FileText,
          role: "perusahaan",
        },
        {
          title: "Profil Perusahaan",
          href: "/dashboard/company/profile",
          icon: Building,
          role: "perusahaan",
        },
        {
          title: "Pengaturan",
          href: "/dashboard/company/settings",
          icon: Settings,
          role: "perusahaan",
        },
      ];
    }
    
    // Navigasi untuk admin
    if (user?.peran === "admin") {
      return [
        {
          title: "Dashboard",
          href: "/dashboard/admin",
          icon: PieChart,
          role: "admin",
        },
        {
          title: "Kelola Pengguna",
          href: "/dashboard/admin/users",
          icon: Users,
          role: "admin",
        },
        {
          title: "Kelola Perusahaan",
          href: "/dashboard/admin/companies",
          icon: Building,
          role: "admin",
        },
        {
          title: "Kelola Universitas",
          href: "/dashboard/admin/universities",
          icon: BookOpen,
          role: "admin",
        },
        {
          title: "Kelola Keahlian",
          href: "/dashboard/admin/skills",
          icon: Code,
          role: "admin",
        },
        {
          title: "Pengaturan",
          href: "/dashboard/admin/settings",
          icon: Settings,
          role: "admin",
        },
      ];
    }
    
    // Default untuk jika tidak ada role yang cocok
    return [];
  };

  const sidebarItems = getSidebarItems();

  // Tidak menampilkan sidebar jika tidak ada role yang cocok atau tidak ada navigasi
  if (!user || sidebarItems.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative h-screen border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-end p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            <span className="sr-only">
              {collapsed ? "Expand sidebar" : "Collapse sidebar"}
            </span>
          </Button>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="grid gap-1 px-2">
            {sidebarItems.map((item, index) => (
              <SidebarNavItem
                key={index}
                item={item}
                pathname={pathname}
                collapsed={collapsed}
              />
            ))}
          </nav>
        </ScrollArea>
      </div>
    </div>
  );
}

// Komponen untuk menampilkan item navigasi
function SidebarNavItem({
  item,
  pathname,
  collapsed,
}: {
  item: SidebarItem;
  pathname: string;
  collapsed: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  if (item.submenu) {
    return (
      <div className={cn("mb-2", collapsed && "relative")}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium",
            isActive
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          )}
        >
          <div className="flex items-center">
            <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
            {!collapsed && <span className="ml-3">{item.title}</span>}
          </div>
          {!collapsed && (
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                isOpen && "rotate-90"
              )}
            />
          )}
        </button>
        {(isOpen || (collapsed && isActive)) && (
          <div
            className={cn(
              "mt-1 space-y-1",
              collapsed && "absolute left-full top-0 z-10 ml-2 w-48 rounded-md border bg-popover p-1 shadow-md"
            )}
          >
            {item.submenu.map((subItem, idx) => (
              <SidebarNavItem
                key={idx}
                item={subItem}
                pathname={pathname}
                collapsed={false}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary neon-glow"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      )}
    >
      <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
      {!collapsed && <span className="ml-3">{item.title}</span>}
    </Link>
  );
}