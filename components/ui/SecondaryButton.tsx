import { ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidthOnMobile?: boolean;
  /** Quando informado, o botão é renderizado como um link (navegação) em vez de <button> */
  href?: string;
}

const SecondaryButton = forwardRef<HTMLButtonElement, SecondaryButtonProps>(
  ({ className, fullWidthOnMobile = true, href, children, ...props }, ref) => {
    const classes = cn(
      "inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-black/10 text-ink font-semibold text-sm px-6 py-3 shadow-softer transition-all duration-200",
      "hover:bg-cream-soft hover:border-black/15 active:scale-[0.98]",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-clay focus-visible:outline-offset-2",
      "disabled:opacity-50 disabled:pointer-events-none",
      fullWidthOnMobile && "w-full sm:w-auto",
      className
    );

    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

SecondaryButton.displayName = "SecondaryButton";

export default SecondaryButton;
