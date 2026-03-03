import { createClient } from '@supabase/supabase-js';
import type { BudgetData, Product, Professional, Service } from '../types/budget';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://jnabeytsbxefzrnflwad.supabase.co';
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_-yT5Tj1k1qplV5dJGvMeOA_6IwrG5P8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: false }
});

export async function upsertBudgetRemote(budget: BudgetData) {
  return supabase.from('budgets').upsert({
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
  return supabase.from('products').upsert({
    id: product.id,
    nome: product.nome,
    marca: product.marca,
    preco: product.preco,
    unidade: product.unidade,
    tipo: product.tipo
  });
}

export async function upsertServiceRemote(service: Service) {
  return supabase.from('services').upsert({
    id: service.id,
    nome: service.nome,
    categoria: service.categoria,
    preco_base: service.precoBase,
    tempo_estimado: service.tempoEstimado,
    descricao: service.descricao
  });
}

export async function upsertProfessionalRemote(professional: Professional) {
  return supabase.from('professionals').upsert({
    id: professional.id,
    nome: professional.nome,
    telefone: professional.telefone,
    email: professional.email,
    especialidade: professional.especialidade,
    valor_hora: professional.valorHora
  });
}
