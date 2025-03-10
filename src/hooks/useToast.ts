// src/hooks/useToast.ts
import { useToast as useToastContext } from "@/contexts/ToastContext";

export function useToast() {
  const { addToast, removeToast } = useToastContext();

  return {
    success: (message: string) => addToast(message, "success"),
    error: (message: string) => addToast(message, "error"),
    warning: (message: string) => addToast(message, "warning"),
    info: (message: string) => addToast(message, "info"),
    remove: removeToast,
  };
}
