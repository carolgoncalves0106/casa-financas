import { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import FormField from "./FormField";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, id, options, placeholder, className, containerClassName, ...props }, ref) => {
    return (
      <FormField label={label} htmlFor={id} hint={hint} className={containerClassName}>
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              "w-full appearance-none rounded-2xl border border-black/5 bg-cream-soft/60 px-4 py-3 pr-10 text-sm text-ink outline-none transition-all duration-200",
              "focus:bg-white focus:border-clay/40 focus:ring-2 focus:ring-clay/10",
              "hover:border-black/10",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
          />
        </div>
      </FormField>
    );
  }
);

Select.displayName = "Select";

export default Select;
