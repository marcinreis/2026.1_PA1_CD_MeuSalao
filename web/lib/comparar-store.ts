"use client";

import { useEffect, useState } from "react";

// Store global e leve para a seleção de salões em comparação.
// Sem React Context — é só um Set compartilhado com listeners.
// Persiste no localStorage para sobreviver a recargas.

const STORAGE_KEY = "meusalao:comparar";
export const MAX_COMPARAR = 3;

let ids: string[] = [];
const listeners = new Set<() => void>();

function carregar() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      ids = parsed.filter((x): x is string => typeof x === "string").slice(0, MAX_COMPARAR);
    }
  } catch {
    // ignora storage corrompido
  }
}

// Carrega o estado inicial assim que o módulo for avaliado no cliente.
// Como todos os consumidores são "use client" e o estado precisa estar
// disponível já no primeiro render (não só no useEffect), inicializar
// aqui evita um flicker de "empty state".
if (typeof window !== "undefined") {
  carregar();
}

function persistir() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // storage indisponível (modo anônimo, cota etc.)
  }
}

function notificar() {
  persistir();
  listeners.forEach((fn) => fn());
}

export function useComparar() {
  const [, force] = useState(0);

  useEffect(() => {
    const fn = () => force((n) => n + 1);
    listeners.add(fn);
    // Re-sincroniza após o mount caso o componente tenha sido renderizado
    // no servidor (ids = []) e o cliente já tenha estado carregado.
    if (ids.length > 0) fn();
    return () => {
      listeners.delete(fn);
    };
  }, []);

  return {
    ids,
    count: ids.length,
    full: ids.length >= MAX_COMPARAR,
    isSelected(id: string) {
      return ids.includes(id);
    },
    toggle(id: string) {
      if (ids.includes(id)) {
        ids = ids.filter((x) => x !== id);
      } else if (ids.length < MAX_COMPARAR) {
        ids = [...ids, id];
      }
      notificar();
    },
    remove(id: string) {
      if (ids.includes(id)) {
        ids = ids.filter((x) => x !== id);
        notificar();
      }
    },
    clear() {
      if (ids.length > 0) {
        ids = [];
        notificar();
      }
    },
  };
}
