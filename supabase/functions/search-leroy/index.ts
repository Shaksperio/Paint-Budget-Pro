import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

type LeroyProduct = {
  nome: string;
  marca: string;
  preco: number;
  sku: string;
  tipo: string;
  coberturaEstimada: number;
  fonte: 'api' | 'fallback';
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

function detectProductType(text: string) {
  const normalized = text.toLowerCase();
  if (normalized.includes('selador')) return 'Selador';
  if (normalized.includes('massa')) return 'Massa';
  if (normalized.includes('imperme')) return 'Impermeabilizante';
  if (normalized.includes('esmalte')) return 'Esmalte';
  return 'Tinta Acrílica';
}

function estimateCoverage(text: string) {
  const normalized = text.toLowerCase();
  if (normalized.includes('18l')) return 300;
  if (normalized.includes('3.6l')) return 60;
  if (normalized.includes('900ml')) return 15;
  return 80;
}

function fallbackProducts(searchTerm: string): LeroyProduct[] {
  const brands = ['Suvinil', 'Coral', 'Sherwin-Williams'];
  return brands.map((marca, index) => {
    const base = 60 + index * 20;
    return {
      nome: `${searchTerm || 'Tinta'} ${marca} Premium`,
      marca,
      preco: Number((base + Math.random() * 40).toFixed(2)),
      sku: `SIM-${Date.now()}-${index}`,
      tipo: detectProductType(searchTerm),
      coberturaEstimada: estimateCoverage(searchTerm),
      fonte: 'fallback'
    };
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { searchTerm = '' } = (await req.json()) as { searchTerm?: string };

    const url = `https://www.leroymerlin.com.br/api/v1/search?query=${encodeURIComponent(searchTerm)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Accept: 'application/json',
        'Accept-Language': 'pt-BR,pt;q=0.9'
      }
    });

    let products: LeroyProduct[] = [];

    if (response.ok) {
      const payload = await response.json();
      const items = payload?.products || payload?.items || [];

      products = items.slice(0, 10).map((item: any, index: number) => {
        const nome = String(item?.name || item?.title || 'Produto');
        return {
          nome,
          marca: String(item?.brand || 'Sem marca'),
          preco: Number(item?.price || item?.priceValue || 0),
          sku: String(item?.sku || item?.id || `SKU-${index}`),
          tipo: detectProductType(nome),
          coberturaEstimada: estimateCoverage(nome),
          fonte: 'api'
        };
      }).filter((item: LeroyProduct) => Number.isFinite(item.preco) && item.preco > 0);
    }

    if (!products.length) {
      products = fallbackProducts(searchTerm);
    }

    return new Response(JSON.stringify({ products }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ products: fallbackProducts('Tinta'), error: String(error) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  }
});
