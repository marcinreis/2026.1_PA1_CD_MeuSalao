"use client";

import Link from "next/link";
import { ArrowLeft, Star, MapPin, Clock, X, Trophy, GitCompareArrows } from "lucide-react";
import Navbar from "@/components/navbar";
import SalaoFoto from "@/components/salao-foto";
import { saloes, type Salao } from "@/lib/mock-data";
import { useComparar } from "@/lib/comparar-store";

// Converte "0,4 km" → 0.4 para ranking
function parseDistancia(d: string): number {
  return parseFloat(d.replace(",", ".").replace(/[^0-9.]/g, "")) || Infinity;
}

// Reaproveita a lógica do filtro "aberto agora" da listagem
function estaAbertoAgora(salao: Salao): boolean {
  const agora = new Date();
  const dia = agora.getDay();
  const hora = agora.getHours() + agora.getMinutes() / 60;
  const horario = salao.horarioFuncionamento.toLowerCase();
  if (dia === 0) return horario.includes("dom");
  const dentro = (texto: string) => {
    const m = texto.match(/(\d{1,2})h.*?(\d{1,2})h/);
    if (!m) return false;
    return hora >= parseInt(m[1]) && hora < parseInt(m[2]);
  };
  if (dia === 6) {
    const sab = horario.split("|").find((p) => p.includes("sáb"));
    if (sab) return dentro(sab);
  }
  return dentro(horario.split("|")[0]);
}

// Calcula os vencedores em cada critério (índices dos salões na lista)
function calcularVencedores(lista: Salao[]) {
  const menorPreco = lista
    .map((s, i) => ({ i, v: s.precoMinimo }))
    .filter((x): x is { i: number; v: number } => x.v != null)
    .sort((a, b) => a.v - b.v)[0]?.i;
  const maiorNota = lista
    .map((s, i) => ({ i, v: s.nota }))
    .sort((a, b) => b.v - a.v)[0]?.i;
  const menorDistancia = lista
    .map((s, i) => ({ i, v: parseDistancia(s.distancia) }))
    .sort((a, b) => a.v - b.v)[0]?.i;
  return { menorPreco, maiorNota, menorDistancia };
}

function VencedorBadge() {
  return (
    <span className="inline-flex items-center gap-1 ml-2 bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
      <Trophy className="w-2.5 h-2.5" />
      melhor
    </span>
  );
}

export default function CompararPage() {
  const { ids, remove, clear } = useComparar();
  const lista = ids.map((id) => saloes.find((s) => s.id === id)).filter((s): s is Salao => !!s);
  const venc = calcularVencedores(lista);

  // ─── Empty state ───
  if (lista.length < 2) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        <Navbar paginaAtiva="inicio" />
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <GitCompareArrows className="w-10 h-10 text-violet-700" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Nada para comparar ainda</h1>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Toque no botão de comparar nos cards dos salões para selecionar até 3 e ver lado a lado.
          </p>
          <Link
            href="/cliente"
            className="inline-flex items-center gap-2 bg-violet-700 hover:bg-violet-800 text-white font-bold px-6 py-3 rounded-2xl"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar à lista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">
      <Navbar paginaAtiva="inicio" />

      {/* ── Header da página ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/cliente"
              className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
            <div className="w-px h-5 bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-violet-700 rounded-xl flex items-center justify-center">
                <GitCompareArrows className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-black text-gray-900 text-base leading-none">Comparando salões</h1>
                <p className="text-xs text-gray-400 mt-0.5">{lista.length} de 3 escolhidos</p>
              </div>
            </div>
          </div>
          <button
            onClick={clear}
            className="text-xs text-gray-400 hover:text-gray-700 font-medium"
          >
            Limpar tudo
          </button>
        </div>
      </div>

      {/* ── Tabela de comparação ── */}
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-6">
        <div className="overflow-x-auto -mx-3 md:mx-0 px-3 md:px-0">
          <div
            className="grid gap-3 md:gap-4"
            style={{
              gridTemplateColumns: `repeat(${lista.length}, minmax(260px, 1fr))`,
              minWidth: lista.length * 260 + (lista.length - 1) * 12,
            }}
          >
            {lista.map((salao, idx) => {
              const aberto = estaAbertoAgora(salao);
              return (
                <div
                  key={salao.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
                >
                  {/* Foto + remover */}
                  <div className="relative h-36">
                    <SalaoFoto
                      src={salao.foto}
                      alt={salao.nome}
                      salaoId={salao.id}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <button
                      onClick={() => remove(salao.id)}
                      aria-label={`Remover ${salao.nome} da comparação`}
                      className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-4 flex-1 flex flex-col gap-3 text-sm">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-violet-600 font-bold mb-0.5">
                        {salao.tipo}
                      </p>
                      <h2 className="font-black text-gray-900 text-base leading-tight">{salao.nome}</h2>
                    </div>

                    {/* Avaliação */}
                    <Linha label="Avaliação" destaque={idx === venc.maiorNota}>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-gray-900">{salao.nota}</span>
                        <span className="text-gray-400 text-xs">({salao.totalAvaliacoes})</span>
                      </div>
                    </Linha>

                    {/* Distância */}
                    <Linha label="Distância" destaque={idx === venc.menorDistancia}>
                      <div className="flex items-center gap-1 font-semibold text-gray-700">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {salao.distancia}
                      </div>
                    </Linha>

                    {/* Preço mínimo */}
                    <Linha label="A partir de" destaque={idx === venc.menorPreco}>
                      {salao.precoMinimo != null ? (
                        <span className="font-black text-violet-700">R$ {salao.precoMinimo}</span>
                      ) : (
                        <span className="text-gray-400 font-semibold">Consultar preço</span>
                      )}
                    </Linha>

                    {/* Aberto agora */}
                    <Linha label="Status">
                      {aberto ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          Aberto agora
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          Fechado
                        </span>
                      )}
                    </Linha>

                    {/* Horário */}
                    <Linha label="Horário">
                      <span className="inline-flex items-center gap-1 text-gray-600 text-xs">
                        <Clock className="w-3 h-3" />
                        {salao.horarioFuncionamento}
                      </span>
                    </Linha>

                    {/* Endereço */}
                    <Linha label="Endereço">
                      <span className="text-xs text-gray-600 leading-tight">{salao.endereco}</span>
                    </Linha>

                    {/* Top serviços */}
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">
                        Principais serviços
                      </p>
                      <ul className="space-y-1.5">
                        {salao.servicos.slice(0, 4).map((s) => (
                          <li key={s.id} className="flex items-center justify-between text-xs">
                            <span className="text-gray-700 truncate pr-2">{s.nome}</span>
                            <span className="font-bold text-violet-700 shrink-0">R$ {s.preco}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <Link
                      href={`/cliente/${salao.id}`}
                      className="mt-auto block text-center bg-violet-700 hover:bg-violet-800 text-white font-bold py-3 rounded-xl text-sm transition-colors"
                    >
                      Ver e agendar →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dica para adicionar mais */}
        {lista.length < 3 && (
          <div className="mt-6 text-center">
            <Link href="/cliente" className="text-sm text-violet-700 font-semibold hover:underline">
              + Adicionar mais um salão para comparar
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Linha auxiliar: label + valor, com destaque opcional ("melhor" badge)
function Linha({
  label,
  destaque,
  children,
}: {
  label: string;
  destaque?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={destaque ? "rounded-lg bg-amber-50 -mx-2 px-2 py-1.5" : ""}>
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">{label}</p>
      <div className="flex items-center">
        {children}
        {destaque && <VencedorBadge />}
      </div>
    </div>
  );
}
