import Link from "next/link";
import { Sparkles, Search, Star, CalendarCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left — branding */}
      <div className="md:w-1/2 bg-violet-900 relative overflow-hidden flex flex-col items-center justify-center p-12 text-white min-h-[45vh] md:min-h-screen">
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-fuchsia-600/20 rounded-full blur-2xl" />

        <div className="relative z-10 text-center">
          <div className="w-24 h-24 bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight tracking-tight">
            Bem-vindo ao<br />MeuSalão
          </h1>
          <p className="text-violet-200 text-lg leading-relaxed max-w-xs mx-auto">
            A melhor plataforma para descobrir e agendar serviços de beleza
          </p>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <div className="text-center">
              <p className="text-2xl font-black">4</p>
              <p className="text-xs text-violet-300">Salões</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-black">4.7+</p>
              <p className="text-xs text-violet-300">Avaliação</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-black">CE</p>
              <p className="text-xs text-violet-300">Cidade</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right — actions */}
      <div className="md:w-1/2 bg-gray-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-violet-700 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-gray-900 text-lg">MeuSalão</span>
          </div>

          <h2 className="text-3xl font-black text-gray-900 mb-2 leading-tight">
            Como você quer<br />usar o app?
          </h2>
          <p className="text-gray-500 mb-8">Escolha seu perfil para começar</p>

          {/* Feature row */}
          <div className="flex gap-6 mb-10">
            {[
              { icon: Search, label: "Buscar" },
              { icon: Star, label: "Comparar" },
              { icon: CalendarCheck, label: "Agendar" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-violet-700" />
                </div>
                <span className="text-xs font-semibold text-gray-600">{label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Link href="/cliente" className="block">
              <button className="w-full bg-violet-700 hover:bg-violet-800 text-white font-black py-4 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-0.5 text-base">
                Sou Cliente →
              </button>
            </Link>
            <Link href="/salao/onboarding" className="block">
              <button className="w-full bg-white hover:bg-gray-50 text-gray-800 font-bold py-4 rounded-2xl border-2 border-gray-200 hover:border-violet-300 transition-all text-base">
                Sou Dono de Salão
              </button>
            </Link>
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">Protótipo MVP Fase 1 · 2026</p>
        </div>
      </div>
    </div>
  );
}
