"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, Star, X, CalendarDays, Sparkles } from "lucide-react";
import Navbar from "@/components/navbar";
import ModalAvaliar from "@/components/modal-avaliar";
import { getSalao, formatarDataCompleta } from "@/lib/mock-data";
import { useMeusAgendamentos, type MeuAgendamento } from "@/lib/agendamentos-store";
import { temAvaliacao, useAvaliacoes } from "@/lib/avaliacoes-store";

type Aba = "proximos" | "passados" | "cancelados";

function aginicio(ag: MeuAgendamento): number {
  return new Date(`${ag.dia}T${ag.hora}:00`).getTime();
}

export default function MeusAgendamentosPage() {
  const { items, cancelar } = useMeusAgendamentos();
  // Subscreve avaliações para re-render ao avaliar (mesmo sem usar lista)
  useAvaliacoes();

  const agora = Date.now();
  const [aba, setAba] = useState<Aba>("proximos");
  const [confirmandoCancel, setConfirmandoCancel] = useState<string | null>(null);
  const [avaliando, setAvaliando] = useState<MeuAgendamento | null>(null);

  const filtrados = useMemo(() => {
    return items
      .filter((ag) => {
        if (aba === "cancelados") return ag.status === "cancelado";
        const futuro = aginicio(ag) >= agora;
        if (aba === "proximos") return ag.status !== "cancelado" && futuro;
        return ag.status !== "cancelado" && !futuro;
      })
      .sort((a, b) => (aba === "proximos" ? aginicio(a) - aginicio(b) : aginicio(b) - aginicio(a)));
  }, [items, aba, agora]);

  const contagens = useMemo(() => {
    const proximos = items.filter((a) => a.status !== "cancelado" && aginicio(a) >= agora).length;
    const passados = items.filter((a) => a.status !== "cancelado" && aginicio(a) < agora).length;
    const cancelados = items.filter((a) => a.status === "cancelado").length;
    return { proximos, passados, cancelados };
  }, [items, agora]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Navbar paginaAtiva="agendamentos" />

      {/* Hero */}
      <div className="bg-violet-900 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays className="w-5 h-5 text-violet-300" />
            <span className="text-violet-200 text-sm">Histórico do cliente</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Meus agendamentos</h1>
          <p className="text-violet-200 mt-2">Consulte, cancele ou avalie seus horários reservados.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-100">
          {(
            [
              { id: "proximos", label: "Próximos", count: contagens.proximos },
              { id: "passados", label: "Anteriores", count: contagens.passados },
              { id: "cancelados", label: "Cancelados", count: contagens.cancelados },
            ] as { id: Aba; label: string; count: number }[]
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setAba(t.id)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                aba === t.id
                  ? "border-violet-700 text-violet-700"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {t.label}
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  aba === t.id ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {filtrados.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-violet-600" />
            </div>
            <p className="text-gray-700 font-bold mb-1">
              {aba === "proximos"
                ? "Nenhum agendamento próximo"
                : aba === "passados"
                ? "Você ainda não tem atendimentos concluídos"
                : "Nenhum agendamento cancelado"}
            </p>
            <p className="text-gray-500 text-sm mb-6">
              {aba === "proximos"
                ? "Encontre um salão e reserve seu horário em poucos toques."
                : "Quando um atendimento for concluído, ele aparece aqui pra você avaliar."}
            </p>
            <Link
              href="/cliente"
              className="inline-flex items-center gap-2 bg-violet-700 hover:bg-violet-800 text-white font-bold px-6 py-3 rounded-2xl"
            >
              Buscar salões
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtrados.map((ag) => {
              const salao = getSalao(ag.salaoId);
              const servico = salao?.servicos.find((s) => s.id === ag.servicoId);
              const passado = aginicio(ag) < agora;
              const cancelado = ag.status === "cancelado";
              const jaAvaliou = temAvaliacao(ag.id);

              return (
                <div key={ag.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Data */}
                    <div className="md:w-32 shrink-0">
                      <div className="bg-violet-50 rounded-xl py-3 px-4 text-center">
                        <p className="text-xs text-violet-600 font-semibold uppercase tracking-wide">
                          {new Date(ag.dia + "T12:00:00").toLocaleDateString("pt-BR", { month: "short" })}
                        </p>
                        <p className="text-2xl font-black text-violet-700">
                          {new Date(ag.dia + "T12:00:00").getDate()}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{ag.hora}</p>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-gray-900 truncate">
                          {salao?.nome ?? "Salão não encontrado"}
                        </h3>
                        {cancelado && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                            Cancelado
                          </span>
                        )}
                        {passado && !cancelado && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                            Concluído
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {servico?.nome ?? "Serviço"} · {servico?.duracao ?? "—"} min
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {salao && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {salao.endereco}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span className="capitalize">{formatarDataCompleta(ag.dia)}</span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {ag.hora}
                        </span>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex md:flex-col gap-2 md:w-44 md:shrink-0">
                      {!cancelado && !passado && (
                        <>
                          {salao && (
                            <Link
                              href={`/cliente/${salao.id}/agendar?servico=${ag.servicoId}`}
                              className="flex-1 md:flex-none text-center text-sm font-semibold py-2.5 rounded-xl border border-violet-200 text-violet-700 hover:bg-violet-50 transition-colors"
                            >
                              Reagendar
                            </Link>
                          )}
                          {confirmandoCancel === ag.id ? (
                            <div className="flex gap-1.5 flex-1">
                              <button
                                onClick={() => {
                                  cancelar(ag.id);
                                  setConfirmandoCancel(null);
                                }}
                                className="flex-1 text-xs font-bold py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600"
                              >
                                Sim, cancelar
                              </button>
                              <button
                                onClick={() => setConfirmandoCancel(null)}
                                className="px-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50"
                                aria-label="Não cancelar"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmandoCancel(ag.id)}
                              className="flex-1 md:flex-none text-sm font-semibold py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500 transition-colors"
                            >
                              Cancelar
                            </button>
                          )}
                        </>
                      )}
                      {passado && !cancelado && (
                        jaAvaliou ? (
                          <span className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 text-sm font-semibold py-2.5 rounded-xl bg-amber-50 text-amber-700">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            Avaliado
                          </span>
                        ) : (
                          <button
                            onClick={() => setAvaliando(ag)}
                            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 text-sm font-bold py-2.5 rounded-xl bg-violet-700 hover:bg-violet-800 text-white transition-colors"
                          >
                            <Star className="w-3.5 h-3.5" />
                            Avaliar
                          </button>
                        )
                      )}
                      {salao && (
                        <Link
                          href={`/cliente/${salao.id}`}
                          className="flex-1 md:flex-none text-center text-xs py-2 text-gray-400 hover:text-gray-700 font-medium"
                        >
                          Ver salão →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {avaliando && (() => {
        const salao = getSalao(avaliando.salaoId);
        const servico = salao?.servicos.find((s) => s.id === avaliando.servicoId);
        return (
          <ModalAvaliar
            aberto
            onClose={() => setAvaliando(null)}
            salaoId={avaliando.salaoId}
            salaoNome={salao?.nome ?? ""}
            servicoNome={servico?.nome}
            agendamentoId={avaliando.id}
          />
        );
      })()}
    </div>
  );
}
