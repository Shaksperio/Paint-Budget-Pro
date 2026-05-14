import { Badge } from './components/Badge';
import { Button } from './components/Button';
import { Card } from './components/Card';
import {
  clients,
  dashboardMetrics,
  estimates,
  statusLabels,
  type DocumentStatus,
} from './lib/orcamasterData';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const statusTone: Record<DocumentStatus, 'success' | 'warning' | 'info' | 'danger' | 'neutral'> = {
  accepted: 'success',
  draft: 'neutral',
  overdue: 'danger',
  paid: 'success',
  sent: 'info',
};

const navigationItems = [
  'Dashboard',
  'Clientes',
  'Produtos e serviços',
  'Orçamentos',
  'Faturas',
  'Recibos',
  'Relatórios',
  'Configurações',
];

function App() {
  return (
    <div className="orcamaster-app">
      <aside className="sidebar" aria-label="Navegação principal">
        <div className="brand">
          <span className="brand__mark">OM</span>
          <div>
            <strong>OrçaMaster</strong>
            <small>Gestão financeira</small>
          </div>
        </div>

        <nav className="sidebar__nav">
          {navigationItems.map((item) => (
            <a className={item === 'Dashboard' ? 'is-active' : ''} href={`#${item}`} key={item}>
              {item}
            </a>
          ))}
        </nav>

        <div className="sidebar__status">
          <Badge tone="success">Base local ativa</Badge>
          <p>Firebase fallback e autenticação serão conectados nos próximos PRs.</p>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <Badge tone="info">Recriação iniciada</Badge>
            <h1>Dashboard operacional</h1>
            <p>
              Primeiro shell do OrçaMaster com navegação, KPIs, clientes e orçamentos simulados
              para guiar a reconstrução dos módulos reais.
            </p>
          </div>
          <div className="topbar__actions">
            <Button variant="secondary">Importar dados</Button>
            <Button>Novo orçamento</Button>
          </div>
        </header>

        <section className="metrics-grid" aria-label="Indicadores principais">
          {dashboardMetrics.map((metric) => (
            <Card className="metric-card" eyebrow={metric.helper} key={metric.label} title={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.trend}</span>
            </Card>
          ))}
        </section>

        <section className="content-grid">
          <Card className="panel panel--wide" eyebrow="Pipeline comercial" title="Orçamentos recentes">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Número</th>
                    <th>Cliente</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Validade</th>
                  </tr>
                </thead>
                <tbody>
                  {estimates.map((estimate) => (
                    <tr key={estimate.id}>
                      <td>{estimate.number}</td>
                      <td>{estimate.clientName}</td>
                      <td>
                        <Badge tone={statusTone[estimate.status]}>{statusLabels[estimate.status]}</Badge>
                      </td>
                      <td>{currency.format(estimate.total)}</td>
                      <td>{new Date(estimate.validUntil).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="panel" eyebrow="CRM inicial" title="Clientes prioritários">
            <div className="client-list">
              {clients.map((client) => (
                <article className="client-list__item" key={client.id}>
                  <div>
                    <strong>{client.name}</strong>
                    <span>{client.city}</span>
                  </div>
                  <small>{client.contact}</small>
                </article>
              ))}
            </div>
          </Card>
        </section>

        <section className="next-steps">
          <Card eyebrow="Próximo PR" title="Sequência recomendada">
            <ol className="timeline">
              <li>Conectar rotas reais e layout autenticado.</li>
              <li>Criar camada de serviços para dados locais/Firebase.</li>
              <li>Implementar CRUD de clientes preservando testes e build.</li>
            </ol>
          </Card>
        </section>
      </main>
    </div>
  );
}

export default App;
