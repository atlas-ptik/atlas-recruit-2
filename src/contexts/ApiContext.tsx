// src/contexts/ApiContext.tsx - Context for managing authentication state and API access
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import authService, {
  UserProfile,
  RegisterMahasiswaRequest,
  RegisterPerusahaanRequest,
} from "@/lib/api/authService";
import jobService from "@/lib/api/jobService";
import applicationService from "@/lib/api/applicationService";
import skillService from "@/lib/api/skillService";
import universityService from "@/lib/api/universityService";

// Define the context type
interface ApiContextType {
  // Auth state
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  registerStudent: (formData: RegisterMahasiswaRequest) => Promise<void>;
  registerCompany: (formData: RegisterPerusahaanRequest) => Promise<void>;

  // Services
  services: {
    auth: typeof authService;
    job: typeof jobService;
    application: typeof applicationService;
    skill: typeof skillService;
    university: typeof universityService;
  };
}

// Create the context
const ApiContext = createContext<ApiContextType | undefined>(undefined);

// Provider component
export function ApiProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const loadUser = (): void => {
      const profile = authService.getUserProfile();
      setUser(profile);
      setIsLoading(false);
    };

    loadUser();
  }, []);

  // Login method
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const profile = await authService.login({ email, kata_sandi: password });
      setUser(profile);

      // Redirect based on user role
      switch (profile.peran) {
        case "mahasiswa":
          router.push("/dashboard/student");
          break;
        case "perusahaan":
          router.push("/dashboard/company");
          break;
        case "admin":
          router.push("/dashboard/admin");
          break;
        default:
          router.push("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Logout method
  const logout = (): void => {
    authService.logout();
    setUser(null);
    router.push("/login");
  };

  // Register student
  const registerStudent = async (
    formData: RegisterMahasiswaRequest
  ): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.registerMahasiswa(formData);
      router.push("/login?registered=student");
    } finally {
      setIsLoading(false);
    }
  };

  // Register company
  const registerCompany = async (
    formData: RegisterPerusahaanRequest
  ): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.registerPerusahaan(formData);
      router.push("/login?registered=company");
    } finally {
      setIsLoading(false);
    }
  };

  // Authentication check for protected routes
  useEffect(() => {
    if (!isLoading && !user) {
      const publicRoutes = [
        "/login",
        "/register",
        "/register/student",
        "/register/company",
        "/",
      ];
      const isPublicRoute = publicRoutes.some(
        (route) => pathname === route || pathname?.startsWith("/jobs")
      );

      if (!isPublicRoute) {
        router.push("/login");
      }
    }
  }, [user, isLoading, pathname, router]);

  // Context value
  const value: ApiContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    registerStudent,
    registerCompany,
    services: {
      auth: authService,
      job: jobService,
      application: applicationService,
      skill: skillService,
      university: universityService,
    },
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

// Custom hook for using the API context
export function useApi(): ApiContextType {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
}
