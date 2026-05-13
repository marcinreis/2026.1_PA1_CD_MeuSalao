"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Store } from "lucide-react";

const ITENS = [
  { href: "/cliente", label: "Início", icon: Home, match: (p: string) => p === "/cliente" || p.startsWith("/cliente/sala") },
  { href: "/cliente/mapa", label: "Mapa", icon: Map, match: (p: string) => p.startsWith("/cliente/mapa") },
  { href: "/salao/onboarding", label: "Sou Salão", icon: Store, match: (p: string) => p.startsWith("/salao") },
];

export default function MobileNav() {
  const path = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-2px_8px_rgba(0,0,0,0.04)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-3">
        {ITENS.map(({ href, label, icon: Icon, match }) => {
          const ativo = match(path);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center py-2.5 gap-1 transition-colors ${
                ativo ? "text-violet-700" : "text-gray-400"
              }`}
            >
              <Icon className={`w-5 h-5 ${ativo ? "stroke-[2.5]" : ""}`} />
              <span className="text-[10px] font-semibold tracking-tight">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
