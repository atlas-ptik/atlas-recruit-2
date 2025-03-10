// src/app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/main-layout";
import { PATHS } from "@/lib/constants";
import { ArrowRight, Search, Briefcase, Users, Award } from "lucide-react";

export default function HomePage() {
  return (
    <MainLayout fullWidth>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 bg-background">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0D0D0D_1px,transparent_1px),linear-gradient(to_bottom,#0D0D0D_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[60%] w-[100%] translate-y-0 rounded-full bg-primary/10 opacity-50 blur-[100px]" />
        </div>

        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 neon-glow">
              Temukan Karir <span className="text-primary">Impianmu</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl">
              Menghubungkan talenta terbaik dari universitas dengan perusahaan
              terkemuka di Indonesia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Button
                size="lg"
                asChild
                className="bg-primary z-10 text-primary-foreground hover:bg-primary/90 flex-1"
              >
                <Link href={PATHS.JOBS}>Telusuri Lowongan</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="z-10 flex-1">
                <Link href={PATHS.REGISTER}>Daftar Sekarang</Link>
              </Button>
            </div>

            <div className="relative w-full max-w-3xl mt-8 p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-primary/20 shadow-lg neon-box">
              <div className="flex flex-col md:flex-row items-stretch gap-3">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Posisi, keahlian, atau perusahaan"
                    className="w-full bg-background h-12 pl-10 pr-4 rounded-md border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div className="relative flex-grow md:max-w-[180px]">
                  <select className="w-full bg-background h-12 px-4 rounded-md border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none">
                    <option value="">Semua Lokasi</option>
                    <option value="jakarta">Jakarta</option>
                    <option value="bandung">Bandung</option>
                    <option value="surabaya">Surabaya</option>
                    <option value="yogyakarta">Yogyakarta</option>
                  </select>
                </div>
                <Button size="lg" className="h-12 min-w-[100px]">
                  Cari
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Fitur Unggulan
            </h2>
            <p className="text-muted-foreground md:text-xl max-w-3xl">
              Platform rekrutmen terdepan dengan fitur lengkap untuk memudahkan
              pencarian karir dan rekrutmen talenta
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-card/50 rounded-lg border border-border">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Briefcase className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold">Lowongan Berkualitas</h3>
              <p className="text-muted-foreground">
                Akses ke ribuan lowongan berkualitas dari perusahaan terkemuka
                di berbagai industri
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-card/50 rounded-lg border border-border">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Users className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold">Rekrutmen Terfokus</h3>
              <p className="text-muted-foreground">
                Perusahaan dapat menemukan kandidat terbaik dari universitas
                terkemuka sesuai kriteria spesifik
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-card/50 rounded-lg border border-border">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Award className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold">Talenta Terverifikasi</h3>
              <p className="text-muted-foreground">
                Profil lengkap dan terverifikasi dari lulusan universitas dengan
                keahlian beragam
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute -inset-1 bg-[linear-gradient(45deg,transparent_25%,#00FF41_50%,transparent_75%)] opacity-20 blur-2xl" />

        <div className="container relative px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Siap Untuk Memulai?
            </h2>
            <p className="text-muted-foreground md:text-xl">
              Buat akun sekarang dan temukan peluang karir terbaik atau talenta
              potensial untuk perusahaan Anda.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button
                size="lg"
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link href={PATHS.REGISTER_STUDENT}>
                  Daftar Sebagai Mahasiswa
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={PATHS.REGISTER_COMPANY}>
                  Daftar Sebagai Perusahaan
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
