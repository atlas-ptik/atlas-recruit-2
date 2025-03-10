// src/lib/api/applicationService.ts - Service for handling job applications (lamaran)
import apiClient from "@/lib/api/apiClient";
import { PaginationData } from "@/lib/api/jobService";

// Types
export interface Application {
  id: string;
  judul_lowongan: string;
  jenis_pekerjaan: string;
  nama_perusahaan: string;
  logo_perusahaan: string;
  nama_depan: string;
  nama_belakang: string;
  foto: string;
  status: ApplicationStatus;
  tanggal_melamar: string;
}

export interface ApplicationDetail extends Application {
  deskripsi_lowongan: string;
  lokasi: string;
  jurusan: string;
  surat_lamaran: string;
  resume: string;
  riwayat: ApplicationHistory[];
}

export interface ApplicationHistory {
  status: ApplicationStatus;
  catatan: string;
  nama_pengguna: string;
  peran: string;
  dibuat_pada: string;
}

export type ApplicationStatus =
  | "menunggu"
  | "ditinjau"
  | "shortlist"
  | "wawancara"
  | "ditawari"
  | "diterima"
  | "ditolak";

export interface ApplicationListResponse {
  lamaran: Application[];
  pagination: PaginationData;
}

export interface ApplicationFilterParams {
  halaman?: number;
  per_halaman?: number;
  lowongan_id?: string;
  status?: ApplicationStatus;
}

export interface CreateApplicationRequest {
  lowongan_id: string;
  surat_lamaran: string;
  resume: string;
}

export interface UpdateApplicationRequest {
  surat_lamaran?: string;
  resume?: string;
}

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
  catatan: string;
}

class ApplicationService {
  // Get applications with filters (for students, companies or admins)
  async getApplications(
    filters: ApplicationFilterParams = {}
  ): Promise<ApplicationListResponse> {
    const params = new URLSearchParams();

    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get<ApplicationListResponse>(
      `/lamaran?${params.toString()}`
    );

    if (response.sukses && response.data) {
      return response.data;
    } else {
      throw new Error(response.pesan || "Failed to fetch applications");
    }
  }

  // Get application details by ID
  async getApplicationById(id: string): Promise<ApplicationDetail> {
    const response = await apiClient.get<ApplicationDetail>(`/lamaran/${id}`);

    if (response.sukses && response.data) {
      return response.data;
    } else {
      throw new Error(response.pesan || "Failed to fetch application details");
    }
  }

  // Create a new application (for students)
  async createApplication(data: CreateApplicationRequest): Promise<string> {
    const response = await apiClient.post<{ id: string }>(
      "/lamaran",
      data as unknown as Record<string, unknown>
    );

    if (response.sukses && response.data) {
      return response.data.id;
    } else {
      throw new Error(response.pesan || "Failed to submit application");
    }
  }

  // Update an existing application (for students, only if status is "menunggu")
  async updateApplication(
    id: string,
    data: UpdateApplicationRequest
  ): Promise<void> {
    const response = await apiClient.put<undefined>(
      `/lamaran/${id}`,
      data as unknown as Record<string, unknown>
    );

    if (!response.sukses) {
      throw new Error(response.pesan || "Failed to update application");
    }
  }

  // Update application status (for companies)
  async updateApplicationStatus(
    id: string,
    data: UpdateApplicationStatusRequest
  ): Promise<void> {
    const response = await apiClient.post<undefined>(
      `/lamaran/${id}/update-status`,
      data as unknown as Record<string, unknown>
    );

    if (!response.sukses) {
      throw new Error(response.pesan || "Failed to update application status");
    }
  }

  // Delete an application (for students, only if status is "menunggu")
  async deleteApplication(id: string): Promise<void> {
    const response = await apiClient.delete<undefined>(`/lamaran/${id}`);

    if (!response.sukses) {
      throw new Error(response.pesan || "Failed to delete application");
    }
  }
}

const applicationService = new ApplicationService();
export default applicationService;
