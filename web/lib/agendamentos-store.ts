"use client";

import { useEffect, useState } from "react";

// Agendamentos criados pelo cliente. Persistido em localStorage
// pelo mesmo motivo do comparar-store: protótipo sem backend.

const STORAGE_KEY = "meusalao:meus-agendamentos";

export type MeuAgendamento = {
  id: string;
  salaoId: string;
  servicoId: string;
  dia: string; // YYYY-MM-DD
  hora: string; // HH:MM
  criadoEm: string; // ISO
  status: "confirmado" | "cancelado" | "concluido";
};

let items: MeuAgendamento[] = [];
const listeners = new Set<() => void>();

function carregar() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      items = parsed.filter(
        (x): x is MeuAgendamento =>
          x && typeof x.id === "string" && typeof x.salaoId === "string",
      );
    }
  } catch {
    // ignora
  }
}

if (typeof window !== "undefined") carregar();

function persistir() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage indisponível
  }
}

function notificar() {
  persistir();
  listeners.forEach((fn) => fn());
}

export function criarAgendamento(input: Omit<MeuAgendamento, "id" | "criadoEm" | "status">): MeuAgendamento {
  const novo: MeuAgendamento = {
    ...input,
    id: `meu-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    criadoEm: new Date().toISOString(),
    status: "confirmado",
  };
  items = [novo, ...items];
  notificar();
  return novo;
}

export function useMeusAgendamentos() {
  const [, force] = useState(0);

  useEffect(() => {
    const fn = () => force((n) => n + 1);
    listeners.add(fn);
    if (items.length > 0) fn();
    return () => {
      listeners.delete(fn);
    };
  }, []);

  return {
    items,
    cancelar(id: string) {
      const i = items.findIndex((x) => x.id === id);
      if (i === -1) return;
      items = items.map((x) => (x.id === id ? { ...x, status: "cancelado" as const } : x));
      notificar();
    },
    marcarConcluido(id: string) {
      const i = items.findIndex((x) => x.id === id);
      if (i === -1) return;
      items = items.map((x) => (x.id === id ? { ...x, status: "concluido" as const } : x));
      notificar();
    },
    remover(id: string) {
      if (!items.some((x) => x.id === id)) return;
      items = items.filter((x) => x.id !== id);
      notificar();
    },
  };
}
