import Link from "next/link";
import { Sparkles, Search, Store, User, CalendarDays } from "lucide-react";

interface NavbarProps {
  paginaAtiva?: "inicio" | "perfil" | "salao" | "agendamentos";
  ladoSalao?: boolean;
}

export default function Navbar({ paginaAtiva, ladoSalao = false }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-violet-700 rounded-xl flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-black text-gray-900 tracking-tight">MeuSalão</span>
        </Link>

        {/* Center search (desktop) */}
        {!ladoSalao && (
          <div className="hidden md:flex flex-1 max-w-md mx-auto">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar salões ou serviços..."
                readOnly
                className="w-full pl-9 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm text-gray-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-300 focus:bg-white transition-colors"
              />
            </div>
          </div>
        )}

        <div className="flex-1 md:flex-none" />

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {!ladoSalao ? (
            <>
              <Link
                href="/cliente"
                className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  paginaAtiva === "inicio" ? "text-violet-700 bg-violet-50" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Início
              </Link>
              <Link
                href="/cliente/agendamentos"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  paginaAtiva === "agendamentos" ? "text-violet-700 bg-violet-50" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Meus agendamentos</span>
                <span className="sm:hidden">Agenda</span>
              </Link>
              <Link
                href="/salao/onboarding"
                className="flex items-center gap-1.5 bg-violet-700 hover:bg-violet-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                <Store className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cadastrar salão</span>
                <span className="sm:hidden">Salão</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/salao/dashboard"
                className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  paginaAtiva === "inicio" ? "text-violet-700 bg-violet-50" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/salao/perfil"
                className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  paginaAtiva === "salao" ? "text-violet-700 bg-violet-50" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Serviços
              </Link>
              <Link
                href="/cliente"
                className="flex items-center gap-1.5 border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-xl hover:border-violet-300 hover:text-violet-700 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                Sou Cliente
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
