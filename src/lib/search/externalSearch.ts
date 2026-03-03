import { supabase } from '../supabase';
import { fallbackSinapi } from './sinapiParser';
import type { LeroyProductResult, SinapiCategory, SinapiServiceResult } from './types';

const CACHE_TTL_MS = 1000 * 60 * 30;

function getCache<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { ts: number; value: T };
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed.value;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify({ ts: Date.now(), value }));
}

function fallbackLeroy(searchTerm: string): LeroyProductResult[] {
  const brands = ['Suvinil', 'Coral', 'Sherwin-Williams'];
  return brands.map((brand, index) => ({
    nome: `${searchTerm || 'Tinta'} ${brand} Premium`,
    marca: brand,
    preco: Number((89 + index * 14).toFixed(2)),
    sku: `SIM-${Date.now()}-${index}`,
    tipo: /imperme|manta|veda/i.test(searchTerm) ? 'Impermeabilizante' : 'Tinta Acrílica',
    coberturaEstimada: /18l/i.test(searchTerm) ? 300 : 60,
    fonte: 'fallback'
  }));
}

export async function searchSinapi(searchTerm: string, categoria: SinapiCategory) {
  const key = `sinapi:${searchTerm}:${categoria}`;
  const cached = getCache<SinapiServiceResult[]>(key);
  if (cached) return { data: cached, source: 'cache' as const };

  const { data, error } = await supabase.functions.invoke('search-sinapi', {
    body: { searchTerm, categoria }
  });

  if (!error && Array.isArray(data?.services) && data.services.length) {
    setCache(key, data.services);
    return { data: data.services as SinapiServiceResult[], source: 'remote' as const };
  }

  const fallback = fallbackSinapi(searchTerm, categoria);
  setCache(key, fallback);
  return { data: fallback, source: 'fallback' as const };
}

export async function searchLeroy(searchTerm: string) {
  const key = `leroy:${searchTerm}`;
  const cached = getCache<LeroyProductResult[]>(key);
  if (cached) return { data: cached, source: 'cache' as const };

  const { data, error } = await supabase.functions.invoke('search-leroy', {
    body: { searchTerm }
  });

  if (!error && Array.isArray(data?.products) && data.products.length) {
    setCache(key, data.products);
    return { data: data.products as LeroyProductResult[], source: 'remote' as const };
  }

  const fallback = fallbackLeroy(searchTerm);
  setCache(key, fallback);
  return { data: fallback, source: 'fallback' as const };
}
