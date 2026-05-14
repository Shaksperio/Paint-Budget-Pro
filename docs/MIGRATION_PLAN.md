# Plano de migração do OrçaMaster

## Objetivo

Migrar o OrçaMaster do fluxo legado Manus AI para um fluxo profissional com GitHub + Codex + Firebase/fallback + deploy externo, sem reescrita em massa e sem perda de funcionalidades existentes.

## Princípios

- Issue antes do trabalho.
- PR pequeno antes do merge.
- Auditoria antes de refatoração.
- Documentação junto com mudança técnica.
- Nenhuma credencial no Git.
- Funcionalidades existentes devem ser preservadas ou removidas apenas com justificativa documentada.

## Fase 0 — Congelamento e inventário

1. Fazer backup completo do Manus AI.
2. Fazer backup do Firebase espelho.
3. Exportar ou documentar schemas, coleções, regras e dados críticos.
4. Mapear integrações externas, chaves, endpoints e deploy atual.
5. Registrar divergências entre Manus AI e Firebase.

## Fase 1 — PR 1: documentação e auditoria

Entregáveis:

- `README.md` atualizado.
- `.env.example` seguro.
- `docs/TECHNICAL_AUDIT.md`.
- `docs/ARCHITECTURE.md`.
- `docs/DATABASE_SCHEMA.md`.
- `docs/MIGRATION_PLAN.md`.
- `docs/ROADMAP.md`.
- `docs/DESIGN_SYSTEM.md`.

Critério: nenhum comportamento crítico deve ser alterado.

## Fase 2 — Organização de base

- Estrutura de pastas por módulos.
- Convenções de naming.
- Separação entre UI, features, services, validation e integrations.
- Remoção de código morto somente após confirmação.

## Fase 3 — Qualidade e CI

- ESLint.
- Prettier.
- Typecheck.
- Testes básicos.
- GitHub Actions para PRs.
- Instruções locais validadas.

## Fase 4 — Módulos essenciais

1. Autenticação.
2. Empresas/perfis.
3. Clientes.
4. Produtos e serviços.
5. Orçamentos.
6. Faturas.
7. Recibos.
8. PDF.
9. Dashboard financeiro.

## Fase 5 — Firebase sync/fallback

- Definir origem de verdade.
- Implementar fila de sincronização.
- Registrar divergências.
- Criar rotina de restauração.
- Implementar modo offline/degradado.

## Fase 6 — Segurança e deploy

- Regras de banco.
- Permissões por papel.
- Logs de auditoria.
- Backup/exportação.
- Monitoramento.
- Deploy final.

## Sequência de PRs planejada

1. Documentação e auditoria.
2. Organização de pastas.
3. Configuração de ambiente e build.
4. Autenticação.
5. Clientes.
6. Produtos e serviços.
7. Orçamentos.
8. Faturas.
9. Recibos.
10. Geração de PDF.
11. Dashboard financeiro.
12. Firebase sync/fallback.
13. Design system.
14. Responsividade mobile.
15. Segurança e regras de banco.
16. Deploy.
