export type SinapiCategory = 'pintura' | 'impermeabilizacao' | 'todos';

export type SinapiServiceResult = {
  codigo: string;
  descricao: string;
  unidade: string;
  preco: number;
  categoria: 'pintura' | 'impermeabilizacao';
  fonte: 'firecrawl' | 'referencia';
};

export type LeroyProductResult = {
  nome: string;
  marca: string;
  preco: number;
  sku: string;
  tipo: string;
  coberturaEstimada: number;
  fonte: 'api' | 'fallback';
};
