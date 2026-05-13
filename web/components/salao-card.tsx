"use client";

import Link from "next/link";
import { MapPin, Star, Clock, Check, GitCompareArrows } from "lucide-react";
import type { Salao } from "@/lib/mock-data";
import SalaoFoto from "@/components/salao-foto";
import { useComparar } from "@/lib/comparar-store";

const TAGS_DESTAQUE: Record<string, { label: string; color: string }> = {
  "studio-renata": { label: "Destaque", color: "bg-amber-400 text-amber-900" },
  "salao-da-marcia": { label: "Popular", color: "bg-green-500 text-white" },
  "barba-e-corte": { label: "Especialista", color: "bg-blue-500 text-white" },
  "espaco-bella": { label: "Novo", color: "bg-violet-500 text-white" },
};

export default function SalaoCard({ salao }: { salao: Salao }) {
  const tag = TAGS_DESTAQUE[salao.id];
  const { isSelected, toggle, full } = useComparar();
  const selecionado = isSelected(salao.id);
  const desabilitado = !selecionado && full;

  return (
    <Link href={`/cliente/${salao.id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
        {/* Photo */}
        <div className="relative h-52 overflow-hidden">
          <SalaoFoto
            src={salao.foto}
            alt={salao.nome}
            salaoId={salao.id}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Dark gradient at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Top-right: rating + compare toggle */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
            <button
              type="button"
              aria-label={selecionado ? "Remover da comparação" : "Adicionar à comparação"}
              aria-pressed={selecionado}
              disabled={desabilitado}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!desabilitado) toggle(salao.id);
              }}
              title={
                desabilitado
                  ? "Você já está comparando 3 salões"
                  : selecionado
                    ? "Remover da comparação"
                    : "Comparar este salão"
              }
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${
                selecionado
                  ? "bg-violet-700 text-white"
                  : desabilitado
                    ? "bg-white/60 text-gray-300 cursor-not-allowed"
                    : "bg-white text-gray-600 hover:text-violet-700 hover:scale-110"
              }`}
            >
              {selecionado ? <Check className="w-4 h-4" /> : <GitCompareArrows className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-1 bg-white rounded-full px-2.5 py-1 shadow-md">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-gray-900">{salao.nota}</span>
            </div>
          </div>

          {/* Tag badge */}
          {tag && (
            <div className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${tag.color}`}>
              {tag.label}
            </div>
          )}

          {/* Tipo label at bottom of photo */}
          <div className="absolute bottom-3 left-3">
            <span className="text-white/90 text-xs font-medium">{salao.tipo}</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-gray-900 text-base leading-tight">{salao.nome}</h3>
            <div className="flex items-center gap-1 shrink-0 text-xs text-gray-400">
              <MapPin className="w-3 h-3" />
              <span>{salao.distancia}</span>
            </div>
          </div>

          {/* Service tags */}
          <div className="flex gap-1.5 flex-wrap mb-3">
            {salao.tags.slice(0, 3).map((t) => (
              <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {t}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div>
              {salao.precoMinimo != null ? (
                <>
                  <span className="text-xs text-gray-400">A partir de </span>
                  <span className="font-black text-violet-700 text-lg">R$ {salao.precoMinimo}</span>
                </>
              ) : (
                <span className="text-sm font-semibold text-gray-400">Consultar preço</span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{salao.totalAvaliacoes} avaliações</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
