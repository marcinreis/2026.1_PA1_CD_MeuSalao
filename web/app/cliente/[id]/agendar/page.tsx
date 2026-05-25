"use client";

import { useState, use, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { getSalao, DIAS_SEMANA, formatarMesAno } from "@/lib/mock-data";
import { notFound } from "next/navigation";

export default function AgendarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const servicoId = searchParams.get("servico") ?? "";
  const router = useRouter();

  const salaoData = getSalao(id);
  if (!salaoData) notFound();
  const salao = salaoData;

  const servico = salao.servicos.find((s) => s.id === servicoId);

  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);

  const podeContinuar = diaSelecionado && horarioSelecionado;

  function handleContinuar() {
    if (!podeContinuar) return;
    router.push(`/cliente/${id}/confirmar?servico=${servicoId}&dia=${diaSelecionado}&hora=${horarioSelecionado}`);
  }

  function isOcupado(dia: string, hora: string) {
    return salao.estaOcupado(dia, hora);
  }

  // Agrupa os 90 dias por mês — cada grupo vira uma "aba" no header e uma
  // grade de calendário mensal separada.
  const mesesDisponiveis = useMemo(() => {
    const grupos = new Map<string, string[]>();
    for (const dia of DIAS_SEMANA) {
      const chave = formatarMesAno(dia);
      const lista = grupos.get(chave) ?? [];
      lista.push(dia);
      grupos.set(chave, lista);
    }
    return Array.from(grupos.entries()).map(([nome, dias]) => {
      const [anoStr, mesStr] = dias[0].split("-");
      const ano = parseInt(anoStr);
      const mesIdx = parseInt(mesStr) - 1;
      // Quantos dias o mês tem no total
      const totalDiasMes = new Date(ano, mesIdx + 1, 0).getDate();
      // Dia da semana (0=dom..6=sáb) do dia 1
      const offsetInicio = new Date(ano, mesIdx, 1).getDay();
      // Conjunto de dias selecionáveis nesta visão
      const selecionaveis = new Set(dias);
      // Monta as 6 linhas × 7 colunas = 42 células do grid
      const celulas: { dia: string | null; numero: number | null; selecionavel: boolean }[] = [];
      for (let i = 0; i < offsetInicio; i++) {
        celulas.push({ dia: null, numero: null, selecionavel: false });
      }
      for (let d = 1; d <= totalDiasMes; d++) {
        const dataStr = `${anoStr}-${mesStr}-${String(d).padStart(2, "0")}`;
        celulas.push({ dia: dataStr, numero: d, selecionavel: selecionaveis.has(dataStr) });
      }
      while (celulas.length % 7 !== 0) {
        celulas.push({ dia: null, numero: null, selecionavel: false });
      }
      return { nome, dias, celulas };
    });
  }, []);

  const [mesAtivoIdx, setMesAtivoIdx] = useState(0);
  const mesAtivo = mesesDisponiveis[mesAtivoIdx];
  const HEADER_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Navbar paginaAtiva="inicio" />

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Back */}
        <Link href={`/cliente/${id}`} className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-6 text-sm">
          <ChevronLeft className="w-4 h-4" />
          Voltar para {salao.nome}
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Escolher horário</h1>

        {/* Serviço fixado */}
        {servico && (
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 mb-8">
            <p className="text-xs text-purple-500 font-semibold mb-1 uppercase tracking-wide">Serviço selecionado</p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900">{servico.nome}</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{servico.duracao} min</span>
                </div>
                <span className="font-bold text-purple-600 text-lg">R$ {servico.preco}</span>
              </div>
            </div>
          </div>
        )}

        {/* Seletor de dia */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Escolha o dia</h2>
            {/* Navegador de mês */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMesAtivoIdx((i) => Math.max(0, i - 1))}
                disabled={mesAtivoIdx === 0}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-purple-300 hover:text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Mês anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold text-gray-800 min-w-[110px] text-center capitalize">
                {mesAtivo.nome}
              </span>
              <button
                type="button"
                onClick={() => setMesAtivoIdx((i) => Math.min(mesesDisponiveis.length - 1, i + 1))}
                disabled={mesAtivoIdx === mesesDisponiveis.length - 1}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-purple-300 hover:text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Próximo mês"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Abas de mês (atalho rápido — útil em telas grandes) */}
          {mesesDisponiveis.length > 1 && (
            <div className="flex gap-2 mb-3 flex-wrap">
              {mesesDisponiveis.map((m, i) => (
                <button
                  key={m.nome}
                  onClick={() => setMesAtivoIdx(i)}
                  className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors capitalize ${
                    i === mesAtivoIdx
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-50 text-gray-500 hover:bg-purple-50"
                  }`}
                >
                  {m.nome.split(" ")[0]}
                </button>
              ))}
            </div>
          )}

          {/* Grade de calendário (Dom..Sáb × N linhas) */}
          <div className="grid grid-cols-7 gap-1.5 mb-1">
            {HEADER_SEMANA.map((d) => (
              <div key={d} className="text-center text-[11px] font-bold text-gray-400 uppercase py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {mesAtivo.celulas.map((c, i) => {
              if (c.dia === null) {
                return <div key={`vazio-${i}`} className="aspect-square" aria-hidden />;
              }
              const selecionado = diaSelecionado === c.dia;
              const indisponivel = !c.selecionavel;
              return (
                <button
                  key={c.dia}
                  type="button"
                  disabled={indisponivel}
                  onClick={() => {
                    setDiaSelecionado(c.dia);
                    setHorarioSelecionado(null);
                  }}
                  className={`aspect-square flex items-center justify-center rounded-xl text-sm font-bold border-2 transition-all ${
                    selecionado
                      ? "bg-purple-600 border-purple-600 text-white shadow"
                      : indisponivel
                      ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                      : "bg-white border-gray-100 text-gray-700 hover:border-purple-300 hover:bg-purple-50"
                  }`}
                >
                  {c.numero}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid de horários */}
        {diaSelecionado ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="font-bold text-gray-900 mb-4">Escolha o horário</h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {salao.horariosDisponiveis.map((hora) => {
                const ocupado = isOcupado(diaSelecionado, hora);
                const selecionado = horarioSelecionado === hora;
                return (
                  <button
                    key={hora}
                    disabled={ocupado}
                    onClick={() => setHorarioSelecionado(hora)}
                    className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                      ocupado
                        ? "bg-gray-50 border-gray-100 text-gray-300 line-through cursor-not-allowed"
                        : selecionado
                        ? "bg-purple-50 border-purple-500 text-purple-600"
                        : "bg-white border-gray-100 text-gray-700 hover:border-purple-300"
                    }`}
                  >
                    {hora}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 mb-6 text-center">
            <p className="text-gray-400">Selecione um dia para ver os horários disponíveis</p>
          </div>
        )}

        <button
          onClick={handleContinuar}
          disabled={!podeContinuar}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-colors text-lg"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
