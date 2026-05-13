"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { saloes } from "@/lib/mock-data";
import { useRouter } from "next/navigation";
import SalaoFoto from "@/components/salao-foto";

// ─── Fix Leaflet default icon bug in Next.js ───────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// ─── Custom pin for salons (violet, matches app theme) ────────────────────
// IMPORTANTE: divIcon precisa ser memoizado (criado uma vez por salão).
// Se for recriado a cada render, react-leaflet chama marker.setIcon() e
// recria o DOM do marker — perdendo os handlers de click do Leaflet.
function criarIconeSalao(nota: number) {
  const cor =
    nota >= 4.8 ? "#7c3aed" : nota >= 4.6 ? "#8b5cf6" : "#a78bfa";

  const svg = `
    <svg width="44" height="54" viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer;display:block;">
      <!-- Hit area transparente cobrindo todo o bounding box -->
      <rect x="0" y="0" width="44" height="54" fill="transparent" pointer-events="all"/>
      <filter id="sombra">
        <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.25)"/>
      </filter>
      <g filter="url(#sombra)" pointer-events="none">
        <circle cx="22" cy="20" r="18" fill="${cor}"/>
        <path d="M22 44 L10 26 Q4 20 10 14 Q16 6 22 4 Q28 6 34 14 Q40 20 34 26 Z" fill="${cor}"/>
        <circle cx="22" cy="20" r="18" fill="${cor}"/>
      </g>
      <circle cx="22" cy="20" r="11" fill="white" opacity="0.25" pointer-events="none"/>
      <g transform="translate(14, 12)" stroke="white" stroke-width="1.8" stroke-linecap="round" fill="none" pointer-events="none">
        <circle cx="3" cy="3" r="2.5"/>
        <circle cx="13" cy="3" r="2.5"/>
        <line x1="5" y1="5" x2="15" y2="15"/>
        <line x1="5" y1="5" x2="15" y2="15" stroke="white" stroke-width="1.5"/>
        <line x1="11" y1="5" x2="1" y2="15" stroke="white" stroke-width="1.5"/>
      </g>
    </svg>`;

  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [44, 54],
    iconAnchor: [22, 54],
    popupAnchor: [0, -56],
  });
}

// Ícones pré-computados por salão (módulo escopo → criados uma única vez)
const ICONES_SALAO = new Map(
  saloes.map((s) => [s.id, criarIconeSalao(s.nota)])
);

// ─── Custom pin for user location (pulsing blue dot) ──────────────────────
const iconeUsuario = L.divIcon({
  html: `
    <div style="position:relative;width:20px;height:20px;">
      <div style="
        position:absolute;inset:0;
        background:rgba(99,102,241,0.3);
        border-radius:50%;
        animation:pulse-ring 2s ease-out infinite;
      "></div>
      <div style="
        position:absolute;inset:4px;
        background:#6366f1;
        border-radius:50%;
        border:2px solid white;
        box-shadow:0 2px 6px rgba(0,0,0,0.3);
      "></div>
      <style>
        @keyframes pulse-ring {
          0%   { transform:scale(1);   opacity:0.8; }
          100% { transform:scale(2.8); opacity:0;   }
        }
      </style>
    </div>`,
  className: "",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -12],
});

// ─── Sub-component: centers map on user when location arrives ─────────────
function CentrarNoUsuario({
  posicao,
}: {
  posicao: [number, number] | null;
}) {
  const map = useMap();
  const centrado = useRef(false);

  useEffect(() => {
    if (posicao && !centrado.current) {
      map.flyTo(posicao, 14, { duration: 1.4 });
      centrado.current = true;
    }
  }, [posicao, map]);

  return null;
}

// ─── Forces Leaflet to recompute size after mount ────────────────────────
// Sem isso, o mapa renderiza com 0×0 quando o container nasce via flexbox
// (tiles cinza ou em branco). Também recalcula no resize da janela.
function RecalcularTamanho() {
  const map = useMap();
  useEffect(() => {
    const recalc = () => map.invalidateSize();
    const t1 = setTimeout(recalc, 0);
    const t2 = setTimeout(recalc, 250);
    window.addEventListener("resize", recalc);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", recalc);
    };
  }, [map]);
  return null;
}

// ─── Star rating helper ────────────────────────────────────────────────────
function Estrelas({ nota }: { nota: number }) {
  return (
    <span style={{ color: "#f59e0b", fontSize: 13, letterSpacing: 1 }}>
      {"★".repeat(Math.round(nota))}
      {"☆".repeat(5 - Math.round(nota))}
    </span>
  );
}

// ─── Main exported component ───────────────────────────────────────────────
export default function Mapa() {
  const router = useRouter();
  const [posicaoUsuario, setPosicaoUsuario] = useState<[number, number] | null>(
    null
  );
  const [erroLocalizacao, setErroLocalizacao] = useState(false);

  // Fortaleza center as default (Meireles/Aldeota)
  const centroInicial: [number, number] = [-3.7320, -38.5060];

  useEffect(() => {
    if (!navigator.geolocation) {
      setErroLocalizacao(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosicaoUsuario([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        setErroLocalizacao(true);
      },
      { timeout: 8000 }
    );
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* ── Aviso de localização negada ── */}
      {erroLocalizacao && (
        <div
          style={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: "10px 18px",
            fontSize: 13,
            color: "#6b7280",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: 16 }}>📍</span>
          Localização não disponível — mostrando Fortaleza
        </div>
      )}

      {/* ── Legenda ── */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: 16,
          zIndex: 1000,
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: "10px 14px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          fontSize: 12,
          color: "#374151",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#6366f1",
              border: "2px solid white",
              boxShadow: "0 0 0 2px rgba(99,102,241,0.3)",
            }}
          />
          <span>Sua localização</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#7c3aed",
            }}
          />
          <span>Salão parceiro</span>
        </div>
      </div>

      {/* ── Mapa Leaflet ── */}
      <MapContainer
        center={centroInicial}
        zoom={14}
        style={{ width: "100%", height: "100%" }}
        zoomControl={true}
      >
        {/* Tiles do OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Garante que o Leaflet recalcula o tamanho após o mount */}
        <RecalcularTamanho />

        {/* Centraliza no usuário quando posição chega */}
        <CentrarNoUsuario posicao={posicaoUsuario} />

        {/* Pin do usuário */}
        {posicaoUsuario && (
          <Marker position={posicaoUsuario} icon={iconeUsuario}>
            <Popup>
              <div style={{ fontFamily: "sans-serif", fontSize: 13, padding: "2px 4px" }}>
                <strong>Você está aqui</strong>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Pins dos salões */}
        {saloes.map((salao) => (
          <Marker
            key={salao.id}
            position={[salao.lat, salao.lng]}
            icon={ICONES_SALAO.get(salao.id)}
          >
            <Popup minWidth={240} maxWidth={280}>
              {/* ── Popup card ── */}
              <div
                style={{
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  padding: "4px 2px 2px",
                  minWidth: 230,
                }}
              >
                {/* Foto */}
                <div
                  style={{
                    width: "100%",
                    height: 90,
                    borderRadius: 10,
                    overflow: "hidden",
                    marginBottom: 10,
                  }}
                >
                  <SalaoFoto
                    src={salao.foto}
                    alt={salao.nome}
                    salaoId={salao.id}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Tipo badge */}
                <span
                  style={{
                    display: "inline-block",
                    background: "#ede9fe",
                    color: "#6d28d9",
                    fontSize: 10,
                    fontWeight: 600,
                    borderRadius: 20,
                    padding: "2px 8px",
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {salao.tipo}
                </span>

                {/* Nome */}
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: "#111827",
                    marginBottom: 4,
                  }}
                >
                  {salao.nome}
                </div>

                {/* Nota */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 6,
                  }}
                >
                  <Estrelas nota={salao.nota} />
                  <span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>
                    {salao.nota}
                  </span>
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>
                    ({salao.totalAvaliacoes})
                  </span>
                </div>

                {/* Endereço */}
                <div
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    marginBottom: 4,
                    display: "flex",
                    gap: 4,
                  }}
                >
                  <span>📍</span>
                  <span>{salao.endereco}</span>
                </div>

                {/* Horário */}
                <div
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    marginBottom: 10,
                    display: "flex",
                    gap: 4,
                  }}
                >
                  <span>🕐</span>
                  <span>{salao.horarioFuncionamento}</span>
                </div>

                {/* Preço mínimo */}
                <div
                  style={{
                    fontSize: 11,
                    color: salao.precoMinimo != null ? "#7c3aed" : "#9ca3af",
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  {salao.precoMinimo != null
                    ? `A partir de R$ ${salao.precoMinimo}`
                    : "Consultar preço"}
                </div>

                {/* Tags */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 4,
                    marginBottom: 12,
                  }}
                >
                  {salao.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: "#f3f4f6",
                        color: "#374151",
                        fontSize: 10,
                        borderRadius: 6,
                        padding: "2px 8px",
                        fontWeight: 500,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA Button — navega para página de serviços do salão */}
                <button
                  onClick={() => router.push(`/cliente/${salao.id}`)}
                  style={{
                    width: "100%",
                    background: "#7c3aed",
                    color: "white",
                    border: "none",
                    borderRadius: 10,
                    padding: "10px 0",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLButtonElement).style.background = "#6d28d9")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLButtonElement).style.background = "#7c3aed")
                  }
                >
                  Ver serviços e agendar →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
