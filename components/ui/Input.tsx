import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import FormField from "./FormField";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, id, className, containerClassName, ...props }, ref) => {
    return (
      <FormField label={label} htmlFor={id} hint={hint} className={containerClassName}>
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-2xl border border-black/5 bg-cream-soft/60 px-4 py-3 text-sm text-ink placeholder:text-ink-faint outline-none transition-all duration-200",
            "focus:bg-white focus:border-clay/40 focus:ring-2 focus:ring-clay/10",
            "hover:border-black/10",
            className
          )}
          {...props}
        />
      </FormField>
    );
  }
);

Input.displayName = "Input";

export default Input;
