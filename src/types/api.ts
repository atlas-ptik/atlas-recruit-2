// src/types/api.ts - Common types for the API integration
// This file centralizes shared types used across different services

// Common type for all API responses
export interface ApiResponse<T> {
  sukses: boolean;
  pesan: string;
  data?: T;
  error?: Record<string, unknown>;
}

// Pagination data structure returned by list endpoints
export interface PaginationData {
  total: number;
  halaman: number;
  per_halaman: number;
  halaman_total: number;
}

// User roles in the system
export type UserRole = "mahasiswa" | "perusahaan" | "admin";

// Job types
export type JobType =
  | "penuh-waktu"
  | "paruh-waktu"
  | "magang"
  | "kontrak"
  | "freelance";

// Experience levels
export type ExperienceLevel =
  | "pemula"
  | "menengah"
  | "senior"
  | "manajerial"
  | "eksekutif";

// Application status flow
export type ApplicationStatus =
  | "menunggu"
  | "ditinjau"
  | "shortlist"
  | "wawancara"
  | "ditawari"
  | "diterima"
  | "ditolak";

// User profiles
export interface BaseUser {
  id: string;
  email: string;
  peran: UserRole;
}

export interface StudentProfile extends BaseUser {
  peran: "mahasiswa";
  detail: {
    nama_depan: string;
    nama_belakang: string;
    universitas: {
      id: string;
      nama: string;
    };
    jurusan?: string;
    tahun_masuk?: number;
    tahun_lulus?: number;
    foto?: string;
    bio?: string;
    lokasi?: string;
    keahlian?: Array<{
      id: string;
      nama: string;
      kategori: string;
    }>;
  };
}

export interface CompanyProfile extends BaseUser {
  peran: "perusahaan";
  detail: {
    nama: string;
    industri: string;
    deskripsi?: string;
    lokasi?: string;
    situs_web?: string;
    logo?: string;
    ukuran?: string;
    tahun_berdiri?: number;
  };
}

export interface AdminProfile extends BaseUser {
  peran: "admin";
  detail: {
    nama_depan: string;
    nama_belakang: string;
  };
}

export type UserProfile = StudentProfile | CompanyProfile | AdminProfile;
    