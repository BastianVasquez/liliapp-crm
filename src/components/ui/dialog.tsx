"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export function DialogContent({
  className,
  children,
  title,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { title: string }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=open]:fade-in" />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-surface p-6 shadow-xl focus:outline-none",
          className
        )}
        {...props}
      >
        <div className="mb-5 flex items-center justify-between">
          <DialogPrimitive.Title className="text-base font-semibold text-foreground">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Close className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-foreground">
            <X className="h-4.5 w-4.5" />
          </DialogPrimitive.Close>
        </div>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
