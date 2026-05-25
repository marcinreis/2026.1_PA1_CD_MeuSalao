"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { adicionarAvaliacao } from "@/lib/avaliacoes-store";

type Props = {
  aberto: boolean;
  onClose: () => void;
  salaoId: string;
  salaoNome: string;
  servicoNome?: string;
  agendamentoId: string;
  clienteNome?: string;
};

export default function ModalAvaliar({
  aberto,
  onClose,
  salaoId,
  salaoNome,
  servicoNome,
  agendamentoId,
  clienteNome,
}: Props) {
  const [nota, setNota] = useState(0);
  const [hover, setHover] = useState(0);
  const [texto, setTexto] = useState("");
  const [enviado, setEnviado] = useState(false);

  if (!aberto) return null;

  const podeEnviar = nota > 0 && texto.trim().length >= 3;

  function enviar() {
    if (!podeEnviar) return;
    adicionarAvaliacao({
      salaoId,
      agendamentoId,
      cliente: clienteNome ?? "Você",
      nota,
      texto: texto.trim(),
      servico: servicoNome,
    });
    setEnviado(true);
  }

  function fechar() {
    setNota(0);
    setHover(0);
    setTexto("");
    setEnviado(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">
              {enviado ? "Obrigado pela avaliação!" : "Avaliar atendimento"}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{salaoNome}</p>
          </div>
          <button onClick={fechar} className="text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {enviado ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
            </div>
            <p className="text-gray-700 mb-2 font-semibold">Sua avaliação ajuda outros clientes.</p>
            <p className="text-sm text-gray-500 mb-6">Ela já aparece no perfil do salão.</p>
            <button
              onClick={fechar}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-2xl transition-colors"
            >
              Fechar
            </button>
          </div>
        ) : (
          <>
            <div className="p-6 space-y-5">
              {servicoNome && (
                <p className="text-sm text-gray-500">
                  Serviço: <strong className="text-gray-800">{servicoNome}</strong>
                </p>
              )}

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Sua nota</p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const n = i + 1;
                    const ativo = (hover || nota) >= n;
                    return (
                      <button
                        key={n}
                        type="button"
                        onMouseEnter={() => setHover(n)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setNota(n)}
                        aria-label={`Dar ${n} ${n === 1 ? "estrela" : "estrelas"}`}
                      >
                        <Star
                          className={`w-9 h-9 transition-transform ${ativo ? "text-amber-400 fill-amber-400 scale-110" : "text-gray-200 fill-gray-200"}`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Conte como foi</p>
                <textarea
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder="O que você achou do atendimento?"
                  maxLength={400}
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none"
                />
                <p className="text-xs text-gray-400 text-right mt-1">{texto.length}/400</p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={fechar}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={enviar}
                disabled={!podeEnviar}
                className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors"
              >
                Enviar avaliação
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
