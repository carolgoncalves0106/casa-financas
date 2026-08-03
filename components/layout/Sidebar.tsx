"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/nav-items";
import { cn } from "@/lib/utils";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import LogoutButton from "@/components/auth/LogoutButton";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 lg:h-screen lg:sticky lg:top-0 border-r border-black/5 bg-cream-soft px-5 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <span className="text-2xl leading-none">🏡</span>
        <div className="flex-1 min-w-0">
          <p className="font-display text-lg font-semibold text-ink leading-tight">
            Nossa Casa
          </p>
          <p className="text-xs text-ink-faint leading-tight">finanças da família</p>
        </div>
        <LogoutButton />
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-white text-ink shadow-softer"
                  : "text-ink-soft hover:bg-white/70 hover:text-ink"
              )}
            >
              <Icon
                size={18}
                strokeWidth={2}
                className={cn(
                  "shrink-0",
                  isActive ? "text-clay" : "text-ink-faint group-hover:text-clay"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <FloatingActionButton
        variant="inline"
        className="flex w-full justify-center mb-4"
      />

      {/* Ilustração da casinha — só um toque aconchegante no fim do menu */}
      <div className="relative rounded-3xl bg-gradient-to-b from-peach-soft to-sage-soft/60 pt-6 pb-4 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute -top-4 -left-4 h-16 w-16 rounded-full bg-white/40" />
        <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-white/30" />
        <span className="relative text-4xl">🏡</span>
        <p className="relative text-xs text-ink-soft mt-2 px-4 leading-snug">
          Cada lançamento deixa a casa mais organizada 💛
        </p>
      </div>
    </aside>
  );
}
