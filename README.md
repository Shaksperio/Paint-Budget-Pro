# Paint Budget Pro (React + TypeScript)

Aplicativo SPA para orçamento de pintura/impermeabilização com interface mobile-first, cadastros completos e sincronização com Supabase.

## O que foi implementado

- Dashboard com métricas e gráficos.
- Fluxo de orçamento com histórico, QR Code e exportação PDF.
- Cadastros por módulos:
  - Produtos
  - Serviços (manual + busca SINAPI de referência local)
  - Profissionais
- Configurações com seletor de tema, QR do último orçamento e gerenciamento de dados.
- Persistência local (IndexedDB via Dexie).
- Sincronização remota com Supabase para orçamentos, produtos, serviços e profissionais.

## Supabase

Este projeto está configurado para o projeto:

- Project name: `supabase-coral-fence`
- Project ID: `jnabeytsbxefzrnflwad`
- URL: `https://jnabeytsbxefzrnflwad.supabase.co`

As variáveis públicas usadas no front-end são:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

> ⚠️ **Não use `sb_secret_*` no front-end.** A chave secreta deve ficar apenas em backend/edge functions.

### Configuração local

1. Copie `.env.example` para `.env`.
2. Ajuste valores se necessário.
3. Execute o app.

As tabelas esperadas no banco são:

- `budgets`
- `products`
- `services`
- `professionals`

> Se as tabelas não existirem ou RLS bloquear escrita, o app continua salvando localmente e mostra feedback de erro de sincronização.

## Como executar

```bash
npm install
npm run dev
```

## Deploy (Vercel)

Para evitar erro de build por branch/pasta incorreta no Vercel, configure:

- **Production Branch**: `codex/create-paint-budget-pro-app` (não usar mais `turbo`).
- **Root Directory**: `codex/create-paint-budget-pro-app`.

Se o projeto estiver importado com outra pasta raiz (ex.: `turbo`), o Vercel não encontra corretamente `package.json` e scripts de build.


## Buscadores externos implementados

- `supabase/functions/search-leroy/index.ts`: busca produtos na API da Leroy com fallback para catálogo simulado.
- `supabase/functions/search-sinapi/index.ts`: busca serviços SINAPI via Firecrawl (quando disponível), com fallback para base interna de referência.
- `src/lib/search/externalSearch.ts`: integração do frontend com as Edge Functions e cache local (TTL de 30 minutos) para resultados de preços.

### Testar busca SINAPI

1. Abra **Cadastros → Serviços → Buscar SINAPI**.
2. Busque por termos como `pintura`, `selador` ou `manta`.
3. O app exibirá se veio de cache, busca remota ou fallback interno.

## Testes

```bash
npm run test
npm run check
npm run build
```
