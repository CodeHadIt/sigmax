import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full border-0 bg-[#222222] px-4 py-2 text-sm text-[#D9D9D9] ring-offset-background placeholder:text-[#666666] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        value={value === undefined ? "" : value}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
