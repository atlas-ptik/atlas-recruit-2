// src/lib/api/authService.ts - Authentication service for handling login, registration, and user sessions
import apiClient, { ApiResponse } from "@/lib/api/apiClient";

// Types
export interface LoginRequest {
  email: string;
  kata_sandi: string;
}

export interface LoginResponse {
  token: string;
  pengguna: {
    id: string;
    email: string;
    peran: "perusahaan" | "mahasiswa" | "admin";
  };
  detail: Record<string, unknown>;
}

export interface RegisterMahasiswaRequest {
  email: string;
  kata_sandi: string;
  nama_depan: string;
  nama_belakang: string;
  universitas_id: string;
}

export interface RegisterPerusahaanRequest {
  email: string;
  kata_sandi: string;
  nama: string;
  industri: string;
}

export interface UserProfile {
  id: string;
  email: string;
  peran: "perusahaan" | "mahasiswa" | "admin";
  detail: Record<string, unknown>;
}

class AuthService {
  // Check if user is logged in
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return Boolean(localStorage.getItem("auth_token"));
  }

  // Get user role
  getUserRole(): string | null {
    if (typeof window === "undefined") return null;

    const userStr = localStorage.getItem("user_profile");
    if (!userStr) return null;

    try {
      const user = JSON.parse(userStr) as UserProfile;
      return user.peran;
    } catch {
      return null;
    }
  }

  // Get user profile
  getUserProfile(): UserProfile | null {
    if (typeof window === "undefined") return null;

    const userStr = localStorage.getItem("user_profile");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr) as UserProfile;
    } catch  {
      return null;
    }
  }

  // Login
  async login(credentials: LoginRequest): Promise<UserProfile> {
    const response = await apiClient.post<LoginResponse>(
      "/auth?action=login",
      credentials as unknown as Record<string, unknown>
    );

    if (response.sukses && response.data) {
      const { token, pengguna, detail } = response.data;

      // Save token to client
      apiClient.setToken(token);

      // Create user profile
      const userProfile: UserProfile = {
        id: pengguna.id,
        email: pengguna.email,
        peran: pengguna.peran,
        detail,
      };

      // Save user profile to localStorage
      localStorage.setItem("user_profile", JSON.stringify(userProfile));

      return userProfile;
    } else {
      throw new Error(response.pesan || "Login failed");
    }
  }

  // Register Mahasiswa (Student)
  async registerMahasiswa(
    data: RegisterMahasiswaRequest
  ): Promise<ApiResponse<undefined>> {
    return apiClient.post<undefined>(
      "/auth?action=register-mahasiswa",
      data as unknown as Record<string, unknown>
    );
  }

  // Register Perusahaan (Company)
  async registerPerusahaan(
    data: RegisterPerusahaanRequest
  ): Promise<ApiResponse<undefined>> {
    return apiClient.post<undefined>(
      "/auth?action=register-perusahaan",
      data as unknown as Record<string, unknown>
    );
  }

  // Logout
  logout(): void {
    apiClient.clearToken();
    if (typeof window !== "undefined") {
      localStorage.removeItem("user_profile");
    }
  }
}

const authService = new AuthService();
export default authService;
