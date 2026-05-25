import Link from "next/link";
import { Star, MapPin, Clock, Phone, Eye, TrendingUp, Pencil, Trash2 } from "lucide-react";
import Navbar from "@/components/navbar";
import AvaliacoesLista from "@/components/avaliacoes-lista";
import { saloes } from "@/lib/mock-data";

export default function PerfilPublicoPage() {
  const salao = saloes[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar paginaAtiva="salao" ladoSalao />

      {/* Purple hero */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-500 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Gestão de Serviços</h1>
              <p className="text-purple-100 mt-1">Gerencie os serviços oferecidos pelo seu salão</p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full">
              <Eye className="w-4 h-4" />
              <span>{salao.buscasSemana} buscas esta semana</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Banner visibilidade */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-6 py-4 flex items-center gap-3 mb-8">
          <TrendingUp className="w-5 h-5 text-blue-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-800">
              Seu salão apareceu em <strong>{salao.buscasSemana} buscas</strong> esta semana!
            </p>
            <p className="text-xs text-blue-600 mt-0.5">Clientes da região estão te encontrando no MeuSalão.</p>
          </div>
        </div>

        {/* Salon info summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <h2 className="font-bold text-gray-900 text-xl mb-1">{salao.nome}</h2>
              <p className="text-gray-500 text-sm mb-3">{salao.tipo}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-semibold">{salao.nota}</span>
                  <span className="text-gray-400">({salao.totalAvaliacoes})</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{salao.distancia}</span>
                </div>
              </div>
              <div className="space-y-1.5 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{salao.endereco}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{salao.horarioFuncionamento}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>{salao.telefone}</span>
                </div>
              </div>
            </div>
            <Link href="/cliente/salao-da-marcia" className="text-sm text-purple-600 font-medium hover:text-purple-700 whitespace-nowrap">
              Ver como cliente →
            </Link>
          </div>
        </div>

        {/* Add service button */}
        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl mb-8 flex items-center justify-center gap-2 transition-colors text-lg">
          + Adicionar Novo Serviço
        </button>

        {/* Services grid */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Seus Serviços</h2>
          <span className="text-sm text-gray-500">{salao.servicos.length} serviços cadastrados</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {salao.servicos.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 text-lg mb-2">{s.nome}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1"><span className="text-gray-400">R$</span> <strong>R$ {s.preco}</strong></span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  {s.duracao} min
                </span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-600 text-sm font-medium py-2 rounded-xl hover:border-purple-300 hover:text-purple-600 transition-colors">
                  <Pencil className="w-3.5 h-3.5" />Editar
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 border border-red-100 text-red-500 text-sm font-medium py-2 rounded-xl hover:bg-red-50 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Reviews */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Avaliações dos Clientes</h2>
        <AvaliacoesLista salaoId={salao.id} base={salao.avaliacoes} layout="stack" />
      </div>
    </div>
  );
}
