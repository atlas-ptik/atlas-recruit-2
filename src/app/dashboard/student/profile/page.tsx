/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/student/profile/page.tsx
"use client";

import { useState, useRef, ChangeEvent } from "react";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  Calendar,
  Briefcase,
  FilePlus,
  Save,
  Loader2,
  AlertTriangle,
  Plus,
  XCircle,
  Edit,
  Link2,
  CircleCheck,
  FileText,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useApi } from "@/contexts/ApiContext";
import { Skill } from "@/lib/api/skillService";

// Mock user profile data since we don't have actual APIs for updating profile
const initialProfileData = {
  nama_depan: "",
  nama_belakang: "",
  email: "",
  jurusan: "",
  tahun_masuk: new Date().getFullYear() - 4,
  tahun_lulus: new Date().getFullYear(),
  bio: "",
  phone: "",
  lokasi: "",
  universitas: {
    id: "",
    nama: "",
  },
  keahlian: [] as Skill[],
  socialLinks: {
    linkedin: "",
    github: "",
    portfolio: "",
  },
  foto: "/placeholder-avatar.jpg",
  resume: "/placeholder-resume.pdf",
};

export default function StudentProfilePage() {
  const { user } = useApi();

  // Get student profile from user context
  const studentUser = user?.peran === "mahasiswa" ? user : null;

  // State for profile data
  const [profileData, setProfileData] = useState(
    studentUser
      ? {
          ...initialProfileData,
          nama_depan: (studentUser.detail as any).nama_depan || "",
          nama_belakang: (studentUser.detail as any).nama_belakang || "",
          email: studentUser.email || "",
          jurusan: (studentUser.detail as any).jurusan || "",
          tahun_masuk:
            (studentUser.detail as any).tahun_masuk ||
            new Date().getFullYear() - 4,
          tahun_lulus:
            (studentUser.detail as any).tahun_lulus || new Date().getFullYear(),
          bio: (studentUser.detail as any).bio || "",
          lokasi: (studentUser.detail as any).lokasi || "",
          universitas: (studentUser.detail as any).universitas || {
            id: "",
            nama: "",
          },
          keahlian: (studentUser.detail as any).keahlian || [],
          foto: (studentUser.detail as any).foto || "/placeholder-avatar.jpg",
        }
      : initialProfileData
  );

  // Input file references
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // State for skill management
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [showSkillDialog, setShowSkillDialog] = useState(false);

  // State for loading and errors
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Profile completion percentage
  const calculateProfileCompletion = () => {
    const fieldsToCheck = [
      profileData.nama_depan,
      profileData.nama_belakang,
      profileData.email,
      profileData.jurusan,
      profileData.bio,
      profileData.phone,
      profileData.lokasi,
      profileData.universitas.id,
      profileData.keahlian.length > 0,
      profileData.socialLinks.linkedin ||
        profileData.socialLinks.github ||
        profileData.socialLinks.portfolio,
      profileData.foto !== "/placeholder-avatar.jpg",
      profileData.resume !== "/placeholder-resume.pdf",
    ];

    const filledFields = fieldsToCheck.filter(Boolean).length;
    return Math.round((filledFields / fieldsToCheck.length) * 100);
  };

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle social links change
  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  // Handle profile photo change
  const handleProfilePhotoClick = () => {
    profilePhotoInputRef.current?.click();
  };

  const handleProfilePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we would upload the file to server and get URL
      // For now, just create a local object URL
      const imageUrl = URL.createObjectURL(file);
      setProfileData((prev) => ({
        ...prev,
        foto: imageUrl,
      }));
    }
  };

  // Handle resume upload
  const handleResumeClick = () => {
    resumeInputRef.current?.click();
  };

  const handleResumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we would upload the file to server and get URL
      setProfileData((prev) => ({
        ...prev,
        resume: URL.createObjectURL(file),
      }));
    }
  };

  // Handle skill selection
  const handleAddSkill = () => {
    if (!selectedSkill) return;

    const skill = availableSkills.find((s) => s.id === selectedSkill);
    if (!skill) return;

    if (!profileData.keahlian.some((s) => s.id === skill.id)) {
      setProfileData((prev) => ({
        ...prev,
        keahlian: [...prev.keahlian, skill],
      }));
    }

    setSelectedSkill("");
    setShowSkillDialog(false);
  };

  // Handle skill removal
  const handleRemoveSkill = (skillId: string) => {
    setProfileData((prev) => ({
      ...prev,
      keahlian: prev.keahlian.filter((skill) => skill.id !== skillId),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // In a real app, we would call the API to update the profile
      // For now, just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccessMessage("Profil berhasil diperbarui");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("Gagal memperbarui profil. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Profil Saya</h1>
            <p className="text-muted-foreground">
              Kelola informasi profil Anda untuk meningkatkan peluang karir
            </p>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="sm:self-start"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <Alert className="bg-green-500/10 border-green-500/20 text-green-500">
            <CircleCheck className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Profile Completion */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              Kelengkapan Profil: {calculateProfileCompletion()}%
            </CardTitle>
            <CardDescription>
              Profil yang lengkap meningkatkan peluang Anda untuk mendapatkan
              pekerjaan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={calculateProfileCompletion()} className="h-2" />
          </CardContent>
        </Card>

        {/* Main Profile Form */}
        <div>
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid grid-cols-1 md:grid-cols-4 w-full">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Informasi Dasar
              </TabsTrigger>
              <TabsTrigger
                value="education"
                className="flex items-center gap-2"
              >
                <GraduationCap className="h-4 w-4" />
                Pendidikan
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Keahlian
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="flex items-center gap-2"
              >
                <FilePlus className="h-4 w-4" />
                Dokumen
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informasi Dasar</CardTitle>
                  <CardDescription>Informasi dasar profil Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Profile Photo */}
                    <div className="flex flex-col items-center gap-3">
                      <Avatar
                        className="h-32 w-32 cursor-pointer"
                        onClick={handleProfilePhotoClick}
                      >
                        {profileData.foto ? (
                          <AvatarImage
                            src={profileData.foto}
                            alt="Profile Photo"
                          />
                        ) : (
                          <AvatarFallback className="text-4xl">
                            {profileData.nama_depan?.[0] || ""}
                            {profileData.nama_belakang?.[0] || ""}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleProfilePhotoClick}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Ubah Foto
                      </Button>
                      <input
                        type="file"
                        ref={profilePhotoInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleProfilePhotoChange}
                      />
                    </div>

                    {/* Basic Info Form */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nama_depan">Nama Depan</Label>
                        <Input
                          id="nama_depan"
                          name="nama_depan"
                          value={profileData.nama_depan}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nama_belakang">Nama Belakang</Label>
                        <Input
                          id="nama_belakang"
                          name="nama_belakang"
                          value={profileData.nama_belakang}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            className="pl-10"
                            value={profileData.email}
                            onChange={handleInputChange}
                            disabled // Email is typically not changeable
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Nomor Telepon</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            className="pl-10"
                            placeholder="+62 812 3456 7890"
                            value={profileData.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="lokasi">Lokasi</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="lokasi"
                            name="lokasi"
                            className="pl-10"
                            placeholder="Jakarta, Indonesia"
                            value={profileData.lokasi}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          placeholder="Ceritakan tentang diri Anda secara singkat"
                          rows={4}
                          value={profileData.bio}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="space-y-3 pt-3 border-t">
                    <h3 className="text-sm font-medium">Tautan Sosial Media</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <div className="relative">
                          <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="linkedin"
                            name="linkedin"
                            className="pl-10"
                            placeholder="https://linkedin.com/in/username"
                            value={profileData.socialLinks.linkedin}
                            onChange={handleSocialLinkChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="github">GitHub</Label>
                        <div className="relative">
                          <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="github"
                            name="github"
                            className="pl-10"
                            placeholder="https://github.com/username"
                            value={profileData.socialLinks.github}
                            onChange={handleSocialLinkChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="portfolio">Portfolio / Website</Label>
                        <div className="relative">
                          <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="portfolio"
                            name="portfolio"
                            className="pl-10"
                            placeholder="https://yourportfolio.com"
                            value={profileData.socialLinks.portfolio}
                            onChange={handleSocialLinkChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Informasi Pendidikan
                  </CardTitle>
                  <CardDescription>
                    Detail pendidikan dan akademik Anda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="universitas">Universitas</Label>
                      <Select
                        value={profileData.universitas.id}
                        onValueChange={(value) =>
                          setProfileData((prev) => ({
                            ...prev,
                            universitas: {
                              id: value,
                              nama:
                                availableSkills.find((s) => s.id === value)
                                  ?.nama || value,
                            },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih universitas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="univ-1">
                            Universitas Indonesia
                          </SelectItem>
                          <SelectItem value="univ-2">
                            Institut Teknologi Bandung
                          </SelectItem>
                          <SelectItem value="univ-3">
                            Universitas Gadjah Mada
                          </SelectItem>
                          <SelectItem value="univ-4">
                            Institut Teknologi Sepuluh Nopember
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jurusan">Jurusan/Program Studi</Label>
                      <Input
                        id="jurusan"
                        name="jurusan"
                        placeholder="Teknik Informatika"
                        value={profileData.jurusan}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tahun_masuk">Tahun Masuk</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="tahun_masuk"
                          name="tahun_masuk"
                          type="number"
                          className="pl-10"
                          value={profileData.tahun_masuk}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              tahun_masuk:
                                parseInt(e.target.value) ||
                                new Date().getFullYear() - 4,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tahun_lulus">
                        Tahun Lulus (Perkiraan)
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="tahun_lulus"
                          name="tahun_lulus"
                          type="number"
                          className="pl-10"
                          value={profileData.tahun_lulus}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              tahun_lulus:
                                parseInt(e.target.value) ||
                                new Date().getFullYear(),
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Keahlian</CardTitle>
                  <CardDescription>
                    Tambahkan keahlian untuk meningkatkan peluang Anda
                    mendapatkan pekerjaan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Selected Skills */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">
                      Keahlian yang Dimiliki
                    </h3>

                    {profileData.keahlian.length === 0 ? (
                      <div className="p-4 border border-dashed rounded-md text-center text-muted-foreground">
                        Belum ada keahlian yang ditambahkan
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profileData.keahlian.map((skill) => (
                          <Badge
                            key={skill.id}
                            variant="outline"
                            className="px-3 py-1.5 bg-primary/10 border-primary/30 flex items-center gap-2"
                          >
                            <span>{skill.nama}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill.id)}
                              className="text-muted-foreground hover:text-destructive focus:outline-none"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add Skill Button */}
                  <div>
                    <Dialog
                      open={showSkillDialog}
                      onOpenChange={setShowSkillDialog}
                    >
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Tambah Keahlian
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Tambah Keahlian</DialogTitle>
                          <DialogDescription>
                            Pilih keahlian yang ingin ditambahkan ke profil
                            Anda.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                          <Select
                            value={selectedSkill}
                            onValueChange={setSelectedSkill}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih keahlian" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="skill-1">
                                JavaScript
                              </SelectItem>
                              <SelectItem value="skill-2">Python</SelectItem>
                              <SelectItem value="skill-3">Java</SelectItem>
                              <SelectItem value="skill-4">C++</SelectItem>
                              <SelectItem value="skill-5">React</SelectItem>
                              <SelectItem value="skill-6">Vue.js</SelectItem>
                              <SelectItem value="skill-7">Node.js</SelectItem>
                              <SelectItem value="skill-8">Express</SelectItem>
                              <SelectItem value="skill-9">MongoDB</SelectItem>
                              <SelectItem value="skill-10">SQL</SelectItem>
                              <SelectItem value="skill-11">Git</SelectItem>
                              <SelectItem value="skill-12">Docker</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Batal</Button>
                          </DialogClose>
                          <Button
                            onClick={handleAddSkill}
                            disabled={!selectedSkill}
                          >
                            Tambah Keahlian
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dokumen</CardTitle>
                  <CardDescription>
                    Upload resume dan dokumen pendukung lainnya
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Resume */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Resume</h3>
                    <div className="flex items-center justify-between p-4 border rounded-md bg-muted/20">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                        <span>Resume.pdf</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleResumeClick}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Ubah
                        </Button>
                      </div>
                    </div>
                    <input
                      type="file"
                      ref={resumeInputRef}
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Format yang diterima: PDF, DOC, DOCX. Ukuran maksimal 5MB.
                    </p>
                  </div>

                  {/* Certificates (could be expanded in a real app) */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Sertifikat</h3>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Sertifikat
                      </Button>
                    </div>
                    <div className="p-4 border border-dashed rounded-md text-center text-muted-foreground">
                      Belum ada sertifikat yang ditambahkan
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
