// src/app/forgot-password/page.tsx - Forgot password page
"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Briefcase, ArrowLeft, Mail, Loader2 } from "lucide-react";
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
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email harus diisi" })
    .email({ message: "Format email tidak valid" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Form definition
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Submit handler
  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setIsSubmitting(true);
      setError("");

      // API call to request password reset
      const response = await apiClient.post<undefined>(
        "/auth?action=forgot-password",
        {
          email: data.email,
        }
      );

      if (response.sukses) {
        setSuccess(true);
      } else {
        setError(
          response.pesan || "Terjadi kesalahan. Silakan coba lagi nanti."
        );
      }
    } catch (err) {
      console.error("Error requesting password reset:", err);
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
            <CardTitle className="text-2xl">Lupa Kata Sandi</CardTitle>
            <CardDescription>
              Masukkan email Anda dan kami akan mengirimkan tautan untuk
              mengatur ulang kata sandi Anda.
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="nama@email.com"
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
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
                      "Kirim Tautan Reset"
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <Alert className="bg-primary/10 border-primary/20 text-foreground">
                <AlertDescription>
                  Tautan reset kata sandi telah dikirim ke alamat email Anda.
                  Silakan periksa kotak masuk Anda dan ikuti petunjuk untuk
                  melakukan reset kata sandi.
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
