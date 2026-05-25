"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { criarAgendamento } from "@/lib/agendamentos-store";

type Props = {
  salaoId: string;
  servicoId: string;
  dia: string;
  hora: string;
  sucessoHref: string;
};

export default function ConfirmarAgendamentoBotao({ salaoId, servicoId, dia, hora, sucessoHref }: Props) {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);

  function handleClick() {
    if (enviando) return;
    setEnviando(true);
    const ag = criarAgendamento({ salaoId, servicoId, dia, hora });
    router.push(`${sucessoHref}&meu=${ag.id}`);
  }

  return (
    <button
      onClick={handleClick}
      disabled={enviando}
      className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-bold py-4 rounded-2xl transition-colors text-lg"
    >
      {enviando ? "Confirmando..." : "Confirmar agendamento"}
    </button>
  );
}
