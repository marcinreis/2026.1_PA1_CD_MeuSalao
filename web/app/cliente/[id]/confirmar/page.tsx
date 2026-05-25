import Link from "next/link";
import { MapPin, Clock, Calendar, ChevronLeft } from "lucide-react";
import Navbar from "@/components/navbar";
import ConfirmarAgendamentoBotao from "@/components/confirmar-agendamento-botao";
import { getSalao, formatarDataCompleta } from "@/lib/mock-data";
import { notFound } from "next/navigation";

export default async function ConfirmarPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ servico?: string; dia?: string; hora?: string }>;
}) {
  const { id } = await params;
  const { servico: servicoId, dia, hora } = await searchParams;

  const salao = getSalao(id);
  if (!salao || !servicoId || !dia || !hora) notFound();

  const servico = salao.servicos.find((s) => s.id === servicoId);
  if (!servico) notFound();

  const sucesso = `/cliente/sucesso?salao=${id}&servico=${servicoId}&dia=${dia}&hora=${hora}`;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Navbar paginaAtiva="inicio" />

      <div className="max-w-2xl mx-auto px-6 py-8">
        <Link href={`/cliente/${id}/agendar?servico=${servicoId}`} className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-6 text-sm">
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Confirmar agendamento</h1>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-700 mb-5">Resumo do agendamento</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Salão</p>
              <p className="font-bold text-gray-900">{salao.nome}</p>
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <p className="text-sm text-gray-500">{salao.endereco}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Serviço</p>
              <p className="font-bold text-gray-900">{servico.nome}</p>
              <div className="flex items-center gap-1 mt-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <p className="text-sm text-gray-500">{servico.duracao} minutos</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Data</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                <p className="font-bold text-gray-900 capitalize">{formatarDataCompleta(dia)}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Horário</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-500" />
                <p className="font-bold text-gray-900">{hora}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5 flex items-center justify-between">
            <p className="text-gray-600 font-medium">Total</p>
            <p className="text-2xl font-bold text-purple-600">R$ {servico.preco}</p>
          </div>
        </div>

        <p className="text-sm text-gray-400 text-center mb-6">
          Ao confirmar, você receberá um lembrete automático 24h antes do atendimento.
        </p>

        <ConfirmarAgendamentoBotao
          salaoId={id}
          servicoId={servicoId}
          dia={dia}
          hora={hora}
          sucessoHref={sucesso}
        />
      </div>
    </div>
  );
}
