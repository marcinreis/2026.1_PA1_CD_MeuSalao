"use client";

import { useEffect, useState } from "react";

// Overrides de status para os agendamentos do mock do salão.
// Permite que o dono confirme/recuse sem precisar mutar mock-data.

const STORAGE_KEY = "meusalao:agenda-salao";

export type StatusAgendamento = "confirmado" | "pendente" | "recusado";

type Overrides = Record<string, StatusAgendamento>; // chave: `${salaoId}:${agendamentoId}`

let overrides: Overrides = {};
const listeners = new Set<() => void>();

function carregar() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      overrides = parsed as Overrides;
    }
  } catch {
    // ignora
  }
}

if (typeof window !== "undefined") carregar();

function persistir() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // storage indisponível
  }
}

function notificar() {
  persistir();
  listeners.forEach((fn) => fn());
}

function chave(salaoId: string, agendamentoId: string) {
  return `${salaoId}:${agendamentoId}`;
}

export function setStatusAgendamento(
  salaoId: string,
  agendamentoId: string,
  status: StatusAgendamento,
) {
  overrides = { ...overrides, [chave(salaoId, agendamentoId)]: status };
  notificar();
}

export function getStatusOverride(
  salaoId: string,
  agendamentoId: string,
): StatusAgendamento | undefined {
  return overrides[chave(salaoId, agendamentoId)];
}

export function useAgendaSalao() {
  const [, force] = useState(0);

  useEffect(() => {
    const fn = () => force((n) => n + 1);
    listeners.add(fn);
    if (Object.keys(overrides).length > 0) fn();
    return () => {
      listeners.delete(fn);
    };
  }, []);

  return {
    getStatus(salaoId: string, agendamentoId: string, fallback: StatusAgendamento) {
      return overrides[chave(salaoId, agendamentoId)] ?? fallback;
    },
    setStatus: setStatusAgendamento,
  };
}
