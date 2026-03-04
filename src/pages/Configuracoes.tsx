import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { db } from '../lib/db';

const themes = [
  { id: 'profissional', label: 'Profissional', colors: ['#1f3261', '#ff7a13'] },
  { id: 'oceano', label: 'Oceano', colors: ['#0e7490', '#eab308'] },
  { id: 'floresta', label: 'Floresta', colors: ['#166534', '#f59e0b'] },
  { id: 'por-do-sol', label: 'Pôr do Sol', colors: ['#e11d48', '#f59e0b'] },
  { id: 'real', label: 'Real', colors: ['#5b21b6', '#eab308'] },
  { id: 'elegante', label: 'Elegante', colors: ['#27272a', '#f59e0b'] }
];

export function Configuracoes() {
  const [themeModal, setThemeModal] = useState(false);
  const [qrModal, setQrModal] = useState(false);
  const [activeTheme, setActiveTheme] = useState(localStorage.getItem('paint-theme') || 'profissional');
  const [message, setMessage] = useState('');
  const { data: budgets = [] } = useQuery({ queryKey: ['budgets'], queryFn: () => db.budgets.toArray() });

  const lastBudget = budgets[budgets.length - 1];

  async function clearHistory() {
    await db.budgets.clear();
    setMessage('Histórico de orçamentos limpo com sucesso.');
  }

  async function wipeAllData() {
    await db.delete();
    window.location.reload();
  }

  function pickTheme(themeId: string) {
    setActiveTheme(themeId);
    localStorage.setItem('paint-theme', themeId);
    setThemeModal(false);
    setMessage('Tema atualizado.');
  }

  return (
    <section className="card">
      <h2>⚙️ Configurações</h2>
      <div className="row">
        <button className="btn" onClick={() => setThemeModal(true)}>🎨 Selecionar Tema</button>
        <button className="btn" onClick={() => setQrModal(true)}>🔳 QR Code</button>
      </div>

      <div className="card soft">
        <h3>🗄 Gerenciamento de Dados</h3>
        <p className="muted">Gerencie os dados armazenados localmente</p>
        <button className="btn" onClick={clearHistory}>🗑 Limpar Histórico de Orçamentos</button>
        <button className="btn danger" onClick={wipeAllData}>⚠️ Apagar Todos os Dados</button>
      </div>

      <p className="muted">PaintBudget Pro v1.0 • Dados salvos localmente e sincronizados quando possível</p>
      {message ? <p className="muted">{message}</p> : null}

      {themeModal ? (
        <div className="modal-backdrop" onClick={() => setThemeModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Selecionar Tema</h3>
            <div className="themes-grid">
              {themes.map((theme) => (
                <button key={theme.id} className={`theme-card ${activeTheme === theme.id ? 'selected' : ''}`} onClick={() => pickTheme(theme.id)}>
                  <div className="theme-swatches">
                    <span style={{ background: theme.colors[0] }} />
                    <span style={{ background: theme.colors[1] }} />
                  </div>
                  <strong>{theme.label}</strong>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {qrModal ? (
        <div className="modal-backdrop" onClick={() => setQrModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>QR Code do Orçamento</h3>
            <div className="qr-box">
              <QRCodeSVG value={JSON.stringify(lastBudget ?? { status: 'sem-orcamento' })} size={260} />
            </div>
            <p className="muted">Orçamento: {lastBudget?.numero ?? 'Nenhum orçamento disponível'}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
