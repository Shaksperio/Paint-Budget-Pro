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

Este projeto já está configurado para usar:

- URL: `https://qkiezzceglavdilvuxro.supabase.co`
- Publishable Key: `sb_publishable_-lVpJTqi1VISEK8BBFLyrw_NqXScRRV`

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
