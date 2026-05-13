import { notFound } from "next/navigation";
import { Star, MapPin, Clock, Phone, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import ServicoItem from "@/components/servico-item";
import AvaliacaoItem from "@/components/avaliacao-item";
import SalaoFoto from "@/components/salao-foto";
import { getSalao } from "@/lib/mock-data";

export default async function PerfilSalaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const salao = getSalao(id);
  if (!salao) notFound();

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Navbar paginaAtiva="inicio" />

      {/* Hero photo */}
      <div className="relative h-80 overflow-hidden">
        <SalaoFoto src={salao.foto} alt={salao.nome} salaoId={salao.id} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        {/* Back button */}
        <Link
          href="/cliente"
          className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium px-3 py-2 rounded-xl hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>

        {/* Salon info overlay */}
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 pb-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="inline-block text-white/70 text-sm mb-1">{salao.tipo}</span>
              <h1 className="text-white font-black text-4xl tracking-tight">{salao.nome}</h1>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-white font-bold text-sm">{salao.nota}</span>
                  <span className="text-white/70 text-xs">({salao.totalAvaliacoes} avaliações)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1">
                  <MapPin className="w-3.5 h-3.5 text-white/80" />
                  <span className="text-white/90 text-sm">{salao.distancia}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-black text-gray-900 text-xl mb-3">Sobre</h2>
              <p className="text-gray-600 leading-relaxed">{salao.descricao}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-50">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600">{salao.endereco}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-violet-500 shrink-0" />
                  <p className="text-sm text-gray-600">{salao.horarioFuncionamento}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-violet-500 shrink-0" />
                  <p className="text-sm text-gray-600">{salao.telefone}</p>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h2 className="font-black text-gray-900 text-xl mb-4">Serviços Disponíveis</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {salao.servicos.map((servico) => (
                  <ServicoItem key={servico.id} servico={servico} salaoId={salao.id} />
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="font-black text-gray-900 text-xl mb-4">
                Avaliações <span className="text-gray-400 font-normal text-base">({salao.totalAvaliacoes})</span>
              </h2>
              <div className="space-y-3">
                {salao.avaliacoes.map((av) => (
                  <AvaliacaoItem key={av.id} avaliacao={av} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              {salao.precoMinimo != null ? (
                <>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">A partir de</p>
                  <p className="text-4xl font-black text-violet-700 mb-5">R$ {salao.precoMinimo}</p>
                </>
              ) : (
                <p className="text-base font-semibold text-gray-400 mb-5">Consultar preço</p>
              )}

              <div className="flex items-center gap-2 mb-6 p-3 bg-amber-50 rounded-xl">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">{salao.nota} de 5 estrelas</p>
                  <p className="text-xs text-gray-500">{salao.totalAvaliacoes} avaliações verificadas</p>
                </div>
              </div>

              <p className="text-sm text-gray-500 text-center mb-4">Escolha um serviço abaixo para agendar</p>

              <div className="space-y-2">
                {salao.servicos.slice(0, 3).map((s) => (
                  <a key={s.id} href={`/cliente/${salao.id}/agendar?servico=${s.id}`} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-violet-300 hover:bg-violet-50 transition-all group">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-violet-700">{s.nome}</p>
                      <p className="text-xs text-gray-400">{s.duracao} min</p>
                    </div>
                    <p className="font-black text-violet-700">R$ {s.preco}</p>
                  </a>
                ))}
              </div>

              {salao.servicos.length > 3 && (
                <p className="text-xs text-center text-gray-400 mt-3">+{salao.servicos.length - 3} serviços disponíveis</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
