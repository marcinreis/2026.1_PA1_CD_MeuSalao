"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { MapPin, ArrowLeft, Sparkles } from "lucide-react";
import Navbar from "@/components/navbar";

// ── CRÍTICO: importação dinâmica desativa SSR para o Leaflet ──────────────
// O Leaflet acessa `window` e `document`, que não existem no servidor (SSR).
// Sem o { ssr: false } aqui, o build quebra com ReferenceError.
const Mapa = dynamic(() => import("@/components/ui/mapa"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <MapPin className="w-8 h-8 text-violet-600" />
        </div>
        <p className="text-gray-500 font-medium">Carregando mapa...</p>
        <p className="text-gray-400 text-sm mt-1">Buscando salões próximos</p>
      </div>
    </div>
  ),
});

export default function MapaPage() {
  return (
    <div className="h-[calc(100vh-4rem)] md:h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Navbar paginaAtiva="inicio" />

      {/* ── Header da página ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/cliente"
              className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>

            <div className="w-px h-5 bg-gray-200" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-violet-700 rounded-xl flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-black text-gray-900 text-base leading-none">
                  Salões próximos
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  Clique em um pin para ver serviços
                </p>
              </div>
            </div>
          </div>

          {/* Badge de quantidade */}
          <div className="flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-700 text-sm font-semibold px-4 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            4 salões na região
          </div>
        </div>
      </div>

      {/* ── Mapa (ocupa o restante da tela) ── */}
      <div className="flex-1 relative min-h-0">
        <Mapa />
      </div>
    </div>
  );
}
