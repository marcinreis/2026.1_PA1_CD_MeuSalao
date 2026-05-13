"use client";

import { useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { getSalao, DIAS_SEMANA, formatarDia } from "@/lib/mock-data";
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
    return salao.horariosOcupados.has(`${dia}|${hora}`);
  }

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
          <h2 className="font-bold text-gray-900 mb-4">Escolha o dia</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {DIAS_SEMANA.map((dia) => {
              const { diaSemana, dia: diaNum } = formatarDia(dia);
              const selecionado = diaSelecionado === dia;
              return (
                <button
                  key={dia}
                  onClick={() => { setDiaSelecionado(dia); setHorarioSelecionado(null); }}
                  className={`shrink-0 flex flex-col items-center w-14 py-3 rounded-2xl border-2 transition-all ${
                    selecionado
                      ? "bg-purple-50 border-purple-500 text-purple-600"
                      : "bg-white border-gray-100 text-gray-600 hover:border-purple-200"
                  }`}
                >
                  <span className="text-xs font-medium">{diaSemana}</span>
                  <span className={`text-xl font-bold mt-1 ${selecionado ? "text-purple-600" : "text-gray-900"}`}>{diaNum}</span>
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
