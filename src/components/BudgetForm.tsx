import { useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { db } from '../lib/db';
import { cepLookup } from '../lib/cepLookup';
import { exportBudgetPdf } from '../lib/pdfExport';
import { upsertBudgetRemote } from '../lib/supabase';
import type { BudgetData } from '../types/budget';

const formatMoney = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

const emptyBudget = (): BudgetData => ({
  id: crypto.randomUUID(),
  numero: `ORC-${String(Date.now()).slice(-6)}`,
  criadoEm: new Date().toISOString(),
  company: { nome: 'Nome da Empresa', telefone: '', email: '' },
  client: { nome: '', telefone: '', cep: '', endereco: '' },
  itens: [],
  taxaPercentual: 0,
  desconto: 0,
  formaPagamento: '',
  prazoEntrega: '',
  observacoes: ''
});

export function BudgetForm() {
  const [budget, setBudget] = useState<BudgetData>(emptyBudget());
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<BudgetData[]>([]);
  const [syncState, setSyncState] = useState('Sincronização pendente');

  const subtotal = useMemo(
    () => budget.itens.reduce((acc, item) => acc + item.areaM2 * item.demaos * item.precoM2, 0),
    [budget.itens]
  );
  const taxa = subtotal * (budget.taxaPercentual / 100);
  const total = Math.max(subtotal + taxa - budget.desconto, 0);

  useEffect(() => {
    const timer = setTimeout(async () => {
      await db.budgets.put(budget);
      const response = await upsertBudgetRemote(budget);
      setSyncState(response.message);
    }, 350);
    return () => clearTimeout(timer);
  }, [budget]);

  async function openHistory() {
    const budgets = await db.budgets.orderBy('criadoEm').reverse().limit(8).toArray();
    setHistory(budgets);
    setHistoryOpen(true);
  }

  async function buscarCep() {
    const endereco = await cepLookup(budget.client.cep);
    if (endereco) setBudget((prev) => ({ ...prev, client: { ...prev.client, endereco } }));
  }

  return (
    <div className="budget-page">
      <div className="actions-bar">
        <button className="btn btn-primary" onClick={() => exportBudgetPdf(budget, total)}>📄 Gerar PDF</button>
        <button className="btn" onClick={() => window.print()}>🖨 Imprimir</button>
        <button className="btn" onClick={() => setBudget(emptyBudget())}>➕ Novo Orçamento</button>
        <button className="btn" onClick={openHistory}>🕒 Histórico</button>
        <span className="sync-pill">{syncState}</span>
      </div>

      <section className="hero-company">
        <div className="logo-box">LOGO</div>
        <div>
          <h2>{budget.company.nome}</h2>
          <div className="hero-fields">
            <input value={budget.company.telefone} onChange={(e) => setBudget((p) => ({ ...p, company: { ...p.company, telefone: e.target.value } }))} placeholder="Telefone" />
            <input value={budget.company.email} onChange={(e) => setBudget((p) => ({ ...p, company: { ...p.company, email: e.target.value } }))} placeholder="Email" />
          </div>
        </div>
      </section>

      <section className="card">
        <h3>👤 Dados do Cliente</h3>
        <div className="form-grid">
          <input value={budget.client.nome} onChange={(e) => setBudget((p) => ({ ...p, client: { ...p.client, nome: e.target.value } }))} placeholder="Nome do Cliente" />
          <input value={budget.client.telefone} onChange={(e) => setBudget((p) => ({ ...p, client: { ...p.client, telefone: e.target.value } }))} placeholder="Telefone" />
          <input value={budget.client.cep} onBlur={buscarCep} onChange={(e) => setBudget((p) => ({ ...p, client: { ...p.client, cep: e.target.value } }))} placeholder="CEP" />
          <input value={budget.client.endereco} onChange={(e) => setBudget((p) => ({ ...p, client: { ...p.client, endereco: e.target.value } }))} placeholder="Endereço" />
        </div>
      </section>

      <section className="card">
        <h3>📄 Informações do Orçamento</h3>
        <div className="form-grid">
          <input value={budget.numero} onChange={(e) => setBudget((p) => ({ ...p, numero: e.target.value }))} placeholder="Nº do Orçamento" />
          <input type="date" value={budget.criadoEm.slice(0, 10)} onChange={(e) => setBudget((p) => ({ ...p, criadoEm: `${e.target.value}T00:00:00.000Z` }))} />
          <input placeholder="Prazo de Entrega (dias)" value={budget.prazoEntrega} onChange={(e) => setBudget((p) => ({ ...p, prazoEntrega: e.target.value }))} />
          <input placeholder="Meio de Pagamento" value={budget.formaPagamento} onChange={(e) => setBudget((p) => ({ ...p, formaPagamento: e.target.value }))} />
        </div>
      </section>

      <section className="card">
        <h3>🧾 Itens do Orçamento</h3>
        <button className="btn btn-accent" onClick={() => setBudget((p) => ({ ...p, itens: [...p.itens, { id: crypto.randomUUID(), descricao: '', areaM2: 0, tipoTinta: '', demaos: 1, precoM2: 0 }] }))}>+ Adicionar Item</button>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Descrição</th><th>Área (m²)</th><th>Tipo de Tinta</th><th>Demãos</th><th>Preço/m²</th><th>Total</th></tr></thead>
            <tbody>
              {budget.itens.length === 0 ? <tr><td colSpan={6} className="empty">Nenhum item adicionado. Clique em “Adicionar Item”.</td></tr> : null}
              {budget.itens.map((item) => (
                <tr key={item.id}>
                  <td><input value={item.descricao} onChange={(e) => setBudget((p) => ({ ...p, itens: p.itens.map((x) => x.id === item.id ? { ...x, descricao: e.target.value } : x) }))} /></td>
                  <td><input type="number" value={item.areaM2} onChange={(e) => setBudget((p) => ({ ...p, itens: p.itens.map((x) => x.id === item.id ? { ...x, areaM2: Number(e.target.value) } : x) }))} /></td>
                  <td><input value={item.tipoTinta} onChange={(e) => setBudget((p) => ({ ...p, itens: p.itens.map((x) => x.id === item.id ? { ...x, tipoTinta: e.target.value } : x) }))} /></td>
                  <td><input type="number" value={item.demaos} onChange={(e) => setBudget((p) => ({ ...p, itens: p.itens.map((x) => x.id === item.id ? { ...x, demaos: Number(e.target.value) } : x) }))} /></td>
                  <td><input type="number" value={item.precoM2} onChange={(e) => setBudget((p) => ({ ...p, itens: p.itens.map((x) => x.id === item.id ? { ...x, precoM2: Number(e.target.value) } : x) }))} /></td>
                  <td>{formatMoney(item.areaM2 * item.demaos * item.precoM2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h3>🧰 Lista de Materiais</h3>
        <p className="muted">Cadastre produtos primeiro para montar os materiais vinculados ao orçamento.</p>
      </section>

      <section className="card">
        <h3>👷 Profissional Executor</h3>
        <p className="muted">Nenhum profissional cadastrado. Cadastre profissionais primeiro.</p>
      </section>

      <section className="card">
        <h3>📷 Fotos do Serviço (Antes)</h3>
        <button className="btn btn-accent">📸 Adicionar Fotos</button>
        <p className="muted">Nenhuma foto adicionada.</p>
      </section>

      <section className="card">
        <h3>Observações</h3>
        <textarea rows={4} value={budget.observacoes} onChange={(e) => setBudget((p) => ({ ...p, observacoes: e.target.value }))} placeholder="Condições de pagamento, prazo de execução, garantias..." />
      </section>

      <section className="card summary-card">
        <div><span>Subtotal</span><strong>{formatMoney(subtotal)}</strong></div>
        <div>
          <span>Impostos</span>
          <div className="tax-inline">
            <input type="number" value={budget.taxaPercentual} onChange={(e) => setBudget((p) => ({ ...p, taxaPercentual: Number(e.target.value) }))} />%
            <strong>{formatMoney(taxa)}</strong>
          </div>
        </div>
        <div><span>Desconto</span><input type="number" value={budget.desconto} onChange={(e) => setBudget((p) => ({ ...p, desconto: Number(e.target.value) }))} /></div>
        <div className="total-line"><span>Total</span><strong>{formatMoney(total)}</strong></div>
      </section>

      <footer className="budget-footer">
        <p>Orçamento gerado por PaintBudget Pro</p>
        <QRCodeSVG value={JSON.stringify({ numero: budget.numero, total, cliente: budget.client.nome })} size={72} />
      </footer>

      {historyOpen ? (
        <div className="modal-backdrop" onClick={() => setHistoryOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>🕒 Histórico de Orçamentos</h3>
              <button type="button" className="btn" onClick={() => setHistoryOpen(false)}>✕</button>
            </div>
            {history.length === 0 ? <p className="muted">Nenhum orçamento salvo ainda. Use “Novo Orçamento”.</p> : null}
            {history.map((saved) => (
              <button key={saved.id} className="history-item" type="button" onClick={() => { setBudget(saved); setHistoryOpen(false); }}>
                <strong>{saved.numero}</strong>
                <span>{saved.client.nome || 'Cliente não informado'} • {new Date(saved.criadoEm).toLocaleDateString('pt-BR')}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
