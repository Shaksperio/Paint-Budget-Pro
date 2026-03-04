import { FormEvent, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { db } from '../lib/db';
import { upsertProductRemote, upsertProfessionalRemote, upsertServiceRemote } from '../lib/supabase';
import { searchLeroy, searchSinapi } from '../lib/search/externalSearch';
import type { LeroyProductResult, SinapiCategory, SinapiServiceResult } from '../lib/search/types';

export function Cadastros() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') || 'produtos');
  const [syncFeedback, setSyncFeedback] = useState('');

  const [leroyTerm, setLeroyTerm] = useState('');
  const [leroyResults, setLeroyResults] = useState<LeroyProductResult[]>([]);
  const [sinapiMode, setSinapiMode] = useState<'manual' | 'sinapi'>('manual');
  const [sinapiQuery, setSinapiQuery] = useState('');
  const [sinapiCategory, setSinapiCategory] = useState<SinapiCategory>('todos');
  const [sinapiResults, setSinapiResults] = useState<SinapiServiceResult[]>([]);
  const [sinapiCacheInfo, setSinapiCacheInfo] = useState('');

  useEffect(() => {
    const fromQuery = searchParams.get('tab');
    if (fromQuery) setTab(fromQuery);
  }, [searchParams]);

  const { data: products = [], refetch: refetchProducts } = useQuery({ queryKey: ['products'], queryFn: () => db.products.toArray() });
  const { data: services = [], refetch: refetchServices } = useQuery({ queryKey: ['services'], queryFn: () => db.services.toArray() });
  const { data: professionals = [], refetch: refetchProfessionals } = useQuery({ queryKey: ['professionals'], queryFn: () => db.professionals.toArray() });

  const [productForm, setProductForm] = useState({ nome: '', marca: '', tipo: 'Tinta Acrílica', unidade: 'litro', preco: 0 });
  const [serviceForm, setServiceForm] = useState<{ nome: string; precoBase: number; tempoEstimado: string; descricao: string; categoria: 'pintura' | 'impermeabilizacao' }>({
    nome: '', precoBase: 0, tempoEstimado: '', descricao: '', categoria: 'pintura'
  });
  const [professionalForm, setProfessionalForm] = useState({ nome: '', telefone: '', email: '', especialidade: 'Pintor', valorHora: 0 });

  function feedback(entity: string, remoteMessage: string) {
    if (remoteMessage === 'Sincronizado com Supabase') return `${entity} salvo e sincronizado.`;
    if (remoteMessage.includes('Dados salvos localmente')) return `${entity} salvo localmente. Sincronização remota indisponível.`;
    return `${entity} salvo localmente. A sincronização remota será tentada novamente.`;
  }

  async function addProduct(event: FormEvent) {
    event.preventDefault();
    const product = { id: crypto.randomUUID(), ...productForm, preco: Number(productForm.preco) };
    await db.products.add(product);
    const remote = await upsertProductRemote(product);
    setSyncFeedback(feedback('Produto', remote.message));
    setProductForm({ nome: '', marca: '', tipo: 'Tinta Acrílica', unidade: 'litro', preco: 0 });
    refetchProducts();
  }

  async function addService(event: FormEvent) {
    event.preventDefault();
    const service = { id: crypto.randomUUID(), ...serviceForm, precoBase: Number(serviceForm.precoBase) };
    await db.services.add(service);
    const remote = await upsertServiceRemote(service);
    setSyncFeedback(feedback('Serviço', remote.message));
    setServiceForm({ nome: '', precoBase: 0, tempoEstimado: '', descricao: '', categoria: 'pintura' });
    refetchServices();
  }

  async function addProfessional(event: FormEvent) {
    event.preventDefault();
    const professional = { id: crypto.randomUUID(), ...professionalForm, valorHora: Number(professionalForm.valorHora) };
    await db.professionals.add(professional);
    const remote = await upsertProfessionalRemote(professional);
    setSyncFeedback(feedback('Profissional', remote.message));
    setProfessionalForm({ nome: '', telefone: '', email: '', especialidade: 'Pintor', valorHora: 0 });
    refetchProfessionals();
  }

  async function handleLeroySearch() {
    const response = await searchLeroy(leroyTerm);
    setLeroyResults(response.data);
    setSyncFeedback(response.source === 'remote' ? 'Busca Leroy concluída.' : 'Busca Leroy com fallback/sem resultado remoto.');
  }

  async function handleSinapiSearch() {
    const response = await searchSinapi(sinapiQuery, sinapiCategory);
    setSinapiResults(response.data);
    setSinapiCacheInfo(response.source === 'cache' ? 'Resultados do cache (30 min).' : response.source === 'remote' ? 'Resultados atualizados da busca externa.' : 'Resultados de fallback da base interna.');
  }

  async function useLeroyProduct(item: LeroyProductResult) {
    const product = {
      id: crypto.randomUUID(),
      nome: item.nome,
      marca: item.marca,
      preco: item.preco,
      unidade: 'un',
      tipo: item.tipo
    };
    await db.products.add(product);
    const remote = await upsertProductRemote(product);
    setSyncFeedback(feedback('Produto', remote.message));
    refetchProducts();
  }

  async function useSinapiService(item: SinapiServiceResult) {
    const service = {
      id: crypto.randomUUID(),
      nome: `[SINAPI ${item.codigo}] ${item.descricao}`,
      categoria: item.categoria,
      precoBase: item.preco,
      tempoEstimado: '',
      descricao: `Unidade: ${item.unidade}`
    } as const;
    await db.services.add(service);
    const remote = await upsertServiceRemote(service);
    setSyncFeedback(feedback('Serviço', remote.message));
    refetchServices();
  }

  return (
    <section className="card">
      <h2>Cadastros</h2>
      <div className="row">
        <button type="button" className={`btn ${tab === 'produtos' ? 'btn-primary' : ''}`} onClick={() => setTab('produtos')}>📦 Produtos</button>
        <button type="button" className={`btn ${tab === 'servicos' ? 'btn-primary' : ''}`} onClick={() => setTab('servicos')}>🛠 Serviços</button>
        <button type="button" className={`btn ${tab === 'profissionais' ? 'btn-primary' : ''}`} onClick={() => setTab('profissionais')}>👥 Profissionais</button>
      </div>
      {syncFeedback ? <p className="muted">{syncFeedback}</p> : null}

      {tab === 'produtos' ? (
        <div className="card soft">
          <h3>📦 Cadastro de Produtos</h3>
          <div className="card tint">
            <h4>Buscar na Leroy Merlin</h4>
            <div className="row">
              <input placeholder="Digite o nome do produto..." value={leroyTerm} onChange={(e) => setLeroyTerm(e.target.value)} />
              <button type="button" className="btn btn-accent" onClick={handleLeroySearch}>🔎 Buscar</button>
            </div>
            <div className="stack">
              {leroyResults.map((item) => (
                <button type="button" key={item.sku} className="history-item" onClick={() => useLeroyProduct(item)}>
                  <strong>{item.nome}</strong>
                  <span>{item.marca} • R$ {item.preco.toFixed(2)} • SKU {item.sku}</span>
                </button>
              ))}
            </div>
          </div>

          <form className="form-grid" onSubmit={addProduct}>
            <input placeholder="Nome do Produto" value={productForm.nome} onChange={(e) => setProductForm((s) => ({ ...s, nome: e.target.value }))} required />
            <input placeholder="Marca" value={productForm.marca} onChange={(e) => setProductForm((s) => ({ ...s, marca: e.target.value }))} required />
            <input placeholder="Tipo" value={productForm.tipo} onChange={(e) => setProductForm((s) => ({ ...s, tipo: e.target.value }))} />
            <input placeholder="Unidade" value={productForm.unidade} onChange={(e) => setProductForm((s) => ({ ...s, unidade: e.target.value }))} />
            <input type="number" placeholder="Preço/unidade" value={productForm.preco} onChange={(e) => setProductForm((s) => ({ ...s, preco: Number(e.target.value) }))} required />
            <button className="btn btn-accent" type="submit">+ Adicionar Produto</button>
          </form>
          <p><strong>Produtos Cadastrados ({products.length})</strong></p>
          {products.length === 0 ? <p className="muted">Nenhum produto cadastrado</p> : (
            <ul>{products.map((item) => <li key={item.id}>{item.nome} • {item.marca} • R$ {item.preco.toFixed(2)}</li>)}</ul>
          )}
        </div>
      ) : null}

      {tab === 'servicos' ? (
        <div className="card soft">
          <h3>🛠 Cadastro de Serviços</h3>
          <div className="row">
            <button type="button" className={`btn ${sinapiMode === 'manual' ? 'btn-primary' : ''}`} onClick={() => setSinapiMode('manual')}>Cadastro Manual</button>
            <button type="button" className={`btn ${sinapiMode === 'sinapi' ? 'btn-primary' : ''}`} onClick={() => setSinapiMode('sinapi')}>Buscar SINAPI</button>
          </div>

          {sinapiMode === 'manual' ? (
            <form className="form-grid" onSubmit={addService}>
              <input placeholder="Nome do Serviço" value={serviceForm.nome} onChange={(e) => setServiceForm((s) => ({ ...s, nome: e.target.value }))} required />
              <input type="number" placeholder="Preço por m²" value={serviceForm.precoBase} onChange={(e) => setServiceForm((s) => ({ ...s, precoBase: Number(e.target.value) }))} required />
              <input placeholder="Tempo estimado (ex: 2-3 dias)" value={serviceForm.tempoEstimado} onChange={(e) => setServiceForm((s) => ({ ...s, tempoEstimado: e.target.value }))} />
              <textarea placeholder="Descrição do serviço" value={serviceForm.descricao} onChange={(e) => setServiceForm((s) => ({ ...s, descricao: e.target.value }))} rows={3} />
              <button className="btn btn-accent" type="submit">+ Adicionar Serviço</button>
            </form>
          ) : (
            <div className="card tint">
              <h4>Buscar Preços SINAPI</h4>
              <input placeholder="Ex: pintura acrílica, manta asfáltica..." value={sinapiQuery} onChange={(e) => setSinapiQuery(e.target.value)} />
              <div className="row">
                <select value={sinapiCategory} onChange={(e) => setSinapiCategory(e.target.value as SinapiCategory)}>
                  <option value="todos">Todas</option>
                  <option value="pintura">Pintura</option>
                  <option value="impermeabilizacao">Impermeabilização</option>
                </select>
                <button type="button" className="btn btn-accent" onClick={handleSinapiSearch}>🔎 Buscar</button>
              </div>
              {sinapiCacheInfo ? <p className="muted">{sinapiCacheInfo}</p> : null}
              <div className="stack">
                {sinapiResults.map((item) => (
                  <button type="button" key={`${item.codigo}-${item.descricao}`} className="history-item" onClick={() => useSinapiService(item)}>
                    <strong>[SINAPI {item.codigo}] {item.descricao}</strong>
                    <span>{item.categoria} • R$ {item.preco.toFixed(2)} / {item.unidade} • fonte: {item.fonte}</span>
                  </button>
                ))}
                {sinapiResults.length === 0 ? <p className="muted">Nenhum resultado. Tente outro termo.</p> : null}
              </div>
            </div>
          )}

          <p><strong>Serviços Cadastrados ({services.length})</strong></p>
          {services.length === 0 ? <p className="muted">Nenhum serviço cadastrado</p> : (
            <ul>{services.map((item) => <li key={item.id}>{item.nome} • R$ {item.precoBase.toFixed(2)}/m²</li>)}</ul>
          )}
        </div>
      ) : null}

      {tab === 'profissionais' ? (
        <div className="card soft">
          <h3>👥 Cadastro de Profissionais</h3>
          <form className="form-grid" onSubmit={addProfessional}>
            <input placeholder="Nome Completo" value={professionalForm.nome} onChange={(e) => setProfessionalForm((s) => ({ ...s, nome: e.target.value }))} required />
            <input placeholder="Telefone" value={professionalForm.telefone} onChange={(e) => setProfessionalForm((s) => ({ ...s, telefone: e.target.value }))} required />
            <input placeholder="Email" type="email" value={professionalForm.email} onChange={(e) => setProfessionalForm((s) => ({ ...s, email: e.target.value }))} />
            <input placeholder="Especialidade" value={professionalForm.especialidade} onChange={(e) => setProfessionalForm((s) => ({ ...s, especialidade: e.target.value }))} />
            <input type="number" placeholder="Valor/hora" value={professionalForm.valorHora} onChange={(e) => setProfessionalForm((s) => ({ ...s, valorHora: Number(e.target.value) }))} />
            <button className="btn btn-accent" type="submit">+ Adicionar Profissional</button>
          </form>
          {professionals.length === 0 ? <p className="muted">Nenhum profissional cadastrado</p> : (
            <ul>{professionals.map((item) => <li key={item.id}>{item.nome} • {item.especialidade} • R$ {item.valorHora.toFixed(2)}/h</li>)}</ul>
          )}
        </div>
      ) : null}
    </section>
  );
}
