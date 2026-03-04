import type { SinapiServiceResult } from './types';

const referenceBase: SinapiServiceResult[] = [
  { codigo: '88485', descricao: 'Aplicação de fundo selador acrílico em paredes', unidade: 'm²', preco: 4.67, categoria: 'pintura', fonte: 'referencia' },
  { codigo: '88489', descricao: 'Pintura látex acrílica premium em paredes, duas demãos', unidade: 'm²', preco: 14.98, categoria: 'pintura', fonte: 'referencia' },
  { codigo: '88497', descricao: 'Pintura esmalte sintético em madeira, duas demãos', unidade: 'm²', preco: 19.37, categoria: 'pintura', fonte: 'referencia' },
  { codigo: '98546', descricao: 'Impermeabilização de superfície com manta asfáltica', unidade: 'm²', preco: 68.11, categoria: 'impermeabilizacao', fonte: 'referencia' },
  { codigo: '98554', descricao: 'Impermeabilização com argamassa polimérica', unidade: 'm²', preco: 32.45, categoria: 'impermeabilizacao', fonte: 'referencia' }
];

export function detectCategory(text: string): 'pintura' | 'impermeabilizacao' {
  const normalized = text.toLowerCase();
  if (/(imperme|manta|veda|hidrofug|argamassa polim)/.test(normalized)) return 'impermeabilizacao';
  return 'pintura';
}

export function extractSinapiPrices(markdown: string): SinapiServiceResult[] {
  const lines = markdown.split('\n').map((line) => line.trim()).filter(Boolean);
  const results: SinapiServiceResult[] = [];

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

export function fallbackSinapi(searchTerm: string, categoria: 'pintura' | 'impermeabilizacao' | 'todos') {
  const term = searchTerm.toLowerCase();
  return referenceBase.filter((item) => {
    const categoryMatch = categoria === 'todos' ? true : item.categoria === categoria;
    const termMatch = term ? item.descricao.toLowerCase().includes(term) || item.codigo.includes(term) : true;
    return categoryMatch && termMatch;
  });
}
