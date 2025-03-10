// src/lib/constants.ts
export const COLORS = {
  // Pallete warna neon hijau
  primary: {
    DEFAULT: "#00FF41", // Neon green
    light: "#7CFFCB",
    dark: "#00CC33",
    foreground: "#000000",
  },
  secondary: {
    DEFAULT: "#39FF14", // Bright neon green
    light: "#88FF88",
    dark: "#00DD00",
    foreground: "#000000",
  },
  accent: {
    DEFAULT: "#0FFF50", // Spring green
    light: "#AFFFBA",
    dark: "#00EE40",
    foreground: "#000000",
  },
  background: {
    DEFAULT: "#0D0D0D", // Near black
    paper: "#1A1A1A",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#AAAAAA",
    disabled: "#666666",
  },
  border: {
    DEFAULT: "#333333",
    light: "#444444",
  },
};

// Struktur path yang sesuai dengan routing Next.js
export const PATHS = {
  // Halaman publik
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  REGISTER_STUDENT: "/register/student",
  REGISTER_COMPANY: "/register/company",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // Job listings publik
  JOBS: "/jobs",
  JOB_DETAILS: (id: string) => `/jobs/${id}`,

  // Companies dan Universities publik
  COMPANIES: "/companies",
  COMPANY_DETAILS: (id: string) => `/companies/${id}`,
  UNIVERSITIES: "/universities",
  UNIVERSITY_DETAILS: (id: string) => `/universities/${id}`,

  // Dashboard routes
  DASHBOARD: {
    // Student dashboard routes
    STUDENT: {
      INDEX: "/dashboard/student",
      APPLICATIONS: "/dashboard/student/applications",
      APPLICATION_DETAILS: (id: string) =>
        `/dashboard/student/applications/${id}`,
      SAVED_JOBS: "/dashboard/student/saved-jobs",
      PROFILE: "/dashboard/student/profile",
      SETTINGS: "/dashboard/student/settings",
    },

    // Company dashboard routes
    COMPANY: {
      INDEX: "/dashboard/company",
      JOBS: {
        INDEX: "/dashboard/company/jobs",
        CREATE: "/dashboard/company/jobs/create",
        EDIT: (id: string) => `/dashboard/company/jobs/${id}/edit`,
        DETAILS: (id: string) => `/dashboard/company/jobs/${id}`,
      },
      APPLICATIONS: {
        INDEX: "/dashboard/company/applications",
        DETAILS: (id: string) => `/dashboard/company/applications/${id}`,
      },
      PROFILE: "/dashboard/company/profile",
      SETTINGS: "/dashboard/company/settings",
    },

    // Admin dashboard routes
    ADMIN: {
      INDEX: "/dashboard/admin",
      USERS: {
        INDEX: "/dashboard/admin/users",
        DETAILS: (id: string) => `/dashboard/admin/users/${id}`,
      },
      COMPANIES: {
        INDEX: "/dashboard/admin/companies",
        DETAILS: (id: string) => `/dashboard/admin/companies/${id}`,
      },
      UNIVERSITIES: {
        INDEX: "/dashboard/admin/universities",
        CREATE: "/dashboard/admin/universities/new",
        EDIT: (id: string) => `/dashboard/admin/universities/${id}`,
      },
      SKILLS: {
        INDEX: "/dashboard/admin/skills",
        CREATE: "/dashboard/admin/skills/new",
        EDIT: (id: string) => `/dashboard/admin/skills/${id}`,
      },
      SETTINGS: "/dashboard/admin/settings",
    },
  },

  // Untuk backward compatibility dengan kode yang sudah ada
  // Dashboard Index
  DASHBOARD_STUDENT: "/dashboard/student",
  DASHBOARD_COMPANY: "/dashboard/company",
  DASHBOARD_ADMIN: "/dashboard/admin",

  // Dashboard Student
  STUDENT_APPLICATIONS: "/dashboard/student/applications",
  STUDENT_SAVED_JOBS: "/dashboard/student/saved-jobs",
  STUDENT_PROFILE: "/dashboard/student/profile",
  STUDENT_SETTINGS: "/dashboard/student/settings",

  // Dashboard Company
  COMPANY_JOBS: "/dashboard/company/jobs",
  COMPANY_JOB_CREATE: "/dashboard/company/jobs/create",
  COMPANY_JOB_EDIT: (id: string) => `/dashboard/company/jobs/${id}/edit`,
  COMPANY_APPLICATIONS: "/dashboard/company/applications",
  COMPANY_PROFILE: "/dashboard/company/profile",
  COMPANY_SETTINGS: "/dashboard/company/settings",

  // Dashboard Admin
  ADMIN_USERS: "/dashboard/admin/users",
  ADMIN_COMPANIES: "/dashboard/admin/companies",
  ADMIN_UNIVERSITIES: "/dashboard/admin/universities",
  ADMIN_SKILLS: "/dashboard/admin/skills",
  ADMIN_SETTINGS: "/dashboard/admin/settings",
};

// Job types
export const JOB_TYPES = [
  { value: "penuh-waktu", label: "Penuh Waktu" },
  { value: "paruh-waktu", label: "Paruh Waktu" },
  { value: "magang", label: "Magang" },
  { value: "kontrak", label: "Kontrak" },
  { value: "freelance", label: "Freelance" },
];

// Experience levels
export const EXPERIENCE_LEVELS = [
  { value: "pemula", label: "Pemula (0-2 tahun)" },
  { value: "menengah", label: "Menengah (2-5 tahun)" },
  { value: "senior", label: "Senior (5-10 tahun)" },
  { value: "manajerial", label: "Manajerial (8+ tahun)" },
  { value: "eksekutif", label: "Eksekutif (10+ tahun)" },
];

// Application status options
export const APPLICATION_STATUS = [
  { value: "menunggu", label: "Menunggu", color: "text-yellow-500" },
  { value: "ditinjau", label: "Ditinjau", color: "text-blue-500" },
  { value: "shortlist", label: "Shortlist", color: "text-indigo-500" },
  { value: "wawancara", label: "Wawancara", color: "text-purple-500" },
  { value: "ditawari", label: "Ditawari", color: "text-pink-500" },
  { value: "diterima", label: "Diterima", color: "text-green-500" },
  { value: "ditolak", label: "Ditolak", color: "text-red-500" },
];

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 10,
  PER_PAGE_OPTIONS: [10, 20, 50, 100],
};

export const APP_NAME = "Atlas Recruit";
