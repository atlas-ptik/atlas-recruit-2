// src/components/toast/toast.tsx
"use client";

import { useToast, ToastItem } from "@/contexts/ToastContext";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

// Komponen untuk satu toast
function ToastMessage({
  toast,
  onClose,
}: {
  toast: ToastItem;
  onClose: () => void;
}) {
  // Icon dan warna berdasarkan tipe toast
  const iconMap = {
    success: {
      icon: <CheckCircle className="w-5 h-5" />,
      color: "bg-green-50 border-green-500 text-green-700",
    },
    error: {
      icon: <AlertCircle className="w-5 h-5" />,
      color: "bg-red-50 border-red-500 text-red-700",
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "bg-yellow-50 border-yellow-500 text-yellow-700",
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      color: "bg-blue-50 border-blue-500 text-blue-700",
    },
  };

  const { icon, color } = iconMap[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`flex items-center p-4 mb-3 rounded-md shadow-md border-l-4 ${color}`}
    >
      <div className="mr-3">{icon}</div>
      <div className="flex-grow pr-3">{toast.message}</div>
      <button
        onClick={onClose}
        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// Komponen container untuk semua toasts
export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastMessage
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
