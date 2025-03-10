// src/app/reset-password/page.tsx - Reset password page
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Briefcase,
  ArrowLeft,
  LockKeyhole,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { APP_NAME, PATHS } from "@/lib/constants";
import apiClient from "@/lib/api/apiClient";

// Form schema
const resetPasswordSchema = z
  .object({
    token: z.string().min(1, { message: "Token tidak valid" }),
    kata_sandi: z
      .string()
      .min(8, { message: "Kata sandi harus minimal 8 karakter" }),
    konfirmasi_kata_sandi: z
      .string()
      .min(1, { message: "Konfirmasi kata sandi harus diisi" }),
  })
  .refine((data) => data.kata_sandi === data.konfirmasi_kata_sandi, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["konfirmasi_kata_sandi"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Form definition
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      kata_sandi: "",
      konfirmasi_kata_sandi: "",
    },
  });

  // Submit handler
  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      setIsSubmitting(true);
      setError("");

      // API call to reset password
      const response = await apiClient.post<undefined>(
        "/auth?action=reset-password",
        {
          token: data.token,
          kata_sandi: data.kata_sandi,
        }
      );

      if (response.sukses) {
        setSuccess(true);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push(PATHS.LOGIN + "?reset=success");
        }, 3000);
      } else {
        setError(
          response.pesan || "Terjadi kesalahan. Silakan coba lagi nanti."
        );
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      setError("Terjadi kesalahan. Silakan coba lagi nanti.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0D0D0D_1px,transparent_1px),linear-gradient(to_bottom,#0D0D0D_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[60%] w-[100%] translate-y-0 rounded-full bg-primary/10 opacity-50 blur-[100px]" />
      </div>

      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Link
            href={PATHS.HOME}
            className="flex items-center text-2xl font-bold text-foreground"
          >
            <Briefcase className="h-6 w-6 text-primary mr-2" />
            {APP_NAME}
          </Link>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Reset Kata Sandi</CardTitle>
            <CardDescription>
              Buat kata sandi baru untuk akun Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!success ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="kata_sandi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kata Sandi Baru</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              className="pl-9 pr-10"
                              {...field}
                            />
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="konfirmasi_kata_sandi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Konfirmasi Kata Sandi</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              className="pl-9 pr-10"
                              {...field}
                            />
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Hidden token field */}
                  <FormField
                    control={form.control}
                    name="token"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormControl>
                          <Input type="hidden" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      "Reset Kata Sandi"
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <Alert className="bg-primary/10 border-primary/20 text-foreground">
                <AlertDescription>
                  Kata sandi Anda berhasil direset. Anda akan dialihkan ke
                  halaman login...
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-4">
            <div className="text-sm text-muted-foreground">
              <Button variant="link" asChild className="p-0">
                <Link
                  href={PATHS.LOGIN}
                  className="flex items-center text-primary"
                >
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  Kembali ke halaman login
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
