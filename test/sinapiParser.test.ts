import { describe, expect, it } from 'vitest';
import { detectCategory, extractSinapiPrices, fallbackSinapi } from '../src/lib/search/sinapiParser';

describe('sinapiParser', () => {
  it('detecta categoria impermeabilizacao por palavras-chave', () => {
    expect(detectCategory('Impermeabilização com manta asfáltica')).toBe('impermeabilizacao');
  });

  it('extrai preços de markdown SINAPI', () => {
    const markdown = '88485 Aplicação de fundo selador acrílico em paredes R$ 4,67 m²';
    const result = extractSinapiPrices(markdown);
    expect(result.length).toBe(1);
    expect(result[0].codigo).toBe('88485');
    expect(result[0].preco).toBeCloseTo(4.67);
  });

  it('retorna fallback filtrado', () => {
    const result = fallbackSinapi('manta', 'impermeabilizacao');
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((item) => item.categoria === 'impermeabilizacao')).toBe(true);
  });
});
