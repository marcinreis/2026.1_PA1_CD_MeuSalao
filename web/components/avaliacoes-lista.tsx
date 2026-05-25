"use client";

import type { Avaliacao } from "@/lib/mock-data";
import AvaliacaoItem from "./avaliacao-item";
import { useAvaliacoes } from "@/lib/avaliacoes-store";

type Props = {
  salaoId: string;
  base: Avaliacao[];
  layout?: "card" | "stack";
};

export default function AvaliacoesLista({ salaoId, base, layout = "card" }: Props) {
  const { items } = useAvaliacoes(salaoId);

  const adicionais: Avaliacao[] = items.map((a) => ({
    id: a.id,
    cliente: a.cliente,
    nota: a.nota,
    texto: a.texto,
    data: a.data,
  }));

  const todas = [...adicionais, ...base];

  if (todas.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">
        Ainda não há avaliações. Seja a primeira a avaliar!
      </p>
    );
  }

  return (
    <div className={layout === "card" ? "space-y-3" : "space-y-4"}>
      {todas.map((av) => (
        <AvaliacaoItem key={av.id} avaliacao={av} />
      ))}
    </div>
  );
}
