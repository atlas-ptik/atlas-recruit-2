// src/components/layout/main-layout.tsx
import { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

interface MainLayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
}

export function MainLayout({ children, fullWidth = false }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {fullWidth ? (
          children
        ) : (
          <div className="container px-4 md:px-6 py-6 md:py-8">{children}</div>
        )}
      </main>

      <Footer />
    </div>
  );
}
