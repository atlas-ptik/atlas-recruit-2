// src/components/layout/footer.tsx
import Link from "next/link";
import {
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">{APP_NAME}</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Platform rekrutmen yang menghubungkan perusahaan dengan lulusan
              universitas terbaik di Indonesia.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Navigasi Cepat</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Lowongan
                </Link>
              </li>
              <li>
                <Link
                  href="/companies"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Perusahaan
                </Link>
              </li>
              <li>
                <Link
                  href="/universities"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Universitas
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* For Companies */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Untuk Perusahaan</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/register-company"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Daftar Perusahaan
                </Link>
              </li>
              <li>
                <Link
                  href="/post-job"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Pasang Lowongan
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Harga & Paket
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Sumber Daya
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Kontak Kami</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-muted-foreground">
                  Jl. Gedung Tinggi No. 123
                  <br />
                  Jakarta Selatan, 12345
                  <br />
                  Indonesia
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2" />
                <span className="text-muted-foreground">(021) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2" />
                <span className="text-muted-foreground">
                  info@atlasrecruit.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground order-2 md:order-1 mt-4 md:mt-0">
              &copy; {new Date().getFullYear()} {APP_NAME}. Hak Cipta
              Dilindungi.
            </p>
            <div className="flex space-x-6 order-1 md:order-2">
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Syarat & Ketentuan
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Kebijakan Privasi
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Kebijakan Cookie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
