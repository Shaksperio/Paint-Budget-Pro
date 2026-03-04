import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { db } from '../lib/db';

export function AuthGate({ children }: { children: ReactNode }) {
  const [isAuth, setIsAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setIsAuth(Boolean(localStorage.getItem('paint-budget-session')));
  }, []);

  async function login(event: FormEvent) {
    event.preventDefault();
    let user = await db.users.where('email').equals(email).first();
    if (!user) {
      await db.users.add({ id: crypto.randomUUID(), email, nome: email.split('@')[0], password });
      user = await db.users.where('email').equals(email).first();
    }
    if (user?.password === password) {
      localStorage.setItem('paint-budget-session', user.id);
      setIsAuth(true);
    } else {
      alert('Senha inválida');
    }
  }

  if (isAuth) return <>{children}</>;

  return (
    <main className="login-wrap">
      <form className="card" onSubmit={login}>
        <h2>Acesso ao sistema</h2>
        <p>Entre com e-mail/senha. Primeiro acesso cria usuário local no banco IndexedDB.</p>
        <input type="email" required placeholder="email@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" required placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Entrar</button>
      </form>
    </main>
  );
}
