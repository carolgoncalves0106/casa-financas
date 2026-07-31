"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mobileNavItems } from "@/lib/nav-items";
import { cn } from "@/lib/utils";
import FloatingActionButton from "@/components/ui/FloatingActionButton";

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <>
      <FloatingActionButton variant="floating" className="lg:hidden" />

      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-20 bg-white/95 backdrop-blur border-t border-black/5 pb-[env(safe-area-inset-bottom)]">
        <ul className="flex items-stretch justify-between px-2">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                    isActive ? "text-clay" : "text-ink-faint"
                  )}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
