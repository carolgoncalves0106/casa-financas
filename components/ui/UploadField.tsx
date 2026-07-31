"use client";

import { useState, InputHTMLAttributes } from "react";
import { Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";
import FormField from "./FormField";

interface UploadFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  hint?: string;
  onFileChange?: (file: File | null) => void;
}

export default function UploadField({
  label = "Comprovante (opcional)",
  hint,
  id = "comprovante",
  onFileChange,
  ...props
}: UploadFieldProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFile(file: File | null) {
    setFileName(file?.name ?? null);
    onFileChange?.(file);
  }

  return (
    <FormField label={label} htmlFor={id} hint={hint}>
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFile(e.dataTransfer.files?.[0] ?? null);
        }}
        className={cn(
          "flex items-center gap-2 rounded-2xl border border-dashed px-4 py-2.5 text-sm cursor-pointer transition-all duration-200",
          isDragging
            ? "border-clay/50 bg-clay/5"
            : "border-ink/15 bg-cream-soft/50 hover:bg-cream-soft"
        )}
      >
        <Paperclip size={15} className="shrink-0 text-ink-soft" />
        {fileName ? (
          <span className="flex items-center gap-2 text-ink-soft truncate">
            {fileName}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleFile(null);
              }}
              className="text-ink-faint hover:text-bloom transition-colors"
              aria-label="Remover arquivo"
            >
              <X size={13} />
            </button>
          </span>
        ) : (
          <span className="text-ink-soft">
            📎 Anexar comprovante <span className="text-ink-faint">ou arraste um arquivo aqui</span>
          </span>
        )}
        <input
          id={id}
          type="file"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          {...props}
        />
      </label>
    </FormField>
  );
}
