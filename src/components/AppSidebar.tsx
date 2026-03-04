import { Link, useLocation } from 'react-router-dom';

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

const sections = [
  {
    title: 'NAVEGAÇÃO',
    links: [
      { to: '/dashboard', label: 'Painel' },
      { to: '/', label: 'Orçamento' },
      { to: '/historico', label: 'Histórico' }
    ]
  },
  {
    title: 'CADASTROS',
    links: [
      { to: '/cadastros?tab=produtos', label: 'Produtos' },
      { to: '/cadastros?tab=servicos', label: 'Serviços' },
      { to: '/cadastros?tab=profissionais', label: 'Profissionais' }
    ]
  },
  {
    title: 'FERRAMENTAS',
    links: [
      { to: '/configuracoes', label: 'Tema' },
      { to: '/configuracoes', label: 'QR Code' },
      { to: '/configuracoes', label: 'Configurações' }
    ]
  }
];

export function AppSidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <header className="sidebar-header">
          <h1>PaintBudget Pro</h1>
          <button className="close-sidebar" onClick={onClose} type="button">×</button>
        </header>

        {sections.map((section) => (
          <div key={section.title} className="sidebar-section">
            <p>{section.title}</p>
            {section.links.map((link) => {
              const current = `${location.pathname}${location.search}`;
              const linkPath = link.to.split('?')[0];
              const isActive = current === link.to || (location.pathname === linkPath && !link.to.includes('?')); 
              return (
                <Link key={`${section.title}-${link.label}`} className={isActive ? 'active' : ''} to={link.to} onClick={onClose}>
                  {link.label}
                </Link>
              );
            })}
          </div>
        ))}
      </aside>
      {open ? <button type="button" className="sidebar-overlay" onClick={onClose} /> : null}
    </>
  );
}
