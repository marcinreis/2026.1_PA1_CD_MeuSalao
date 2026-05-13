"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GitCompareArrows, X } from "lucide-react";
import { useComparar } from "@/lib/comparar-store";

export default function CompararBar() {
  const { count, clear } = useComparar();
  const path = usePathname();

  // Esconde na própria página de comparação (evita redundância) ou quando tem <2 selecionados
  if (count < 2 || path.startsWith("/cliente/comparar")) return null;

  return (
    <div
      className="fixed left-3 right-3 z-30 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-auto bottom-20 md:bottom-6"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="bg-violet-700 text-white rounded-2xl shadow-2xl flex items-center gap-3 px-4 py-3 md:px-5">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <GitCompareArrows className="w-5 h-5 shrink-0" />
          <span className="font-bold text-sm">
            {count} {count === 1 ? "salão" : "salões"} para comparar
          </span>
        </div>
        <Link
          href="/cliente/comparar"
          className="bg-white text-violet-700 hover:bg-violet-50 font-bold px-4 py-1.5 rounded-xl text-sm transition-colors whitespace-nowrap"
        >
          Comparar →
        </Link>
        <button
          onClick={clear}
          aria-label="Limpar seleção"
          className="text-white/70 hover:text-white shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
