# Design system do OrçaMaster

## Objetivo

Definir uma identidade visual própria para o OrçaMaster antes de evoluir telas complexas. Este documento não implementa componentes; ele orienta futuros PRs de UI.

## Princípios

- Profissional, claro e confiável para documentos financeiros.
- Mobile-first.
- Acessível por teclado e leitores de tela.
- Feedback claro para estados de orçamento, fatura, recibo e sincronização.
- Componentes reutilizáveis e consistentes.

## Componentes planejados

- Button.
- Input.
- Select.
- Textarea.
- Card.
- Modal/Dialog.
- Table.
- Badge/StatusTag.
- Toast/Alert.
- EmptyState.
- PageHeader.
- Sidebar.
- Layout autenticado.
- PDF template blocks.

## Tokens planejados

- Cores primárias, secundárias e neutras.
- Estados: sucesso, alerta, erro, informação, vencido e pago.
- Tipografia para telas e documentos PDF.
- Espaçamento.
- Raios.
- Sombras.
- Breakpoints.

## Estados financeiros sugeridos

| Estado | Uso |
| --- | --- |
| `draft` | Documento em rascunho. |
| `sent` | Documento enviado ao cliente. |
| `accepted` | Orçamento aceito. |
| `rejected` | Orçamento recusado. |
| `paid` | Fatura paga. |
| `overdue` | Fatura vencida. |
| `cancelled` | Documento cancelado. |

## Próximo PR de design

O design system deve ser implementado somente depois da auditoria inicial e da organização técnica mínima. O primeiro PR de design deve criar tokens e componentes básicos sem reescrever telas de negócio.
