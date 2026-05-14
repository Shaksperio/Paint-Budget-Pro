import { Badge } from './components/Badge';
import { Card } from './components/Card';
import { calculateBudgetTotals } from './lib/calculations';

const sampleItems = [
  { description: 'Preparação de superfície', quantity: 48, unitPrice: 8.5 },
  { description: 'Pintura acrílica premium', quantity: 48, unitPrice: 18.75 },
  { description: 'Impermeabilização de área externa', quantity: 16, unitPrice: 42 },
];

const totals = calculateBudgetTotals(sampleItems, 0.05, 0.03);
const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function App() {
  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <Badge tone="success">Build base restaurado</Badge>
          <h1>Paint Budget Pro</h1>
          <p>
            Base React + TypeScript preparada para evoluir módulos de clientes, produtos,
            orçamentos, PDFs e sincronização Supabase com PRs pequenos e revisáveis.
          </p>
        </div>
      </header>

      <section className="grid">
        <Card title="Prioridade imediata">
          <ul className="check-list">
            <li>Documentação técnica versionada</li>
            <li>Configuração de ambiente segura</li>
            <li>Build, typecheck e teste automatizado funcionando</li>
          </ul>
        </Card>

        <Card title="Exemplo de cálculo">
          <dl className="totals">
            <div>
              <dt>Subtotal</dt>
              <dd>{currency.format(totals.subtotal)}</dd>
            </div>
            <div>
              <dt>Desconto</dt>
              <dd>{currency.format(totals.discount)}</dd>
            </div>
            <div>
              <dt>Impostos</dt>
              <dd>{currency.format(totals.tax)}</dd>
            </div>
            <div className="totals__highlight">
              <dt>Total</dt>
              <dd>{currency.format(totals.total)}</dd>
            </div>
          </dl>
        </Card>
      </section>
    </main>
  );
}

export default App;
