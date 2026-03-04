import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

type Categoria = 'pintura' | 'impermeabilizacao' | 'todos';

type SinapiResult = {
  codigo: string;
  descricao: string;
  unidade: string;
  preco: number;
  categoria: 'pintura' | 'impermeabilizacao';
  fonte: 'firecrawl' | 'referencia';
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const baseReferencia: SinapiResult[] = [
  { codigo: '88485', descricao: 'Aplicação de fundo selador acrílico em paredes', unidade: 'm²', preco: 4.67, categoria: 'pintura', fonte: 'referencia' },
  { codigo: '88489', descricao: 'Pintura látex acrílica premium em paredes, duas demãos', unidade: 'm²', preco: 14.98, categoria: 'pintura', fonte: 'referencia' },
  { codigo: '88497', descricao: 'Pintura esmalte sintético em madeira, duas demãos', unidade: 'm²', preco: 19.37, categoria: 'pintura', fonte: 'referencia' },
  { codigo: '98546', descricao: 'Impermeabilização de superfície com manta asfáltica', unidade: 'm²', preco: 68.11, categoria: 'impermeabilizacao', fonte: 'referencia' },
  { codigo: '98554', descricao: 'Impermeabilização com argamassa polimérica', unidade: 'm²', preco: 32.45, categoria: 'impermeabilizacao', fonte: 'referencia' }
];

function detectCategory(text: string): 'pintura' | 'impermeabilizacao' {
  const normalized = text.toLowerCase();
  if (/(imperme|manta|veda|hidrofug|argamassa polim)/.test(normalized)) return 'impermeabilizacao';
  return 'pintura';
}

function extractSinapiPrices(markdown: string): SinapiResult[] {
  const lines = markdown.split('\n').map((line) => line.trim()).filter(Boolean);
  const results: SinapiResult[] = [];

  for (const line of lines) {
    const match = line.match(/(\d{4,6}).*?([-–:]\s*)?(.+?)\s+(R\$\s*[\d.,]+)/i);
    if (!match) continue;

    const codigo = match[1];
    const descricao = match[3].replace(/\|/g, ' ').trim();
    const preco = Number(match[4].replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
    if (!Number.isFinite(preco)) continue;

    results.push({
      codigo,
      descricao,
      unidade: /m²|m2/i.test(line) ? 'm²' : 'un',
      preco,
      categoria: detectCategory(descricao),
      fonte: 'firecrawl'
    });
  }

  return results;
}

function fallbackSinapi(searchTerm: string, categoria: Categoria): SinapiResult[] {
  const term = searchTerm.toLowerCase();
  return baseReferencia.filter((item) => {
    const categoryMatch = categoria === 'todos' ? true : item.categoria === categoria;
    const termMatch = term ? item.descricao.toLowerCase().includes(term) || item.codigo.includes(term) : true;
    return categoryMatch && termMatch;
  });
}

async function firecrawlSearch(searchTerm: string): Promise<SinapiResult[]> {
  const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
  if (!apiKey) return [];

  const response = await fetch('https://api.firecrawl.dev/v1/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      query: `SINAPI preço ${searchTerm} pintura impermeabilização`,
      limit: 3,
      scrapeOptions: { formats: ['markdown'] }
    })
  });

  if (!response.ok) return [];
  const payload = await response.json();
  const pages = payload?.data || [];

  return pages.flatMap((page: { markdown?: string }) =>
    page.markdown ? extractSinapiPrices(page.markdown) : []
  );
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { searchTerm = '', categoria = 'todos' } = (await req.json()) as {
      searchTerm?: string;
      categoria?: Categoria;
    };

    let results = await firecrawlSearch(searchTerm);

    if (!results.length) {
      results = fallbackSinapi(searchTerm, categoria);
    } else {
      results = results.filter((item) => (categoria === 'todos' ? true : item.categoria === categoria));
    }

    return new Response(JSON.stringify({ services: results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ services: [], error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
