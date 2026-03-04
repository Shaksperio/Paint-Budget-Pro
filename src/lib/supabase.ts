import { createClient } from '@supabase/supabase-js';
import type { BudgetData, Product, Professional, Service } from '../types/budget';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://jnabeytsbxefzrnflwad.supabase.co';
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_-yT5Tj1k1qplV5dJGvMeOA_6IwrG5P8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: false }
});

type SyncResult = {
  ok: boolean;
  message: string;
  hardFailure: boolean;
};

function mapSupabaseError(error: unknown): SyncResult {
  const msg = String((error as { message?: string })?.message || error || 'erro desconhecido').toLowerCase();
  const nonBlockingPatterns = ['jwt', 'permission', 'rls', 'relation', 'not found', 'failed to fetch'];
  const isNonBlocking = nonBlockingPatterns.some((pattern) => msg.includes(pattern));

  return {
    ok: false,
    hardFailure: !isNonBlocking,
    message: isNonBlocking
      ? 'Sincronização remota indisponível no momento. Dados salvos localmente.'
      : 'Falha inesperada na sincronização remota.'
  };
}

async function safeUpsert(table: string, payload: Record<string, unknown>): Promise<SyncResult> {
  try {
    const { error } = await supabase.from(table).upsert(payload);
    if (error) return mapSupabaseError(error);
    return { ok: true, message: 'Sincronizado com Supabase', hardFailure: false };
  } catch (error) {
    return mapSupabaseError(error);
  }
}

export async function upsertBudgetRemote(budget: BudgetData) {
  return safeUpsert('budgets', {
    id: budget.id,
    numero: budget.numero,
    criado_em: budget.criadoEm,
    company: budget.company,
    client: budget.client,
    itens: budget.itens,
    taxa_percentual: budget.taxaPercentual,
    desconto: budget.desconto,
    forma_pagamento: budget.formaPagamento,
    prazo_entrega: budget.prazoEntrega,
    observacoes: budget.observacoes,
    professional_id: budget.professionalId ?? null
  });
}

export async function upsertProductRemote(product: Product) {
  return safeUpsert('products', {
    id: product.id,
    nome: product.nome,
    marca: product.marca,
    preco: product.preco,
    unidade: product.unidade,
    tipo: product.tipo
  });
}

export async function upsertServiceRemote(service: Service) {
  return safeUpsert('services', {
    id: service.id,
    nome: service.nome,
    categoria: service.categoria,
    preco_base: service.precoBase,
    tempo_estimado: service.tempoEstimado,
    descricao: service.descricao
  });
}

export async function upsertProfessionalRemote(professional: Professional) {
  return safeUpsert('professionals', {
    id: professional.id,
    nome: professional.nome,
    telefone: professional.telefone,
    email: professional.email,
    especialidade: professional.especialidade,
    valor_hora: professional.valorHora
  });
}
