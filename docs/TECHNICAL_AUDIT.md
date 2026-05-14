# Auditoria técnica inicial do OrçaMaster

## Escopo desta auditoria

Esta auditoria foi feita sobre o checkout disponível neste ambiente (`/workspace/Paint-Budget-Pro`) e deve ser tratada como o primeiro PR de documentação. Não houve acesso a dados do Manus AI, Firebase, Supabase ou a qualquer credencial. Também não foram validadas bases externas, regras de segurança em produção ou histórico completo fora do Git local.

O objetivo é registrar o estado atual antes de novas refatorações, para que o OrçaMaster possa evoluir por Pull Requests pequenos e revisáveis.

## Visão geral do projeto

O repositório contém uma base web Vite + React + TypeScript. O nome técnico no `package.json` ainda está como `paint-budget-pro`, enquanto o contexto do produto informado pelo solicitante é **OrçaMaster**.

A aplicação disponível no checkout atual é mínima: possui ponto de entrada React, tela inicial simples, estilos globais e componentes básicos. Não há, no código versionado atual, implementação completa de clientes, faturas, recibos, autenticação, painel financeiro, PDF profissional, Firebase fallback ou integração Manus AI.

## Tecnologias usadas

### Runtime e build

- Node/npm via scripts do `package.json`.
- Vite para desenvolvimento e build web.
- TypeScript com configuração strict.
- React 18 e React DOM.

### Dependências de produto declaradas

- `@supabase/supabase-js`: cliente Supabase, ainda sem camada de serviços implementada no checkout atual.
- `@tanstack/react-query`: gerenciamento de cache/requests, ainda sem uso visível no checkout atual.
- `dexie`: IndexedDB/offline, ainda sem uso visível no checkout atual.
- `jspdf` e `jspdf-autotable`: PDF, ainda sem uso visível no checkout atual.
- `qrcode.react`: QR Code, ainda sem uso visível no checkout atual.
- `react-router-dom`: rotas, ainda sem uso visível no checkout atual.
- `recharts`: gráficos, ainda sem uso visível no checkout atual.

### Qualidade e testes declarados

- `typescript` para typecheck.
- `vitest` para testes.
- Não há ESLint/Prettier configurados no checkout atual.
- Não há GitHub Actions configurado no checkout atual.

## Estrutura atual

```text
.
├── .env.example
├── .gitignore
├── README.md
├── CHANGELOG.md
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── DESIGN_SYSTEM.md
│   ├── MIGRATION_PLAN.md
│   ├── ROADMAP.md
│   └── TECHNICAL_AUDIT.md
├── index.html
├── package.json
├── package-lock.json
├── src/
│   ├── App.tsx
│   ├── components/
│   ├── lib/
│   ├── main.tsx
│   └── styles/
├── tsconfig.app.json
├── tsconfig.json
└── vite.config.ts
```

## Scripts disponíveis

| Script | Comando | Situação |
| --- | --- | --- |
| `dev` | `vite` | Disponível para desenvolvimento local. |
| `build` | `tsc -b && vite build` | Disponível e usado como validação de produção. |
| `preview` | `vite preview` | Disponível para inspecionar o build. |
| `check` | `tsc --noEmit` | Disponível para typecheck. |
| `test` | `vitest run` | Disponível para testes unitários. |

## Banco de dados e persistência

Não há migrations, schema SQL, regras Firebase, tipos gerados Supabase ou camada de repositórios no checkout atual.

As dependências indicam intenção de uso de Supabase, IndexedDB e possivelmente fallback/offline, mas isso ainda precisa ser validado contra a base real do Manus AI/Firebase.

## Autenticação e permissões

Não há fluxo de autenticação implementado no checkout atual. Também não há RBAC, controle por empresa, guards de rota, políticas RLS versionadas ou documentação de claims/perfis.

## Rotas

`react-router-dom` está listado nas dependências, mas não há árvore de rotas no checkout atual. A aplicação renderiza diretamente o componente raiz.

## Componentes e estilos

Existem componentes iniciais em `src/components` e CSS global em `src/styles`. Ainda não há design system formal, tokens versionados completos, guideline de acessibilidade, biblioteca de formulários, tabela padrão ou componentes de navegação.

## Integrações

Nenhuma integração remota está ativa no código analisado. As integrações esperadas para a evolução do OrçaMaster são:

- Manus AI como origem/legado a ser auditado.
- Firebase como espelho/fallback informado no contexto do produto.
- Supabase declarado nas dependências e variáveis públicas.
- Geração de PDF com `jspdf`/`jspdf-autotable`.
- QR Code com `qrcode.react`.

## Problemas críticos

1. **Ausência do produto funcional completo no checkout atual.** Os módulos centrais do OrçaMaster não estão presentes de forma implementada e testável.
2. **Nome técnico inconsistente.** O package ainda usa `paint-budget-pro`, enquanto o produto esperado é OrçaMaster.
3. **Sem documentação operacional de dados reais.** Não há mapeamento confirmado de Manus AI, Firebase, Supabase, regras de migração ou rotina de backup.
4. **Sem autenticação e isolamento multiempresa.** Isso impede uso seguro em produção.
5. **Sem CI.** PRs ainda não são validados automaticamente por GitHub Actions.
6. **Sem lint/format.** O projeto depende apenas de TypeScript/test/build para padronização.

## Riscos de segurança

- Não há políticas de acesso versionadas para Firebase/Supabase.
- Não há camada server-side de validação para operações críticas.
- Não há rate limit, auditoria ou logging estruturado.
- Não há separação documentada entre chaves públicas de frontend e segredos de backend.
- Não há processo versionado de backup/restauração.
- Qualquer credencial real deve permanecer fora do Git; `.env.example` deve conter apenas placeholders.

## Problemas de performance

- Não há medição de bundle, lazy loading ou code splitting por rota.
- Não há estratégia documentada de cache, paginação ou busca incremental.
- Não há camada de sincronização com fila/offline para evitar bloqueios em redes instáveis.
- Dependências pesadas de PDF/gráficos estão declaradas e devem ser carregadas sob demanda quando forem implementadas.

## Problemas de design/UI

- Não há identidade visual final do OrçaMaster documentada.
- Não há tokens completos de cor, tipografia, espaçamento, raio e sombras.
- Não há componentes padrão para formulários, modais, tabelas, badges de status, navegação, empty states e feedback de erro.
- Não há templates profissionais de orçamento/fatura/recibo.
- Não há checklist de responsividade mobile nem acessibilidade.

## Problemas de arquitetura

- Não há organização por módulos de domínio (`clients`, `items`, `budgets`, `invoices`, `receipts`, `reports`).
- Não há camada de serviços/repositórios para isolar acesso a dados.
- Não há camada de validação de dados de entrada.
- Não há fronteira clara entre frontend, backend/API, edge functions e integrações externas.
- Não há estratégia definida para Firebase como espelho/fallback.
- Não há documentação de logs de erro, auditoria e exportação.

## Dependências ausentes ou quebradas

### Ausentes para qualidade de código

- ESLint.
- Prettier.
- Configuração de GitHub Actions.
- Ferramenta de validação de ambiente, como schema para `import.meta.env`.

### Ausentes para produto

- Biblioteca/estratégia de validação, como Zod, Valibot ou validação própria centralizada.
- Camada de autenticação integrada.
- Migrations/regras de banco versionadas.
- Testes de componentes e fluxos críticos.

### Potencialmente não utilizadas no checkout atual

As dependências Supabase, React Query, Dexie, jsPDF, QR Code, Router e Recharts estão declaradas, mas não aparecem em uso funcional completo no código analisado. Elas devem ser mantidas apenas se forem necessárias para os próximos módulos, ou removidas em PR separado após confirmação.

## Recomendações priorizadas

### P0 — Antes de mexer em funcionalidade

1. Confirmar o repositório canônico e alinhar nome técnico (`paint-budget-pro` vs `OrçaMaster`).
2. Documentar origem real de dados no Manus AI e espelho Firebase sem expor credenciais.
3. Criar Issue de auditoria e manter PRs pequenos.
4. Adicionar CI mínimo em PR separado: typecheck, testes e build.
5. Definir `.env.example` oficial e política de segredos.

### P1 — Fundação técnica

1. Definir arquitetura de pastas por módulos.
2. Criar camada de serviços para dados.
3. Criar validação centralizada.
4. Definir autenticação e permissões por usuário/empresa.
5. Versionar regras/migrations do banco escolhido.

### P2 — Produto essencial

1. Clientes.
2. Produtos e serviços.
3. Orçamentos.
4. Faturas.
5. Recibos.
6. PDF e envio por WhatsApp/e-mail.

### P3 — Operação e escala

1. Dashboard financeiro.
2. Relatórios por período.
3. Firebase sync/fallback.
4. Auditoria de alterações.
5. Backup/exportação CSV/JSON.
6. Deploy e monitoramento.
