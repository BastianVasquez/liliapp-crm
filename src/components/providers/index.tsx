"use client";

import { CrmDataProvider } from "@/lib/store";
import { ToastProvider } from "@/components/providers/toast-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CrmDataProvider>
      <ToastProvider>{children}</ToastProvider>
    </CrmDataProvider>
  );
}
