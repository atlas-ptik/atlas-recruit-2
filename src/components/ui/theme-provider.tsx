// src/components/ui/theme-provider.tsx
"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps as NextThemeProviderProps,
} from "next-themes";

export interface ThemeProviderProps
  extends Omit<NextThemeProviderProps, "attribute"> {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
  themes?: string[];
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...(props as NextThemeProviderProps)}>
      {children}
    </NextThemesProvider>
  );
}
