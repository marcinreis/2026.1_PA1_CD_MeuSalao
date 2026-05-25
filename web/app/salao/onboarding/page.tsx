"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, CheckCircle, Upload, Plus, Trash2, ChevronLeft, FileSpreadsheet, X, Copy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

type ServicoCadastro = { nome: string; preco: string; duracao: string };

type DiaSemana = "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "dom";
type HorarioDia = { ativo: boolean; abertura: string; fechamento: string };

const DIAS: { id: DiaSemana; label: string; util: boolean }[] = [
  { id: "seg", label: "Segunda", util: true },
  { id: "ter", label: "Terça", util: true },
  { id: "qua", label: "Quarta", util: true },
  { id: "qui", label: "Quinta", util: true },
  { id: "sex", label: "Sexta", util: true },
  { id: "sab", label: "Sábado", util: false },
  { id: "dom", label: "Domingo", util: false },
];

const HORARIOS_INICIAIS: Record<DiaSemana, HorarioDia> = {
  seg: { ativo: true, abertura: "09:00", fechamento: "18:00" },
  ter: { ativo: true, abertura: "09:00", fechamento: "18:00" },
  qua: { ativo: true, abertura: "09:00", fechamento: "18:00" },
  qui: { ativo: true, abertura: "09:00", fechamento: "18:00" },
  sex: { ativo: true, abertura: "09:00", fechamento: "18:00" },
  sab: { ativo: true, abertura: "09:00", fechamento: "14:00" },
  dom: { ativo: false, abertura: "09:00", fechamento: "18:00" },
};

// Conteúdo mock de uma planilha CSV — usado para demonstrar a importação
// sem precisar do parser real. Reflete o caso de uso da estratégia de
// adoção descrita no CLAUDE.md (salão migra sem retrabalho).
const EXEMPLO_CSV: ServicoCadastro[] = [
  { nome: "Corte feminino", preco: "55", duracao: "60" },
  { nome: "Manicure", preco: "35", duracao: "45" },
  { nome: "Pedicure", preco: "40", duracao: "50" },
  { nome: "Escova simples", preco: "45", duracao: "40" },
  { nome: "Coloração completa", preco: "120", duracao: "120" },
  { nome: "Hidratação capilar", preco: "60", duracao: "60" },
  { nome: "Design de sobrancelha", preco: "45", duracao: "30" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [passo, setPasso] = useState(1);
  const [nomeSalao, setNomeSalao] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [servicos, setServicos] = useState<ServicoCadastro[]>([{ nome: "", preco: "", duracao: "" }]);
  const [horarios, setHorarios] = useState<Record<DiaSemana, HorarioDia>>(HORARIOS_INICIAIS);
  const [erroHorario, setErroHorario] = useState<string | null>(null);
  const [modalImport, setModalImport] = useState<"fechado" | "selecionar" | "preview">("fechado");
  const [previewServicos, setPreviewServicos] = useState<ServicoCadastro[]>([]);
  const [nomeArquivo, setNomeArquivo] = useState("");
  const TOTAL_PASSOS = 4;
  const progresso = (passo / TOTAL_PASSOS) * 100;

  function adicionarServico() { setServicos([...servicos, { nome: "", preco: "", duracao: "" }]); }
  function removerServico(i: number) { setServicos(servicos.filter((_, idx) => idx !== i)); }
  function atualizarServico(i: number, campo: keyof ServicoCadastro, valor: string) {
    const novo = [...servicos]; novo[i][campo] = valor; setServicos(novo);
  }

  // Simula leitura de planilha — em produção parsearia o CSV de verdade.
  // O protótipo aceita qualquer .csv e preenche com EXEMPLO_CSV pra
  // demonstrar a tela de pré-visualização e confirmação.
  function processarArquivo(file: File) {
    setNomeArquivo(file.name);
    setPreviewServicos(EXEMPLO_CSV);
    setModalImport("preview");
  }

  function usarExemplo() {
    setNomeArquivo("servicos-exemplo.csv");
    setPreviewServicos(EXEMPLO_CSV);
    setModalImport("preview");
  }

  function confirmarImportacao() {
    const servicosImportados = previewServicos.map((s) => ({ ...s }));
    setServicos(
      servicos.some((s) => s.nome || s.preco || s.duracao)
        ? [...servicos.filter((s) => s.nome || s.preco || s.duracao), ...servicosImportados]
        : servicosImportados,
    );
    setModalImport("fechado");
    setPreviewServicos([]);
    setNomeArquivo("");
  }

  function atualizarHorario(dia: DiaSemana, campo: keyof HorarioDia, valor: string | boolean) {
    setHorarios((prev) => ({ ...prev, [dia]: { ...prev[dia], [campo]: valor } }));
    setErroHorario(null);
  }

  function copiarParaUteis() {
    const base = horarios.seg;
    setHorarios((prev) => ({
      ...prev,
      ter: { ...base },
      qua: { ...base },
      qui: { ...base },
      sex: { ...base },
    }));
  }

  function validarHorarios(): boolean {
    const algumAtivo = Object.values(horarios).some((h) => h.ativo);
    if (!algumAtivo) {
      setErroHorario("Marque pelo menos um dia de atendimento.");
      return false;
    }
    for (const dia of DIAS) {
      const h = horarios[dia.id];
      if (!h.ativo) continue;
      if (h.abertura >= h.fechamento) {
        setErroHorario(`Em ${dia.label}, o horário de fechamento deve ser depois da abertura.`);
        return false;
      }
    }
    return true;
  }

  // suppress unused variable warnings for form fields
  void nomeSalao; void endereco; void telefone;

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col md:flex-row">
      {/* Left panel */}
      <div className="md:w-2/5 bg-gradient-to-br from-purple-700 to-purple-500 flex flex-col items-center justify-center p-12 text-white min-h-[30vh] md:min-h-screen">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">MeuSalão</h1>
        <p className="text-purple-100 text-center text-sm leading-relaxed max-w-xs">
          Cadastre seu salão em minutos e comece a receber agendamentos hoje
        </p>
        <div className="mt-8 space-y-3 w-full max-w-xs">
          {["Perfil público com avaliações", "Agendamentos sem WhatsApp", "Lembretes automáticos"].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-purple-200 shrink-0" />
              <span className="text-sm text-purple-100">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="md:w-3/5 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-lg">
          {/* Progress */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Passo {passo} de {TOTAL_PASSOS}</span>
            <span className="text-sm font-semibold text-purple-600">{Math.round(progresso)}%</span>
          </div>
          <Progress value={progresso} className="h-2 mb-8 [&>div]:bg-purple-600" />

          {/* Passo 1 */}
          {passo === 1 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo!</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">Vamos cadastrar seu salão em 4 passos simples.</p>
              <div className="grid grid-cols-4 gap-3 mb-8">
                {[
                  { n: "1", t: "Dados" },
                  { n: "2", t: "Serviços" },
                  { n: "3", t: "Horários" },
                  { n: "4", t: "Publicar" },
                ].map((s) => (
                  <div key={s.n} className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">{s.n}</div>
                    <span className="text-xs text-gray-500">{s.t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Passo 2 */}
          {passo === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Dados do salão</h2>
              <p className="text-gray-500 mb-6">Informações que aparecem no seu perfil público.</p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Nome do salão *</label>
                  <input placeholder="Ex: Salão da Márcia" value={nomeSalao} onChange={(e) => setNomeSalao(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Endereço *</label>
                  <input placeholder="Ex: Rua das Flores, 142 — Bela Vista" value={endereco} onChange={(e) => setEndereco(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Telefone / WhatsApp</label>
                  <input placeholder="(11) 99999-9999" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm" />
                </div>
              </div>
            </div>
          )}

          {/* Passo 3 */}
          {passo === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Seus serviços</h2>
              <p className="text-gray-500 mb-4">Adicione os serviços com preços e duração.</p>
              <button
                onClick={() => setModalImport("selecionar")}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-purple-200 rounded-xl py-3 px-4 mb-5 text-sm text-purple-500 hover:border-purple-400 hover:bg-purple-50 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Importar lista via planilha (CSV)
              </button>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {servicos.map((s, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500">Serviço {i + 1}</span>
                      {servicos.length > 1 && <button onClick={() => removerServico(i)}><Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" /></button>}
                    </div>
                    <input placeholder="Nome do serviço" value={s.nome} onChange={(e) => atualizarServico(i, "nome", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-purple-200" />
                    <div className="grid grid-cols-2 gap-2">
                      <input placeholder="Preço (R$)" value={s.preco} onChange={(e) => atualizarServico(i, "preco", e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                      <input placeholder="Duração (min)" value={s.duracao} onChange={(e) => atualizarServico(i, "duracao", e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={adicionarServico} className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 mt-3 text-sm text-gray-600 hover:border-purple-200 hover:bg-purple-50 transition-colors">
                <Plus className="w-4 h-4" />Adicionar serviço
              </button>
            </div>
          )}

          {/* Passo 4 — Horários de funcionamento */}
          {passo === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Quando você atende?</h2>
              <p className="text-gray-500 mb-4">Clientes só conseguem agendar nos horários que você ativar.</p>

              <button
                type="button"
                onClick={copiarParaUteis}
                className="w-full flex items-center justify-center gap-2 border border-purple-200 rounded-xl py-2.5 mb-4 text-sm text-purple-600 hover:bg-purple-50 transition-colors"
              >
                <Copy className="w-4 h-4" />
                Aplicar horário de segunda a sexta
              </button>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {DIAS.map((dia) => {
                  const h = horarios[dia.id];
                  return (
                    <div key={dia.id} className={`rounded-xl border p-3 transition-colors ${h.ativo ? "bg-purple-50/40 border-purple-100" : "bg-gray-50 border-gray-100"}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => atualizarHorario(dia.id, "ativo", !h.ativo)}
                            aria-pressed={h.ativo}
                            className={`relative w-10 h-6 rounded-full transition-colors ${h.ativo ? "bg-purple-600" : "bg-gray-300"}`}
                          >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${h.ativo ? "translate-x-4" : ""}`} />
                          </button>
                          <span className={`text-sm font-semibold ${h.ativo ? "text-gray-900" : "text-gray-400"}`}>{dia.label}</span>
                        </div>
                        {h.ativo ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="time"
                              value={h.abertura}
                              onChange={(e) => atualizarHorario(dia.id, "abertura", e.target.value)}
                              className="px-2 py-1 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-200"
                            />
                            <span className="text-gray-400 text-xs">às</span>
                            <input
                              type="time"
                              value={h.fechamento}
                              onChange={(e) => atualizarHorario(dia.id, "fechamento", e.target.value)}
                              className="px-2 py-1 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-200"
                            />
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Fechado</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {erroHorario && (
                <p className="text-xs text-red-500 mt-3 font-medium">{erroHorario}</p>
              )}
            </div>
          )}

          {/* Footer buttons */}
          <div className="mt-8">
            {passo < TOTAL_PASSOS ? (
              <button
                onClick={() => setPasso(passo + 1)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl transition-colors"
              >
                {passo === 1 ? "Começar cadastro" : "Próximo"}
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!validarHorarios()) return;
                  router.push("/salao/dashboard");
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl transition-colors"
              >
                Publicar meu salão
              </button>
            )}
            {passo > 1 && (
              <button onClick={() => setPasso(passo - 1)} className="w-full mt-3 text-sm text-gray-400 py-2 hover:text-gray-600 flex items-center justify-center gap-1">
                <ChevronLeft className="w-4 h-4" />Voltar
              </button>
            )}
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">← Voltar ao início</Link>
          </div>
        </div>
      </div>

      {/* ── Modal de importação CSV ── */}
      {modalImport !== "fechado" && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col">
            {/* Header do modal */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {modalImport === "selecionar" ? "Importar planilha" : "Pré-visualizar serviços"}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {modalImport === "selecionar"
                      ? "Migre seu catálogo de outro sistema"
                      : `${previewServicos.length} serviços de ${nomeArquivo}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalImport("fechado")}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo */}
            {modalImport === "selecionar" ? (
              <div className="p-6 space-y-4">
                <label className="block border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-purple-300 hover:bg-purple-50/40 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) processarArquivo(file);
                    }}
                  />
                  <Upload className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                  <p className="font-semibold text-gray-700 text-sm">Clique para selecionar</p>
                  <p className="text-xs text-gray-400 mt-1">Aceita .csv, .xlsx ou .xls</p>
                </label>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span>ou</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <button
                  onClick={usarExemplo}
                  className="w-full py-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold transition-colors"
                >
                  Usar planilha de exemplo
                </button>

                <p className="text-xs text-gray-400 leading-relaxed pt-2">
                  <strong className="text-gray-600">Formato esperado:</strong> colunas{" "}
                  <code className="bg-gray-100 px-1 rounded">nome</code>,{" "}
                  <code className="bg-gray-100 px-1 rounded">preco</code>,{" "}
                  <code className="bg-gray-100 px-1 rounded">duracao_min</code>.
                </p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <div className="space-y-2">
                    {previewServicos.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
                      >
                        <div className="w-8 h-8 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{s.nome}</p>
                          <p className="text-xs text-gray-400">{s.duracao} min</p>
                        </div>
                        <p className="font-black text-purple-700 text-sm">R$ {s.preco}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                  <button
                    onClick={() => setModalImport("selecionar")}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50"
                  >
                    Trocar arquivo
                  </button>
                  <button
                    onClick={confirmarImportacao}
                    className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold transition-colors"
                  >
                    Importar {previewServicos.length}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
