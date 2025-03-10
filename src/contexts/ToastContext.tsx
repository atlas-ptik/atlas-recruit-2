// src/contexts/ToastContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

// Tipe untuk toast
export type ToastType = "success" | "error" | "warning" | "info";

// Interface untuk toast item
export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

// Interface untuk toast context
interface ToastContextType {
  toasts: ToastItem[];
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
}

// Membuat context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Provider component
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Menghapus toast berdasarkan id
  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Menambahkan toast baru
  const addToast = useCallback(
    (message: string, type: ToastType) => {
      const id = Math.random().toString(36).substring(2, 9);

      setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

      // Otomatis menghapus toast setelah 5 detik
      setTimeout(() => {
        removeToast(id);
      }, 5000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

// Custom hook untuk menggunakan toast
export function useToast() {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
