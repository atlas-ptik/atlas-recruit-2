// src/app/dashboard/company/jobs/[id]/edit/page.tsx - Halaman edit lowongan untuk perusahaan
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useApi } from "@/contexts/ApiContext";
import { JobDetail, UpdateJobRequest } from "@/lib/api/jobService";
import { JOB_TYPES, EXPERIENCE_LEVELS, PATHS } from "@/lib/constants";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { formatCurrency } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

interface EditJobPageProps {
  params: { id: string };
}

export default function EditJobPage({ params }: EditJobPageProps) {
  const router = useRouter();
  const { services } = useApi();
  const { id } = params;

  const [jobData, setJobData] = useState<JobDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<UpdateJobRequest>({});
  const [selectedSkills, setSelectedSkills] = useState<
    Array<{ id: string; nama: string; wajib: boolean }>
  >([]);
  const [availableSkills, setAvailableSkills] = useState<
    Array<{ id: string; nama: string; kategori: string }>
  >([]);
  const [skillSearchValue, setSkillSearchValue] = useState("");
  const [showSalaryRange, setShowSalaryRange] = useState(true);

  useEffect(() => {
    const loadJobDetail = async () => {
      try {
        const job = await services.job.getJobById(id);
        setJobData(job);

        // Initialize form data
        setFormData({
          judul: job.judul,
          deskripsi: job.deskripsi,
          lokasi: job.lokasi,
          jenis_pekerjaan: job.jenis_pekerjaan,
          level_pengalaman: job.level_pengalaman,
          gaji_min: job.gaji_min,
          gaji_max: job.gaji_max,
          tampilkan_gaji: job.tampilkan_gaji,
          batas_lamaran: job.batas_lamaran.split("T")[0], // Format yyyy-MM-dd
          persyaratan: job.persyaratan,
          tanggung_jawab: job.tanggung_jawab,
          keuntungan: job.keuntungan,
        });

        // Set selected skills
        setSelectedSkills(
          job.keahlian.map((skill) => ({
            id: skill.id,
            nama: skill.nama,
            wajib: skill.wajib || false,
          }))
        );

        // Set salary visibility
        setShowSalaryRange(job.tampilkan_gaji);

        // Load available skills
        loadSkills();
      } catch {
        alert("Gagal memuat data lowongan. Silakan coba lagi nanti.");
        router.push(PATHS.COMPANY_JOBS);
      } finally {
        setIsLoading(false);
      }
    };

    const loadSkills = async () => {
      try {
        const response = await services.skill.getSkills({ per_halaman: 100 });
        setAvailableSkills(response.keahlian);
      } catch (error) {
        console.error("Failed to load skills:", error);
      }
    };

    loadJobDetail();
  }, [id, router, services.job, services.skill]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalaryVisibilityChange = (checked: boolean) => {
    setShowSalaryRange(checked);
    setFormData((prev) => ({ ...prev, tampilkan_gaji: checked }));
  };

  const handleSkillSelect = (skillId: string) => {
    const skill = availableSkills.find((s) => s.id === skillId);
    if (skill && !selectedSkills.some((s) => s.id === skillId)) {
      setSelectedSkills([
        ...selectedSkills,
        { id: skillId, nama: skill.nama, wajib: false },
      ]);
      setSkillSearchValue("");
    }
  };

  const handleRemoveSkill = (skillId: string) => {
    setSelectedSkills(selectedSkills.filter((skill) => skill.id !== skillId));
  };

  const handleRequiredSkillChange = (skillId: string, isRequired: boolean) => {
    setSelectedSkills(
      selectedSkills.map((skill) =>
        skill.id === skillId ? { ...skill, wajib: isRequired } : skill
      )
    );
  };

  const filteredSkills = availableSkills
    .filter(
      (skill) =>
        !selectedSkills.some((s) => s.id === skill.id) &&
        skill.nama.toLowerCase().includes(skillSearchValue.toLowerCase())
    )
    .slice(0, 5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format skills for API
      const keahlian = selectedSkills.map((skill) => ({
        id: skill.id,
        wajib: skill.wajib,
      }));

      // Prepare final form data
      const finalFormData: UpdateJobRequest = {
        ...formData,
        keahlian,
      };

      // Remove empty fields
      Object.keys(finalFormData).forEach((key) => {
        if (
          finalFormData[key as keyof UpdateJobRequest] === undefined ||
          finalFormData[key as keyof UpdateJobRequest] === ""
        ) {
          delete finalFormData[key as keyof UpdateJobRequest];
        }
      });

      // Update job
      await services.job.updateJob(id, finalFormData);

      // Show success message and redirect
      alert("Lowongan berhasil diperbarui!");
      router.push(PATHS.COMPANY_JOBS);
    } catch (error) {
      console.error("Failed to update job:", error);
      alert("Gagal memperbarui lowongan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={PATHS.DASHBOARD_COMPANY}>
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={PATHS.COMPANY_JOBS}>Lowongan</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Edit Lowongan</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {isLoading ? (
            <Skeleton className="h-8 w-64" />
          ) : (
            `Edit Lowongan: ${jobData?.judul}`
          )}
        </h1>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-[600px] w-full rounded-xl" />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Informasi Dasar */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Dasar</CardTitle>
                <CardDescription>
                  Informasi utama tentang lowongan pekerjaan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="judul">
                      Judul Lowongan <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="judul"
                      name="judul"
                      value={formData.judul || ""}
                      onChange={handleInputChange}
                      placeholder="Contoh: Full Stack Developer"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lokasi">
                      Lokasi <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="lokasi"
                      name="lokasi"
                      value={formData.lokasi || ""}
                      onChange={handleInputChange}
                      placeholder="Contoh: Jakarta Selatan"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jenis_pekerjaan">
                      Jenis Pekerjaan{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.jenis_pekerjaan || ""}
                      onValueChange={(value) =>
                        handleSelectChange("jenis_pekerjaan", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis pekerjaan" />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level_pengalaman">
                      Level Pengalaman{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.level_pengalaman || ""}
                      onValueChange={(value) =>
                        handleSelectChange("level_pengalaman", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih level pengalaman" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPERIENCE_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batas_lamaran">
                    Batas Lamaran <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="batas_lamaran"
                    name="batas_lamaran"
                    type="date"
                    value={formData.batas_lamaran || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Informasi Gaji */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Gaji</CardTitle>
                <CardDescription>
                  Rentang gaji yang ditawarkan untuk posisi ini
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="tampilkan_gaji"
                    checked={showSalaryRange}
                    onCheckedChange={handleSalaryVisibilityChange}
                  />
                  <Label htmlFor="tampilkan_gaji">
                    Tampilkan informasi gaji ke pelamar
                  </Label>
                </div>

                {showSalaryRange && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="gaji_min">Gaji Minimum</Label>
                      <Input
                        id="gaji_min"
                        name="gaji_min"
                        type="number"
                        value={formData.gaji_min || ""}
                        onChange={handleInputChange}
                        placeholder="Contoh: 5000000"
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.gaji_min
                          ? `${formatCurrency(
                              Number(formData.gaji_min)
                            )} / bulan`
                          : ""}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gaji_max">Gaji Maksimum</Label>
                      <Input
                        id="gaji_max"
                        name="gaji_max"
                        type="number"
                        value={formData.gaji_max || ""}
                        onChange={handleInputChange}
                        placeholder="Contoh: 8000000"
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.gaji_max
                          ? `${formatCurrency(
                              Number(formData.gaji_max)
                            )} / bulan`
                          : ""}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Keahlian */}
            <Card>
              <CardHeader>
                <CardTitle>Keahlian</CardTitle>
                <CardDescription>
                  Tentukan keahlian yang dibutuhkan untuk posisi ini
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Pilih Keahlian</Label>
                  <div className="relative">
                    <Input
                      placeholder="Cari keahlian..."
                      value={skillSearchValue}
                      onChange={(e) => setSkillSearchValue(e.target.value)}
                    />
                    {skillSearchValue && filteredSkills.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredSkills.map((skill) => (
                          <div
                            key={skill.id}
                            className="p-2 hover:bg-accent cursor-pointer flex items-center justify-between"
                            onClick={() => handleSkillSelect(skill.id)}
                          >
                            <div>
                              <span>{skill.nama}</span>
                              <span className="ml-2 text-xs text-muted-foreground">
                                {skill.kategori}
                              </span>
                            </div>
                            <Plus className="h-4 w-4" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Keahlian yang Dipilih</Label>
                  {selectedSkills.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Belum ada keahlian yang dipilih
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedSkills.map((skill) => (
                        <div
                          key={skill.id}
                          className={`flex items-center gap-2 p-2 border rounded-md ${
                            skill.wajib
                              ? "bg-primary/10 border-primary/30"
                              : "bg-card"
                          }`}
                        >
                          <span>{skill.nama}</span>
                          <div className="flex items-center ml-2 space-x-2">
                            <div className="flex items-center space-x-1">
                              <Checkbox
                                id={`required-${skill.id}`}
                                checked={skill.wajib}
                                onCheckedChange={(checked) =>
                                  handleRequiredSkillChange(
                                    skill.id,
                                    Boolean(checked)
                                  )
                                }
                              />
                              <Label
                                htmlFor={`required-${skill.id}`}
                                className="text-xs"
                              >
                                Wajib
                              </Label>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveSkill(skill.id)}
                              className="h-6 w-6"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Deskripsi Pekerjaan */}
            <Card>
              <CardHeader>
                <CardTitle>Deskripsi Pekerjaan</CardTitle>
                <CardDescription>
                  Deskripsi mendetail tentang posisi pekerjaan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deskripsi">
                    Deskripsi Lowongan{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="deskripsi"
                    name="deskripsi"
                    value={formData.deskripsi || ""}
                    onChange={handleInputChange}
                    placeholder="Deskripsi lengkap tentang posisi pekerjaan..."
                    rows={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="persyaratan">Persyaratan</Label>
                  <Textarea
                    id="persyaratan"
                    name="persyaratan"
                    value={formData.persyaratan || ""}
                    onChange={handleInputChange}
                    placeholder="Persyaratan untuk posisi ini..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tanggung_jawab">Tanggung Jawab</Label>
                  <Textarea
                    id="tanggung_jawab"
                    name="tanggung_jawab"
                    value={formData.tanggung_jawab || ""}
                    onChange={handleInputChange}
                    placeholder="Tanggung jawab pada posisi ini..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keuntungan">Keuntungan & Benefit</Label>
                  <Textarea
                    id="keuntungan"
                    name="keuntungan"
                    value={formData.keuntungan || ""}
                    onChange={handleInputChange}
                    placeholder="Benefit dan keuntungan yang ditawarkan..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(PATHS.COMPANY_JOBS)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Perbarui Lowongan
              </Button>
            </div>
          </div>
        </form>
      )}
    </DashboardLayout>
  );
}
