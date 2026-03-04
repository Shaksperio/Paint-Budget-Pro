import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { AppSidebar } from './components/AppSidebar';
import { AuthGate } from './components/AuthGate';
import { BudgetForm } from './components/BudgetForm';
import { Cadastros } from './pages/Cadastros';
import { Configuracoes } from './pages/Configuracoes';
import { Dashboard } from './pages/Dashboard';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGate>
      <div className="layout">
        <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="content">
          <button type="button" className="menu-fab" onClick={() => setSidebarOpen(true)}>☰</button>
          <Routes>
            <Route path="/" element={<BudgetForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cadastros" element={<Cadastros />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="/historico" element={<BudgetForm />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <SpeedInsights />
    </AuthGate>
  );
}
