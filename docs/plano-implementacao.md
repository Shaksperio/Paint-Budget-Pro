# Plano de Implementação — Próxima Fase (MVP+)

Este plano cobre as três frentes prioritárias do produto:
1. **Teste completo do fluxo**
2. **Autenticação de usuários**
3. **Persistência de dados em banco**

## 1) Testar fluxo completo

### Objetivo
Garantir que o usuário consiga:
- entrar no sistema,
- cadastrar dados base,
- montar orçamento,
- salvar,
- recuperar histórico,
- exportar PDF,
sem regressões.

### Estratégia
- **Testes unitários**: regras de cálculo (itens, taxas, totais).
- **Testes de integração**: formulários + estado global + persistência.
- **Testes E2E**: jornada real de ponta a ponta no navegador.

### Casos críticos mínimos (E2E)
1. Criar orçamento com 2 itens e validar total.
2. Selecionar profissional e confirmar vínculo no orçamento.
3. Salvar orçamento e visualizar no histórico.
4. Restaurar orçamento salvo e confirmar campos preenchidos.
5. Exportar PDF sem erro.

### Critérios de aceite
- Cobertura de funções críticas de negócio (cálculo) >= 90%.
- 100% dos cenários E2E críticos passando na branch principal.
- Pipeline CI bloqueando merge em caso de falha de testes.

---

## 2) Adicionar autenticação de usuários

### Objetivo
Permitir acesso com segurança e isolar dados por usuário/empresa.

### Abordagem sugerida
- Provedor de auth (ex.: Supabase Auth, Clerk ou Auth0).
- Fluxos: cadastro, login, logout, recuperação de senha.
- Sessão persistente com refresh token seguro.

### Requisitos funcionais
- Tela de login e registro.
- Rotas protegidas para módulos internos.
- Controle de sessão expirada com redirecionamento.
- Perfil básico do usuário (nome, email, empresa).

### Requisitos de segurança
- Hash de senha no provedor (nunca armazenar senha em texto plano).
- Proteção de rotas no frontend e validação no backend.
- Rate limit nas rotas sensíveis.
- Segredos em variáveis de ambiente.

### Critérios de aceite
- Usuários não autenticados não acessam áreas internas.
- Sessão válida entre refresh de página.
- Logout invalida sessão imediatamente.

---

## 3) Persistir dados em banco de dados

### Objetivo
Substituir dependência exclusiva de `localStorage` por persistência robusta multiusuário.

### Modelagem inicial (sugestão)
- `users`
- `companies`
- `products`
- `services`
- `professionals`
- `budgets`
- `budget_items`
- `materials`
- `service_photos`

### Regras principais
- Todo registro deve ter `created_by` (usuário) e `company_id`.
- Soft delete para registros de catálogo.
- Índices em campos de consulta frequente (data, cliente, company_id).

### Migração planejada
1. Criar schema e migrations.
2. Implementar camada de acesso (API/edge functions).
3. Trocar leituras/escritas do localStorage por chamadas remotas.
4. Manter fallback local temporário em caso offline.
5. Criar rotina de migração de dados locais para conta autenticada.

### Critérios de aceite
- CRUD completo funcionando para orçamentos e cadastros.
- Histórico e dashboard carregando do banco.
- Dados segregados por usuário/empresa.
- Backups e logs de auditoria habilitados.

---

## Ordem recomendada de execução
1. Implementar autenticação (base de identidade).
2. Implementar banco + persistência por usuário.
3. Finalizar suíte de testes completa sobre fluxo já autenticado/persistido.

## Definição de pronto (DoD)
- CI com testes unitários + integração + E2E.
- Métricas mínimas de cobertura atendidas.
- Documentação de setup e arquitetura atualizada.
- Checklist de segurança revisado.
