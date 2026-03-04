# Relatório de Desenvolvimento — Paint Budget Pro

## 🎨 Visão Geral
O **Paint Budget Pro** é um aplicativo web para criação e gestão de orçamentos de pintura e impermeabilização, com foco em produtividade, padronização comercial e geração de documentos profissionais.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Estilização** | Tailwind CSS + shadcn/ui |
| **Roteamento** | React Router DOM v6 |
| **Estado/Cache** | TanStack React Query |
| **Gráficos** | Recharts |
| **PDF** | jsPDF + jspdf-autotable |
| **QR Code** | qrcode.react |
| **Backend** | Lovable Cloud (Edge Functions) |
| **Busca externa** | Firecrawl (conector) |

---

## 📦 Módulos Desenvolvidos

### 1. Dashboard (Painel de Controle)
- Cards de estatísticas: total de orçamentos, valor total, ticket médio e cadastros.
- Gráficos para visualização de desempenho e distribuição de dados.
- Atalhos para histórico de orçamentos recentes.

### 2. Criação de Orçamentos
- Cabeçalho da empresa e identificação do orçamento.
- Cadastro de cliente com consulta automática de endereço por CEP.
- Tabela de itens com composição de custo por área, tinta e demãos.
- Cálculo de totais, taxas, prazo e pagamento.
- Pré-visualização do orçamento com ações de PDF/impressão.

### 3. Gestão de Cadastros
- CRUD de produtos, serviços e profissionais.
- Seleção de profissional para vincular orçamento.
- Busca SINAPI integrada para apoio à precificação.

### 4. Histórico e Documentos
- Histórico local de orçamentos (localStorage).
- Restauração de orçamento salvo.
- Geração de PDF e anexos de fotos.

### 5. Personalização e Navegação
- Tema visual, logotipo, QR Code e painel de configurações.
- Navegação por menu lateral entre módulos.

### 6. Edge Functions
- `search-sinapi`: consulta de referência SINAPI com fallback.
- `search-leroy`: busca de produtos.

---

## 📐 Tipos e Interfaces
Modelagem para orçamentos, itens, materiais, clientes, empresa, profissionais, serviços e estado global da aplicação.

---

## 🔗 Integrações
- Lovable Cloud (serverless)
- Firecrawl
- ViaCEP

---

## 📊 Resumo em Números

| Métrica | Valor |
|---------|-------|
| Componentes React | ~30 |
| Componentes UI (shadcn) | ~45 |
| Edge Functions | 2 |
| Tipos/Interfaces | 10 |
| Dependências | ~40 |

---

## 🚀 Próximas Entregas Prioritárias
1. Testar fluxo completo ponta a ponta.
2. Adicionar autenticação de usuários.
3. Persistir dados em banco de dados.
