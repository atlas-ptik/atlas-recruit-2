// src/app/dashboard/admin/settings/page.tsx - Admin settings page
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useApi } from "@/contexts/ApiContext";
import { Eye, EyeOff, ShieldCheck, Lock, LogOut, Loader2 } from "lucide-react";
import { AdminProfile } from "@/types/api";
import apiClient from "@/lib/api/apiClient";

// Password change schema
const passwordSchema = z
  .object({
    kata_sandi_lama: z
      .string()
      .min(1, { message: "Kata sandi lama harus diisi" }),
    kata_sandi_baru: z
      .string()
      .min(8, { message: "Kata sandi baru minimal 8 karakter" }),
    konfirmasi_kata_sandi: z
      .string()
      .min(1, { message: "Konfirmasi kata sandi harus diisi" }),
  })
  .refine((data) => data.kata_sandi_baru === data.konfirmasi_kata_sandi, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["konfirmasi_kata_sandi"],
  });

// System settings schema
const systemSettingsSchema = z.object({
  aktivasi_otomatis_perusahaan: z.boolean().default(false),
  aktivasi_otomatis_mahasiswa: z.boolean().default(true),
  notifikasi_pendaftaran_baru: z.boolean().default(true),
  notifikasi_laporan_masalah: z.boolean().default(true),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;
type SystemSettingsFormValues = z.infer<typeof systemSettingsSchema>;

export default function AdminSettingsPage() {
  const { user, logout } = useApi();
  const adminUser = user as AdminProfile;

  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [loadingSettings, setLoadingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      kata_sandi_lama: "",
      kata_sandi_baru: "",
      konfirmasi_kata_sandi: "",
    },
  });

  // System settings form
  const settingsForm = useForm<SystemSettingsFormValues>({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: {
      aktivasi_otomatis_perusahaan: false,
      aktivasi_otomatis_mahasiswa: true,
      notifikasi_pendaftaran_baru: true,
      notifikasi_laporan_masalah: true,
    },
  });

  // Password form submit handler
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      setLoadingPassword(true);
      setPasswordError("");
      setPasswordSuccess("");

      // API call to change password
      const response = await apiClient.post<undefined>(
        "/auth?action=change-password",
        {
          kata_sandi_lama: data.kata_sandi_lama,
          kata_sandi_baru: data.kata_sandi_baru,
        }
      );

      if (response.sukses) {
        passwordForm.reset();
        setPasswordSuccess("Kata sandi Anda telah berhasil diperbarui.");
      } else {
        setPasswordError(
          response.pesan || "Terjadi kesalahan saat memperbarui kata sandi."
        );
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordError(
        "Terjadi kesalahan saat memperbarui kata sandi. Silakan coba lagi nanti."
      );
    } finally {
      setLoadingPassword(false);
    }
  };

  // System settings form submit handler
  const onSettingsSubmit = async (data: SystemSettingsFormValues) => {
    try {
      setLoadingSettings(true);
      setSettingsError("");
      setSettingsSuccess("");

      // API call to update system settings
      const response = await apiClient.post<undefined>(
        "/admin/system-settings",
        {
          ...data,
        }
      );

      if (response.sukses) {
        setSettingsSuccess("Pengaturan sistem telah berhasil diperbarui.");
      } else {
        setSettingsError(
          response.pesan ||
            "Terjadi kesalahan saat menyimpan pengaturan sistem."
        );
      }
    } catch (error) {
      console.error("Error updating system settings:", error);
      setSettingsError(
        "Terjadi kesalahan saat menyimpan pengaturan sistem. Silakan coba lagi nanti."
      );
    } finally {
      setLoadingSettings(false);
    }
  };

  if (!user || user.peran !== "admin") {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Pengaturan Admin
          </h2>
          <p className="text-muted-foreground">
            Kelola pengaturan akun admin dan sistem aplikasi.
          </p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList>
            <TabsTrigger value="account">Akun</TabsTrigger>
            <TabsTrigger value="password">Kata Sandi</TabsTrigger>
            <TabsTrigger value="system">Sistem</TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border border-primary/20">
              <CardHeader>
                <CardTitle>Informasi Akun</CardTitle>
                <CardDescription>
                  Lihat informasi akun admin Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="text-base font-medium">{adminUser.email}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Nama
                    </p>
                    <p className="text-base font-medium">
                      {adminUser.detail.nama_depan}{" "}
                      {adminUser.detail.nama_belakang}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Peran
                    </p>
                    <p className="text-base font-medium">Administrator</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border border-border">
              <CardHeader>
                <CardTitle>Sesi Aktif</CardTitle>
                <CardDescription>
                  Kelola sesi login Anda di berbagai perangkat.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border border-border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <p className="font-medium">Perangkat Saat Ini</p>
                      <p className="text-sm text-muted-foreground">
                        Anda saat ini masuk dari perangkat ini.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={logout}
                      className="shrink-0 self-start"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Keluar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Password Settings */}
          <TabsContent value="password" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border border-primary/20">
              <CardHeader>
                <CardTitle>Ubah Kata Sandi</CardTitle>
                <CardDescription>
                  Perbarui kata sandi Anda untuk mempertahankan keamanan akun
                  admin.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form
                    onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={passwordForm.control}
                      name="kata_sandi_lama"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kata Sandi Lama</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Masukkan kata sandi Anda saat ini"
                                className="pr-10"
                                {...field}
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-10 w-10 px-3 py-2"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="sr-only">
                                {showPassword
                                  ? "Sembunyikan kata sandi"
                                  : "Tampilkan kata sandi"}
                              </span>
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="kata_sandi_baru"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kata Sandi Baru</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Masukkan kata sandi baru"
                                className="pr-10"
                                {...field}
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-10 w-10 px-3 py-2"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="sr-only">
                                {showNewPassword
                                  ? "Sembunyikan kata sandi"
                                  : "Tampilkan kata sandi"}
                              </span>
                            </Button>
                          </div>
                          <FormDescription>
                            Gunakan minimal 8 karakter dengan kombinasi huruf,
                            angka, dan simbol.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="konfirmasi_kata_sandi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Konfirmasi Kata Sandi Baru</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Konfirmasi kata sandi baru Anda"
                                className="pr-10"
                                {...field}
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-10 w-10 px-3 py-2"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="sr-only">
                                {showConfirmPassword
                                  ? "Sembunyikan kata sandi"
                                  : "Tampilkan kata sandi"}
                              </span>
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {passwordError && (
                      <Alert variant="destructive">
                        <AlertDescription>{passwordError}</AlertDescription>
                      </Alert>
                    )}

                    {passwordSuccess && (
                      <Alert className="bg-primary/10 border-primary/20">
                        <AlertDescription>{passwordSuccess}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="gap-2"
                      disabled={loadingPassword}
                    >
                      {loadingPassword ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4" />
                          Perbarui Kata Sandi
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border border-primary/20">
              <CardHeader>
                <CardTitle>Pengaturan Sistem</CardTitle>
                <CardDescription>
                  Kelola pengaturan sistem dan otomatisasi platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...settingsForm}>
                  <form
                    onSubmit={settingsForm.handleSubmit(onSettingsSubmit)}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <FormField
                        control={settingsForm.control}
                        name="aktivasi_otomatis_perusahaan"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Aktivasi Otomatis Akun Perusahaan
                              </FormLabel>
                              <FormDescription>
                                Akun perusahaan baru akan otomatis diaktifkan
                                tanpa perlu persetujuan admin.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={settingsForm.control}
                        name="aktivasi_otomatis_mahasiswa"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Aktivasi Otomatis Akun Mahasiswa
                              </FormLabel>
                              <FormDescription>
                                Akun mahasiswa baru akan otomatis diaktifkan
                                tanpa perlu persetujuan admin.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={settingsForm.control}
                        name="notifikasi_pendaftaran_baru"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Notifikasi Pendaftaran Baru
                              </FormLabel>
                              <FormDescription>
                                Terima notifikasi saat ada pendaftaran akun
                                baru.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={settingsForm.control}
                        name="notifikasi_laporan_masalah"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Notifikasi Laporan Masalah
                              </FormLabel>
                              <FormDescription>
                                Terima notifikasi saat ada laporan masalah dari
                                pengguna.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    {settingsError && (
                      <Alert variant="destructive">
                        <AlertDescription>{settingsError}</AlertDescription>
                      </Alert>
                    )}

                    {settingsSuccess && (
                      <Alert className="bg-primary/10 border-primary/20">
                        <AlertDescription>{settingsSuccess}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="gap-2"
                      disabled={loadingSettings}
                    >
                      {loadingSettings ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4" />
                          Simpan Pengaturan
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
