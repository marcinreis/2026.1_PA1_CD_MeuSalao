"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { useAgendaSalao, type StatusAgendamento } from "@/lib/agenda-salao-store";

type Props = {
  salaoId: string;
  agendamentoId: string;
  statusInicial: "confirmado" | "pendente";
};

export default function AgendamentoAcoes({ salaoId, agendamentoId, statusInicial }: Props) {
  const { getStatus, setStatus } = useAgendaSalao();
  const status: StatusAgendamento = getStatus(salaoId, agendamentoId, statusInicial);
  const [feedback, setFeedback] = useState<string | null>(null);

  function aplicar(novo: StatusAgendamento, msg: string) {
    setStatus(salaoId, agendamentoId, novo);
    setFeedback(msg);
  }

  if (status === "confirmado") {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-3 bg-green-50 border border-green-100 rounded-2xl py-5">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <p className="text-green-700 font-semibold">Agendamento confirmado</p>
        </div>
        <button
          onClick={() => aplicar("recusado", "Agendamento recusado.")}
          className="w-full text-sm text-gray-500 hover:text-red-600 font-medium py-2"
        >
          Cancelar este agendamento
        </button>
        {feedback && <p className="text-xs text-center text-gray-500">{feedback}</p>}
      </div>
    );
  }

  if (status === "recusado") {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl py-5">
          <XCircle className="w-6 h-6 text-gray-500" />
          <p className="text-gray-600 font-semibold">Agendamento recusado</p>
        </div>
        <button
          onClick={() => aplicar("confirmado", "Agendamento reativado.")}
          className="w-full text-sm text-violet-600 hover:text-violet-800 font-medium py-2"
        >
          Reativar agendamento
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => aplicar("confirmado", "Cliente recebeu a confirmação.")}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl transition-colors text-lg flex items-center justify-center gap-2"
      >
        <CheckCircle className="w-5 h-5" />
        Confirmar agendamento
      </button>
      <button
        onClick={() => aplicar("recusado", "Cliente foi notificado da recusa.")}
        className="w-full border border-gray-200 hover:border-red-200 text-gray-600 hover:text-red-600 font-bold py-3 rounded-2xl transition-colors text-sm flex items-center justify-center gap-2"
      >
        <XCircle className="w-4 h-4" />
        Recusar
      </button>
      {feedback && <p className="text-xs text-center text-gray-500">{feedback}</p>}
    </div>
  );
}
