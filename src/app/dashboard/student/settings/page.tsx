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
import { Eye, EyeOff, Bell, Lock, Trash2, LogOut, Loader2 } from "lucide-react";
import { StudentProfile } from "@/types/api";
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
  email_lowongan_baru: z.boolean().default(true),
  email_status_lamaran: z.boolean().default(true),
  email_pesan_perusahaan: z.boolean().default(true),
  email_newsletter: z.boolean().default(false),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;
type NotificationFormValues = z.infer<typeof notificationSchema>;

export default function StudentSettingsPage() {
  const { user, logout } = useApi();
  const studentUser = user as StudentProfile;

  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

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
      email_lowongan_baru: true,
      email_status_lamaran: true,
      email_pesan_perusahaan: true,
      email_newsletter: false,
    },
  });

  // Password form submit handler
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      setLoadingPassword(true);

      const response = await apiClient.post<undefined>(
        "/auth?action=change-password",
        {
          kata_sandi_lama: data.kata_sandi_lama,
          kata_sandi_baru: data.kata_sandi_baru,
        }
      );

      if (response.sukses) {
        passwordForm.reset();
        window.alert("Kata sandi Anda telah berhasil diperbarui.");
      } else {
        window.alert(
          response.pesan || "Terjadi kesalahan saat memperbarui kata sandi."
        );
      }
    } catch (error) {
      console.error("Error changing password:", error);
      window.alert(
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

      const response = await apiClient.post<undefined>(
        "/mahasiswa/notification-settings",
        {
          ...data,
        }
      );

      if (response.sukses) {
        window.alert("Preferensi notifikasi Anda telah diperbarui.");
      } else {
        window.alert(
          response.pesan ||
            "Terjadi kesalahan saat menyimpan pengaturan notifikasi."
        );
      }
    } catch (error) {
      console.error("Error updating notification settings:", error);
      window.alert(
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

      const response = await apiClient.delete<undefined>(
        "/auth?action=delete-account"
      );

      if (response.sukses) {
        window.alert("Akun Anda telah berhasil dihapus.");
        logout();
      } else {
        window.alert(
          response.pesan || "Terjadi kesalahan saat menghapus akun."
        );
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      window.alert(
        "Terjadi kesalahan saat menghapus akun. Silakan coba lagi nanti."
      );
    } finally {
      setIsDeletingAccount(false);
    }
  };

  if (!user || user.peran !== "mahasiswa") {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pengaturan Akun</h2>
          <p className="text-muted-foreground">
            Kelola pengaturan akun dan preferensi Anda di sini.
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
                  Lihat dan kelola informasi akun dasar Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="text-base font-medium">{studentUser.email}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Nama
                    </p>
                    <p className="text-base font-medium">
                      {studentUser.detail.nama_depan}{" "}
                      {studentUser.detail.nama_belakang}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Universitas
                    </p>
                    <p className="text-base font-medium">
                      {studentUser.detail.universitas?.nama || "Tidak diatur"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Jurusan
                    </p>
                    <p className="text-base font-medium">
                      {studentUser.detail.jurusan || "Tidak diatur"}
                    </p>
                  </div>
                </div>

                <Alert className="bg-primary/5 border-primary/20">
                  <AlertDescription>
                    Untuk mengubah informasi profil Anda, silakan kunjungi
                    halaman{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium text-primary"
                      onClick={() =>
                        (window.location.href = "/dashboard/student/profile")
                      }
                    >
                      Profil
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
                  Tindakan yang tidak dapat dibatalkan untuk akun Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border border-destructive/20 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <p className="font-medium">Hapus Akun</p>
                      <p className="text-sm text-muted-foreground">
                        Menghapus akun Anda secara permanen termasuk semua data
                        dan aktivitas. Tindakan ini tidak dapat dibatalkan.
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
                  Perbarui kata sandi Anda untuk mempertahankan keamanan akun.
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
                        name="email_lowongan_baru"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Notifikasi Lowongan Baru
                                <Badge className="ml-2 bg-primary/20 text-primary hover:bg-primary/30">
                                  Email
                                </Badge>
                              </FormLabel>
                              <FormDescription>
                                Dapatkan notifikasi saat ada lowongan baru yang
                                sesuai dengan keahlian Anda.
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
                        name="email_status_lamaran"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Pembaruan Status Lamaran
                                <Badge className="ml-2 bg-primary/20 text-primary hover:bg-primary/30">
                                  Email
                                </Badge>
                              </FormLabel>
                              <FormDescription>
                                Dapatkan notifikasi saat status lamaran Anda
                                berubah.
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
                        name="email_pesan_perusahaan"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Pesan dari Perusahaan
                                <Badge className="ml-2 bg-primary/20 text-primary hover:bg-primary/30">
                                  Email
                                </Badge>
                              </FormLabel>
                              <FormDescription>
                                Dapatkan notifikasi saat perusahaan mengirimkan
                                pesan kepada Anda.
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
                                Dapatkan berita, tips karir, dan promosi dari
                                Atlas Recruit.
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
