// src/lib/api/skillService.ts - Service for handling skills (keahlian)
import apiClient from "@/lib/api/apiClient";
import { PaginationData } from "@/lib/api/jobService";

// Types
export interface Skill {
  id: string;
  nama: string;
  kategori: string;
  dibuat_pada: string;
}

export interface SkillListResponse {
  keahlian: Skill[];
  kategori: string[];
  pagination: PaginationData;
}

export interface SkillFilterParams {
  halaman?: number;
  per_halaman?: number;
  kategori?: string;
  keyword?: string;
}

export interface CreateSkillRequest {
  nama: string;
  kategori: string;
}

export interface UpdateSkillRequest {
  nama?: string;
  kategori?: string;
}

class SkillService {
  // Get list of skills with optional filters
  async getSkills(filters: SkillFilterParams = {}): Promise<SkillListResponse> {
    const params = new URLSearchParams();

    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get<SkillListResponse>(
      `/keahlian?${params.toString()}`
    );

    if (response.sukses && response.data) {
      return response.data;
    } else {
      throw new Error(response.pesan || "Failed to fetch skills");
    }
  }

  // Get skill details by ID
  async getSkillById(id: string): Promise<Skill> {
    const response = await apiClient.get<Skill>(`/keahlian/${id}`);

    if (response.sukses && response.data) {
      return response.data;
    } else {
      throw new Error(response.pesan || "Failed to fetch skill details");
    }
  }

  // Create a new skill (admin only)
  async createSkill(data: CreateSkillRequest): Promise<string> {
    const response = await apiClient.post<{ id: string }>(
      "/keahlian",
      data as unknown as Record<string, unknown>
    );

    if (response.sukses && response.data) {
      return response.data.id;
    } else {
      throw new Error(response.pesan || "Failed to create skill");
    }
  }

  // Update an existing skill (admin only)
  async updateSkill(id: string, data: UpdateSkillRequest): Promise<void> {
    const response = await apiClient.put<undefined>(
      `/keahlian/${id}`,
      data as unknown as Record<string, unknown>
    );

    if (!response.sukses) {
      throw new Error(response.pesan || "Failed to update skill");
    }
  }

  // Delete a skill (admin only, only if not in use)
  async deleteSkill(id: string): Promise<void> {
    const response = await apiClient.delete<undefined>(`/keahlian/${id}`);

    if (!response.sukses) {
      throw new Error(response.pesan || "Failed to delete skill");
    }
  }
}

const skillService = new SkillService();
export default skillService;
