"use client";

import { useState } from "react";
import { Search, MapPin, ChevronRight, Map } from "lucide-react";
import Navbar from "@/components/navbar";
import SalaoCard from "@/components/salao-card";
import SalaoFoto from "@/components/salao-foto";
import { saloes } from "@/lib/mock-data";
import Link from "next/link";

const CATEGORIAS = [
  { emoji: "✂️", label: "Corte", tag: "Cabelo" },
  { emoji: "🎨", label: "Coloração", tag: "Coloração" },
  { emoji: "💅", label: "Manicure", tag: "Manicure" },
  { emoji: "🪒", label: "Barba", tag: "Barba" },
  { emoji: "✨", label: "Estética", tag: "Estética" },
  { emoji: "👶", label: "Infantil", tag: "Infantil" },
  { emoji: "💇", label: "Escova", tag: "Cabelo" },
  { emoji: "🌿", label: "Tratamento", tag: "Cabelo" },
];

export default function ClientePage() {
  const [busca, setBusca] = useState("");
  const [tagSelecionada, setTagSelecionada] = useState<string | null>(null);

  const saloesFiltrados = saloes.filter((s) => {
    const matchBusca =
      !busca ||
      s.nome.toLowerCase().includes(busca.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(busca.toLowerCase()));
    const matchTag = !tagSelecionada || s.tags.includes(tagSelecionada);
    return matchBusca && matchTag;
  });

  const destaque = saloes[1]; // Studio Renata

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar paginaAtiva="inicio" />

      {/* Hero */}
      <div className="relative bg-violet-900 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-600/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          {/* Location */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm px-3 py-1.5 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-violet-300" />
              <span>Fortaleza, CE</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-none mb-3 tracking-tight">
            Encontre o salão<br />
            <span className="text-violet-300">perfeito perto</span><br />
            de você
          </h1>
          <p className="text-violet-200 text-lg mb-8 max-w-md">
            Compare preços, veja avaliações reais e agende sem precisar ligar.
          </p>

          {/* Search bar */}
          <div className="flex gap-3 max-w-xl">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar salões ou serviços..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 shadow-xl"
              />
            </div>
            <button className="bg-violet-500 hover:bg-violet-400 text-white font-bold px-6 py-4 rounded-2xl transition-colors shadow-xl shrink-0 text-sm">
              Buscar
            </button>
          </div>

          {/* ── Botão de mapa — logo abaixo da busca ── */}
          <div className="mt-4 max-w-xl">
            <Link href="/cliente/mapa">
              <button className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 text-white text-sm font-semibold px-5 py-3 rounded-2xl transition-all duration-200 group">
                <Map className="w-4 h-4 text-violet-300 group-hover:scale-110 transition-transform" />
                Ver salões no mapa
                <span className="text-violet-300 text-xs ml-1">→</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Category scroll */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setTagSelecionada(null)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                !tagSelecionada
                  ? "bg-violet-700 text-white border-violet-700 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-violet-300 hover:text-violet-700"
              }`}
            >
              Todos
            </button>
            {CATEGORIAS.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setTagSelecionada(cat.tag === tagSelecionada ? null : cat.tag)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  tagSelecionada === cat.tag
                    ? "bg-violet-700 text-white border-violet-700 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-violet-300 hover:text-violet-700"
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">

        {/* Featured salon */}
        {!tagSelecionada && !busca && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-gray-900">Em destaque</h2>
              <Link href={`/cliente/${destaque.id}`} className="flex items-center gap-1 text-violet-700 text-sm font-semibold hover:underline">
                Ver mais <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <Link href={`/cliente/${destaque.id}`} className="block group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex flex-col md:flex-row">
                  {/* Photo */}
                  <div className="relative md:w-2/5 h-56 md:h-auto overflow-hidden">
                    <SalaoFoto
                      src={destaque.foto}
                      alt={destaque.nome}
                      salaoId={destaque.id}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/40 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 bg-amber-400 text-amber-900 text-xs font-black px-3 py-1 rounded-full">
                      ⭐ Melhor avaliado
                    </div>
                  </div>
                  {/* Info */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-violet-100 text-violet-700 font-semibold px-2.5 py-1 rounded-full">{destaque.tipo}</span>
                        <span className="text-xs text-gray-400">{destaque.distancia}</span>
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mb-2">{destaque.nome}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{destaque.descricao}</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {destaque.tags.map((t) => (
                          <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-400">A partir de</p>
                        <p className="text-2xl font-black text-violet-700">R$ {destaque.precoMinimo}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl">
                          <span className="text-amber-400 text-sm">★</span>
                          <span className="font-bold text-gray-900 text-sm">{destaque.nota}</span>
                          <span className="text-gray-400 text-xs">({destaque.totalAvaliacoes})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Main grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-gray-900">
              {tagSelecionada ? `${tagSelecionada}` : "Próximos a você"}
            </h2>
            <span className="text-sm text-gray-400 font-medium">
              {saloesFiltrados.length} salão{saloesFiltrados.length !== 1 ? "s" : ""} encontrado{saloesFiltrados.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {saloesFiltrados.length > 0 ? (
              saloesFiltrados.map((salao) => (
                <SalaoCard key={salao.id} salao={salao} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-gray-500 font-medium">Nenhum salão encontrado para &quot;{busca}&quot;</p>
                <button onClick={() => setBusca("")} className="mt-3 text-violet-600 text-sm font-semibold hover:underline">
                  Limpar busca
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
