"use client";

import Link from "next/link";
import type { AgendamentoSalao } from "@/lib/mock-data";
import { useAgendaSalao } from "@/lib/agenda-salao-store";

export default function AgendaItem({ agendamento, salaoId }: { agendamento: AgendamentoSalao; salaoId: string }) {
  const { getStatus } = useAgendaSalao();
  const status = getStatus(salaoId, agendamento.id, agendamento.status);

  const badge =
    status === "confirmado"
      ? { label: "Confirmado", cls: "bg-green-100 text-green-700" }
      : status === "recusado"
      ? { label: "Recusado", cls: "bg-gray-100 text-gray-500" }
      : { label: "Pendente", cls: "bg-amber-100 text-amber-700" };

  return (
    <Link href={`/salao/agendamento/${agendamento.id}?salao=${salaoId}`}>
      <div className="flex items-center gap-4 py-3 px-2 rounded-xl hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
        <div className="w-14 text-center shrink-0">
          <span className="font-bold text-gray-900">{agendamento.hora}</span>
        </div>
        <div className="flex-1">
          <p className={`font-semibold text-sm ${status === "recusado" ? "text-gray-400 line-through" : "text-gray-900"}`}>
            {agendamento.cliente}
          </p>
          <p className="text-xs text-gray-500">{agendamento.servico}</p>
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded-full shrink-0 ${badge.cls}`}>
          {badge.label}
        </span>
      </div>
    </Link>
  );
}
