import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

export default function FormField({ label, htmlFor, hint, className, children }: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink-soft">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}

export const inputClass =
  "w-full rounded-2xl border border-black/5 bg-cream-soft/60 px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:bg-white focus:border-clay/30 outline-none transition";
