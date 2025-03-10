// src/components/layout/header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User, LogOut, Search, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useApi } from "@/contexts/ApiContext";
import { APP_NAME, PATHS } from "@/lib/constants";
import { UserProfile } from "@/lib/api/authService";

export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useApi();
  const [isScrolled, setIsScrolled] = useState(false);

  // Deteksi scroll untuk mengubah tampilan header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigasi utama berdasarkan role
  const getNavItems = () => {
    const commonItems = [{ label: "Lowongan", href: PATHS.JOBS }];

    if (!isAuthenticated) {
      return commonItems;
    }

    if (user?.peran === "mahasiswa") {
      return [
        ...commonItems,
        { label: "Dashboard", href: PATHS.DASHBOARD_STUDENT },
        {
          label: "Lamaran Saya",
          href: `${PATHS.DASHBOARD_STUDENT}/applications`,
        },
      ];
    }

    if (user?.peran === "perusahaan") {
      return [
        ...commonItems,
        { label: "Dashboard", href: PATHS.DASHBOARD_COMPANY },
        { label: "Kelola Lowongan", href: `${PATHS.DASHBOARD_COMPANY}/jobs` },
        {
          label: "Kelola Lamaran",
          href: `${PATHS.DASHBOARD_COMPANY}/applications`,
        },
      ];
    }

    if (user?.peran === "admin") {
      return [
        ...commonItems,
        { label: "Dashboard", href: PATHS.DASHBOARD_ADMIN },
        {
          label: "Kelola Universitas",
          href: `${PATHS.DASHBOARD_ADMIN}/universities`,
        },
        { label: "Kelola Keahlian", href: `${PATHS.DASHBOARD_ADMIN}/skills` },
      ];
    }

    return commonItems;
  };

  const navItems = getNavItems();

  // Helper function to get user display name
  const getUserDisplayName = (user: UserProfile | null) => {
    if (!user) return "";

    if (user.peran === "mahasiswa") {
      const studentDetail = user.detail as Record<
        string,
        string | number | object
      >;
      return `${studentDetail.nama_depan || ""} ${
        studentDetail.nama_belakang || ""
      }`;
    } else if (user.peran === "perusahaan") {
      const companyDetail = user.detail as Record<
        string,
        string | number | object
      >;
      return (companyDetail.nama as string) || "";
    } else {
      const adminDetail = user.detail as Record<
        string,
        string | number | object
      >;
      return `${(adminDetail.nama_depan as string) || ""} ${
        (adminDetail.nama_belakang as string) || ""
      }`;
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-sm border-b shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        {/* Logo */}
        <Link href={PATHS.HOME} className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary animate-pulse-neon" />
          <span className="font-bold text-xl neon-glow">{APP_NAME}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href ? "text-primary" : "text-foreground/70"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-4">
          {/* Search */}
          <div className="relative w-60">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari lowongan..."
              className="pl-8 bg-background"
            />
          </div>

          {/* Authentication */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href={PATHS.LOGIN}>Masuk</Link>
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <Link href={PATHS.REGISTER}>Daftar</Link>
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {getUserDisplayName(user)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={
                      user?.peran === "mahasiswa"
                        ? `${PATHS.DASHBOARD_STUDENT}/profile`
                        : user?.peran === "perusahaan"
                        ? `${PATHS.DASHBOARD_COMPANY}/profile`
                        : `${PATHS.DASHBOARD_ADMIN}/profile`
                    }
                  >
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={
                      user?.peran === "mahasiswa"
                        ? PATHS.DASHBOARD_STUDENT
                        : user?.peran === "perusahaan"
                        ? PATHS.DASHBOARD_COMPANY
                        : PATHS.DASHBOARD_ADMIN
                    }
                  >
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <div className="flex items-center gap-2 mb-8">
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">{APP_NAME}</span>
            </div>

            <div className="relative w-full mb-8">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari lowongan..."
                className="pl-8 bg-background w-full"
              />
            </div>

            <nav className="flex flex-col gap-4">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`text-base font-medium transition-colors hover:text-primary ${
                    pathname === item.href
                      ? "text-primary"
                      : "text-foreground/70"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-4 border-t">
              {!isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <Button variant="outline" asChild className="w-full">
                    <Link href={PATHS.LOGIN}>Masuk</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href={PATHS.REGISTER}>Daftar</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {getUserDisplayName(user)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    asChild
                    className="w-full justify-start"
                  >
                    <Link
                      href={
                        user?.peran === "mahasiswa"
                          ? `${PATHS.DASHBOARD_STUDENT}/profile`
                          : user?.peran === "perusahaan"
                          ? `${PATHS.DASHBOARD_COMPANY}/profile`
                          : `${PATHS.DASHBOARD_ADMIN}/profile`
                      }
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={logout}
                    className="w-full justify-start"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Keluar
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
