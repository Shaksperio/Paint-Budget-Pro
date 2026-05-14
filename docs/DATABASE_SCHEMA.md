# Modelo de dados do OrçaMaster

Este documento descreve o modelo alvo para orientar a migração. O checkout atual não contém migrations, regras Firebase, schema SQL ou tipos gerados de banco.

## Premissas

- O OrçaMaster deve suportar múltiplas empresas por usuário ou por conta.
- Orçamentos, faturas e recibos devem preservar snapshots dos dados usados na emissão.
- Valores financeiros devem ser armazenados como `numeric` com escala controlada ou em centavos inteiros.
- Toda tabela multiempresa deve ser isolada por `company_id`.
- Credenciais e segredos nunca devem ser versionados.

## Entidades alvo

### `users`

Representa o usuário autenticado.

| Campo | Tipo sugerido | Observação |
| --- | --- | --- |
| `id` | uuid/string | Mesmo ID do provedor de autenticação. |
| `email` | text | E-mail normalizado. |
| `name` | text | Nome exibido. |
| `created_at` | timestamp | Data de criação. |
| `updated_at` | timestamp | Última atualização. |

### `companies`

Empresas/perfis emissores de documentos.

| Campo | Tipo sugerido | Observação |
| --- | --- | --- |
| `id` | uuid/string | Chave primária. |
| `owner_id` | uuid/string | Usuário dono. |
| `name` | text | Nome fantasia ou razão social. |
| `tax_id` | text | CPF/CNPJ quando aplicável. |
| `email` | text | E-mail da empresa. |
| `phone` | text | Telefone/WhatsApp. |
| `address` | json | Endereço estruturado. |
| `logo_url` | text | Logo para PDFs. |
| `settings` | json | Numeração, impostos, tema e preferências. |

### `company_members`

Permissões por empresa.

| Campo | Tipo sugerido | Observação |
| --- | --- | --- |
| `id` | uuid/string | Chave primária. |
| `company_id` | uuid/string | Empresa. |
| `user_id` | uuid/string | Usuário. |
| `role` | enum | `owner`, `admin`, `operator`. |
| `created_at` | timestamp | Data de vínculo. |

### `clients`

Clientes atendidos.

| Campo | Tipo sugerido | Observação |
| --- | --- | --- |
| `id` | uuid/string | Chave primária. |
| `company_id` | uuid/string | Isolamento multiempresa. |
| `name` | text | Nome do cliente. |
| `document` | text | CPF/CNPJ opcional. |
| `email` | text | E-mail de envio. |
| `phone` | text | WhatsApp/telefone. |
| `address` | json | Endereço estruturado. |
| `notes` | text | Observações internas. |

### `items`

Produtos e serviços reutilizáveis.

| Campo | Tipo sugerido | Observação |
| --- | --- | --- |
| `id` | uuid/string | Chave primária. |
| `company_id` | uuid/string | Isolamento multiempresa. |
| `type` | enum | `product` ou `service`. |
| `name` | text | Nome exibido. |
| `description` | text | Detalhes. |
| `unit` | text | Unidade de medida. |
| `unit_price` | numeric/integer | Preço padrão. |
| `cost` | numeric/integer | Custo opcional. |
| `metadata` | json | SKU, estoque, SINAPI etc. |

### `estimates`

Orçamentos.

| Campo | Tipo sugerido | Observação |
| --- | --- | --- |
| `id` | uuid/string | Chave primária. |
| `company_id` | uuid/string | Isolamento multiempresa. |
| `client_id` | uuid/string | Cliente atual, se existir. |
| `number` | text | Numeração amigável. |
| `status` | enum | `draft`, `sent`, `accepted`, `rejected`, `expired`. |
| `client_snapshot` | json | Dados do cliente no momento da emissão. |
| `line_items` | json | Itens e preços congelados. |
| `subtotal` | numeric/integer | Soma antes de descontos/impostos. |
| `discount` | numeric/integer | Desconto. |
| `tax` | numeric/integer | Impostos/taxas. |
| `total` | numeric/integer | Total final. |
| `valid_until` | date | Validade. |
| `accepted_at` | timestamp | Aceite do cliente. |

### `invoices`

Faturas.

| Campo | Tipo sugerido | Observação |
| --- | --- | --- |
| `id` | uuid/string | Chave primária. |
| `company_id` | uuid/string | Isolamento multiempresa. |
| `estimate_id` | uuid/string | Origem opcional. |
| `number` | text | Numeração de fatura. |
| `status` | enum | `draft`, `sent`, `paid`, `overdue`, `cancelled`. |
| `due_date` | date | Vencimento. |
| `paid_at` | timestamp | Data de pagamento. |
| `client_snapshot` | json | Histórico preservado. |
| `line_items` | json | Histórico preservado. |
| `total` | numeric/integer | Total final. |

### `receipts`

Recibos emitidos após pagamento.

| Campo | Tipo sugerido | Observação |
| --- | --- | --- |
| `id` | uuid/string | Chave primária. |
| `company_id` | uuid/string | Isolamento multiempresa. |
| `invoice_id` | uuid/string | Fatura relacionada, se existir. |
| `number` | text | Numeração do recibo. |
| `issued_at` | timestamp | Data de emissão. |
| `amount` | numeric/integer | Valor recebido. |
| `payment_method` | text | Pix, dinheiro, cartão etc. |

### `payments`

Pagamentos parciais ou totais.

| Campo | Tipo sugerido | Observação |
| --- | --- | --- |
| `id` | uuid/string | Chave primária. |
| `company_id` | uuid/string | Isolamento multiempresa. |
| `invoice_id` | uuid/string | Fatura relacionada. |
| `amount` | numeric/integer | Valor. |
| `paid_at` | timestamp | Data do pagamento. |
| `method` | text | Forma de pagamento. |
| `notes` | text | Observações. |

### `activity_logs`

Auditoria.

| Campo | Tipo sugerido | Observação |
| --- | --- | --- |
| `id` | uuid/string | Chave primária. |
| `company_id` | uuid/string | Isolamento multiempresa. |
| `actor_id` | uuid/string | Usuário responsável. |
| `entity_type` | text | Entidade alterada. |
| `entity_id` | uuid/string | ID da entidade. |
| `action` | text | Ação executada. |
| `changes` | json | Diff ou resumo seguro. |
| `created_at` | timestamp | Data do evento. |

## Regras importantes

- Snapshots são obrigatórios em orçamentos, faturas e recibos financeiros.
- Toda escrita deve validar permissões do usuário na empresa ativa.
- Logs não devem armazenar segredos, tokens ou dados sensíveis desnecessários.
- O schema real deve ser confirmado no Firebase/Manus antes de migrations definitivas.
