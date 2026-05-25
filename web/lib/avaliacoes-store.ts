"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "meusalao:avaliacoes";

export type AvaliacaoUsuario = {
  id: string;
  salaoId: string;
  agendamentoId: string;
  cliente: string;
  nota: number;
  texto: string;
  data: string;
  servico?: string;
};

let items: AvaliacaoUsuario[] = [];
const listeners = new Set<() => void>();

function carregar() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      items = parsed.filter(
        (x): x is AvaliacaoUsuario =>
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

export function adicionarAvaliacao(input: Omit<AvaliacaoUsuario, "id" | "data">): AvaliacaoUsuario {
  const nova: AvaliacaoUsuario = {
    ...input,
    id: `av-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    data: new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" }),
  };
  items = [nova, ...items];
  notificar();
  return nova;
}

export function temAvaliacao(agendamentoId: string): boolean {
  return items.some((x) => x.agendamentoId === agendamentoId);
}

export function useAvaliacoes(salaoId?: string) {
  const [, force] = useState(0);

  useEffect(() => {
    const fn = () => force((n) => n + 1);
    listeners.add(fn);
    if (items.length > 0) fn();
    return () => {
      listeners.delete(fn);
    };
  }, []);

  const filtrados = salaoId ? items.filter((x) => x.salaoId === salaoId) : items;
  return { items: filtrados, todas: items };
}
