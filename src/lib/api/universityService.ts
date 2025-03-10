// src/lib/api/universityService.ts - Service for handling universities (universitas)
import apiClient from "@/lib/api/apiClient";
import { PaginationData } from "@/lib/api/jobService";

// Types
export interface University {
  id: string;
  nama: string;
  lokasi: string;
  situs_web: string;
  logo: string;
  dibuat_pada: string;
}

export interface UniversityDetail extends University {
  deskripsi: string;
  jumlah_mahasiswa: number;
}

export interface UniversityListResponse {
  universitas: University[];
  lokasi: string[];
  pagination: PaginationData;
}

export interface UniversityFilterParams {
  halaman?: number;
  per_halaman?: number;
  lokasi?: string;
  keyword?: string;
}

export interface CreateUniversityRequest {
  nama: string;
  lokasi: string;
  situs_web: string;
  deskripsi: string;
  logo: string;
}

export interface UpdateUniversityRequest {
  nama?: string;
  lokasi?: string;
  situs_web?: string;
  deskripsi?: string;
  logo?: string;
}

class UniversityService {
  // Get list of universities with optional filters
  async getUniversities(
    filters: UniversityFilterParams = {}
  ): Promise<UniversityListResponse> {
    const params = new URLSearchParams();

    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get<UniversityListResponse>(
      `/universitas?${params.toString()}`
    );

    if (response.sukses && response.data) {
      return response.data;
    } else {
      throw new Error(response.pesan || "Failed to fetch universities");
    }
  }

  // Get university details by ID
  async getUniversityById(id: string): Promise<UniversityDetail> {
    const response = await apiClient.get<UniversityDetail>(
      `/universitas/${id}`
    );

    if (response.sukses && response.data) {
      return response.data;
    } else {
      throw new Error(response.pesan || "Failed to fetch university details");
    }
  }

  // Create a new university (admin only)
  async createUniversity(data: CreateUniversityRequest): Promise<string> {
    const response = await apiClient.post<{ id: string }>(
      "/universitas",
      data as unknown as Record<string, unknown>
    );

    if (response.sukses && response.data) {
      return response.data.id;
    } else {
      throw new Error(response.pesan || "Failed to create university");
    }
  }

  // Update an existing university (admin only)
  async updateUniversity(
    id: string,
    data: UpdateUniversityRequest
  ): Promise<void> {
    const response = await apiClient.put<undefined>(
      `/universitas/${id}`,
      data as unknown as Record<string, unknown>
    );

    if (!response.sukses) {
      throw new Error(response.pesan || "Failed to update university");
    }
  }

  // Delete a university (admin only, only if not in use)
  async deleteUniversity(id: string): Promise<void> {
    const response = await apiClient.delete<undefined>(`/universitas/${id}`);

    if (!response.sukses) {
      throw new Error(response.pesan || "Failed to delete university");
    }
  }
}

const universityService = new UniversityService();
export default universityService;
