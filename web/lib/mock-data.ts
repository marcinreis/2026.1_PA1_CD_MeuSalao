export type Servico = {
  id: string;
  nome: string;
  preco: number;
  duracao: number; // minutes
};

export type Avaliacao = {
  id: string;
  cliente: string;
  nota: number;
  texto: string;
  data: string;
};

export type AgendamentoSalao = {
  id: string;
  cliente: string;
  hora: string;
  servico: string;
  status: "confirmado" | "pendente";
};

export type Salao = {
  id: string;
  nome: string;
  tipo: string;
  distancia: string;
  nota: number;
  totalAvaliacoes: number;
  corCapa: string; // tailwind bg color class
  foto: string;
  tags: string[];
  precoMinimo: number;
  endereco: string;
  descricao: string;
  telefone: string;
  horarioFuncionamento: string;
  servicos: Servico[];
  avaliacoes: Avaliacao[];
  horariosDisponiveis: string[];
  horariosOcupados: Set<string>; // "YYYY-MM-DD|HH:MM"
  agenda: AgendamentoSalao[];
  buscasSemana: number;
  lat: number; // latitude
  lng: number; // longitude
};

// Next 7 days from 2026-04-15
const DAYS = [
  "2026-04-15",
  "2026-04-16",
  "2026-04-17",
  "2026-04-18",
  "2026-04-19",
  "2026-04-20",
  "2026-04-21",
];

const HORARIOS = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00",
];

export const saloes: Salao[] = [
  {
    id: "salao-da-marcia",
    nome: "Salão da Márcia",
    tipo: "Salão de bairro",
    distancia: "0,4 km",
    nota: 4.8,
    totalAvaliacoes: 127,
    corCapa: "bg-rose-400",
    foto: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&h=300&fit=crop&auto=format",
    tags: ["Cabelo", "Unhas", "Manicure", "Pedicure"],
    precoMinimo: 35,
    endereco: "Rua Tibúrcio Cavalcante, 142 — Meireles",
    descricao: "Salão de bairro com atendimento personalizado. Mais de 15 anos cuidando da beleza das mulheres da região.",
    telefone: "(85) 98765-4321",
    horarioFuncionamento: "Seg–Sáb, 9h–18h",
    lat: -3.7300,
    lng: -38.5080,
    servicos: [
      { id: "s1", nome: "Corte feminino", preco: 55, duracao: 60 },
      { id: "s2", nome: "Manicure", preco: 35, duracao: 45 },
      { id: "s3", nome: "Pedicure", preco: 40, duracao: 50 },
      { id: "s4", nome: "Escova simples", preco: 45, duracao: 40 },
      { id: "s5", nome: "Coloração completa", preco: 120, duracao: 120 },
      { id: "s6", nome: "Hidratação", preco: 60, duracao: 60 },
    ],
    avaliacoes: [
      { id: "a1", cliente: "Ana Paula", nota: 5, texto: "Márcia é maravilhosa! Já sou cliente há 3 anos, nunca me decepcionou.", data: "10 abr 2026" },
      { id: "a2", cliente: "Fernanda S.", nota: 5, texto: "Ambiente aconchegante e atendimento top. Minha manicure ficou perfeita!", data: "8 abr 2026" },
      { id: "a3", cliente: "Juliana M.", nota: 4, texto: "Gostei muito do corte, ela realmente ouviu o que eu queria.", data: "5 abr 2026" },
    ],
    horariosDisponiveis: HORARIOS,
    horariosOcupados: new Set([
      "2026-04-15|09:00","2026-04-15|10:00","2026-04-15|14:00",
      "2026-04-16|09:30","2026-04-16|11:00","2026-04-16|15:00",
      "2026-04-17|13:00","2026-04-17|14:30",
    ]),
    agenda: [
      { id: "ag1", cliente: "Ana Paula", hora: "09:00", servico: "Manicure", status: "confirmado" },
      { id: "ag2", cliente: "Fernanda S.", hora: "10:00", servico: "Corte feminino", status: "confirmado" },
      { id: "ag3", cliente: "Juliana M.", hora: "11:00", servico: "Escova simples", status: "pendente" },
      { id: "ag4", cliente: "Carla R.", hora: "14:00", servico: "Coloração completa", status: "confirmado" },
      { id: "ag5", cliente: "Patrícia L.", hora: "15:30", servico: "Pedicure", status: "pendente" },
    ],
    buscasSemana: 43,
  },
  {
    id: "studio-renata",
    nome: "Studio Renata",
    tipo: "Studio premium",
    distancia: "1,5 km",
    nota: 4.9,
    totalAvaliacoes: 312,
    corCapa: "bg-purple-500",
    foto: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=300&fit=crop&auto=format",
    tags: ["Cabelo", "Coloração", "Tratamentos", "Estética"],
    precoMinimo: 80,
    endereco: "Av. Dom Luís, 890 — Aldeota",
    descricao: "Studio premium com 12 profissionais especializados. Referência em coloração e tratamentos capilares avançados na região.",
    telefone: "(85) 3344-5566",
    horarioFuncionamento: "Seg–Sáb, 8h–20h",
    lat: -3.7390,
    lng: -38.5060,
    servicos: [
      { id: "s1", nome: "Corte feminino premium", preco: 120, duracao: 60 },
      { id: "s2", nome: "Coloração completa", preco: 280, duracao: 150 },
      { id: "s3", nome: "Mechas e luzes", preco: 350, duracao: 180 },
      { id: "s4", nome: "Escova progressiva", preco: 220, duracao: 120 },
      { id: "s5", nome: "Hidratação intensiva", preco: 95, duracao: 60 },
      { id: "s6", nome: "Limpeza de pele", preco: 130, duracao: 75 },
    ],
    avaliacoes: [
      { id: "a1", cliente: "Beatriz K.", nota: 5, texto: "Melhor coloração que já fiz na vida. A Renata entende exatamente o que você quer.", data: "12 abr 2026" },
      { id: "a2", cliente: "Mariana F.", nota: 5, texto: "Ambiente impecável, profissionais super qualificados. Vale cada centavo!", data: "9 abr 2026" },
      { id: "a3", cliente: "Camila R.", nota: 5, texto: "Fiz mechas aqui e ficou lindo. Atendimento de altíssimo nível.", data: "7 abr 2026" },
    ],
    horariosDisponiveis: HORARIOS,
    horariosOcupados: new Set([
      "2026-04-15|09:00","2026-04-15|09:30","2026-04-15|10:00",
      "2026-04-16|11:00","2026-04-16|13:00","2026-04-16|14:00","2026-04-16|15:00",
      "2026-04-17|09:00","2026-04-17|10:30","2026-04-17|16:00",
    ]),
    agenda: [
      { id: "ag1", cliente: "Beatriz K.", hora: "09:00", servico: "Mechas e luzes", status: "confirmado" },
      { id: "ag2", cliente: "Mariana F.", hora: "11:00", servico: "Coloração completa", status: "confirmado" },
      { id: "ag3", cliente: "Camila R.", hora: "13:00", servico: "Escova progressiva", status: "pendente" },
      { id: "ag4", cliente: "Sofia L.", hora: "15:00", servico: "Corte feminino premium", status: "confirmado" },
      { id: "ag5", cliente: "Laura M.", hora: "17:00", servico: "Hidratação intensiva", status: "pendente" },
    ],
    buscasSemana: 118,
  },
  {
    id: "barba-e-corte",
    nome: "Barba & Corte",
    tipo: "Barbearia",
    distancia: "0,9 km",
    nota: 4.7,
    totalAvaliacoes: 89,
    corCapa: "bg-slate-700",
    foto: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=300&fit=crop&auto=format",
    tags: ["Corte masculino", "Barba", "Infantil"],
    precoMinimo: 30,
    endereco: "Rua Monsenhor Tabosa, 234 — Praia de Iracema",
    descricao: "Barbearia moderna com atendimento para homens e crianças. Especialistas em corte masculino, barba e corte infantil com ambiente divertido.",
    telefone: "(85) 97654-3210",
    horarioFuncionamento: "Seg–Sáb, 9h–19h",
    lat: -3.7240,
    lng: -38.5125,
    servicos: [
      { id: "s1", nome: "Corte masculino", preco: 40, duracao: 30 },
      { id: "s2", nome: "Barba completa", preco: 35, duracao: 30 },
      { id: "s3", nome: "Corte + barba", preco: 65, duracao: 50 },
      { id: "s4", nome: "Corte infantil", preco: 30, duracao: 25 },
      { id: "s5", nome: "Pigmentação de barba", preco: 50, duracao: 45 },
      { id: "s6", nome: "Hidratação capilar", preco: 45, duracao: 40 },
    ],
    avaliacoes: [
      { id: "a1", cliente: "Roberto A.", nota: 5, texto: "Finalmente achei uma barbearia que faz corte infantil de qualidade. Minhas filhas adoraram!", data: "11 abr 2026" },
      { id: "a2", cliente: "Carlos M.", nota: 5, texto: "Barba perfeita, atendimento rápido. Vou recomendar para todos os amigos.", data: "9 abr 2026" },
      { id: "a3", cliente: "Diego F.", nota: 4, texto: "Corte ótimo, ambiente bem legal. Sempre saio satisfeito.", data: "6 abr 2026" },
    ],
    horariosDisponiveis: HORARIOS,
    horariosOcupados: new Set([
      "2026-04-15|09:00","2026-04-15|09:30","2026-04-15|11:00",
      "2026-04-16|10:00","2026-04-16|13:30","2026-04-16|16:00",
      "2026-04-17|09:00","2026-04-17|14:00","2026-04-17|15:30",
    ]),
    agenda: [
      { id: "ag1", cliente: "Roberto A.", hora: "09:00", servico: "Corte + barba", status: "confirmado" },
      { id: "ag2", cliente: "Pedro H.", hora: "10:00", servico: "Corte masculino", status: "confirmado" },
      { id: "ag3", cliente: "Lucas S.", hora: "11:00", servico: "Barba completa", status: "pendente" },
      { id: "ag4", cliente: "Thiago M.", hora: "14:00", servico: "Corte infantil", status: "confirmado" },
      { id: "ag5", cliente: "Felipe R.", hora: "15:00", servico: "Corte + barba", status: "pendente" },
    ],
    buscasSemana: 67,
  },
  {
    id: "espaco-bella",
    nome: "Espaço Bella Estética",
    tipo: "Studio de estética",
    distancia: "5,8 km",
    nota: 4.6,
    totalAvaliacoes: 54,
    corCapa: "bg-teal-500",
    foto: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=300&fit=crop&auto=format",
    tags: ["Estética", "Sobrancelha", "Depilação", "Pele"],
    precoMinimo: 45,
    endereco: "Av. Washington Soares, 512 — Edson Queiroz",
    descricao: "Studio especializado em estética facial e corporal. Profissionais certificados em procedimentos de limpeza de pele, design de sobrancelha e depilação.",
    telefone: "(85) 96543-2109",
    horarioFuncionamento: "Seg–Sex, 9h–18h | Sáb, 9h–16h",
    lat: -3.7755,
    lng: -38.4820,
    servicos: [
      { id: "s1", nome: "Design de sobrancelha", preco: 45, duracao: 30 },
      { id: "s2", nome: "Limpeza de pele", preco: 120, duracao: 90 },
      { id: "s3", nome: "Depilação perna completa", preco: 70, duracao: 45 },
      { id: "s4", nome: "Depilação buço", preco: 20, duracao: 15 },
      { id: "s5", nome: "Micropigmentação sobrancelha", preco: 350, duracao: 120 },
      { id: "s6", nome: "Peeling facial", preco: 150, duracao: 60 },
    ],
    avaliacoes: [
      { id: "a1", cliente: "Carla M.", nota: 5, texto: "Design de sobrancelha incrível! Transformou meu rosto. Super recomendo.", data: "13 abr 2026" },
      { id: "a2", cliente: "Lívia P.", nota: 4, texto: "Limpeza de pele muito boa, profissional experiente e cuidadosa.", data: "10 abr 2026" },
      { id: "a3", cliente: "Aline C.", nota: 5, texto: "Micropigmentação ficou natural e duradoura. Amei o resultado!", data: "8 abr 2026" },
    ],
    horariosDisponiveis: HORARIOS,
    horariosOcupados: new Set([
      "2026-04-15|10:00","2026-04-15|13:30","2026-04-15|15:00",
      "2026-04-16|09:00","2026-04-16|11:30","2026-04-16|14:00",
      "2026-04-17|10:00","2026-04-17|13:00","2026-04-17|16:30",
    ]),
    agenda: [
      { id: "ag1", cliente: "Carla M.", hora: "09:00", servico: "Limpeza de pele", status: "confirmado" },
      { id: "ag2", cliente: "Lívia P.", hora: "10:30", servico: "Design de sobrancelha", status: "confirmado" },
      { id: "ag3", cliente: "Aline C.", hora: "13:00", servico: "Micropigmentação sobrancelha", status: "pendente" },
      { id: "ag4", cliente: "Renata B.", hora: "15:00", servico: "Peeling facial", status: "confirmado" },
    ],
    buscasSemana: 29,
  },
];

export function getSalao(id: string): Salao | undefined {
  return saloes.find((s) => s.id === id);
}

export const DIAS_SEMANA = [
  "2026-04-15",
  "2026-04-16",
  "2026-04-17",
  "2026-04-18",
  "2026-04-19",
  "2026-04-20",
  "2026-04-21",
];

export function formatarDia(dateStr: string): { diaSemana: string; dia: string } {
  const date = new Date(dateStr + "T12:00:00");
  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  return {
    diaSemana: diasSemana[date.getDay()],
    dia: date.getDate().toString(),
  };
}

export function formatarDataCompleta(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  const meses = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
  const diasSemana = ["domingo","segunda","terça","quarta","quinta","sexta","sábado"];
  return `${diasSemana[date.getDay()]}, ${date.getDate()} de ${meses[date.getMonth()]}`;
}

export const TAGS_FILTRO = ["Cabelo", "Unhas", "Barba", "Estética", "Manicure", "Infantil", "Coloração"];
