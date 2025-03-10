// src/app/layout.tsx
import { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Providers
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ApiProvider } from "@/contexts/ApiContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { ToastContainer } from "@/components/toast/toast";
import { APP_NAME } from "@/lib/constants";

// Fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata
export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "Platform rekrutmen yang menghubungkan perusahaan dengan lulusan universitas terbaik",
  keywords: [
    "rekrutmen",
    "lowongan",
    "pekerjaan",
    "karir",
    "mahasiswa",
    "perusahaan",
    "universitas",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ApiProvider>
            <ToastProvider>
              {children}
              <ToastContainer />
            </ToastProvider>
          </ApiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
