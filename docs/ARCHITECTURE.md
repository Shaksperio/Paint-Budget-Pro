# Arquitetura do OrçaMaster

## Estado atual documentado

O checkout atual contém uma base web Vite + React + TypeScript, mas ainda não contém os módulos completos esperados para o OrçaMaster: clientes, produtos/serviços, orçamentos, faturas, recibos, autenticação, Firebase fallback, geração profissional de PDF e dashboard financeiro.

O objetivo desta documentação é registrar a arquitetura observada e propor uma arquitetura-alvo antes de qualquer refatoração funcional.

## Stack observada

- **Frontend:** React 18 e React DOM.
- **Build:** Vite 7 e TypeScript 5.
- **Testes:** Vitest.
- **Dependências declaradas para evolução:** Supabase JS, TanStack Query, Dexie, jsPDF, jsPDF AutoTable, QR Code React, React Router DOM e Recharts.

## Estrutura atual

```text
src/
  components/      Componentes reutilizáveis iniciais.
  lib/             Utilitários e regras puras iniciais.
  styles/          Estilos globais.
  App.tsx          Casca atual da aplicação.
  main.tsx         Ponto de entrada React.
```

## Lacunas atuais

- Sem módulos de domínio completos.
- Sem rotas estruturadas.
- Sem autenticação.
- Sem camada de acesso a dados.
- Sem validação centralizada.
- Sem Firebase fallback implementado no checkout atual.
- Sem migrations/regras de banco versionadas.
- Sem GitHub Actions.

## Arquitetura-alvo proposta

```text
src/
  app/
    AppProviders.tsx
    router.tsx
    AuthenticatedLayout.tsx
  components/
    ui/
    forms/
    feedback/
    data-display/
  features/
    auth/
    companies/
    clients/
    items/
    budgets/
    invoices/
    receipts/
    payments/
    reports/
    settings/
  lib/
    api/
    auth/
    config/
    data/
    firebase/
    pdf/
    validation/
    logging/
    storage/
  styles/
    globals.css
    tokens.css
  tests/
    factories/
    utils/
```

## Camadas recomendadas

### UI

Responsável por componentes visuais, formulários e layouts. Não deve conter regras de persistência nem acesso direto ao banco.

### Features

Cada domínio deve conter telas, hooks, tipos e regras específicas. Exemplos: `clients`, `items`, `budgets`, `invoices` e `receipts`.

### Serviços de dados

Uma camada em `src/lib/data` deve isolar Supabase/Firebase/Manus ou qualquer backend. A UI não deve chamar SDKs diretamente.

### Validação

Entradas de usuário e payloads remotos devem passar por validação centralizada antes de gravação, cálculo ou geração de PDF.

### PDF

A geração de PDF deve ser isolada em módulo próprio, com templates testáveis e sem acoplamento com componentes de tela.

### Autenticação e permissões

A arquitetura deve suportar:

- Usuário autenticado.
- Empresa ativa.
- Papéis: dono, admin e operador.
- Guards de rota.
- Políticas de banco por `company_id`.

### Firebase espelho/fallback

O Firebase deve ser tratado como camada explícita de sincronização/fallback, não como dependência acidental. A arquitetura deve prever:

- Fila de sincronização.
- Logs de divergência.
- Rotina de restauração.
- Indicador de status de sincronização.
- Modo degradado/offline.

### Logs, auditoria e backup

Eventos críticos devem gerar logs sem dados sensíveis. Entidades financeiras devem registrar auditoria de criação, edição, envio, aceite, recusa, pagamento e cancelamento. Backups e exportações devem ser planejados antes do deploy final.

## Regras de evolução

- Não reescrever tudo em um único PR.
- Não introduzir novas funcionalidades antes de documentar dependências e dados reais.
- Não expor chaves, tokens ou dados sensíveis.
- Preservar funcionalidades existentes e justificar qualquer remoção.
- Manter PRs pequenos, com objetivo claro e validação automatizada quando disponível.
