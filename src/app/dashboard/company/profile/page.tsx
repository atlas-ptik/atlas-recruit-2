/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/company/profile/page.tsx
"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import {
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Tag,
  Briefcase,
  Globe,
  Save,
  Loader2,
  AlertTriangle,
  Edit,
  Link2,
  CircleCheck,
  Users,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useApi } from "@/contexts/ApiContext";

// Mock company profile data since we don't have actual APIs for updating profile
const initialProfileData = {
  nama: "",
  email: "",
  industri: "",
  deskripsi: "",
  lokasi: "",
  situs_web: "",
  phone: "",
  tahun_berdiri: new Date().getFullYear() - 5,
  ukuran: "",
  socialLinks: {
    linkedin: "",
    twitter: "",
    facebook: "",
    instagram: "",
  },
  logo: "/placeholder-logo.jpg",
};

// Company size options
const companySize = [
  { value: "1-10", label: "1-10 Karyawan" },
  { value: "11-50", label: "11-50 Karyawan" },
  { value: "51-200", label: "51-200 Karyawan" },
  { value: "201-500", label: "201-500 Karyawan" },
  { value: "501-1000", label: "501-1000 Karyawan" },
  { value: "1001+", label: "1000+ Karyawan" },
];

export default function CompanyProfilePage() {
  const { user } = useApi();

  // Get company profile from user context
  const companyUser = user?.peran === "perusahaan" ? user : null;

  // State for profile data
  const [profileData, setProfileData] = useState(
    companyUser
      ? {
          ...initialProfileData,
          nama: (companyUser.detail as any).nama || "",
          email: companyUser.email || "",
          industri: (companyUser.detail as any).industri || "",
          deskripsi: (companyUser.detail as any).deskripsi || "",
          lokasi: (companyUser.detail as any).lokasi || "",
          situs_web: (companyUser.detail as any).situs_web || "",
          ukuran: (companyUser.detail as any).ukuran || "",
          tahun_berdiri:
            (companyUser.detail as any).tahun_berdiri ||
            new Date().getFullYear() - 5,
          logo: (companyUser.detail as any).logo || "/placeholder-logo.jpg",
        }
      : initialProfileData
  );

  // Input file reference for logo
  const logoInputRef = useRef<HTMLInputElement>(null);

  // State for loading and errors
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Profile completion percentage
  const calculateProfileCompletion = () => {
    const fieldsToCheck = [
      profileData.nama,
      profileData.email,
      profileData.industri,
      profileData.deskripsi,
      profileData.lokasi,
      profileData.situs_web,
      profileData.phone,
      profileData.ukuran,
      profileData.logo !== "/placeholder-logo.jpg",
      profileData.socialLinks.linkedin ||
        profileData.socialLinks.twitter ||
        profileData.socialLinks.facebook ||
        profileData.socialLinks.instagram,
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

  // Handle logo change
  const handleLogoClick = () => {
    logoInputRef.current?.click();
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we would upload the file to server and get URL
      // For now, just create a local object URL
      const imageUrl = URL.createObjectURL(file);
      setProfileData((prev) => ({
        ...prev,
        logo: imageUrl,
      }));
    }
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

      setSuccessMessage("Profil perusahaan berhasil diperbarui");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("Gagal memperbarui profil perusahaan. Silakan coba lagi.");
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
            <h1 className="text-3xl font-bold mb-1">Profil Perusahaan</h1>
            <p className="text-muted-foreground">
              Kelola informasi perusahaan Anda untuk menarik kandidat terbaik
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
              Profil perusahaan yang lengkap membantu kandidat memahami
              perusahaan Anda dengan lebih baik
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={calculateProfileCompletion()} className="h-2" />
          </CardContent>
        </Card>

        {/* Main Profile Form */}
        <div>
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Informasi Dasar
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Detail Perusahaan
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Media Sosial
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informasi Dasar</CardTitle>
                  <CardDescription>
                    Informasi dasar perusahaan Anda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Company Logo */}
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className="w-32 h-32 rounded-md border overflow-hidden bg-muted flex items-center justify-center cursor-pointer"
                        onClick={handleLogoClick}
                      >
                        {profileData.logo ? (
                          <Image
                            src={profileData.logo}
                            alt="Company Logo"
                            width={128}
                            height={128}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Building className="h-12 w-12 text-muted-foreground" />
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogoClick}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Ubah Logo
                      </Button>
                      <input
                        type="file"
                        ref={logoInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoChange}
                      />
                    </div>

                    {/* Basic Info Form */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="nama">Nama Perusahaan</Label>
                        <Input
                          id="nama"
                          name="nama"
                          value={profileData.nama}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Perusahaan</Label>
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
                            placeholder="+62 21 1234 5678"
                            value={profileData.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
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

                      <div className="space-y-2">
                        <Label htmlFor="situs_web">Situs Web</Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="situs_web"
                            name="situs_web"
                            className="pl-10"
                            placeholder="https://example.com"
                            value={profileData.situs_web}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="industri">Industri</Label>
                        <div className="relative">
                          <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="industri"
                            name="industri"
                            className="pl-10"
                            placeholder="Teknologi, Keuangan, dll."
                            value={profileData.industri}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Company Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Detail Perusahaan</CardTitle>
                  <CardDescription>
                    Informasi lengkap tentang perusahaan Anda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tahun_berdiri">Tahun Berdiri</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="tahun_berdiri"
                          name="tahun_berdiri"
                          type="number"
                          className="pl-10"
                          value={profileData.tahun_berdiri}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              tahun_berdiri:
                                parseInt(e.target.value) ||
                                new Date().getFullYear() - 5,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ukuran">Ukuran Perusahaan</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Select
                          value={profileData.ukuran}
                          onValueChange={(value) =>
                            setProfileData((prev) => ({
                              ...prev,
                              ukuran: value,
                            }))
                          }
                        >
                          <SelectTrigger className="pl-10">
                            <SelectValue placeholder="Pilih ukuran perusahaan" />
                          </SelectTrigger>
                          <SelectContent>
                            {companySize.map((size) => (
                              <SelectItem key={size.value} value={size.value}>
                                {size.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="deskripsi">Deskripsi Perusahaan</Label>
                      <Textarea
                        id="deskripsi"
                        name="deskripsi"
                        placeholder="Ceritakan tentang perusahaan Anda, visi, misi, dan budaya kerja"
                        rows={6}
                        value={profileData.deskripsi}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Social Media Tab */}
            <TabsContent value="social" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Media Sosial</CardTitle>
                  <CardDescription>
                    Hubungkan media sosial perusahaan Anda untuk meningkatkan
                    visibilitas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <div className="relative">
                        <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="linkedin"
                          name="linkedin"
                          className="pl-10"
                          placeholder="https://linkedin.com/company/example"
                          value={profileData.socialLinks.linkedin}
                          onChange={handleSocialLinkChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter</Label>
                      <div className="relative">
                        <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="twitter"
                          name="twitter"
                          className="pl-10"
                          placeholder="https://twitter.com/example"
                          value={profileData.socialLinks.twitter}
                          onChange={handleSocialLinkChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook</Label>
                      <div className="relative">
                        <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="facebook"
                          name="facebook"
                          className="pl-10"
                          placeholder="https://facebook.com/example"
                          value={profileData.socialLinks.facebook}
                          onChange={handleSocialLinkChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <div className="relative">
                        <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="instagram"
                          name="instagram"
                          className="pl-10"
                          placeholder="https://instagram.com/example"
                          value={profileData.socialLinks.instagram}
                          onChange={handleSocialLinkChange}
                        />
                      </div>
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
