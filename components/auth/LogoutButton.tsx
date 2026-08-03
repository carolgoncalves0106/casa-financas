import { LogOut } from "lucide-react";
import { signOut } from "@/lib/supabase/actions";

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className={
          className ??
          "flex items-center gap-2 text-xs font-medium text-ink-faint hover:text-bloom transition-colors px-2 py-1.5"
        }
      >
        <LogOut size={14} />
        Sair
      </button>
    </form>
  );
}
