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

export const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  REGISTER_STUDENT: "/register-student",
  REGISTER_COMPANY: "/register-company",
  DASHBOARD_STUDENT: "/dashboard/student",
  DASHBOARD_COMPANY: "/dashboard/company",
  DASHBOARD_ADMIN: "/dashboard/admin",
  JOBS: "/jobs",
  JOB_DETAILS: (id: string) => `/jobs/${id}`,
};

export const APP_NAME = "Atlas Recruit";
