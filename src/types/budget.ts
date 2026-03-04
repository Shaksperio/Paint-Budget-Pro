export type BudgetItem = {
  id: string;
  descricao: string;
  areaM2: number;
  tipoTinta: string;
  demaos: number;
  precoM2: number;
};

export type Product = {
  id: string;
  nome: string;
  marca: string;
  preco: number;
  unidade: string;
  tipo: string;
};

export type Service = {
  id: string;
  nome: string;
  categoria: 'pintura' | 'impermeabilizacao';
  precoBase: number;
  tempoEstimado: string;
  descricao: string;
};

export type Professional = {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  especialidade: string;
  valorHora: number;
};

export type CompanyInfo = { nome: string; telefone: string; email: string; logo?: string };
export type ClientInfo = { nome: string; telefone: string; cep: string; endereco: string };

export type BudgetData = {
  id: string;
  numero: string;
  criadoEm: string;
  company: CompanyInfo;
  client: ClientInfo;
  professionalId?: string;
  itens: BudgetItem[];
  taxaPercentual: number;
  desconto: number;
  formaPagamento: string;
  prazoEntrega: string;
  observacoes: string;
};

export type User = { id: string; email: string; nome: string; password: string };
