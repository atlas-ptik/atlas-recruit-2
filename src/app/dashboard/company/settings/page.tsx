// src/app/dashboard/company/settings/page.tsx - Company settings page
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useApi } from "@/contexts/ApiContext";
import {
  Eye,
  EyeOff,
  Bell,
  Lock,
  Trash2,
  LogOut,
  Loader2,
} from "lucide-react";
import { CompanyProfile } from "@/types/api";
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

// Notification settings schema
const notificationSchema = z.object({
  email_lamaran_baru: z.boolean().default(true),
  email_aktivitas_akun: z.boolean().default(true),
  email_pembaruan_sistem: z.boolean().default(true),
  email_newsletter: z.boolean().default(false),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;
type NotificationFormValues = z.infer<typeof notificationSchema>;

export default function CompanySettingsPage() {
  const { user, logout } = useApi();
  const companyUser = user as CompanyProfile;

  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState("");
  const [notificationSuccess, setNotificationSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      kata_sandi_lama: "",
      kata_sandi_baru: "",
      konfirmasi_kata_sandi: "",
    },
  });

  // Notification form
  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      email_lamaran_baru: true,
      email_aktivitas_akun: true,
      email_pembaruan_sistem: true,
      email_newsletter: false,
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

  // Notification form submit handler
  const onNotificationSubmit = async (data: NotificationFormValues) => {
    try {
      setLoadingNotifications(true);
      setNotificationError("");
      setNotificationSuccess("");

      // API call to update notification settings
      const response = await apiClient.post<undefined>(
        "/perusahaan/notification-settings",
        {
          ...data,
        }
      );

      if (response.sukses) {
        setNotificationSuccess("Preferensi notifikasi Anda telah diperbarui.");
      } else {
        setNotificationError(
          response.pesan ||
            "Terjadi kesalahan saat menyimpan pengaturan notifikasi."
        );
      }
    } catch (error) {
      console.error("Error updating notification settings:", error);
      setNotificationError(
        "Terjadi kesalahan saat menyimpan pengaturan notifikasi. Silakan coba lagi nanti."
      );
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Delete account handler
  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan dan semua data Anda akan dihapus permanen."
      )
    ) {
      return;
    }

    try {
      setIsDeletingAccount(true);
      setDeleteError("");

      // API call to delete account
      const response = await apiClient.delete<undefined>(
        "/auth?action=delete-account"
      );

      if (response.sukses) {
        // Log out the user
        logout();
      } else {
        setDeleteError(
          response.pesan || "Terjadi kesalahan saat menghapus akun."
        );
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setDeleteError(
        "Terjadi kesalahan saat menghapus akun. Silakan coba lagi nanti."
      );
    } finally {
      setIsDeletingAccount(false);
    }
  };

  if (!user || user.peran !== "perusahaan") {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pengaturan Akun</h2>
          <p className="text-muted-foreground">
            Kelola pengaturan akun perusahaan dan preferensi Anda di sini.
          </p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList>
            <TabsTrigger value="account">Akun</TabsTrigger>
            <TabsTrigger value="password">Kata Sandi</TabsTrigger>
            <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border border-primary/20">
              <CardHeader>
                <CardTitle>Informasi Akun</CardTitle>
                <CardDescription>
                  Lihat dan kelola informasi akun dasar perusahaan Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="text-base font-medium">{companyUser.email}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Nama Perusahaan
                    </p>
                    <p className="text-base font-medium">
                      {companyUser.detail.nama}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Industri
                    </p>
                    <p className="text-base font-medium">
                      {companyUser.detail.industri}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Lokasi
                    </p>
                    <p className="text-base font-medium">
                      {companyUser.detail.lokasi || "Tidak diatur"}
                    </p>
                  </div>
                </div>

                <Alert className="bg-primary/5 border-primary/20">
                  <AlertDescription>
                    Untuk mengubah informasi profil perusahaan Anda, silakan
                    kunjungi halaman{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium text-primary"
                      onClick={() =>
                        (window.location.href = "/dashboard/company/profile")
                      }
                    >
                      Profil Perusahaan
                    </Button>
                    .
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">
                  Zona Berbahaya
                </CardTitle>
                <CardDescription>
                  Tindakan yang tidak dapat dibatalkan untuk akun perusahaan
                  Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border border-destructive/20 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <p className="font-medium">Hapus Akun Perusahaan</p>
                      <p className="text-sm text-muted-foreground">
                        Menghapus akun perusahaan Anda secara permanen termasuk
                        semua data, lowongan, dan aktivitas. Tindakan ini tidak
                        dapat dibatalkan.
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteAccount}
                      disabled={isDeletingAccount}
                      className="shrink-0 self-start"
                    >
                      {isDeletingAccount ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus Akun
                        </>
                      )}
                    </Button>
                  </div>
                  {deleteError && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertDescription>{deleteError}</AlertDescription>
                    </Alert>
                  )}
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
                  perusahaan.
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

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border border-primary/20">
              <CardHeader>
                <CardTitle>Preferensi Notifikasi</CardTitle>
                <CardDescription>
                  Kelola bagaimana dan kapan Anda menerima pembaruan dan
                  notifikasi.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationForm}>
                  <form
                    onSubmit={notificationForm.handleSubmit(
                      onNotificationSubmit
                    )}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <FormField
                        control={notificationForm.control}
                        name="email_lamaran_baru"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Notifikasi Lamaran Baru
                                <Badge className="ml-2 bg-primary/20 text-primary hover:bg-primary/30">
                                  Email
                                </Badge>
                              </FormLabel>
                              <FormDescription>
                                Dapatkan notifikasi saat ada pelamar baru untuk
                                lowongan Anda.
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
                        control={notificationForm.control}
                        name="email_aktivitas_akun"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Aktivitas Akun
                                <Badge className="ml-2 bg-primary/20 text-primary hover:bg-primary/30">
                                  Email
                                </Badge>
                              </FormLabel>
                              <FormDescription>
                                Dapatkan notifikasi tentang aktivitas akun dan
                                keamanan.
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
                        control={notificationForm.control}
                        name="email_pembaruan_sistem"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Pembaruan Sistem
                                <Badge className="ml-2 bg-primary/20 text-primary hover:bg-primary/30">
                                  Email
                                </Badge>
                              </FormLabel>
                              <FormDescription>
                                Dapatkan notifikasi tentang pembaruan platform
                                dan fitur baru.
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
                        control={notificationForm.control}
                        name="email_newsletter"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Newsletter & Promo
                                <Badge className="ml-2 bg-primary/20 text-primary hover:bg-primary/30">
                                  Email
                                </Badge>
                              </FormLabel>
                              <FormDescription>
                                Dapatkan berita, tips rekrutmen, dan promosi
                                dari Atlas Recruit.
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

                    {notificationError && (
                      <Alert variant="destructive">
                        <AlertDescription>{notificationError}</AlertDescription>
                      </Alert>
                    )}

                    {notificationSuccess && (
                      <Alert className="bg-primary/10 border-primary/20">
                        <AlertDescription>
                          {notificationSuccess}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="gap-2"
                      disabled={loadingNotifications}
                    >
                      {loadingNotifications ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Bell className="h-4 w-4" />
                          Simpan Preferensi
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
      </div>
    </DashboardLayout>
  );
}
