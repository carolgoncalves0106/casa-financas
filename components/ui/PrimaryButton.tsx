import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidthOnMobile?: boolean;
}

const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, fullWidthOnMobile = true, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-2xl bg-butter text-ink font-semibold text-sm px-6 py-3 shadow-soft transition-all duration-200",
          "hover:brightness-[1.03] hover:shadow-lift active:brightness-95 active:scale-[0.98]",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-clay focus-visible:outline-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          fullWidthOnMobile && "w-full sm:w-auto",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

PrimaryButton.displayName = "PrimaryButton";

export default PrimaryButton;
