"use client";

import { useState } from "react";
import { Scissors } from "lucide-react";

// Gradientes usados como fallback quando a imagem externa não carrega
// (rede bloqueando images.unsplash.com, adblocker etc.). Cada salão
// recebe um gradiente determinístico baseado no id.
const GRADIENTES = [
  "linear-gradient(135deg, #f472b6 0%, #c084fc 100%)",
  "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
  "linear-gradient(135deg, #475569 0%, #1e293b 100%)",
  "linear-gradient(135deg, #14b8a6 0%, #6366f1 100%)",
  "linear-gradient(135deg, #fb923c 0%, #ec4899 100%)",
];

function gradienteDoSalao(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return GRADIENTES[Math.abs(hash) % GRADIENTES.length];
}

type Props = {
  src: string;
  alt: string;
  salaoId: string;
  className?: string;
};

export default function SalaoFoto({ src, alt, salaoId, className }: Props) {
  const [erro, setErro] = useState(false);

  if (erro) {
    return (
      <div
        className={className}
        style={{
          background: gradienteDoSalao(salaoId),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label={alt}
      >
        <Scissors className="w-12 h-12 text-white/80" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setErro(true)}
      loading="lazy"
    />
  );
}
