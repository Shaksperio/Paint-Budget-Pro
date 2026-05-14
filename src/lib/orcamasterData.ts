export type DocumentStatus = 'draft' | 'sent' | 'accepted' | 'paid' | 'overdue';

export type ClientSummary = {
  id: string;
  name: string;
  contact: string;
  city: string;
};

export type EstimateSummary = {
  id: string;
  number: string;
  clientName: string;
  status: DocumentStatus;
  total: number;
  validUntil: string;
};

export type DashboardMetric = {
  label: string;
  value: string;
  helper: string;
  trend: string;
};

export const clients: ClientSummary[] = [
  {
    id: 'cli-001',
    name: 'Condomínio Jardim das Tintas',
    contact: '(11) 98888-1200',
    city: 'São Paulo, SP',
  },
  {
    id: 'cli-002',
    name: 'Marina Costa Arquitetura',
    contact: 'marina@costa.arq.br',
    city: 'Campinas, SP',
  },
  {
    id: 'cli-003',
    name: 'Loja Norte Fachadas',
    contact: '(21) 97777-4500',
    city: 'Rio de Janeiro, RJ',
  },
];

export const estimates: EstimateSummary[] = [
  {
    id: 'est-1048',
    number: 'ORC-1048',
    clientName: 'Condomínio Jardim das Tintas',
    status: 'accepted',
    total: 12840,
    validUntil: '2026-06-08',
  },
  {
    id: 'est-1049',
    number: 'ORC-1049',
    clientName: 'Marina Costa Arquitetura',
    status: 'sent',
    total: 6350,
    validUntil: '2026-06-15',
  },
  {
    id: 'est-1050',
    number: 'ORC-1050',
    clientName: 'Loja Norte Fachadas',
    status: 'draft',
    total: 4320,
    validUntil: '2026-06-20',
  },
];

export const dashboardMetrics: DashboardMetric[] = [
  {
    label: 'Receita prevista',
    value: 'R$ 23.510,00',
    helper: 'Orçamentos aceitos e enviados',
    trend: '+18% no mês',
  },
  {
    label: 'Orçamentos ativos',
    value: '12',
    helper: 'Rascunho, enviados e aceitos',
    trend: '3 aguardando cliente',
  },
  {
    label: 'Clientes cadastrados',
    value: '38',
    helper: 'Base local inicial',
    trend: '+5 novos',
  },
  {
    label: 'Faturas pendentes',
    value: '4',
    helper: 'A receber nos próximos 15 dias',
    trend: 'R$ 8.730,00',
  },
];

export const statusLabels: Record<DocumentStatus, string> = {
  draft: 'Rascunho',
  sent: 'Enviado',
  accepted: 'Aceito',
  paid: 'Pago',
  overdue: 'Vencido',
};
