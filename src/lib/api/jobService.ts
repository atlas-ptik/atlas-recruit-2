// src/lib/api/jobService.ts - Service for handling job listings and related operations
import apiClient from "@/lib/api/apiClient";

// Types
export interface Skill {
  id: string;
  nama: string;
  kategori: string;
  wajib?: boolean;
}

export interface JobListing {
  id: string;
  judul: string;
  deskripsi: string;
  lokasi: string;
  jenis_pekerjaan: string;
  nama_perusahaan: string;
  logo_perusahaan: string;
}

export interface JobDetail extends JobListing {
  level_pengalaman: string;
  gaji_min?: number;
  gaji_max?: number;
  tampilkan_gaji: boolean;
  batas_lamaran: string;
  persyaratan: string;
  tanggung_jawab: string;
  keuntungan: string;
  industri: string;
  lokasi_perusahaan: string;
  keahlian: Skill[];
}

export interface PaginationData {
  total: number;
  halaman: number;
  per_halaman: number;
  halaman_total: number;
}

export interface JobListResponse {
  lowongan: JobListing[];
  pagination: PaginationData;
}

export interface JobFilterParams {
  halaman?: number;
  per_halaman?: number;
  perusahaan_id?: string;
  lokasi?: string;
  jenis_pekerjaan?: string;
  keyword?: string;
}

export interface JobSkill {
  id: string;
  wajib: boolean;
}

export interface CreateJobRequest {
  judul: string;
  deskripsi: string;
  lokasi: string;
  jenis_pekerjaan: string;
  level_pengalaman: string;
  gaji_min?: number;
  gaji_max?: number;
  tampilkan_gaji: boolean;
  batas_lamaran: string;
  persyaratan: string;
  tanggung_jawab: string;
  keuntungan: string;
  keahlian: JobSkill[];
}

export interface UpdateJobRequest {
  judul?: string;
  deskripsi?: string;
  lokasi?: string;
  jenis_pekerjaan?: string;
  level_pengalaman?: string;
  gaji_min?: number;
  gaji_max?: number;
  tampilkan_gaji?: boolean;
  batas_lamaran?: string;
  persyaratan?: string;
  tanggung_jawab?: string;
  keuntungan?: string;
  keahlian?: JobSkill[];
}

class JobService {
  // Get list of jobs with optional filters
  async getJobs(filters: JobFilterParams = {}): Promise<JobListResponse> {
    const params = new URLSearchParams();

    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get<JobListResponse>(
      `/lowongan?${params.toString()}`
    );

    if (response.sukses && response.data) {
      return response.data;
    } else {
      throw new Error(response.pesan || "Failed to fetch job listings");
    }
  }

  // Get job details by ID
  async getJobById(id: string): Promise<JobDetail> {
    const response = await apiClient.get<JobDetail>(`/lowongan/${id}`);

    if (response.sukses && response.data) {
      return response.data;
    } else {
      throw new Error(response.pesan || "Failed to fetch job details");
    }
  }

  // Create a new job listing (for companies)
  async createJob(jobData: CreateJobRequest): Promise<string> {
    const response = await apiClient.post<{ id: string }>(
      "/lowongan",
      jobData as unknown as Record<string, unknown>
    );

    if (response.sukses && response.data) {
      return response.data.id;
    } else {
      throw new Error(response.pesan || "Failed to create job listing");
    }
  }

  // Update an existing job listing (for companies)
  async updateJob(id: string, jobData: UpdateJobRequest): Promise<void> {
    const response = await apiClient.put<undefined>(
      `/lowongan/${id}`,
      jobData as unknown as Record<string, unknown>
    );

    if (!response.sukses) {
      throw new Error(response.pesan || "Failed to update job listing");
    }
  }

  // Delete a job listing (for companies)
  async deleteJob(id: string): Promise<void> {
    const response = await apiClient.delete<undefined>(`/lowongan/${id}`);

    if (!response.sukses) {
      throw new Error(response.pesan || "Failed to delete job listing");
    }
  }
}

const jobService = new JobService();
export default jobService;
