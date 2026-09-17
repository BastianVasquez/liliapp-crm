import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted focus:border-lili-purple focus:outline-none focus:ring-2 focus:ring-lili-purple/20",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
