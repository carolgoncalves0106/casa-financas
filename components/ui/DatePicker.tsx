import { InputHTMLAttributes, forwardRef } from "react";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import FormField from "./FormField";

interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  hint?: string;
  containerClassName?: string;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, hint, id, className, containerClassName, ...props }, ref) => {
    return (
      <FormField label={label} htmlFor={id} hint={hint} className={containerClassName}>
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type="date"
            className={cn(
              "w-full rounded-2xl border border-black/5 bg-cream-soft/60 pl-4 pr-10 py-3 text-sm text-ink outline-none transition-all duration-200",
              "focus:bg-white focus:border-clay/40 focus:ring-2 focus:ring-clay/10",
              "hover:border-black/10",
              className
            )}
            {...props}
          />
          <CalendarDays
            size={16}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
          />
        </div>
      </FormField>
    );
  }
);

DatePicker.displayName = "DatePicker";

export default DatePicker;
