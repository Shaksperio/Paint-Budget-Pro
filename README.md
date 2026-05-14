# OrçaMaster

OrçaMaster é um aplicativo planejado para orçamento, fatura, recibo, clientes, produtos/serviços e gestão financeira. O objetivo deste repositório é migrar o projeto para um fluxo profissional com GitHub + Codex, preservar funcionalidades existentes, documentar a arquitetura e evoluir por Pull Requests pequenos.

> **Nota de auditoria:** o checkout disponível neste ambiente ainda usa o nome técnico `paint-budget-pro` no `package.json`. A renomeação deve ser feita em PR separado, depois de confirmar o repositório canônico e evitar que a mudança de nome se misture com a auditoria inicial.

## Estado atual

Este PR documenta o estado inicial encontrado no checkout atual:

- Base web Vite + React + TypeScript.
- Scripts de desenvolvimento, typecheck, teste e build já declarados.
- Dependências declaradas para Supabase, Dexie, PDF, QR Code, rotas e gráficos.
- Sem módulos completos de clientes, faturas, recibos, autenticação, Firebase fallback ou dashboard financeiro no código analisado.
- Sem migrations/regras de banco versionadas no checkout atual.
- Sem GitHub Actions, lint ou format configurados no checkout atual.

## Como executar localmente

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts disponíveis

```bash
npm run check   # TypeScript sem emissão de arquivos
npm run test    # Testes unitários com Vitest
npm run build   # Typecheck e build Vite de produção
npm run preview # Preview local do build
```

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha apenas valores do seu ambiente local.

| Variável | Uso | Observação |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | URL pública do projeto Supabase, caso Supabase seja usado no frontend. | Pode ser exposta ao browser. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave pública/publishable para o cliente web. | Nunca usar chave secreta no frontend. |
| `FIRECRAWL_API_KEY` | Busca externa em backend/edge function, se existir. | Não deve ser usada diretamente no frontend. |

Nunca commite `.env`, tokens, chaves privadas, exports com dados reais de clientes ou credenciais do Manus AI/Firebase/Supabase.

## Documentação do PR 1

- [`docs/TECHNICAL_AUDIT.md`](./docs/TECHNICAL_AUDIT.md): auditoria técnica inicial, problemas críticos, riscos e recomendações.
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md): arquitetura observada e arquitetura-alvo proposta.
- [`docs/DATABASE_SCHEMA.md`](./docs/DATABASE_SCHEMA.md): modelo de dados alvo para orientar a migração.
- [`docs/MIGRATION_PLAN.md`](./docs/MIGRATION_PLAN.md): fases e sequência de PRs pequenos.
- [`docs/ROADMAP.md`](./docs/ROADMAP.md): roadmap de produto e operação.
- [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md): diretrizes iniciais de design system, sem implementação funcional neste PR.
- [`CHANGELOG.md`](./CHANGELOG.md): histórico de mudanças documentadas.

## Fluxo de trabalho recomendado

1. Abrir uma Issue com o objetivo e escopo.
2. Executar uma tarefa pequena com Codex.
3. Abrir Pull Request revisável.
4. Rodar checks e revisar o diff.
5. Fazer merge somente após aprovação.

## Próximos PRs sugeridos

1. Organização de pastas.
2. Configuração de ambiente, lint, format e CI.
3. Autenticação.
4. Clientes.
5. Produtos e serviços.
6. Orçamentos.
7. Faturas.
8. Recibos.
9. Geração de PDF.
10. Dashboard financeiro.
11. Firebase sync/fallback.
12. Design system.
13. Responsividade mobile.
14. Segurança e regras de banco.
15. Deploy.
