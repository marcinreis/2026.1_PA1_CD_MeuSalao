import Link from "next/link";
import { CheckCircle, Calendar, Clock, MapPin, Mail } from "lucide-react";
import Navbar from "@/components/navbar";
import { getSalao, formatarDataCompleta } from "@/lib/mock-data";

export default async function SucessoPage({
  searchParams,
}: {
  searchParams: Promise<{ salao?: string; servico?: string; dia?: string; hora?: string }>;
}) {
  const { salao: salaoId, servico: servicoId, dia, hora } = await searchParams;
  const salao = salaoId ? getSalao(salaoId) : null;
  const servico = salao?.servicos.find((s) => s.id === servicoId);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Navbar paginaAtiva="inicio" />

      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        {/* Check circle */}
        <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-16 h-16 text-purple-600" strokeWidth={1.5} />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-3">Agendamento Confirmado!</h1>
        <p className="text-gray-500 text-lg mb-10">Seu horário foi reservado com sucesso</p>

        {/* Info grid */}
        {salao && servico && dia && hora && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Data e hora</p>
                  <p className="font-bold text-gray-900 capitalize">{formatarDataCompleta(dia)}</p>
                  <p className="text-gray-600 text-sm">às {hora}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Serviço</p>
                  <p className="font-bold text-gray-900">{servico.nome}</p>
                  <p className="text-gray-600 text-sm">{servico.duracao} minutos</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Local</p>
                  <p className="font-bold text-gray-900">{salao.nome}</p>
                  <p className="text-gray-600 text-sm">{salao.endereco.split("—")[0].trim()}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Confirmação</p>
                  <p className="font-bold text-gray-900">Lembrete enviado</p>
                  <p className="text-gray-600 text-sm">1h antes do horário</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-400 mb-8">
          Enviamos uma confirmação detalhada. Você também receberá um lembrete automático 1 hora antes.
        </p>

        <Link href="/cliente">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-10 py-4 rounded-2xl transition-colors text-lg">
            Voltar ao início
          </button>
        </Link>
      </div>
    </div>
  );
}
