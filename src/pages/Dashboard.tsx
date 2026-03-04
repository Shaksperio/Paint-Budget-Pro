import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { db } from '../lib/db';

export function Dashboard() {
  const { data: budgets = [] } = useQuery({ queryKey: ['budgets'], queryFn: () => db.budgets.toArray() });

  const total = budgets.reduce((acc, b) => acc + b.itens.reduce((s, i) => s + i.areaM2 * i.demaos * i.precoM2, 0), 0);
  const monthly = budgets.map((b) => ({ mes: new Date(b.criadoEm).toLocaleDateString('pt-BR', { month: 'short' }), valor: b.itens.reduce((s, i) => s + i.areaM2 * i.demaos * i.precoM2, 0) }));

  return (
    <section className="grid">
      <div className="card"><h2>Total orçamentos</h2><p>{budgets.length}</p></div>
      <div className="card"><h2>Valor total</h2><p>R$ {total.toFixed(2)}</p></div>
      <div className="card"><h2>Ticket médio</h2><p>R$ {(total / Math.max(budgets.length, 1)).toFixed(2)}</p></div>

      <div className="card chart">
        <h3>Orçamentos por mês</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthly}><XAxis dataKey="mes" /><YAxis /><Tooltip /><Bar dataKey="valor" fill="#2563eb" /></BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card chart">
        <h3>Distribuição (amostra)</h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={[{ name: 'Pintura', value: 70 }, { name: 'Impermeabilização', value: 30 }]} dataKey="value" cx="50%" cy="50%" outerRadius={80} fill="#0ea5e9" />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
