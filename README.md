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
